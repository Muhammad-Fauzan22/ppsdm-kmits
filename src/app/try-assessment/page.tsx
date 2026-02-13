'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, Lock, ArrowRight, Brain, Zap, Heart } from 'lucide-react';
import Link from 'next/link';

// Sample Questions (World Class Quality)
const questions = [
    {
        id: 1,
        category: 'Self Management',
        question: "Saat menghadapi deadline mendadak yang bertumpuk, apa respon instingmu?",
        options: [
            { text: "Panik dan menyalahkan keadaan", score: 1 },
            { text: "Mengerjakan apa yang bisa dikerjakan saja", score: 2 },
            { text: "Membuat prioritas dan mengatur ulang jadwal", score: 3 },
            { text: "Mendelegasikan dan negosiasi ulang deadline", score: 4 },
            { text: "Tetap tenang, prioritisasi, dan eksekusi strategis", score: 5 }
        ]
    },
    {
        id: 2,
        category: 'Growth Mindset',
        question: "Bagaimana pandanganmu terhadap kritik pedas dari dosen/atasan?",
        options: [
            { text: "Serangan personal yang menyakitkan", score: 1 },
            { text: "Tanda bahwa mereka tidak suka saya", score: 2 },
            { text: "Hal yang perlu didengar tapi bikin down", score: 3 },
            { text: "Masukan berharga untuk perbaikan", score: 4 },
            { text: "Bahan bakar untuk membuktikan kemampuan lebih baik", score: 5 }
        ]
    },
    {
        id: 3,
        category: 'Social Intelligence',
        question: "Dalam kerja kelompok, ada anggota yang pasif. Tindakanmu?",
        options: [
            { text: "Biarkan saja, saya kerjakan sendiri", score: 1 },
            { text: "Melaporkan ke dosen", score: 2 },
            { text: "Menyindir di grup chat", score: 3 },
            { text: "Mengajak bicara personal dan tanya kendalanya", score: 4 },
            { text: "Memfasilitasi diskusi agar dia dapat peran sesuai minat", score: 5 }
        ]
    }
];

export default function TryAssessmentPage() {
    const [step, setStep] = useState<'intro' | 'question' | 'analyzing' | 'result'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [direction, setDirection] = useState(0);

    const handleStart = () => {
        setStep('question');
    };

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);
        setDirection(1);

        if (currentQ < questions.length - 1) {
            setTimeout(() => {
                setCurrentQ(currentQ + 1);
            }, 300);
        } else {
            setStep('analyzing');
        }
    };

    // Analyzing Simulation
    useEffect(() => {
        if (step === 'analyzing') {
            const timer = setTimeout(() => {
                setStep('result');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Calculate Fake Result
    const averageScore = answers.reduce((a, b) => a + b, 0) / answers.length || 0;
    const potentialLevel = averageScore > 4 ? 'High Potential' : averageScore > 3 ? 'Grooming Talent' : 'Need Development';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#0A0F1A] z-0" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    {/* STEP 1: INTRO */}
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl mb-8 shadow-2xl shadow-blue-500/30">
                                <Brain className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Potensi Tersembunyimu <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                    Siap Terungkap
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                                Coba simulasi assessment 3-pertanyaan ini untuk melihat bagaimana PPSDM memetakan profil karir masa depanmu.
                            </p>
                            <button
                                onClick={handleStart}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform"
                            >
                                Mulai Assessment Cepat
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="mt-6 text-sm text-slate-500">
                                *Hanya butuh 45 detik • Data awal disimpan
                            </p>
                        </motion.div>
                    )}

                    {/* STEP 2: QUESTIONS */}
                    {step === 'question' && (
                        <motion.div
                            key={`q-${currentQ}`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                                    Pertanyaan {currentQ + 1}/{questions.length}
                                </span>
                                <span className="text-sm text-slate-500">
                                    {questions[currentQ].category}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-slate-800 rounded-full mb-10 overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: `${(currentQ / questions.length) * 100}%` }}
                                    animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                                />
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                                {questions[currentQ].question}
                            </h2>

                            <div className="space-y-4">
                                {questions[currentQ].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt.score)}
                                        className="w-full p-5 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg text-slate-200 group-hover:text-white transition-colors">
                                                {opt.text}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: ANALYZING */}
                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap className="w-10 h-10 text-blue-400 animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Menganalisis Jawaban...</h2>
                            <p className="text-slate-400">Membandingkan dengan 9 Dimensi Pengembangan ITS</p>
                        </motion.div>
                    )}

                    {/* STEP 4: RESULT / LOCKED */}
                    {step === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-slate-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
                        >
                            <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-bold mb-6">
                                Analisis Selesai
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">
                                Profil Awal: {potentialLevel}
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                                Kamu memiliki kecenderungan kuat pada <strong>{questions[1].category}</strong>. Ini adalah aset besar untuk karir di industri multinasional.
                            </p>

                            {/* 3D Graphic Placeholder */}
                            <div className="h-64 mb-8 bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                {/* CSS 3D Cube Effect */}
                                <div className="perspective-1000 w-32 h-32 animate-[spin_10s_linear_infinite] preserve-3d">
                                    <div className="w-full h-full bg-blue-500/30 border border-blue-400/50 absolute transform translate-z-[64px]" />
                                    <div className="w-full h-full bg-purple-500/30 border border-purple-400/50 absolute transform rotate-y-90 translate-z-[64px]" />
                                    <div className="w-full h-full bg-cyan-500/30 border border-cyan-400/50 absolute transform rotate-y-180 translate-z-[64px]" />
                                    <div className="w-full h-full bg-indigo-500/30 border border-indigo-400/50 absolute transform rotate-y-270 translate-z-[64px]" />
                                    <div className="w-full h-full bg-blue-600/30 border border-blue-400/50 absolute transform rotate-x-90 translate-z-[64px]" />
                                    <div className="w-full h-full bg-purple-600/30 border border-purple-400/50 absolute transform rotate-x-full translate-z-[64px]" />
                                </div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-all group-hover:backdrop-blur-md">
                                    <Lock className="w-12 h-12 text-white/50 mb-2" />
                                    <span className="text-white font-bold">Laporan Lengkap Terkunci</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-slate-300">
                                    Untuk melihat grafik analisis 9 dimensi lengkap dan rekomendasi karir:
                                </p>
                                <Link 
                                    href="/auth/register?ref=assessment_result" 
                                    className="block w-full py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF4081] text-white rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-shadow text-center"
                                >
                                    Buka Hasil Lengkap (Gratis)
                                </Link>
                                <Link href="/auth/login" className="block text-sm text-slate-500 hover:text-white transition-colors">
                                    Sudah punya akun? Masuk
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
