"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HEALTH_ITEMS, calculateHealthScore } from "@/lib/assessment/health-logic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Moon, Apple, ShieldAlert, ArrowRight, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HealthAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Steps: Guide -> Consent -> Activity -> Sleep -> Nutrition -> Vitality -> Preventive
    const [step, setStep] = useState<'guide' | 'consent' | 'activity' | 'sleep' | 'nutrition' | 'vitality' | 'preventive'>('guide');
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // Step Logic
    const nextStep = () => {
        if (step === 'activity') setStep('sleep');
        else if (step === 'sleep') setStep('nutrition');
        else if (step === 'nutrition') setStep('vitality');
        else if (step === 'vitality') setStep('preventive');
    };

    const handleInput = (id: string, value: number) => {
        setResponses(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const results = calculateHealthScore(responses);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                localStorage.setItem("temp_health_responses", JSON.stringify(responses));
                router.push("/auth/register?next=/assessment/health/claim");
                return;
            }

            const { data, error } = await supabase.from('health_assessments').insert({
                user_id: user.id,
                physical_activity_score: results.scores.activity,
                sleep_quality_score: results.scores.sleep,
                nutrition_score: results.scores.nutrition,
                vitality_score: results.scores.vitality,
                preventive_score: results.scores.preventive,
                composite_score: results.composite,
                health_category: results.category,
                risk_factors: results.risks
            }).select().single();

            if (error) throw error;
            router.push(`/assessment/health/results?id=${data.assessment_id}`);

        } catch (error) {
            alert("Submission failed");
            setIsSubmitting(false);
        }
    };

    // --- STEP 1: GUIDE ---
    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-6 lg:p-12 font-sans text-slate-900 dark:text-slate-50">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-xs uppercase tracking-wide">
                            Dimensi 4: Kesehatan Fisik & Vitalitas
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Investasi Terbaik <span className="text-rose-600">Masa Depan.</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                            Kesehatan fisik adalah fondasi dari kesuksesan akademik. Tanpa vitalitas, potensi intelektual tidak dapat dieksekusi maksimal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Activity className="w-10 h-10 text-rose-500 mb-2" />
                                <CardTitle>Fakta Ilmiah</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>Mahasiswa dengan kesehatan fisik baik memiliki IPK rata-rata 0.3 poin lebih tinggi (Journal of American College Health).</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-lg bg-white dark:bg-[#151b26]">
                            <CardHeader>
                                <Moon className="w-10 h-10 text-indigo-500 mb-2" />
                                <CardTitle>Kualitas Tidur</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>Tidur berkualitas meningkatkan daya ingat jangka panjang hingga 40% (Nature Neuroscience).</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end pt-8">
                        <Button size="lg" onClick={() => setStep('consent')} className="gap-2 text-lg px-8 h-14 bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-500/30 rounded-full">
                            Mulai Asesmen <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // --- STEP 2: CONSENT ---
    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="w-6 h-6 text-rose-600" />
                            Medical Disclaimer (Penting)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>Bukan Diagnosis Medis</AlertTitle>
                            <AlertDescription>
                                Asesmen ini bertujuan untuk kesadaran diri. Hasil TIDAK menggantikan pemeriksaan medis profesional. Jika Anda memiliki keluhan fisik, segera hubungi dokter.
                            </AlertDescription>
                        </Alert>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg border">
                                <input type="checkbox" id="c1" checked={agreement.read} onChange={e => setAgreement(p => ({ ...p, read: e.target.checked }))} />
                                <label htmlFor="c1" className="text-sm">Saya mengerti bahwa ini bukan diagnosis medis.</label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg border">
                                <input type="checkbox" id="c2" checked={agreement.consent} onChange={e => setAgreement(p => ({ ...p, consent: e.target.checked }))} />
                                <label htmlFor="c2" className="text-sm">Saya setuju data saya digunakan untuk riset anonim.</label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-rose-600" onClick={() => setStep('activity')} disabled={!agreement.read || !agreement.consent}>Lanjut ke Aktivitas Fisik</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // --- GENERIC QUESTION RENDERER ---
    const renderSection = (sectionItems: typeof HEALTH_ITEMS, title: string, nextAction: () => void, isFinal = false) => {
        const isComplete = sectionItems.every(i => responses[i.id] !== undefined);

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {sectionItems.map(item => (
                            <div key={item.id} className="space-y-3">
                                <label className="font-medium text-lg">{item.text}</label>

                                {item.type === 'days' && (
                                    <div className="flex gap-2">
                                        {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                                            <Button type="button" key={num} variant={responses[item.id] === num ? "default" : "outline"} onClick={() => handleInput(item.id, num)} className="flex-1">
                                                {num} Hari
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                {(item.type === 'likert' || item.type === 'frequency' || item.type === 'frequency_reverse') && (
                                    <div className="grid grid-cols-5 gap-2">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <Button type="button" key={num} variant={responses[item.id] === num ? "default" : "outline"} onClick={() => handleInput(item.id, num)}>
                                                {num}
                                            </Button>
                                        ))}
                                        <div className="col-span-5 flex justify-between text-xs text-slate-400 px-1">
                                            <span>Tidak Pernah/Tidak Setuju</span>
                                            <span>Selalu/Sangat Setuju</span>
                                        </div>
                                    </div>
                                )}

                                {item.type.includes('hours') && (
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Masukkan jumlah jam (contoh: 7)"
                                        onChange={(e) => handleInput(item.id, parseFloat(e.target.value))}
                                        value={responses[item.id] || ''}
                                    />
                                )}

                                {item.type === 'servings' && (
                                    <div className="flex gap-2">
                                        {[0, 1, 2, 3, 4, 5].map(num => (
                                            <Button type="button" key={num} variant={responses[item.id] === num ? "default" : "outline"} onClick={() => handleInput(item.id, num)} className="flex-1">
                                                {num}+ Porsi
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                {item.type === 'boolean' && (
                                    <div className="flex gap-4">
                                        <Button type="button" variant={responses[item.id] === 1 ? "default" : "outline"} onClick={() => handleInput(item.id, 1)} className="flex-1">Ya, Lengkap</Button>
                                        <Button type="button" variant={responses[item.id] === 0 ? "default" : "outline"} onClick={() => handleInput(item.id, 0)} className="flex-1">Belum/Tidak Yakin</Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={nextAction} disabled={!isComplete || isSubmitting}>
                            {isFinal ? (isSubmitting ? "Menyimpan..." : "Selesai & Lihat Hasil") : "Lanjut"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (step === 'activity') return renderSection(HEALTH_ITEMS.slice(0, 3), "Bagian 1: Aktivitas Fisik", nextStep);
    if (step === 'sleep') return renderSection(HEALTH_ITEMS.slice(3, 6), "Bagian 2: Kualitas Tidur", nextStep);
    if (step === 'nutrition') return renderSection(HEALTH_ITEMS.slice(6, 9), "Bagian 3: Nutrisi", nextStep);
    if (step === 'vitality') return renderSection(HEALTH_ITEMS.slice(9, 12), "Bagian 4: Vitalitas Subjektif", nextStep);
    if (step === 'preventive') return renderSection(HEALTH_ITEMS.slice(12, 15), "Bagian 5: Pencegahan", handleSubmit, true);

    return <div>Loading...</div>;
}
