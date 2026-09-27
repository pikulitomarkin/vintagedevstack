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
import { formatSpotifyError, isForbiddenError, isPremiumAccount } from '../lib/spotifyErrors'

/**
 * Canal Spotify do CRT: Embed (sempre funciona) + SDK se Premium.
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
  const cancelledRef = useRef(false)

  const [connected, setConnected] = useState(() => hasSpotifySession())
  const [userLabel, setUserLabel] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [mode, setMode] = useState('embed') // embed | sdk
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
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

  const loadPlaylistTracksSafe = useCallback(async (playlistId) => {
    try {
      const list = await fetchPlaylistTracks(playlistId, 40)
      return list
    } catch (e) {
      // Várias playlists geradas/bloqueadas retornam 403 — não derruba a sessão
      console.warn('playlist tracks:', e.message)
      return []
    }
  }, [])

  const loadUserLibrary = useCallback(async () => {
    setLoadingLib(true)
    try {
      const me = await fetchSpotifyMe()
      setUserLabel(me?.display_name || me?.id || 'Spotify')
      setIsPremium(isPremiumAccount(me))
      setConnected(true)

      const pls = await fetchMyPlaylists(12)
      setPlaylists(pls)

      for (const p of pls) {
        const list = await loadPlaylistTracksSafe(p.id)
        if (list.length) {
          setActivePlaylistId(p.id)
          setTracks(list)
          break
        }
      }
      return me
    } catch (e) {
      const friendly = formatSpotifyError(e)
      setError(friendly)
      if (/token|auth|401|expirada|conectado/i.test(friendly)) {
        clearSpotifySession()
        setConnected(false)
      }
      return null
    } finally {
      setLoadingLib(false)
    }
  }, [loadPlaylistTracksSafe])

  const mountEmbed = useCallback((uri) => {
    let tries = 0
    const run = () => {
      if (cancelledRef.current) return
      const host = embedHostRef.current
      if (!host) {
        if (tries++ < 30) {
          requestAnimationFrame(run)
          return
        }
        setError('Player Spotify indisponível')
        return
      }

      destroyEmbed()
      const height = SPOTIFY_PLAYLIST_URI || String(uri || '').includes('playlist') ? 152 : 80
      createSpotifyEmbed(host, { uri: uri || pendingUriRef.current || getDefaultSpotifyUri(), height })
        .then((ctrl) => {
          if (cancelledRef.current) {
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
          if (!cancelledRef.current) setError(formatSpotifyError(err))
        })
    }
    run()
  }, [activeTrackId, destroyEmbed, emitNow, emitPlaying])

  const selectPlaylist = async (playlist) => {
    const playlistId = typeof playlist === 'string' ? playlist : playlist?.id
    const playlistUri = typeof playlist === 'object' ? playlist?.uri : playlists.find((p) => p.id === playlistId)?.uri
    setActivePlaylistId(playlistId)
    setLoadingLib(true)
    setError('')
    try {
      const list = await loadPlaylistTracksSafe(playlistId)
      if (list.length) {
        setTracks(list)
      } else if (playlistUri) {
        setNotice('Playlist bloqueada na API — abrindo no Embed')
        pendingUriRef.current = playlistUri
        pendingPlayRef.current = true
        destroySdk()
        setMode('embed')
        // remount embed with playlist
        setTimeout(() => mountEmbed(playlistUri), 0)
      } else {
        setNotice('Não foi possível ler as faixas desta playlist')
      }
    } finally {
      setLoadingLib(false)
    }
  }

  // Mount when channel active
  useEffect(() => {
    if (!active || !power) return undefined

    cancelledRef.current = false
    setReady(false)
    setError('')
    setNotice('')

    const boot = async () => {
      const token = await getValidAccessToken().catch(() => null)
      if (cancelledRef.current) return

      if (!token) {
        setConnected(false)
        setIsPremium(false)
        setMode('embed')
        setTracks(SPOTIFY_TRACKS)
        setPlaylists([])
        mountEmbed(pendingUriRef.current || getDefaultSpotifyUri())
        return
      }

      setConnected(true)
      const me = await loadUserLibrary()
      if (cancelledRef.current) return

      const premium = isPremiumAccount(me)
      setIsPremium(premium)

      if (!premium) {
        // Conta free: Embed + playlists (SDK sempre dá Forbidden)
        setNotice('Conta sem Premium — tocando via Embed (sem SDK)')
        destroySdk()
        setMode('embed')
        mountEmbed(pendingUriRef.current || getDefaultSpotifyUri())
        return
      }

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
          onError: (msg) => {
            const friendly = formatSpotifyError(msg)
            if (isForbiddenError({ message: msg })) {
              setNotice(friendly)
              return
            }
            setError(friendly)
          },
        })
        if (cancelledRef.current) {
          player.disconnect()
          return
        }
        sdkPlayerRef.current = player
        deviceIdRef.current = deviceId
        setMode('sdk')
        setReady(true)
        setNotice('')
        // Transfer sem autoplay — evita Forbidden no boot
        await transferPlayback(deviceId, false).catch(() => {})
        // Se o usuário pediu play ao abrir, tenta; se 403, cai no Embed
        if (pendingPlayRef.current && pendingUriRef.current) {
          pendingPlayRef.current = false
          try {
            await playOnDevice(deviceId, [pendingUriRef.current])
          } catch (e) {
            setNotice(formatSpotifyError(e))
            destroySdk()
            setMode('embed')
            pendingPlayRef.current = true
            mountEmbed(pendingUriRef.current)
          }
        }
      } catch (e) {
        destroySdk()
        setNotice(formatSpotifyError(e))
        setMode('embed')
        mountEmbed(pendingUriRef.current || getDefaultSpotifyUri())
      }
    }

    boot()

    return () => {
      cancelledRef.current = true
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

  const playViaEmbed = useCallback((uri) => {
    pendingUriRef.current = uri
    pendingPlayRef.current = true
    const ctrl = embedCtrlRef.current
    if (ctrl && mode === 'embed') {
      try {
        if (typeof ctrl.loadEntity === 'function') ctrl.loadEntity(uri)
        else ctrl.loadUri(uri)
        ctrl.play()
        emitPlaying(true)
        return
      } catch { /* remount below */ }
    }
    destroySdk()
    setMode('embed')
    setTimeout(() => mountEmbed(uri), 0)
  }, [mode, destroySdk, mountEmbed, emitPlaying])

  const playTrack = useCallback(async (track) => {
    if (!track) return
    setActiveTrackId(track.id)
    pendingUriRef.current = track.uri
    setError('')
    emitNow({ title: `${track.title} — ${track.artist}`, status: 'PLAY' })

    if (mode === 'sdk' && deviceIdRef.current) {
      try {
        await playOnDevice(deviceIdRef.current, [track.uri])
        emitPlaying(true)
        setNotice('')
        return
      } catch (e) {
        setNotice(formatSpotifyError(e))
        playViaEmbed(track.uri)
        return
      }
    }

    playViaEmbed(track.uri)
  }, [mode, emitNow, emitPlaying, playViaEmbed])

  const togglePlay = useCallback(async () => {
    if (mode === 'sdk' && sdkPlayerRef.current) {
      try {
        await sdkPlayerRef.current.togglePlay()
      } catch (e) {
        setNotice(formatSpotifyError(e))
      }
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
      setError(formatSpotifyError(e))
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
    setIsPremium(false)
    setPlaylists([])
    setTracks(SPOTIFY_TRACKS)
    setMode('embed')
    setError('')
    setNotice('')
    destroySdk()
    pendingUriRef.current = getDefaultSpotifyUri()
    pendingPlayRef.current = false
    setTimeout(() => mountEmbed(getDefaultSpotifyUri()), 0)
  }

  if (!active) return null

  return (
    <div className="crt-spotify" aria-label="Spotify player">
      <div className="crt-spotify-head">
        <span className="np-label">
          CH·SPOTIFY / {mode === 'sdk' ? 'SDK' : 'EMBED'}
          {connected && !isPremium ? ' · FREE' : ''}
        </span>
        <span className={`np-status status-${isPlaying ? 'play' : 'pause'}`}>
          {!ready && !error ? 'LOAD…' : isPlaying ? '▶ PLAY' : '⏸ READY'}
        </span>
      </div>

      <div className="crt-spotify-auth">
        {connected ? (
          <>
            <span className="crt-spotify-user">
              {userLabel || 'conectado'}
              {isPremium ? ' · PREMIUM' : ' · FREE'}
            </span>
            <button type="button" className="crt-spotify-linkbtn" onClick={disconnect}>Sair</button>
          </>
        ) : (
          <button type="button" className="crt-spotify-linkbtn primary" onClick={() => beginSpotifyLogin()}>
            Conectar Spotify
          </button>
        )}
      </div>

      {error && <p className="crt-spotify-error">{error}</p>}
      {notice && !error && <p className="crt-spotify-notice">{notice}</p>}

      {(mode === 'embed' || !isPremium) && (
        <div className="crt-spotify-embed" ref={embedHostRef} />
      )}

      {mode === 'sdk' && isPremium && (
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
              onClick={() => selectPlaylist(p)}
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
    </div>
  )
})

export default CrtSpotifyPanel
