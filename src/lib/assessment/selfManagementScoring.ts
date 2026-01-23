import { v4 as uuidv4 } from 'uuid';

// --- Types ---

export type SelfManagementResponse = Record<string, number>;

export interface SelfManagementScoreResult {
    total_score: number;
    dimensions: {
        planning: number;
        procrastination: number;
        focus: number;
        energy: number;
    };
    percentiles: {
        total: number;
        planning: number;
        procrastination: number;
        focus: number;
        energy: number;
    };
    category: {
        label: string;
        description: string;
        color: string;
    };
    recommendations: Recommendation[];
}

export interface Recommendation {
    type: string;
    title: string;
    description: string;
    action_items: string[];
}

// --- Constants ---

const NORMS = {
    planning: [40.3, 54.4, 66.9, 79.5, 93.1], // 5th, 25th, 50th, 75th, 95th
    procrastination: [37.1, 50.7, 63.4, 76.2, 90.8],
    focus: [41.0, 54.9, 67.5, 80.1, 94.2],
    energy: [37.5, 50.6, 63.2, 75.8, 89.7],
    total: [39.1, 53.2, 65.7, 78.3, 92.4]
};

const ITEM_MAP = {
    planning: ['SM_P1', 'SM_P2', 'SM_P3', 'SM_P4', 'SM_P5', 'SM_P6'],
    procrastination: ['SM_PR1', 'SM_PR2', 'SM_PR3', 'SM_PR4', 'SM_PR5'],
    focus: ['SM_F1', 'SM_F2', 'SM_F3', 'SM_F4', 'SM_F5'],
    energy: ['SM_E1', 'SM_E2', 'SM_E3', 'SM_E4']
};

// --- Helpers ---

function calculateDimensionScore(responses: SelfManagementResponse, itemIds: string[], isReverse: boolean = false): number {
    if (!itemIds || itemIds.length === 0) return 0;

    let sum = 0;
    itemIds.forEach(id => {
        let val = responses[id] || 3; // Default to neutral if missing
        if (isReverse) {
            val = 6 - val; // 1->5, 5->1
        }
        sum += val;
    });

    const avg = sum / itemIds.length;
    // Scale 1-5 to 0-100: (val - 1) * 25
    return (avg - 1) * 25;
}

function getPercentile(score: number, thresholds: number[]): number {
    // thresholds: [5th, 25th, 50th, 75th, 95th]
    if (score >= thresholds[4]) return 95;
    if (score >= thresholds[3]) return 75;
    if (score >= thresholds[2]) return 50;
    if (score >= thresholds[1]) return 25;
    if (score >= thresholds[0]) return 5;
    return 1; // Bottom 5%
}

function categorize(score: number) {
    if (score >= 85) return {
        label: 'EXCELLENT',
        description: 'Exceptional self-management; rare procrastination.',
        color: '#10B981' // Emerald
    };
    if (score >= 70) return {
        label: 'ADVANCED',
        description: 'Above-average skills; generally organized.',
        color: '#3B82F6' // Blue
    };
    if (score >= 55) return {
        label: 'COMPETENT',
        description: 'Adequate for academic success.',
        color: '#F59E0B' // Amber
    };
    if (score >= 40) return {
        label: 'DEVELOPING',
        description: 'Frequently disorganized; often procrastinates.',
        color: '#F97316' // Orange
    };
    return {
        label: 'BEGINNING',
        description: 'Significant improvement needed.',
        color: '#EF4444' // Red
    };
}

function generateRecommendations(scores: SelfManagementScoreResult['dimensions']): Recommendation[] {
    const recs: Recommendation[] = [];

    // Procrastination Logic
    if (scores.procrastination < 60) {
        recs.push({
            type: 'urgent',
            title: 'Beat Procrastination',
            description: 'Penundaann adalah hambatan terbesar Anda saat ini.',
            action_items: [
                'Gunakan teknik "5-Minute Rule": Paksa diri hanya untuk 5 menit pertama.',
                'Pecah tugas besar menjadi sub-tugas mikro yang tidak mengintimidasi.'
            ]
        });
    }

    // Focus Logic
    if (scores.focus < 65) {
        recs.push({
            type: 'skill',
            title: 'Deep Work Mastery',
            description: 'Anda kesulitan mempertahankan fokus panjang.',
            action_items: [
                'Coba teknik Pomodoro (25 menit kerja, 5 menit istirahat).',
                'Matikan notifikasi HP saat "Deep Work" sessions.'
            ]
        });
    }

    // Energy Logic
    if (scores.energy < 60) {
        recs.push({
            type: 'habit',
            title: 'Energy Management',
            description: 'Anda mungkin bekerja melawan ritme alami tubuh Anda.',
            action_items: [
                'Identifikasi "Golden Hours" Anda (waktu paling produktif).',
                'Jadwalkan tugas tersulit di Golden Hours tersebut.'
            ]
        });
    }

    return recs;
}

// --- Main ---

export function calculateSelfManagementScores(responses: SelfManagementResponse): SelfManagementScoreResult {
    // 1. Calculate Raw Dimension Scores (0-100 scale)
    const planning = calculateDimensionScore(responses, ITEM_MAP.planning, false);
    const procrastination = calculateDimensionScore(responses, ITEM_MAP.procrastination, true); // Reverse!
    const focus = calculateDimensionScore(responses, ITEM_MAP.focus, false);
    const energy = calculateDimensionScore(responses, ITEM_MAP.energy, false);

    // 2. Total Average
    const total_score = (planning + procrastination + focus + energy) / 4;

    // 3. Percentiles
    const percentiles = {
        total: getPercentile(total_score, NORMS.total),
        planning: getPercentile(planning, NORMS.planning),
        procrastination: getPercentile(procrastination, NORMS.procrastination),
        focus: getPercentile(focus, NORMS.focus),
        energy: getPercentile(energy, NORMS.energy)
    };

    return {
        total_score: Number(total_score.toFixed(1)),
        dimensions: {
            planning: Number(planning.toFixed(1)),
            procrastination: Number(procrastination.toFixed(1)),
            focus: Number(focus.toFixed(1)),
            energy: Number(energy.toFixed(1))
        },
        percentiles,
        category: categorize(total_score),
        recommendations: generateRecommendations({ planning, procrastination, focus, energy })
    };
}
