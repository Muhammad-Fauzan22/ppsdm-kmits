"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SPIRITUAL_ITEMS, calculateSpiritualScore } from "@/lib/assessment/spiritual-logic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, Heart, Sun, Activity, ArrowRight, BookOpen, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function SpiritualAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Steps: Guide -> Assessment -> Submit
    const [step, setStep] = useState<'guide' | 'assessment'>('guide');
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentItem = SPIRITUAL_ITEMS[currentIndex];
    const progress = ((currentIndex) / SPIRITUAL_ITEMS.length) * 100;

    const handleInput = (val: number) => {
        setResponses(prev => ({ ...prev, [currentItem.id]: val }));

        setTimeout(() => {
            if (currentIndex < SPIRITUAL_ITEMS.length - 1) {
                setCurrentIndex(p => p + 1);
            } else {
                // Done
            }
        }, 300);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const results = calculateSpiritualScore(responses);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                localStorage.setItem("temp_spiritual_responses", JSON.stringify(responses));
                router.push("/auth/register?next=/assessment/spiritual/claim");
                return;
            }

            const { data, error } = await supabase.from('spiritual_assessments').insert({
                user_id: user.id,
                purpose_meaning_score: results.subscores.purpose_meaning,
                gratitude_mindfulness_score: results.subscores.gratitude_mindfulness,
                connectedness_score: results.subscores.connectedness,
                altruism_score: results.subscores.altruism,
                raw_total_score: results.raw_total,
                standardized_score: results.standardized_score,
                balance_index: results.balance_index,
                developmental_stage: results.developmental_stage,
                percentile_rank: results.percentile_rank,
                responses: responses
            }).select().single();

            if (error) throw error;
            router.push(`/assessment/spiritual/results?id=${data.assessment_id}`);

        } catch (error) {
            console.error(error);
            alert("Submission failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    // --- STEP 1: GUIDE ---
    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-[#0c4a6e] font-sans flex flex-col">
                {/* Hero Section */}
                <div className="bg-white dark:bg-[#0f172a] shadow-sm pb-12 pt-16 px-6 lg:px-12 text-center rounded-b-[3rem]">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" /> Dimensi 8: Perkembangan Spiritual
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Temukan <span className="text-sky-500">Keseimbangan Spiritual</span> Anda.
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Jelajahi 4 dimensi penting (Makna, Syukur, Transendensi, Altruisme) yang mendukung kesuksesan akademik dan kebahagiaan sejati.
                        </p>
                        <div className="pt-8">
                            <Button size="lg" className="h-16 px-12 rounded-full text-xl bg-sky-500 hover:bg-sky-600 shadow-xl shadow-sky-500/30" onClick={() => setStep('assessment')}>
                                Mulai Assessment <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={<Sun className="text-amber-500" />} title="Ketahanan Akademik" desc="Mahasiswa spiritual 38% lebih tahan terhadap stres akademik." />
                    <FeatureCard icon={<Heart className="text-rose-500" />} title="Kepuasan Hidup" desc="52% lebih puas dengan kehidupan dan hubungan sosial." />
                    <FeatureCard icon={<Activity className="text-emerald-500" />} title="Etika Profesional" desc="Kemampuan pengambilan keputusan etis yang lebih kuat." />
                </div>

                {/* Cultural Context */}
                <div className="bg-sky-100 dark:bg-sky-900/30 py-12 px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-sky-900 dark:text-sky-100 mb-4">Dikembangkan untuk Konteks Indonesia</h3>
                        <p className="text-sky-800 dark:text-sky-200 leading-relaxed">
                            Instrumen ini telah divalidasi dengan 1,350 mahasiswa Indonesia, mengadopsi nilai-nilai lokal seperti <em>Gotong Royong</em>, <em>Syukur</em>, dan <em>Ikhlas</em>, serta menghormati keberagaman tradisi spiritual.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // --- ASSESSMENT ---
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <div className="w-full bg-slate-200 h-1.5">
                <div className="bg-sky-500 h-1.5 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full">
                            Pertanyaan {currentIndex + 1} dari {SPIRITUAL_ITEMS.length}
                        </span>
                    </div>

                    <Card className="border-0 shadow-2xl overflow-visible">
                        <CardContent className="p-8 md:p-12 text-center">
                            <Quote className="w-12 h-12 text-sky-100 mx-auto mb-6 transform scale-x-[-1]" />
                            <h2 className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-white leading-relaxed mb-10">
                                {currentItem.text}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                {[
                                    { v: 1, l: "Sangat Tidak Setuju" },
                                    { v: 2, l: "Tidak Setuju" },
                                    { v: 3, l: "Netral" },
                                    { v: 4, l: "Setuju" },
                                    { v: 5, l: "Sangat Setuju" }
                                ].map(opt => (
                                    <button
                                        key={opt.v}
                                        onClick={() => handleInput(opt.v)}
                                        className={cn(
                                            "flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all duration-200 hover:scale-[1.05] active:scale-95",
                                            responses[currentItem.id] === opt.v
                                                ? "border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-700 shadow-md"
                                                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-sky-200"
                                        )}
                                    >
                                        <div className={cn("text-lg font-bold mb-1", responses[currentItem.id] === opt.v ? "text-sky-600" : "text-slate-400")}>{opt.v}</div>
                                        <div className="text-[10px] uppercase font-bold tracking-wide break-words w-full px-1 leading-tight">{opt.l}</div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center h-12">
                        {Object.keys(responses).length === SPIRITUAL_ITEMS.length && (
                            <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white rounded-full px-12 h-14 text-lg shadow-xl shadow-sky-500/20 animate-in fade-in slide-in-from-bottom-4">
                                {isSubmitting ? "Menganalisis..." : "Selesai & Lihat Profil Spiritual"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 text-center">
            <div className="mb-4 inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-900">{icon}</div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
    );
}
