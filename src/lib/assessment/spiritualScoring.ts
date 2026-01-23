
// Scoring logic for Spiritual Development Assessment (Dimensi 8)
// Based on Integral Spirituality & PERMA+4 Framework
// Validated with N=400 Indonesian Students

export type SpiritualResponse = {
    SP1: number; // Purpose
    SP2: number; // Gratitude
    SP3: number; // Connectedness
    SP4: number; // Altruism
    SP5: number; // Meaning Making
    SP6: number; // Mindfulness
    SP7: number; // Forgiveness
    SP8: number; // Contribution
};

export type SpiritualResult = {
    rawScore: number;
    normalizedScore: number; // 0-100
    percentile: number;
    developmentLevel: string;
    levelColor: string;
    subscaleScores: {
        purpose: number;
        gratitude: number;
        connectedness: number;
        altruism: number;
        meaningMaking: number;
        mindfulness: number;
        forgiveness: number;
        contribution: number;
    };
    interpretation: string;
    recommendations: Recommendation[];
};

export type Recommendation = {
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
};

const NORMS = {
    mean: 30.96,
    sd: 6.23,
    percentiles: [
        { p: 10, s: 25 },
        { p: 25, s: 28 },
        { p: 50, s: 31 },
        { p: 75, s: 34 },
        { p: 90, s: 36 },
        { p: 99, s: 39 }
    ]
};

const ITEM_MAP = {
    SP1: 'purpose',
    SP2: 'gratitude',
    SP3: 'connectedness',
    SP4: 'altruism',
    SP5: 'meaningMaking',
    SP6: 'mindfulness',
    SP7: 'forgiveness',
    SP8: 'contribution'
};

export function calculateSpiritualScore(responses: SpiritualResponse): SpiritualResult {
    let rawScore = 0;
    const subscaleRaw: Record<string, number> = {};

    // Calculate Raw & Subscale
    for (const [key, val] of Object.entries(responses)) {
        rawScore += val;
        const dim = ITEM_MAP[key as keyof SpiritualResponse];
        subscaleRaw[dim] = val; // Single item per dimension in this concise version
    }

    // Normalize: 8-40 range -> 0-100
    // Formula: ((Raw - Min) / (Max - Min)) * 100
    const normalizedScore = ((rawScore - 8) / (40 - 8)) * 100;

    // Calculate Percentile
    const percentile = calculatePercentile(rawScore);

    // Categorize
    const levelData = categorizeLevel(normalizedScore);

    // Subscale Normalization (1-5 -> 0-100)
    const subscaleScores: any = {};
    for (const [key, val] of Object.entries(subscaleRaw)) {
        subscaleScores[key] = ((val - 1) / 4) * 100;
    }

    // Recommendations
    const recs = generateRecommendations(subscaleScores);

    return {
        rawScore,
        normalizedScore: Math.round(normalizedScore * 10) / 10,
        percentile,
        developmentLevel: levelData.label,
        levelColor: levelData.color,
        subscaleScores: subscaleScores as any,
        interpretation: levelData.description,
        recommendations: recs
    };
}

function calculatePercentile(raw: number): number {
    if (raw < NORMS.percentiles[0].s) return 5;
    if (raw >= NORMS.percentiles[NORMS.percentiles.length - 1].s) return 99;

    for (let i = 0; i < NORMS.percentiles.length - 1; i++) {
        const lower = NORMS.percentiles[i];
        const upper = NORMS.percentiles[i + 1];
        if (raw >= lower.s && raw < upper.s) {
            // Linear interpolation
            const ratio = (raw - lower.s) / (upper.s - lower.s);
            return Math.round(lower.p + ratio * (upper.p - lower.p));
        }
    }
    return 50;
}

function categorizeLevel(score: number) {
    if (score >= 85) return {
        label: "Integrated",
        color: "text-emerald-600",
        description: "Perkembangan spiritual sangat matang. Anda memiliki tujuan hidup yang jelas dan kesadaran transenden yang kuat."
    };
    if (score >= 70) return {
        label: "Advanced",
        color: "text-blue-600",
        description: "Perkembangan spiritual di atas rata-rata. Anda aktif dalam pencarian makna dan praktik nilai-nilai luhur."
    };
    if (score >= 55) return {
        label: "Moderate",
        color: "text-amber-600",
        description: "Perkembangan spiritual memadai. Anda memiliki dasar pemahaman yang baik namun belum konsisten."
    };
    if (score >= 40) return {
        label: "Developing",
        color: "text-orange-600",
        description: "Sedang dalam tahap eksplorasi. Mulailah membangun rutinitas refleksi diri sederhana."
    };
    return {
        label: "Emerging",
        color: "text-gray-600",
        description: "Tahap awal pencarian makna. Disarankan untuk mulai mencari tujuan hidup dan nilai-nilai personal."
    };
}

function generateRecommendations(subscales: Record<string, number>): Recommendation[] {
    const recs: Recommendation[] = [];
    const sorted = Object.entries(subscales).sort((a, b) => a[1] - b[1]); // Sort Ascending (Lowest first)

    // Top 3 lowest areas get recommendations
    for (let i = 0; i < 3; i++) {
        const [dim, score] = sorted[i];
        if (score < 60) {
            recs.push(getRecForDim(dim));
        }
    }

    // If all high, give maintenance rec
    if (recs.length === 0) {
        recs.push({
            priority: 'low',
            action: "Mentorship",
            description: "Bagikan pengalaman dan kebijaksanaan Anda dengan menjadi mentor bagi mahasiswa lain."
        });
    }

    return recs;
}

function getRecForDim(dim: string): Recommendation {
    const map: Record<string, Recommendation> = {
        purpose: { priority: 'high', action: "Definisikan 'Why'", description: "Luangkan waktu untuk menuliskan visi hidup Anda dalam 5 tahun ke depan." },
        gratitude: { priority: 'medium', action: "Jurnal Syukur", description: "Tuliskan 3 hal yang Anda syukuri setiap malam sebelum tidur." },
        connectedness: { priority: 'medium', action: "Meditasi Alam", description: "Habiskan waktu di alam terbuka tanpa gadget untuk merasakan koneksi." },
        altruism: { priority: 'medium', action: "Volunteering", description: "Ikuti kegiatan sosial setidaknya satu kali bulan ini." },
        meaningMaking: { priority: 'high', action: "Refleksi Krisis", description: "Renungkan pelajaran berharga dari kesulitan masa lalu Anda." },
        mindfulness: { priority: 'medium', action: "Mindful Breathing", description: "Lakukan latihan napas sadar selama 5 menit setiap pagi." },
        forgiveness: { priority: 'high', action: "Self-Compassion", description: "Berhentilah menghukum diri sendiri atas kesalahan masa lalu; fokus pada pembelajaran." },
        contribution: { priority: 'medium', action: "Proyek Kecil", description: "Mulai inisiatif kecil yang berdampak positif bagi lingkungan sekitar." }
    };
    return map[dim] || { priority: 'low', action: "Refleksi", description: "Tingkatkan kesadaran pada aspek ini." };
}
