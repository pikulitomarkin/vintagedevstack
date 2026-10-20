import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  adminConfirmBooking,
  adminCreateInstantCall,
  adminEnsureRoom,
  adminListBookings,
  adminScheduleWithLink,
  adminUpdateBooking,
  formatSpDate,
  formatSpTime,
  spParts,
} from '../../lib/agenda'

const STATUS_LABEL = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
}

const emptySchedule = {
  name: '',
  email: '',
  whatsapp: '',
  topic: '',
  date: '',
  time: '10:00',
  durationMinutes: 30,
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

function defaultScheduleDate() {
  const p = spParts(new Date(Date.now() + 86400000))
  return p.dateKey
}

function localInputToUtcIso(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const [hh, mm] = timeStr.split(':').map(Number)
  // Reusa conversão SP → UTC do módulo agenda via Date local guess
  const guess = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0))
  const sp = new Date(guess.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const utc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }))
  const offset = sp.getTime() - utc.getTime()
  return new Date(Date.UTC(y, m - 1, d, hh, mm, 0) - offset).toISOString()
}

export default function AdminAgendaPage() {
  const { signOut, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyAction, setBusyAction] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [filter, setFilter] = useState('upcoming')
  const [showSchedule, setShowSchedule] = useState(false)
  const [schedule, setSchedule] = useState(() => ({
    ...emptySchedule,
    date: defaultScheduleDate(),
  }))
  const [lastLink, setLastLink] = useState('')

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

  async function copyText(url, label = 'Link') {
    try {
      await navigator.clipboard.writeText(url)
      setNotice(`${label} copiado: ${url}`)
    } catch {
      setNotice(`Copie manualmente: ${url}`)
    }
  }

  async function onInstantCall() {
    setBusyAction(true)
    setError('')
    setNotice('')
    try {
      const booking = await adminCreateInstantCall({
        name: 'Call instantânea',
        topic: 'Videochamada instantânea',
        durationMinutes: 60,
      })
      const url = callUrlFor(booking)
      setLastLink(url)
      await copyText(url, 'Link da call instantânea')
      await load()
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setError(e.message || 'Falha ao criar call instantânea')
    } finally {
      setBusyAction(false)
    }
  }

  async function onScheduleSubmit(e) {
    e.preventDefault()
    setBusyAction(true)
    setError('')
    setNotice('')
    try {
      if (!schedule.date || !schedule.time) throw new Error('Informe data e horário')
      if (!schedule.name || schedule.name.trim().length < 2) throw new Error('Informe o nome do cliente')
      const startsAt = localInputToUtcIso(schedule.date, schedule.time)
      const booking = await adminScheduleWithLink({
        startsAt,
        durationMinutes: Number(schedule.durationMinutes) || 30,
        name: schedule.name,
        email: schedule.email || undefined,
        whatsapp: schedule.whatsapp || undefined,
        topic: schedule.topic || 'Videochamada agendada',
      })
      const url = callUrlFor(booking)
      setLastLink(url)
      await copyText(url, 'Link da videochamada')
      setShowSchedule(false)
      setSchedule({ ...emptySchedule, date: defaultScheduleDate() })
      await load()
    } catch (err) {
      setError(err.message || 'Falha ao agendar')
    } finally {
      setBusyAction(false)
    }
  }

  async function confirm(id) {
    try {
      const updated = await adminConfirmBooking(id)
      await load()
      const url = callUrlFor(updated)
      setLastLink(url)
      setNotice(`Confirmado. Link da call: ${url}`)
    } catch (e) {
      setError(e.message || 'Falha ao confirmar')
    }
  }

  async function ensureRoom(id) {
    try {
      const updated = await adminEnsureRoom(id)
      await load()
      setLastLink(callUrlFor(updated))
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
    setLastLink(url)
    await copyText(url)
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
            Olá{profile?.full_name ? `, ${profile.full_name}` : ''}. Gere uma call agora ou agende e envie o link{' '}
            <code>/call/:id</code> ao cliente.
          </p>
        </header>

        <div className="agenda-admin-actions-bar">
          <button
            type="button"
            className="agenda-btn primary"
            disabled={busyAction}
            onClick={onInstantCall}
          >
            {busyAction ? 'Gerando…' : 'Videochamada instantânea'}
          </button>
          <button
            type="button"
            className="agenda-btn"
            disabled={busyAction}
            onClick={() => {
              setShowSchedule((v) => !v)
              setError('')
              setNotice('')
            }}
          >
            Agendar videochamada + gerar link
          </button>
        </div>

        {showSchedule && (
          <form className="agenda-panel agenda-admin-schedule" onSubmit={onScheduleSubmit}>
            <h2>Agendar e gerar link</h2>
            <p className="agenda-muted">Cria o horário já confirmado, com sala Vintage pronta para enviar.</p>
            <div className="agenda-admin-schedule-grid">
              <label>
                Nome do cliente
                <input
                  required
                  value={schedule.name}
                  onChange={(e) => setSchedule((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Nome"
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  value={schedule.email}
                  onChange={(e) => setSchedule((s) => ({ ...s, email: e.target.value }))}
                  placeholder="opcional"
                />
              </label>
              <label>
                WhatsApp
                <input
                  value={schedule.whatsapp}
                  onChange={(e) => setSchedule((s) => ({ ...s, whatsapp: e.target.value }))}
                  placeholder="opcional"
                />
              </label>
              <label>
                Assunto
                <input
                  value={schedule.topic}
                  onChange={(e) => setSchedule((s) => ({ ...s, topic: e.target.value }))}
                  placeholder="opcional"
                />
              </label>
              <label>
                Data
                <input
                  required
                  type="date"
                  value={schedule.date}
                  onChange={(e) => setSchedule((s) => ({ ...s, date: e.target.value }))}
                />
              </label>
              <label>
                Horário (BRT)
                <input
                  required
                  type="time"
                  step={1800}
                  value={schedule.time}
                  onChange={(e) => setSchedule((s) => ({ ...s, time: e.target.value }))}
                />
              </label>
              <label>
                Duração
                <select
                  value={schedule.durationMinutes}
                  onChange={(e) => setSchedule((s) => ({ ...s, durationMinutes: Number(e.target.value) }))}
                >
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                </select>
              </label>
            </div>
            <div className="agenda-admin-btns">
              <button type="submit" className="agenda-btn primary" disabled={busyAction}>
                {busyAction ? 'Salvando…' : 'Criar e gerar link'}
              </button>
              <button type="button" className="agenda-btn" onClick={() => setShowSchedule(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {lastLink && (
          <p className="agenda-success" role="status">
            Último link:{' '}
            <a href={lastLink} target="_blank" rel="noopener noreferrer">{lastLink}</a>
            {' · '}
            <button type="button" className="agenda-linkbtn" onClick={() => copyText(lastLink)}>
              Copiar de novo
            </button>
          </p>
        )}

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
