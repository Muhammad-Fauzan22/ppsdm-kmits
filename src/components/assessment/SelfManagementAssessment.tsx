"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, ChevronRight, ChevronLeft, Clock, Zap, Target, MousePointer2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { calculateSelfManagementScores, SelfManagementScoreResult } from '@/lib/assessment/selfManagementScoring';

const ITEMS = [
    // Planning (6)
    { id: "SM_P1", text: "Saya membuat rencana harian atau mingguan untuk kegiatan akademik saya", dimension: "Planning" },
    { id: "SM_P2", text: "Saya menetapkan deadline yang jelas untuk setiap tugas besar", dimension: "Planning" },
    { id: "SM_P3", text: "Saya memprioritaskan tugas berdasarkan tingkat kepentingan dan urgensi", dimension: "Planning" },
    { id: "SM_P4", text: "Saya membagi tugas besar menjadi langkah-langkah kecil yang lebih mudah dikelola", dimension: "Planning" },
    { id: "SM_P5", text: "Saya meninjau dan menyesuaikan rencana saya secara berkala", dimension: "Planning" },
    { id: "SM_P6", text: "Saya mengalokasikan waktu yang cukup untuk setiap aktivitas dalam jadwal saya", dimension: "Planning" },
    // Procrastination (5)
    { id: "SM_PR1", text: "Saya sering menunda-nunda memulai tugas yang sulit atau tidak menyenangkan", dimension: "Procrastination" },
    { id: "SM_PR2", text: "Saya biasanya mengerjakan tugas tepat sebelum deadline", dimension: "Procrastination" },
    { id: "SM_PR3", text: "Saya menghabiskan waktu untuk hal-hal tidak penting daripada mengerjakan tugas prioritas", dimension: "Procrastination" },
    { id: "SM_PR4", text: "Saya mencari alasan untuk tidak memulai tugas yang seharusnya saya kerjakan", dimension: "Procrastination" },
    { id: "SM_PR5", text: "Saya kesulitan memulai tugas meskipun saya tahu pentingnya", dimension: "Procrastination" },
    // Focus (5)
    { id: "SM_F1", text: "Saya dapat berkonsentrasi pada satu tugas selama 45-60 menit tanpa teralihkan", dimension: "Focus" },
    { id: "SM_F2", text: "Saya menonaktifkan notifikasi ponsel saat mengerjakan tugas penting", dimension: "Focus" },
    { id: "SM_F3", text: "Saya dapat kembali fokus dengan cepat setelah gangguan", dimension: "Focus" },
    { id: "SM_F4", text: "Saya bekerja di lingkungan yang minim gangguan", dimension: "Focus" },
    { id: "SM_F5", text: "Saya menyadari ketika perhatian saya mulai teralihkan dan dapat mengembalikannya", dimension: "Focus" },
    // Energy (4)
    { id: "SM_E1", text: "Saya menjadwalkan tugas yang membutuhkan konsentrasi tinggi pada waktu saya paling produktif", dimension: "Energy" },
    { id: "SM_E2", text: "Saya mengambil istirahat singkat secara teratur untuk menjaga energi mental", dimension: "Energy" },
    { id: "SM_E3", text: "Saya menyesuaikan jenis pekerjaan dengan tingkat energi saya sepanjang hari", dimension: "Energy" },
    { id: "SM_E4", text: "Saya mengenali tanda-tanda kelelahan mental dan mengambil tindakan pencegahan", dimension: "Energy" }
];

interface Props {
    onComplete?: (results: any) => void;
}

export default function SelfManagementAssessment({ onComplete }: Props) {
    const [started, setStarted] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SelfManagementScoreResult | null>(null);

    const handleStart = () => setStarted(true);
    const handleResponse = (val: number) => setResponses({ ...responses, [ITEMS[currentPage].id]: val });

    const next = () => {
        if (currentPage < ITEMS.length - 1) setCurrentPage(p => p + 1);
        else finish();
    };

    const prev = () => {
        if (currentPage > 0) setCurrentPage(p => p - 1);
    };

    const finish = async () => {
        setLoading(true);
        // Simulate API delay for UX
        await new Promise(r => setTimeout(r, 800));

        const scores = calculateSelfManagementScores(responses);
        setResult(scores);
        if (onComplete) onComplete(scores);
        setLoading(false);
    };

    if (result) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl border border-slate-700 space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-2">
                    <div className="inline-block p-2 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-white">Profile Generated</h2>
                    <p className="text-slate-400">Dimensi 2: Self-Management & Productivity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <div className="relative" style={{ width: '100%', height: '320px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                { subject: 'Planning', A: result.dimensions.planning, fullMark: 100 },
                                { subject: 'Procrastination', A: result.dimensions.procrastination, fullMark: 100 },
                                { subject: 'Focus', A: result.dimensions.focus, fullMark: 100 },
                                { subject: 'Energy', A: result.dimensions.energy, fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="My Profile" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-lg bg-slate-800 border" style={{ borderColor: result.category.color }}>
                            <div className="text-sm text-slate-400 mb-1">Overall Competency</div>
                            <h3 className="text-3xl font-bold mb-2" style={{ color: result.category.color }}>
                                {result.category.label}
                            </h3>
                            <p className="text-slate-300 text-sm">{result.category.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-800 rounded-lg">
                                <div className="text-xs text-slate-400">Total Score</div>
                                <div className="text-2xl font-bold text-white">{result.total_score}</div>
                            </div>
                            <div className="p-4 bg-slate-800 rounded-lg">
                                <div className="text-xs text-slate-400">Percentile (ITS)</div>
                                <div className="text-2xl font-bold text-emerald-400">Top {100 - result.percentiles.total}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white border-b border-slate-700 pb-2">Productivity Hacks</h3>
                    <div className="grid gap-4">
                        {result.recommendations.map((rec, i) => (
                            <div key={i} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <h4 className="font-bold text-emerald-400 mb-1">{rec.title}</h4>
                                <p className="text-sm text-slate-300 mb-3">{rec.description}</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {rec.action_items.map((item, j) => (
                                        <li key={j} className="text-xs text-slate-400">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {result.recommendations.length === 0 && (
                            <div className="p-4 bg-slate-800/50 rounded-lg text-slate-400 text-sm">
                                Excellent profile! You are effectively managing your time and energy. Continue your current habits.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Info className="w-8 h-8 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-white">Assessment: Self-Management</h2>
                </div>
                <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-8">
                    <p><strong>Overview:</strong> Mengukur 4 kompetensi kunci: Perencanaan, Manajemen Penundaan, Fokus (Deep Work), dan Manajemen Energi.</p>
                    <p><strong>Scientific Basis:</strong> Dikembangkan dari integrasi teori <em>Deep Work</em> (Newport), <em>Temporal Motivation Theory</em> (Steel), dan data normatif 2,127 mahasiswa ITS.</p>
                    <p><strong>Privacy:</strong> Responses are encrypted and used solely for your personalized development plan.</p>
                </div>
                <button onClick={handleStart} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                    Start Assessment <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    const currentItem = ITEMS[currentPage];
    const progress = ((currentPage) / ITEMS.length) * 100;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Item {currentPage + 1} / {ITEMS.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                </div>
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 bg-slate-900 rounded-xl border border-slate-700 min-h-[400px] flex flex-col"
                >
                    <div className="mb-4">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 px-2 py-1 rounded inline-flex items-center gap-1">
                            {currentItem.dimension === 'Planning' && <Clock className="w-3 h-3" />}
                            {currentItem.dimension === 'Energy' && <Zap className="w-3 h-3" />}
                            {currentItem.dimension === 'Focus' && <Target className="w-3 h-3" />}
                            {currentItem.dimension === 'Procrastination' && <MousePointer2 className="w-3 h-3" />}
                            {currentItem.dimension}
                        </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed flex-grow">
                        "{currentItem.text}"
                    </h3>

                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = responses[currentItem.id] === val;
                            return (
                                <button
                                    key={val}
                                    onClick={() => handleResponse(val)}
                                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden flex items-center gap-4 ${isSelected
                                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-lg scale-[1.02]'
                                            : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-slate-600'
                                        }`}>
                                        {val}
                                    </div>
                                    <span className="font-medium">
                                        {val === 1 && "Sangat Tidak Setuju"}
                                        {val === 2 && "Tidak Setuju"}
                                        {val === 3 && "Netral"}
                                        {val === 4 && "Setuju"}
                                        {val === 5 && "kalSangat Setuju"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
                <button onClick={prev} disabled={currentPage === 0} className="px-6 py-3 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button onClick={next} disabled={!responses[currentItem.id]} className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-emerald-50 disabled:opacity-50 transition-colors flex items-center gap-2">
                    {currentPage === ITEMS.length - 1 ? 'See Results' : 'Next'} <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
