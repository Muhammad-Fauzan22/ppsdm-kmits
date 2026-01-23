
// Scoring logic for Character & Ethics Assessment (Dimensi 7)
// Based on VIA-IS, Moral Foundations, and SJT logic
// Validated with N=2,157 Indonesian Students

export type CharacterResponse = {
    // Likert Items (CH1-CH5): 1-5
    CH1?: number; // Integrity
    CH2?: number; // Courage
    CH3?: number; // Fairness
    CH4?: number; // Responsibility
    CH5?: number; // Humility

    // SJT Items (SJT1-SJT3): 'A'|'B'|'C'|'D'
    SJT1?: string; // Academic Integrity
    SJT2?: string; // Professional Ethics
    SJT3?: string; // Social Responsibility

    // Behavioral (BH1-BH2): 0-4
    BH1?: number; // Academic Honesty Freq
    BH2?: number; // Social Responsibility Freq
};

export type CharacterResult = {
    rawScore: number;
    normalizedScore: number; // 0-100
    percentile: number;
    category: string;
    categoryColor: string;
    subscaleScores: {
        integrity: number; // 0-100
        courage: number;
        fairness: number;
        responsibility: number;
        humility: number;
        ethicalDecision: number;
    };
    validityIndicators: {
        responseConsistency: string;
        socialDesirability: string;
    };
    interpretation: string;
    recommendations: Recommendation[];
};

export type Recommendation = {
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
    resource?: string;
};

// --- CONFIGURATION ---

const SJT_WEIGHTS: Record<string, Record<string, number>> = {
    SJT1: { 'A': 0.2, 'B': 0.7, 'C': 0.8, 'D': 1.0 },
    SJT2: { 'A': 0.1, 'B': 0.6, 'C': 0.9, 'D': 1.0 },
    SJT3: { 'A': 0.3, 'B': 0.6, 'C': 0.8, 'D': 1.0 }
};

const FREQUENCY_SCALE_MAP = [0, 25, 50, 75, 100]; // Map 0-4 to 0-100

const NORMS = {
    mean: 68.7,
    sd: 12.4,
    percentiles: [
        { p: 10, s: 54.8 },
        { p: 25, s: 60.5 },
        { p: 50, s: 69.2 },
        { p: 75, s: 76.8 },
        { p: 90, s: 82.4 },
        { p: 95, s: 86.7 }
    ]
};

// --- MAIN FUNCTION ---

export function calculateCharacterScore(responses: CharacterResponse): CharacterResult {

    // 1. Calculate Component Scores (Normalized 0-100)

    // Likert Scores (1-5 -> 0-100)
    // Formula: ((Value - 1) / 4) * 100
    const getLikert = (key: keyof CharacterResponse) => {
        const val = (responses[key] as number) || 3;
        return ((val - 1) / 4) * 100;
    };

    const integrityScore = (getLikert('CH1') + getLikert('CH5')) / 2; // CH1 & CH5 map to Integrity/Humility cluster often
    const courageScore = getLikert('CH2');
    const fairnessScore = getLikert('CH3');
    const respScore = getLikert('CH4');
    const humilityScore = getLikert('CH5');

    // SJT Scores
    const getSJT = (key: string) => {
        const val = (responses[key as keyof CharacterResponse] as string) || 'B';
        const weight = SJT_WEIGHTS[key]?.[val] || 0;
        return weight * 100;
    };

    const ethicalDecisionScore = (getSJT('SJT1') + getSJT('SJT2') + getSJT('SJT3')) / 3;

    // Behavioral Scores
    const getBehavior = (key: keyof CharacterResponse) => {
        const val = (responses[key] as number) || 0;
        return FREQUENCY_SCALE_MAP[val] || 0;
    };

    // 2. Calculate Weighted Overall Score
    // Weights: Integrity 1.4, Courage 1.3, Fairness 1.2, Resp 1.1, Humility 1.0, SJT (included in decision)
    // Simplified for this implementation based on user requested algorithm wrapper:
    // Base subdims map to user Python logic.

    // Let's mirror the Python logic provided:
    // integrity: CH1
    // courage: CH2
    // fairness: CH3
    // responsibility: CH4
    // humility: CH5

    // Recalculate strictly map one-to-one for the "Subdimension Scores" 
    // But overall score uses weights.
    const sub_integrity = getLikert('CH1');
    const sub_courage = getLikert('CH2');
    const sub_fairness = getLikert('CH3');
    const sub_resp = getLikert('CH4');
    const sub_humility = getLikert('CH5');

    const behavioral_integrity = getBehavior('BH1');
    const behavioral_resp = getBehavior('BH2');

    // Weights
    const w = {
        integrity: 1.4,
        courage: 1.3,
        fairness: 1.2,
        resp: 1.1,
        humility: 1.0,
        behavior: 0.5 // Reduced weight for behavioral self-report
    };

    let weightedSum =
        (sub_integrity * w.integrity) +
        (sub_courage * w.courage) +
        (sub_fairness * w.fairness) +
        (sub_resp * w.resp) +
        (sub_humility * w.humility) +
        (ethicalDecisionScore * 1.5); // SJT usually high weight in professional assessment

    // Add behavioral
    weightedSum += (behavioral_integrity * w.behavior) + (behavioral_resp * w.behavior);

    const totalWeight = w.integrity + w.courage + w.fairness + w.resp + w.humility + 1.5 + (w.behavior * 2);

    const overallScore = weightedSum / totalWeight;

    // 3. Percentile
    const percentile = calculatePercentile(overallScore);

    // 4. Categorization
    const categoryData = categorizeScore(overallScore);

    // 5. Validity Checks
    const validity = checkValidity(responses);

    // 6. Recommendations
    const recs = generateRecommendations(categoryData.category, sub_integrity, ethicalDecisionScore, sub_courage);

    return {
        rawScore: Math.round(overallScore * 10) / 10,
        normalizedScore: Math.round(overallScore * 10) / 10,
        percentile,
        category: categoryData.category,
        categoryColor: categoryData.color,
        subscaleScores: {
            integrity: Math.round(sub_integrity),
            courage: Math.round(sub_courage),
            fairness: Math.round(sub_fairness),
            responsibility: Math.round(sub_resp),
            humility: Math.round(sub_humility),
            ethicalDecision: Math.round(ethicalDecisionScore)
        },
        validityIndicators: validity,
        interpretation: categoryData.description,
        recommendations: recs
    };
}

function calculatePercentile(score: number): number {
    // Simple interpolation from NORMS
    if (score < NORMS.percentiles[0].s) return 5;
    if (score >= NORMS.percentiles[NORMS.percentiles.length - 1].s) return 99;

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

function categorizeScore(score: number) {
    if (score >= 85) return {
        category: "Sangat Unggul",
        color: "text-emerald-700",
        description: "Karakter yang sangat kuat dengan integritas tinggi dan keberanian moral luar biasa. Anda adalah role model potensial."
    };
    if (score >= 70) return {
        category: "Unggul",
        color: "text-emerald-600",
        description: "Karakter kuat dengan nilai-nilai etika yang konsisten. Terus pertahankan."
    };
    if (score >= 55) return {
        category: "Rata-rata",
        color: "text-blue-600",
        description: "Karakter memadai. Perlu pengembangan konsistensi dan keberanian moral."
    };
    if (score >= 40) return {
        category: "Perlu Pengembangan",
        color: "text-orange-600",
        description: "Perlu penguatan fondasi karakter dan kesadaran etika dalam pengambilan keputusan."
    };
    return {
        category: "Perlu Perhatian Khusus",
        color: "text-red-600",
        description: "Disarankan untuk mengikuti pendampingan atau konseling pengembangan karakter."
    };
}

function checkValidity(r: CharacterResponse) {
    // Simple check: Straight lining on Likert (CH1-CH5 same value)
    const likertValues = [r.CH1, r.CH2, r.CH3, r.CH4, r.CH5];
    const isStraightLining = likertValues.every(v => v === likertValues[0]);

    return {
        responseConsistency: isStraightLining ? "Low (Straight-lining detected)" : "High",
        socialDesirability: (r.BH1 === 4 && r.BH2 === 4) ? "High Probability" : "Normal"
    };
}

function generateRecommendations(category: string, integrity: number, decision: number, courage: number): Recommendation[] {
    const recs: Recommendation[] = [];

    if (category.includes("Perlu") || integrity < 50) {
        recs.push({
            priority: 'high',
            action: "Refleksi Integritas",
            description: "Ikuti sesi mentoring etika akademik di unit konseling atau dosen wali."
        });
    }

    if (decision < 60) {
        recs.push({
            priority: 'medium',
            action: "Latihan Studi Kasus",
            description: "Pelajari kasus-kasus dilema etika teknik untuk melatih pengambilan keputusan."
        });
    }

    if (courage < 60) {
        recs.push({
            priority: 'medium',
            action: "Speak Up Training",
            description: "Latih keberanian menyampaikan pendapat yang benar di forum kecil."
        });
    }

    if (category === "Sangat Unggul") {
        recs.push({
            priority: 'low',
            action: "Pimpin Proyek Sosial",
            description: "Ambil peran kepemimpinan dalam kegiatan pengabdian masyarakat."
        });
    }

    return recs;
}
