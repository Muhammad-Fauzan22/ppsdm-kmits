'use client';

/**
 * Optimized Image Component
 * 
 * Komponen gambar yang dioptimasi untuk performa LCP
 * Mendukung lazy loading, placeholder, dan format modern
 * 
 * @see https://web.dev/optimize-lcp/
 */

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component
 * 
 * Menggunakan Next.js Image dengan optimasi tambahan:
 * - Lazy loading otomatis (kecuali priority)
 * - Placeholder blur untuk UX yang lebih baik
 * - Format modern (WebP, AVIF)
 * - Responsive sizes
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder jika tidak disediakan
  const generateBlurDataURL = (w: number, h: number): string => {
    // Simple SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
      </svg>
    `;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  };

  // Jika error, tampilkan placeholder
  if (hasError) {
    return (
      <div
        className={cn(
          'bg-slate-200 dark:bg-slate-800 flex items-center justify-center',
          className
        )}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-slate-400 dark:text-slate-600 text-sm">
          Gambar tidak tersedia
        </span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse',
            'flex items-center justify-center'
          )}
        >
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-slate-500 dark:border-t-slate-400 rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

/**
 * Critical Image Component
 * 
 * Untuk gambar yang critical (hero, above-the-fold)
 * Selalu di-load dengan priority dan tanpa lazy loading
 */
export function CriticalImage(props: Omit<OptimizedImageProps, 'priority'>) {
  return <OptimizedImage {...props} priority={true} />;
}

/**
 * Background Image Component
 * 
 * Untuk background image dengan overlay
 */
export function BackgroundImage({
  src,
  alt,
  children,
  className,
  overlay = true,
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
}) {
  return (
    <div className={cn('relative w-full h-full', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority={true}
        className="object-cover"
        placeholder="blur"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Avatar Component
 * 
 * Untuk avatar user dengan fallback
 */
export function Avatar({
  src,
  alt,
  name,
  size = 40,
  className,
}: {
  src?: string;
  alt: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    // Fallback ke inisial
    const initials = name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';

    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold',
          className
        )}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: size * 0.4 }}>{initials}</span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full', className)}
      onError={() => setHasError(true)}
    />
  );
}
