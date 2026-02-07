'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Menu, X, Search, Bell, User, ChevronDown, Sparkles, Landmark, FlaskConical, ShieldCheck, Users } from 'lucide-react';

/**
 * TrustBadges - Verifiable trust indicators to reduce buyer anxiety
 * Displays institutional support, certifications, and security badges
 */

interface TrustBadge {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const defaultBadges: TrustBadge[] = [
    {
        id: 'its',
        name: 'ITS Official',
        description: 'Didukung Institut Teknologi Sepuluh Nopember',
        icon: <Landmark className="w-full h-full" />,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'research',
        name: 'Research-Based',
        description: 'Berbasis riset psikometri tervalidasi',
        icon: <FlaskConical className="w-full h-full" />,
        color: 'from-purple-500 to-pink-500',
    },
    {
        id: 'secure',
        name: 'Data Aman',
        description: 'Enkripsi end-to-end & GDPR compliant',
        icon: <ShieldCheck className="w-full h-full" />,
        color: 'from-green-500 to-emerald-500',
    },
    {
        id: 'users',
        name: '5,000+ Users',
        description: 'Dipercaya ribuan mahasiswa ITS',
        icon: <Users className="w-full h-full" />,
        color: 'from-amber-500 to-orange-500',
    },
];

interface TrustBadgesProps {
    /** Array of badges to display */
    badges?: TrustBadge[];
    /** Layout variant */
    variant?: 'horizontal' | 'vertical' | 'grid';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Show descriptions */
    showDescriptions?: boolean;
    /** Custom class */
    className?: string;
}

export function TrustBadges({
    badges = defaultBadges,
    variant = 'horizontal',
    size = 'md',
    showDescriptions = true,
    className = '',
}: TrustBadgesProps) {
    const containerClasses = {
        horizontal: 'flex flex-wrap items-center justify-center gap-4 sm:gap-6',
        vertical: 'flex flex-col items-start gap-3',
        grid: 'grid grid-cols-2 sm:grid-cols-4 gap-4',
    };

    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const iconSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    if (variant === 'horizontal') {
        return (
            <div className={`${containerClasses.horizontal} ${className}`}>
                {badges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                        <span className={iconSizes[size]}>{badge.icon}</span>
                        <span className={`${sizeClasses[size]} text-white/70 font-medium`}>
                            {badge.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        );
    }

    if (variant === 'vertical') {
        return (
            <div className={`${containerClasses.vertical} ${className}`}>
                {badges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                    >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${badge.color} bg-opacity-20 flex items-center justify-center`}>
                            <span className={iconSizes[size]}>{badge.icon}</span>
                        </div>
                        <div>
                            <p className={`${sizeClasses[size]} text-white font-medium`}>{badge.name}</p>
                            {showDescriptions && (
                                <p className="text-xs text-slate-500">{badge.description}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // Grid variant
    return (
        <div className={`${containerClasses.grid} ${className}`}>
            {badges.map((badge, index) => (
                <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-center"
                >
                    <span className={`${iconSizes[size]} block mb-2`}>{badge.icon}</span>
                    <p className={`${sizeClasses[size]} text-white font-medium mb-1`}>{badge.name}</p>
                    {showDescriptions && (
                        <p className="text-[10px] text-slate-500 leading-tight">{badge.description}</p>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

/**
 * Inline Trust Indicators - Compact version for CTAs
 */
export function InlineTrustIndicators({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 ${className}`}>
            <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                100% Gratis
            </span>
            <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tanpa Kartu Kredit
            </span>
            <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                Data Terenkripsi
            </span>
        </div>
    );
}

export default TrustBadges;
