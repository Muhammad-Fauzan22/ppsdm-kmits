"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, BookOpen, Shield, Medal, Target, Star, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CharacterResultsPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('character_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Memroses Profil Karakter...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Data tidak ditemukan.</div>;

    const getLevelColor = (level: string) => {
        if (level === "Exceptional Character") return "text-emerald-500 bg-emerald-50 border-emerald-200";
        if (level === "Strong Character") return "text-indigo-500 bg-indigo-50 border-indigo-200";
        if (level === "Developing Character") return "text-amber-500 bg-amber-50 border-amber-200";
        return "text-slate-500 bg-slate-100 border-slate-200";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                        <Lock className="w-3 h-3" /> Privasi Dijamin - Hanya Anda yang melihat ini
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Scientific Character Profile (CAS-8)</h1>
                </div>

                {/* Main Hero Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">

                        <div className="relative z-10">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Character Maturity Level</h2>
                            <div className={cn("text-4xl md:text-5xl font-black mb-4", getLevelColor(result.character_level).split(' ').find(c => c.startsWith('text-')))}>
                                {result.character_level}
                            </div>

                            <div className="space-y-4 max-w-lg">
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Skor Komposit Anda: <strong>{result.composite_score}</strong> (Persentil ke-{result.percentile_rank}).
                                </p>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {result.character_level === "Exceptional Character" && "Anda termasuk dalam top 5% mahasiswa dengan integritas tertinggi. Anda memiliki potensi besar menjadi Ethical Leader."}
                                    {result.character_level === "Strong Character" && "Profil karakter Anda sangat solid, menunjukkan konsistensi antara nilai dan tindakan."}
                                    {result.character_level === "Developing Character" && "Anda memiliki dasar yang baik, namun ada peluang besar untuk meningkatkan keberanian moral dalam situasi sulit."}
                                    {result.character_level === "Basic Character" && "Disarankan untuk melakukan refleksi mendalam mengenai nilai-nilai pribadi dan penerapannya."}
                                </p>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Shield className="w-64 h-64" />
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 font-bold opacity-80 mb-6">
                                <TrendingUp className="w-5 h-5" /> Indeks Karakter Nasional
                            </div>
                            <div className="text-5xl font-black mb-2">{result.percentile_rank}<span className="text-2xl">%</span></div>
                            <p className="text-indigo-100 text-sm">
                                Skor Anda lebih tinggi dari {result.percentile_rank}% mahasiswa di database nasional.
                            </p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-indigo-500/50">
                            <div className="text-xs font-bold uppercase opacity-60 mb-1">Rata-rata Nasional</div>
                            <div className="text-2xl font-bold">68.4</div>
                        </div>
                    </div>
                </div>

                {/* Dimensions Breakdown */}
                <h3 className="font-bold text-xl text-slate-900 dark:text-white pt-4">Analisis Dimensi Psikometris</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <ScoreCard title="Integritas" score={result.integrity_score} icon={<Shield />} desc="Kejujuran & Autentisitas" />
                    <ScoreCard title="Moral Courage" score={result.moral_courage_score} icon={<Medal />} desc="Berani karena Benar" />
                    <ScoreCard title="Responsibility" score={result.responsibility_score} icon={<Target />} desc="Menuntaskan Amanah" />
                    <ScoreCard title="Fairness" score={result.fairness_score} icon={<Scale />} desc="Keadilan Tanpa Bias" />
                    <ScoreCard title="Humility" score={result.humility_score} icon={<Star />} desc="Terbuka & Tidak Sombong" />
                </div>

                {/* Recommendations */}
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-500" /> Rekomendasi Pengembangan Diri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <RecommendationCard
                            title="Latihan Refleksi Harian"
                            desc="Luangkan 5 menit sebelum tidur untuk menilai 1 keputusan etis yang Anda buat hari ini. Apakah sudah sesuai nilai Anda?"
                        />
                        <RecommendationCard
                            title="Studi Kasus Etika"
                            desc="Baca tentang 'Engineering Ethics Cases' (misal: Challenger Disaster) untuk memahami dampak etika profesi."
                        />
                        {result.moral_courage_score < 70 && (
                            <RecommendationCard
                                title="Challenge Yourself"
                                desc="Cobalah untuk menyuarakan pendapat yang berbeda namun benar di dalam diskusi kelompok minggu ini."
                                highlight
                            />
                        )}
                        {result.humility_score < 70 && (
                            <RecommendationCard
                                title="Active Listening"
                                desc="Praktikkan mendengarkan kritik tanpa defensif. Terima sebagai data untuk perbaikan."
                                highlight
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-300 dark:border-slate-700">Kembali ke Dashboard</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

function ScoreCard({ title, score, icon, desc }: any) {
    // Generate simple bar height
    const h = Math.max(20, score);

    return (
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-48 group hover:shadow-lg transition-all">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">{icon}</div>
                    <div className="font-bold text-lg">{score}</div>
                </div>
                <div className="font-bold text-slate-800 dark:text-white text-sm">{title}</div>
                <div className="text-xs text-slate-500 leading-tight mt-1">{desc}</div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

function RecommendationCard({ title, desc, highlight }: any) {
    return (
        <div className={cn("p-5 rounded-xl border border-slate-100 dark:border-slate-700", highlight ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200" : "bg-slate-50 dark:bg-[#0f172a]")}>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

import { Scale } from "lucide-react"; 
