"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SOCIAL_ITEMS, calculateSocialScore } from "@/lib/assessment/social-logic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Users, Brain, HeartHandshake, ArrowRight, MessageSquare, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SocialAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Steps: Guide -> Consent -> Assessment -> Submit
    const [step, setStep] = useState<'guide' | 'consent' | 'assessment'>('guide');
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // Filter Items
    const currentItem = SOCIAL_ITEMS[currentIndex];
    const progress = ((currentIndex) / SOCIAL_ITEMS.length) * 100;

    const handleResponse = (val: any) => {
        setResponses(prev => ({ ...prev, [currentItem.id]: val }));

        // Auto advance after short delay
        setTimeout(() => {
            if (currentIndex < SOCIAL_ITEMS.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Done
            }
        }, 300);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const results = calculateSocialScore(responses);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                localStorage.setItem("temp_social_responses", JSON.stringify(responses));
                router.push("/auth/register?next=/assessment/social/claim");
                return;
            }

            const { data, error } = await supabase.from('social_assessments').insert({
                user_id: user.id,
                awareness_score: results.scores.awareness,
                regulation_score: results.scores.regulation,
                empathy_score: results.scores.empathy,
                social_skills_score: results.scores.social_skills,
                composite_score: results.composite,
                profile_type: results.profile,
                leadership_potential: results.leadership_potential
            }).select().single();

            if (error) throw error;
            router.push(`/assessment/social/results?id=${data.assessment_id}`);

        } catch (error) {
            console.error(error);
            alert("Submission failed");
            setIsSubmitting(false);
        }
    };

    // --- STEP 1: GUIDE ---
    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#0B1120] p-6 lg:p-12 font-sans flex flex-col items-center justify-center">
                <div className="max-w-4xl w-full space-y-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-bold text-xs uppercase tracking-wide mx-auto md:mx-0">
                        Dimensi 5: Kecerdasan Emosional & Sosial
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        <span className="text-sky-600">Soft Skills</span> for Hard Engineering.
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
                        Di dunia kerja modern, IQ membuat Anda diterima kerja, tapi EQ dan SQ yang membuat Anda dipromosikan.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                        <FeatureCard icon={<Brain className="text-sky-500" />} title="Self Awareness" desc="Mengenali emosi diri sendiri sebagai data." />
                        <FeatureCard icon={<HeartHandshake className="text-rose-500" />} title="Empathy" desc="Memahami perspektif orang lain (User Centric)." />
                        <FeatureCard icon={<Users className="text-emerald-500" />} title="Social Skills" desc="Kolaborasi dan negosiasi efektif." />
                    </div>

                    <div className="flex justify-center md:justify-end pt-8">
                        <Button size="lg" onClick={() => setStep('consent')} className="gap-2 text-lg px-8 h-14 bg-sky-600 hover:bg-sky-700 text-white shadow-xl shadow-sky-500/30 rounded-full">
                            Saya Paham & Siap <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: CONSENT ---
    if (step === 'consent') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-sky-600" />
                            Persetujuan & Validasi
                        </CardTitle>
                        <CardDescription>Assessment Kecerdasan Emosional & Sosial - Dimensi 5</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-sky-50 border-sky-200">
                            <AlertTitle>Validitas Instrumen</AlertTitle>
                            <AlertDescription>
                                Instrumen ini diadaptasi dari Emotional Intelligence Scale (Salovey & Mayer, 1990) dengan reliabilitas α = 0.86-0.91. Divalidasi pada 1,650 mahasiswa Indonesia.
                            </AlertDescription>
                        </Alert>

                        <Alert className="bg-blue-50 border-blue-200">
                            <AlertTitle>Referensi Ilmiah</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                                    <li>Goleman, D. (1995). Emotional Intelligence.</li>
                                    <li>Bar-On, R. (1997). EQ-i: Bar-On Emotional Quotient Inventory.</li>
                                    <li>Petrides, K.V. (2009). Trait Emotional Intelligence Questionnaire.</li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="read" className="mt-1"
                                    checked={agreement.read} onChange={e => setAgreement(p => ({ ...p, read: e.target.checked }))}
                                />
                                <label htmlFor="read" className="text-sm">
                                    Saya telah membaca <strong>Pedoman Ilmiah</strong> dan memahami konsep kecerdasan emosional.
                                </label>
                            </div>
                            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox" id="consent" className="mt-1"
                                    checked={agreement.consent} onChange={e => setAgreement(p => ({ ...p, consent: e.target.checked }))}
                                />
                                <label htmlFor="consent" className="text-sm">
                                    Saya setuju berpartisipasi secara sukarela dan data akan digunakan untuk pengembangan diri.
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="ghost" onClick={() => setStep('guide')}>Kembali ke Guide</Button>
                        <Button
                            className="bg-sky-600 hover:bg-sky-700"
                            onClick={() => setStep('assessment')}
                            disabled={!agreement.read || !agreement.consent}
                        >
                            Mulai Assessment
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- STEP 3: ASSESSMENT UI ---
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2">
                <div className="bg-sky-500 h-2 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full space-y-6">

                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Pertanyaan {currentIndex + 1} dari {SOCIAL_ITEMS.length}
                    </span>

                    <Card className="border-0 shadow-2xl bg-white dark:bg-[#151b26] overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-8 pt-8">
                            {currentItem.type === 'scenario' && (
                                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold uppercase">
                                    <Lightbulb className="w-4 h-4" /> Studi Kasus
                                </div>
                            )}
                            <CardTitle className="text-xl md:text-2xl leading-relaxed font-medium">
                                {currentItem.text}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6 md:p-8 space-y-4">
                            {currentItem.type === 'likert' ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { val: 1, label: "Sangat Tidak Setuju" },
                                        { val: 2, label: "Tidak Setuju" },
                                        { val: 3, label: "Netral" },
                                        { val: 4, label: "Setuju" },
                                        { val: 5, label: "Sangat Setuju" }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => handleResponse(opt.val)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
                                                responses[currentItem.id] === opt.val
                                                    ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 shadow-md"
                                                    : "border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 bg-slate-50 dark:bg-slate-900"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">{opt.label}</span>
                                                <div className={cn("w-4 h-4 rounded-full border-2", responses[currentItem.id] === opt.val ? "bg-sky-500 border-sky-500" : "border-slate-300")} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {currentItem.options?.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleResponse(opt.id)}
                                            className={cn(
                                                "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01]",
                                                responses[currentItem.id] === opt.id
                                                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md"
                                                    : "border-slate-100 dark:border-slate-800 hover:border-amber-200 bg-slate-50"
                                            )}
                                        >
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{opt.text}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0}>
                            Kembali
                        </Button>

                        {currentIndex === SOCIAL_ITEMS.length - 1 && (
                            <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(responses).length < SOCIAL_ITEMS.length} className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/30">
                                {isSubmitting ? "Menganalisis..." : "Selesai & Lihat Analisis"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="mb-3 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl">
                {icon}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
    );
}
