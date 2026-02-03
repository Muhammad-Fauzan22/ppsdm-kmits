'use client';

/**
 * Optimized Font Component
 * 
 * Komponen untuk loading font yang dioptimasi
 * Menggunakan font-display: swap untuk FOIT/FOUT prevention
 * 
 * @see https://web.dev/optimize-webfont-loading/
 */

import { useEffect, useState } from 'react';

interface OptimizedFontProps {
  fontFamily: string;
  weights?: number[];
  subsets?: string[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  className?: string;
  children: React.ReactNode;
}

/**
 * Optimized Font Component
 * 
 * Menggunakan Google Fonts dengan optimasi:
 * - font-display: swap untuk mencegah FOIT
 * - Preconnect ke font domain
 * - Subset font yang diperlukan saja
 */
export function OptimizedFont({
  fontFamily,
  weights = [400, 500, 600, 700],
  subsets = ['latin'],
  display = 'swap',
  className,
  children,
}: OptimizedFontProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preconnect ke Google Fonts
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectLink);

    const preconnectLink2 = document.createElement('link');
    preconnectLink2.rel = 'preconnect';
    preconnectLink2.href = 'https://fonts.gstatic.com';
    preconnectLink2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink2);

    // Load font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      ' ',
      '+'
    )}:wght@${weights.join(';')}&display=${display}&subset=${subsets.join(',')}`;
    
    fontLink.onload = () => setIsLoaded(true);
    document.head.appendChild(fontLink);

    return () => {
      // Cleanup
      document.head.removeChild(preconnectLink);
      document.head.removeChild(preconnectLink2);
      document.head.removeChild(fontLink);
    };
  }, [fontFamily, weights, subsets, display]);

  return (
    <span
      className={className}
      style={{
        fontFamily: `'${fontFamily}', sans-serif`,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
      }}
    >
      {children}
    </span>
  );
}

/**
 * Font Loading State Hook
 * 
 * Hook untuk memantau status loading font
 */
export function useFontLoading(fontFamily: string): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkFont = () => {
      const fonts = document.fonts;
      const font = `${fontFamily} 400`;
      setIsLoaded(fonts.check(font));
    };

    // Check immediately
    checkFont();

    // Check periodically
    const interval = setInterval(checkFont, 100);

    // Stop checking after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoaded(true); // Assume loaded after timeout
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fontFamily]);

  return isLoaded;
}

/**
 * Critical Font Loader
 * 
 * Untuk font yang critical (heading, hero text)
 * Menggunakan font-display: block untuk mencegah layout shift
 */
export function CriticalFont({
  fontFamily,
  weights = [700, 800],
  className,
  children,
}: Omit<OptimizedFontProps, 'display'>) {
  return (
    <OptimizedFont
      fontFamily={fontFamily}
      weights={weights}
      display="block"
      className={className}
    >
      {children}
    </OptimizedFont>
  );
}

/**
 * System Font Stack
 * 
 * Menggunakan system font untuk performa maksimal
 * Tidak perlu loading external font
 */
export function SystemFont({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Font Fallback Component
 * 
 * Menampilkan fallback font jika font utama belum loaded
 */
export function FontFallback({
  fontFamily,
  fallbackFont = 'sans-serif',
  className,
  children,
}: {
  fontFamily: string;
  fallbackFont?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const isLoaded = useFontLoading(fontFamily);

  return (
    <span
      className={className}
      style={{
        fontFamily: isLoaded ? `'${fontFamily}', ${fallbackFont}` : fallbackFont,
      }}
    >
      {children}
    </span>
  );
}
