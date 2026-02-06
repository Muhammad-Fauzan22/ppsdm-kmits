"use client";

import React, { useEffect, useState } from 'react';
import { useGamificationStore } from '@/lib/stores/useGamificationStore';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Zap, Shield, Medal } from 'lucide-react';

export default function PlayerHUD() {
    const { xp, level, rank, achievements } = useGamificationStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        useGamificationStore.persist.rehydrate();
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return null;

    // Calculate progress to next level
    const nextLevelXp = Math.pow(level, 2) * 100;
    const currentLevelBaseXp = Math.pow(level - 1, 2) * 100;
    const progressPercent = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100));

    const getRankIcon = (r: string) => {
        switch (r) {
            case 'Grandmaster': return <Crown className="w-5 h-5 text-yellow-500" />;
            case 'Master': return <Trophy className="w-5 h-5 text-purple-500" />;
            case 'Expert': return <Medal className="w-5 h-5 text-red-500" />;
            case 'Adept': return <Shield className="w-5 h-5 text-blue-500" />;
            case 'Apprentice': return <Zap className="w-5 h-5 text-green-500" />;
            default: return <Star className="w-5 h-5 text-gray-400" />;
        }
    };

    const getRankColor = (r: string) => {
        switch (r) {
            case 'Grandmaster': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Master': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Expert': return 'bg-red-100 text-red-700 border-red-200';
            case 'Adept': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Apprentice': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {/* Top Row: Rank & Level */}
            <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRankColor(rank)}`}>
                    {getRankIcon(rank)}
                    <span className="font-bold text-sm">{rank}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Level</span>
                    <span className="text-2xl font-black leading-none text-gray-800">{level}</span>
                </div>
            </div>

            {/* XP Bar */}
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, type: 'spring' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-black/50 drop-shadow-sm">
                        {Math.floor(xp)} / {nextLevelXp} XP
                    </span>
                </div>
            </div>

            {/* Recent Achievements Ticker */}
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Unlocks</h4>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {achievements.filter(a => a.unlockedAt).length === 0 ? (
                        <div className="text-xs text-gray-400 italic">Locked... play to earn!</div>
                    ) : (
                        achievements.filter(a => a.unlockedAt).sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()).slice(0, 3).map(ach => (
                            <div key={ach.id} className="flex-shrink-0 flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-2 py-1.5 rounded-lg" title={ach.description}>
                                <span className="text-sm">{ach.icon}</span>
                                <span className="text-xs font-medium text-yellow-800 whitespace-nowrap">{ach.title}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
