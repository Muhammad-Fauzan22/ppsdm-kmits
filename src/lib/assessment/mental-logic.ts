import { calculateMentalScore, MentalResponse } from './mentalScoring';
import { mentalHealthDimension } from '@/data/dimensions/mental-health';

export { calculateMentalScore };
export type { MentalResponse };

export const MENTAL_ITEMS = mentalHealthDimension.items;

// Adapter for MentalHealthAssessmentPage
export function calculateMentalHealthScore(responses: MentalResponse) {
    const result = calculateMentalScore(responses);

    return {
        scores: {
            emotional: result.subscaleScores.emotional,
            resilience: result.subscaleScores.resilience,
            stress: result.subscaleScores.stress,
            support: result.subscaleScores.social, // Mapping 'social' to 'support'
        },
        total_score: result.normalizedScore, // Using normalized 0-100
        risk_level: result.category,
        validity_index: 0.9, // Mock or calculate if possible
        red_flags: result.riskFlags
    };
}
