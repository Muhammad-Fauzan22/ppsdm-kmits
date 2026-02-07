'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Brain, Target, Heart, Zap } from 'lucide-react';

/**
 * MiniQuiz - Interactive assessment teaser for engagement
 * Features: 3 quick questions, instant personality hint, CTA to full assessment
 */

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        text: string;
        dimension: string;
        icon: React.ReactNode;
    }[];
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: 'Saat menghadapi masalah kompleks, kamu cenderung...',
        options: [
            { text: 'Menganalisis secara logis dan sistematis', dimension: 'Kognitif', icon: <Brain className="w-4 h-4" /> },
            { text: 'Memikirkan dampaknya terhadap orang lain', dimension: 'Emosional', icon: <Heart className="w-4 h-4" /> },
            { text: 'Langsung mencoba berbagai solusi', dimension: 'Eksekusi', icon: <Zap className="w-4 h-4" /> },
            { text: 'Menyusun rencana terstruktur', dimension: 'Manajemen', icon: <Target className="w-4 h-4" /> },
        ],
    },
    {
        id: 2,
        question: 'Dalam tim, kamu lebih sering berperan sebagai...',
        options: [
            { text: 'Pemikir yang menghasilkan ide-ide baru', dimension: 'Kognitif', icon: <Brain className="w-4 h-4" /> },
            { text: 'Perekat yang menjaga harmoni tim', dimension: 'Emosional', icon: <Heart className="w-4 h-4" /> },
            { text: 'Eksekutor yang mewujudkan rencana', dimension: 'Eksekusi', icon: <Zap className="w-4 h-4" /> },
            { text: 'Koordinator yang mengatur jalannya proyek', dimension: 'Manajemen', icon: <Target className="w-4 h-4" /> },
        ],
    },
    {
        id: 3,
        question: 'Apa yang paling membuatmu frustasi?',
        options: [
            { text: 'Keputusan yang tidak berdasarkan data', dimension: 'Kognitif', icon: <Brain className="w-4 h-4" /> },
            { text: 'Konflik yang tidak terselesaikan', dimension: 'Emosional', icon: <Heart className="w-4 h-4" /> },
            { text: 'Proyek yang berlarut-larut tanpa hasil', dimension: 'Eksekusi', icon: <Zap className="w-4 h-4" /> },
            { text: 'Ketidakjelasan tujuan dan prioritas', dimension: 'Manajemen', icon: <Target className="w-4 h-4" /> },
        ],
    },
];

const dimensionResults: Record<string, { title: string; description: string; color: string; icon: React.ReactNode }> = {
    Kognitif: {
        title: 'The Thinker',
        description: 'Kamu unggul dalam analisis dan pemecahan masalah. Potensimu terletak pada kemampuan berpikir kritis dan sistematis.',
        color: 'from-blue-500 to-cyan-500',
        icon: <Brain className="w-8 h-8" />,
    },
    Emosional: {
        title: 'The Connector',
        description: 'Kamu memiliki EQ tinggi dan kemampuan interpersonal yang kuat. Kamu natural dalam membangun hubungan.',
        color: 'from-pink-500 to-rose-500',
        icon: <Heart className="w-8 h-8" />,
    },
    Eksekusi: {
        title: 'The Doer',
        description: 'Kamu berorientasi pada aksi dan hasil. Kemampuanmu terletak pada mewujudkan ide menjadi kenyataan.',
        color: 'from-orange-500 to-red-500',
        icon: <Zap className="w-8 h-8" />,
    },
    Manajemen: {
        title: 'The Organizer',
        description: 'Kamu ahli dalam perencanaan dan koordinasi. Kemampuanmu terletak pada mengatur dan mengoptimalkan proses.',
        color: 'from-green-500 to-emerald-500',
        icon: <Target className="w-8 h-8" />,
    },
};

export function MiniQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const handleAnswer = (dimension: string) => {
        const newAnswers = [...answers, dimension];
        setAnswers(newAnswers);

        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsComplete(true);
        }
    };

    const getResult = () => {
        const counts: Record<string, number> = {};
        answers.forEach((d) => {
            counts[d] = (counts[d] || 0) + 1;
        });

        let maxDimension = 'Kognitif';
        let maxCount = 0;
        Object.entries(counts).forEach(([dim, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxDimension = dim;
            }
        });

        return dimensionResults[maxDimension];
    };

    const reset = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setIsComplete(false);
        setIsStarted(false);
    };

    if (!isStarted) {
        return (
            <section className="py-16 bg-gradient-to-b from-[#0D1220] to-[#0A0F1A]">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#1A1F2E] to-[#0D1220] border border-white/10"
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center">
                            <Brain className="w-8 h-8 text-black" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Temukan Tipe Kepribadianmu
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                            Jawab 3 pertanyaan cepat untuk mendapatkan gambaran awal tentang kekuatan dominanmu.
                        </p>

                        <button
                            onClick={() => setIsStarted(true)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF4081] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all hover:scale-105"
                        >
                            Mulai Quiz 30 Detik
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="mt-4 text-xs text-slate-500">
                            Gratis • Tanpa login • Hasil instan
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    if (isComplete) {
        const result = getResult();

        return (
            <section className="py-16 bg-gradient-to-b from-[#0D1220] to-[#0A0F1A]">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#1A1F2E] to-[#0D1220] border border-white/10"
                    >
                        {/* Result Badge */}
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${result.color} flex items-center justify-center text-white`}>
                            {result.icon}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-[#FFD700] text-sm font-semibold mb-2">Hasilmu:</p>
                            <h3 className="text-3xl font-bold text-white mb-3">{result.title}</h3>
                            <p className="text-slate-400 mb-6 max-w-md mx-auto">{result.description}</p>
                        </motion.div>

                        {/* Teaser for full result */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                            <p className="text-sm text-slate-300">
                                Ini baru <span className="text-[#FFD700] font-semibold">10%</span> dari potensimu.
                                Dapatkan analisis lengkap <span className="text-white font-semibold">9 dimensi</span> dengan assessment penuh.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF4081] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all hover:scale-105"
                            >
                                Ambil Assessment Lengkap
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={reset}
                                className="px-6 py-4 text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                Ulangi Quiz
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    const question = quizQuestions[currentQuestion];

    return (
        <section className="py-16 bg-gradient-to-b from-[#0D1220] to-[#0A0F1A]">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-[#1A1F2E] to-[#0D1220] border border-white/10"
                >
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm text-slate-500">
                            Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
                        </span>
                        <div className="flex gap-1">
                            {quizQuestions.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-1 rounded-full transition-colors ${i <= currentQuestion ? 'bg-[#FF6B00]' : 'bg-white/10'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Question */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                        {question.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleAnswer(option.dimension)}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/5 transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-[#FF6B00] transition-colors">
                                        {option.icon}
                                    </div>
                                    <span className="text-slate-300 group-hover:text-white transition-colors">
                                        {option.text}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default MiniQuiz;
