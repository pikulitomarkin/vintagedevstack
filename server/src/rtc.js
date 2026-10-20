/**
 * Sinalização WebRTC 1:1 — 100% no próprio servidor Vintage.
 * Mídia (áudio/vídeo) vai P2P entre os navegadores; este módulo só
 * troca offer/answer/ICE. Sem Jitsi, Daily, Twilio etc.
 */
import { WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'

const MAX_PEERS_PER_ROOM = 2

/** @type {Map<string, Map<string, import('ws').WebSocket>>} */
const rooms = new Map()

function send(ws, msg) {
  if (ws.readyState === 1) ws.send(JSON.stringify(msg))
}

function peerIds(room) {
  return [...(rooms.get(room)?.keys() || [])]
}

function leave(ws) {
  const { roomId, peerId } = ws
  if (!roomId || !peerId) return
  const room = rooms.get(roomId)
  if (!room) return
  room.delete(peerId)
  for (const [, peer] of room) {
    send(peer, { type: 'peer-left', peerId })
  }
  if (room.size === 0) rooms.delete(roomId)
  ws.roomId = null
  ws.peerId = null
}

export function iceServersFromEnv() {
  // 1) ICE_SERVERS JSON completo, ou
  // 2) TURN_HOST + TURN_USER + TURN_PASS (coturn self-hosted na VPS)
  const raw = (process.env.ICE_SERVERS || '').trim()
  if (raw && raw !== '[]') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    } catch {
      /* fall through */
    }
  }

  const host = (process.env.TURN_HOST || '').trim()
  const user = (process.env.TURN_USER || '').trim()
  const pass = (process.env.TURN_PASS || '').trim()
  if (!host || !user || !pass) return []

  return [
    { urls: [`stun:${host}:3478`] },
    {
      urls: [`turn:${host}:3478?transport=udp`, `turn:${host}:3478?transport=tcp`],
      username: user,
      credential: pass,
    },
  ]
}

export function attachRtcSignaling(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/api/rtc' })

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost')
    const roomId = String(url.searchParams.get('room') || '').trim()
    const displayName = String(url.searchParams.get('name') || 'Convidado').slice(0, 64)

    if (!roomId || roomId.length > 80) {
      send(ws, { type: 'error', error: 'Sala inválida' })
      ws.close()
      return
    }

    if (!rooms.has(roomId)) rooms.set(roomId, new Map())
    const room = rooms.get(roomId)

    if (room.size >= MAX_PEERS_PER_ROOM) {
      send(ws, { type: 'error', error: 'Sala cheia (máx. 2 participantes)' })
      ws.close()
      return
    }

    const peerId = randomUUID()
    ws.roomId = roomId
    ws.peerId = peerId
    ws.displayName = displayName
    room.set(peerId, ws)

    send(ws, {
      type: 'welcome',
      peerId,
      roomId,
      iceServers: iceServersFromEnv(),
      peers: [...room.entries()]
        .filter(([id]) => id !== peerId)
        .map(([id, peer]) => ({ peerId: id, name: peer.displayName })),
    })

    for (const [id, peer] of room) {
      if (id === peerId) continue
      send(peer, { type: 'peer-joined', peerId, name: displayName })
    }

    ws.on('message', (raw) => {
      let msg
      try {
        msg = JSON.parse(String(raw))
      } catch {
        return
      }
      const type = msg?.type
      if (!type) return

      if (type === 'ping') {
        send(ws, { type: 'pong' })
        return
      }

      // Relay offer / answer / ice para o outro peer
      if (type === 'offer' || type === 'answer' || type === 'ice') {
        const to = msg.to
        const target = room.get(to)
        if (!target) return
        send(target, {
          type,
          from: peerId,
          sdp: msg.sdp,
          candidate: msg.candidate,
        })
      }
    })

    ws.on('close', () => leave(ws))
    ws.on('error', () => leave(ws))
  })

  console.log('[rtc] WebSocket signaling em /api/rtc (WebRTC P2P, sem provedor externo)')
  return wss
}

export function rtcRoomStats() {
  return [...rooms.entries()].map(([id, peers]) => ({
    room: id,
    peers: peers.size,
    names: [...peers.values()].map((p) => p.displayName),
  }))
}
