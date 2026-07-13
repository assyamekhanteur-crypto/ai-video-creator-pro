import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Search, Grid, List, Trash2, Film, Play, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { getAssetHealth } from '../lib/assets'
import { supabase } from '../lib/supabase'
import type { Project } from '../types'

function CardSkeleton() {
  return <div className="glass-card overflow-hidden animate-pulse"><div className="aspect-video bg-slate-800/40" /><div className="p-4 h-16" /></div>
}

function formatDuration(seconds: number) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Projects() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [sharingId, setSharingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          toast.error('Could not load projects')
        } else {
          setProjects((data ?? []) as Project[])
        }
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [user])

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return
    setDeletingId(id)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    setDeletingId(null)
    if (error) {
      toast.error('Failed to delete project')
      return
    }
    setProjects(prev => prev.filter(p => p.id !== id))
    toast.success('Project deleted')
  }

  async function handleToggleShare(project: Project) {
    if (!user) return
    setSharingId(project.id)
    const nextValue = !project.shared_with_team
    const { error } = await supabase.from('projects').update({ shared_with_team: nextValue }).eq('id', project.id).eq('user_id', user.id)
    setSharingId(null)
    if (error) {
      toast.error('Could not update project sharing')
      return
    }
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, shared_with_team: nextValue } : p))
    toast.success(nextValue ? 'Project shared with your team' : 'Project unshared')
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage your video projects</p>
        </div>
        <Link to="/create" className="gradient-btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div className="flex items-center gap-1 glass-card p-1">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <Link to="/create">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-14 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-slate-700/60 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 border border-slate-700/50 flex items-center justify-center">
              <Film className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-white font-medium">No projects yet</p>
            <p className="text-slate-500 text-sm max-w-sm">
              Every video you generate from a prompt will show up here, ready to edit or export.
            </p>
            <span className="mt-1 text-sm font-medium text-cyan-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Create your first project
            </span>
          </motion.div>
        </Link>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card p-10 text-center text-slate-500 text-sm">
          No projects match "{searchQuery}"
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredProjects.map((project, i) => {
              const duration = formatDuration(project.duration)
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card overflow-hidden group"
                >
                  <Link to={`/editor/${project.id}`}>
                    <div className="relative aspect-video bg-slate-900">
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                          <Film className="w-7 h-7 text-slate-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm
                        ${project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          project.status === 'processing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                        {project.status === 'processing' ? '⚡ Rendering…' : project.status}
                      </div>
                      {duration && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs font-medium text-white">
                          {duration}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm text-white truncate">{project.name}</h3>
                      {project.description && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{project.description}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-1.5">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-[11px] text-slate-400">
                          <span className={`h-2 w-2 rounded-full ${getAssetHealth(project.thumbnail_url).tone === 'success' ? 'bg-emerald-400' : getAssetHealth(project.thumbnail_url).tone === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                          {getAssetHealth(project.thumbnail_url).label}
                        </div>
                        {project.shared_with_team && (
                          <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-300">
                            <Users className="w-3 h-3" /> Shared
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleShare(project)}
                        disabled={sharingId === project.id}
                        className={`p-1.5 rounded-lg transition-colors ${project.shared_with_team ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
                        disabled={deletingId === project.id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="w-28 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-5 h-5 text-slate-700" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-white truncate">{project.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{project.description || new Date(project.created_at).toLocaleDateString()}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-[11px] text-slate-400">
                    <span className={`h-2 w-2 rounded-full ${getAssetHealth(project.thumbnail_url).tone === 'success' ? 'bg-emerald-400' : getAssetHealth(project.thumbnail_url).tone === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                    {getAssetHealth(project.thumbnail_url).label}
                  </div>
                  {project.shared_with_team && (
                    <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[11px] text-cyan-300">
                      <Users className="w-3 h-3" /> Shared
                    </div>
                  )}
                </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleShare(project)}
                    disabled={sharingId === project.id}
                    className={`p-2 rounded-lg transition-colors ${project.shared_with_team ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <Link to={`/editor/${project.id}`} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors text-sm font-medium">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
                    disabled={deletingId === project.id}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
