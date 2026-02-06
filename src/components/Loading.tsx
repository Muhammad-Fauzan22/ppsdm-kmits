"use client";

import { motion, AnimatePresence } from "framer-motion";

// Skeleton loader for cards
export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6 ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <div className="size-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
        </div>
    );
}

// Skeleton loader for stats
export function SkeletonStat({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 ${className}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="size-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
    );
}

// Skeleton loader for list items
export function SkeletonListItem({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse flex items-center gap-4 py-4 ${className}`}>
            <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
    );
}

// Skeleton loader for charts
export function SkeletonChart({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    );
}

// Skeleton loader for table rows
export function SkeletonTable({ rows = 5, className = "" }: { rows?: number; className?: string }) {
    return (
        <div className={`animate-pulse bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-border-light dark:border-border-dark">
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="px-6 py-4 border-b border-border-light dark:border-border-dark last:border-0">
                    <div className="flex gap-4 items-center">
                        <div className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 ml-auto"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Skeleton for profile header
export function SkeletonProfile({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
            <div className="bg-white dark:bg-card-dark rounded-b-xl p-6 -mt-16">
                <div className="flex items-center gap-6">
                    <div className="size-32 bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-white dark:border-card-dark"></div>
                    <div className="space-y-3">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Full page loading spinner
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizes = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div className="flex items-center justify-center p-4">
            <motion.div
                className={`${sizes[size]} border-4 border-primary/30 border-t-primary rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}

// Full page loading overlay
export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
            >
                <LoadingSpinner size="lg" />
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
                >
                    {message}
                </motion.p>
            </motion.div>
        </AnimatePresence>
    );
}
