'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * PageTransition - Smooth page transition wrapper
 * Apple-inspired fade and slide transitions
 */
export interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'none';
}

const variants = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    },
    slideLeft: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
    },
    none: {
        initial: {},
        animate: {},
        exit: {},
    },
};

export function PageTransition({
    children,
    className,
    variant = 'slideUp',
}: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={variants[variant].initial}
                animate={variants[variant].animate}
                exit={variants[variant].exit}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as any }}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * StaggerContainer - Stagger children animations
 */
export interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    initialDelay?: number;
}

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.1,
    initialDelay = 0,
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className={className}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: initialDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerItem - Child item for StaggerContainer
 */
export interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as any }}
        >
            {children}
        </motion.div>
    );
}

/**
 * HoverScale - Scale on hover with smooth transition
 */
export interface HoverScaleProps {
    children: React.ReactNode;
    className?: string;
    scale?: number;
    disabled?: boolean;
}

export function HoverScale({
    children,
    className,
    scale = 1.02,
    disabled = false,
}: HoverScaleProps) {
    if (disabled) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * FadeIn - Simple fade in animation
 */
export interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.4,
    direction = 'up',
}: FadeInProps) {
    const directionOffset = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
        none: {},
    };

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...directionOffset[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] as any }}
        >
            {children}
        </motion.div>
    );
}

/**
 * ParallaxScroll - Parallax effect on scroll
 */
export interface ParallaxScrollProps {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}

export function ParallaxScroll({
    children,
    className,
    speed = 0.5,
}: ParallaxScrollProps) {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            className={className}
            style={{ y: scrollY * speed }}
        >
            {children}
        </motion.div>
    );
}

/**
 * PresenceAnimation - Animate presence for conditional rendering
 */
export interface PresenceAnimationProps {
    children: React.ReactNode;
    isVisible: boolean;
    className?: string;
    variant?: 'fade' | 'scale' | 'slideUp';
}

export function PresenceAnimation({
    children,
    isVisible,
    className,
    variant = 'fade',
}: PresenceAnimationProps) {
    const animationVariants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        scale: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
        },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={className}
                    initial={animationVariants[variant].initial}
                    animate={animationVariants[variant].animate}
                    exit={animationVariants[variant].exit}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as any }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PageTransition;
