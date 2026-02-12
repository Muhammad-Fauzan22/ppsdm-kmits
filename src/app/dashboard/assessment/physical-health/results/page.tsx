
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Activity, Moon, Utensils, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { HealthResult, RiskFlag } from '@/lib/assessment/physical-health-logic';

// Helper to reconstruct Result type from DB structure if needed, 
// but here we might just fetch the raw data and display.
// Ideally, the logic type matches the DB structure we defined (assessments + subdomains + flags).

interface DBResult {
    total_score: number;
    percentile: number;
    health_category: string;
    subdomains: { subdomain_name: string; subdomain_score: number }[];
    flags: { risk_code: string; severity: string; flag_message: string; recommendation: string }[];
}

export default function PhysicalHealthResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading results...</div>}>
            <PhysicalHealthResultsContent />
        </Suspense>
    );
}

function PhysicalHealthResultsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [result, setResult] = useState<DBResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const supabase = createClient();

            // Fetch Header
            const { data: assessment } = await supabase
                .from('physical_health_assessments')
                .select('*')
                .eq('assessment_id', id)
                .single();

            if (!assessment) return;

            // Fetch Subdomains
            const { data: subdomains } = await supabase
                .from('physical_health_subdomains')
                .select('*')
                .eq('assessment_id', id);

            // Fetch Flags
            const { data: flags } = await supabase
                .from('health_risk_flags')
                .select('*')
                .eq('assessment_id', id);

            if (assessment) {
                setResult({
                    total_score: assessment.total_score,
                    percentile: assessment.percentile,
                    health_category: assessment.health_category,
                    subdomains: subdomains || [],
                    flags: flags || []
                });
            }
            setLoading(false);
        };

        fetchResult();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading results...</div>;
    if (!result) return <div className="min-h-screen flex items-center justify-center">Data not found.</div>;

    // Helper for colors
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-50';
        if (score >= 60) return 'text-blue-600 bg-blue-50';
        if (score >= 40) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const mapSubdomainLabel = (name: string) => {
        const map: Record<string, string> = {
            'physical_activity': 'Aktivitas Fisik',
            'sleep_health': 'Kualitas Tidur',
            'nutrition_hydration': 'Nutrisi & Hidrasi',
            'vitality_wellbeing': 'Vitalitas & Kesejahteraan'
        };
        return map[name] || name;
    };

    const mapSubdomainIcon = (name: string) => {
        const map: Record<string, any> = {
            'physical_activity': Activity,
            'sleep_health': Moon,
            'nutrition_hydration': Utensils,
            'vitality_wellbeing': Zap
        };
        return map[name] || Activity;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Health Awareness Profile</h1>
                    <p className="text-slate-500">Hasil Asesmen Fisik & Vitalitas (ISPHVA-8)</p>
                </div>

                {/* Main Score Card */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-slate-900 p-8 flex flex-col items-center justify-center text-white text-center">
                            <div className="relative w-32 h-32 mb-4">
                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={result.total_score >= 70 ? '#10B981' : '#F59E0B'} strokeWidth="3" strokeDasharray={`${result.total_score}, 100`} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-3xl font-bold">{result.total_score}</span>
                                    <span className="text-xs text-slate-400">/ 100</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{result.health_category}</h2>
                            <p className="text-sm text-slate-400">Percentile: Top {100 - result.percentile}%</p>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h3 className="text-xl font-semibold mb-6">Analisis Subdomain</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {result.subdomains.map((sub) => {
                                    const Icon = mapSubdomainIcon(sub.subdomain_name);
                                    return (
                                        <div key={sub.subdomain_name} className="flex items-start space-x-3">
                                            <div className={`p-2 rounded-lg ${getScoreColor(sub.subdomain_score)}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-slate-700">{mapSubdomainLabel(sub.subdomain_name)}</span>
                                                    <span className="text-sm font-bold text-slate-900">{sub.subdomain_score}</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-900 opacity-80" style={{ width: `${sub.subdomain_score}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Risk Flags */}
                {result.flags.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">Perhatian Khusus</h3>
                        <div className="grid gap-4">
                            {result.flags.map((flag) => (
                                <Alert key={flag.risk_code} variant={flag.severity === 'high' ? 'destructive' : 'default'} className="border-l-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="font-semibold">{flag.flag_message}</AlertTitle>
                                    <AlertDescription className="mt-1 text-sm opacity-90">
                                        Rekomendasi: {flag.recommendation}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action */}
                <div className="flex justify-center gap-4">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/dashboard">Ke Dashboard</Link>
                    </Button>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700" size="lg">
                        <Link href="https://medical.its.ac.id/" target="_blank">
                            Kunjungi ITS Medical Center <ChevronRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
