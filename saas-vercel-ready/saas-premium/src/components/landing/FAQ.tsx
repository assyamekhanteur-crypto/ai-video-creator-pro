import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const QA = [
  {
    q: 'Do I need any video editing experience?',
    a: 'No. The prompt drives the whole pipeline. You can open the editor afterward to fine-tune the script, timing or voice, but nothing requires it.',
  },
  {
    q: 'What are credits and how do they work?',
    a: 'Credits are spent per generation step — script, voice, music, video render. Each plan includes a monthly allowance, and unused credits roll over for one month.',
  },
  {
    q: 'Who owns the videos I generate?',
    a: 'You do. Exported videos are yours to publish, monetize or reuse without attribution, on every plan including Starter.',
  },
  {
    q: 'Which platforms can I publish to?',
    a: 'YouTube, TikTok, Instagram, Facebook, LinkedIn, X and Pinterest are supported for direct or scheduled publishing from Autopilot.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, from Billing in the dashboard. You keep access and remaining credits through the end of the paid period.',
  },
  {
    q: 'Do you support Arabic and French voices?',
    a: 'Yes — voice generation covers Arabic, French and English natively, alongside a wider multilingual library.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="px-6 py-24 md:py-32 border-t border-slate-800/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">FAQ</span>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl tracking-tight text-white">
            Questions, answered
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {QA.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-white">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
