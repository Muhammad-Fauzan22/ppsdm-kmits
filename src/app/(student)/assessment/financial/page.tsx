"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FINANCIAL_ITEMS, calculateFinancialScore, FSection } from "@/lib/assessment/financial-logic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, PiggyBank, ArrowRight, ShieldCheck, PieChart, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FinancialAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Steps: guide -> consent -> knowledge -> likert (behavior+attitude)
    const [step, setStep] = useState<'guide' | 'consent' | 'knowledge' | 'likert'>('guide');

    // Logic State
    const [responses, setResponses] = useState<Record<string, string | number>>({});
    const [currentKIndex, setCurrentKIndex] = useState(0); // Knowledge Index
    const [currentLIndex, setCurrentLIndex] = useState(0); // Likert Index (Behavior + Attitude combined)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // Filter Items
    const knowledgeItems = FINANCIAL_ITEMS.filter(i => i.section === 'knowledge');
    const likertItems = FINANCIAL_ITEMS.filter(i => i.section !== 'knowledge'); // Behavior + Attitude

    // HANDLERS
    const handleKnowledgeAnswer = (optId: string) => {
        const item = knowledgeItems[currentKIndex];
        setResponses(prev => ({ ...prev, [item.id]: optId }));
        if (currentKIndex < knowledgeItems.length - 1) {
            setTimeout(() => setCurrentKIndex(p => p + 1), 200);
        } else {
            // End of Knowledge Section
            setTimeout(() => setStep('likert'), 500);
        }
    };

    const handleLikertAnswer = (val: number) => {
        const item = likertItems[currentLIndex];
        setResponses(prev => ({ ...prev, [item.id]: val }));
        if (currentLIndex < likertItems.length - 1) {
            setTimeout(() => setCurrentLIndex(p => p + 1), 200);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const results = calculateFinancialScore(responses);
            const { data: { user } } = await supabase.auth.getUser();

            // Public Flow
            if (!user) {
                localStorage.setItem("temp_fin_responses", JSON.stringify(responses));
                router.push("/auth/register?next=/assessment/financial/claim");
                return;
            }

            // Auth Flow
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
            router.push(`/assessment/financial/results?id=${data.assessment_id}`);

        } catch (error) {
            console.error(error);
            alert("Submission failed.");
            setIsSubmitting(false);
        }
    };

    // --- STEP 1: EDUCATIONAL GUIDE (PEDOMAN ILMIAH) ---
    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-6 lg:p-12 font-sans text-slate-900 dark:text-slate-50">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs uppercase tracking-wide">
                            Dimensi 3: Kecerdasan Finansial
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Revolusi <span className="text-yellow-600">Literasi Keuangan.</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            OECD mendefinisikan Literasi Keuangan sebagai kombinasi Pengetahuan, Perilaku, dan Sikap. Pelajari kerangka kerjanya sebelum Anda diuji.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <PieChart className="w-10 h-10 text-yellow-500 mb-2" />
                                <CardTitle>Tripartite Model</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>Huston (2010) membagi kecerdasan finansial menjadi 3 pilar: <strong>Knowledge</strong> (memahami konsep), <strong>Skill</strong> (kemampuan hitung), dan <strong>Application</strong> (perilaku nyata).</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <TrendingUp className="w-10 h-10 text-green-500 mb-2" />
                                <CardTitle>Efek Bunga Majemuk</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>Einstein menyebutnya "Keajaiban Dunia ke-8". Investasi kecil yang dilakukan sejak dini (usia kulaih) bernilai 10x lipat lebih besar dari investasi besar yang terlambat.</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Coins className="w-10 h-10 text-blue-500 mb-2" />
                                <CardTitle>Behavioral Bias</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>Otak kita diprogram untuk menghindari kerugian (Loss Aversion). Assessment ini akan mendeteksi apakah Anda rasional atau emosional dalam keputusan uang.</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26] bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                            <CardHeader>
                                <CardTitle className="text-white">Standar OJK & OECD</CardTitle>
                            </CardHeader>
                            <CardContent className="text-yellow-50 leading-relaxed">
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Instrumen tervalidasi di 39 negara.</li>
                                    <li>Mengukur Kesiapan Digital Banking.</li>
                                    <li>Deteksi risiko "Sandwich Generation".</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end pt-8">
                        <Button size="lg" onClick={() => setStep('consent')} className="gap-2 text-lg px-8 h-14 bg-yellow-600 hover:bg-yellow-700 text-white shadow-xl shadow-yellow-500/30 rounded-full">
                            Pelajari & Uji Kemampuan <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // --- STEP 2: CONSENT ---
    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-yellow-600" />
                            Validasi & Privasi
                        </CardTitle>
                        <CardDescription>Scientific Protocol - Financial Dimension</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertTitle>Format Test</AlertTitle>
                            <AlertDescription>
                                Test ini terdiri dari 24 item: 8 Pengetahuan (Pilihan Ganda) dan 16 Perilaku (Skala Likert). Pastikan Anda fokus.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="read" className="mt-1"
                                    checked={agreement.read} onChange={e => setAgreement(p => ({ ...p, read: e.target.checked }))}
                                />
                                <label htmlFor="read" className="text-sm">
                                    Saya telah memahami kerangka kerja <strong>Tripartite Model</strong>.
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
                        <Button variant="ghost" onClick={() => setStep('guide')}>Kembali</Button>
                        <Button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            onClick={() => setStep('knowledge')}
                            disabled={!agreement.read || !agreement.consent}
                        >
                            Mulai Bagian 1: Pengetahuan
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // --- STEP 3: KNOWLEDGE TEST ---
    if (step === 'knowledge') {
        const item = knowledgeItems[currentKIndex];
        const progress = ((currentKIndex) / knowledgeItems.length) * 100;

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl mb-8">
                    <p className="text-xs uppercase font-bold text-slate-500 mb-2">Bagian 1: Uji Pengetahuan Finansial</p>
                    <Progress value={progress} className="h-2 mb-2" />
                    <p className="text-right text-xs text-slate-400">{currentKIndex + 1}/{knowledgeItems.length}</p>
                </div>

                <Card className="w-full max-w-3xl shadow-xl min-h-[400px] flex flex-col">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <CardTitle className="text-xl leading-relaxed font-medium">{item.text}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 flex-1">
                        <div className="grid grid-cols-1 gap-3">
                            {item.options?.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleKnowledgeAnswer(opt.id)}
                                    className={cn(
                                        "p-4 text-left rounded-lg border transition-all text-sm md:text-base hover:bg-slate-50 dark:hover:bg-slate-800",
                                        responses[item.id] === opt.id
                                            ? "border-yellow-500 bg-yellow-50 text-yellow-900 ring-1 ring-yellow-500"
                                            : "border-slate-200"
                                    )}
                                >
                                    <span className="font-bold mr-3 uppercase">{opt.id}.</span>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // --- STEP 4: LIKERT TEST ---
    if (step === 'likert') {
        const item = likertItems[currentLIndex];
        const progress = ((currentLIndex) / likertItems.length) * 100;
        const isLast = currentLIndex === likertItems.length - 1;
        const canSubmit = Object.keys(responses).length === FINANCIAL_ITEMS.length;

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl mb-8">
                    <p className="text-xs uppercase font-bold text-slate-500 mb-2">Bagian 2: Perilaku & Sikap</p>
                    <Progress value={progress} className="h-2 mb-2" />
                    <p className="text-right text-xs text-slate-400">{currentLIndex + 1}/{likertItems.length}</p>
                </div>

                <Card className="w-full max-w-3xl shadow-xl">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 w-full"></div>
                    <CardHeader>
                        <CardTitle className="text-2xl leading-tight">{item.text}</CardTitle>
                        <CardDescription>{item.section === 'behavior' ? 'Seberapa sering Anda melakukan ini?' : 'Seberapa setuju Anda dengan pernyataan ini?'}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-10">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleLikertAnswer(val)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                                        responses[item.id] === val
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-blue-200"
                                    )}
                                >
                                    <span className="text-xl font-bold mb-1">{val}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>Sangat Tidak Setuju/Pernah</span>
                            <span>Sangat Setuju/Selalu</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-6">
                        <Button variant="ghost" onClick={() => setCurrentLIndex(p => Math.max(0, p - 1))} disabled={currentLIndex === 0}>Kembali</Button>
                        {isLast ? (
                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit} disabled={isSubmitting}>Selesai & Analisis</Button>
                        ) : (
                            <Button variant="ghost" disabled>Pilih jawaban...</Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return <div>Loading...</div>;
}
