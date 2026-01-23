import { create } from 'zustand';
import { useKnowledgeStore } from './useKnowledgeStore';
import { useHealthStore } from './useHealthStore';
import { useMentalStore } from './useMentalStore';
import { useSocialStore } from './useSocialStore';
import { useSpiritualStore } from './useSpiritualStore';
import { useCharacterStore } from './useCharacterStore';
import { useFinancialStore } from './useFinancialStore';
import { useLifestyleStore } from './useLifestyleStore';

export interface RadarPoint {
    subject: string;
    A: number; // Score 0-100
    fullMark: number;
}

export interface HolisticState {
    radarData: RadarPoint[];
    loading: boolean;
    refreshData: () => void;
}

const calculateScore = (val: number, max: number) => Math.min(100, Math.round((val / max) * 100));

export const useHolisticStore = create<HolisticState>((set) => ({
    radarData: [],
    loading: false,
    refreshData: () => {
        set({ loading: true });

        // 1. Intellectual (Knowledge)
        const knowledge = useKnowledgeStore.getState().stats || { booksRead: 0, coursesCompleted: 0 };
        const intellectualScore = calculateScore((knowledge.booksRead * 10) + (knowledge.coursesCompleted * 20), 100);

        // 2. Physical (Health)
        const health = useHealthStore.getState().metrics || { steps: 0, sleep: 0, water: 0 };
        // Rough estimate: 10k steps = 50pts, 8h sleep = 30pts, 2L water = 20pts
        let physicalScore = 0;
        physicalScore += Math.min(50, (health.steps / 10000) * 50);
        physicalScore += Math.min(30, (health.sleep / 8) * 30);
        physicalScore += Math.min(20, (health.water / 2000) * 20);

        // 3. Mental
        const mental = useMentalStore.getState();
        const mentalScore = mental.checkins.length > 0 ?
            mental.checkins.slice(0, 5).reduce((acc, curr) => acc + (['Great', 'Good'].includes(curr.mood) ? 20 : 10), 0) / Math.min(5, mental.checkins.length) * 5
            : 50; // Default

        // 4. Social
        const social = useSocialStore.getState();
        const socialScore = Math.min(100, (social.speakingLogs.length * 10) + (social.projects.length * 20) + 40);

        // 5. Spiritual
        const spiritual = useSpiritualStore.getState();
        const spiritualScore = Math.min(100, (spiritual.reflections.length * 10) + (spiritual.volunteerLogs.reduce((a, b) => a + b.hours, 0) * 2));

        // 6. Character
        const character = useCharacterStore.getState();
        const characterScore = character.strengths.reduce((acc, curr) => acc + curr.score, 0) / character.strengths.length;

        // 7. Financial
        const financial = useFinancialStore.getState();
        const financialScore = Math.min(100, (financial.transactions.length * 5) + 50); // Dummy logic

        // 8. Professional (Mock/Derived)
        const professionalScore = Math.min(100, intellectualScore * 0.5 + socialScore * 0.5);

        // 9. Lifestyle
        const lifestyle = useLifestyleStore.getState();
        const lifestyleScore = Math.min(100, 100 - (lifestyle.carbonFootprint.totalFootprint / 10) + (lifestyle.sustainabilityLogs.length * 5));

        set({
            loading: false,
            radarData: [
                { subject: 'Intellectual', A: intellectualScore, fullMark: 100 },
                { subject: 'Physical', A: Math.round(physicalScore), fullMark: 100 },
                { subject: 'Mental', A: Math.round(mentalScore), fullMark: 100 },
                { subject: 'Social', A: Math.round(socialScore), fullMark: 100 },
                { subject: 'Spiritual', A: Math.round(spiritualScore), fullMark: 100 },
                { subject: 'Character', A: Math.round(characterScore), fullMark: 100 },
                { subject: 'Financial', A: Math.round(financialScore), fullMark: 100 },
                { subject: 'Professional', A: Math.round(professionalScore), fullMark: 100 },
                { subject: 'Lifestyle', A: Math.round(lifestyleScore), fullMark: 100 },
            ]
        });
    }
}));
