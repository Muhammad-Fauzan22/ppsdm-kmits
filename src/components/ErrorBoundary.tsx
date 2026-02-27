'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional context label for better error reporting (e.g., "AssessmentPage") */
  context?: string;
  /** If true, shows a compact inline error instead of full-screen */
  inline?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ErrorBoundary${this.props.context ? `:${this.props.context}` : ''}]`, error, errorInfo);
    }

    // Report to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // Dynamic import to avoid SSR issues
        import('@sentry/nextjs').then(Sentry => {
          Sentry.captureException(error, {
            extra: {
              componentStack: errorInfo.componentStack,
              context: this.props.context,
              errorId: this.state.errorId,
            },
          });
        }).catch(() => {
          // Sentry not available, fail silently
        });
      } catch {
        // Fail silently if Sentry import fails
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Custom fallback provided
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Inline error (for non-critical sections)
    if (this.props.inline) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm text-red-700 mb-2">
            Terjadi kesalahan pada bagian ini.
          </p>
          <Button
            onClick={this.handleReset}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-100 text-xs"
          >
            Coba Lagi
          </Button>
        </div>
      );
    }

    // Full-screen error
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>

          {/* Message */}
          <p className="text-gray-500 text-sm mb-2">
            Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu.
          </p>

          {/* Error ID for support */}
          {this.state.errorId && (
            <p className="text-xs text-gray-400 mb-6 font-mono">
              ID: {this.state.errorId}
            </p>
          )}

          {/* Dev-only error details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 text-left">
              <summary className="text-red-500 cursor-pointer text-sm font-medium mb-2 select-none">
                Detail Error (Development Only)
              </summary>
              <pre className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 overflow-auto max-h-40 whitespace-pre-wrap break-words">
                {this.state.error.message}
                {this.state.error.stack && '\n\n' + this.state.error.stack}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={this.handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Coba Lagi
            </Button>

            <Button
              onClick={this.handleGoHome}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Kembali ke Beranda
            </Button>

            <Button
              onClick={this.handleReload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Muat Ulang Halaman
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
export { ErrorBoundary };
