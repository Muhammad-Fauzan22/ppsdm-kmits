
import { Resource, UserContext, RecommendationResult } from './types';
import { QualityAssessmentEngine } from './QualityAssessment';

export class QuantumResourceRecommendationEngine {

    /**
     * The core "Collapse" function that takes a universe of resources (superposition)
     * and filters/ranks them down to the optimal set for the user.
     */
    static recommend(
        resources: Resource[],
        context: UserContext,
        limit: number = 10
    ): RecommendationResult[] {

        // 1. Entanglement Phase: Detect hidden synergies
        // (Mock: Assume resources sharing >2 tags are entangled)
        const entangledMap = this.detectEntanglements(resources);

        return resources
            .map(res => {
                // 2. Interference Phase: Quality Calculation
                const qScore = QualityAssessmentEngine.calculateQuantumScore(res, context);

                // 3. Contextual Fit (Classical Compatibility)
                const fitScore = this.calculateFit(res, context);

                // Combined score
                const finalScore = (qScore * 0.6) + (fitScore * 0.4);

                return {
                    resource: res,
                    match_score: finalScore,
                    reason: this.generateReason(res, context),
                    entanglements: entangledMap.get(res.id) || []
                };
            })
            .filter(r => r.match_score > 0.5) // Filter out noise
            .sort((a, b) => b.match_score - a.match_score) // Sort by highest probability
            .slice(0, limit); // Collapse to Top N
    }

    private static calculateFit(res: Resource, ctx: UserContext): number {
        let score = 0;

        // Skill overlap
        const skillMatch = res.target_skills.filter(s => ctx.current_skills.includes(s) || ctx.interests.includes(s));
        score += Math.min(skillMatch.length * 0.2, 0.6); // Up to 0.6 for skill match

        // Budget fit
        if (res.cost.amount <= ctx.budget) score += 0.2;

        // Language
        // Mock check (assuming matched)
        score += 0.2;

        return Math.min(score, 1.0);
    }

    private static detectEntanglements(resources: Resource[]): Map<string, string[]> {
        const map = new Map<string, string[]>();
        // Simple O(N^2) for mock entanglement detection
        for (let i = 0; i < resources.length; i++) {
            for (let j = i + 1; j < resources.length; j++) {
                const r1 = resources[i];
                const r2 = resources[j];
                const commonTags = r1.tags.filter(t => r2.tags.includes(t));
                if (commonTags.length >= 2) {
                    const links1 = map.get(r1.id) || [];
                    links1.push(r2.id);
                    map.set(r1.id, links1);

                    const links2 = map.get(r2.id) || [];
                    links2.push(r1.id);
                    map.set(r2.id, links2);
                }
            }
        }
        return map;
    }

    private static generateReason(res: Resource, ctx: UserContext): string {
        const skills = res.target_skills.filter(s => ctx.interests.includes(s));
        if (skills.length > 0) return `Matches your interest in ${skills[0]}`;
        if (QualityAssessmentEngine.calculateQuantumScore(res) > 0.9) return "Top-tier Quality Resource";
        return "Recommended for your growth";
    }
}
