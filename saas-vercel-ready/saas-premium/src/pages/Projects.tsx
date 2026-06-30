import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Grid, List, Trash2, MoreHorizontal } from 'lucide-react'

const demoProjects = [
  { id: 'p1', name: 'TikTok Product Demo', description: 'AI-generated product showcase', thumbnail: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?w=400&h=300&fit=crop', duration: 45, status: 'completed', created_at: '2026-06-15' },
  { id: 'p2', name: 'YouTube Tutorial', description: 'Step-by-step guide video', thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400&h=300&fit=crop', duration: 180, status: 'processing', created_at: '2026-06-17' },
  { id: 'p3', name: 'Instagram Story', description: 'Quick promotional content', thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?w=400&h=300&fit=crop', duration: 15, status: 'draft', created_at: '2026-06-17' },
]

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const filteredProjects = demoProjects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-full overflow-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold">Projects</h1><p className="text-slate-400 mt-1">Manage your video projects</p></div>
        <Link to="/editor/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"><Plus className="w-5 h-5" />New Project</Link>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects..." className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500" />
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-4 gap-4">
          {filteredProjects.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors group">
              <Link to={`/editor/${project.id}`}>
                <div className="relative aspect-video">
                  <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${project.status === 'completed' ? 'bg-emerald-500/80' : project.status === 'processing' ? 'bg-amber-500/80' : 'bg-slate-500/80'}`}>{project.status}</div>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-medium">{project.name}</h3><p className="text-sm text-slate-400 mt-1">{project.description}</p></div>
                  <button className="p-1 hover:bg-slate-800 rounded"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500"><span>{project.created_at}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProjects.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
              <img src={project.thumbnail} alt={project.name} className="w-32 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-slate-400">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/editor/${project.id}`} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm font-medium">Edit</Link>
                <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
