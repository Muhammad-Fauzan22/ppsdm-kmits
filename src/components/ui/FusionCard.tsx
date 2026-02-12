'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * FusionCard - A card component with Netflix hover effects, 
 * Mobile Legends rarity borders, and configurable density
 */

export type CardDensity = 'ultra' | 'high' | 'medium' | 'low';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';

export interface FusionCardProps {
    children: React.ReactNode;
    className?: string;

    // Density modes (Bloomberg-inspired)
    density?: CardDensity;

    // Gamification (Mobile Legends-inspired)
    rarity?: CardRarity;
    showLevel?: boolean;
    level?: number;

    // Interactions (Netflix/Apple-inspired)
    hoverEffect?: 'lift' | 'glow' | 'scale' | 'reveal' | 'none';
    hoverPreview?: React.ReactNode;

    // Click handling
    onClick?: () => void;
    href?: string;

    // Styling
    variant?: 'default' | 'glass' | 'solid';
    noPadding?: boolean;
}

const densityClasses: Record<CardDensity, string> = {
    ultra: 'p-2 gap-1',
    high: 'p-3 gap-2',
    medium: 'p-4 gap-3',
    low: 'p-6 gap-4',
};

const rarityClasses: Record<CardRarity, string> = {
    common: 'border-[#A0A0A0]/30',
    rare: 'border-[#4CAF50]/50 shadow-[0_0_10px_rgba(76,175,80,0.2)]',
    epic: 'border-[#9C27B0]/50 shadow-[0_0_15px_rgba(156,39,176,0.3)]',
    legendary: 'border-[#FF9800]/60 shadow-[0_0_20px_rgba(255,152,0,0.4)] animate-pulse',
    mythical: 'border-transparent bg-gradient-to-r from-[#FF6B00] via-[#FF4081] to-[#7B1FA2] p-[2px]',
};

const variantClasses: Record<string, string> = {
    default: 'bg-[#121212] border border-white/10',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    solid: 'bg-[#1E1E1E] border border-white/5',
};

export function FusionCard({
    children,
    className,
    density = 'medium',
    rarity,
    showLevel = false,
    level,
    hoverEffect = 'lift',
    hoverPreview,
    onClick,
    href,
    variant = 'default',
    noPadding = false,
}: FusionCardProps) {
    // Motion variants for different hover effects
    const hoverVariants = {
        lift: {
            rest: { y: 0, scale: 1 },
            hover: { y: -4, scale: 1.02, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as any } },
        },
        glow: {
            rest: { boxShadow: '0 0 0 rgba(0, 188, 212, 0)' },
            hover: { boxShadow: '0 0 25px rgba(0, 188, 212, 0.5)', transition: { duration: 0.3 } },
        },
        scale: {
            rest: { scale: 1 },
            hover: { scale: 1.05, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as any } },
        },
        reveal: {
            rest: { opacity: 1 },
            hover: { opacity: 1, transition: { duration: 0.3 } },
        },
        none: {
            rest: {},
            hover: {},
        },
    };

    const cardContent = (
        <>
            {/* Level Badge */}
            {showLevel && level !== undefined && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF9800] text-[#0A0A0A] font-bold text-sm shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                        {level}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={cn(
                !noPadding && densityClasses[density],
                'flex flex-col h-full'
            )}>
                {children}
            </div>

            {/* Hover Preview Overlay (Netflix-style) */}
            {hoverPreview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-4 rounded-xl pointer-events-none"
                >
                    {hoverPreview}
                </motion.div>
            )}
        </>
    );

    // Wrapper for mythical rarity (gradient border effect)
    const mythicalWrapper = rarity === 'mythical' ? (
        <div className="rounded-xl bg-gradient-to-r from-[#FF6B00] via-[#FF4081] to-[#7B1FA2] p-[2px] animate-[mythical-glow_3s_ease-in-out_infinite]">
            <div className={cn(
                'rounded-[10px] bg-[#121212] h-full',
                !noPadding && densityClasses[density]
            )}>
                {children}
                {showLevel && level !== undefined && (
                    <div className="absolute -top-2 -right-2 z-10">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF9800] text-[#0A0A0A] font-bold text-sm shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                            {level}
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : null;

    const baseClasses = cn(
        'relative rounded-xl overflow-hidden',
        'transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]',
        rarity !== 'mythical' && variantClasses[variant],
        rarity && rarity !== 'mythical' && rarityClasses[rarity],
        onClick || href ? 'cursor-pointer' : '',
        className
    );

    // If mythical rarity, render special wrapper
    if (rarity === 'mythical') {
        const MythicalComponent = onClick || href ? motion.div : 'div';
        return (
            <MythicalComponent
                className={cn('relative rounded-xl', className)}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={hoverVariants[hoverEffect]}
                onClick={onClick}
            >
                {mythicalWrapper}
            </MythicalComponent>
        );
    }

    // Standard card with motion
    return (
        <motion.div
            className={baseClasses}
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={hoverVariants[hoverEffect]}
            onClick={onClick}
        >
            {cardContent}
        </motion.div>
    );
}

/**
 * FusionCardHeader - Header section for cards
 */
export function FusionCardHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            {children}
        </div>
    );
}

/**
 * FusionCardTitle - Title component with optional icon
 */
export function FusionCardTitle({
    children,
    icon,
    className,
}: {
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            {icon && (
                <span className="text-[#00BCD4]">{icon}</span>
            )}
            <h3 className="font-semibold text-white truncate">{children}</h3>
        </div>
    );
}

/**
 * FusionCardContent - Main content area
 */
export function FusionCardContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex-1', className)}>
            {children}
        </div>
    );
}

/**
 * FusionCardFooter - Footer with actions
 */
export function FusionCardFooter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-center gap-2 mt-auto pt-2 border-t border-white/5', className)}>
            {children}
        </div>
    );
}

/**
 * FusionCardStat - Bloomberg-style stat display
 */
export function FusionCardStat({
    label,
    value,
    trend,
    trendDirection,
    size = 'medium',
}: {
    label: string;
    value: string | number;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    size?: 'small' | 'medium' | 'large';
}) {
    const sizeClasses = {
        small: 'text-lg',
        medium: 'text-2xl',
        large: 'text-4xl',
    };

    const trendColors = {
        up: 'text-[#4CAF50]',
        down: 'text-[#F44336]',
        neutral: 'text-[#9E9E9E]',
    };

    return (
        <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className={cn('font-bold text-white', sizeClasses[size])}>{value}</span>
                {trend && trendDirection && (
                    <span className={cn('text-xs font-medium', trendColors[trendDirection])}>
                        {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→'} {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

/**
 * FusionCardProgress - XP/Progress bar
 */
export function FusionCardProgress({
    current,
    max,
    label,
    showPercentage = true,
    variant = 'gold',
}: {
    current: number;
    max: number;
    label?: string;
    showPercentage?: boolean;
    variant?: 'gold' | 'cyan' | 'purple';
}) {
    const percentage = Math.min((current / max) * 100, 100);

    const gradients = {
        gold: 'from-[#FFD700] to-[#FF9800]',
        cyan: 'from-[#00BCD4] to-[#4CAF50]',
        purple: 'from-[#9C27B0] to-[#FF4081]',
    };

    return (
        <div className="space-y-1">
            {(label || showPercentage) && (
                <div className="flex justify-between text-xs">
                    {label && <span className="text-slate-400">{label}</span>}
                    {showPercentage && (
                        <span className="text-slate-300 font-medium">{Math.round(percentage)}%</span>
                    )}
                </div>
            )}
            <div className="h-[6px] bg-[#1E1E1E] rounded-full overflow-hidden">
                <motion.div
                    className={cn('h-full rounded-full bg-gradient-to-r', gradients[variant])}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as any }}
                />
            </div>
        </div>
    );
}

export default FusionCard;
