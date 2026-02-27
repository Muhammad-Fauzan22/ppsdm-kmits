import * as Sentry from '@sentry/nextjs';

const isProd = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Sample 10% of transactions in production, 100% in development
  tracesSampleRate: isProd ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: !isProd,

  // Capture 100% of errors in replays, but only 5% of sessions in production
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: isProd ? 0.05 : 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: 'system',
      showBranding: false,
    }),
  ],

  // Filter out specific errors
  beforeSend(event) {
    // Filter out specific errors that are not useful
    const errorMessage = event.exception?.values?.[0]?.value;
    if (errorMessage) {
      // Filter out common non-actionable errors
      const filteredErrors = [
        'ResizeObserver loop limit exceeded',
        'Network request failed',
        'Failed to fetch',
      ];
      if (filteredErrors.some(err => errorMessage.includes(err))) {
        return null;
      }
    }
    return event;
  },

  // Performance monitoring
  // Performance monitoring
  // enableTracing: true, // Removed as it is not supported in this version

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
});
