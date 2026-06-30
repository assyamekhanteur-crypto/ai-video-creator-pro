import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Film, Sparkles, Clock, Plus, Play, Wand2,
  ArrowUpRight, Zap, BarChart3, Rocket, ChevronRight,
  Mic, Music, Image, Scissors
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const aiTools = [
  { to: '/create',       icon: Wand2,    label: 'Create Video',  color: 'from-indigo-500 to-cyan-500',  glow: 'rgba(99,102,241,0.3)',   desc: 'Full AI production in minutes' },
  { to: '/ai-script',    icon: Film,     label: 'AI Script',     color: 'from-violet-500 to-indigo-500', glow: 'rgba(139,92,246,0.3)',  desc: 'Script + storyboard instantly' },
  { to: '/ai-voice',     icon: Mic,      label: 'AI Voice',      color: 'from-pink-500 to-rose-500',     glow: 'rgba(236,72,153,0.3)',  desc: '50+ voices in 10 languages' },
  { to: '/ai-music',     icon: Music,    label: 'AI Music',      color: 'from-amber-500 to-orange-500',  glow: 'rgba(245,158,11,0.3)',  desc: 'Original soundtrack, any mood' },
  { to: '/ai-thumbnail', icon: Image,    label: 'AI Thumbnail',  color: 'from-emerald-500 to-teal-500',  glow: 'rgba(16,185,129,0.3)',  desc: 'YouTube-ready in 1 click' },
  { to: '/ai-shorts',    icon: Scissors, label: 'AI Shorts',     color: 'from-cyan-500 to-blue-500',     glow: 'rgba(6,182,212,0.3)',   desc: 'Long video → TikTok clips' },
]

const recentProjects = [
  { id: '1', name: 'Nike Air Max Campaign', duration: '0:30', status: 'completed',  views: '124K', thumbnail: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=600&h=340&fit=crop' },
  { id: '2', name: 'SaaS Product Demo',     duration: '2:14', status: 'processing', views: '—',    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=600&h=340&fit=crop' },
  { id: '3', name: 'Travel Vlog Shorts',    duration: '0:58', status: 'completed',  views: '87K',  thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&w=600&h=340&fit=crop' },
]

const statCards = [
  { label: 'Videos',           value: '125',   sub: '+14 this week',  icon: Film,      grad: 'from-indigo-500/20 to-cyan-500/20',    border: 'border-indigo-500/20',  text: 'text-indigo-400' },
  { label: 'Minutes Generated',value: '320',   sub: '+28% vs last mo',icon: Clock,     grad: 'from-violet-500/20 to-pink-500/20',    border: 'border-violet-500/20',  text: 'text-violet-400' },
  { label: 'Credits',          value: '950',   sub: 'of 2 000 used',  icon: Zap,       grad: 'from-amber-500/20 to-orange-500/20',   border: 'border-amber-500/20',   text: 'text-amber-400' },
  { label: 'Storage',          value: '85 GB', sub: 'of 500 GB used', icon: BarChart3, grad: 'from-emerald-500/20 to-teal-500/20',   border: 'border-emerald-500/20', text: 'text-emerald-400' },
]

export default function Dashboard() {
  const { user, profile } = useAuth()
  const name = user?.email?.split('@')[0] ?? 'Creator'

  return (
    <div className="h-full overflow-auto" style={{ scrollbarWidth: 'thin' }}>
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1 tracking-wide uppercase">Welcome back</p>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {name.charAt(0).toUpperCase() + name.slice(1)} <span className="wave inline-block">👋</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mr-2
                ${profile?.subscription_tier === 'pro' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25' :
                  profile?.subscription_tier === 'business' ? 'bg-violet-500/15 text-violet-400 border border-violet-500/25' :
                  'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                {(profile?.subscription_tier ?? 'free').toUpperCase()}
              </span>
              {profile?.credits?.toLocaleString() ?? 0} credits remaining
            </p>
          </div>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="gradient-btn-primary px-5 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New video
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`stat-card p-5 bg-gradient-to-br ${s.grad} border ${s.border}`}
            >
              <div className="flex items-center justify-between mb-4">
                <s.icon className={`w-5 h-5 ${s.text}`} />
                <ArrowUpRight className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* AI Tools grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">AI Tools</h2>
            <Link to="/marketplace" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Marketplace <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {aiTools.map((tool, i) => (
              <Link key={tool.to} to={tool.to}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ y: -3, boxShadow: `0 16px 40px ${tool.glow}` }}
                  className="glass-card p-4 cursor-pointer group"
                  style={{ transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)' }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-semibold text-white text-sm mb-0.5">{tool.label}</div>
                  <div className="text-xs text-slate-500">{tool.desc}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent projects</h2>
            <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {recentProjects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="glass-card overflow-hidden group cursor-pointer"
                style={{ transition: 'border-color 0.2s' }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link to={`/editor/${p.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
                      >
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </motion.div>
                    </Link>
                  </div>
                  {/* Status badge */}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm
                    ${p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      p.status === 'processing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                    {p.status === 'processing' ? '⚡ Rendering…' : p.status}
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs font-medium text-white">
                    {p.duration}
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <h3 className="font-medium text-sm text-white truncate">{p.name}</h3>
                  {p.views !== '—' && (
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{p.views} views</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA banner — Autopilot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-violet-500/20 p-6 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.06) 100%)' }}
        >
          {/* Ambient glow */}
          <div className="absolute -top-8 -left-8 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Autopilot</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Let AI run your channel</h3>
            <p className="text-slate-400 text-sm">7 days of optimised content generated while you sleep.</p>
          </div>
          <Link to="/autopilot" className="relative z-10 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              className="gradient-btn-secondary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
            >
              Activate <Sparkles className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
