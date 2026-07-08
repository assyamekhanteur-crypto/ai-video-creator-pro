import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, Trash2, Loader2, Save, AlertTriangle, LogOut, CreditCard, Key, Plus, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type Tab = 'profile' | 'security' | 'billing' | 'api-keys' | 'danger'

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'billing', label: 'Subscription', icon: CreditCard },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

const PROVIDERS: { id: string; label: string; placeholder: string; helpUrl: string }[] = [
  { id: 'openai', label: 'OpenAI', placeholder: 'sk-...', helpUrl: 'https://platform.openai.com/api-keys' },
  { id: 'elevenlabs', label: 'ElevenLabs', placeholder: 'Your API key', helpUrl: 'https://elevenlabs.io/app/settings/api-keys' },
  { id: 'runway', label: 'Runway', placeholder: 'Your API key', helpUrl: 'https://dev.runwayml.com' },
  { id: 'kling', label: 'Kling', placeholder: 'Your bearer token', helpUrl: 'https://klingai.com' },
  { id: 'google', label: 'Google Veo', placeholder: 'AIza...', helpUrl: 'https://aistudio.google.com/apikey' },
]

export default function Settings() {
  const { user, profile, signOut, refreshProfile, session } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('profile')

  // Profile tab
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  // Security tab
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  // API keys tab
  const [apiKeys, setApiKeys] = useState<{ provider: string; masked_preview: string; updated_at: string }[]>([])
  const [loadingKeys, setLoadingKeys] = useState(true)
  const [keyDrafts, setKeyDrafts] = useState<Record<string, string>>({})
  const [savingProvider, setSavingProvider] = useState<string | null>(null)

  // Danger zone
  const [confirmDelete, setConfirmDelete] = useState('')
  const [deleting, setDeleting] = useState(false)

  const apiKeysUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-api-keys`
  const authHeaders = () => ({
    Authorization: `Bearer ${session?.access_token}`,
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  })

  useEffect(() => {
    if (tab !== 'api-keys' || !session) return
    setLoadingKeys(true)
    fetch(apiKeysUrl, { headers: authHeaders() })
      .then(res => res.json())
      .then(data => setApiKeys(data.keys ?? []))
      .catch(() => toast.error('Could not load API keys'))
      .finally(() => setLoadingKeys(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, session])

  const handleSaveKey = async (provider: string) => {
    const value = (keyDrafts[provider] ?? '').trim()
    if (!value) return
    setSavingProvider(provider)
    try {
      const res = await fetch(apiKeysUrl, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey: value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save key')
      setApiKeys(prev => [...prev.filter(k => k.provider !== provider), { provider, masked_preview: data.maskedPreview, updated_at: new Date().toISOString() }])
      setKeyDrafts(prev => ({ ...prev, [provider]: '' }))
      toast.success(`${PROVIDERS.find(p => p.id === provider)?.label} key saved — future generations use it, no credits charged`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save key')
    } finally {
      setSavingProvider(null)
    }
  }

  const handleRemoveKey = async (provider: string) => {
    setSavingProvider(provider)
    try {
      const res = await fetch(`${apiKeysUrl}?provider=${provider}`, { method: 'DELETE', headers: authHeaders() })
      if (!res.ok) throw new Error('Failed to remove key')
      setApiKeys(prev => prev.filter(k => k.provider !== provider))
      toast.success('Key removed — platform credits will be used again')
    } catch {
      toast.error('Failed to remove key')
    } finally {
      setSavingProvider(null)
    }
  }

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSavingProfile(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName.trim() || null }).eq('id', user.id)
    setSavingProfile(false)
    if (error) { toast.error('Could not save profile'); return }
    await refreshProfile()
    toast.success('Profile updated')
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }

    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) { toast.error(error.message); return }
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Password updated')
  }

  const handleDeleteAccount = async () => {
    if (confirmDelete !== (user?.email ?? '')) {
      toast.error('Type your email exactly to confirm')
      return
    }
    setDeleting(true)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to delete account')
      toast.success('Account deleted')
      navigate('/login')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Settings</h1>
        <p className="text-slate-400 text-sm mb-8">Manage your account and preferences</p>

        <div className="flex items-center gap-1 mb-8 border-b border-slate-800">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                  <input value={user?.email ?? ''} disabled className="input-premium w-full opacity-60 cursor-not-allowed" />
                  <p className="text-xs text-slate-600 mt-1">Contact support to change your email</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="input-premium w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="gradient-btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                >
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save changes
                </button>
              </form>
            </motion.div>
          )}

          {tab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Change password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="input-premium w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="input-premium w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="gradient-btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                >
                  {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Update password
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}

          {tab === 'billing' && (
            <motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Current plan</p>
                  <p className="text-xl font-bold text-white capitalize">{profile?.subscription_tier ?? 'free'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Credits remaining</p>
                  <p className="text-xl font-bold text-white">{profile?.credits.toLocaleString() ?? 0}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/billing')}
                className="gradient-btn-primary px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
              >
                Manage subscription
              </button>
            </motion.div>
          )}

          {tab === 'api-keys' && (
            <motion.div key="api-keys" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-1">Your own API keys</h2>
              <p className="text-sm text-slate-400 mb-6">
                Add your own provider keys to generate with them instead of the platform's — <span className="text-cyan-400">no credits are charged</span> when your own key is used. Keys are encrypted and never shown again after saving.
              </p>

              {loadingKeys ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-slate-500" /></div>
              ) : (
                <div className="space-y-4">
                  {PROVIDERS.map(p => {
                    const existing = apiKeys.find(k => k.provider === p.id)
                    return (
                      <div key={p.id} className="border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{p.label}</span>
                          {existing && (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                              <Check className="w-3.5 h-3.5" /> Active — {existing.masked_preview}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            value={keyDrafts[p.id] ?? ''}
                            onChange={e => setKeyDrafts(prev => ({ ...prev, [p.id]: e.target.value }))}
                            placeholder={existing ? 'Replace key…' : p.placeholder}
                            className="input-premium flex-1 py-2 text-sm"
                          />
                          <button
                            onClick={() => handleSaveKey(p.id)}
                            disabled={savingProvider === p.id || !(keyDrafts[p.id] ?? '').trim()}
                            className="gradient-btn-primary px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                          >
                            {savingProvider === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            {existing ? 'Replace' : 'Add'}
                          </button>
                          {existing && (
                            <button
                              onClick={() => handleRemoveKey(p.id)}
                              disabled={savingProvider === p.id}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <a href={p.helpUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-slate-400 mt-1.5 inline-block">
                          Get a {p.label} key →
                        </a>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'danger' && (
            <motion.div key="danger" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-6 border-red-500/20">
              <h2 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Delete account
              </h2>
              <p className="text-sm text-slate-400 mb-5">
                This permanently deletes your account, projects, and generated media. This cannot be undone.
              </p>
              <div className="max-w-md space-y-3">
                <label className="block text-sm text-slate-400">
                  Type <span className="text-white font-medium">{user?.email}</span> to confirm
                </label>
                <input
                  value={confirmDelete}
                  onChange={e => setConfirmDelete(e.target.value)}
                  placeholder={user?.email ?? ''}
                  className="input-premium w-full"
                />
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || confirmDelete !== user?.email}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Permanently delete my account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
