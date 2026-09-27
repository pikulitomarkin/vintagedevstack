import { getValidAccessToken } from './spotifyAuth'

async function spotifyFetch(path, options = {}) {
  const token = await getValidAccessToken()
  if (!token) throw new Error('Spotify não conectado')

  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error?.message || data?.error_description || `Spotify API ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function fetchSpotifyMe() {
  return spotifyFetch('/me')
}

/** Playlists do usuário (até 20) */
export async function fetchMyPlaylists(limit = 12) {
  const data = await spotifyFetch(`/me/playlists?limit=${limit}`)
  return (data?.items || []).map((p) => ({
    id: p.id,
    uri: p.uri,
    name: p.name,
    tracksTotal: p.tracks?.total ?? 0,
    image: p.images?.[0]?.url || null,
  }))
}

/** Faixas de uma playlist */
export async function fetchPlaylistTracks(playlistId, limit = 30) {
  const data = await spotifyFetch(`/playlists/${playlistId}/tracks?limit=${limit}`)
  return (data?.items || [])
    .map((item) => item?.track)
    .filter((t) => t && t.id && !t.is_local)
    .map((t) => ({
      id: t.id,
      uri: t.uri,
      title: t.name,
      artist: (t.artists || []).map((a) => a.name).join(', '),
    }))
}

/** Toca URI no device do Web Playback SDK */
export async function playOnDevice(deviceId, uris, contextUri) {
  const body = {}
  if (contextUri) body.context_uri = contextUri
  if (uris?.length) body.uris = uris
  await spotifyFetch(`/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function transferPlayback(deviceId, play = false) {
  await spotifyFetch('/me/player', {
    method: 'PUT',
    body: JSON.stringify({ device_ids: [deviceId], play }),
  })
}
