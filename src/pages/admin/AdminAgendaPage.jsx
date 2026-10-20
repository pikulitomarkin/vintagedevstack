import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  adminConfirmBooking,
  adminEnsureRoom,
  adminListBookings,
  adminUpdateBooking,
  formatSpDate,
  formatSpTime,
} from '../../lib/agenda'

const STATUS_LABEL = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
}

function callUrlFor(booking) {
  if (booking.meeting_url) return booking.meeting_url
  if (typeof window !== 'undefined') return `${window.location.origin}/call/${booking.id}`
  return `/call/${booking.id}`
}

function waDigits(whatsapp) {
  const digits = String(whatsapp || '').replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('55') ? digits : `55${digits}`
}

export default function AdminAgendaPage() {
  const { signOut, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [filter, setFilter] = useState('upcoming')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const fromIso = filter === 'upcoming' ? new Date().toISOString() : undefined
      const data = await adminListBookings({ fromIso })
      setBookings(data)
    } catch (e) {
      setError(e.message || 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  async function confirm(id) {
    try {
      const updated = await adminConfirmBooking(id)
      await load()
      const url = callUrlFor(updated)
      setNotice(`Confirmado. Link da call: ${url}`)
    } catch (e) {
      setError(e.message || 'Falha ao confirmar')
    }
  }

  async function ensureRoom(id) {
    try {
      const updated = await adminEnsureRoom(id)
      await load()
      setNotice(`Sala pronta: ${callUrlFor(updated)}`)
    } catch (e) {
      setError(e.message || 'Falha ao gerar sala')
    }
  }

  async function setStatus(id, status) {
    try {
      await adminUpdateBooking(id, { status })
      await load()
    } catch (e) {
      setError(e.message || 'Falha ao atualizar')
    }
  }

  async function copyLink(booking) {
    const url = callUrlFor(booking)
    try {
      await navigator.clipboard.writeText(url)
      setNotice(`Link copiado: ${url}`)
    } catch {
      setNotice(`Copie manualmente: ${url}`)
    }
  }

  function whatsappShare(booking) {
    const url = callUrlFor(booking)
    const when = `${formatSpDate(booking.starts_at)} às ${formatSpTime(booking.starts_at)}`
    const text = `Olá ${booking.client_name}! Sua videochamada Vintage DevStack está confirmada para ${when}. Acesse: ${url}`
    const phone = waDigits(booking.client_whatsapp)
    return phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="agenda-page">
      <header className="agenda-topbar">
        <Link to="/" className="agenda-brand"><span className="v">▮</span> VINTAGE_DEVSTACK</Link>
        <nav>
          <Link to="/agenda">Agenda pública</Link>
          <button type="button" className="agenda-linkbtn" onClick={() => signOut()}>Sair</button>
        </nav>
      </header>

      <main className="agenda-shell">
        <header className="agenda-hero">
          <p className="agenda-kicker">[ ADMIN / AGENDA ]</p>
          <h1>Videochamadas</h1>
          <p className="agenda-lead">
            Olá{profile?.full_name ? `, ${profile.full_name}` : ''}. Confirme o pedido, copie o link{' '}
            <code>/call/:id</code> e envie ao cliente (WhatsApp ou e-mail).
          </p>
        </header>

        <div className="agenda-filters">
          <button type="button" className={filter === 'upcoming' ? 'is-active' : ''} onClick={() => setFilter('upcoming')}>Próximas</button>
          <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Todas</button>
          <button type="button" className="agenda-btn" onClick={load}>Atualizar</button>
        </div>

        {notice && <p className="agenda-success" role="status">{notice}</p>}
        {error && <p className="agenda-error">{error}</p>}
        {loading && <p className="agenda-status">Carregando…</p>}

        <div className="agenda-admin-list">
          {!loading && !bookings.length && <p className="agenda-muted">Nenhum agendamento.</p>}
          {bookings.map((b) => (
            <article key={b.id} className={`agenda-admin-card status-${b.status}`}>
              <div className="agenda-admin-main">
                <h3>{b.client_name}</h3>
                <p>{formatSpDate(b.starts_at)} · {formatSpTime(b.starts_at)}–{formatSpTime(b.ends_at)}</p>
                <p className="agenda-muted">{b.client_email} · {b.client_whatsapp}</p>
                {b.topic && <p>Assunto: {b.topic}</p>}
                <p><span className={`pill ${b.status}`}>{STATUS_LABEL[b.status] || b.status}</span></p>
                {(b.meeting_url || b.status === 'confirmed') && (
                  <p className="agenda-muted">
                    Link do cliente:{' '}
                    <a href={callUrlFor(b)} target="_blank" rel="noopener noreferrer">{callUrlFor(b)}</a>
                  </p>
                )}
              </div>
              <div className="agenda-admin-actions">
                <div className="agenda-admin-btns">
                  {b.status === 'pending' && (
                    <button type="button" className="agenda-btn primary" onClick={() => confirm(b.id)}>
                      Confirmar + criar sala
                    </button>
                  )}
                  {(b.status === 'confirmed' || b.status === 'completed') && (
                    <>
                      <a className="agenda-btn primary" href={callUrlFor(b)}>Entrar na call</a>
                      <button type="button" className="agenda-btn" onClick={() => copyLink(b)}>Copiar link</button>
                      <a className="agenda-btn" href={whatsappShare(b)} target="_blank" rel="noopener noreferrer">
                        Enviar no WhatsApp
                      </a>
                      <button type="button" className="agenda-btn" onClick={() => ensureRoom(b.id)}>Regenerar sala</button>
                    </>
                  )}
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <button type="button" className="agenda-btn danger" onClick={() => setStatus(b.id, 'cancelled')}>Cancelar</button>
                  )}
                  {b.status === 'confirmed' && (
                    <button type="button" className="agenda-btn" onClick={() => setStatus(b.id, 'completed')}>Concluir</button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
