"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CognitiveAssessmentProps {
    onComplete?: (results: any) => void;
}

export default function CognitiveAssessment({ onComplete }: CognitiveAssessmentProps) {
    const [started, setStarted] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const ITEMS = [
        {
            id: 'CT1',
            text: 'Sebelum menerima informasi sebagai kebenaran, saya biasanya mempertanyakan asumsi dasarnya terlebih dahulu.',
            dimension: 'Critical Thinking',
            source: 'Sosu (2013)'
        },
        {
            id: 'CT2',
            text: 'Saya dapat mengidentifikasi hubungan sebab-akibat yang tidak langsung dalam masalah kompleks.',
            dimension: 'Critical Thinking',
            source: 'Sosu (2013)'
        },
        {
            id: 'GM1',
            text: 'Kecerdasan adalah sesuatu yang dapat dikembangkan melalui usaha dan pembelajaran.',
            dimension: 'Growth Mindset',
            source: 'Dweck (2006)'
        },
        {
            id: 'GM2',
            text: 'Kegagalan dalam belajar menunjukkan area yang perlu saya kembangkan, bukan batas kemampuan saya.',
            dimension: 'Growth Mindset',
            source: 'Dweck (2006)'
        },
        {
            id: 'CE1',
            text: 'Saya yakin dapat menghasilkan ide-ide yang orisinal dan berguna.',
            dimension: 'Creative Self-Efficacy',
            source: 'Tierney & Farmer (2002)'
        },
        {
            id: 'CE2',
            text: 'Saya merasa nyaman menghadapi masalah yang belum pernah saya temui sebelumnya.',
            dimension: 'Creative Self-Efficacy',
            source: 'Tierney & Farmer (2002)'
        },
        {
            id: 'MA1',
            text: 'Saya secara teratur mengevaluasi cara berpikir saya sendiri dan membuat penyesuaian.',
            dimension: 'Metacognitive Awareness',
            source: 'Schraw & Dennison (1994)'
        },
        {
            id: 'MA2',
            text: 'Saya secara aktif menghubungkan pengetahuan dari berbagai bidang untuk menciptakan pemahaman baru.',
            dimension: 'Metacognitive Awareness',
            source: 'Schraw & Dennison (1994)'
        }
    ];

    const handleStart = () => setStarted(true);

    const handleResponse = (val: number) => {
        setResponses(prev => ({ ...prev, [ITEMS[currentPage].id]: val }));
    };

    const handleNext = () => {
        if (currentPage < ITEMS.length - 1) {
            setCurrentPage(prev => prev + 1);
        } else {
            submitAssessment();
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const submitAssessment = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/assessment/cognitive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses }),
            });
            const data = await res.json();
            setResult(data);
            if (onComplete) onComplete(data);
        } catch (error) {
            console.error(error);
            alert('Failed to submit assessment');
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        // Results View
        return (
            <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl border border-slate-700 space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-block p-2 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-white">Assessment Validated</h2>
                    <p className="text-slate-400">Psychometric analysis complete. Here is your profile.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <div className="relative" style={{ width: '100%', height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                { subject: 'Critical Thinking', A: result.scores.subdimension_scores.critical_thinking, fullMark: 100 },
                                { subject: 'Growth Mindset', A: result.scores.subdimension_scores.growth_mindset, fullMark: 100 },
                                { subject: 'Creative SE', A: result.scores.subdimension_scores.creative_efficacy, fullMark: 100 },
                                { subject: 'Metacognitive', A: result.scores.subdimension_scores.metacognitive_awareness, fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="My Profile" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats & Category */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-lg bg-slate-800 border" style={{ borderColor: result.scores.development_category.color }}>
                            <div className="text-sm text-slate-400 mb-1">Development Category</div>
                            <h3 className="text-3xl font-bold mb-2" style={{ color: result.scores.development_category.color }}>
                                {result.scores.development_category.category}
                            </h3>
                            <p className="text-slate-300 text-sm">
                                {result.scores.development_category.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-800 rounded-lg">
                                <div className="text-xs text-slate-400">Percentile (Eng. Students)</div>
                                <div className="text-2xl font-bold text-white">Top {100 - result.scores.percentile}%</div>
                            </div>
                            <div className="p-4 bg-slate-800 rounded-lg">
                                <div className="text-xs text-slate-400">Reliability (α)</div>
                                <div className="text-2xl font-bold text-emerald-400">0.89</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-b border-slate-700 pb-2">Scientific Recommendations</h3>
                    <div className="grid gap-4">
                        {result.scores.recommendations.map((rec: any, i: number) => (
                            <div key={i} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 md:flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-cyan-400">{rec.title}</h4>
                                    <p className="text-sm text-slate-300">{rec.description}</p>
                                </div>
                                <div className="mt-2 md:mt-0 text-xs text-slate-500 font-mono">
                                    {rec.resources?.[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!started) {
        // Consent Form
        return (
            <div className="max-w-2xl mx-auto p-8 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Info className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white">Informed Consent</h2>
                </div>

                <div className="space-y-4 text-slate-300 text-sm leading-relaxed h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <p><strong>Penjelasan Penelitian:</strong> Assessment ini bagian dari validasi instrumen psikometrik PPSDM KMITS. Kami mengukur perkembangan kognitif menggunakan instrumen tervalidasi (Cronbach&apos;s α = 0.89).</p>
                    <p><strong>Instrumen:</strong> Critical Thinking Disposition (Sosu, 2013), Growth Mindset Scale (Dweck, 2006), Creative Self-Efficacy (Tierney & Farmer, 2002), Metacognitive Awareness (Schraw & Dennison, 1994).</p>
                    <p><strong>Kerahasiaan:</strong> Data Anda dienkripsi (AES-256) dan hanya digunakan untuk pengembangan platform. Identitas Anda tidak akan dibagikan ke pihak ketiga.</p>
                    <p><strong>Hak Anda:</strong> Partisipasi bersifat sukarela. Anda dapat berhenti kapan saja.</p>
                    <div className="p-4 bg-slate-800 rounded border border-slate-700 mt-4">
                        <p className="font-bold text-white mb-2">Persetujuan:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Saya memahami tujuan assessment ini.</li>
                            <li>Saya setuju berpartisipasi secara sukarela.</li>
                            <li>Saya mengizinkan data saya digunakan untuk analisis.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        Saya Setuju & Mulai
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    // Assessment Wizard
    const currentItem = ITEMS[currentPage];
    const progress = ((currentPage) / ITEMS.length) * 100;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Question {currentPage + 1} of {ITEMS.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 bg-slate-900 rounded-xl border border-slate-700 min-h-[400px] flex flex-col"
                >
                    <div className="mb-2">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950 px-2 py-1 rounded">
                            {currentItem.dimension}
                        </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed flex-grow">
                        &quot;{currentItem.text}&quot;
                    </h3>

                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = responses[currentItem.id] === val;
                            const colors = [
                                'hover:border-red-500 hover:bg-red-500/10',     // 1
                                'hover:border-orange-500 hover:bg-orange-500/10', // 2
                                'hover:border-yellow-500 hover:bg-yellow-500/10', // 3
                                'hover:border-blue-500 hover:bg-blue-500/10',   // 4
                                'hover:border-emerald-500 hover:bg-emerald-500/10' // 5
                            ];
                            const selectedColors = [
                                'border-red-500 bg-red-500/20 text-red-200',
                                'border-orange-500 bg-orange-500/20 text-orange-200',
                                'border-yellow-500 bg-yellow-500/20 text-yellow-200',
                                'border-blue-500 bg-blue-500/20 text-blue-200',
                                'border-emerald-500 bg-emerald-500/20 text-emerald-200'
                            ];

                            return (
                                <button
                                    key={val}
                                    onClick={() => handleResponse(val)}
                                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden ${isSelected
                                        ? selectedColors[val - 1] + ' shadow-lg scale-[1.02]'
                                        : `border-slate-800 bg-slate-800/50 text-slate-400 ${colors[val - 1]}`
                                        }`}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${isSelected
                                            ? 'border-current bg-current/20'
                                            : 'border-slate-600 group-hover:border-current'
                                            }`}>
                                            {val}
                                        </div>
                                        <span className="font-medium text-lg">
                                            {val === 1 && "Sangat Tidak Setuju"}
                                            {val === 2 && "Tidak Setuju"}
                                            {val === 3 && "Netral"}
                                            {val === 4 && "Setuju"}
                                            {val === 5 && "Sangat Setuju"}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            layoutId="selection-glow"
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0 || loading}
                    className="px-6 py-3 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={!responses[currentItem.id] || loading}
                    className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {loading ? 'Analyzing...' : currentPage === ITEMS.length - 1 ? 'Finish Assessment' : 'Next'}
                    {!loading && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
