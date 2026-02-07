'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Crown, TrendingUp, Medal } from 'lucide-react';

/**
 * LeaderboardPreview - Compact leaderboard widget
 * Features: ML-style tier indicators (Bronze → Mythical), real-time ranking
 */

export type LeaderboardTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'mythical';

export interface LeaderboardEntry {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    score: number;
    tier: LeaderboardTier;
    change?: number;
    isCurrentUser?: boolean;
}

interface LeaderboardPreviewProps {
    entries: LeaderboardEntry[];
    currentUserRank?: number;
    totalParticipants?: number;
    className?: string;
}

const tierStyles: Record<LeaderboardTier, { bg: string; text: string; glow: string }> = {
    bronze: { bg: 'bg-[#CD7F32]/20', text: 'text-[#CD7F32]', glow: '' },
    silver: { bg: 'bg-[#C0C0C0]/20', text: 'text-[#C0C0C0]', glow: '' },
    gold: { bg: 'bg-[#FFD700]/20', text: 'text-[#FFD700]', glow: 'shadow-[0_0_10px_rgba(255,215,0,0.3)]' },
    platinum: { bg: 'bg-[#E5E4E2]/20', text: 'text-[#E5E4E2]', glow: 'shadow-[0_0_12px_rgba(229,228,226,0.3)]' },
    diamond: { bg: 'bg-[#00BCD4]/20', text: 'text-[#00BCD4]', glow: 'shadow-[0_0_15px_rgba(0,188,212,0.4)]' },
    mythical: { bg: 'bg-gradient-to-r from-[#FF4081]/20 to-[#7B1FA2]/20', text: 'text-[#FF4081]', glow: 'shadow-[0_0_20px_rgba(255,64,129,0.5)]' },
};

const tierNames: Record<LeaderboardTier, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
    diamond: 'Diamond',
    mythical: 'Mythical',
};

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) {
        return (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center">
                <Crown className="w-4 h-4 text-black" />
            </div>
        );
    }
    if (rank === 2) {
        return (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] flex items-center justify-center">
                <Medal className="w-4 h-4 text-black" />
            </div>
        );
    }
    if (rank === 3) {
        return (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#8B4513] flex items-center justify-center">
                <Medal className="w-4 h-4 text-black" />
            </div>
        );
    }
    return (
        <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex items-center justify-center">
            <span className="text-xs font-bold text-white/60">{rank}</span>
        </div>
    );
}

export function LeaderboardPreview({
    entries,
    currentUserRank,
    totalParticipants = 1000,
    className,
}: LeaderboardPreviewProps) {
    return (
        <div
            className={cn(
                'bg-[#121212] border border-white/10 rounded-2xl overflow-hidden',
                className
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-black" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Leaderboard</h3>
                        <p className="text-[10px] text-white/40">{totalParticipants.toLocaleString()} Mahasiswa</p>
                    </div>
                </div>
                {currentUserRank && (
                    <div className="text-right">
                        <p className="text-[10px] text-white/40">Your Rank</p>
                        <p className="text-lg font-bold text-white">#{currentUserRank}</p>
                    </div>
                )}
            </div>

            {/* Entries */}
            <div className="divide-y divide-white/5">
                {entries.map((entry, index) => {
                    const tier = tierStyles[entry.tier];
                    return (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                'flex items-center gap-3 p-3 hover:bg-white/5 transition-colors',
                                entry.isCurrentUser && 'bg-[#7B1FA2]/10 border-l-2 border-[#7B1FA2]'
                            )}
                        >
                            {/* Rank Badge */}
                            <RankBadge rank={entry.rank} />

                            {/* Avatar */}
                            <div className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                                tier.bg,
                                tier.glow
                            )}>
                                {entry.avatar}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        'text-sm font-medium truncate',
                                        entry.isCurrentUser ? 'text-white' : 'text-white/80'
                                    )}>
                                        {entry.name}
                                        {entry.isCurrentUser && <span className="text-[10px] text-white/40 ml-1">(You)</span>}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', tier.bg, tier.text)}>
                                        {tierNames[entry.tier]}
                                    </span>
                                </div>
                            </div>

                            {/* Score & Change */}
                            <div className="text-right">
                                <div className="text-sm font-bold text-white">{entry.score.toLocaleString()}</div>
                                {entry.change !== undefined && (
                                    <div className={cn(
                                        'text-[10px] font-medium',
                                        entry.change > 0 ? 'text-[#4CAF50]' : entry.change < 0 ? 'text-[#F44336]' : 'text-white/40'
                                    )}>
                                        {entry.change > 0 && '▲'}{entry.change < 0 && '▼'}{Math.abs(entry.change)}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 text-center">
                <a href="/leaderboard" className="text-xs text-[#00BCD4] hover:text-[#00BCD4]/80 font-medium">
                    View Full Leaderboard →
                </a>
            </div>
        </div>
    );
}

// Example data
export const exampleLeaderboardEntries: LeaderboardEntry[] = [
    { id: '1', rank: 1, name: 'Ahmad Rizky', avatar: 'AR', score: 12450, tier: 'mythical', change: 2 },
    { id: '2', rank: 2, name: 'Siti Nurhaliza', avatar: 'SN', score: 11890, tier: 'diamond', change: -1 },
    { id: '3', rank: 3, name: 'Budi Santoso', avatar: 'BS', score: 11200, tier: 'diamond', change: 1 },
    { id: '4', rank: 4, name: 'Dewi Lestari', avatar: 'DL', score: 10500, tier: 'platinum', change: 0 },
    { id: '5', rank: 5, name: 'You', avatar: 'ME', score: 9800, tier: 'gold', change: 3, isCurrentUser: true },
];

export default LeaderboardPreview;
