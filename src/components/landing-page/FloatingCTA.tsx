'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
                >
                    {/* Tooltip bubble */}
                    <div className="bg-white text-slate-900 px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold mb-1 relative animate-bounce">
                        Gratis untuk Mahasiswa ITS!
                        <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-white" />
                    </div>

                    <Link href="/try-assessment">
                        <button className="group flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-full font-bold shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95">
                            <Sparkles className="w-5 h-5 fill-white" />
                            <span>Mulai Asesmen</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
