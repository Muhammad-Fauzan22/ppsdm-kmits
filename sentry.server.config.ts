import * as Sentry from '@sentry/nextjs';

const isProd = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Sample 10% of transactions in production, 100% in development
  tracesSampleRate: isProd ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: !isProd,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',

  // Server-side specific configuration
  beforeSend(event) {
    // Sanitize sensitive data - never send cookies or auth headers to Sentry
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete (event.request.headers as Record<string, unknown>)['cookie'];
        delete (event.request.headers as Record<string, unknown>)['authorization'];
        delete (event.request.headers as Record<string, unknown>)['x-api-key'];
      }
    }

    // Remove sensitive user data
    if (event.user) {
      // Keep user ID for debugging but remove PII
      event.user = { id: event.user.id };
    }

    return event;
  },
});
