import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Crown, Building, Check, Sparkles, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const PLANS = [
  { id: 'free', name: 'Free', tier: 'free' as const, price: 0, credits: 100, features: ['100 AI credits/month', '720p exports', 'Watermark on exports', 'Basic templates'], icon: Zap, color: 'slate' },
  { id: 'pro', name: 'Pro', tier: 'pro' as const, price: 29, credits: 2000, features: ['2000 AI credits/month', '4K exports', 'No watermark', 'Priority rendering', 'Advanced templates', 'Proxy rendering'], icon: Crown, color: 'cyan', popular: true },
  { id: 'business', name: 'Business', tier: 'business' as const, price: 99, credits: 10000, features: ['10000 AI credits/month', '4K exports', 'No watermark', 'Fastest rendering', 'Custom templates', 'Team collaboration', 'API access'], icon: Building, color: 'violet' },
]

export default function Billing() {
  const { profile } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const currentPlan = profile?.subscription_tier ?? 'free'
  const credits = profile?.credits ?? 0
  const creditsCap = PLANS.find((p) => p.tier === currentPlan)?.credits ?? 100

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
        <h1 className="text-3xl font-bold">Billing & Plans</h1>
        <p className="text-slate-400 mt-1">Choose the plan that fits your needs</p>
      </div>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Current Plan</p>
            <p className="text-2xl font-bold capitalize">{currentPlan}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Credits Remaining</p>
            <p className="text-2xl font-bold">{credits}</p>
          </div>
          <div className="flex-1 max-w-md px-8">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Credits Used</span>
              <span>{Math.max(0, creditsCap - credits)} of {creditsCap}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, (creditsCap - credits) / creditsCap * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-slate-900 border rounded-xl overflow-hidden ${plan.popular ? 'border-cyan-500' : 'border-slate-800'}`}>
            {plan.popular && <div className="bg-cyan-500 text-center py-1 text-xs font-medium text-white">Most Popular</div>}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-${plan.color}-500/20 flex items-center justify-center`}>
                  <plan.icon className={`w-5 h-5 text-${plan.color}-400`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-slate-400">{plan.credits.toLocaleString()} credits/mo</p>
                </div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-slate-400">/month</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={isLoading === plan.tier || currentPlan === plan.tier}
                className={`w-full py-3 rounded-lg font-medium transition-all disabled:opacity-50 ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25' : 'bg-slate-800 hover:bg-slate-700'}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
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
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-400 mb-1">Remove Watermarks</h4>
            <p className="text-sm text-slate-300">Upgrade to Pro or Business plan to remove the "AI CREATOR" watermark from all your exports.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
