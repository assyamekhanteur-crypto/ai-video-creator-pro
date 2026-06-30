import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Sparkles, Play, RefreshCw, Calendar, TrendingUp, Eye, Heart, ChevronDown, Zap } from 'lucide-react'

interface DayContent {
  day: number
  date: string
  title: string
  platform: 'tiktok' | 'youtube' | 'instagram'
  status: 'ready' | 'scheduled'
  thumbnail?: string
  viralityScore: number
  estimatedViews: number
  hook: string
  tags: string[]
}

const generateWeekContent = (): DayContent[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const templates = [
    { hook: 'Wait until you see this...', virality: 87 },
    { hook: 'This changed everything for me...', virality: 82 },
    { hook: 'POV: You just discovered...', virality: 91 },
    { hook: 'The secret nobody tells you about...', virality: 88 },
    { hook: 'I tested this for 30 days...', virality: 85 },
    { hook: 'This went viral and here\'s why...', virality: 94 },
    { hook: 'Breaking: This just happened...', virality: 90 },
  ]

  return days.map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const template = templates[i]
    return {
      day: i + 1,
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      title: ['How I Made $10K in One Week', 'The AI Tool That Changed Everything', '5 Secrets Nobody Tells You About Success', 'I Tried This For 30 Days and WOW', 'The ONE Thing Stopping Your Growth', 'Why I Switched Everything', 'This Is About to BLOW UP'][i],
      platform: (['tiktok', 'youtube', 'instagram'] as const)[i % 3],
      status: 'ready',
      thumbnail: `https://images.pexels.com/photos/${[607812, 1181671, 267350, 3184291, 1714208, 157920, 326058][i]}/pexels-photo-${[607812, 1181671, 267350, 3184291, 1714208, 157920, 326058][i]}.jpeg?w=400&h=300&fit=crop`,
      viralityScore: template.virality - Math.floor(Math.random() * 10),
      estimatedViews: Math.floor(10000 + Math.random() * 90000),
      hook: template.hook,
      tags: ['#viral', '#fyp', '#trending', '#mustsee'].slice(0, 2 + Math.floor(Math.random() * 2)),
    }
  })
}

export default function Autopilot() {
  const [weekContent, setWeekContent] = useState<DayContent[]>(generateWeekContent)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const handleRegenerate = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => { setWeekContent(generateWeekContent()); setIsGenerating(false) }, 2000)
  }, [])

  const stats = {
    totalViews: weekContent.reduce((sum, c) => sum + c.estimatedViews, 0),
    avgVirality: Math.round(weekContent.reduce((sum, c) => sum + c.viralityScore, 0) / weekContent.length),
    avgEngagement: Math.round(weekContent.reduce((sum, c) => sum + c.estimatedViews / 1000, 0) / weekContent.length * 10) / 10,
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Rocket className="w-6 h-6 text-white" /></div>
            Autopilot Creator
          </h1>
          <p className="text-slate-400 mt-2">7 days of viral content, generated automatically</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button onClick={handleRegenerate} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg font-medium hover:border-slate-600 transition-colors disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />Regenerate
          </motion.button>
          <motion.button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Sparkles className="w-4 h-4" />Publish All
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2"><Eye className="w-5 h-5 text-cyan-400" /><span className="text-slate-400 text-sm">Estimated Views</span></div>
          <div className="text-2xl font-bold">{(stats.totalViews / 1000).toFixed(0)}K+</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-emerald-400" /><span className="text-slate-400 text-sm">Avg Virality Score</span></div>
          <div className="text-2xl font-bold">{stats.avgVirality}%</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2"><Heart className="w-5 h-5 text-pink-400" /><span className="text-slate-400 text-sm">Est. Engagement</span></div>
          <div className="text-2xl font-bold">{stats.avgEngagement}%</div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {weekContent.map((content, i) => (
            <motion.div key={content.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }} layout className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setExpandedDay(expandedDay === content.day ? null : content.day)}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center"><Calendar className="w-5 h-5 text-amber-400" /></div>
                <div className="w-24"><div className="text-sm font-medium">Day {content.day}</div><div className="text-xs text-slate-400">{content.date}</div></div>
                <div className="w-32 h-18 relative">
                  <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover rounded-lg" />
                  <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-medium ${content.platform === 'tiktok' ? 'bg-black' : content.platform === 'youtube' ? 'bg-red-600' : 'bg-gradient-to-r from-purple-600 to-pink-500'}`}>{content.platform}</div>
                </div>
                <div className="flex-1"><h3 className="font-medium mb-1">{content.title}</h3><p className="text-sm text-slate-400">{content.hook}</p></div>
                <div className="text-center"><div className="text-2xl font-bold text-emerald-400">{content.viralityScore}%</div><div className="text-xs text-slate-400">Virality</div></div>
                <div className="text-center w-24"><div className="text-lg font-semibold">{(content.estimatedViews / 1000).toFixed(0)}K</div><div className="text-xs text-slate-400">Est. Views</div></div>
                <motion.div animate={{ rotate: expandedDay === content.day ? 180 : 0 }}><ChevronDown className="w-5 h-5 text-slate-400" /></motion.div>
              </div>
              <AnimatePresence>
                {expandedDay === content.day && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-800">
                    <div className="p-6 grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div><h4 className="text-sm font-medium mb-2">Opening Hook</h4><p className="text-cyan-400 font-medium">{content.hook}</p></div>
                        <div><h4 className="text-sm font-medium mb-2">Hashtags</h4><div className="flex flex-wrap gap-2">{content.tags.map(tag => <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-sm text-slate-300">{tag}</span>)}</div></div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"><Play className="w-4 h-4" />Preview</button>
                          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><Zap className="w-4 h-4" />Export</button>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"><Zap className="w-4 h-4" />Edit in Timeline</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
