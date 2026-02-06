'use client';

/**
 * Error Boundary Component for PPSDM KMITS
 * Integrates with Sentry for error tracking (free tier: 5k errors/month)
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

/**
 * Global error handler for uncaught errors
 */
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  // Handle uncaught exceptions
  window.addEventListener('error', (event) => {
    Sentry.captureException(event.error);
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    Sentry.captureException(event.reason);
  });
}

/**
 * Error boundary component that catches React errors
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: crypto.randomUUID(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorFallback
            error={this.state.error}
            errorId={this.state.errorId}
            onReset={() => this.setState({ hasError: false, error: null, errorId: null })}
          />
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Error fallback UI component
 */
function ErrorFallback({ 
  error, 
  errorId,
  onReset 
}: { 
  error: Error | null;
  errorId: string | null;
  onReset: () => void;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Terjadi Kesalahan
        </h2>
        
        <p className="text-gray-600 mb-4">
          Kami mohon maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu.
        </p>

        {errorId && (
          <p className="text-sm text-gray-400 mb-4">
            ID Kesalahan: {errorId}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={onReset}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Muat Ulang Halaman
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Lihat Detail Kesalahan (Development Only)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-40">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * Hook-based error boundary for functional components
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
    }
  }, [error]);

  const resetError = useCallback(() => {
    setError(null);
    setErrorId(null);
  }, []);

  const throwError = useCallback((err: Error) => {
    setError(err);
    setErrorId(crypto.randomUUID());
  }, []);

  return { error, errorId, resetError, throwError };
}

import { useState, useEffect, useCallback } from 'react';

/**
 * Async error boundary wrapper for handling async errors
 */
export function withAsyncErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithAsyncErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Sentry User Feedback component
 */
export function SentryFeedback() {
  useEffect(() => {
    // Initialize Sentry feedback if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      const sentry = (window as any).Sentry;
      // Feedback integration would be initialized here
    }
  }, []);

  return null;
}

/**
 * Report dialog for user feedback
 */
export function showReportDialog(issueId?: string) {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const sentry = (window as any).Sentry;
    sentry.showReportDialog({
      eventId: issueId,
      title: 'Ada masalah dengan aplikasi ini?',
      subtitle: 'Tim kami telah diberitahu tentang masalah ini.',
      subtitle2: '',
      labelName: 'Nama',
      labelEmail: 'Email',
      labelComments: 'Apa yang terjadi?',
      labelClose: 'Tutup',
      labelSubmit: 'Kirim',
       errorGenericInput: 'Terjadi kesalahan input',
      errorFormEntry: 'Kesalahan pada form',
    });
  }
}
