"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateFinancialScore } from "@/lib/assessment/financial-logic";

export default function ClaimFinancialResultPage() {
    const router = useRouter();
    const supabase = createClient();
    const [status, setStatus] = useState("Processing your financial assessment...");

    useEffect(() => {
        const processClaim = async () => {
            // 1. Check Auth
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login?next=/assessment/financial/claim");
                return;
            }

            // 2. Get Data from LocalStorage
            const storedResponses = localStorage.getItem("temp_fin_responses");
            if (!storedResponses) {
                setStatus("No assessment found to claim. Redirecting...");
                setTimeout(() => router.push("/assessment/financial"), 2000);
                return;
            }

            try {
                const responses = JSON.parse(storedResponses);
                const results = calculateFinancialScore(responses);

                // 3. Save to DB
                const { data, error } = await supabase
                    .from('financial_assessments')
                    .insert({
                        user_id: user.id,
                        knowledge_score: results.knowledge_score,
                        behavior_score: results.behavior_score,
                        attitude_score: results.attitude_score,
                        composite_score: results.composite_score,
                        percentile_rank: results.percentile_rank,
                        financial_level: results.level
                    })
                    .select().single();

                if (error) throw error;

                // 4. Cleanup & Redirect
                localStorage.removeItem("temp_fin_responses");
                setStatus("Success! Redirecting to report...");
                router.push(`/assessment/financial/results?id=${data.assessment_id}`);

            } catch (error) {
                console.error("Claim error:", error);
                setStatus("Failed to save results. Please try again.");
            }
        };

        processClaim();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="animate-spin w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-bold">{status}</h2>
            </div>
        </div>
    );
}
