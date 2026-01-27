"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function QuantumLMSPage() {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className="min-h-screen bg-background-dark text-white font-sans overflow-x-hidden">

            {/* Header / Nav */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-background-dark/90 backdrop-blur sticky top-0 z-50"
            >
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-brand-blue flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">infinity</span>
                    </div>
                    <h1 className="font-bold text-sm tracking-wide font-grotesk">ITS Quantum LMS</h1>
                </div>

                <div className="flex-1 max-w-xl mx-8">
                    <div className="bg-white/5 border border-white/10 rounded-full flex items-center px-4 py-2 focus-within:border-brand-blue/50 focus-within:ring-1 focus-within:ring-brand-blue/50 transition-all">
                        <span className="material-symbols-outlined text-slate-500 mr-2">search</span>
                        <input type="text" placeholder="Search resources..." className="bg-transparent w-full text-sm outline-none text-slate-300 placeholder-slate-600" />
                    </div>
                </div>

                <div className="flex items-center gap-3 pl-6 ml-2">
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-1 right-1 size-2 bg-its-red rounded-full"></span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">settings</span></button>
                    <div className="size-8 rounded-full bg-slate-700 overflow-hidden ring-2 ring-white/10">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-full h-full" alt="User" />
                    </div>
                </div>
            </motion.header>

            {/* Breadcrumbs */}
            <div className="px-8 py-4 text-xs text-slate-500 font-medium">
                <Link href="#" className="hover:text-white transition-colors">Library</Link> / <Link href="#" className="hover:text-white transition-colors">Cloud Computing</Link> / <span className="text-white">Enterprise Cloud Architecture v2</span>
            </div>

            {/* Hero Section */}
            <div className="px-8 py-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-card-dark to-background-dark rounded-[32px] border border-white/10 relative overflow-hidden p-8 flex flex-col md:flex-row gap-8"
                >
                    {/* Decorative Background Grid */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#135bec 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    {/* Book Cover */}
                    <div className="w-full md:w-64 shrink-0 relative z-10 perspective-1000 group mx-auto md:mx-0">
                        <div className="w-full aspect-[3/4] rounded-xl bg-cover bg-center shadow-2xl transition-transform duration-500 group-hover:rotate-y-6" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop)' }}>
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            {/* Overlay Text on Cover */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight font-grotesk">Enterprise Cloud Architecture</h2>
                                <p className="text-xs text-gray-300">v2.0 • 2024 Edition</p>
                            </div>
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-brand-blue text-white text-[10px] font-bold px-2 py-1 rounded">v2.4</span>
                            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded">Interactive</span>
                        </div>
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 relative z-10 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-brand-blue text-sm">verified</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Certification Material</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-grotesk">Enterprise Cloud Architecture v2</h1>
                        <p className="text-sm text-slate-400 mb-8">By J. Doe • 4h 30m • Cloud Computing</p>

                        {/* AI Summary Card */}
                        <div className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10 mb-8 max-w-2xl glass-card">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-purple-400 text-sm">auto_awesome</span>
                                <span className="text-[10px] font-bold text-purple-400 uppercase">Quantum AI Summary</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                This resource comprehensively covers Kubernetes orchestration, containerization strategies, and scalable infrastructure patterns for enterprise environments. The AI has generated 3D models for pod structures and a 5-module quiz based on recent updates.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-auto">
                            <button className="bg-white hover:bg-slate-100 text-background-dark font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-xl">play_arrow</span> Start Learning
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">bookmark</span> Bookmark
                            </button>
                        </div>
                    </div>

                </motion.div>

                {/* Action Bar */}
                <div className="flex items-center justify-between py-6 border-b border-white/10 mb-8 overflow-x-auto">
                    <div className="flex gap-6 min-w-max">
                        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-sm">download</span> Download Resources
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-sm">share</span> Share
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-sm">playlist_add</span> Add to Playlist
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 min-w-max ml-4">
                        <span className="material-symbols-outlined text-sm">visibility</span> 1.2k views
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-white/10 overflow-x-auto">
                    {['Overview', 'Microlearning', 'Mind Map', 'Gamification', 'Podcast', 'Slides'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            <span className="material-symbols-outlined text-sm">
                                {tab === 'Overview' ? 'article' :
                                    tab === 'Microlearning' ? 'flash_on' :
                                        tab === 'Mind Map' ? 'hub' :
                                            tab === 'Gamification' ? 'sports_esports' :
                                                tab === 'Podcast' ? 'headphones' : 'slideshow'}
                            </span>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">Chapter 1: K8s Fundamentals</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500">Card 5 of 20</span>
                                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[25%] h-full bg-brand-blue rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Flashcard Container */}
                        <div className="aspect-video bg-[#0B0D11] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center relative group cursor-pointer hover:border-brand-blue/50 transition-colors glass-card">
                            <div className="absolute top-4 right-4">
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-brand-blue transition-colors">flip</span>
                            </div>

                            <div className="mb-8 p-4 bg-green-500/10 rounded-full">
                                <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4 font-grotesk">
                                "The smallest deployable unit in Kubernetes."
                            </h2>

                            <p className="text-sm text-slate-500 font-mono transform rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                A Pod encapsulates one or more containers, storage resources, a unique network IP, and options that govern how the container(s) should run.
                            </p>

                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 mt-6">
                            <button className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <button className="bg-white/5 border border-white/10 text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-white/10 transition-colors">
                                I Know This
                            </button>
                            <button className="bg-brand-blue text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-blue-600 shadow-lg shadow-brand-blue/20 transition-colors">
                                Study Again
                            </button>
                            <button className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Session Mastery */}
                        <div className="bg-card-dark border border-white/10 rounded-2xl p-6 glass-card">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-sm text-white">Session Mastery</h4>
                                <span className="text-[10px] font-bold text-green-500">+50 XP</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-black/20 p-3 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-white">12</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Mastered</p>
                                </div>
                                <div className="bg-black/20 p-3 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-white">8</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">To Review</p>
                                </div>
                            </div>
                            <button className="w-full text-xs font-bold text-brand-blue py-2 hover:bg-brand-blue/10 rounded-lg transition-colors">
                                View Detailed Stats
                            </button>
                        </div>

                        {/* Podcast */}
                        <div className="bg-card-dark border border-white/10 rounded-2xl p-6 relative overflow-hidden group glass-card">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-white">headphones</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Up Next</p>
                            <h4 className="font-bold text-white mb-2">Listen to Podcast</h4>
                            <p className="text-xs text-slate-400 leading-snug mb-4 max-w-[180px]">
                                Continue with an AI-generated audio summary of Chapter 2: Nodes &...
                            </p>
                            <button className="flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-blue-400">
                                Start Playing <span className="material-symbols-outlined text-sm">play_circle</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <h3 className="font-bold text-white text-lg mb-6 font-grotesk">Recommended for you</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { title: "Advanced Docker Security", author: "Sarah Connor • Security", time: "12m", img: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Serverless Patterns", author: "Mike Ross • Architecture", time: "45m", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Kubernetes Best Practices", author: "Google Cloud • DevOps", time: "PDF", isPDF: true, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Cloud Networking Exam", author: "ITS Training • Certification", time: "Quiz", isQuiz: true, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" }
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-video rounded-xl bg-slate-800 mb-3 overflow-hidden relative border border-white/10">
                                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.img})` }}></div>
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                                        {item.time}
                                    </div>
                                </div>
                                <h4 className="font-bold text-sm text-white leading-tight mb-1 group-hover:text-brand-blue transition-colors">{item.title}</h4>
                                <p className="text-[10px] text-slate-500">{item.author}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* Floating AI Avatar */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <button className="bg-brand-blue hover:bg-blue-600 text-white rounded-full pl-4 pr-1 py-1 shadow-2xl shadow-brand-blue/30 flex items-center gap-3 transition-transform">
                    <div className="text-left">
                        <p className="text-xs font-bold leading-none">Chat with Book</p>
                        <p className="text-[8px] text-blue-200">AI Persona Active</p>
                    </div>
                    <div className="size-8 bg-blue-500 rounded-full flex items-center justify-center border border-blue-400">
                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                </button>
            </motion.div>

        </div>
    );
}
