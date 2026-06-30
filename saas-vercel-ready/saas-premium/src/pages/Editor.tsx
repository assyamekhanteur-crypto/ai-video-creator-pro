import { useEffect } from 'react'
import { useEditorStore } from '../stores/editorStore'
import type { Track } from '../types'

export default function Editor() {
  const { tracks, setTracks, proxyEnabled, generatingProxies } = useEditorStore()

  useEffect(() => {
    if (tracks.length === 0) {
      const demoTracks: Track[] = [
        {
          id: 'video_1',
          type: 'video',
          name: 'Video 1',
          clips: [{
            id: 'clip_1', track_id: 'video_1', source_url: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg', name: 'Intro Shot',
            start_time: 0, end_time: 5, trim_start: 0, trim_end: 0, duration: 5, volume: 1, opacity: 1, scale: 1, rotation: 0,
            position: { x: 0, y: 0 }, effects: [], keyframes: [], transitions: [], is_proxy: false,
            thumbnail_url: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?w=100&h=60&fit=crop',
          }],
          muted: false, locked: false, visible: true, volume: 1,
        },
        {
          id: 'audio_1',
          type: 'audio',
          name: 'Background Music',
          clips: [{
            id: 'audio_clip_1', track_id: 'audio_1', source_url: '', name: 'Upbeat Track',
            start_time: 0, end_time: 20, trim_start: 0, trim_end: 0, duration: 20, volume: 0.3, opacity: 1, scale: 1, rotation: 0,
            position: { x: 0, y: 0 }, effects: [], keyframes: [], transitions: [], is_proxy: false,
            waveform_data: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.1),
          }],
          muted: false, locked: false, visible: true, volume: 0.3,
        },
      ]
      setTracks(demoTracks)
    }
  }, [tracks.length, setTracks])

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Top toolbar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
        <button className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white"><span className="ml-0.5">Play</span></button>
        <div className="flex-1" />
        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${proxyEnabled ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>Proxy: {proxyEnabled ? 'ON' : 'OFF'}</div>
        {generatingProxies.length > 0 && <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs">Generating {generatingProxies.length} proxies</div>}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <div className="w-64 border-r border-slate-800 flex flex-col">
          <div className="h-12 border-b border-slate-800 flex items-center px-3"><span className="text-sm font-medium">Media</span></div>
          <div className="flex-1 overflow-auto p-2">
            <div className="p-4 border-2 border-dashed border-slate-700 rounded-lg text-center text-slate-400 text-sm">Drop files here</div>
          </div>
        </div>

        {/* Center - Preview and Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Preview */}
          <div className="h-64 bg-slate-900 border-b border-slate-800 flex items-center justify-center">
            <div className="text-slate-600">Preview - {tracks.length} tracks loaded</div>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-auto bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400 mb-4">Timeline - Total Duration: {Math.max(...tracks.flatMap(t => t.clips.map(c => c.end_time)), 0)}s</div>
            {tracks.map(track => (
              <div key={track.id} className="mb-4">
                <div className="text-xs text-slate-400 mb-1">{track.name} ({track.type})</div>
                <div className="h-16 bg-slate-800/50 rounded-lg relative">
                  {track.clips.map(clip => (
                    <div key={clip.id} className="absolute top-1 bottom-1 rounded bg-gradient-to-r from-cyan-600 to-cyan-500 flex items-center px-2" style={{ left: `${clip.start_time * 10}px`, width: `${clip.duration * 10}px` }}>
                      <span className="text-xs truncate">{clip.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - Properties */}
        <div className="w-80 border-l border-slate-800 flex flex-col">
          <div className="h-12 border-b border-slate-800 flex items-center px-3"><span className="text-sm font-medium">Properties</span></div>
          <div className="flex-1 overflow-auto p-4">
            <div className="text-slate-500 text-center">Select a clip to edit</div>
          </div>
        </div>
      </div>
    </div>
  )
}
