"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-its-dark/80 backdrop-blur-lg">
            <div className="flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/20">
                        <span className="material-symbols-outlined text-white">analytics</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-heading tracking-tight text-white leading-none">PPSDM KMM</span>
                        <span className="text-[10px] uppercase tracking-widest text-its-gold font-bold">ITS Surabaya</span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#how-it-works">Metodologi</Link>
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#dimensions">9 Dimensi</Link>
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#demo">Mission Control</Link>
                    <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#faq">FAQ</Link>
                    <Link href="/auth/login">
                        <button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-blue/30 active:scale-95 hover:scale-105">
                            Mulai Sekarang
                        </button>
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5 active:scale-95 transition-transform"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="material-symbols-outlined text-white">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
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
                        <nav className="flex flex-col p-6 gap-6">
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-brand-accent transition-colors" href="#how-it-works">Metodologi</Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-brand-accent transition-colors" href="#dimensions">9 Dimensi</Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-brand-accent transition-colors" href="#demo">Mission Control</Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-white hover:text-brand-accent transition-colors" href="#faq">FAQ</Link>
                            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-brand-blue/30 active:scale-95">
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
