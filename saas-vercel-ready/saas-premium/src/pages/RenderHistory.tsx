import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw, FileText, Mic, Clapperboard, Download } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { parseScriptResult, type RenderJob, type RenderStatus } from '../lib/render'
import toast from 'react-hot-toast'

const STATUS_STYLES: Record<RenderStatus, { color: string; bg: string; icon: typeof Clock }> = {
  queued: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: Clock },
  processing: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: Loader2 },
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle },
  failed: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: XCircle },
  cancelled: { color: 'text-slate-400', bg: 'bg-slate-700/30 border-slate-700', icon: AlertCircle },
}

const JOB_ICONS: Record<string, typeof FileText> = {
  script: FileText,
  voice: Mic,
  video: Clapperboard,
  export: Download,
}

export default function RenderHistory() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<RenderJob[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<RenderStatus | 'all'>('all')

  const fetchJobs = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('render_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      toast.error(error.message)
      return
    }
    setJobs((data ?? []) as unknown as RenderJob[])
  }, [user])

  useEffect(() => {
    fetchJobs().finally(() => setLoading(false))
  }, [fetchJobs])

  // Live polling when any job is queued or processing
  useEffect(() => {
    const hasActive = jobs.some(j => j.status === 'queued' || j.status === 'processing')
    if (!hasActive) return
    const i = setInterval(fetchJobs, 3000)
    return () => clearInterval(i)
  }, [jobs, fetchJobs])

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)
  const stats = {
    total: jobs.length,
    queued: jobs.filter(j => j.status === 'queued').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  }

  const StatBadge = ({ status, label }: { status: RenderStatus; label: string }) => (
    <button onClick={() => setFilter(filter === status ? 'all' : status)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-colors ${filter === status ? STATUS_STYLES[status].bg : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
      <span className={STATUS_STYLES[status].color}>{stats[status as keyof typeof stats] ?? 0}</span>
      <span>{label}</span>
    </button>
  )

  return (
    <div className="h-full overflow-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="w-7 h-7 text-cyan-400" /> Render History
          </h1>
          <p className="text-slate-400 mt-1">Track every render, with status, retries, and detailed errors.</p>
        </div>
        <button onClick={() => { setLoading(true); fetchJobs().finally(() => setLoading(false)) }} className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors text-sm">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <StatBadge status="queued" label="Queued" />
        <StatBadge status="processing" label="Processing" />
        <StatBadge status="completed" label="Completed" />
        <StatBadge status="failed" label="Failed" />
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${filter === 'all' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}`}>All ({stats.total})</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Clock className="w-12 h-12 mb-3 opacity-40" />
          <p>No renders yet.</p>
          <Link to="/ai-pipeline" className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm">Create your first AI video →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job, i) => {
            const status = STATUS_STYLES[job.status]
            const StatusIcon = status.icon
            const JobIcon = JOB_ICONS[job.job_type] ?? FileText
            const parsed = job.job_type === 'script' ? parseScriptResult(job.result_text) : null
            return (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }} className={`bg-slate-900 border rounded-xl p-4 ${status.bg}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${status.bg}`}>
                    <JobIcon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium capitalize">{job.job_type}</span>
                      <span className="text-xs text-slate-500">· {job.provider}</span>
                      <span className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                        {job.status}
                        {job.attempt > 1 && job.status !== 'completed' && <span className="text-slate-500 ml-1">(attempt {job.attempt}/{job.max_attempts})</span>}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">{job.prompt || '(empty prompt)'}</p>
                    {job.status === 'failed' && job.error_message && (
                      <div className="mt-2 p-2 bg-red-500/5 border border-red-500/20 rounded text-xs text-red-400">
                        <span className="font-mono text-red-500">[{job.error_code ?? 'ERROR'}]</span> {job.error_message}
                      </div>
                    )}
                    {job.status === 'completed' && parsed && (
                      <div className="mt-2 p-2 bg-cyan-500/5 border border-cyan-500/20 rounded text-xs">
                        <div className="font-medium text-cyan-300">{parsed.title}</div>
                        <div className="text-cyan-400 mt-0.5">"{parsed.hook}"</div>
                        <div className="text-slate-500 mt-1">{parsed.scenes.length} scenes · {parsed.scenes.reduce((s, sc) => s + sc.durationSec, 0)}s total</div>
                      </div>
                    )}
                    {job.status === 'completed' && job.result_url && job.job_type !== 'script' && (
                      <div className="mt-2">
                        {job.job_type === 'voice' && <audio controls src={job.result_url} className="w-full max-w-md h-9" />}
                        {(job.job_type === 'video' || job.job_type === 'export') && (
                          <a href={job.result_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300">
                            <Download className="w-3.5 h-3.5" /> View result
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-500">{new Date(job.created_at).toLocaleString()}</div>
                    <div className="text-xs text-amber-400 mt-1 flex items-center justify-end gap-1">
                      <span className="font-medium">{job.credits_cost}</span> credits
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
