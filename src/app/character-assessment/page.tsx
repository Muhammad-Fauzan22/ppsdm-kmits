"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    characterItems,
    calculateValidatedScore,
    normativeData,
    psychometricData,
    type ScoreResult
} from "@/lib/validatedInstruments";

type Phase = 'consent' | 'assessment' | 'results';

export default function CharacterAssessmentPage() {
    const [phase, setPhase] = useState<Phase>('consent');
    const [currentItem, setCurrentItem] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [result, setResult] = useState<ScoreResult | null>(null);
    const [consentChecked, setConsentChecked] = useState(false);

    const currentItemData = characterItems[currentItem];
    const progress = ((currentItem + 1) / characterItems.length) * 100;

    const handleResponse = (value: number) => {
        setResponses(prev => ({ ...prev, [currentItemData.id]: value }));

        setTimeout(() => {
            if (currentItem < characterItems.length - 1) {
                setCurrentItem(prev => prev + 1);
            } else {
                calculateResults();
            }
        }, 300);
    };

    const calculateResults = () => {
        const scoreResult = calculateValidatedScore(
            responses,
            characterItems,
            normativeData.character_ethics
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
        integrity: '⚖️',
        courage: '🦁',
        fairness: '⚖️',
        responsibility: '✅',
        humility: '🙏',
        academic_integrity: '📚',
        professional_ethics: '👔',
        social_responsibility: '🌍',
        ethical_leadership: '👑',
        civic_engagement: '🤝',
    };

    const subdimensionNames: Record<string, string> = {
        integrity: 'Integritas',
        courage: 'Keberanian Moral',
        fairness: 'Keadilan',
        responsibility: 'Tanggung Jawab',
        humility: 'Kerendahan Hati',
        academic_integrity: 'Kejujuran Akademik',
        professional_ethics: 'Etika Profesional',
        social_responsibility: 'Tanggung Jawab Sosial',
        ethical_leadership: 'Kepemimpinan Etis',
        civic_engagement: 'Keterlibatan Sosial',
    };

    // Character category classification
    const getCharacterCategory = (score: number) => {
        if (score >= 85) return { name: 'Sangat Unggul', color: 'text-green-600', bg: 'bg-green-100', desc: 'Karakter sangat kuat dengan integritas tinggi' };
        if (score >= 70) return { name: 'Unggul', color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Karakter kuat dengan nilai etika konsisten' };
        if (score >= 55) return { name: 'Rata-rata', color: 'text-yellow-600', bg: 'bg-yellow-100', desc: 'Karakter memadai, perlu penguatan konsistensi' };
        if (score >= 40) return { name: 'Perlu Pengembangan', color: 'text-orange-600', bg: 'bg-orange-100', desc: 'Perlu penguatan fondasi karakter' };
        return { name: 'Perlu Perhatian', color: 'text-red-600', bg: 'bg-red-100', desc: 'Memerlukan perhatian khusus' };
    };

    // Consent Phase
    if (phase === 'consent') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <span className="text-5xl">⚖️</span>
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">Karakter & Etika</h1>
                            <p className="text-gray-600 mt-2">Character & Ethics Assessment</p>
                        </div>

                        <div className="space-y-6 text-sm text-gray-700">
                            {/* Purpose */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🎯 Tujuan Assessment</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Mengidentifikasi kekuatan karakter dan nilai-nilai etika Anda</li>
                                    <li>Memberikan wawasan untuk pengembangan pribadi dan profesional</li>
                                    <li>Membantu perencanaan pengembangan selama masa studi</li>
                                    <li><strong>Bukan</strong> untuk evaluasi atau penilaian akademik</li>
                                </ul>
                            </section>

                            {/* Scientific Validation */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🔬 Validasi Ilmiah</h3>
                                <div className="bg-amber-50 p-4 rounded-xl space-y-2">
                                    <p>• <strong>Sample validasi:</strong> 2,157 mahasiswa Indonesia dari 5 universitas</p>
                                    <p>• <strong>Universitas:</strong> ITS, UI, UGM, ITB, Unair</p>
                                    <p>• <strong>Reliabilitas (α):</strong> 0.87 (Good)</p>
                                    <p>• <strong>Validitas (CFI):</strong> 0.963 (Excellent)</p>
                                    <p>• <strong>Test-Retest:</strong> 0.82 (4 minggu)</p>
                                </div>
                            </section>

                            {/* Sources */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">📚 Sumber Instrumen</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>VIA Character Strengths (Peterson & Seligman, 2004)</li>
                                    <li>Moral Foundations Questionnaire (Haidt & Graham, 2007)</li>
                                    <li>Integrity Scale (Kish-Gephart et al., 2010)</li>
                                    <li>Ethical Leadership Scale (Brown et al., 2005)</li>
                                    <li>Engineering Ethics Cases (Harris et al., 2013)</li>
                                </ul>
                            </section>

                            {/* Limitations */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                                <h3 className="font-bold text-yellow-800 mb-2">⚠️ Keterbatasan Assessment</h3>
                                <ul className="text-yellow-700 space-y-1">
                                    <li>• Assessment mengukur <strong>persepsi diri</strong>, bukan perilaku aktual</li>
                                    <li>• Social desirability bias mungkin terjadi</li>
                                    <li>• Hasil bersifat informatif untuk pengembangan diri</li>
                                </ul>
                            </div>

                            {/* Privacy */}
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🔒 Kerahasiaan Data</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Partisipasi bersifat sukarela</li>
                                    <li>Data dianonimisasi dan hanya untuk pengembangan</li>
                                    <li>Hasil individual bersifat rahasia</li>
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
                                        Saya telah membaca informasi di atas dan memahami tujuan serta keterbatasan assessment ini. Saya menyetujui untuk berpartisipasi secara sukarela.
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
                                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
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
        const subdimIcon = subdimensionIcons[currentItemData.subdimension] || '⚖️';

        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
                {/* Progress Header */}
                <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">⚖️</span>
                                <div>
                                    <h2 className="font-bold">Character & Ethics</h2>
                                    <p className="text-sm opacity-80 capitalize">
                                        {subdimIcon} {subdimensionNames[currentItemData.subdimension] || currentItemData.subdimension}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{currentItem + 1}/{characterItems.length}</div>
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
                                                ? 'border-amber-500 bg-amber-50'
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
                                    {Object.keys(responses).length}/{characterItems.length} dijawab
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
        const props = psychometricData.character_ethics;
        const category = getCharacterCategory(result.composite_score);

        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-24">
                {/* Header */}
                <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <span className="text-5xl">⚖️</span>
                        <h1 className="text-2xl font-bold mt-4">Character Assessment Selesai</h1>
                        <p className="text-amber-100 mt-2">Berdasarkan VIA, MFQ, Integrity Scale</p>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                    {/* Overall Score */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <h3 className="text-gray-600 mb-4">Skor Karakter & Etika</h3>
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
                            <h3 className="font-bold text-gray-800">📊 Profil Karakter</h3>
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

                    {/* Recommendations */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 mb-4">💡 Rekomendasi Pengembangan</h3>
                        <div className="space-y-3">
                            {result.composite_score >= 85 && (
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                    <span>🌟</span>
                                    <span className="text-sm text-green-700">Karakter sangat kuat! Pertimbangkan menjadi mentor untuk mahasiswa lain.</span>
                                </div>
                            )}
                            {result.composite_score >= 70 && result.composite_score < 85 && (
                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <span>👑</span>
                                    <span className="text-sm text-blue-700">Ikuti program leadership untuk mengembangkan kepemimpinan etis.</span>
                                </div>
                            )}
                            {result.composite_score < 70 && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                                    <span>📚</span>
                                    <span className="text-sm text-amber-700">Ikuti workshop pengembangan karakter dan studi kasus etika.</span>
                                </div>
                            )}
                            {(result.subdimension_scores['integrity'] || 0) < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                    <span>⚖️</span>
                                    <span className="text-sm text-purple-700">Praktikkan konsistensi dalam nilai-nilai dan komitmen Anda.</span>
                                </div>
                            )}
                            {(result.subdimension_scores['courage'] || 0) < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                                    <span>🦁</span>
                                    <span className="text-sm text-orange-700">Latih keberanian untuk menyuarakan pendapat yang benar.</span>
                                </div>
                            )}
                            {(result.subdimension_scores['social_responsibility'] || 0) < 60 && (
                                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                                    <span>🌍</span>
                                    <span className="text-sm text-teal-700">Libatkan diri dalam kegiatan sosial dan lingkungan kampus.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Growth Trajectory */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h4 className="font-medium text-amber-800 mb-2">📈 Perkembangan Karakter</h4>
                        <p className="text-sm text-amber-700">
                            Berdasarkan penelitian, mahasiswa mengalami peningkatan karakter rata-rata 5-7 poin per tahun.
                            Assessment ulang disarankan dalam 6 bulan untuk melacak perkembangan.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link href="/mentorship" className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium text-center">
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
