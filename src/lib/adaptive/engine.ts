import { Intervention, INTERVENTION_LIBRARY } from './library';

export interface DimensionScoreMap {
    [dimensionId: string]: number;
}

export class RecommendationEngine {
    static getRecommendations(userScores: DimensionScoreMap, limit: number = 3): Intervention[] {
        const recommendations: Intervention[] = [];

        // 1. Identify Weakest Dimensions
        const sortedDimensions = Object.entries(userScores)
            .sort(([, scoreA], [, scoreB]) => scoreA - scoreB); // Ascending (lowest first)

        const weakestDims = sortedDimensions.slice(0, 3).map(([id]) => id);

        // 2. Filter Relevant Interventions
        const candidates = INTERVENTION_LIBRARY.filter(intervention => {
            const userScore = userScores[intervention.dimension];

            // If score is missing, skip
            if (userScore === undefined) return false;

            // Check thresholds
            if (intervention.minScoreThreshold && userScore > intervention.minScoreThreshold) {
                return false; // User is too good for this basic intervention
            }
            if (intervention.maxScoreThreshold && userScore < intervention.maxScoreThreshold) {
                return false; // User is not ready for this advanced intervention
            }

            // Prioritize weakest dimensions
            return weakestDims.includes(intervention.dimension) || Math.random() > 0.7; // 30% chane for serendipity
        });

        // 3. Balance the Mix (Easy, Medium, Hard)
        const easy = candidates.find(c => c.difficulty === 'easy');
        const medium = candidates.find(c => c.difficulty === 'medium');
        const hard = candidates.find(c => c.difficulty === 'hard');

        if (easy) recommendations.push(easy);
        if (medium) recommendations.push(medium);
        if (hard && recommendations.length < limit) recommendations.push(hard);

        // Fill remaining spots if needed
        while (recommendations.length < limit && candidates.length > 0) {
            const random = candidates[Math.floor(Math.random() * candidates.length)];
            if (!recommendations.includes(random)) {
                recommendations.push(random);
            }
            // removing from candidates to avoid infinite loop in edge cases (simplified here)
            const index = candidates.indexOf(random);
            if (index > -1) candidates.splice(index, 1);
        }

        return recommendations.slice(0, limit);
    }
}
