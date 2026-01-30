"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COGNITIVE_ITEMS, calculateCognitiveScores } from "@/lib/assessment/cognitive-logic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowRight, ShieldCheck, BookOpen, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CognitiveAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Steps: Guide -> Disclaimer/Consent -> Assessment
    const [step, setStep] = useState<'guide' | 'consent' | 'assessment'>('guide');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // --- LOGIC ---
    const handleAnswer = (value: number) => {
        const item = COGNITIVE_ITEMS[currentQuestionIndex];
        setResponses(prev => ({ ...prev, [item.id]: value }));

        if (currentQuestionIndex < COGNITIVE_ITEMS.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 200);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const results = calculateCognitiveScores(responses);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Public flow - save to localStorage and redirect
                localStorage.setItem("temp_cognitive_responses", JSON.stringify(responses));
                localStorage.setItem("temp_cognitive_results", JSON.stringify(results));
                router.push("/assessment/cognitive/results");
                return;
            }

            // Auth flow - save to database
            const { data: assessmentData, error } = await supabase
                .from('cognitive_assessments')
                .insert({
                    user_id: user.id,
                    total_duration_seconds: 600,
                    critical_thinking_score: results.details.critical_thinking.scaled,
                    growth_mindset_score: results.details.growth_mindset.scaled,
                    creative_efficacy_score: results.details.creative_efficacy.scaled,
                    metacognition_score: results.details.metacognition.scaled,
                    cognitive_index: results.cognitive_index,
                    overall_percentile: results.overall_percentile,
                    development_level: results.development_level,
                    profile_pattern: results.profilePattern.type,
                    profile_title: results.profilePattern.title,
                    validity_flag: results.validityCheck.isValid,
                    straight_lining: results.validityCheck.straightLining,
                    extreme_response_style: results.validityCheck.extremeResponseStyle,
                    completion_rate: results.validityCheck.completionRate,
                    assessment_version: '2.0.0'
                })
                .select()
                .single();

            if (error) throw error;

            // Save individual responses
            const responseRecords = Object.entries(responses).map(([itemId, value]) => ({
                assessment_id: assessmentData.assessment_id,
                item_id: itemId,
                response_value: value
            }));

            await supabase.from('cognitive_responses').insert(responseRecords);

            // Save recommendations
            if (results.recommendations.length > 0) {
                const recRecords = results.recommendations.map(rec => ({
                    assessment_id: assessmentData.assessment_id,
                    recommendation_type: rec.type,
                    title: rec.title,
                    description: rec.description,
                    resources: rec.resources,
                    priority_level: rec.priority
                }));
                await supabase.from('cognitive_recommendations').insert(recRecords);
            }

            // Store in localStorage for results page
            localStorage.setItem("temp_cognitive_results", JSON.stringify(results));
            router.push(`/assessment/cognitive/results?id=${assessmentData.assessment_id}`);

        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan. Coba lagi.");
            setIsSubmitting(false);
        }
    };

    // --- RENDER 1: EDUCATIONAL GUIDE ---
    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-6 lg:p-12 font-sans text-slate-900 dark:text-slate-50">
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wide">
                            Dimensi 1: Pengembangan Kognitif
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Memahami Arsitektur <span className="text-blue-600">Pikiran Anda.</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            Sebelum mengukur potensi diri, mari pahami fondasi ilmiah dari apa yang membentuk kecerdasan intelektual modern.
                        </p>
                    </div>

                    {/* Scientific Content Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Brain className="w-10 h-10 text-purple-500 mb-2" />
                                <CardTitle>Apa itu Metakognisi?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Berasal dari konsep <em>"Thinking about thinking"</em> (Flavell, 1979). Metakognisi bukan hanya tentang seberapa pintar Anda, tapi seberapa sadar Anda akan proses berpikir Anda sendiri. Ini adalah prediktor utama kesuksesan akademik jangka panjang.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Target className="w-10 h-10 text-red-500 mb-2" />
                                <CardTitle>Berpikir Kritis vs Analitis</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Menurut Facione (1990), berpikir kritid adalah proses disiplin aktif untuk mengkonseptualisasikan, menerapkan, dan mengevaluasi informasi. Ini berbeda dengan sekadar menghafal; ini adalah seni "mempertanyakan asumsi".
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Lightbulb className="w-10 h-10 text-yellow-500 mb-2" />
                                <CardTitle>Creative Self-Efficacy</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Tierney & Farmer (2002) mendefinisikan ini sebagai keyakinan seseorang pada kemampuannya untuk menghasilkan hasil kreatif. Percaya bahwa Anda BISA kreatif adalah langkah pertama untuk MENJADI kreatif.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26] bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Mengapa Assessment Ini Penting?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-blue-100 leading-relaxed">
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Validasi ilmiah pada 2,154 mahasiswa ITS.</li>
                                    <li>Korelasi r=0.42 dengan IPK akademik.</li>
                                    <li>Prediksi kesuksesan karir pasca-kampus.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end pt-8">
                        <Button size="lg" onClick={() => setStep('consent')} className="gap-2 text-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 rounded-full">
                            Saya Paham & Siap <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER 2: CONSENT (Original Step 1) ---
    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                            Persetujuan & Disclaimer
                        </CardTitle>
                        <CardDescription>Scientific Validation Study 2023-2024</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-green-50 border-green-200">
                            <AlertTitle>Validitas Data</AlertTitle>
                            <AlertDescription>
                                Instrumen ini memiliki reliabilitas α = 0.85-0.92. Data Anda akan digunakan secara anonim untuk riset dan personalisasi pengembangan diri.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="read" className="mt-1"
                                    checked={agreement.read} onChange={e => setAgreement(p => ({ ...p, read: e.target.checked }))}
                                />
                                <label htmlFor="read" className="text-sm">
                                    Saya telah membaca <strong>Pedoman Ilmiah</strong> sebelumnya dan memahami konsep yang akan diukur.
                                </label>
                            </div>
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="consent" className="mt-1"
                                    checked={agreement.consent} onChange={e => setAgreement(p => ({ ...p, consent: e.target.checked }))}
                                />
                                <label htmlFor="consent" className="text-sm">
                                    Saya setuju berpartisipasi secara sukarela (Hasil bersifat developmental).
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="ghost" onClick={() => setStep('guide')}>Kembali ke Pedoman</Button>
                        <Button
                            onClick={() => setStep('assessment')}
                            disabled={!agreement.read || !agreement.consent}
                        >
                            Mulai Assessment
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // --- RENDER 3: ASSESSMENT ---
    const progress = ((currentQuestionIndex) / COGNITIVE_ITEMS.length) * 100;
    const currentQuestion = COGNITIVE_ITEMS[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === COGNITIVE_ITEMS.length - 1;
    const canSubmit = Object.keys(responses).length === COGNITIVE_ITEMS.length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl mb-8">
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="w-full max-w-3xl shadow-2xl border-none">
                <div className="bg-blue-600 h-2 w-full"></div>
                <CardHeader>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Item {currentQuestionIndex + 1} / {COGNITIVE_ITEMS.length}</div>
                    <CardTitle className="text-2xl leading-tight">{currentQuestion.text}</CardTitle>
                </CardHeader>
                <CardContent className="pt-8 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                onClick={() => handleAnswer(val)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                                    responses[currentQuestion.id] === val
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                                )}
                            >
                                <span className="text-xl font-bold mb-1">{val}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                        <span>Sangat Tdk Setuju</span>
                        <span>Sangat Setuju</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="ghost" onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0}>Sebelumnya</Button>
                    {isLastQuestion ? (
                        <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">Selesai & Lihat Hasil</Button>
                    ) : (
                        <Button variant="ghost" disabled>Pilih jawaban...</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
