'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

// Image optimization configuration
const IMAGE_DOMAINS = ['ppsdm.its.ac.id', 'images.unsplash.com'];
const IMAGE_FORMATS = ['image/avif', 'image/webp'];
const IMAGE_WIDTHS = [640, 750, 828, 1080, 1200, 1920];

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  imageSizes?: number[];
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  imageSizes = IMAGE_WIDTHS,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      className={cn('object-cover rounded-lg', className)}
    />
  );
}

export default OptimizedImage;