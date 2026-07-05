import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Wand2, ChevronRight, ChevronLeft, Check,
  Sparkles, Zap, Film, Mic, Palette, Download,
  Play, Loader2, AlertCircle, FolderOpen, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { generateScript, generateVoice, generateVideo, checkVideoStatus, type ScriptResult } from '../lib/ai'
import { supabase } from '../lib/supabase'

/* ─── Types ─── */
type StepId = 'prompt' | 'model' | 'voice' | 'style' | 'render'

/* ─── Constants ─── */
const STEPS: { id: StepId; label: string; icon: typeof Wand2 }[] = [
  { id: 'prompt', label: 'Prompt',  icon: Sparkles },
  { id: 'model',  label: 'Model',   icon: Zap },
  { id: 'voice',  label: 'Voice',   icon: Mic },
  { id: 'style',  label: 'Style',   icon: Palette },
  { id: 'render', label: 'Render',  icon: Film },
]

const AI_MODELS = [
  { id: 'openai',  name: 'GPT-Video',    badge: 'Fast',    logo: '🧠', color: 'from-emerald-500 to-teal-500',   desc: 'Best for tutorials & explainers', credits: 25, provider: 'runway' as const },
  { id: 'runway',  name: 'Runway Gen-4', badge: 'Pro',     logo: '🚀', color: 'from-rose-500 to-pink-500',      desc: 'Hollywood-grade visual effects',  credits: 25, provider: 'runway' as const },
  { id: 'kling',   name: 'Kling 2.0',   badge: 'Viral',   logo: '⚡', color: 'from-violet-500 to-purple-500',  desc: 'Optimised for social media',      credits: 40, provider: 'kling'  as const },
  { id: 'google',  name: 'Veo 3',        badge: 'Quality', logo: '🎬', color: 'from-blue-500 to-indigo-500',    desc: "Google's cinematic AI model",     credits: 50, provider: 'google' as const },
  { id: 'pika',    name: 'Pika 2.2',    badge: 'Creative',logo: '🎨', color: 'from-amber-500 to-orange-500',   desc: 'Stylised & artistic videos',      credits: 25, provider: 'runway' as const },
  { id: 'luma',    name: 'Luma Dream',  badge: '3D',      logo: '✨', color: 'from-cyan-500 to-sky-500',       desc: 'Photorealistic 3D scenes',        credits: 25, provider: 'runway' as const },
]

const VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', flag: '🇬🇧', lang: 'English',  tone: 'Professional' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi',   flag: '🇺🇸', lang: 'English',  tone: 'Energetic' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella',  flag: '🇺🇸', lang: 'English',  tone: 'Warm' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', flag: '🇬🇧', lang: 'English',  tone: 'Deep' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli',   flag: '🇺🇸', lang: 'English',  tone: 'Young' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh',   flag: '🇺🇸', lang: 'English',  tone: 'Casual' },
]

const STYLES = [
  { id: 'cinematic',   name: 'Cinematic',    thumb: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=300&h=170&fit=crop' },
  { id: 'social',      name: 'Social Media', thumb: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=300&h=170&fit=crop' },
  { id: 'corporate',   name: 'Corporate',    thumb: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=300&h=170&fit=crop' },
  { id: 'vlog',        name: 'Vlog',         thumb: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&w=300&h=170&fit=crop' },
  { id: 'documentary', name: 'Documentary',  thumb: 'https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&w=300&h=170&fit=crop' },
  { id: 'anime',       name: 'Anime',        thumb: 'https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg?auto=compress&w=300&h=170&fit=crop' },
]

/* ─── Render Step types ─── */
type RenderPhase = 'script' | 'voice' | 'video' | 'done' | 'error'

interface RenderState {
  phase: RenderPhase
  scriptResult: ScriptResult | null
  audioUrl: string | null
  videoJobId: string | null
  videoProviderJobId: string | null
  videoUrl: string | null
  projectId: string | null
  error: string | null
}

/* ─── Step indicator ─── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all
              ${active  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300' :
                done    ? 'text-slate-400' : 'text-slate-600'}`}>
              {done
                ? <Check className="w-4 h-4 text-indigo-400" />
                : <s.icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-600'}`} />
              }
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-px mx-1 ${done ? 'bg-indigo-500/40' : 'bg-slate-800'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Real-time render tracker ─── */
function RenderTracker({
  renderState, prompt, modelName
}: {
  renderState: RenderState
  prompt: string
  modelName: string
}) {
  const phases: { key: RenderPhase | 'voice'; label: string }[] = [
    { key: 'script', label: 'Writing script & storyboard' },
    { key: 'voice',  label: 'Generating voiceover' },
    { key: 'video',  label: 'Rendering AI video frames' },
    { key: 'done',   label: 'Finalising & uploading' },
  ]

  const phaseOrder: (RenderPhase | 'voice')[] = ['script', 'voice', 'video', 'done']
  const currentIdx = phaseOrder.indexOf(renderState.phase === 'error' ? 'done' : renderState.phase)

  return (
    <div className="flex flex-col items-center py-6">
      {/* Animated icon */}
      <div className="relative w-20 h-20 mb-6">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow-cyan
          ${renderState.phase === 'error'
            ? 'bg-gradient-to-br from-red-500 to-rose-600'
            : 'bg-gradient-to-br from-indigo-500 to-cyan-500 animate-pulse-slow'}`}>
          {renderState.phase === 'error'
            ? <AlertCircle className="w-9 h-9 text-white" />
            : <Wand2 className="w-9 h-9 text-white" />
          }
        </div>
        {renderState.phase !== 'done' && renderState.phase !== 'error' && (
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30 animate-ping" />
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-1">
        {renderState.phase === 'error' ? 'Generation failed' :
         renderState.phase === 'done'  ? 'Done!' : 'Generating your video'}
      </h3>
      <p className="text-slate-500 text-sm mb-6 text-center max-w-sm">
        "{prompt.slice(0, 60)}{prompt.length > 60 ? '…' : ''}" · {modelName}
      </p>

      {/* Phase list */}
      <div className="w-full max-w-xs space-y-2 mb-6">
        {phases.map(({ key, label }) => {
          const idx = phaseOrder.indexOf(key)
          const isDone = idx < currentIdx || renderState.phase === 'done'
          const isActive = idx === currentIdx && renderState.phase !== 'done' && renderState.phase !== 'error'
          const isFailed = renderState.phase === 'error' && idx === currentIdx
          return (
            <div key={key} className={`flex items-center gap-3 transition-opacity ${isDone || isActive ? 'opacity-100' : 'opacity-25'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                ${isFailed   ? 'bg-red-500/20 border border-red-500/40' :
                  isDone     ? 'bg-emerald-500/20 border border-emerald-500/40' :
                  isActive   ? 'bg-indigo-500/20 border border-indigo-500/40' :
                               'bg-slate-800 border border-slate-700'}`}>
                {isFailed   ? <AlertCircle className="w-3 h-3 text-red-400" />  :
                 isDone     ? <Check className="w-3 h-3 text-emerald-400" />     :
                 isActive   ? <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" /> :
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                }
              </div>
              <span className={`text-sm ${isActive ? 'text-white font-medium' : isDone ? 'text-slate-500' : 'text-slate-700'}`}>
                {label}
              </span>
              {isActive && <span className="text-xs text-indigo-400 ml-auto shimmer-text">In progress…</span>}
            </div>
          )
        })}
      </div>

      {/* Error detail */}
      {renderState.error && (
        <div className="w-full max-w-xs p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {renderState.error}
        </div>
      )}
    </div>
  )
}

/* ─── Main component ─── */
export default function Create() {
  const { session, user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [prompt, setPrompt]       = useState('')
  const [modelId, setModelId]     = useState('runway')
  const [voiceId, setVoiceId]     = useState(VOICES[0].id)
  const [styleId, setStyleId]     = useState('cinematic')
  const [renderState, setRenderState] = useState<RenderState>({
    phase: 'script', scriptResult: null, audioUrl: null,
    videoJobId: null, videoProviderJobId: null, videoUrl: null, projectId: null, error: null,
  })

  const selectedModel = AI_MODELS.find(m => m.id === modelId)!
  const selectedVoice = VOICES.find(v => v.id === voiceId)!

  /* Poll video job status — this actually asks the provider (via checkVideoStatus)
     whether the render is done, since ai_jobs starts and stays 'processing'
     until the provider confirms completion. */
  useEffect(() => {
    if (!renderState.videoJobId || renderState.phase === 'done' || renderState.phase === 'error') return
    const interval = setInterval(async () => {
      try {
        const result = await checkVideoStatus(renderState.videoJobId!, session)
        if (result.status === 'completed') {
          setRenderState(s => ({ ...s, phase: 'done', videoUrl: result.resultUrl }))
          clearInterval(interval)
        } else if (result.status === 'failed') {
          setRenderState(s => ({ ...s, phase: 'error', error: result.error ?? 'Video generation failed' }))
          clearInterval(interval)
        }
      } catch {
        // transient network/provider hiccup — try again on the next tick
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [renderState.videoJobId, renderState.phase, session])

  const next = () => {
    if (step === 0 && !prompt.trim()) { toast.error('Enter a prompt first'); return }
    if (step < STEPS.length - 2) { setStep(s => s + 1) }
    else startRender()
  }
  const back = () => setStep(s => Math.max(0, s - 1))

  const startRender = async () => {
    setStep(4)
    setRenderState({ phase: 'script', scriptResult: null, audioUrl: null, videoJobId: null, videoProviderJobId: null, videoUrl: null, projectId: null, error: null })

    try {
      /* ⓪ Create the project row this generation will attach to */
      let projectId: string | null = null
      if (user) {
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert({ user_id: user.id, name: prompt.slice(0, 60) || 'Untitled project', status: 'draft' })
          .select('id')
          .single()
        if (!projectError && project) projectId = project.id
      }
      setRenderState(s => ({ ...s, projectId }))

      /* ① Script */
      const scriptData = await generateScript({
        prompt,
        style: styleId as 'tutorial',
        tone: 'professional',
        durationSec: 30,
      }, session)
      setRenderState(s => ({ ...s, phase: 'voice', scriptResult: scriptData }))

      /* ② Voice — concat all scene narrations */
      const fullNarration = scriptData.scenes.map(sc => sc.narration).join(' ')
      const voiceData = await generateVoice({ text: fullNarration, voiceId, projectId: projectId ?? undefined }, session)
      setRenderState(s => ({ ...s, phase: 'video', audioUrl: voiceData.audioUrl }))

      /* ③ Video */
      const videoData = await generateVideo({
        prompt: `${prompt}. Visual style: ${styleId}. ${scriptData.scenes[0]?.visuals ?? ''}`,
        provider: selectedModel.provider,
        durationSec: 5,
        aspectRatio: '16:9',
        projectId: projectId ?? undefined,
      }, session)
      setRenderState(s => ({
        ...s,
        videoJobId: videoData.jobId,
        videoProviderJobId: videoData.providerJobId,
        // For openai provider, may complete quickly
        phase: videoData.status === 'completed' ? 'done' : 'video',
      }))

    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setRenderState(s => ({ ...s, phase: 'error', error: msg }))
      toast.error(msg)
    }
  }

  const isDone = renderState.phase === 'done'
  const isError = renderState.phase === 'error'

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Video Wizard</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create a video</h1>
          <p className="text-slate-500 text-sm mt-1">Describe your idea — AI handles the rest.</p>
        </motion.div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
          >

            {/* STEP 0 — Prompt */}
            {step === 0 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-1 text-white">What's your video about?</h2>
                <p className="text-slate-500 text-sm mb-5">The more detail you give, the better the result.</p>
                <textarea
                  value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="Example: A 30-second Nike Air Max ad targeting Gen Z, with a cinematic look, urban setting, and high energy hip-hop vibes."
                  rows={5} className="input-premium w-full px-4 py-3 text-sm resize-none leading-relaxed"
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Nike ad, urban, 30s', 'Product demo for a SaaS app', 'Travel vlog intro', 'YouTube explainer about AI'].map(ex => (
                    <button key={ex} onClick={() => setPrompt(ex)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs transition-colors border border-slate-700">
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1 — Model */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Choose your AI model</h2>
                <p className="text-slate-500 text-sm mb-5">Each model has different strengths.</p>
                <div className="grid grid-cols-2 gap-3">
                  {AI_MODELS.map(m => (
                    <motion.div key={m.id} whileHover={{ y: -2 }} onClick={() => setModelId(m.id)}
                      className={`model-card p-4 cursor-pointer ${modelId === m.id ? 'selected' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-lg`}>{m.logo}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{m.badge}</span>
                          {modelId === m.id && <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />}
                        </div>
                      </div>
                      <div className="font-semibold text-white mb-0.5 text-sm">{m.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{m.desc}</div>
                      <div className="flex items-center gap-1 text-xs text-amber-400"><Zap className="w-3 h-3" /> {m.credits} credits</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Voice */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Choose a voice</h2>
                <p className="text-slate-500 text-sm mb-5">Powered by ElevenLabs Multilingual v2.</p>
                <div className="grid grid-cols-2 gap-3">
                  {VOICES.map(v => (
                    <motion.div key={v.id} whileHover={{ y: -1 }} onClick={() => setVoiceId(v.id)}
                      className={`model-card p-4 cursor-pointer flex items-center gap-3 ${voiceId === v.id ? 'selected' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">{v.flag}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm">{v.name}</div>
                        <div className="text-xs text-slate-500">{v.lang} · {v.tone}</div>
                      </div>
                      {voiceId === v.id && <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)] flex-shrink-0" />}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 — Style */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">Choose a visual style</h2>
                <p className="text-slate-500 text-sm mb-5">Sets the look and feel of your video.</p>
                <div className="grid grid-cols-3 gap-3">
                  {STYLES.map(s => (
                    <motion.div key={s.id} whileHover={{ y: -2 }} onClick={() => setStyleId(s.id)}
                      className={`model-card overflow-hidden cursor-pointer ${styleId === s.id ? 'selected' : ''}`}>
                      <div className="relative aspect-video overflow-hidden">
                        <img src={s.thumb} alt={s.name} className="w-full h-full object-cover" />
                        {styleId === s.id && (
                          <div className="absolute inset-0 bg-indigo-500/25 flex items-center justify-center">
                            <Check className="w-6 h-6 text-indigo-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <div className="font-semibold text-white text-xs">{s.name}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 — Render */}
            {step === 4 && (
              <div className="glass-card p-6">
                {!isDone && !isError && (
                  <RenderTracker
                    renderState={renderState}
                    prompt={prompt}
                    modelName={selectedModel.name}
                  />
                )}

                {isError && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Generation failed</h3>
                    <p className="text-red-400 text-sm mb-2 max-w-sm mx-auto">{renderState.error}</p>
                    <p className="text-slate-600 text-xs mb-6">Your credits have been automatically refunded.</p>
                    <button onClick={() => setStep(0)}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-white transition-colors">
                      ← Try again
                    </button>
                  </div>
                )}

                {isDone && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Video ready! 🎉</h3>
                    <p className="text-slate-500 text-sm mb-2">Script, voiceover and video have all finished generating.</p>
                    {renderState.videoUrl && (
                      <video src={renderState.videoUrl} controls className="w-full max-w-md mx-auto rounded-xl my-4 bg-black" />
                    )}
                    {renderState.audioUrl && (
                      <div className="flex items-center justify-center gap-2 mb-6">
                        <Play className="w-4 h-4 text-emerald-400" />
                        <a href={renderState.audioUrl} target="_blank" rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 text-sm underline flex items-center gap-1">
                          Preview voiceover <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-3">
                      {renderState.audioUrl && (
                        <a href={renderState.audioUrl} download="voiceover.mp3">
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="gradient-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2">
                            <Download className="w-4 h-4" /> Download audio
                          </motion.button>
                        </a>
                      )}
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/render-history')}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition-colors">
                        <FolderOpen className="w-4 h-4" /> View in history
                      </motion.button>
                      {renderState.projectId && (
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => navigate(`/editor/${renderState.projectId}`)}
                          className="gradient-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2">
                          <Play className="w-4 h-4" /> Open in editor
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        {step < 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mt-6">
            <button onClick={back} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {/* Selection summary pill */}
            {step > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {step >= 2 && <span className="px-2 py-1 bg-slate-800 rounded-full">{selectedModel.name}</span>}
                {step >= 3 && <span className="px-2 py-1 bg-slate-800 rounded-full">{selectedVoice.name}</span>}
              </div>
            )}

            <motion.button onClick={next} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="gradient-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2">
              {step === STEPS.length - 2
                ? <><Sparkles className="w-4 h-4" /> Generate video</>
                : <>Next <ChevronRight className="w-4 h-4" /></>
              }
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
  )
}
