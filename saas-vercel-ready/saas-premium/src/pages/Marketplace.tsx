import { useState } from 'react'
import { motion } from 'framer-motion'
import { Store, Star, Download, Filter, Search, Play, Music, Mic, Palette, Film, Sparkles } from 'lucide-react'

type Category = 'all' | 'templates' | 'voices' | 'music' | 'effects' | 'transitions'

const CATEGORIES: { id: Category; label: string; icon: typeof Store }[] = [
  { id: 'all',         label: 'All',         icon: Store },
  { id: 'templates',   label: 'Templates',   icon: Film },
  { id: 'voices',      label: 'Voices',      icon: Mic },
  { id: 'music',       label: 'Music',       icon: Music },
  { id: 'effects',     label: 'Effects',     icon: Sparkles },
  { id: 'transitions', label: 'Transitions', icon: Palette },
]

const ITEMS = [
  { id: '1', title: 'Nike-Style Ad Pack',      category: 'templates',   price: 12,  rating: 4.9, downloads: 2840, thumb: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400&h=230&fit=crop',  badge: 'Best seller', badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { id: '2', title: 'Lofi Chill Beats Vol.2',  category: 'music',       price: 8,   rating: 4.7, downloads: 1520, thumb: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=400&h=230&fit=crop', badge: 'New',         badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  { id: '3', title: 'Emma Pro — UK English',   category: 'voices',      price: 15,  rating: 5.0, downloads: 3100, thumb: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400&h=230&fit=crop', badge: '⭐ Top rated', badgeColor: 'text-violet-400 bg-violet-500/15 border-violet-500/30' },
  { id: '4', title: 'Cinematic Glitch FX',     category: 'effects',     price: 10,  rating: 4.6, downloads: 980,  thumb: 'https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&w=400&h=230&fit=crop', badge: null,          badgeColor: '' },
  { id: '5', title: 'SaaS Demo Template',      category: 'templates',   price: 0,   rating: 4.5, downloads: 5200, thumb: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&w=400&h=230&fit=crop',  badge: 'Free',        badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
  { id: '6', title: 'Smooth Slide Transitions',category: 'transitions', price: 6,   rating: 4.8, downloads: 2100, thumb: 'https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg?auto=compress&w=400&h=230&fit=crop', badge: null,          badgeColor: '' },
  { id: '7', title: 'Epic Trailer Music Pack', category: 'music',       price: 20,  rating: 4.9, downloads: 1780, thumb: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400&h=230&fit=crop',  badge: 'Best seller', badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  { id: '8', title: 'Lucas — French Voice',    category: 'voices',      price: 15,  rating: 4.8, downloads: 890,  thumb: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=400&h=230&fit=crop', badge: 'New',         badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
]

export default function Marketplace() {
  const [cat, setCat] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [purchased, setPurchased] = useState<string[]>([])

  const filtered = ITEMS.filter(it =>
    (cat === 'all' || it.category === cat) &&
    (it.title.toLowerCase().includes(search.toLowerCase()))
  )

  const buy = (id: string) => setPurchased(p => [...p, id])

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Marketplace</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Templates, voices & more</h1>
          <p className="text-slate-500 text-sm">Extend your studio with premium assets crafted by creators.</p>
        </motion.div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="input-premium w-full pl-9 pr-4 py-2.5 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white text-sm transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                cat === c.id
                  ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300'
                  : 'text-slate-500 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
            >
              <c.icon className="w-3.5 h-3.5" />
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((item, i) => {
            const owned = purchased.includes(item.id)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="glass-card overflow-hidden group"
                style={{ transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s' }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {item.badge && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">{item.rating}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <Download className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">{item.downloads.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {item.price === 0 ? 'Free' : `$${item.price}`}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => buy(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        owned
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : item.price === 0
                            ? 'gradient-btn-primary text-white'
                            : 'gradient-btn-primary text-white'
                      }`}
                    >
                      {owned ? '✓ Owned' : item.price === 0 ? 'Add free' : 'Buy'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-600">
            <Store className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No assets found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
