'use client';

import React, { lazy, Suspense, ComponentType } from 'react';
import { Skeleton, SkeletonCard, SkeletonList } from './SkeletonLoaders';
import { ImageOff } from 'lucide-react';

/**
 * LazyLoader - Higher-order component for lazy loading with skeleton fallback
 */
interface LazyLoaderProps {
    loader: () => Promise<{ default: ComponentType<unknown> }>;
    fallback?: React.ReactNode;
    props?: Record<string, unknown>;
}

export function LazyLoader({ loader, fallback, props = {} }: LazyLoaderProps) {
    const LazyComponent = lazy(loader);

    return (
        <Suspense fallback={fallback || <SkeletonCard />}>
            <LazyComponent {...props} />
        </Suspense>
    );
}

/**
 * LazyImage - Image with lazy loading and blur placeholder
 */
export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    blurHash?: string;
    aspectRatio?: string;
}

export function LazyImage({
    src,
    alt,
    className,
    blurHash,
    aspectRatio = '16/9',
    ...props
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    return (
        <div
            className={`relative overflow-hidden bg-white/5 ${className}`}
            style={{ aspectRatio }}
        >
            {/* Skeleton placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                    <ImageOff className="text-slate-500 w-8 h-8" />
                </div>
            )}

            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                {...props}
            />
        </div>
    );
}

/**
 * LazySection - Section that loads when visible in viewport
 */
export interface LazySectionProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
    className?: string;
}

export function LazySection({
    children,
    fallback,
    rootMargin = '200px',
    threshold = 0.1,
    className,
}: LazySectionProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [rootMargin, threshold]);

    return (
        <div ref={ref} className={className}>
            {isVisible ? children : (fallback || <SkeletonCard />)}
        </div>
    );
}

/**
 * LazyList - Virtualized-like list for large datasets
 */
export interface LazyListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    itemHeight?: number;
    overscan?: number;
    className?: string;
    emptyState?: React.ReactNode;
}

export function LazyList<T>({
    items,
    renderItem,
    itemHeight = 80,
    overscan = 5,
    className,
    emptyState,
}: LazyListProps<T>) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 20 });

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;

            const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
            const end = Math.min(
                items.length,
                Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
            );

            setVisibleRange({ start, end });
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [items.length, itemHeight, overscan]);

    if (items.length === 0) {
        return <>{emptyState || <div className="text-center text-slate-500 py-8">No items</div>}</>;
    }

    const totalHeight = items.length * itemHeight;
    const offsetTop = visibleRange.start * itemHeight;

    return (
        <div ref={containerRef} className={`overflow-auto ${className}`} style={{ maxHeight: '100%' }}>
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ position: 'absolute', top: offsetTop, left: 0, right: 0 }}>
                    {items.slice(visibleRange.start, visibleRange.end).map((item, i) => (
                        <div key={visibleRange.start + i} style={{ height: itemHeight }}>
                            {renderItem(item, visibleRange.start + i)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * DeferredRender - Delay rendering for non-critical components
 */
export interface DeferredRenderProps {
    children: React.ReactNode;
    delay?: number;
    fallback?: React.ReactNode;
}

export function DeferredRender({ children, delay = 100, fallback }: DeferredRenderProps) {
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setShouldRender(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return <>{shouldRender ? children : fallback}</>;
}

export default LazyLoader;
