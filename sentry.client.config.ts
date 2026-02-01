import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  
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
  enableTracing: true,
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
});
