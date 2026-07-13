export type AssetHealthStatus = 'missing' | 'stored' | 'provider'

export interface AssetHealth {
  status: AssetHealthStatus
  label: string
  tone: 'success' | 'warning' | 'info'
}

export function getAssetHealth(url?: string | null): AssetHealth {
  if (!url || !url.trim()) {
    return { status: 'missing', label: 'No asset', tone: 'warning' }
  }

  try {
    const parsed = new URL(url)
    const usesSupabaseStorage = parsed.hostname.includes('supabase.co') && parsed.pathname.includes('/storage/v1/object/public/ai-assets/')

    if (usesSupabaseStorage) {
      return { status: 'stored', label: 'Stored', tone: 'success' }
    }

    return { status: 'provider', label: 'Provider link', tone: 'info' }
  } catch {
    return { status: 'provider', label: 'External link', tone: 'info' }
  }
}
