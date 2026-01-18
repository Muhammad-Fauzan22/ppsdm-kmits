"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BADGES, Badge, xpToNextLevel, LEVEL_THRESHOLDS } from "@/lib/gamification";

// Mock user progress - replace with real data from Supabase
const mockUserProgress = {
    userId: 'user-123',
    totalXP: 1850,
    level: 7,
    streakDays: 12,
    lastActivityDate: new Date().toISOString(),
    badges: ['first-step', 'first-assessment', 'ai-explorer', 'streak-7', 'learner-5'],
    completedActivities: 35,
    assessmentsCompleted: 4,
    resourcesCompleted: 18,
    goalsAchieved: 3,
};

const mockDimensionScores: Record<string, number> = {
    cognitive: 72,
    self_management: 68,
    financial: 65,
    physical_health: 78,
    emotional_intelligence: 71,
    mental_health: 69,
    character_ethics: 75,
    spiritual: 0, // Not assessed yet
    environmental: 0, // Not assessed yet
};

export default function AchievementsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const progress = mockUserProgress;
    const xpProgress = xpToNextLevel(progress.totalXP);

    const earnedBadges = BADGES.filter(b => progress.badges.includes(b.id));
    const unearnedBadges = BADGES.filter(b => !progress.badges.includes(b.id));

    const categories = [
        { id: 'all', name: 'Semua', icon: '🏆' },
        { id: 'starter', name: 'Starter', icon: '🚀' },
        { id: 'progress', name: 'Progress', icon: '📈' },
        { id: 'dimension', name: 'Dimensi', icon: '⭐' },
        { id: 'streak', name: 'Streak', icon: '🔥' },
        { id: 'special', name: 'Spesial', icon: '✨' },
    ];

    const filteredBadges = selectedCategory === 'all'
        ? BADGES
        : BADGES.filter(b => b.category === selectedCategory);

    const rarityColors: Record<string, string> = {
        common: 'from-gray-400 to-gray-500',
        rare: 'from-blue-400 to-blue-600',
        epic: 'from-purple-400 to-purple-600',
        legendary: 'from-yellow-400 to-orange-500',
    };

    const rarityBg: Record<string, string> = {
        common: 'bg-gray-100',
        rare: 'bg-blue-50',
        epic: 'bg-purple-50',
        legendary: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                🏆 Achievements
                            </h1>
                            <p className="text-indigo-100 mt-1">Koleksi badge dan pencapaianmu</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* User Stats Bar */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{progress.level}</div>
                            <div className="text-indigo-200 text-sm">Level</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{progress.totalXP.toLocaleString()}</div>
                            <div className="text-indigo-200 text-sm">Total XP</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold flex items-center justify-center gap-1">
                                🔥 {progress.streakDays}
                            </div>
                            <div className="text-indigo-200 text-sm">Day Streak</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{earnedBadges.length}/{BADGES.length}</div>
                            <div className="text-indigo-200 text-sm">Badges</div>
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-6 bg-white/10 rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Level {progress.level}</span>
                            <span>{xpProgress.current} / {xpProgress.needed} XP</span>
                            <span>Level {progress.level + 1}</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${xpProgress.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === cat.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Earned Badges */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        ✅ Badge yang Didapat ({earnedBadges.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredBadges.filter(b => progress.badges.includes(b.id)).map(badge => (
                            <motion.button
                                key={badge.id}
                                onClick={() => setSelectedBadge(badge)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`${rarityBg[badge.rarity]} rounded-xl p-4 text-center shadow-lg border-2 border-transparent hover:border-indigo-300 transition`}
                            >
                                <div className="text-4xl mb-2">{badge.icon}</div>
                                <div className="font-medium text-gray-800 text-sm">{badge.name}</div>
                                <div className={`text-xs mt-1 font-medium bg-gradient-to-r ${rarityColors[badge.rarity]} bg-clip-text text-transparent uppercase`}>
                                    {badge.rarity}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Locked Badges */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🔒 Badge Terkunci ({unearnedBadges.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredBadges.filter(b => !progress.badges.includes(b.id)).map(badge => (
                            <motion.button
                                key={badge.id}
                                onClick={() => setSelectedBadge(badge)}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-100 rounded-xl p-4 text-center opacity-60 hover:opacity-80 transition"
                            >
                                <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                                <div className="font-medium text-gray-500 text-sm">{badge.name}</div>
                                <div className="text-xs mt-1 text-gray-400">+{badge.xp_reward} XP</div>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Dimension Progress */}
                <section className="mt-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        📊 Progress Dimensi
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(mockDimensionScores).map(([dim, score]) => {
                            const dimNames: Record<string, { name: string, icon: string }> = {
                                cognitive: { name: 'Cognitive', icon: '🧠' },
                                self_management: { name: 'Self-Management', icon: '⏰' },
                                financial: { name: 'Financial', icon: '💰' },
                                physical_health: { name: 'Physical Health', icon: '💪' },
                                emotional_intelligence: { name: 'Emotional Intelligence', icon: '💚' },
                                mental_health: { name: 'Mental Health', icon: '🧘' },
                                character_ethics: { name: 'Character & Ethics', icon: '⚔️' },
                                spiritual: { name: 'Spiritual', icon: '🕊️' },
                                environmental: { name: 'Environmental', icon: '🌍' },
                            };
                            const info = dimNames[dim] || { name: dim, icon: '📋' };

                            return (
                                <div key={dim} className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="flex items-center gap-2">
                                            <span className="text-xl">{info.icon}</span>
                                            <span className="font-medium">{info.name}</span>
                                        </span>
                                        <span className={`font-bold ${score >= 90 ? 'text-green-600' : score >= 70 ? 'text-blue-600' : score > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                                            {score > 0 ? score : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-blue-500' : score > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                                                }`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                    {score >= 90 && <div className="text-xs text-green-600 mt-1">🏆 Master!</div>}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Badge Detail Modal */}
            <AnimatePresence>
                {selectedBadge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedBadge(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`${rarityBg[selectedBadge.rarity]} rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-6xl mb-4">{selectedBadge.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-800">{selectedBadge.name}</h3>
                            <div className={`text-sm font-medium bg-gradient-to-r ${rarityColors[selectedBadge.rarity]} bg-clip-text text-transparent uppercase mt-1`}>
                                {selectedBadge.rarity}
                            </div>
                            <p className="text-gray-600 mt-4">{selectedBadge.description}</p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-indigo-600">
                                <span>⚡</span>
                                <span className="font-bold">+{selectedBadge.xp_reward} XP</span>
                            </div>

                            {progress.badges.includes(selectedBadge.id) ? (
                                <div className="mt-6 px-4 py-2 bg-green-100 text-green-700 rounded-full inline-flex items-center gap-2">
                                    ✅ Didapat!
                                </div>
                            ) : (
                                <div className="mt-6 px-4 py-2 bg-gray-100 text-gray-600 rounded-full inline-flex items-center gap-2">
                                    🔒 Belum didapat
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                            >
                                Tutup
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
