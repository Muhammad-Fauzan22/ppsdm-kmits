
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PHYSICAL_HEALTH_ITEMS, PhysicalHealthItem } from '@/lib/assessment/physical-health-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, CheckCircle2, ChevronLeft, AlertTriangle } from 'lucide-react';

export default function PhysicalHealthAssessmentPage() {
    const router = useRouter();
    const [started, setStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    const currentItem = PHYSICAL_HEALTH_ITEMS[currentIndex];
    const totalItems = PHYSICAL_HEALTH_ITEMS.length;
    const progress = ((currentIndex + 1) / totalItems) * 100;

    const handleStart = () => {
        setStarted(true);
        setStartTime(Date.now());
    };

    const handleAnswer = (value: number) => {
        setAnswers(prev => ({ ...prev, [currentItem.id]: value }));
        if (currentIndex < totalItems - 1) {
            setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await fetch('/api/assessment/physical-health/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses: answers, startTime })
            });

            if (!response.ok) throw new Error('Submission failed');

            const data = await response.json();
            router.push(`/assessment/physical-health/results?id=${data.assessmentId}`);
        } catch (error) {
            console.error(error);
            alert('Gagal mengirim jawaban. Silakan coba lagi.');
            setSubmitting(false);
        }
    };

    if (!started) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-lg border-t-4 border-emerald-500 dark:bg-slate-800 dark:border-emerald-500/50">
                    <CardContent className="p-8 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Health & Vitality Assessment</h1>
                            <p className="text-slate-600 dark:text-slate-300 text-lg">
                                ISPHVA-8: Asesmen Kesehatan Fisik & Vitalitas Mahasiswa
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200 space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Disclaimer Penting
                            </h3>
                            <ul className="list-disc list-inside space-y-1 ml-1 opacity-90">
                                <li>Asesmen ini bertujuan untuk kesadaran diri, bukan diagnosis medis.</li>
                                <li>Data Anda disimpan secara aman dan rahasia.</li>
                                <li>Jika Anda memiliki keluhan kesehatan serius, hubungi Klinik ITS.</li>
                            </ul>
                        </div>

                        <div className="space-y-4 text-slate-600 dark:text-slate-300">
                            <p><strong>Apa yang diukur?</strong></p>
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                <li className="flex items-center gap-2">🏃‍♂️ Aktivitas Fisik</li>
                                <li className="flex items-center gap-2">💤 Kualitas Tidur</li>
                                <li className="flex items-center gap-2">🥗 Nutrisi & Hidrasi</li>
                                <li className="flex items-center gap-2">⚡ Vitalitas Harian</li>
                            </ul>
                        </div>

                        <Button
                            size="lg"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg h-12"
                            onClick={handleStart}
                        >
                            Mulai Asesmen (5 Menit)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <span>Pertanyaan {currentIndex + 1} dari {totalItems}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-2xl"
                >
                    <Card className="shadow-lg border-0 ring-1 ring-slate-200/50 dark:ring-slate-700 dark:bg-slate-800">
                        <CardContent className="p-8">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-8 leading-relaxed">
                                {currentItem.text}
                            </h2>

                            <div className="space-y-3">
                                {currentItem.options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleAnswer(option.value)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 
                                            ${answers[currentItem.id] === option.value
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 font-medium shadow-sm'
                                                : 'border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                                            }`}
                                    >
                                        {option.text}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <Button
                                    variant="ghost"
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" /> Kembali
                                </Button>

                                {currentIndex === totalItems - 1 && (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!answers[currentItem.id] || submitting}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
                                    >
                                        {submitting ? 'Menyimpan...' : 'Selesai'}
                                        {!submitting && <CheckCircle2 className="ml-2 h-4 w-4" />}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
