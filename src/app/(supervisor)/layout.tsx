"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_CONFIG } from '@/config/nav';
import Image from 'next/image';

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/supervisor') return pathname === '/supervisor';
        return pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white flex font-display">
            {/* Minimal Sidebar for Supervisor */}
            <aside className="hidden lg:flex flex-col w-20 hover:w-64 transition-all duration-300 bg-slate-900 text-white z-20 h-screen sticky top-0 group overflow-hidden">
                <div className="p-4 flex items-center justify-center group-hover:justify-start gap-3 h-20">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">supervisor_account</span>
                    </div>
                    <span className="font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap duration-300">Supervisor Portal</span>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-3">
                    {NAV_CONFIG.mentor.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all whitespace-nowrap ${isActive(item.href)
                                    ? 'bg-white/10 text-white'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-indigo-500 overflow-hidden shrink-0 border-2 border-white/20">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwOG01rGZ8dWHJCxFu4b3WFtbxkNOnWbGHWHOattOoqx1zuyvYKsWUSUZI9r_PlTIghZeNLomj_c3IbFFjj1oDJdZcz_oHZItTgXeLTpydo22GzSHU-hAEa-PfT3vIEOb79kEAo0jH3187Kh6-ExqnA7ne0j5MckLw4n19nzn7SIGietx1dLYV0f8pG-bFPPhwUQv2bEDFHjSdnIfchr5Bgg4LsALtOhA5X--U7xjB0dKJ5iqNfitfj38z_FAKlMEiGbnSL01tF5k"
                                alt="Lecturer"
                                width={40}
                                height={40}
                            />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                            <p className="text-sm font-bold truncate">Dr. Budi Santoso</p>
                            <p className="text-xs text-slate-400 truncate">Academic Advisor</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white dark:bg-card-dark border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-8">
                    <h2 className="font-bold text-lg">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
