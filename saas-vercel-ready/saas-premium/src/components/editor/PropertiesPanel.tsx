import { Copy, Trash2 } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'

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

export default function PropertiesPanel() {
  const { tracks, selectedClipId, updateClip, removeClip, duplicateClip, saveToHistory } = useEditorStore()

  let selected = null
  for (const track of tracks) {
    const clip = track.clips.find(c => c.id === selectedClipId)
    if (clip) { selected = clip; break }
  }

  const commit = (updates: Parameters<typeof updateClip>[1]) => {
    if (!selected) return
    updateClip(selected.id, updates)
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
