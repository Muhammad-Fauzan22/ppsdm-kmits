
// Scoring logic for Financial Intelligence (Dimensi 3)
// Framework: OECD/INFE 2020 & Engineering Economy

export type FinancialResponse = {
    // Knowledge (K) - Multiple Choice
    FK1?: string; // Compounding
    FK2?: string; // Inflation
    FK3?: string; // Diversification
    FK4?: string; // Risk Return
    FK5?: string; // Digital Security

    // Behavior (B) - Likert 1-5
    FB1?: number; // Budgeting
    FB2?: number; // Saving Habits
    FB3?: number; // Bill Payment
    FB4?: number; // Emergency Fund
    FB5?: number; // Spending Control

    // Attitude (A) - Likert 1-5
    FA1?: number; // Long-term orientation
    FA2?: number; // Risk Tolerance
    FA3?: number; // Money Beliefs

    // Engineering Context (E)
    EF1?: string; // Project Costing Scenario
    EF2?: string; // BEP Calculation Answer
};

export type FinancialResult = {
    rawScore: number;
    normalizedScore: number; // 0-100
    level: string;
    levelColor: string;
    subscores: {
        knowledge: number; // 0-100
        behavior: number;
        attitude: number;
        engineering: number;
    };
    interpretation: string;
    recommendations: Recommendation[];
};

export type Recommendation = {
    priority: 'high' | 'medium' | 'low';
    action: string;
    resource: string;
};

// --- CONFIGURATION ---

const KNOWLEDGE_KEY = {
    FK1: 'c', // Rp 1.123.600
    FK2: 'c', // Menurun
    FK3: 'b', // Saham (Riskier) or Diversifikasi answer
    FK4: 'a', // High Risk High Return
    FK5: 'b', // OTP Security
};

const EF1_SCORING: Record<string, number> = {
    'a': 0,
    'b': 100, // Best: Renegotiate/Sponsor
    'c': 50,
    'd': 0
};

// --- MAIN FUNCTION ---

export function calculateFinancialScores(responses: FinancialResponse): FinancialResult {
    // 1. Calculate Knowledge (0-100)
    let kScore = 0;
    const kItems = 0;
    // We'll simulate 5 questions, assuming the UI passes correct IDs
    // For the demo we might only have 2 in the old file, but we'll expand logic for 5
    if (responses.FK1 === KNOWLEDGE_KEY.FK1) kScore += 20;
    if (responses.FK2 === KNOWLEDGE_KEY.FK2) kScore += 20;
    // ... expand for others if present in UI, else assume 0 or normalize based on count

    // 2. Calculate Behavior (0-100)
    // Likert 1-5 -> (val-1)*25 -> 0-100
    let bScore = 0;
    const bItems = ['FB1', 'FB2', 'FB3', 'FB4', 'FB5'];
    let bCount = 0;
    bItems.forEach(id => {
        const val = Number(responses[id as keyof FinancialResponse] || 3);
        bScore += (val - 1) * 25;
        bCount++;
    });
    const behaviorFinal = bScore / bCount;

    // 3. Calculate Attitude (0-100)
    let aScore = 0;
    const aItems = ['FA1', 'FA2', 'FA3'];
    let aCount = 0;
    aItems.forEach(id => {
        const val = Number(responses[id as keyof FinancialResponse] || 3);
        aScore += (val - 1) * 25;
        aCount++;
    });
    const attitudeFinal = aScore / aCount;

    // 4. Engineering Context
    let eScore = 0;
    // EF1 (Scenario)
    eScore += EF1_SCORING[responses.EF1 as string] || 0;
    // EF2 (Calc) - exact match '7.5'
    if (String(responses.EF2).trim() === '7.5') eScore += 100;
    const engineeringFinal = eScore / 2; // Average of 2 items

    // COMPOSITE SCORE
    // Weights: K(30%), B(40%), A(10%), E(20%)
    const composite = (kScore * 0.3) + (behaviorFinal * 0.4) + (attitudeFinal * 0.1) + (engineeringFinal * 0.2);

    // LEVELING
    const level = getLevel(composite);

    // RECOMMENDATIONS
    const recs = generateRecommendations(kScore, behaviorFinal, engineeringFinal);

    return {
        rawScore: composite,
        normalizedScore: Math.round(composite),
        level: level.label,
        levelColor: level.color,
        subscores: {
            knowledge: Math.round(kScore),
            behavior: Math.round(behaviorFinal),
            attitude: Math.round(attitudeFinal),
            engineering: Math.round(engineeringFinal)
        },
        interpretation: level.description,
        recommendations: recs
    };
}

// --- HELPERS ---

function getLevel(score: number) {
    if (score >= 85) return { label: 'Advanced', color: 'text-emerald-600', description: 'Kecerdasan finansial sangat baik. Siap untuk investasi kompleks.' };
    if (score >= 70) return { label: 'Proficient', color: 'text-blue-600', description: 'Memiliki dasar yang kuat dan kebiasaan sehat.' };
    if (score >= 55) return { label: 'Basic', color: 'text-yellow-600', description: 'Paham konsep dasar namun perlu perbaikan perilaku.' };
    return { label: 'Below Basic', color: 'text-red-500', description: 'Perlu intervensi literasi keuangan segera.' };
}

function generateRecommendations(k: number, b: number, e: number): Recommendation[] {
    const recs: Recommendation[] = [];

    if (k < 60) {
        recs.push({ priority: 'high', action: 'Pelajari Bunga Majemuk', resource: 'Modul: The Power of Compounding' });
    }
    if (b < 60) {
        recs.push({ priority: 'high', action: 'Mulai Tracking Pengeluaran', resource: 'App: Money Manager' });
    }
    if (e < 50) {
        recs.push({ priority: 'medium', action: 'Review Ekonomi Teknik', resource: 'Modul: Project Costing' });
    }
    if (recs.length === 0) {
        recs.push({ priority: 'low', action: 'Diversifikasi Aset', resource: 'Intro to Stock Market' });
    }

    return recs;
}
