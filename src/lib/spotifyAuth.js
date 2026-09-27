/**
 * Authorization Code + PKCE (SPA)
 * Docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 *
 * Client ID é público. NÃO use Client Secret no frontend.
 */

export const SPOTIFY_CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SPOTIFY_CLIENT_ID) ||
  '66c97ab931c54bfa85e1ab50dcb872b8'

const STORAGE = {
  verifier: 'spotify_code_verifier',
  state: 'spotify_auth_state',
  access: 'spotify_access_token',
  refresh: 'spotify_refresh_token',
  expires: 'spotify_token_expires_at',
}

export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ')

export function getSpotifyRedirectUri() {
  if (typeof window === 'undefined') return 'https://www.vintagedevstack.com.br/callback'
  return `${window.location.origin}/callback`
}

function generateRandomString(length = 64) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

async function sha256(plain) {
  const data = new TextEncoder().encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

function base64urlEncode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function saveTokens({ access_token, refresh_token, expires_in }) {
  const expiresAt = Date.now() + (Number(expires_in) || 3600) * 1000 - 30_000
  localStorage.setItem(STORAGE.access, access_token)
  localStorage.setItem(STORAGE.expires, String(expiresAt))
  if (refresh_token) localStorage.setItem(STORAGE.refresh, refresh_token)
}

export function clearSpotifySession() {
  Object.values(STORAGE).forEach((k) => localStorage.removeItem(k))
}

export function hasSpotifySession() {
  return Boolean(localStorage.getItem(STORAGE.access) || localStorage.getItem(STORAGE.refresh))
}

export async function beginSpotifyLogin() {
  if (!SPOTIFY_CLIENT_ID) throw new Error('VITE_SPOTIFY_CLIENT_ID não configurado')

  const codeVerifier = generateRandomString(64)
  const state = generateRandomString(16)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64urlEncode(hashed)

  localStorage.setItem(STORAGE.verifier, codeVerifier)
  localStorage.setItem(STORAGE.state, state)

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: getSpotifyRedirectUri(),
    state,
    scope: SPOTIFY_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code, state) {
  const expectedState = localStorage.getItem(STORAGE.state)
  if (!state || !expectedState || state !== expectedState) {
    throw new Error('State OAuth inválido')
  }
  const codeVerifier = localStorage.getItem(STORAGE.verifier)
  if (!codeVerifier) throw new Error('code_verifier ausente — reinicie o login')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getSpotifyRedirectUri(),
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'Falha ao obter token Spotify')
  }

  saveTokens(data)
  localStorage.removeItem(STORAGE.verifier)
  localStorage.removeItem(STORAGE.state)
  return data.access_token
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(STORAGE.refresh)
  if (!refreshToken) throw new Error('Sem refresh token — conecte o Spotify novamente')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    clearSpotifySession()
    throw new Error(data.error_description || data.error || 'Refresh token expirado')
  }

  saveTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_in: data.expires_in,
  })
  return data.access_token
}

/** Retorna access token válido (renova se necessário) */
export async function getValidAccessToken() {
  const access = localStorage.getItem(STORAGE.access)
  const expiresAt = Number(localStorage.getItem(STORAGE.expires) || 0)
  if (access && Date.now() < expiresAt) return access
  if (localStorage.getItem(STORAGE.refresh)) return refreshAccessToken()
  return null
}
