"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Activity, Moon, Apple, Zap, Shield, AlertTriangle, CheckCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function PhysicalResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('physical_health_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Analyzing Physical Health...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Result not found.</div>;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600";
        if (score >= 60) return "text-blue-600";
        if (score >= 40) return "text-amber-500";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Physical Health & Vitality Profile</h1>
                    <p className="text-slate-500">Evaluasi komprehensif kesehatan fisik dan gaya hidup Anda.</p>
                </div>

                {/* Overall Score Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-[#151b26] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Health Category</h3>
                            <div className={cn("text-4xl md:text-5xl font-bold mb-3", getScoreColor(result.composite_score))}>
                                {result.health_category}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Skor komposit Anda <strong>{result.composite_score}</strong> (Percentile: {result.overall_percentile}%).
                                {result.composite_score >= 80
                                    ? " Gaya hidup Anda sangat mendukung vitalitas akademik yang optimal."
                                    : " Terdapat beberapa risiko kesehatan yang perlu dimitigasi segera."}
                            </p>
                        </div>
                        <div className="w-40 h-40 relative flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className={cn("animate-[spin_1s_ease-out_reverse]", getScoreColor(result.composite_score))} strokeDasharray={`${result.composite_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={cn("text-3xl font-bold", getScoreColor(result.composite_score))}>{Math.round(result.composite_score)}</span>
                                <span className="text-xs text-slate-400">/ 100</span>
                            </div>
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#151b26] p-6 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Risk Factors
                            </h3>
                            {result.risk_factors && result.risk_factors.length > 0 ? (
                                <ul className="space-y-3">
                                    {result.risk_factors.map((risk: any, idx: number) => (
                                        <li key={idx} className="flex gap-3 text-sm">
                                            <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", risk.severity === 'High' ? "bg-red-500" : "bg-amber-500")} />
                                            <div>
                                                <strong className="block text-slate-700 dark:text-slate-300">{risk.factor}</strong>
                                                <span className="text-slate-500 text-xs">{risk.recommendation}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-emerald-600 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>No significant risks identified. Keep it up!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subdomain Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <SubscaleCard title="Physical Activity" score={result.physical_activity_score} icon={<Activity className="w-5 h-5" />} description="Intensitas & Kekuatan" />
                    <SubscaleCard title="Sleep Quality" score={result.sleep_quality_score} icon={<Moon className="w-5 h-5" />} description="Durasi & Kepuasan" />
                    <SubscaleCard title="Nutrition" score={result.nutrition_score} icon={<Apple className="w-5 h-5" />} description="Pola Makan Sehat" />
                    <SubscaleCard title="Vitality" score={result.vitality_score} icon={<Zap className="w-5 h-5" />} description="Energi Harian" />
                    <SubscaleCard title="Prevention" score={result.preventive_health_score} icon={<Shield className="w-5 h-5" />} description="Kebersihan & Cek Rutin" />
                </div>

                {/* Recommendations */}
                <div className="bg-emerald-600 rounded-xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6" />
                        Rekomendasi Personal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {result.recommendations && result.recommendations.slice(0, 4).map((rec: string, idx: number) => (
                            <div key={idx} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold flex-shrink-0">
                                    {idx + 1}
                                </div>
                                <p className="leading-relaxed text-emerald-50">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile App Promo (Optional) */}
                <div className="flex justify-center pt-8">
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-300 dark:border-slate-600">Ke Dashboard Utama</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

function SubscaleCard({ title, score, icon, description }: any) {
    const isGood = score >= 60;
    return (
        <div className="bg-white dark:bg-[#151b26] p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">{icon}</div>
                <span className={cn("text-lg font-bold", isGood ? "text-emerald-600" : "text-amber-500")}>{Math.round(score)}</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">{title}</h4>
            <p className="text-xs text-slate-500 mb-3">{description}</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full">
                <div className={cn("h-full rounded-full transition-all", isGood ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

export default function PhysicalResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Report...</div>}>
            <PhysicalResultsContent />
        </Suspense>
    );
}
