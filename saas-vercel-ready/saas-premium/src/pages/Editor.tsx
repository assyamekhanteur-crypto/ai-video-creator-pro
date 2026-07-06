import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Play, Pause, Undo2, Redo2, Scissors, ZoomIn, ZoomOut,
  Save, Upload, Loader2, ArrowLeft,
} from 'lucide-react'
import { useEditorStore } from '../stores/editorStore'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { submitRender } from '../lib/render'
import type { Track } from '../types'
import PreviewPlayer, { formatTime } from '../components/editor/PreviewPlayer'
import Timeline from '../components/editor/Timeline'
import MediaBin from '../components/editor/MediaBin'
import PropertiesPanel from '../components/editor/PropertiesPanel'

const DEFAULT_TRACKS: Track[] = [
  { id: crypto.randomUUID(), type: 'video', name: 'Video', clips: [], muted: false, locked: false, visible: true, volume: 1 },
  { id: crypto.randomUUID(), type: 'audio', name: 'Audio', clips: [], muted: false, locked: false, visible: true, volume: 1 },
]

export default function Editor() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { user, session } = useAuth()
  const {
    tracks, setTracks, currentTime, isPlaying, duration, zoom, selectedClipId,
    togglePlayback, undo, redo, splitClip, saveToHistory, setZoom,
  } = useEditorStore()

  const [projectName, setProjectName] = useState('Untitled project')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const realProjectId = projectId && projectId !== 'new' ? projectId : undefined

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!realProjectId) {
        setTracks(DEFAULT_TRACKS)
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('projects')
        .select('name, timeline_data')
        .eq('id', realProjectId)
        .maybeSingle()

      if (cancelled) return
      if (error || !data) {
        toast.error('Could not load this project')
        setTracks(DEFAULT_TRACKS)
      } else {
        setProjectName(data.name)
        const savedTracks = (data.timeline_data as { tracks?: Track[] } | null)?.tracks
        setTracks(savedTracks && savedTracks.length > 0 ? savedTracks : DEFAULT_TRACKS)
      }
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realProjectId])

  const handleSave = useCallback(async () => {
    if (!user) return
    setSaving(true)
    const totalDuration = Math.max(0, ...tracks.flatMap(t => t.clips.map(c => c.end_time)))
    const payload = {
      name: projectName,
      duration: totalDuration,
      timeline_data: { tracks },
    }

    if (realProjectId) {
      const { error } = await supabase.from('projects').update(payload).eq('id', realProjectId)
      setSaving(false)
      if (error) return toast.error('Save failed')
      toast.success('Project saved')
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...payload, user_id: user.id, status: 'draft' })
        .select('id')
        .single()
      setSaving(false)
      if (error || !data) return toast.error('Save failed')
      toast.success('Project created')
      navigate(`/editor/${data.id}`, { replace: true })
    }
  }, [user, tracks, projectName, realProjectId, navigate])

  const handleSplit = () => {
    if (!selectedClipId) return toast.error('Select a clip first')
    splitClip(selectedClipId, currentTime)
    saveToHistory()
  }

  const handleExport = async () => {
    if (!realProjectId) {
      toast.error('Save the project before exporting')
      return
    }
    setExporting(true)
    try {
      const res = await submitRender(
        { jobType: 'export', provider: 'ffmpeg', prompt: projectName, projectId: realProjectId, options: { tracks } },
        session,
      )
      toast.success(res.message || 'Export queued — check Render History')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Top toolbar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-3 gap-2 shrink-0">
        <button onClick={() => navigate('/projects')} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Back to projects">
          <ArrowLeft className="w-4 h-4" />
        </button>

        <input
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          className="bg-transparent text-sm font-medium text-white outline-none border-b border-transparent focus:border-slate-600 px-1 w-44"
        />

        <div className="w-px h-6 bg-slate-800 mx-1" />

        <button onClick={togglePlayback} className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white" title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <span className="text-xs font-mono text-slate-400 w-28">{formatTime(currentTime)} / {formatTime(duration)}</span>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        <button onClick={undo} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Undo"><Undo2 className="w-4 h-4" /></button>
        <button onClick={redo} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Redo"><Redo2 className="w-4 h-4" /></button>
        <button onClick={handleSplit} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Split clip at playhead"><Scissors className="w-4 h-4" /></button>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        <button onClick={() => setZoom(zoom / 1.4)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Zoom out"><ZoomOut className="w-4 h-4" /></button>
        <button onClick={() => setZoom(zoom * 1.4)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Zoom in"><ZoomIn className="w-4 h-4" /></button>

        <div className="flex-1" />

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Export
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="gradient-btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <MediaBin projectId={realProjectId} />

        <div className="flex-1 flex flex-col min-w-0">
          <PreviewPlayer />
          <Timeline />
        </div>

        <PropertiesPanel projectId={realProjectId} />
      </div>
    </div>
  )
}
