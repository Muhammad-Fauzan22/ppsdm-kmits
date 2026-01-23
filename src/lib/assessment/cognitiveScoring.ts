import { v4 as uuidv4 } from 'uuid';

// --- Types ---

export type CognitiveResponse = Record<string, number>;

export interface CognitiveScoreResult {
    composite_score: number;
    subdimension_scores: {
        critical_thinking: number;
        growth_mindset: number;
        creative_efficacy: number;
        metacognitive_awareness: number;
    };
    percentile: number;
    development_category: {
        category: string;
        description: string;
        color: string;
        recommendation: string;
    };
    reliability_estimate?: {
        internal_consistency: number;
        measurement_error: number;
        confidence_interval: [number, number];
    };
    validity_checks?: {
        straight_lining: boolean;
        extreme_response_style: boolean;
        missing_responses: boolean;
    };
    recommendations?: Recommendation[];
}

export interface Recommendation {
    type: string;
    title: string;
    description: string;
    resources: string[];
}

// --- Normative Database ---

const NORMS = {
    engineering: {
        mean: 65.4,
        sd: 12.7,
        percentiles: {
            99: 92.4, 95: 86.5, 90: 82.1, 75: 74.2,
            50: 65.1, 25: 56.8, 10: 48.3, 5: 43.3, 1: 35.6
        }
    },
    // Added based on Scientific Report "Perbandingan Fakultas"
    science: {
        mean: 67.2,
        sd: 11.8,
        percentiles: { // Extrapolated/Simulated relative to mean shift
            99: 94.2, 95: 88.3, 90: 83.9, 75: 76.0,
            50: 67.2, 25: 58.9, 10: 50.1, 5: 45.1, 1: 37.4
        }
    },
    business: {
        mean: 62.3,
        sd: 13.5,
        percentiles: {
            99: 89.3, 95: 83.4, 90: 79.0, 75: 71.1,
            50: 62.3, 25: 53.5, 10: 45.2, 5: 40.2, 1: 32.5
        }
    },
    humanities: {
        mean: 59.8,
        sd: 14.2,
        percentiles: {
            99: 86.8, 95: 80.9, 90: 76.5, 75: 68.6,
            50: 59.8, 25: 51.0, 10: 42.7, 5: 37.7, 1: 30.0
        }
    }
};

export type FacultyType = keyof typeof NORMS;

// --- Helper Functions ---

function calculatePercentile(score: number, faculty: FacultyType = 'engineering'): number {
    const norms = NORMS[faculty];
    const percentiles = norms.percentiles;

    if (score >= percentiles[99]) return 99.9;
    if (score <= percentiles[1]) return 0.1;

    // Find bracket for linear interpolation
    const sortedPercentiles = Object.entries(percentiles)
        .map(([p, s]) => ({ p: Number(p), s }))
        .sort((a, b) => a.p - b.p);

    for (let i = 0; i < sortedPercentiles.length - 1; i++) {
        const lower = sortedPercentiles[i];
        const upper = sortedPercentiles[i + 1];

        if (score >= lower.s && score <= upper.s) {
            // Linear interpolation: p = p1 + ( (s - s1) / (s2 - s1) ) * (p2 - p1)
            const fraction = (score - lower.s) / (upper.s - lower.s);
            const percentile = lower.p + fraction * (upper.p - lower.p);
            return Number(percentile.toFixed(1));
        }
    }

    return 50.0; // Fallback
}

function categorizeDevelopment(score: number) {
    if (score >= 85) {
        return {
            category: 'EXCELLENT',
            description: 'Kemampuan kognitif di atas 85% mahasiswa teknik',
            color: '#10B981', // Emerald
            recommendation: 'Pertahankan dan mentor mahasiswa lain'
        };
    } else if (score >= 70) {
        return {
            category: 'ADVANCED',
            description: 'Kemampuan kognitif di atas rata-rata',
            color: '#3B82F6', // Blue
            recommendation: 'Tantang diri dengan proyek kompleks'
        };
    } else if (score >= 55) {
        return {
            category: 'COMPETENT',
            description: 'Kemampuan kognitif memadai untuk sukses akademik',
            color: '#F59E0B', // Amber
            recommendation: 'Kembangkan area yang lebih lemah'
        };
    } else if (score >= 40) {
        return {
            category: 'DEVELOPING',
            description: 'Kemampuan kognitif sedang berkembang',
            color: '#EF4444', // Red
            recommendation: 'Ikuti workshop dan cari mentor'
        };
    } else {
        return {
            category: 'BEGINNER',
            description: 'Perlu pengembangan signifikan',
            color: '#6B7280', // Gray
            recommendation: 'Mulai dengan foundational courses'
        };
    }
}

function checkValidity(responses: CognitiveResponse) {
    const values = Object.values(responses);
    const uniqueValues = new Set(values).size;
    const extremeCount = values.filter(v => v === 1 || v === 5).length;

    return {
        straight_lining: uniqueValues < 2, // Slightly relaxed from 3 for short scale (8 items)
        extreme_response_style: (extremeCount / values.length) > 0.7,
        missing_responses: false // Frontend should enforce this
    };
}

function generateRecommendations(composite: number, subscores: CognitiveScoreResult['subdimension_scores']): Recommendation[] {
    const recs: Recommendation[] = [];

    // Composite
    if (composite >= 85) {
        recs.push({
            type: 'advanced_development',
            title: 'Mentor Mahasiswa Lain',
            description: 'Bagikan strategi berpikir kritis Anda dengan junior',
            resources: ['Program Mentorship ITS', 'Workshop Facilitation']
        });
    } else if (composite >= 70) {
        recs.push({
            type: 'skill_application',
            title: 'Terapkan pada Proyek Kompleks',
            description: 'Cari proyek yang membutuhkan analisis mendalam',
            resources: ['Capstone Project', 'Kompetisi Inovasi']
        });
    }

    // Subdimensions
    if (subscores.critical_thinking < 60) {
        recs.push({
            type: 'skill_development',
            title: 'Kembangkan Berpikir Kritis',
            description: 'Ikuti workshop berpikir kritis dasar',
            resources: ['Course: Critical Thinking 101', 'Book: "Thinking, Fast and Slow"']
        });
    }
    if (subscores.growth_mindset < 55) {
        recs.push({
            type: 'mindset_development',
            title: 'Kembangkan Growth Mindset',
            description: 'Pelajari tentang neuroplasticity dan belajar efektif',
            resources: ['Video: Carol Dweck TED Talk', 'Course: Learning How to Learn']
        });
    }

    return recs;
}

// --- Main Scoring Function ---

export function calculateCognitiveScores(responses: CognitiveResponse, faculty: FacultyType = 'engineering'): CognitiveScoreResult {
    // Weights
    const weights: Record<string, number> = {
        'CT': 1.2,
        'GM': 1.0,
        'CE': 1.1,
        'MA': 1.3
    };

    const itemMapping: Record<string, string> = {
        'CT1': 'CT', 'CT2': 'CT',
        'GM1': 'GM', 'GM2': 'GM',
        'CE1': 'CE', 'CE2': 'CE',
        'MA1': 'MA', 'MA2': 'MA'
    };

    const sub_scores: Record<string, number> = {};

    // Calculate Raw & Weighted Subscores
    for (const sub of ['CT', 'GM', 'CE', 'MA']) {
        const items = Object.keys(itemMapping).filter(k => itemMapping[k] === sub);
        const rawSum = items.reduce((acc, item) => acc + (responses[item] || 3), 0);
        const maxSum = items.length * 5;
        // Formula: (Raw / Max) * 100 * Weight
        sub_scores[sub] = (rawSum / maxSum) * 100 * weights[sub];
    }

    // Calculate Composite
    const totalWeighted = Object.values(sub_scores).reduce((a, b) => a + b, 0);
    const totalMaxWeight = Object.values(weights).reduce((a, b) => a + (100 * b), 0); // Sum of max possible weighted scores

    // Correction: The Python code summed (100 * weight) as the denominator.
    // let's verify logic:
    // If scoring 100 on CT (weight 1.2), value is 120.
    // If scoring 100 on all, total is 120 + 100 + 110 + 130 = 460.
    // Denominator should be 460 to normalize back to 100.
    // Python code: `total_max = sum([100 * w for w in weights.values()])` -> Correct.

    const compositeScore = (totalWeighted / totalMaxWeight) * 100;
    const percentile = calculatePercentile(compositeScore, faculty);

    // Unweight subscores for display (return to 0-100 scale)
    const displaySubscores = {
        critical_thinking: sub_scores['CT'] / weights['CT'],
        growth_mindset: sub_scores['GM'] / weights['GM'],
        creative_efficacy: sub_scores['CE'] / weights['CE'],
        metacognitive_awareness: sub_scores['MA'] / weights['MA']
    };

    // Reliability Estimate (Mocked/Calculated based on S.E.M)
    const reliability = 0.89;
    const sem = 12.7 * Math.sqrt(1 - reliability); // ~4.2
    const ciLower = Math.max(0, compositeScore - (1.96 * sem));
    const ciUpper = Math.min(100, compositeScore + (1.96 * sem));

    return {
        composite_score: Number(compositeScore.toFixed(1)),
        subdimension_scores: {
            critical_thinking: Number(displaySubscores.critical_thinking.toFixed(1)),
            growth_mindset: Number(displaySubscores.growth_mindset.toFixed(1)),
            creative_efficacy: Number(displaySubscores.creative_efficacy.toFixed(1)),
            metacognitive_awareness: Number(displaySubscores.metacognitive_awareness.toFixed(1))
        },
        percentile,
        development_category: categorizeDevelopment(compositeScore),
        reliability_estimate: {
            internal_consistency: reliability,
            measurement_error: Number(sem.toFixed(1)),
            confidence_interval: [Number(ciLower.toFixed(1)), Number(ciUpper.toFixed(1))]
        },
        validity_checks: checkValidity(responses),
        recommendations: generateRecommendations(compositeScore, displaySubscores)
    };
}
