'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Skeleton Loading Components
 * Premium skeleton loaders with shimmer effect
 */

interface SkeletonProps {
    className?: string;
    shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true }: SkeletonProps) {
    return (
        <div
            className={cn(
                'bg-white/5 rounded-lg relative overflow-hidden',
                shimmer && 'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:animate-shimmer',
                className
            )}
        />
    );
}

/**
 * SkeletonCard - Card placeholder with header and content
 */
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn('bg-[#121212] rounded-xl border border-white/10 p-4 space-y-4', className)}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
            </div>

            {/* Footer */}
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
            </div>
        </div>
    );
}

/**
 * SkeletonList - List placeholder with multiple items
 */
export function SkeletonList({ count = 5, className }: { count?: number; className?: string }) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#121212] rounded-lg">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="w-20 h-8 rounded-full" />
                </div>
            ))}
        </div>
    );
}

/**
 * SkeletonGrid - Grid placeholder for dimension cards
 */
export function SkeletonGrid({ columns = 3, rows = 3, className }: { columns?: number; rows?: number; className?: string }) {
    return (
        <div className={cn(`grid gap-4`, className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns * rows }).map((_, i) => (
                <div key={i} className="bg-[#121212] rounded-xl border border-white/10 p-4 aspect-[4/3]">
                    {/* Icon */}
                    <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                    {/* Title */}
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    {/* Description */}
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-4/5" />
                    {/* Progress */}
                    <div className="mt-4">
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * SkeletonDashboard - Full dashboard skeleton
 */
export function SkeletonDashboard() {
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="w-12 h-12 rounded-full" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#121212] rounded-xl p-4 border border-white/10">
                        <Skeleton className="w-8 h-8 rounded-lg mb-3" />
                        <Skeleton className="h-7 w-16 mb-1" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <SkeletonCard className="h-64" />
                </div>
                <div>
                    <SkeletonList count={4} />
                </div>
            </div>
        </div>
    );
}

/**
 * SkeletonCarousel - Horizontal carousel skeleton
 */
export function SkeletonCarousel({ items = 5, className }: { items?: number; className?: string }) {
    return (
        <div className={cn('space-y-4', className)}>
            {/* Header */}
            <div className="flex justify-between items-center px-2">
                <Skeleton className="h-6 w-40" />
                <div className="flex gap-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                </div>
            </div>

            {/* Cards */}
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: items }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-64 h-40 rounded-xl bg-[#121212] border border-white/10 p-3">
                        <Skeleton className="w-full h-20 rounded-lg mb-3" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * SkeletonProfile - User profile skeleton
 */
export function SkeletonProfile({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-4', className)}>
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default Skeleton;
