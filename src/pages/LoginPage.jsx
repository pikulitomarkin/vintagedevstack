import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { signIn, user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user && isAdmin) navigate('/admin/agenda', { replace: true })
  }, [loading, user, isAdmin, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
      // AdminRoute valida is_admin; se não for admin, cai na agenda pública
      navigate('/admin/agenda')
    } catch (err) {
      setError(err.message || 'Falha no login')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="agenda-page">
      <header className="agenda-topbar">
        <Link to="/" className="agenda-brand"><span className="v">▮</span> VINTAGE_DEVSTACK</Link>
        <nav><Link to="/agenda">Agenda</Link></nav>
      </header>
      <main className="agenda-shell agenda-shell--narrow">
        <h1>Admin login</h1>
        <p className="agenda-lead">Acesso à gestão de videochamadas.</p>
        {error && <p className="agenda-error">{error}</p>}
        <form className="agenda-form" onSubmit={onSubmit}>
          <label>
            E-mail
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Senha
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit" className="agenda-btn primary" disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </main>
    </div>
  )
}
