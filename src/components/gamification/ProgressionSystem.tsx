'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageOff, Trophy } from 'lucide-react';

/**
 * XPLevelRing - Circular XP progress indicator with level display
 * Mobile Legends inspired level visualization
 */
export interface XPLevelRingProps {
    currentXP: number;
    maxXP: number;
    level: number;
    size?: 'sm' | 'md' | 'lg';
    showDetails?: boolean;
    animated?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: { ring: 'w-16 h-16', text: 'text-lg', stroke: 4 },
    md: { ring: 'w-24 h-24', text: 'text-2xl', stroke: 5 },
    lg: { ring: 'w-32 h-32', text: 'text-3xl', stroke: 6 },
};

export function XPLevelRing({
    currentXP,
    maxXP,
    level,
    size = 'md',
    showDetails = true,
    animated = true,
    className,
}: XPLevelRingProps) {
    const percentage = Math.min((currentXP / maxXP) * 100, 100);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const sizes = sizeClasses[size];

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            <div className={cn('relative', sizes.ring)}>
                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={sizes.stroke}
                    />
                    {/* XP Progress Ring */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#xpGradient)"
                        strokeWidth={sizes.stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: animated ? strokeDashoffset : strokeDashoffset }}
                        transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] as any }}
                    />
                    <defs>
                        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="100%" stopColor="#FF9800" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Level Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(sizes.text, 'font-bold text-white')}>
                        {level}
                    </span>
                </div>

                {/* Glow Effect */}
                <div
                    className="absolute inset-0 rounded-full opacity-50 blur-lg"
                    style={{
                        background: `conic-gradient(from 0deg, #FFD700 ${percentage}%, transparent ${percentage}%)`,
                    }}
                />
            </div>

            {/* XP Text */}
            {showDetails && (
                <div className="text-center">
                    <div className="text-xs text-slate-400">
                        {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-ml-gold font-medium">
                        Level {level}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * AchievementToast - Popup notification for unlocked achievements
 */
export interface AchievementToastProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';
    xpReward?: number;
    isVisible: boolean;
    onClose?: () => void;
}

const rarityColors = {
    common: { bg: 'from-slate-500 to-slate-600', text: 'text-slate-300' },
    rare: { bg: 'from-[#4CAF50] to-[#2E7D32]', text: 'text-[#4CAF50]' },
    epic: { bg: 'from-[#9C27B0] to-[#6A1B9A]', text: 'text-[#9C27B0]' },
    legendary: { bg: 'from-[#FFD700] to-[#FF9800]', text: 'text-[#FFD700]' },
    mythical: { bg: 'from-[#FF6B00] via-[#FF4081] to-[#7B1FA2]', text: 'text-[#FF4081]' },
};

export function AchievementToast({
    title,
    description,
    icon,
    rarity = 'common',
    xpReward,
    isVisible,
    onClose,
}: AchievementToastProps) {
    const colors = rarityColors[rarity];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md"
                >
                    <div className="relative overflow-hidden rounded-xl bg-[#1E1E1E] border border-white/10 shadow-2xl">
                        {/* Gradient Top Border */}
                        <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', colors.bg)} />

                        {/* Content */}
                        <div className="flex items-center gap-4 p-4">
                            {/* Icon */}
                            <div className={cn(
                                'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br',
                                colors.bg,
                                'shadow-lg'
                            )}>
                                {icon}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-ml-gold">
                                        🏆 Achievement Unlocked!
                                    </span>
                                </div>
                                <h4 className="font-bold text-white truncate">{title}</h4>
                                <p className="text-xs text-slate-400 truncate">{description}</p>
                            </div>

                            {/* XP Reward */}
                            {xpReward && (
                                <div className="flex-shrink-0 text-right">
                                    <div className="text-lg font-bold text-ml-gold">+{xpReward}</div>
                                    <div className="text-[10px] text-slate-500">XP</div>
                                </div>
                            )}
                        </div>

                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 1.5, repeat: 2 }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Leaderboard - Ranking display with ML-style tier indicators
 */
export interface LeaderboardEntry {
    rank: number;
    name: string;
    avatar?: string;
    score: number;
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'mythic';
    isCurrentUser?: boolean;
}

export interface LeaderboardProps {
    entries: LeaderboardEntry[];
    title?: string;
    maxDisplay?: number;
    className?: string;
}

const tierColors = {
    bronze: 'from-amber-700 to-amber-800',
    silver: 'from-slate-300 to-slate-400',
    gold: 'from-yellow-400 to-amber-500',
    platinum: 'from-cyan-300 to-cyan-500',
    diamond: 'from-blue-300 to-purple-400',
    mythic: 'from-pink-500 to-purple-600',
};

export function Leaderboard({
    entries,
    title = 'Leaderboard',
    maxDisplay = 10,
    className,
}: LeaderboardProps) {
    const displayEntries = entries.slice(0, maxDisplay);

    return (
        <div className={cn('bg-[#121212] rounded-xl border border-white/10 overflow-hidden', className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Trophy className="text-ml-gold w-5 h-5" />
                    {title}
                </h3>
                <span className="text-xs text-slate-500">{entries.length} peserta</span>
            </div>

            {/* Entries */}
            <div className="divide-y divide-white/5">
                {displayEntries.map((entry, index) => (
                    <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 transition-colors',
                            entry.isCurrentUser ? 'bg-brand-blue/10' : 'hover:bg-white/5'
                        )}
                    >
                        {/* Rank */}
                        <div className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                            entry.rank === 1 && 'bg-gradient-to-br from-ml-gold to-amber-600 text-black',
                            entry.rank === 2 && 'bg-gradient-to-br from-slate-300 to-slate-500 text-black',
                            entry.rank === 3 && 'bg-gradient-to-br from-amber-600 to-amber-800 text-white',
                            entry.rank > 3 && 'bg-white/10 text-slate-400'
                        )}>
                            {entry.rank}
                        </div>

                        {/* Avatar */}
                        <div className={cn(
                            'flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2',
                            entry.tier ? `bg-gradient-to-br ${tierColors[entry.tier]}` : 'border-white/10'
                        )}>
                            {entry.avatar ? (
                                <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/10 text-white font-bold">
                                    {entry.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                            <div className={cn(
                                'font-medium truncate',
                                entry.isCurrentUser ? 'text-brand-accent' : 'text-white'
                            )}>
                                {entry.name}
                                {entry.isCurrentUser && <span className="text-xs text-slate-500 ml-2">(Anda)</span>}
                            </div>
                            {entry.tier && (
                                <div className={cn('text-[10px] uppercase font-bold', `bg-gradient-to-r ${tierColors[entry.tier]} bg-clip-text text-transparent`)}>
                                    {entry.tier}
                                </div>
                            )}
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-right">
                            <div className="font-bold text-white">{entry.score.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500">poin</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/**
 * PeerActivity - Shows what peers are doing (Discord-style)
 */
export interface PeerActivityProps {
    peers: Array<{
        name: string;
        avatar?: string;
        activity: string;
        timestamp: string;
        online?: boolean;
    }>;
    className?: string;
}

export function PeerActivity({ peers, className }: PeerActivityProps) {
    return (
        <div className={cn('space-y-3', className)}>
            {peers.map((peer, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                    {/* Avatar with online indicator */}
                    <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10">
                            {peer.avatar ? (
                                <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                    {peer.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        {peer.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                            <span className="font-medium text-white text-sm">{peer.name}</span>
                            <span className="text-[10px] text-slate-500">{peer.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{peer.activity}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default XPLevelRing;
