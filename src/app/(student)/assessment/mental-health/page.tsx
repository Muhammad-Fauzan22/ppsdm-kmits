"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Heart, Brain, Users, ArrowRight, ShieldCheck, Clock, BookOpen, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import ScientificGuide from "@/components/assessment/ScientificGuide";
import { MENTAL_HEALTH_ITEMS, calculateMentalHealthScores } from "@/lib/assessment/mental-health-logic";
import type { MentalHealthItem } from "@/lib/assessment/mental-health-logic";

// Hero Content Props as per user request
const GUIDE_PROPS = {
    dimensionNumber: 6,
    dimensionName: "Mental Health & Psychological Well-being",
    title: "Kesehatan Mental: Pondasi Kesuksesan",
    subtitle: "Temukan tingkat kesejahteraan mental Anda dan dapatkan panduan personal untuk berkembang secara holistik.",
    concepts: [
        { icon: Heart, iconColor: "text-rose-500", title: "Emotional Well-being", description: "Kebahagiaan, kepuasan hidup, & optimisme." },
        { icon: ShieldCheck, iconColor: "text-emerald-500", title: "Academic Resilience", description: "Kemampuan bangkit dari kegagalan akademik." },
        { icon: Brain, iconColor: "text-blue-500", title: "Stress Management", description: "Strategi efektif mengatasi tekanan." },
        { icon: Users, iconColor: "text-purple-500", title: "Social Support", description: "Jaringan pendukung di kampus & keluarga." }
    ],
    highlightTitle: "Mengapa Asesmen Ini Penting?",
    highlightPoints: [
        { text: "Memetakan kekuatan mental Anda untuk kesuksesan jangka panjang." },
        { text: "Identifikasi dini risiko burnout akademik." },
        { text: "Rekomendasi berbasis bukti ilmiah (norma mahasiswa Indonesia)." }
    ]
};

// Simple Disclaimer Component (Inline/Custom as per specific text request)
function MentalHealthConsent({ onContinue }: { onContinue: () => void }) {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#151b26] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 mb-2">
                <ShieldAlert className="w-8 h-8" />
                <h2 className="text-xl font-bold">Penting: Penafian & Persetujuan</h2>
            </div>

            <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                    <p className="font-semibold text-amber-800 dark:text-amber-200">Asesmen ini BUKAN diagnosis klinis.</p>
                    <p className="mt-1">Hasil ini bertujuan untuk pengembangan diri. Jika Anda mengalami krisis atau tekanan berat, segera hubungi profesional.</p>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white">Penggunaan Data</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Data disimpan aman & terenkripsi.</li>
                    <li>Digunakan secara anonim untuk riset pengembangan sistem.</li>
                    <li>Anda memiliki hak penuh atas data Anda.</li>
                </ul>

                <h3 className="font-bold text-slate-900 dark:text-white">Kontak Krisis 24/7</h3>
                <ul className="list-disc pl-5 space-y-1 text-rose-600 dark:text-rose-400 font-medium">
                    <li>Hotline Kesehatan Mental Nasional: 1198</li>
                    <li>Konseling ITS: (031) 599-4251</li>
                </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer sr-only" />
                        <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                        <ShieldCheck className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                        Saya telah membaca, memahami, dan menyetujui pernyataan di atas. Saya berpartisipasi secara sukarela.
                    </span>
                </label>
            </div>

            <Button onClick={onContinue} disabled={!agreed} className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/20">
                Mulai Asesmen
            </Button>
        </div>
    );
}

export default function MentalHealthAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // State
    const [step, setStep] = useState<"guide" | "consent" | "quiz">("guide");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [responseTimes, setResponseTimes] = useState<Record<string, number>>({});
    const [startTime, setStartTime] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Items
    const totalItems = MENTAL_HEALTH_ITEMS.length;
    const currentItem = MENTAL_HEALTH_ITEMS[currentIdx];
    const progress = ((currentIdx) / totalItems) * 100;

    // Timer Logic
    useEffect(() => {
        if (step === 'quiz') {
            setStartTime(Date.now());
        }
    }, [step, currentIdx]);

    const handleAnswer = (val: number) => {
        const timeTaken = Date.now() - startTime;

        setResponses(prev => ({ ...prev, [currentItem.id]: val }));
        setResponseTimes(prev => ({ ...prev, [currentItem.id]: (prev[currentItem.id] || 0) + timeTaken }));

        if (currentIdx < totalItems - 1) {
            setCurrentIdx(prev => prev + 1);
        } else {
            // Finished
            submitAssessment({ ...responses, [currentItem.id]: val }, { ...responseTimes, [currentItem.id]: timeTaken });
        }
    };

    const submitAssessment = async (finalResponses: Record<string, number>, finalTimes: Record<string, number>) => {
        setIsSubmitting(true);
        try {
            // 1. Calculate Results (Logic)
            const result = calculateMentalHealthScores(finalResponses, finalTimes);

            // 2. Auth Check
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Handle unauthenticated (save local & redirect claim)
                localStorage.setItem('temp_mh_result', JSON.stringify(result));
                router.push('/auth/login?redirect=/assessment/mental-health/claim'); // Hypothetical claim flow
                return;
            }

            // 3. Save to DB
            const { data: asm, error } = await supabase.from('mental_health_assessments').insert({
                user_id: user.id,
                raw_score: result.raw_score,
                normalized_score: result.normalized_score,
                percentile: result.percentile,
                risk_level: result.risk_level,
                subscales: result.subscales,
                validity_score: result.validity.score,
                validity_flags: result.validity.flags,
                red_flags: result.red_flags,
                recommendations: result.recommendations,
                interpretation: result.interpretation,
                responses: finalResponses
            }).select().single();

            if (error) throw error;

            // 4. Update Risk Tracking (Trigger Logic could be here or DB trigger)
            await supabase.from('mental_health_risk_tracking').insert({
                user_id: user.id,
                last_assessment_id: asm.assessment_id,
                current_risk_level: result.risk_level,
                risk_factors: result.red_flags,
                status: 'active'
            });

            router.push(`/assessment/mental-health/results?id=${asm.assessment_id}`);

        } catch (err) {
            console.error(err);
            alert("Failed to submit assessment.");
            setIsSubmitting(false);
        }
    };

    if (step === 'guide') {
        return (
            <ScientificGuide
                {...GUIDE_PROPS}
                onContinue={() => setStep('consent')}
            />
        );
    }

    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-4">
                <MentalHealthConsent onContinue={() => setStep('quiz')} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] py-12 px-4 font-sans flex flex-col items-center">
            <div className="w-full max-w-2xl">
                {/* Progress */}
                <div className="mb-10 space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        <span>Question {currentIdx + 1} of {totalItems}</span>
                        <span>{Math.round(progress)}% Completed</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-[#151b26] p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl"
                    >
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                                {currentItem.factor.replace('_', ' ')}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-white leading-tight">
                                {currentItem.text}
                            </h2>
                        </div>

                        <div className="grid gap-3">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => !isSubmitting && handleAnswer(val)}
                                    className="group flex items-center justify-between p-4 md:p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                                >
                                    <span className="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                        {val === 1 && "Tidak Pernah"}
                                        {val === 2 && "Jarang"}
                                        {val === 3 && "Kadang-kadang"}
                                        {val === 4 && "Sering"}
                                        {val === 5 && "Selalu"}
                                    </span>
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center transition-all">
                                        <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Info */}
                <div className="mt-8 text-center text-xs text-slate-400">
                    <p>Respon Anda dijaga kerahasiaannya. Jawablah sejujur mungkin sesuai kondisi 1 bulan terakhir.</p>
                </div>
            </div>

            {isSubmitting && (
                <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-center animate-pulse">
                        <Activity className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Menganalisis Respon...</h3>
                        <p className="text-slate-500">Mohon tunggu sebentar.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
