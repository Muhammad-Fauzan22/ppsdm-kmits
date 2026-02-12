import { calculatePhysicalScore, PhysicalResponse } from './physicalScoring';
import { physicalDimension } from '@/data/dimensions/physical';

export { calculatePhysicalScore };
export const calculatePhysicalHealthScore = calculatePhysicalScore;
export type { PhysicalResponse };

export const PHYSICAL_ITEMS = physicalDimension.items;
export const HEALTH_ITEMS = physicalDimension.items; // Alias for health page

// Adapter for HealthAssessmentPage expecting specific structure
export function calculateHealthScore(responses: PhysicalResponse) {
    const result = calculatePhysicalScore(responses);

    return {
        scores: {
            activity: result.subdomainScores.physicalActivity,
            sleep: result.subdomainScores.sleepHealth,
            nutrition: result.subdomainScores.nutritionHydration,
            vitality: result.subdomainScores.vitalityWellbeing,
            preventive: result.subdomainScores.vitalityWellbeing, // Fallback as preventive wasn't explicitly separated
        },
        composite: result.totalScore,
        category: result.category,
        risks: result.riskFlags
    };
}
