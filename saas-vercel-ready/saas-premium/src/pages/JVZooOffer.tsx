import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Film, Check, Wand2, Mic, Video, Captions, LayoutDashboard,
  Store, Key, ShieldCheck,
} from 'lucide-react'
import FilmStrip from '../components/landing/FilmStrip'

const PIPELINE_STAGES = [
  { icon: Wand2, label: 'Prompt', time: '0:00' },
  { icon: Film, label: 'Script', time: '0:04' },
  { icon: Mic, label: 'Voice', time: '0:09' },
  { icon: Video, label: 'Video', time: '0:18' },
  { icon: Captions, label: 'Subtitles', time: '0:24' },
]

const FEATURES = [
  { icon: Wand2, title: 'AI script writing', desc: 'One prompt becomes a full scripted outline — hook, scenes, narration.' },
  { icon: Mic, title: 'Studio-quality voice', desc: 'Natural narration in 10+ languages via ElevenLabs.' },
  { icon: Video, title: 'Text-to-video', desc: 'Choose Runway, Kling, or Google Veo for the visual generation.' },
  { icon: Captions, title: 'Auto-synced captions', desc: 'Real Whisper transcription, timestamped and editable.' },
  { icon: LayoutDashboard, title: 'Timeline editor', desc: 'Drag, trim, split, and arrange clips — a real editor, not a toy.' },
  { icon: Store, title: 'Template marketplace', desc: 'Unlock templates, voices, and effects with credits.' },
  { icon: Key, title: 'Bring your own API keys', desc: 'Use your own OpenAI/ElevenLabs/Runway keys — 0 credits charged when you do.' },
  { icon: ShieldCheck, title: 'Real account security', desc: 'Encrypted key storage, rate limiting, full data export and deletion.' },
]

export default function JVZooOffer() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Simple header — intentionally not the full app nav, this is a standalone offer page */}
      <header className="border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">AI Creator Pro</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Turn a prompt into a finished video —<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">no editing skills required</span>
          </h1>
          <p className="text-lg text-slate-400">
            Script, voice, video and captions, generated in one connected pipeline. Get full access to AI Creator Pro today.
          </p>
        </motion.div>

        {/* Real pipeline visual — same one used on the main product */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
          <FilmStrip stages={PIPELINE_STAGES} active={2} />
        </motion.div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="glass-card p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Offer / pricing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-8 max-w-md mx-auto text-center mb-10"
        >
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Pro plan</p>
          <div className="mb-1">
            <span className="text-5xl font-bold text-white">$29</span>
            <span className="text-slate-500">/month</span>
          </div>
          <p className="text-xs text-slate-500 mb-6">Cancel anytime from your account settings.</p>
          <ul className="text-left space-y-3 mb-8">
            {[
              '700 credits/month',
              '1080p exports, no watermark',
              'Priority rendering queue',
              'Autopilot content scheduling',
              'Full template marketplace access',
            ].map(line => (
              <li key={line} className="flex items-center gap-2.5 text-sm text-slate-300">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                {line}
              </li>
            ))}
          </ul>

          {/*
            JVZOO BUY BUTTON — paste the exact HTML snippet from your
            JVZoo Seller's Dashboard here (Products → your product →
            Buy Buttons). Do not hand-build this: JVZoo requires the
            verifiable button it generates, with its tracking pixel intact,
            for the listing to be approved.
          */}
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-slate-600 text-sm">
            [ Paste your JVZoo Buy Button HTML here ]
          </div>
        </motion.div>

        {/* Refund policy — kept word-for-word identical to /terms, since
            JVZoo requires the same policy on the sales page, your Terms,
            and the JVZoo order page. */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-sm font-semibold text-white mb-2">Refund Policy</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Credits are consumed when you use AI generation features. Credits are non-refundable except in cases of service errors.
            Subscription fees are billed monthly or annually as selected. Subscriptions renew automatically until cancelled.
          </p>
        </motion.div>

        <p className="text-center text-xs text-slate-600">
          <Link to="/terms" className="hover:text-slate-400">Terms of Service</Link>
          {' · '}
          <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
        </p>
      </main>
    </div>
  )
}
