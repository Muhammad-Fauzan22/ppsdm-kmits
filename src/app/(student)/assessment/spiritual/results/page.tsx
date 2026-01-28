"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, Heart, Sun, Feather, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SpiritualResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('spiritual_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Memroses Profil Spiritual...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Data tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0c4a6e] p-6 lg:p-12 font-sans text-slate-900 dark:text-white">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Laporan Perkembangan Spiritual</h1>
                    <p className="opacity-70">Indonesian Spiritual Development Scale (ISDS-8)</p>
                </div>

                {/* Stage Section */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 text-center shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-800 text-sm font-bold uppercase tracking-widest mb-4">Developmental Stage</div>

                        <h2 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-6 pb-2">
                            {result.developmental_stage}
                        </h2>

                        <p className="text-xl max-w-2xl mx-auto leading-relaxed opacity-80 mb-8">
                            {result.developmental_stage === "Transcending" && "Anda memiliki kesadaran spiritual yang sangat mendalam dan terintegrasi secara holistik dalam kehidupan sehari-hari."}
                            {result.developmental_stage === "Expressing" && "Anda secara konsisten mengekspresikan nilai-nilai spiritual Anda dalam tindakan nyata dan pelayanan."}
                            {result.developmental_stage === "Integrating" && "Anda sedang aktif memadukan nilai-nilai spiritual ke dalam identitas dan pengambilan keputusan Anda."}
                            {result.developmental_stage === "Exploring" && "Anda sedang dalam fase eksplorasi aktif, mencari makna dan kebenaran yang lebih dalam."}
                            {(result.developmental_stage === "Awakening" || result.developmental_stage === "Beginning") && "Anda berada di tahap awal menyadari pentingnya dimensi spiritual dalam kehidupan."}
                        </p>

                        <div className="flex justify-center gap-12 text-center">
                            <div>
                                <div className="text-4xl font-bold">{result.standardized_score}</div>
                                <div className="text-xs uppercase tracking-widest opacity-60">ISDS Score</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold">{result.percentile_rank}%</div>
                                <div className="text-xs uppercase tracking-widest opacity-60">Percentile</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                        <Sparkles className="w-full h-full text-sky-500 opacity-20" />
                    </div>
                </div>

                {/* Dimensions Grid */}
                <h3 className="text-2xl font-bold text-center">4 Dimensi Spiritual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DimCard title="Purpose" score={result.purpose_meaning_score} icon={<Compass />} desc="Makna & Tujuan Hidup" />
                    <DimCard title="Gratitude" score={result.gratitude_mindfulness_score} icon={<Sun />} desc="Syukur & Kesadaran" />
                    <DimCard title="Connectedness" score={result.connectedness_score} icon={<Feather />} desc="Hubungan & Transendensi" />
                    <DimCard title="Altruism" score={result.altruism_score} icon={<Heart />} desc="Kontribusi Tanpa Pamrih" />
                </div>

                {/* Recommendations Box */}
                <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-8 border border-sky-100 dark:border-sky-800">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <Star className="text-amber-500 fill-amber-500" /> Rekomendasi Praktik Spiritual
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RecItem text="Jurnal Rasa Syukur: Tuliskan 3 hal yang Anda syukuri setiap pagi selama 5 menit." />
                        <RecItem text="Mindful Walking: Berjalanlah di kampus tanpa gadget, perhatikan detail alam sekitar Anda." />
                        <RecItem text="Volunteering: Luangkan 1 jam minggu ini untuk membantu teman tanpa mengharap balasan." />
                        <RecItem text="Refleksi Nilai: Evaluasi apakah jurusan kuliah Anda sejalan dengan tujuan hidup jangka panjang." />
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

function DimCard({ title, score, icon, desc }: any) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 text-sky-500">
                {icon}
            </div>
            <div className="text-3xl font-bold mb-1">{score}</div>
            <div className="font-bold text-sm mb-1">{title}</div>
            <div className="text-xs opacity-60">{desc}</div>
        </div>
    );
}

function RecItem({ text }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
            <p className="opacity-90 leading-relaxed">{text}</p>
        </div>
    );
}

export default function SpiritualResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">Loading...</div>}>
            <SpiritualResultsContent />
        </Suspense>
    );
}
