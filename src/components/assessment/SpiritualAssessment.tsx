"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Heart,
    Sun,
    Users,
    Leaf,
    Compass,
    Zap,
    HandHeart,
    ChevronRight,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateSpiritualScore, SpiritualResponse, SpiritualResult } from '@/lib/assessment/spiritualScoring';

const QUESTIONS = [
    { id: 'SP1', text: "Saya merasa hidup saya memiliki tujuan dan makna yang jelas", dim: "Purpose", icon: Compass },
    { id: 'SP2', text: "Saya memiliki banyak hal dalam hidup yang harus disyukuri", dim: "Gratitude", icon: Heart },
    { id: 'SP3', text: "Saya merasa terhubung dengan sesuatu yang lebih besar dari diri saya sendiri", dim: "Connectedness", icon: Sparkles },
    { id: 'SP4', text: "Saya merasa senang dapat membantu orang lain tanpa mengharapkan imbalan", dim: "Altruism", icon: HandHeart },
    { id: 'SP5', text: "Saya dapat menemukan makna dalam pengalaman sulit atau penderitaan", dim: "Meaning Making", icon: Sun },
    { id: 'SP6', text: "Saya menghargai keindahan dan keajaiban dalam kehidupan sehari-hari", dim: "Mindfulness", icon: Leaf },
    { id: 'SP7', text: "Saya dapat memaafkan diri sendiri dan orang lain atas kesalahan di masa lalu", dim: "Forgiveness", icon: Zap },
    { id: 'SP8', text: "Saya ingin meninggalkan warisan positif bagi dunia", dim: "Contribution", icon: Users }
];

const OPTIONS = [
    { val: 1, label: "Sangat Tidak Setuju" },
    { val: 2, label: "Tidak Setuju" },
    { val: 3, label: "Netral" },
    { val: 4, label: "Setuju" },
    { val: 5, label: "Sangat Setuju" },
];

export default function SpiritualAssessment() {
    const [step, setStep] = useState<'intro' | 'questions' | 'results'>('intro');
    const [idx, setIdx] = useState(0);
    const [responses, setResponses] = useState<SpiritualResponse>({} as any);
    const [result, setResult] = useState<SpiritualResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Consent
    const [agreed, setAgreed] = useState(false);

    const handleAnswer = (val: number) => {
        const q = QUESTIONS[idx];
        const newResponses = { ...responses, [q.id]: val };
        setResponses(newResponses);

        if (idx < QUESTIONS.length - 1) {
            setTimeout(() => setIdx(prev => prev + 1), 250);
        } else {
            finish(newResponses);
        }
    };

    const finish = async (finalRes: SpiritualResponse) => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setResult(calculateSpiritualScore(finalRes));
        setStep('results');
        setIsSubmitting(false);
    };

    if (step === 'intro') {
        return (
            <Card className="max-w-2xl mx-auto border-sky-200 shadow-lg">
                <CardHeader className="bg-sky-50 text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center text-sky-600 mb-4 shadow-sm">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">Spiritual Development</CardTitle>
                    <CardDescription>Scientific Assessment of Meaning & Purpose</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 px-8">
                    <Alert className="bg-sky-50 border-sky-100">
                        <Info className="h-4 w-4 text-sky-600" />
                        <AlertTitle className="text-sky-800 font-semibold">Inclusive & Universal</AlertTitle>
                        <AlertDescription className="text-sky-700 text-sm">
                            Assessment ini dirancang secara inklusif untuk semua latar belakang keyakinan. Fokus pada perkembangan makna hidup (Meaning), tujuan (Purpose), dan nilai-nilai universal.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <input type="checkbox" id="c1" className="mt-1" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                            <label htmlFor="c1" className="text-sm text-gray-600">
                                Saya mengerti bahwa hasil ini untuk pengembangan diri pribadi dan akan dijaga kerahasiaannya.
                            </label>
                        </div>
                    </div>

                    <Button disabled={!agreed} onClick={() => setStep('questions')} className="w-full bg-sky-600 hover:bg-sky-700 text-white h-12 text-lg rounded-xl shadow-md">
                        Mulai Refleksi Diri
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (step === 'results' && result) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Profil Perkembangan Spiritual</h2>
                    <p className="text-gray-500">Based on PERMA+4 Framework</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Score Card */}
                    <Card className="border-sky-100 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
                        <CardContent className="pt-10 flex flex-col items-center text-center p-8">
                            <div className="w-32 h-32 rounded-full border-8 border-sky-50 flex items-center justify-center mb-6">
                                <span className="text-4xl font-black text-sky-700">{result.normalizedScore}</span>
                            </div>
                            <h3 className={`text-2xl font-bold mb-2 ${result.levelColor}`}>{result.developmentLevel}</h3>
                            <p className="text-gray-600 text-sm italic">{result.interpretation}</p>
                            <div className="mt-6 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                Percentile: {result.percentile}% (Simulated Norms)
                            </div>
                        </CardContent>
                    </Card>

                    {/* Radar / List */}
                    <Card className="border-gray-100 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Analisis 8 Dimensi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DimRow label="Purpose" val={result.subscaleScores.purpose} icon={Compass} />
                            <DimRow label="Gratitude" val={result.subscaleScores.gratitude} icon={Heart} />
                            <DimRow label="Connectedness" val={result.subscaleScores.connectedness} icon={Sparkles} />
                            <DimRow label="Meaninig Making" val={result.subscaleScores.meaningMaking} icon={Sun} />
                            <DimRow label="Mindfulness" val={result.subscaleScores.mindfulness} icon={Leaf} />
                        </CardContent>
                    </Card>
                </div>

                {/* Recommendations */}
                <div className="grid md:grid-cols-3 gap-4">
                    {result.recommendations.map((rec, i) => (
                        <Card key={i} className="border-gray-100 hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${rec.priority === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'}`}>
                                        {rec.priority} Priority
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">{rec.action}</h4>
                                <p className="text-xs text-gray-600">{rec.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={() => window.print()}>Simpan Laporan PDF</Button>
                </div>
            </div>
        );
    }

    const q = QUESTIONS[idx];
    const progress = ((idx + 1) / QUESTIONS.length) * 100;

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    <span>Question {idx + 1}/{QUESTIONS.length}</span>
                    <span>{q.dim}</span>
                </div>
                <Progress value={progress} className="h-1 bg-gray-100" indicatorColor="bg-sky-500" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                >
                    <div className="inline-block p-4 bg-sky-50 rounded-full text-sky-600 mb-6">
                        <q.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-gray-800 mb-10 leading-snug">
                        "{q.text}"
                    </h2>

                    <div className="space-y-3">
                        {OPTIONS.map((opt) => (
                            <button
                                key={opt.val}
                                onClick={() => handleAnswer(opt.val)}
                                className="w-full p-4 rounded-xl border border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all flex items-center justify-between group bg-white"
                            >
                                <span className="text-gray-600 font-medium group-hover:text-sky-900">{opt.label}</span>
                                <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {isSubmitting && (
                <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" />
                </div>
            )}
        </div>
    );
}

function DimRow({ label, val, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gray-50 rounded-lg text-gray-500">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-bold">{Math.round(val)}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${val}%` }} />
                </div>
            </div>
        </div>
    )
}
