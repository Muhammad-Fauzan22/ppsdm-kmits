import { z } from "zod";

// --- Types ---

export type MentalHealthFactor = 'emotional_wellbeing' | 'academic_resilience' | 'stress_management' | 'social_support';
export type RiskLevel = 'low_risk' | 'moderate_risk' | 'high_risk' | 'critical_risk';

export interface MentalHealthItem {
    id: string;
    text: string;
    factor: MentalHealthFactor;
    weight: number;
    reverseScored?: boolean;
}

export interface MentalHealthResult {
    raw_score: number;       // 20-100
    normalized_score: number; // 0-100
    percentile: number;
    risk_level: RiskLevel;
    subscales: Record<MentalHealthFactor, {
        score: number; // 0-100
        level: string;
    }>;
    validity: {
        isValid: boolean;
        score: number; // 0-100
        flags: string[]; // 'straight_lining', 'too_fast', etc.
    };
    red_flags: string[];
    recommendations: MentalHealthRecommendation[];
    interpretation: string;
}

export interface MentalHealthRecommendation {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    resource?: {
        name: string;
        contact?: string;
    };
}

// --- Items (ISMHA 20-Item Instrument) ---

const FREQUENCY_SCALE = [
    { value: 1, label: "Tidak Pernah" },
    { value: 2, label: "Jarang" },
    { value: 3, label: "Kadang-kadang" },
    { value: 4, label: "Sering" },
    { value: 5, label: "Selalu" }
];

export const MENTAL_HEALTH_ITEMS: MentalHealthItem[] = [
    // FACTOR 1: EMOTIONAL WELL-BEING
    { id: "MH01", text: "Dalam sebulan terakhir, seberapa sering Anda merasa puas dengan hidup Anda?", factor: 'emotional_wellbeing', weight: 1.2 },
    { id: "MH02", text: "Dalam sebulan terakhir, seberapa sering Anda merasa optimis tentang masa depan?", factor: 'emotional_wellbeing', weight: 1.1 },
    { id: "MH03", text: "Dalam sebulan terakhir, seberapa sering Anda merasa damai secara emosional?", factor: 'emotional_wellbeing', weight: 1.3 },
    { id: "MH04", text: "Dalam sebulan terakhir, seberapa sering Anda mampu menikmati aktivitas sehari-hari?", factor: 'emotional_wellbeing', weight: 1.0 },
    { id: "MH05", text: "Dalam sebulan terakhir, seberapa sering Anda merasa bahagia?", factor: 'emotional_wellbeing', weight: 1.2 },

    // FACTOR 2: ACADEMIC RESILIENCE
    { id: "MH06", text: "Saya dapat bangkit kembali setelah mendapat nilai yang buruk.", factor: 'academic_resilience', weight: 1.3 },
    { id: "MH07", text: "Tekanan akademik justru membuat saya lebih termotivasi.", factor: 'academic_resilience', weight: 1.2 },
    { id: "MH08", text: "Saya dapat mengatasi kegagalan dalam belajar sebagai pelajaran.", factor: 'academic_resilience', weight: 1.1 },
    { id: "MH09", text: "Saya merasa mampu menghadapi tantangan akademik yang sulit.", factor: 'academic_resilience', weight: 1.4 },
    { id: "MH10", text: "Kegagalan tidak mengurangi keyakinan saya pada kemampuan sendiri.", factor: 'academic_resilience', weight: 1.2 },

    // FACTOR 3: STRESS MANAGEMENT
    { id: "MH11", text: "Saya memiliki strategi efektif untuk mengelola stres akademik.", factor: 'stress_management', weight: 1.3 },
    { id: "MH12", text: "Saya dapat menjaga keseimbangan antara akademik dan kehidupan pribadi.", factor: 'stress_management', weight: 1.1 },
    { id: "MH13", text: "Ketika stres, saya tahu cara menenangkan diri.", factor: 'stress_management', weight: 1.2 },
    { id: "MH14", text: "Saya dapat mencegah stres mengganggu tidur dan makan saya.", factor: 'stress_management', weight: 1.0 },
    { id: "MH15", text: "Saya mampu mengidentifikasi sumber stres dan mengatasinya.", factor: 'stress_management', weight: 1.1 },

    // FACTOR 4: SOCIAL-CULTURAL SUPPORT
    { id: "MH16", text: "Saya merasa didukung oleh keluarga dalam perjalanan akademik.", factor: 'social_support', weight: 1.4 },
    { id: "MH17", text: "Saya memiliki teman yang dapat diajak berbagi beban masalah.", factor: 'social_support', weight: 1.2 },
    { id: "MH18", text: "Lingkungan kampus memberikan dukungan yang saya butuhkan.", factor: 'social_support', weight: 1.1 },
    { id: "MH19", text: "Saya merasa menjadi bagian dari komunitas di kampus.", factor: 'social_support', weight: 1.0 },
    { id: "MH20", text: "Ketika mengalami kesulitan, ada orang yang dapat saya mintai bantuan.", factor: 'social_support', weight: 1.3 }
];

// --- NORMS (Indonesian Student Norms N=2000) ---
const NORMS = {
    mean: 72.3,
    sd: 12.5,
    percentiles: {
        p10: 55, p25: 64.2, p50: 72.8, p75: 81.5, p90: 88.7
    }
};

// --- LOGIC ---

export function calculateMentalHealthScores(
    responses: Record<string, number>,
    responseTimes: Record<string, number> // ms per item
): MentalHealthResult {

    // 1. Scoring & Subscales
    let totalWeighted = 0;
    let totalMaxWait = 0;

    const subscaleSums: Record<MentalHealthFactor, { val: number, max: number }> = {
        emotional_wellbeing: { val: 0, max: 0 },
        academic_resilience: { val: 0, max: 0 },
        stress_management: { val: 0, max: 0 },
        social_support: { val: 0, max: 0 }
    };

    MENTAL_HEALTH_ITEMS.forEach(item => {
        const val = responses[item.id] || 0;
        const weighted = val * item.weight;
        const maxW = 5 * item.weight;

        totalWeighted += weighted;
        totalMaxWait += maxW;

        subscaleSums[item.factor].val += weighted;
        subscaleSums[item.factor].max += maxW;
    });

    const normalizedScore = totalMaxWait > 0 ? (totalWeighted / totalMaxWait) * 100 : 0; // 0-100

    // 2. Percentile Calculation
    const zScore = (normalizedScore - NORMS.mean) / NORMS.sd;
    const percentile = cumulativeNormal(zScore) * 100;

    // 3. Subscale Scores
    const subscales: any = {};
    for (const key of Object.keys(subscaleSums) as MentalHealthFactor[]) {
        const s = subscaleSums[key];
        const sc = s.max > 0 ? (s.val / s.max) * 100 : 0;
        subscales[key] = {
            score: Math.round(sc * 10) / 10,
            level: getLevel(sc)
        };
    }

    // 4. Validity Checks
    const validity = checkValidity(responses, responseTimes);

    // 5. Risk Assessment
    const riskLevel = determineRiskLevel(normalizedScore, responses);
    const redFlags = checkRedFlags(responses);

    return {
        raw_score: Math.round(totalWeighted * 10) / 10,
        normalized_score: Math.round(normalizedScore * 10) / 10,
        percentile: Math.round(percentile * 10) / 10,
        risk_level: riskLevel,
        subscales,
        validity,
        red_flags: redFlags,
        recommendations: generateRecommendations(riskLevel, redFlags, subscales),
        interpretation: generateInterpretation(riskLevel)
    };
}

// --- HELPERS ---

function cumulativeNormal(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) prob = 1 - prob;
    return prob;
}

function getLevel(score: number): string {
    if (score >= 80) return "Tinggi";
    if (score >= 60) return "Sedang";
    return "Rendah";
}

function determineRiskLevel(score: number, responses: Record<string, number>): RiskLevel {
    // Critical overrides
    // E.g. extremely low on happiness + satisfaction -> Critical
    if (responses["MH01"] === 1 && responses["MH05"] === 1) return 'critical_risk';

    if (score < 45) return 'critical_risk';
    if (score < 60) return 'high_risk';
    if (score < 75) return 'moderate_risk';
    return 'low_risk';
}

function checkRedFlags(responses: Record<string, number>): string[] {
    const flags: string[] = [];
    if (responses["MH01"] === 1 && responses["MH05"] === 1) flags.push('very_low_mood');
    if (responses["MH09"] === 1) flags.push('very_low_self_efficacy');
    if ((responses["MH14"] || 0) <= 2 && (responses["MH19"] || 0) <= 2) flags.push('high_risk_isolation');
    return flags;
}

function checkValidity(responses: Record<string, number>, times: Record<string, number>) {
    const vals = Object.values(responses);
    const timeVals = Object.values(times);

    // 1. Straight Lining (e.g. all 1s or all 5s)
    const unique = new Set(vals);
    const isStraightLining = unique.size === 1 && vals.length > 5;

    // 2. Too Fast (<2s per item average is suspicious for reading)
    const avgTime = timeVals.length > 0 ? timeVals.reduce((a, b) => a + b, 0) / timeVals.length : 0;
    const isTooFast = avgTime < 1500; // 1.5s per item

    let vScore = 100;
    const flags: string[] = [];

    if (isStraightLining) {
        flags.push('straight_lining');
        vScore -= 40;
    }
    if (isTooFast) {
        flags.push('too_fast');
        vScore -= 30;
    }

    return {
        isValid: vScore >= 60,
        score: vScore,
        flags
    };
}

function generateInterpretation(level: RiskLevel): string {
    switch (level) {
        case 'low_risk': return "Anda menunjukkan tingkat kesejahteraan mental yang baik. Anda memiliki strategi efektif untuk mengelola stres dan merasa didukung.";
        case 'moderate_risk': return "Anda memiliki dasar kesejahteraan yang cukup, namun ada beberapa area yang dapat ditingkatkan, terutama saat menghadapi tekanan tinggi.";
        case 'high_risk': return "Hasil menunjukkan Anda mengalami beberapa kesulitan signifikan. Disarankan untuk memberi perhatian lebih pada kesehatan mental Anda.";
        case 'critical_risk': return "Terdeteksi indikasi beban psikologis yang berat. Sangat disarankan untuk berkonsultasi dengan profesional atau unit konseling kampus.";
        default: return "";
    }
}

function generateRecommendations(level: RiskLevel, flags: string[], subscales: any): MentalHealthRecommendation[] {
    const recs: MentalHealthRecommendation[] = [];

    // Protocol based on risk
    if (level === 'critical_risk' || level === 'high_risk') {
        recs.push({
            title: "Konsultasi Profesional",
            description: "Segera hubungi layanan konseling kampus atau profesional kesehatan mental untuk dukungan lebih lanjut.",
            priority: 'high',
            resource: { name: "Unit Konseling ITS", contact: "031-5994251" }
        });
    }

    if (flags.includes('high_risk_isolation')) {
        recs.push({
            title: "Bangun Koneksi",
            description: "Cobalah menghubungi satu teman atau anggota keluarga hari ini. Keterhubungan sosial adalah pelindung utama.",
            priority: 'medium'
        });
    }

    // Subscale specific (Lower ones get recs)
    if (subscales.stress_management.score < 60) {
        recs.push({
            title: "Teknik Grounding",
            description: "Praktikkan teknik 5-4-3-2-1 saat merasa kewalahan untuk kembali fokus ke masa kini.",
            priority: 'medium'
        });
    }
    if (subscales.academic_resilience.score < 60) {
        recs.push({
            title: "Growth Mindset",
            description: "Ingatlah bahwa nilai bukan cerminan harga diri. Fokus pada apa yang bisa dipelajari dari setiap tantangan.",
            priority: 'medium'
        });
    }

    return recs;
}
