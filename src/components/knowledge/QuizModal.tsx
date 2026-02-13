'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
    question: string;
    options: string[];
    answer: number;
}

interface QuizModalProps {
    questions: QuizQuestion[];
    isOpen: boolean;
    onClose: () => void;
}

/**
 * QuizModal — Interactive engineering quiz generated from article metadata.
 * Shows one question at a time with immediate feedback.
 */
export default function QuizModal({ questions, isOpen, onClose }: QuizModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    if (!questions.length) return null;

    const current = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isCorrect = selectedAnswer === current?.answer;

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        if (index === current.answer) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setShowResult(true);
        } else {
            setCurrentIndex(i => i + 1);
            setSelectedAnswer(null);
        }
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🧠</span>
                                <h3 className="text-lg font-bold text-white">Kuis Teknik</h3>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-slate-400 hover:text-white transition p-1"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {showResult ? (
                            /* ─── Results ─────────── */
                            <div className="text-center py-6">
                                <div className="text-5xl mb-4">
                                    {score === questions.length ? '🏆' : score >= questions.length / 2 ? '👏' : '📚'}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">
                                    Skor: {score}/{questions.length}
                                </h4>
                                <p className="text-slate-400 mb-6">
                                    {score === questions.length
                                        ? 'Sempurna! Kamu ahli teknik! 🎉'
                                        : score >= questions.length / 2
                                            ? 'Bagus! Terus pelajari lebih banyak!'
                                            : 'Jangan menyerah! Baca artikelnya lagi 💪'}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition text-sm font-medium"
                                    >
                                        Coba Lagi
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm font-medium"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ─── Question ────────── */
                            <>
                                {/* Progress */}
                                <div className="flex gap-1.5 mb-4">
                                    {questions.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors ${i < currentIndex
                                                    ? 'bg-green-500'
                                                    : i === currentIndex
                                                        ? 'bg-blue-500'
                                                        : 'bg-slate-700'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <p className="text-xs text-slate-500 mb-2">
                                    Pertanyaan {currentIndex + 1} dari {questions.length}
                                </p>

                                <p className="text-white font-medium mb-4 leading-relaxed">
                                    {current.question}
                                </p>

                                {/* Options */}
                                <div className="space-y-2 mb-5">
                                    {current.options.map((option, i) => {
                                        const isSelected = selectedAnswer === i;
                                        const isCorrectOption = i === current.answer;
                                        let bg = 'bg-slate-700/50 hover:bg-slate-700 border-slate-600/50';

                                        if (selectedAnswer !== null) {
                                            if (isCorrectOption) bg = 'bg-green-600/20 border-green-500/50';
                                            else if (isSelected) bg = 'bg-red-600/20 border-red-500/50';
                                        }

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswer(i)}
                                                disabled={selectedAnswer !== null}
                                                className={`w-full text-left p-3 rounded-xl border transition text-sm ${bg} ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <span className="text-slate-400 font-mono text-xs mt-0.5">
                                                        {String.fromCharCode(65 + i)}.
                                                    </span>
                                                    <span className="text-slate-200">{option}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Feedback & Next */}
                                {selectedAnswer !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between"
                                    >
                                        <p className={`text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                            {isCorrect ? '✅ Benar!' : '❌ Salah'}
                                        </p>
                                        <button
                                            onClick={handleNext}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition text-sm font-medium"
                                        >
                                            {isLastQuestion ? 'Lihat Hasil' : 'Selanjutnya →'}
                                        </button>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
