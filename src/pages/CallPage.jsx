import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchBookingPublic, formatSpDate, formatSpTime } from '../lib/agenda'
import { createVintageCall } from '../lib/webrtcCall'

function initials(name) {
  return String(name || 'V')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function IconMic({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      {off ? (
        <path fill="currentColor" d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3 3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
      ) : (
        <path fill="currentColor" d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
      )}
    </svg>
  )
}

function IconCam({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      {off ? (
        <path fill="currentColor" d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2 2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" />
      ) : (
        <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
      )}
    </svg>
  )
}

function IconScreen() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path fill="currentColor" d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
    </svg>
  )
}

function IconRec({ on }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      {on ? (
        <path fill="currentColor" d="M6 6h12v12H6z" />
      ) : (
        <circle cx="12" cy="12" r="7" fill="currentColor" />
      )}
    </svg>
  )
}

function IconHangup() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path fill="currentColor" d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
    </svg>
  )
}

export default function CallPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [camOff, setCamOff] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [recording, setRecording] = useState(false)
  const [peerName, setPeerName] = useState('')
  const localRef = useRef(null)
  const remoteRef = useRef(null)
  const callRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchBookingPublic(bookingId)
        if (!cancelled) setBooking(data)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Sala não encontrada')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (bookingId) load()
    return () => { cancelled = true }
  }, [bookingId])

  useEffect(() => () => {
    callRef.current?.hangup()
    callRef.current = null
  }, [])

  const canJoin = booking && (booking.status === 'confirmed' || booking.status === 'completed')
  const roomId = booking?.meeting_room || (bookingId
    ? `VintageDevStack-${String(bookingId).replace(/-/g, '').slice(0, 12)}`
    : null)

  const myName = useMemo(
    () => booking?.client_name || 'Você',
    [booking]
  )

  async function joinCall() {
    if (!roomId || !canJoin) return
    setError('')
    setStatus('liberando câmera e microfone…')
    try {
      callRef.current?.hangup()
      const call = createVintageCall({
        roomId,
        displayName: myName,
        localVideoEl: localRef.current,
        remoteVideoEl: remoteRef.current,
        onStatus: setStatus,
        onError: (e) => setError(e.message || 'Erro na call'),
        onPeerName: (n) => setPeerName(n || ''),
        onRecording: setRecording,
      })
      callRef.current = call
      await call.start()
      setStarted(true)
    } catch (e) {
      setError(
        e?.name === 'NotAllowedError'
          ? 'Permita câmera e microfone no navegador para entrar na call.'
          : (e.message || 'Não foi possível iniciar a videochamada')
      )
      setStatus('')
    }
  }

  async function hangup() {
    if (callRef.current?.isRecording?.()) {
      await callRef.current.stopRecording({
        downloadName: `vintage-${bookingId}-audio.webm`,
      }).catch(() => {})
    }
    callRef.current?.hangup()
    callRef.current = null
    setStarted(false)
    setMuted(false)
    setCamOff(false)
    setSharing(false)
    setRecording(false)
    setPeerName('')
    setStatus('chamada encerrada')
  }

  async function toggleShare() {
    try {
      if (callRef.current?.isSharing?.()) {
        await callRef.current.stopScreenShare()
        setSharing(false)
      } else {
        await callRef.current.startScreenShare()
        setSharing(true)
      }
    } catch (e) {
      setError(e.message || 'Não foi possível compartilhar a tela')
    }
  }

  async function toggleRecord() {
    try {
      if (callRef.current?.isRecording?.()) {
        await callRef.current.stopRecording({
          downloadName: `vintage-${bookingId}-${Date.now()}.webm`,
        })
        setStatus('áudio salvo — use o arquivo para transcrever o projeto')
      } else {
        await callRef.current.startRecording()
      }
    } catch (e) {
      setError(e.message || 'Não foi possível gravar o áudio')
    }
  }

  if (!canJoin && !loading) {
    return (
      <div className="meet-call">
        <header className="meet-topbar">
          <Link to="/" className="meet-brand"><span className="v">▮</span> VINTAGE</Link>
          <Link to="/agenda" className="meet-link">Agenda</Link>
        </header>
        <div className="meet-gate">
          {error && <p className="meet-error">{error}</p>}
          {booking?.status === 'pending' && (
            <p>Horário pendente de confirmação. A sala abre após a confirmação.</p>
          )}
          {booking?.status === 'cancelled' && <p>Este agendamento foi cancelado.</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={`meet-call ${started ? 'is-live' : ''}`}>
      <header className="meet-topbar">
        <div className="meet-topbar-left">
          <Link to="/" className="meet-brand"><span className="v">▮</span> VINTAGE</Link>
          {booking && (
            <div className="meet-meta">
              <strong>{booking.topic || 'Videochamada'}</strong>
              <span>
                {formatSpDate(booking.starts_at)} · {formatSpTime(booking.starts_at)}
              </span>
            </div>
          )}
        </div>
        <div className="meet-topbar-right">
          {recording && <span className="meet-rec-pill">REC áudio</span>}
          {status && <span className="meet-status">{status}</span>}
        </div>
      </header>

      {error && <p className="meet-error meet-error-banner" role="alert">{error}</p>}

      <div className="meet-stage">
        <div className={`meet-tile meet-tile-remote ${peerName ? 'has-peer' : ''}`}>
          <video ref={remoteRef} className="meet-video" autoPlay playsInline />
          {!peerName && (
            <div className="meet-avatar-block">
              <div className="meet-avatar">?</div>
              <p>Aguardando participante</p>
            </div>
          )}
          {peerName && <span className="meet-tile-name">{peerName}</span>}
        </div>

        <div className="meet-tile meet-tile-local">
          <video ref={localRef} className="meet-video" autoPlay playsInline muted />
          {(camOff && !sharing) && (
            <div className="meet-avatar-block">
              <div className="meet-avatar">{initials(myName)}</div>
            </div>
          )}
          <span className="meet-tile-name">
            {myName}{sharing ? ' · tela' : ''}{muted ? ' · mudo' : ''}
          </span>
        </div>
      </div>

      <footer className="meet-dock">
        {!started ? (
          <button type="button" className="meet-join" onClick={joinCall}>
            Entrar na reunião
          </button>
        ) : (
          <div className="meet-controls">
            <button
              type="button"
              className={`meet-btn ${muted ? 'is-off' : ''}`}
              title={muted ? 'Ativar microfone' : 'Desativar microfone'}
              onClick={() => setMuted(callRef.current?.toggleMute() ?? !muted)}
            >
              <IconMic off={muted} />
              <span className="meet-btn-label">{muted ? 'Mic off' : 'Mic'}</span>
            </button>
            <button
              type="button"
              className={`meet-btn ${camOff && !sharing ? 'is-off' : ''}`}
              title={camOff ? 'Ligar câmera' : 'Desligar câmera'}
              disabled={sharing}
              onClick={() => setCamOff(callRef.current?.toggleCam() ?? !camOff)}
            >
              <IconCam off={camOff && !sharing} />
              <span className="meet-btn-label">{camOff ? 'Cam off' : 'Câmera'}</span>
            </button>
            <button
              type="button"
              className={`meet-btn ${sharing ? 'is-active' : ''}`}
              title="Compartilhar tela"
              onClick={toggleShare}
            >
              <IconScreen />
              <span className="meet-btn-label">{sharing ? 'Parar tela' : 'Tela'}</span>
            </button>
            <button
              type="button"
              className={`meet-btn ${recording ? 'is-rec' : ''}`}
              title="Gravar só o áudio (para transcrever depois)"
              onClick={toggleRecord}
            >
              <IconRec on={recording} />
              <span className="meet-btn-label">{recording ? 'Parar grav.' : 'Gravar áudio'}</span>
            </button>
            <button type="button" className="meet-btn meet-btn-end" title="Encerrar" onClick={hangup}>
              <IconHangup />
              <span className="meet-btn-label">Sair</span>
            </button>
          </div>
        )}
        {roomId && (
          <p className="meet-room-hint">
            WebRTC Vintage · sala <code>{roomId}</code>
            {recording ? ' · gravando áudio para ata/transcrição' : ''}
          </p>
        )}
      </footer>
    </div>
  )
}
