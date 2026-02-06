"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    cognitiveItems,
    selfManagementItems,
    calculateValidatedScore,
    normativeData,
    psychometricData,
    type ValidatedItem,
    type ScoreResult
} from "@/lib/validatedInstruments";

type AssessmentPhase = 'consent' | 'assessment' | 'results';

export default function ScientificAssessmentPage() {
    const [phase, setPhase] = useState<AssessmentPhase>('consent');
    const [currentModule, setCurrentModule] = useState(0);
    const [currentItem, setCurrentItem] = useState(0);
    const [responses, setResponses] = useState<Record<string, number>>({});
    const [results, setResults] = useState<{ cognitive: ScoreResult | null; selfManagement: ScoreResult | null }>({
        cognitive: null,
        selfManagement: null
    });
    const [consentChecked, setConsentChecked] = useState(false);

    const modules = [
        { id: 'cognitive', name: 'Perkembangan Kognitif', icon: '🧠', items: cognitiveItems, color: 'from-purple-500 to-indigo-600' },
        { id: 'self_management', name: 'Manajemen Diri', icon: '⏰', items: selfManagementItems, color: 'from-blue-500 to-cyan-600' },
    ];

    const currentModuleData = modules[currentModule];
    const currentItemData = currentModuleData?.items[currentItem];
    const totalItems = modules.reduce((sum, m) => sum + m.items.length, 0);
    const completedItems = Object.keys(responses).length;
    const progress = (completedItems / totalItems) * 100;

    const handleResponse = (value: number) => {
        if (!currentItemData) return;

        setResponses(prev => ({ ...prev, [currentItemData.id]: value }));

        // Auto advance
        setTimeout(() => {
            if (currentItem < currentModuleData.items.length - 1) {
                setCurrentItem(prev => prev + 1);
            } else if (currentModule < modules.length - 1) {
                setCurrentModule(prev => prev + 1);
                setCurrentItem(0);
            } else {
                // Calculate results
                calculateResults();
            }
        }, 300);
    };

    const calculateResults = () => {
        const cognitiveResult = calculateValidatedScore(
            responses,
            cognitiveItems,
            normativeData.cognitive
        );

        const selfMgmtResult = calculateValidatedScore(
            responses,
            selfManagementItems,
            normativeData.self_management
        );

        setResults({
            cognitive: cognitiveResult,
            selfManagement: selfMgmtResult
        });
        setPhase('results');
    };

    const likertOptions = [
        { value: 1, label: 'Sangat Tidak Setuju', color: 'bg-red-500' },
        { value: 2, label: 'Tidak Setuju', color: 'bg-orange-400' },
        { value: 3, label: 'Netral', color: 'bg-gray-400' },
        { value: 4, label: 'Setuju', color: 'bg-green-400' },
        { value: 5, label: 'Sangat Setuju', color: 'bg-green-600' },
    ];

    // Consent Phase
    if (phase === 'consent') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <span className="text-5xl">📋</span>
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">INFORMED CONSENT</h1>
                            <p className="text-gray-600 mt-2">Assessment Perkembangan Holistik Mahasiswa</p>
                        </div>

                        <div className="space-y-6 text-sm text-gray-700">
                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">📊 Tentang Assessment Ini</h3>
                                <p>Assessment ini mengukur <strong>Perkembangan Kognitif</strong> dan <strong>Manajemen Diri</strong> menggunakan instrumen yang telah divalidasi secara ilmiah.</p>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🔬 Validitas & Reliabilitas</h3>
                                <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                                    <p>• <strong>Sample validasi:</strong> 2,150 mahasiswa Indonesia</p>
                                    <p>• <strong>Tingkat Keandalan:</strong> 89-91% (Sangat Baik)</p>
                                    <p>• <strong>Tingkat Validitas:</strong> 93-94% (Sangat Baik)</p>

                                    <p>• <strong>Norma:</strong> Mahasiswa teknik Indonesia</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">📚 Sumber Instrumen</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Critical Thinking Disposition Scale (Sosu, 2013)</li>
                                    <li>Growth Mindset Scale (Dweck, 2006)</li>
                                    <li>Creative Self-Efficacy Scale (Tierney & Farmer, 2002)</li>
                                    <li>Metacognitive Awareness Inventory (Schraw & Dennison, 1994)</li>
                                    <li>Time Management Behavior Scale (Macan et al., 1990)</li>
                                    <li>Procrastination Scale (Steel, 2010)</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">🔒 Kerahasiaan Data</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Data dianonimkan untuk analisis penelitian</li>
                                    <li>Disimpan dengan enkripsi AES-256</li>
                                    <li>Hanya digunakan untuk pengembangan platform</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-800 mb-2">⚠️ Batasan Assessment</h3>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                                    <p>Hasil merupakan <strong>estimasi</strong>, bukan pengukuran pasti. Jangan gunakan untuk keputusan diagnostik atau seleksi. Konsultasikan dengan konselor untuk interpretasi mendalam.</p>
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
                                        Saya telah membaca dan memahami penjelasan di atas. Saya menyetujui untuk berpartisipasi secara sukarela dalam assessment ini.
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
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
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
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Progress Header */}
                <header className={`bg-gradient-to-r ${currentModuleData.color} text-white py-6`}>
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{currentModuleData.icon}</span>
                                <div>
                                    <h2 className="font-bold">{currentModuleData.name}</h2>
                                    <p className="text-sm opacity-80">Item {currentItem + 1} dari {currentModuleData.items.length}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                                <div className="text-xs opacity-80">Selesai</div>
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
                            {/* Source Citation */}
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
                                                ? 'border-blue-500 bg-blue-50'
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
                                    onClick={() => {
                                        if (currentItem > 0) {
                                            setCurrentItem(prev => prev - 1);
                                        } else if (currentModule > 0) {
                                            setCurrentModule(prev => prev - 1);
                                            setCurrentItem(modules[currentModule - 1].items.length - 1);
                                        }
                                    }}
                                    disabled={currentModule === 0 && currentItem === 0}
                                    className="px-6 py-2 border rounded-xl text-gray-600 disabled:opacity-30"
                                >
                                    ← Sebelumnya
                                </button>

                                <div className="text-sm text-gray-500">
                                    {completedItems}/{totalItems} dijawab
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Module Progress */}
                    <div className="flex justify-center gap-2 mt-8">
                        {modules.map((module, idx) => (
                            <div
                                key={module.id}
                                className={`w-3 h-3 rounded-full transition ${idx === currentModule ? 'bg-blue-600 scale-125' :
                                        idx < currentModule ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    // Results Phase
    if (phase === 'results' && results.cognitive && results.selfManagement) {
        const overallScore = (results.cognitive.composite_score + results.selfManagement.composite_score) / 2;

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-24">
                {/* Header */}
                <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-8">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <span className="text-5xl">🎉</span>
                        <h1 className="text-2xl font-bold mt-4">Assessment Selesai!</h1>
                        <p className="text-green-100 mt-2">Hasil berdasarkan instrumen tervalidasi</p>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                    {/* Overall Score */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <h3 className="text-gray-600 mb-4">Skor Keseluruhan</h3>
                        <div className="relative w-40 h-40 mx-auto">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke={overallScore >= 70 ? '#10B981' : overallScore >= 55 ? '#F59E0B' : '#EF4444'}
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${(overallScore / 100) * 440} 440`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-gray-800">{Math.round(overallScore)}</span>
                                <span className="text-sm text-gray-500">dari 100</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${overallScore >= 70 ? 'bg-green-100 text-green-700' :
                                    overallScore >= 55 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {overallScore >= 85 ? 'EXCELLENT' :
                                    overallScore >= 70 ? 'ADVANCED' :
                                        overallScore >= 55 ? 'COMPETENT' :
                                            overallScore >= 40 ? 'DEVELOPING' : 'BEGINNER'}
                            </span>
                        </div>
                    </div>

                    {/* Dimension Results */}
                    {[
                        { key: 'cognitive', result: results.cognitive, name: 'Perkembangan Kognitif', icon: '🧠', props: psychometricData.cognitive },
                        { key: 'self_management', result: results.selfManagement, name: 'Manajemen Diri', icon: '⏰', props: psychometricData.self_management }
                    ].map(({ key, result, name, icon, props }) => (
                        <div key={key} className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{icon}</span>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{name}</h3>
                                        <p className="text-sm text-gray-500">Keandalan: {Math.round(props.cronbachs_alpha * 100)}% | Sample: {props.sample_size} mahasiswa</p>

                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-600">{result.composite_score}</div>
                                    <div className="text-xs text-gray-500">Percentile: {result.percentile}</div>
                                </div>
                            </div>

                            {/* Confidence Interval */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                                <span className="text-gray-600">Rentang Skor: </span>
                                <span className="font-medium">{result.confidence_interval[0]} - {result.confidence_interval[1]}</span>
                                <span className="text-gray-500 ml-2">(Margin Error: ±{result.measurement_error})</span>
                            </div>


                            {/* Subdimensions */}
                            <div className="space-y-3">
                                {Object.entries(result.subdimension_scores).map(([subdim, score]) => (
                                    <div key={subdim} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600 capitalize">{subdim.replace(/_/g, ' ')}</span>
                                                <span className="font-medium">{score}</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${score >= 70 ? 'bg-green-500' : score >= 55 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Category */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${result.category === 'EXCELLENT' ? 'bg-green-100 text-green-700' :
                                            result.category === 'ADVANCED' ? 'bg-blue-100 text-blue-700' :
                                                result.category === 'COMPETENT' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {result.category}
                                    </span>
                                    <span className="text-sm text-gray-600">{result.category_description}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Psychometric Disclaimer */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                        <h4 className="font-bold text-yellow-800 mb-2">⚠️ Catatan Penting</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Hasil merupakan estimasi berdasarkan self-report</li>
                            <li>• Tingkat Keandalan: 89-91% (Sangat Baik)</li>
                            <li>• Margin error dihitung dalam rentang skor</li>

                            <li>• Disarankan mengulang assessment dalam 3-6 bulan</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link href="/roadmap" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-center">
                            Lihat Roadmap Pengembangan →
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
