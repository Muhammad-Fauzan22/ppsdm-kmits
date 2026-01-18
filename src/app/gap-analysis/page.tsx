"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

// Mock user scores
const userScores: Record<string, number> = {
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

// Benchmark data
const benchmarks = {
    national: {
        cognitive: 62.5, self_management: 58.4, financial: 48.2,
        physical_health: 55.6, emotional_intelligence: 60.8, mental_health: 54.3,
        character_ethics: 68.4, spiritual: 72.5, environmental: 52.8,
    },
    its: {
        cognitive: 72.3, self_management: 68.7, financial: 58.4,
        physical_health: 64.2, emotional_intelligence: 68.5, mental_health: 62.8,
        character_ethics: 74.6, spiritual: 77.4, environmental: 64.3,
    },
    industry: {
        cognitive: 75, self_management: 80, financial: 70,
        physical_health: 75, emotional_intelligence: 78, mental_health: 70,
        character_ethics: 82, spiritual: 78, environmental: 70,
    },
};

const dimensions = [
    { key: 'cognitive', name: 'Kognitif', icon: '🧠' },
    { key: 'self_management', name: 'Self-Mgmt', icon: '⏰' },
    { key: 'financial', name: 'Finansial', icon: '💰' },
    { key: 'physical_health', name: 'Fisik', icon: '💪' },
    { key: 'emotional_intelligence', name: 'Emosional', icon: '💚' },
    { key: 'mental_health', name: 'Mental', icon: '🧘' },
    { key: 'character_ethics', name: 'Karakter', icon: '⚔️' },
    { key: 'spiritual', name: 'Spiritual', icon: '🕊️' },
    { key: 'environmental', name: 'Lingkungan', icon: '🌍' },
];

export default function GapAnalysisPage() {
    const [compareWith, setCompareWith] = useState<'national' | 'its' | 'industry'>('national');

    // Prepare radar chart data
    const radarData = dimensions.map(dim => ({
        dimension: dim.name,
        'Skor Kamu': userScores[dim.key] || 0,
        'Benchmark': benchmarks[compareWith][dim.key as keyof typeof benchmarks.national] || 0,
    }));

    // Prepare bar chart data
    const barData = dimensions.map(dim => {
        const userScore = userScores[dim.key] || 0;
        const benchmark = benchmarks[compareWith][dim.key as keyof typeof benchmarks.national] || 0;
        const gap = benchmark - userScore;

        return {
            name: dim.name,
            icon: dim.icon,
            'Skor Kamu': userScore,
            Gap: gap > 0 ? gap : 0,
            'Di Atas': gap < 0 ? Math.abs(gap) : 0,
            benchmark,
        };
    });

    // Sort by gap for priority
    const priorities = [...barData].sort((a, b) => b.Gap - a.Gap).slice(0, 3);

    // Calculate summary stats
    const totalGap = barData.reduce((sum, d) => sum + d.Gap, 0);
    const avgGap = totalGap / dimensions.length;
    const aboveBenchmark = barData.filter(d => d['Di Atas'] > 0).length;

    const comparisonLabels = {
        national: 'Rata-rata Mahasiswa Indonesia',
        its: 'Rata-rata Mahasiswa ITS',
        industry: 'Standar Industri Teknik',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                📊 Gap Analysis Dashboard
                            </h1>
                            <p className="text-blue-100 mt-1">Bandingkan skormu dengan benchmark nasional & industri</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{aboveBenchmark}/9</div>
                            <div className="text-blue-200 text-sm">Di Atas Benchmark</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{avgGap > 0 ? '+' : ''}{avgGap.toFixed(1)}</div>
                            <div className="text-blue-200 text-sm">Rata-rata Gap</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{priorities[0]?.icon}</div>
                            <div className="text-blue-200 text-sm">Prioritas #{1}: {priorities[0]?.name}</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Comparison Selector */}
                <div className="flex gap-2 mb-8 justify-center">
                    {(['national', 'its', 'industry'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setCompareWith(type)}
                            className={`px-6 py-3 rounded-full font-medium transition ${compareWith === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {type === 'national' && '🇮🇩 Nasional'}
                            {type === 'its' && '🏛️ ITS'}
                            {type === 'industry' && '🏢 Industri'}
                        </button>
                    ))}
                </div>

                <p className="text-center text-gray-600 mb-8">
                    Membandingkan dengan: <strong>{comparisonLabels[compareWith]}</strong>
                </p>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 Radar Comparison</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                    name="Skor Kamu"
                                    dataKey="Skor Kamu"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.3}
                                />
                                <Radar
                                    name="Benchmark"
                                    dataKey="Benchmark"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.1}
                                />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gap Bar Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Gap per Dimensi</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Skor Kamu" stackId="a" fill="#6366f1" />
                                <Bar dataKey="Gap" stackId="a" fill="#f87171" />
                                <Bar dataKey="Di Atas" stackId="a" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Development Areas */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 Priority Development Areas</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {priorities.map((priority, index) => (
                            <motion.div
                                key={priority.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-xl ${index === 0 ? 'bg-red-50 border-2 border-red-200' :
                                        index === 1 ? 'bg-orange-50 border-2 border-orange-200' :
                                            'bg-yellow-50 border-2 border-yellow-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-3xl">{priority.icon}</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${index === 0 ? 'bg-red-200 text-red-700' :
                                            index === 1 ? 'bg-orange-200 text-orange-700' :
                                                'bg-yellow-200 text-yellow-700'
                                        }`}>
                                        Priority #{index + 1}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">{priority.name}</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Skor kamu: <strong>{priority['Skor Kamu']}</strong></p>
                                    <p>Target: <strong>{priority.benchmark}</strong></p>
                                    <p className="text-red-600">Gap: <strong>+{priority.Gap.toFixed(1)}</strong> poin</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                    <h2 className="text-xl font-bold mb-4">💡 Rekomendasi Personal</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold mb-2">Minggu Ini:</h3>
                            <ul className="space-y-2 text-indigo-100">
                                {priorities.map((p, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-lg">{p.icon}</span>
                                        <span>Fokus 20 menit/hari untuk {p.name.toLowerCase()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Quick Actions:</h3>
                            <div className="space-y-2">
                                <Link
                                    href="/ai-tutor"
                                    className="block bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg"
                                >
                                    🤖 Minta saran AI Tutor
                                </Link>
                                <Link
                                    href="/learning-paths"
                                    className="block bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg"
                                >
                                    📚 Lihat Learning Paths
                                </Link>
                                <Link
                                    href="/ai-report"
                                    className="block bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg"
                                >
                                    📋 Generate AI Report
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benchmark Data Source */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>📊 Data benchmark berdasarkan survei pendidikan Indonesia 2024</p>
                    <p>Sumber: Kemendikbud, BPS, OJK, Kemenkes, KLHK</p>
                </div>
            </main>
        </div>
    );
}
