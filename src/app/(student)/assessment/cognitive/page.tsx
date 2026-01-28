"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { COGNITIVE_ITEMS, calculateCognitiveScores } from "@/lib/assessment/cognitive-logic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Brain, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CognitiveAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState<'disclaimer' | 'assessment'>('disclaimer');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // --- LOGIC ---
    const handleAnswer = (value: number) => {
        const item = COGNITIVE_ITEMS[currentQuestionIndex];
        setResponses(prev => ({ ...prev, [item.id]: value }));

        // Auto advance after short delay
        if (currentQuestionIndex < COGNITIVE_ITEMS.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Calculate Scores
            const results = calculateCognitiveScores(responses);

            // 2. Get User
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Redirect to login if session lost - but ideally handle this better
                console.error("No user found");
                return;
            }

            // 3. Save to DB
            const { data: assessmentData, error: assessmentError } = await supabase
                .from('cognitive_assessments')
                .insert({
                    user_id: user.id,
                    total_duration_seconds: 600, // Placeholder for now
                    critical_thinking_score: results.details.critical_thinking.scaled,
                    growth_mindset_score: results.details.growth_mindset.scaled,
                    creative_efficacy_score: results.details.creative_efficacy.scaled,
                    metacognition_score: results.details.metacognition.scaled,
                    cognitive_index: results.cognitive_index,
                    overall_percentile: results.overall_percentile,
                    development_level: results.development_level
                })
                .select()
                .single();

            if (assessmentError) throw assessmentError;

            // 4. Save Responses
            const responseRecords = Object.entries(responses).map(([itemId, val]) => ({
                assessment_id: assessmentData.assessment_id,
                item_id: itemId,
                response_value: val
            }));

            await supabase.from('cognitive_responses').insert(responseRecords);

            // 5. Redirect
            router.push(`/assessment/cognitive/results?id=${assessmentData.assessment_id}`);

        } catch (error) {
            console.error("Submission error:", error);
            alert("Terjadi kesalahan saat menyimpan hasil. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER ---
    if (step === 'disclaimer') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-3xl w-full shadow-xl border-t-4 border-t-primary">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Brain className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">Assessment Pengembangan Kognitif</CardTitle>
                                <CardDescription>Scientific Validation Study 2023-2024</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertTitle className="text-blue-800 dark:text-blue-300 font-bold">PERSETUJUAN DAN DISCLAIMER ILMIAH</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-300/80 mt-2 text-sm leading-relaxed">
                                Assessment ini dikembangkan berdasarkan penelitian ilmiah yang ketat pada 2,154 mahasiswa ITS.
                                Instrumen ini valid (α = 0.85-0.92) dan telah melalui uji etika.
                            </AlertDescription>
                        </Alert>

                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <h4 className="font-bold">Apa yang akan diukur:</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <li>🎯 <strong>Berpikir Kritis</strong>: Analisis informasi & keputusan logis</li>
                                <li>🌱 <strong>Mindset Berkembang</strong>: Keyakinan potensi diri</li>
                                <li>💡 <strong>Efikasi Diri Kreatif</strong>: Kepercayaan diri inovasi</li>
                                <li>🧠 <strong>Kesadaran Metakognitif</strong>: Refleksi & strategi belajar</li>
                            </ul>
                        </div>

                        <div className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="read"
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={agreement.read}
                                    onChange={e => setAgreement(prev => ({ ...prev, read: e.target.checked }))}
                                />
                                <label htmlFor="read" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Saya telah membaca dan memahami informasi di atas
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={agreement.consent}
                                    onChange={e => setAgreement(prev => ({ ...prev, consent: e.target.checked }))}
                                />
                                <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Saya setuju untuk berpartisipasi (Hasil bersifat developmental)
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => router.back()}>Kembali</Button>
                        <Button
                            onClick={() => setStep('assessment')}
                            disabled={!agreement.read || !agreement.consent}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Mulai Assessment <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- ASSESSMENT VIEW ---
    const progress = ((currentQuestionIndex) / COGNITIVE_ITEMS.length) * 100;
    const currentQuestion = COGNITIVE_ITEMS[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === COGNITIVE_ITEMS.length - 1;
    const canSubmit = Object.keys(responses).length === COGNITIVE_ITEMS.length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="w-full max-w-3xl shadow-2xl border-none">
                <div className="bg-primary h-2 w-full"></div>
                <CardHeader>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Pertanyaan {currentQuestionIndex + 1} dari {COGNITIVE_ITEMS.length}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl leading-tight font-heading">
                        {currentQuestion.text}
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-8 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                onClick={() => handleAnswer(val)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                    responses[currentQuestion.id] === val
                                        ? "border-primary bg-primary/5 text-primary shadow-lg ring-1 ring-primary"
                                        : "border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900"
                                )}
                            >
                                <span className={cn(
                                    "text-2xl font-bold mb-1",
                                    responses[currentQuestion.id] === val ? "text-primary" : "text-slate-400"
                                )}>{val}</span>
                                <span className="text-xs text-center font-medium text-slate-500">
                                    {val === 1 && "Sangat Tidak Setuju"}
                                    {val === 2 && "Tidak Setuju"}
                                    {val === 3 && "Netral"}
                                    {val === 4 && "Setuju"}
                                    {val === 5 && "Sangat Setuju"}
                                </span>
                            </button>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t p-6 bg-slate-50 dark:bg-slate-900/50">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                    >
                        Sebelumnya
                    </Button>

                    <div className="flex gap-2">
                        {isLastQuestion ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit || isSubmitting}
                                className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
                            >
                                {isSubmitting ? "Menyimpan..." : "Selesai & Lihat Hasil"}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(COGNITIVE_ITEMS.length - 1, prev + 1))}
                                disabled={!responses[currentQuestion.id]}
                            >
                                Selanjutnya
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
