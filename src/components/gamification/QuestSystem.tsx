'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * DailyQuests - Daily mission tracker with rewards
 */
export interface Quest {
    id: string;
    title: string;
    description: string;
    progress: number;
    maxProgress: number;
    xpReward: number;
    completed?: boolean;
    icon?: React.ReactNode;
    type: 'daily' | 'weekly' | 'special';
}

export interface DailyQuestsProps {
    quests: Quest[];
    onClaimReward?: (questId: string) => void;
    className?: string;
}

export function DailyQuests({ quests, onClaimReward, className }: DailyQuestsProps) {
    const dailyQuests = quests.filter(q => q.type === 'daily');
    const weeklyQuests = quests.filter(q => q.type === 'weekly');
    const specialQuests = quests.filter(q => q.type === 'special');

    return (
        <div className={cn('space-y-6', className)}>
            {/* Daily Quests */}
            {dailyQuests.length > 0 && (
                <QuestSection
                    title="Misi Harian"
                    icon="today"
                    quests={dailyQuests}
                    onClaimReward={onClaimReward}
                    accentColor="ml-cyan"
                />
            )}

            {/* Weekly Quests */}
            {weeklyQuests.length > 0 && (
                <QuestSection
                    title="Misi Mingguan"
                    icon="date_range"
                    quests={weeklyQuests}
                    onClaimReward={onClaimReward}
                    accentColor="ml-gold"
                />
            )}

            {/* Special Quests */}
            {specialQuests.length > 0 && (
                <QuestSection
                    title="Misi Spesial"
                    icon="stars"
                    quests={specialQuests}
                    onClaimReward={onClaimReward}
                    accentColor="ml-pink"
                />
            )}
        </div>
    );
}

interface QuestSectionProps {
    title: string;
    icon: string;
    quests: Quest[];
    onClaimReward?: (questId: string) => void;
    accentColor: string;
}

function QuestSection({ title, icon, quests, onClaimReward, accentColor }: QuestSectionProps) {
    const completedCount = quests.filter(q => q.completed).length;

    return (
        <div className="bg-[#121212] rounded-xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className={cn('material-symbols-outlined', `text-${accentColor}`)}>{icon}</span>
                    <h3 className="font-bold text-white">{title}</h3>
                </div>
                <span className="text-xs text-slate-500">{completedCount}/{quests.length} selesai</span>
            </div>

            {/* Quest List */}
            <div className="divide-y divide-white/5">
                {quests.map((quest, index) => (
                    <QuestItem
                        key={quest.id}
                        quest={quest}
                        index={index}
                        onClaimReward={onClaimReward}
                    />
                ))}
            </div>
        </div>
    );
}

interface QuestItemProps {
    quest: Quest;
    index: number;
    onClaimReward?: (questId: string) => void;
}

function QuestItem({ quest, index, onClaimReward }: QuestItemProps) {
    const percentage = Math.min((quest.progress / quest.maxProgress) * 100, 100);
    const isClaimable = quest.progress >= quest.maxProgress && !quest.completed;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                'px-4 py-3 transition-colors',
                quest.completed ? 'bg-green-500/5' : 'hover:bg-white/5'
            )}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                    quest.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-slate-400'
                )}>
                    {quest.icon || <span className="material-symbols-outlined">task_alt</span>}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className={cn(
                            'font-medium truncate',
                            quest.completed ? 'text-green-400 line-through' : 'text-white'
                        )}>
                            {quest.title}
                        </h4>
                        {quest.completed && (
                            <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{quest.description}</p>

                    {/* Progress Bar */}
                    {!quest.completed && (
                        <div className="mt-2">
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-slate-500">{quest.progress}/{quest.maxProgress}</span>
                                <span className="text-ml-gold">+{quest.xpReward} XP</span>
                            </div>
                            <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                                <motion.div
                                    className={cn(
                                        'h-full rounded-full',
                                        isClaimable
                                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                                            : 'bg-gradient-to-r from-ml-cyan to-brand-blue'
                                    )}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Claim Button */}
                {isClaimable && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onClaimReward?.(quest.id)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-ml-gold to-amber-500 text-black text-xs font-bold"
                    >
                        Klaim
                    </motion.button>
                )}

                {/* Completed Badge */}
                {quest.completed && (
                    <div className="flex-shrink-0 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold">
                        Selesai
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/**
 * StreakIndicator - Shows daily login streak
 */
export interface StreakIndicatorProps {
    currentStreak: number;
    maxStreak: number;
    lastClaimDate?: string;
    rewards: Array<{
        day: number;
        reward: string;
        claimed: boolean;
    }>;
    className?: string;
}

export function StreakIndicator({ currentStreak, maxStreak, rewards, className }: StreakIndicatorProps) {
    return (
        <div className={cn('bg-[#121212] rounded-xl border border-white/10 p-4', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-ml-orange">local_fire_department</span>
                    <h3 className="font-bold text-white">Login Streak</h3>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-ml-orange/20">
                    <span className="text-ml-orange font-bold">{currentStreak}</span>
                    <span className="text-xs text-slate-400">hari</span>
                </div>
            </div>

            {/* Streak Days */}
            <div className="flex justify-between gap-1">
                {rewards.slice(0, 7).map((reward, i) => {
                    const isActive = i < currentStreak;
                    const isCurrent = i === currentStreak - 1;

                    return (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex-1 flex flex-col items-center gap-1"
                        >
                            <div className={cn(
                                'w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all',
                                isActive
                                    ? 'bg-gradient-to-br from-ml-orange to-amber-600 text-white shadow-lg shadow-ml-orange/30'
                                    : 'bg-white/5 text-slate-500',
                                isCurrent && 'ring-2 ring-ml-gold ring-offset-2 ring-offset-[#121212]'
                            )}>
                                {reward.claimed ? (
                                    <span className="material-symbols-outlined text-base">check</span>
                                ) : (
                                    reward.day
                                )}
                            </div>
                            <span className={cn(
                                'text-[9px]',
                                isActive ? 'text-ml-orange' : 'text-slate-600'
                            )}>
                                Day {reward.day}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Next Reward */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400">Reward berikutnya:</span>
                <span className="text-xs font-bold text-ml-gold">
                    {rewards[currentStreak]?.reward || 'Legendary Badge!'}
                </span>
            </div>
        </div>
    );
}

/**
 * LiveReactions - Quick reaction buttons for content
 */
export interface LiveReactionsProps {
    reactions: Array<{
        emoji: string;
        count: number;
        active?: boolean;
    }>;
    onReact?: (emoji: string) => void;
    className?: string;
}

export function LiveReactions({ reactions, onReact, className }: LiveReactionsProps) {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            {reactions.map((reaction, i) => (
                <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onReact?.(reaction.emoji)}
                    className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors',
                        reaction.active
                            ? 'bg-brand-blue/20 text-brand-accent border border-brand-blue/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    )}
                >
                    <span>{reaction.emoji}</span>
                    <span className="font-medium">{reaction.count}</span>
                </motion.button>
            ))}

            {/* Add Reaction Button */}
            <button className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                <span className="material-symbols-outlined text-sm">add_reaction</span>
            </button>
        </div>
    );
}

export default DailyQuests;
