/**
 * Cliente WebRTC P2P Vintage — sinalização no próprio backend (/api/rtc).
 */

function rtcWsUrl(roomId, name) {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const q = new URLSearchParams({
    room: roomId,
    name: name || 'Convidado',
  })
  return `${proto}//${window.location.host}/api/rtc?${q}`
}

export function createVintageCall({
  roomId,
  displayName,
  localVideoEl,
  remoteVideoEl,
  onStatus,
  onError,
}) {
  let ws = null
  let pc = null
  let localStream = null
  let peerId = null
  let iceServers = []
  let closed = false
  let makingOffer = false

  const status = (s) => onStatus?.(s)
  const fail = (e) => onError?.(e instanceof Error ? e : new Error(String(e)))

  function send(msg) {
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
  }

  async function ensurePc() {
    if (pc) return pc
    pc = new RTCPeerConnection({ iceServers })
    pc.onicecandidate = (ev) => {
      if (!ev.candidate || !pc._remotePeerId) return
      send({ type: 'ice', to: pc._remotePeerId, candidate: ev.candidate })
    }
    pc.ontrack = (ev) => {
      if (remoteVideoEl) {
        remoteVideoEl.srcObject = ev.streams[0]
      }
      status('conectado')
    }
    pc.onconnectionstatechange = () => {
      const st = pc?.connectionState
      if (st === 'connected') status('conectado')
      else if (st === 'connecting' || st === 'checking') status('conectando…')
      else if (st === 'failed') status('falha na conexão P2P')
      else if (st === 'disconnected') status('desconectado')
    }
    if (localStream) {
      for (const track of localStream.getTracks()) {
        pc.addTrack(track, localStream)
      }
    }
    return pc
  }

  async function startLocalMedia() {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    })
    if (localVideoEl) {
      localVideoEl.srcObject = localStream
      localVideoEl.muted = true
      await localVideoEl.play().catch(() => {})
    }
  }

  async function callPeer(remotePeerId) {
    const conn = await ensurePc()
    conn._remotePeerId = remotePeerId
    makingOffer = true
    try {
      const offer = await conn.createOffer()
      await conn.setLocalDescription(offer)
      send({ type: 'offer', to: remotePeerId, sdp: conn.localDescription })
    } finally {
      makingOffer = false
    }
  }

  async function onOffer(from, sdp) {
    const conn = await ensurePc()
    conn._remotePeerId = from
    await conn.setRemoteDescription(sdp)
    const answer = await conn.createAnswer()
    await conn.setLocalDescription(answer)
    send({ type: 'answer', to: from, sdp: conn.localDescription })
  }

  async function onAnswer(sdp) {
    if (!pc) return
    await pc.setRemoteDescription(sdp)
  }

  async function onIce(from, candidate) {
    const conn = await ensurePc()
    if (!conn._remotePeerId) conn._remotePeerId = from
    if (candidate) await conn.addIceCandidate(candidate).catch(() => {})
  }

  function connectSignaling() {
    status('entrando na sala…')
    ws = new WebSocket(rtcWsUrl(roomId, displayName))
    ws.onopen = () => status('sala aberta — aguardando outro participante')
    ws.onerror = () => fail(new Error('Falha no sinal WebSocket'))
    ws.onclose = () => {
      if (!closed) status('sinalização encerrada')
    }
    ws.onmessage = async (ev) => {
      let msg
      try {
        msg = JSON.parse(ev.data)
      } catch {
        return
      }
      try {
        if (msg.type === 'welcome') {
          peerId = msg.peerId
          iceServers = Array.isArray(msg.iceServers) ? msg.iceServers : []
          if (msg.peers?.length) {
            // Já há alguém: quem tem o menor id inicia o offer (determinístico)
            const other = msg.peers[0]
            if (peerId < other.peerId) await callPeer(other.peerId)
          }
        } else if (msg.type === 'peer-joined') {
          status(`${msg.name || 'Participante'} entrou`)
          if (peerId && peerId < msg.peerId) await callPeer(msg.peerId)
        } else if (msg.type === 'offer') {
          await onOffer(msg.from, msg.sdp)
        } else if (msg.type === 'answer') {
          await onAnswer(msg.sdp)
        } else if (msg.type === 'ice') {
          await onIce(msg.from, msg.candidate)
        } else if (msg.type === 'peer-left') {
          status('o outro participante saiu')
          if (remoteVideoEl) remoteVideoEl.srcObject = null
          if (pc) {
            pc.close()
            pc = null
          }
        } else if (msg.type === 'error') {
          fail(new Error(msg.error || 'Erro na sala'))
        }
      } catch (e) {
        fail(e)
      }
    }
  }

  async function start() {
    await startLocalMedia()
    connectSignaling()
  }

  function toggleMute() {
    const track = localStream?.getAudioTracks()?.[0]
    if (!track) return false
    track.enabled = !track.enabled
    return !track.enabled
  }

  function toggleCam() {
    const track = localStream?.getVideoTracks()?.[0]
    if (!track) return false
    track.enabled = !track.enabled
    return !track.enabled
  }

  function hangup() {
    closed = true
    try { ws?.close() } catch { /* ignore */ }
    try { pc?.close() } catch { /* ignore */ }
    localStream?.getTracks()?.forEach((t) => t.stop())
    if (localVideoEl) localVideoEl.srcObject = null
    if (remoteVideoEl) remoteVideoEl.srcObject = null
    ws = null
    pc = null
    localStream = null
    status('encerrada')
  }

  return { start, hangup, toggleMute, toggleCam, get makingOffer() { return makingOffer } }
}
