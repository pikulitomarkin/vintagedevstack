import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchBookingPublic, formatSpDate, formatSpTime } from '../lib/agenda'

const JITSI_DOMAIN = (import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si').replace(/^https?:\/\//, '')

export default function CallPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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

  const room = useMemo(() => {
    if (booking?.meeting_room) return booking.meeting_room
    if (!bookingId) return null
    return `VintageDevStack-${String(bookingId).replace(/-/g, '').slice(0, 12)}`
  }, [booking, bookingId])

  const canJoin = booking && (booking.status === 'confirmed' || booking.status === 'completed')
  const embedSrc = room
    ? `https://${JITSI_DOMAIN}/${encodeURIComponent(room)}#config.prejoinPageEnabled=true&config.disableDeepLinking=true&userInfo.displayName=${encodeURIComponent(booking?.client_name || 'Convidado')}`
    : null

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
          <p className="agenda-kicker">[ VIDEO CALL / VINTAGE ]</p>
          <h1>Sala de videochamada</h1>
          {booking && (
            <p className="agenda-lead">
              {formatSpDate(booking.starts_at)} · {formatSpTime(booking.starts_at)}
              {booking.topic ? ` · ${booking.topic}` : ''}
            </p>
          )}
        </header>

        {loading && <p className="agenda-status">Carregando sala…</p>}
        {error && <p className="agenda-error">{error}</p>}

        {!loading && booking && booking.status === 'pending' && (
          <p className="agenda-muted">
            Este horário ainda está <strong>pendente de confirmação</strong>. Assim que confirmarmos, a sala abre aqui.
          </p>
        )}

        {!loading && booking && booking.status === 'cancelled' && (
          <p className="agenda-error">Este agendamento foi cancelado.</p>
        )}

        {canJoin && embedSrc && (
          <div className="call-frame-wrap">
            <iframe
              className="call-frame"
              src={embedSrc}
              title="Videochamada Vintage DevStack"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              allowFullScreen
            />
          </div>
        )}

        {canJoin && room && (
          <p className="agenda-muted call-room-id">Sala: {room}</p>
        )}
      </main>
    </div>
  )
}
