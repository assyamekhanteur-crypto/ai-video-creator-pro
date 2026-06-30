import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, CheckCircle, Circle, Zap, Clapperboard, Mic, FileText, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { submitRender, parseScriptResult, type SubmitRenderParams } from '../lib/render'

type StageStatus = 'pending' | 'processing' | 'completed' | 'failed'
interface StageState {
  id: 'script' | 'voice' | 'video'
  name: string
  icon: typeof Sparkles
  status: StageStatus
  jobId?: string
  error?: string
}

const PROVIDERS = [
  { id: 'runway' as const, name: 'Runway', badge: 'Gen3 Turbo', color: 'from-pink-500 to-rose-600' },
  { id: 'kling' as const, name: 'Kling AI', badge: 'v1', color: 'from-emerald-500 to-teal-600' },
  { id: 'google' as const, name: 'Google Veo', badge: 'Veo 2.0', color: 'from-amber-500 to-orange-600' },
]

const CREDITS_NEEDED = 15

const initialStages = (): StageState[] => [
  { id: 'script', name: 'Script Generation', icon: FileText, status: 'pending' },
  { id: 'voice', name: 'Voice Synthesis', icon: Mic, status: 'pending' },
  { id: 'video', name: 'Video Generation', icon: Clapperboard, status: 'pending' },
]

function pollJobStatus(supabaseUrl: string, anonKey: string, jobId: string, token: string, onUpdate: (s: StageStatus, error?: string) => void, getResult: (url: string | null, text: string | null) => void): () => void {
  let cancelled = false
  const interval = setInterval(async () => {
    const res = await fetch(`${supabaseUrl}/functions/v1/submit-render?jobId=${jobId}`, {
      headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
    })
    if (!res.ok) return
    const data = await res.json()
    if (cancelled) return
    const status = data.status as StageStatus
    if (status === 'completed') {
      onUpdate('completed')
      getResult(data.result_url, data.result_text)
      clearInterval(interval)
    } else if (status === 'failed') {
      onUpdate('failed', data.error_message)
      clearInterval(interval)
    }
  }, 2500)
  return () => { cancelled = true; clearInterval(interval) }
}

export default function AIPipeline() {
  const { session, refreshProfile, profile } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [provider, setProvider] = useState<'runway' | 'kling' | 'google'>('runway')
  const [tone, setTone] = useState<'professional' | 'casual' | 'energetic' | 'inspirational'>('energetic')
  const [isProcessing, setIsProcessing] = useState(false)
  const [stages, setStages] = useState<StageState[]>(initialStages())
  const [scriptText, setScriptText] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [videoJobId, setVideoJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cancelers = useRef<Array<() => void>>([])

  const updateStage = (id: StageState['id'], status: StageStatus, errorMsg?: string, jobId?: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, status, error: errorMsg, jobId: jobId ?? s.jobId } : s))
  }

  const submitAndPoll = useCallback(async (params: SubmitRenderParams, stageId: StageState['id']) => {
    updateStage(stageId, 'processing')
    const submit = await submitRender(params, session)
    updateStage(stageId, 'processing', undefined, submit.jobId)

    return new Promise<void>((resolve, reject) => {
      const cancel = pollJobStatus(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        submit.jobId,
        session!.access_token,
        (status, err) => {
          if (status === 'failed') {
            updateStage(stageId, 'failed', err ?? 'Unknown error')
            reject(new Error(err ?? `${stageId} failed`))
          }
        },
        (url, text) => {
          updateStage(stageId, 'completed')
          if (stageId === 'script') setScriptText(text)
          if (stageId === 'voice') setAudioUrl(url)
          if (stageId === 'video') setVideoJobId(submit.jobId)
          resolve()
        }
      )
      cancelers.current.push(cancel)
    })
  }, [session])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isProcessing) return
    if ((profile?.credits ?? 0) < CREDITS_NEEDED) {
      toast.error(`Need at least ${CREDITS_NEEDED} credits to run the full pipeline.`)
      return
    }
    setIsProcessing(true)
    setError(null)
    setScriptText(null); setAudioUrl(null); setVideoJobId(null)
    setStages(initialStages())

    try {
      await submitAndPoll(
        { jobType: 'script', prompt: prompt.trim(), options: { tone, durationSec: 45 } },
        'script'
      )
      await refreshProfile()
      const parsed = parseScriptResult(scriptText)
      const narration = parsed ? `${parsed.hook}. ${parsed.scenes.map(s => s.narration).join(' ')}` : prompt
      await submitAndPoll(
        { jobType: 'voice', prompt: narration.slice(0, 4000) },
        'voice'
      )
      await refreshProfile()
      const visuals = parsed?.scenes[0]?.visuals ?? prompt
      await submitAndPoll(
        { jobType: 'video', provider, prompt: `${visuals}. Style: cinematic, ${tone}.`, options: { aspectRatio: '16:9', durationSec: 5 } },
        'video'
      )
      await refreshProfile()
      toast.success('Pipeline complete!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Pipeline failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsProcessing(false)
    }
  }, [prompt, isProcessing, profile, tone, provider, session, refreshProfile, submitAndPoll, scriptText])

  const parsedScript = parseScriptResult(scriptText)

  return (
    <div className="h-full overflow-auto p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            AI Pipeline
          </h1>
          <p className="text-slate-400 mt-2">Generate a complete video from a single prompt — script, voice, and footage queued.</p>
        </div>
        <Link to="/render-history" className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
          Render History <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">Video Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to create... e.g. A 30-second product demo for a smart watch, energetic tone."
              className="w-full h-40 p-4 bg-slate-900 border border-slate-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Tone</label>
            <div className="flex flex-wrap gap-2">
              {(['energetic', 'professional', 'casual', 'inspirational'] as const).map(t => (
                <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize ${tone === t ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Video Provider</label>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setProvider(p.id)} className={`p-3 rounded-lg border transition-all ${provider === p.id ? 'border-cyan-500 bg-slate-800' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} mx-auto mb-2`} />
                  <div className="text-xs font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.badge}</div>
                </button>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isProcessing}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25"
            whileHover={{ scale: isProcessing ? 1 : 1.01 }}
            whileTap={{ scale: isProcessing ? 1 : 0.99 }}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
            ) : (
              <span className="flex items-center justify-center gap-2"><Sparkles className="w-5 h-5" /> Generate Video</span>
            )}
          </motion.button>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Pipeline Progress</h3>
            <div className="space-y-4">
              {stages.map((stage, i) => (
                <motion.div key={stage.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`flex items-center gap-4 p-3 rounded-lg ${stage.status === 'processing' ? 'bg-cyan-500/10 border border-cyan-500/30' : stage.status === 'completed' ? 'bg-emerald-500/10' : stage.status === 'failed' ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-800/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stage.status === 'completed' ? 'bg-emerald-500' : stage.status === 'processing' ? 'bg-cyan-500' : stage.status === 'failed' ? 'bg-red-500' : 'bg-slate-700'}`}>
                    {stage.status === 'completed' ? <CheckCircle className="w-5 h-5 text-white" /> : stage.status === 'processing' ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : stage.status === 'failed' ? <AlertCircle className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium ${stage.status === 'completed' ? 'text-emerald-400' : stage.status === 'processing' ? 'text-cyan-400' : stage.status === 'failed' ? 'text-red-400' : 'text-slate-400'}`}>{stage.name}</span>
                    {stage.status === 'processing' && stage.jobId && <div className="text-xs text-slate-500 mt-0.5">Job {stage.jobId.slice(0, 8)}...</div>}
                    {stage.status === 'failed' && stage.error && <div className="text-xs text-red-500 mt-0.5">{stage.error}</div>}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Zap className="w-3 h-3" />
              <span>Uses ~{CREDITS_NEEDED} credits total (script 2 + voice 3 + video 10). Failed jobs are refunded.</span>
            </div>
          </div>

          {parsedScript && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">{parsedScript.title}</h3>
              <div className="p-3 bg-cyan-500/10 rounded-lg text-sm text-cyan-300 mb-4">"{parsedScript.hook}"</div>
              <div className="space-y-2 max-h-48 overflow-auto">
                {parsedScript.scenes.map(sc => (
                  <div key={sc.id} className="p-2 bg-slate-800/50 rounded text-xs">
                    <div className="font-medium text-slate-300">{sc.heading} <span className="text-slate-500">· {sc.durationSec}s</span></div>
                    <div className="text-slate-400 mt-0.5">{sc.narration}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {audioUrl && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Mic className="w-4 h-4 text-emerald-400" /> Voiceover</h3>
              <audio controls src={audioUrl} className="w-full h-10" />
            </div>
          )}

          {videoJobId && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-emerald-400">Video job submitted</span>
              </div>
              <div className="text-xs text-slate-500">Job ID: {videoJobId.slice(0, 12)}... — track progress in <Link to="/render-history" className="text-cyan-400 hover:underline">Render History</Link>.</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
