import { supabase, isSupabaseConfigured } from './supabase'
import { apiFetch, isApiConfigured } from './api'

export const AGENDA_TZ = 'America/Sao_Paulo'
export const SLOT_MINUTES = 30
export const HORIZON_DAYS = 14
export const MIN_LEAD_HOURS = 2

/** Preferência: API VPS > Supabase */
export function isAgendaConfigured() {
  return isApiConfigured || isSupabaseConfigured
}

function assertBackend() {
  if (!isAgendaConfigured()) {
    throw new Error('Agenda não configurada. Defina VITE_API_URL (VPS) ou VITE_SUPABASE_URL.')
  }
}

/** Parts of a Date in America/Sao_Paulo */
export function spParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: AGENDA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  })
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  const weekdayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: weekdayMap[parts.weekday] || 1,
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  }
}

export function spLocalToUtcIso(year, month, day, hour, minute) {
  const guess = new Date(Date.UTC(year, month - 1, day, hour + 3, minute, 0))
  const sp = new Date(guess.toLocaleString('en-US', { timeZone: AGENDA_TZ }))
  const utc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }))
  const offset = sp.getTime() - utc.getTime()
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - offset).toISOString()
}

export function formatSpDate(iso) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: AGENDA_TZ,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatSpTime(iso) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: AGENDA_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso))
}

export async function fetchAvailabilityRules() {
  assertBackend()
  if (isApiConfigured) return apiFetch('/agenda/rules')
  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .eq('active', true)
    .order('weekday')
  if (error) throw error
  return data || []
}

export async function fetchBusySlots(fromIso, toIso) {
  assertBackend()
  if (isApiConfigured) {
    const q = new URLSearchParams({ from: fromIso, to: toIso })
    return apiFetch(`/agenda/busy?${q}`)
  }
  const { data, error } = await supabase.rpc('get_busy_slots', {
    p_from: fromIso,
    p_to: toIso,
  })
  if (error) throw error
  return data || []
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}

export function listBookableDays(rules, fromDate = new Date()) {
  const activeWeekdays = new Set(rules.filter((r) => r.active).map((r) => r.weekday))
  const days = []
  for (let i = 0; i < HORIZON_DAYS + 1; i++) {
    const d = new Date(fromDate.getTime() + i * 86400000)
    const p = spParts(d)
    if (!activeWeekdays.has(p.weekday)) continue
    days.push({
      dateKey: p.dateKey,
      weekday: p.weekday,
      label: new Intl.DateTimeFormat('pt-BR', {
        timeZone: AGENDA_TZ,
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
      }).format(d),
      year: p.year,
      month: p.month,
      day: p.day,
    })
  }
  return days
}

export function buildSlotsForDay(day, rules, busy) {
  const rule = rules.find((r) => r.weekday === day.weekday && r.active)
  if (!rule) return []

  const now = Date.now()
  const minStart = now + MIN_LEAD_HOURS * 3600 * 1000
  const slots = []

  for (let m = rule.start_minute; m + rule.slot_minutes <= rule.end_minute; m += rule.slot_minutes) {
    const hour = Math.floor(m / 60)
    const minute = m % 60
    const startsAt = spLocalToUtcIso(day.year, day.month, day.day, hour, minute)
    const endsAt = new Date(new Date(startsAt).getTime() + rule.slot_minutes * 60000).toISOString()
    const startMs = new Date(startsAt).getTime()
    const endMs = new Date(endsAt).getTime()
    const taken = busy.some((b) =>
      overlaps(startMs, endMs, new Date(b.starts_at).getTime(), new Date(b.ends_at).getTime())
    )
    const tooSoon = startMs < minStart
    slots.push({
      startsAt,
      endsAt,
      label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      taken,
      tooSoon,
      available: !taken && !tooSoon,
    })
  }
  return slots
}

export async function createBooking({ startsAt, name, email, whatsapp, topic }) {
  assertBackend()
  if (isApiConfigured) {
    return apiFetch('/agenda/bookings', {
      method: 'POST',
      body: JSON.stringify({ startsAt, name, email, whatsapp, topic }),
    })
  }
  const { data, error } = await supabase.rpc('create_booking', {
    p_starts_at: startsAt,
    p_client_name: name,
    p_client_email: email,
    p_client_whatsapp: whatsapp,
    p_topic: topic || null,
  })
  if (error) throw error
  return data
}

export async function fetchBookingPublic(id) {
  assertBackend()
  if (isApiConfigured) return apiFetch(`/agenda/bookings/${id}`)
  const { data, error } = await supabase
    .from('bookings')
    .select('id, starts_at, ends_at, status, topic, meeting_url, client_name')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function adminListBookings({ fromIso, toIso } = {}) {
  assertBackend()
  if (isApiConfigured) {
    const q = fromIso ? `?from=${encodeURIComponent(fromIso)}` : ''
    return apiFetch(`/admin/bookings${q}`)
  }
  let q = supabase.from('bookings').select('*').order('starts_at', { ascending: true })
  if (fromIso) q = q.gte('starts_at', fromIso)
  if (toIso) q = q.lte('starts_at', toIso)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

export async function adminUpdateBooking(id, patch) {
  assertBackend()
  if (isApiConfigured) {
    return apiFetch(`/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
  }
  const { data, error } = await supabase
    .from('bookings')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function adminConfirmBooking(id) {
  assertBackend()
  if (isApiConfigured) {
    return apiFetch(`/admin/bookings/${id}/confirm`, { method: 'POST', body: '{}' })
  }
  // Supabase legado: só confirma; link Meet ainda manual ou meeting_url já setado
  return adminUpdateBooking(id, { status: 'confirmed' })
}

export async function adminEnsureRoom(id) {
  assertBackend()
  if (isApiConfigured) {
    return apiFetch(`/admin/bookings/${id}/room`, { method: 'POST', body: '{}' })
  }
  const url = `${window.location.origin}/call/${id}`
  return adminUpdateBooking(id, { meeting_url: url })
}

export async function adminCreateBlock({ startsAt, endsAt, reason }) {
  assertBackend()
  if (isApiConfigured) {
    throw new Error('Bloqueios via API ainda não expostos — use o admin SQL se necessário')
  }
  const { data, error } = await supabase
    .from('availability_blocks')
    .insert({ starts_at: startsAt, ends_at: endsAt, reason: reason || null })
    .select('*')
    .single()
  if (error) throw error
  return data
}
