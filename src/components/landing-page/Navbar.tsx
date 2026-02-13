"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Menu, X, Search, Bell, User, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasNotifications, setHasNotifications] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-its-dark/80 backdrop-blur-lg">
            <div className="flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/20">
                        <BarChart2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-heading tracking-tight text-white leading-none">PPSDM KMM</span>
                        <span className="text-[10px] uppercase tracking-widest text-its-gold font-bold">ITS Surabaya</span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#how-it-works">Metodologi</Link>
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#dimensions">9 Dimensi</Link>
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="/campus">Campus Hub</Link>
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#demo">Mission Control</Link>
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#faq">FAQ</Link>
                </nav>

                {/* Actions - Desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Netflix-style Expandable Search */}
                    <div className="relative flex items-center">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 240, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as any }}
                                    className="overflow-hidden"
                                >
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Cari dimensi, materi..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 px-4 pr-10 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 transition-all"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                            aria-label="Toggle search"
                        >
                            <Search className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Notification Bell */}
                    <button
                        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
                        {hasNotifications && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-its-dark"
                            />
                        )}
                    </button>

                    {/* CTA Button with Sparkle Effect */}
                    <Link href="/try-assessment">
                        <motion.button
                            className="relative overflow-hidden bg-gradient-to-r from-brand-blue to-ml-cyan text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-blue/30 group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Mulai Sekarang
                            </span>
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                                animate={{ translateX: ['−100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            />
                        </motion.button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5 active:scale-95 transition-transform"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-its-dark/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        {/* Mobile Search */}
                        <div className="px-6 pt-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari dimensi, materi..."
                                    className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-base text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-accent transition-all"
                                />
                            </div>
                        </div>

                        <nav className="flex flex-col p-6 gap-4">
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-white hover:text-brand-accent transition-colors py-2" href="#how-it-works">
                                <span className="material-symbols-outlined text-brand-accent">science</span>
                                Metodologi
                            </Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-white hover:text-brand-accent transition-colors py-2" href="#dimensions">
                                <span className="material-symbols-outlined text-brand-accent">grid_view</span>
                                9 Dimensi
                            </Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-white hover:text-brand-accent transition-colors py-2" href="/campus">
                                <span className="material-symbols-outlined text-brand-accent">school</span>
                                Campus Hub
                            </Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-white hover:text-brand-accent transition-colors py-2" href="#demo">
                                <span className="material-symbols-outlined text-brand-accent">rocket_launch</span>
                                Mission Control
                            </Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-white hover:text-brand-accent transition-colors py-2" href="#faq">
                                <span className="material-symbols-outlined text-brand-accent">help</span>
                                FAQ
                            </Link>

                            {/* Divider */}
                            <div className="h-px bg-white/10 my-2" />

                            {/* Mobile CTA */}
                            <Link href="/try-assessment" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="w-full bg-gradient-to-r from-brand-blue to-ml-cyan text-white px-6 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-brand-blue/30 active:scale-95 flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Mulai Sekarang
                                </button>
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
