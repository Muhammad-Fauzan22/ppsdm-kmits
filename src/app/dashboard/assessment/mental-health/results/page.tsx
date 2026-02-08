"use client";

// Prevent static generation - this page requires runtime data
export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Heart, Brain, Users, PhoneCall, ArrowRight, ShieldCheck, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function MentalHealthResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('mental_health_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Report...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Result not found.</div>;

    const isCrisis = result.risk_level === 'critical_risk';
    const isHighRisk = result.risk_level === 'high_risk';
    const showCrisisUI = isCrisis || isHighRisk;

    const riskColors = {
        'low_risk': { bg: 'bg-emerald-500', text: 'text-emerald-500', label: 'Sejahtera' },
        'moderate_risk': { bg: 'bg-amber-400', text: 'text-amber-500', label: 'Cukup Sejahtera' },
        'high_risk': { bg: 'bg-orange-500', text: 'text-orange-500', label: 'Perlu Perhatian' },
        'critical_risk': { bg: 'bg-rose-600', text: 'text-rose-600', label: 'Perlu Bantuan Segera' }
    };

    // Type assertion or check for key existence
    const riskInfo = riskColors[result.risk_level as keyof typeof riskColors] || riskColors['moderate_risk'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Laporan Kesehatan Mental</h1>
                    <p className="text-slate-500">Analisis komprehensif kesejahteraan psikologis & resiliensi akademik Anda.</p>
                </div>

                {/* Crisis Alert Banner */}
                {showCrisisUI && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-600 p-6 rounded-r-xl shadow-md animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-full text-rose-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-rose-700 dark:text-rose-300 mb-1">Perhatian Diperlukan</h3>
                                <p className="text-rose-600 dark:text-rose-400 mb-4 leading-relaxed">
                                    Hasil asesmen menunjukkan indikasi beban psikologis yang signifikan. Sangat disarankan untuk berkonsultasi dengan profesional.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="destructive" className="gap-2 shadow-lg shadow-rose-500/20">
                                        <PhoneCall className="w-4 h-4" /> Hubungi Konseling ITS
                                    </Button>
                                    <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                                        Hotline 1198 (24 Jam)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Score & Risk Card */}
                <div className="bg-white dark:bg-[#151b26] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-500"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        {/* Gauge Visual */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" className="stroke-slate-100 dark:stroke-slate-800 fill-none stroke-[8]" />
                                <circle
                                    cx="50%" cy="50%" r="45%"
                                    className={`fill-none stroke-[8] transition-all duration-1000 ease-out ${riskInfo.text.replace('text-', 'stroke-')}`}
                                    strokeDasharray={`${result.normalized_score * 2.83}, 283`} // Approx circumference
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{Math.round(result.normalized_score)}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Skor Total</span>
                            </div>
                        </div>

                        {/* Text Analysis */}
                        <div className="flex-1 text-center md:text-left">
                            <div className={`inline-block px-4 py-1.5 rounded-full ${riskInfo.bg} bg-opacity-10 ${riskInfo.text} font-bold text-sm mb-4`}>
                                {riskInfo.label}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Interpretasi Hasil</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                {result.interpretation || "Analisis lengkap tersedia di bawah ini."}
                            </p>

                            {result.validity_flags?.includes('too_fast') && (
                                <div className="text-xs text-amber-500 flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 p-2 rounded w-fit">
                                    <AlertTriangle className="w-3 h-3" /> Catatan: Waktu pengerjaan terdeteksi sangat cepat. Hasil mungkin kurang akurat.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subdomains Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SubdomainCard
                        title="Emotional Well-being"
                        score={result.subscales.emotional_wellbeing.score}
                        icon={Heart}
                        color="rose"
                        desc="Kepuasan hidup & optimisme."
                    />
                    <SubdomainCard
                        title="Academic Resilience"
                        score={result.subscales.academic_resilience.score}
                        icon={ShieldCheck}
                        color="emerald"
                        desc="Kemampuan bangkit dari kegagalan."
                    />
                    <SubdomainCard
                        title="Stress Management"
                        score={result.subscales.stress_management.score}
                        icon={Brain}
                        color="blue"
                        desc="Strategi koping terhadap tekanan."
                    />
                    <SubdomainCard
                        title="Social Support"
                        score={result.subscales.social_support.score}
                        icon={Users}
                        color="purple"
                        desc="Kualitas dukungan relational."
                    />
                </div>

                {/* Recommendations */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" /> Rekomendasi Personal
                    </h3>
                    <div className="space-y-4">
                        {result.recommendations?.map((rec: any, idx: number) => (
                            <div key={idx} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg">{rec.title}</h4>
                                    {rec.priority === 'high' && <span className="text-xs bg-rose-500 px-2 py-0.5 rounded font-bold">PRIORITY</span>}
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-3">{rec.description}</p>
                                {rec.resource && (
                                    <div className="text-xs text-blue-300 font-mono bg-blue-500/10 px-3 py-2 rounded border border-blue-500/20 inline-block">
                                        Resource: {rec.resource.name} {rec.resource.contact && `• ${rec.resource.contact}`}
                                    </div>
                                )}
                            </div>
                        ))}
                        {(!result.recommendations || result.recommendations.length === 0) && (
                            <p className="text-slate-400 italic">Tidak ada rekomendasi spesifik saat ini. Terus pertahankan kesehatan mental yang baik!</p>
                        )}
                    </div>
                </div>

                <div className="text-center pt-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="hover:bg-slate-100 dark:hover:bg-slate-800">Kembali ke Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SubdomainCard({ title, score, icon: Icon, color, desc }: any) {
    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(score)}</span>
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
            <p className="text-xs text-slate-500 mb-3">{desc}</p>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

export default function MentalHealthResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MentalHealthResultsContent />
        </Suspense>
    );
}
