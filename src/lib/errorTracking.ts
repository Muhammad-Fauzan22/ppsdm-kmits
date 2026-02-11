// Global error handler for client-side errors 
// This provides basic error tracking without external dependencies
// For production, consider integrating Sentry (free tier: 5K errors/month)

interface ErrorLog {
    timestamp: string;
    message: string;
    stack?: string;
    url: string;
    userAgent: string;
    componentStack?: string;
}

class ErrorTracker {
    private errors: ErrorLog[] = [];
    private maxErrors = 100;

    logError(error: Error, componentStack?: string) {
        const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            url: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            componentStack,
        };

        this.errors.push(errorLog);

        // Keep only last N errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            }

        // In production, you could send to external service here
        // Example: this.sendToSentry(errorLog);
    }

    getErrors(): ErrorLog[] {
        return [...this.errors];
    }

    clearErrors() {
        this.errors = [];
    }

    // Placeholder for Sentry integration
    // async sendToSentry(error: ErrorLog) {
    //   if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //     // Sentry.captureException(error);
    //   }
    // }
}

export const errorTracker = new ErrorTracker();

// Global error handlers
if (typeof window !== 'undefined') {
    window.onerror = (message, source, lineno, colno, error) => {
        if (error) {
            errorTracker.logError(error);
        }
        return false;
    };

    window.onunhandledrejection = (event) => {
        errorTracker.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`));
    };
}

export default errorTracker;
