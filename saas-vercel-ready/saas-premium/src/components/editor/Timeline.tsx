import { useCallback, useRef, useState } from 'react'
import { Lock, Unlock, Volume2, VolumeX, Music, Video as VideoIcon } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import type { Clip } from '../../types'

const TRACK_HEIGHT = 56
const LABEL_WIDTH = 140

interface DragState {
  kind: 'move' | 'resize-left' | 'resize-right'
  clipId: string
  startX: number
  originalStart: number
  originalEnd: number
  originalTrim: number
}

export default function Timeline() {
  const {
    tracks, currentTime, duration, zoom, selectedClipId,
    setCurrentTime, setSelectedClip, moveClip, updateClip, saveToHistory,
    updateTrack,
  } = useEditorStore()

  const pxPerSec = 40 * zoom
  const timelineRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [, forceRender] = useState(0)

  const timeAtClientX = useCallback((clientX: number) => {
    const rect = timelineRef.current?.getBoundingClientRect()
    if (!rect) return 0
    return Math.max(0, (clientX - rect.left - LABEL_WIDTH + (timelineRef.current?.scrollLeft ?? 0)) / pxPerSec)
  }, [pxPerSec])

  const handleRulerClick = (e: React.MouseEvent) => {
    setCurrentTime(timeAtClientX(e.clientX))
  }

  const beginDrag = (clip: Clip, kind: DragState['kind']) => (e: React.PointerEvent) => {
    e.stopPropagation()
    setSelectedClip(clip.id)
    dragRef.current = {
      kind,
      clipId: clip.id,
      startX: e.clientX,
      originalStart: clip.start_time,
      originalEnd: clip.end_time,
      originalTrim: clip.trim_start,
    }
    window.addEventListener('pointermove', onDragMove)
    window.addEventListener('pointerup', onDragEnd)
  }

  const onDragMove = (e: PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    const deltaSec = (e.clientX - drag.startX) / pxPerSec
    const state = useEditorStore.getState()

    if (drag.kind === 'move') {
      moveClip(drag.clipId, Math.max(0, drag.originalStart + deltaSec))
    } else {
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === drag.clipId)
        if (!clip) continue
        if (drag.kind === 'resize-right') {
          const newEnd = Math.max(drag.originalStart + 0.2, drag.originalEnd + deltaSec)
          updateClip(clip.id, { end_time: newEnd, duration: newEnd - clip.start_time })
        } else {
          const newStart = Math.min(drag.originalEnd - 0.2, Math.max(0, drag.originalStart + deltaSec))
          updateClip(clip.id, {
            start_time: newStart,
            duration: drag.originalEnd - newStart,
            trim_start: Math.max(0, drag.originalTrim + (newStart - drag.originalStart)),
          })
        }
        break
      }
    }
    forceRender(n => n + 1)
  }

  const onDragEnd = () => {
    dragRef.current = null
    saveToHistory()
    window.removeEventListener('pointermove', onDragMove)
    window.removeEventListener('pointerup', onDragEnd)
  }

  const totalWidth = Math.max(duration * pxPerSec + 200, 600)
  const rulerMarks: number[] = []
  const step = pxPerSec > 80 ? 1 : pxPerSec > 30 ? 5 : 10
  for (let t = 0; t <= duration + step; t += step) rulerMarks.push(t)

  return (
    <div className="flex-1 overflow-auto bg-slate-950/60" ref={timelineRef}>
      <div style={{ width: totalWidth + LABEL_WIDTH, minWidth: '100%' }}>

        {/* Ruler */}
        <div
          className="h-8 border-b border-slate-800 relative cursor-pointer select-none sticky top-0 bg-slate-950/95 backdrop-blur z-10"
          style={{ marginLeft: LABEL_WIDTH }}
          onClick={handleRulerClick}
        >
          {rulerMarks.map(t => (
            <div key={t} className="absolute top-0 h-full flex items-center" style={{ left: t * pxPerSec }}>
              <span className="text-[10px] text-slate-500 font-mono border-l border-slate-700 pl-1 h-full flex items-center">
                {Math.floor(t / 60)}:{String(Math.floor(t % 60)).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        {/* Tracks */}
        <div className="relative">
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-px bg-cyan-400 z-20 pointer-events-none"
            style={{ left: LABEL_WIDTH + currentTime * pxPerSec }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 -ml-[5px] -mt-1" />
          </div>

          {tracks.map(track => (
            <div key={track.id} className="flex border-b border-slate-800/60" style={{ height: TRACK_HEIGHT }}>
              {/* Track label */}
              <div
                className="shrink-0 border-r border-slate-800 flex items-center gap-2 px-3 bg-slate-900/40"
                style={{ width: LABEL_WIDTH }}
              >
                {track.type === 'audio' ? <Music className="w-3.5 h-3.5 text-violet-400 shrink-0" /> : <VideoIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                <span className="text-xs text-slate-300 truncate flex-1">{track.name}</span>
                <button onClick={() => updateTrack(track.id, { muted: !track.muted })} className="text-slate-500 hover:text-white shrink-0">
                  {track.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => updateTrack(track.id, { locked: !track.locked })} className="text-slate-500 hover:text-white shrink-0">
                  {track.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Clip lane */}
              <div className="relative flex-1">
                {track.clips.map(clip => {
                  const selected = selectedClipId === clip.id
                  return (
                    <div
                      key={clip.id}
                      onPointerDown={beginDrag(clip, 'move')}
                      className={`absolute top-1.5 bottom-1.5 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing group ${
                        selected ? 'ring-2 ring-cyan-400' : 'ring-1 ring-slate-700/60'
                      } ${track.type === 'audio' ? 'bg-gradient-to-r from-violet-600/70 to-violet-500/50' : 'bg-gradient-to-r from-cyan-600/70 to-cyan-500/50'}`}
                      style={{ left: clip.start_time * pxPerSec, width: Math.max(6, (clip.end_time - clip.start_time) * pxPerSec) }}
                    >
                      <div className="px-2 py-1 text-[11px] text-white truncate pointer-events-none">{clip.name}</div>
                      {track.type === 'audio' && clip.waveform_data && (
                        <div className="absolute inset-x-1 bottom-1 top-5 flex items-end gap-px pointer-events-none opacity-70">
                          {clip.waveform_data.slice(0, 60).map((v, i) => (
                            <div key={i} className="flex-1 bg-white/70 rounded-sm" style={{ height: `${Math.max(6, v * 100)}%` }} />
                          ))}
                        </div>
                      )}
                      {/* Trim handles */}
                      <div
                        onPointerDown={beginDrag(clip, 'resize-left')}
                        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 group-hover:bg-white/20"
                      />
                      <div
                        onPointerDown={beginDrag(clip, 'resize-right')}
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/0 group-hover:bg-white/20"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
