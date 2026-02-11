'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Image optimization configuration
const IMAGE_DOMAINS = ['ppsdm.its.ac.id', 'images.unsplash.com', 'api.dicebear.com', 'lh3.googleusercontent.com'];
const IMAGE_FORMATS = ['image/avif', 'image/webp'];
const IMAGE_WIDTHS = [640, 750, 828, 1080, 1200, 1920];

interface OptimizedImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  fallback?: React.ReactNode;
  onError?: () => void;
}

/**
 * Optimized Image Component
 * 
 * Wrapper around Next.js Image with fallback handling and optimization.
 * Use this component instead of <img> tags throughout the application.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  quality = 85,
  fallback,
  onError,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-slate-100 dark:bg-slate-800",
          containerClassName
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
        {fallback || (
          <span className="text-slate-400 text-sm">No Image</span>
        )}
      </div>
    );
  }

  const handleError = () => {
    setError(true);
    onError?.();
  };

  if (fill) {
    return (
      <div className={cn("relative", containerClassName)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn("object-cover", className)}
          priority={priority}
          quality={quality}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 300}
      height={height || 300}
      sizes={sizes}
      className={cn('object-cover', className)}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      quality={quality}
      onError={handleError}
    />
  );
}

/**
 * Book Cover Image Component
 * Optimized for book covers with aspect ratio 2:3
 */
export function BookCoverImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={300}
      height={450}
      priority={priority}
      className={cn("w-full h-full", className)}
      containerClassName="w-full h-full"
      fallback={
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
          <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs font-medium">No Cover</span>
        </div>
      }
    />
  );
}

/**
 * Avatar Image Component
 * Optimized for user avatars
 */
export function AvatarImage({
  src,
  alt,
  size = 40,
  className,
  priority = false,
}: {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-full", className)}
      containerClassName={cn("rounded-full overflow-hidden", className)}
      fallback={
        <div 
          className="rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold"
          style={{ width: size, height: size }}
        >
          {alt?.charAt(0).toUpperCase() || '?'}
        </div>
      }
    />
  );
}

/**
 * Course Thumbnail Image Component
 * Optimized for course thumbnails with aspect ratio 16:9
 */
export function CourseThumbnailImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={640}
      height={360}
      priority={priority}
      className={cn("w-full h-full", className)}
      containerClassName="w-full h-full"
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
          <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      }
    />
  );
}

export default OptimizedImage;
