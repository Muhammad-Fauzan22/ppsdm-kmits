// import { AssessmentResult } from '@/types/assessment';

// --- Types & Interfaces ---

export interface SpiritualAssessmentResult {
    rawScore: number;
    normalizedScore: number; // 0-100
    tScore: number;
    percentileLink: number;
    developmentLevel: 'Awakening' | 'Exploring' | 'Integrating' | 'Expressing' | 'Transcending';
    subscores: {
        purposeMeaning: number; // 0-100
        gratitudeMindfulness: number;
        connectednessTranscendence: number;
        altruismContribution: number;
    };
    balanceIndex: number; // 0-1
    recommendations: string[];
}

export interface SpiritualQuestion {
    id: string;
    text: string;
    subdimension: 'purpose_meaning' | 'gratitude_mindfulness' | 'connectedness_transcendence' | 'altruism_contribution';
    source: string;
}

// --- CONSTANTS: ISDS Instrument (8 Items) ---
export const ISDS_ITEMS: SpiritualQuestion[] = [
    {
        id: "SP1",
        subdimension: "purpose_meaning",
        text: "Saya memiliki tujuan hidup yang jelas dan bermakna",
        source: "Adapted from PIL Item 3"
    },
    {
        id: "SP2",
        subdimension: "purpose_meaning",
        text: "Saya dapat menemukan makna dalam pengalaman sulit yang saya hadapi",
        source: "Adapted from PIL Item 7"
    },
    {
        id: "SP3",
        subdimension: "gratitude_mindfulness",
        text: "Saya secara teratur merasakan rasa syukur atas hal-hal baik dalam hidup saya",
        source: "Adapted from GQ-6 Item 2"
    },
    {
        id: "SP4",
        subdimension: "gratitude_mindfulness",
        text: "Saya menghargai keindahan dan keajaiban dalam kehidupan sehari-hari",
        source: "Adapted from SWBS Existential"
    },
    {
        id: "SP5",
        subdimension: "connectedness_transcendence",
        text: "Saya merasa terhubung dengan sesuatu yang lebih besar dari diri saya sendiri",
        source: "Adapted from STS Universalism"
    },
    {
        id: "SP6",
        subdimension: "connectedness_transcendence",
        text: "Saya merasakan kedamaian batin melalui hubungan spiritual/keagamaan saya",
        source: "Adapted from SWBS Religious"
    },
    {
        id: "SP7",
        subdimension: "altruism_contribution",
        text: "Saya merasa terdorong untuk membantu orang lain tanpa mengharap imbalan",
        source: "Adapted from Altruism Scale"
    },
    {
        id: "SP8",
        subdimension: "altruism_contribution",
        text: "Saya ingin meninggalkan dampak positif bagi dunia selama hidup saya",
        source: "Adapted from PIL legacy"
    }
];

// --- SCORING LOGIC ---

export const calculateSpiritualScore = (responses: Record<string, number>): SpiritualAssessmentResult => {
    // 1. Validate & Fill
    const processedResponses = { ...responses };
    ISDS_ITEMS.forEach(item => {
        if (!processedResponses[item.id]) processedResponses[item.id] = 3; // Neutral default
    });

    // 2. Raw Score (8-40)
    let rawScore = 0;
    Object.values(processedResponses).forEach(val => rawScore += val);

    // 3. Normalized Score (0-100)
    // ((raw - 8) / 32) * 100
    const normalizedScore = Math.round(((rawScore - 8) / 32) * 100);

    // 4. Subdimension Scores (0-100)
    // Each subdim has 2 items. Max raw = 10, Min = 2. Range = 8.
    const calcSub = (ids: string[]) => {
        const sum = ids.reduce((acc, id) => acc + processedResponses[id], 0);
        return Math.round(((sum - 2) / 8) * 100);
    };

    const subscores = {
        purposeMeaning: calcSub(['SP1', 'SP2']),
        gratitudeMindfulness: calcSub(['SP3', 'SP4']),
        connectednessTranscendence: calcSub(['SP5', 'SP6']),
        altruismContribution: calcSub(['SP7', 'SP8'])
    };

    // 5. T-Score (Mean 69.2, SD 18.5 from Norms)
    // T = 50 + 10 * z
    // z = (normalized - mean) / sd
    const z = (normalizedScore - 69.2) / 18.5;
    const tScore = Math.round(50 + (10 * z));

    // 6. Percentile
    // Simplified lookup based on provided norms
    let percentile = 50;
    if (normalizedScore >= 88.6) percentile = 95;
    else if (normalizedScore >= 76.9) percentile = 75;
    else if (normalizedScore >= 65.6) percentile = 50;
    else if (normalizedScore >= 54.3) percentile = 25;
    else if (normalizedScore <= 36.9) percentile = 5;
    else {
        // Linear interpolation approx
        percentile = 50 + (z * 34);
        if (percentile > 99) percentile = 99;
        if (percentile < 1) percentile = 1;
    }

    // 7. Developmental Level
    let level: SpiritualAssessmentResult['developmentLevel'] = 'Integrating';
    if (normalizedScore >= 86) level = 'Transcending';
    else if (normalizedScore >= 76) level = 'Expressing';
    else if (normalizedScore >= 61) level = 'Integrating';
    else if (normalizedScore >= 41) level = 'Exploring';
    else level = 'Awakening';

    // 8. Balance Index
    // 1 - (SD of subscores / 50) -> Scale 0-1 approx
    const values = Object.values(subscores);
    const meanSub = values.reduce((a, b) => a + b, 0) / 4;
    const variance = values.reduce((a, b) => a + Math.pow(b - meanSub, 2), 0) / 4;
    const sdSub = Math.sqrt(variance);
    const balanceIndex = Math.max(0, parseFloat((1 - (sdSub / 50)).toFixed(2)));


    // 9. Recommendations
    const recommendations: string[] = [];

    if (subscores.purposeMeaning < 60) {
        recommendations.push("Lakukan refleksi harian tentang tujuan jangka panjang Anda.");
        recommendations.push("Baca buku biografi tokoh inspiratif untuk menemukan pola makna hidup.");
    }
    if (subscores.gratitudeMindfulness < 60) {
        recommendations.push("Mulai jurnal rasa syukur: tulis 3 hal baik setiap malam.");
        recommendations.push("Latih mindfulness 5 menit sehari (fokus napas).");
    }
    if (subscores.connectednessTranscendence < 60) {
        recommendations.push("Luangkan waktu di alam terbuka tanpa gadget.");
        recommendations.push("Eksplorasi komunitas spiritual atau diskusi filosofis.");
    }
    if (subscores.altruismContribution < 60) {
        recommendations.push("Cari satu kegiatan sukarela kecil minggu ini.");
        recommendations.push("Tawarkan bantuan proaktif kepada teman yang kesulitan.");
    }

    if (recommendations.length === 0) {
        recommendations.push("Anda memiliki keseimbangan spiritual yang baik. Pertimbangkan untuk menjadi mentor bagi orang lain.");
    }

    return {
        rawScore,
        normalizedScore,
        tScore,
        percentileLink: Math.round(percentile),
        developmentLevel: level,
        subscores,
        balanceIndex,
        recommendations
    };
};
