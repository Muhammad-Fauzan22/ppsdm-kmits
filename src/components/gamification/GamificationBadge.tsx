'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * GamificationBadge - Mobile Legends inspired achievement badge
 * with rarity effects and animations
 */

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';
export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GamificationBadgeProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    rarity?: BadgeRarity;
    size?: BadgeSize;
    unlocked?: boolean;
    progress?: number; // 0-100, for locked badges showing progress
    showTooltip?: boolean;
    className?: string;
    onClick?: () => void;
}

const sizeClasses: Record<BadgeSize, { wrapper: string; icon: string; ring: string }> = {
    sm: { wrapper: 'w-10 h-10', icon: 'w-5 h-5', ring: 'w-12 h-12' },
    md: { wrapper: 'w-14 h-14', icon: 'w-7 h-7', ring: 'w-16 h-16' },
    lg: { wrapper: 'w-20 h-20', icon: 'w-10 h-10', ring: 'w-24 h-24' },
    xl: { wrapper: 'w-28 h-28', icon: 'w-14 h-14', ring: 'w-32 h-32' },
};

const rarityStyles: Record<BadgeRarity, { bg: string; glow: string; ring: string }> = {
    common: {
        bg: 'bg-gradient-to-br from-slate-500 to-slate-600',
        glow: '',
        ring: 'border-slate-400/30',
    },
    rare: {
        bg: 'bg-gradient-to-br from-[#4CAF50] to-[#2E7D32]',
        glow: 'shadow-[0_0_15px_rgba(76,175,80,0.5)]',
        ring: 'border-[#4CAF50]/50',
    },
    epic: {
        bg: 'bg-gradient-to-br from-[#9C27B0] to-[#6A1B9A]',
        glow: 'shadow-[0_0_20px_rgba(156,39,176,0.6)]',
        ring: 'border-[#9C27B0]/50',
    },
    legendary: {
        bg: 'bg-gradient-to-br from-[#FFD700] to-[#FF9800]',
        glow: 'shadow-[0_0_25px_rgba(255,152,0,0.7)]',
        ring: 'border-[#FF9800]/60',
    },
    mythical: {
        bg: 'bg-gradient-to-br from-[#FF6B00] via-[#FF4081] to-[#7B1FA2]',
        glow: 'shadow-[0_0_30px_rgba(255,64,129,0.8)]',
        ring: 'border-transparent',
    },
};

export function GamificationBadge({
    icon,
    title,
    description,
    rarity = 'common',
    size = 'md',
    unlocked = true,
    progress = 0,
    showTooltip = true,
    className,
    onClick,
}: GamificationBadgeProps) {
    const [isHovered, setIsHovered] = React.useState(false);
    const sizes = sizeClasses[size];
    const styles = rarityStyles[rarity];

    return (
        <div
            className={cn('relative inline-flex flex-col items-center gap-2', className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge Container */}
            <motion.div
                className={cn(
                    'relative cursor-pointer',
                    onClick && 'hover:scale-110 active:scale-95'
                )}
                whileHover={{ scale: unlocked ? 1.1 : 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
            >
                {/* Outer Glow Ring (for legendary/mythical) */}
                {unlocked && (rarity === 'legendary' || rarity === 'mythical') && (
                    <motion.div
                        className={cn(
                            'absolute inset-0 rounded-full',
                            sizes.ring,
                            '-translate-x-1 -translate-y-1',
                            rarity === 'mythical'
                                ? 'bg-gradient-to-r from-[#FF6B00] via-[#FF4081] to-[#7B1FA2]'
                                : 'bg-gradient-to-r from-[#FFD700] to-[#FF9800]',
                            'opacity-30 blur-md'
                        )}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}

                {/* Main Badge */}
                <div
                    className={cn(
                        'relative rounded-full flex items-center justify-center',
                        sizes.wrapper,
                        unlocked ? styles.bg : 'bg-slate-700',
                        unlocked && styles.glow,
                        'border-2',
                        unlocked ? styles.ring : 'border-slate-600/50',
                        !unlocked && 'grayscale opacity-50'
                    )}
                >
                    {/* Icon */}
                    <div className={cn(sizes.icon, 'text-white')}>
                        {icon}
                    </div>

                    {/* Progress Ring (for locked badges) */}
                    {!unlocked && progress > 0 && (
                        <svg
                            className="absolute inset-0 w-full h-full -rotate-90"
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-slate-600"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={`${progress * 2.83} 283`}
                                strokeLinecap="round"
                                className="text-[#00BCD4]"
                            />
                        </svg>
                    )}

                    {/* Shine Effect (for unlocked) */}
                    {unlocked && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{
                                opacity: [0, 0.5, 0],
                                rotate: [-45, 45, -45],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                        />
                    )}
                </div>

                {/* Lock Icon (for locked badges) */}
                {!unlocked && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-slate-400">lock</span>
                    </div>
                )}
            </motion.div>

            {/* Title (optional, shown below badge) */}
            {title && size !== 'sm' && (
                <span className={cn(
                    'text-center font-medium truncate max-w-[100px]',
                    size === 'xl' ? 'text-sm' : 'text-xs',
                    unlocked ? 'text-white' : 'text-slate-500'
                )}>
                    {title}
                </span>
            )}

            {/* Tooltip */}
            {showTooltip && isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 px-3 py-2 rounded-lg bg-[#1E1E1E] border border-white/10 shadow-xl z-50 min-w-[150px]"
                >
                    <div className="text-sm font-semibold text-white">{title}</div>
                    {description && (
                        <div className="text-xs text-slate-400 mt-1">{description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                            'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full',
                            rarity === 'common' && 'bg-slate-600 text-slate-300',
                            rarity === 'rare' && 'bg-[#4CAF50]/20 text-[#4CAF50]',
                            rarity === 'epic' && 'bg-[#9C27B0]/20 text-[#9C27B0]',
                            rarity === 'legendary' && 'bg-[#FF9800]/20 text-[#FF9800]',
                            rarity === 'mythical' && 'bg-gradient-to-r from-[#FF6B00]/20 to-[#FF4081]/20 text-[#FF4081]'
                        )}>
                            {rarity}
                        </span>
                        {!unlocked && (
                            <span className="text-[10px] text-slate-500">{progress}% complete</span>
                        )}
                    </div>
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E1E1E] border-r border-b border-white/10 rotate-45" />
                </motion.div>
            )}
        </div>
    );
}

/**
 * ProgressionIndicator - XP bar with level display
 */
export interface ProgressionIndicatorProps {
    currentXP: number;
    maxXP: number;
    level: number;
    title?: string;
    showDetails?: boolean;
    variant?: 'gold' | 'cyan' | 'purple';
    className?: string;
}

export function ProgressionIndicator({
    currentXP,
    maxXP,
    level,
    title = 'Level Progress',
    showDetails = true,
    variant = 'gold',
    className,
}: ProgressionIndicatorProps) {
    const percentage = Math.min((currentXP / maxXP) * 100, 100);

    const gradients = {
        gold: 'from-[#FFD700] to-[#FF9800]',
        cyan: 'from-[#00BCD4] to-[#4CAF50]',
        purple: 'from-[#9C27B0] to-[#FF4081]',
    };

    const glows = {
        gold: 'shadow-[0_0_10px_rgba(255,215,0,0.5)]',
        cyan: 'shadow-[0_0_10px_rgba(0,188,212,0.5)]',
        purple: 'shadow-[0_0_10px_rgba(156,39,176,0.5)]',
    };

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {/* Level Badge */}
            <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                'bg-gradient-to-br',
                gradients[variant],
                glows[variant],
                'text-[#0A0A0A] font-bold text-lg'
            )}>
                {level}
            </div>

            {/* Progress Section */}
            <div className="flex-1 min-w-0">
                {showDetails && (
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{title}</span>
                        <span className="text-white font-medium">
                            {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
                        </span>
                    </div>
                )}

                {/* XP Bar */}
                <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                    <motion.div
                        className={cn('h-full rounded-full bg-gradient-to-r', gradients[variant])}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as any }}
                    />
                </div>
            </div>
        </div>
    );
}

/**
 * QuestCard - Daily/Weekly quest display
 */
export interface QuestCardProps {
    title: string;
    description: string;
    reward: string;
    progress: number;
    maxProgress: number;
    completed?: boolean;
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function QuestCard({
    title,
    description,
    reward,
    progress,
    maxProgress,
    completed = false,
    icon,
    className,
    onClick,
}: QuestCardProps) {
    const percentage = Math.min((progress / maxProgress) * 100, 100);

    return (
        <motion.div
            className={cn(
                'relative p-4 rounded-xl border',
                completed
                    ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30'
                    : 'bg-[#121212] border-white/10',
                onClick && 'cursor-pointer',
                className
            )}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                {icon && (
                    <div className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                        completed ? 'bg-[#4CAF50]/20 text-[#4CAF50]' : 'bg-white/5 text-[#00BCD4]'
                    )}>
                        {icon}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className={cn(
                            'font-semibold truncate',
                            completed ? 'text-[#4CAF50]' : 'text-white'
                        )}>
                            {title}
                        </h4>
                        {completed && (
                            <span className="material-symbols-outlined text-[#4CAF50] text-lg">check_circle</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{description}</p>

                    {/* Progress Bar */}
                    {!completed && (
                        <div className="mt-2">
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-slate-500">{progress}/{maxProgress}</span>
                                <span className="text-[#FFD700]">{reward}</span>
                            </div>
                            <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#00BCD4] to-[#4CAF50]"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Completed Reward */}
                    {completed && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-[#FFD700]">
                            <span className="material-symbols-outlined text-sm">emoji_events</span>
                            <span>{reward} Claimed!</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default GamificationBadge;
