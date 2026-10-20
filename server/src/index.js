import 'dotenv/config'
import http from 'http'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool, query } from './db.js'
import {
  listRules,
  listBusy,
  createBooking,
  listBookings,
  getBooking,
  updateBooking,
  confirmWithRoom,
  createInstantCall,
  createAdminBooking,
} from './bookings.js'
import { buildMeetingForBooking, publicSiteUrl } from './video.js'
import { attachRtcSignaling, iceServersFromEnv } from './rtc.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT || 8787)
const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@vintagedevstack.com.br').toLowerCase()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_NAME = process.env.ADMIN_NAME || 'Marcos Padilha'

if (!JWT_SECRET || JWT_SECRET.length < 16) {
  throw new Error('JWT_SECRET obrigatório (mín. 16 caracteres) — defina no .env')
}
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
  throw new Error('ADMIN_PASSWORD obrigatório (mín. 8 caracteres) — defina no .env')
}

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Não autenticado' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

async function ensureSchemaAndAdmin() {
  const sqlPath = path.join(__dirname, '../sql/agenda_vps.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  await pool.query(sql)

  const { rows } = await query(`select id from admins where email = $1`, [ADMIN_EMAIL])
  if (!rows.length) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await query(
      `insert into admins (email, password_hash, full_name) values ($1,$2,$3)`,
      [ADMIN_EMAIL, hash, ADMIN_NAME]
    )
    console.log(`[agenda] admin criado: ${ADMIN_EMAIL}`)
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await query('select 1')
    res.json({
      ok: true,
      site: publicSiteUrl(),
      video: 'webrtc-p2p',
      rtcPath: '/api/rtc',
    })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

/** Config pública da call (ICE opcional self-hosted) */
app.get('/api/rtc/config', (_req, res) => {
  res.json({
    path: '/api/rtc',
    maxPeers: 2,
    iceServers: iceServersFromEnv(),
  })
})

app.get('/api/agenda/rules', async (_req, res) => {
  try {
    res.json(await listRules())
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/agenda/busy', async (req, res) => {
  try {
    const from = req.query.from || new Date().toISOString()
    const to = req.query.to || new Date(Date.now() + 15 * 86400000).toISOString()
    res.json(await listBusy(from, to))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/agenda/bookings', async (req, res) => {
  try {
    const body = req.body || {}
    const booking = await createBooking({
      startsAt: body.startsAt || body.starts_at,
      name: body.name || body.client_name,
      email: body.email || body.client_email,
      whatsapp: body.whatsapp || body.client_whatsapp,
      topic: body.topic,
    })
    res.status(201).json(booking)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.get('/api/agenda/bookings/:id', async (req, res) => {
  try {
    const booking = await getBooking(req.params.id)
    if (!booking) return res.status(404).json({ error: 'Não encontrado' })
    // público: só dados necessários para a call
    res.json({
      id: booking.id,
      starts_at: booking.starts_at,
      ends_at: booking.ends_at,
      status: booking.status,
      topic: booking.topic,
      meeting_url: booking.meeting_url,
      meeting_room: booking.meeting_room,
      client_name: booking.client_name,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

function normalizeAdminLogin(raw) {
  const value = String(raw || '').trim().toLowerCase()
  if (!value) return ''
  if (value.includes('@')) return value
  return `${value}@vintagedevstack.com.br`
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = normalizeAdminLogin(req.body?.email || req.body?.username)
    const password = String(req.body?.password || '')
    const { rows } = await query(`select * from admins where email = $1`, [email])
    const admin = rows[0]
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' })
    }
    const token = jwt.sign(
      { sub: admin.id, email: admin.email, name: admin.full_name, is_admin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({
      token,
      user: { id: admin.id, email: admin.email, full_name: admin.full_name, is_admin: true },
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/auth/me', auth, async (req, res) => {
  res.json({
    id: req.user.sub,
    email: req.user.email,
    full_name: req.user.name,
    is_admin: true,
  })
})

app.get('/api/admin/bookings', auth, async (req, res) => {
  try {
    res.json(await listBookings({ fromIso: req.query.from }))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/** Videochamada instantânea (agora) com link Vintage */
app.post('/api/admin/bookings/instant', auth, async (req, res) => {
  try {
    const body = req.body || {}
    const booking = await createInstantCall({
      name: body.name || body.client_name,
      email: body.email || body.client_email,
      whatsapp: body.whatsapp || body.client_whatsapp,
      topic: body.topic,
      durationMinutes: body.durationMinutes || body.duration_minutes || 60,
    })
    res.status(201).json(booking)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

/** Agendar + gerar link (já confirmado com sala) */
app.post('/api/admin/bookings/schedule', auth, async (req, res) => {
  try {
    const body = req.body || {}
    const booking = await createAdminBooking({
      startsAt: body.startsAt || body.starts_at,
      durationMinutes: body.durationMinutes || body.duration_minutes || 30,
      name: body.name || body.client_name,
      email: body.email || body.client_email,
      whatsapp: body.whatsapp || body.client_whatsapp,
      topic: body.topic,
    })
    res.status(201).json(booking)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.patch('/api/admin/bookings/:id', auth, async (req, res) => {
  try {
    const updated = await updateBooking(req.params.id, req.body || {})
    if (!updated) return res.status(404).json({ error: 'Não encontrado' })
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

/** Confirma e cria sala de vídeo Vintage */
app.post('/api/admin/bookings/:id/confirm', auth, async (req, res) => {
  try {
    const updated = await confirmWithRoom(req.params.id)
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

app.post('/api/admin/bookings/:id/room', auth, async (req, res) => {
  try {
    const meeting = buildMeetingForBooking(req.params.id)
    const updated = await updateBooking(req.params.id, {
      meeting_url: meeting.meeting_url,
      meeting_room: meeting.meeting_room,
    })
    if (!updated) return res.status(404).json({ error: 'Não encontrado' })
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

ensureSchemaAndAdmin()
  .then(() => {
    const server = http.createServer(app)
    attachRtcSignaling(server)
    server.listen(PORT, () => {
      console.log(`[agenda-api] listening on :${PORT}`)
    })
  })
  .catch((err) => {
    console.error('[agenda-api] boot failed', err)
    process.exit(1)
  })
