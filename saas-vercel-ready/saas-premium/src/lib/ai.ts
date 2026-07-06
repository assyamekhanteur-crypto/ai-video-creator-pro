import type { Session } from '@supabase/supabase-js'

const functionUrl = (slug: string) => `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${slug}`

export interface Scene {
  id: number
  heading: string
  narration: string
  visuals: string
  durationSec: number
}

export interface ScriptResult {
  title: string
  hook: string
  scenes: Scene[]
  totalDurationSec: number
  creditsCost: number
  jobId: string
}

export interface VoiceResult {
  audioUrl: string
  creditsCost: number
  jobId: string
}

export interface VideoResult {
  provider: string
  providerJobId: string
  jobId: string
  creditsCost: number
  status: string
  message?: string
}

async function callFunction<T>(slug: string, body: unknown, session: Session | null): Promise<T> {
  if (!session) throw new Error('Not authenticated')
  const res = await fetch(functionUrl(slug), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  if (data.error) throw new Error(data.error)
  return data as T
}

export async function generateScript(params: {
  prompt: string
  style?: 'tutorial' | 'vlog' | 'news' | 'story' | 'promo'
  tone?: 'professional' | 'casual' | 'energetic' | 'inspirational'
  durationSec?: number
}, session: Session | null): Promise<ScriptResult> {
  return callFunction<ScriptResult>('ai-script', params, session)
}

export async function generateVoice(params: {
  text: string
  voiceId?: string
  projectId?: string
}, session: Session | null): Promise<VoiceResult> {
  return callFunction<VoiceResult>('ai-voice', params, session)
}

export async function generateVideo(params: {
  prompt: string
  provider?: 'runway' | 'kling' | 'google'
  durationSec?: number
  aspectRatio?: '16:9' | '9:16' | '1:1'
  imageUrl?: string
  projectId?: string
}, session: Session | null): Promise<VideoResult> {
  return callFunction<VideoResult>('ai-video', params, session)
}

export interface VideoStatusResult {
  status: 'processing' | 'completed' | 'failed'
  resultUrl: string | null
  error: string | null
}

export async function checkVideoStatus(jobId: string, session: Session | null): Promise<VideoStatusResult> {
  if (!session) throw new Error('Not authenticated')
  const res = await fetch(`${functionUrl('ai-video')}?jobId=${encodeURIComponent(jobId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data as VideoStatusResult
}

export interface SubtitleSegment {
  start: number
  end: number
  text: string
}

export interface SubtitlesResult {
  jobId: string | null
  segments: SubtitleSegment[]
  language: string | null
  creditsCost: number
}

export async function generateSubtitles(params: {
  sourceUrl: string
  projectId?: string
  language?: string
}, session: Session | null): Promise<SubtitlesResult> {
  return callFunction<SubtitlesResult>('ai-subtitles', params, session)
}
