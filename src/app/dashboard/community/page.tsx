"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swords, ArrowRight, BookOpenText, MessageSquare } from 'lucide-react';

export default function CommunityPage() {
    return (
        <div className="bg-slate-900/50 min-h-screen text-white font-sans p-6 lg:p-10">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-10"
            >
                <span className="text-blue-500 font-bold tracking-wider uppercase text-xs mb-2 block">
                    Connect & Compete
                </span>
                <h1 className="text-4xl font-extrabold font-grotesk tracking-tight">
                    Community Hub
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl">
                    Join forces with your department, share your journey, and compete for glory.
                </p>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* War Room Card */}
                <Link href="/community/war-room">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative h-64 rounded-2xl overflow-hidden glass-card border border-blue-600/30 cursor-pointer"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVhRWWUK2KABqnLL2cS5qVT96cUKdr5s_vwIjSJHMgOY-lqAybyvOB0mmB3zk65IqyBrf6BAIkWf5oKZkt6jeSfIAh67yHJcQL_xvK2ThhvZ24S7jxXzCxkfZk03WT5bd4I-wfD3ETuKm3SXSeuF5oUiDneTuoTiKOFrHWAP8pCS2QQNIBemLcqXwcWBtzqLYaWaMrw0_VDw2f7nM_iFw3WQ8jlJtDFiOB5X2N4qufzbtfcEEf-I16hthto5qkpIDmsQ5yOJitF_c")' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                        <div className="absolute top-4 right-4 bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-pulse">
                            <span className="size-2 bg-red-500 rounded-full"></span>
                            LIVE WAR
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-600 size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                    <Swords className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold font-grotesk">War Room</h3>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                Department vs Department. Compete on Growth, XP, and Impact.
                            </p>
                            <div className="flex items-center text-blue-500 text-xs font-bold uppercase tracking-wider gap-1">
                                Enter Battlefield <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Stories Card (Coming Soon) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative h-64 rounded-2xl overflow-hidden glass-card border border-white/5 opacity-70"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent" />

                    <div className="absolute top-4 right-4 bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
                        COMING SOON
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-purple-500/20 size-10 rounded-lg flex items-center justify-center text-purple-400">
                                <BookOpenText className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold font-grotesk text-slate-300">Stories</h3>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Share your personal growth journey and inspire others.
                        </p>
                    </div>
                </motion.div>

                {/* Global Chat (Coming Soon) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative h-64 rounded-2xl overflow-hidden glass-card border border-white/5 opacity-70"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent" />

                    <div className="absolute top-4 right-4 bg-white/5 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
                        COMING SOON
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-emerald-500/20 size-10 rounded-lg flex items-center justify-center text-emerald-400">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold font-grotesk text-slate-300">Forum</h3>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Discussions, Q&A, and collaborative problem solving.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
