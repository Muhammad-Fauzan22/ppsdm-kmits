"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Leaf } from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface EnvResult {
    overall_score: number;
    awareness_score: number;
    sustainable_behavior_score: number;
    work_life_balance_score: number;
    digital_wellbeing_score: number;
    minimalism_score: number;
    energy_conservation_score: number;
    community_engagement_score: number;
    advocacy_score: number;
    percentile_rank: number;
    faculty_mean_comparison: number;
    analysis_json: { recommendations: string[] };
}

export default function EnvironmentalResultsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [result, setResult] = useState<EnvResult | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);
        };
        checkUser();
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from("environmental_assessments")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                if (error) console.error(error);
                else setResult(data);
            } finally {
                setFetching(false);
            }
        };
        if (user) fetchResults();
    }, [user]);

    if (!user || fetching) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!result) return <div className="p-8 text-center text-xl">Belum ada data.</div>;

    const radarData = [
        { subject: "Awareness", A: result.awareness_score },
        { subject: "Behavior", A: result.sustainable_behavior_score },
        { subject: "WLB", A: result.work_life_balance_score },
        { subject: "Digital", A: result.digital_wellbeing_score },
        { subject: "Minimalism", A: result.minimalism_score },
        { subject: "Energy", A: result.energy_conservation_score },
        { subject: "Community", A: result.community_engagement_score },
        { subject: "Advocacy", A: result.advocacy_score },
    ];

    const comparisonData = [
        { name: 'Anda', score: result.overall_score, fill: '#16a34a' },
        { name: 'Rata-rata', score: result.faculty_mean_comparison, fill: '#9ca3af' },
    ];

    return (
        <div className="min-h-screen bg-green-50 py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 border-t-8 border-green-600 text-center">
                    <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900">Profil Gaya Hidup & Lingkungan</h1>
                    <div className="mt-6 flex justify-center items-end gap-2">
                        <span className="text-5xl font-extrabold text-green-700">{result.overall_score}</span>
                        <span className="text-gray-500 pb-2">/100</span>
                    </div>
                    <p className="mt-2 text-green-800 font-medium">
                        Lebih tinggi dari {result.percentile_rank}% mahasiswa lainnya.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4 text-center">8 Dimensi Gaya Hidup</h3>
                        <div className="w-full" style={{ height: '320px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar name="Skor" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                        <h3 className="text-lg font-bold mb-4">Komparasi</h3>
                        <div className="w-full" style={{ height: '256px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData}>
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Bar dataKey="score" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">Bandingkan skor Anda dengan rata-rata fakultas.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Rekomendasi Aksi</h3>
                    <div className="grid gap-4">
                        {result.analysis_json.recommendations?.map((rec, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                <div className="font-bold text-green-800">#{i + 1}</div>
                                <p className="text-gray-800">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4 py-8">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                        Ke Dashboard
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/assessment/environmental")}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Update Data
                    </Button>
                </div>
            </div>
        </div>
    );
}
