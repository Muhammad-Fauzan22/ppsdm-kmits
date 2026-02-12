import { useState, useEffect, useCallback } from 'react';
import {
    getABTestingManager,
    Variant,
    Experiment,
    ExperimentStats,
} from '@/lib/abtesting/abTesting';

export interface UseABTestingOptions {
    experimentId: string;
    userId: string;
    sessionId: string;
    autoTrack?: boolean;
}

export function useABTesting(options: UseABTestingOptions) {
    const { experimentId, userId, sessionId, autoTrack = false } = options;
    const [variant, setVariant] = useState<Variant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const manager = getABTestingManager();
        const assignedVariant = manager.assignVariant(experimentId, userId, sessionId);
        setVariant(assignedVariant);
        setIsLoading(false);

        if (autoTrack && assignedVariant) {
            manager.trackEvent(experimentId, userId, sessionId, 'view', 1);
        }
    }, [experimentId, userId, sessionId, autoTrack]);

    const trackConversion = useCallback(
        (customData?: Record<string, any>) => {
            if (variant) {
                const manager = getABTestingManager();
                manager.trackConversion(experimentId, userId, sessionId, customData);
            }
        },
        [experimentId, userId, sessionId, variant]
    );

    const trackEvent = useCallback(
        (eventName: string, value: number = 1, customData?: Record<string, any>) => {
            if (variant) {
                const manager = getABTestingManager();
                manager.trackEvent(experimentId, userId, sessionId, eventName, value, customData);
            }
        },
        [experimentId, userId, sessionId, variant]
    );

    return {
        variant,
        isLoading,
        trackConversion,
        trackEvent,
    };
}

export function useABTestingWithFallback<T>(
    experimentId: string,
    userId: string,
    sessionId: string,
    variants: Record<string, T>,
    fallback: T
) {
    const { variant, isLoading, ...rest } = useABTesting({
        experimentId,
        userId,
        sessionId,
    });

    const variantValue = variant && variants[variant.id] ? variants[variant.id] : fallback;

    return {
        variant: variantValue,
        variantId: variant?.id,
        isLoading,
        isFallback: !variant,
        ...rest,
    };
}

export function useABTestingEvents(
    experimentId: string,
    userId: string,
    sessionId: string
) {
    const { trackEvent, trackConversion } = useABTesting({
        experimentId,
        userId,
        sessionId,
    });

    return {
        trackEvent,
        trackConversion,
    };
}

export function useABTestingAutoTrack(
    experimentId: string,
    userId: string,
    sessionId: string
) {
    return useABTesting({
        experimentId,
        userId,
        sessionId,
        autoTrack: true,
    });
}

export function useABTestingAdmin() {
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const manager = getABTestingManager();

    const refreshExperiments = useCallback(() => {
        setExperiments(manager.getAllExperiments());
    }, [manager]);

    useEffect(() => {
        refreshExperiments();
    }, [refreshExperiments]);

    return {
        experiments,
        refreshExperiments,
        createExperiment: (exp: any) => {
            manager.createExperiment(exp);
            refreshExperiments();
        },
        updateExperiment: (id: string, updates: any) => {
            manager.updateExperiment(id, updates);
            refreshExperiments();
        },
        deleteExperiment: (id: string) => {
            manager.deleteExperiment(id);
            refreshExperiments();
        },
        getStats: (id: string) => manager.calculateExperimentStats(id),
    };
}

export function useABTestingWithPersistence(
    experimentId: string,
    userId: string,
    sessionId: string
) {
    // Logic similar to useABTesting but maybe checks local storage explicitly first?
    // The manager already handles persistence, so this might be redundant or just an alias.
    return useABTesting({ experimentId, userId, sessionId });
}

export function useABTestingSSR(
    experimentId: string,
    userId: string,
    sessionId: string,
    initialVariant?: Variant
) {
    const [variant, setVariant] = useState<Variant | null>(initialVariant || null);
    const [isLoading, setIsLoading] = useState(!initialVariant);

    useEffect(() => {
        if (!initialVariant) {
            const manager = getABTestingManager();
            const assigned = manager.assignVariant(experimentId, userId, sessionId);
            setVariant(assigned);
            setIsLoading(false);
        }
    }, [experimentId, userId, sessionId, initialVariant]);

    const trackConversion = useCallback(
        (customData?: Record<string, any>) => {
            const manager = getABTestingManager();
            manager.trackConversion(experimentId, userId, sessionId, customData);
        },
        [experimentId, userId, sessionId]
    );

    return {
        variant,
        isLoading,
        trackConversion,
    };
}