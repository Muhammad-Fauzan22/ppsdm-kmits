"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_CONFIG } from '@/config/nav';
import Image from 'next/image';
import SmartBreadcrumbs from '@/components/SmartBreadcrumbs';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-background-dark text-slate-900 dark:text-white flex overflow-hidden font-display">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-20 h-screen sticky top-0">
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-its-light to-its-blue flex items-center justify-center text-white shadow-lg shadow-its-blue/20">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg font-serif tracking-tight">PPSDM KMM</h1>
                            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Student Portal</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {NAV_CONFIG.student.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive(item.href)
                                ? 'bg-its-light/10 text-its-light dark:bg-its-light/20 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive(item.href) ? 'filled' : ''}`}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer (Profile) */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <div className="relative size-10 rounded-full bg-slate-200 overflow-hidden">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwOG01rGZ8dWHJCxFu4b3WFtbxkNOnWbGHWHOattOoqx1zuyvYKsWUSUZI9r_PlTIghZeNLomj_c3IbFFjj1oDJdZcz_oHZItTgXeLTpydo22GzSHU-hAEa-PfT3vIEOb79kEAo0jH3187Kh6-ExqnA7ne0j5MckLw4n19nzn7SIGietx1dLYV0f8pG-bFPPhwUQv2bEDFHjSdnIfchr5Bgg4LsALtOhA5X--U7xjB0dKJ5iqNfitfj38z_FAKlMEiGbnSL01tF5k"
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">Ahmad Fauzan</p>
                            <p className="text-xs text-slate-500 truncate">S1 Informatika</p>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 w-full bg-white dark:bg-card-dark border-b border-slate-200 dark:border-slate-800 z-30 px-4 py-3 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-its-light flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-lg">school</span>
                    </div>
                    <span className="font-bold">PPSDM</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-card-dark shadow-xl p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-lg">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="space-y-1">
                            {NAV_CONFIG.student.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Scrollable Area */}
            <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden pt-14 lg:pt-0">
                <div className="min-h-full p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
                    <SmartBreadcrumbs />
                    {children}
                </div>
            </main>
        </div>
    );
}
