'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * ConfettiParticles - Celebration effect for achievements
 */
interface Particle {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    scale: number;
}

export interface ConfettiParticlesProps {
    isActive: boolean;
    duration?: number;
    particleCount?: number;
    colors?: string[];
}

const defaultColors = ['#FFD700', '#FF4081', '#00BCD4', '#4CAF50', '#9C27B0', '#FF9800'];

export function ConfettiParticles({
    isActive,
    duration = 3000,
    particleCount = 50,
    colors = defaultColors,
}: ConfettiParticlesProps) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (isActive) {
            const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                scale: 0.5 + Math.random() * 0.5,
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => setParticles([]), duration);
            return () => clearTimeout(timer);
        }
    }, [isActive, particleCount, colors, duration]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            x: `${particle.x}vw`,
                            y: `${particle.y}vh`,
                            rotate: particle.rotation,
                            scale: particle.scale,
                        }}
                        animate={{
                            y: '110vh',
                            rotate: particle.rotation + 720,
                            x: `${particle.x + (Math.random() - 0.5) * 30}vw`,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            ease: 'linear',
                        }}
                        className="absolute w-3 h-3"
                        style={{ backgroundColor: particle.color }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

/**
 * XPGainAnimation - Floating XP number when gaining experience
 */
export interface XPGainAnimationProps {
    amount: number;
    isVisible: boolean;
    position?: { x: number; y: number };
    onComplete?: () => void;
}

export function XPGainAnimation({
    amount,
    isVisible,
    position = { x: 50, y: 50 },
    onComplete,
}: XPGainAnimationProps) {
    useEffect(() => {
        if (isVisible && onComplete) {
            const timer = setTimeout(onComplete, 1500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -50, scale: 1 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="fixed pointer-events-none z-[250]"
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                    <div className="text-2xl font-bold text-ml-gold drop-shadow-lg">
                        +{amount} XP
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * LevelUpAnimation - Full-screen celebration for level ups
 */
export interface LevelUpAnimationProps {
    newLevel: number;
    isVisible: boolean;
    onComplete?: () => void;
}

export function LevelUpAnimation({
    newLevel,
    isVisible,
    onComplete,
}: LevelUpAnimationProps) {
    useEffect(() => {
        if (isVisible && onComplete) {
            const timer = setTimeout(onComplete, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                    {/* Background Glow */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 3, opacity: 0.3 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-ml-gold to-ml-orange blur-3xl"
                    />

                    {/* Level Badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.3 }}
                        className="relative"
                    >
                        {/* Ring Effect */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1, repeat: 3, delay: 0.5 }}
                            className="absolute inset-0 rounded-full border-4 border-ml-gold"
                        />

                        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-ml-gold to-ml-orange flex items-center justify-center shadow-2xl shadow-ml-gold/50">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="text-6xl font-bold text-black"
                            >
                                {newLevel}
                            </motion.span>
                        </div>
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-1/3 text-center"
                    >
                        <div className="text-sm uppercase tracking-[0.3em] text-ml-gold mb-2">
                            LEVEL UP!
                        </div>
                        <div className="text-3xl font-bold text-white">
                            Selamat! Anda mencapai Level {newLevel}
                        </div>
                    </motion.div>

                    {/* Confetti */}
                    <ConfettiParticles isActive={isVisible} particleCount={100} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * GlowPulse - Animated glow effect for highlighting elements
 */
export interface GlowPulseProps {
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    intensity?: 'low' | 'medium' | 'high';
    className?: string;
    children: React.ReactNode;
}

export function GlowPulse({
    color = '#FFD700',
    size = 'md',
    intensity = 'medium',
    className,
    children,
}: GlowPulseProps) {
    const sizeClasses = {
        sm: 'blur-md',
        md: 'blur-lg',
        lg: 'blur-xl',
    };

    const intensityOpacity = {
        low: '0.2',
        medium: '0.4',
        high: '0.6',
    };

    return (
        <div className={cn('relative inline-block', className)}>
            <motion.div
                className={cn('absolute inset-0 rounded-full', sizeClasses[size])}
                style={{ backgroundColor: color, opacity: intensityOpacity[intensity] }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [
                        parseFloat(intensityOpacity[intensity]),
                        parseFloat(intensityOpacity[intensity]) * 1.5,
                        parseFloat(intensityOpacity[intensity]),
                    ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}

/**
 * ShimmerEffect - Shimmer loading/highlight effect
 */
export interface ShimmerEffectProps {
    className?: string;
    children?: React.ReactNode;
}

export function ShimmerEffect({ className, children }: ShimmerEffectProps) {
    return (
        <div className={cn('relative overflow-hidden', className)}>
            {children}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ translateX: ['−100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
        </div>
    );
}

export default ConfettiParticles;
