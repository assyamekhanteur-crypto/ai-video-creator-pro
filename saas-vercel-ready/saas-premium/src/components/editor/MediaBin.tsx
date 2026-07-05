import { useEffect, useState } from 'react'
import { Film, Mic, Plus, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useEditorStore } from '../../stores/editorStore'
import type { Clip, Track } from '../../types'

interface MediaAsset {
  id: string
  job_type: string
  provider: string
  prompt: string
  result_url: string
  created_at: string
}

export default function MediaBin({ projectId }: { projectId?: string }) {
  const { tracks, addClip, addTrack, saveToHistory } = useEditorStore()
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) { setLoading(false); return }
    let cancelled = false
    supabase
      .from('ai_jobs')
      .select('id, job_type, provider, prompt, result_url, created_at')
      .eq('project_id', projectId)
      .eq('status', 'completed')
      .not('result_url', 'is', null)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) setAssets((data ?? []) as MediaAsset[])
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [projectId])

  function addToTimeline(asset: MediaAsset) {
    const trackType: Track['type'] = asset.job_type === 'voice' ? 'audio' : 'video'
    let track = tracks.find(t => t.type === trackType)
    if (!track) {
      track = {
        id: crypto.randomUUID(),
        type: trackType,
        name: trackType === 'audio' ? 'Audio' : 'Video',
        clips: [],
        muted: false,
        locked: false,
        visible: true,
        volume: 1,
      }
      addTrack(track)
    }

    const insertAt = track.clips.reduce((max, c) => Math.max(max, c.end_time), 0)
    const defaultDuration = 5
    const clip: Clip = {
      id: crypto.randomUUID(),
      track_id: track.id,
      source_url: asset.result_url,
      name: asset.prompt.slice(0, 40) || asset.job_type,
      start_time: insertAt,
      end_time: insertAt + defaultDuration,
      trim_start: 0,
      trim_end: 0,
      duration: defaultDuration,
      volume: 1,
      opacity: 1,
      scale: 1,
      rotation: 0,
      position: { x: 0, y: 0 },
      effects: [],
      keyframes: [],
      transitions: [],
      is_proxy: false,
    }
    addClip(track.id, clip)
    saveToHistory()
  }

  return (
    <div className="w-64 border-r border-slate-800 flex flex-col shrink-0">
      <div className="h-12 border-b border-slate-800 flex items-center px-3">
        <span className="text-sm font-medium text-white">Media</span>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : !projectId ? (
          <div className="p-4 text-center text-slate-500 text-xs">
            Save the project first to attach generated assets.
          </div>
        ) : assets.length === 0 ? (
          <div className="p-4 border-2 border-dashed border-slate-700 rounded-lg text-center text-slate-500 text-xs leading-relaxed">
            No generated assets yet. Use AI Script, AI Voice or AI Video from the sidebar — completed renders for this project will show up here.
          </div>
        ) : (
          assets.map(asset => (
            <div key={asset.id} className="glass-card p-2.5 group">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                  {asset.job_type === 'voice' ? <Mic className="w-3.5 h-3.5 text-pink-400" /> : <Film className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-200 truncate">{asset.prompt || asset.job_type}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{asset.job_type} · {asset.provider}</p>
                </div>
              </div>
              <button
                onClick={() => addToTimeline(asset)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-300 text-xs font-medium transition-colors"
              >
                <Plus className="w-3 h-3" /> Add to timeline
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
