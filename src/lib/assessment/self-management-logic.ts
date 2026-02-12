import { calculateSelfManagementScores as strategyScore, SelfManagementResponse } from './selfManagementScoring';
import { selfManagementDimension } from '@/data/dimensions/self-management';

export const SELF_MANAGEMENT_ITEMS = selfManagementDimension.items;
export const SELF_MANAGEMENT_SUBDIMENSIONS = selfManagementDimension.subdimensions;

export function calculateSelfManagementScores(responses: Record<string, number>) {
    const raw = strategyScore(responses);

    return {
        productivity_index: raw.total_score,
        overall_percentile: raw.percentiles.total,
        development_level: raw.category.label,
        details: {
            planning: { scaled: raw.dimensions.planning, percentile: raw.percentiles.planning },
            procrastination: { scaled: raw.dimensions.procrastination, percentile: raw.percentiles.procrastination },
            focus: { scaled: raw.dimensions.focus, percentile: raw.percentiles.focus },
            energy: { scaled: raw.dimensions.energy, percentile: raw.percentiles.energy }
        },
        profilePattern: {
            type: 'standard',
            title: raw.category.label,
            description: raw.category.description,
            recommendation: raw.category.label
        },
        recommendations: raw.recommendations
    };
}


