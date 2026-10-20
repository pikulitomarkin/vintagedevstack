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

export default function AdminAgendaPage() {
  const { signOut, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
      await adminConfirmBooking(id)
      await load()
    } catch (e) {
      setError(e.message || 'Falha ao confirmar')
    }
  }

  async function ensureRoom(id) {
    try {
      await adminEnsureRoom(id)
      await load()
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
            Olá{profile?.full_name ? `, ${profile.full_name}` : ''}. Confirme pedidos — a sala Jitsi abre em{' '}
            <code>/call/:id</code> no próprio site.
          </p>
        </header>

        <div className="agenda-filters">
          <button type="button" className={filter === 'upcoming' ? 'is-active' : ''} onClick={() => setFilter('upcoming')}>Próximas</button>
          <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Todas</button>
          <button type="button" className="agenda-btn" onClick={load}>Atualizar</button>
        </div>

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
                {b.meeting_url && (
                  <p className="agenda-muted">
                    Sala:{' '}
                    <a href={b.meeting_url} target="_blank" rel="noopener noreferrer">{b.meeting_url}</a>
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
                      <a className="agenda-btn primary" href={b.meeting_url || `/call/${b.id}`}>Entrar na call</a>
                      <button type="button" className="agenda-btn" onClick={() => ensureRoom(b.id)}>Regenerar sala</button>
                    </>
                  )}
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <button type="button" className="agenda-btn danger" onClick={() => setStatus(b.id, 'cancelled')}>Cancelar</button>
                  )}
                  {b.status === 'confirmed' && (
                    <button type="button" className="agenda-btn" onClick={() => setStatus(b.id, 'completed')}>Concluir</button>
                  )}
                  <a className="agenda-btn" href={`https://wa.me/55${String(b.client_whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
