import { query } from './db.js'
import { buildMeetingForBooking } from './video.js'

const TZ = 'America/Sao_Paulo'
const MIN_LEAD_MS = 2 * 3600 * 1000
const HORIZON_MS = 14 * 86400000

export async function listRules() {
  const { rows } = await query(
    `select * from availability_rules where active = true order by weekday`
  )
  return rows
}

export async function listBusy(fromIso, toIso) {
  const { rows } = await query(
    `
    select starts_at, ends_at from bookings
    where status in ('pending', 'confirmed')
      and starts_at < $2 and ends_at > $1
    union all
    select starts_at, ends_at from availability_blocks
    where starts_at < $2 and ends_at > $1
    `,
    [fromIso, toIso]
  )
  return rows
}

function localParts(iso) {
  const d = new Date(iso)
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  })
  const parts = Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]))
  const weekdayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
  return {
    weekday: weekdayMap[parts.weekday] || 1,
    minute: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

export async function createBooking({ startsAt, name, email, whatsapp, topic }) {
  const start = new Date(startsAt)
  if (Number.isNaN(start.getTime())) throw new Error('HORARIO: inválido')
  if (start.getTime() < Date.now() + MIN_LEAD_MS) {
    throw new Error('ANTECEDENCIA: agende com pelo menos 2 horas de antecedência')
  }
  if (start.getTime() > Date.now() + HORIZON_MS) {
    throw new Error('HORIZONTE: agendamentos apenas nos próximos 14 dias')
  }
  if (!name || String(name).trim().length < 2) throw new Error('NOME: informe seu nome')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) throw new Error('EMAIL: informe um e-mail válido')
  if (String(whatsapp || '').replace(/\D/g, '').length < 10) {
    throw new Error('WHATSAPP: informe um número válido')
  }

  const { weekday, minute } = localParts(startsAt)
  const { rows: rules } = await query(
    `select * from availability_rules where weekday = $1 and active = true limit 1`,
    [weekday]
  )
  const rule = rules[0]
  if (!rule) throw new Error('DIA: indisponível neste dia da semana')

  const slot = rule.slot_minutes
  if (minute < rule.start_minute || minute + slot > rule.end_minute) {
    throw new Error('HORARIO: fora da janela 17h–22h')
  }
  if ((minute - rule.start_minute) % slot !== 0) throw new Error('SLOT: horário inválido')

  const endsAt = new Date(start.getTime() + slot * 60000).toISOString()
  const emailNorm = String(email).trim().toLowerCase()

  const { rows: dup } = await query(
    `
    select id from bookings
    where status in ('pending', 'confirmed')
      and client_email = $1
      and starts_at > now()
    limit 1
    `,
    [emailNorm]
  )
  if (dup.length) throw new Error('DUPLICADO: você já possui um agendamento ativo com este e-mail')

  try {
    const { rows } = await query(
      `
      insert into bookings (
        starts_at, ends_at, client_name, client_email, client_whatsapp, topic, status
      ) values ($1,$2,$3,$4,$5,$6,'pending')
      returning *
      `,
      [
        start.toISOString(),
        endsAt,
        String(name).trim(),
        emailNorm,
        String(whatsapp).trim(),
        topic ? String(topic).trim() : null,
      ]
    )
    return rows[0]
  } catch (e) {
    if (e.code === '23P01') throw new Error('OCUPADO: este horário acabou de ser reservado')
    throw e
  }
}

export async function listBookings({ fromIso } = {}) {
  if (fromIso) {
    const { rows } = await query(
      `select * from bookings where starts_at >= $1 order by starts_at asc`,
      [fromIso]
    )
    return rows
  }
  const { rows } = await query(`select * from bookings order by starts_at asc`)
  return rows
}

export async function getBooking(id) {
  const { rows } = await query(`select * from bookings where id = $1`, [id])
  return rows[0] || null
}

export async function updateBooking(id, patch) {
  const allowed = ['status', 'meeting_url', 'meeting_room', 'admin_notes', 'topic']
  const fields = []
  const values = []
  let i = 1
  for (const key of allowed) {
    if (patch[key] !== undefined) {
      fields.push(`${key} = $${i++}`)
      values.push(patch[key])
    }
  }
  if (!fields.length) throw new Error('Nada para atualizar')
  values.push(id)
  const { rows } = await query(
    `update bookings set ${fields.join(', ')} where id = $${i} returning *`,
    values
  )
  return rows[0] || null
}

/** Confirma e gera sala Vintage (Jitsi embutida em /call/:id) */
export async function confirmWithRoom(id) {
  const booking = await getBooking(id)
  if (!booking) throw new Error('Agendamento não encontrado')
  const meeting = buildMeetingForBooking(id)
  return updateBooking(id, {
    status: 'confirmed',
    meeting_url: meeting.meeting_url,
    meeting_room: meeting.meeting_room,
  })
}
