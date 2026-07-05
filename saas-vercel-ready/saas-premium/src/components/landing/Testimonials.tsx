import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const QUOTES = [
  {
    quote:
      'We went from one video a week to one a day without hiring an editor. The AI script step alone saves us most of the time.',
    name: 'Sami R.',
    role: 'YouTube educator, 210K subscribers',
  },
  {
    quote:
      'The voice quality is what sold me — my audience genuinely can\u2019t tell it\u2019s synthetic. Subtitles sync better than the editor I used to pay for.',
    name: 'Lina M.',
    role: 'Content lead, D2C skincare brand',
  },
  {
    quote:
      'Autopilot keeps our product channel publishing while we focus on the actual product. It\u2019s the closest thing to a full-time editor on our team.',
    name: 'Youssef B.',
    role: 'Founder, small e-commerce studio',
  },
]

export default function Testimonials() {
  return (
    <section className="px-6 py-24 md:py-32 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-pink-400">Creators</span>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl tracking-tight text-white">
            Built for people who publish, not just edit
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {QUOTES.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass-card rounded-2xl p-6 flex flex-col"
            >
              <Quote className="w-5 h-5 text-slate-600 mb-4" />
              <blockquote className="text-sm text-slate-300 leading-relaxed flex-1">"{t.quote}"</blockquote>
              <figcaption className="mt-5 pt-5 border-t border-slate-800/60">
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
