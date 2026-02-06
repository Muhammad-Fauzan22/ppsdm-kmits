"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculatePhysicalScores } from "@/lib/assessment/physical-logic";

export default function ClaimPhysicalResultPage() {
    const router = useRouter();
    const supabase = createClient();
    const [status, setStatus] = useState("Processing your assessment...");

    useEffect(() => {
        const processClaim = async () => {
            // 1. Check Auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login?next=/assessment/physical/claim");
                return;
            }

            // 2. Get Data
            const storedResponses = localStorage.getItem("temp_physical_responses");
            if (!storedResponses) {
                setStatus("No assessment found to claim. Redirecting...");
                setTimeout(() => router.push("/assessment/physical"), 2000);
                return;
            }

            try {
                const responses = JSON.parse(storedResponses);
                const results = calculatePhysicalScores(responses);

                // 3. Save to DB
                const { data, error } = await supabase
                    .from('physical_health_assessments')
                    .insert({
                        user_id: user.id,
                        composite_score: results.composite_score,
                        overall_percentile: results.overall_percentile,
                        health_category: results.health_category,
                        physical_activity_score: results.details.physical_activity.scaled,
                        sleep_quality_score: results.details.sleep_quality.scaled,
                        nutrition_score: results.details.nutrition.scaled,
                        vitality_score: results.details.vitality.scaled,
                        preventive_health_score: results.details.preventive_health.scaled,
                        risk_factors: results.risk_factors,
                        recommendations: results.recommendations,
                        details: results.details
                    })
                    .select()
                    .single();

                if (error) throw error;

                // 4. Save Responses
                const responseRows = Object.entries(responses).map(([qid, val]) => ({
                    assessment_id: data.assessment_id,
                    question_id: qid,
                    response_value: Number(val)
                }));
                await supabase.from('physical_health_responses').insert(responseRows);

                // 5. Cleanup
                localStorage.removeItem("temp_physical_responses");
                localStorage.removeItem("temp_physical_results");

                router.push(`/assessment/physical/results?id=${data.assessment_id}`);

            } catch (error) {
                console.error("Claim error:", error);
                setStatus("Failed to save results.");
            }
        };

        processClaim();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-bold">{status}</h2>
            </div>
        </div>
    );
}
