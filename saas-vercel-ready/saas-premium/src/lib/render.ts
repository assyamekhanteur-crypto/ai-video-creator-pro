import type { Session } from '@supabase/supabase-js'

const functionUrl = (slug: string) => `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${slug}`

export type RenderJobType = 'script' | 'voice' | 'video' | 'export'
export type RenderStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface RenderJob {
  id: string
  user_id: string
  project_id: string | null
  job_type: RenderJobType
  provider: string
  status: RenderStatus
  priority: number
  prompt: string
  options: Record<string, unknown>
  result_url: string | null
  result_text: string | null
  error_message: string | null
  error_code: string | null
  attempt: number
  max_attempts: number
  credits_cost: number
  queued_at: string
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface SubmitRenderParams {
  jobType: RenderJobType
  provider?: string
  prompt: string
  options?: Record<string, unknown>
  projectId?: string
}

export interface SubmitResponse {
  jobId: string
  status: RenderStatus
  creditsCost: number
  message: string
}

async function callEdge<T>(slug: string, method: 'GET' | 'POST', body: unknown, session: Session | null): Promise<T> {
  if (!session) throw new Error('Not authenticated')
  const res = await fetch(functionUrl(slug), {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  if (data.error) throw new Error(data.error)
  return data as T
}

export async function submitRender(params: SubmitRenderParams, session: Session | null): Promise<SubmitResponse> {
  return callEdge<SubmitResponse>('submit-render', 'POST', params, session)
}

export async function applyReferral(code: string, session: Session | null): Promise<{ success: boolean; message: string }> {
  return callEdge<{ success: boolean; message: string }>('apply-referral', 'POST', { referralCode: code }, session)
}

export function parseScriptResult(resultText: string | null): { title: string; hook: string; scenes: Array<{ id: number; heading: string; narration: string; visuals: string; durationSec: number }> } | null {
  if (!resultText) return null
  try {
    return JSON.parse(resultText)
  } catch {
    return null
  }
}
