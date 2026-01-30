"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Activity, Moon, Apple, Zap, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import ScientificGuide from "@/components/assessment/ScientificGuide";
import ConsentDisclaimer from "@/components/assessment/ConsentDisclaimer";
import { PHYSICAL_ITEMS, calculatePhysicalScores } from "@/lib/assessment/physical-logic";
import type { PhysicalDimension } from "@/lib/assessment/physical-logic";

// Icons mapping for dimensions
const DIMENSION_ICONS: Record<PhysicalDimension, any> = {
    physical_activity: Activity,
    sleep_quality: Moon,
    nutrition: Apple,
    vitality: Zap,
    preventive_health: Shield
};

const DIMENSION_LABELS: Record<PhysicalDimension, string> = {
    physical_activity: "Aktivitas Fisik",
    sleep_quality: "Kualitas Tidur",
    nutrition: "Nutrisi & Diet",
    vitality: "Vitalitas",
    preventive_health: "Kesehatan Preventif"
};

export default function PhysicalAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState<"guide" | "consent" | "assessment">("guide");
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Group items by dimension for sectioned view
    const sections: PhysicalDimension[] = [
        'physical_activity',
        'sleep_quality',
        'nutrition',
        'vitality',
        'preventive_health'
    ];

    const currentDimension = sections[currentSectionIndex];
    const currentItems = PHYSICAL_ITEMS.filter(item => item.dimension === currentDimension);

    const handleAnswer = (itemId: string, value: number) => {
        setResponses(prev => ({ ...prev, [itemId]: value }));
    };

    const isSectionComplete = currentItems.every(item => responses[item.id] !== undefined);

    const handleNext = async () => {
        if (currentSectionIndex < sections.length - 1) {
            setCurrentSectionIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Calculate Results
            const results = calculatePhysicalScores(responses);

            // Check Auth
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Public Flow -> LocalStorage -> Claim
                localStorage.setItem("temp_physical_responses", JSON.stringify(responses));
                localStorage.setItem("temp_physical_results", JSON.stringify(results));
                router.push("/assessment/physical/claim");
                return;
            }

            // Auth Flow -> Save to DB
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

            // Save Responses (Optional but good for analytics)
            const responseRows = Object.entries(responses).map(([qid, val]) => ({
                assessment_id: data.assessment_id,
                question_id: qid,
                response_value: val
            }));

            await supabase.from('physical_health_responses').insert(responseRows);

            router.push(`/assessment/physical/results?id=${data.assessment_id}`);

        } catch (error) {
            console.error("Submission error:", error);
            alert("Terjadi kesalahan saat menyimpan hasil. Silakan coba lagi.");
            setIsSubmitting(false);
        }
    };

    const [agreement, setAgreement] = useState({ read: false, consent: false });

    if (step === "guide") {
        return (
            <ScientificGuide
                dimensionNumber={4}
                dimensionName="Physical Health & Vitality"
                title="Kesehatan Fisik & Vitalitas"
                subtitle="Assessment komprehensif untuk mengukur aktivitas fisik, kualitas tidur, nutrisi, dan vitalitas berdasarkan standar WHO dan validasi psikometrik."
                concepts={[
                    {
                        icon: Activity,
                        iconColor: "text-emerald-500",
                        title: "Physical Activity",
                        description: "Mengukur intensitas dan frekuensi aktivitas fisik menggunakan adaptasi IPAQ-SF.",
                        reference: "Craig et al. (2003)"
                    },
                    {
                        icon: Moon,
                        iconColor: "text-blue-500",
                        title: "Sleep Quality",
                        description: "Evaluasi durasi dan efisiensi tidur berbasis Pittsburgh Sleep Quality Index (PSQI).",
                        reference: "Buysse et al. (1989)"
                    },
                    {
                        icon: Apple,
                        iconColor: "text-red-500",
                        title: "Nutrition & Diet",
                        description: "Analisis kebiasaan makan dan asupan nutrisi sesuai panduan WHO dan Kemenkes.",
                        reference: "Kemenkes RI (2014)"
                    },
                    {
                        icon: Zap,
                        iconColor: "text-yellow-500",
                        title: "Subjective Vitality",
                        description: "Pengukuran energi psikologis dan perasaan semangat dalam menjalani hari.",
                        reference: "Ryan & Frederick (1997)"
                    }
                ]}
                highlightTitle="Kenapa Dimensi Ini Penting?"
                highlightPoints={[
                    { text: "Kesehatan fisik adalah fondasi utama performa akademik yang optimal." },
                    { text: "Tidur yang berkualitas dapat meningkatkan daya ingat hingga 40%." },
                    { text: "Aktivitas fisik teratur terbukti menurunkan tingkat stres akademik mahasiswa." }
                ]}
                onContinue={() => setStep("consent")}
            />
        );
    }

    if (step === "consent") {
        return (
            <ConsentDisclaimer
                dimensionName="Physical Health & Vitality"
                reliabilityRange="0.84 - 0.87"
                testRetestRange="0.78 - 0.83"
                sampleSize={2347}
                validationYear="2023"
                references={[
                    { author: "Craig, C. L., et al.", year: 2003, title: "International physical activity questionnaire", source: "Medicine & Science in Sports & Exercise" },
                    { author: "Buysse, D. J., et al.", year: 1989, title: "The Pittsburgh Sleep Quality Index", source: "Psychiatry Research" },
                    { author: "Ryan, R. M., & Frederick, C.", year: 1997, title: "Subjective vitality as a dynamic reflection of well-being", source: "Journal of Personality" }
                ]}
                onBack={() => setStep("guide")}
                onContinue={() => setStep("assessment")}
                agreement={agreement}
                setAgreement={setAgreement}
            />
        );
    }

    const progress = ((currentSectionIndex) / sections.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto">
                {/* Progress Header */}
                <div className="mb-8 space-y-4">
                    <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                        <span>Bagian {currentSectionIndex + 1} dari {sections.length}</span>
                        <span>{Math.round(progress)}% Selesai</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Section Title */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                        {React.createElement(DIMENSION_ICONS[currentDimension], { className: "w-6 h-6" })}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {DIMENSION_LABELS[currentDimension]}
                        </h2>
                        <p className="text-slate-500 text-sm">Jawablah sesuai kondisi Anda dalam 1 bulan terakhir</p>
                    </div>
                </div>

                {/* Items */}
                <motion.div
                    key={currentDimension}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    {currentItems.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-[#151b26] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">
                                {item.text}
                            </h3>

                            <div className="grid gap-3">
                                {item.options?.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleAnswer(item.id, option.value)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group
                                            ${responses[item.id] === option.value
                                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500"
                                                : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        <span className="font-medium">{option.label}</span>
                                        {responses[item.id] === option.value && (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between items-center bg-white dark:bg-[#151b26] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg sticky bottom-4 z-40">
                    <Button
                        variant="ghost"
                        onClick={() => currentSectionIndex > 0 && setCurrentSectionIndex(prev => prev - 1)}
                        disabled={currentSectionIndex === 0}
                        className="text-slate-500"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Sebelumnya
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!isSectionComplete || isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
                    >
                        {isSubmitting ? (
                            "Memproses..."
                        ) : currentSectionIndex === sections.length - 1 ? (
                            "Selesai & Analisis"
                        ) : (
                            <>Selanjutnya <ArrowRight className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
