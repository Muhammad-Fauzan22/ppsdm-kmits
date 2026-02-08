import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DimensionConfig, AssessmentState } from '../core/types';
import { useAnonymousSession } from '@/hooks/useAnonymousSession';

export function useAssessment(config: DimensionConfig) {
    const router = useRouter();
    const supabase = createClient();
    const { sessionToken } = useAnonymousSession();

    const [state, setState] = useState<AssessmentState>({
        step: 'guide',
        currentQuestionIndex: 0,
        responses: {},
        isSubmitting: false,
        agreement: { read: false, consent: false }
    });

    const setStep = (step: AssessmentState['step']) => setState(prev => ({ ...prev, step }));
    const setAgreement = (update: Partial<AssessmentState['agreement']>) =>
        setState(prev => ({ ...prev, agreement: { ...prev.agreement, ...update } }));

    const handleAnswer = (value: number) => {
        const question = config.items[state.currentQuestionIndex];
        setState(prev => ({
            ...prev,
            responses: { ...prev.responses, [question.id]: value }
        }));

        // Auto-advance
        if (state.currentQuestionIndex < config.items.length - 1) {
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
            // 1. Calculate Results
            const results = config.calculateScore(state.responses);

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

                // If we have sessionToken, we COULD try to save to DB if tables supported it.
                // But strictly following legacy behavior means localStorage + redirect.
                router.push(config.routes.results);
                return;
            }

            // 4. Insert Assessment Record
            // We need to map 'results' to the columns of the specific table.
            // This is tricky because each table has different columns!
            // Solution: calculateScore should return the object READY for insertion.

            // 4. Insert Assessment Record
            const insertPayload = config.transformToPayload
                ? config.transformToPayload(results, user.id)
                : { user_id: user.id, ...results, assessment_version: '2.0.0' };

            const { data: assessmentData, error } = await supabase
                .from(config.tables.assessments)
                .insert(insertPayload)
                .select()
                .single();

            if (error) throw error;

            // 5. Insert Responses
            // Legacy tables expect 'assessment_id', 'item_id', 'response_value'
            const responseRecords = Object.entries(state.responses).map(([itemId, value]) => ({
                assessment_id: assessmentData.assessment_id || assessmentData.id, // Handle different ID names if any
                item_id: itemId,
                response_value: value
            }));

            await supabase.from(config.tables.responses).insert(responseRecords);

            // 6. Redirect
            router.push(`${config.routes.results}?id=${assessmentData.assessment_id || assessmentData.id}`);

        } catch (error) {
            console.error("Assessment submission failed:", error);
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
