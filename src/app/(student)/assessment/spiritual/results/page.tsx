"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

interface AssessmentData {
    normalized_score: number;
    developmental_stage: string;
    percentile_rank: number;
    purpose_meaning_score: number;
    gratitude_mindfulness_score: number;
    connectedness_transcendence_score: number;
    altruism_contribution_score: number;
    analysis_json: { recommendations: string[] };
    created_at: string;
}

export default function SpiritualResultsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [result, setResult] = useState<AssessmentData | null>(null);
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
                    .from("spiritual_assessments")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                if (error) {
                    console.error("Error fetching results:", error);
                } else {
                    setResult(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };

        if (user) fetchResults();
    }, [user]);

    if (!user || fetching) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    if (!result) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Belum ada data assessment.</h2>
                <Button onClick={() => router.push("/assessment/spiritual")}>Mulai Assessment</Button>
            </div>
        );
    }

    const chartData = [
        { subject: "Meaning", A: result.purpose_meaning_score, fullMark: 100 },
        { subject: "Gratitude", A: result.gratitude_mindfulness_score, fullMark: 100 },
        { subject: "Connectedness", A: result.connectedness_transcendence_score, fullMark: 100 },
        { subject: "Altruism", A: result.altruism_contribution_score, fullMark: 100 },
    ];

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Transcending': return 'text-purple-600 bg-purple-100';
            case 'Expressing': return 'text-blue-600 bg-blue-100';
            case 'Integrating': return 'text-green-600 bg-green-100';
            case 'Exploring': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="bg-white rounded-3xl shadow-xl p-8 border-b-8 border-purple-500 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Perkembangan Spiritual</h1>
                    <p className="text-gray-500">Dimensi 8: Spiritual & Cultural Values</p>

                    <div className="mt-8 flex flex-col items-center">
                        <div className="text-6xl font-extrabold text-purple-600 mb-2">
                            {result.normalized_score}
                            <span className="text-2xl text-gray-400 font-normal">/100</span>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-bold text-lg ${getStageColor(result.developmental_stage)}`}>
                            {result.developmental_stage} Stage
                        </span>
                        <p className="mt-4 text-sm text-gray-500 max-w-md">
                            Anda berada di persentil ke-{result.percentile_rank} mahasiswa Indonesia.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold mb-4">Peta Dimensi</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar
                                        name="Score"
                                        dataKey="A"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-6">Detail Sub-Dimensi</h3>
                        <div className="space-y-6">
                            {chartData.map((item) => (
                                <div key={item.subject}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-700">{item.subject}</span>
                                        <span className="font-bold text-purple-700">{item.A}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full"
                                            style={{ width: `${item.A}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        Rekomendasi Pengembangan
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {result.analysis_json.recommendations?.map((rec, idx) => (
                            <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex gap-4 items-start">
                                <div className="bg-purple-200 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    {idx + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                        Kembali ke Dashboard
                    </Button>
                    <Button onClick={() => router.push("/assessment/spiritual")}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Ambil Ulang Assessment
                    </Button>
                </div>

            </div>
        </div>
    );
}
