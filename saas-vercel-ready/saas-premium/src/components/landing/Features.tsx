import { motion } from 'framer-motion'
import {
  Wand2, Mic2, Music4, Subtitles, Image as ImageIcon, Scissors, Search, Rocket,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Wand2,
    title: 'Script that sounds like you',
    desc: 'Describe the video in a sentence. The AI writes a full script with pacing, hooks and a natural spoken rhythm — editable line by line.',
  },
  {
    icon: Mic2,
    title: 'Studio-quality voiceover',
    desc: 'Dozens of AI voices across languages and tones, including Arabic and French, with adjustable pace and emphasis.',
  },
  {
    icon: Music4,
    title: 'Score that matches the mood',
    desc: 'Background music is generated to fit the tone of your script and automatically ducks under narration.',
  },
  {
    icon: Subtitles,
    title: 'Auto-synced subtitles',
    desc: 'Burned-in or exportable captions, timed to the voiceover, styled to match your brand.',
  },
  {
    icon: ImageIcon,
    title: 'Thumbnails in seconds',
    desc: 'Generate scroll-stopping thumbnails and titles from the same prompt, tuned per platform.',
  },
  {
    icon: Scissors,
    title: 'Shorts from long-form',
    desc: 'Automatically clip the strongest 15–60 second moments for TikTok, Reels and Shorts.',
  },
  {
    icon: Search,
    title: 'SEO built in',
    desc: 'Titles, descriptions, tags and chapters generated to match how people actually search.',
  },
  {
    icon: Rocket,
    title: 'Autopilot ideas',
    desc: 'Queue a week of AI-written scripts and turn each one into a real project in one click.',
  },
]

export default function Features() {
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Everything, generated</span>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl tracking-tight text-white">
            Every part of the video, made by AI — you keep the say
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            AI Creator Pro doesn't just render clips. It handles the writing, the voice, the music and the
            distribution copy, and hands you a full edit at every step.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 4) * 0.06, duration: 0.4 }}
                className="glass-card rounded-2xl p-5 hover:border-slate-700/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 border border-slate-700/50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-display font-semibold text-[15px] text-white leading-snug">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
