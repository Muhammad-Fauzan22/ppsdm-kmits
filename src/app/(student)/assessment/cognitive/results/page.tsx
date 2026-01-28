"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Share2, Brain, TrendingUp, Lightbulb, Target, BookOpen } from "lucide-react";
import Link from "next/link";
import { Radar } from "react-chartjs-2";
import { cn } from "@/lib/utils";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

function CognitiveResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('cognitive_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">Memuat analisis kognitif...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">Data tidak ditemukan.</div>;

    const chartData = {
        labels: ['Memori', 'Fokus', 'Problem Solving', 'Logika', 'Kecepatan'],
        datasets: [
            {
                label: 'Skor Anda',
                data: [
                    result.memory_score,
                    result.focus_score,
                    result.problem_solving_score,
                    result.logic_score,
                    result.speed_score
                ],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(0,0,0,0.1)' },
                grid: { color: 'rgba(0,0,0,0.1)' },
                pointLabels: { font: { size: 12 } },
                suggestedMin: 0,
                suggestedMax: 100,
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-12 font-sans text-slate-900 dark:text-white">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                            Profil Kognitif & Kecerdasan
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Assessment ID: {result.assessment_id.slice(0, 8)} • {new Date(result.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Score Card */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="md:flex items-center gap-8">
                            <div className="w-full md:w-1/2 aspect-square relative">
                                <Radar data={chartData} options={chartOptions} />
                            </div>
                            <div className="flex-1 space-y-6 mt-6 md:mt-0">
                                <div>
                                    <div className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-1">Total IQ Estimate</div>
                                    <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                                        {result.iq_estimate}
                                    </div>
                                    <div className="text-sm font-medium text-slate-500 mt-2">
                                        Top {100 - result.percentile_rank}% Populasi Mahasiswa
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Kapasitas kognitif Anda menunjukkan kekuatan signifikan dalam <strong>Problem Solving</strong> dan <strong>Logika</strong>. Ini menunjukkan potensi tinggi untuk bidang analitis kompleks.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                        {/* Placeholder for future quick stats if needed */}
                        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
                            <h3 className="font-bold mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Rekomendasi Karir/Studi</h3>
                            <ul className="text-sm space-y-2 opacity-90 list-disc list-inside">
                                <li>Data Science & AI</li>
                                <li>Strategic Management</li>
                                <li>System Architecture</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Dimension Details */}
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

export default function CognitiveResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">Loading Report...</div>}>
            <CognitiveResultsContent />
        </Suspense>
    );
}
