"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Brain, HeartHandshake, Users, Award, Crown, Lightbulb, ArrowRight, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";

function SocialResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('social_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Menganalisis Profil Sosial...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Data tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header Profile */}
                <div className="bg-white dark:bg-[#151b26] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Crown className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <div className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                                Laporan Kecerdasan Emosional
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                                {result.profile_type}
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                Berdasarkan analisis respons situasional dan preferensi perilaku, Anda menunjukkan potensi kepemimpinan sebesar <strong>{result.leadership_potential}%</strong>.
                            </p>
                        </div>
                        <div className="bg-sky-50 dark:bg-sky-900/10 rounded-2xl p-6 border border-sky-100 dark:border-sky-900/30 text-center">
                            <div className="text-sm font-bold uppercase text-sky-600 mb-2">Skor Komposit</div>
                            <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">{result.composite_score}</div>
                            <div className="text-xs text-slate-500">Persentil ke-85 (Estimasi)</div>
                        </div>
                    </div>
                </div>

                {/* 4 Quadrants */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ScoreCard icon={<Brain className="text-purple-500" />} title="Self Awareness" score={result.awareness_score} desc="Kesadaran emosi diri" />
                    <ScoreCard icon={<Activity className="text-amber-500" />} title="Self Regulation" score={result.regulation_score} desc="Kontrol diri saat under pressure" />
                    <ScoreCard icon={<HeartHandshake className="text-rose-500" />} title="Empathy" score={result.empathy_score} desc="Memahami perasaan orang lain" />
                    <ScoreCard icon={<Users className="text-emerald-500" />} title="Social Skills" score={result.social_skills_score} desc="Kemampuan persuasi & kolaborasi" />
                </div>

                {/* Development Plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-[#151b26] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-sky-500" /> Area Pengembangan
                        </h3>
                        <div className="space-y-4">
                            {result.regulation_score < 70 && (
                                <Recommendation
                                    text="Latih teknik 'Pause-Process-Proceed' saat menghadapi deadline ketat untuk meningkatkan Self-Regulation."
                                    difficulty="Medium"
                                />
                            )}
                            {result.empathy_score < 70 && (
                                <Recommendation
                                    text="Praktikkan 'Active Listening' saat rapat tim: Dengarkan untuk memahami, bukan untuk menjawab."
                                    difficulty="Easy"
                                />
                            )}
                            {result.social_skills_score >= 80 && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-medium">
                                    🌟 Social Skills Anda sudah sangat baik. Pertimbangkan untuk mengambil peran mentor bagi mahasiswa baru.
                                </div>
                            )}
                            <Recommendation
                                text="Bergabunglah dengan proyek lintas jurusan untuk menantang kemampuan adaptasi sosial Anda."
                                difficulty="Hard"
                            />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-lg flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xl mb-4 text-white">Engineering Leadership</h3>
                            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                Di ITS, kami percaya "Engineer yang hebat bukan yang paling pintar menghitung, tapi yang paling efektif bekerja dalam tim kompleks."
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Kemampuan Teknis</span>
                                    <span className="font-bold">Diperlukan</span>
                                </div>
                                <div className="w-full bg-white/10 h-1 rounded-full"><div className="w-full bg-white h-1 rounded-full opacity-50"></div></div>

                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-sky-400 font-bold">Kecerdasan Sosial</span>
                                    <span className="font-bold text-sky-400">Pembeda (The Differentiator)</span>
                                </div>
                                <div className="w-full bg-white/10 h-1 rounded-full"><div className="w-[85%] bg-sky-400 h-1 rounded-full"></div></div>
                            </div>
                        </div>
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 mt-8 font-bold">
                            Lihat Modul Pelatihan
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="rounded-full px-8">Ke Dashboard Utama</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

function ScoreCard({ icon, title, score, desc }: any) {
    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    {icon}
                </div>
                <div className="text-2xl font-bold">{score}</div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2">{desc}</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-slate-800 dark:bg-slate-500 transition-all duration-1000" style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

function Recommendation({ text, difficulty }: any) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{text}</p>
                <span className="text-[10px] font-bold uppercase text-slate-400 mt-1 block">{difficulty} Impact</span>
            </div>
        </div>
    );
}

export default function SocialResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Menganalisis Profil Sosial...</div>}>
            <SocialResultsContent />
        </Suspense>
    );
}
