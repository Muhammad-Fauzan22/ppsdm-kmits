import React from 'react';
import type { Metadata } from 'next';
import KnowledgeGrid from '@/components/knowledge/KnowledgeGrid';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Knowledge Hub Keteknikan',
    description: 'Pusat pengetahuan teknik interaktif — rumus, material, manufaktur, mekatronika, dan teknologi terbaru. Belajar teknik jadi menyenangkan!',
};

export default function KnowledgePage() {
    return (
        <div className="min-h-screen bg-[#0A0F1A] text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0A0F1A]/80 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="text-slate-400 hover:text-white transition p-1"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                                Knowledge Hub Keteknikan
                            </h1>
                            <p className="text-xs text-slate-500">Pusat Pengetahuan Teknik Interaktif</p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700 transition"
                    >
                        ← Beranda
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="text-5xl mb-4">🔬</div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                            Eksplorasi Dunia Teknik
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Temukan rumus, material, proses manufaktur, dan teknologi terbaru.
                        Setiap artikel diperkaya dengan <strong className="text-blue-300">tooltip definisi</strong>,{' '}
                        <strong className="text-violet-300">kuis interaktif</strong>, dan{' '}
                        <strong className="text-cyan-300">statistik visual</strong>.
                    </p>

                    {/* Quick stats */}
                    <div className="flex justify-center gap-6 mt-8">
                        {[
                            { icon: '📐', label: 'Rumus', desc: 'Teknik' },
                            { icon: '🔩', label: 'Material', desc: 'Properties' },
                            { icon: '🏭', label: 'Proses', desc: 'Manufaktur' },
                            { icon: '🧠', label: 'Kuis', desc: 'Interaktif' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <span className="text-2xl block mb-1">{stat.icon}</span>
                                <div className="text-xs font-semibold text-white">{stat.label}</div>
                                <div className="text-[10px] text-slate-500">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <KnowledgeGrid />
            </main>
        </div>
    );
}
