"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function QuantumLMSPage() {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className="min-h-screen bg-[#0E1218] text-white font-sans overflow-x-hidden">

            {/* Header / Nav */}
            <header className="flex justify-between items-center px-8 py-4 border-b border-[#2D303E] bg-[#0E1218]/90 backdrop-blur sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">infinity</span>
                    </div>
                    <h1 className="font-bold text-sm tracking-wide">ITS Quantum LMS</h1>
                </div>

                <div className="flex-1 max-w-xl mx-8">
                    <div className="bg-[#1C2028] border border-[#2D303E] rounded-full flex items-center px-4 py-2">
                        <span className="material-symbols-outlined text-gray-500 mr-2">search</span>
                        <input type="text" placeholder="Search resources..." className="bg-transparent w-full text-sm outline-none text-gray-300 placeholder-gray-600" />
                    </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-bold text-gray-400">
                    <Link href="#" className="hover:text-white transition-colors">Dashboard</Link>
                    <Link href="#" className="text-white transition-colors">Library</Link>
                    <Link href="#" className="hover:text-white transition-colors">Community</Link>
                    <Link href="#" className="hover:text-white transition-colors">My Progress</Link>
                    <div className="flex items-center gap-3 border-l border-[#2D303E] pl-6 ml-2">
                        <button className="relative">
                            <span className="material-symbols-outlined text-gray-400">notifications</span>
                            <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button><span className="material-symbols-outlined text-gray-400">settings</span></button>
                        <div className="size-8 rounded-full bg-orange-200 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Breadcrumbs */}
            <div className="px-8 py-4 text-xs text-gray-500 font-medium">
                <Link href="#" className="hover:text-white">Library</Link> / <Link href="#" className="hover:text-white">Cloud Computing</Link> / <span className="text-white">Enterprise Cloud Architecture v2</span>
            </div>

            {/* Hero Section */}
            <div className="px-8 py-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-[#161B22] to-[#0E1218] rounded-[32px] border border-[#2D303E] relative overflow-hidden p-8 flex gap-8">
                    {/* Decorative Background Grid */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    {/* Book Cover */}
                    <div className="w-64 shrink-0 relative z-10 perspective-1000 group">
                        <div className="w-full aspect-[3/4] rounded-xl bg-cover bg-center shadow-2xl transition-transform duration-500 group-hover:rotate-y-6" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop)' }}>
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            {/* Overlay Text on Cover */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Enterprise Cloud Architecture</h2>
                                <p className="text-xs text-gray-300">v2.0 • 2024 Edition</p>
                            </div>
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">v2.4</span>
                            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded">Interactive</span>
                        </div>
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 relative z-10 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-blue-500 text-sm">verified</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Certification Material</span>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Enterprise Cloud Architecture v2</h1>
                        <p className="text-sm text-gray-400 mb-8">By J. Doe • 4h 30m • Cloud Computing</p>

                        {/* AI Summary Card */}
                        <div className="bg-[#1C2028]/80 backdrop-blur rounded-xl p-5 border border-[#2D303E] mb-8 max-w-2xl">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-purple-400 text-sm">auto_awesome</span>
                                <span className="text-[10px] font-bold text-purple-400 uppercase">Quantum AI Summary</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                This resource comprehensively covers Kubernetes orchestration, containerization strategies, and scalable infrastructure patterns for enterprise environments. The AI has generated 3D models for pod structures and a 5-module quiz based on recent updates.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-auto">
                            <button className="bg-white hover:bg-gray-100 text-[#0E1218] font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-xl">play_arrow</span> Start Learning
                            </button>
                            <button className="bg-[#1C2028] hover:bg-[#252932] border border-[#2D303E] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">bookmark</span> Bookmark
                            </button>
                        </div>
                    </div>

                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between py-6 border-b border-[#2D303E] mb-8">
                    <div className="flex gap-6">
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white">
                            <span className="material-symbols-outlined text-sm">download</span> Download Resources
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white">
                            <span className="material-symbols-outlined text-sm">share</span> Share
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white">
                            <span className="material-symbols-outlined text-sm">playlist_add</span> Add to Playlist
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="material-symbols-outlined text-sm">visibility</span> 1.2k views
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-[#2D303E]">
                    {['Overview', 'Microlearning', 'Mind Map', 'Gamification', 'Podcast', 'Slides'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
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
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white">Chapter 1: K8s Fundamentals</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">Card 5 of 20</span>
                                <div className="w-24 h-1 bg-[#2D303E] rounded-full overflow-hidden">
                                    <div className="w-[25%] h-full bg-blue-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Flashcard Container */}
                        <div className="aspect-video bg-[#0B0D11] border border-[#2D303E] rounded-2xl flex flex-col items-center justify-center p-12 text-center relative group cursor-pointer hover:border-blue-500/50 transition-colors">
                            <div className="absolute top-4 right-4">
                                <span className="material-symbols-outlined text-gray-600 group-hover:text-blue-500 transition-colors">flip</span>
                            </div>

                            <div className="mb-8 p-4 bg-green-500/10 rounded-full">
                                <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4">
                                "The smallest deployable unit in Kubernetes."
                            </h2>

                            <p className="text-sm text-gray-500 font-mono transform rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                A Pod encapsulates one or more containers, storage resources, a unique network IP, and options that govern how the container(s) should run.
                            </p>

                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 mt-6">
                            <button className="size-10 rounded-full bg-[#1C2028] border border-[#2D303E] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <button className="bg-[#1C2028] border border-[#2D303E] text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-[#252932]">
                                I Know This
                            </button>
                            <button className="bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-blue-500 shadow-lg shadow-blue-600/20">
                                Study Again
                            </button>
                            <button className="size-10 rounded-full bg-[#1C2028] border border-[#2D303E] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Session Mastery */}
                        <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-sm text-white">Session Mastery</h4>
                                <span className="text-[10px] font-bold text-green-500">+50 XP</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#0B0D11] p-3 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-white">12</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Mastered</p>
                                </div>
                                <div className="bg-[#0B0D11] p-3 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-white">8</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">To Review</p>
                                </div>
                            </div>
                            <button className="w-full text-xs font-bold text-blue-500 py-2 hover:bg-blue-500/10 rounded-lg transition-colors">
                                View Detailed Stats
                            </button>
                        </div>

                        {/* Podcast */}
                        <div className="bg-[#161B22] border border-[#2D303E] rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-white">headphones</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Up Next</p>
                            <h4 className="font-bold text-white mb-2">Listen to Podcast</h4>
                            <p className="text-xs text-gray-400 leading-snug mb-4 max-w-[180px]">
                                Continue with an AI-generated audio summary of Chapter 2: Nodes &...
                            </p>
                            <button className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400">
                                Start Playing <span className="material-symbols-outlined text-sm">play_circle</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="mb-12">
                    <h3 className="font-bold text-white text-lg mb-6">Recommended for you</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { title: "Advanced Docker Security", author: "Sarah Connor • Security", time: "12m", img: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Serverless Patterns", author: "Mike Ross • Architecture", time: "45m", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Kubernetes Best Practices", author: "Google Cloud • DevOps", time: "PDF", isPDF: true, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Cloud Networking Exam", author: "ITS Training • Certification", time: "Quiz", isQuiz: true, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" }
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-video rounded-xl bg-gray-800 mb-3 overflow-hidden relative border border-[#2D303E]">
                                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.img})` }}></div>
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                                        {item.time}
                                    </div>
                                </div>
                                <h4 className="font-bold text-sm text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                <p className="text-[10px] text-gray-500">{item.author}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Floating AI Avatar */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full pl-4 pr-1 py-1 shadow-2xl shadow-blue-600/30 flex items-center gap-3 transition-transform hover:scale-105">
                    <div className="text-left">
                        <p className="text-xs font-bold leading-none">Chat with Book</p>
                        <p className="text-[8px] text-blue-200">AI Persona Active</p>
                    </div>
                    <div className="size-8 bg-blue-500 rounded-full flex items-center justify-center border border-blue-400">
                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                </button>
            </div>

        </div>
    );
}
