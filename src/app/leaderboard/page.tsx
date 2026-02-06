"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BADGES, calculateLevel, xpToNextLevel, getMockLeaderboard, LeaderboardEntry } from "@/lib/gamification";

export default function LeaderboardPage() {
    const [tab, setTab] = useState<'global' | 'department' | 'badges'>('global');
    const leaderboard = getMockLeaderboard();

    // Current user progress (mock)
    const userProgress = {
        totalXP: 3200,
        level: 10,
        rank: 5,
        badges: ['first-step', 'profile-complete', 'first-assessment', 'learner-5', 'streak-7'],
    };

    const xpProgress = xpToNextLevel(userProgress.totalXP);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">🏆 Leaderboard</h1>
                            <p className="text-purple-200 mt-1">Kompetisi sehat dengan sesama mahasiswa</p>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-white/20 rounded-xl">
                            ← Kembali
                        </Link>
                    </div>

                    {/* User Stats Card */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                                👑
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold">Level {userProgress.level}</span>
                                    <span className="px-2 py-1 bg-yellow-400/20 rounded-full text-xs">
                                        Rank #{userProgress.rank}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{userProgress.totalXP} XP</span>
                                        <span>{xpProgress.current}/{xpProgress.needed} ke Level {userProgress.level + 1}</span>
                                    </div>
                                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 transition-all"
                                            style={{ width: `${xpProgress.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            {userProgress.badges.slice(0, 5).map(badgeId => {
                                const badge = BADGES.find(b => b.id === badgeId);
                                return badge ? (
                                    <div key={badge.id} className="text-2xl" title={badge.name}>
                                        {badge.icon}
                                    </div>
                                ) : null;
                            })}
                            {userProgress.badges.length > 5 && (
                                <span className="text-sm text-purple-200">+{userProgress.badges.length - 5}</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex gap-2 bg-white rounded-xl p-1 shadow">
                    {[
                        { id: 'global', label: '🌍 Global', count: 150 },
                        { id: 'department', label: '🏛️ Departemen', count: 45 },
                        { id: 'badges', label: '🎖️ Badges', count: BADGES.length },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as typeof tab)}
                            className={`flex-1 py-3 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4">
                {/* Leaderboard List */}
                {(tab === 'global' || tab === 'department') && (
                    <div className="space-y-3">
                        {leaderboard.map((entry, index) => (
                            <motion.div
                                key={entry.userId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-2xl p-4 shadow flex items-center gap-4 ${index < 3 ? 'border-2 border-yellow-400' : ''
                                    }`}
                            >
                                {/* Rank */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${index === 0 ? 'bg-yellow-400 text-white' :
                                        index === 1 ? 'bg-gray-300 text-white' :
                                            index === 2 ? 'bg-orange-400 text-white' :
                                                'bg-gray-100 text-gray-600'
                                    }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : entry.rank}
                                </div>

                                {/* Avatar & Name */}
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800">{entry.name}</div>
                                    <div className="text-sm text-gray-500">Level {entry.level}</div>
                                </div>

                                {/* Stats */}
                                <div className="text-right">
                                    <div className="font-bold text-purple-600">{entry.xp.toLocaleString()} XP</div>
                                    <div className="text-xs text-gray-500">🎖️ {entry.badgeCount} badges</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Badges Grid */}
                {tab === 'badges' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {BADGES.map((badge, index) => {
                            const isEarned = userProgress.badges.includes(badge.id);
                            return (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-white rounded-2xl p-4 shadow text-center ${isEarned ? '' : 'opacity-50 grayscale'
                                        }`}
                                >
                                    <div className="text-4xl mb-2">{badge.icon}</div>
                                    <h4 className="font-semibold text-gray-800">{badge.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                                                badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                                                    badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-600'
                                            }`}>
                                            {badge.rarity}
                                        </span>
                                        <span className="text-xs text-purple-600 font-medium">
                                            +{badge.xp_reward} XP
                                        </span>
                                    </div>
                                    {isEarned && (
                                        <div className="mt-2 text-green-600 text-sm font-medium">✅ Diperoleh</div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex justify-around">
                        {[
                            { href: '/dashboard', icon: '🏠', label: 'Home' },
                            { href: '/leaderboard', icon: '🏆', label: 'Rank', active: true },
                            { href: '/learning-resources', icon: '📚', label: 'Learn' },
                            { href: '/profile', icon: '👤', label: 'Profile' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center ${item.active ? 'text-purple-600' : 'text-gray-500'}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
