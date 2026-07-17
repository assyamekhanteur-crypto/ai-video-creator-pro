import { useEffect } from 'react'

const DEFAULT_TITLE = 'AI Creator Pro — Turn a prompt into a finished video'
const DEFAULT_DESCRIPTION = 'AI Creator Pro takes a single prompt and produces a scripted, narrated, scored, subtitled video ready to publish. Script, voice, music and edit — one pipeline, no editing experience required.'

/**
 * Sets a page-specific <title> and meta description. Without this, every
 * route in this single-page app would show the same title/description in
 * search results and browser tabs — bad for both CTR and relevance.
 */
export function useSEO(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title.includes('AI Creator Pro') ? title : `${title} — AI Creator Pro`

    const meta = document.querySelector('meta[name="description"]')
    const prevDescription = meta?.getAttribute('content') ?? DEFAULT_DESCRIPTION
    if (meta && description) meta.setAttribute('content', description)

    return () => {
      document.title = prevTitle || DEFAULT_TITLE
      if (meta) meta.setAttribute('content', prevDescription)
    }
  }, [title, description])
}
