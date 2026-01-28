"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CHARACTER_ITEMS, calculateCharacterScore } from "@/lib/assessment/character-logic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Scale, Shield, UserCheck, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function CharacterAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    // Steps: Guide -> Consent -> Assessment -> Submit
    const [step, setStep] = useState<'guide' | 'consent' | 'assessment'>('guide');
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [consents, setConsents] = useState({ voluntary: false, data: false });

    // Assessment is short (8 items), show all in one page or broken down? 
    // Let's do breakdown to ensure focus (1 per screen or list). 
    // Given it's 8 items, a list is fine but let's make it premium.

    // Let's do 1 by 1 for maximum focus on "Moral Reflection"
    const [currentItemIdx, setCurrentItemIdx] = useState(0);
    const currentItem = CHARACTER_ITEMS[currentItemIdx];
    const progress = ((currentItemIdx + 1) / CHARACTER_ITEMS.length) * 100;

    const handleInput = (val: number) => {
        setResponses(prev => ({ ...prev, [currentItem.id]: val }));

        // Delay next
        setTimeout(() => {
            if (currentItemIdx < CHARACTER_ITEMS.length - 1) {
                setCurrentItemIdx(p => p + 1);
            } else {
                // Done
            }
        }, 250);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const results = calculateCharacterScore(responses);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                localStorage.setItem("temp_character_responses", JSON.stringify(responses));
                router.push("/auth/register?next=/assessment/character/claim");
                return;
            }

            const { data, error } = await supabase.from('character_assessments').insert({
                user_id: user.id,
                integrity_score: results.scores.integrity,
                moral_courage_score: results.scores.courage,
                responsibility_score: results.scores.responsibility,
                fairness_score: results.scores.fairness,
                humility_score: results.scores.humility,
                composite_score: results.composite_score,
                percentile_rank: results.percentile_rank,
                character_level: results.character_level,
                responses: responses
            }).select().single();

            if (error) throw error;
            router.push(`/assessment/character/results?id=${data.assessment_id}`);

        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
            setIsSubmitting(false);
        }
    };

    // --- STEP 1: GUIDE ---
    if (step === 'guide') {
        return (
            <div className="min-h-screen bg-indigo-50 dark:bg-[#0f172a] p-6 flex flex-col items-center justify-center font-sans">
                <div className="max-w-4xl w-full text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-widest">
                        Dimensi 7: Karakter & Etika
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                        The <span className="text-indigo-600">Integrity</span> Protocol.
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Engineer hebat tidak hanya diukur dari kecerdasan teknisnya, tapi dari keberanian moralnya saat tidak ada yang melihat.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
                        <FeatureCard icon={<Scale className="text-indigo-500" />} title="Kejujuran Radikal" desc="Konsistensi nilai vs tindakan." />
                        <FeatureCard icon={<Shield className="text-rose-500" />} title="Keberanian Moral" desc="Speak up demi kebenaran." />
                        <FeatureCard icon={<UserCheck className="text-emerald-500" />} title="Tanggung Jawab" desc="Menepati janji walau sulit." />
                    </div>

                    <div className="pt-8">
                        <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30" onClick={() => setStep('consent')}>
                            Mulai Refleksi Diri <ArrowRight className="ml-2" />
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
                <Card className="max-w-lg w-full border-t-4 border-indigo-500">
                    <CardHeader>
                        <CardTitle>Lembar Persetujuan Etika</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-500">
                            Data karakter bersifat sensitif. Kami menggunakan standar enkripsi AES-256 untuk melindungi privasi Anda.
                        </p>
                        <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                            <input type="checkbox" className="mt-1" checked={consents.voluntary} onChange={e => setConsents(p => ({ ...p, voluntary: e.target.checked }))} />
                            <span className="text-sm">Saya mengisi ini dengan jujur untuk pengembangan diri.</span>
                        </label>
                        <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                            <input type="checkbox" className="mt-1" checked={consents.data} onChange={e => setConsents(p => ({ ...p, data: e.target.checked }))} />
                            <span className="text-sm">Saya setuju data anonim digunakan merumuskan profil karakter mahasiswa ITS.</span>
                        </label>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-indigo-600" disabled={!consents.voluntary || !consents.data} onClick={() => setStep('assessment')}>
                            Lanjutkan Ke Kuesioner
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- ASSESSMENT ---
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <div className="w-full bg-slate-200 h-1.5">
                <div className="bg-indigo-600 h-1.5 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    <div className="flex justify-between items-end mb-8">
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Pertanyaan {currentItemIdx + 1}/{CHARACTER_ITEMS.length}</span>
                        <div className="text-right">
                            <div className="text-xs text-slate-400 uppercase font-bold">Dimensi</div>
                            <div className="font-bold text-slate-700 capitalize">{currentItem.construct.replace('_', ' ')}</div>
                        </div>
                    </div>

                    <Card className="border-0 shadow-2xl overflow-visible">
                        <CardContent className="p-8 md:p-12">
                            <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-white leading-relaxed mb-10 text-center">
                                "{currentItem.text}"
                            </h2>

                            <div className="space-y-3">
                                {[
                                    { v: 1, l: "Sangat Tidak Setuju" },
                                    { v: 2, l: "Tidak Setuju" },
                                    { v: 3, l: "Netral" },
                                    { v: 4, l: "Setuju" },
                                    { v: 5, l: "Sangat Setuju" }
                                ].map(opt => (
                                    <button
                                        key={opt.v}
                                        onClick={() => handleInput(opt.v)}
                                        className={cn(
                                            "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group",
                                            responses[currentItem.id] === opt.v
                                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-200 dark:ring-indigo-800"
                                                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={cn("font-medium text-lg", responses[currentItem.id] === opt.v ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-300")}>
                                                {opt.l}
                                            </span>
                                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                responses[currentItem.id] === opt.v ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"
                                            )}>
                                                {responses[currentItem.id] === opt.v && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 flex justify-center">
                        {Object.keys(responses).length === CHARACTER_ITEMS.length && (
                            <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 px-12 h-14 text-lg rounded-full">
                                {isSubmitting ? "Menganalisis..." : "Selesai & Lihat Profil"}
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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="mb-3">{icon}</div>
            <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
    );
}
