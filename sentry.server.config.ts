import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN
const SENTRY_ENVIRONMENT =
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV
const SENTRY_TRACES_SAMPLE_RATE = Number(
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? '0.1'
)

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    enabled: process.env.NODE_ENV === 'production',
    ignoreErrors: [
      // GitHub API rate limit - we handle this in the UI
      'GitHub API rate limit exceeded',
      // User-cancelled navigation
      'AbortError',
      'NEXT_NOT_FOUND',
      'NEXT_REDIRECT',
    ],
  })
}
