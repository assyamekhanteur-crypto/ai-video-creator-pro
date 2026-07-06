import { useState } from 'react'
import { Copy, Trash2, Captions, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEditorStore } from '../../stores/editorStore'
import { useAuth } from '../../contexts/AuthContext'
import { generateSubtitles } from '../../lib/ai'
import type { Clip, Track } from '../../types'

function Slider({ label, value, min, max, step, onChange, format }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-slate-400">{label}</label>
        <span className="text-xs text-slate-300 font-mono">{format ? format(value) : value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  )
}

export default function PropertiesPanel({ projectId }: { projectId?: string }) {
  const { session } = useAuth()
  const { tracks, selectedClipId, updateClip, removeClip, duplicateClip, saveToHistory, addTrack, addClip } = useEditorStore()
  const [generatingSubtitles, setGeneratingSubtitles] = useState(false)

  let selected: Clip | null = null
  let selectedTrack: Track | null = null
  for (const track of tracks) {
    const clip = track.clips.find(c => c.id === selectedClipId)
    if (clip) { selected = clip; selectedTrack = track; break }
  }

  const commit = (updates: Parameters<typeof updateClip>[1]) => {
    if (!selected) return
    updateClip(selected.id, updates)
  }

  const handleGenerateSubtitles = async () => {
    if (!selected) return
    setGeneratingSubtitles(true)
    try {
      const result = await generateSubtitles({ sourceUrl: selected.source_url, projectId, language: undefined }, session)

      let textTrack = tracks.find(t => t.type === 'text')
      if (!textTrack) {
        textTrack = {
          id: crypto.randomUUID(), type: 'text', name: 'Subtitles',
          clips: [], muted: false, locked: false, visible: true, volume: 1,
        }
        addTrack(textTrack)
      } else {
        // Replace any previous auto-generated captions on this track
        for (const c of [...textTrack.clips]) removeClip(c.id)
      }

      for (const seg of result.segments) {
        const clip: Clip = {
          id: crypto.randomUUID(),
          track_id: textTrack.id,
          source_url: '',
          name: seg.text.slice(0, 40),
          text_content: seg.text,
          start_time: selected.start_time + seg.start,
          end_time: selected.start_time + seg.end,
          trim_start: 0, trim_end: 0,
          duration: seg.end - seg.start,
          volume: 1, opacity: 1, scale: 1, rotation: 0,
          position: { x: 0, y: 0 },
          effects: [], keyframes: [], transitions: [],
          is_proxy: false,
        }
        addClip(textTrack.id, clip)
      }

      saveToHistory()
      toast.success(`${result.segments.length} caption${result.segments.length > 1 ? 's' : ''} generated`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Subtitle generation failed')
    } finally {
      setGeneratingSubtitles(false)
    }
  }

  return (
    <div className="w-80 border-l border-slate-800 flex flex-col shrink-0">
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-3">
        <span className="text-sm font-medium text-white">Properties</span>
        {selected && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { duplicateClip(selected!.id); saveToHistory() }}
              className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { removeClip(selected!.id); saveToHistory() }}
              className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {!selected ? (
          <div className="text-slate-500 text-center text-sm mt-8">Select a clip to edit</div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-slate-500 mb-1">Name</p>
              <p className="text-sm text-white truncate">{selected.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
              <div>
                <p className="mb-1">Start</p>
                <p className="text-slate-300 font-mono">{selected.start_time.toFixed(2)}s</p>
              </div>
              <div>
                <p className="mb-1">Duration</p>
                <p className="text-slate-300 font-mono">{selected.duration.toFixed(2)}s</p>
              </div>
            </div>

            {selectedTrack?.type === 'audio' && selected.source_url && (
              <button
                onClick={handleGenerateSubtitles}
                disabled={generatingSubtitles}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
              >
                {generatingSubtitles ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Captions className="w-3.5 h-3.5" />}
                {generatingSubtitles ? 'Transcribing…' : 'Generate subtitles (3 credits)'}
              </button>
            )}

            <Slider
              label="Volume"
              value={selected.volume}
              min={0} max={1} step={0.01}
              onChange={v => commit({ volume: v })}
              format={v => `${Math.round(v * 100)}%`}
            />
            <Slider
              label="Opacity"
              value={selected.opacity}
              min={0} max={1} step={0.01}
              onChange={v => commit({ opacity: v })}
              format={v => `${Math.round(v * 100)}%`}
            />
            <Slider
              label="Scale"
              value={selected.scale}
              min={0.1} max={3} step={0.01}
              onChange={v => commit({ scale: v })}
              format={v => `${v.toFixed(2)}x`}
            />
            <Slider
              label="Rotation"
              value={selected.rotation}
              min={-180} max={180} step={1}
              onChange={v => commit({ rotation: v })}
              format={v => `${v}°`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
