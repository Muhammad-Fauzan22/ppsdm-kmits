
// Scoring logic for Physical Health & Vitality Assessment (Dimensi 4)

export type PhysicalResponse = {
    [key: string]: number; // PH1 to PH8
};

export type PhysicalResult = {
    totalScore: number;
    subdomainScores: {
        physicalActivity: number;
        sleepHealth: number;
        nutritionHydration: number;
        vitalityWellbeing: number;
    };
    percentile: number;
    category: string;
    categoryColor: string;
    categoryDescription: string;
    riskFlags: RiskFlag[];
    recommendations: string[];
};

export type RiskFlag = {
    code: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    recommendation: string;
};

// Item weights based on factor loadings
const ITEM_WEIGHTS: Record<string, number> = {
    'PH1': 0.15, // Physical activity
    'PH2': 0.14, // Sleep duration
    'PH3': 0.13, // Sleep quality
    'PH4': 0.12, // Nutrition
    'PH5': 0.13, // Vitality
    'PH6': 0.11, // Hydration
    'PH7': 0.12, // Health symptoms
    'PH8': 0.10  // Stress management
};

// Score mapping for each option
const SCORE_MAPPING: Record<string, Record<number, number>> = {
    'PH1': { 0: 0, 1: 25, 2: 50, 3: 75, 4: 100 },
    'PH2': { 1: 0, 2: 25, 3: 50, 4: 100, 5: 50 },
    'PH3': { 1: 100, 2: 75, 3: 50, 4: 0 },
    'PH4': { 1: 0, 2: 25, 3: 75, 4: 100 },
    'PH5': { 1: 0, 2: 25, 3: 50, 4: 75, 5: 100 },
    'PH6': { 1: 0, 2: 25, 3: 75, 4: 100 },
    'PH7': { 1: 100, 2: 75, 3: 25, 4: 0 },
    'PH8': { 1: 0, 2: 25, 3: 50, 4: 75, 5: 100 }
};

export function calculatePhysicalScore(responses: PhysicalResponse): PhysicalResult {
    let totalScore = 0;
    const subdomainScores = {
        physicalActivity: 0,
        sleepHealth: 0,
        nutritionHydration: 0,
        vitalityWellbeing: 0
    };

    // Calculate weighted scores
    for (const [itemId, response] of Object.entries(responses)) {
        if (SCORE_MAPPING[itemId] && SCORE_MAPPING[itemId][response] !== undefined) {
            const itemScore = SCORE_MAPPING[itemId][response];
            totalScore += itemScore * ITEM_WEIGHTS[itemId];

            // Aggregating subdomains
            if (itemId === 'PH1') {
                subdomainScores.physicalActivity += itemScore;
            } else if (['PH2', 'PH3'].includes(itemId)) {
                subdomainScores.sleepHealth += itemScore / 2;
            } else if (['PH4', 'PH6'].includes(itemId)) {
                subdomainScores.nutritionHydration += itemScore / 2;
            } else if (['PH5', 'PH7', 'PH8'].includes(itemId)) {
                subdomainScores.vitalityWellbeing += itemScore / 3;
            }
        }
    }

    // Adjust for response patterns (simplified from python version)
    const allMax = Object.keys(responses).every(k =>
        SCORE_MAPPING[k] && SCORE_MAPPING[k][responses[k]] === 100
    );
    if (allMax) totalScore *= 0.95;

    const allMin = Object.keys(responses).every(k =>
        SCORE_MAPPING[k] && SCORE_MAPPING[k][responses[k]] === 0
    );
    if (allMin) totalScore = Math.min(100, totalScore * 1.05);

    totalScore = Math.round(totalScore * 10) / 10;

    // Round subdomains
    subdomainScores.physicalActivity = Math.round(subdomainScores.physicalActivity * 10) / 10;
    subdomainScores.sleepHealth = Math.round(subdomainScores.sleepHealth * 10) / 10;
    subdomainScores.nutritionHydration = Math.round(subdomainScores.nutritionHydration * 10) / 10;
    subdomainScores.vitalityWellbeing = Math.round(subdomainScores.vitalityWellbeing * 10) / 10;

    const percentileData = calculatePercentile(totalScore);
    const categoryData = categorizeHealth(totalScore);
    const riskFlags = identifyRiskFlags(responses);

    // Generate recommendations based on subdomains and risks
    const recommendations = generateRecommendations(subdomainScores, riskFlags);

    return {
        totalScore,
        subdomainScores,
        percentile: percentileData,
        category: categoryData.category,
        categoryColor: categoryData.color,
        categoryDescription: categoryData.description,
        riskFlags,
        recommendations
    };
}

function calculatePercentile(score: number): number {
    if (score >= 82.5) return Math.round((score - 82.5) / (100 - 82.5) * 10 + 90);
    if (score >= 73.2) return Math.round((score - 73.2) / (82.5 - 73.2) * 15 + 75);
    if (score >= 61.8) return Math.round((score - 61.8) / (73.2 - 61.8) * 25 + 50);
    if (score >= 49.3) return Math.round((score - 49.3) / (61.8 - 49.3) * 25 + 25);
    return Math.round(score / 49.3 * 25);
}

function categorizeHealth(score: number) {
    if (score >= 85) return { category: "Excellent", color: "text-emerald-500", description: "Kesehatan fisik dan vitalitas sangat baik. Pertahankan pola hidup sehat!" };
    if (score >= 70) return { category: "Good", color: "text-blue-500", description: "Kesehatan fisik baik. Beberapa area dapat ditingkatkan." };
    if (score >= 55) return { category: "Moderate", color: "text-yellow-500", description: "Kesehatan fisik cukup. Perlu perbaikan di beberapa aspek." };
    if (score >= 40) return { category: "Needs Improvement", color: "text-orange-500", description: "Kesehatan fisik perlu perhatian. Disarankan perubahan pola hidup." };
    return { category: "At Risk", color: "text-red-600", description: "Kesehatan fisik berisiko. Sangat disarankan berkonsultasi dengan tenaga kesehatan." };
}

function identifyRiskFlags(responses: PhysicalResponse): RiskFlag[] {
    const flags: RiskFlag[] = [];

    // Sleep risk
    if ((responses['PH2'] || 3) < 3 || (responses['PH3'] || 1) > 3) {
        flags.push({
            code: "SLEEP_RISK",
            severity: (responses['PH2'] || 3) < 2 ? "high" : "medium",
            message: "Kualitas atau durasi tidur tidak optimal",
            recommendation: "Usahakan tidur 7-8 jam per malam dan ciptakan rutinitas tidur yang konsisten"
        });
    }

    // Inactivity
    if ((responses['PH1'] || 0) < 2) {
        flags.push({
            code: "INACTIVITY",
            severity: "medium",
            message: "Aktivitas fisik kurang dari rekomendasi WHO",
            recommendation: "Targetkan minimal 150 menit aktivitas sedang per minggu"
        });
    }

    // Nutrition
    if ((responses['PH4'] || 1) < 2) {
        flags.push({
            code: "NUTRITION_RISK",
            severity: "medium",
            message: "Asupan sayur dan buah kurang",
            recommendation: "Tingkatkan konsumsi sayur dan buah minimal 5 porsi per hari"
        });
    }

    // Low Vitality
    if ((responses['PH5'] || 3) < 3) {
        flags.push({
            code: "LOW_VITALITY",
            severity: "medium",
            message: "Tingkat energi dan vitalitas rendah",
            recommendation: "Evaluasi pola tidur, nutrisi, dan manajemen stres"
        });
    }

    return flags;
}

function generateRecommendations(subdomains: PhysicalResult['subdomainScores'], risks: RiskFlag[]): string[] {
    const recs = [];

    if (subdomains.physicalActivity < 60) recs.push("Mulailah dengan jalan kaki cepat 30 menit setiap hari.");
    if (subdomains.sleepHealth < 60) recs.push("Hindari penggunaan gadget 1 jam sebelum tidur untuk meningkatkan kualitas tidur.");
    if (subdomains.nutritionHydration < 60) recs.push("Bawa botol air minum kemana saja dan tambahkan porsi sayur di setiap makan.");
    if (subdomains.vitalityWellbeing < 60) recs.push("Luangkan waktu untuk relaksasi atau hobi di tengah kesibukan kuliah.");

    if (risks.length === 0) recs.push("Pertahankan gaya hidup sehat Anda dan jadilah role model bagi teman-teman!");

    return recs;
}
