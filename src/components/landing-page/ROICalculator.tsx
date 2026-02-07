'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, Calculator } from 'lucide-react';

/**
 * ROICalculator - Interactive tool to demonstrate value of development
 * Calculates "Career Readiness Score" & "Potential Starting Salary" based on inputs
 */

export function ROICalculator() {
    const [gpa, setGpa] = useState(3.0);
    const [experience, setExperience] = useState(1);
    const [softSkills, setSoftSkills] = useState(5);
    const [english, setEnglish] = useState(5);

    const calculateScore = () => {
        // Formula: (GPA * 10) + (Exp * 5) + (Soft * 3) + (Eng * 2)
        // Max roughly: 40 + 25 + 30 + 20 = 115 -> normalized to 100
        const rawScore = (gpa * 10) + (Math.min(experience, 5) * 5) + (softSkills * 3) + (english * 2);
        // Normalize to 0-100 (approx)
        return Math.min(Math.round((rawScore / 95) * 100), 100);
    };

    const calculateSalary = () => {
        const score = calculateScore();
        // Base salary range in millions IDR
        const baseLow = 5;
        const baseHigh = 7;

        // Multiplier based on score
        const multiplier = 1 + (score / 100);

        return {
            low: (baseLow * multiplier).toFixed(1),
            high: (baseHigh * multiplier).toFixed(1)
        };
    };

    const score = calculateScore();
    const salary = calculateSalary();

    return (
        <section className="py-20 bg-slate-950">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4"
                    >
                        <Calculator className="w-4 h-4" />
                        <span className="text-sm font-semibold">Kalkulator Potensi Karir</span>
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Hitung Nilai Jualmu di Industri
                    </h2>
                    <p className="text-slate-400">
                        Simulasi sederhana bagaimana pengembangan diri holistic meningkatkan career value kamu.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 bg-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                IPK Saat Ini ({gpa.toFixed(1)})
                            </label>
                            <input
                                type="range"
                                min="2.0"
                                max="4.0"
                                step="0.1"
                                value={gpa}
                                onChange={(e) => setGpa(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Pengalaman Organisasi ({experience} Tahun)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="1"
                                value={experience}
                                onChange={(e) => setExperience(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Level Soft Skills ({softSkills}/10)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={softSkills}
                                onChange={(e) => setSoftSkills(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Kemampuan Bahasa Inggris ({english}/10)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={english}
                                onChange={(e) => setEnglish(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>

                        <p className="text-xs text-slate-500 pt-4 italic">
                            *Estimasi berdasarkan data entry-level job market 2025
                        </p>
                    </div>

                    {/* Results */}
                    <div className="bg-slate-950 rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

                        <div className="relative z-10 w-full">
                            <div className="mb-2 text-slate-400 font-medium">Employability Score</div>
                            <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                    {score}
                                </span>
                                <span className="text-2xl text-slate-600">/100</span>
                            </div>

                            <div className="h-2 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score}%` }}
                                    transition={{ type: "spring", stiffness: 50 }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2 mb-1 text-green-400">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Potensi Gaji</span>
                                    </div>
                                    <div className="text-lg font-bold text-white">
                                        Rp {salary.low}-{salary.high}jt
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2 mb-1 text-purple-400">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Level Karir</span>
                                    </div>
                                    <div className="text-lg font-bold text-white">
                                        {score > 80 ? 'Fast Track' : score > 60 ? 'Competitive' : 'Standard'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ROICalculator;
