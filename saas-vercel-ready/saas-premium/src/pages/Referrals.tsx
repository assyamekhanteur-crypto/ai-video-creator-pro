import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, Copy, Check, Gift, TrendingUp, Link2, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { applyReferral } from '../lib/render'

interface ReferralRow {
  id: string
  referral_code: string
  referred_user_id: string | null
  status: 'pending' | 'completed' | 'rewarded'
  credits_awarded: number
  created_at: string
  completed_at: string | null
}

function genCode(email: string): string {
  const base = email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const rnd = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${base || 'CREATOR'}${rnd}`.slice(0, 12)
}

export default function Referrals() {
  const { user, profile, session, refreshProfile } = useAuth()
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [myCode, setMyCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [applyCode, setApplyCode] = useState('')
  const [applying, setApplying] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { toast.error(error.message); return }
    setReferrals((data ?? []) as unknown as ReferralRow[])
    if (data && data.length > 0) {
      setMyCode((data[0] as ReferralRow).referral_code)
    } else {
      // Create a referral code for this user
      const code = genCode(user.email ?? 'creator')
      const { data: inserted, error: insErr } = await supabase
        .from('referrals')
        .insert({ referrer_user_id: user.id, referral_code: code, status: 'pending' })
        .select()
        .maybeSingle()
      if (insErr) {
        // Maybe a code was created in a race; try fetching again
        toast.error(insErr.message)
      } else if (inserted) {
        setMyCode((inserted as ReferralRow).referral_code)
      }
    }
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const referralLink = myCode ? `${window.location.origin}/register?ref=${myCode}` : ''
  const completedCount = referrals.filter(r => r.status === 'completed' || r.status === 'rewarded').length
  const totalEarned = referrals.reduce((s, r) => s + r.credits_awarded / 2, 0) // referrer gets half; both get 50

  const handleCopy = async () => {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApply = async () => {
    if (!applyCode.trim() || applying) return
    setApplying(true)
    const res = await applyReferral(applyCode.trim(), session)
    setApplying(false)
    if (res.success) {
      toast.success(res.message)
      setApplyCode('')
      await refreshProfile()
    } else {
      toast.error(res.message)
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><Users className="w-6 h-6 text-white" /></div>
          Affiliation
        </h1>
        <p className="text-slate-400 mt-2">Invite creators and both earn 50 credits when they sign up.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3"><Users className="w-5 h-5 text-cyan-400" /></div>
          <div className="text-2xl font-bold">{completedCount}</div>
          <div className="text-xs text-slate-400 mt-1">Successful referrals</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3"><Gift className="w-5 h-5 text-amber-400" /></div>
          <div className="text-2xl font-bold">{totalEarned}</div>
          <div className="text-xs text-slate-400 mt-1">Credits earned</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
          <div className="text-2xl font-bold">{profile?.credits ?? 0}</div>
          <div className="text-xs text-slate-400 mt-1">Current balance</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><Link2 className="w-4 h-4 text-cyan-400" /> Your referral link</h3>
          <p className="text-xs text-slate-500 mb-4">Share this link with creators you want to invite.</p>
          <div className="flex items-center gap-2">
            <input readOnly value={referralLink} className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300" />
            <button onClick={handleCopy} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
          </div>
          <div className="mt-3 text-xs text-slate-500">Your code: <code className="text-cyan-400 font-mono">{myCode ?? '—'}</code></div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2 text-amber-400"><Sparkles className="w-4 h-4" /> Have a referral code?</h3>
          <p className="text-xs text-slate-400 mb-4">Apply a code from another creator and both earn 50 credits.</p>
          <div className="flex items-center gap-2">
            <input value={applyCode} onChange={e => setApplyCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-500" />
            <button onClick={handleApply} disabled={!applyCode.trim() || applying} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center gap-2">
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />} Apply
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Your referrals</h3>
        {referrals.length === 0 ? (
          <p className="text-slate-500 text-sm">No referrals yet. Share your link to start earning credits!</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-400 border-b border-slate-800">
                <tr><th className="text-left py-2 px-2">Code</th><th className="text-left py-2 px-2">Status</th><th className="text-right py-2 px-2">Credits</th><th className="text-left py-2 px-2">Date</th></tr>
              </thead>
              <tbody>
                {referrals.map(r => (
                  <tr key={r.id} className="border-b border-slate-800/50">
                    <td className="py-3 px-2 font-mono text-cyan-400">{r.referral_code}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${r.status === 'completed' || r.status === 'rewarded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{r.status}</span>
                    </td>
                    <td className="py-3 px-2 text-right text-amber-400 font-medium">{r.credits_awarded / 2}</td>
                    <td className="py-3 px-2 text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
