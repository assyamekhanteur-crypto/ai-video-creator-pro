import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    // No DSN configured — Sentry stays fully inactive. This is intentional:
    // the app must work identically whether or not monitoring is set up.
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    // Don't let monitoring itself become a source of user-facing noise.
    beforeSend(event) {
      return event
    },
  })
}

export { Sentry }
