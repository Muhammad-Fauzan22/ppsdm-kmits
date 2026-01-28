"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Moon, Apple, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HealthResultsPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('health_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memroses Data Vitalitas...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Data tidak ditemukan.</div>;

    const getColor = (score: number) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 60) return "text-blue-500";
        if (score >= 40) return "text-yellow-500";
        return "text-rose-500";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="text-center md:text-left">
                    <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">Laporan Vitalitas</div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Health & Vitality Profile</h1>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white dark:bg-[#151b26] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-center">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Status Kesehatan Umum</h3>
                        <div className={`text-4xl md:text-5xl font-extrabold mb-2 ${getColor(result.composite_score)}`}>{result.health_category}</div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Skor Komposit: <strong>{result.composite_score}/100</strong>.
                            {result.composite_score >= 80
                                ? " Kondisi fisik Anda sangat mendukung performa akademik puncak."
                                : " Ada beberapa area vitalitas yang dapat menghambat fokus belajar Anda."}
                        </p>
                    </div>

                    {/* Risk Box */}
                    <div className="bg-white dark:bg-[#151b26] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <ShieldAlert className="w-5 h-5 text-rose-500" /> Faktor Risiko Terdeteksi
                        </h3>
                        {result.risk_factors && result.risk_factors.length > 0 ? (
                            <ul className="space-y-3">
                                {result.risk_factors.map((risk: any, idx: number) => (
                                    <li key={idx} className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30">
                                        <div className="font-bold text-rose-700 text-sm">{risk.factor}</div>
                                        <div className="text-xs text-rose-600/80 uppercase font-bold">{risk.severity} Severity</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-emerald-600 p-4 bg-emerald-50 rounded-lg">
                                <ShieldCheck className="w-10 h-10 mb-2" />
                                <p className="font-bold">Tidak ada risiko mayor.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <ScoreCard icon={<Activity />} title="Aktivitas" score={result.physical_activity_score} />
                    <ScoreCard icon={<Moon />} title="Tidur" score={result.sleep_quality_score} />
                    <ScoreCard icon={<Apple />} title="Nutrisi" score={result.nutrition_score} />
                    <ScoreCard icon={<Heart />} title="Vitalitas" score={result.vitality_score} />
                    <ScoreCard icon={<ShieldCheck />} title="Preventif" score={result.preventive_score} />
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

function ScoreCard({ icon, title, score }: any) {
    const getColor = (s: number) => {
        if (s >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (s >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
        if (s >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-rose-600 bg-rose-50 border-rose-200";
    };

    return (
        <div className={`p-4 rounded-xl border-2 flex flex-col items-center text-center ${getColor(score)}`}>
            <div className="mb-2 opacity-80">{icon}</div>
            <div className="text-xs font-bold uppercase opacity-70 mb-1">{title}</div>
            <div className="text-2xl font-black">{score}</div>
        </div>
    );
}
