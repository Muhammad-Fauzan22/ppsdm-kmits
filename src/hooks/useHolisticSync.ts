import { useEffect } from 'react';
import { useHolisticStore } from '@/lib/stores/useHolisticStore';
import { useKnowledgeStore } from '@/lib/stores/useKnowledgeStore';
import { useHealthStore } from '@/lib/stores/useHealthStore';
import { useMentalStore } from '@/lib/stores/useMentalStore';
import { useSocialStore } from '@/lib/stores/useSocialStore';
import { useSpiritualStore } from '@/lib/stores/useSpiritualStore';
import { useCharacterStore } from '@/lib/stores/useCharacterStore';
import { useFinancialStore } from '@/lib/stores/useFinancialStore';
import { useLifestyleStore } from '@/lib/stores/useLifestyleStore';

export function useHolisticSync() {
    const updateScore = useHolisticStore((state) => state.updateScore);

    // Subscribe to all relevant stores
    // Note: We use simple selection here. For optimization, we might want to select specific fields,
    // but since we pass the whole object structure to updateScore, we retrieve the root or sub-objects.

    // We get the state directly in the effect to avoid unnecessary re-renders of this hook 
    // simply because the store changed, unless we want real-time reactivity.
    // However, we want the holistic score to update when these change.

    const knowledgeStats = useKnowledgeStore((s) => s.stats);
    const healthMetrics = useHealthStore((s) => s.metrics);
    const mentalCheckins = useMentalStore((s) => s.checkins);
    const socialState = useSocialStore((s) => ({ speakingLogs: s.speakingLogs, projects: s.projects }));
    const spiritualState = useSpiritualStore((s) => ({ reflections: s.reflections, volunteerLogs: s.volunteerLogs }));
    const characterStrengths = useCharacterStore((s) => s.strengths);
    const financialTransactions = useFinancialStore((s) => s.transactions);
    const lifestyleState = useLifestyleStore((s) => ({ carbonFootprint: s.carbonFootprint, sustainabilityLogs: s.sustainabilityLogs }));

    useEffect(() => {
        updateScore({
            knowledgeStats: knowledgeStats,
            healthMetrics: healthMetrics,
            mentalCheckins: mentalCheckins,
            socialStats: socialState,
            spiritualStats: spiritualState,
            characterStrengths: characterStrengths,
            financialTransactions: financialTransactions,
            lifestyleStats: lifestyleState
        });
    }, [
        updateScore,
        knowledgeStats,
        healthMetrics,
        mentalCheckins,
        socialState,
        spiritualState,
        characterStrengths,
        financialTransactions,
        lifestyleState
    ]);
}
