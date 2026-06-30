import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface Profile {
  id: string
  email: string
  subscription_tier: 'free' | 'pro' | 'business'
  credits: number
  stripe_customer_id: string | null
  is_admin: boolean
  is_suspended: boolean
  created_at: string
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: string | null; session: Session | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const tierMap = { free: 100, pro: 2000, business: 10000 } as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const ensureProfile = async (userId: string, email: string): Promise<Profile | null> => {
    const { data: existing, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Profile fetch error:', error.message)
      return null
    }
    if (existing) {
      setProfile(existing as Profile)
      return existing as Profile
    }

    const { data: created, error: createErr } = await supabase
      .from('profiles')
      .insert({ id: userId, email, subscription_tier: 'free', credits: tierMap.free })
      .select()
      .maybeSingle()

    if (createErr) {
      console.error('Profile create error:', createErr.message)
      return null
    }
    if (created) {
      await supabase.from('credit_ledger').insert({
        user_id: userId,
        delta: tierMap.free,
        reason: 'signup_bonus',
      })
    }
    setProfile(created as Profile)
    return created as Profile
  }

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) {
      console.error('Profile fetch error:', error.message)
      return null
    }
    setProfile((data as Profile) ?? null)
    return (data as Profile) ?? null
  }

  const refreshProfile = async () => {
    if (session?.user) await fetchProfile(session.user.id)
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      if (data.session?.user) {
        ensureProfile(data.session.user.id, data.session.user.email ?? '').finally(() => {
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      ;(async () => {
        setSession(newSession)
        if (newSession?.user) {
          await ensureProfile(newSession.user.id, newSession.user.email ?? '')
        } else {
          setProfile(null)
        }
        setLoading(false)
      })()
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message, session: null }
    if (data.user) {
      await ensureProfile(data.user.id, email)
      // Trigger welcome email via email_notifications table
      await supabase.from('email_notifications').insert({
        user_id: data.user.id,
        to_email: email,
        template: 'welcome',
        subject: 'Welcome to AI Creator Pro 🎬',
        body: `Hi there,\n\nWelcome to AI Creator Pro! Your account is ready and 100 free credits have been added.\n\nStart creating: ${window.location.origin}\n\nThe AI Creator Pro team`,
        status: 'queued',
      })
    }
    return { error: null, session: data.session }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    if (data.user) {
      await ensureProfile(data.user.id, email)
    }
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
