
// Scoring logic for Emotional Intelligence Assessment (Dimensi 5)
// Based on validation study with N=2,147 Indonesian University Students

export type EmotionalResponse = {
    [key: string]: number; // EI1 to EI8
};

export type EmotionalResult = {
    rawScore: number;
    adjustedScore: number;
    thetaEstimate: number;
    subscaleScores: {
        selfAwareness: number;
        socialAwareness: number;
        selfManagement: number;
        relationshipManagement: number;
    };
    scoreReliability: number;
    percentile: number;
    category: string;
    categoryColor: string;
    categoryDescription: string;
    standardError: number;
    confidenceInterval: [number, number];
    rankLabel: string;
};

// Item weights from validation study (factor loadings based)
const ITEM_WEIGHTS: Record<string, number> = {
    'EI1': 1.2, // Self-awareness
    'EI2': 1.3, // Empathy
    'EI3': 1.4, // Emotion regulation (critical)
    'EI4': 1.2, // Social skills
    'EI5': 1.1, // Assertiveness
    'EI6': 1.3, // Conflict resolution
    'EI7': 1.0, // Emotional expression
    'EI8': 1.1  // Social awareness
};

// IRT Parameters (2PL Model) from calibration
const ITEM_PARAMS: Record<string, { a: number; b: number }> = {
    'EI1': { a: 1.23, b: -0.45 },
    'EI2': { a: 1.45, b: -0.12 },
    'EI3': { a: 1.67, b: 0.23 },
    'EI4': { a: 1.34, b: -0.31 },
    'EI5': { a: 1.12, b: 0.45 },
    'EI6': { a: 1.38, b: 0.12 },
    'EI7': { a: 1.05, b: 0.67 },
    'EI8': { a: 1.18, b: 0.34 }
};

export function calculateEmotionalScore(responses: EmotionalResponse): EmotionalResult {
    // 1. Calculate Weighted Raw Score
    let weightedSum = 0;
    let maxPossible = 0;

    for (const [itemId, response] of Object.entries(responses)) {
        if (ITEM_WEIGHTS[itemId]) {
            // Scale 1-5 to 0-100
            const scaledResponse = ((response - 1) / 4) * 100;
            weightedSum += scaledResponse * ITEM_WEIGHTS[itemId];
            maxPossible += 100 * ITEM_WEIGHTS[itemId];
        }
    }

    const rawScore = (weightedSum / maxPossible) * 100;

    // 2. Estimate Theta (Latent Trait) using simplified Newton-Raphson
    const theta = estimateTheta(responses);

    // 3. Convert Theta to Adjusted Scale (Mean=50, SD=10 approx, mapped to 0-100)
    // Theta range usually -3 to +3. Map -3 -> 0, +3 -> 100 roughly. 
    // Center at 50 + (theta * 15) for T-score like, then clamp.
    let adjustedScore = 50 + (theta * 16.6); // Scaling to fit ~0-100 range roughly
    // Align adjusted score with raw score distribution from norms
    // If raw score is very high, let adjusted score reflect that.
    // We'll use a hybrid for stability: 70% raw, 30% theta-based
    adjustedScore = (rawScore * 0.7) + (adjustedScore * 0.3);
    adjustedScore = Math.max(0, Math.min(100, adjustedScore));

    // 4. Calculate Subscales
    const subscaleScores = {
        selfAwareness: calculateSubscale(responses, ['EI1']),
        socialAwareness: calculateSubscale(responses, ['EI2', 'EI8']),
        selfManagement: calculateSubscale(responses, ['EI3', 'EI7']),
        relationshipManagement: calculateSubscale(responses, ['EI4', 'EI5', 'EI6'])
    };

    // 5. Calculate Standard Error & Reliability
    const sem = calculateStandardError(theta);
    const reliability = 1 - (sem * sem) / 100; // Simplified estimation

    // 6. Percentile & Category
    const percentile = calculatePercentile(adjustedScore);
    const categoryData = categorizeScore(adjustedScore);

    return {
        rawScore: Math.round(rawScore * 10) / 10,
        adjustedScore: Math.round(adjustedScore * 10) / 10,
        thetaEstimate: Math.round(theta * 1000) / 1000,
        subscaleScores,
        scoreReliability: Math.round(reliability * 100) / 100,
        percentile,
        category: categoryData.category,
        categoryColor: categoryData.color,
        categoryDescription: categoryData.description,
        standardError: Math.round(sem * 10) / 10,
        confidenceInterval: [
            Math.max(0, Math.round((adjustedScore - 1.96 * sem) * 10) / 10),
            Math.min(100, Math.round((adjustedScore + 1.96 * sem) * 10) / 10)
        ],
        rankLabel: categoryData.rankLabel
    };
}

function calculateSubscale(responses: EmotionalResponse, items: string[]): number {
    let sum = 0;
    let max = 0;
    items.forEach(item => {
        if (responses[item]) {
            sum += ((responses[item] - 1) / 4) * 100;
            max += 100;
        }
    });
    return max === 0 ? 0 : Math.round((sum / max) * 100 * 10) / 10;
}

function estimateTheta(responses: EmotionalResponse): number {
    let theta = 0.0; // Initial guess

    // Binary conversion for 2PL (split at >= 4) as per simplified model in user request
    // Or better, treat 1-5 as graded response? The user request Example Code used binary split for theta estimation function.
    // "binary_responses = {item: 1 if response >= 4 else 0 ...}"
    const binaryResponses: Record<string, number> = {};
    for (const [k, v] of Object.entries(responses)) {
        binaryResponses[k] = v >= 4 ? 1 : 0;
    }

    // Newton-Raphson
    for (let i = 0; i < 20; i++) {
        let likelihood = 0;
        let gradient = 0;
        let secondDeriv = 0;

        for (const [itemId, val] of Object.entries(binaryResponses)) {
            if (ITEM_PARAMS[itemId]) {
                const { a, b } = ITEM_PARAMS[itemId];
                const p = 1 / (1 + Math.exp(-a * (theta - b)));
                const q = 1 - p;

                gradient += a * (val - p);
                secondDeriv += -1 * a * a * p * q;
            }
        }

        if (Math.abs(secondDeriv) < 0.0001) break;
        const change = gradient / Math.abs(secondDeriv);
        theta -= change; // Maximizing log-likelihood

        if (Math.abs(change) < 0.001) break;
    }

    return Math.max(-3, Math.min(3, theta));
}

function calculateStandardError(theta: number): number {
    let information = 0;
    for (const params of Object.values(ITEM_PARAMS)) {
        const p = 1 / (1 + Math.exp(-params.a * (theta - params.b)));
        information += (params.a * params.a) * p * (1 - p);
    }
    // SEM in theta scale
    const semTheta = information > 0 ? 1 / Math.sqrt(information) : 1;
    // Convert to score scale (approx * 10)
    return semTheta * 10;
}

function calculatePercentile(score: number): number {
    // Based on normative data: 10th=52.7, 50th=68.5, 90th=83.6, 95th=87.1
    const sortedNorms = [
        { p: 5, s: 48.2 },
        { p: 10, s: 52.7 },
        { p: 25, s: 59.8 },
        { p: 50, s: 68.5 },
        { p: 75, s: 77.3 },
        { p: 90, s: 83.6 },
        { p: 95, s: 87.1 }
    ];

    if (score < sortedNorms[0].s) return Math.round((score / sortedNorms[0].s) * 5);
    if (score >= sortedNorms[sortedNorms.length - 1].s) return Math.min(99, 95 + (score - sortedNorms[sortedNorms.length - 1].s));

    for (let i = 0; i < sortedNorms.length - 1; i++) {
        const lower = sortedNorms[i];
        const upper = sortedNorms[i + 1];
        if (score >= lower.s && score < upper.s) {
            const ratio = (score - lower.s) / (upper.s - lower.s);
            return Math.round(lower.p + ratio * (upper.p - lower.p));
        }
    }
    return 99;
}

function categorizeScore(score: number) {
    if (score >= 84) return {
        category: "Sangat Unggul",
        color: "text-purple-600",
        description: "Kecerdasan emosional luar biasa. Potensi kepemimpinan tinggi.",
        rankLabel: "Top 10%"
    };
    if (score >= 77) return {
        category: "Unggul",
        color: "text-blue-600",
        description: "Kecerdasan emosional di atas rata-rata. Keterampilan sosial baik.",
        rankLabel: "Top 25%"
    };
    if (score >= 68) return {
        category: "Rata-rata Atas",
        color: "text-emerald-600",
        description: "Kompeten secara emosional dalam sebagian besar situasi.",
        rankLabel: "Above Average"
    };
    if (score >= 60) return {
        category: "Rata-rata Bawah",
        color: "text-yellow-600",
        description: "Kecerdasan emosional berkembang, namun perlu latihan lebih.",
        rankLabel: "Below Average"
    };
    return {
        category: "Perlu Pengembangan",
        color: "text-orange-600",
        description: "Area prioritas untuk pengembangan diri.",
        rankLabel: "Developing"
    };
}
