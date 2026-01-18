// A/B Testing Framework
// Deterministic variant assignment and experiment management

export interface Variant {
    id: string;
    weight: number; // 0.0 to 1.0
    name: string;
    description?: string;
}

export interface Experiment {
    id: string;
    name: string;
    description: string;
    variants: Variant[];
    metrics: string[];
    status: 'draft' | 'running' | 'paused' | 'completed';
    startDate?: string;
    endDate?: string;
    targetAudience?: {
        betaOnly?: boolean;
        cohorts?: string[];
        percentage?: number;
    };
}

export interface ExperimentResult {
    experimentId: string;
    variantId: string;
    metric: string;
    value: number;
    sampleSize: number;
    confidence: number;
}

// Active experiments
export const EXPERIMENTS: Record<string, Experiment> = {
    onboarding_flow: {
        id: 'onboarding_flow',
        name: 'Onboarding Experience',
        description: 'Testing different onboarding flows for new users',
        variants: [
            { id: 'control', weight: 0.5, name: 'Current Flow', description: 'Standard registration + dashboard' },
            { id: 'guided', weight: 0.25, name: 'Guided Tour', description: 'Step-by-step interactive tour' },
            { id: 'quick', weight: 0.25, name: 'Quick Start', description: 'Minimal steps, first assessment immediately' },
        ],
        metrics: ['activation_rate', 'time_to_first_assessment', 'day_7_retention'],
        status: 'running',
        startDate: '2026-01-20',
        endDate: '2026-02-03',
    },

    gamification_display: {
        id: 'gamification_display',
        name: 'Gamification Display',
        description: 'Testing XP vs badges emphasis',
        variants: [
            { id: 'xp_focus', weight: 0.33, name: 'XP Focused', description: 'Prominent XP display' },
            { id: 'badge_focus', weight: 0.33, name: 'Badge Focused', description: 'Prominent badge display' },
            { id: 'balanced', weight: 0.34, name: 'Balanced', description: 'Equal emphasis on both' },
        ],
        metrics: ['assessment_completion', 'weekly_active_days', 'goal_completion'],
        status: 'draft',
    },

    ai_tutor_personality: {
        id: 'ai_tutor_personality',
        name: 'AI Tutor Personality',
        description: 'Testing different AI tutor communication styles',
        variants: [
            { id: 'professional', weight: 0.33, name: 'Professional', description: 'Formal, academic style' },
            { id: 'friendly', weight: 0.33, name: 'Friendly', description: 'Casual, encouraging style' },
            { id: 'coaching', weight: 0.34, name: 'Coaching', description: 'Motivational, question-based style' },
        ],
        metrics: ['ai_tutor_usage', 'user_satisfaction', 'messages_per_session'],
        status: 'draft',
        targetAudience: {
            betaOnly: true,
        },
    },

    dashboard_layout: {
        id: 'dashboard_layout',
        name: 'Dashboard Layout',
        description: 'Testing different dashboard information architecture',
        variants: [
            { id: 'current', weight: 0.5, name: 'Current', description: 'Existing layout' },
            { id: 'compact', weight: 0.5, name: 'Compact', description: 'More data-dense layout' },
        ],
        metrics: ['page_engagement_time', 'click_through_rate', 'navigation_depth'],
        status: 'draft',
    },
};

// Cyrb53 hash function for deterministic assignment
function cyrb53(str: string, seed: number = 0): number {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;

    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// Get variant assignment for a user
export function getVariant(userId: string, experimentId: string): string | null {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment || experiment.status !== 'running') {
        return null;
    }

    // Generate deterministic bucket (0-99)
    const hash = cyrb53(userId + experimentId);
    const bucket = hash % 100;

    // Assign to variant based on weights
    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
        cumulativeWeight += variant.weight * 100;
        if (bucket < cumulativeWeight) {
            return variant.id;
        }
    }

    // Fallback to first variant
    return experiment.variants[0]?.id || null;
}

// Get all variant assignments for a user
export function getUserExperiments(userId: string): Record<string, string> {
    const assignments: Record<string, string> = {};

    for (const experimentId of Object.keys(EXPERIMENTS)) {
        const variant = getVariant(userId, experimentId);
        if (variant) {
            assignments[experimentId] = variant;
        }
    }

    return assignments;
}

// Track experiment event
export async function trackExperimentEvent(
    userId: string,
    experimentId: string,
    metric: string,
    value: number
): Promise<void> {
    const variant = getVariant(userId, experimentId);
    if (!variant) return;

    // In production, log to database or analytics service
    console.log('[A/B Tracking]', {
        userId,
        experimentId,
        variant,
        metric,
        value,
        timestamp: new Date().toISOString(),
    });

    // Would save to Supabase:
    // await supabase.from('ab_events').insert({...})
}

// Calculate experiment results
export function calculateExperimentResults(
    experimentId: string,
    events: Array<{ variantId: string; metric: string; value: number }>
): ExperimentResult[] {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return [];

    const results: ExperimentResult[] = [];

    for (const variant of experiment.variants) {
        for (const metric of experiment.metrics) {
            const variantEvents = events.filter(
                e => e.variantId === variant.id && e.metric === metric
            );

            if (variantEvents.length === 0) continue;

            const sum = variantEvents.reduce((acc, e) => acc + e.value, 0);
            const mean = sum / variantEvents.length;

            // Simple confidence calculation (would use proper stats in production)
            const confidence = Math.min(0.99, 0.5 + (variantEvents.length / 1000) * 0.5);

            results.push({
                experimentId,
                variantId: variant.id,
                metric,
                value: Math.round(mean * 100) / 100,
                sampleSize: variantEvents.length,
                confidence,
            });
        }
    }

    return results;
}

// Check if user is in experiment
export function isInExperiment(userId: string, experimentId: string): boolean {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment || experiment.status !== 'running') {
        return false;
    }

    // Check target audience constraints
    if (experiment.targetAudience?.percentage) {
        const hash = cyrb53(userId + 'target_' + experimentId);
        const bucket = hash % 100;
        if (bucket >= experiment.targetAudience.percentage) {
            return false;
        }
    }

    return true;
}

// React hook for experiments
export function useExperiment(experimentId: string, userId: string): {
    variant: string | null;
    isLoading: boolean;
    trackEvent: (metric: string, value: number) => void;
} {
    const variant = getVariant(userId, experimentId);

    return {
        variant,
        isLoading: false,
        trackEvent: (metric: string, value: number) => {
            trackExperimentEvent(userId, experimentId, metric, value);
        },
    };
}

export default {
    EXPERIMENTS,
    getVariant,
    getUserExperiments,
    trackExperimentEvent,
    calculateExperimentResults,
    isInExperiment,
    useExperiment,
};
