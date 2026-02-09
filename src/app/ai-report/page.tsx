"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Mock scores - in production, fetch from database
const mockScores: Record<string, number> = {
    cognitive: 72,
    self_management: 68,
    financial: 55,
    physical_health: 78,
    emotional_intelligence: 71,
    mental_health: 64,
    character_ethics: 75,
    spiritual: 70,
    environmental: 58,
};

export default function AIReportPage() {
    const [report, setReport] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: 'Mahasiswa',
                    scores: mockScores,
                    benchmarks: {
                        national: {
                            cognitive: 62.5,
                            self_management: 58.4,
                            financial: 48.2,
                            physical_health: 55.6,
                            emotional_intelligence: 60.8,
                            mental_health: 54.3,
                            character_ethics: 68.4,
                            spiritual: 72.5,
                            environmental: 52.8,
                        },
                        its: {
                            cognitive: 72.3,
                            self_management: 68.7,
                            financial: 58.4,
                            physical_health: 64.2,
                            emotional_intelligence: 68.5,
                            mental_health: 62.8,
                            character_ethics: 74.6,
                            spiritual: 77.4,
                            environmental: 64.3,
                        },
                    },
                }),
            });

            const data = await response.json();
            if (data.success) {
                setReport(data.report);
                setHasGenerated(true);
            } else {
                throw new Error(data.error || 'Gagal membuat laporan');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    // Calculate summary stats
    const avgScore = Object.values(mockScores).reduce((a, b) => a + b, 0) / Object.values(mockScores).length;
    const strongestDim = Object.entries(mockScores).sort((a, b) => b[1] - a[1])[0];
    const weakestDim = Object.entries(mockScores).sort((a, b) => a[1] - b[1])[0];

    const dimNames: Record<string, string> = {
        cognitive: 'Kognitif',
        self_management: 'Self-Management',
        financial: 'Finansial',
        physical_health: 'Kesehatan Fisik',
        emotional_intelligence: 'Kecerdasan Emosional',
        mental_health: 'Kesehatan Mental',
        character_ethics: 'Karakter & Etika',
        spiritual: 'Spiritual',
        environmental: 'Environmental',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                🤖 AI Psychometric Report
                            </h1>
                            <p className="text-purple-100 mt-1">Analisis personal berbasis AI (Gratis)</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Score Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div className="text-3xl font-bold text-indigo-600">{Math.round(avgScore)}</div>
                        <div className="text-gray-500 text-sm">Rata-rata Skor</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-green-600">{dimNames[strongestDim[0]]}</div>
                        <div className="text-gray-500 text-sm">Dimensi Terkuat ({strongestDim[1]})</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-orange-600">{dimNames[weakestDim[0]]}</div>
                        <div className="text-gray-500 text-sm">Perlu Fokus ({weakestDim[1]})</div>
                    </div>
                </div>

                {/* Score Bars */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Skor per Dimensi</h2>
                    <div className="space-y-3">
                        {Object.entries(mockScores).map(([dim, score]) => (
                            <div key={dim} className="flex items-center gap-4">
                                <div className="w-32 text-sm text-gray-600 truncate">{dimNames[dim]}</div>
                                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${score}%` }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        <div className={`h-full w-full rounded-full ${score >= 75 ? 'bg-green-500' :
                                                score >= 60 ? 'bg-blue-500' :
                                                    score >= 45 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} />
                                    </motion.div>
                                </div>

                                <div className="w-12 text-right font-bold text-gray-800">{score}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Generate Report Button */}
                {!hasGenerated && (
                    <div className="text-center mb-8">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <button
                                onClick={generateReport}
                                disabled={loading}
                                className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span> Generating with AI...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        ✨ Generate AI Report (FREE)
                                    </span>
                                )}
                            </button>
                        </motion.div>
                        <p className="text-gray-500 text-sm mt-2">Powered by Llama 3.3 70B via Groq</p>
                    </div>
                )}


                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8">
                        ⚠️ {error}
                    </div>
                )}

                {/* Generated Report */}
                {report && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center justify-between mb-6">

                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                📋 Laporan Personal
                            </h2>
                            <button
                                onClick={generateReport}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                🔄 Regenerate
                            </button>
                        </div>

                        <div className="prose prose-indigo max-w-none">
                            {report.split('\n').map((line, index) => {
                                if (line.startsWith('# ')) {
                                    return <h1 key={index} className="text-2xl font-bold text-gray-800 mt-6 mb-4">{line.replace('# ', '')}</h1>;
                                } else if (line.startsWith('## ')) {
                                    return <h2 key={index} className="text-xl font-bold text-indigo-700 mt-5 mb-3">{line.replace('## ', '')}</h2>;
                                } else if (line.startsWith('**') && line.endsWith('**')) {
                                    return <p key={index} className="font-bold text-gray-800">{line.replace(/\*\*/g, '')}</p>;
                                } else if (line.startsWith('- ')) {
                                    return <li key={index} className="text-gray-700 ml-4">{line.replace('- ', '')}</li>;
                                } else if (line.startsWith('*') && line.endsWith('*')) {
                                    return <p key={index} className="italic text-gray-600 my-4">{line.replace(/\*/g, '')}</p>;
                                } else if (line.trim() === '') {
                                    return <br key={index} />;
                                } else {
                                    return <p key={index} className="text-gray-700 mb-3">{line}</p>;
                                }
                            })}
                            </div>
                        </div>
                    </motion.div>
                )}


                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Link
                        href="/ai-tutor"
                        className="flex-1 bg-purple-100 text-purple-700 py-4 rounded-xl text-center font-medium hover:bg-purple-200 transition"
                    >
                        💬 Chat with AI Tutor
                    </Link>
                    <Link
                        href="/learning-paths"
                        className="flex-1 bg-indigo-100 text-indigo-700 py-4 rounded-xl text-center font-medium hover:bg-indigo-200 transition"
                    >
                        📚 Learning Paths
                    </Link>
                    <Link
                        href="/gap-analysis"
                        className="flex-1 bg-blue-100 text-blue-700 py-4 rounded-xl text-center font-medium hover:bg-blue-200 transition"
                    >
                        📈 Gap Analysis
                    </Link>
                </div>
            </main>
        </div>
    );
}
