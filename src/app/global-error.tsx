'use client';

/**
 * Global Error Handler untuk Next.js App Router
 * 
 * Menangani error yang tidak tertangkap oleh Error Boundary
 * Ini adalah fallback terakhir untuk error di root layout
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke console
    console.error('Global error:', error);

    // Log error ke error tracking service (jika tersedia)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          errorType: 'global-error',
        },
      });
    }
  }, [error]);

  return (
    <html lang="id">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40 p-4">
          <Card className="w-full max-w-2xl shadow-2xl border-red-200 dark:border-red-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-red-900 dark:text-red-100">
                Kesalahan Sistem
              </CardTitle>
              <CardDescription className="text-base text-red-700 dark:text-red-300">
                Terjadi kesalahan yang tidak terduga pada sistem. Tim teknis kami telah diberitahu.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="font-semibold text-sm text-red-900 dark:text-red-100 mb-2">
                    Error Details (Development Mode):
                  </h3>
                  <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto max-h-40">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                  Langkah yang dapat dilakukan:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Refresh halaman ini</li>
                  <li>Coba kembali setelah beberapa saat</li>
                  <li>Hapus cache browser dan coba lagi</li>
                  <li>Jika masalah berlanjut, hubungi tim support</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-yellow-900 dark:text-yellow-100 mb-2">
                  Informasi Tambahan:
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Error ini telah dicatat secara otomatis. Tim teknis kami akan segera memeriksanya dan memperbaikinya.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={reset}
                variant="default"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="w-full sm:w-auto border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  );
}
