import { create } from 'zustand';

export interface RadarPoint {
    subject: string;
    value: number; // Score 0-100 (Renamed from A for consistency)
    fullMark: number;
}

// ... (HolisticInputs interface remains same)
export interface HolisticInputs {
    knowledgeStats: { booksRead: number; coursesCompleted: number; } | null;
    healthMetrics: { steps: number; sleep: number; water: number; } | null;
    mentalCheckins: any[];
    socialStats: { speakingLogs: any[]; projects: any[] };
    spiritualStats: { reflections: any[]; volunteerLogs: any[] };
    characterStrengths: any[];
    financialTransactions: any[];
    lifestyleStats: { carbonFootprint: { totalFootprint: number }; sustainabilityLogs: any[] };
}

export interface HolisticState {
    radarData: RadarPoint[];
    loading: boolean;
    updateScore: (inputs: HolisticInputs) => void;
}

const calculateScore = (val: number, max: number) => Math.min(100, Math.round((val / max) * 100));

export const useHolisticStore = create<HolisticState>((set) => ({
    radarData: [],
    loading: false,
    updateScore: (inputs) => {
        set({ loading: true });

        const {
            knowledgeStats,
            healthMetrics,
            mentalCheckins,
            socialStats,
            spiritualStats,
            characterStrengths,
            financialTransactions,
            lifestyleStats
        } = inputs;

        // 1. Intellectual (Knowledge)
        const knowledge = knowledgeStats || { booksRead: 0, coursesCompleted: 0 };
        const intellectualScore = calculateScore((knowledge.booksRead * 10) + (knowledge.coursesCompleted * 20), 100);

        // 2. Physical (Health)
        const health = healthMetrics || { steps: 0, sleep: 0, water: 0 };
        // Rough estimate: 10k steps = 50pts, 8h sleep = 30pts, 2L water = 20pts
        let physicalScore = 0;
        physicalScore += Math.min(50, (health.steps / 10000) * 50);
        physicalScore += Math.min(30, (health.sleep / 8) * 30);
        physicalScore += Math.min(20, (health.water / 2000) * 20);

        // 3. Mental
        const mentalScore = mentalCheckins.length > 0 ?
            mentalCheckins.slice(0, 5).reduce((acc: number, curr: any) => acc + (['Great', 'Good'].includes(curr.mood) ? 20 : 10), 0) / Math.min(5, mentalCheckins.length) * 5
            : 50; // Default

        // 4. Social
        const socialScore = Math.min(100, (socialStats.speakingLogs.length * 10) + (socialStats.projects.length * 20) + 40);

        // 5. Spiritual
        const spiritualScore = Math.min(100, (spiritualStats.reflections.length * 10) + (spiritualStats.volunteerLogs.reduce((a: number, b: any) => a + b.hours, 0) * 2));

        // 6. Character
        const characterScore = characterStrengths.length > 0
            ? characterStrengths.reduce((acc: number, curr: any) => acc + curr.score, 0) / characterStrengths.length
            : 50; // Default if empty

        // 7. Financial
        const financialScore = Math.min(100, (financialTransactions.length * 5) + 50); // Dummy logic

        // 8. Professional (Mock/Derived)
        const professionalScore = Math.min(100, intellectualScore * 0.5 + socialScore * 0.5);

        // 9. Lifestyle
        const lifestyleScore = Math.min(100, 100 - (lifestyleStats.carbonFootprint.totalFootprint / 10) + (lifestyleStats.sustainabilityLogs.length * 5));

        set({
            loading: false,
            radarData: [
                { subject: 'Intellectual', value: intellectualScore, fullMark: 100 },
                { subject: 'Physical', value: Math.round(physicalScore), fullMark: 100 },
                { subject: 'Mental', value: Math.round(mentalScore), fullMark: 100 },
                { subject: 'Social', value: Math.round(socialScore), fullMark: 100 },
                { subject: 'Spiritual', value: Math.round(spiritualScore), fullMark: 100 },
                { subject: 'Character', value: Math.round(characterScore), fullMark: 100 },
                { subject: 'Financial', value: Math.round(financialScore), fullMark: 100 },
                { subject: 'Professional', value: Math.round(professionalScore), fullMark: 100 },
                { subject: 'Lifestyle', value: Math.round(lifestyleScore), fullMark: 100 },
            ]
        });
    }
}));
