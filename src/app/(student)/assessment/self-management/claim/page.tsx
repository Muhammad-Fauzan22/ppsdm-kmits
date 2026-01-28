"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateSelfManagementScores } from "@/lib/assessment/self-management-logic";

export default function ClaimResultPage() {
    const router = useRouter();
    const supabase = createClient();
    const [status, setStatus] = useState("Processing your assessment...");

    useEffect(() => {
        const processClaim = async () => {
            // 1. Check Auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login?next=/assessment/self-management/claim");
                return;
            }

            // 2. Get Data from LocalStorage
            const storedResponses = localStorage.getItem("temp_sm_responses");
            if (!storedResponses) {
                setStatus("No assessment found to claim. Redirecting to assessment...");
                setTimeout(() => router.push("/assessment/self-management"), 2000);
                return;
            }

            try {
                const responses = JSON.parse(storedResponses);
                const results = calculateSelfManagementScores(responses);

                // 3. Save to DB
                const { data: assessmentData, error } = await supabase
                    .from('self_management_assessments')
                    .insert({
                        user_id: user.id,
                        time_management_score: results.details.time_management,
                        procrastination_score: results.details.procrastination,
                        self_control_score: results.details.self_control,
                        goal_setting_score: results.details.goal_setting,
                        total_raw_score: results.normalized_score,
                        normalized_score: results.normalized_score,
                        productivity_level: results.productivity_level,
                        percentile_rank: results.percentile_rank
                    })
                    .select()
                    .single();

                if (error) throw error;

                // 4. Cleanup & Redirect
                localStorage.removeItem("temp_sm_responses");
                localStorage.removeItem("temp_sm_results");

                setStatus("Success! Redirecting to report...");
                router.push(`/assessment/self-management/results?id=${assessmentData.assessment_id}`);

            } catch (error) {
                console.error("Claim error:", error);
                setStatus("Failed to save results. Please try taking the assessment again.");
            }
        };

        processClaim();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-bold">{status}</h2>
            </div>
        </div>
    );
}
