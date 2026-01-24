
export function calculateAdaptabilityScores(responses: Record<string, number>) {
    // Mock for Adaptability
    // Resilience, Flexibility, Problem Solving
    const score = ((responses['ADP1'] || 3) + (responses['ADP2'] || 3)) / 2 * 20;

    return {
        composite_score: score,
        subdimension_scores: { resilience: score },
        recommendations: []
    };
}
