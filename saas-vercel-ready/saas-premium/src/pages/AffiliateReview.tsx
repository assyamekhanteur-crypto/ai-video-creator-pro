import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Plus, X, ArrowRight, Link as LinkIcon, Sparkles } from 'lucide-react'

const TONES = [
  { id: 'enthusiastic', label: 'Enthusiastic', desc: 'High energy, excited' },
  { id: 'informative', label: 'Informative', desc: 'Calm, fact-focused' },
  { id: 'casual', label: 'Casual', desc: 'Friendly, conversational' },
] as const

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok / Reels / Shorts', durationHint: '30-45s, fast-paced' },
  { id: 'youtube', label: 'YouTube', durationHint: '60-90s, more detail' },
  { id: 'instagram', label: 'Instagram', durationHint: '30-60s, visual-first' },
] as const

export default function AffiliateReview() {
  const navigate = useNavigate()
  const [productName, setProductName] = useState('')
  const [productLink, setProductLink] = useState('')
  const [benefits, setBenefits] = useState<string[]>(['', '', ''])
  const [tone, setTone] = useState<typeof TONES[number]['id']>('enthusiastic')
  const [platform, setPlatform] = useState<typeof PLATFORMS[number]['id']>('tiktok')
  const [includeDisclosure, setIncludeDisclosure] = useState(true)

  const updateBenefit = (i: number, value: string) => {
    setBenefits(prev => prev.map((b, idx) => idx === i ? value : b))
  }
  const addBenefit = () => setBenefits(prev => [...prev, ''])
  const removeBenefit = (i: number) => setBenefits(prev => prev.filter((_, idx) => idx !== i))

  const filledBenefits = benefits.map(b => b.trim()).filter(Boolean)
  const canSubmit = productName.trim().length > 0 && filledBenefits.length > 0

  const handleGenerate = () => {
    const platformInfo = PLATFORMS.find(p => p.id === platform)!
    const toneInfo = TONES.find(t => t.id === tone)!

    const promptParts = [
      `Write a product review / affiliate marketing video script for "${productName.trim()}".`,
      `Key benefits to highlight: ${filledBenefits.map((b, i) => `(${i + 1}) ${b}`).join(', ')}.`,
      `Tone: ${toneInfo.label.toLowerCase()} — ${toneInfo.desc.toLowerCase()}.`,
      `Optimised for ${platformInfo.label} (${platformInfo.durationHint}).`,
      productLink.trim() ? `End with a clear call-to-action directing viewers to the link in the description/bio.` : `End with a clear call-to-action to check the product out.`,
      includeDisclosure ? `Include a brief, natural mention that this is a paid/affiliate partnership near the start (required disclosure), without it feeling like a legal disclaimer.` : '',
      `The script should feel authentic and trustworthy, not overly salesy — like a real creator's honest take.`,
    ].filter(Boolean)

    navigate('/create', { state: { initialPrompt: promptParts.join(' ') } })
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Affiliate Review Template</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Product review video</h1>
          <p className="text-slate-500 text-sm">Fill in the product details — we'll turn it into a script built for conversion, then run it through the full AI pipeline.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Product name</label>
            <input
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. Nomad Wireless Charger"
              className="input-premium w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Affiliate link <span className="text-slate-600 font-normal">(optional — for your own reference, not read aloud)</span></label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={productLink}
                onChange={e => setProductLink(e.target.value)}
                placeholder="https://..."
                className="input-premium w-full pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Key benefits to highlight</label>
            <div className="space-y-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={b}
                    onChange={e => updateBenefit(i, e.target.value)}
                    placeholder={`Benefit ${i + 1} — e.g. "Charges 3 devices at once"`}
                    className="input-premium flex-1"
                  />
                  {benefits.length > 1 && (
                    <button onClick={() => removeBenefit(i)} className="p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addBenefit} className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300">
              <Plus className="w-3.5 h-3.5" /> Add another benefit
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    tone === t.id ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-medium text-white">{t.label}</div>
                  <div className="text-xs text-slate-500">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    platform === p.id ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-medium text-white">{p.label}</div>
                  <div className="text-xs text-slate-500">{p.durationHint}</div>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDisclosure}
              onChange={e => setIncludeDisclosure(e.target.checked)}
              className="mt-0.5 accent-cyan-500"
            />
            <div>
              <span className="text-sm text-slate-300">Include a paid/affiliate partnership disclosure</span>
              <p className="text-xs text-slate-600">Recommended — most platforms (and regulators like the FTC) require disclosing affiliate/sponsored content.</p>
            </div>
          </label>

          <motion.button
            onClick={handleGenerate}
            disabled={!canSubmit}
            whileHover={{ scale: canSubmit ? 1.01 : 1 }}
            whileTap={{ scale: canSubmit ? 0.99 : 1 }}
            className="gradient-btn-primary w-full py-3 rounded-lg font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate script <ArrowRight className="w-4 h-4" />
          </motion.button>
          {!canSubmit && (
            <p className="text-xs text-slate-600 text-center -mt-3">Add a product name and at least one benefit to continue.</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
