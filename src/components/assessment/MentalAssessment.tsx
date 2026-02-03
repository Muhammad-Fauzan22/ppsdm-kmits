"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Brain,
    Users,
    Leaf,
    ShieldAlert,
    Sparkles,
    ChevronRight,
    Info,
    CheckCircle2,
    AlertTriangle,
    Smile
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateMentalScore, MentalResponse, MentalResult } from '@/lib/assessment/mentalScoring';

const QUESTIONS = [
    {
        id: 'MH1',
        text: "Selama sebulan terakhir, seberapa sering Anda merasa bahagia?",
        dimension: 'Emotional Well-being',
        icon: Smile
    },
    {
        id: 'MH2',
        text: "Selama sebulan terakhir, seberapa sering Anda merasa bahwa hidup Anda memiliki tujuan yang jelas?",
        dimension: 'Psychological Well-being',
        icon: Sparkles
    },
    {
        id: 'MH3',
        text: "Selama sebulan terakhir, seberapa sering Anda merasa menjadi bagian dari komunitas (misalnya: kampus, himpunan, kelompok belajar)?",
        dimension: 'Social Well-being',
        icon: Users
    },
    {
        id: 'MH4',
        text: "Saya dapat beradaptasi dengan baik ketika menghadapi perubahan atau tantangan yang tidak terduga",
        dimension: 'Resilience',
        icon: Leaf
    },
    {
        id: 'MH5',
        text: "Saya dapat mengatasi stres atau kesulitan dengan efektif",
        dimension: 'Resilience',
        icon: ShieldAlert
    },
    {
        id: 'MH6',
        text: "Selama sebulan terakhir, seberapa sering Anda merasa kewalahan dengan semua hal yang harus Anda lakukan?",
        dimension: 'Perceived Stress',
        icon: Activity
    },
    {
        id: 'MH7',
        text: "Saya mengalami peristiwa dengan penuh perhatian, tanpa terdistraksi atau berada dalam 'autopilot'",
        dimension: 'Mindfulness',
        icon: Brain
    },
    {
        id: 'MH8',
        text: "Secara keseluruhan, saya merasa puas dengan kehidupan saya saat ini",
        dimension: 'Overall Functioning',
        icon: Smile
    }
];

const OPTIONS = [
    { value: 1, label: "Tidak Pernah", color: "text-red-600 bg-red-50 hover:bg-red-100" },
    { value: 2, label: "Jarang", color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
    { value: 3, label: "Kadang-kadang", color: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100" },
    { value: 4, label: "Sering", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
    { value: 5, label: "Selalu", color: "text-green-600 bg-green-50 hover:bg-green-100" },
];

export default function MentalAssessment() {
    const [step, setStep] = useState<'disclaimer' | 'questions' | 'results'>('disclaimer');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [responses, setResponses] = useState<MentalResponse>({});
    const [result, setResult] = useState<MentalResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = QUESTIONS[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / QUESTIONS.length) * 100;

    const handleCreateProfile = () => setStep('questions');

    const handleResponse = (value: number) => {
        const newResponses = { ...responses, [currentQuestion.id]: value };
        setResponses(newResponses);

        if (currentQuestionIdx < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 300);
        } else {
            finishAssessment(newResponses);
        }
    };

    const finishAssessment = async (finalResponses: MentalResponse) => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis
        const calculatedResult = calculateMentalScore(finalResponses);
        setResult(calculatedResult);
        setStep('results');
        setIsSubmitting(false);
    };

    if (step === 'disclaimer') {
        return (
            <Card className="w-full max-w-2xl mx-auto border-emerald-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                        <Brain className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Mental Health Check-in</CardTitle>
                    <CardDescription className="text-lg">Kesehatan Mental & Kesejahteraan Psikologis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8 px-8">
                    <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800 font-semibold">Disclaimer Penting</AlertTitle>
                        <AlertDescription className="text-yellow-700 mt-2">
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Assesmen ini adalah alat <strong>pengembangan diri</strong>, bukan diagnosis klinis.</li>
                                <li>Hasil tidak menggantikan konsultasi dengan profesional kesehatan mental.</li>
                                <li>Jika anda merasa sangat tertekan, segera hubungi Unit Konseling ITS: (031) 599-4254.</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4 text-gray-600 text-sm bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900">Apa yang diukur?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span>Emotional Well-being</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span>Psychological Functioning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span>Social Well-being</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span>Resilience & Coping</span>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleCreateProfile} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg shadow-lg shadow-emerald-200 mt-4 rounded-xl">
                        Saya Mengerti, Mulai Assesmen
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (step === 'results' && result) {
        return (
            <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto pb-12">
                {/* Header Result */}
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                        Profil Kesehatan Mental
                    </h2>
                    <p className="text-gray-500">Validasi N=500 Mahasiswa ITS • Based on MHC-SF</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Score Card */}
                    <Card className="border-emerald-100 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                        <CardContent className="pt-8 flex flex-col items-center justify-center text-center p-6">
                            <div className="w-32 h-32 rounded-full border-8 border-emerald-50 flex flex-col items-center justify-center mb-4 relative">
                                <span className="text-4xl font-extrabold text-emerald-700">{Math.round(result.normalizedScore)}</span>
                                <span className="text-xs text-emerald-400 absolute bottom-6">/100</span>
                            </div>

                            <div className={`text-2xl font-bold mb-2 ${result.categoryColor}`}>
                                {result.category}
                            </div>

                            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500 mb-6">
                                Percentile: {result.percentile}% (Simulasi)
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                &quot;{result.interpretation}&quot;
                            </p>
                        </CardContent>
                    </Card>

                    {/* Right Column: Key Indicators */}
                    <Card className="border-gray-100 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-600" />
                                Indikator Kunci
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <IndicatorRow label="Emotional Well-being" value={result.subscaleScores.emotional} max={5} color="bg-emerald-500" />
                            <IndicatorRow label="Psychological Function" value={result.subscaleScores.psychological} max={5} color="bg-blue-500" />
                            <IndicatorRow label="Social Well-being" value={result.subscaleScores.social} max={5} color="bg-indigo-500" />
                            <IndicatorRow label="Resilience" value={result.subscaleScores.resilience} max={5} color="bg-amber-500" />

                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-700">Stress Management</span>
                                    <span className={`font-bold ${result.subscaleScores.stress > 3 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {result.subscaleScores.stress > 3 ? 'Good' : 'Needs Attention'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Risk Flags & Recommendations */}
                <div className="grid md:grid-cols-2 gap-8">
                    {result.riskFlags.length > 0 && (
                        <Card className="border-red-100 bg-red-50/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-red-800 flex items-center gap-2 text-lg">
                                    <ShieldAlert className="w-5 h-5" />
                                    Perhatian Khusus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {result.riskFlags.map((flag, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-red-700 items-start">
                                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{flag}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    <Card className={`border-gray-100 shadow-sm ${result.riskFlags.length === 0 ? 'md:col-span-2' : ''}`}>
                        <CardHeader>
                            <CardTitle className="text-lg">Rekomendasi Personal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {result.recommendations.map((rec, i) => (
                                    <li key={i} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                {rec.priority}
                                            </span>
                                            <span className="font-medium text-gray-900 text-sm">{rec.action}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{rec.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center pt-4">
                    <Button className="bg-emerald-900 text-white hover:bg-emerald-800 px-8 py-6 text-lg rounded-full shadow-lg" size="lg">
                        Simpan ke Catatan Kesejahteraan
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-emerald-600 mb-2">
                    <span>Pertanyaan {currentQuestionIdx + 1} dari {QUESTIONS.length}</span>
                    <span>Aspek: {currentQuestion.dimension}</span>
                </div>
                <Progress value={progress} className="h-2 bg-emerald-100" indicatorColor="bg-emerald-600" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 bg-emerald-100 rounded-full text-emerald-600 mb-6">
                            <currentQuestion.icon className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                            {currentQuestion.text}
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleResponse(option.value)}
                                className={`w-full p-4 rounded-xl border border-gray-100 text-left transition-all duration-200 flex items-center justify-between group ${option.color.replace('bg-', 'hover:bg-opacity-80 ')} hover:border-transparent hover:shadow-md bg-white`}
                            >
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    {option.label}
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {isSubmitting && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-emerald-800 font-medium">Menganalisis kesejahteraan psikologis...</p>
                </div>
            )}
        </div>
    );
}

function IndicatorRow({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
    const percentage = (value / max) * 100;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-bold text-gray-900">{value.toFixed(1)}/{max}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}
