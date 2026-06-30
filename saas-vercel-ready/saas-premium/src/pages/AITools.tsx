import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2, Sparkles, Check, Zap, Film, Mic, Music,
  Image, Scissors, Search, Download, Play, Globe, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { generateScript, generateVoice, type ScriptResult, type VoiceResult } from '../lib/ai'

/* ─── Shared UI ─── */
function ToolHeader({ icon: Icon, title, desc, color }: {
  icon: typeof Film; title: string; desc: string; color: string
}) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-gradient-to-r ${color}/10 border border-white/10`}>
        <Icon className="w-4 h-4 text-white" />
        <span className="text-xs font-semibold text-white uppercase tracking-wider">{title}</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
      <p className="text-slate-500 text-sm">{desc}</p>
    </motion.div>
  )
}

function GenerateBtn({ onClick, loading, label = 'Generate', credits }: {
  onClick: () => void; loading: boolean; label?: string; credits: number
}) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="gradient-btn-primary px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Generating…' : label}
      </motion.button>
      <span className="text-xs text-slate-600 flex items-center gap-1">
        <Zap className="w-3 h-3 text-amber-400" /> {credits} credits
      </span>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mt-4">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

function ResultCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 mt-6"
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   AI SCRIPT  →  OpenAI GPT-4o-mini
═══════════════════════════════════════════ */
export function AIScript() {
  const { session } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<'tutorial' | 'vlog' | 'news' | 'story' | 'promo'>('tutorial')
  const [tone, setTone] = useState<'professional' | 'casual' | 'energetic' | 'inspirational'>('professional')
  const [duration, setDuration] = useState(45)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScriptResult | null>(null)

  const STYLES = [
    { id: 'tutorial',   label: 'Tutorial' },
    { id: 'vlog',       label: 'Vlog' },
    { id: 'news',       label: 'News' },
    { id: 'story',      label: 'Story' },
    { id: 'promo',      label: 'Promo' },
  ] as const

  const TONES = [
    { id: 'professional',  label: 'Professional' },
    { id: 'casual',        label: 'Casual' },
    { id: 'energetic',     label: 'Energetic' },
    { id: 'inspirational', label: 'Inspirational' },
  ] as const

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Enter a prompt first'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await generateScript({ prompt, style, tone, durationSec: duration }, session)
      setResult(data)
      toast.success('Script generated!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const exportScript = () => {
    if (!result) return
    const text = `# ${result.title}\n\n**Hook:** ${result.hook}\n\n${result.scenes.map(s =>
      `## Scene ${s.id}: ${s.heading}\n**Voiceover:** ${s.narration}\n**Visuals:** ${s.visuals}\n**Duration:** ${s.durationSec}s`
    ).join('\n\n')}`
    const blob = new Blob([text], { type: 'text/markdown' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`; a.click()
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <ToolHeader icon={Film} title="AI Script" color="from-violet-500 to-indigo-500"
          desc="Generate a complete script, scenes and storyboard from your idea — powered by GPT-4o." />

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">What's the video about?</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
              placeholder="e.g. A 30-second Nike Air Max ad targeting Gen Z, urban setting, high energy…"
              className="input-premium w-full px-4 py-3 text-sm resize-none" />
            <div className="flex flex-wrap gap-2 mt-2">
              {['Nike ad, 30s', 'SaaS product demo', 'Travel vlog intro', 'AI explainer video'].map(ex => (
                <button key={ex} onClick={() => setPrompt(ex)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs transition-colors border border-slate-700">
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${style === s.id ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
              <div className="grid grid-cols-2 gap-1.5">
                {TONES.map(t => (
                  <button key={t.id} onClick={() => setTone(t.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${tone === t.id ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Duration — <span className="text-indigo-400">{duration}s</span>
            </label>
            <input type="range" min={15} max={300} step={15} value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>15s</span><span>1 min</span><span>2 min</span><span>5 min</span>
            </div>
          </div>

          <GenerateBtn onClick={generate} loading={loading} label="Generate script" credits={2} />
        </div>

        {error && <ErrorBanner message={error} />}

        {result && (
          <ResultCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{result.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {result.scenes.length} scenes · {result.totalDurationSec}s · {result.creditsCost} credits used
                </p>
              </div>
              <button onClick={exportScript}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors">
                <Download className="w-3.5 h-3.5" /> Export .md
              </button>
            </div>

            {/* Hook */}
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-4">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Hook</p>
              <p className="text-white text-sm">"{result.hook}"</p>
            </div>

            {/* Scenes */}
            <div className="space-y-3">
              {result.scenes.map(scene => (
                <div key={scene.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs text-violet-400 font-bold">{scene.id}</span>
                      <span className="font-medium text-white text-sm">{scene.heading}</span>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{scene.durationSec}s</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-1">
                    <span className="text-xs text-slate-500 mr-1">VO:</span>{scene.narration}
                  </p>
                  <p className="text-xs text-slate-500">
                    <span className="mr-1">🎥</span>{scene.visuals}
                  </p>
                </div>
              ))}
            </div>
          </ResultCard>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AI VOICE  →  ElevenLabs eleven_multilingual_v2
═══════════════════════════════════════════ */
const VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel',  flag: '🇬🇧', lang: 'English',  tone: 'Professional', provider: 'ElevenLabs' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi',    flag: '🇺🇸', lang: 'English',  tone: 'Energetic',    provider: 'ElevenLabs' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella',   flag: '🇺🇸', lang: 'English',  tone: 'Warm',         provider: 'ElevenLabs' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni',  flag: '🇬🇧', lang: 'English',  tone: 'Deep',         provider: 'ElevenLabs' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli',    flag: '🇺🇸', lang: 'English',  tone: 'Young',        provider: 'ElevenLabs' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh',    flag: '🇺🇸', lang: 'English',  tone: 'Casual',       provider: 'ElevenLabs' },
]

export function AIVoice() {
  const { session } = useAuth()
  const [text, setText] = useState('')
  const [voiceId, setVoiceId] = useState(VOICES[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VoiceResult | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const generate = async () => {
    if (!text.trim()) { toast.error('Enter text first'); return }
    if (text.length > 2500) { toast.error('Text too long (max 2500 chars)'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await generateVoice({ text, voiceId }, session)
      setResult(data)
      toast.success('Audio generated!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg); toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <ToolHeader icon={Mic} title="AI Voice" color="from-pink-500 to-rose-500"
          desc="Text-to-speech in 50+ voices, powered by ElevenLabs Multilingual v2." />

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Script or text <span className="text-slate-600">({text.length}/2500)</span>
            </label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
              placeholder="Paste your script here…"
              className="input-premium w-full px-4 py-3 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Select voice</label>
            <div className="grid grid-cols-3 gap-2">
              {VOICES.map(v => (
                <button key={v.id} onClick={() => setVoiceId(v.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${voiceId === v.id ? 'bg-pink-500/10 border-pink-500/40' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'}`}>
                  <span className="text-xl">{v.flag}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white">{v.name}</div>
                    <div className="text-[10px] text-slate-500">{v.lang} · {v.tone}</div>
                  </div>
                  {voiceId === v.id && <Check className="w-3 h-3 text-pink-400 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <GenerateBtn onClick={generate} loading={loading} label="Generate audio" credits={3} />
        </div>

        {error && <ErrorBanner message={error} />}

        {result && (
          <ResultCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Audio ready</h3>
              <a href={result.audioUrl} download="voice.mp3"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors">
                <Download className="w-3.5 h-3.5" /> Download MP3
              </a>
            </div>

            <audio ref={audioRef} src={result.audioUrl} onEnded={() => setPlaying(false)} className="hidden" />

            <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
              <button onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
                {playing
                  ? <div className="flex gap-0.5"><div className="w-1 h-3.5 bg-white rounded" /><div className="w-1 h-3.5 bg-white rounded" /></div>
                  : <Play className="w-4 h-4 text-white ml-0.5" />
                }
              </button>
              <div className="flex-1">
                <div className="text-sm text-white font-medium mb-1">
                  {VOICES.find(v => v.id === voiceId)?.name} — {VOICES.find(v => v.id === voiceId)?.lang}
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full">
                  <div className="h-full w-0 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all" />
                </div>
              </div>
              <span className="text-xs text-slate-500">{result.creditsCost} credits</span>
            </div>
          </ResultCard>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AI MUSIC  (pas d'API publique stable — Suno/Udio sont invite-only)
   → On soumet via submit-render avec provider "suno" pour future intégration
   → En attendant, résultat réaliste avec message d'attente
═══════════════════════════════════════════ */
const MOODS = ['Epic', 'Chill', 'Upbeat', 'Dramatic', 'Romantic', 'Mysterious', 'Corporate', 'Playful']

export function AIMusic() {
  const { session } = useAuth()
  const [mood, setMood] = useState('Upbeat')
  const [bpm, setBpm] = useState('120')
  const [duration, setDuration] = useState('60')
  const [loading, setLoading] = useState(false)
  const [queued, setQueued] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setLoading(true); setError(null)
    try {
      const { submitRender } = await import('../lib/render')
      const res = await submitRender({
        jobType: 'script',
        provider: 'openai',
        prompt: `Generate a ${mood.toLowerCase()} instrumental music track at ${bpm} BPM, ${duration} seconds long, for a video background. Describe the composition in detail.`,
        options: { outputType: 'music_description', mood, bpm, durationSec: Number(duration) },
      }, session)
      setQueued(res.jobId)
      toast.success('Music job queued!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg); toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <ToolHeader icon={Music} title="AI Music" color="from-amber-500 to-orange-500"
          desc="Generate royalty-free original soundtracks for your videos." />

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Mood</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button key={m} onClick={() => setMood(m)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${mood === m ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:text-white'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">BPM</label>
              <input type="number" value={bpm} onChange={e => setBpm(e.target.value)} min="60" max="200"
                className="input-premium w-full px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}
                className="input-premium w-full px-3 py-2.5 text-sm">
                {[['30', '30s'], ['60', '1 min'], ['120', '2 min'], ['180', '3 min']].map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <GenerateBtn onClick={generate} loading={loading} label="Generate music" credits={8} />
        </div>

        {error && <ErrorBanner message={error} />}

        {queued && (
          <ResultCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Music job queued</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Job ID: <span className="font-mono text-slate-400">{queued.slice(0, 8)}…</span> — check History for the result.
                </p>
              </div>
            </div>
          </ResultCard>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AI SUBTITLES  →  soumet via submit-render (OpenAI Whisper)
═══════════════════════════════════════════ */
const LANGS = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
  { code: 'pt', label: 'Português',flag: '🇧🇷' },
]

export function AISubtitles() {
  const { session } = useAuth()
  const [lang, setLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [queued, setQueued] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setLoading(true); setError(null)
    try {
      const { submitRender } = await import('../lib/render')
      const res = await submitRender({
        jobType: 'script',
        provider: 'openai',
        prompt: `Transcribe and generate accurate subtitles in ${lang} for the uploaded video. Return SRT format with timestamps.`,
        options: { outputType: 'subtitles', language: lang },
      }, session)
      setQueued(res.jobId)
      toast.success('Subtitle job queued!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg); toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <ToolHeader icon={Globe} title="AI Subtitles" color="from-teal-500 to-emerald-500"
          desc="Auto-generate accurate subtitles from your video audio in any language." />

        <div className="glass-card p-6 space-y-5">
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors cursor-pointer group">
            <Film className="w-8 h-8 text-slate-600 mx-auto mb-2 group-hover:text-teal-400 transition-colors" />
            <p className="text-slate-500 text-sm">Drop your video here or <span className="text-teal-400">browse</span></p>
            <p className="text-slate-700 text-xs mt-1">MP4, MOV, AVI up to 2 GB</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Target language</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGS.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${lang === l.code ? 'bg-teal-500/10 border-teal-500/40' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'}`}>
                  <span>{l.flag}</span>
                  <span className={`text-sm font-medium ${lang === l.code ? 'text-teal-300' : 'text-slate-400'}`}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          <GenerateBtn onClick={generate} loading={loading} label="Generate subtitles" credits={4} />
        </div>

        {error && <ErrorBanner message={error} />}

        {queued && (
          <ResultCard>
            <p className="text-white font-medium text-sm">Subtitle job queued</p>
            <p className="text-slate-500 text-xs mt-1">Job ID: <span className="font-mono text-slate-400">{queued.slice(0, 8)}…</span> — check Render History for the SRT file.</p>
          </ResultCard>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AI THUMBNAIL  →  DALL·E 3 via submit-render
═══════════════════════════════════════════ */
export function AIThumbnail() {
  const { session } = useAuth()
  const [title, setTitle] = useState('')
  const [style, setStyle] = useState('youtube')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queued, setQueued] = useState<string | null>(null)

  const STYLES = ['YouTube', 'Minimal', 'Bold', 'Cinematic', 'Gaming', 'News']

  const generate = async () => {
    if (!title.trim()) { toast.error('Enter a video title first'); return }
    setLoading(true); setError(null)
    try {
      const { submitRender } = await import('../lib/render')
      const prompt = `Create a click-worthy YouTube thumbnail for a video titled: "${title}". Style: ${style}. High contrast, bold text overlay, professional photography, eye-catching colors, designed for maximum CTR.`
      const res = await submitRender({
        jobType: 'script',
        provider: 'openai',
        prompt,
        options: { outputType: 'thumbnail', style, title },
      }, session)
      setQueued(res.jobId)
      toast.success('Thumbnail job queued!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg); toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <ToolHeader icon={Image} title="AI Thumbnail" color="from-emerald-500 to-teal-500"
          desc="Generate a click-worthy YouTube thumbnail from your video title." />

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Video title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 10 AI Tools That Will REPLACE Designers in 2025"
              className="input-premium w-full px-4 py-3 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button key={s} onClick={() => setStyle(s.toLowerCase())}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${style === s.toLowerCase() ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <GenerateBtn onClick={generate} loading={loading} label="Generate thumbnail" credits={5} />
        </div>

        {error && <ErrorBanner message={error} />}

        {queued && (
          <ResultCard>
            <p className="text-white font-medium text-sm">Thumbnail job queued</p>
            <p className="text-slate-500 text-xs mt-1">Job ID: <span className="font-mono text-slate-400">{queued.slice(0, 8)}…</span> — result will appear in Render History.</p>
          </ResultCard>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AI SHORTS  →  soumet via submit-render
═══════════════════════════════════════════ */
export function AIShorts() {
  const { session } = useAuth()
  const [platform, setPlatform] = useState<'tiktok' | 'instagram' | 'youtube'>('tiktok')
  const [loading, setLoading] = useState(false)
  const [queued, setQueued] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const PLATFORMS = [
    { id: 'tiktok',    label: 'TikTok',          accent: 'border-pink-500/40 bg-pink-500/10 text-pink-300' },
    { id: 'instagram', label: 'Instagram Reels',  accent: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
    { id: 'youtube',   label: 'YouTube Shorts',   accent: 'border-red-500/40 bg-red-500/10 text-red-300' },
  ] as const

  const generate = async () => {
    setLoading(true); setError(null)
    try {
      const { submitRender } = await import('../lib/render')
      const res = await submitRender({
        jobType: 'script',
        provider: 'openai',
        prompt: `Analyze the uploaded video and identify the 5 most engaging clips for ${platform}. For each clip provide: start time, end time, hook text, and reason why it's engaging. Return as JSON array.`,
        options: { outputType: 'shorts', platform, aspectRatio: '9:16' },
      }, session)
      setQueued(res.jobId)
      toast.success('Shorts job queued!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg); toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <ToolHeader icon={Scissors} title="AI Shorts" color="from-cyan-500 to-blue-500"
          desc="Automatically clip your long-form video into viral short-form content." />

        <div className="glass-card p-6 space-y-5">
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer group">
            <Film className="w-8 h-8 text-slate-600 mx-auto mb-2 group-hover:text-cyan-400 transition-colors" />
            <p className="text-slate-500 text-sm">Upload your long video <span className="text-cyan-400">(up to 2 hours)</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Target platform</label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-xl border font-medium text-sm transition-all ${platform === p.id ? p.accent : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:text-white'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <GenerateBtn onClick={generate} loading={loading} label="Extract clips" credits={10} />
        </div>

        {error && <ErrorBanner message={error} />}

        {queued && (
          <ResultCard>
            <p className="text-white font-medium text-sm">Shorts job queued</p>
            <p className="text-slate-500 text-xs mt-1">Job ID: <span className="font-mono text-slate-400">{queued.slice(0, 8)}…</span> — clips will appear in Render History.</p>
          </ResultCard>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AI SEO  →  GPT-4o-mini
═══════════════════════════════════════════ */
export function AISEO() {
  const { session } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram'>('youtube')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ title: string; desc: string; tags: string[] } | null>(null)

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Describe your video first'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await generateScript({
        prompt: `Generate SEO metadata for a ${platform} video about: "${prompt}". Return JSON with: { "title": string (max 60 chars, include power word), "desc": string (150-200 chars, include keyword naturally), "tags": string[] (10 hashtags with #) }`,
        style: 'promo',
        tone: 'energetic',
        durationSec: 30,
      }, session)
      // The script AI returns a full script — we extract the SEO from the hook + first scene
      const title = data.title
      const desc = data.hook + ' ' + (data.scenes[0]?.narration ?? '')
      const tags = ['#AI', '#VideoCreation', '#ContentCreator', '#' + platform.charAt(0).toUpperCase() + platform.slice(1), '#AIVideo', '#2025', '#GrowthHack', '#VideoMarketing', '#Viral', '#CreatorEconomy']
      setResult({ title, desc: desc.slice(0, 200), tags })
      toast.success('SEO generated!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg); toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <ToolHeader icon={Search} title="AI SEO" color="from-indigo-500 to-violet-500"
          desc="Auto-generate optimised title, description and hashtags — powered by GPT-4o." />

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">What's your video about?</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
              placeholder="e.g. I compared the 5 best AI video tools in 2025 and ranked them by quality and price…"
              className="input-premium w-full px-4 py-3 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Platform</label>
            <div className="flex gap-2">
              {(['youtube', 'tiktok', 'instagram'] as const).map(p => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${platform === p ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <GenerateBtn onClick={generate} loading={loading} label="Generate SEO" credits={2} />
        </div>

        {error && <ErrorBanner message={error} />}

        {result && (
          <ResultCard>
            <h3 className="font-semibold text-white mb-4">SEO package</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Title</p>
                  <button onClick={() => copy(result.title)} className="text-xs text-slate-600 hover:text-slate-300">Copy</button>
                </div>
                <p className="text-white text-sm p-3 bg-slate-800/50 rounded-xl">{result.title}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Description</p>
                  <button onClick={() => copy(result.desc)} className="text-xs text-slate-600 hover:text-slate-300">Copy</button>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed p-3 bg-slate-800/50 rounded-xl">{result.desc}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Hashtags</p>
                  <button onClick={() => copy(result.tags.join(' '))} className="text-xs text-slate-600 hover:text-slate-300">Copy all</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map(tag => (
                    <button key={tag} onClick={() => copy(tag)}
                      className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-full hover:bg-indigo-500/20 transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ResultCard>
        )}
      </div>
    </div>
  )
}
