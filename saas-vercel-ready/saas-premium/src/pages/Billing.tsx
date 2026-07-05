import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Crown, Building, Check, Sparkles, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const PLANS = [
  { id: 'free', name: 'Free', tier: 'free' as const, price: 0, credits: 100, features: ['100 AI credits/month', '720p exports', 'Watermark on exports', 'Basic templates'], icon: Zap, popular: false },
  { id: 'pro', name: 'Pro', tier: 'pro' as const, price: 29, credits: 700, features: ['700 AI credits/month', '4K exports', 'No watermark', 'Priority rendering', 'Advanced templates', 'Proxy rendering'], icon: Crown, popular: true },
  { id: 'business', name: 'Business', tier: 'business' as const, price: 99, credits: 2400, features: ['2400 AI credits/month', '4K exports', 'No watermark', 'Fastest rendering', 'Custom templates', 'Team collaboration', 'API access'], icon: Building, popular: false },
] as const

// Static class maps — Tailwind's JIT scanner only picks up literal strings,
// so per-plan colors must be looked up here rather than built with template
// literals like `bg-${color}-500/20` (that silently produces no CSS at build time).
const ICON_BG: Record<string, string> = {
  free: 'bg-slate-500/20',
  pro: 'bg-cyan-500/20',
  business: 'bg-violet-500/20',
}
const ICON_TEXT: Record<string, string> = {
  free: 'text-slate-400',
  pro: 'text-cyan-400',
  business: 'text-violet-400',
}

export default function Billing() {
  const { profile } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const currentPlan = profile?.subscription_tier ?? 'free'
  const credits = profile?.credits ?? 0
  const creditsCap = PLANS.find((p) => p.tier === currentPlan)?.credits ?? 100
  const creditsUsed = Math.max(0, creditsCap - credits)
  const usedPct = Math.min(100, (creditsUsed / creditsCap) * 100)

  const handleUpgrade = async (planId: string) => {
    setIsLoading(planId)
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Failed (${res.status})`)
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('No checkout URL returned')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Checkout failed')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Billing & Plans</h1>
        <p className="text-slate-400 mt-1 text-sm">Choose the plan that fits your needs</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <p className="text-sm text-slate-500">Current Plan</p>
            <p className="text-2xl font-bold text-white capitalize">{currentPlan}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Credits Remaining</p>
            <p className="text-2xl font-bold text-white">{credits.toLocaleString()}</p>
          </div>
          <div className="flex-1 min-w-[220px] max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Credits Used</span>
              <span>{creditsUsed.toLocaleString()} of {creditsCap.toLocaleString()}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${usedPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl overflow-hidden ${plan.popular ? 'bg-slate-900/80 border-2 border-indigo-500/40 shadow-glow-lg' : 'glass-card'}`}
          >
            {plan.popular && (
              <div className="gradient-btn-primary text-center py-1.5 text-xs font-medium text-white">Most Popular</div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ICON_BG[plan.id]}`}>
                  <plan.icon className={`w-5 h-5 ${ICON_TEXT[plan.id]}`} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">{plan.name}</h3>
                  <p className="text-sm text-slate-500">{plan.credits.toLocaleString()} credits/mo</p>
                </div>
              </div>
              <div className="mb-6">
                <span className="font-display font-bold text-4xl text-white">${plan.price}</span>
                {plan.price > 0 && <span className="text-slate-500">/month</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={isLoading === plan.tier || currentPlan === plan.tier}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50 ${
                  plan.popular ? 'gradient-btn-primary text-white' : 'border border-slate-700 text-slate-200 hover:border-slate-600'
                }`}
              >
                {isLoading === plan.tier ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                  </span>
                ) : currentPlan === plan.tier ? (
                  'Current Plan'
                ) : (
                  'Upgrade'
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-400 mb-1">Remove Watermarks</h4>
            <p className="text-sm text-slate-400">Upgrade to Pro or Business plan to remove the "AI CREATOR" watermark from all your exports.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
