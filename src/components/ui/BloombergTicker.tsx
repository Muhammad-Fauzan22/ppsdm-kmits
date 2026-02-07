'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * BloombergTicker - Real-time scrolling stats ticker (Bloomberg Terminal style)
 * Features configurable speed, pause-on-hover, and priority levels
 */

export type TickerPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TickerItem {
    id: string;
    label: string;
    value: string | number;
    change?: string;
    changeDirection?: 'up' | 'down' | 'neutral';
    priority?: TickerPriority;
}

interface BloombergTickerProps {
    items: TickerItem[];
    speed?: 'slow' | 'normal' | 'fast';
    pauseOnHover?: boolean;
    className?: string;
}

const speedClasses = {
    slow: 'animate-[ticker-scroll_60s_linear_infinite]',
    normal: 'animate-[ticker-scroll_30s_linear_infinite]',
    fast: 'animate-[ticker-scroll_15s_linear_infinite]',
};

const priorityClasses: Record<TickerPriority, string> = {
    critical: 'text-[#FF4444]',
    high: 'text-[#FF9800]',
    medium: 'text-[#00BCD4]',
    low: 'text-[#A0A0A0]',
};

const changeColors = {
    up: 'text-[#4CAF50]',
    down: 'text-[#F44336]',
    neutral: 'text-[#A0A0A0]',
};

export function BloombergTicker({
    items,
    speed = 'normal',
    pauseOnHover = true,
    className,
}: BloombergTickerProps) {
    // Duplicate items to create seamless loop
    const duplicatedItems = [...items, ...items];

    return (
        <div
            className={cn(
                'bloomberg-ticker w-full bg-[#121212] border-y border-white/10 overflow-hidden',
                className
            )}
        >
            <div
                className={cn(
                    'flex items-center whitespace-nowrap',
                    speedClasses[speed],
                    pauseOnHover && 'hover:animation-play-state-paused'
                )}
                style={{ ['--ticker-speed' as string]: speed === 'slow' ? '60s' : speed === 'fast' ? '15s' : '30s' }}
            >
                {duplicatedItems.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className={cn(
                            'inline-flex items-center gap-2 px-6 py-2 font-mono text-xs',
                            priorityClasses[item.priority || 'low']
                        )}
                    >
                        <span className="text-white/60">{item.label}</span>
                        <span className="font-semibold">{item.value}</span>
                        {item.change && (
                            <span className={cn('text-xs', changeColors[item.changeDirection || 'neutral'])}>
                                {item.changeDirection === 'up' && '▲'}
                                {item.changeDirection === 'down' && '▼'}
                                {item.change}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * BloombergTickerCompact - Smaller version for dashboard headers
 */
export function BloombergTickerCompact({
    items,
    className,
}: {
    items: TickerItem[];
    className?: string;
}) {
    return (
        <BloombergTicker
            items={items}
            speed="fast"
            className={cn('h-6 text-[10px]', className)}
        />
    );
}

/**
 * Example usage data
 */
export const exampleTickerItems: TickerItem[] = [
    { id: '1', label: 'XP Today', value: '+150', priority: 'high', change: '+12%', changeDirection: 'up' },
    { id: '2', label: 'Assessments', value: '3/9', priority: 'medium' },
    { id: '3', label: 'Rank', value: '#42', priority: 'low', change: '+5', changeDirection: 'up' },
    { id: '4', label: 'Streak', value: '7 days', priority: 'high' },
    { id: '5', label: 'Level', value: 'Lv.12', priority: 'critical' },
    { id: '6', label: 'Quests', value: '2 Active', priority: 'medium' },
];

export default BloombergTicker;
