import { z } from "zod";

// --- Types ---

export type EmotionalSubdomain = 'self_awareness' | 'self_management' | 'social_awareness' | 'relationship_management';
export type ItemType = 'likert' | 'scenario' | 'behavioral';

export interface EmotionalItem {
    id: string;
    text: string;
    type: ItemType;
    subdomain: EmotionalSubdomain;
    weight: number;
    // Likert specific
    likertScale?: {
        1: string; 2: string; 3: string; 4: string; 5: string;
    };
    // Scenario specific
    scenario?: string; // If text is title, this is the body
    options?: {
        id: string;
        text: string;
        score: number; // 1-4 or 1-5 validation score
        rationale?: string;
    }[];
    // Behavioral specific
    frequencyScale?: {
        value: number; // 0-4 or 1-5
        label: string;
        score: number; // 0-100 conversion
    }[];
    // IRT Parameters (if applicable)
    irt?: {
        a: number; // Discrimination
        b: number; // Difficulty
    };
}

export interface EmotionalResult {
    raw_score: number;     // 0-100
    theta_score: number;   // -3.0 to +3.0 (Latent trait)
    percentile: number;    // 0-100
    level: string;         // 'Sangat Unggul', 'Unggul', etc.
    subdomains: Record<EmotionalSubdomain, {
        score: number;
        level: string;
    }>;
    recommendations: Recommendation[];
    properties: {
        sem: number; // Standard Error of Measurement
        confidence_interval: [number, number];
    };
}

export interface Recommendation {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    subdomain: EmotionalSubdomain;
}

// --- Items ---

const LIKERT_SCALE_STD = {
    1: "Sangat Tidak Setuju",
    2: "Tidak Setuju",
    3: "Netral",
    4: "Setuju",
    5: "Sangat Setuju"
};

const FREQUENCY_SCALE_STD = [
    { value: 1, label: "Tidak Pernah", score: 0 },
    { value: 2, label: "Jarang (1-2x)", score: 25 },
    { value: 3, label: "Kadang-kadang", score: 50 },
    { value: 4, label: "Sering", score: 75 },
    { value: 5, label: "Sangat Sering", score: 100 }
];

export const EMOTIONAL_ITEMS: EmotionalItem[] = [
    // --- 1. LIKERT ITEMS (8 Items) ---
    // Self Awareness
    {
        id: "EI01",
        text: "Saya dapat dengan akurat mengidentifikasi dan memberi nama perasaan yang saya alami pada suatu saat.",
        type: 'likert',
        subdomain: 'self_awareness',
        weight: 1.2,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.23, b: -0.45 }
    },
    {
        id: "EI05", // Synthesized/Mapped
        text: "Saya menyadari bagaimana suasana hati saya mempengaruhi keputusan yang saya buat.",
        type: 'likert',
        subdomain: 'self_awareness',
        weight: 1.1,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.12, b: 0.45 }
    },
    // Self Management/Regulation
    {
        id: "EI03",
        text: "Ketika merasa marah atau frustasi, saya dapat menenangkan diri dengan cepat dan kembali fokus.",
        type: 'likert',
        subdomain: 'self_management',
        weight: 1.4,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.67, b: 0.23 }
    },
    {
        id: "EI07",
        text: "Saya dapat menahan diri dari tindakan impulsif saat sedang emosi tinggi.",
        type: 'likert',
        subdomain: 'self_management',
        weight: 1.3,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.38, b: 0.12 }
    },
    // Social Awareness/Empathy
    {
        id: "EI02",
        text: "Saya dapat memahami apa yang orang lain rasakan, bahkan ketika mereka tidak mengungkapkannya secara langsung.",
        type: 'likert',
        subdomain: 'social_awareness',
        weight: 1.3,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.45, b: -0.12 }
    },
    {
        id: "EI08",
        text: "Saya peka terhadap dinamika kelompok dan memahami norma-norma sosial yang tidak terucapkan.",
        type: 'likert',
        subdomain: 'social_awareness',
        weight: 1.1,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.18, b: 0.34 }
    },
    // Relationship Management/Social Skills
    {
        id: "EI04",
        text: "Saya dapat dengan mudah membangun hubungan baik (rapport) dengan orang yang baru saya temui.",
        type: 'likert',
        subdomain: 'relationship_management',
        weight: 1.2,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.34, b: -0.31 }
    },
    {
        id: "EI06",
        text: "Dalam situasi konflik, saya fokus mencari solusi yang menguntungkan semua pihak (win-win).",
        type: 'likert',
        subdomain: 'relationship_management',
        weight: 1.3,
        likertScale: LIKERT_SCALE_STD,
        irt: { a: 1.05, b: 0.67 } // Using approx params
    },

    // --- 2. SITUATIONAL JUDGMENT ITEMS (4 Items) ---
    // SJ01: Conflict (Rel Mgmt)
    {
        id: "SJ01",
        text: "Konflik Tim Proyek",
        scenario: "Anda memimpin tim proyek dan dua anggota tim sedang berkonflik keras tentang pendekatan teknis. Keduanya datang kepada Anda dengan emosi tinggi. Apa yang akan Anda lakukan?",
        type: 'scenario',
        subdomain: 'relationship_management',
        weight: 1.5,
        options: [
            { id: "A", text: "Meminta mereka menyelesaikan sendiri karena ini masalah profesional.", score: 1, rationale: "Avoidance" },
            { id: "B", text: "Menghentikan diskusi dan memutuskan sendiri solusi teknisnya.", score: 2, rationale: "Authoritarian" },
            { id: "C", text: "Mengadakan pertemuan terpisah untuk memahami perspektif, lalu mediasi.", score: 3, rationale: "Empathetic Mediation" },
            { id: "D", text: "Mengadakan sesi mediasi langsung fokus pada solusi win-win dan kebutuhan proyek.", score: 4, rationale: "Optimal: Collaborative & Goal Oriented" }
        ],
        irt: { a: 1.8, b: 0.5 }
    },
    // SJ02: Stress/Deadline (Self Mgmt)
    {
        id: "SJ02",
        text: "Tekanan Deadline",
        scenario: "Deadline besar tinggal 2 hari lagi, dan laptop Anda tiba-tiba rusak, menghilangkan pekerjaan 1 hari terakhir. Anda merasa panik dan marah. Respon terbaik?",
        type: 'scenario',
        subdomain: 'self_management',
        weight: 1.5,
        options: [
            { id: "A", text: "Meluapkan kemarahan pada layanan servis laptop.", score: 1 },
            { id: "B", text: "Panik dan mencoba mengerjakan semuanya sekaligus tanpa istirahat.", score: 2 },
            { id: "C", text: "Mengambil jeda 15 menit untuk menenangkan diri, lalu membuat rencana baru yang realistis.", score: 4 },
            { id: "D", text: "Memberitahu dosen/atasan tentang musibah ini untuk meminta perpanjangan segera.", score: 3 }
        ],
        irt: { a: 1.7, b: 0.2 }
    },
    // SJ03: Feedback (Social Awareness)
    {
        id: "SJ03",
        text: "Umpan Balik Kritis",
        scenario: "Seorang teman tim terlihat diam dan menarik diri setelah Anda memberikan kritik pada pekerjaannya dalam rapat. Anda menduga dia tersinggung.",
        type: 'scenario',
        subdomain: 'social_awareness',
        weight: 1.4,
        options: [
            { id: "A", text: "Membiarkannya, dia harus belajar profesional menerima kritik.", score: 1 },
            { id: "B", text: "Bertanya di grup WA: 'Kenapa kok diam aja?'", score: 2 },
            { id: "C", text: "Mendekatinya secara pribadi, meminta maaf jika cara penyampaian kurang pas, dan mendengarkan perspektifnya.", score: 4 },
            { id: "D", text: "Mengajaknya bercanda untuk mencairkan suasana tanpa membahas masalah.", score: 2 }
        ],
        irt: { a: 1.6, b: 0.1 }
    },
    // SJ04: Reflection (Self Awareness)
    {
        id: "SJ04",
        text: "Evaluasi Diri",
        scenario: "Anda gagal mendapatkan posisi organisasi yang Anda inginkan. Teman Anda yang menurut Anda kurang kompeten malah yang terpilih.",
        type: 'scenario',
        subdomain: 'self_awareness',
        weight: 1.3,
        options: [
            { id: "A", text: "Merasa sistem tidak adil dan menyalahkan penyeleksi.", score: 1 },
            { id: "B", text: "Berpura-pura tidak peduli agar tidak terlihat kecewa.", score: 2 },
            { id: "C", text: "Menyadari rasa iri & kecewa saya, lalu mengevaluasi kekurangan diri secara objektif.", score: 4 },
            { id: "D", text: "Langsung mencari posisi lain untuk membuktikan kemampuan.", score: 3 }
        ],
        irt: { a: 1.5, b: 0.3 }
    },

    // --- 3. BEHAVIORAL FREQUENCY ITEMS (4 Items) ---
    // BF01: Expression (Rel Mgmt)
    {
        id: "BF01",
        text: "Dalam satu bulan terakhir, seberapa sering Anda secara sengaja menyempatkan waktu untuk membantu rekan tim yang kesulitan?",
        type: 'behavioral',
        subdomain: 'relationship_management',
        weight: 1.0,
        frequencyScale: FREQUENCY_SCALE_STD
    },
    // BF02: Reflection (Self Awareness)
    {
        id: "BF02",
        text: "Seberapa sering Anda meluangkan waktu (jurnaling/renungan) untuk mengevaluasi emosi dan reaksi Anda dalam seminggu?",
        type: 'behavioral',
        subdomain: 'self_awareness',
        weight: 1.2,
        frequencyScale: FREQUENCY_SCALE_STD
    },
    // BF03: Pausing (Self Mgmt)
    {
        id: "BF03",
        text: "Dalam situasi stres minggu ini, seberapa sering Anda berhasil 'berhenti sejenak' (pause) sebelum bereaksi negatif?",
        type: 'behavioral',
        subdomain: 'self_management',
        weight: 1.3,
        frequencyScale: FREQUENCY_SCALE_STD
    },
    // BF04: Listening (Social Awareness)
    {
        id: "BF04",
        text: "Seberapa sering Anda mendengarkan teman curhat tanpa memotong atau langsung memberikan nasihat (active listening)?",
        type: 'behavioral',
        subdomain: 'social_awareness',
        weight: 1.1,
        frequencyScale: FREQUENCY_SCALE_STD
    }
];

// --- SCORING NORMS (Based on provided N=2000 data) ---
// Overall Mean=68.3, SD=12.4
const NORMS = {
    mean: 68.3,
    sd: 12.4
};

// --- LOGIC ---

export function calculateEmotionalScores(responses: Record<string, any>): EmotionalResult {

    // 1. Calculate Raw Weighted Scores (Classical Test Theory)
    let totalWeighted = 0;
    let totalMax = 0;

    const subdomainSums: Record<EmotionalSubdomain, { val: number, max: number }> = {
        self_awareness: { val: 0, max: 0 },
        self_management: { val: 0, max: 0 },
        social_awareness: { val: 0, max: 0 },
        relationship_management: { val: 0, max: 0 }
    };

    EMOTIONAL_ITEMS.forEach(item => {
        const resp = responses[item.id];
        if (resp !== undefined) {
            let score = 0;
            let maxScore = 0;

            if (item.type === 'likert') {
                // 1-5
                score = (Number(resp));
                maxScore = 5;
            } else if (item.type === 'scenario') {
                // Options have specific scores 1-4
                const opt = item.options?.find(o => o.id === resp);
                score = opt ? opt.score : 0;
                maxScore = 4;
            } else if (item.type === 'behavioral') {
                // 1-5 scale mapped to 0-100 usually, but here keep raw 1-5 for weighting first?
                // The items def says "score: 0-100". Let's use the score value from map.
                const scaleItem = item.frequencyScale?.find(s => s.value === Number(resp));
                // Standardize everything to 0-100 scale for summing
                const normalized = scaleItem ? scaleItem.score : 0;
                score = normalized;
                maxScore = 100;
            }

            // Normalize Likert/Scenario to 0-100 for consistent integration if Behavioral is 0-100?
            // Let's normalize everything to 0-100 before weighting.
            let normalizedScore = 0;
            if (item.type === 'likert') normalizedScore = ((score - 1) / 4) * 100;
            else if (item.type === 'scenario') normalizedScore = ((score - 1) / 3) * 100;
            else normalizedScore = score; // Behavioral is already 0-100 mapped

            const weightedScore = normalizedScore * item.weight;
            const itemMaxWeight = 100 * item.weight;

            totalWeighted += weightedScore;
            totalMax += itemMaxWeight;

            subdomainSums[item.subdomain].val += weightedScore;
            subdomainSums[item.subdomain].max += itemMaxWeight;
        }
    });

    const rawPercentage = totalMax > 0 ? (totalWeighted / totalMax) * 100 : 0;

    // 2. IRT theta estimation (Simplified Newton-Raphson approximation)
    // Used for precision adjustment
    const theta = estimateTheta(responses);

    // 3. Final Composite Adjustment
    // We blend the Raw Weighted (CTT) with Theta-based scaling to be robust
    // User logic: "adjusted_score = convert_theta_to_scale(theta)" often preferred if IRT is primary
    // But since behavioral items (Linear) are mixed, we use a hybrid.
    // Let's rely on the CTT Score as base, adjusted by Theta deviation.
    // Or just map Theta to the Normal distribution of the population.
    // MeanTheta = 0, SD=1.
    // Pop Mean = 68.3, SD = 12.4
    const irtImpliedScore = (theta * 12.4) + 68.3;

    // Average validity check: 70% CTT, 30% IRT (Robustness)
    let finalScore = (rawPercentage * 0.7) + (Math.max(0, Math.min(100, irtImpliedScore)) * 0.3);

    // 4. Percentile
    const zScore = (finalScore - NORMS.mean) / NORMS.sd;
    const percentile = cumulativeNormal(zScore) * 100;

    // 5. Subdomains
    const subdomains: any = {};
    for (const key of Object.keys(subdomainSums) as EmotionalSubdomain[]) {
        const s = subdomainSums[key];
        const subScore = s.max > 0 ? (s.val / s.max) * 100 : 0;
        subdomains[key] = {
            score: Math.round(subScore * 10) / 10,
            level: getLevel(subScore)
        };
    }

    // 6. Validations
    const reliability = 0.91;
    const sem = 3.2;
    const ci: [number, number] = [finalScore - 1.96 * sem, finalScore + 1.96 * sem];

    return {
        raw_score: Math.round(rawPercentage * 10) / 10,
        theta_score: Math.round(theta * 100) / 100,
        percentile: Math.round(percentile * 10) / 10,
        level: getLevel(finalScore),
        subdomains,
        recommendations: generateRecommendations(subdomains),
        properties: {
            sem,
            confidence_interval: [Math.round(ci[0] * 10) / 10, Math.round(ci[1] * 10) / 10]
        }
    };
}

// --- HELPERS ---

function estimateTheta(responses: Record<string, any>): number {
    // 2PL Model approximation
    // We only use Likert and Scenario items which have IRT params
    let theta = 0.0; // Start at mean

    for (let iter = 0; iter < 10; iter++) {
        let numeric = 0;
        let denomenator = 0;

        EMOTIONAL_ITEMS.forEach(item => {
            if (item.irt && responses[item.id]) {
                const { a, b } = item.irt;
                const p = 1 / (1 + Math.exp(-a * (theta - b)));

                // Convert response to binary-ish for 2PL or use polytomous logic?
                // User's python used binary: "1 if response >= 4 else 0"
                // Let's stick to that for the Newton-Raphson port.

                let val = 0;
                if (item.type === 'likert') val = Number(responses[item.id]) >= 4 ? 1 : 0;
                else if (item.type === 'scenario') {
                    // Scenario logic: High score = 1?
                    // Scenario options have scores 1-4. Let's say >= 3 is 'correct'/high
                    const opt = item.options?.find(o => o.id === responses[item.id]);
                    val = (opt?.score || 0) >= 3 ? 1 : 0;
                } else {
                    return; // Skip behavioral for theta
                }

                numeric += a * (val - p);
                denomenator += a * a * p * (1 - p);
            }
        });

        if (denomenator < 0.001) break;
        theta += numeric / denomenator; // Newton update
    }

    // Clip
    return Math.max(-3, Math.min(3, theta));
}

function cumulativeNormal(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) prob = 1 - prob;
    return prob;
}

function getLevel(score: number): string {
    if (score >= 84) return "Sangat Unggul"; // >90th percentile approx
    if (score >= 77) return "Unggul";
    if (score >= 68) return "Rata-rata Atas";
    if (score >= 60) return "Rata-rata Bawah";
    return "Perlu Pengembangan";
}

function generateRecommendations(subdomains: Record<EmotionalSubdomain, { score: number }>): Recommendation[] {
    const recs: Recommendation[] = [];

    const sorted = (Object.keys(subdomains) as EmotionalSubdomain[]).sort((a, b) => subdomains[a].score - subdomains[b].score);

    // Lowest 2 get recommendations
    sorted.slice(0, 2).forEach(key => {
        if (key === 'self_awareness') {
            recs.push({
                subdomain: key,
                title: "Journaling Emosi",
                description: "Luangkan 5 menit setiap malam untuk menuliskan emosi kuat yang dirasakan dan pemicunya.",
                priority: 'high'
            });
        }
        if (key === 'self_management') {
            recs.push({
                subdomain: key,
                title: "Teknik 'Pause & Breathe'",
                description: "Praktikkan jeda 10 detik sebelum merespons situasi stres.",
                priority: 'high'
            });
        }
        if (key === 'social_awareness') {
            recs.push({
                subdomain: key,
                title: "Observasi Non-Verbal",
                description: "Dalam rapat, fokuskan perhatian pada bahasa tubuh rekan tim, bukan hanya kata-katanya.",
                priority: 'medium'
            });
        }
        if (key === 'relationship_management') {
            recs.push({
                subdomain: key,
                title: "Feedback Konstruktif",
                description: "Berlatih memberikan apresiasi spesifik kepada 3 orang berbeda minggu ini.",
                priority: 'medium'
            });
        }
    });

    return recs;
}
