'use client';

import React, { useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

/**
 * ContentCarousel - Netflix-style horizontal scrolling carousel
 * with smooth animations and navigation controls
 */

export interface ContentCarouselProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    showArrows?: boolean;
    showPeek?: boolean; // Show peek of next/previous items
    gap?: 'sm' | 'md' | 'lg';
    itemWidth?: number; // Optional fixed item width
    className?: string;
}

const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
};

export function ContentCarousel({
    children,
    title,
    subtitle,
    showArrows = true,
    showPeek = true,
    gap = 'md',
    itemWidth,
    className,
}: ContentCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.clientWidth * 0.8;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    React.useEffect(() => {
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScroll);
            checkScroll();
            return () => ref.removeEventListener('scroll', checkScroll);
        }
    }, []);

    return (
        <div className={cn('relative', className)}>
            {/* Header */}
            {(title || subtitle) && (
                <div className="flex items-end justify-between mb-4 px-2">
                    <div>
                        {title && (
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
                        )}
                    </div>

                    {/* Arrow Controls (desktop) */}
                    {showArrows && (
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center',
                                    'bg-white/5 border border-white/10',
                                    'transition-all duration-200',
                                    canScrollLeft
                                        ? 'hover:bg-white/10 hover:border-white/20 text-white'
                                        : 'opacity-30 cursor-not-allowed text-slate-500'
                                )}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center',
                                    'bg-white/5 border border-white/10',
                                    'transition-all duration-200',
                                    canScrollRight
                                        ? 'hover:bg-white/10 hover:border-white/20 text-white'
                                        : 'opacity-30 cursor-not-allowed text-slate-500'
                                )}
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Scroll Container */}
            <div className="relative group">
                {/* Left Fade */}
                {showPeek && canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
                )}

                {/* Right Fade */}
                {showPeek && canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
                )}

                {/* Scrollable Content */}
                <div
                    ref={scrollRef}
                    className={cn(
                        'flex overflow-x-auto scrollbar-hide scroll-smooth',
                        '-mx-2 px-2',
                        gapClasses[gap]
                    )}
                    style={{
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {React.Children.map(children, (child, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 scroll-snap-align-start"
                            style={itemWidth ? { width: itemWidth } : {}}
                        >
                            {child}
                        </div>
                    ))}
                </div>

                {/* Hover Arrow Controls (on content) */}
                {showArrows && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className={cn(
                                'absolute left-2 top-1/2 -translate-y-1/2 z-20',
                                'w-12 h-12 rounded-full flex items-center justify-center',
                                'bg-black/70 backdrop-blur-sm border border-white/10',
                                'opacity-0 group-hover:opacity-100',
                                'transition-all duration-300',
                                'hover:bg-black/90 hover:scale-110',
                                'md:hidden', // Only show on touch devices
                                !canScrollLeft && 'hidden'
                            )}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className={cn(
                                'absolute right-2 top-1/2 -translate-y-1/2 z-20',
                                'w-12 h-12 rounded-full flex items-center justify-center',
                                'bg-black/70 backdrop-blur-sm border border-white/10',
                                'opacity-0 group-hover:opacity-100',
                                'transition-all duration-300',
                                'hover:bg-black/90 hover:scale-110',
                                'md:hidden', // Only show on touch devices
                                !canScrollRight && 'hidden'
                            )}
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * CarouselCard - Individual card for use within ContentCarousel
 */
export interface CarouselCardProps {
    title: string;
    subtitle?: string;
    image?: string;
    badge?: string;
    progress?: number;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export function CarouselCard({
    title,
    subtitle,
    image,
    badge,
    progress,
    onClick,
    className,
    children,
}: CarouselCardProps) {
    return (
        <motion.div
            className={cn(
                'relative w-64 h-40 rounded-xl overflow-hidden group cursor-pointer',
                'bg-[#121212] border border-white/5',
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            {/* Background Image */}
            {image && (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Badge */}
            {badge && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#FF6B00] text-white text-[10px] font-bold uppercase">
                    {badge}
                </div>
            )}

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-3">
                <h4 className="font-semibold text-white truncate">{title}</h4>
                {subtitle && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>
                )}

                {/* Progress Bar */}
                {progress !== undefined && (
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#E50914] rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {children}
            </div>

            {/* Play Button (Netflix-style) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 text-[#0A0A0A] ml-1 fill-current" />
                </div>
            </div>
        </motion.div>
    );
}

export default ContentCarousel;
