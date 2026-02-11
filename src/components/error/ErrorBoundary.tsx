'use client';

/**
 * Error Boundary Component
 * 
 * Menangkap error JavaScript di komponen anak dan menampilkan fallback UI
 * Mencegah seluruh aplikasi crash karena error di satu komponen
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Menangkap error di komponen anak dan menampilkan UI fallback
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state sehingga render berikutnya menampilkan fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error ke console
    // Log error ke error tracking service (jika tersedia)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }

    // Simpan error info ke state
    this.setState({
      errorInfo,
    });

    // Panggil callback onError jika disediakan
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Jika ada custom fallback, gunakan itu
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Gunakan default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Terjadi Kesalahan
              </CardTitle>
              <CardDescription className="text-base">
                Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                    Error Details (Development Mode):
                  </h3>
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-slate-600 dark:text-slate-400 mt-2 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                  Apa yang bisa Anda lakukan?
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Coba refresh halaman ini</li>
                  <li>Kembali ke halaman sebelumnya</li>
                  <li>Jika masalah berlanjut, hubungi tim support</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} variant="default" className="w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple Error Fallback Component
 * 
 * Versi sederhana dari Error Boundary untuk kasus penggunaan yang lebih ringan
 */
export function SimpleErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}): ReactNode {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
            Terjadi Kesalahan
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            {error.message || 'Terjadi kesalahan yang tidak terduga.'}
          </p>
          <Button
            onClick={resetError}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Async Error Boundary
 * 
 * Khusus untuk menangani error pada async operations
 */
export function withAsyncErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  return function AsyncErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
