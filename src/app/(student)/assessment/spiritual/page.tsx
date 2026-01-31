"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ISDS_ITEMS, calculateSpiritualScore } from "@/lib/assessment/spiritual-logic";
import ScientificGuide from "@/components/assessment/ScientificGuide";
import ConsentDisclaimer from "@/components/assessment/ConsentDisclaimer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Heart, Star, Sprout, Network } from "lucide-react";
import { toast } from "sonner";

export default function SpiritualAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [step, setStep] = useState<"guide" | "consent" | "survey" | "submitting">("guide");
    const [agreement, setAgreement] = useState({ read: false, consent: false });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [responseTimes, setResponseTimes] = useState<Record<string, number>>({});
    const [startTime, setStartTime] = useState<number>(Date.now());

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login"); // Or handle redirect
            setUser(user);
            setLoading(false);
        };
        checkUser();
    }, []);

    useEffect(() => {
        setStartTime(Date.now());
    }, [currentQuestionIndex, step]);

    const handleResponse = (questionId: string, value: number) => {
        const timeTaken = Date.now() - startTime;
        setResponseTimes(prev => ({ ...prev, [questionId]: (prev[questionId] || 0) + timeTaken }));
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const nextQuestion = () => {
        setStartTime(Date.now());
        if (currentQuestionIndex < ISDS_ITEMS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            submitAssessment();
        }
    };

    const submitAssessment = async () => {
        if (!user) return;
        setStep("submitting");

        try {
            const result = calculateSpiritualScore(responses);

            const { data: assessment, error } = await supabase
                .from("spiritual_assessments")
                .insert({
                    user_id: user.id,
                    raw_score: result.rawScore,
                    normalized_score: result.normalizedScore,
                    t_score: result.tScore,
                    percentile_rank: result.percentileLink,
                    purpose_meaning_score: result.subscores.purposeMeaning,
                    gratitude_mindfulness_score: result.subscores.gratitudeMindfulness,
                    connectedness_transcendence_score: result.subscores.connectednessTranscendence,
                    altruism_contribution_score: result.subscores.altruismContribution,
                    balance_index: result.balanceIndex,
                    developmental_stage: result.developmentLevel,
                    analysis_json: { recommendations: result.recommendations }
                })
                .select()
                .single();

            if (error) throw error;

            const responseRows = Object.entries(responses).map(([qId, val]) => ({
                assessment_id: assessment.id,
                question_id: qId,
                response_value: val,
                response_time_ms: responseTimes[qId] || 0
            }));

            await supabase.from("spiritual_responses").insert(responseRows);
            router.push("/assessment/spiritual/results");
        } catch (err: any) {
            console.error(err);
            toast.error("Gagal menyimpan assessment: " + err.message);
            setStep("survey");
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    if (step === "guide") {
        return (
            <ScientificGuide
                dimensionNumber={8}
                dimensionName="Spiritual Development"
                title="Menemukan Makna & Keterhubungan"
                subtitle="Eksplorasi nilai-nilai personal, tujuan hidup, dan hubungan transendental untuk mencapai keseimbangan batin."
                concepts={[
                    {
                        title: "Meaning & Purpose",
                        description: "Menemukan alasan mendasar untuk hidup dan berkarya.",
                        icon: Star,
                        iconColor: "text-yellow-500"
                    },
                    {
                        title: "Transcendence",
                        description: "Merasa terhubung dengan sesuatu yang lebih besar dari diri sendiri.",
                        icon: Network,
                        iconColor: "text-purple-500"
                    }
                ]}
                highlightTitle="Apa yang diukur?"
                highlightPoints={[
                    { text: "Orientasi Nilai & Etika Personal" },
                    { text: "Tingkat Rasa Syukur & Kebermaknaan" },
                    { text: "Kualitas Hubungan Transendental" }
                ]}
                onContinue={() => setStep("consent")}
            />
        );
    }

    if (step === "consent") {
        return (
            <ConsentDisclaimer
                dimensionName="Spiritual Development"
                reliabilityRange="0.87 (High)"
                testRetestRange="0.82"
                sampleSize={450}
                validationYear="2025"
                references={[
                    { author: "Fowler", year: 1981, title: "Stages of Faith", source: "HarperOne" },
                    { author: "Paloutzian", year: 1982, title: "Spiritual Well-Being Scale", source: "J. Psychol. Theol." }
                ]}
                agreement={agreement}
                setAgreement={setAgreement}
                onBack={() => setStep("guide")}
                onContinue={() => setStep("survey")}
            />
        );
    }

    if (step === "submitting") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                <h2 className="text-xl font-bold">Menganalisis Profil Spiritual...</h2>
            </div>
        );
    }

    const currentQuestion = ISDS_ITEMS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / ISDS_ITEMS.length) * 100;

    const options = [
        { value: 1, label: "Sangat Tidak Setuju" },
        { value: 2, label: "Tidak Setuju" },
        { value: 3, label: "Netral" },
        { value: 4, label: "Setuju" },
        { value: 5, label: "Sangat Setuju" }
    ];

    return (
        <div className="min-h-screen bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-purple-700 mb-2">
                        <span>Pertanyaan {currentQuestionIndex + 1} dari {ISDS_ITEMS.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
                    <h2 className="text-xl font-medium text-gray-900 leading-relaxed mb-8">
                        {currentQuestion.text}
                    </h2>

                    <div className="space-y-3">
                        {options.map((opt) => {
                            const isSelected = responses[currentQuestion.id] === opt.value;
                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => handleResponse(currentQuestion.id, opt.value)}
                                    className={`
                                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between
                                        ${isSelected ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}
                                    `}
                                >
                                    <span className={`${isSelected ? 'text-purple-700 font-medium' : 'text-gray-700'}`}>
                                        {opt.label}
                                    </span>
                                    {isSelected && <div className="w-4 h-4 rounded-full bg-purple-600" />}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end pt-8 mt-4">
                        <Button
                            onClick={nextQuestion}
                            disabled={!responses[currentQuestion.id]}
                            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                        >
                            {currentQuestionIndex === ISDS_ITEMS.length - 1 ? 'Selesai' : 'Selanjutnya'} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
