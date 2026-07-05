import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, FileText, Mic, Music, Clapperboard, Subtitles, Download, Sparkles } from 'lucide-react'
import FilmStrip, { type FilmStage } from './FilmStrip'

const STAGES: FilmStage[] = [
  { icon: Sparkles, label: 'Prompt', time: '00:00' },
  { icon: FileText, label: 'Script', time: '00:04' },
  { icon: Mic, label: 'Voice', time: '00:11' },
  { icon: Music, label: 'Music', time: '00:19' },
  { icon: Clapperboard, label: 'Video', time: '00:27' },
  { icon: Subtitles, label: 'Subtitles', time: '00:41' },
  { icon: Download, label: 'Export', time: '00:48' },
]

const PROMPT = 'a 45-second explainer about why cats sleep so much, warm documentary tone'

function useTypewriter(text: string, speed = 28) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    setOut('')
    setDone(false)
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return { out, done }
}

function RenderConsole() {
  const { out, done } = useTypewriter(PROMPT)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!done) return
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length)
    }, 900)
    return () => clearInterval(id)
  }, [done])

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-premium w-full max-w-md">
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 font-mono text-[11px] text-slate-500">creator-pro — new-project</span>
      </div>

      <div className="font-mono text-[13px] leading-relaxed">
        <p className="text-slate-500">$ generate --prompt</p>
        <p className="text-slate-200 mt-1 min-h-[3.2em]">
          "{out}
          <span className="inline-block w-[2px] h-[1em] bg-cyan-400 align-middle ml-0.5 animate-pulse" />"
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/60">
        {done ? (
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            rendering — stage {stage + 1}/7 · {STAGES[stage].label.toLowerCase()}
          </div>
        ) : (
          <div className="text-[11px] font-mono text-slate-600">waiting for prompt…</div>
        )}
        <div className="progress-bar mt-2">
          <div
            className="progress-bar-fill"
            style={{ width: done ? `${((stage + 1) / STAGES.length) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative pt-16 pb-10 md:pt-24 md:pb-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 rounded-full text-xs text-slate-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            One prompt, seven stages, one finished video
          </div>

          <h1 className="font-display font-bold text-[2.5rem] leading-[1.08] md:text-6xl md:leading-[1.05] tracking-tight text-white">
            Type a video.
            <br />
            <span className="gradient-text-cyan">Get a video.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-md leading-relaxed">
            AI Creator Pro turns a single prompt into a scripted, narrated, scored and subtitled video —
            no camera, no mic, no timeline to drag.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="gradient-btn-primary flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl"
            >
              Start creating free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#workflow" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-2 py-3">
              <span className="w-9 h-9 rounded-full glass-card flex items-center justify-center">
                <Play className="w-3.5 h-3.5 ml-0.5" />
              </span>
              <span className="text-sm font-medium">See the pipeline</span>
            </a>
          </div>

          <p className="mt-8 text-xs text-slate-500">No credit card required · 100 free credits every month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center md:justify-end"
        >
          <RenderConsole />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto mt-16"
      >
        <FilmStrip stages={STAGES} />
      </motion.div>
    </section>
  )
}
