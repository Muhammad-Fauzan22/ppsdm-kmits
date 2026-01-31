"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ShieldCheck, TrendingUp, Award, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from "recharts";

interface CharacterResult {
    overall_score: number;
    integrity_score: number;
    courage_score: number;
    fairness_score: number;
    responsibility_score: number;
    humility_score: number;
    compassion_score: number;
    self_discipline_score: number;
    ethical_decision_score: number;
    risk_level: string;
    percentile_rank: number;
    recommendations: string[];
    created_at: string;
}

export default function CharacterResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <CharacterResultsContent />
        </Suspense>
    );
}

function CharacterResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // Optional: if we want specific result. Defaults to latest.
    const supabase = createClient();

    const [result, setResult] = useState<CharacterResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResult() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let data, error;

            if (id) {
                const res = await supabase.from("character_assessments").select("*").eq("id", id).single();
                data = res.data;
                error = res.error;
            } else {
                const res = await supabase
                    .from("character_assessments")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(1);

                data = res.data ? res.data[0] : null;
                error = res.error;
            }

            if (data) {
                setResult(data as any); // Cast to any to avoid strict type checks if table types are missing
            }
            setLoading(false);
        }
        fetchResult();
    }, [id, supabase]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!result) return <div className="p-8 text-center">Belum ada hasil assessment.</div>;

    // Chart Data
    const data = [
        { subject: 'Integritas', A: result.integrity_score, fullMark: 100 },
        { subject: 'Keberanian', A: result.courage_score, fullMark: 100 },
        { subject: 'Keadilan', A: result.fairness_score, fullMark: 100 },
        { subject: 'Tgg Jawab', A: result.responsibility_score, fullMark: 100 },
        { subject: 'Kerendahan Hati', A: result.humility_score, fullMark: 100 },
        { subject: 'Kasih Sayang', A: result.compassion_score, fullMark: 100 },
        { subject: 'Disiplin', A: result.self_discipline_score, fullMark: 100 },
        { subject: 'Keputusan Etis', A: result.ethical_decision_score, fullMark: 100 },
    ];

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Exceptional': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'Strong': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Developing': return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-red-600 bg-red-50 border-red-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Profil Karakter & Etika</h1>
                            <p className="text-gray-500 mt-1">Hasil analisis detail kekuatan karakter Anda.</p>
                        </div>
                        <div className={`px-6 py-3 rounded-xl border-2 font-bold text-lg ${getLevelColor(result.risk_level)}`}>
                            {result.risk_level} Character
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium"><ShieldCheck className="w-5 h-5" /> Skor Keseluruhan</div>
                            <div className="text-4xl font-bold text-slate-900">{result.overall_score}<span className="text-lg text-slate-400 font-normal">/100</span></div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium"><TrendingUp className="w-5 h-5" /> Peringkat Persentil</div>
                            <div className="text-4xl font-bold text-blue-600">{result.percentile_rank}th<span className="text-sm text-slate-400 font-normal block mt-1">Lebih tinggi dari {result.percentile_rank}% mahasiswa</span></div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium"><Award className="w-5 h-5" /> Kekuatan Utama</div>
                            <div className="text-lg font-semibold text-slate-900">
                                {data.sort((a, b) => b.A - a.A)[0].subject}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 w-full text-left">Peta Dimensi Karakter</h3>
                        <div className="w-full h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar name="Skor Anda" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sub-scores breakdown */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detail Sub-Dimensi</h3>
                        <div className="space-y-4">
                            {data.map((item) => (
                                <div key={item.subject}>
                                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                        <span>{item.subject}</span>
                                        <span>{item.A}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${item.A >= 80 ? 'bg-emerald-500' : item.A >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                            style={{ width: `${item.A}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-purple-600" /> Rekomendasi Pengembangan Diri
                    </h3>
                    <div className="grid gap-4">
                        {result.recommendations && result.recommendations.length > 0 ? (
                            result.recommendations.map((rec, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium">{rec}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Tidak ada rekomendasi spesifik saat ini. Teruskan kerja bagus!</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg">Kembali ke Dashboard</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
