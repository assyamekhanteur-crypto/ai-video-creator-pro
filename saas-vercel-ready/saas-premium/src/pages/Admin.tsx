import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, Loader2, ShieldCheck, Zap, TrendingUp, AlertTriangle, Search, Gift, Ban, CheckCircle, BarChart3, AlertCircle, Mail, XCircle, DatabaseZap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface AdminUser {
  id: string
  email: string
  subscription_tier: string
  credits: number
  is_admin: boolean
  is_suspended: boolean
  created_at: string
}

interface AuditEntry {
  id: string
  admin_user_id: string
  target_user_id: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
}

interface FailedJob {
  id: string
  user_id: string
  job_type: string
  provider: string
  error_message: string | null
  error_code: string | null
  attempt: number
  created_at: string
}

interface FailedEmail {
  id: string
  to_email: string
  subject: string
  template: string
  error_message: string | null
  created_at: string
}

interface GlobalStats {
  totalUsers: number
  proUsers: number
  businessUsers: number
  totalJobs: number
  completedJobs: number
  failedJobs: number
  totalEmailsSent: number
  totalEmailsFailed: number
}

type Tab = 'users' | 'analytics' | 'errors'

export default function Admin() {
  const { profile } = useAuth()
  const isAdmin = profile?.is_admin ?? false
  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [failedJobs, setFailedJobs] = useState<FailedJob[]>([])
  const [failedEmails, setFailedEmails] = useState<FailedEmail[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [grantTarget, setGrantTarget] = useState<{ id: string; email: string } | null>(null)
  const [grantAmount, setGrantAmount] = useState(100)

  const load = useCallback(async () => {
    const [u, a, rj, ej, allJobs, sentEmails] = await Promise.all([
      supabase.from('profiles').select('id, email, subscription_tier, credits, is_admin, is_suspended, created_at').order('created_at', { ascending: false }).limit(200),
      supabase.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('render_jobs').select('id, user_id, job_type, provider, error_message, error_code, attempt, created_at').eq('status', 'failed').order('created_at', { ascending: false }).limit(50),
      supabase.from('email_notifications').select('id, to_email, subject, template, error_message, created_at').eq('status', 'failed').order('created_at', { ascending: false }).limit(50),
      supabase.from('render_jobs').select('status', { count: 'exact' }),
      supabase.from('email_notifications').select('status', { count: 'exact' }),
    ])

    const usersData = (u.data ?? []) as unknown as AdminUser[]
    const jobsData = (allJobs.data ?? []) as Array<{ status: string }>
    const emailsData = (sentEmails.data ?? []) as Array<{ status: string }>

    setUsers(usersData)
    setAudit((a.data ?? []) as unknown as AuditEntry[])
    setFailedJobs((rj.data ?? []) as unknown as FailedJob[])
    setFailedEmails((ej.data ?? []) as unknown as FailedEmail[])
    setGlobalStats({
      totalUsers: usersData.length,
      proUsers: usersData.filter(u => u.subscription_tier === 'pro').length,
      businessUsers: usersData.filter(u => u.subscription_tier === 'business').length,
      totalJobs: jobsData.length,
      completedJobs: jobsData.filter(j => j.status === 'completed').length,
      failedJobs: jobsData.filter(j => j.status === 'failed').length,
      totalEmailsSent: emailsData.filter(e => e.status === 'sent').length,
      totalEmailsFailed: emailsData.filter(e => e.status === 'failed').length,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isAdmin) load().catch(e => toast.error(e.message))
    else setLoading(false)
  }, [isAdmin, load])

  const logAdminAction = async (action: string, targetUserId: string | null, details: Record<string, unknown>) => {
    await supabase.from('admin_audit_log').insert({ action, target_user_id: targetUserId, details })
  }

  const handleGrant = async () => {
    if (!grantTarget || grantAmount <= 0) return
    const { data: u } = await supabase.from('profiles').select('credits').eq('id', grantTarget.id).maybeSingle()
    const cur = (u as { credits: number } | null)?.credits ?? 0
    const { error } = await supabase.from('profiles').update({ credits: cur + grantAmount }).eq('id', grantTarget.id)
    if (error) { toast.error(error.message); return }
    await supabase.from('credit_ledger').insert({ user_id: grantTarget.id, delta: grantAmount, reason: 'topup' })
    await logAdminAction('grant_credits', grantTarget.id, { amount: grantAmount, email: grantTarget.email })
    toast.success(`Granted ${grantAmount} credits to ${grantTarget.email}`)
    setGrantTarget(null)
    setGrantAmount(100)
    load()
  }

  const toggleSuspend = async (u: AdminUser) => {
    const next = !u.is_suspended
    const { error } = await supabase.from('profiles').update({ is_suspended: next }).eq('id', u.id)
    if (error) { toast.error(error.message); return }
    await logAdminAction(next ? 'suspend_user' : 'unsuspend_user', u.id, { email: u.email })
    toast.success(`${next ? 'Suspended' : 'Reactivated'} ${u.email}`)
    load()
  }

  const retryEmail = async (id: string) => {
    const { error } = await supabase.from('email_notifications').update({ status: 'queued', error_message: null }).eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Email re-queued')
    load()
  }

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()))
  const errorCount = failedJobs.length + failedEmails.length

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div>
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Admin access required</h2>
          <p className="text-slate-400 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading admin data...</div>
  }

  const tabs: { id: Tab; label: string; icon: typeof Users; badge?: number }[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'errors', label: 'Error logs', icon: AlertCircle, badge: errorCount > 0 ? errorCount : undefined },
  ]

  return (
    <div className="h-full overflow-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-white" /></div>
          Admin Dashboard
        </h1>
        <p className="text-slate-400 mt-2">Manage users, monitor business metrics, and view error logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
            <t.icon className="w-4 h-4" />
            {t.label}
            {t.badge !== undefined && (
              <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* USERS TAB */}
      {tab === 'users' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: users.length, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'Suspended', value: users.filter(u => u.is_suspended).length, icon: Ban, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { label: 'Admins', value: users.filter(u => u.is_admin).length, icon: ShieldCheck, color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { label: 'Credits Granted', value: audit.filter(a => a.action === 'grant_credits').reduce((s, a) => s + ((a.details.amount as number) ?? 0), 0), icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}><c.icon className={`w-5 h-5 ${c.color}`} /></div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-xs text-slate-400 mt-1">{c.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Users</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email..." className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64" />
                </div>
              </div>
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 border-b border-slate-800">
                    <tr><th className="text-left py-2 px-2">User</th><th className="text-left py-2 px-2">Tier</th><th className="text-right py-2 px-2">Credits</th><th className="text-left py-2 px-2">Status</th><th className="text-right py-2 px-2">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-2">
                          <div className="font-medium">{u.email}</div>
                          {u.is_admin && <span className="text-xs text-violet-400">admin</span>}
                          <div className="text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-2 capitalize">{u.subscription_tier}</td>
                        <td className="py-3 px-2 text-right text-amber-400 font-medium">{u.credits}</td>
                        <td className="py-3 px-2">
                          {u.is_suspended ? <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded">Suspended</span> : <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Active</span>}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setGrantTarget({ id: u.id, email: u.email }); setGrantAmount(100) }} className="p-1.5 hover:bg-slate-800 rounded text-cyan-400" title="Grant credits"><Gift className="w-4 h-4" /></button>
                            <button onClick={() => toggleSuspend(u)} className={`p-1.5 hover:bg-slate-800 rounded ${u.is_suspended ? 'text-emerald-400' : 'text-rose-400'}`} title={u.is_suspended ? 'Reactivate' : 'Suspend'}>{u.is_suspended ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><DatabaseZap className="w-4 h-4 text-cyan-400" /> Storage health</h3>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400 space-y-2">
                <p>Assets are currently being surfaced with a storage-aware health status.</p>
                <p className="text-slate-300">Provider-hosted URLs remain visible for compatibility, but a future migration will re-host them in Supabase Storage for better reliability.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" /> Audit Log</h3>
              {audit.length === 0 ? (
                <p className="text-slate-500 text-sm">No admin actions yet.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-auto">
                  {audit.map(a => (
                    <div key={a.id} className="p-3 bg-slate-800/50 rounded-lg text-xs">
                      <div className="font-medium text-cyan-400">{a.action}</div>
                      <div className="text-slate-400 mt-1">{JSON.stringify(a.details)}</div>
                      <div className="text-slate-600 mt-1">{new Date(a.created_at).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ANALYTICS TAB */}
      {tab === 'analytics' && globalStats && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: globalStats.totalUsers, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'Pro subscribers', value: globalStats.proUsers, icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { label: 'Business subscribers', value: globalStats.businessUsers, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Paid subscribers', value: globalStats.proUsers + globalStats.businessUsers, icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}><c.icon className={`w-5 h-5 ${c.color}`} /></div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-xs text-slate-400 mt-1">{c.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Render jobs breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyan-400" /> Render jobs</h3>
              <div className="space-y-4">
                {[
                  { label: 'Total jobs', value: globalStats.totalJobs, color: 'bg-slate-600' },
                  { label: 'Completed', value: globalStats.completedJobs, color: 'bg-emerald-500' },
                  { label: 'Failed', value: globalStats.failedJobs, color: 'bg-red-500' },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`}
                        style={{ width: `${globalStats.totalJobs > 0 ? Math.round(row.value / globalStats.totalJobs * 100) : 0}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 text-sm text-slate-400">
                  Success rate: <span className="text-emerald-400 font-medium">
                    {globalStats.completedJobs + globalStats.failedJobs > 0
                      ? Math.round(globalStats.completedJobs / (globalStats.completedJobs + globalStats.failedJobs) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Email stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> Email delivery</h3>
              <div className="space-y-4">
                {[
                  { label: 'Sent', value: globalStats.totalEmailsSent, color: 'bg-emerald-500' },
                  { label: 'Failed', value: globalStats.totalEmailsFailed, color: 'bg-red-500' },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`}
                        style={{ width: `${(globalStats.totalEmailsSent + globalStats.totalEmailsFailed) > 0 ? Math.round(row.value / (globalStats.totalEmailsSent + globalStats.totalEmailsFailed) * 100) : 0}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 text-sm text-slate-400">
                  Total emails: <span className="font-medium text-white">{globalStats.totalEmailsSent + globalStats.totalEmailsFailed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Plan distribution</h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Free', count: globalStats.totalUsers - globalStats.proUsers - globalStats.businessUsers, color: 'bg-slate-500' },
                { label: 'Pro ($29/mo)', count: globalStats.proUsers, color: 'bg-cyan-500' },
                { label: 'Business ($99/mo)', count: globalStats.businessUsers, color: 'bg-violet-500' },
              ].map(plan => (
                <div key={plan.label} className="text-center">
                  <div className={`w-12 h-12 rounded-full ${plan.color}/20 border-2 ${plan.color}/50 flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-lg font-bold">{plan.count}</span>
                  </div>
                  <div className="text-sm text-slate-400">{plan.label}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {globalStats.totalUsers > 0 ? Math.round(plan.count / globalStats.totalUsers * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ERRORS TAB */}
      {tab === 'errors' && (
        <div className="space-y-6">
          {/* Failed render jobs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" /> Failed render jobs
              {failedJobs.length > 0 && <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">{failedJobs.length}</span>}
            </h3>
            {failedJobs.length === 0 ? (
              <p className="text-slate-500 text-sm">No failed jobs. 🎉</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="text-left py-2 px-2">Job ID</th>
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-left py-2 px-2">Provider</th>
                      <th className="text-left py-2 px-2">Error</th>
                      <th className="text-left py-2 px-2">Attempts</th>
                      <th className="text-left py-2 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedJobs.map(j => (
                      <tr key={j.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-2 px-2 font-mono text-xs text-slate-400">{j.id.slice(0, 8)}…</td>
                        <td className="py-2 px-2">{j.job_type}</td>
                        <td className="py-2 px-2 text-slate-400">{j.provider}</td>
                        <td className="py-2 px-2 text-red-400 max-w-xs truncate" title={j.error_message ?? ''}>
                          {j.error_code && <span className="text-xs font-mono text-slate-500 mr-2">[{j.error_code}]</span>}
                          {j.error_message ?? '—'}
                        </td>
                        <td className="py-2 px-2 text-center">{j.attempt}</td>
                        <td className="py-2 px-2 text-slate-500 text-xs">{new Date(j.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Failed emails */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-400" /> Failed emails
              {failedEmails.length > 0 && <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">{failedEmails.length}</span>}
            </h3>
            {failedEmails.length === 0 ? (
              <p className="text-slate-500 text-sm">No failed emails. 🎉</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="text-left py-2 px-2">To</th>
                      <th className="text-left py-2 px-2">Template</th>
                      <th className="text-left py-2 px-2">Subject</th>
                      <th className="text-left py-2 px-2">Error</th>
                      <th className="text-left py-2 px-2">Date</th>
                      <th className="text-right py-2 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedEmails.map(e => (
                      <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-2 px-2">{e.to_email}</td>
                        <td className="py-2 px-2 text-slate-400">{e.template}</td>
                        <td className="py-2 px-2 text-slate-400 max-w-xs truncate">{e.subject}</td>
                        <td className="py-2 px-2 text-red-400 text-xs max-w-xs truncate" title={e.error_message ?? ''}>{e.error_message ?? '—'}</td>
                        <td className="py-2 px-2 text-slate-500 text-xs">{new Date(e.created_at).toLocaleString()}</td>
                        <td className="py-2 px-2 text-right">
                          <button onClick={() => retryEmail(e.id)} className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors">
                            Retry
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {grantTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setGrantTarget(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold mb-1">Grant credits</h3>
            <p className="text-sm text-slate-400 mb-4">{grantTarget.email}</p>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input type="number" min={1} value={grantAmount} onChange={e => setGrantAmount(Math.max(1, Number(e.target.value)))} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setGrantTarget(null)} className="flex-1 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700">Cancel</button>
              <button onClick={handleGrant} className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-medium">Grant</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
