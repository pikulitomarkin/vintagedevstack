import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  buildSlotsForDay,
  createBooking,
  fetchAvailabilityRules,
  fetchBusySlots,
  formatSpDate,
  formatSpTime,
  HORIZON_DAYS,
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

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      if (!isSupabaseConfigured) {
        setError('Agenda em configuração: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY e aplique a migration SQL.')
        setLoading(false)
        return
      }
      try {
        const from = new Date()
        const to = new Date(Date.now() + (HORIZON_DAYS + 1) * 86400000)
        const [r, b] = await Promise.all([
          fetchAvailabilityRules(),
          fetchBusySlots(from.toISOString(), to.toISOString()),
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
    return () => { cancelled = true }
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
      const from = new Date()
      const to = new Date(Date.now() + (HORIZON_DAYS + 1) * 86400000)
      const b = await fetchBusySlots(from.toISOString(), to.toISOString())
      setBusy(b)
    } catch (err) {
      setError(err.message || 'Não foi possível agendar')
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
            Segunda a quinta, das 17h às 22h (horário de Brasília). Slots de {SLOT_MINUTES} minutos.
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
            <p>Você receberá o link da videochamada após a confirmação.</p>
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
                    className={`agenda-slot ${selectedSlot?.startsAt === s.startsAt ? 'is-active' : ''}`}
                    onClick={() => setSelectedSlot(s)}
                  >
                    {s.label}
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
