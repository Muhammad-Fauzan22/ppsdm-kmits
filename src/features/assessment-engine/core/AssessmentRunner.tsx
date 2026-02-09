"use client";

import React from "react";
import { DimensionConfig } from "./types";
import { useAssessment } from "../hooks/useAssessment";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ShieldCheck, ArrowRight, Brain, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface AssessmentRunnerProps {
    config: DimensionConfig;
}

// Icon mapping helper
function getIconComponent(iconName: string): LucideIcon {
    const iconMap: Record<string, LucideIcon> = {
        'brain': Brain,
        'shield': ShieldCheck,
        'arrow-right': ArrowRight,
        // Add more mappings as needed
    };
    return iconMap[iconName] || Brain;
}

export function AssessmentRunner({ config }: AssessmentRunnerProps) {
    const {
        state,
        setStep,
        setAgreement,
        handleAnswer,
        handlePrevious,
        submitAssessment
    } = useAssessment(config);

    const { step, currentQuestionIndex, responses, isSubmitting, agreement } = state;

    // --- RENDER 1: EDUCATIONAL GUIDE ---
    if (step === 'guide') {
        const GuideIcon = getIconComponent(config.icon);

        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-6 lg:p-12 font-sans text-slate-900 dark:text-slate-50">
                <div className="max-w-4xl mx-auto space-y-10">
                    {/* Hero */}
                    <div className="space-y-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wide`}>
                            {config.title} Assessment
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            {config.guide?.title || config.title}
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            {config.guide?.description || config.description}
                        </p>

                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {config.guide?.cards?.map((card, idx) => {
                            const CardIcon = card.icon || Brain;
                            return (
                                <Card key={idx} className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                                    <CardHeader>
                                        <CardIcon className={`w-10 h-10 mb-2 ${card.color || 'text-blue-500'}`} />
                                        <CardTitle>{card.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: card.content }} />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>


                    {/* Nav */}
                    <div className="flex justify-end pt-8">
                        <Button
                            size="lg"
                            onClick={() => setStep('consent')}
                            className={`gap-2 text-lg px-8 h-14 text-white shadow-xl rounded-full bg-blue-600 hover:bg-blue-700`}
                        >
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
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                            Persetujuan & Disclaimer
                        </CardTitle>
                        <CardDescription>Scientific Validation Study</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-green-50 border-green-200">
                            <AlertTitle>Validitas Data</AlertTitle>
                            <AlertDescription>
                                Data Anda akan digunakan secara anonim untuk riset dan personalisasi pengembangan diri.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="read" className="mt-1"
                                    checked={agreement.read}
                                    onChange={e => setAgreement({ read: e.target.checked })}
                                />
                                <label htmlFor="read" className="text-sm">
                                    Saya telah membaca <strong>Pedoman Ilmiah</strong> sebelumnya dan memahami konsep yang akan diukur.
                                </label>
                            </div>
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="consent" className="mt-1"
                                    checked={agreement.consent}
                                    onChange={e => setAgreement({ consent: e.target.checked })}
                                />
                                <label htmlFor="consent" className="text-sm">
                                    Saya setuju berpartisipasi secara sukarela.
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
        );
    }

    // --- RENDER 3: ASSESSMENT ---
    const items = config.items || [];
    const progress = items.length > 0 ? ((currentQuestionIndex) / items.length) * 100 : 0;
    const currentQuestion = items[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === items.length - 1;
    const canSubmit = Object.keys(responses).length === items.length;

    // Safety check for empty items
    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
                <Card className="w-full max-w-3xl shadow-2xl border-none">
                    <CardHeader>
                        <CardTitle>Tidak ada pertanyaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Assessment ini belum memiliki pertanyaan.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl mb-8">
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="w-full max-w-3xl shadow-2xl border-none">
                <div className={`h-2 w-full ${config.color || 'bg-blue-600'}`}></div>
                <CardHeader>
                <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">
                    Item {currentQuestionIndex + 1} / {items.length}
                </div>

                    <CardTitle className="text-2xl leading-tight">{currentQuestion?.text}</CardTitle>
                </CardHeader>
                <CardContent className="pt-8 pb-10">
                    {/* SCENARIO TYPE */}
                    {currentQuestion?.scenario && (
                        <div className="mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-slate-700 dark:text-slate-300 italic border-l-4 border-blue-500">
                            {currentQuestion.scenario}
                        </div>
                    )}

                    {/* RENDER OPTIONS BASED ON TYPE */}
                    {(!currentQuestion?.type || currentQuestion?.type === 'likert') && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleAnswer(val)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                                            currentQuestion?.id && responses[currentQuestion.id] === val
                                                ? `border-blue-600 bg-blue-50 text-blue-700`
                                                : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <span className="text-xl font-bold mb-1">{val}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                                <span>{currentQuestion?.labels?.min || "Sangat Tdk Setuju"}</span>
                                <span>{currentQuestion?.labels?.max || "Sangat Setuju"}</span>
                            </div>
                        </>
                    )}

                    {(currentQuestion?.type === 'scenario' || currentQuestion?.type === 'choice') && (
                        <div className="space-y-3">
                            {currentQuestion?.options?.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer(opt.value || (typeof opt.id === 'number' ? opt.id : 0))}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border-2 transition-all",
                                        currentQuestion?.id && responses[currentQuestion.id] === (opt.value || (typeof opt.id === 'number' ? opt.id : 0))
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                                    )}
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentQuestion?.type === 'behavioral' && (
                        <div className="space-y-3">
                            {/* Behavioral often uses Frequency Scale inside Options */}
                            {currentQuestion?.options?.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer(opt.value || 0)} // Behavioral maps to score
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between",
                                        currentQuestion?.id && responses[currentQuestion.id] === opt.value
                                            ? "border-green-600 bg-green-50 text-green-700"
                                            : "border-slate-200 hover:border-green-200 hover:bg-slate-50"
                                    )}
                                >
                                    <span>{opt.text}</span>
                                </button>
                            ))}
                        </div>
                    )}

                </CardContent>

                <CardFooter className="flex justify-between border-t p-6">
                    <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        Sebelumnya
                    </Button>
                    {isLastQuestion ? (
                        <Button
                            onClick={submitAssessment}
                            disabled={!canSubmit || isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Selesai & Lihat Hasil'}
                        </Button>
                    ) : (
                        <Button variant="ghost" disabled>Pilih jawaban...</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
