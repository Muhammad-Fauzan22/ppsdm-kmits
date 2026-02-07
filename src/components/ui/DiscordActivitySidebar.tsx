'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Brain, Heart, Users, Target, Briefcase,
    Sprout, BookOpen, PiggyBank, Zap, TrendingUp,
    Activity, Crown
} from 'lucide-react';

/**
 * DiscordActivitySidebar - Discord-style activity indicators with 9 dimensions as "servers"
 */

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface DimensionServer {
    id: string;
    name: string;
    shortName: string;
    icon: React.ReactNode;
    color: string;
    progress: number;
    hasUnread?: boolean;
    notifications?: number;
}

export interface OnlinePeer {
    id: string;
    name: string;
    avatar: string;
    status: UserStatus;
    activity?: string;
}

export interface TrendingItem {
    id: string;
    title: string;
    type: 'assessment' | 'course' | 'achievement';
    participants: number;
}

interface DiscordActivitySidebarProps {
    dimensions: DimensionServer[];
    onlinePeers: OnlinePeer[];
    trendingItems: TrendingItem[];
    onDimensionClick?: (id: string) => void;
    className?: string;
}

const statusColors: Record<UserStatus, string> = {
    online: 'bg-[#43B581]',
    idle: 'bg-[#FAA61A]',
    dnd: 'bg-[#F04747]',
    offline: 'bg-[#747F8D]',
};

// Default 9 dimensions
export const defaultDimensions: DimensionServer[] = [
    { id: 'cognitive', name: 'Cognitive & Intellectual', shortName: 'COG', icon: <Brain className="w-5 h-5" />, color: '#3B82F6', progress: 0 },
    { id: 'emotional', name: 'Emotional Intelligence', shortName: 'EMO', icon: <Heart className="w-5 h-5" />, color: '#F59E0B', progress: 0 },
    { id: 'physical', name: 'Physical Health', shortName: 'PHY', icon: <Zap className="w-5 h-5" />, color: '#10B981', progress: 0 },
    { id: 'mental', name: 'Mental Wellness', shortName: 'MEN', icon: <Activity className="w-5 h-5" />, color: '#8B5CF6', progress: 0 },
    { id: 'character', name: 'Character & Ethics', shortName: 'CHR', icon: <Crown className="w-5 h-5" />, color: '#EC4899', progress: 0 },
    { id: 'financial', name: 'Financial Literacy', shortName: 'FIN', icon: <PiggyBank className="w-5 h-5" />, color: '#22C55E', progress: 0 },
    { id: 'career', name: 'Career Readiness', shortName: 'CAR', icon: <Briefcase className="w-5 h-5" />, color: '#6366F1', progress: 0 },
    { id: 'social', name: 'Social Skills', shortName: 'SOC', icon: <Users className="w-5 h-5" />, color: '#F97316', progress: 0 },
    { id: 'spiritual', name: 'Spiritual Growth', shortName: 'SPR', icon: <Sprout className="w-5 h-5" />, color: '#06B6D4', progress: 0 },
];

export function DiscordActivitySidebar({
    dimensions = defaultDimensions,
    onlinePeers = [],
    trendingItems = [],
    onDimensionClick,
    className,
}: DiscordActivitySidebarProps) {
    return (
        <div
            className={cn(
                'flex flex-col w-72 h-full bg-[#1E1E1E] border-l border-white/10',
                className
            )}
        >
            {/* Dimension Servers */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2 mb-3">
                    9 Dimensions
                </h3>

                {dimensions.map((dim) => (
                    <motion.button
                        key={dim.id}
                        onClick={() => onDimensionClick?.(dim.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group relative"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Server Icon */}
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:rounded-2xl"
                            style={{ backgroundColor: `${dim.color}20`, color: dim.color }}
                        >
                            {dim.icon}
                        </div>

                        {/* Server Info */}
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-white/90 truncate">
                                {dim.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${dim.progress}%`,
                                            backgroundColor: dim.color
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] text-white/40">{dim.progress}%</span>
                            </div>
                        </div>

                        {/* Unread Indicator */}
                        {dim.hasUnread && (
                            <span className="unread-indicator absolute right-2 top-2" />
                        )}

                        {/* Notification Badge */}
                        {dim.notifications && dim.notifications > 0 && (
                            <span className="notification-badge text-[10px]">
                                {dim.notifications > 99 ? '99+' : dim.notifications}
                            </span>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Online Peers Section */}
            <div className="border-t border-white/10 p-3">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Online — {onlinePeers.filter(p => p.status === 'online').length}
                    </h3>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {onlinePeers.slice(0, 5).map((peer) => (
                        <div key={peer.id} className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                                    {peer.avatar}
                                </div>
                                <span
                                    className={cn(
                                        'status-dot absolute -bottom-0.5 -right-0.5',
                                        statusColors[peer.status]
                                    )}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-white/80 truncate">{peer.name}</div>
                                {peer.activity && (
                                    <div className="text-[10px] text-white/40 truncate">{peer.activity}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Section */}
            <div className="border-t border-white/10 p-3">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Trending Now
                    </h3>
                </div>

                <div className="space-y-2">
                    {trendingItems.slice(0, 3).map((item) => (
                        <div
                            key={item.id}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                        >
                            <div className="text-xs text-white/80 truncate">{item.title}</div>
                            <div className="text-[10px] text-white/40">
                                {item.participants} participants
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DiscordActivitySidebar;
