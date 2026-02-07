'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Home, Target, BookOpen, Trophy, User,
    Zap, MessageCircle
} from 'lucide-react';

/**
 * MobileBottomNav - Mobile Legends style bottom navigation bar
 * Features: Quick action buttons with glow effects, level progress indicator
 */

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface MobileBottomNavProps {
    activeTab?: string;
    level?: number;
    xpProgress?: number;
    className?: string;
}

const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'assessment', label: 'Assessment', href: '/dashboard/dimensions', icon: <Target className="w-5 h-5" /> },
    { id: 'learn', label: 'Learn', href: '/dashboard/courses', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'rewards', label: 'Rewards', href: '/dashboard/marketplace', icon: <Trophy className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> },
];

export function MobileBottomNav({
    activeTab = 'home',
    level = 1,
    xpProgress = 0,
    className,
}: MobileBottomNavProps) {
    const [showQuickActions, setShowQuickActions] = useState(false);

    return (
        <>
            {/* Quick Actions Overlay */}
            <AnimatePresence>
                {showQuickActions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setShowQuickActions(false)}
                    />
                )}
            </AnimatePresence>

            {/* Quick Actions FAB */}
            <AnimatePresence>
                {showQuickActions && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex gap-4 md:hidden"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF4081] flex items-center justify-center shadow-lg shadow-[#FF6B00]/30"
                        >
                            <Zap className="w-6 h-6 text-white" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#4CAF50] flex items-center justify-center shadow-lg shadow-[#00BCD4]/30"
                        >
                            <MessageCircle className="w-6 h-6 text-white" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Bottom Navigation */}
            <nav
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-50 md:hidden',
                    'bg-[#121212]/95 backdrop-blur-xl border-t border-white/10',
                    'safe-area-inset-bottom',
                    className
                )}
            >
                {/* XP Progress Bar */}
                <div className="h-1 bg-[#1E1E1E]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF6B00]"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item, index) => {
                        const isActive = activeTab === item.id;
                        const isCenter = index === Math.floor(navItems.length / 2);

                        // Center button is special (ML-style action button)
                        if (isCenter) {
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => setShowQuickActions(!showQuickActions)}
                                    whileTap={{ scale: 0.9 }}
                                    className={cn(
                                        'relative -mt-6 w-16 h-16 rounded-full',
                                        'bg-gradient-to-br from-[#7B1FA2] to-[#FF4081]',
                                        'flex items-center justify-center',
                                        'shadow-lg shadow-[#7B1FA2]/40',
                                        'border-4 border-[#121212]'
                                    )}
                                >
                                    {/* Level Badge */}
                                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center text-[10px] font-bold text-black">
                                        {level}
                                    </span>
                                    {item.icon}
                                </motion.button>
                            );
                        }

                        return (
                            <Link key={item.id} href={item.href}>
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={cn(
                                        'flex flex-col items-center justify-center py-2 px-4 rounded-xl',
                                        'transition-colors',
                                        isActive
                                            ? 'text-white'
                                            : 'text-white/40 hover:text-white/60'
                                    )}
                                >
                                    <motion.div
                                        animate={isActive ? { y: -2 - 2 } : { y: 0 }}
                                        className="relative"
                                    >
                                        {item.icon}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF6B00]"
                                            />
                                        )}
                                    </motion.div>
                                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

export default MobileBottomNav;
