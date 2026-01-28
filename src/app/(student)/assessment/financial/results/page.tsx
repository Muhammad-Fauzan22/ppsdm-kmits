"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { PieChart, TrendingUp, Brain, Shield, Info, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function FinancialResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('financial_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">Memuat analisis finansial...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">Data tidak ditemukan.</div>;

    const chartData = {
        labels: ['Literasi', 'Kebiasaan', 'Mindset', 'Keamanan'],
        datasets: [
            {
                data: [
                    result.financial_literacy_score,
                    result.financial_behavior_score,
                    result.financial_mindset_score,
                    result.security_knowledge_score
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-12 font-sans text-slate-900 dark:text-white">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold">Kesehatan Finansial & Karir</h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Shield className="w-3 h-3" /> Financial Health Check Level 1
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Score Block */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-48 h-48 shrink-0">
                            <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-4xl font-black">{result.overall_score}</div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Total Score</div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl font-bold">{result.financial_persona}</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Anda memiliki profil finansial yang <strong>{result.risk_tolerance}</strong>.
                                {result.financial_literacy_score > 70
                                    ? " Pemahaman dasar Anda tentang investasi dan manajemen uang sudah sangat baik."
                                    : " Disarankan untuk mulai mempelajari instrumen investasi dasar."}
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                    <div className="text-xs text-slate-400 uppercase font-bold">Risk Profile</div>
                                    <div className="font-bold text-lg">{result.risk_tolerance}</div>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                    <div className="text-xs text-slate-400 uppercase font-bold">Est. Tabungan</div>
                                    <div className="font-bold text-lg">{result.savings_ratio_estimate}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommendation Block */}
                    <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <ArrowUpRight className="w-5 h-5" /> Next Steps
                            </h3>
                            {/* Recommendations */}
                            <div className="space-y-4">
                                <RecCard
                                    title="Mulai Investasi"
                                    desc="Pelajari instrumen rendah risiko seperti Reksadana Pasar Uang."
                                    cta="Lihat Modul"
                                    urgent={result.financial_behavior_score < 50}
                                />
                                <RecCard
                                    title="Audit Pengeluaran"
                                    desc="Track semua pengeluaran kecil selama 7 hari."
                                    cta="Template"
                                    urgent={false}
                                />
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full mt-8 bg-white text-emerald-700 hover:bg-emerald-50 font-bold">
                            Lihat Modul Literasi
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-300 dark:border-slate-600">Kembali ke Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ScoreRow({ title, score, icon, desc }: any) {
    return (
        <div className="bg-white dark:bg-[#151b26] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${score >= 60 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm">{title}</h4>
                    <span className="font-mono font-bold">{score}/100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{desc}</p>
            </div>
        </div>
    );
}

function RecCard({ title, desc, cta, urgent }: any) {
    return (
        <div className={cn("p-4 rounded-xl border flex flex-col justify-between mb-4 bg-emerald-700/50 border-emerald-500/30")}>
            <div>
                {urgent && <div className="text-[10px] font-bold text-red-200 uppercase mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> Prioritas Tinggi</div>}
                <h4 className="font-bold text-sm text-white mb-1">{title}</h4>
                <p className="text-xs text-emerald-100 mb-2 leading-relaxed">{desc}</p>
            </div>
            <div className="text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:underline">
                {cta} <ArrowUpRight className="w-3 h-3" />
            </div>
        </div>
    );
}

export default function FinancialResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">Loading Report...</div>}>
            <FinancialResultsContent />
        </Suspense>
    );
}
