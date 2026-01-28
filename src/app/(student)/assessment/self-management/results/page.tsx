"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Timer, AlertTriangle, CheckCircle, Target, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SMResultsPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('self_management_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Analyzing Productivity Profile...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Result not found.</div>;

    // Helper for Procrastination Risk
    const isHighRiskProcrastination = result.procrastination_score < 50; // Remember: Higher score = Less procrastination (better)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Productivity & Self-Management Profile</h1>
                    <p className="text-slate-500">Analisis komprehensif kekuatan manajemen diri Anda.</p>
                </div>

                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-[#151b26] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-8">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Productivity Level</h3>
                            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{result.productivity_level}</div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Skor Anda lebih tinggi dari <strong>{result.percentile_rank}%</strong> populasi mahasiswa.
                                {result.normalized_score >= 70
                                    ? " Anda memiliki kontrol diri yang sangat baik dan manajemen waktu yang efektif."
                                    : " Ada beberapa area yang perlu dioptimalkan untuk mencapai performa puncak."}
                            </p>
                        </div>
                        <div className="hidden md:block w-32 h-32 relative">
                            {/* Simple Pie Chart Representation */}
                            <svg viewBox="0 0 36 36" className="w-full h-full text-blue-600">
                                <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="animate-[spin_1s_ease-out_reverse]" strokeDasharray={`${result.normalized_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">{Math.round(result.normalized_score)}</div>
                        </div>
                    </div>

                    {/* Alerts/Flags */}
                    <div className="space-y-4">
                        {isHighRiskProcrastination ? (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-5 rounded-xl">
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-2">
                                    <AlertTriangle className="w-5 h-5" /> High Urgency
                                </div>
                                <p className="text-sm text-red-600 dark:text-red-300">
                                    Terdeteksi kecenderungan <strong>Prokrastinasi Kronis</strong>. Segera terapkan teknik "5-Minute Rule" untuk memulai tugas.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-5 rounded-xl">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-2">
                                    <CheckCircle className="w-5 h-5" /> Low Procrastination
                                </div>
                                <p className="text-sm text-green-600 dark:text-green-300">
                                    Anda memiliki disiplin yang baik dalam memulai dan menyelesaikan tugas. Pertahankan!
                                </p>
                            </div>
                        )}

                        <div className="bg-white dark:bg-[#151b26] p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h4 className="font-bold text-sm mb-2">Next Step</h4>
                            <Link href="/dashboard" className="text-blue-600 hover:underline text-sm font-medium">Buat Study Plan di Dashboard &rarr;</Link>
                        </div>
                    </div>
                </div>

                {/* Subscales Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SubscaleCard title="Time Management" score={result.time_management_score} icon={<Timer className="w-5 h-5" />} description="Jadwal & Rutinitas" />
                    <SubscaleCard title="Procrastination Control" score={result.procrastination_score} icon={<Zap className="w-5 h-5" />} description="Segera Bertindak" />
                    <SubscaleCard title="Self-Control (Focus)" score={result.self_control_score} icon={<Target className="w-5 h-5" />} description="Menahan Distraksi" />
                    <SubscaleCard title="Goal Setting" score={result.goal_setting_score} icon={<CheckCircle className="w-5 h-5" />} description="Tujuan Terukur" />
                </div>

                {/* Recommendation */}
                <div className="bg-blue-600 rounded-xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-4">Rekomendasi Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-50">
                        <div>
                            <strong className="block text-white mb-1">Strategi: Time Blocking</strong>
                            <p className="text-sm leading-relaxed">Bagi hari Anda menjadi blok 2 jam khusus untuk Deep Work, tanpa gangguan notifikasi.</p>
                        </div>
                        <div>
                            <strong className="block text-white mb-1">Alat: The Eisenhower Matrix</strong>
                            <p className="text-sm leading-relaxed">Gunakan matriks ini setiap pagi untuk memisahkan tugas Mendesak vs Penting.</p>
                        </div>
                        <div>
                            <strong className="block text-white mb-1">Mindset: "Eat The Frog"</strong>
                            <p className="text-sm leading-relaxed">Kerjakan tugas tersulit Anda di pagi hari saat energi willpower maksimal.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function SubscaleCard({ title, score, icon, description }: any) {
    const isGood = score >= 70;
    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">{icon}</div>
                <span className={cn("text-xl font-bold", isGood ? "text-green-600" : "text-amber-500")}>{Math.round(score)}</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
            <p className="text-xs text-slate-500">{description}</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3">
                <div className={cn("h-full rounded-full transition-all", isGood ? "bg-green-500" : "bg-amber-500")} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}
