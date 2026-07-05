import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface FilmStage {
  icon: LucideIcon
  label: string
  time: string
}

/**
 * The pipeline strip is the page's signature element: a literal filmstrip
 * where each frame is a real stage of the render pipeline (Prompt → Script →
 * Voice → Music → Video → Subtitles → Export), timestamped like a render
 * timeline rather than numbered like a generic feature list.
 */
export default function FilmStrip({
  stages,
  active,
}: {
  stages: FilmStage[]
  active?: number
}) {
  return (
    <div className="relative">
      <div className="h-3 sprocket-rail opacity-40 rounded-t-md" />
      <div className="flex items-stretch gap-3 py-4 overflow-x-auto no-scrollbar">
        {stages.map((stage, i) => {
          const Icon = stage.icon
          const isActive = active === i
          return (
            <div key={stage.label} className="flex items-center gap-3 shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={`film-frame flex flex-col items-center justify-center gap-1.5 w-[92px] h-[92px] shrink-0 transition-colors ${
                  isActive ? 'border-cyan-400/40 shadow-glow-cyan' : ''
                }`}
              >
                <span className="font-mono text-[10px] text-slate-500 tracking-wide">{stage.time}</span>
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-300'}`} />
                <span className="text-[11px] font-medium text-slate-300 text-center leading-tight px-1">
                  {stage.label}
                </span>
              </motion.div>
              {i < stages.length - 1 && (
                <div className="w-6 h-px bg-gradient-to-r from-cyan-500/40 to-indigo-500/40 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
      <div className="h-3 sprocket-rail opacity-40 rounded-b-md" />
    </div>
  )
}
