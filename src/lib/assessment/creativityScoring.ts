
export function calculateCreativityScores(responses: Record<string, number>) {
    // Mock for Creativity
    const innovation = ((responses['CRT1'] || 3) + (responses['CRT2'] || 3)) / 2 * 20;

    return {
        composite_score: innovation,
        subdimension_scores: { innovation },
        recommendations: []
    };
}
