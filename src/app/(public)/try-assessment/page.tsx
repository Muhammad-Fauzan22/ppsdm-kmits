"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Brain, Clock, DollarSign, Dumbbell, Users, Sparkles, Scale, Flower2, Leaf,
    ChevronRight, CheckCircle, Lock, ArrowRight, Zap
} from "lucide-react";
import { PsychometricRadar } from "@/components/PsychometricRadar";
import {
    getItemsByDimension,
    ValidatedItem
} from "@/lib/validatedInstruments";

// --- ENLIGHTENMENT CONTENT ---
const ENLIGHTENMENT_TIPS: Record<string, { title: string, text: string }> = {
    cognitive: { title: "Intellectual Agility", text: "Critical thinking is not just about logic, but about questioning assumptions to uncover deeper truths." },
    self_management: { title: "Mastering Time", text: "Discipline isn't about restriction; it's about freedom to focus on what truly matters." },
    financial: { title: "Wealth Mindset", text: "Financial literacy is the foundation of future freedom, starting with tracking every small expense." },
    physical_health: { title: "Body as a Temple", text: "Your physical state directly dictates your cognitive performance and emotional resilience." },
    emotional_intelligence: { title: "Emotional Mastery", text: "Empathy is the currency of leadership. Understanding others starts with understanding yourself." },
    mental_health: { title: "Resilience", text: "Mental toughness is like a muscle; it grows when you push through discomfort." },
    character: { title: "Integrity", text: "Character is what you do when no one is watching. It is the bedrock of trust." },
    spiritual: { title: "Inner Purpose", text: "Connecting with a higher purpose gives you an unshakeable anchor during life's storms." },
    environmental: { title: "Global Citizen", text: "We do not inherit the earth from our ancestors; we borrow it from our children." }
};

const DIMENSION_ICONS: Record<string, any> = {
    cognitive: Brain,
    self_management: Clock,
    financial: DollarSign,
    physical_health: Dumbbell,
    social_emotional: Users, // Mapped from emotional_intelligence + social
    mental_health: Sparkles,
    character: Scale,
    spiritual: Flower2,
    environmental: Leaf,
};

// Dimensions to assess
const TARGET_DIMENSIONS = [
    'cognitive', 'self_management', 'financial', 'physical_health',
    'emotional_intelligence', 'mental_health', 'character', 'spiritual', 'environmental'
];

export default function PublicAssessmentPage() {
    const router = useRouter();
    const [step, setStep] = useState<'intro' | 'question' | 'results'>('intro');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [questions, setQuestions] = useState<ValidatedItem[]>([]);
    const [dimensionScores, setDimensionScores] = useState<any[]>([]);

    // Load subset of questions on mount
    useEffect(() => {
        const selectedQuestions: ValidatedItem[] = [];
        // Select 2 random questions from each dimension for the mini-assessment
        TARGET_DIMENSIONS.forEach(dim => {
            const items = getItemsByDimension(dim);
            if (items.length > 0) {
                // Shuffle and pick 2
                const shuffled = [...items].sort(() => 0.5 - Math.random());
                selectedQuestions.push(...shuffled.slice(0, 2));
            }
        });
        setQuestions(selectedQuestions);
    }, []);

    const handleAnswer = (value: number) => {
        const question = questions[currentQuestionIdx];
        setAnswers(prev => ({ ...prev, [question.id]: value }));

        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            calculateResults();
        }
    };

    const calculateResults = () => {
        // Simple Average Logic for Demo
        const scores: Record<string, { sum: number, count: number }> = {};

        questions.forEach(q => {
            if (!scores[q.dimension]) scores[q.dimension] = { sum: 0, count: 0 };
            const val = answers[q.id] || 3; // Default neutral
            // Handle reverse score if needed (assuming 1-5 scale)
            const score = q.reverse_scored ? (6 - val) : val;
            scores[q.dimension].sum += score;
            scores[q.dimension].count += 1;
        });

        const radarData = Object.entries(scores).map(([dim, data]) => ({
            subject: dim.charAt(0).toUpperCase() + dim.slice(1).replace('_', ' '),
            value: Math.round((data.sum / data.count) * 20), // Scale 5 -> 100
            fullMark: 100
        }));

        setDimensionScores(radarData);
        setStep('results');

        // Save to localStorage for retrieval after login
        if (typeof window !== 'undefined') {
            localStorage.setItem('temp_assessment_results', JSON.stringify(radarData));
        }
    };

    const currentDimension = questions[currentQuestionIdx]?.dimension || 'cognitive';
    const CurrentIcon = DIMENSION_ICONS[currentDimension] || Brain;
    const enlightenment = ENLIGHTENMENT_TIPS[currentDimension] || ENLIGHTENMENT_TIPS.cognitive;

    // --- RENDER STEPS ---

    if (step === 'intro') {
        return (
            <div className="min-h-screen bg-[#0A0F1A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="max-w-2xl text-center relative z-10">
                    <div className="inline-block p-4 rounded-full bg-[#135bec]/20 mb-8 border border-[#135bec]/50 shadow-[0_0_30px_rgba(19,91,236,0.3)]">
                        <Brain className="w-12 h-12 text-[#00d4ff]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading mb-6 leading-tight">
                        Discover Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135bec] to-[#00d4ff]">Hidden Potential</span>
                    </h1>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                        Take our scientifically validated mini-assessment to uncover your strengths across 9 holistic dimensions.
                        It takes less than 2 minutes.
                    </p>
                    <button
                        onClick={() => setStep('question')}
                        className="px-8 py-4 bg-white text-[#0A0F1A] font-bold rounded-xl text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto shadow-xl"
                    >
                        Start Assessment <ChevronRight className="w-5 h-5" />
                    </button>
                    <p className="mt-8 text-xs text-slate-600 font-bold tracking-widest uppercase">
                        AI-Powered Analysis • Validated Metrix
                    </p>
                </div>
            </div>
        );
    }

    if (step === 'question') {
        const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

        return (
            <div className="min-h-screen bg-[#0A0F1A] text-white flex flex-col p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#135bec]/10 to-transparent pointer-events-none"></div>

                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col relative z-10">
                    {/* Header: Progress & Enlightenment */}
                    <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[#00d4ff] font-bold text-sm tracking-widest uppercase">{currentDimension.replace('_', ' ')}</span>
                                <span className="text-slate-500 text-xs">{currentQuestionIdx + 1} / {questions.length}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#00d4ff] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-12 items-center">
                        {/* Question Card */}
                        <div className="w-full md:w-2/3">
                            <h2 className="text-2xl md:text-3xl font-bold leading-normal mb-10">
                                {questions[currentQuestionIdx]?.text_id}
                            </h2>
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleAnswer(val)}
                                        className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#135bec] hover:border-[#135bec] transition-all text-left flex items-center gap-4 group"
                                    >
                                        <div className="size-8 rounded-full border border-white/30 flex items-center justify-center text-sm font-bold group-hover:bg-white group-hover:text-[#135bec]">
                                            {String.fromCharCode(64 + val)}
                                        </div>
                                        <span className="text-slate-300 group-hover:text-white font-medium">
                                            {val === 1 ? "Sangat Tidak Setuju" :
                                                val === 2 ? "Tidak Setuju" :
                                                    val === 3 ? "Netral" :
                                                        val === 4 ? "Setuju" : "Sangat Setuju"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Enlightenment Sidebar */}
                        <div className="w-full md:w-1/3 bg-gradient-to-br from-[#135bec]/20 to-[#00d4ff]/10 border border-[#00d4ff]/30 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-20">
                                <CurrentIcon className="w-24 h-24 text-white" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3 text-[#FFD700]">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Did You Know?</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{enlightenment.title}</h3>
                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                    "{enlightenment.text}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'results') {
        return (
            <div className="min-h-screen bg-[#0A0F1A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[#FFD700] font-bold tracking-widest uppercase text-xs mb-2 block">Assessment Complete</span>
                            <h2 className="text-3xl md:text-5xl font-black font-heading mb-6">
                                Your Holistic Profile <br /> is Ready.
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                You show potential in <strong>{dimensionScores[0]?.subject}</strong>, but there are gap areas that need attention. Unlock your full report to see the detailed breakdown.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
                                    <span>Detailed 9-Dimension Analysis</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
                                    <span>AI-Powered Book Recommendations</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
                                    <span>Personalized Growth Roadmap</span>
                                </div>
                            </div>

                            <Link
                                href="/auth/register"
                                className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-[#135bec] hover:bg-[#135bec]/90 text-white rounded-xl font-bold text-lg shadow-lg shadow-[#135bec]/30 transition-all hover:scale-105"
                            >
                                Unlock Full Report <ArrowRight className="w-5 h-5" />
                            </Link>
                            <p className="mt-4 text-xs text-slate-500">
                                Already have an account? <Link href="/auth/login" className="text-[#00d4ff] hover:underline">Log in</Link>
                            </p>
                        </div>

                        {/* Blurred/Preview Radar */}
                        <div className="relative">
                            <div className="glass-card p-6 rounded-3xl border-[#135bec]/30 relative overflow-hidden group">
                                <div className="blur-sm scale-95 opacity-80 transition-all duration-700 group-hover:blur-0 group-hover:scale-100 group-hover:opacity-100">
                                    <PsychometricRadar data={dimensionScores} />
                                </div>

                                {/* Lock Overlay */}
                                <div className="absolute inset-0 bg-[#0A0F1A]/60 flex flex-col items-center justify-center z-20 backdrop-blur-[2px] group-hover:backdrop-blur-none pointer-events-none transition-all duration-500 group-hover:opacity-0">
                                    <div className="size-16 rounded-full bg-[#135bec] flex items-center justify-center shadow-2xl mb-4">
                                        <Lock className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="font-bold text-white text-lg">Hidden Content</p>
                                    <p className="text-slate-400 text-sm">Register to view details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
