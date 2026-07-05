import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Store, Star, Download, Search, Music, Mic, Palette, Film, Sparkles, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type Category = 'all' | 'templates' | 'voices' | 'music' | 'effects' | 'transitions'

const CATEGORIES: { id: Category; label: string; icon: typeof Store }[] = [
  { id: 'all',         label: 'All',         icon: Store },
  { id: 'templates',   label: 'Templates',   icon: Film },
  { id: 'voices',      label: 'Voices',      icon: Mic },
  { id: 'music',       label: 'Music',       icon: Music },
  { id: 'effects',     label: 'Effects',     icon: Sparkles },
  { id: 'transitions', label: 'Transitions', icon: Palette },
]

const CATEGORY_ICON: Record<string, typeof Store> = { templates: Film, voices: Mic, music: Music, effects: Sparkles, transitions: Palette }
const CATEGORY_GRADIENT: Record<string, string> = {
  templates: 'from-cyan-500/25 to-blue-600/25',
  voices: 'from-pink-500/25 to-rose-600/25',
  music: 'from-amber-500/25 to-orange-600/25',
  effects: 'from-violet-500/25 to-purple-600/25',
  transitions: 'from-emerald-500/25 to-teal-600/25',
}

interface MarketplaceItem {
  id: string
  title: string
  category: string
  description: string
  price_credits: number
  rating: number
  downloads_count: number
  badge: string | null
}

function CardSkeleton() {
  return <div className="glass-card overflow-hidden animate-pulse"><div className="aspect-video bg-slate-800/40" /><div className="p-3 h-20" /></div>
}

export default function Marketplace() {
  const { user, profile, refreshProfile } = useAuth()
  const [cat, setCat] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [owned, setOwned] = useState<Set<string>>(new Set())
  const [buyingId, setBuyingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [itemsRes, purchasesRes] = await Promise.all([
        supabase.from('marketplace_items').select('*').order('downloads_count', { ascending: false }),
        user
          ? supabase.from('marketplace_purchases').select('item_id').eq('user_id', user.id)
          : Promise.resolve({ data: [] as { item_id: string }[] }),
      ])
      if (cancelled) return
      setItems((itemsRes.data ?? []) as MarketplaceItem[])
      setOwned(new Set((purchasesRes.data ?? []).map(p => p.item_id)))
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user])

  const filtered = items.filter(it =>
    (cat === 'all' || it.category === cat) &&
    it.title.toLowerCase().includes(search.toLowerCase()),
  )

  async function buy(item: MarketplaceItem) {
    if (!user) return
    if ((profile?.credits ?? 0) < item.price_credits) {
      toast.error("Not enough credits — upgrade your plan or top up.")
      return
    }
    setBuyingId(item.id)
    const { error } = await supabase.rpc('purchase_marketplace_item', { p_item_id: item.id })
    setBuyingId(null)
    if (error) {
      toast.error(error.message.includes('Already owned') ? 'You already own this' : 'Purchase failed')
      return
    }
    setOwned(prev => new Set(prev).add(item.id))
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, downloads_count: i.downloads_count + 1 } : i))
    await refreshProfile()
    toast.success(`"${item.title}" added to your library`)
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Marketplace</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Templates, voices & more</h1>
            <p className="text-slate-500 text-sm">Spend credits to unlock premium templates, voices, music and effects.</p>
          </div>
          {profile && (
            <div className="glass-card px-4 py-2.5 text-right shrink-0">
              <p className="text-xs text-slate-500">Your balance</p>
              <p className="text-lg font-bold text-white">{profile.credits.toLocaleString()} credits</p>
            </div>
          )}
        </motion.div>

        {/* Search */}
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
        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map((item, i) => {
              const isOwned = owned.has(item.id)
              const Icon = CATEGORY_ICON[item.category] ?? Store
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
                  <div className={`relative aspect-video overflow-hidden flex items-center justify-center bg-gradient-to-br ${CATEGORY_GRADIENT[item.category] ?? 'from-slate-800 to-slate-900'}`}>
                    <Icon className="w-9 h-9 text-white/70" />
                    {item.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border text-amber-300 bg-amber-500/15 border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm mb-1 truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-amber-400 font-medium">{item.rating}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <Download className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{item.downloads_count.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {item.price_credits === 0 ? 'Free' : `${item.price_credits} cr`}
                      </span>
                      <motion.button
                        whileHover={{ scale: isOwned ? 1 : 1.05 }} whileTap={{ scale: isOwned ? 1 : 0.95 }}
                        onClick={() => !isOwned && buy(item)}
                        disabled={isOwned || buyingId === item.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isOwned
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-default'
                            : 'gradient-btn-primary text-white disabled:opacity-50'
                        }`}
                      >
                        {buyingId === item.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isOwned ? (
                          <><Check className="w-3 h-3" /> Owned</>
                        ) : item.price_credits === 0 ? 'Add free' : 'Buy'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-600">
            <Store className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No assets found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
