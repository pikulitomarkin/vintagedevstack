import { supabase, isSupabaseConfigured } from './supabase'

export const AGENDA_TZ = 'America/Sao_Paulo'
export const SLOT_MINUTES = 30
export const HORIZON_DAYS = 14
export const MIN_LEAD_HOURS = 2

/** @typedef {'pending' | 'confirmed' | 'cancelled' | 'completed'} BookingStatus */

/**
 * @typedef {Object} AvailabilityRule
 * @property {string} id
 * @property {number} weekday
 * @property {number} start_minute
 * @property {number} end_minute
 * @property {number} slot_minutes
 * @property {boolean} active
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} starts_at
 * @property {string} ends_at
 * @property {string} client_name
 * @property {string} client_email
 * @property {string} client_whatsapp
 * @property {string|null} topic
 * @property {BookingStatus} status
 * @property {string|null} meeting_url
 * @property {string|null} admin_notes
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} TimeSlot
 * @property {string} startsAt ISO UTC
 * @property {string} endsAt ISO UTC
 * @property {string} label local HH:mm
 * @property {boolean} available
 */

function assertSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
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

/** Convert local SP wall time to UTC ISO */
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
  assertSupabase()
  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .eq('active', true)
    .order('weekday')
  if (error) throw error
  return /** @type {AvailabilityRule[]} */ (data || [])
}

export async function fetchBusySlots(fromIso, toIso) {
  assertSupabase()
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

/**
 * Build bookable days (date keys) for the next HORIZON_DAYS
 * @param {AvailabilityRule[]} rules
 */
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

/**
 * @param {object} day from listBookableDays
 * @param {AvailabilityRule[]} rules
 * @param {{starts_at:string, ends_at:string}[]} busy
 * @returns {TimeSlot[]}
 */
export function buildSlotsForDay(day, rules, busy) {
  const rule = rules.find((r) => r.weekday === day.weekday && r.active)
  if (!rule) return []

  const now = Date.now()
  const minStart = now + MIN_LEAD_HOURS * 3600 * 1000
  /** @type {TimeSlot[]} */
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
    slots.push({
      startsAt,
      endsAt,
      label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      available: !taken && startMs >= minStart,
    })
  }
  return slots
}

export async function createBooking({ startsAt, name, email, whatsapp, topic }) {
  assertSupabase()
  const { data, error } = await supabase.rpc('create_booking', {
    p_starts_at: startsAt,
    p_client_name: name,
    p_client_email: email,
    p_client_whatsapp: whatsapp,
    p_topic: topic || null,
  })
  if (error) throw error
  return /** @type {Booking} */ (data)
}

export async function adminListBookings({ fromIso, toIso } = {}) {
  assertSupabase()
  let q = supabase.from('bookings').select('*').order('starts_at', { ascending: true })
  if (fromIso) q = q.gte('starts_at', fromIso)
  if (toIso) q = q.lte('starts_at', toIso)
  const { data, error } = await q
  if (error) throw error
  return /** @type {Booking[]} */ (data || [])
}

export async function adminUpdateBooking(id, patch) {
  assertSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return /** @type {Booking} */ (data)
}

export async function adminCreateBlock({ startsAt, endsAt, reason }) {
  assertSupabase()
  const { data, error } = await supabase
    .from('availability_blocks')
    .insert({ starts_at: startsAt, ends_at: endsAt, reason: reason || null })
    .select('*')
    .single()
  if (error) throw error
  return data
}
