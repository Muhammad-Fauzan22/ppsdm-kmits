/**
 * Hooks Index
 * 
 * Central export for all custom hooks
 */

'use client';

import { useEffect, useState } from 'react';

// Data fetching hooks
export { useDashboard, useUserStats, useRecentActivities, useDashboardDimensions, useRecentAchievements } from './useDashboard';
export type { UseDashboardReturn } from './useDashboard';

export { useDimensions, useDimensionStats, formatDimensionScore, getDimensionColor, getDimensionStatus } from './useDimensions';
export type { UseDimensionsReturn } from './useDimensions';

export { useGoals, useGoalsByStatus, useActiveGoals, useCompletedGoals, calculateGoalProgress, isGoalOverdue, getDaysRemaining } from './useGoals';
export type { UseGoalsReturn, UseGoalsOptions } from './useGoals';

export { useProgress, calculateImprovement, getTrendDirection, formatChartData, getTimeRangeLabel, TIME_RANGE_OPTIONS } from './useProgress';
export type { UseProgressReturn } from './useProgress';

// Re-export types from API client
export type {
  DimensionData,
  GoalsListResponse,
  ProgressData,
  DashboardData
} from '../api/client';

// Re-export types from DB schema
export type {
  Goal,
  GoalInput,
  GoalUpdate,
  Dimension,
  TimeRange,
  Activity,
  UserAchievement,
  Milestone
} from '../db/schema';

// Existing hooks
export { useAuth } from './useAuth';

// ============================================================================
// Utility Hooks (migrated from hooks.ts)
// ============================================================================

// Hook for registering service worker
export function useServiceWorker() {
    const [isRegistered, setIsRegistered] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => {
                    setRegistration(reg);
                    setIsRegistered(true);
                    console.log("Service Worker registered:", reg);
                })
                .catch((err) => {
                    console.error("Service Worker registration failed:", err);
                });
        }
    }, []);

    return { isRegistered, registration };
}

// Hook for checking if app is installed as PWA
export function useIsPWA() {
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
            const isInWebAppiOS = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
            setIsPWA(isStandalone || isInWebAppiOS);
        }
    }, []);

    return isPWA;
}

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Hook for install prompt
export function useInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setCanInstall(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const install = async () => {
        if (!deferredPrompt) return false;
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setCanInstall(false);
        return result.outcome === "accepted";
    };

    return { canInstall, install };
}

// Hook for online/offline status
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsOnline(navigator.onLine);

            const handleOnline = () => setIsOnline(true);
            const handleOffline = () => setIsOnline(false);

            window.addEventListener("online", handleOnline);
            window.addEventListener("offline", handleOffline);

            return () => {
                window.removeEventListener("online", handleOnline);
                window.removeEventListener("offline", handleOffline);
            };
        }
    }, []);

    return isOnline;
}

// Hook for local storage with SSR support
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [key]);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}

// Hook for debouncing values
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// Hook for media query
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const media = window.matchMedia(query);
            setMatches(media.matches);

            const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
            media.addEventListener("change", listener);
            return () => media.removeEventListener("change", listener);
        }
    }, [query]);

    return matches;
}

// Predefined media query hooks
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () => useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
export const usePrefersDarkMode = () => useMediaQuery("(prefers-color-scheme: dark)");
