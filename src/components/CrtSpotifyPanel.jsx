import React, { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'
import {
  SPOTIFY_PLAYLIST_URI,
  SPOTIFY_TRACKS,
  createSpotifyEmbed,
  findTrackById,
  findTrackByUri,
  getDefaultSpotifyUri,
} from '../lib/spotify'
import {
  beginSpotifyLogin,
  clearSpotifySession,
  getValidAccessToken,
  hasSpotifySession,
} from '../lib/spotifyAuth'
import {
  fetchMyPlaylists,
  fetchPlaylistTracks,
  fetchSpotifyMe,
  playOnDevice,
  transferPlayback,
} from '../lib/spotifyApi'
import { createWebPlayer } from '../lib/spotifyPlayer'

/**
 * Canal Spotify do CRT: Embed (visitantes) + Web API/Playback SDK (conta conectada).
 */
const CrtSpotifyPanel = forwardRef(function CrtSpotifyPanel(
  { active, power, initialTrackId, onPlayingChange, onNowPlayingChange },
  ref
) {
  const embedHostRef = useRef(null)
  const embedCtrlRef = useRef(null)
  const sdkPlayerRef = useRef(null)
  const deviceIdRef = useRef(null)
  const pendingPlayRef = useRef(false)
  const pendingUriRef = useRef(getDefaultSpotifyUri())

  const [connected, setConnected] = useState(() => hasSpotifySession())
  const [userLabel, setUserLabel] = useState('')
  const [mode, setMode] = useState('embed') // embed | sdk
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTrackId, setActiveTrackId] = useState(initialTrackId || SPOTIFY_TRACKS[0]?.id)
  const [tracks, setTracks] = useState(SPOTIFY_TRACKS)
  const [playlists, setPlaylists] = useState([])
  const [activePlaylistId, setActivePlaylistId] = useState(null)
  const [loadingLib, setLoadingLib] = useState(false)

  const emitPlaying = useCallback((playing) => {
    setIsPlaying(playing)
    onPlayingChange?.(playing)
  }, [onPlayingChange])

  const emitNow = useCallback((np) => {
    onNowPlayingChange?.(np)
  }, [onNowPlayingChange])

  const destroySdk = useCallback(() => {
    try { sdkPlayerRef.current?.disconnect?.() } catch { /* ignore */ }
    sdkPlayerRef.current = null
    deviceIdRef.current = null
  }, [])

  const destroyEmbed = useCallback(() => {
    try { embedCtrlRef.current?.destroy?.() } catch { /* ignore */ }
    embedCtrlRef.current = null
  }, [])

  const loadUserLibrary = useCallback(async () => {
    setLoadingLib(true)
    setError('')
    try {
      const me = await fetchSpotifyMe()
      setUserLabel(me?.display_name || me?.id || 'Spotify')
      setConnected(true)
      const pls = await fetchMyPlaylists(12)
      setPlaylists(pls)
      if (pls[0]) {
        setActivePlaylistId(pls[0].id)
        const list = await fetchPlaylistTracks(pls[0].id, 40)
        if (list.length) setTracks(list)
      }
    } catch (e) {
      setError(e.message || 'Falha ao carregar biblioteca')
      if (/token|auth|401|conectado/i.test(e.message || '')) {
        clearSpotifySession()
        setConnected(false)
      }
    } finally {
      setLoadingLib(false)
    }
  }, [])

  const selectPlaylist = async (playlistId) => {
    setActivePlaylistId(playlistId)
    setLoadingLib(true)
    try {
      const list = await fetchPlaylistTracks(playlistId, 40)
      if (list.length) setTracks(list)
    } catch (e) {
      setError(e.message || 'Falha ao carregar playlist')
    } finally {
      setLoadingLib(false)
    }
  }

  // Mount player when channel active
  useEffect(() => {
    if (!active || !power) return undefined

    let cancelled = false
    let raf = 0
    setReady(false)
    setError('')

    const boot = async () => {
      const token = await getValidAccessToken().catch(() => null)
      if (cancelled) return

      if (token) {
        setConnected(true)
        try {
          const { player, deviceId } = await createWebPlayer({
            name: 'Vintage CRT · DevStack',
            onState: (state) => {
              if (!state) {
                emitPlaying(false)
                return
              }
              emitPlaying(!state.paused)
              const t = state.track_window?.current_track
              if (t) {
                const title = `${t.name} — ${(t.artists || []).map((a) => a.name).join(', ')}`
                emitNow({ title, status: state.paused ? 'PAUSE' : 'PLAY' })
                setActiveTrackId(t.id)
              }
            },
            onError: (msg) => setError(msg || 'Erro no player'),
          })
          if (cancelled) {
            player.disconnect()
            return
          }
          sdkPlayerRef.current = player
          deviceIdRef.current = deviceId
          setMode('sdk')
          setReady(true)
          await transferPlayback(deviceId, false).catch(() => {})
          await loadUserLibrary()
          if (pendingPlayRef.current && pendingUriRef.current) {
            pendingPlayRef.current = false
            await playOnDevice(deviceId, [pendingUriRef.current]).catch((e) => setError(e.message))
          }
          return
        } catch (e) {
          // Premium/SDK falhou → fallback Embed
          destroySdk()
          setMode('embed')
          setError(e.message || 'SDK indisponível — usando Embed')
          if (token) await loadUserLibrary().catch(() => {})
        }
      } else {
        setConnected(false)
        setMode('embed')
        setTracks(SPOTIFY_TRACKS)
        setPlaylists([])
      }

      // Embed fallback / visitantes
      const mountEmbed = (tries = 0) => {
        if (cancelled) return
        const host = embedHostRef.current
        if (!host) {
          if (tries < 30) raf = requestAnimationFrame(() => mountEmbed(tries + 1))
          else setError('Player Spotify indisponível')
          return
        }
        const uri = pendingUriRef.current || getDefaultSpotifyUri()
        const height = SPOTIFY_PLAYLIST_URI ? 152 : 80
        createSpotifyEmbed(host, { uri, height })
          .then((ctrl) => {
            if (cancelled) {
              try { ctrl.destroy?.() } catch { /* ignore */ }
              return
            }
            embedCtrlRef.current = ctrl
            setReady(true)
            setMode('embed')
            ctrl.addListener('ready', () => {
              if (pendingPlayRef.current) {
                pendingPlayRef.current = false
                try { ctrl.play() } catch { /* ignore */ }
              }
            })
            ctrl.addListener('playback_started', (e) => {
              const matched = findTrackByUri(e?.data?.playingURI) || findTrackById(activeTrackId)
              if (matched) {
                setActiveTrackId(matched.id)
                emitNow({ title: `${matched.title} — ${matched.artist}`, status: 'PLAY' })
              }
              emitPlaying(true)
            })
            ctrl.addListener('playback_update', (e) => {
              const paused = Boolean(e?.data?.isPaused)
              emitPlaying(!paused)
              const matched = findTrackByUri(e?.data?.playingURI) || findTrackById(activeTrackId)
              if (matched) {
                emitNow({
                  title: `${matched.title} — ${matched.artist}`,
                  status: paused ? 'PAUSE' : 'PLAY',
                })
              }
            })
            if (pendingPlayRef.current) {
              try { ctrl.play(); pendingPlayRef.current = false } catch { /* ignore */ }
            }
          })
          .catch((err) => {
            if (!cancelled) setError(err.message || 'Falha ao abrir Spotify')
          })
      }
      mountEmbed()
    }

    boot()

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      destroyEmbed()
      destroySdk()
    }
  }, [active, power]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialTrackId) {
      const t = findTrackById(initialTrackId)
      if (t) {
        setActiveTrackId(t.id)
        pendingUriRef.current = t.uri
      }
    }
  }, [initialTrackId])

  const playTrack = useCallback(async (track) => {
    if (!track) return
    setActiveTrackId(track.id)
    pendingUriRef.current = track.uri
    emitNow({ title: `${track.title} — ${track.artist}`, status: 'PLAY' })

    if (mode === 'sdk' && deviceIdRef.current) {
      try {
        await playOnDevice(deviceIdRef.current, [track.uri])
        emitPlaying(true)
      } catch (e) {
        setError(e.message || 'Falha ao tocar')
      }
      return
    }

    const ctrl = embedCtrlRef.current
    if (ctrl) {
      try {
        if (typeof ctrl.loadEntity === 'function') ctrl.loadEntity(track.uri)
        else ctrl.loadUri(track.uri)
        ctrl.play()
        emitPlaying(true)
      } catch (e) {
        setError(e.message || 'Falha no Embed')
      }
    } else {
      pendingPlayRef.current = true
    }
  }, [mode, emitNow, emitPlaying])

  const togglePlay = useCallback(async () => {
    if (mode === 'sdk' && sdkPlayerRef.current) {
      await sdkPlayerRef.current.togglePlay()
      return
    }
    const ctrl = embedCtrlRef.current
    if (!ctrl) {
      pendingPlayRef.current = true
      return
    }
    try {
      if (isPlaying) {
        ctrl.pause()
        emitPlaying(false)
        const t = tracks.find((x) => x.id === activeTrackId)
        emitNow({ title: t ? `${t.title} — ${t.artist}` : 'AUDIO', status: 'PAUSE' })
      } else {
        ctrl.resume?.() ?? ctrl.play()
        emitPlaying(true)
      }
    } catch (e) {
      setError(e.message)
    }
  }, [mode, isPlaying, tracks, activeTrackId, emitPlaying, emitNow])

  const openWithTrack = useCallback((trackId) => {
    const track = findTrackById(trackId) || tracks[0] || SPOTIFY_TRACKS[0]
    if (track) {
      setActiveTrackId(track.id)
      pendingUriRef.current = SPOTIFY_PLAYLIST_URI || track.uri
      emitNow({ title: `${track.title} — ${track.artist}`, status: 'PLAY' })
    }
    pendingPlayRef.current = true
  }, [tracks, emitNow])

  useImperativeHandle(ref, () => ({
    togglePlay,
    openWithTrack,
    playTrackById: (id) => {
      const t = findTrackById(id) || tracks.find((x) => x.id === id)
      if (t) return playTrack(t)
      openWithTrack(id)
    },
    isPlaying: () => isPlaying,
  }), [togglePlay, openWithTrack, playTrack, tracks, isPlaying])

  const disconnect = () => {
    clearSpotifySession()
    setConnected(false)
    setUserLabel('')
    setPlaylists([])
    setTracks(SPOTIFY_TRACKS)
    setMode('embed')
    setError('')
    destroySdk()
  }

  if (!active) return null

  return (
    <div className="crt-spotify" aria-label="Spotify player">
      <div className="crt-spotify-head">
        <span className="np-label">CH·SPOTIFY / {mode === 'sdk' ? 'SDK' : 'EMBED'}</span>
        <span className={`np-status status-${isPlaying ? 'play' : 'pause'}`}>
          {!ready && !error ? 'LOAD…' : isPlaying ? '▶ PLAY' : '⏸ READY'}
        </span>
      </div>

      <div className="crt-spotify-auth">
        {connected ? (
          <>
            <span className="crt-spotify-user">{userLabel || 'conectado'}</span>
            <button type="button" className="crt-spotify-linkbtn" onClick={disconnect}>Sair</button>
          </>
        ) : (
          <button type="button" className="crt-spotify-linkbtn primary" onClick={() => beginSpotifyLogin()}>
            Conectar Spotify
          </button>
        )}
      </div>

      {error && <p className="crt-spotify-error">{error}</p>}

      {mode === 'embed' && (
        <div className="crt-spotify-embed" ref={embedHostRef} />
      )}

      {mode === 'sdk' && (
        <div className="crt-spotify-sdk-badge">
          Web Playback SDK · Vintage CRT
          {loadingLib ? ' · sync…' : ''}
        </div>
      )}

      {connected && playlists.length > 0 && (
        <div className="crt-spotify-playlists">
          {playlists.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`crt-spotify-pl ${activePlaylistId === p.id ? 'is-active' : ''}`}
              onClick={() => selectPlaylist(p.id)}
              title={`${p.tracksTotal} faixas`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {!SPOTIFY_PLAYLIST_URI && (
        <ul className="crt-spotify-list">
          {tracks.map((t, i) => (
            <li key={t.id || t.uri || i}>
              <button
                type="button"
                className={`crt-spotify-track ${activeTrackId === t.id ? 'is-active' : ''}`}
                onClick={() => playTrack(t)}
              >
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="meta">
                  <span className="title">{t.title}</span>
                  <span className="artist">{t.artist}</span>
                </span>
                <span className="cue">{activeTrackId === t.id && isPlaying ? '▶' : '○'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {SPOTIFY_PLAYLIST_URI && mode === 'embed' && (
        <p className="crt-spotify-hint">Playlist Spotify · use o player acima</p>
      )}
    </div>
  )
})

export default CrtSpotifyPanel
