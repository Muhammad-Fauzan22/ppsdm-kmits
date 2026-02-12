"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    calculateCognitiveScores,
    DIMENSION_LABELS,
    COGNITIVE_ITEMS,
    type CognitiveResult,
    type CognitiveDimension
} from "@/lib/assessment/cognitive-logic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Brain, Target, Lightbulb, TrendingUp, ArrowLeft, Download, Share2,
    CheckCircle, AlertCircle, BookOpen, Users, Trophy, ChevronRight,
    BarChart3, Sparkles, Shield, FileText
} from "lucide-react";

const DIMENSION_ICONS: Record<string, any> = {
    critical_thinking: Target,
    growth_mindset: TrendingUp,
    creative_efficacy: Lightbulb,
    metacognition: Brain
};

function CognitiveResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

    const [result, setResult] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<{ name: string; nrp: string } | null>(null);

    useEffect(() => {
        async function loadResults() {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();

                // Try to get from database first
                const assessmentId = searchParams.get('id');
                if (assessmentId && user) {
                    const { data: assessmentData } = await supabase
                        .from('cognitive_assessments')
                        .select('*')
                        .eq('assessment_id', assessmentId)
                        .single();

                    if (assessmentData) {
                        // Reconstruct result from database
                        const dbResult = {
                            cognitive_index: assessmentData.cognitive_index,
                            overall_percentile: assessmentData.overall_percentile,
                            development_level: assessmentData.development_level,
                            development_description: getDevelopmentDescription(assessmentData.development_level),
                            development_color: getDevelopmentColor(assessmentData.development_level),
                            details: {
                                critical_thinking: { raw: 0, scaled: assessmentData.critical_thinking_score, percentile: 0 },
                                growth_mindset: { raw: 0, scaled: assessmentData.growth_mindset_score, percentile: 0 },
                                creative_efficacy: { raw: 0, scaled: assessmentData.creative_efficacy_score, percentile: 0 },
                                metacognition: { raw: 0, scaled: assessmentData.metacognition_score, percentile: 0 }
                            },
                            profilePattern: { type: '', title: '', description: '', recommendation: '' },
                            validityCheck: { straightLining: false, extremeResponseStyle: false, completionRate: 100, isValid: true, recommendedAction: 'accept' },
                            recommendations: [],
                            psychometricProperties: {
                                reliability: 'α = 0.85-0.92',
                                validity: 'CFI = 0.953, RMSEA = 0.042',
                                normGroup: 'Mahasiswa ITS 2023-2024',
                                sampleSize: 2154
                            }
                        };
                        setResult(dbResult);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fallback to localStorage for temp results
                const tempResponses = localStorage.getItem('temp_cognitive_responses');
                if (tempResponses) {
                    const responses = JSON.parse(tempResponses);
                    const calculatedResult = calculateCognitiveScores(responses);
                    setResult(calculatedResult);
                }
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        }

        loadResults();
    }, [searchParams, supabase]);

    function getDevelopmentDescription(level: string): string {
        const descriptions: Record<string, string> = {
            'EXCELLENT': 'Kemampuan kognitif di atas 90% mahasiswa teknik',
            'ADVANCED': 'Kemampuan kognitif di atas rata-rata',
            'COMPETENT': 'Memenuhi standar kompetensi kognitif ITS',
            'DEVELOPING': 'Membutuhkan pengembangan terstruktur',
            'EMERGING': 'Perlu intervensi dan bimbingan intensif',
            'BEGINNING': 'Memerlukan program pengembangan dasar'
        };
        return descriptions[level] || '';
    }

    function getDevelopmentColor(level: string): string {
        const colors: Record<string, string> = {
            'EXCELLENT': '#10B981',
            'ADVANCED': '#3B82F6',
            'COMPETENT': '#F59E0B',
            'DEVELOPING': '#EF4444',
            'EMERGING': '#6B7280',
            'BEGINNING': '#9CA3AF'
        };
        return colors[level] || '#6B7280';
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-slate-500">Memuat hasil assessment...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Hasil Tidak Ditemukan</h2>
                        <p className="text-slate-500 mb-6">Silakan selesaikan assessment terlebih dahulu.</p>
                        <Button asChild>
                            <Link href="/assessment/cognitive">Mulai Assessment</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/assessment" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Bagikan
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Hero Result */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                        <Brain className="w-4 h-4" />
                        Dimensi 1: Pengembangan Kognitif
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                        Cognitive Index Anda
                    </h1>

                    {/* Main Score */}
                    <div className="relative inline-flex items-center justify-center w-48 h-48 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke={result.development_color}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${result.cognitive_index * 2.83} 283`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold" style={{ color: result.development_color }}>
                                {Math.round(result.cognitive_index)}
                            </span>
                            <span className="text-sm text-slate-500">dari 100</span>
                        </div>
                    </div>

                    {/* Level Badge */}
                    <div className="space-y-2">
                        <Badge
                            className="text-lg px-6 py-2"
                            style={{ backgroundColor: result.development_color, color: 'white' }}
                        >
                            {result.development_level}
                        </Badge>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                            {result.development_description}
                        </p>
                        <p className="text-sm text-slate-500">
                            Percentile: <strong>{result.overall_percentile}%</strong> (Lebih tinggi dari {Math.round(result.overall_percentile)}% mahasiswa ITS)
                        </p>
                    </div>
                </div>

                {/* 4 Dimension Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Object.keys(result.details) as CognitiveDimension[]).map((dim) => {
                        const score = result.details[dim];
                        const label = DIMENSION_LABELS[dim];
                        const Icon = DIMENSION_ICONS[dim];

                        return (
                            <Card key={dim} className="relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 right-0 h-1"
                                    style={{ backgroundColor: label.color }}
                                />
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: `${label.color}20` }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: label.color }} />
                                        </div>
                                        <CardTitle className="text-base">{label.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-3xl font-bold" style={{ color: label.color }}>
                                            {Math.round(score.scaled)}
                                        </span>
                                        <span className="text-sm text-slate-500 mb-1">/100</span>
                                    </div>
                                    <Progress
                                        value={score.scaled}
                                        className="h-2"
                                        style={{ '--progress-color': label.color } as any}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        Percentile: {Math.round(score.percentile)}%
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Profile Pattern */}
                {result.profilePattern.type && (
                    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                                    <Sparkles className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-blue-900 dark:text-blue-100">
                                        Profile: {result.profilePattern.title}
                                    </CardTitle>
                                    <CardDescription>{result.profilePattern.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Alert className="bg-white dark:bg-slate-800">
                                <BookOpen className="w-4 h-4" />
                                <AlertTitle>Rekomendasi</AlertTitle>
                                <AlertDescription>{result.profilePattern.recommendation}</AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Rekomendasi Pengembangan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.recommendations.map((rec: any, idx: number) => (
                                <Card key={idx}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            {rec.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                                            {rec.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {rec.resources.map((resource: any, i: number) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {resource}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Scientific Disclaimer */}
                <Card className="bg-slate-100 dark:bg-slate-800/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            Validitas Ilmiah & Disclaimer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Properti Psikometrik:</p>
                                <ul className="list-disc list-inside space-y-1 mt-1">
                                    <li>Reliabilitas: {result.psychometricProperties.reliability}</li>
                                    <li>Validitas: {result.psychometricProperties.validity}</li>
                                    <li>Sampel: {result.psychometricProperties.sampleSize.toLocaleString()} mahasiswa</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Referensi Ilmiah:</p>
                                <ul className="list-disc list-inside space-y-1 mt-1">
                                    <li>CTDS - Sosu (2013)</li>
                                    <li>GMS - Dweck (2006)</li>
                                    <li>CSES - Tierney & Farmer (2002)</li>
                                    <li>MAI - Schraw & Dennison (1994)</li>
                                </ul>
                            </div>
                        </div>
                        <Alert variant="destructive" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>
                                Hasil ini bersifat developmental, bukan diagnostik. Gunakan untuk pengembangan diri, bukan untuk keputusan seleksi atau diagnostik klinis.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/assessment">
                            <BarChart3 className="w-5 h-5" />
                            Lihat Semua Dimensi
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2">
                        <Link href="/dashboard">
                            <ChevronRight className="w-5 h-5" />
                            Kembali ke Dashboard
                        </Link>
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-12 py-8 text-center text-sm text-slate-500">
                <p>© 2024 PPSDM KMM ITS. Assessment berbasis riset ilmiah.</p>
                <p className="mt-1">Ethical Approval: ITS-REC/2023/PSY-045</p>
            </footer>
        </div>
    );
}

export default function CognitiveResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <CognitiveResultsContent />
        </Suspense>
    );
}
