'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * QuickAccessChannel - Discord-style channel shortcuts
 */
export interface Channel {
    id: string;
    name: string;
    icon: string;
    href: string;
    unread?: number;
    active?: boolean;
    description?: string;
}

export interface QuickAccessChannelsProps {
    channels: Channel[];
    title?: string;
    onChannelClick?: (channel: Channel) => void;
    className?: string;
}

export function QuickAccessChannels({
    channels,
    title = 'Quick Access',
    onChannelClick,
    className,
}: QuickAccessChannelsProps) {
    return (
        <div className={cn('bg-[#121212] rounded-xl border border-white/10 overflow-hidden', className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {title}
                </span>
                <button className="p-1 rounded hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-slate-500 text-sm">add</span>
                </button>
            </div>

            {/* Channels List */}
            <div className="py-1">
                {channels.map((channel) => (
                    <motion.button
                        key={channel.id}
                        onClick={() => onChannelClick?.(channel)}
                        whileHover={{ x: 4 }}
                        className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                            channel.active
                                ? 'bg-brand-blue/10 text-white'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        )}
                    >
                        {/* Channel Icon */}
                        <span className={cn(
                            'material-symbols-outlined text-lg',
                            channel.active ? 'text-brand-accent' : 'text-slate-500'
                        )}>
                            {channel.icon}
                        </span>

                        {/* Channel Name */}
                        <span className="flex-1 text-sm font-medium truncate">
                            {channel.name}
                        </span>

                        {/* Unread Badge */}
                        {channel.unread && channel.unread > 0 && (
                            <span className="flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                                {channel.unread > 99 ? '99+' : channel.unread}
                            </span>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

/**
 * GuildCard - Group/guild preview card
 */
export interface GuildCardProps {
    name: string;
    description?: string;
    memberCount: number;
    onlineCount?: number;
    banner?: string;
    icon?: string;
    tags?: string[];
    isJoined?: boolean;
    onJoin?: () => void;
    onView?: () => void;
    className?: string;
}

export function GuildCard({
    name,
    description,
    memberCount,
    onlineCount,
    banner,
    icon,
    tags,
    isJoined = false,
    onJoin,
    onView,
    className,
}: GuildCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                'bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden cursor-pointer group',
                className
            )}
            onClick={onView}
        >
            {/* Banner */}
            <div
                className="h-24 bg-gradient-to-br from-brand-blue/30 to-ml-cyan/30 relative"
                style={banner ? { backgroundImage: `url(${banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                {/* Icon */}
                <div className="absolute -bottom-6 left-4">
                    <div className="w-14 h-14 rounded-xl bg-[#2D2D2D] border-4 border-[#1E1E1E] flex items-center justify-center overflow-hidden">
                        {icon ? (
                            <img src={icon} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-white">{name.charAt(0)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-8 pb-4 px-4">
                <h4 className="font-bold text-white truncate">{name}</h4>
                {description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{description}</p>
                )}

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span>{onlineCount?.toLocaleString() || 0} online</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">group</span>
                        <span>{memberCount.toLocaleString()} anggota</span>
                    </div>
                </div>

                {/* Action Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onJoin?.();
                    }}
                    className={cn(
                        'w-full mt-3 py-2 rounded-lg font-semibold text-sm transition-colors',
                        isJoined
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-brand-blue text-white hover:bg-brand-blue/80'
                    )}
                >
                    {isJoined ? 'Joined ✓' : 'Gabung'}
                </motion.button>
            </div>
        </motion.div>
    );
}

/**
 * SmartRecommendations - AI-powered content recommendations
 */
export interface Recommendation {
    id: string;
    title: string;
    description: string;
    type: 'assessment' | 'course' | 'article' | 'quest';
    matchScore: number;
    icon: string;
    href: string;
}

export interface SmartRecommendationsProps {
    recommendations: Recommendation[];
    title?: string;
    onSelect?: (rec: Recommendation) => void;
    className?: string;
}

export function SmartRecommendations({
    recommendations,
    title = 'Recommended for You',
    onSelect,
    className,
}: SmartRecommendationsProps) {
    const typeColors = {
        assessment: 'from-purple-500 to-indigo-600',
        course: 'from-blue-500 to-cyan-500',
        article: 'from-amber-500 to-orange-500',
        quest: 'from-pink-500 to-rose-500',
    };

    return (
        <div className={cn('space-y-3', className)}>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-ml-gold">auto_awesome</span>
                {title}
            </h3>

            <div className="space-y-2">
                {recommendations.map((rec, index) => (
                    <motion.button
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect?.(rec)}
                        className="w-full flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                    >
                        {/* Icon */}
                        <div className={cn(
                            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br',
                            typeColors[rec.type]
                        )}>
                            <span className="material-symbols-outlined text-white">{rec.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white text-sm truncate group-hover:text-brand-accent transition-colors">
                                    {rec.title}
                                </h4>
                                <span className={cn(
                                    'flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                                    typeColors[rec.type].includes('purple') && 'bg-purple-500/20 text-purple-400',
                                    typeColors[rec.type].includes('blue') && 'bg-blue-500/20 text-blue-400',
                                    typeColors[rec.type].includes('amber') && 'bg-amber-500/20 text-amber-400',
                                    typeColors[rec.type].includes('pink') && 'bg-pink-500/20 text-pink-400',
                                )}>
                                    {rec.type}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{rec.description}</p>
                        </div>

                        {/* Match Score */}
                        <div className="flex-shrink-0 text-right">
                            <div className="text-sm font-bold text-ml-gold">{rec.matchScore}%</div>
                            <div className="text-[9px] text-slate-600">match</div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

/**
 * DensityControl - Toggle between information density modes
 */
export interface DensityControlProps {
    currentDensity: 'compact' | 'normal' | 'relaxed';
    onChange: (density: 'compact' | 'normal' | 'relaxed') => void;
    className?: string;
}

export function DensityControl({ currentDensity, onChange, className }: DensityControlProps) {
    const densities = [
        { value: 'compact' as const, icon: 'density_small', label: 'Compact' },
        { value: 'normal' as const, icon: 'density_medium', label: 'Normal' },
        { value: 'relaxed' as const, icon: 'density_large', label: 'Relaxed' },
    ];

    return (
        <div className={cn('flex items-center gap-1 p-1 bg-white/5 rounded-lg', className)}>
            {densities.map((d) => (
                <button
                    key={d.value}
                    onClick={() => onChange(d.value)}
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                        currentDensity === d.value
                            ? 'bg-brand-blue text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                    title={d.label}
                >
                    <span className="material-symbols-outlined text-base">{d.icon}</span>
                    <span className="hidden sm:inline">{d.label}</span>
                </button>
            ))}
        </div>
    );
}

export default QuickAccessChannels;
