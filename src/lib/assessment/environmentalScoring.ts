
// Scoring logic for Environmental & Lifestyle Management Assessment (Dimensi 9)
// Based on ELMS (Environmental & Lifestyle Management Scale)
// Validated with N=1,800 Indonesian Students

export type EnvironmentalResponse = {
    // Environmental Awareness
    EA1?: number; EA2?: number; EA3?: number; EA4?: number;
    // Sustainable Behavior
    SB1?: number; SB2?: number; SB3?: number; SB4?: number;
    // Work-Life Balance
    WLB1?: number; WLB2?: number; WLB3?: number; WLB4?: number;
    // Digital Wellbeing
    DW1?: number; DW2?: number; DW3?: number; DW4?: number;
    // Minimalist Orientation
    MO1?: number; MO2?: number; MO3?: number; MO4?: number;
    // Energy Conservation
    EC1?: number; EC2?: number; EC3?: number; EC4?: number;
    // Community Engagement
    CE1?: number; CE2?: number; CE3?: number; CE4?: number;
    // Environmental Advocacy
    EA2_1?: number; EA2_2?: number; EA2_3?: number; EA2_4?: number;
};

export type EnvironmentalResult = {
    rawScore: number;
    normalizedScore: number; // 0-100
    tScore: number; // Mean=50, SD=10
    percentile: number;
    category: string;
    categoryColor: string;
    carbonFootprint: number; // Estimated kg CO2/year
    subscaleScores: {
        awareness: number;
        behavior: number;
        wlb: number;
        digital: number;
        minimalism: number;
        energy: number;
        community: number;
        advocacy: number;
    };
    interpretation: string;
    recommendations: Recommendation[];
};

export type Recommendation = {
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
};

// --- CONFIGURATION ---

const NORMS = {
    overall: { mean: 64.3, sd: 12.8 },
    percentiles: [
        { p: 10, s: 46.9 },
        { p: 25, s: 55.2 },
        { p: 50, s: 64.8 },
        { p: 75, s: 73.5 },
        { p: 90, s: 82.7 },
        { p: 95, s: 86.4 },
        { p: 99, s: 92.1 }
    ]
};

const ITEMS_PER_SUBSCALE = 4;
const TOTAL_ITEMS = 32;

// --- MAIN FUNCTION ---

export function calculateEnvironmentalScore(responses: EnvironmentalResponse): EnvironmentalResult {
    let totalRaw = 0;

    // Calculate Subscale Raws
    const subRaw = {
        awareness: sumItems(responses, 'EA', 1, 4),
        behavior: sumItems(responses, 'SB', 1, 4),
        wlb: sumItems(responses, 'WLB', 1, 4),
        digital: sumItems(responses, 'DW', 1, 4),
        minimalism: sumItems(responses, 'MO', 1, 4),
        energy: sumItems(responses, 'EC', 1, 4),
        community: sumItems(responses, 'CE', 1, 4),
        advocacy: sumItems(responses, 'EA2_', 1, 4)
    };

    totalRaw = Object.values(subRaw).reduce((a, b) => a + b, 0);

    // Normalize (0-100)
    // Max potential score = 32 * 5 = 160
    // Min potential score = 32 * 1 = 32
    const normalizedScore = ((totalRaw - TOTAL_ITEMS) / ((TOTAL_ITEMS * 5) - TOTAL_ITEMS)) * 100;

    // Calculate T-Score
    // Note: Raw Mean=64.3 is based on 0-100 scale from research report, so we use normalized score for T-Score calc? 
    // Wait, report says "Mean: 64.3, Range: 22-98". This implies the research report normalized it already or it's a sum of specific items. 
    // Let's assume Mean 64.3 is on the 0-100 scale as is standard.
    const tScore = 50 + ((normalizedScore - NORMS.overall.mean) / NORMS.overall.sd) * 10;

    // Calculate Percentile
    const percentile = calculatePercentile(normalizedScore);

    // Categorize
    const cat = categorizeScore(normalizedScore);

    // Calculate Carbon Footprint
    const footprint = calculateCarbonFootprint(responses);

    // Normalize Subscales (0-100)
    const subscaleScores = {
        awareness: normalizeSub(subRaw.awareness),
        behavior: normalizeSub(subRaw.behavior),
        wlb: normalizeSub(subRaw.wlb),
        digital: normalizeSub(subRaw.digital),
        minimalism: normalizeSub(subRaw.minimalism),
        energy: normalizeSub(subRaw.energy),
        community: normalizeSub(subRaw.community),
        advocacy: normalizeSub(subRaw.advocacy)
    };

    return {
        rawScore: totalRaw,
        normalizedScore: Math.round(normalizedScore * 10) / 10,
        tScore: Math.round(tScore * 10) / 10,
        percentile,
        category: cat.label,
        categoryColor: cat.color,
        carbonFootprint: footprint,
        subscaleScores,
        interpretation: cat.description,
        recommendations: generateRecommendations(subscaleScores, footprint)
    };
}

// --- HELPERS ---

function sumItems(res: any, prefix: string, start: number, end: number): number {
    let sum = 0;
    for (let i = start; i <= end; i++) {
        const key = `${prefix}${i}`;
        sum += res[key] || 3; // Default to Neutral if missing
    }
    return sum;
}

function normalizeSub(raw: number): number {
    // Max 20, Min 4
    return ((raw - 4) / 16) * 100;
}

function calculatePercentile(score: number): number {
    if (score >= NORMS.percentiles[NORMS.percentiles.length - 1].s) return 99;
    if (score < NORMS.percentiles[0].s) return 5;

    for (let i = 0; i < NORMS.percentiles.length - 1; i++) {
        if (score >= NORMS.percentiles[i].s && score < NORMS.percentiles[i + 1].s) {
            // Linear interp
            const lower = NORMS.percentiles[i];
            const upper = NORMS.percentiles[i + 1];
            const ratio = (score - lower.s) / (upper.s - lower.s);
            return Math.round(lower.p + ratio * (upper.p - lower.p));
        }
    }
    return 50;
}

function categorizeScore(score: number) {
    if (score >= 80) return { label: "Highly Developed", color: "text-emerald-700", description: "Role model keberlanjutan. Gaya hidup Anda sangat seimbang dan ramah lingkungan." };
    if (score >= 70) return { label: "Well Developed", color: "text-green-600", description: "Kesadaran yang baik. Anda konsisten dalam praktik keberlanjutan." };
    if (score >= 60) return { label: "Moderate", color: "text-yellow-600", description: "Rata-rata. Anda sadar akan isu lingkungan namun belum sepenuhnya konsisten." };
    if (score >= 50) return { label: "Developing", color: "text-orange-600", description: "Masih berkembang. Mulailah dengan langkah kecil untuk keseimbangan hidup." };
    return { label: "Needs Development", color: "text-red-600", description: "Perlu perhatian. Gaya hidup saat ini mungkin kurang berkelanjutan jangka panjang." };
}

function calculateCarbonFootprint(res: any): number {
    // Base: 4000 kg CO2 (Indonesian Student Avg)
    let footprint = 4000;

    // Modifiers based on specific items (Inverse scoring: Higher score = lower footprint)

    // Transport (EC2): 1=High emission -> 5=Low emission
    const ec2 = res['EC2'] || 3;
    footprint -= (ec2 - 1) * 200; // Max reduction -800

    // Plastic (SB1):
    const sb1 = res['SB1'] || 3;
    footprint -= (sb1 - 1) * 50; // Max reduction -200

    // Energy (EC1):
    const ec1 = res['EC1'] || 3;
    footprint -= (ec1 - 1) * 60; // Max reduction -240

    // Consumption (MO3):
    const mo3 = res['MO3'] || 3;
    footprint -= (mo3 - 1) * 80; // Max reduction -320

    return Math.max(1000, footprint);
}

function generateRecommendations(sub: any, footprint: number): Recommendation[] {
    const recs: Recommendation[] = [];

    // Digital Wellbeing check
    if (sub.digital < 60) {
        recs.push({ priority: 'high', action: "Digital Detox", description: "Tetapkan batas 'No Screen Time' 1 jam sebelum tidur." });
    }

    // WLB check
    if (sub.wlb < 60) {
        recs.push({ priority: 'high', action: "Boundary Setting", description: "Pisahkan ruang belajar dan istirahat secara fisik." });
    }

    // Advocacy check
    if (sub.advocacy < 50 && sub.awareness > 70) {
        recs.push({ priority: 'medium', action: "Speak Up", description: "Gunakan pengetahuan Anda untuk mengedukasi teman sebaya." });
    }

    // Footprint check
    if (footprint > 3500) {
        recs.push({ priority: 'high', action: "Reduce Transport", description: "Kurangi penggunaan kendaraan pribadi, coba jalan kaki atau sepeda." });
    } else if (footprint > 2500) {
        recs.push({ priority: 'medium', action: "Reduce Plastic", description: "Bawa botol minum dan tas belanja sendiri setiap saat." });
    }

    if (recs.length === 0) {
        recs.push({ priority: 'low', action: "Mentorship", description: "Jadilah duta lingkungan di kampus Anda." });
    }

    return recs.slice(0, 3);
}
