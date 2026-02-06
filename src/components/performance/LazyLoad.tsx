'use client';

/**
 * Lazy Loading Components
 * 
 * Komponen untuk lazy loading komponen berat
 * Menggunakan React.lazy dan Suspense untuk code splitting
 * 
 * @see https://react.dev/reference/react/lazy
 */

import { lazy, Suspense, ComponentType, useState, useEffect } from 'react';
import { Skeleton } from '@/components/loading/Skeleton';

/**
 * Lazy Load Wrapper
 * 
 * Wrapper untuk lazy loading komponen dengan fallback
 */
export function LazyLoad<T extends object>({
  component,
  fallback,
  ...props
}: {
  component: ComponentType<T>;
  fallback?: React.ReactNode;
} & T) {
  const LazyComponent = lazy(() => Promise.resolve({ default: component }));

  return (
    <Suspense fallback={fallback || <Skeleton className="w-full h-full" />}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  );
}

/**
 * Create Lazy Component
 * 
 * Helper untuk membuat lazy component dengan fallback default
 */
export function createLazyComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);

  return function LazyComponentWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <Skeleton className="w-full h-full" />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

/**
 * Intersection Observer Lazy Load
 * 
 * Lazy load komponen saat masuk viewport
 */
export function IntersectionLazyLoad({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '0px',
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return (
    <div ref={setRef}>
      {isVisible ? children : fallback || <Skeleton className="w-full h-full" />}
    </div>
  );
}

/**
 * Lazy Load Image
 * 
 * Lazy load image saat masuk viewport
 */
export function LazyImage({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref]);

  return (
    <img
      ref={setRef}
      src={isVisible ? src : undefined}
      alt={alt}
      className={className}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
}

/**
 * Lazy Load Script
 * 
 * Lazy load script saat dibutuhkan
 */
export function LazyScript({
  src,
  onLoad,
  onError,
  ...props
}: React.ScriptHTMLAttributes<HTMLScriptElement> & {
  src: string;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    script.onerror = () => {
      onError?.();
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src, onLoad, onError]);

  return null;
}

/**
 * Lazy Load Iframe
 * 
 * Lazy load iframe saat masuk viewport
 */
export function LazyIframe({
  src,
  title,
  className,
  ...props
}: React.IframeHTMLAttributes<HTMLIFrameElement>) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref]);

  return (
    <iframe
      ref={setRef}
      src={isVisible ? src : undefined}
      title={title}
      className={className}
      {...props}
    />
  );
}

/**
 * Lazy Load Video
 * 
 * Lazy load video saat masuk viewport
 */
export function LazyVideo({
  src,
  poster,
  className,
  ...props
}: React.VideoHTMLAttributes<HTMLVideoElement>) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref]);

  return (
    <video
      ref={setRef}
      src={isVisible ? src : undefined}
      poster={poster}
      className={className}
      {...props}
    />
  );
}

/**
 * Lazy Load Component Group
 * 
 * Lazy load multiple components sekaligus
 */
export function LazyLoadGroup({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <Skeleton className="w-full h-full" />}>
      {children}
    </Suspense>
  );
}
