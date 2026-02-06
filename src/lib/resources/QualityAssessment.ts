
import { Resource, QualityDimensions, UserContext } from './types';

export class QualityAssessmentEngine {

    /**
     * Calculate a single weighted score for a resource based on 12 dimensions
     * and optional user context adaptation.
     */
    static calculateQuantumScore(resource: Resource, context?: UserContext): number {
        const q = resource.quality;
        const weights = this.getWeights(resource.type, context);

        let totalScore = 0;
        let totalWeight = 0;

        // Iterate 12 dimensions
        const dimensions: (keyof QualityDimensions)[] = [
            'pedagogical', 'scientific', 'technical', 'production',
            'accessibility', 'recency', 'credibility', 'engagement',
            'practicality', 'cultural', 'scalability', 'impact'
        ];

        for (const dim of dimensions) {
            const val = q[dim] || 0.5; // Default average if missing
            const w = weights[dim] || 1.0;
            totalScore += val * w;
            totalWeight += w;
        }

        return totalWeight > 0 ? (totalScore / totalWeight) : 0;
    }

    /**
     * Determine weights based on Resource Type and User Context.
     * e.g. "Cultural" weight is higher if user specifies a specific cultural context.
     * e.g. "Technical" weight is higher for "tool" or "course" types.
     */
    private static getWeights(type: string, context?: UserContext): Record<string, number> {
        const weights: Record<string, number> = {
            pedagogical: 1.0, scientific: 1.0, technical: 1.0, production: 0.8,
            accessibility: 1.0, recency: 0.9, credibility: 1.2, engagement: 0.8,
            practicality: 1.1, cultural: 0.7, scalability: 0.5, impact: 1.0
        };

        // Adaptation based on Type
        if (type === 'course') {
            weights.pedagogical = 2.0;
            weights.engagement = 1.5;
        } else if (type === 'article') {
            weights.scientific = 1.5;
            weights.credibility = 1.5;
        } else if (type === 'tool') {
            weights.technical = 2.0;
            weights.practicality = 2.0;
        }

        // Adaptation based on User Context
        if (context) {
            if (context.cultural_context !== 'neutral') {
                weights.cultural = 2.0; // Boost cultural relevance
            }
            if (context.accessibility_needs.length > 0) {
                weights.accessibility = 3.0; // Critical importance
            }
            if (context.available_time < 60) {
                weights.pedagogical = 1.5; // Efficiency matters more
            }
        }

        return weights;
    }

    /**
     * Generate improvement recommendations based on low scores
     */
    static getImprovements(quality: QualityDimensions): string[] {
        const issues: string[] = [];
        if (quality.accessibility < 0.7) issues.push("Improve WCAG compliance");
        if (quality.recency < 0.6) issues.push("Update content to reflect modern standards");
        if (quality.engagement < 0.6) issues.push("Add interactive elements");
        return issues;
    }
}
