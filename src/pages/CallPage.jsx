import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchBookingPublic, formatSpDate, formatSpTime } from '../lib/agenda'
import { createVintageCall } from '../lib/webrtcCall'

export default function CallPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [camOff, setCamOff] = useState(false)
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

  async function joinCall() {
    if (!roomId || !canJoin) return
    setError('')
    setStatus('pedindo câmera/microfone…')
    try {
      callRef.current?.hangup()
      const call = createVintageCall({
        roomId,
        displayName: booking?.client_name || 'Convidado',
        localVideoEl: localRef.current,
        remoteVideoEl: remoteRef.current,
        onStatus: setStatus,
        onError: (e) => setError(e.message || 'Erro na call'),
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

  function hangup() {
    callRef.current?.hangup()
    callRef.current = null
    setStarted(false)
    setMuted(false)
    setCamOff(false)
    setStatus('encerrada')
  }

  return (
    <div className="agenda-page call-page">
      <header className="agenda-topbar">
        <Link to="/" className="agenda-brand"><span className="v">▮</span> VINTAGE_DEVSTACK</Link>
        <nav>
          <Link to="/agenda">Agenda</Link>
        </nav>
      </header>

      <main className="agenda-shell call-shell">
        <header className="agenda-hero">
          <p className="agenda-kicker">[ VIDEO CALL / WEBRTC ]</p>
          <h1>Sala Vintage</h1>
          {booking && (
            <p className="agenda-lead">
              {formatSpDate(booking.starts_at)} · {formatSpTime(booking.starts_at)}
              {booking.topic ? ` · ${booking.topic}` : ''}
            </p>
          )}
        </header>

        {loading && <p className="agenda-status">Carregando sala…</p>}
        {error && <p className="agenda-error" role="alert">{error}</p>}

        {!loading && booking && booking.status === 'pending' && (
          <p className="agenda-muted">
            Este horário ainda está <strong>pendente de confirmação</strong>. Assim que confirmarmos, a sala abre aqui.
          </p>
        )}

        {!loading && booking && booking.status === 'cancelled' && (
          <p className="agenda-error">Este agendamento foi cancelado.</p>
        )}

        {canJoin && (
          <>
            <div className="vintage-call-stage">
              <div className="vintage-call-remote">
                <video ref={remoteRef} className="vintage-call-video" autoPlay playsInline />
                {!started && <p className="vintage-call-placeholder">Aguardando vídeo remoto</p>}
              </div>
              <div className="vintage-call-local">
                <video ref={localRef} className="vintage-call-video" autoPlay playsInline muted />
                <span className="vintage-call-local-tag">você</span>
              </div>
            </div>

            <div className="vintage-call-controls">
              {!started ? (
                <button type="button" className="agenda-btn primary" onClick={joinCall}>
                  Entrar na videochamada
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="agenda-btn"
                    onClick={() => setMuted(callRef.current?.toggleMute() ?? !muted)}
                  >
                    {muted ? 'Ativar microfone' : 'Mudo'}
                  </button>
                  <button
                    type="button"
                    className="agenda-btn"
                    onClick={() => setCamOff(callRef.current?.toggleCam() ?? !camOff)}
                  >
                    {camOff ? 'Ligar câmera' : 'Desligar câmera'}
                  </button>
                  <button type="button" className="agenda-btn danger" onClick={hangup}>
                    Encerrar
                  </button>
                </>
              )}
            </div>

            {status && <p className="agenda-status">{status}</p>}
            {roomId && <p className="agenda-muted call-room-id">Sala: {roomId} · WebRTC P2P (Vintage)</p>}
          </>
        )}
      </main>
    </div>
  )
}
