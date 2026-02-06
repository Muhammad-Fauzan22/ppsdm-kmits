"use client";

import React from 'react';

export default function GrowthSection() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-[#0c1017]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left Content */}
                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                            Visualize Your <br />
                            <span className="text-primary">Growth Journey</span>
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-body">
                            Track your progress across all 9 dimensions with our dynamic assessment tools. Identify strengths, uncover areas for improvement, and chart a personalized path to success.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white font-display">Real-time Analytics</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-body">Get instant feedback on your developmental milestones.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white font-display">Personalized Recommendations</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-body">Receive curated program suggestions based on your profile.</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-4 flex h-11 w-fit items-center justify-center rounded-lg border border-slate-300 dark:border-border-dark bg-transparent px-6 text-sm font-bold text-slate-900 dark:text-white transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 font-body">
                            View Sample Report
                        </button>
                    </div>

                    {/* Right Chart (SVG) */}
                    <div className="flex-1 w-full max-w-[500px]">
                        <div className="relative w-full aspect-square bg-white dark:bg-[#1c1f27] rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-border-dark">
                            <div className="absolute top-6 left-6 z-10">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-body">Student Profile</p>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Mahasiswa ITS</h3>
                            </div>

                            {/* Simulated Radar Chart using SVG */}
                            <div className="w-full h-full flex items-center justify-center relative">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                                    {/* Grid */}
                                    <circle cx="100" cy="100" fill="none" r="20" stroke="#282e39" strokeDasharray="4 4" strokeWidth="1"></circle>
                                    <circle cx="100" cy="100" fill="none" r="40" stroke="#282e39" strokeDasharray="4 4" strokeWidth="1"></circle>
                                    <circle cx="100" cy="100" fill="none" r="60" stroke="#282e39" strokeDasharray="4 4" strokeWidth="1"></circle>
                                    <circle cx="100" cy="100" fill="none" r="80" stroke="#282e39" strokeWidth="1"></circle>
                                    {/* Axes */}
                                    <line stroke="#282e39" strokeWidth="1" x1="100" x2="100" y1="100" y2="20"></line>
                                    <line stroke="#282e39" strokeWidth="1" x1="100" x2="176" y1="100" y2="65"></line>
                                    <line stroke="#282e39" strokeWidth="1" x1="100" x2="164" y1="100" y2="162"></line>
                                    <line stroke="#282e39" strokeWidth="1" x1="100" x2="36" y1="100" y2="162"></line>
                                    <line stroke="#282e39" strokeWidth="1" x1="100" x2="24" y1="100" y2="65"></line>
                                    {/* Data Shape */}
                                    <polygon
                                        className="drop-shadow-[0_0_10px_rgba(19,91,236,0.5)] animate-[pulse_3s_ease-in-out_infinite]"
                                        fill="rgba(19, 91, 236, 0.2)"
                                        points="100,30 160,70 140,150 60,140 40,80"
                                        stroke="#135bec"
                                        strokeWidth="2"
                                    ></polygon>
                                    {/* Data Points */}
                                    <circle cx="100" cy="30" fill="#135bec" r="3"></circle>
                                    <circle cx="160" cy="70" fill="#135bec" r="3"></circle>
                                    <circle cx="140" cy="150" fill="#135bec" r="3"></circle>
                                    <circle cx="60" cy="140" fill="#135bec" r="3"></circle>
                                    <circle cx="40" cy="80" fill="#135bec" r="3"></circle>
                                </svg>
                            </div>

                            <div className="absolute bottom-6 right-6 z-10 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                <p className="text-xs font-bold text-primary font-body">Balanced Growth</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
