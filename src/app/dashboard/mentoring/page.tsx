"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { History, Plus, Search, X, SlidersHorizontal, Star, TrendingUp, GraduationCap } from 'lucide-react';

export default function MentorshipPage() {
    return (
        <div className="h-full bg-slate-900/50 text-white font-sans overflow-x-hidden p-6 md:p-10">

            {/* Page Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold font-grotesk tracking-tight">Mentorship & Coaching</h1>
                    <p className="text-slate-400 text-sm mt-1">Connect with senior scholars and master new skills.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors">
                        <History className="w-5 h-5" />
                        History
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-600 rounded-full text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all">
                        <Plus className="w-5 h-5" />
                        Become a Mentor
                    </button>
                </div>
            </motion.header>

            {/* Main Content Grid */}
            <div className="flex flex-col xl:flex-row gap-8">

                {/* Left Column: Hero & Marketplace */}
                <div className="flex-1 flex flex-col gap-8">

                    {/* Hero Section */}
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl overflow-hidden relative min-h-[320px] flex items-center justify-center p-6 md:p-12 border border-slate-700 group"
                    >
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop")' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/40"></div>

                        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-white text-4xl md:text-5xl font-bold font-grotesk leading-tight tracking-tight">
                                    Level Up with a Mentor
                                </h2>
                                <p className="text-slate-200 text-lg font-light max-w-lg mx-auto">
                                    Find senior students to help you master new skills, debug code, or prepare for exams.
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="w-full max-w-lg flex items-center p-1 bg-black/40 border border-white/20 rounded-xl backdrop-blur shadow-2xl focus-within:border-blue-600/50 transition-colors">
                                <div className="px-3 text-slate-400">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 text-sm h-12 outline-none" placeholder="Search by skill (e.g., Python, Design)..." type="text" />
                                <button className="bg-blue-600 hover:bg-blue-600 text-white font-bold h-10 px-6 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                                    Find
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-3 items-center"
                    >
                        <span className="text-slate-400 text-sm font-medium mr-2">Popular:</span>
                        {['Python', 'UI Design', 'Public Speaking', 'Level 5+ Only'].map((tag, i) => (
                            <button key={i} className={`flex h-9 items-center gap-2 rounded-full border px-4 transition-colors ${i === 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/5 border-white/10 hover:border-blue-600/50 hover:text-white text-slate-400'}`}>
                                <span className="text-sm font-medium">{tag}</span>
                                {i === 2 && <X className="w-4 h-4" />}
                            </button>
                        ))}
                        <button className="flex h-9 items-center gap-2 text-slate-400 hover:text-white ml-auto">
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="text-sm font-medium">All Filters</span>
                        </button>
                    </motion.div>

                    {/* Mentors Grid */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Recommended Mentors</h3>
                        <span className="text-sm text-slate-400">Showing 24 available</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { name: "Sarah Jenkins", role: "Debate & Speech", lvl: 12, rating: 4.9, cost: "50 XP", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", tags: ["Debate", "Speech"], status: "online" },
                            { name: "David Kim", role: "Python Wizard", lvl: 15, rating: 5.0, cost: "Free", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", tags: ["Python", "Data Science"], status: "offline" },
                            { name: "Maria Garcia", role: "UI/UX Designer", lvl: 9, rating: 4.7, cost: "25 XP", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", tags: ["Figma", "Prototyping"], status: "online" },
                            { name: "James Wilson", role: "Backend Dev", lvl: 11, rating: 4.8, cost: "40 XP", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", tags: ["Java", "C++"], status: "online" }
                        ].map((mentor, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                className="group flex flex-col bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <div className="size-12 rounded-full bg-slate-700 overflow-hidden ring-2 ring-white/5">
                                                <img src={mentor.img} alt={mentor.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-slate-900 ${mentor.status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'}`} title={mentor.status}></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg leading-tight group-hover:text-blue-600 transition-colors">{mentor.name}</h4>
                                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-wide">
                                                Lvl {mentor.lvl}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">
                                        <Star className="w-4 h-4 fill-amber-400" />
                                        <span className="text-sm font-bold">{mentor.rating}</span>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                    Expert in {mentor.tags.join(' & ')}. Ready to help you achieve your goals.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {mentor.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Session Cost</span>
                                        <span className="text-sm font-medium text-white">{mentor.cost}</span>
                                    </div>
                                    <button className="bg-white text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                        Request
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Stats & Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full xl:w-80 flex flex-col gap-6 flex-shrink-0"
                >
                    {/* XP Tracker */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">Peer Coaching XP</h3>
                            <div className="bg-blue-600/20 text-blue-600 p-1 rounded-md">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center py-2">
                            <div className="text-4xl font-black text-white">1380</div>
                            <div className="text-slate-500 text-sm font-medium">Total Earned XP</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-400">Rank: Mentor</span>
                                <span className="text-blue-600">Master</span>
                            </div>
                            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full relative" style={{ width: '80%' }}>
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 text-center mt-1">120 XP to level up!</p>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-bold text-lg">Top Mentors</h3>
                            <a className="text-blue-600 text-xs font-bold hover:underline" href="#">View All</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { rank: 1, name: "Anna K.", sessions: 24, rating: 5.0, color: "text-yellow-400" },
                                { rank: 2, name: "Mike T.", sessions: 21, rating: 4.9, color: "text-slate-300" },
                                { rank: 3, name: "Jessica L.", sessions: 19, rating: 4.8, color: "text-amber-600" }
                            ].map((leader, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`font-black w-4 ${leader.color}`}>{leader.rank}</div>
                                    <div className="size-10 rounded-full bg-slate-700 flex-shrink-0">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} alt={leader.name} className="w-full h-full rounded-full" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-sm font-bold text-white">{leader.name}</span>
                                        <span className="text-xs text-slate-500">{leader.sessions} Sessions</span>
                                    </div>
                                    <div className="text-amber-400 flex items-center gap-0.5 text-xs font-bold">
                                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {leader.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-blue-900 text-white flex flex-col gap-3 relative overflow-hidden shadow-lg shadow-blue-600/20">
                        <GraduationCap className="absolute -bottom-4 -right-4 text-white/10 w-[100px] h-[100px]" />
                        <h3 className="font-bold text-lg z-10 font-grotesk">Become a Mentor</h3>
                        <p className="text-sm text-blue-100 z-10">Share your knowledge, earn XP, and get badges!</p>
                        <button className="mt-2 bg-white text-blue-600 text-sm font-bold py-2 px-4 rounded-lg z-10 w-fit hover:bg-gray-100 transition-colors">Apply Now</button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
