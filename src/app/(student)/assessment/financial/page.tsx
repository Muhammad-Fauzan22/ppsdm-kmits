"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Brain, Wallet, TrendingUp, CheckCircle, AlertCircle, FileText, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import ScientificGuide from "@/components/assessment/ScientificGuide";
import ConsentDisclaimer from "@/components/assessment/ConsentDisclaimer";
import { FINANCIAL_ITEMS, calculateFinancialScores } from "@/lib/assessment/financial-intelligence-logic";
import type { FinancialItem } from "@/lib/assessment/financial-intelligence-logic";

export default function FinancialAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState<"guide" | "consent" | "knowledge" | "behavior" | "attitude">("guide");
    const [agreement, setAgreement] = useState({ read: false, consent: false });
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter items
    const knowledgeItems = FINANCIAL_ITEMS.filter(i => i.type === 'knowledge');
    const behaviorItems = FINANCIAL_ITEMS.filter(i => i.type === 'behavior');
    const attitudeItems = FINANCIAL_ITEMS.filter(i => i.type === 'attitude');

    // Progress Calculation
    const totalItems = FINANCIAL_ITEMS.length;
    const answeredCount = Object.keys(responses).length;
    const progress = (answeredCount / totalItems) * 100;

    const handleOptionSelect = (id: string, value: any) => {
        setResponses(prev => ({ ...prev, [id]: value }));
    };

    const isKnowledgeComplete = knowledgeItems.every(i => responses[i.id]);
    const isBehaviorComplete = behaviorItems.every(i => responses[i.id]);
    const isAttitudeComplete = attitudeItems.every(i => responses[i.id]);

    const handleNext = () => {
        if (step === 'knowledge' && isKnowledgeComplete) setStep('behavior');
        else if (step === 'behavior' && isBehaviorComplete) setStep('attitude');
        else if (step === 'attitude' && isAttitudeComplete) handleSubmit();
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Calculate Scores
            const results = calculateFinancialScores(responses);

            // 2. Check Auth
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Public Flow
                localStorage.setItem("temp_financial_responses", JSON.stringify(responses));
                router.push("/assessment/financial/claim");
                return;
            }

            // 3. Save Assessment
            const { data: assessment, error: asmError } = await supabase
                .from('financial_assessments')
                .insert({
                    user_id: user.id,
                    composite_score: results.composite_score,
                    composite_percentile: results.composite_percentile,
                    intelligence_level: results.intelligence_level,
                    knowledge_score: results.details.knowledge.score,
                    knowledge_percentile: results.details.knowledge.percentile,
                    knowledge_theta: results.details.knowledge.theta,
                    behavior_score: results.details.behavior.score,
                    behavior_percentile: results.details.behavior.percentile,
                    attitude_score: results.details.attitude.score,
                    attitude_percentile: results.details.attitude.percentile,
                    subdomain_scores: results.subdomain_scores,
                    recommendations: results.recommendations,
                    properties: results.properties
                })
                .select()
                .single();

            if (asmError) throw asmError;
            const assessmentId = assessment.assessment_id;

            // 4. Save Detailed Responses
            // Knowledge
            const knowledgeRows = knowledgeItems.map(item => ({
                assessment_id: assessmentId,
                question_id: item.id,
                response_value: responses[item.id], // 'a','b','c','d'
                is_correct: item.options?.find(o => o.correct)?.id === responses[item.id]
            }));
            await supabase.from('financial_knowledge_responses').insert(knowledgeRows);

            // Behavior
            const behaviorRows = behaviorItems.map(item => ({
                assessment_id: assessmentId,
                question_id: item.id,
                response_value: Number(responses[item.id]) // 1-5
            }));
            await supabase.from('financial_behavior_responses').insert(behaviorRows);

            // Attitude
            const attitudeRows = attitudeItems.map(item => ({
                assessment_id: assessmentId,
                question_id: item.id,
                response_value: Number(responses[item.id]) // 1-5
            }));
            await supabase.from('financial_attitude_responses').insert(attitudeRows);

            router.push(`/assessment/financial/results?id=${assessmentId}`);

        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan hasil assessment.");
            setIsSubmitting(false);
        }
    };

    if (step === "guide") {
        return (
            <ScientificGuide
                dimensionNumber={3}
                dimensionName="Financial Intelligence"
                title="Kecerdasan Finansial"
                subtitle="Evaluasi kemampuan pengelolaan keuangan, perilaku, dan mindset untuk kesuksesan masa depan."
                concepts={[
                    { icon: Brain, iconColor: "text-blue-500", title: "Financial Knowledge", description: "Pemahaman konsep dasar ekonomi, investasi, dan risiko finansial." },
                    { icon: Wallet, iconColor: "text-emerald-500", title: "Financial Behavior", description: "Kebiasaan nyata dalam budgeting, menabung, dan pengelolaan utang." },
                    { icon: TrendingUp, iconColor: "text-purple-500", title: "Financial Attitude", description: "Pola pikir dan sikap mental terhadap uang dan masa depan." },
                    { icon: FileText, iconColor: "text-amber-500", title: "Psychometric Validation", description: "Instrumen berbasis IRT dengan reliabilitas α = 0.89." }
                ]}
                highlightTitle="Kenapa Kecerdasan Finansial Penting?"
                highlightPoints={[
                    { text: "Salah satu skill paling krusial untuk bertahan di ekonomi modern." },
                    { text: "Kebiasaan finansial mahasiswa memprediksi kesejahteraan finansial 10 tahun ke depan." },
                    { text: "Mencegah jebakan utang dan pinjaman online ilegal." }
                ]}
                onContinue={() => setStep("consent")}
            />
        );
    }

    if (step === "consent") {
        return (
            <ConsentDisclaimer
                dimensionName="Financial Intelligence"
                reliabilityRange="0.87 - 0.89"
                testRetestRange="0.82 - 0.85"
                sampleSize={1250}
                validationYear="2023"
                references={[
                    { author: "OECD", year: 2020, title: "OECD/INFE 2020 International Survey of Adult Financial Literacy", source: "OECD Publishing" },
                    { author: "Lusardi, A. & Mitchell, O.S.", year: 2011, title: "Financial literacy around the world", source: "Journal of Pension Economics" },
                    { author: "OJK", year: 2022, title: "Survei Nasional Literasi dan Inklusi Keuangan", source: "Otoritas Jasa Keuangan" }
                ]}
                onBack={() => setStep("guide")}
                onContinue={() => setStep("knowledge")}
                agreement={agreement}
                setAgreement={setAgreement}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 space-y-4">
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                        <span className="capitalize">{step} Assessment</span>
                        <span>{Math.round(progress)}% Selesai</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <AnimatePresence mode="wait">
                    {step === 'knowledge' && (
                        <motion.div key="knowledge" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 mb-6">
                                <h3 className="font-bold flex items-center gap-2"><Brain className="w-5 h-5" /> Tes Pengetahuan</h3>
                                <p className="text-sm mt-1">Jawablah pertanyaan berikut dengan pilihan yang paling tepat.</p>
                            </div>
                            {knowledgeItems.map((item, idx) => (
                                <div key={item.id} className="bg-white dark:bg-[#151b26] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <span className="text-xs font-bold text-slate-400 mb-2 block">Pertanyaan {idx + 1}</span>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">{item.text}</h3>
                                    <RadioGroup value={responses[item.id]} onValueChange={(val) => handleOptionSelect(item.id, val)} className="space-y-3">
                                        {item.options?.map((opt) => (
                                            <div key={opt.id} className={cn("flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800", responses[item.id] === opt.id ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-900/10" : "border-slate-200 dark:border-slate-700")}>
                                                <RadioGroupItem value={opt.id} id={`${item.id}-${opt.id}`} />
                                                <Label htmlFor={`${item.id}-${opt.id}`} className="flex-1 cursor-pointer font-normal">{opt.text}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {step === 'behavior' && (
                        <motion.div key="behavior" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 mb-6">
                                <h3 className="font-bold flex items-center gap-2"><Wallet className="w-5 h-5" /> Evaluasi Perilaku</h3>
                                <p className="text-sm mt-1">Seberapa sesuai pernyataan berikut dengan kebiasaan sehari-hari Anda?</p>
                            </div>
                            {behaviorItems.map((item) => (
                                <LikertItem key={item.id} item={item} value={responses[item.id]} onChange={(val) => handleOptionSelect(item.id, val)} color="emerald" />
                            ))}
                        </motion.div>
                    )}

                    {step === 'attitude' && (
                        <motion.div key="attitude" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 mb-6">
                                <h3 className="font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Sikap Finansial</h3>
                                <p className="text-sm mt-1">Bagaimana pandangan Anda terhadap pernyataan berikut?</p>
                            </div>
                            {attitudeItems.map((item) => (
                                <LikertItem key={item.id} item={item} value={responses[item.id]} onChange={(val) => handleOptionSelect(item.id, val)} color="purple" />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 flex justify-between items-center bg-white dark:bg-[#151b26] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg sticky bottom-4 z-40">
                    <Button variant="ghost" onClick={() => {
                        if (step === 'behavior') setStep('knowledge');
                        if (step === 'attitude') setStep('behavior');
                    }} disabled={step === 'knowledge' || isSubmitting}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                    </Button>
                    <Button onClick={handleNext} disabled={(step === 'knowledge' && !isKnowledgeComplete) || (step === 'behavior' && !isBehaviorComplete) || (step === 'attitude' && !isAttitudeComplete) || isSubmitting} className="min-w-[140px]">
                        {isSubmitting ? "Memproses..." : step === 'attitude' ? "Selesai & Analisis" : <>Lanjut <ArrowRight className="w-4 h-4 ml-2" /></>}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function LikertItem({ item, value, onChange, color }: { item: FinancialItem, value: any, onChange: (v: number) => void, color: string }) {
    const options = [
        { val: 1, label: "Sangat Tidak Sesuai" },
        { val: 2, label: "Tidak Sesuai" },
        { val: 3, label: "Netral" },
        { val: 4, label: "Sesuai" },
        { val: 5, label: "Sangat Sesuai" }
    ];

    return (
        <div className="bg-white dark:bg-[#151b26] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">{item.text}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => onChange(opt.val)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-sm h-full",
                            value === opt.val
                                ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/10 text-${color}-700 ring-1 ring-${color}-500 font-bold`
                                : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600"
                        )}
                    >
                        <span className="text-xl mb-1">{opt.val}</span>
                        <span className="text-xs text-center leading-tight">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
