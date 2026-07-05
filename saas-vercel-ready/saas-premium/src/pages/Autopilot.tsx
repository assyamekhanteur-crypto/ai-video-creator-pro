import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Sparkles, RefreshCw, Calendar, ChevronDown, Loader2, FolderPlus, Film } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { generateScript, type ScriptResult } from '../lib/ai'

const DAY_THEMES: { label: string; prompt: string; style: 'tutorial' | 'vlog' | 'news' | 'story' | 'promo' }[] = [
  { label: 'Monday',    prompt: 'A quick educational tip related to my niche',            style: 'tutorial' },
  { label: 'Tuesday',   prompt: 'A behind-the-scenes look at how I work',                 style: 'vlog' },
  { label: 'Wednesday', prompt: 'A myth-busting video about a common misconception',       style: 'tutorial' },
  { label: 'Thursday',  prompt: 'A personal story about a lesson I learned',               style: 'story' },
  { label: 'Friday',    prompt: 'A recap of something trending this week',                 style: 'news' },
  { label: 'Saturday',  prompt: 'A fun, casual video to end the week',                      style: 'vlog' },
  { label: 'Sunday',    prompt: 'A promo video teasing what is coming next week',           style: 'promo' },
]

const CREDITS_PER_SCRIPT = 2

interface DayEntry {
  day: number
  label: string
  date: string
  status: 'idle' | 'generating' | 'ready' | 'error'
  script: ScriptResult | null
  projectId: string | null
  error?: string
}

const initialWeek = (): DayEntry[] =>
  DAY_THEMES.map((t, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      day: i + 1,
      label: t.label,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'idle',
      script: null,
      projectId: null,
    }
  })

export default function Autopilot() {
  const { session, user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [week, setWeek] = useState<DayEntry[]>(initialWeek)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const readyCount = week.filter(d => d.status === 'ready').length
  const totalScenes = week.reduce((sum, d) => sum + (d.script?.scenes.length ?? 0), 0)

  const generateWeek = async () => {
    setIsGenerating(true)
    setWeek(w => w.map(d => ({ ...d, status: 'generating' as const })))

    for (let i = 0; i < DAY_THEMES.length; i++) {
      const theme = DAY_THEMES[i]
      try {
        const script = await generateScript({ prompt: theme.prompt, style: theme.style, tone: 'casual', durationSec: 30 }, session)
        setWeek(w => w.map(d => d.day === i + 1 ? { ...d, status: 'ready', script } : d))
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Generation failed'
        setWeek(w => w.map(d => d.day === i + 1 ? { ...d, status: 'error', error: msg } : d))
        // If we're out of credits there's no point burning through the rest of the week
        if (msg.toLowerCase().includes('credit')) {
          toast.error('Out of credits — stopped early')
          break
        }
      }
    }

    setIsGenerating(false)
    await refreshProfile()
  }

  const createProject = async (entry: DayEntry) => {
    if (!user || !entry.script) return
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: user.id, name: entry.script.title, status: 'draft' })
      .select('id')
      .single()
    if (error || !data) { toast.error('Could not create project'); return }
    setWeek(w => w.map(d => d.day === entry.day ? { ...d, projectId: data.id } : d))
    return data.id as string
  }

  const openInEditor = async (entry: DayEntry) => {
    const id = entry.projectId ?? await createProject(entry)
    if (id) navigate(`/editor/${id}`)
  }

  const createAllProjects = async () => {
    const readyDays = week.filter(d => d.status === 'ready' && !d.projectId)
    if (readyDays.length === 0) { toast.error('Generate the week first'); return }
    for (const entry of readyDays) await createProject(entry)
    toast.success(`${readyDays.length} project${readyDays.length > 1 ? 's' : ''} created`)
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Rocket className="w-6 h-6 text-white" /></div>
            Autopilot Ideas
          </h1>
          <p className="text-slate-400 mt-2 text-sm">A week of AI-written scripts, ready to turn into real projects — {CREDITS_PER_SCRIPT * 7} credits for the full week.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={generateWeek}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg font-medium text-white hover:border-slate-600 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {readyCount > 0 ? 'Regenerate' : 'Generate week'}
          </motion.button>
          <motion.button
            onClick={createAllProjects}
            disabled={readyCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-40"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <FolderPlus className="w-4 h-4" />Create all as projects
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2"><Sparkles className="w-5 h-5 text-cyan-400" /><span className="text-slate-400 text-sm">Scripts ready</span></div>
          <div className="text-2xl font-bold text-white">{readyCount} / 7</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2"><Film className="w-5 h-5 text-emerald-400" /><span className="text-slate-400 text-sm">Total scenes</span></div>
          <div className="text-2xl font-bold text-white">{totalScenes}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2"><FolderPlus className="w-5 h-5 text-violet-400" /><span className="text-slate-400 text-sm">Projects created</span></div>
          <div className="text-2xl font-bold text-white">{week.filter(d => d.projectId).length}</div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {week.map((entry, i) => (
            <motion.div key={entry.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} layout className="glass-card overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => entry.script && setExpandedDay(expandedDay === entry.day ? null : entry.day)}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-amber-400" />
                </div>
                <div className="w-24 shrink-0">
                  <div className="text-sm font-medium text-white">{entry.label}</div>
                  <div className="text-xs text-slate-500">{entry.date}</div>
                </div>

                <div className="flex-1 min-w-0">
                  {entry.status === 'idle' && <p className="text-sm text-slate-600">Not generated yet</p>}
                  {entry.status === 'generating' && (
                    <p className="text-sm text-slate-400 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Writing script…</p>
                  )}
                  {entry.status === 'error' && <p className="text-sm text-red-400 truncate">{entry.error}</p>}
                  {entry.status === 'ready' && entry.script && (
                    <>
                      <h3 className="font-medium text-white truncate">{entry.script.title}</h3>
                      <p className="text-sm text-slate-400 truncate">{entry.script.hook}</p>
                    </>
                  )}
                </div>

                {entry.status === 'ready' && entry.script && (
                  <div className="text-center w-20 shrink-0">
                    <div className="text-lg font-semibold text-white">{entry.script.scenes.length}</div>
                    <div className="text-xs text-slate-500">Scenes</div>
                  </div>
                )}

                {entry.projectId && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">Project created</span>
                )}

                {entry.script && (
                  <motion.div animate={{ rotate: expandedDay === entry.day ? 180 : 0 }} className="shrink-0">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {expandedDay === entry.day && entry.script && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-800">
                    <div className="p-6 grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Opening hook</h4>
                        <p className="text-cyan-400 font-medium mb-4">{entry.script.hook}</p>
                        <h4 className="text-sm font-medium text-white mb-2">Scenes</h4>
                        <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                          {entry.script.scenes.map(scene => (
                            <li key={scene.id}><span className="text-slate-300">{scene.heading}:</span> {scene.narration}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="flex flex-col justify-center gap-3">
                        <button
                          onClick={() => openInEditor(entry)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                        >
                          <Film className="w-4 h-4" /> {entry.projectId ? 'Open in editor' : 'Create project & open editor'}
                        </button>
                        <p className="text-xs text-slate-500 text-center">
                          This creates a project from the script. Generate voice/video for it from the AI tools, then assemble in the editor.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
