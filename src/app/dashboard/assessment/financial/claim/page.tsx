"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateFinancialScores, FINANCIAL_ITEMS } from "@/lib/assessment/financial-intelligence-logic";

export default function ClaimFinancialResultPage() {
    const router = useRouter();
    const supabase = createClient();
    const [status, setStatus] = useState("Processing your financial assessment...");

    useEffect(() => {
        const processClaim = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login?next=/assessment/financial/claim");
                return;
            }

            const storedResponses = localStorage.getItem("temp_financial_responses");
            if (!storedResponses) {
                router.push("/assessment/financial");
                return;
            }

            try {
                const responses = JSON.parse(storedResponses);
                const results = calculateFinancialScores(responses);

                // Save Assessment
                const { data: assessment, error } = await supabase
                    .from('financial_assessments')
                    .insert({
                        user_id: user.id,
                        composite_score: results.composite_score,
                        composite_percentile: results.composite_percentile,
                        intelligence_level: results.intelligence_level,
                        knowledge_score: results.details.knowledge.score,
                        knowledge_percentile: results.details.knowledge.percentile,
                        knowledge_theta: results.details.knowledge.theta,
                        behavior_score: results.details.behavior.score,
                        behavior_percentile: results.details.behavior.percentile,
                        attitude_score: results.details.attitude.score,
                        attitude_percentile: results.details.attitude.percentile,
                        subdomain_scores: results.subdomain_scores,
                        recommendations: results.recommendations,
                        properties: results.properties
                    })
                    .select()
                    .single();

                if (error) throw error;
                const assessmentId = assessment.assessment_id;

                // Save Detailed Responses
                const knowledgeItems = FINANCIAL_ITEMS.filter(i => i.type === 'knowledge');
                const knowledgeRows = knowledgeItems.map(item => ({
                    assessment_id: assessmentId,
                    question_id: item.id,
                    response_value: responses[item.id],
                    is_correct: item.options?.find(o => o.correct)?.id === responses[item.id]
                }));
                await supabase.from('financial_knowledge_responses').insert(knowledgeRows);

                const behaviorRows = FINANCIAL_ITEMS.filter(i => i.type === 'behavior').map(item => ({
                    assessment_id: assessmentId,
                    question_id: item.id,
                    response_value: Number(responses[item.id])
                }));
                await supabase.from('financial_behavior_responses').insert(behaviorRows);

                const attitudeRows = FINANCIAL_ITEMS.filter(i => i.type === 'attitude').map(item => ({
                    assessment_id: assessmentId,
                    question_id: item.id,
                    response_value: Number(responses[item.id])
                }));
                await supabase.from('financial_attitude_responses').insert(attitudeRows);

                localStorage.removeItem("temp_financial_responses");
                router.push(`/assessment/financial/results?id=${assessmentId}`);

            } catch (error) {
                setStatus("Failed to save results. Please try again.");
            }
        };

        processClaim();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{status}</h2>
            </div>
        </div>
    );
}
