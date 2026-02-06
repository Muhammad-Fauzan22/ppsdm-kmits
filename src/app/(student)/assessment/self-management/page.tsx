"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SM_ITEMS, calculateSelfManagementScores } from "@/lib/assessment/self-management-logic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowRight, ShieldCheck, Activity, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SelfManagementAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Flow: Guide -> Consent -> Assessment
    const [step, setStep] = useState<'guide' | 'consent' | 'assessment'>('guide');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // --- LOGIC ---
    const handleAnswer = (value: number) => {
        const item = SM_ITEMS[currentQuestionIndex];
        setResponses(prev => ({ ...prev, [item.id]: value }));

        if (currentQuestionIndex < SM_ITEMS.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 200);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const results = calculateSelfManagementScores(responses);
            const { data: { user } } = await supabase.auth.getUser();

            // Public Flow
            if (!user) {
                localStorage.setItem("temp_sm_responses", JSON.stringify(responses));
                router.push("/auth/register?next=/assessment/self-management/claim");
                return;
            }

            // Auth Flow - Save with new 4-factor structure
            const { data, error } = await supabase
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
                .select().single();

            if (error) throw error;
            router.push(`/assessment/self-management/results?id=${data.assessment_id}`);

        } catch (error) {
            console.error(error);
            alert("Error saving results.");
            setIsSubmitting(false);
        }
    };

    // --- RENDER 1: EDUCATIONAL GUIDE ---
    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-6 lg:p-12 font-sans text-slate-900 dark:text-slate-50">
                <div className="max-w-4xl mx-auto space-y-10">

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-wide">
                            Dimensi 2: Self-Management
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Menguasai Seni <span className="text-emerald-600">Produktivitas.</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            Bukan sekadar &quot;sibuk&quot;, tapi &quot;efektif&quot;. Pelajari sains di balik manajemen waktu dan fokus sebelum mengukur kemampuan Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <BrainCircuit className="w-10 h-10 text-emerald-500 mb-2" />
                                <CardTitle>Psikologi Prokrastinasi</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Studi Pychyl & Sirois (2016) menunjukkan prokrastinasi bukan masalah manajemen waktu, tapi <em>kegagalan regulasi emosi</em>. Kita menunda bukan karena malas, tapi untuk menghindari emosi negatif dari tugas tersebut.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Clock className="w-10 h-10 text-blue-500 mb-2" />
                                <CardTitle>Time Management Matrix</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Populer oleh Covey, membagi tugas menjadi 4 kuadran berdasarkan Penting vs Mendesak. Mahasiswa berprestasi menghabiskan 60%+ waktu mereka di Kuadran 2 (Penting, Tidak Mendesak) seperti belajar rutin dan olahraga.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Activity className="w-10 h-10 text-red-500 mb-2" />
                                <CardTitle>Ego Depletion Theory</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    Baumeister (1998) mengusulkan bahwa &apos;willpower&apos; adalah sumber daya terbatas. Assessment ini mengukur seberapa efisien Anda menggunakan &apos;baterai fokus&apos; Anda setiap hari.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26] bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Manfaat Nyata</CardTitle>
                            </CardHeader>
                            <CardContent className="text-emerald-100 leading-relaxed">
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Identifikasi tipe prokrastinasi Anda.</li>
                                    <li>Rekomendasi strategi fokus (Pomodoro, Flow).</li>
                                    <li>Benchmarking dengan 1,200 mahasiswa Indonesia.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end pt-8">
                        <Button size="lg" onClick={() => setStep('consent')} className="gap-2 text-lg px-8 h-14 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/30 rounded-full">
                            Saya Paham & Siap <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER 2: CONSENT ---
    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            Persetujuan & Validasi
                        </CardTitle>
                        <CardDescription>Scientific Assessment Protocol - Dimension 2</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-emerald-50 border-emerald-200">
                            <AlertTitle>Privasi Data</AlertTitle>
                            <AlertDescription>
                                Hasil assessment ini bersifat rahasia dan hanya digunakan untuk pengembangan diri Anda. Sistem menggunakan enkripsi RLS.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="read" className="mt-1"
                                    checked={agreement.read} onChange={e => setAgreement(p => ({ ...p, read: e.target.checked }))}
                                />
                                <label htmlFor="read" className="text-sm">
                                    Saya telah membaca <strong>Guide Psikologi Produktivitas</strong> dan memahami apa yang diukur.
                                </label>
                            </div>
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="consent" className="mt-1"
                                    checked={agreement.consent} onChange={e => setAgreement(p => ({ ...p, consent: e.target.checked }))}
                                />
                                <label htmlFor="consent" className="text-sm">
                                    Saya setuju berpartisipasi secara sukarela.
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="ghost" onClick={() => setStep('guide')}>Kembali ke Guide</Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
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
    const progress = ((currentQuestionIndex) / SM_ITEMS.length) * 100;
    const currentItem = SM_ITEMS[currentQuestionIndex];
    const isLast = currentQuestionIndex === SM_ITEMS.length - 1;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl mb-8">
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="w-full max-w-3xl shadow-2xl border-none">
                <div className="bg-emerald-500 h-2 w-full"></div>
                <CardHeader>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Item {currentQuestionIndex + 1} / {SM_ITEMS.length}</div>
                    <CardTitle className="text-2xl leading-tight">{currentItem.text}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                onClick={() => handleAnswer(val)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                                    responses[currentItem.id] === val
                                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 hover:border-emerald-200 hover:bg-slate-50"
                                )}
                            >
                                <span className="text-xl font-bold mb-1">{val}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="ghost" onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0}>Sebelumnya</Button>
                    {isLast ? (
                        <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(responses).length < SM_ITEMS.length} className="bg-emerald-600 hover:bg-emerald-700 text-white">Selesai & Analisis</Button>
                    ) : (
                        <Button variant="ghost" disabled>Pilih jawaban...</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
