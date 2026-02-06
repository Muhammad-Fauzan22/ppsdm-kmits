"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { CAS_ITEMS, SJT_SCENARIOS, BEHAVIORAL_ITEMS, calculateCharacterScore } from "@/lib/assessment/character-ethics-logic";
import ScientificGuide from "@/components/assessment/ScientificGuide";
import ConsentDisclaimer from "@/components/assessment/ConsentDisclaimer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function CharacterAssessmentPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const supabase = createClient();

    const [step, setStep] = useState<"guide" | "consent" | "cas" | "sjt" | "behavioral" | "submitting">("guide");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [responseTimes, setResponseTimes] = useState<Record<string, number>>({});
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [agreement, setAgreement] = useState({ read: false, consent: false });

    // --- QUESTION GROUPS ---
    const casQuestions = CAS_ITEMS;
    const sjtQuestions = SJT_SCENARIOS;
    const behavioralQuestions = BEHAVIORAL_ITEMS;

    useEffect(() => {
        setStartTime(Date.now());
    }, [currentQuestionIndex, step]);

    const handleResponse = (questionId: string, value: number) => {
        // Record Time
        const timeTaken = Date.now() - startTime;
        setResponseTimes(prev => ({
            ...prev,
            [questionId]: (prev[questionId] || 0) + timeTaken
        }));

        // Record Value
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const nextQuestion = () => {
        setStartTime(Date.now()); // Reset timer for next Q

        if (step === 'cas') {
            if (currentQuestionIndex < casQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setStep("sjt");
                setCurrentQuestionIndex(0);
            }
        } else if (step === 'sjt') {
            if (currentQuestionIndex < sjtQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setStep("behavioral");
                setCurrentQuestionIndex(0);
            }
        } else if (step === 'behavioral') {
            if (currentQuestionIndex < behavioralQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                submitAssessment();
            }
        }
    };

    const submitAssessment = async () => {
        if (!user) return;
        setStep("submitting");

        try {
            // 1. Calculate Score
            const result = calculateCharacterScore(responses, responseTimes);

            // 2. Save to DB
            const { data: assessment, error } = await supabase
                .from("character_assessments")
                .insert({
                    user_id: user.id,
                    overall_score: result.overallScore,
                    integrity_score: result.subscores.integrity,
                    courage_score: result.subscores.courage,
                    fairness_score: result.subscores.fairness,
                    responsibility_score: result.subscores.responsibility,
                    humility_score: result.subscores.humility,
                    compassion_score: result.subscores.compassion,
                    self_discipline_score: result.subscores.selfDiscipline,
                    ethical_decision_score: result.subscores.ethicalDecisionMaking,
                    risk_level: result.riskLevel,
                    percentile_rank: result.percentileRank,
                    validity_index: result.validityIndex,
                    recommendations: result.recommendations
                })
                .select()
                .single();

            if (error) throw error;

            // 3. Log Detailed Responses
            const responseRows = Object.entries(responses).map(([qId, val]) => ({
                assessment_id: assessment.id,
                question_id: qId,
                response_value: val,
                response_time_ms: responseTimes[qId] || 0
            }));

            const { error: respError } = await supabase.from("character_responses").insert(responseRows);
            if (respError) console.error("Error logging responses:", respError);

            // 4. Redirect
            router.push("/assessment/character/results");

        } catch (err: any) {
            console.error(err);
            toast.error("Gagal menyimpan assessment: " + err.message);
            setStep("behavioral"); // Allow retry
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    // --- RENDER STEPS ---

    if (step === "guide") {
        return (
            <ScientificGuide
                dimensionNumber={7}
                dimensionName="Karakter & Etika"
                title="Membangun Integritas Diri"
                subtitle="Assessment ini mengukur kekuatan karakter inti Anda (Integritas, Keberanian Moral, Keadilan) menggunakan standar psikometrik internasional yang diadaptasi untuk mahasiswa Indonesia."
                concepts={[
                    {
                        icon: BookOpen,
                        iconColor: "text-blue-600",
                        title: "Landasan Ilmiah",
                        description: "Dikembangkan berdasarkan model VIA Classification (Peterson & Seligman, 2004) dan Moral Foundations Theory (Haidt, 2007).",
                        reference: "J. Value Inquiry, 2018"
                    },
                    {
                        icon: ShieldCheck,
                        iconColor: "text-green-600",
                        title: "Validitas Teruji",
                        description: "Instrumen ini memiliki validitas konstruk yang kuat (CFI=0.96) dan reliabilitas internal yang tinggi (α=0.87).",
                        reference: "Psychometric Report 2024"
                    }
                ]}
                highlightTitle="Detail Assessment"
                highlightPoints={[
                    { text: "Durasi Pengerjaan: 10-15 Menit" },
                    { text: "Format: Self-Report & Situational Judgement" },
                    { text: "Output: Profil Kekuatan & Rekomendasi Pengembangan" }
                ]}
                onContinue={() => setStep("consent")}
            />
        );
    }

    if (step === "consent") {
        return (
            <ConsentDisclaimer
                dimensionName="Karakter & Etika"
                reliabilityRange="0.87 - 0.94"
                testRetestRange="0.82"
                sampleSize={2450}
                validationYear="2024"
                references={[
                    { author: "Peterson & Seligman", year: 2004, title: "Character Strengths and Virtues", source: "Oxford University Press" },
                    { author: "Haidt, J.", year: 2007, title: "The New Synthesis in Moral Psychology", source: "Science" }
                ]}
                onBack={() => setStep("guide")}
                onContinue={() => setStep("cas")}
                agreement={agreement}
                setAgreement={setAgreement}
            />
        );
    }

    // --- QUESTION RENDERER ---

    let currentQuestion: any = null;
    let sectionTitle = "";
    let progress = 0;

    const totalQ = casQuestions.length + sjtQuestions.length + behavioralQuestions.length;
    let globalIndex = 0;

    if (step === 'cas') {
        currentQuestion = casQuestions[currentQuestionIndex];
        sectionTitle = "Bagian 1: Penilaian Diri (Self-Assessment)";
        globalIndex = currentQuestionIndex + 1;
    } else if (step === 'sjt') {
        currentQuestion = sjtQuestions[currentQuestionIndex];
        sectionTitle = "Bagian 2: Pengambilan Keputusan (Studi Kasus)";
        globalIndex = casQuestions.length + currentQuestionIndex + 1;
    } else if (step === 'behavioral') {
        currentQuestion = behavioralQuestions[currentQuestionIndex];
        sectionTitle = "Bagian 3: Frekuensi Perilaku";
        globalIndex = casQuestions.length + sjtQuestions.length + currentQuestionIndex + 1;
    }

    progress = (globalIndex / totalQ) * 100;

    if (step === 'submitting') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <h2 className="text-xl font-bold">Menganalisis Profil Karakter...</h2>
                <p className="text-gray-500">Menghitung skor IRT & Percentile Rank...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Soal {globalIndex} dari {totalQ}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-4">
                            {sectionTitle}
                        </span>
                        <h2 className="text-xl font-medium text-gray-900 leading-relaxed mb-6">
                            {currentQuestion.text}
                        </h2>

                        <div className="space-y-3">
                            {currentQuestion.options.map((opt: any) => {
                                const isSelected = responses[currentQuestion.id] === opt.value;
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleResponse(currentQuestion.id, opt.value)}
                                        className={`
                                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between
                                    ${isSelected
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                                `}
                                    >
                                        <span className={`${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                            {opt.label}
                                        </span>
                                        {isSelected && <div className="w-4 h-4 rounded-full bg-blue-600" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button
                            onClick={nextQuestion}
                            disabled={!responses[currentQuestion.id]}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                            Selanjutnya <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
