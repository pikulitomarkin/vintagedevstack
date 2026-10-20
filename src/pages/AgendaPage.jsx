import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  buildSlotsForDay,
  createBooking,
  fetchAvailabilityRules,
  fetchBusySlots,
  formatSpDate,
  formatSpTime,
  HORIZON_DAYS,
  isAgendaConfigured,
  listBookableDays,
  SLOT_MINUTES,
} from '../lib/agenda'

const emptyForm = { name: '', email: '', whatsapp: '', topic: '' }

export default function AgendaPage() {
  const [rules, setRules] = useState([])
  const [busy, setBusy] = useState([])
  const [days, setDays] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  async function refreshBusy() {
    const from = new Date()
    const to = new Date(Date.now() + (HORIZON_DAYS + 1) * 86400000)
    const b = await fetchBusySlots(from.toISOString(), to.toISOString())
    setBusy(b)
    return b
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      if (!isAgendaConfigured()) {
        setError('Agenda em configuração: defina VITE_API_URL (VPS) ou VITE_SUPABASE_URL.')
        setLoading(false)
        return
      }
      try {
        const from = new Date()
        const [r, b] = await Promise.all([
          fetchAvailabilityRules(),
          fetchBusySlots(from.toISOString(), new Date(Date.now() + (HORIZON_DAYS + 1) * 86400000).toISOString()),
        ])
        if (cancelled) return
        setRules(r)
        setBusy(b)
        const bookable = listBookableDays(r, from)
        setDays(bookable)
        setSelectedDay(bookable[0] || null)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Falha ao carregar agenda')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    // Atualiza ocupação a cada 30s enquanto a página está aberta
    const timer = setInterval(() => {
      if (!cancelled && isAgendaConfigured()) {
        refreshBusy().catch(() => {})
      }
    }, 30000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  const slots = useMemo(() => {
    if (!selectedDay) return []
    return buildSlotsForDay(selectedDay, rules, busy)
  }, [selectedDay, rules, busy])

  async function onSubmit(e) {
    e.preventDefault()
    if (!selectedSlot) return
    setSubmitting(true)
    setError('')
    try {
      // Revalida ocupação antes de enviar (outro cliente pode ter reservado)
      const latestBusy = await refreshBusy()
      const stillFree = buildSlotsForDay(selectedDay, rules, latestBusy).find(
        (s) => s.startsAt === selectedSlot.startsAt && s.available
      )
      if (!stillFree) {
        setSelectedSlot(null)
        throw new Error('OCUPADO: este horário acabou de ser reservado. Escolha outro.')
      }
      const booking = await createBooking({
        startsAt: selectedSlot.startsAt,
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        topic: form.topic,
      })
      setSuccess(booking)
      setForm(emptyForm)
      setSelectedSlot(null)
      await refreshBusy()
    } catch (err) {
      setError(err.message || 'Não foi possível agendar')
      refreshBusy().catch(() => {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="agenda-page">
      <header className="agenda-topbar">
        <Link to="/" className="agenda-brand"><span className="v">▮</span> VINTAGE_DEVSTACK</Link>
        <nav>
          <Link to="/">Home</Link>
          <a href="https://wa.me/5543988713278" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </nav>
      </header>

      <main className="agenda-shell">
        <header className="agenda-hero">
          <p className="agenda-kicker">[ AGENDA / VIDEO CALL ]</p>
          <h1>Agendar videochamada</h1>
          <p className="agenda-lead">
            Segunda a quinta, das 09h às 18h (horário de Brasília). Slots de {SLOT_MINUTES} minutos.
            Após o pedido, confirmamos e enviamos o link da call.
          </p>
        </header>

        {loading && <p className="agenda-status">Carregando horários…</p>}
        {error && <p className="agenda-error" role="alert">{error}</p>}

        {success && (
          <div className="agenda-success" role="status">
            <h2>Pedido recebido</h2>
            <p>
              <strong>{formatSpDate(success.starts_at)}</strong> às{' '}
              <strong>{formatSpTime(success.starts_at)}</strong>
            </p>
            <p>Status: <span className="pill pending">pendente de confirmação</span></p>
            <p>
              Após a confirmação, a videochamada acontece aqui no site Vintage
              {success.id ? <> — sala <code>/call/{success.id}</code></> : null}.
            </p>
            <button type="button" className="agenda-btn" onClick={() => setSuccess(null)}>
              Agendar outro horário
            </button>
          </div>
        )}

        {!loading && !success && (
          <div className="agenda-grid">
            <section className="agenda-panel">
              <h2>1. Dia</h2>
              <div className="agenda-days">
                {days.map((d) => (
                  <button
                    key={d.dateKey}
                    type="button"
                    className={`agenda-day ${selectedDay?.dateKey === d.dateKey ? 'is-active' : ''}`}
                    onClick={() => { setSelectedDay(d); setSelectedSlot(null) }}
                  >
                    {d.label}
                  </button>
                ))}
                {!days.length && <p className="agenda-muted">Nenhum dia disponível no horizonte atual.</p>}
              </div>

              <h2>2. Horário</h2>
              <div className="agenda-slots">
                {slots.map((s) => (
                  <button
                    key={s.startsAt}
                    type="button"
                    disabled={!s.available}
                    title={s.taken ? 'Horário já reservado' : s.tooSoon ? 'Antecedência mínima de 2h' : undefined}
                    className={`agenda-slot ${selectedSlot?.startsAt === s.startsAt ? 'is-active' : ''} ${s.taken ? 'is-taken' : ''}`}
                    onClick={() => setSelectedSlot(s)}
                  >
                    {s.label}
                    {s.taken ? <span className="agenda-slot-tag">ocupado</span> : null}
                  </button>
                ))}
                {selectedDay && !slots.some((s) => s.available) && (
                  <p className="agenda-muted">Sem horários livres neste dia.</p>
                )}
              </div>
            </section>

            <section className="agenda-panel">
              <h2>3. Seus dados</h2>
              <form className="agenda-form" onSubmit={onSubmit}>
                <label>
                  Nome
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                </label>
                <label>
                  E-mail
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="voce@empresa.com"
                    autoComplete="email"
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="43 98871-3278"
                    autoComplete="tel"
                  />
                </label>
                <label>
                  Assunto (opcional)
                  <input
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    placeholder="Ex.: automação, SaaS, consultoria…"
                  />
                </label>

                {selectedSlot && (
                  <p className="agenda-summary">
                    Selecionado: {formatSpDate(selectedSlot.startsAt)} · {selectedSlot.label}
                  </p>
                )}

                <button
                  type="submit"
                  className="agenda-btn primary"
                  disabled={!selectedSlot || submitting}
                >
                  {submitting ? 'Enviando…' : 'Solicitar agendamento'}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
