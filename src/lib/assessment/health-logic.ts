
/**
 * SCIENTIFIC VALIDATION: PHYSICAL HEALTH & VITALITY (DIMENSION 4)
 * Method: Weighted Composite of Validated Instruments
 * 1. Physical Activity (IPAQ-adapted)
 * 2. Sleep Quality (PSQI-adapted)
 * 3. Nutrition (WHO Guidelines)
 * 4. Vitality (Subjective Vitality Scale)
 * 5. Preventive Health
 */

export const HEALTH_ITEMS = [
    // SECTION A: PHYSICAL ACTIVITY (IPAQ)
    { id: 'PA1', text: "Dalam 7 hari terakhir, berapa hari Anda aktivitas fisik sedang (jalan cepat/jogging) min. 30 menit?", type: 'days' },
    { id: 'PA2', text: "Dalam 7 hari terakhir, berapa hari Anda latihan otot (push-up/gym/angkat beban)?", type: 'days' },
    { id: 'PA3', text: "Rata-rata, berapa jam anda DUDUK (sedentary) per hari (kuliah/kerja/main game)?", type: 'hours_inverse' },

    // SECTION B: SLEEP (PSQI)
    { id: 'SQ1', text: "Rata-rata jam tidur efektif per malam?", type: 'hours_optimal_7_9' },
    { id: 'SQ2', text: "Seberapa sering Anda kesulitan tidur / insomnia dalam sebulan terakhir?", type: 'frequency_reverse' },
    { id: 'SQ3', text: "Bagaimana kualitas tidur Anda secara umum?", type: 'quality' },

    // SECTION C: NUTRITION
    { id: 'ND1', text: "Porsi sayur & buah per hari?", type: 'servings' },
    { id: 'ND2', text: "Frekuensi minum manis/boba/kopi susu gula?", type: 'frequency_reverse' },
    { id: 'ND3', text: "Frekuensi melewatkan makan (skip meals)?", type: 'frequency_reverse' },

    // SECTION D: VITALITY (SVS)
    { id: 'SV1', text: "Saya merasa hidup dan penuh energi.", type: 'likert' },
    { id: 'SV2', text: "Saya memiliki energi untuk menyelesaikan semua tugas harian.", type: 'likert' },
    { id: 'SV3', text: "Saya merasa segar saat bangun tidur.", type: 'likert' },

    // SECTION E: PREVENTIVE
    { id: 'PH1', text: "Cek kesehatan rutin (tensi/darah)?", type: 'frequency' },
    { id: 'PH2', text: "Mencuci tangan sebelum makan?", type: 'frequency' },
    { id: 'PH3', text: "Status vaksinasi dasar lengkap?", type: 'boolean' }
];

export function calculateHealthScore(responses: Record<string, any>) {
    // Helper to get val or default
    const getVal = (id: string, def: number = 0) => Number(responses[id]) || def;

    // 1. PHYSICAL ACTIVITY (25%)
    // PA1: 0=0, 1-2=25, 3-4=50, 5-6=75, 7=100
    const pa1 = getVal('PA1') >= 7 ? 100 : getVal('PA1') >= 5 ? 75 : getVal('PA1') >= 3 ? 50 : getVal('PA1') >= 1 ? 25 : 0;
    // PA2: 0=0, 1=33, 2=66, 3+=100
    const pa2 = getVal('PA2') >= 3 ? 100 : getVal('PA2') * 33;
    // PA3: <4h=100, 4-6=75, 6-8=50, 8-10=25, >10=0
    const pa3_val = getVal('PA3');
    const pa3 = pa3_val < 4 ? 100 : pa3_val < 6 ? 75 : pa3_val < 8 ? 50 : pa3_val < 10 ? 25 : 0;

    const activityScore = (pa1 + pa2 + pa3) / 3;

    // 2. SLEEP QUALITY (25%)
    // SQ1: 7-9=100, 6/10=75, 5/11=50, <5/>12=25
    const sq1_val = getVal('SQ1');
    let sq1 = 25;
    if (sq1_val >= 7 && sq1_val <= 9) sq1 = 100;
    else if (sq1_val === 6 || sq1_val === 10) sq1 = 75;
    else if (sq1_val === 5 || sq1_val === 11) sq1 = 50;

    // SQ2: Never(1)=100, Rare(2)=75, Sometimes(3)=50, Often(4)=25, Always(5)=0
    const sq2 = (5 - getVal('SQ2', 3)) * 25;

    // SQ3: Very Good(5)=100...
    const sq3 = (getVal('SQ3', 3) - 1) * 25;

    const sleepScore = (sq1 + sq2 + sq3) / 3;

    // 3. NUTRITION (20%)
    // ND1 (Servings): 0=0, 1=20, 2=40, 3=60, 4=80, 5+=100
    const nd1 = Math.min(getVal('ND1') * 20, 100);
    // ND2 (Sugar): Reverse (1..5)
    const nd2 = (5 - getVal('ND2', 3)) * 25;
    // ND3 (Skip): Reverse
    const nd3 = (5 - getVal('ND3', 3)) * 25;

    const nutritionScore = (nd1 + nd2 + nd3) / 3;

    // 4. VITALITY (20%) - Likert 1-5
    const sv1 = (getVal('SV1', 3) - 1) * 25;
    const sv2 = (getVal('SV2', 3) - 1) * 25;
    const sv3 = (getVal('SV3', 3) - 1) * 25;
    const vitalityScore = (sv1 + sv2 + sv3) / 3;

    // 5. PREVENTIVE (10%)
    const ph1 = (getVal('PH1', 1) - 1) * 25;
    const ph2 = (getVal('PH2', 3) - 1) * 25;
    const ph3 = getVal('PH3') === 1 ? 100 : 50; // Yes/No
    const preventiveScore = (ph1 + ph2 + ph3) / 3;

    // COMPOSITE (Weighted)
    const composite = (activityScore * 0.25) + (sleepScore * 0.25) + (nutritionScore * 0.20) + (vitalityScore * 0.20) + (preventiveScore * 0.10);

    // CATEGORY
    let category = "At Risk";
    if (composite >= 85) category = "Excellent Health";
    else if (composite >= 65) category = "Good Health";
    else if (composite >= 50) category = "Moderate Health";
    else if (composite >= 35) category = "Needs Improvement";

    // RISKS
    const risks = [];
    if (activityScore < 50) risks.push({ factor: "Sedentary Lifestyle", severity: "Moderate" });
    if (sleepScore < 50) risks.push({ factor: "Poor Sleep Quality", severity: "High" });
    if (nutritionScore < 45) risks.push({ factor: "Nutritional Gap", severity: "Moderate" });

    return {
        scores: {
            activity: Math.round(activityScore),
            sleep: Math.round(sleepScore),
            nutrition: Math.round(nutritionScore),
            vitality: Math.round(vitalityScore),
            preventive: Math.round(preventiveScore)
        },
        composite: Math.round(composite * 10) / 10,
        category,
        risks
    };
}
