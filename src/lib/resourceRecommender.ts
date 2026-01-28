
import { LearningContent, getContentByDimension, getAllFreeContent } from './freeContent';

// Interface for recommendation result
export interface RecommendationResult {
    dimension: string;
    reason: string;
    resources: LearningContent[];
}

/**
 * Advanced Resource Recommender System
 * Uses assessment scores to recommend 100% free resources from our curated library.
 * Prioritizes Indonesian content for 'id' locale.
 */
export function recommendResources(
    scores: Record<string, number>,
    locale: 'id' | 'en' = 'id',
    limitPerDimension: number = 3
): RecommendationResult[] {

    // 1. Identify priority dimensions (Score < 65 - "Competent" threshold)
    const priorityDims = Object.entries(scores)
        .filter(([, score]) => score < 65)
        .sort(([, a], [, b]) => a - b) // Lowest scores first
        .map(([dim]) => dim);

    // If no weak areas, recommend enrichment for top strengths
    if (priorityDims.length === 0) {
        const strengthDims = Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([dim]) => dim);
        priorityDims.push(...strengthDims);
    }

    const recommendations: RecommendationResult[] = [];

    // 2. Fetch and filter resources for each priority dimension
    for (const dim of priorityDims) {
        let content = getContentByDimension(dim);

        // Language Filtering Logic
        if (locale === 'id') {
            // Priority: ID content > Multi-language > EN content
            content.sort((a, b) => {
                const aScore = a.language === 'id' ? 2 : (a.language === 'multi' ? 1 : 0);
                const bScore = b.language === 'id' ? 2 : (b.language === 'multi' ? 1 : 0);
                return bScore - aScore;
            });
        }

        // Type Diversity Logic: Try to include at least one Course and one Interactive/Video
        // For now, simple slice, but could be enhanced.

        const selectedResources = content.slice(0, limitPerDimension);

        if (selectedResources.length > 0) {
            let reason = "Tingkatkan kemampuan ini untuk keseimbangan holistik.";
            const score = scores[dim];

            if (score < 40) reason = "Area prioritas utama untuk pengembangan diri.";
            else if (score < 55) reason = "Perlu penguatan untuk mencapai kompetensi standar.";
            else if (score >= 80) reason = "Tantangan lanjutan untuk mempertahankan keunggulan.";

            recommendations.push({
                dimension: dim,
                reason,
                resources: selectedResources
            });
        }
    }

    return recommendations;
}

/**
 * Get specific tool recommendations based on dimensions
 * e.g. "Self Management" -> "Notion", "Google Calendar"
 * This uses a hardcoded mapping for now as tools aren't in the main content DB yet.
 */
export function getRecommendedTools(dimension: string): { name: string, url: string, description: string }[] {
    const tools: Record<string, { name: string, url: string, description: string }[]> = {
        self_management: [
            { name: 'Notion', url: 'https://www.notion.so', description: 'All-in-one workspace for notes and tasks.' },
            { name: 'Google Calendar', url: 'https://calendar.google.com', description: 'Essential for time blocking.' }
        ],
        financial: [
            { name: 'Monefy / Wallet', url: '#', description: 'Expense tracking apps.' },
            { name: 'Bibit (Simulasi)', url: 'https://bibit.id', description: 'Simulasi investasi reksa dana.' }
        ],
        cognitive: [
            { name: 'Obsidian', url: 'https://obsidian.md', description: 'Second brain for connecting ideas.' },
            { name: 'Anki', url: 'https://apps.ankiweb.net', description: 'Spaced repetition for memorization.' }
        ],
        environmental: [
            { name: 'Jejak karbon (Imbangi)', url: 'https://imbangi.sp2020.id/', description: 'Kalkulator jejak karbon KLHK.' }
        ]
    };

    return tools[dimension] || [];
}
