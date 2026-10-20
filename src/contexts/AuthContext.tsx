import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Profile } from '../lib/supabase'
import { apiFetch, getAdminToken, isApiConfigured, setAdminToken } from '../lib/api'

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  session: Session | null
  isAdmin: boolean
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function localUserFromAdmin(admin: { id: string; email: string; full_name: string }): User {
  return {
    id: admin.id,
    email: admin.email,
    app_metadata: {},
    user_metadata: { full_name: admin.full_name },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User
}

function localProfileFromAdmin(admin: { id: string; email: string; full_name: string; is_admin?: boolean }): Profile {
  return {
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name,
    avatar_url: null,
    phone: null,
    linkedin_url: null,
    github_url: null,
    portfolio_url: null,
    bio: null,
    is_admin: admin.is_admin ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    if (!isSupabaseConfigured) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error && data) setProfile(data as Profile)
    else setProfile(null)
  }

  useEffect(() => {
    let mounted = true

    // Modo VPS (API JWT)
    if (isApiConfigured) {
      const token = getAdminToken()
      if (!token) {
        setLoading(false)
        return () => { mounted = false }
      }
      apiFetch('/auth/me')
        .then((me) => {
          if (!mounted) return
          setUser(localUserFromAdmin(me))
          setProfile(localProfileFromAdmin(me))
          setSession({ access_token: token } as Session)
        })
        .catch(() => {
          setAdminToken(null)
          if (mounted) {
            setUser(null)
            setProfile(null)
            setSession(null)
          }
        })
        .finally(() => {
          if (mounted) setLoading(false)
        })
      return () => { mounted = false }
    }

    if (!isSupabaseConfigured) {
      setLoading(false)
      return () => { mounted = false }
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) await fetchProfile(session.user.id)
      else setProfile(null)
      if (mounted) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user) await fetchProfile(nextSession.user.id)
      else setProfile(null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signUp(email: string, password: string, fullName: string) {
    if (isApiConfigured) throw new Error('Cadastro público desabilitado no modo VPS')
    if (!isSupabaseConfigured) throw new Error('Supabase não configurado')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        is_admin: false,
      })
    }
  }

  async function signIn(email: string, password: string) {
    if (isApiConfigured) {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setAdminToken(data.token)
      setUser(localUserFromAdmin(data.user))
      setProfile(localProfileFromAdmin(data.user))
      setSession({ access_token: data.token } as Session)
      return
    }
    if (!isSupabaseConfigured) {
      throw new Error('Configure VITE_API_URL (VPS) ou VITE_SUPABASE_URL')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const { data } = await supabase.auth.getUser()
    if (data.user) await fetchProfile(data.user.id)
  }

  async function signOut() {
    if (isApiConfigured) {
      setAdminToken(null)
      setUser(null)
      setProfile(null)
      setSession(null)
      return
    }
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
    setProfile(null)
  }

  async function updateProfile(data: Partial<Profile>) {
    if (isApiConfigured) throw new Error('Perfil via API ainda não suportado')
    if (!user) throw new Error('Not authenticated')
    const { error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) throw error
    setProfile(prev => prev ? { ...prev, ...data } : null)
  }

  async function resetPassword(email: string) {
    if (isApiConfigured) throw new Error('Reset de senha: altere ADMIN_PASSWORD na VPS')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw error
  }

  const isAdmin = profile?.is_admin ?? false

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isAdmin,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
