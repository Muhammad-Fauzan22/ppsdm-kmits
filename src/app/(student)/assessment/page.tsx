"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function AssessmentHubPage() {
    return (
        <div className="min-h-screen bg-background-dark text-white font-sans overflow-x-hidden p-4 md:p-8">

            {/* Page Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6"
            >
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold font-grotesk tracking-tight text-white">Dimensional Assessment Hub</h1>
                    <p className="text-slate-400 text-base md:text-lg">Track your growth across 9 developmental dimensions. Complete assessments to unlock AI-driven insights.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex flex-col gap-1 rounded-xl bg-card-dark p-4 border border-white/10 min-w-[140px] shadow-sm glass-card">
                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <span className="material-symbols-outlined text-lg">donut_large</span> Completion
                        </div>
                        <p className="text-2xl font-bold text-white">78%</p>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-card-dark p-4 border border-white/10 min-w-[140px] shadow-sm glass-card">
                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <span className="material-symbols-outlined text-lg">analytics</span> Avg. Score
                        </div>
                        <p className="text-2xl font-bold text-brand-blue">82<span className="text-sm text-slate-500 font-medium">/100</span></p>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-card-dark p-4 border border-white/10 min-w-[140px] shadow-sm glass-card">
                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <span className="material-symbols-outlined text-lg">schedule</span> Pending
                        </div>
                        <p className="text-2xl font-bold text-orange-500">2</p>
                    </div>
                </div>
            </motion.header>

            {/* Content Grid: Hub & Results */}
            <div className="flex flex-col gap-10">

                {/* Section 1: Assessment Hub Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-blue">grid_view</span>
                            Dimensions Grid
                        </h2>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-400 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">filter_list</span> Filter
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-400 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">sort</span> Sort
                            </button>
                        </div>
                    </div>

                    {/* 3x3 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Card 1: Excellent */}
                        <motion.div whileHover={{ y: -5 }} className="group bg-card-dark rounded-xl border border-white/10 p-5 shadow-sm hover:border-brand-blue/50 hover:shadow-lg hover:shadow-brand-blue/10 transition-all relative overflow-hidden glass-card">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">Completed</span>
                                    <h3 className="mt-2 text-lg font-bold text-white">Critical Thinking</h3>
                                    <p className="text-xs text-slate-400 mt-1">Last taken: Oct 24, 2023</p>
                                </div>
                                <div className="relative size-14">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                        <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        <path className="text-emerald-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="92, 100" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">92</div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <button className="flex-1 text-xs font-bold text-slate-400 hover:text-brand-blue transition-colors py-1">View Details</button>
                                <div className="w-px bg-white/10 h-4 self-center"></div>
                                <button className="flex-1 text-xs font-bold text-slate-400 hover:text-brand-blue transition-colors py-1">View History</button>
                            </div>
                        </motion.div>

                        {/* Card 2: Good */}
                        <motion.div whileHover={{ y: -5 }} className="group bg-card-dark rounded-xl border border-white/10 p-5 shadow-sm hover:border-brand-blue/50 hover:shadow-lg hover:shadow-brand-blue/10 transition-all relative overflow-hidden glass-card">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2 py-1 text-xs font-bold text-brand-blue ring-1 ring-inset ring-brand-blue/20">Completed</span>
                                    <h3 className="mt-2 text-lg font-bold text-white">Communication</h3>
                                    <p className="text-xs text-slate-400 mt-1">Last taken: Oct 20, 2023</p>
                                </div>
                                <div className="relative size-14">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                        <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        <path className="text-brand-blue" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="78, 100" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">78</div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <button className="flex-1 text-xs font-bold text-slate-400 hover:text-brand-blue transition-colors py-1">View Details</button>
                                <div className="w-px bg-white/10 h-4 self-center"></div>
                                <button className="flex-1 text-xs font-bold text-slate-400 hover:text-brand-blue transition-colors py-1">Retake</button>
                            </div>
                        </motion.div>

                        {/* Card 3: Pending */}
                        <motion.div whileHover={{ y: -5 }} className="group bg-orange-900/10 rounded-xl border border-dashed border-orange-500/30 p-5 shadow-sm hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/10 transition-all relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-400 ring-1 ring-inset ring-orange-500/20">Action Required</span>
                                    <h3 className="mt-2 text-lg font-bold text-white">Leadership</h3>
                                    <p className="text-xs text-orange-400 font-medium mt-1">Due in 2 days</p>
                                </div>
                                <div className="relative size-14 opacity-50">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                        <path className="text-slate-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-400">--</div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-orange-500/20">
                                <button className="w-full text-xs font-bold text-white bg-brand-blue hover:bg-blue-600 rounded-lg py-2 transition-colors shadow-lg shadow-brand-blue/20">Start Assessment</button>
                            </div>
                        </motion.div>

                        {/* Card 4: Average */}
                        <motion.div whileHover={{ y: -5 }} className="group bg-card-dark rounded-xl border border-white/10 p-5 shadow-sm hover:border-brand-blue/50 hover:shadow-lg hover:shadow-brand-blue/10 transition-all relative overflow-hidden glass-card">
                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-bold text-yellow-500 ring-1 ring-inset ring-yellow-500/20">In Progress</span>
                                    <h3 className="mt-2 text-lg font-bold text-white">Digital Literacy</h3>
                                    <p className="text-xs text-slate-400 mt-1">Saved: 2 hours ago</p>
                                </div>
                                <div className="relative size-14">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                        <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        <path className="text-yellow-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="45, 100" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">45%</div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <button className="w-full text-xs font-bold text-brand-blue hover:text-white hover:bg-brand-blue rounded py-2 transition-all border border-brand-blue">Resume</button>
                            </div>
                        </motion.div>

                        {/* Card 5: Low Score */}
                        <motion.div whileHover={{ y: -5 }} className="group bg-card-dark rounded-xl border border-white/10 p-5 shadow-sm hover:border-brand-blue/50 hover:shadow-lg hover:shadow-brand-blue/10 transition-all relative overflow-hidden glass-card">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-bold text-red-400 ring-1 ring-inset ring-red-500/20">Needs Attention</span>
                                    <h3 className="mt-2 text-lg font-bold text-white">Emotional IQ</h3>
                                    <p className="text-xs text-slate-400 mt-1">Last taken: Oct 15, 2023</p>
                                </div>
                                <div className="relative size-14">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                        <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                        <path className="text-red-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="54, 100" strokeWidth="3"></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">54</div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <button className="flex-1 text-xs font-bold text-slate-400 hover:text-brand-blue transition-colors py-1">View Details</button>
                                <div className="w-px bg-white/10 h-4 self-center"></div>
                                <button className="flex-1 text-xs font-bold text-slate-400 hover:text-brand-blue transition-colors py-1">Improve</button>
                            </div>
                        </motion.div>

                        {/* Card 6: Placeholder */}
                        <motion.div whileHover={{ y: -5 }} className="group bg-white/5 rounded-xl border border-white/10 p-5 shadow-sm hover:border-white/20 hover:bg-white/10 transition-all relative overflow-hidden flex items-center justify-center min-h-[160px] cursor-pointer">
                            <div className="text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">add</span>
                                </div>
                                <h3 className="mt-2 text-sm font-bold text-white">Explore More</h3>
                                <p className="text-xs text-slate-400">4 more dimensions available</p>
                                <button className="mt-3 text-xs font-bold text-brand-blue hover:text-white hover:underline transition-colors">View All</button>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Section 2: Detailed Results Dashboard */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-5"
                >
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-blue">analytics</span>
                            Performance Analysis
                        </h2>
                        <button className="text-sm font-bold text-brand-blue hover:text-blue-400 transition-colors">Download Report</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Breakdown Column (Left) */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div className="bg-card-dark rounded-xl border border-white/10 shadow-sm p-6 glass-card">
                                <h3 className="text-base font-bold text-white mb-4">Dimensional Breakdown</h3>
                                <div className="flex flex-col gap-4">
                                    {[
                                        { name: "Critical Thinking", score: 92, color: "bg-emerald-500", text: "text-emerald-500" },
                                        { name: "Problem Solving", score: 85, color: "bg-brand-blue", text: "text-brand-blue" },
                                        { name: "Communication", score: 78, color: "bg-brand-blue", text: "text-brand-blue" },
                                        { name: "Emotional Intelligence", score: 54, color: "bg-red-500", text: "text-red-500" },
                                        { name: "Adaptability", score: 68, color: "bg-yellow-500", text: "text-yellow-500" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col gap-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-300">{item.name}</span>
                                                <span className={`font-bold ${item.text}`}>{item.score}/100</span>
                                            </div>
                                            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.score}%` }}
                                                    transition={{ duration: 1, delay: 0.3 + (idx * 0.1) }}
                                                    className={`${item.color} h-2.5 rounded-full`}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Insight & Peer Column (Right) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            {/* AI Insight Card */}
                            <div className="bg-gradient-to-br from-indigo-900/40 to-card-dark rounded-xl border border-indigo-500/20 shadow-sm p-6 relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                    </div>
                                    <h3 className="text-base font-bold text-indigo-200">AI Actionable Insights</h3>
                                </div>
                                <div className="text-slate-300 text-sm">
                                    <p className="mb-3 leading-relaxed">
                                        Your strong <span className="font-bold text-emerald-400">Critical Thinking</span> score places you in the top 10%. However, <span className="font-bold text-red-400">Emotional Intelligence</span> is a priority area.
                                    </p>
                                    <div className="bg-white/5 rounded-lg p-3 border border-indigo-500/30">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Recommended Action</p>
                                        <p className="text-sm font-medium text-indigo-300">Enroll in "Empathy & Leadership Workshop" starting Nov 12th.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Peer Comparison */}
                            <div className="bg-card-dark rounded-xl border border-white/10 shadow-sm p-6 glass-card">
                                <h3 className="text-base font-bold text-white mb-4">Peer Comparison (Percentile)</h3>
                                <div className="flex items-end justify-between h-32 px-4 gap-4">
                                    {/* User Bar */}
                                    <div className="flex flex-col items-center gap-2 w-1/2 h-full justify-end group">
                                        <span className="text-lg font-bold text-brand-blue">Top 15%</span>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "85%" }}
                                            transition={{ duration: 0.8, delay: 0.5 }}
                                            className="w-full bg-brand-blue rounded-t-lg relative hover:opacity-90 transition-opacity"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </motion.div>
                                        <span className="text-xs font-bold text-slate-400">You</span>
                                    </div>
                                    {/* Average Bar */}
                                    <div className="flex flex-col items-center gap-2 w-1/2 h-full justify-end">
                                        <span className="text-sm font-semibold text-slate-500">Average</span>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "50%" }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                            className="w-full bg-slate-700/50 rounded-t-lg"
                                        ></motion.div>
                                        <span className="text-xs font-bold text-slate-500">Cohort</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
