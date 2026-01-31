"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Brain, Wallet, TrendingUp, AlertTriangle, CheckCircle, BookOpen, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function FinancialResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const { data } = await supabase.from('financial_assessments').select('*').eq('assessment_id', id).single();
            if (data) setResult(data);
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Generating Financial Report...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Result not found.</div>;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-600";
        if (score >= 60) return "text-blue-600";
        if (score >= 40) return "text-amber-500";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-6 lg:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            Dimension 3 Analysis
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Intelligence Profile</h1>
                        <p className="text-slate-500">Comprehensive analysis of your financial capability.</p>
                    </div>
                    <Button variant="outline">Download Report</Button>
                </div>

                {/* Main Score Card */}
                <div className="bg-white dark:bg-[#151b26] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Overall Intelligence Level</h2>
                        <div className={cn("text-5xl md:text-6xl font-extrabold tracking-tight", getScoreColor(result.composite_score))}>
                            {result.intelligence_level}
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                            Your composite score is <strong>{result.composite_score}</strong> (Top {result.composite_percentile}% of ITS Students).
                            You demonstrate <strong>{result.intelligence_level}</strong> capabilities in managing financial resources.
                        </p>
                    </div>
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            <path className={cn("animate-[dash_1.5s_ease-out_forwards]", getScoreColor(result.composite_score))} strokeDasharray={`${result.composite_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">{Math.round(result.composite_score)}</span>
                            <span className="text-sm text-slate-500 uppercase font-medium">Composite</span>
                        </div>
                    </div>
                </div>

                {/* 3 Pillars Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScoreCard
                        title="Financial Knowledge"
                        score={result.knowledge_score}
                        percentile={result.knowledge_percentile}
                        icon={Brain}
                        color="blue"
                        description="Understanding of economic concepts, ROI, and risk."
                    />
                    <ScoreCard
                        title="Financial Behavior"
                        score={result.behavior_score}
                        percentile={result.behavior_percentile}
                        icon={Wallet}
                        color="emerald"
                        description="Habits regarding budgeting, saving, and debt."
                    />
                    <ScoreCard
                        title="Financial Attitude"
                        score={result.attitude_score}
                        percentile={result.attitude_percentile}
                        icon={TrendingUp}
                        color="purple"
                        description="Mindset towards money, future, and risk tolerance."
                    />
                </div>

                {/* Subdomain Breakdown */}
                <div className="bg-white dark:bg-[#151b26] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-slate-500" />
                        Specific Competencies
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">
                        {Object.entries(result.subdomain_scores || {}).map(([key, rawScore]: [string, any]) => {
                            const score = Number(rawScore);
                            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                                        <span className={cn("font-bold", getScoreColor(score))}>{Math.round(score)}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full", getScoreColor(score).replace('text-', 'bg-'))} style={{ width: `${score}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-blue-600 rounded-2xl p-8 text-white">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ArrowRight className="w-6 h-6" />
                            Priority Actions
                        </h3>
                        <div className="space-y-6">
                            {result.recommendations?.filter((r: any) => r.priority === 'high').slice(0, 3).map((rec: any, idx: number) => (
                                <div key={idx} className="flex gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                    <AlertTriangle className="w-6 h-6 text-amber-300 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-blue-50 mb-1">{rec.title}</h4>
                                        <p className="text-sm text-blue-100 leading-relaxed">{rec.action}</p>
                                        {rec.resource && (
                                            <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                                                <BookOpen className="w-3 h-3" />
                                                Recommended Resource
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!result.recommendations || result.recommendations.filter((r: any) => r.priority === 'high').length === 0) && (
                                <div className="text-blue-100 italic">No high priority actions needed. Maintain your excellent habits!</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Development Areas</h3>
                        <div className="space-y-4">
                            {result.recommendations?.filter((r: any) => r.priority === 'medium').slice(0, 4).map((rec: any, idx: number) => (
                                <div key={idx} className="flex gap-3 items-start p-3 hover:bg-white dark:hover:bg-[#1e2532] rounded-lg transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{rec.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rec.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="rounded-full px-8">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ title, score, percentile, icon: Icon, color, description }: any) {
    const isGood = score >= 60;
    const colorClass = isGood ? `text-${color}-600` : `text-amber-500`;
    const bgClass = isGood ? `bg-${color}-50 dark:bg-${color}-900/10` : `bg-amber-50 dark:bg-amber-900/10`;

    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", bgClass)}>
                    <Icon className={cn("w-6 h-6", colorClass)} />
                </div>
                <div className="text-right">
                    <span className={cn("text-3xl font-bold block", colorClass)}>{Math.round(score)}</span>
                    <span className="text-xs text-slate-400 font-medium">Top {percentile}%</span>
                </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px]">{description}</p>
        </div>
    );
}

export default function FinancialResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <FinancialResultsContent />
        </Suspense>
    );
}
