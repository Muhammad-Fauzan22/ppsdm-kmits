"use client";

import Link from "next/link";
import { useState } from "react";

export default function PortfolioPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display overflow-hidden flex flex-col">
            {/* Header */}
            <header className="flex flex-none items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-white dark:bg-card-dark px-6 py-3 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="size-8 text-primary dark:text-purple-400 items-center justify-center flex">
                        <span className="material-symbols-outlined text-3xl">folder_special</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Portfolio Builder</h2>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium hover:text-primary">Exit to Dashboard</Link>
                    <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 flex gap-2">
                        <span className="material-symbols-outlined text-[18px]">save_alt</span>
                        Export
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Asset Library */}
                <aside className="w-80 flex-none flex flex-col bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark z-10 overflow-y-auto">
                    <div className="p-5 border-b border-border-light dark:border-border-dark">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">inventory_2</span>
                            Asset Library
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-gray-500">Achievements</h4>
                            <div className="p-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark cursor-grab hover:border-primary transition-colors">
                                <p className="text-sm font-bold">Dean's List 2023</p>
                                <p className="text-xs text-gray-500">GPA 3.89</p>
                            </div>
                            <div className="p-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark cursor-grab hover:border-primary transition-colors">
                                <p className="text-sm font-bold">HIMITS Staff</p>
                                <p className="text-xs text-gray-500">RnD Dept</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center: Canvas */}
                <section className="flex-1 relative bg-gray-100 dark:bg-[#120b18] overflow-y-auto flex justify-center p-8">
                    <div className="w-full max-w-[800px] min-h-[1000px] bg-white text-neutral-dark shadow-2xl rounded-sm p-12">
                        {/* Visual Resume Content */}
                        <div className="border-b-2 border-primary pb-6 mb-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-bold text-primary">Sarah Mahasiswa</h1>
                                <p className="text-xl text-gray-600 mt-2">Information Systems Student</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <p>surabaya, Indonesia</p>
                                <p>sarah.m@mhs.its.ac.id</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-wider text-primary mb-4 border-b border-gray-200 pb-2">About Me</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Enthusiastic student with a passion for Data Science and strong leadership skills demonstrated through HIMITS organization.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-wider text-primary mb-4 border-b border-gray-200 pb-2">Experience</h2>
                                <div className="mb-4">
                                    <h3 className="font-bold">Staff of RnD</h3>
                                    <p className="text-sm text-gray-600">HIMITS • 2022-2023</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                                        <li>Led the tech summit project.</li>
                                        <li>Managed 5 junior staff members.</li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
