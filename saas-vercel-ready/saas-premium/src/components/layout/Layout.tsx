import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Film, Sparkles, FolderOpen, CreditCard, Zap,
  Clock, BarChart3, ShieldCheck, Users, LogOut, ChevronLeft,
  Wand2, Mic, Music, Subtitles, Image, Scissors, Search,
  Store, Rocket, Bell, Settings, Plus
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const navGroups = [
  {
    label: 'Create',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { to: '/create', icon: Wand2, label: 'Create Video', badge: 'New' },
      { to: '/ai-pipeline', icon: Sparkles, label: 'AI Pipeline' },
      { to: '/autopilot', icon: Rocket, label: 'Autopilot' },
    ]
  },
  {
    label: 'AI Tools',
    items: [
      { to: '/ai-script', icon: Film, label: 'AI Script' },
      { to: '/ai-voice', icon: Mic, label: 'AI Voice' },
      { to: '/ai-music', icon: Music, label: 'AI Music' },
      { to: '/ai-subtitles', icon: Subtitles, label: 'AI Subtitles' },
      { to: '/ai-thumbnail', icon: Image, label: 'AI Thumbnail' },
      { to: '/ai-shorts', icon: Scissors, label: 'AI Shorts' },
      { to: '/ai-seo', icon: Search, label: 'AI SEO' },
    ]
  },
  {
    label: 'Workspace',
    items: [
      { to: '/projects', icon: FolderOpen, label: 'Projects' },
      { to: '/render-history', icon: Clock, label: 'History' },
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    ]
  },
  {
    label: 'More',
    items: [
      { to: '/marketplace', icon: Store, label: 'Marketplace' },
      { to: '/referrals', icon: Users, label: 'Affiliate' },
      { to: '/billing', icon: CreditCard, label: 'Billing' },
    ]
  },
]

const adminItem = { to: '/admin', icon: ShieldCheck, label: 'Admin' }

const TIER_COLORS = {
  free: 'from-slate-500 to-slate-600',
  pro: 'from-indigo-500 to-cyan-500',
  business: 'from-violet-500 to-pink-500',
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const tierColor = TIER_COLORS[profile?.subscription_tier ?? 'free']
  const creditsPercent = Math.min(100, ((profile?.credits ?? 0) / (profile?.subscription_tier === 'business' ? 10000 : profile?.subscription_tier === 'pro' ? 2000 : 100)) * 100)

  return (
    <div className="h-full flex bg-slate-950 relative" style={{ zIndex: 1 }}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full flex-shrink-0 glass-panel border-r border-white/[0.05] flex flex-col relative z-20"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-glow-cyan">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="font-bold text-base gradient-text-cyan whitespace-nowrap"
                >
                  AI Creator Pro
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick create button */}
        <div className="px-3 py-3 border-b border-white/[0.04]">
          <NavLink to="/create">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`gradient-btn-primary rounded-xl flex items-center justify-center gap-2 cursor-pointer overflow-hidden ${collapsed ? 'h-10 w-10 mx-auto' : 'h-10 px-4'}`}
            >
              <Plus className="w-4 h-4 text-white flex-shrink-0" />
              {!collapsed && <span className="text-sm font-semibold text-white">New video</span>}
            </motion.div>
          </NavLink>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navGroups.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = item.exact
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to) && item.to !== '/'
                  return (
                    <NavLink key={item.to} to={item.to}>
                      <motion.div
                        whileHover={{ x: collapsed ? 0 : 2 }}
                        className={`nav-item flex items-center gap-3 px-3 py-2.5 cursor-pointer group ${isActive ? 'active' : ''}`}
                      >
                        <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        {!collapsed && (
                          <span className={`text-sm font-medium flex-1 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                            {item.label}
                          </span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}

          {profile?.is_admin && (
            <div>
              {!collapsed && <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5">System</p>}
              <NavLink to={adminItem.to}>
                <motion.div whileHover={{ x: 2 }} className={`nav-item flex items-center gap-3 px-3 py-2.5 cursor-pointer group ${location.pathname === adminItem.to ? 'active' : ''}`}>
                  <adminItem.icon className="w-4 h-4 flex-shrink-0 text-violet-500" />
                  {!collapsed && <span className="text-sm font-medium text-slate-400 group-hover:text-white">Admin</span>}
                </motion.div>
              </NavLink>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.05] space-y-2">
          {/* Credits */}
          {!collapsed && profile && (
            <div className="glass-card p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400">{profile.credits.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">credits</span>
                </div>
                <span className={`badge-pro bg-gradient-to-r ${tierColor} text-white border-0`}>
                  {profile.subscription_tier.toUpperCase()}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${creditsPercent}%` }} />
              </div>
            </div>
          )}

          {/* Notifications */}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors">
            <Bell className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Notifications</span>}
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors">
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Settings</span>}
          </button>

          {/* Avatar + name */}
          {!collapsed && user && (
            <div className="flex items-center gap-2 px-3 py-2">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${tierColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                {(user.email ?? '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{user.email}</div>
              </div>
            </div>
          )}

          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sign out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-1.5 rounded-xl text-slate-600 hover:text-slate-400 transition-colors"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  )
}
