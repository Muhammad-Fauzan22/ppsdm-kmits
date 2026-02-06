"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AssessmentCard {
    title: string;
    description: string;
    href: string;
    icon: string;
    color: string;
    items: number;
    dimension: string;
    completed?: boolean;
    score?: number;
}

const assessments: AssessmentCard[] = [
    {
        title: "Cognitive Development",
        description: "Kemampuan berpikir kritis, analitis, dan pemecahan masalah",
        href: "/scientific-assessment",
        icon: "🧠",
        color: "from-blue-500 to-indigo-600",
        items: 8,
        dimension: "cognitive",
        completed: true,
        score: 72,
    },
    {
        title: "Self-Management",
        description: "Pengelolaan waktu, prioritas, dan produktivitas",
        href: "/scientific-assessment",
        icon: "⏰",
        color: "from-purple-500 to-violet-600",
        items: 11,
        dimension: "self_management",
        completed: true,
        score: 68,
    },
    {
        title: "Financial Intelligence",
        description: "Literasi keuangan dan manajemen finansial",
        href: "/financial-assessment",
        icon: "💰",
        color: "from-green-500 to-emerald-600",
        items: 15,
        dimension: "financial",
        completed: true,
        score: 65,
    },
    {
        title: "Physical Health",
        description: "Kesehatan fisik, olahraga, dan gaya hidup aktif",
        href: "/physical-health-assessment",
        icon: "💪",
        color: "from-red-500 to-orange-600",
        items: 8,
        dimension: "physical_health",
        completed: true,
        score: 78,
    },
    {
        title: "Emotional Intelligence",
        description: "Kecerdasan emosional dan hubungan interpersonal",
        href: "/emotional-intelligence-assessment",
        icon: "💚",
        color: "from-pink-500 to-rose-600",
        items: 8,
        dimension: "emotional_intelligence",
        completed: false,
    },
    {
        title: "Mental Health",
        description: "Kesehatan mental, stress management, dan resiliensi",
        href: "/mental-health-assessment",
        icon: "🧘",
        color: "from-violet-500 to-purple-600",
        items: 8,
        dimension: "mental_health",
        completed: false,
    },
    {
        title: "Character & Ethics",
        description: "Integritas, tanggung jawab, dan etika profesional",
        href: "/character-assessment",
        icon: "⚔️",
        color: "from-amber-500 to-yellow-600",
        items: 10,
        dimension: "character_ethics",
        completed: false,
    },
    {
        title: "Spiritual Development",
        description: "Pengembangan spiritual dan tujuan hidup",
        href: "/spiritual-assessment",
        icon: "🕊️",
        color: "from-sky-500 to-blue-600",
        items: 8,
        dimension: "spiritual",
        completed: false,
    },
    {
        title: "Environmental & Lifestyle",
        description: "Kesadaran lingkungan dan gaya hidup berkelanjutan",
        href: "/environmental-assessment",
        icon: "🌍",
        color: "from-teal-500 to-green-600",
        items: 10,
        dimension: "environmental",
        completed: false,
    },
];

export default function AllAssessmentsPage() {
    const completedCount = assessments.filter(a => a.completed).length;
    const averageScore = assessments.filter(a => a.completed && a.score).reduce((acc, a) => acc + (a.score || 0), 0) / completedCount || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                📊 All Assessments
                            </h1>
                            <p className="text-indigo-100 mt-1">9 dimensi pengembangan holistik mahasiswa</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Progress Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{completedCount}/9</div>
                            <div className="text-indigo-200 text-sm">Completed</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{Math.round(averageScore)}</div>
                            <div className="text-indigo-200 text-sm">Avg Score</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">86</div>
                            <div className="text-indigo-200 text-sm">Total Items</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Assessment Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment, index) => (
                        <motion.div
                            key={assessment.dimension}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={assessment.href}
                                className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                            >
                                {/* Color Header */}
                                <div className={`h-20 bg-gradient-to-r ${assessment.color} flex items-center justify-center relative`}>
                                    <span className="text-4xl">{assessment.icon}</span>
                                    {assessment.completed && (
                                        <div className="absolute top-2 right-2 bg-white/90 text-green-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            ✓ Done
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-indigo-600 transition">
                                        {assessment.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {assessment.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {assessment.items} items
                                        </span>
                                        {assessment.completed && assessment.score ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-800">{assessment.score}</span>
                                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${assessment.color}`}
                                                        style={{ width: `${assessment.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className={`text-xs px-2 py-1 bg-gradient-to-r ${assessment.color} text-white rounded-full`}>
                                                Start →
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Psychometric Report Banner */}
                <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="text-6xl">📈</div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold">Full Psychometric Report</h3>
                            <p className="text-gray-300 mt-1">Lihat analisis lengkap dan rekomendasi berdasarkan semua assessment yang sudah kamu selesaikan</p>
                        </div>
                        <Link
                            href="/psychometric-report"
                            className="bg-white text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
                        >
                            View Report →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
