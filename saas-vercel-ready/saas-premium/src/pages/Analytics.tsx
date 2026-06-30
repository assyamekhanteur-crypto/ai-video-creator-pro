import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Zap, Film, Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { RenderJob } from '../lib/render'

interface DayBucket {
  date: string
  label: string
  jobs: number
  credits: number
}

interface ProviderStat {
  provider: string
  count: number
}

export default function Analytics() {
  const { user, profile } = useAuth()
  const [jobs, setJobs] = useState<RenderJob[]>([])
  const [events, setEvents] = useState<Array<{ event_type: string; credits_delta: number; created_at: string; properties: Record<string, unknown> }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('render_jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(500),
      supabase.from('analytics_events').select('event_type, credits_delta, created_at, properties').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1000),
    ]).then(([jobsRes, evRes]) => {
      setJobs((jobsRes.data ?? []) as unknown as RenderJob[])
      setEvents((evRes.data ?? []) as unknown as typeof events)
      setLoading(false)
    })
  }, [user])

  const totalCredits = events.filter(e => e.credits_delta < 0).reduce((s, e) => s + Math.abs(e.credits_delta), 0)
  const refundedCredits = events.filter(e => e.credits_delta > 0 && e.event_type !== 'referral_reward').reduce((s, e) => s + e.credits_delta, 0)
  const completed = jobs.filter(j => j.status === 'completed').length
  const failed = jobs.filter(j => j.status === 'failed').length
  const successRate = jobs.length > 0 ? Math.round(completed / (completed + failed) * 100) : 0

  // Build last-14-days bucket
  const buckets: DayBucket[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const dayJobs = jobs.filter(j => j.created_at.slice(0, 10) === iso)
    buckets.push({
      date: iso,
      label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      jobs: dayJobs.length,
      credits: events.filter(e => e.credits_delta < 0 && e.created_at.slice(0, 10) === iso).reduce((s, e) => s + Math.abs(e.credits_delta), 0),
    })
  }
  const maxJobs = Math.max(...buckets.map(b => b.jobs), 1)
  const maxCredits = Math.max(...buckets.map(b => b.credits), 1)

  // Provider breakdown
  const providerStats: ProviderStat[] = Object.entries(
    jobs.reduce((acc, j) => { acc[j.provider] = (acc[j.provider] ?? 0) + 1; return acc }, {} as Record<string, number>)
  ).map(([provider, count]) => ({ provider, count })).sort((a, b) => b.count - a.count)

  const cards = [
    { label: 'Credits Remaining', value: profile?.credits ?? 0, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Renders', value: jobs.length, icon: Film, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Credits Spent', value: totalCredits, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Success Rate', value: `${successRate}%`, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  if (loading) {
    return <div className="h-full flex items-center justify-center text-slate-500">Loading analytics...</div>
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><BarChart3 className="w-6 h-6 text-white" /></div>
          Analytics
        </h1>
        <p className="text-slate-400 mt-2">Your usage over the last 14 days</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}><c.icon className={`w-5 h-5 ${c.color}`} /></div>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-xs text-slate-400 mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-1">Renders per day</h3>
          <p className="text-xs text-slate-500 mb-6">Job activity over the last 14 days</p>
          <div className="flex items-end gap-1 h-48">
            {buckets.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex-1 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(b.jobs / maxJobs) * 100}%` }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t hover:from-cyan-500 hover:to-cyan-300 transition-colors relative"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">{b.jobs}</div>
                  </motion.div>
                </div>
                <span className="text-xs text-slate-500 rotate-0">{b.label.split(' ')[0].slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold mb-1">By Provider</h3>
          <p className="text-xs text-slate-500 mb-6">Render distribution</p>
          {providerStats.length === 0 ? (
            <p className="text-slate-500 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {providerStats.map(p => {
                const pct = Math.round(p.count / jobs.length * 100)
                return (
                  <div key={p.provider}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize">{p.provider}</span>
                      <span className="text-xs text-slate-400">{p.count} · {pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
        <h3 className="font-semibold mb-1">Credits spent per day</h3>
        <p className="text-xs text-slate-500 mb-6">Includes refunds: {refundedCredits} credits refunded on failures</p>
        <div className="flex items-end gap-1 h-32">
          {buckets.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex-1 flex items-end">
                <motion.div initial={{ height: 0 }} animate={{ height: `${(b.credits / maxCredits) * 100}%` }} transition={{ delay: i * 0.03, duration: 0.4 }} className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t" />
              </div>
              <span className="text-xs text-slate-500">{b.label.split(' ')[0].slice(0, 2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
