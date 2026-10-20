import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL é obrigatório (ex.: postgresql://user:pass@db:5432/vintage_agenda)')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

export async function query(text, params) {
  return pool.query(text, params)
}
