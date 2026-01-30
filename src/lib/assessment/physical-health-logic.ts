
import { PHYSICAL_HEALTH_ITEMS } from "./physical-health-items";

export interface SubdomainScores {
    physical_activity: number;
    sleep_health: number;
    nutrition_hydration: number;
    vitality_wellbeing: number;
}

export interface RiskFlag {
    code: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    recommendation: string;
}

export interface HealthResult {
    total_score: number;
    subdomain_scores: SubdomainScores;
    percentile: number;
    percentile_label: string;
    health_category: {
        category: string;
        color: string;
        description: string;
    };
    risk_flags: RiskFlag[];
}

export function calculatePhysicalHealthScore(responses: Record<string, number>): HealthResult {
    // 1. Define Weights
    const item_weights: Record<string, number> = {
        'PH1': 0.15,
        'PH2': 0.14,
        'PH3': 0.13,
        'PH4': 0.12,
        'PH5': 0.13,
        'PH6': 0.11,
        'PH7': 0.12,
        'PH8': 0.10
    };

    // 2. Score Mapping Logic
    // We get the score_val from the ITEMS definition based on the selected value
    const getScoreVal = (id: string, val: number) => {
        const item = PHYSICAL_HEALTH_ITEMS.find(i => i.id === id);
        const opt = item?.options.find(o => o.value === val);
        return opt?.score_val ?? 0;
    };

    let total_score = 0;
    const subdomain_scores: SubdomainScores = {
        physical_activity: 0,
        sleep_health: 0,
        nutrition_hydration: 0,
        vitality_wellbeing: 0
    };

    // 3. Calculate Weighted Total & Subdomains
    for (const [id, val] of Object.entries(responses)) {
        const score = getScoreVal(id, val);
        const weight = item_weights[id] || 0;

        total_score += score * weight;

        // Subdomain Aggregation
        if (id === 'PH1') subdomain_scores.physical_activity += score; // Single item
        else if (['PH2', 'PH3'].includes(id)) subdomain_scores.sleep_health += score;
        else if (['PH4', 'PH6'].includes(id)) subdomain_scores.nutrition_hydration += score;
        else if (['PH5', 'PH7', 'PH8'].includes(id)) subdomain_scores.vitality_wellbeing += score;
    }

    // Normalize Subdomains (Average)
    // PH1 is single item, so it's already 0-100
    subdomain_scores.sleep_health /= 2;
    subdomain_scores.nutrition_hydration /= 2;
    subdomain_scores.vitality_wellbeing /= 3;

    // Rounding
    total_score = Math.round(total_score * 10) / 10;
    for (const key in subdomain_scores) {
        subdomain_scores[key as keyof SubdomainScores] = Math.round(subdomain_scores[key as keyof SubdomainScores] * 10) / 10;
    }

    // 4. Response Pattern Correction (Simplified from Python)
    // If all responses are max (check if standard 4 or 5 depending on item, simplified here to score 100)
    const allMax = Object.keys(responses).every(id => getScoreVal(id, responses[id]) === 100);
    if (allMax) total_score *= 0.95;

    const allMin = Object.keys(responses).every(id => getScoreVal(id, responses[id]) === 0);
    if (allMin) total_score = Math.min(100, total_score * 1.05);

    total_score = Math.round(total_score * 10) / 10;

    return {
        total_score,
        subdomain_scores,
        ...calculatePercentile(total_score),
        health_category: categorizeHealth(total_score),
        risk_flags: identifyRiskFlags(responses)
    };
}

function calculatePercentile(score: number) {
    // Percentiles from research report
    // 90th: 82.5, 75th: 73.2, 50th: 61.8, 25th: 49.3, 10th: 38.7
    let val = 0;
    let label = "";

    if (score >= 82.5) {
        val = ((score - 82.5) / (100 - 82.5)) * 10 + 90;
        label = "Excellent";
    } else if (score >= 73.2) {
        val = ((score - 73.2) / (82.5 - 73.2)) * 15 + 75;
        label = "Good";
    } else if (score >= 61.8) {
        val = ((score - 61.8) / (73.2 - 61.8)) * 25 + 50;
        label = "Average";
    } else if (score >= 49.3) {
        val = ((score - 49.3) / (61.8 - 49.3)) * 25 + 25;
        label = "Below Average";
    } else {
        val = (score / 49.3) * 25;
        label = "Needs Improvement";
    }

    return { percentile: Math.round(val * 10) / 10, percentile_label: label };
}

function categorizeHealth(score: number) {
    if (score >= 85) return { category: "Excellent", color: "#10B981", description: "Kesehatan fisik dan vitalitas sangat baik. Pertahankan pola hidup sehat!" };
    if (score >= 70) return { category: "Good", color: "#3B82F6", description: "Kesehatan fisik baik. Beberapa area dapat ditingkatkan." };
    if (score >= 55) return { category: "Moderate", color: "#F59E0B", description: "Kesehatan fisik cukup. Perlu perbaikan di beberapa aspek." };
    if (score >= 40) return { category: "Needs Improvement", color: "#EF4444", description: "Kesehatan fisik perlu perhatian. Disarankan perubahan pola hidup." };
    return { category: "At Risk", color: "#DC2626", description: "Kesehatan fisik berisiko. Sangat disarankan berkonsultasi dengan tenaga kesehatan." };
}

function identifyRiskFlags(responses: Record<string, number>): RiskFlag[] {
    const flags: RiskFlag[] = [];
    const r = (id: string) => responses[id]; // Shortcut

    // Sleep Risk (PH2 < 3 usually means < 6 hours, PH3 > 3 means often not fresh)
    // Checking item values: PH2 (1=<5, 2=5-6, 3=6-7). Risk if < 3.
    if ((r('PH2') || 3) < 3 || (r('PH3') || 1) > 3) {
        flags.push({
            code: "SLEEP_RISK",
            severity: (r('PH2') || 3) < 2 ? "high" : "medium",
            message: "Kualitas atau durasi tidur tidak optimal",
            recommendation: "Usahakan tidur 7-8 jam per malam dan ciptakan rutinitas tidur yang konsisten"
        });
    }

    // Inactivity (PH1 < 2 means 1-2 days or 0 days)
    if ((r('PH1') || 0) < 2) {
        flags.push({
            code: "INACTIVITY",
            severity: "medium",
            message: "Aktivitas fisik kurang dari rekomendasi WHO",
            recommendation: "Targetkan minimal 150 menit aktivitas sedang per minggu"
        });
    }

    // Poor Nutrition (PH4 < 2, means 0 or sometimes)
    if ((r('PH4') || 1) < 2) {
        flags.push({
            code: "NUTRITION_RISK",
            severity: "medium",
            message: "Asupan sayur dan buah kurang",
            recommendation: "Tingkatkan konsumsi sayur dan buah minimal 5 porsi per hari"
        });
    }

    // Vitality Check (PH5 < 3)
    if ((r('PH5') || 3) < 3) {
        flags.push({
            code: "LOW_VITALITY",
            severity: "medium",
            message: "Tingkat energi dan vitalitas rendah",
            recommendation: "Evaluasi pola tidur, nutrisi, dan manajemen stres"
        });
    }

    // Symptoms (PH7 > 2 means Often or Very Often)
    if ((r('PH7') || 1) > 2) {
        flags.push({
            code: "FREQUENT_SYMPTOMS",
            severity: "high",
            message: "Gejala kesehatan yang sering muncul",
            recommendation: "Pertimbangkan konsultasi dengan dokter atau klinik kampus"
        });
    }

    return flags;
}
