import { motion } from 'framer-motion'
import { FileText, Mic, Clapperboard, Subtitles, Download, Sparkles } from 'lucide-react'

const STEPS = [
  {
    time: '00:00',
    icon: Sparkles,
    title: 'Write the prompt',
    desc: 'One sentence: the topic, the tone, the length. That\u2019s the entire brief.',
  },
  {
    time: '00:04',
    icon: FileText,
    title: 'AI writes the script',
    desc: 'A full script with scene breaks and pacing notes, ready to edit inline or approve as-is.',
  },
  {
    time: '00:11',
    icon: Mic,
    title: 'Voice + music generate',
    desc: 'Narration and score render in parallel, matched to the script\u2019s tone and length.',
  },
  {
    time: '00:27',
    icon: Clapperboard,
    title: 'Video assembles',
    desc: 'Scenes, transitions and pacing are composited automatically against the voiceover.',
  },
  {
    time: '00:41',
    icon: Subtitles,
    title: 'Subtitles sync',
    desc: 'Captions are timed word-by-word to the narration and styled to your brand.',
  },
  {
    time: '00:48',
    icon: Download,
    title: 'Export and share',
    desc: 'Download in your target resolution, ready to upload to YouTube, TikTok or Instagram yourself.',
  },
]

export default function Workflow() {
  return (
    <section id="workflow" className="px-6 py-24 md:py-32 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400">The pipeline</span>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl tracking-tight text-white">
            48 seconds from prompt to render
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Every stage runs on its own AI model and reports back into one timeline — this is the actual
            sequence, not a marketing diagram.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-x-10 gap-y-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45 }}
                className="flex gap-4"
              >
                <div className="film-frame w-14 h-14 shrink-0 flex flex-col items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-500">{step.time}</span>
                    <h3 className="font-display font-semibold text-white text-[15px]">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-400 leading-relaxed max-w-sm">{step.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
