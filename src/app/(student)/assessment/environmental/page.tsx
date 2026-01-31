"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ELMS_ITEMS, calculateEnvironmentalScore } from "@/lib/assessment/environmental-logic";
import ScientificGuide from "@/components/assessment/ScientificGuide";
import ConsentDisclaimer from "@/components/assessment/ConsentDisclaimer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Leaf, Activity, Globe } from "lucide-react";
import { toast } from "sonner";

export default function EnvironmentalAssessmentPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [step, setStep] = useState<"guide" | "consent" | "survey" | "submitting">("guide");
    const [agreement, setAgreement] = useState({ read: false, consent: false });
    const [pageIndex, setPageIndex] = useState(0);
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
        window.scrollTo(0, 0);
    }, [pageIndex, step]);

    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil(ELMS_ITEMS.length / ITEMS_PER_PAGE);
    const currentItems = ELMS_ITEMS.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);

    const handleResponse = (questionId: string, value: number) => {
        const timeTaken = Date.now() - startTime;
        setResponseTimes(prev => ({ ...prev, [questionId]: (prev[questionId] || 0) + timeTaken }));
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const nextPage = () => {
        setStartTime(Date.now());
        if (pageIndex < totalPages - 1) {
            setPageIndex(prev => prev + 1);
        } else {
            submitAssessment();
        }
    };

    const submitAssessment = async () => {
        if (!user) return;
        setStep("submitting");

        try {
            const result = calculateEnvironmentalScore(responses, 'general');

            const { data: assessment, error } = await supabase
                .from("environmental_assessments")
                .insert({
                    user_id: user.id,
                    overall_score: result.overallScore,
                    awareness_score: result.subscores.environmentalAwareness,
                    sustainable_behavior_score: result.subscores.sustainableBehavior,
                    work_life_balance_score: result.subscores.workLifeBalance,
                    digital_wellbeing_score: result.subscores.digitalWellbeing,
                    minimalism_score: result.subscores.minimalistOrientation,
                    energy_conservation_score: result.subscores.energyConservation,
                    community_engagement_score: result.subscores.communityEngagement,
                    advocacy_score: result.subscores.environmentalAdvocacy,
                    faculty_mean_comparison: result.comparison.facultyMean,
                    percentile_rank: result.comparison.percentile,
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

            await supabase.from("environmental_responses").insert(responseRows);
            router.push("/assessment/environmental/results");
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
                dimensionNumber={9}
                dimensionName="Environmental & Lifestyle"
                title="Gaya Hidup Berkelanjutan"
                subtitle="Evaluasi keseimbangan hidup, kebiasaan digital, dan kontribusi terhadap kelestarian lingkungan."
                concepts={[
                    {
                        title: "Sustainability",
                        description: "Perilaku yang mendukung keberlanjutan ekosistem jangka panjang.",
                        icon: Leaf,
                        iconColor: "text-green-500"
                    },
                    {
                        title: "Well-being",
                        description: "Keseimbangan antara aktivitas, istirahat, dan penggunaan teknologi.",
                        icon: Activity,
                        iconColor: "text-blue-500"
                    }
                ]}
                highlightTitle="Indikator Utama"
                highlightPoints={[
                    { text: "Kesadaran & Advokasi Lingkungan" },
                    { text: "Kesejahteraan Digital & Work-Life Balance" },
                    { text: "Perilaku Konsumsi & Minimalisme" }
                ]}
                onContinue={() => setStep("consent")}
            />
        );
    }

    if (step === "consent") {
        return (
            <ConsentDisclaimer
                dimensionName="Environmental & Lifestyle"
                reliabilityRange="0.93 (Excellent)"
                testRetestRange="0.88"
                sampleSize={1200}
                validationYear="2025"
                references={[
                    { author: "Dunlap", year: 2000, title: "New Ecological Paradigm", source: "Jeroen" },
                    { author: "Geiger", year: 2018, title: "Sustainable Consumption", source: "J. Env. Psych." }
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
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
                <h2 className="text-xl font-bold">Menganalisis Profil Gaya Hidup...</h2>
            </div>
        );
    }

    const pageProgress = ((pageIndex + 1) / totalPages) * 100;
    const allCurrentAnswered = currentItems.every(item => responses[item.id]);

    return (
        <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-bold text-green-900 mb-2">Bagian {pageIndex + 1} dari {totalPages}</h1>
                    <p className="text-green-600 mb-4 text-sm">Jawablah dengan jujur sesuai kondisi Anda saat ini.</p>
                    <div className="w-full bg-green-100 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pageProgress}%` }}></div>
                    </div>
                </div>

                <div className="space-y-6">
                    {currentItems.map((item, idx) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                {pageIndex * ITEMS_PER_PAGE + idx + 1}. {item.text}
                            </h3>

                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((val) => {
                                    const isSelected = responses[item.id] === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleResponse(item.id, val)}
                                            className={`
                                                py-3 px-2 rounded-lg text-sm font-medium transition-all
                                                ${isSelected
                                                    ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'}
                                            `}
                                        >
                                            {val}
                                            <span className="block text-[10px] font-normal mt-1 opacity-80">
                                                {val === 1 ? 'STS' : val === 5 ? 'SS' : ''}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={nextPage}
                        disabled={!allCurrentAnswered}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        {pageIndex === totalPages - 1 ? 'Selesai & Lihat Hasil' : 'Halaman Berikutnya'} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
