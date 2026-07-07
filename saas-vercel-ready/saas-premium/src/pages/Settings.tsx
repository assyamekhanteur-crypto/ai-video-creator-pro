import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, Trash2, Loader2, Save, AlertTriangle, LogOut, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type Tab = 'profile' | 'security' | 'billing' | 'danger'

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'billing', label: 'Subscription', icon: CreditCard },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
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

  // Danger zone
  const [confirmDelete, setConfirmDelete] = useState('')
  const [deleting, setDeleting] = useState(false)

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
