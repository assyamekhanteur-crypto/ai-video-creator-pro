import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Track, Clip, Keyframe, Transition, Effect } from '../types'

interface EditorState {
  tracks: Track[]
  currentTime: number
  duration: number
  isPlaying: boolean
  playbackRate: number
  zoom: number
  snapEnabled: boolean
  snapThreshold: number
  selectedClipId: string | null
  selectedTrackId: string | null
  selectedKeyframeId: string | null
  clipboard: Clip | null
  history: Track[][]
  historyIndex: number
  maxHistory: number
  proxyEnabled: boolean
  generatingProxies: string[]
  waveforms: Record<string, number[]>

  setTracks: (tracks: Track[]) => void
  addTrack: (track: Track) => void
  removeTrack: (trackId: string) => void
  updateTrack: (trackId: string, updates: Partial<Track>) => void
  addClip: (trackId: string, clip: Clip) => void
  removeClip: (clipId: string) => void
  updateClip: (clipId: string, updates: Partial<Clip>) => void
  moveClip: (clipId: string, newStartTime: number, newTrackId?: string) => void
  duplicateClip: (clipId: string) => void
  splitClip: (clipId: string, splitTime: number) => void
  addKeyframe: (clipId: string, keyframe: Keyframe) => void
  updateKeyframe: (clipId: string, keyframeId: string, updates: Partial<Keyframe>) => void
  removeKeyframe: (clipId: string, keyframeId: string) => void
  addTransition: (clipId: string, transition: Transition) => void
  removeTransition: (clipId: string, transitionId: string) => void
  addEffect: (clipId: string, effect: Effect) => void
  updateEffect: (clipId: string, effectId: string, updates: Partial<Effect>) => void
  removeEffect: (clipId: string, effectId: string) => void
  setCurrentTime: (time: number) => void
  play: () => void
  pause: () => void
  togglePlayback: () => void
  setPlaybackRate: (rate: number) => void
  setZoom: (zoom: number) => void
  toggleSnap: () => void
  setSelectedClip: (clipId: string | null) => void
  setSelectedTrack: (trackId: string | null) => void
  copyClip: (clipId: string) => void
  pasteClip: (trackId: string) => void
  cutClip: (clipId: string) => void
  undo: () => void
  redo: () => void
  saveToHistory: () => void
  setProxyEnabled: (enabled: boolean) => void
  setWaveform: (clipId: string, data: number[]) => void
  calculateSnapPosition: (time: number, clipDuration: number) => number
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    tracks: [],
    currentTime: 0,
    duration: 60,
    isPlaying: false,
    playbackRate: 1,
    zoom: 1,
    snapEnabled: true,
    snapThreshold: 5,
    selectedClipId: null,
    selectedTrackId: null,
    selectedKeyframeId: null,
    clipboard: null,
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    proxyEnabled: true,
    generatingProxies: [],
    waveforms: {},

    setTracks: (tracks) => set((state) => {
      state.tracks = tracks
      state.duration = Math.max(...tracks.flatMap(t => t.clips.map(c => c.end_time)), 60)
    }),

    addTrack: (track) => set((state) => { state.tracks.push(track) }),
    removeTrack: (trackId) => set((state) => { state.tracks = state.tracks.filter(t => t.id !== trackId) }),
    updateTrack: (trackId, updates) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId)
      if (track) Object.assign(track, updates)
    }),

    addClip: (trackId, clip) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId)
      if (track) {
        track.clips.push(clip)
        state.duration = Math.max(state.duration, clip.end_time)
      }
    }),

    removeClip: (clipId) => set((state) => {
      for (const track of state.tracks) {
        const index = track.clips.findIndex(c => c.id === clipId)
        if (index !== -1) { track.clips.splice(index, 1); break }
      }
      if (state.selectedClipId === clipId) state.selectedClipId = null
    }),

    updateClip: (clipId, updates) => set((state) => {
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip) { Object.assign(clip, updates); break }
      }
    }),

    moveClip: (clipId, newStartTime, newTrackId) => set((state) => {
      let clip: Clip | undefined
      let sourceTrack: Track | undefined
      for (const track of state.tracks) {
        const index = track.clips.findIndex(c => c.id === clipId)
        if (index !== -1) { clip = track.clips[index]; sourceTrack = track; track.clips.splice(index, 1); break }
      }
      if (clip) {
        if (state.snapEnabled) newStartTime = get().calculateSnapPosition(newStartTime, clip.duration)
        clip.start_time = Math.max(0, newStartTime)
        clip.end_time = clip.start_time + clip.duration
        const targetTrack = newTrackId ? state.tracks.find(t => t.id === newTrackId) : sourceTrack
        if (targetTrack) { targetTrack.clips.push(clip); state.duration = Math.max(state.duration, clip.end_time) }
      }
    }),

    duplicateClip: (clipId) => set((state) => {
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip) {
          const newClip: Clip = { ...clip, id: crypto.randomUUID(), start_time: clip.end_time, end_time: clip.end_time + clip.duration, keyframes: clip.keyframes.map(k => ({ ...k, id: crypto.randomUUID() })), effects: clip.effects.map(e => ({ ...e, id: crypto.randomUUID() })), transitions: clip.transitions.map(t => ({ ...t, id: crypto.randomUUID() })) }
          track.clips.push(newClip); break
        }
      }
    }),

    splitClip: (clipId, splitTime) => set((state) => {
      for (const track of state.tracks) {
        const clipIndex = track.clips.findIndex(c => c.id === clipId)
        if (clipIndex !== -1) {
          const clip = track.clips[clipIndex]
          track.clips.splice(clipIndex, 1, { ...clip, end_time: splitTime, duration: splitTime - clip.start_time, keyframes: clip.keyframes.filter(k => k.time <= splitTime) }, { ...clip, id: crypto.randomUUID(), start_time: splitTime, end_time: clip.end_time, trim_start: clip.trim_start + (splitTime - clip.start_time), keyframes: clip.keyframes.filter(k => k.time > splitTime).map(k => ({ ...k, time: k.time - splitTime })) }); break
        }
      }
    }),

    addKeyframe: (clipId, keyframe) => set((state) => {
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip) { clip.keyframes.push(keyframe); clip.keyframes.sort((a, b) => a.time - b.time); break }
      }
    }),

    updateKeyframe: (clipId, keyframeId, updates) => set((state) => {
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip) { const kf = clip.keyframes.find(k => k.id === keyframeId); if (kf) Object.assign(kf, updates); break }
      }
    }),

    removeKeyframe: (clipId, keyframeId) => set((state) => {
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId)
        if (clip) { clip.keyframes = clip.keyframes.filter(k => k.id !== keyframeId); break }
      }
    }),

    addTransition: (clipId, transition) => set((state) => {
      for (const track of state.tracks) { const clip = track.clips.find(c => c.id === clipId); if (clip) { clip.transitions.push(transition); break } }
    }),

    removeTransition: (clipId, transitionId) => set((state) => {
      for (const track of state.tracks) { const clip = track.clips.find(c => c.id === clipId); if (clip) { clip.transitions = clip.transitions.filter(t => t.id !== transitionId); break } }
    }),

    addEffect: (clipId, effect) => set((state) => {
      for (const track of state.tracks) { const clip = track.clips.find(c => c.id === clipId); if (clip) { clip.effects.push(effect); break } }
    }),

    updateEffect: (clipId, effectId, updates) => set((state) => {
      for (const track of state.tracks) { const clip = track.clips.find(c => c.id === clipId); if (clip) { const e = clip.effects.find(ef => ef.id === effectId); if (e) Object.assign(e, updates); break } }
    }),

    removeEffect: (clipId, effectId) => set((state) => {
      for (const track of state.tracks) { const clip = track.clips.find(c => c.id === clipId); if (clip) { clip.effects = clip.effects.filter(e => e.id !== effectId); break } }
    }),

    setCurrentTime: (time) => set((state) => { state.currentTime = Math.max(0, Math.min(time, state.duration)) }),
    play: () => set((state) => { state.isPlaying = true }),
    pause: () => set((state) => { state.isPlaying = false }),
    togglePlayback: () => set((state) => { state.isPlaying = !state.isPlaying }),
    setPlaybackRate: (rate) => set((state) => { state.playbackRate = rate }),
    setZoom: (zoom) => set((state) => { state.zoom = Math.max(0.1, Math.min(10, zoom)) }),
    toggleSnap: () => set((state) => { state.snapEnabled = !state.snapEnabled }),

    setSelectedClip: (clipId) => set((state) => { state.selectedClipId = clipId }),
    setSelectedTrack: (trackId) => set((state) => { state.selectedTrackId = trackId }),

    copyClip: (clipId) => set((state) => {
      for (const track of state.tracks) { const clip = track.clips.find(c => c.id === clipId); if (clip) { state.clipboard = { ...clip }; break } }
    }),

    pasteClip: (trackId) => {
      const { clipboard, currentTime } = get()
      if (clipboard) get().addClip(trackId, { ...clipboard, id: crypto.randomUUID(), start_time: currentTime, end_time: currentTime + clipboard.duration })
    },

    cutClip: (clipId) => { get().copyClip(clipId); get().removeClip(clipId) },

    undo: () => set((state) => {
      if (state.historyIndex > 0) { state.historyIndex--; state.tracks = JSON.parse(JSON.stringify(state.history[state.historyIndex])) }
    }),

    redo: () => set((state) => {
      if (state.historyIndex < state.history.length - 1) { state.historyIndex++; state.tracks = JSON.parse(JSON.stringify(state.history[state.historyIndex])) }
    }),

    saveToHistory: () => set((state) => {
      const snapshot = JSON.parse(JSON.stringify(state.tracks))
      if (state.historyIndex < state.history.length - 1) state.history = state.history.slice(0, state.historyIndex + 1)
      state.history.push(snapshot)
      if (state.history.length > state.maxHistory) state.history.shift()
      state.historyIndex = state.history.length - 1
    }),

    setProxyEnabled: (enabled) => set((state) => { state.proxyEnabled = enabled }),
    setWaveform: (clipId, data) => set((state) => { state.waveforms[clipId] = data }),

    calculateSnapPosition: (time, clipDuration) => {
      const { tracks, snapThreshold, currentTime } = get()
      const threshold = snapThreshold / get().zoom
      const snapPoints: number[] = [0, currentTime, ...tracks.flatMap(t => t.clips.flatMap(c => [c.start_time, c.end_time]))]
      for (const point of snapPoints) { if (Math.abs(time - point) < threshold) return point }
      for (const point of snapPoints) { if (Math.abs((time + clipDuration) - point) < threshold) return point - clipDuration }
      return time
    },
  }))
)
