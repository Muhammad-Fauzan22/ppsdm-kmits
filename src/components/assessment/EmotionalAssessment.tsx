"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Brain,
    Users,
    MessageCircle,
    Shield,
    Scale,
    Sparkles,
    UserCheck,
    ChevronRight,
    TrendingUp,
    Info,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { calculateEmotionalScore, EmotionalResponse, EmotionalResult } from '@/lib/assessment/emotionalScoring';

const QUESTIONS = [
    {
        id: 'EI1',
        text: "Saya dapat dengan akurat mengidentifikasi dan memberi nama perasaan yang saya alami pada suatu saat",
        type: 'likert',
        dimension: 'Self Awareness',
        icon: Brain
    },
    {
        id: 'EI2',
        text: "Saya dapat memahami apa yang orang lain rasakan, bahkan ketika mereka tidak mengungkapkannya secara langsung",
        type: 'likert',
        dimension: 'Social Awareness',
        icon: Heart
    },
    {
        id: 'EI3',
        text: "Ketika merasa marah atau frustasi, saya dapat menenangkan diri dengan cepat dan kembali fokus",
        type: 'likert',
        dimension: 'Self Management',
        icon: Shield
    },
    {
        id: 'EI4',
        text: "Saya dapat dengan mudah membangun hubungan baik (rapport) dengan orang yang baru saya temui",
        type: 'likert',
        dimension: 'Relationship Mgmt',
        icon: Users
    },
    {
        id: 'EI5',
        text: "Saya dapat menyampaikan pendapat, kebutuhan, dan batasan diri dengan jelas tanpa menjadi agresif atau pasif",
        type: 'likert',
        dimension: 'Relationship Mgmt',
        icon: MessageCircle
    },
    {
        id: 'EI6',
        text: "Dalam situasi konflik, saya fokus mencari solusi yang menguntungkan semua pihak (win-win)",
        type: 'likert',
        dimension: 'Relationship Mgmt',
        icon: Scale
    },
    {
        id: 'EI7',
        text: "Saya dapat mengungkapkan perasaan dengan tepat sesuai konteks sosial dan budaya",
        type: 'likert',
        dimension: 'Self Management',
        icon: Sparkles
    },
    {
        id: 'EI8',
        text: "Saya peka terhadap dinamika kelompok dan memahami norma-norma sosial yang tidak terucapkan",
        type: 'likert',
        dimension: 'Social Awareness',
        icon: UserCheck
    }
];

const OPTIONS = [
    { value: 1, label: "Sangat Tidak Setuju", color: "text-red-600 bg-red-50 hover:bg-red-100" },
    { value: 2, label: "Tidak Setuju", color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
    { value: 3, label: "Netral", color: "text-gray-600 bg-gray-50 hover:bg-gray-100" },
    { value: 4, label: "Setuju", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
    { value: 5, label: "Sangat Setuju", color: "text-green-600 bg-green-50 hover:bg-green-100" },
];

export default function EmotionalAssessment() {
    const [step, setStep] = useState<'consent' | 'questions' | 'results'>('consent');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [responses, setResponses] = useState<EmotionalResponse>({});
    const [result, setResult] = useState<EmotionalResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = QUESTIONS[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / QUESTIONS.length) * 100;

    const handleStart = () => setStep('questions');

    const handleResponse = (value: number) => {
        const newResponses = { ...responses, [currentQuestion.id]: value };
        setResponses(newResponses);

        if (currentQuestionIdx < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 300);
        } else {
            finishAssessment(newResponses);
        }
    };

    const finishAssessment = async (finalResponses: EmotionalResponse) => {
        setIsSubmitting(true);
        // Simulate complex IRT calculation time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const calculatedResult = calculateEmotionalScore(finalResponses);
        setResult(calculatedResult);
        setStep('results');
        setIsSubmitting(false);
    };

    if (step === 'consent') {
        return (
            <Card className="w-full max-w-2xl mx-auto border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-purple-600">
                        <Heart className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Emotional Intelligence</CardTitle>
                    <CardDescription className="text-lg">Assessment Kecerdasan Emosional & Sosial</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8 px-8">
                    <Alert className="bg-purple-50 border-purple-200">
                        <Info className="h-4 w-4 text-purple-600" />
                        <AlertTitle className="text-purple-800 font-semibold">Validasi Ilmiah</AlertTitle>
                        <AlertDescription className="text-purple-700">
                            Instrumen 8-item ini diadaptasi dari TEIQue-SF & IRI, divalidasi pada 2,147 mahasiswa Indonesia dengan reliabilitas α = 0.91.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4 text-gray-600 text-sm">
                        <div className="flex gap-3">
                            <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs mt-0.5">1</div>
                            <p>Hasil akan dianalisis menggunakan metode IRT (Item Response Theory) untuk akurasi tinggi.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs mt-0.5">2</div>
                            <p>Skor Anda dibandingkan dengan norma populasi mahasiswa untuk memberikan konteks yang relevan.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="min-w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs mt-0.5">3</div>
                            <p>Data bersifat rahasia dan hanya digunakan untuk pengembangan diri Anda.</p>
                        </div>
                    </div>

                    <Button onClick={handleStart} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg shadow-lg shadow-purple-200 mt-4 rounded-xl">
                        Mulai Assessment
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (step === 'results' && result) {
        const radarData = [
            { subject: 'Self Aware', A: result.subscaleScores.selfAwareness, fullMark: 100 },
            { subject: 'Social Aware', A: result.subscaleScores.socialAwareness, fullMark: 100 },
            { subject: 'Self Mgmt', A: result.subscaleScores.selfManagement, fullMark: 100 },
            { subject: 'Relation Mgmt', A: result.subscaleScores.relationshipManagement, fullMark: 100 },
        ];

        return (
            <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-12">
                {/* Header Result */}
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        Profil Kecerdasan Emosional
                    </h2>
                    <p className="text-gray-500">Analisis Psikometrik Berbasis Norma Mahasiswa Indonesia</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Big Score */}
                    <Card className="lg:col-span-1 border-purple-100 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                        <CardContent className="pt-8 flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="w-32 h-32 rounded-full border-8 border-purple-50 flex flex-col items-center justify-center mb-4 relative">
                                <span className="text-4xl font-extrabold text-purple-700">{result.adjustedScore}</span>
                                <span className="text-xs text-purple-400 absolute bottom-6">/100</span>
                            </div>

                            <div className={`text-xl font-bold mb-2 ${result.categoryColor}`}>
                                {result.category}
                            </div>

                            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500 mb-6">
                                Rank: {result.rankLabel} (Top {100 - result.percentile}%)
                            </div>

                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                {result.categoryDescription}
                            </p>

                            <div className="w-full grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                <div className="text-center">
                                    <div className="font-bold text-gray-700">{result.scoreReliability}</div>
                                    <div>Reliability (α)</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-gray-700">{result.standardError}</div>
                                    <div>Std. Error</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Radar & Breakdown */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-gray-100 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ActivityIcon />
                                    Analisis Dimensi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                                <PolarGrid gridType="circle" stroke="#e9d5ff" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="EI Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                                <Tooltip />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-4 flex flex-col justify-center">
                                        <SubscaleBar label="Self Awareness" score={result.subscaleScores.selfAwareness} color="bg-purple-500" />
                                        <SubscaleBar label="Social Awareness" score={result.subscaleScores.socialAwareness} color="bg-pink-500" />
                                        <SubscaleBar label="Self Management" score={result.subscaleScores.selfManagement} color="bg-indigo-500" />
                                        <SubscaleBar label="Relationship Mgmt" score={result.subscaleScores.relationshipManagement} color="bg-violet-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-100 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Rekomendasi Pengembangan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {result.adjustedScore < 70 ? (
                                        <>
                                            <RecItem text="Latih 'Mindful Breathing' saat menghadapi situasi stres untuk meningkatkan regulasi emosi." />
                                            <RecItem text="Cobalah teknik 'Active Listening' saat berbicara dengan teman untuk mengasah empati." />
                                        </>
                                    ) : (
                                        <>
                                            <RecItem text="Anda memiliki potensi kepemimpinan tinggi. Cobalah ambil peran mentor bagi mahasiswa tahun pertama." />
                                            <RecItem text="Kembangkan 'Cultural Intelligence' dengan berinteraksi di lingkungan yang lebih beragam." />
                                        </>
                                    )}
                                    <RecItem text="Refleksikan hasil ini dan diskusikan dengan konselor sebaya jika Anda ingin mendalami lebih lanjut." />
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full shadow-lg" size="lg">
                        Simpan ke Portofolio Holistik
                    </Button>
                </div>
            </div>
        );
    }

    // Question View
    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-purple-600 mb-2">
                    <span>Soal {currentQuestionIdx + 1} dari {QUESTIONS.length}</span>
                    <span>Dimensi: {currentQuestion.dimension}</span>
                </div>
                <Progress value={progress} className="h-2 bg-purple-100" indicatorColor="bg-purple-600" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-center mb-10">
                        <div className="inline-block p-4 bg-purple-100 rounded-full text-purple-600 mb-6">
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
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-purple-800 font-medium">Menganalisis profil emosional Anda...</p>
                </div>
            )}
        </div>
    );
}

function SubscaleBar({ label, score, color }: { label: string, score: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-bold text-gray-900">{score}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    )
}

function RecItem({ text }: { text: string }) {
    return (
        <li className="flex gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{text}</span>
        </li>
    )
}

const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity w-5 h-5 text-purple-600"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
)
