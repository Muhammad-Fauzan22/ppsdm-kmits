"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { KNOWLEDGE_ITEMS, BEHAVIOR_ITEMS, ATTITUDE_ITEMS } from "@/lib/assessment/financial-items";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, ArrowRight, DollarSign, Wallet, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = 'guide' | 'consent' | 'knowledge' | 'behavior' | 'attitude' | 'submitting';

export default function FinancialAssessmentPage() {
    const router = useRouter();
    const [step, setStep] = useState<Section>('guide');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Store responses separately
    const [knowledgeResp, setKnowledgeResp] = useState<Record<string, string>>({});
    const [behaviorResp, setBehaviorResp] = useState<Record<string, number>>({});
    const [attitudeResp, setAttitudeResp] = useState<Record<string, number>>({});

    const [startTime, setStartTime] = useState<string>("");
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // Start Assessment
    const startAssessment = () => {
        setStartTime(new Date().toISOString());
        setStep('knowledge');
        setCurrentIndex(0);
    };

    // Handle Knowledge Answer
    const handleKnowledge = (val: string) => {
        const item = KNOWLEDGE_ITEMS[currentIndex];
        setKnowledgeResp(p => ({ ...p, [item.id]: val }));

        if (currentIndex < KNOWLEDGE_ITEMS.length - 1) {
            setTimeout(() => setCurrentIndex(p => p + 1), 200);
        } else {
            // Move to next section
            setTimeout(() => {
                setStep('behavior');
                setCurrentIndex(0);
            }, 300);
        }
    };

    // Handle Likert Answer (Behavior/Attitude)
    const handleLikert = (val: number, type: 'behavior' | 'attitude') => {
        const items = type === 'behavior' ? BEHAVIOR_ITEMS : ATTITUDE_ITEMS;
        const setter = type === 'behavior' ? setBehaviorResp : setAttitudeResp;
        const currentItem = items[currentIndex];

        setter(p => ({ ...p, [currentItem.id]: val }));

        if (currentIndex < items.length - 1) {
            setTimeout(() => setCurrentIndex(p => p + 1), 150);
        } else {
            if (type === 'behavior') {
                setTimeout(() => {
                    setStep('attitude');
                    setCurrentIndex(0);
                }, 300);
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = async () => {
        setStep('submitting');
        const endTime = new Date().toISOString();

        // Prepare payload
        const payload = {
            startTime,
            endTime,
            knowledgeResponses: Object.entries(knowledgeResp).map(([k, v]) => ({
                itemId: k,
                response: v,
                isCorrect: KNOWLEDGE_ITEMS.find(i => i.id === k)?.correctAnswer === v
            })),
            behaviorResponses: Object.entries(behaviorResp).map(([k, v]) => ({
                itemId: k,
                response: v
            })),
            attitudeResponses: Object.entries(attitudeResp).map(([k, v]) => ({
                itemId: k,
                response: v
            }))
        };

        try {
            const res = await fetch('/api/assessment/financial/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Submission failed");

            const data = await res.json();
            // Redirect to results
            router.push(`/assessment/financial/results?id=${data.assessmentId}`);
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
            setStep('attitude'); // Go back to allow retry
        }
    };

    // --- RENDERERS ---

    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center">
                <Card className="max-w-3xl w-full border-none shadow-xl">
                    <CardHeader className="text-center pb-8 pt-10">
                        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Financial Intelligence Assessment
                        </CardTitle>
                        <CardDescription className="text-lg max-w-xl mx-auto">
                            Mengukur pemahaman, kebiasaan, dan sikap Anda terhadap pengelolaan finansial untuk masa depan yang lebih sejahtera.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6 pb-10">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                            <h3 className="font-bold mb-1">Knowledge</h3>
                            <p className="text-sm text-slate-500">Pemahaman konsep dasar keuangan.</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Wallet className="w-8 h-8 text-purple-500 mb-2" />
                            <h3 className="font-bold mb-1">Behavior</h3>
                            <p className="text-sm text-slate-500">Kebiasaan dan tindakan finansial sehari-hari.</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <ShieldCheck className="w-8 h-8 text-amber-500 mb-2" />
                            <h3 className="font-bold mb-1">Attitude</h3>
                            <p className="text-sm text-slate-500">Pola pikir terhadap uang & risiko.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-10">
                        <Button size="lg" onClick={() => setStep('consent')} className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 text-lg shadow-lg shadow-blue-500/20">
                            Mulai Assessment <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                            Persetujuan & Disclaimer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                            <AlertTitle>Kerahasiaan Data</AlertTitle>
                            <AlertDescription>
                                Hasil tes ini digunakan untuk pengembangan diri Anda. Data finansial spesifik tidak akan dibagikan kepada pihak ketiga.
                            </AlertDescription>
                        </Alert>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-3 p-3 rounded-lg border">
                                <input type="checkbox" id="read" className="mt-1" checked={agreement.read} onChange={e => setAgreement(p => ({ ...p, read: e.target.checked }))} />
                                <label htmlFor="read" className="text-sm">Saya telah membaca pedoman.</label>
                            </div>
                            <div className="flex items-start space-x-3 p-3 rounded-lg border">
                                <input type="checkbox" id="consent" className="mt-1" checked={agreement.consent} onChange={e => setAgreement(p => ({ ...p, consent: e.target.checked }))} />
                                <label htmlFor="consent" className="text-sm">Saya setuju untuk berpartisipasi.</label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="ghost" onClick={() => setStep('guide')}>Kembali</Button>
                        <Button onClick={startAssessment} disabled={!agreement.read || !agreement.consent}>Mulai</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (step === 'submitting') {
        return <div className="min-h-screen flex items-center justify-center text-xl font-bold animate-pulse">Menproses Hasil Analisis...</div>;
    }

    // Question Rendering Logic
    let currentItem: any;
    let progress = 0;
    const totalSteps = KNOWLEDGE_ITEMS.length + BEHAVIOR_ITEMS.length + ATTITUDE_ITEMS.length;

    if (step === 'knowledge') {
        currentItem = KNOWLEDGE_ITEMS[currentIndex];
        progress = ((currentIndex) / totalSteps) * 100;
    } else if (step === 'behavior') {
        currentItem = BEHAVIOR_ITEMS[currentIndex];
        progress = ((KNOWLEDGE_ITEMS.length + currentIndex) / totalSteps) * 100;
    } else {
        currentItem = ATTITUDE_ITEMS[currentIndex];
        progress = ((KNOWLEDGE_ITEMS.length + BEHAVIOR_ITEMS.length + currentIndex) / totalSteps) * 100;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    <span>{step} Phase</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="w-full max-w-3xl shadow-2xl border-none min-h-[400px] flex flex-col">
                <div className={cn("h-2 w-full", step === 'knowledge' ? "bg-blue-500" : step === 'behavior' ? "bg-purple-500" : "bg-amber-500")}></div>
                <CardHeader>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Question</div>
                    <CardTitle className="text-2xl leading-tight">{currentItem?.text}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                    {step === 'knowledge' ? (
                        <div className="grid grid-cols-1 gap-3">
                            {currentItem.options.map((opt: any) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleKnowledge(opt.value)}
                                    className={cn(
                                        "text-left p-4 rounded-xl border-2 transition-all hover:bg-slate-50",
                                        knowledgeResp[currentItem.id] === opt.value ? "border-blue-500 bg-blue-50" : "border-slate-200"
                                    )}
                                >
                                    <span className="font-bold mr-2">{opt.value}.</span> {opt.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between text-sm text-slate-500 font-medium px-2">
                                <span>Sangat Tidak Setuju</span>
                                <span>Sangat Setuju</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2 md:gap-4">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleLikert(val, step as 'behavior' | 'attitude')}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
                                            (step === 'behavior' ? behaviorResp[currentItem.id] : attitudeResp[currentItem.id]) === val
                                                ? (step === 'behavior' ? "border-purple-500 bg-purple-50 text-purple-700" : "border-amber-500 bg-amber-50 text-amber-700")
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        )}
                                    >
                                        <span className="text-2xl font-bold">{val}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="border-t p-6 text-center text-sm text-slate-400">
                    {step === 'knowledge' ? "Pilih jawaban yang paling tepat." : "Jawab sesuai dengan kondisi Anda sebenarnya."}
                </CardFooter>
            </Card>
        </div>
    );
}
