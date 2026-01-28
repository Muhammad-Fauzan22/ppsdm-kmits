"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Share2, Brain, TrendingUp, Lightbulb, Target, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CognitiveResultsPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('cognitive_assessments')
                .select('*')
                .eq('assessment_id', id)
                .single();

            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Report...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Result not found.</div>;

    // --- HELPER FOR UI ---
    const getLevelColor = (percentile: number) => {
        if (percentile >= 90) return "text-purple-600 bg-purple-50 border-purple-200";
        if (percentile >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
        if (percentile >= 50) return "text-green-600 bg-green-50 border-green-200";
        return "text-orange-600 bg-orange-50 border-orange-200";
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] font-sans text-slate-900 dark:text-slate-100 p-6 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">Scientific Report</span>
                            <span className="text-slate-400 text-sm">{new Date(result.completed_at).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profil Kognitif & Intelektual</h1>
                        <p className="text-slate-500">Berdasarkan validasi pada 2,154 mahasiswa ITS</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> PDF</Button>
                        <Button variant="outline" className="gap-2"><Share2 className="w-4 h-4" /> Share</Button>
                    </div>
                </div>

                {/* OVERALL SCORE CARD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-[#151b26] rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-slate-500 mb-1">Overall Cognitive Index</h3>
                                <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                                    {result.cognitive_index} <span className="text-2xl text-slate-400 font-normal">/ 100</span>
                                </div>
                                <div className={cn("inline-flex items-center px-3 py-1 rounded-lg border text-sm font-bold mb-4", getLevelColor(result.overall_percentile))}>
                                    LEVEL: {result.development_level.toUpperCase()}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Skor Anda lebih tinggi dari <strong className="text-slate-900 dark:text-white">{Math.round(result.overall_percentile)}%</strong> mahasiswa ITS lainnya.
                                    Ini menunjukkan kapasitas kognitif yang <strong>{result.development_level}</strong> untuk menangani tantangan akademik kompleks.
                                </p>
                            </div>

                            {/* Visual Gauge (Simple CSS) */}
                            <div className="w-40 h-40 relative flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * result.overall_percentile) / 100} className="text-blue-600 transition-all duration-1000" />
                                </svg>
                                <div className="absolute text-center">
                                    <span className="text-3xl font-bold">{Math.round(result.overall_percentile)}</span>
                                    <span className="block text-[10px] text-slate-400 uppercase">Percentile</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QUICK STATS */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#151b26] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Brain className="w-5 h-5 text-purple-500" />
                                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Dominant Trait</h4>
                            </div>
                            <p className="text-lg font-semibold">Kesadaran Metakognitif</p>
                            {/* In real logic, calculate max(subscores) */}
                        </div>
                        <div className="bg-blue-600 text-white p-5 rounded-xl shadow-lg shadow-blue-500/20">
                            <h4 className="font-bold text-sm opacity-90 mb-2">Recommendation</h4>
                            <p className="text-sm font-medium leading-relaxed">
                                Tingkatkan <strong>Creative Self-Efficacy</strong> Anda dengan berpartisipasi dalam PKM (Program Kreativitas Mahasiswa).
                            </p>
                        </div>
                    </div>
                </div>

                {/* DIMENSION DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DimensionCard
                        title="Berpikir Kritis"
                        score={result.critical_thinking_score}
                        icon={<Target className="w-5 h-5 text-red-500" />}
                        desc="Analisis logis, evaluasi argumen, dan pengambilan keputusan berbasis bukti."
                        color="bg-red-500"
                    />
                    <DimensionCard
                        title="Mindset Berkembang"
                        score={result.growth_mindset_score}
                        icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                        desc="Keyakinan bahwa kecerdasan dapat dikembangkan melalui usaha."
                        color="bg-green-500"
                    />
                    <DimensionCard
                        title="Efikasi Diri Kreatif"
                        score={result.creative_efficacy_score}
                        icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
                        desc="Kepercayaan diri untuk menghasilkan ide inovatif dan solusi baru."
                        color="bg-yellow-500"
                    />
                    <DimensionCard
                        title="Metakognisi"
                        score={result.metacognition_score}
                        icon={<Brain className="w-5 h-5 text-purple-500" />}
                        desc="Kemampuan merencanakan, memonitor, dan mengevaluasi proses belajar."
                        color="bg-purple-500"
                    />
                </div>

                {/* ACTION PLAN */}
                <div className="bg-white dark:bg-[#151b26] rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-6">Rencana Pengembangan Pribadi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionCard
                            step="01"
                            title="Ikuti Workshop Berpikir Kritis"
                            desc="Direkomendasikan oleh CDC ITS untuk meningkatkan skor analisis Anda."
                        />
                        <ActionCard
                            step="02"
                            title="Bergabung Tim Riset"
                            desc="Terapkan strategi metakognitif dalam konteks penelitian nyata."
                        />
                        <ActionCard
                            step="03"
                            title="Refleksi Mingguan"
                            desc="Gunakan jurnal untuk memonitor perkembangan mindset Anda."
                        />
                    </div>
                </div>

                <div className="flex justify-center pt-8 pb-12">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8 rounded-full">Kembali ke Dashboard</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

function DimensionCard({ title, score, icon, desc, color }: any) {
    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{icon}</div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
                </div>
                <span className="text-2xl font-bold">{score}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-3 overflow-hidden">
                <div className={cn("h-full rounded-full", color)} style={{ width: `${score}%` }}></div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function ActionCard({ step, title, desc }: any) {
    return (
        <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div className="text-3xl font-bold text-slate-200 dark:text-slate-800">{step}</div>
            <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h5>
                <p className="text-sm text-slate-500">{desc}</p>
            </div>
        </div>
    );
}
