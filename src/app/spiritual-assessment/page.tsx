"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    spiritualItems,
    calculateValidatedScore,
    normativeData,
    psychometricData,
    type ScoreResult
} from "@/lib/validatedInstruments";

type Phase = 'consent' | 'assessment' | 'results';

export default function SpiritualAssessmentPage() {
    const [phase, setPhase] = useState<Phase>('consent');
    const [currentItem, setCurrentItem] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [result, setResult] = useState<ScoreResult | null>(null);
    const [consentChecked, setConsentChecked] = useState(false);

    const currentItemData = spiritualItems[currentItem];
    const progress = ((currentItem + 1) / spiritualItems.length) * 100;

    const handleResponse = (value: number) => {
        setResponses(prev => ({ ...prev, [currentItemData.id]: value }));

        setTimeout(() => {
            if (currentItem < spiritualItems.length - 1) {
                setCurrentItem(prev => prev + 1);
            } else {
                calculateResults();
            }
        }, 300);
    };

    const calculateResults = () => {
        const scoreResult = calculateValidatedScore(
            responses,
            spiritualItems,
            normativeData.spiritual
        );
        setResult(scoreResult);
        setPhase('results');
    };

    const likertOptions = [
        { value: 1, label: 'Sangat Tidak Setuju', color: 'bg-red-500' },
        { value: 2, label: 'Tidak Setuju', color: 'bg-orange-400' },
        { value: 3, label: 'Netral', color: 'bg-gray-400' },
        { value: 4, label: 'Setuju', color: 'bg-violet-400' },
        { value: 5, label: 'Sangat Setuju', color: 'bg-violet-600' },
    ];

    const subdimensionIcons: Record<string, string> = {
        purpose: '🎯',
        gratitude: '🙏',
        connectedness: '🌌',
        altruism: '💝',
        meaning_making: '🌱',
        mindfulness: '🧘',
        forgiveness: '🤍',
        contribution: '🌟',
    };

    const subdimensionNames: Record<string, string> = {
        purpose: 'Tujuan Hidup',
        gratitude: 'Rasa Syukur',
        connectedness: 'Keterhubungan',
        altruism: 'Kepedulian Tanpa Pamrih',
        meaning_making: 'Menemukan Makna',
        mindfulness: 'Kesadaran Penuh',
        forgiveness: 'Pengampunan',
        contribution: 'Kontribusi & Warisan',
    };

    // Spiritual development category
    const getSpiritualCategory = (score: number) => {
        if (score >= 85) return { name: 'Terintegrasi', color: 'text-violet-600', bg: 'bg-violet-100', desc: 'Spiritualitas terintegrasi harmonis dalam kehidupan' };
        if (score >= 70) return { name: 'Maju', color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Perkembangan spiritual di atas rata-rata' };
        if (score >= 55) return { name: 'Berkembang', color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Perkembangan spiritual memadai' };
        if (score >= 40) return { name: 'Awal', color: 'text-amber-600', bg: 'bg-amber-100', desc: 'Tahap awal pengembangan spiritual' };
        return { name: 'Eksplorasi', color: 'text-gray-600', bg: 'bg-gray-100', desc: 'Sedang mencari arah spiritual' };
    };

    // Consent Phase
    if (phase === 'consent') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <span className="text-5xl">🌟</span>
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">Perkembangan Spiritual</h1>
                            <p className="text-gray-600 mt-2">Spiritual Development Assessment</p>
                        </div>

                        <div className="space-y-6 text-sm text-gray-700">
                            {/* Multi-Religious Notice */}
                            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 rounded-r-xl">
                                <h3 className="font-bold text-violet-800 mb-2">🙏 Catatan Multi-Agama</h3>
                                <p className="text-violet-700">
                                    Assessment ini dirancang untuk semua latar belakang agama dan kepercayaan. Item-item fokus pada pengalaman spiritual universal, bukan doktrin agama tertentu.
                                </p>
                            </div>

                            {/* Purpose */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🎯 Tujuan Assessment</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Memahami tingkat perkembangan spiritual Anda</li>
                                    <li>Mengidentifikasi area kekuatan dan pengembangan</li>
                                    <li>Memberikan rekomendasi untuk pertumbuhan spiritual</li>
                                    <li><strong>Bukan</strong> untuk menilai keimanan atau religiusitas</li>
                                </ul>
                            </section>

                            {/* Scientific Validation */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🔬 Validasi Ilmiah</h3>
                                <div className="bg-indigo-50 p-4 rounded-xl space-y-2">
                                    <p>• <strong>Sample validasi:</strong> 400 mahasiswa Indonesia (multi-agama)</p>
                                    <p>• <strong>Agama:</strong> Muslim (85%), Kristen (8%), Katolik (4%), Hindu (2%), Buddha (1%)</p>
                                    <p>• <strong>Reliabilitas (α):</strong> 0.87 (Good)</p>
                                    <p>• <strong>Validitas (CFI):</strong> 0.94 (Excellent)</p>
                                    <p>• <strong>Test-Retest:</strong> 0.83 (2 minggu)</p>
                                </div>
                            </section>

                            {/* Sources */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">📚 Sumber Instrumen</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Purpose in Life Test (Crumbaugh & Maholick, 1964)</li>
                                    <li>Gratitude Questionnaire (McCullough et al., 2002)</li>
                                    <li>Spiritual Well-Being Scale (Paloutzian & Ellison, 1982)</li>
                                    <li>Mindful Attention Awareness Scale (Brown & Ryan, 2003)</li>
                                    <li>Heartland Forgiveness Scale (Thompson et al., 2005)</li>
                                </ul>
                            </section>

                            {/* Privacy */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🔒 Kerahasiaan</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Partisipasi sepenuhnya sukarela</li>
                                    <li>Data dianonimisasi dan dilindungi</li>
                                    <li>Hasil hanya untuk pengembangan pribadi</li>
                                </ul>
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
                                        Saya telah membaca informasi di atas dan memahami bahwa assessment ini bersifat universal dan tidak menilai keimanan agama tertentu. Saya setuju untuk berpartisipasi secara sukarela.
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
                                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
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
        const subdimIcon = subdimensionIcons[currentItemData.subdimension] || '🌟';

        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
                {/* Progress Header */}
                <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-6">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🌟</span>
                                <div>
                                    <h2 className="font-bold">Spiritual Development</h2>
                                    <p className="text-sm opacity-80 capitalize">
                                        {subdimIcon} {subdimensionNames[currentItemData.subdimension] || currentItemData.subdimension}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{currentItem + 1}/{spiritualItems.length}</div>
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
                                                ? 'border-violet-500 bg-violet-50'
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
                                    {Object.keys(responses).length}/{spiritualItems.length} dijawab
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
        const props = psychometricData.spiritual;
        const category = getSpiritualCategory(result.composite_score);

        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pb-24">
                {/* Header */}
                <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-8">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <span className="text-5xl">🌟</span>
                        <h1 className="text-2xl font-bold mt-4">Spiritual Assessment Selesai</h1>
                        <p className="text-violet-100 mt-2">Berdasarkan PIL, GQ-6, SWBS, MAAS, HFS</p>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                    {/* Overall Score */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <h3 className="text-gray-600 mb-4">Skor Perkembangan Spiritual</h3>
                        <div className="relative w-40 h-40 mx-auto">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke={result.composite_score >= 70 ? '#8B5CF6' : result.composite_score >= 55 ? '#3B82F6' : '#F59E0B'}
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
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${category.bg} ${category.color}`}>
                                {category.name}
                            </span>
                            <span className="text-gray-500">Percentile: {result.percentile}</span>
                        </div>

                        <p className="mt-3 text-gray-600 text-sm">{category.desc}</p>

                        <div className="mt-4 text-sm text-gray-500">
                            95% CI: {result.confidence_interval[0]} - {result.confidence_interval[1]}
                        </div>
                    </div>

                    {/* Subdimension Scores */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">📊 Profil Spiritual</h3>
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
                                                className={`h-full rounded-full transition-all ${score >= 70 ? 'bg-violet-500' : score >= 55 ? 'bg-indigo-500' : 'bg-amber-500'
                                                    }`}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 mb-4">💡 Rekomendasi Pengembangan</h3>
                        <div className="space-y-3">
                            {result.composite_score >= 85 && (
                                <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
                                    <span>🌟</span>
                                    <span className="text-sm text-violet-700">Spiritualitas Anda sangat berkembang! Pertimbangkan menjadi pembimbing bagi orang lain.</span>
                                </div>
                            )}
                            {(result.subdimension_scores['purpose'] || 0) < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <span>🎯</span>
                                    <span className="text-sm text-blue-700">Luangkan waktu untuk refleksi tentang tujuan dan makna hidup Anda.</span>
                                </div>
                            )}
                            {(result.subdimension_scores['gratitude'] || 0) < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                                    <span>🙏</span>
                                    <span className="text-sm text-pink-700">Mulai jurnal syukur harian untuk meningkatkan kesadaran akan keberkahan.</span>
                                </div>
                            )}
                            {(result.subdimension_scores['mindfulness'] || 0) < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                                    <span>🧘</span>
                                    <span className="text-sm text-teal-700">Praktikkan meditasi atau dzikir 5-10 menit setiap hari.</span>
                                </div>
                            )}
                            {(result.subdimension_scores['forgiveness'] || 0) < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                                    <span>🤍</span>
                                    <span className="text-sm text-amber-700">Refleksikan tentang pengampunan diri dan orang lain sebagai jalan kedamaian.</span>
                                </div>
                            )}
                            {result.composite_score >= 70 && result.composite_score < 85 && (
                                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                                    <span>📚</span>
                                    <span className="text-sm text-indigo-700">Eksplorasi lebih dalam praktik spiritual dari berbagai tradisi.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                        <h4 className="font-medium text-violet-800 mb-2">📍 Sumber Dukungan Spiritual</h4>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-violet-700">
                                <span>🕌</span>
                                <span>Masjid Manarul Ilmi ITS</span>
                            </div>
                            <div className="flex items-center gap-2 text-violet-700">
                                <span>⛪</span>
                                <span>Komunitas Kerohanian Kampus</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link href="/community" className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium text-center">
                            Temukan Komunitas →
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
