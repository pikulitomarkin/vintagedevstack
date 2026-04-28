import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Enums ────────────────────────────────────────────────────────────────────

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed' | 'archived'
export type JobModel = 'remote' | 'hybrid' | 'onsite'
export type JobContract = 'pj' | 'freelance' | 'clt' | 'internship'
export type ApplicationStatus =
  | 'received'
  | 'in_review'
  | 'technical'
  | 'interview'
  | 'approved'
  | 'rejected'
  | 'withdrawn'

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Job {
  id: string
  slug: string
  title: string
  department: string
  location: string
  model: JobModel
  contract: JobContract
  salary_range: string | null
  description: string
  requirements: string[]
  nice_to_have: string[]
  benefits: string[]
  status: JobStatus
  views: number
  created_at: string
  updated_at: string
  closes_at: string | null
}

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  phone: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  bio: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  candidate_id: string
  status: ApplicationStatus
  cover_letter: string | null
  salary_expectation: string | null
  availability: string | null
  resume_url: string | null
  resume_filename: string | null
  notes: string | null
  created_at: string
  updated_at: string
  job?: Job
  candidate?: Profile
}

export interface TimelineEntry {
  id: string
  application_id: string
  status: ApplicationStatus
  note: string | null
  created_by: string | null
  created_at: string
}
