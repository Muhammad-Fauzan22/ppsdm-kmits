/**
 * A/B Testing Framework for PPSDM KMITS
 * Implements experiment assignment and tracking
 */

import React from 'react';

// Mock Edge Config client for when @vercel/edge-config is not available
// In production, replace this with actual import: import { createClient } from '@vercel/edge-config';
const createClient = (connectionString?: string) => {
  return {
    get: async <T>(key: string): Promise<T | undefined> => {
      // Mock implementation - in production, this would fetch from Edge Config
      if (key === 'experiments') {
        return {
          'new-dashboard': {
            id: 'new-dashboard',
            name: 'New Dashboard Layout',
            variants: { control: 50, treatment: 50 },
            startDate: new Date().toISOString(),
            trafficAllocation: 100,
          },
        } as unknown as T;
      }
      return undefined;
    },
  };
};

// Initialize Edge Config client (uses mock if env var not set)
const edgeConfig = createClient(process.env.EDGE_CONFIG);


export type ExperimentVariant = 'control' | 'treatment' | string;

export interface Experiment {
  id: string;
  name: string;
  variants: Record<ExperimentVariant, number>; // percentage weights
  startDate: string;
  endDate?: string;
  trafficAllocation: number; // 0-100
}

export interface ExperimentAssignment {
  experimentId: string;
  variant: ExperimentVariant;
  assignedAt: string;
}

/**
 * Get experiment configuration from Edge Config
 */
export async function getExperiment(experimentId: string): Promise<Experiment | null> {
  try {
    const experiments = await edgeConfig.get<Record<string, Experiment>>('experiments');
    return experiments?.[experimentId] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Assign user to experiment variant
 * Uses deterministic hashing for consistent assignment
 */
export async function assignVariant(
  experimentId: string,
  userId: string
): Promise<ExperimentAssignment | null> {
  const experiment = await getExperiment(experimentId);
  
  if (!experiment) {
    return null;
  }

  // Check if experiment is active
  const now = new Date();
  const startDate = new Date(experiment.startDate);
  if (now < startDate) return null;
  
  if (experiment.endDate && now > new Date(experiment.endDate)) {
    return null;
  }

  // Check traffic allocation
  const userHash = hashString(`${experimentId}:${userId}`);
  const trafficBucket = (userHash % 100) + 1;
  
  if (trafficBucket > experiment.trafficAllocation) {
    return null; // User not in experiment
  }

  // Assign variant based on weights
  const variant = selectVariant(experiment.variants, userHash);

  return {
    experimentId,
    variant,
    assignedAt: new Date().toISOString(),
  };
}

/**
 * Select variant based on weights
 */
function selectVariant(
  variants: Record<ExperimentVariant, number>,
  hash: number
): ExperimentVariant {
  const variantEntries = Object.entries(variants);
  const totalWeight = variantEntries.reduce((sum, [, weight]) => sum + weight, 0);
  
  let cumulativeWeight = 0;
  const bucket = (hash % totalWeight) + 1;
  
  for (const [variant, weight] of variantEntries) {
    cumulativeWeight += weight;
    if (bucket <= cumulativeWeight) {
      return variant;
    }
  }
  
  return 'control';
}

/**
 * Simple hash function for consistent assignment
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Track experiment event
 */
export async function trackExperimentEvent(
  experimentId: string,
  variant: ExperimentVariant,
  event: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  // Send to analytics (Plausible, Sentry, or custom)
  if (typeof window !== 'undefined') {
    // Client-side tracking
    window.dispatchEvent(new CustomEvent('experiment-event', {
      detail: {
        experimentId,
        variant,
        event,
        metadata,
        timestamp: new Date().toISOString(),
      },
    }));
  }

  // Server-side tracking (if on server)
  if (typeof window === 'undefined') {
    // Log to your analytics service
    }
}

/**
 * React hook for using experiments
 */
export function useExperiment(experimentId: string, userId: string) {
  const [assignment, setAssignment] = React.useState<ExperimentAssignment | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    assignVariant(experimentId, userId)
      .then(setAssignment)
      .finally(() => setLoading(false));
  }, [experimentId, userId]);

  const trackEvent = React.useCallback((event: string, metadata?: Record<string, unknown>) => {
    if (assignment) {
      trackExperimentEvent(experimentId, assignment.variant, event, metadata);
    }
  }, [assignment, experimentId]);

  return {
    variant: assignment?.variant || 'control',
    isInExperiment: !!assignment,
    loading,
    trackEvent,
  };
}

// Add TypeScript declaration for window
declare global {
  interface Window {
    dispatchEvent: (event: Event) => boolean;
  }
}
