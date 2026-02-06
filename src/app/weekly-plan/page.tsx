"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { generateWeeklyPlan, getPriorityDomains } from "@/lib/analytics";

// Mock user scores - in production, fetch from database/store
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

export default function WeeklyPlanPage() {
    const [completedDays, setCompletedDays] = useState<string[]>([]);

    const weeklyPlan = generateWeeklyPlan(mockScores);
    const priorities = getPriorityDomains(mockScores, 3);

    const totalXP = weeklyPlan.reduce((sum, day) => sum + day.xpReward, 0);
    const earnedXP = weeklyPlan
        .filter(day => completedDays.includes(day.day))
        .reduce((sum, day) => sum + day.xpReward, 0);

    const toggleDay = (day: string) => {
        setCompletedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const dimNames: Record<string, { name: string; icon: string }> = {
        cognitive: { name: 'Kognitif', icon: '🧠' },
        self_management: { name: 'Self-Management', icon: '⏰' },
        financial: { name: 'Finansial', icon: '💰' },
        physical_health: { name: 'Kesehatan Fisik', icon: '💪' },
        emotional_intelligence: { name: 'Kecerdasan Emosional', icon: '💚' },
        mental_health: { name: 'Kesehatan Mental', icon: '🧘' },
        character_ethics: { name: 'Karakter & Etika', icon: '⚔️' },
        spiritual: { name: 'Spiritual', icon: '🕊️' },
        environmental: { name: 'Environmental', icon: '🌍' },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                📅 Weekly Development Plan
                            </h1>
                            <p className="text-green-100 mt-1">Rencana pengembangan mingguan personal</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Progress Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{completedDays.length}/7</div>
                            <div className="text-green-200 text-sm">Hari Selesai</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{earnedXP}/{totalXP}</div>
                            <div className="text-green-200 text-sm">XP Earned</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{Math.round((completedDays.length / 7) * 100)}%</div>
                            <div className="text-green-200 text-sm">Progress</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Priority Domains */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 Focus Areas Minggu Ini</h2>
                    <div className="flex flex-wrap gap-3">
                        {priorities.map((p, index) => (
                            <div
                                key={p.domain}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full ${index === 0 ? 'bg-red-100 text-red-700' :
                                        index === 1 ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                <span className="text-xl">{dimNames[p.domain]?.icon}</span>
                                <span className="font-medium">{dimNames[p.domain]?.name}</span>
                                <span className="text-sm">({p.score} → {p.score + 5})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Plan */}
                <div className="space-y-4">
                    {weeklyPlan.map((day, index) => {
                        const isCompleted = completedDays.includes(day.day);
                        const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1);

                        return (
                            <motion.div
                                key={day.day}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => toggleDay(day.day)}
                                className={`bg-white rounded-xl p-5 shadow-sm border-2 cursor-pointer transition-all ${isCompleted
                                        ? 'border-green-400 bg-green-50'
                                        : isToday
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-transparent hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Checkbox */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {isCompleted ? '✓' : (index + 1)}
                                    </div>

                                    {/* Day Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-800">{day.day}</span>
                                            {isToday && (
                                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                                    HARI INI
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-lg mt-1">{day.activity}</div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                {dimNames[day.dimension]?.icon} {dimNames[day.dimension]?.name}
                                            </span>
                                            <span>⏱️ {day.duration}</span>
                                        </div>
                                    </div>

                                    {/* XP Reward */}
                                    <div className={`text-right ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                        <div className="text-2xl font-bold">+{day.xpReward}</div>
                                        <div className="text-xs">XP</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Weekly Summary */}
                {completedDays.length === 7 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-8 text-white text-center"
                    >
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold">Selamat! Minggu Ini Selesai!</h2>
                        <p className="text-green-100 mt-2">Kamu telah mendapatkan {totalXP} XP</p>
                        <Link
                            href="/achievements"
                            className="inline-block mt-4 bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition"
                        >
                            Lihat Achievements 🏆
                        </Link>
                    </motion.div>
                )}

                {/* Tips Section */}
                <div className="mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6">
                    <h3 className="font-bold text-indigo-800 mb-3">💡 Tips Produktivitas</h3>
                    <ul className="space-y-2 text-indigo-700">
                        <li>✓ Kerjakan aktivitas di waktu terbaik (pagi untuk fokus, sore untuk refleksi)</li>
                        <li>✓ Gunakan timer 25 menit (Pomodoro) untuk setiap aktivitas</li>
                        <li>✓ Jangan skip di weekend - konsistensi lebih penting dari intensitas</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Link
                        href="/ai-tutor"
                        className="flex-1 bg-purple-100 text-purple-700 py-4 rounded-xl text-center font-medium hover:bg-purple-200 transition"
                    >
                        💬 Konsultasi AI Tutor
                    </Link>
                    <Link
                        href="/gap-analysis"
                        className="flex-1 bg-blue-100 text-blue-700 py-4 rounded-xl text-center font-medium hover:bg-blue-200 transition"
                    >
                        📊 Gap Analysis
                    </Link>
                </div>
            </main>
        </div>
    );
}
