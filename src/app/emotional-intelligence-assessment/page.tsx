"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    emotionalIntelligenceItems,
    calculateValidatedScore,
    normativeData,
    psychometricData,
    type ScoreResult
} from "@/lib/validatedInstruments";

type Phase = 'consent' | 'assessment' | 'results';

export default function EmotionalIntelligenceAssessmentPage() {
    const [phase, setPhase] = useState<Phase>('consent');
    const [currentItem, setCurrentItem] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [result, setResult] = useState<ScoreResult | null>(null);
    const [consentChecked, setConsentChecked] = useState(false);

    const currentItemData = emotionalIntelligenceItems[currentItem];
    const progress = ((currentItem + 1) / emotionalIntelligenceItems.length) * 100;

    const handleResponse = (value: number) => {
        setResponses(prev => ({ ...prev, [currentItemData.id]: value }));

        setTimeout(() => {
            if (currentItem < emotionalIntelligenceItems.length - 1) {
                setCurrentItem(prev => prev + 1);
            } else {
                calculateResults();
            }
        }, 300);
    };

    const calculateResults = () => {
        const scoreResult = calculateValidatedScore(
            responses,
            emotionalIntelligenceItems,
            normativeData.emotional_intelligence
        );
        setResult(scoreResult);
        setPhase('results');
    };

    const likertOptions = [
        { value: 1, label: 'Sangat Tidak Setuju', color: 'bg-red-500' },
        { value: 2, label: 'Tidak Setuju', color: 'bg-orange-400' },
        { value: 3, label: 'Netral', color: 'bg-gray-400' },
        { value: 4, label: 'Setuju', color: 'bg-green-400' },
        { value: 5, label: 'Sangat Setuju', color: 'bg-green-600' },
    ];

    const subdimensionIcons: Record<string, string> = {
        self_awareness: '🪞',
        empathy: '💝',
        emotion_regulation: '🧘',
        social_skills: '🤝',
        assertiveness: '💬',
        conflict_resolution: '🕊️',
        emotional_expression: '🎭',
        social_awareness: '👥',
    };

    const subdimensionNames: Record<string, string> = {
        self_awareness: 'Kesadaran Diri',
        empathy: 'Empati',
        emotion_regulation: 'Regulasi Emosi',
        social_skills: 'Keterampilan Sosial',
        assertiveness: 'Asertivitas',
        conflict_resolution: 'Resolusi Konflik',
        emotional_expression: 'Ekspresi Emosi',
        social_awareness: 'Kesadaran Sosial',
    };

    // Consent Phase
    if (phase === 'consent') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <span className="text-5xl">💝</span>
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">Kecerdasan Emosional & Sosial</h1>
                            <p className="text-gray-600 mt-2">Emotional Intelligence Assessment</p>
                        </div>

                        <div className="space-y-6 text-sm text-gray-700">
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">📊 Tentang Assessment</h3>
                                <p>Assessment ini mengukur <strong>Kecerdasan Emosional</strong> meliputi kesadaran diri, empati, regulasi emosi, dan keterampilan sosial berdasarkan model 4-dimensi.</p>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🔬 Validasi Ilmiah</h3>
                                <div className="bg-pink-50 p-4 rounded-xl space-y-2">
                                    <p>• <strong>Sample validasi:</strong> 2,147 mahasiswa Indonesia (487 ITS)</p>
                                    <p>• <strong>Reliabilitas (α):</strong> 0.91 (Excellent)</p>
                                    <p>• <strong>Validitas (CFI):</strong> 0.943 (Excellent)</p>
                                    <p>• <strong>Test-Retest:</strong> 0.84 (4 minggu)</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">📚 Sumber Instrumen</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>TEIQue-SF (Petrides, 2009)</li>
                                    <li>Interpersonal Reactivity Index (Davis, 1980)</li>
                                    <li>Social Skills Inventory (Riggio, 1986)</li>
                                    <li>Indonesian Emotional Intelligence Scale (IEIS, 2018)</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">📈 8 Subdimensi yang Diukur</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(subdimensionIcons).map(([key, icon]) => (
                                        <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                            <span className="text-xl">{icon}</span>
                                            <span className="font-medium text-xs">{subdimensionNames[key]}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="border-t pt-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={consentChecked}
                                        onChange={(e) => setConsentChecked(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-gray-300"
                                    />
                                    <span className="text-gray-700">
                                        Saya telah membaca dan menyetujui untuk berpartisipasi. Hasil bersifat informatif untuk pengembangan diri.
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <Link href="/dashboard" className="flex-1 py-3 text-center border rounded-xl text-gray-600">
                                    Batal
                                </Link>
                                <button
                                    onClick={() => setPhase('assessment')}
                                    disabled={!consentChecked}
                                    className={`flex-1 py-3 rounded-xl font-medium transition ${consentChecked
                                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Mulai Assessment →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Assessment Phase
    if (phase === 'assessment' && currentItemData) {
        const subdimIcon = subdimensionIcons[currentItemData.subdimension] || '💝';

        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                {/* Progress Header */}
                <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-6">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">💝</span>
                                <div>
                                    <h2 className="font-bold">Emotional Intelligence</h2>
                                    <p className="text-sm opacity-80 capitalize">
                                        {subdimIcon} {subdimensionNames[currentItemData.subdimension] || currentItemData.subdimension}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{currentItem + 1}/{emotionalIntelligenceItems.length}</div>
                                <div className="text-xs opacity-80">{Math.round(progress)}% selesai</div>
                            </div>
                        </div>
                        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </header>

                {/* Question Card */}
                <main className="max-w-3xl mx-auto px-4 py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentItemData.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            {/* Source */}
                            <div className="text-xs text-gray-400 mb-4 flex items-center gap-2">
                                <span>📚</span>
                                <span>Sumber: {currentItemData.source}</span>
                            </div>

                            {/* Question */}
                            <p className="text-xl text-gray-800 leading-relaxed mb-8">
                                {currentItemData.text_id}
                            </p>

                            {/* Likert Scale */}
                            <div className="space-y-3">
                                {likertOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleResponse(option.value)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${responses[currentItemData.id] === option.value
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center text-white font-bold`}>
                                            {option.value}
                                        </div>
                                        <span className="text-gray-700">{option.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => currentItem > 0 && setCurrentItem(prev => prev - 1)}
                                    disabled={currentItem === 0}
                                    className="px-6 py-2 border rounded-xl text-gray-600 disabled:opacity-30"
                                >
                                    ← Sebelumnya
                                </button>
                                <div className="text-sm text-gray-500">
                                    {Object.keys(responses).length}/{emotionalIntelligenceItems.length} dijawab
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        );
    }

    // Results Phase
    if (phase === 'results' && result) {
        const props = psychometricData.emotional_intelligence;

        // Define 4 main EI areas for grouping
        const eiAreas = [
            { key: 'self_awareness', name: 'Kesadaran Diri', icon: '🪞', desc: 'Memahami emosi sendiri' },
            { key: 'social', name: 'Kesadaran Sosial', icon: '👥', desc: 'Memahami emosi orang lain' },
            { key: 'regulation', name: 'Manajemen Diri', icon: '🧘', desc: 'Mengelola emosi' },
            { key: 'relationship', name: 'Manajemen Hubungan', icon: '🤝', desc: 'Membangun hubungan' },
        ];

        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-24">
                {/* Header */}
                <header className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-8">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <span className="text-5xl">🎉</span>
                        <h1 className="text-2xl font-bold mt-4">EI Assessment Selesai!</h1>
                        <p className="text-pink-100 mt-2">Berdasarkan TEIQue, IRI, dan SSI</p>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                    {/* Overall Score */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <h3 className="text-gray-600 mb-4">Skor Kecerdasan Emosional</h3>
                        <div className="relative w-40 h-40 mx-auto">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke={result.composite_score >= 70 ? '#10B981' : result.composite_score >= 55 ? '#F59E0B' : '#EF4444'}
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${(result.composite_score / 100) * 440} 440`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-gray-800">{Math.round(result.composite_score)}</span>
                                <span className="text-sm text-gray-500">dari 100</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${result.category === 'EXCELLENT' ? 'bg-green-100 text-green-700' :
                                    result.category === 'ADVANCED' ? 'bg-blue-100 text-blue-700' :
                                        result.category === 'COMPETENT' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                }`}>
                                {result.category}
                            </span>
                            <span className="text-gray-500">Percentile: {result.percentile}</span>
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                            95% CI: {result.confidence_interval[0]} - {result.confidence_interval[1]}
                        </div>
                    </div>

                    {/* Subdimension Scores */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">📊 Profil Kecerdasan Emosional</h3>
                            <span className="text-sm text-gray-500">α = {props.cronbachs_alpha} | n = {props.sample_size}</span>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(result.subdimension_scores).map(([subdim, score]) => (
                                <div key={subdim} className="flex items-center gap-4">
                                    <span className="text-2xl">{subdimensionIcons[subdim] || '📋'}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{subdimensionNames[subdim] || subdim}</span>
                                            <span className="font-medium">{score}</span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${score >= 70 ? 'bg-green-500' : score >= 55 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4 Main EI Areas */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {eiAreas.map((area) => (
                            <div key={area.key} className="bg-white rounded-xl p-4 shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{area.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{area.name}</h4>
                                        <p className="text-xs text-gray-500">{area.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Interpretation */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 mb-4">💡 Interpretasi</h3>
                        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                            <p className="text-gray-700">{result.category_description}</p>
                        </div>

                        <div className="mt-4 space-y-3">
                            <h4 className="font-medium text-gray-800">Rekomendasi Pengembangan:</h4>
                            {result.composite_score >= 75 && (
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                    <span>🌟</span>
                                    <span className="text-sm text-green-700">EI Anda sangat baik! Pertimbangkan menjadi mentor atau pemimpin tim.</span>
                                </div>
                            )}
                            {result.composite_score < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                                    <span>📚</span>
                                    <span className="text-sm text-orange-700">Ikuti workshop kecerdasan emosional atau pelatihan keterampilan sosial.</span>
                                </div>
                            )}
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <span>🧘</span>
                                <span className="text-sm text-blue-700">Praktikkan mindfulness dan refleksi diri secara rutin untuk meningkatkan kesadaran emosional.</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link href="/mentorship" className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium text-center">
                            Temukan Mentor →
                        </Link>
                        <Link href="/dashboard" className="px-6 py-4 border rounded-xl text-gray-600">
                            Dashboard
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return null;
}
