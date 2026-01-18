"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
    id: string;
    dimension: string;
    question_text: string;
    question_order: number;
    framework_reference: string;
}

interface AssessmentData {
    [dimension: string]: Question[];
}

const dimensionLabels: Record<string, { name: string; icon: string; color: string }> = {
    cognitive: { name: "Kognitif", icon: "psychology", color: "bg-blue-500" },
    affective: { name: "Afektif", icon: "favorite", color: "bg-pink-500" },
    psychomotor: { name: "Psikomotorik", icon: "directions_run", color: "bg-orange-500" },
    spiritual: { name: "Spiritual", icon: "self_improvement", color: "bg-purple-500" },
    social: { name: "Sosial", icon: "groups", color: "bg-cyan-500" },
    financial: { name: "Finansial", icon: "payments", color: "bg-green-500" },
    health: { name: "Kesehatan", icon: "fitness_center", color: "bg-red-500" },
    character: { name: "Karakter", icon: "verified_user", color: "bg-indigo-500" },
    environmental: { name: "Lingkungan", icon: "eco", color: "bg-teal-500" },
};

const dimensionOrder = [
    "cognitive", "affective", "psychomotor", "spiritual",
    "social", "financial", "health", "character", "environmental"
];

const likertOptions = [
    { value: 1, label: "Sangat Tidak Setuju", emoji: "😟" },
    { value: 2, label: "Tidak Setuju", emoji: "😕" },
    { value: 3, label: "Netral", emoji: "😐" },
    { value: 4, label: "Setuju", emoji: "🙂" },
    { value: 5, label: "Sangat Setuju", emoji: "😊" },
];

export default function AssessmentPage() {
    const router = useRouter();
    const [step, setStep] = useState<"intro" | "assessment" | "submitting" | "complete">("intro");
    const [questions, setQuestions] = useState<AssessmentData>({});
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [scores, setScores] = useState<Record<string, number> | null>(null);

    const currentDimension = dimensionOrder[currentDimensionIndex];
    const currentQuestions = questions[currentDimension] || [];
    const currentQuestion = currentQuestions[currentQuestionIndex];

    const totalQuestions = Object.values(questions).reduce((acc, qs) => acc + qs.length, 0);
    const answeredQuestions = Object.keys(responses).length;
    const progress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    // Fetch questions on mount
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch("/api/assessment");
            const data = await res.json();
            if (data.success) {
                setQuestions(data.data);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const startAssessment = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_type: "initial" }),
            });
            const data = await res.json();
            if (data.success) {
                setSessionId(data.session.id);
                setStep("assessment");
            }
        } catch (error) {
            console.error("Error starting assessment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResponse = (value: number) => {
        if (!currentQuestion) return;

        setResponses(prev => ({
            ...prev,
            [currentQuestion.id]: value,
        }));

        // Auto advance to next question
        setTimeout(() => {
            if (currentQuestionIndex < currentQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else if (currentDimensionIndex < dimensionOrder.length - 1) {
                setCurrentDimensionIndex(prev => prev + 1);
                setCurrentQuestionIndex(0);
            } else {
                // All questions answered, submit
                submitAssessment();
            }
        }, 300);
    };

    const submitAssessment = async () => {
        setStep("submitting");
        try {
            // Submit all responses
            const formattedResponses = Object.entries(responses).map(([instrument_id, response]) => ({
                instrument_id,
                response,
            }));

            await fetch("/api/assessment/responses", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionId,
                    responses: formattedResponses,
                }),
            });

            // Complete assessment and get scores
            const completeRes = await fetch("/api/assessment/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId }),
            });
            const completeData = await completeRes.json();

            if (completeData.success) {
                setScores(completeData.scores);
                setStep("complete");
            }
        } catch (error) {
            console.error("Error submitting assessment:", error);
        }
    };

    const goBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else if (currentDimensionIndex > 0) {
            setCurrentDimensionIndex(prev => prev - 1);
            const prevDimension = dimensionOrder[currentDimensionIndex - 1];
            setCurrentQuestionIndex((questions[prevDimension]?.length || 1) - 1);
        }
    };

    // Intro Screen
    if (step === "intro") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary to-its-blue text-white font-display flex flex-col">
                <header className="p-6">
                    <Link href="/" className="flex items-center gap-2 text-white/90">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Kembali
                    </Link>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="size-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl">assignment</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Assessment Awal</h1>
                    <p className="text-white/80 max-w-md mb-8">
                        Jawab 48 pertanyaan untuk mengukur kondisi awal Anda di 9 dimensi pengembangan.
                        Assessment ini berbasis framework ilmiah dan akan membantu membuat rencana pengembangan yang personal.
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm">
                        {dimensionOrder.map((dim) => (
                            <div key={dim} className="flex flex-col items-center gap-1 p-2">
                                <div className={`size-10 ${dimensionLabels[dim].color} rounded-lg flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-xl text-white">{dimensionLabels[dim].icon}</span>
                                </div>
                                <span className="text-xs text-white/70">{dimensionLabels[dim].name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        Estimasi waktu: 15-20 menit
                    </div>

                    <button
                        onClick={startAssessment}
                        disabled={isLoading}
                        className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Loading..." : "Mulai Assessment"}
                    </button>
                </main>
            </div>
        );
    }

    // Submitting Screen
    if (step === "submitting") {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Memproses Assessment...</h2>
                    <p className="text-gray-500">Menghitung skor dan melakukan gap analysis</p>
                </div>
            </div>
        );
    }

    // Complete Screen
    if (step === "complete" && scores) {
        const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);

        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
                <header className="bg-gradient-to-r from-primary to-its-blue text-white py-12 px-6 text-center">
                    <div className="size-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl">celebration</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Assessment Selesai!</h1>
                    <p className="text-white/80">Skor Rata-rata: <span className="font-bold text-3xl">{avgScore}</span>/100</p>
                </header>

                <main className="max-w-2xl mx-auto p-6 space-y-6">
                    <h2 className="text-lg font-bold">Skor Per Dimensi</h2>

                    <div className="space-y-3">
                        {dimensionOrder.map((dim) => {
                            const score = scores[dim] || 0;
                            const gap = 100 - score;
                            const priority = gap > 60 ? "critical" : gap > 40 ? "high" : gap > 20 ? "moderate" : "minimal";

                            return (
                                <div key={dim} className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-10 ${dimensionLabels[dim].color} rounded-lg flex items-center justify-center`}>
                                                <span className="material-symbols-outlined text-white">{dimensionLabels[dim].icon}</span>
                                            </div>
                                            <span className="font-medium">{dimensionLabels[dim].name}</span>
                                        </div>
                                        <span className="text-xl font-bold">{score}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${dimensionLabels[dim].color} transition-all`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>Gap: {gap}</span>
                                        <span className={`font-medium ${priority === "critical" ? "text-red-500" :
                                                priority === "high" ? "text-orange-500" :
                                                    priority === "moderate" ? "text-yellow-500" :
                                                        "text-green-500"
                                            }`}>
                                            {priority === "critical" ? "Kritis" :
                                                priority === "high" ? "Prioritas Tinggi" :
                                                    priority === "moderate" ? "Sedang" : "Minimal"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/dashboard"
                            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-center hover:bg-primary-light transition-colors"
                        >
                            Lihat Dashboard
                        </Link>
                        <Link
                            href="/rpi"
                            className="flex-1 py-3 border border-primary text-primary rounded-xl font-bold text-center hover:bg-primary/5 transition-colors"
                        >
                            Buat Rencana Pengembangan
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // Assessment Screen
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={goBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className={`flex items-center gap-2 px-3 py-1 ${dimensionLabels[currentDimension]?.color} text-white rounded-full`}>
                        <span className="material-symbols-outlined text-[18px]">{dimensionLabels[currentDimension]?.icon}</span>
                        <span className="text-sm font-medium">{dimensionLabels[currentDimension]?.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{answeredQuestions}/{totalQuestions}</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Question */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                {currentQuestion && (
                    <div className="w-full max-w-lg">
                        <p className="text-xs text-gray-500 mb-4 text-center">
                            {currentQuestion.framework_reference}
                        </p>

                        <h2 className="text-xl font-medium text-center mb-8 leading-relaxed">
                            {currentQuestion.question_text}
                        </h2>

                        <div className="space-y-3">
                            {likertOptions.map((option) => {
                                const isSelected = responses[currentQuestion.id] === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleResponse(option.value)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isSelected
                                                ? "border-primary bg-primary/10"
                                                : "border-border-light dark:border-border-dark hover:border-primary/50"
                                            }`}
                                    >
                                        <span className="text-2xl">{option.emoji}</span>
                                        <span className="font-medium">{option.label}</span>
                                        {isSelected && (
                                            <span className="ml-auto text-primary">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* Dimension indicators */}
            <footer className="bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark p-4">
                <div className="flex justify-center gap-2">
                    {dimensionOrder.map((dim, i) => (
                        <div
                            key={dim}
                            className={`size-3 rounded-full ${i < currentDimensionIndex ? dimensionLabels[dim].color :
                                    i === currentDimensionIndex ? "ring-2 ring-primary ring-offset-2 " + dimensionLabels[dim].color :
                                        "bg-gray-200 dark:bg-gray-700"
                                }`}
                        />
                    ))}
                </div>
            </footer>
        </div>
    );
}
