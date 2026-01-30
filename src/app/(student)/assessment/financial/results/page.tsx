"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    TrendingUp, Shield, BarChart3, ChevronRight,
    DollarSign, Wallet, PieChart, Users, CheckCircle, AlertCircle
} from "lucide-react";

interface FinancialResult {
    knowledgeScore: number;
    behaviorScore: number;
    attitudeScore: number;
    compositeScore: number;
    intelligenceLevel: string;
}

function FinancialResultsContent() {
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [result, setResult] = useState<FinancialResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadResults() {
            try {
                const assessmentId = searchParams.get('id');
                if (!assessmentId) return;

                const { data } = await supabase
                    .from('financial_assessment_scores')
                    .select('*')
                    .eq('assessment_id', assessmentId)
                    .single();

                if (data) {
                    setResult({
                        knowledgeScore: Number(data.knowledge_score),
                        behaviorScore: Number(data.behavior_score),
                        attitudeScore: Number(data.attitude_score),
                        compositeScore: Number(data.composite_score),
                        intelligenceLevel: data.intelligence_level
                    });
                }
            } catch (error) {
                console.error("Failed to load results", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadResults();
    }, [searchParams, supabase]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center animate-pulse">Calculating Financial Intelligence...</div>;
    }

    if (!result) {
        return <div className="min-h-screen flex items-center justify-center">Results not found.</div>;
    }

    const getColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getBgColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4 pt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-xs uppercase tracking-wide">
                        <DollarSign className="w-4 h-4" /> Dimension 3: Financial Intelligence
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        Financial Profile: <span className={getColor(result.compositeScore)}>{result.intelligenceLevel}</span>
                    </h1>
                </div>

                {/* Main Score Card */}
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                    <div className={`h-2 w-full ${getBgColor(result.compositeScore)}`}></div>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="45" fill="none" className={getColor(result.compositeScore).replace('text-', 'stroke-')} strokeWidth="8" strokeDasharray={`${result.compositeScore * 2.83} 283`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-bold ${getColor(result.compositeScore)}`}>{Math.round(result.compositeScore)}</span>
                                    <span className="text-xs text-slate-400">Composite Index</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Financial Knowledge</h3>
                                    <div className="flex items-center gap-4">
                                        <Progress value={result.knowledgeScore} className="h-2 flex-1" />
                                        <span className="font-bold w-12">{Math.round(result.knowledgeScore)}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Understanding of financial concepts and instruments.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Financial Behavior</h3>
                                    <div className="flex items-center gap-4">
                                        <Progress value={result.behaviorScore} className="h-2 flex-1" />
                                        <span className="font-bold w-12">{Math.round(result.behaviorScore)}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Daily habits regarding saving, spending, and budgeting.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Financial Attitude</h3>
                                    <div className="flex items-center gap-4">
                                        <Progress value={result.attitudeScore} className="h-2 flex-1" />
                                        <span className="font-bold w-12">{Math.round(result.attitudeScore)}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Psychological outlook towards money and future planning.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Integration with Holistic Radar */}
                <Alert className="bg-blue-50 border-blue-200">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <AlertTitle className="text-blue-800">Holistic Integration</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Skor ini telah diperbarui ke dalam "9 Dimensions Radar Chart" di Dashboard Anda. Aspek finansial Anda mempengaruhi keseimbangan Environmental dan Social.
                    </AlertDescription>
                </Alert>

                <div className="flex justify-center gap-4 content-center">
                    <Button asChild size="lg" className="px-8 rounded-full">
                        <Link href="/dashboard">
                            Kembali ke Dashboard <ChevronRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <div className="text-center text-xs text-slate-400 pb-8">
                    Financial Intelligence Assessment v2.1 • PPSDM KM ITS
                </div>
            </div>
        </div>
    );
}

export default function FinancialResultsPage() {
    return (
        <Suspense fallback={<div>Loading Results...</div>}>
            <FinancialResultsContent />
        </Suspense>
    );
}
