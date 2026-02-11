import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DimensionConfig } from '../core/types';
import { useAnonymousSession } from '@/hooks/useAnonymousSession';

// Legacy Assessment State for backward compatibility
interface LegacyAssessmentState {
    step: 'guide' | 'consent' | 'assessment' | 'results';
    currentQuestionIndex: number;
    responses: Record<string, number>;
    isSubmitting: boolean;
    agreement: {
        read: boolean;
        consent: boolean;
    };
}

export function useAssessment(config: DimensionConfig) {
    const router = useRouter();
    const supabase = createClient();
    const { sessionToken } = useAnonymousSession();

    const [state, setState] = useState<LegacyAssessmentState>({
        step: 'guide',
        currentQuestionIndex: 0,
        responses: {},
        isSubmitting: false,
        agreement: { read: false, consent: false }
    });


    const setStep = (step: LegacyAssessmentState['step']) => setState(prev => ({ ...prev, step }));
    const setAgreement = (update: Partial<LegacyAssessmentState['agreement']>) =>
        setState(prev => ({ ...prev, agreement: { ...prev.agreement, ...update } }));


    const handleAnswer = (value: number) => {
        // Legacy support: items might be on config for backward compatibility
        const items = (config as any).items || [];
        const question = items[state.currentQuestionIndex];
        if (!question) return;
        
        setState(prev => ({
            ...prev,
            responses: { ...prev.responses, [question.id]: value }
        }));

        // Auto-advance
        if (state.currentQuestionIndex < items.length - 1) {
            setTimeout(() => {
                setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
            }, 200);
        }
    };



    const handlePrevious = () => {
        setState(prev => ({ ...prev, currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1) }));
    };

    const submitAssessment = async () => {
        setState(prev => ({ ...prev, isSubmitting: true }));
        try {
            // 1. Calculate Results (if calculateScore is provided)
            // Legacy support: calculateScore might be on config for backward compatibility
            const calculateScore = (config as any).calculateScore;
            const results = calculateScore 
                ? calculateScore(state.responses)
                : { rawScore: 0, normalizedScore: 50, level: 'medium' as const };



            // 2. Auth Check
            const { data: { user } } = await supabase.auth.getUser();

            // 3. Prepare Data
            // Note: This assumes legacy table structure.
            // If user is null, we need to handle anonymous flow based on legacy logic (localStorage or new migration?)
            // Legacy cognitive page used localStorage for anon.
            // Generic engine should probably support both.

            if (!user) {
            // Public/Anon Flow (Legacy Compatibility)
                // Store in local storage with specific keys based on dimension
                localStorage.setItem(`temp_${config.id}_responses`, JSON.stringify(state.responses));
                localStorage.setItem(`temp_${config.id}_results`, JSON.stringify(results));

                // Legacy support: routes might be on config for backward compatibility
                const routes = (config as any).routes;
                if (routes?.results) {
                    router.push(routes.results);
                }

                return;
            }

            // 4. Insert Assessment Record (only if tables config exists)
            // Legacy support: tables might be on config for backward compatibility
            const tables = (config as any).tables;
            if (!tables) {
                throw new Error('Table configuration not provided');
            }

            // We need to map 'results' to the columns of the specific table.
            // This is tricky because each table has different columns!
            // Solution: calculateScore should return the object READY for insertion.

            // 4. Insert Assessment Record
            // Legacy support: transformToPayload might be on config for backward compatibility
            const transformToPayload = (config as any).transformToPayload;
            const insertPayload = transformToPayload
                ? transformToPayload(results, user.id)
                : { user_id: user.id, ...results, assessment_version: '2.0.0' };

            const { data: assessmentData, error } = await supabase
                .from(tables.assessments)

                .insert(insertPayload)
                .select()
                .single();

            if (error) throw error;

            // 5. Insert Responses
            // Legacy tables expect 'assessment_id', 'item_id', 'response_value'
            const responseRecords = Object.entries(state.responses).map(([itemId, value]) => ({
                assessment_id: (assessmentData as any).assessment_id || (assessmentData as any).id, // Handle different ID names if any
                item_id: itemId,
                response_value: value
            }));

            await supabase.from(tables.responses).insert(responseRecords);

            // 6. Redirect
            // Legacy support: routes might be on config for backward compatibility
            const configRoutes = (config as any).routes;
            if (configRoutes?.results) {
                router.push(`${configRoutes.results}?id=${(assessmentData as any).assessment_id || (assessmentData as any).id}`);
            }



        } catch (error) {
            // Handle error state or toast
            alert("Gagal menyimpan assessment. Silakan coba lagi.");
        } finally {
            setState(prev => ({ ...prev, isSubmitting: false }));
        }
    };


    return {
        state,
        setStep,
        setAgreement,
        handleAnswer,
        handlePrevious,
        submitAssessment
    };
}
