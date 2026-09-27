import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { exchangeCodeForToken } from '../lib/spotifyAuth'

export default function SpotifyCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    const code = params.get('code')
    const state = params.get('state')

    if (err) {
      setError(err === 'access_denied' ? 'Login cancelado' : err)
      return
    }
    if (!code) {
      setError('Código de autorização ausente')
      return
    }

    exchangeCodeForToken(code, state)
      .then(() => {
        navigate('/?spotify=connected', { replace: true })
      })
      .catch((e) => setError(e.message || 'Falha no callback Spotify'))
  }, [navigate])

  return (
    <div className="agenda-page">
      <header className="agenda-topbar">
        <Link to="/" className="agenda-brand"><span className="v">▮</span> VINTAGE_DEVSTACK</Link>
      </header>
      <main className="agenda-shell agenda-shell--narrow">
        <h1>Spotify</h1>
        {error ? (
          <>
            <p className="agenda-error">{error}</p>
            <Link className="agenda-btn primary" to="/">Voltar</Link>
          </>
        ) : (
          <p className="agenda-lead">Autenticando… redirecionando ao CRT.</p>
        )}
      </main>
    </div>
  )
}
