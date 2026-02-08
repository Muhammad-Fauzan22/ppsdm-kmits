"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Users, Activity, ExternalLink, Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function EmotionalResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('emotional_intelligence_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Report...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Result not found.</div>;

    // Helper for Radar Chart Data (recharts format)
    const chartData = [
        {
            subject: 'Self Awareness',
            yourProfile: result.subdomains.self_awareness.score,
            populationAvg: 68,
            fullMark: 100,
        },
        {
            subject: 'Self Management',
            yourProfile: result.subdomains.self_management.score,
            populationAvg: 65,
            fullMark: 100,
        },
        {
            subject: 'Social Awareness',
            yourProfile: result.subdomains.social_awareness.score,
            populationAvg: 68,
            fullMark: 100,
        },
        {
            subject: 'Relationship Mgmt',
            yourProfile: result.subdomains.relationship_management.score,
            populationAvg: 66,
            fullMark: 100,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
                            Dimension 5 Analysis
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Emotional Intelligence Profile</h1>
                    </div>
                </div>

                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-white dark:bg-[#151b26] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-center items-center text-center">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Composite EQ Score</h2>
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <path className="text-rose-500 animate-[dash_1.5s_ease-out_forwards]" strokeDasharray={`${result.raw_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            </svg>
                            <span className="absolute text-5xl font-extrabold text-slate-900 dark:text-white">{Math.round(result.raw_score)}<span className="text-lg text-slate-400 font-normal">%</span></span>
                        </div>
                        <div className="mt-4">
                            <span className="px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 font-bold text-sm border border-rose-200 dark:border-rose-800">
                                {result.intelligence_level}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-4">Percentile: Top {result.percentile}%</p>
                    </div>

                    <div className="md:col-span-2 bg-white dark:bg-[#151b26] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
                        <div className="w-full max-w-md h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={chartData}>
                                    <PolarGrid stroke="rgba(0,0,0,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                    <Radar
                                        name="Your Profile"
                                        dataKey="yourProfile"
                                        stroke="rgba(59, 130, 246, 1)"
                                        fill="rgba(59, 130, 246, 0.2)"
                                        strokeWidth={2}
                                    />
                                    <Radar
                                        name="Population Avg"
                                        dataKey="populationAvg"
                                        stroke="rgba(148, 163, 184, 0.5)"
                                        fill="rgba(148, 163, 184, 0.1)"
                                        strokeWidth={1}
                                        strokeDasharray="5 5"
                                    />
                                    <Legend />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Subdomains */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SubdomainCard
                        title="Self Awareness"
                        score={result.subdomains.self_awareness.score}
                        level={result.subdomains.self_awareness.level}
                        icon={Brain}
                        color="blue"
                    />
                    <SubdomainCard
                        title="Self Management"
                        score={result.subdomains.self_management.score}
                        level={result.subdomains.self_management.level}
                        icon={Activity}
                        color="emerald"
                    />
                    <SubdomainCard
                        title="Social Awareness"
                        score={result.subdomains.social_awareness.score}
                        level={result.subdomains.social_awareness.level}
                        icon={Heart}
                        color="rose"
                    />
                    <SubdomainCard
                        title="Relationship Mgmt"
                        score={result.subdomains.relationship_management.score}
                        level={result.subdomains.relationship_management.level}
                        icon={Users}
                        color="purple"
                    />
                </div>

                {/* Recommendations */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-8">Focus Development Area</h3>
                        <div className="space-y-6">
                            {result.recommendations?.map((rec: any, idx: number) => (
                                <div key={idx} className="flex gap-6 items-start p-4 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                                        <span className="font-bold">{idx + 1}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-2">{rec.title}</h4>
                                        <p className="text-slate-300 leading-relaxed max-w-2xl">{rec.description}</p>
                                        <button className="mt-4 text-xs uppercase tracking-wider font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
                                            Start Practice <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="hover:bg-slate-100 dark:hover:bg-slate-800">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SubdomainCard({ title, score, level, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className={`w-10 h-10 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">{title}</h4>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{Math.round(score)}</span>
                <span className="text-xs text-slate-400 mb-1">/ 100</span>
            </div>
            <div className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 inline-block">
                {level}
            </div>
        </div>
    );
}

export default function EmotionalResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmotionalResultsContent />
        </Suspense>
    );
}
