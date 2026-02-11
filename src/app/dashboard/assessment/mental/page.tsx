"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MENTAL_ITEMS, calculateMentalHealthScore } from "@/lib/assessment/mental-logic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { HeartPulse, ShieldCheck, Smile, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function MentalHealthAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Steps: Intro -> Consent -> Assessment (Paginated) -> Submit
    const [step, setStep] = useState<'intro' | 'consent' | 'assessment'>('intro');
    const [page, setPage] = useState(0); // 5 items per page = 4 pages
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [consents, setConsents] = useState({ voluntary: false, notDiagnostic: false, dataUsage: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ITEMS_PER_PAGE = 5;
    const TOTAL_PAGES = Math.ceil(MENTAL_ITEMS.length / ITEMS_PER_PAGE);

    // Current page items
    const pageItems = MENTAL_ITEMS.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
    const isPageComplete = pageItems.every(i => responses[i.id] !== undefined);

    const handleInput = (id: string, val: number) => {
        setResponses(prev => ({ ...prev, [id]: val }));
    };

    const handleNext = () => {
        if (page < TOTAL_PAGES - 1) {
            window.scrollTo(0, 0);
            setPage(p => p + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const results = calculateMentalHealthScore(responses);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                localStorage.setItem("temp_mental_responses", JSON.stringify(responses));
                router.push("/auth/register?next=/assessment/mental/claim");
                return;
            }

            const { data, error } = await supabase.from('mental_health_assessments').insert({
                user_id: user.id,
                emotional_score: results.scores.emotional,
                resilience_score: results.scores.resilience,
                stress_score: results.scores.stress,
                social_support_score: results.scores.support,
                total_score: results.total_score,
                risk_level: results.risk_level,
                validity_index: results.validity_index,
                red_flags: results.red_flags
            }).select().single();

            if (error) throw error;
            router.push(`/assessment/mental/results?id=${data.assessment_id}`);

        } catch (error) {
            alert("Terjadi kesalahan saat menyimpan. Coba lagi.");
            setIsSubmitting(false);
        }
    };

    // --- STEP 1: INTRO ---
    if (step === 'intro') {
        return (
            <div className="min-h-screen bg-emerald-50 dark:bg-[#062c21] p-6 lg:p-12 font-sans flex flex-col items-center justify-center">
                <div className="max-w-3xl w-full text-center space-y-6">
                    <HeartPulse className="w-20 h-20 text-emerald-500 mx-auto" />
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-emerald-50">Kesehatan Mental & Kesejahteraan</h1>
                    <p className="text-xl text-slate-600 dark:text-emerald-100/80 leading-relaxed">
                        Pahami kondisi batin Anda untuk membangun ketahanan akademik yang lebih kuat.
                        Asesmen ini aman, privat, dan berbasis riset psikologi positif.
                    </p>
                    <div className="pt-8">
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-10 h-14 text-lg" onClick={() => setStep('consent')}>
                            Mulai Perjalanan Anda
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: CONSENT ---
    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
                <Card className="max-w-xl w-full">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><ShieldCheck className="text-emerald-500" /> Informed Consent</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertTitle>Privasi Dijamin</AlertTitle>
                            <AlertDescription>Data Anda dienkripsi dan hanya dapat diakses oleh Anda.</AlertDescription>
                        </Alert>

                        <div className="space-y-3 pt-4">
                            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                <input type="checkbox" className="mt-1" checked={consents.voluntary} onChange={e => setConsents(p => ({ ...p, voluntary: e.target.checked }))} />
                                <span className="text-sm">Saya berpartisipasi secara sukarela tanpa paksaan.</span>
                            </label>
                            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                <input type="checkbox" className="mt-1" checked={consents.notDiagnostic} onChange={e => setConsents(p => ({ ...p, notDiagnostic: e.target.checked }))} />
                                <span className="text-sm">Saya paham ini <strong>bukan diagnosis klinis</strong> pengganti psikolog/psikiater.</span>
                            </label>
                            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                <input type="checkbox" className="mt-1" checked={consents.dataUsage} onChange={e => setConsents(p => ({ ...p, dataUsage: e.target.checked }))} />
                                <span className="text-sm">Saya setuju hasil digunakan secara anonim untuk riset kampus.</span>
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={!consents.voluntary || !consents.notDiagnostic || !consents.dataUsage}
                            onClick={() => setStep('assessment')}
                        >
                            Saya Setuju & Lanjutkan
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- STEP 3: ASSESSMENT ---
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <span>Halaman {page + 1} dari {TOTAL_PAGES}</span>
                    <span>ISMHA-20</span>
                </div>

                {/* Question List */}
                <div className="space-y-6">
                    {pageItems.map((item, idx) => (
                        <Card key={item.id} className="border-0 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6">{item.text}</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => handleInput(item.id, val)}
                                            className={cn(
                                                "h-12 rounded-lg font-bold transition-all duration-200",
                                                responses[item.id] === val
                                                    ? "bg-emerald-500 text-white shadow-md transform scale-105"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                            )}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                                    <span>Tidak Pernah</span>
                                    <span>Selalu</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Navigation */}
                <div className="flex justify-end pt-6">
                    <Button size="lg" onClick={handleNext} disabled={!isPageComplete || isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full shadow-lg shadow-emerald-500/20">
                        {isSubmitting ? "Menyimpan..." : (page === TOTAL_PAGES - 1 ? "Selesai & Lihat Hasil" : "Halaman Selanjutnya")}
                        {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
