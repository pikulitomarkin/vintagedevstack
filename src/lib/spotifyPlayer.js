/**
 * Web Playback SDK
 * Docs: https://developer.spotify.com/documentation/web-playback-sdk
 * Requer Spotify Premium + token com scope `streaming`.
 */

import { getValidAccessToken } from './spotifyAuth'

const SDK_SRC = 'https://sdk.scdn.co/spotify-player.js'

let sdkPromise = null

export function loadWebPlaybackSdk() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Web Playback SDK só no browser'))
  }
  if (window.Spotify?.Player) return Promise.resolve(window.Spotify)
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const prev = window.onSpotifyWebPlaybackSDKReady
    window.onSpotifyWebPlaybackSDKReady = () => {
      if (typeof prev === 'function') {
        try { prev() } catch { /* ignore */ }
      }
      resolve(window.Spotify)
    }

    if (document.querySelector(`script[src="${SDK_SRC}"]`)) return

    const script = document.createElement('script')
    script.src = SDK_SRC
    script.async = true
    script.onerror = () => {
      sdkPromise = null
      reject(new Error('Falha ao carregar Web Playback SDK'))
    }
    document.body.appendChild(script)
  })

  return sdkPromise
}

/**
 * Cria e conecta um Spotify.Player.
 * @returns {Promise<{ player: object, deviceId: string }>}
 */
export async function createWebPlayer({ name = 'Vintage CRT', onState, onError } = {}) {
  await loadWebPlaybackSdk()
  const token = await getValidAccessToken()
  if (!token) throw new Error('Conecte o Spotify para usar o player Premium')

  return new Promise((resolve, reject) => {
    const player = new window.Spotify.Player({
      name,
      getOAuthToken: async (cb) => {
        try {
          const t = await getValidAccessToken()
          cb(t || token)
        } catch {
          cb(token)
        }
      },
      volume: 0.7,
    })

    let settled = false

    player.addListener('ready', ({ device_id }) => {
      if (!settled) {
        settled = true
        resolve({ player, deviceId: device_id })
      }
    })

    player.addListener('not_ready', ({ device_id }) => {
      onError?.(`Device offline: ${device_id}`)
    })

    player.addListener('initialization_error', ({ message }) => {
      if (!settled) {
        settled = true
        reject(new Error(message || 'Erro ao iniciar player'))
      }
      onError?.(message)
    })

    player.addListener('authentication_error', ({ message }) => {
      if (!settled) {
        settled = true
        reject(new Error(message || 'Auth Spotify inválida (Premium?)'))
      }
      onError?.(message)
    })

    player.addListener('account_error', ({ message }) => {
      if (!settled) {
        settled = true
        reject(new Error(message || 'Conta sem Premium — use o Embed'))
      }
      onError?.(message)
    })

    player.addListener('playback_error', ({ message }) => {
      onError?.(message)
    })

    player.addListener('player_state_changed', (state) => {
      onState?.(state)
    })

    player.connect().then((ok) => {
      if (!ok && !settled) {
        settled = true
        reject(new Error('Não foi possível conectar o Web Playback SDK'))
      }
    })
  })
}
