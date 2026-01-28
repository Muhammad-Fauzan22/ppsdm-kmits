"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Moon, Apple, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function HealthResultsContent() {
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Memroses Data Kesehatan...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Data tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Laporan Kesehatan & Vitalitas</h1>
                        <p className="text-slate-500">Physical Health & Vitality Assessment (PHVA)</p>
                    </div>
                </div>

                {/* Score Section */}
                <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row gap-12 items-center">
                    <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                        {/* Simple Circle using Tailwind usually needs raw SVG. Simplified here */}
                        <div className="w-full h-full rounded-full border-[12px] border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 border-t-transparent border-l-transparent transform -rotate-45" style={{ clipPath: `inset(0 0 0 0)` }} ></div>
                            <div className="text-center">
                                <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{result.health_score}</div>
                                <div className="text-xs font-bold uppercase text-slate-400">Health Index</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Status: <span className="text-emerald-500">{result.health_status}</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {result.health_status === "Optimal" && "Kondisi fisik Anda sangat prima. Pertahankan rutinitas olahraga dan pola makan sehat Anda."}
                            {result.health_status === "Good" && "Secara umum kesehatan Anda baik, namun ada ruang perbaikan di konsistensi tidur atau hidrasi."}
                            {result.health_status === "Fair" && "Perlu perhatian lebih pada aktivitas fisik harian dan pola tidur untuk meningkatkan energi."}
                            {result.health_status === "Needs Attention" && "Disarankan berkonsultasi dengan profesional medis untuk check-up rutin."}
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dotted border-slate-300 dark:border-slate-700 inline-flex flex-col md:flex-row gap-4 md:gap-8">
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold">BMI</div>
                                <div className="text-xl font-bold">{result.bmi.toFixed(1)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold">Kualitas Tidur</div>
                                <div className="text-xl font-bold">{result.sleep_quality}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase font-bold">Aktivitas</div>
                                <div className="text-xl font-bold">{result.activity_level}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Dimensions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatusCard title="Pola Tidur" status={result.sleep_quality} icon={<Moon />} desc="Durasi & Kualitas Istirahat" />
                    <StatusCard title="Diet & Nutrisi" status={result.diet_quality} icon={<Apple />} desc="Keseimbangan Asupan Makanan" />
                    <StatusCard title="Energi Harian" status={result.energy_level} icon={<Activity />} desc="Stamina Fisik Sepanjang Hari" />
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-sky-50 dark:bg-sky-900/20 p-8 rounded-2xl border border-sky-100 dark:border-sky-800">
                        <h3 className="font-bold text-xl mb-4 text-sky-900 dark:text-sky-100">Rencana Aksi Minggu Ini</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center text-sky-700 font-bold text-xs">1</div>
                                <span className="text-slate-700 dark:text-slate-300">Minum 2 liter air setiap hari.</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center text-sky-700 font-bold text-xs">2</div>
                                <span className="text-slate-700 dark:text-slate-300">Jalan kaki 30 menit, 3x seminggu.</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center text-sky-700 font-bold text-xs">3</div>
                                <span className="text-slate-700 dark:text-slate-300">Tidur sebelum jam 23:00 WIB.</span>
                            </li>
                        </ul>
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

function StatusCard({ title, status, icon, desc }: any) {
    // Simple color mapping
    const isGood = status === "Good" || status === "High" || status === "Very Good";
    const isFair = status === "Fair" || status === "Medium" || status === "Moderate";

    return (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className={cn("p-4 rounded-xl", isGood ? "bg-emerald-100 text-emerald-600" : isFair ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600")}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
                <div className={cn("text-sm font-bold mt-1", isGood ? "text-emerald-500" : isFair ? "text-amber-500" : "text-rose-500")}>{status}</div>
                <p className="text-xs text-slate-400 mt-2 leading-tight">{desc}</p>
            </div>
        </div>
    );
}

export default function HealthResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Loading...</div>}>
            <HealthResultsContent />
        </Suspense>
    );
}
