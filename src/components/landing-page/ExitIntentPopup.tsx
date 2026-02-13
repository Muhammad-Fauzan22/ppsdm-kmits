'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * ExitIntentPopup - Captures users about to leave with last-chance offer
 * Triggers when mouse moves toward browser close/back button
 */

interface ExitIntentPopupProps {
    /** Whether popup is enabled */
    enabled?: boolean;
    /** Delay before popup can show (ms) */
    delay?: number;
    /** Headline text */
    headline?: string;
    /** Subheadline text */
    subheadline?: string;
    /** CTA button text */
    ctaText?: string;
    /** CTA button link */
    ctaHref?: string;
    /** Special offer text */
    offer?: string;
    /** Cookie name to track if shown */
    cookieName?: string;
}

export function ExitIntentPopup({
    enabled = true,
    delay = 3000,
    headline = 'Tunggu! Jangan Lewatkan Ini',
    subheadline = 'Dapatkan panduan eksklusif untuk memaksimalkan potensimu di ITS',
    ctaText = 'Klaim Gratis Sekarang',
    ctaHref = '/auth/login',
    offer = 'BONUS: E-Book "9 Langkah Sukses Mahasiswa" senilai Rp 99.000',
    cookieName = 'ppsdm_exit_shown',
}: ExitIntentPopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [canShow, setCanShow] = useState(false);

    // Check if already shown from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const shown = localStorage.getItem(cookieName);
            if (shown) {
                setHasShown(true);
            }
        }
    }, [cookieName]);

    // Delay before popup can trigger
    useEffect(() => {
        if (!enabled) return;

        const timer = setTimeout(() => {
            setCanShow(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [enabled, delay]);

    // Exit intent detection
    const handleMouseLeave = useCallback((e: MouseEvent) => {
        if (!canShow || hasShown || !enabled) return;

        // Trigger when mouse moves to top of viewport (toward close button)
        if (e.clientY <= 5) {
            setIsVisible(true);
            setHasShown(true);
            localStorage.setItem(cookieName, 'true');
        }
    }, [canShow, hasShown, enabled, cookieName]);

    useEffect(() => {
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [handleMouseLeave]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!enabled) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal-backdrop"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-0 z-modal flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-lg bg-gradient-to-br from-[#1A1F2E] to-[#0D1220] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                            {/* Gradient border effect */}
                            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#FFD700] via-[#FF6B00] to-[#FF4081] opacity-50 -z-10" />

                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 z-10"
                                aria-label="Close popup"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Content */}
                            <div className="p-8 text-center">
                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF6B00] flex items-center justify-center">
                                    <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>

                                {/* Headline */}
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                    {headline}
                                </h2>

                                {/* Subheadline */}
                                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                                    {subheadline}
                                </p>

                                {/* Offer badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B00]/20 border border-[#FFD700]/30 mb-6">
                                    <span className="text-[#FFD700] text-sm font-semibold">🎁 {offer}</span>
                                </div>

                                {/* CTA Button */}
                                <div className="space-y-4">
                                    <Link
                                        href={ctaHref}
                                        className="block w-full py-4 px-8 bg-gradient-to-r from-[#FF6B00] to-[#FF4081] text-white font-bold rounded-xl text-lg hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all hover:scale-[1.02]"
                                        onClick={handleClose}
                                    >
                                        {ctaText}
                                    </Link>

                                    <button
                                        onClick={handleClose}
                                        className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                                    >
                                        Tidak, saya tidak tertarik dengan sukses
                                    </button>
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
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
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ExitIntentPopup;
