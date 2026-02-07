'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ActivityNotification - Real-time FOMO notification showing recent user activity
 * Creates urgency by showing others are actively using the platform
 */

interface Activity {
    id: string;
    name: string;
    location: string;
    action: string;
    timeAgo: string;
}

const sampleActivities: Activity[] = [
    { id: '1', name: 'Ahmad R.', location: 'Surabaya', action: 'baru saja menyelesaikan assessment Kognitif', timeAgo: '2 menit lalu' },
    { id: '2', name: 'Sarah W.', location: 'Jakarta', action: 'bergabung dengan program PPSDM', timeAgo: '5 menit lalu' },
    { id: '3', name: 'Budi S.', location: 'Bandung', action: 'naik level ke Level 12', timeAgo: '8 menit lalu' },
    { id: '4', name: 'Dewi K.', location: 'Surabaya', action: 'mendapatkan badge "Critical Thinker"', timeAgo: '12 menit lalu' },
    { id: '5', name: 'Fajar P.', location: 'Malang', action: 'menyelesaikan modul Financial Literacy', timeAgo: '15 menit lalu' },
    { id: '6', name: 'Nina H.', location: 'Yogyakarta', action: 'bergabung dengan program PPSDM', timeAgo: '18 menit lalu' },
    { id: '7', name: 'Rizky A.', location: 'Surabaya', action: 'menyelesaikan assessment Emotional', timeAgo: '22 menit lalu' },
    { id: '8', name: 'Putri M.', location: 'Semarang', action: 'naik level ke Level 8', timeAgo: '25 menit lalu' },
];

interface ActivityNotificationProps {
    /** Whether to show notifications */
    enabled?: boolean;
    /** Delay before first notification (ms) */
    initialDelay?: number;
    /** Interval between notifications (ms) */
    interval?: number;
    /** Duration notification stays visible (ms) */
    duration?: number;
    /** Position on screen */
    position?: 'bottom-left' | 'bottom-right';
    /** Custom activities array */
    activities?: Activity[];
}

export function ActivityNotification({
    enabled = true,
    initialDelay = 5000,
    interval = 8000,
    duration = 5000,
    position = 'bottom-left',
    activities = sampleActivities,
}: ActivityNotificationProps) {
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activityIndex, setActivityIndex] = useState(0);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (!enabled || isDismissed) return;

        // Initial delay before first notification
        const initialTimer = setTimeout(() => {
            showNotification();
        }, initialDelay);

        return () => clearTimeout(initialTimer);
    }, [enabled, isDismissed]);

    useEffect(() => {
        if (!enabled || isDismissed || !isVisible) return;

        // Hide after duration
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(hideTimer);
    }, [isVisible, duration, enabled, isDismissed]);

    useEffect(() => {
        if (!enabled || isDismissed || isVisible) return;

        // Schedule next notification
        const nextTimer = setTimeout(() => {
            showNotification();
        }, interval);

        return () => clearTimeout(nextTimer);
    }, [isVisible, interval, enabled, isDismissed]);

    const showNotification = () => {
        const nextIndex = (activityIndex + 1) % activities.length;
        setActivityIndex(nextIndex);
        setCurrentActivity(activities[nextIndex]);
        setIsVisible(true);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
    };

    const positionClasses = {
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
    };

    if (!enabled) return null;

    return (
        <AnimatePresence>
            {isVisible && currentActivity && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`fixed ${positionClasses[position]} z-50 max-w-sm`}
                >
                    <div className="bg-white dark:bg-[#1A1F2E] rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 relative overflow-hidden">
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FFD700] to-[#FF6B00]" />

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                            aria-label="Dismiss notification"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex items-start gap-3 pr-6">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-black">
                                    {currentActivity.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900 dark:text-white">
                                    <span className="font-semibold">{currentActivity.name}</span>
                                    <span className="text-slate-500 dark:text-slate-400"> dari {currentActivity.location}</span>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                                    {currentActivity.action}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    {currentActivity.timeAgo}
                                </p>
                            </div>
                        </div>

                        {/* Verified badge */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Verified by PPSDM KM ITS</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ActivityNotification;
