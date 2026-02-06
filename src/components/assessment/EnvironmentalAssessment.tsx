"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf,
    Globe,
    Smartphone,
    Scale,
    Zap,
    Users,
    ShoppingBag,
    Megaphone,
    ChevronRight,
    Info,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateEnvironmentalScore, EnvironmentalResponse, EnvironmentalResult } from '@/lib/assessment/environmentalScoring';
import { Label } from '@/components/ui/label';

// Questions Mapping
const QUESTIONS = [
    // Awareness
    { id: 'EA1', text: "Aktivitas manusia merupakan penyebab utama perubahan iklim", dim: "Awareness", icon: Globe },
    { id: 'EA2', text: "Alam memiliki kapasitas terbatas untuk menanggung dampak industri", dim: "Awareness", icon: Globe },
    { id: 'EA3', text: "Keseimbangan alam sangat rapuh", dim: "Awareness", icon: Globe },
    { id: 'EA4', text: "Manusia berpotensi menyebabkan bencana ekologis besar", dim: "Awareness", icon: Globe },
    // Behavior
    { id: 'SB1', text: "Saya menggunakan tas belanja reusable", dim: "Sustainable Behavior", icon: ShoppingBag },
    { id: 'SB2', text: "Saya memilih produk dengan kemasan minimal", dim: "Sustainable Behavior", icon: ShoppingBag },
    { id: 'SB3', text: "Saya menghindari pembelian barang impulsi", dim: "Sustainable Behavior", icon: ShoppingBag },
    { id: 'SB4', text: "Saya memperbaiki barang rusak sebelum membeli baru", dim: "Sustainable Behavior", icon: ShoppingBag },
    // WLB
    { id: 'WLB1', text: "Saya memisahkan waktu studi dan pribadi", dim: "Work-Life Balance", icon: Scale },
    { id: 'WLB2', text: "Saya puas dengan keseimbangan hidup saya", dim: "Work-Life Balance", icon: Scale },
    { id: 'WLB3', text: "Tugas kuliah tidak mengganggu waktu istirahat saya", dim: "Work-Life Balance", icon: Scale },
    { id: 'WLB4', text: "Saya punya rutinitas harian yang seimbang", dim: "Work-Life Balance", icon: Scale },
    // Digital
    { id: 'DW1', text: "Saya bisa mengontrol waktu medsos saya", dim: "Digital Wellbeing", icon: Smartphone },
    { id: 'DW2', text: "Gadget tidak mengganggu produktivitas saya", dim: "Digital Wellbeing", icon: Smartphone },
    { id: 'DW3', text: "Saya rutin mengambil jeda digital (break)", dim: "Digital Wellbeing", icon: Smartphone },
    { id: 'DW4', text: "Saya bisa hadir di momen nyata tanpa hp", dim: "Digital Wellbeing", icon: Smartphone },
    // Minimalism
    { id: 'MO1', text: "Say lebih menghargai pengalaman daripada barang", dim: "Minimalism", icon: Leaf },
    { id: 'MO2', text: "Saya bahagia dengan barang sedikit tapi bermakna", dim: "Minimalism", icon: Leaf },
    { id: 'MO3', text: "Saya rutin mengurangi barang tak perlu", dim: "Minimalism", icon: Leaf },
    { id: 'MO4', text: "Kebahagiaan saya tidak bergantung pembelian baru", dim: "Minimalism", icon: Leaf },
    // Energy
    { id: 'EC1', text: "Saya matikan lampu/listrik saat tak dipakai", dim: "Energy Conservation", icon: Zap },
    { id: 'EC2', text: "Saya pilih jalan kaki/transport umum jk mungkin", dim: "Energy Conservation", icon: Zap },
    { id: 'EC3', text: "Saya hemat air saat mandi/cuci", dim: "Energy Conservation", icon: Zap },
    { id: 'EC4', text: "Saya pilih elektronik hemat energi", dim: "Energy Conservation", icon: Zap },
    // Community
    { id: 'CE1', text: "Saya aktif di kegiatan lingkungan kampus", dim: "Community", icon: Users },
    { id: 'CE2', text: "Saya ikut acara kesadaran lingkungan", dim: "Community", icon: Users },
    { id: 'CE3', text: "Saya berkontribusi di kampanye lingkungan", dim: "Community", icon: Users },
    { id: 'CE4', text: "Saya merasa bertanggung jawab terlibat isu sekitar", dim: "Community", icon: Users },
    // Advocacy
    { id: 'EA2_1', text: "Saya mendorong teman peduli lingkungan", dim: "Advocacy", icon: Megaphone },
    { id: 'EA2_2', text: "Saya berbagi info isu lingkungan di medsos", dim: "Advocacy", icon: Megaphone },
    { id: 'EA2_3', text: "Saya berani menyuarakan keprihatinan lingkungan", dim: "Advocacy", icon: Megaphone },
    { id: 'EA2_4', text: "Saya mendukung kebijakan ramah lingkungan", dim: "Advocacy", icon: Megaphone },
];

export default function EnvironmentalAssessment() {
    const [step, setStep] = useState<'intro' | 'questions' | 'results'>('intro');
    const [idx, setIdx] = useState(0);
    const [responses, setResponses] = useState<EnvironmentalResponse>({});
    const [result, setResult] = useState<EnvironmentalResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [consent, setConsent] = useState(false);

    const handleAnswer = (val: number) => {
        const q = QUESTIONS[idx];
        const newRes = { ...responses, [q.id]: val };
        setResponses(newRes);

        if (idx < QUESTIONS.length - 1) {
            setTimeout(() => setIdx(prev => prev + 1), 150);
        } else {
            finish(newRes);
        }
    };

    const finish = async (finalRes: EnvironmentalResponse) => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 2000));
        setResult(calculateEnvironmentalScore(finalRes));
        setStep('results');
        setIsSubmitting(false);
    };

    // --- RENDERING ---

    if (step === 'intro') {
        return (
            <Card className="max-w-2xl mx-auto border-emerald-100 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 text-center py-10">
                    <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                        <Leaf className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">Environmental & Lifestyle</CardTitle>
                    <CardDescription className="text-lg">Sustainable Living & Digital Wellbeing Assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pt-8">
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-sm text-emerald-800 space-y-2">
                        <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /> Mengukur kesadaran lingkungan & jejak karbon.</p>
                        <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /> Evaluasi keseimbangan digital & work-life balance.</p>
                        <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5" /> Rekomendasi personal untuk gaya hidup berkelanjutan.</p>
                    </div>

                    <div className="flex items-start gap-3 p-4 border rounded-xl bg-gray-50">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={consent}
                            onChange={e => setConsent(e.target.checked)}
                            className="mt-1 h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer select-none">
                            Saya setuju untuk berpartisipasi. Data saya akan diolah secara anonim untuk tujuan pengembangan diri dan riset ilmiah.
                            <br /><span className="text-xs text-gray-400 mt-1 block">Validasi N=1,800 Mahasiswa Indonesia (2024)</span>
                        </label>
                    </div>

                    <Button
                        disabled={!consent}
                        onClick={() => setStep('questions')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg rounded-xl shadow-lg shadow-emerald-200"
                    >
                        Mulai Assessment
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (step === 'results' && result) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-20">
                {/* Header Result */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-emerald-100 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                        <CardContent className="p-8 text-center pt-12">
                            <div className="mx-auto w-32 h-32 rounded-full border-8 border-emerald-50 flex items-center justify-center mb-6 bg-white shadow-sm">
                                <span className="text-4xl font-black text-emerald-700">{result.normalizedScore}</span>
                            </div>
                            <h2 className={`text-2xl font-bold mb-2 ${result.categoryColor}`}>{result.category}</h2>
                            <p className="text-gray-600 italic text-sm mb-6">{result.interpretation}</p>

                            <div className="flex justify-center gap-4 text-xs font-semibold text-gray-500">
                                <span className="bg-gray-100 px-3 py-1 rounded-full">Percentile: {result.percentile}%</span>
                                <span className="bg-gray-100 px-3 py-1 rounded-full">T-Score: {result.tScore}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-400" />
                                Carbon Footprint Estimate
                            </CardTitle>
                            <CardDescription className="text-gray-400">Perkiraan emisi tahunan Anda</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <div className="text-5xl font-mono font-bold mb-2 text-emerald-300">
                                {result.carbonFootprint}
                                <span className="text-lg text-gray-400 ml-2 font-sans font-normal">kg CO2/thn</span>
                            </div>
                            <p className="text-sm text-gray-400 text-center max-w-xs mt-4">
                                {result.carbonFootprint < 3000 ? "Luar biasa! Jejak karbon Anda di bawah rata-rata mahasiswa." : "Cukup tinggi. Ada peluang besar untuk efisiensi."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscales Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ScoreBox label="Awareness" val={result.subscaleScores.awareness} icon={Globe} />
                    <ScoreBox label="Behavior" val={result.subscaleScores.behavior} icon={ShoppingBag} />
                    <ScoreBox label="Work-Life" val={result.subscaleScores.wlb} icon={Scale} />
                    <ScoreBox label="Digital" val={result.subscaleScores.digital} icon={Smartphone} />
                    <ScoreBox label="Minimalism" val={result.subscaleScores.minimalism} icon={Leaf} />
                    <ScoreBox label="Energy" val={result.subscaleScores.energy} icon={Zap} />
                    <ScoreBox label="Community" val={result.subscaleScores.community} icon={Users} />
                    <ScoreBox label="Advocacy" val={result.subscaleScores.advocacy} icon={Megaphone} />
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-emerald-600" /> Rekomendasi Aksi
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {result.recommendations.map((rec, i) => (
                            <Card key={i} className="border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                                <CardContent className="p-5">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {rec.priority} Priority
                                    </span>
                                    <h4 className="font-bold text-gray-900 mb-1">{rec.action}</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">{rec.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const q = QUESTIONS[idx];
    const progress = ((idx + 1) / QUESTIONS.length) * 100;

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="mb-10">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{q.dim}</span>
                    <span className="text-xs font-semibold text-gray-400">{idx + 1}/{QUESTIONS.length}</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-gray-100" indicatorColor="bg-emerald-500" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="min-h-[300px]"
                >
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm">
                            <q.icon className="w-10 h-10" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-medium text-gray-800 text-center mb-10 leading-snug">
                        {q.text}
                    </h2>

                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                onClick={() => handleAnswer(val)}
                                className="w-full p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between group bg-white"
                            >
                                <span className="text-gray-600 font-medium group-hover:text-emerald-900">
                                    {val === 1 ? "Sangat Tidak Setuju" : val === 2 ? "Tidak Setuju" : val === 3 ? "Netral" : val === 4 ? "Setuju" : "Sangat Setuju"}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {isSubmitting && (
                <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4" />
                    <p className="text-emerald-800 font-semibold animate-pulse">Menghitung Jejak Karbon...</p>
                </div>
            )}
        </div>
    );
}

function ScoreBox({ label, val, icon: Icon }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <Icon className="w-5 h-5 text-gray-400 mb-2" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-1">{label}</span>
            <span className={`text-xl font-bold ${val >= 70 ? 'text-emerald-600' : val >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                {Math.round(val)}
            </span>
        </div>
    )
}
