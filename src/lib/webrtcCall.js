/**
 * Cliente WebRTC P2P Vintage — sinalização /api/rtc (própria API).
 * Inclui share de tela e gravação só de áudio (para transcrição depois).
 */

function rtcWsUrl(roomId, name) {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const q = new URLSearchParams({
    room: roomId,
    name: name || 'Convidado',
  })
  return `${proto}//${window.location.host}/api/rtc?${q}`
}

function pickAudioMime() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ]
  for (const t of types) {
    if (window.MediaRecorder?.isTypeSupported?.(t)) return t
  }
  return ''
}

export function createVintageCall({
  roomId,
  displayName,
  localVideoEl,
  remoteVideoEl,
  onStatus,
  onError,
  onPeerName,
  onRecording,
}) {
  let ws = null
  let pc = null
  let localStream = null
  let displayStream = null
  let cameraTrack = null
  let peerId = null
  let iceServers = []
  let closed = false
  let remoteStream = null
  let audioCtx = null
  let mixDest = null
  let recorder = null
  let recordedChunks = []
  let recording = false

  const status = (s) => onStatus?.(s)
  const fail = (e) => onError?.(e instanceof Error ? e : new Error(String(e)))

  function send(msg) {
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
  }

  async function ensurePc() {
    if (pc) return pc
    pc = new RTCPeerConnection({
      iceServers,
      iceCandidatePoolSize: 4,
    })
    pc.onicecandidate = (ev) => {
      if (!ev.candidate || !pc._remotePeerId) return
      send({ type: 'ice', to: pc._remotePeerId, candidate: ev.candidate })
    }
    pc.ontrack = (ev) => {
      remoteStream = ev.streams[0] || new MediaStream([ev.track])
      if (remoteVideoEl) {
        remoteVideoEl.srcObject = remoteStream
        remoteVideoEl.play().catch(() => {})
      }
      // Se já gravando, anexa áudio remoto ao mix
      attachRemoteAudioToMix()
      status('conectado')
    }
    pc.onconnectionstatechange = () => {
      const st = pc?.connectionState
      if (st === 'connected') status('conectado')
      else if (st === 'connecting') status('conectando…')
      else if (st === 'failed') status('falha na conexão — verifique TURN/rede')
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
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    })
    cameraTrack = localStream.getVideoTracks()[0] || null
    if (localVideoEl) {
      localVideoEl.srcObject = localStream
      localVideoEl.muted = true
      await localVideoEl.play().catch(() => {})
    }
  }

  async function callPeer(remotePeerId) {
    const conn = await ensurePc()
    conn._remotePeerId = remotePeerId
    const offer = await conn.createOffer()
    await conn.setLocalDescription(offer)
    send({ type: 'offer', to: remotePeerId, sdp: conn.localDescription })
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
    ws.onopen = () => status('na sala — aguardando participante')
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
            const other = msg.peers[0]
            onPeerName?.(other.name || 'Participante')
            if (peerId < other.peerId) await callPeer(other.peerId)
          }
        } else if (msg.type === 'peer-joined') {
          onPeerName?.(msg.name || 'Participante')
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
          onPeerName?.(null)
          if (remoteVideoEl) remoteVideoEl.srcObject = null
          remoteStream = null
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
    // Se compartilhando tela, cam toggle não se aplica ao display
    if (displayStream) return camOffState()
    const track = localStream?.getVideoTracks()?.[0]
    if (!track) return false
    track.enabled = !track.enabled
    return !track.enabled
  }

  function camOffState() {
    const track = localStream?.getVideoTracks()?.[0]
    return track ? !track.enabled : false
  }

  async function startScreenShare() {
    if (displayStream) return true
    displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 15, width: { max: 1920 }, height: { max: 1080 } },
      audio: false,
    })
    const screenTrack = displayStream.getVideoTracks()[0]
    if (!screenTrack) throw new Error('Sem faixa de vídeo na tela')

    const sender = pc?.getSenders?.().find((s) => s.track && s.track.kind === 'video')
    if (sender) await sender.replaceTrack(screenTrack)
    if (localVideoEl) {
      localVideoEl.srcObject = displayStream
      await localVideoEl.play().catch(() => {})
    }

    screenTrack.onended = () => {
      stopScreenShare().catch(() => {})
    }
    status('compartilhando tela')
    return true
  }

  async function stopScreenShare() {
    if (!displayStream) return false
    displayStream.getTracks().forEach((t) => t.stop())
    displayStream = null
    const cam = cameraTrack || localStream?.getVideoTracks()?.[0]
    const sender = pc?.getSenders?.().find((s) => s.track == null || s.track.kind === 'video')
    if (sender && cam) await sender.replaceTrack(cam)
    if (localVideoEl && localStream) {
      localVideoEl.srcObject = localStream
      await localVideoEl.play().catch(() => {})
    }
    status(pc?.connectionState === 'connected' ? 'conectado' : 'na sala')
    return false
  }

  function isSharing() {
    return Boolean(displayStream)
  }

  function attachRemoteAudioToMix() {
    if (!audioCtx || !mixDest || !remoteStream) return
    try {
      const remoteAudio = remoteStream.getAudioTracks()
      if (!remoteAudio.length) return
      const rs = new MediaStream(remoteAudio)
      const src = audioCtx.createMediaStreamSource(rs)
      src.connect(mixDest)
    } catch {
      /* ignore */
    }
  }

  async function startRecording() {
    if (recording) return true
    const mimeType = pickAudioMime()
    if (!window.MediaRecorder) throw new Error('Gravação não suportada neste navegador')

    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    mixDest = audioCtx.createMediaStreamDestination()

    if (localStream?.getAudioTracks?.().length) {
      const localAudio = new MediaStream(localStream.getAudioTracks())
      audioCtx.createMediaStreamSource(localAudio).connect(mixDest)
    }
    attachRemoteAudioToMix()

    recordedChunks = []
    recorder = new MediaRecorder(mixDest.stream, mimeType ? { mimeType } : undefined)
    recorder.ondataavailable = (ev) => {
      if (ev.data?.size) recordedChunks.push(ev.data)
    }
    recorder.start(1000)
    recording = true
    onRecording?.(true)
    status('gravando áudio…')
    return true
  }

  async function stopRecording({ downloadName } = {}) {
    if (!recording || !recorder) return null
    const blob = await new Promise((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm'
        resolve(new Blob(recordedChunks, { type }))
      }
      try {
        recorder.stop()
      } catch {
        resolve(new Blob(recordedChunks, { type: 'audio/webm' }))
      }
    })
    recording = false
    onRecording?.(false)
    try { await audioCtx?.close() } catch { /* ignore */ }
    audioCtx = null
    mixDest = null
    recorder = null

    const ext = blob.type.includes('ogg') ? 'ogg' : blob.type.includes('mp4') ? 'm4a' : 'webm'
    const name = downloadName || `vintage-call-${roomId}-${Date.now()}.${ext}`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 30_000)
    status(pc?.connectionState === 'connected' ? 'conectado' : 'na sala')
    return blob
  }

  function isRecording() {
    return recording
  }

  function hangup() {
    closed = true
    if (recording) {
      try { recorder?.stop() } catch { /* ignore */ }
      recording = false
      onRecording?.(false)
    }
    try { displayStream?.getTracks()?.forEach((t) => t.stop()) } catch { /* ignore */ }
    try { ws?.close() } catch { /* ignore */ }
    try { pc?.close() } catch { /* ignore */ }
    localStream?.getTracks()?.forEach((t) => t.stop())
    try { audioCtx?.close() } catch { /* ignore */ }
    if (localVideoEl) localVideoEl.srcObject = null
    if (remoteVideoEl) remoteVideoEl.srcObject = null
    ws = null
    pc = null
    localStream = null
    displayStream = null
    remoteStream = null
    status('encerrada')
  }

  return {
    start,
    hangup,
    toggleMute,
    toggleCam,
    startScreenShare,
    stopScreenShare,
    isSharing,
    startRecording,
    stopRecording,
    isRecording,
  }
}
