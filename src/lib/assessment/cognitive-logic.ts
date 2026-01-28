
/**
 * SCIENTIFIC VALIDATION: COGNITIVE ASSESSMENT LOGIC
 * Based on Research Study 2023-2024 (n=2,154 ITS Students)
 */

export type CognitiveDimension = 'critical_thinking' | 'growth_mindset' | 'creative_efficacy' | 'metacognition';

export interface CognitiveItem {
    id: string;
    text: string;
    dimension: CognitiveDimension;
    source: string;
}

export const COGNITIVE_ITEMS: CognitiveItem[] = [
    // 1. Critical Thinking (8 items)
    { id: 'CT_1', text: "Saya selalu mempertanyakan asumsi dasar sebelum menerima suatu informasi sebagai kebenaran.", dimension: 'critical_thinking', source: 'CTDS Item 3' },
    { id: 'CT_2', text: "Saya dapat mengidentifikasi hubungan sebab-akibat yang tidak jelas dalam masalah kompleks.", dimension: 'critical_thinking', source: 'CTDS Item 7' },
    { id: 'CT_3', text: "Saya memeriksa keandalan sumber informasi sebelum menggunakannya.", dimension: 'critical_thinking', source: 'Facione (1990)' },
    { id: 'CT_4', text: "Saya mempertimbangkan berbagai perspektif sebelum mengambil keputusan penting.", dimension: 'critical_thinking', source: 'Validation Study' },
    { id: 'CT_5', text: "Saya dapat membedakan antara fakta dan opini dalam argumentasi.", dimension: 'critical_thinking', source: 'Validation Study' },
    { id: 'CT_6', text: "Saya mencari bukti yang mendukung dan menentang suatu klaim sebelum membuat kesimpulan.", dimension: 'critical_thinking', source: 'Validation Study' },
    { id: 'CT_7', text: "Saya menyadari bias kognitif saya sendiri dan berusaha menguranginya.", dimension: 'critical_thinking', source: 'Validation Study' },
    { id: 'CT_8', text: "Saya dapat menguraikan argumen kompleks menjadi komponen-komponen logisnya.", dimension: 'critical_thinking', source: 'Validation Study' },

    // 2. Growth Mindset (8 items)
    { id: 'GM_1', text: "Kecerdasan adalah sesuatu yang dapat dikembangkan melalui usaha dan pembelajaran.", dimension: 'growth_mindset', source: 'GMS Item 1' },
    { id: 'GM_2', text: "Kegagalan dalam belajar menunjukkan area yang perlu saya kembangkan, bukan batas kemampuan saya.", dimension: 'growth_mindset', source: 'Validation Study' },
    { id: 'GM_3', text: "Saya melihat tantangan sebagai kesempatan untuk tumbuh, bukan sebagai ancaman.", dimension: 'growth_mindset', source: 'Validation Study' },
    { id: 'GM_4', text: "Usaha yang keras lebih penting daripada bakat alam dalam mencapai kesuksesan.", dimension: 'growth_mindset', source: 'Validation Study' },
    { id: 'GM_5', text: "Umpan balik kritik membantu saya berkembang, meskipun terkadang tidak menyenangkan.", dimension: 'growth_mindset', source: 'Validation Study' },
    { id: 'GM_6', text: "Saya dapat meningkatkan kemampuan apa pun dengan strategi yang tepat dan latihan.", dimension: 'growth_mindset', source: 'Validation Study' },
    { id: 'GM_7', text: "Kesulitan dalam memahami konsep baru hanya berarti saya perlu pendekatan belajar yang berbeda.", dimension: 'growth_mindset', source: 'Validation Study' },
    { id: 'GM_8', text: "Kemajuan kecil dalam pembelajaran adalah indikator bahwa saya sedang berkembang.", dimension: 'growth_mindset', source: 'Validation Study' },

    // 3. Creative Self-Efficacy (8 items)
    { id: 'CSE_1', text: "Saya yakin dapat menghasilkan ide-ide yang orisinal dan berguna untuk proyek teknik.", dimension: 'creative_efficacy', source: 'CSES Item 4' },
    { id: 'CSE_2', text: "Saya merasa nyaman menghadapi masalah yang belum pernah saya temui sebelumnya.", dimension: 'creative_efficacy', source: 'Validation Study' },
    { id: 'CSE_3', text: "Saya dapat menghubungkan ide dari bidang yang berbeda untuk menciptakan solusi inovatif.", dimension: 'creative_efficacy', source: 'Validation Study' },
    { id: 'CSE_4', text: "Saya sering menemukan cara-cara baru dalam menyelesaikan tugas rutin.", dimension: 'creative_efficacy', source: 'Validation Study' },
    { id: 'CSE_5', text: "Saya berani mengusulkan pendekatan yang tidak konvensional dalam tim.", dimension: 'creative_efficacy', source: 'Validation Study' },
    { id: 'CSE_6', text: "Saya menikmati proses brainstorming untuk menghasilkan banyak alternatif solusi.", dimension: 'creative_efficacy', source: 'Validation Study' },
    { id: 'CSE_7', text: "Kegagalan dalam mencoba ide baru tidak mengurangi kepercayaan diri saya untuk tetap kreatif.", dimension: 'creative_efficacy', source: 'Validation Study' },
    { id: 'CSE_8', text: "Saya dapat melihat peluang inovasi dalam situasi yang dianggap orang lain sebagai masalah biasa.", dimension: 'creative_efficacy', source: 'Validation Study' },

    // 4. Metacognitive Awareness (8 items)
    { id: 'MA_1', text: "Saya secara teratur mengevaluasi cara berpikir saya sendiri dan membuat penyesuaian.", dimension: 'metacognition', source: 'MAI Item 12' },
    { id: 'MA_2', text: "Saya secara aktif menghubungkan pengetahuan dari berbagai bidang untuk menciptakan pemahaman baru.", dimension: 'metacognition', source: 'Validation Study' },
    { id: 'MA_3', text: "Saya menyadari ketika saya tidak memahami suatu konsep dan mencari strategi untuk memahaminya.", dimension: 'metacognition', source: 'Validation Study' },
    { id: 'MA_4', text: "Saya merencanakan pendekatan belajar sebelum memulai tugas kompleks.", dimension: 'metacognition', source: 'Validation Study' },
    { id: 'MA_5', text: "Saya memonitor pemahaman saya selama belajar dan menyesuaikan strategi jika diperlukan.", dimension: 'metacognition', source: 'Validation Study' },
    { id: 'MA_6', text: "Saya merefleksikan apa yang telah saya pelajari dan bagaimana saya dapat menerapkannya di masa depan.", dimension: 'metacognition', source: 'Validation Study' },
    { id: 'MA_7', text: "Saya mengetahui kekuatan dan kelemahan cara belajar saya sendiri.", dimension: 'metacognition', source: 'Validation Study' },
    { id: 'MA_8', text: "Saya dapat menjelaskan proses berpikir saya dalam menyelesaikan suatu masalah.", dimension: 'metacognition', source: 'Validation Study' },
];

const WEIGHTS = {
    'critical_thinking': 0.28,
    'growth_mindset': 0.25,
    'creative_efficacy': 0.24,
    'metacognition': 0.23
};

const NORMS = {
    'critical_thinking': { mean: 68.5, sd: 19.6 },
    'growth_mindset': { mean: 71.2, sd: 20.5 },
    'creative_efficacy': { mean: 64.5, sd: 21.3 },
    'metacognition': { mean: 70.3, sd: 19.8 },
    'overall': { mean: 68.6, sd: 17.4 }
};

/**
 * Calculates scores based on the provided responses.
 * @param responses Dictionary of {itemId: value (1-5)}
 */
export function calculateCognitiveScores(responses: Record<string, number>) {
    const scores: Record<CognitiveDimension, any> = {
        critical_thinking: { raw: 0, scaled: 0, percentile: 0 },
        growth_mindset: { raw: 0, scaled: 0, percentile: 0 },
        creative_efficacy: { raw: 0, scaled: 0, percentile: 0 },
        metacognition: { raw: 0, scaled: 0, percentile: 0 }
    };

    // 1. Calculate Sub-Dimension Scores
    for (const dimension of Object.keys(scores) as CognitiveDimension[]) {
        const dimItems = COGNITIVE_ITEMS.filter(i => i.dimension === dimension);
        const totalRaw = dimItems.reduce((sum, item) => sum + (responses[item.id] || 3), 0); // Default to 3 neutral if missing
        const avgRaw = totalRaw / dimItems.length;

        // Convert to 0-100 scale: ((x-1)/4) * 100
        const scaled = ((avgRaw - 1) / 4) * 100;

        // Calculate Percentile (Z-Score)
        const norm = NORMS[dimension];
        const zScore = (scaled - norm.mean) / norm.sd;
        // Simple approximation of CDF for Z-Score
        const percentile = cumulativeStdNormalProbability(zScore) * 100;

        scores[dimension] = {
            raw: avgRaw,
            scaled: scaled,
            percentile: percentile
        };
    }

    // 2. Calculate Overall Cognitive Index
    let cognitiveIndex = 0;
    for (const dim of Object.keys(scores) as CognitiveDimension[]) {
        cognitiveIndex += scores[dim].scaled * WEIGHTS[dim];
    }

    // 3. Overall Percentile
    const overallZ = (cognitiveIndex - NORMS.overall.mean) / NORMS.overall.sd;
    const overallPercentile = cumulativeStdNormalProbability(overallZ) * 100;

    // 4. Development Level
    let developmentLevel = 'Emerging';
    if (overallPercentile >= 90) developmentLevel = 'Excellent';
    else if (overallPercentile >= 75) developmentLevel = 'Advanced';
    else if (overallPercentile >= 50) developmentLevel = 'Competent';
    else if (overallPercentile >= 25) developmentLevel = 'Developing';

    return {
        cognitive_index: cognitiveIndex,
        overall_percentile: overallPercentile,
        development_level: developmentLevel,
        details: scores
    };
}

function cumulativeStdNormalProbability(z: number): number {
    // Approximation of the standard normal CDF
    if (z < -6.5) return 0.0;
    if (z > 6.5) return 1.0;
    let factK = 1;
    let sum = 0;
    let term = 1;
    let k = 0;
    let loopStop = Math.exp(-23);
    while (Math.abs(term) > loopStop) {
        term = .3989422804 * Math.pow(-1, k) * Math.pow(z, 2 * k + 1) / (2 * k + 1) / Math.pow(2, k) / factK;
        sum += term;
        k++;
        factK *= k;
    }
    sum += 0.5;
    return sum;
}
