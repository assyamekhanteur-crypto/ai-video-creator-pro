import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    period: 'forever',
    tagline: 'Try the full pipeline',
    features: ['100 credits / month', '720p exports with watermark', '3 active projects', 'Standard render queue'],
    cta: 'Start free',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/ month',
    tagline: 'For creators publishing weekly',
    features: [
      '2,000 credits / month',
      '1080p exports, no watermark',
      'Unlimited projects',
      'Priority render queue',
      'Autopilot scheduling',
    ],
    cta: 'Start 7-day trial',
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$99',
    period: '/ month',
    tagline: 'For teams and agencies',
    features: [
      '10,000 credits / month',
      '4K exports',
      'Team seats & shared projects',
      'API access',
      'Dedicated support',
    ],
    cta: 'Start 7-day trial',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24 md:py-32 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Pricing</span>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl tracking-tight text-white">
            Pay for renders, not seats
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Every plan includes the full pipeline. Higher tiers add resolution, volume and speed.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`rounded-2xl p-6 relative ${
                plan.highlight
                  ? 'bg-slate-900/80 border-2 border-indigo-500/40 shadow-glow-lg md:-translate-y-2'
                  : 'glass-card'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 gradient-btn-primary text-[11px] font-medium text-white px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h3 className="font-display font-semibold text-lg text-white">{plan.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{plan.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display font-bold text-4xl text-white">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-7 block text-center text-sm font-medium py-2.5 rounded-xl transition-colors ${
                  plan.highlight
                    ? 'gradient-btn-primary text-white'
                    : 'border border-slate-700 text-slate-200 hover:border-slate-600'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Credits roll over one month. Cancel anytime, no lock-in.
        </p>
      </div>
    </section>
  )
}
