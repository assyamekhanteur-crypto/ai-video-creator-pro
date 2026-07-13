export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  thumbnail_url?: string
  status: 'draft' | 'processing' | 'completed'
  shared_with_team?: boolean
  duration: number
  resolution: string
  fps: number
  created_at: string
  updated_at: string
}

export interface Track {
  id: string
  type: 'video' | 'audio' | 'text' | 'image'
  name: string
  clips: Clip[]
  muted: boolean
  locked: boolean
  visible: boolean
  volume: number
}

export interface Clip {
  id: string
  track_id: string
  source_url: string
  proxy_url?: string
  source_hash?: string
  name: string
  start_time: number
  end_time: number
  trim_start: number
  trim_end: number
  volume: number
  opacity: number
  scale: number
  rotation: number
  position: { x: number; y: number }
  effects: Effect[]
  keyframes: Keyframe[]
  transitions: Transition[]
  waveform_data?: number[]
  duration: number
  is_proxy: boolean
  thumbnail_url?: string
  text_content?: string
}

export interface Keyframe {
  id: string
  clip_id: string
  time: number
  property: KeyframeProperty
  value: number | string
  easing: EasingType
  bezierHandles?: BezierHandles
}

export type KeyframeProperty = 'opacity' | 'scale' | 'position_x' | 'position_y' | 'rotation' | 'volume' | 'blur' | 'saturation' | 'brightness' | 'contrast'

export type EasingType = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bezier'

export interface BezierHandles {
  cp1: { x: number; y: number }
  cp2: { x: number; y: number }
}

export interface Effect {
  id: string
  type: EffectType
  intensity: number
  parameters: Record<string, unknown>
}

export type EffectType = 'blur' | 'brightness' | 'contrast' | 'saturation' | 'grayscale' | 'sepia' | 'vignette' | 'sharpen' | 'glow' | 'glitch' | 'speed'

export interface Transition {
  id: string
  type: TransitionType
  duration: number
  direction?: 'left' | 'right' | 'up' | 'down'
  easing: EasingType
}

export type TransitionType = 'fade' | 'dissolve' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out' | 'wipe' | 'spin' | 'blur' | 'glitch'

export interface User {
  id: string
  email: string
  credits: number
  subscription_tier: 'free' | 'pro' | 'business'
  created_at: string
}
