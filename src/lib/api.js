/** Cliente HTTP da API VPS (agenda + auth local) */

export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const isApiConfigured = Boolean(API_URL)

const TOKEN_KEY = 'vintage_admin_token'

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path, options = {}) {
  if (!API_URL) throw new Error('API não configurada (VITE_API_URL)')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getAdminToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(data.error || 'Não autenticado — faça login novamente')
    }
    if (!text || text.trimStart().startsWith('<')) {
      throw new Error(
        `API indisponível (HTTP ${res.status}). Confirme que o DNS aponta para a VPS e atualize a página (Ctrl+F5).`
      )
    }
    throw new Error(data.error || `API ${res.status}`)
  }
  return data
}
