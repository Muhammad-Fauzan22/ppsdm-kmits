"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAnonymousSession } from "@/hooks/useAnonymousSession";

interface Question {
    id: string;
    dimension: string;
    subdimension: string;
    question_text: string;
    question_type: string;
    weight: number;
    module_number: number;
}

interface Module {
    module: number;
    questions: Question[];
    dimensions: string[];
    totalQuestions: number;
    estimatedMinutes: number;
}

const moduleInfo = [
    { number: 1, name: "Kognitif & Intelektual", icon: "🧠", color: "from-purple-500 to-indigo-600" },
    { number: 2, name: "Emosional & Sosial", icon: "💚", color: "from-teal-500 to-cyan-600" },
    { number: 3, name: "Kesehatan Fisik", icon: "💪", color: "from-red-500 to-pink-600" },
    { number: 4, name: "Literasi Finansial", icon: "💰", color: "from-yellow-500 to-orange-600" },
    { number: 5, name: "Karakter & Nilai", icon: "⭐", color: "from-amber-500 to-yellow-600" },
    { number: 6, name: "Spiritual & Makna", icon: "🕊️", color: "from-violet-500 to-purple-600" },
    { number: 7, name: "Lingkungan", icon: "🌿", color: "from-green-500 to-emerald-600" },
    { number: 8, name: "Karir & Profesional", icon: "💼", color: "from-blue-500 to-indigo-600" },
];

const likertOptions = [
    { value: 1, label: "Sangat Tidak Setuju" },
    { value: 2, label: "Tidak Setuju" },
    { value: 3, label: "Netral" },
    { value: 4, label: "Setuju" },
    { value: 5, label: "Sangat Setuju" },
];

export default function ComprehensiveAssessmentPage() {
    const router = useRouter();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);

    const { sessionToken, isInitialized } = useAnonymousSession();

    useEffect(() => {
        if (isInitialized) {
            loadQuestions();
        }
    }, [isInitialized]);

    const loadQuestions = async () => {
        try {
            // Fetch questions
            const questionsRes = await fetch("/api/comprehensive-assessment?all=true");
            const questionsData = await questionsRes.json();

            if (questionsData.success && questionsData.modules) {
                setModules(questionsData.modules);
            }

            // Start session
            const sessionRes = await fetch("/api/comprehensive-assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_type: "initial",
                    session_token: sessionToken
                }),
            });
            const sessionData = await sessionRes.json();

            if (sessionData.success) {
                setSessionId(sessionData.session.id);
                setStartTime(new Date());
            }
        } catch (error) {
            } finally {
            setIsLoading(false);
        }
    };

    const currentModule = modules[currentModuleIndex];
    const currentQuestion = currentModule?.questions[currentQuestionIndex];
    const moduleDetails = moduleInfo.find((m) => m.number === currentModule?.module);

    const totalQuestions = modules.reduce((sum, m) => sum + m.totalQuestions, 0);
    const answeredQuestions = Object.keys(responses).length;
    const progressPercent = Math.round((answeredQuestions / totalQuestions) * 100);

    const handleAnswer = (value: number) => {
        if (!currentQuestion) return;

        setResponses((prev) => ({
            ...prev,
            [currentQuestion.id]: value,
        }));

        // Auto-advance after short delay
        setTimeout(() => {
            if (currentQuestionIndex < currentModule.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else if (currentModuleIndex < modules.length - 1) {
                setCurrentModuleIndex(currentModuleIndex + 1);
                setCurrentQuestionIndex(0);
            }
        }, 300);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else if (currentModuleIndex > 0) {
            setCurrentModuleIndex(currentModuleIndex - 1);
            const prevModule = modules[currentModuleIndex - 1];
            setCurrentQuestionIndex(prevModule.questions.length - 1);
        }
    };

    const handleSubmit = async () => {
        if (!sessionId) return;

        setIsSubmitting(true);
        try {
            // Submit all responses
            const formattedResponses = Object.entries(responses).map(([questionId, value]) => ({
                question_id: questionId,
                response_value: value,
                response_time_seconds: Math.round((Date.now() - (startTime?.getTime() || Date.now())) / 1000 / answeredQuestions),
            }));

            await fetch("/api/comprehensive-assessment/responses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionId,
                    responses: formattedResponses,
                }),
            });

            // Complete and calculate gaps
            const completeRes = await fetch("/api/comprehensive-assessment/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId }),
            });

            const result = await completeRes.json();

            if (result.success) {
                setShowComplete(true);
            }
        } catch (error) {
            } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--its-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Memuat assessment...</p>
                </div>
            </div>
        );
    }

    if (showComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🎉</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--its-blue)] mb-4">Selamat!</h1>
                    <p className="text-gray-600 mb-6">
                        Anda telah menyelesaikan assessment komprehensif. Sistem sedang menganalisis hasil Anda untuk
                        membuat roadmap pengembangan personal.
                    </p>
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <div className="text-4xl font-bold text-[var(--its-blue)]">{answeredQuestions}</div>
                        <div className="text-sm text-gray-600">Pertanyaan Dijawab</div>
                    </div>
                    <button
                        onClick={() => router.push("/gap-analysis")}
                        className="w-full py-4 bg-gradient-to-r from-[var(--its-blue)] to-[var(--accent-blue)] text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                        Lihat Hasil Gap Analysis →
                    </button>
                </motion.div>
            </div>
        );
    }

    const isLastQuestion = currentModuleIndex === modules.length - 1 && currentQuestionIndex === currentModule?.questions.length - 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${moduleDetails?.color || "from-blue-500 to-indigo-600"} rounded-xl flex items-center justify-center shadow-lg`}>
                                <span className="text-2xl">{moduleDetails?.icon || "📊"}</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-[var(--its-blue)]">{moduleDetails?.name || "Assessment"}</h1>
                                <p className="text-xs text-gray-500">Modul {currentModule?.module || 1} dari 8</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-[var(--its-blue)]">{progressPercent}%</div>
                            <div className="text-xs text-gray-500">{answeredQuestions}/{totalQuestions}</div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[var(--its-blue)] to-[var(--accent-blue)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </header>

            {/* Module Pills */}
            <div className="max-w-2xl mx-auto px-4 py-4 overflow-x-auto">
                <div className="flex gap-2">
                    {moduleInfo.map((mod, index) => (
                        <button
                            key={mod.number}
                            onClick={() => {
                                if (index <= currentModuleIndex) {
                                    setCurrentModuleIndex(index);
                                    setCurrentQuestionIndex(0);
                                }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${index === currentModuleIndex
                                ? "bg-[var(--its-blue)] text-white shadow-lg"
                                : index < currentModuleIndex
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                            disabled={index > currentModuleIndex}
                        >
                            <span>{mod.icon}</span>
                            {index === currentModuleIndex && <span>{mod.name}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question Card */}
            <main className="max-w-2xl mx-auto px-4 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentModuleIndex}-${currentQuestionIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-3xl shadow-xl p-8"
                    >
                        {/* Question Number */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-10 h-10 bg-gradient-to-br ${moduleDetails?.color || "from-blue-500 to-indigo-600"} rounded-full flex items-center justify-center text-white font-bold`}>
                                {currentQuestionIndex + 1}
                            </div>
                            <div className="text-sm text-gray-500">
                                Pertanyaan {currentQuestionIndex + 1} dari {currentModule?.questions.length || 0}
                            </div>
                        </div>

                        {/* Question Text */}
                        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed mb-8">
                            {currentQuestion?.question_text}
                        </h2>

                        {/* Answer Options */}
                        <div className="space-y-3">
                            {likertOptions.map((option) => {
                                const isSelected = responses[currentQuestion?.id || ""] === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleAnswer(option.value)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                            ? "border-[var(--its-blue)] bg-blue-50 shadow-md"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[var(--its-blue)] bg-[var(--its-blue)]" : "border-gray-300"
                                                }`}>
                                                {isSelected && <span className="text-white">✓</span>}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-medium ${isSelected ? "text-[var(--its-blue)]" : "text-gray-700"}`}>
                                                    {option.label}
                                                </div>
                                            </div>
                                            <div className={`text-2xl font-bold ${isSelected ? "text-[var(--its-blue)]" : "text-gray-300"}`}>
                                                {option.value}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <div className="max-w-2xl mx-auto flex gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentModuleIndex === 0 && currentQuestionIndex === 0}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Sebelumnya
                    </button>
                    {isLastQuestion && answeredQuestions === totalQuestions ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Menghitung..." : "Selesaikan Assessment 🎉"}
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                if (currentQuestionIndex < (currentModule?.questions.length || 0) - 1) {
                                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                                } else if (currentModuleIndex < modules.length - 1) {
                                    setCurrentModuleIndex(currentModuleIndex + 1);
                                    setCurrentQuestionIndex(0);
                                }
                            }}
                            disabled={!responses[currentQuestion?.id || ""]}
                            className="flex-1 py-3 bg-gradient-to-r from-[var(--its-blue)] to-[var(--accent-blue)] text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Selanjutnya →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
