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

                // 3. Save to DB with new 4-factor structure
                const { data: assessmentData, error } = await supabase
                    .from('self_management_assessments')
                    .insert({
                        user_id: user.id,
                        planning_score: results.details.planning.scaled,
                        procrastination_score: results.details.procrastination.scaled,
                        focus_score: results.details.focus.scaled,
                        energy_score: results.details.energy.scaled,
                        productivity_index: results.productivity_index,
                        overall_percentile: results.overall_percentile,
                        development_level: results.development_level,
                        profile_pattern: results.profilePattern.type,
                        profile_title: results.profilePattern.title
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
