"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { PieChart, TrendingUp, Brain, Shield, Info, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FinancialResultsPage() {
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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Calculating Financial Intelligence...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Record not found.</div>;

    const getBgColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-blue-500";
        if (score >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center md:text-left space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider mb-2">Scientific Report</div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Intelligence Profile</h1>
                    <p className="text-slate-500 max-w-2xl">Laporan ini dibuat menggunakan Tripartite Model (Knowledge, Behavior, Attitude) dan norma mahasiswa ITS.</p>
                </div>

                {/* Main Score Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-[#151b26] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex-1 z-10">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Status Keuangan</h3>
                            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">{result.financial_level}</div>
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                Skor komposit Anda <strong>{result.composite_score}</strong>. Anda berada di <strong>top {100 - result.percentile_rank}%</strong> mahasiswa.
                                {result.composite_score < 50 ? " Anda perlu segera meningkatkan literasi dasar untuk menghindari risiko finansial di masa depan." : " Kemampuan Anda dalam mengelola sumber daya sudah sangat baik."}
                            </p>
                        </div>

                        <div className="w-40 h-40 relative flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path className={cn("transition-all duration-1000", result.composite_score >= 70 ? "text-green-500" : result.composite_score >= 50 ? "text-blue-500" : "text-yellow-500")} strokeDasharray={`${result.composite_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">{Math.round(result.composite_score)}</span>
                                <span className="text-xs text-slate-400 uppercase">Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                        <ScoreRow title="Knowledge" score={result.knowledge_score} icon={<Brain className="w-4 h-4" />} desc="Pemahaman Konsep (Bunga, Inflasi)" />
                        <ScoreRow title="Behavior" score={result.behavior_score} icon={<TrendingUp className="w-4 h-4" />} desc="Tindakan Nyata (Budgeting, Saving)" />
                        <ScoreRow title="Attitude" score={result.attitude_score} icon={<Shield className="w-4 h-4" />} desc="Pola Pikir (Risk, Future View)" />

                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mt-4">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> Analisis Gap</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {result.behavior_score < result.knowledge_score
                                    ? "Knowledge-Action Gap terdeteksi. Anda 'tahu' teorinya tapi belum 'melakukannya'."
                                    : "Konsistensi yang baik antara pengetahuan dan tindakan."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <h3 className="text-xl font-bold">Rekomendasi Pengembangan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RecCard
                        title="Mulai Investasi"
                        desc="Pelajari instrumen rendah risiko seperti Reksadana Pasar Uang untuk melawan inflasi."
                        cta="Lihat Modul Investasi"
                        urgent={result.behavior_score < 50}
                    />
                    <RecCard
                        title="Otomatisasi Tabungan"
                        desc="Gunakan fitur autodebet bank untuk 'membayar diri sendiri' di awal bulan."
                        cta="Setup Auto-Debit"
                        urgent={result.behavior_score < 60}
                    />
                    <RecCard
                        title="Audit Pengeluaran"
                        desc="Track semua pengeluaran kecil (Latte Factor) selama 7 hari ke depan."
                        cta="Download Template"
                        urgent={false} // General advice
                    />
                </div>

                <div className="flex justify-center pt-8">
                    <Link href="/dashboard">
                        <Button size="lg" className="rounded-full px-8">Ke Dashboard Utama</Button>
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
        <div className={cn("p-6 rounded-xl border-2 flex flex-col justify-between h-full", urgent ? "border-red-100 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30" : "border-slate-100 bg-white dark:bg-[#151b26] dark:border-slate-800")}>
            <div>
                {urgent && <div className="text-xs font-bold text-red-600 uppercase mb-2 flex items-center gap-1"><Info className="w-3 h-3" /> Prioritas Tinggi</div>}
                <h4 className="font-bold text-lg mb-2">{title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{desc}</p>
            </div>
            <div className="text-blue-600 text-sm font-bold flex items-center gap-1 cursor-pointer hover:underline">
                {cta} <ArrowUpRight className="w-4 h-4" />
            </div>
        </div>
    );
}
