import { useEffect, useRef } from 'react'
import { useEditorStore } from '../../stores/editorStore'
import type { Clip, Track } from '../../types'

function findActiveClip(tracks: Track[], type: Track['type'], time: number): { clip: Clip; track: Track } | null {
  for (const track of tracks) {
    if (track.type !== type || !track.visible) continue
    const clip = track.clips.find(c => time >= c.start_time && time < c.end_time && c.source_url)
    if (clip) return { clip, track }
  }
  return null
}

export default function PreviewPlayer() {
  const { tracks, currentTime, isPlaying, playbackRate, duration, setCurrentTime, pause } = useEditorStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastTickRef = useRef<number | null>(null)

  const activeVideo = findActiveClip(tracks, 'video', currentTime)
  const activeAudio = findActiveClip(tracks, 'audio', currentTime)

  // Playback loop — advances the playhead while isPlaying, independent of media element events
  // so the timeline stays authoritative even across clip boundaries with no media loaded.
  useEffect(() => {
    if (!isPlaying) {
      lastTickRef.current = null
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = (now: number) => {
      if (lastTickRef.current == null) lastTickRef.current = now
      const delta = (now - lastTickRef.current) / 1000
      lastTickRef.current = now
      const next = currentTime + delta * playbackRate
      if (next >= duration) {
        setCurrentTime(duration)
        pause()
        return
      }
      setCurrentTime(next)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, playbackRate, duration])

  // Keep the <video> element's own clock roughly in sync (drift correction) and play/pause it.
  useEffect(() => {
    const el = videoRef.current
    if (!el || !activeVideo) return
    const localTime = currentTime - activeVideo.clip.start_time + activeVideo.clip.trim_start
    if (Math.abs(el.currentTime - localTime) > 0.25) el.currentTime = Math.max(0, localTime)
    if (isPlaying) el.play().catch(() => {}); else el.pause()
    el.volume = Math.max(0, Math.min(1, activeVideo.clip.volume * activeVideo.track.volume))
    el.playbackRate = playbackRate
  }, [activeVideo, currentTime, isPlaying, playbackRate])

  useEffect(() => {
    const el = audioRef.current
    if (!el || !activeAudio) return
    const localTime = currentTime - activeAudio.clip.start_time + activeAudio.clip.trim_start
    if (Math.abs(el.currentTime - localTime) > 0.25) el.currentTime = Math.max(0, localTime)
    if (isPlaying) el.play().catch(() => {}); else el.pause()
    el.volume = Math.max(0, Math.min(1, activeAudio.clip.volume * activeAudio.track.volume))
  }, [activeAudio, currentTime, isPlaying])

  return (
    <div className="h-64 bg-black border-b border-slate-800 flex items-center justify-center relative overflow-hidden">
      {activeVideo ? (
        <video
          key={activeVideo.clip.id}
          ref={videoRef}
          src={activeVideo.clip.source_url}
          className="h-full max-w-full object-contain"
          style={{
            opacity: activeVideo.clip.opacity,
            transform: `scale(${activeVideo.clip.scale}) rotate(${activeVideo.clip.rotation}deg)`,
          }}
          muted={false}
          playsInline
        />
      ) : (
        <div className="text-slate-600 text-sm flex flex-col items-center gap-2">
          <span>No video at this point in the timeline</span>
          <span className="text-xs text-slate-700">Add a clip from the media bin, or move the playhead</span>
        </div>
      )}
      {activeAudio && <audio key={activeAudio.clip.id} ref={audioRef} src={activeAudio.clip.source_url} />}

      <div className="absolute bottom-2 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[11px] font-mono text-slate-300">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  )
}

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`
}
