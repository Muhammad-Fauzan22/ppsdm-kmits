
// Scoring logic for Mental Health & Psychological Well-being (Dimensi 6)
// Based on Mental Health Continuum (MHC-SF) & CD-RISC adapted for Indonesian Students

export type MentalResponse = {
    [key: string]: number; // MH1 to MH8
};

export type MentalResult = {
    rawScore: number;
    normalizedScore: number; // 0-100
    percentile: number;
    category: string;
    categoryColor: string;
    subscaleScores: {
        emotional: number;
        psychological: number;
        social: number;
        resilience: number;
        stress: number;
        mindfulness: number;
    };
    riskFlags: string[];
    interpretation: string;
    recommendations: Recommendation[];
};

export type Recommendation = {
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
    resource?: string;
};

// Item configuration from validation study
const ITEM_CONFIG: Record<string, { weight: number; reverse: boolean; construct: string }> = {
    'MH1': { weight: 1.2, reverse: false, construct: 'emotional' },      // Happiness
    'MH2': { weight: 1.3, reverse: false, construct: 'psychological' },  // Purpose
    'MH3': { weight: 1.1, reverse: false, construct: 'social' },         // Community
    'MH4': { weight: 1.4, reverse: false, construct: 'resilience' },     // Adaptability
    'MH5': { weight: 1.3, reverse: false, construct: 'resilience' },     // Coping
    'MH6': { weight: 1.5, reverse: true, construct: 'stress' },          // Overwhelmed (Reverse)
    'MH7': { weight: 1.2, reverse: false, construct: 'mindfulness' },    // Attention
    'MH8': { weight: 1.4, reverse: false, construct: 'overall' }         // Satisfaction
};

const NORMS = {
    mean: 65.4,
    sd: 14.7,
    percentiles: [
        { p: 10, s: 45.2 },
        { p: 25, s: 55.8 },
        { p: 50, s: 65.1 },
        { p: 75, s: 74.9 },
        { p: 90, s: 82.3 }
    ]
};

export function calculateMentalScore(responses: MentalResponse): MentalResult {
    let weightedSum = 0;
    let maxPossible = 0;
    let minPossible = 0;

    const rawSubscales: Record<string, number[]> = {};

    // 1. Calculate Weighted Sum & Subscales
    for (const [itemId, config] of Object.entries(ITEM_CONFIG)) {
        let response = responses[itemId] || 3; // Default neutral

        // Store original response for risk checks before reversing
        const originalResponse = response;

        if (config.reverse) {
            response = 6 - response; // 1->5, 5->1
        }

        const weightedScore = response * config.weight;
        weightedSum += weightedScore;

        maxPossible += 5 * config.weight;
        minPossible += 1 * config.weight;

        // Accumulate for subscales (using adjusted response 1-5)
        if (!rawSubscales[config.construct]) rawSubscales[config.construct] = [];
        rawSubscales[config.construct].push(response);

        // Special handling: Stress subscale usually is high score = high stress in raw items, 
        // but here we want "Good Mental Health" score. 
        // If Construct is 'stress', we might want to track the semantic value separately or just use the "well-being" inverted value.
        // User requested: MH6 is reverse scored for the TOTAL score.
        // For subscale display: Low Stress is good. So a high "stress" score in this calculation means "Good Stress Management".
    }

    // 2. Normalize Score (0-100)
    // Formula: ((Total - Min) / (Max - Min)) * 100
    const normalizedScore = ((weightedSum - minPossible) / (maxPossible - minPossible)) * 100;

    // 3. Calculate Subscale Averages (1-5 Scale)
    const subscaleScores = {
        emotional: calculateAverage(rawSubscales['emotional']),
        psychological: calculateAverage(rawSubscales['psychological']),
        social: calculateAverage(rawSubscales['social']),
        resilience: calculateAverage(rawSubscales['resilience']),
        stress: calculateAverage(rawSubscales['stress']), // High = Low Stress (Good)
        mindfulness: calculateAverage(rawSubscales['mindfulness'])
    };

    // 4. Calculate Percentile
    const percentile = calculatePercentile(normalizedScore);

    // 5. Risk Assessment
    const riskFlags = assessRisk(responses, subscaleScores);

    // 6. Categorization
    const categoryData = categorizeMentalHealth(normalizedScore, riskFlags);

    // 7. Recommendations
    const recommendations = generateRecommendations(categoryData.category, riskFlags, subscaleScores);

    return {
        rawScore: Math.round(weightedSum * 100) / 100,
        normalizedScore: Math.round(normalizedScore * 10) / 10,
        percentile,
        category: categoryData.category,
        categoryColor: categoryData.color,
        subscaleScores: {
            emotional: Math.round(subscaleScores.emotional * 10) / 10,
            psychological: Math.round(subscaleScores.psychological * 10) / 10,
            social: Math.round(subscaleScores.social * 10) / 10,
            resilience: Math.round(subscaleScores.resilience * 10) / 10,
            stress: Math.round(subscaleScores.stress * 10) / 10,
            mindfulness: Math.round(subscaleScores.mindfulness * 10) / 10,
        },
        riskFlags,
        interpretation: generateInterpretation(categoryData.category, riskFlags),
        recommendations
    };
}

function calculateAverage(values: number[]): number {
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculatePercentile(score: number): number {
    // Simple interpolation based on NORMS
    if (score < NORMS.percentiles[0].s) return 5;
    if (score >= NORMS.percentiles[NORMS.percentiles.length - 1].s) return 95;

    for (let i = 0; i < NORMS.percentiles.length - 1; i++) {
        const lower = NORMS.percentiles[i];
        const upper = NORMS.percentiles[i + 1];
        if (score >= lower.s && score < upper.s) {
            const ratio = (score - lower.s) / (upper.s - lower.s);
            return Math.round(lower.p + ratio * (upper.p - lower.p));
        }
    }
    return 50;
}

function assessRisk(responses: MentalResponse, subscales: { [key: string]: number }): string[] {
    const flags: string[] = [];

    // MH6: Perceived Stress. Original response 5 = Always overwhelmed.
    // Note: 'subscaleScores.stress' is High = Good (Low Stress). 
    // We need to check the raw response for MH6.
    if (responses['MH6'] >= 4) flags.push("High Perceived Stress");

    // MH1: Emotional Well-being. 1 = Never Happy.
    if (responses['MH1'] <= 2) flags.push("Low Emotional Well-being");

    // Resilience check (Low score on subscale)
    if (subscales.resilience <= 2.5) flags.push("Low Resilience");

    // Crisis Indicator: Overwhelmed AND Unhappy
    if (responses['MH6'] === 5 && responses['MH1'] === 1) {
        flags.push("POTENTIAL CRISIS INDICATOR");
    }

    // Social Isolation: MH3 <= 2
    if (responses['MH3'] <= 2) flags.push("Social Isolation Concern");

    return flags;
}

function categorizeMentalHealth(score: number, riskFlags: string[]) {
    if (riskFlags.includes("POTENTIAL CRISIS INDICATOR") || riskFlags.length >= 3) {
        return { category: "Struggling", color: "text-red-600" };
    }
    if (score >= 75) return { category: "Flourishing", color: "text-emerald-600" };
    if (score >= 60) return { category: "Moderate Well-being", color: "text-blue-600" };
    if (score >= 45) return { category: "Languishing", color: "text-orange-600" };
    return { category: "Struggling", color: "text-red-600" };
}

function generateInterpretation(category: string, riskFlags: string[]): string {
    const base = {
        "Flourishing": "Anda menunjukkan kesejahteraan psikologis yang sangat baik. Anda memiliki sumber daya mental yang kuat.",
        "Moderate Well-being": "Kesejahteraan Anda memadai. Terdapat ruang untuk tumbuh mencapai potensi optimal.",
        "Languishing": "Anda mungkin mengalami stagnasi atau kesulitan dalam beberapa aspek. Dukungan tambahan akan bermanfaat.",
        "Struggling": "Hasil menunjukkan tantangan signifikan. Sangat disarankan untuk mencari dukungan profesional atau berbicara dengan konselor."
    }[category];

    let riskNote = "";
    if (riskFlags.includes("High Perceived Stress")) riskNote += " Tingkat stres Anda tergolong tinggi.";
    if (riskFlags.includes("Social Isolation Concern")) riskNote += " Keterhubungan sosial Anda tampak rendah.";

    return `${base}${riskNote ? " Perhatian khusus:" + riskNote : ""}`;
}

function generateRecommendations(category: string, riskFlags: string[], subscales: any): Recommendation[] {
    const recs: Recommendation[] = [];

    if (category === "Struggling" || category === "Languishing") {
        recs.push({
            priority: 'high',
            action: "Konsultasi Konseling",
            description: "Disarankan menghubungi Unit Konseling ITS untuk dukungan lebih lanjut.",
            resource: "https://konseling.its.ac.id"
        });
    }

    if (riskFlags.includes("High Perceived Stress")) {
        recs.push({
            priority: 'medium',
            action: "Manajemen Stres",
            description: "Pelajari teknik pernapasan 4-7-8 atau mindfulness untuk meredakan ketegangan."
        });
    }

    if (subscales.resilience < 3) {
        recs.push({
            priority: 'medium',
            action: "Gratitude Journaling",
            description: "Tulis 3 hal yang disyukuri setiap hari untuk membangun perspektif positif."
        });
    }

    if (subscales.mindfulness < 3) {
        recs.push({
            priority: 'low',
            action: "Latihan Mindfulness",
            description: "Luangkan 5-10 menit sehari untuk hadir utuh di masa kini (being present)."
        });
    }

    return recs;
}
