/**
 * Spotify Embeds + iFrame API (fallback / visitantes)
 * Docs: https://developer.spotify.com/documentation/embeds
 *
 * Conta conectada usa Web API + Web Playback SDK (ver spotifyAuth / spotifyPlayer).
 */

export const SPOTIFY_IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1'

/** Playlist opcional (lista nativa do embed). Ex.: spotify:playlist:... */
export const SPOTIFY_PLAYLIST_URI =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SPOTIFY_PLAYLIST_URI) || ''

/** Faixas curadas no CRT (ids estáveis do open.spotify.com) */
export const SPOTIFY_TRACKS = [
  {
    id: 'clash',
    uri: 'spotify:track:39shmbIHICJ2Wxnk1fPSdz',
    title: 'Should I Stay or Should I Go',
    artist: 'The Clash',
  },
  {
    id: 'kiss',
    uri: 'spotify:track:2ZSCy3P1QzpJySCWA6NRIU',
    title: "I Was Made For Lovin' You",
    artist: 'KISS',
  },
  {
    id: 'ramones',
    uri: 'spotify:track:4KcH1ZRV2W1q7Flq0QqC76',
    title: 'Blitzkrieg Bop',
    artist: 'Ramones',
  },
]

export function getDefaultSpotifyUri() {
  if (SPOTIFY_PLAYLIST_URI) return SPOTIFY_PLAYLIST_URI
  return SPOTIFY_TRACKS[0]?.uri
}

export function findTrackById(id) {
  const key = String(id || '').toLowerCase()
  return SPOTIFY_TRACKS.find((t) => t.id === key) || null
}

export function findTrackByUri(uri) {
  if (!uri) return null
  const id = String(uri).split(':').pop()
  return SPOTIFY_TRACKS.find((t) => t.uri === uri || t.uri.endsWith(id)) || null
}

let iframeApiPromise = null

/** Carrega o script oficial e resolve com IFrameAPI */
export function loadSpotifyIframeApi() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Spotify IFrame API só roda no browser'))
  }
  if (window.__spotifyIFrameAPI) {
    return Promise.resolve(window.__spotifyIFrameAPI)
  }
  if (iframeApiPromise) return iframeApiPromise

  iframeApiPromise = new Promise((resolve, reject) => {
    const prev = window.onSpotifyIframeApiReady
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.__spotifyIFrameAPI = IFrameAPI
      if (typeof prev === 'function') {
        try { prev(IFrameAPI) } catch { /* ignore */ }
      }
      resolve(IFrameAPI)
    }

    const existing = document.querySelector(`script[src="${SPOTIFY_IFRAME_API_SRC}"]`)
    if (existing) {
      if (window.__spotifyIFrameAPI) resolve(window.__spotifyIFrameAPI)
      return
    }

    const script = document.createElement('script')
    script.src = SPOTIFY_IFRAME_API_SRC
    script.async = true
    script.onerror = () => {
      iframeApiPromise = null
      reject(new Error('Falha ao carregar Spotify IFrame API'))
    }
    document.body.appendChild(script)
  })

  return iframeApiPromise
}

/**
 * Cria (ou recria) o controller do Embed dentro de `hostEl`.
 * @returns {Promise<object>} EmbedController
 */
export async function createSpotifyEmbed(hostEl, { uri, height = 80 } = {}) {
  if (!hostEl) throw new Error('hostEl obrigatório')
  const IFrameAPI = await loadSpotifyIframeApi()
  hostEl.innerHTML = ''
  const el = document.createElement('div')
  hostEl.appendChild(el)

  return new Promise((resolve) => {
    IFrameAPI.createController(
      el,
      {
        uri: uri || getDefaultSpotifyUri(),
        width: '100%',
        height: String(height),
        theme: 'dark',
      },
      (controller) => resolve(controller)
    )
  })
}
