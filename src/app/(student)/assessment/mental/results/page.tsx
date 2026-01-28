"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { HeartPulse, Activity, Brain, Users, AlertTriangle, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function MentalResultsContent() {
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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memroses Evaluasi Klinis...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Data tidak ditemukan.</div>;

    const isHighRisk = result.risk_level === "High Risk" || result.risk_level === "Critical Risk";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#062c21] p-6 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-emerald-50">Laporan Kesejahteraan Mental</h1>
                    <p className="text-slate-500 dark:text-emerald-200">ISMHA-20 Scientific Profile</p>
                </div>

                {/* Crisis Banner (Conditional) */}
                {isHighRisk && (
                    <Alert variant="destructive" className="bg-rose-50 border-rose-200 text-rose-800">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="font-bold">Perhatian Diperlukan</AlertTitle>
                        <AlertDescription className="mt-2">
                            Skor Anda mengindikasikan tingkat distress yang signifikan. Kami sangat menyarankan Anda untuk berbicara dengan seseorang.
                            <div className="mt-3 flex gap-3">
                                <Button size="sm" variant="destructive" className="bg-rose-600 hover:bg-rose-700">
                                    <Phone className="w-4 h-4 mr-2" /> Layanan Konseling ITS
                                </Button>
                                <Button size="sm" variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-100">
                                    Lihat Kontak Darurat
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Score Summary */}
                <div className="bg-white dark:bg-[#0b3a2e] rounded-2xl p-8 shadow-xl border border-emerald-100 dark:border-emerald-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400 mb-1">Status Saat Ini</div>
                            <div className={`text-4xl font-extrabold mb-2 ${isHighRisk ? 'text-rose-500' : 'text-emerald-600'}`}>
                                {result.risk_level === "Low Risk" ? "Sejahtera (Flourishing)" : result.risk_level}
                            </div>
                            <p className="text-slate-600 dark:text-emerald-100/70 leading-relaxed">
                                Skor kesejahteraan mental Anda berada di level <strong>{result.total_score}/100</strong>.
                                {result.total_score >= 75
                                    ? " Anda memiliki fondasi psikologis yang sangat kuat untuk menghadapi tantangan akademik."
                                    : " Teridentifikasi beberapa beban psikologis yang perlu dikelola agar tidak menghambat studi."}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-slate-100 dark:border-emerald-900">
                                <div className="text-center">
                                    <div className="text-4xl font-black text-slate-800 dark:text-white">{result.total_score}</div>
                                    <div className="text-[10px] text-slate-400">INDEX ISMHA</div>
                                </div>
                                <svg className="absolute w-full h-full -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className={`${isHighRisk ? 'text-rose-500' : 'text-emerald-500'}`} strokeDasharray="440" strokeDashoffset={440 - (440 * result.total_score) / 100} strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ScoreBar title="Kesejahteraan Emosional" score={result.emotional_score} icon={<HeartPulse size={18} />} desc="Kebahagiaan & Kepuasan Hidup" />
                    <ScoreBar title="Ketahanan Akademik" score={result.resilience_score} icon={<Brain size={18} />} desc="Kemampuan bangkit dari kegagalan" />
                    <ScoreBar title="Manajemen Stres" score={result.stress_score} icon={<Activity size={18} />} desc="Strategi coping yang efektif" />
                    <ScoreBar title="Dukungan Sosial" score={result.social_support_score} icon={<Users size={18} />} desc="Kualitas hubungan interpersonal" />
                </div>

                {/* Recommendations */}
                <div className="bg-slate-100 dark:bg-[#0b3a2e]/50 rounded-xl p-6">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-emerald-50">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" /> Rekomendasi Personal
                    </h3>
                    <ul className="space-y-3">
                        {result.resilience_score < 70 && (
                            <li className="flex gap-3 text-sm text-slate-600 dark:text-emerald-100/80 bg-white dark:bg-[#0b3a2e] p-3 rounded-lg shadow-sm">
                                <span className="text-emerald-500">•</span>
                                Ikuti workshop "Growth Mindset" di Pusat Bahasa & Budaya untuk meningkatkan ketahanan akademik.
                            </li>
                        )}
                        {result.stress_score < 60 && (
                            <li className="flex gap-3 text-sm text-slate-600 dark:text-emerald-100/80 bg-white dark:bg-[#0b3a2e] p-3 rounded-lg shadow-sm">
                                <span className="text-emerald-500">•</span>
                                Coba teknik "Pomodoro" dan "Time Blocking" untuk mengurangi overwhelm tugas kuliah.
                            </li>
                        )}
                        <li className="flex gap-3 text-sm text-slate-600 dark:text-emerald-100/80 bg-white dark:bg-[#0b3a2e] p-3 rounded-lg shadow-sm">
                            <span className="text-emerald-500">•</span>
                            Pertahankan rutinitas tidur yang teratur untuk menjaga stabilitas emosi dasar.
                        </li>
                    </ul>
                </div>

                <div className="flex justify-center pt-6">
                    <Link href="/dashboard">
                        <Button size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">Ke Dashboard Utama</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

function ScoreBar({ title, score, icon, desc }: any) {
    return (
        <div className="bg-white dark:bg-[#0b3a2e] p-5 rounded-xl border border-slate-100 dark:border-emerald-900/50 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-emerald-50">
                    <span className="p-1.5 bg-slate-100 dark:bg-emerald-900/50 rounded-md text-slate-600 dark:text-emerald-400">{icon}</span>
                    {title}
                </div>
                <span className="font-bold text-lg">{score}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-emerald-900/30 h-1.5 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${score}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 dark:text-emerald-200/50">{desc}</p>
        </div>
    );
}

export default function MentalResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Report...</div>}>
            <MentalResultsContent />
        </Suspense>
    );
}
