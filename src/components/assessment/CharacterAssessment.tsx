"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Brain,
    Users,
    Scale,
    Gavel,
    HeartHandshake,
    ChevronRight,
    AlertTriangle,
    Lightbulb,
    CheckCircle2,
    BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { calculateCharacterScore, CharacterResponse, CharacterResult } from '@/lib/assessment/characterScoring';

// --- QUESTIONS ACQUISITION ---

// Likert Items
const LIKERT_QUESTIONS = [
    { id: 'CH1', text: "Saya akan mengakui kesalahan dalam tugas kelompok meskipun tidak ada yang mengetahuinya", dimension: "Integrity", icon: ShieldCheck },
    { id: 'CH2', text: "Saya bersedia menyampaikan pendapat yang berbeda dalam diskusi kelompok ketika saya yakin itu benar", dimension: "Courage", icon: Scale },
    { id: 'CH3', text: "Dalam kelompok, saya memperlakukan semua anggota dengan sama tanpa memandang latar belakang atau hubungan pribadi", dimension: "Fairness", icon: Users },
    { id: 'CH4', text: "Saya selalu menyelesaikan tugas dan kewajiban akademik saya tepat waktu, bahkan ketika sulit", dimension: "Responsibility", icon: CheckCircle2 },
    { id: 'CH5', text: "Saya terbuka menerima kritik konstruktif dari teman atau dosen untuk perbaikan diri", dimension: "Humility", icon: HeartHandshake },
];

// SJT Items
const SJT_SCENARIOS = [
    {
        id: "SJT1",
        scenario: "Anda melihat teman dekat menyalin jawaban ujian dari telepon genggam. Anda tahu teman tersebut sedang mengalami kesulitan finansial dan perlu IPK tinggi untuk mempertahankan beasiswa.",
        question: "Apa yang akan Anda lakukan?",
        options: [
            { id: "A", text: "Tidak melakukan apa-apa karena takut merusak persahabatan" },
            { id: "B", text: "Membicarakannya secara pribadi setelah ujian selesai" },
            { id: "C", text: "Langsung melaporkan kepada pengawas ujian" },
            { id: "D", text: "Membicarakannya dengan teman tersebut selama ujian dan menawarkan bantuan belajar untuk ujian selanjutnya" }
        ],
        dimension: "Academic Integrity"
    },
    {
        id: "SJT2",
        scenario: "Dalam proyek kelompok, Anda menemukan bahwa data yang digunakan rekan kelompok telah dimanipulasi untuk mendukung hipotesis. Deadline pengumpulan tinggal 2 hari.",
        question: "Apa tindakan Anda?",
        options: [
            { id: "A", text: "Menggunakan data tersebut karena sudah telat untuk mengumpulkan data baru" },
            { id: "B", text: "Berbicara dengan rekan tersebut dan meminta klarifikasi" },
            { id: "C", text: "Melaporkan kepada dosen pembimbing dan meminta perpanjangan waktu" },
            { id: "D", text: "Menganalisis ulang data dengan metode yang tepat dan mendiskusikan dengan seluruh kelompok" }
        ],
        dimension: "Professional Ethics"
    },
    {
        id: "SJT3",
        scenario: "Anda mengetahui bahwa produk teknologi yang dikembangkan perusahaan tempat Anda magang memiliki dampak negatif terhadap lingkungan. Atasan Anda meminta untuk tidak membahas hal ini dalam laporan akhir.",
        question: "Bagaimana respons Anda?",
        options: [
            { id: "A", text: "Mengikuti instruksi atasan untuk menjaga posisi magang" },
            { id: "B", text: "Membahas dampak lingkungan dalam laporan namun dengan bahasa yang halus" },
            { id: "C", text: "Mendiskusikan kekhawatiran Anda dengan atasan dan menawarkan solusi alternatif" },
            { id: "D", text: "Melaporkan temuan Anda melalui saluran internal perusahaan sesuai prosedur whistleblowing" }
        ],
        dimension: "Social Responsibility"
    }
];

// Behavioral Items
const BEHAVIOR_QUESTIONS = [
    {
        id: "BH1",
        text: "Dalam 6 bulan terakhir, seberapa sering Anda mengutip sumber dengan benar dalam tugas akademik?",
        dimension: "Academic Honesty",
        options: [
            { value: 0, label: "Tidak Pernah" },
            { value: 1, label: "Jarang (1-2 kali)" },
            { value: 2, label: "Kadang-kadang" },
            { value: 3, label: "Sering" },
            { value: 4, label: "Selalu" }
        ]
    },
    {
        id: "BH2",
        text: "Dalam 6 bulan terakhir, seberapa sering Anda terlibat dalam kegiatan sosial/lingkungan secara sukarela?",
        dimension: "Social Responsibility",
        options: [
            { value: 0, label: "Tidak Pernah" },
            { value: 1, label: "1 kali" },
            { value: 2, label: "2-3 kali" },
            { value: 3, label: "4-5 kali" },
            { value: 4, label: ">5 kali" }
        ]
    }
];

export default function CharacterAssessment() {
    const [step, setStep] = useState<'disclaimer' | 'likert' | 'sjt' | 'behavior' | 'results'>('disclaimer');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [responses, setResponses] = useState<CharacterResponse>({});
    const [result, setResult] = useState<CharacterResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Disclaimer Check
    const [hasAgreed, setHasAgreed] = useState(false);

    // Progress Calc
    const totalSteps = LIKERT_QUESTIONS.length + SJT_SCENARIOS.length + BEHAVIOR_QUESTIONS.length;
    const currentTotalIdx =
        step === 'likert' ? currentIdx :
            step === 'sjt' ? LIKERT_QUESTIONS.length + currentIdx :
                step === 'behavior' ? LIKERT_QUESTIONS.length + SJT_SCENARIOS.length + currentIdx : 0;

    const progress = (currentTotalIdx / totalSteps) * 100;

    const handleStart = () => {
        setStep('likert');
        setCurrentIdx(0);
    };

    const handleLikert = (val: number) => {
        const q = LIKERT_QUESTIONS[currentIdx];
        setResponses(prev => ({ ...prev, [q.id]: val }));

        if (currentIdx < LIKERT_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentIdx(prev => prev + 1), 200);
        } else {
            setStep('sjt');
            setCurrentIdx(0);
        }
    };

    const handleSJT = (val: string) => {
        const q = SJT_SCENARIOS[currentIdx];
        setResponses(prev => ({ ...prev, [q.id]: val }));

        if (currentIdx < SJT_SCENARIOS.length - 1) {
            setTimeout(() => setCurrentIdx(prev => prev + 1), 200);
        } else {
            setStep('behavior');
            setCurrentIdx(0);
        }
    };

    const handleBehavior = (val: number) => {
        const q = BEHAVIOR_QUESTIONS[currentIdx];
        setResponses(prev => ({ ...prev, [q.id]: val }));

        if (currentIdx < BEHAVIOR_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentIdx(prev => prev + 1), 200);
        } else {
            finishAssessment({ ...responses, [q.id]: val });
        }
    };

    const finishAssessment = async (finalResponses: CharacterResponse) => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        const res = calculateCharacterScore(finalResponses);
        setResult(res);
        setStep('results');
        setIsSubmitting(false);
    };

    if (step === 'disclaimer') {
        return (
            <Card className="w-full max-w-3xl mx-auto border-indigo-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 py-8 text-center">
                    <div className="mx-auto bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm text-indigo-600">
                        <Gavel className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">Assessment Karakter & Etika</CardTitle>
                    <CardDescription className="text-lg">Scientific Moral Character Evaluator</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8 px-8">
                    <Alert variant="default" className="bg-blue-50 border-blue-200">
                        <BookOpen className="h-4 w-4" />
                        <AlertTitle className="text-blue-800 font-semibold">Tujuan Assessment</AlertTitle>
                        <AlertDescription className="text-blue-700 mt-2 text-sm leading-relaxed">
                            Assessment ini dirancang untuk mengidentifikasi kekuatan karakter dan kemampuan pengambilan keputusan etis Anda.
                            Hasil ini bersifat <strong>rahasia</strong> dan digunakan untuk <strong>pengembangan diri</strong>, bukan penilaian akademik.
                        </AlertDescription>
                    </Alert>

                    <div className="bg-gray-50 p-6 rounded-xl space-y-4 text-sm text-gray-700">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            Apa yang akan Anda lalui?
                        </h4>
                        <ul className="space-y-3 pl-2">
                            <li className="flex gap-3">
                                <span className="bg-white border rounded-md px-2 py-0.5 text-xs font-bold text-gray-500">Part 1</span>
                                <span><strong>Self-Assessment:</strong> 5 pertanyaan tentang persepsi diri Anda.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-white border rounded-md px-2 py-0.5 text-xs font-bold text-gray-500">Part 2</span>
                                <span><strong>Studi Kasus (SJT):</strong> 3 skenario dilema etika akademik & profesional.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-white border rounded-md px-2 py-0.5 text-xs font-bold text-gray-500">Part 3</span>
                                <span><strong>Frekuensi Perilaku:</strong> 2 pertanyaan tentang kebiasaan nyata.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                        <input
                            type="checkbox"
                            id="consent"
                            className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={hasAgreed}
                            onChange={(e) => setHasAgreed(e.target.checked)}
                        />
                        <label htmlFor="consent" className="text-sm text-gray-600">
                            Saya menyetujui untuk berpartisipasi secara sukarela dan memahami bahwa data ini dilindungi kerahasiaannya.
                        </label>
                    </div>

                    <Button
                        onClick={handleStart}
                        disabled={!hasAgreed}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg rounded-xl shadow-lg shadow-indigo-200 mt-4 disabled:opacity-50"
                    >
                        Mulai Assessment
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // --- RESULTS VIEW ---
    if (step === 'results' && result) {
        return (
            <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pb-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Profil Karakter & Etika</h2>
                    <p className="text-gray-500">Berdasarkan Norma Mahasiswa Indonesia (N=2,157)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Score Overview */}
                    <Card className="border-indigo-100 shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2" />
                        <CardContent className="pt-8 text-center p-6">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-50 border-8 border-white shadow-inner mb-6">
                                <span className="text-4xl font-extrabold text-indigo-700">{Math.round(result.normalizedScore)}</span>
                            </div>

                            <h3 className={`text-2xl font-bold mb-2 ${result.categoryColor}`}>{result.category}</h3>
                            <p className="text-gray-600 italic text-sm px-4 leading-relaxed">&quot;{result.interpretation}&quot;</p>

                            <div className="mt-6 flex justify-center gap-4 text-xs font-medium text-gray-500">
                                <div className="bg-gray-100 px-3 py-1 rounded-full">Percentile: {result.percentile}%</div>
                                <div className="bg-gray-100 px-3 py-1 rounded-full">Validity: {result.validityIndicators.responseConsistency}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Scores */}
                    <Card className="border-gray-100 shadow-lg">
                        <CardHeader pb-2>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Scale className="w-5 h-5 text-indigo-600" />
                                Komponen Penilaian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <ScoreRow label="Integritas (Integrity)" value={result.subscaleScores.integrity} />
                            <ScoreRow label="Keberanian Moral (Courage)" value={result.subscaleScores.courage} />
                            <ScoreRow label="Keadilan (Fairness)" value={result.subscaleScores.fairness} />
                            <ScoreRow label="Tanggung Jawab (Responsibility)" value={result.subscaleScores.responsibility} />
                            <ScoreRow label="Pengambilan Keputusan Etis" value={result.subscaleScores.ethicalDecision} color="bg-orange-500" />
                        </CardContent>
                    </Card>
                </div>

                {/* Recommendations */}
                <Card className="border-emerald-100 bg-emerald-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-800">
                            <Lightbulb className="w-5 h-5" />
                            Rekomendasi Pengembangan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {result.recommendations.map((rec, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 text-sm">{rec.action}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {rec.priority}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">{rec.description}</p>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="justify-center pt-2 pb-6">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Unduh Laporan Lengkap (PDF)
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- QUESTION VIEWS ---

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="mb-8">
                <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <span>Progress</span>
                    <span>Step {step === 'likert' ? 1 : step === 'sjt' ? 2 : 3} of 3</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-100" indicatorColor="bg-indigo-600" />
            </div>

            <AnimatePresence mode="wait">

                {/* LIKERT QUESTIONS */}
                {step === 'likert' && (
                    <motion.div
                        key={`likert-${currentIdx}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                                {React.createElement(LIKERT_QUESTIONS[currentIdx].icon, { className: 'w-8 h-8' })}
                            </div>
                            <h2 className="text-xl font-medium text-gray-900">{LIKERT_QUESTIONS[currentIdx].text}</h2>
                            <p className="text-sm text-indigo-500 mt-2 font-medium">{LIKERT_QUESTIONS[currentIdx].dimension}</p>
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleLikert(val)}
                                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 flex justify-between items-center group bg-white"
                                >
                                    <span className="text-gray-700 font-medium group-hover:text-indigo-900">
                                        {val === 1 ? "Sangat Tidak Setuju" : val === 2 ? "Tidak Setuju" : val === 3 ? "Netral" : val === 4 ? "Setuju" : "Sangat Setuju"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* SJT SCENARIOS */}
                {step === 'sjt' && (
                    <motion.div
                        key={`sjt-${currentIdx}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="border-indigo-100 shadow-sm">
                            <CardHeader className="bg-indigo-50/50 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Studi Kasus {currentIdx + 1}</span>
                                    <span className="text-xs font-semibold text-gray-500 uppercase">{SJT_SCENARIOS[currentIdx].dimension}</span>
                                </div>
                                <CardTitle className="text-gray-900 text-lg leading-snug">
                                    {SJT_SCENARIOS[currentIdx].scenario}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <h4 className="font-semibold text-gray-800 mb-4">{SJT_SCENARIOS[currentIdx].question}</h4>
                                <div className="space-y-3">
                                    {SJT_SCENARIOS[currentIdx].options.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSJT(opt.id)}
                                            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-sm text-gray-700 hover:text-indigo-900 bg-white"
                                        >
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* BEHAVIOR FREQUENCY */}
                {step === 'behavior' && (
                    <motion.div
                        key={`bh-${currentIdx}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-medium text-gray-900">{BEHAVIOR_QUESTIONS[currentIdx].text}</h2>
                            <p className="text-sm text-gray-500 mt-2">Pilih frekuensi yang paling menggambarkan Anda</p>
                        </div>
                        <div className="space-y-2">
                            {BEHAVIOR_QUESTIONS[currentIdx].options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleBehavior(opt.value)}
                                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between group bg-white"
                                >
                                    <span className="font-medium text-gray-700">{opt.label}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>

            {isSubmitting && (
                <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-indigo-900 font-semibold animate-pulse">Menghitung Profil Integritas...</p>
                    <p className="text-xs text-gray-500 mt-2">Menganalisis pola jawaban dan konsistensi</p>
                </div>
            )}
        </div>
    );
}

function ScoreRow({ label, value, color = "bg-indigo-600" }: { label: string, value: number, color?: string }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-bold text-gray-900">{value}/100</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    )
}
