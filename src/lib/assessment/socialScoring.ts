
export function calculateSocialScores(responses: Record<string, number>) {
    // Mock implementation for Social Domain
    // Sub-dimensions: Empathy, Communication, Collaboration, Networking

    // Calculate subscores (assuming 1-5 scale)
    const empathy = ((responses['SOC1'] || 3) + (responses['SOC2'] || 3)) / 2 * 20; // to 100
    const communication = ((responses['SOC3'] || 3) + (responses['SOC4'] || 3)) / 2 * 20;
    const collaboration = ((responses['SOC5'] || 3) + (responses['SOC6'] || 3)) / 2 * 20;

    const composite_score = (empathy + communication + collaboration) / 3;

    return {
        composite_score,
        subdimension_scores: {
            empathy,
            communication,
            collaboration
        },
        development_category: composite_score > 75 ? 'HIGH' : composite_score > 50 ? 'MODERATE' : 'LOW',
        recommendations: [
            composite_score < 60 ? { title: 'Improve Active Listening', description: 'Practice listening without interrupting.' } : null
        ].filter(Boolean)
    };
}
