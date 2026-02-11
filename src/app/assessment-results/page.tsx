"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Clock, DollarSign, Dumbbell, Users, Sparkles, Scale, Flower2, Leaf, TrendingUp, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DIMENSION_META: Record<string, { title: string; icon: any; color: string }> = {
    cognitive: { title: "Kemampuan Intelektual", icon: Brain, color: "blue" },
    "self-management": { title: "Manajemen Diri", icon: Clock, color: "emerald" },
    financial: { title: "Literasi Finansial", icon: DollarSign, color: "yellow" },
    physical_health: { title: "Kesehatan Fisik", icon: Dumbbell, color: "red" },
    social: { title: "Kecerdasan Sosial", icon: Users, color: "pink" },
    emotional_intelligence: { title: "Kecerdasan Emosional", icon: Sparkles, color: "indigo" },
    mental: { title: "Kesehatan Mental", icon: Sparkles, color: "indigo" },
    character: { title: "Karakter & Etika", icon: Scale, color: "cyan" },
    spiritual: { title: "Perkembangan Spiritual", icon: Flower2, color: "violet" },
    environmental: { title: "Kesadaran Lingkungan", icon: Leaf, color: "lime" },
};

const colorClasses: Record<string, { text: string; bg: string; border: string }> = {
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
    pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    indigo: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    violet: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
    lime: { text: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/30" },
};

interface AssessmentResult {
    id: string;
    dimension: string;
    score: number;
    percentile: number;
    category: string;
    completed_at: string;
}

export default function AssessmentResultsPage() {
    const [results, setResults] = useState<AssessmentResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            try {
                const res = await fetch("/api/assessment-results");
                const data = await res.json();
                if (data.success && data.data) {
                    setResults(data.data);
                }
            } catch (error) {
                } finally {
                setIsLoading(false);
            }
        }
        fetchResults();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/pos">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Assessment Transcripts</h1>
                        <p className="text-slate-400">Rekap hasil assessment yang telah Anda selesaikan</p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{results.length}</p>
                                <p className="text-sm text-slate-400">Assessment Selesai</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0}
                                </p>
                                <p className="text-sm text-slate-400">Rata-rata Skor</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                <Download className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <Button variant="outline" size="sm" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                                    Export PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results List */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : results.length === 0 ? (
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-12 text-center">
                            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Hasil</h3>
                            <p className="text-slate-400 mb-6">Anda belum menyelesaikan assessment apapun.</p>
                            <Link href="/try-assessment">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Mulai Assessment Pertama
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {results.map((result) => {
                            const meta = DIMENSION_META[result.dimension] || { title: result.dimension, icon: Brain, color: "blue" };
                            const c = colorClasses[meta.color];
                            const Icon = meta.icon;

                            return (
                                <Card key={result.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-colors">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={cn("size-12 rounded-xl flex items-center justify-center shrink-0", c.bg)}>
                                            <Icon className={cn("w-6 h-6", c.text)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white truncate">{meta.title}</h3>
                                            <p className="text-sm text-slate-400">
                                                {formatDate(result.completed_at)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-white">{result.score}</p>
                                            <p className="text-xs text-slate-400">Percentile: {result.percentile}%</p>
                                        </div>
                                        <div className={cn("px-3 py-1 rounded-full text-xs font-semibold", c.bg, c.text)}>
                                            {result.category}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
