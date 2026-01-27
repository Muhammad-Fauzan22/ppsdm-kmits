"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("microlearning");
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f1823] text-white font-sans selection:bg-[#135bec] selection:text-white pb-24">

            <div className="flex justify-center py-6 px-4 md:px-8 xl:px-0">
                <div className="flex flex-col max-w-[1200px] w-full gap-8">

                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap gap-2 text-sm font-medium">
                        <Link href="/library" className="text-slate-400 hover:text-white transition-colors">Library</Link>
                        <span className="text-slate-600">/</span>
                        <Link href="/library/category/cloud" className="text-slate-400 hover:text-white transition-colors">Cloud Computing</Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-white">Enterprise Cloud Architecture v2</span>
                    </nav>

                    {/* Hero Section */}
                    <div className="relative rounded-2xl overflow-hidden bg-[#1c222b] border border-white/5 shadow-2xl">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#135bec]/20 to-[#0f1823] opacity-90 z-0"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 p-6 md:p-10 items-start">
                            {/* Book Cover */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="shrink-0 mx-auto md:mx-0"
                            >
                                <div className="w-[240px] md:w-[280px] aspect-[2/3] rounded-lg shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 relative group overflow-hidden"
                                    style={{
                                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbaD49UTyhDaxnm1JyYMWuVTmk-GrculHJz_Cso45W3RjQJ72CVwKRFcpSt8T8yFUIDg_4-z5O4EdEKYd_7AwnavLagJm_-PgONFs4RRXsjkQuC_DggtUXcRnT9meT1yQj7rAsdC1CNmXZPqBrqBuJLG87W5T0ovnqcLRoxxXapW8r9kXfOLCR0ETHNUdZb_rPDFYNrJMi2yFvT_41Hj-5sePnVwNRAiGadojZ3mYwq_9aOsPA0zIdNz7hfPzdAt6lBWkAzTI6FPw')",
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)'
                                    }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                        <div className="flex gap-2">
                                            <span className="bg-[#135bec] text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg">v2.4</span>
                                            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg">Interactive</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hero Content */}
                            <div className="flex flex-col gap-6 flex-1 w-full">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">verified</span>
                                        <span className="text-blue-300 text-xs font-bold tracking-wider uppercase">Official Certification Material</span>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold font-grotesk leading-tight tracking-tight text-white">
                                        Enterprise Cloud Architecture v2
                                    </h1>
                                    <p className="text-slate-300 text-base font-medium">
                                        By J. Doe • 4h 30m • Cloud Computing
                                    </p>
                                </div>

                                {/* AI Summary Box */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 max-w-3xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-purple-400 text-lg">auto_awesome</span>
                                        <span className="text-purple-300 text-xs font-bold uppercase tracking-wide">Quantum AI Summary</span>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        This resource comprehensively covers Kubernetes orchestration, containerization strategies, and scalable infrastructure patterns for enterprise environments. The AI has generated 3D models for pod structures and a 5-module quiz based on recent updates.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-auto">
                                    <button className="flex items-center justify-center rounded-xl h-12 px-8 bg-white text-[#135bec] hover:bg-slate-100 transition-all text-base font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                        <span className="material-symbols-outlined mr-2 text-xl">play_arrow</span>
                                        Start Learning
                                    </button>
                                    <button className="flex items-center justify-center rounded-xl h-12 px-6 bg-[#1a2332]/80 hover:bg-[#1a2332] border border-white/10 text-white transition-all text-base font-bold tracking-wide">
                                        <span className="material-symbols-outlined mr-2 text-xl">bookmark_border</span>
                                        Bookmark
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-wrap gap-4 py-4 border-b border-white/10 items-center">
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex items-center justify-center size-8 rounded-full bg-white/10 group-hover:bg-[#135bec]/20 text-slate-300 group-hover:text-[#135bec] transition-colors">
                                    <span className="material-symbols-outlined text-lg">download</span>
                                </div>
                                <span className="text-slate-300 text-sm font-medium group-hover:text-white">Download</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex items-center justify-center size-8 rounded-full bg-white/10 group-hover:bg-[#135bec]/20 text-slate-300 group-hover:text-[#135bec] transition-colors">
                                    <span className="material-symbols-outlined text-lg">share</span>
                                </div>
                                <span className="text-slate-300 text-sm font-medium group-hover:text-white">Share</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex items-center justify-center size-8 rounded-full bg-white/10 group-hover:bg-[#135bec]/20 text-slate-300 group-hover:text-[#135bec] transition-colors">
                                    <span className="material-symbols-outlined text-lg">playlist_add</span>
                                </div>
                                <span className="text-slate-300 text-sm font-medium group-hover:text-white">Add Playlist</span>
                            </button>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span className="material-symbols-outlined text-lg">visibility</span>
                            <span>1.2k views</span>
                        </div>
                    </div>

                    {/* Tabs System */}
                    <div className="flex flex-col gap-8">
                        <div className="overflow-x-auto pb-1 no-scrollbar">
                            <div className="flex border-b border-white/10 min-w-max">
                                {['Overview', 'Microlearning', 'Mind Map', 'Gamification', 'Podcast', 'Slides'].map((tab) => {
                                    const id = tab.toLowerCase().replace(' ', '');
                                    const isActive = activeTab === id;
                                    const icons: Record<string, string> = {
                                        overview: 'description',
                                        microlearning: 'flash_on',
                                        mindmap: 'hub',
                                        gamification: 'sports_esports',
                                        podcast: 'headphones',
                                        slides: 'co_present'
                                    };

                                    return (
                                        <button
                                            key={id}
                                            onClick={() => setActiveTab(id)}
                                            className={`group flex items-center gap-2 px-6 py-4 border-b-[3px] transition-all cursor-pointer ${isActive
                                                    ? 'border-[#135bec] bg-[#135bec]/5'
                                                    : 'border-transparent hover:border-slate-700'
                                                }`}
                                        >
                                            <span className={`material-symbols-outlined text-xl ${isActive ? 'text-[#135bec]' : 'text-slate-500 group-hover:text-slate-300'
                                                }`}>{icons[id]}</span>
                                            <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-[#135bec]' : 'text-slate-500 group-hover:text-white'
                                                }`}>{tab}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'microlearning' && (
                                <motion.div
                                    key="microlearning"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                >
                                    {/* Main Card Interface */}
                                    <div className="lg:col-span-2 flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-white font-grotesk">Chapter 1: K8s Fundamentals</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-slate-400">Card 5 of 20</span>
                                                <div className="w-32 h-2 bg-[#272f3a] rounded-full overflow-hidden">
                                                    <div className="bg-[#135bec] h-full w-[25%] rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3D Flip Card */}
                                        <div
                                            className="group relative w-full aspect-[16/9] perspective-1000 cursor-pointer"
                                            onClick={() => setIsFlipped(!isFlipped)}
                                        >
                                            <motion.div
                                                className="relative w-full h-full preserve-3d"
                                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                                style={{ transformStyle: "preserve-3d" }}
                                            >
                                                {/* Front */}
                                                <div className="absolute inset-0 backface-hidden bg-[#1a2332] rounded-2xl shadow-2xl border border-white/5 flex flex-col items-center justify-center p-12 text-center" style={{ backfaceVisibility: 'hidden' }}>
                                                    <div className="mb-6 size-16 rounded-full bg-[#135bec]/20 flex items-center justify-center text-[#135bec]">
                                                        <span className="material-symbols-outlined text-4xl">help_center</span>
                                                    </div>
                                                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">What is a Pod?</h4>
                                                    <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Tap to flip</p>
                                                </div>

                                                {/* Back */}
                                                <div
                                                    className="absolute inset-0 backface-hidden bg-[#0f1823] rounded-2xl shadow-2xl border border-[#135bec]/30 flex flex-col items-center justify-center p-12 text-center"
                                                    style={{ transform: "rotateY(180deg)", backfaceVisibility: 'hidden' }}
                                                >
                                                    <div className="mb-6 size-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                                                    </div>
                                                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium">
                                                        "The smallest deployable unit in Kubernetes."
                                                    </p>
                                                    <p className="mt-6 text-slate-400 text-base max-w-lg">
                                                        A Pod encapsulates one or more containers, storage resources, a unique network IP, and options that govern how the container(s) should run.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-center gap-4">
                                            <button className="size-12 rounded-full bg-[#1a2332] border border-white/10 text-slate-400 hover:text-white hover:bg-[#272f3a] flex items-center justify-center transition-colors">
                                                <span className="material-symbols-outlined">arrow_back</span>
                                            </button>
                                            <button className="px-8 h-12 rounded-full bg-[#272f3a] text-white font-bold text-sm hover:bg-[#394556] transition-colors border border-white/5">
                                                I Know This
                                            </button>
                                            <button className="px-8 h-12 rounded-full bg-[#135bec] text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20">
                                                Study Again
                                            </button>
                                            <button className="size-12 rounded-full bg-[#1a2332] border border-white/10 text-slate-400 hover:text-white hover:bg-[#272f3a] flex items-center justify-center transition-colors">
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Side Panel: Stats & Context */}
                                    <div className="flex flex-col gap-6">
                                        {/* Mastery Card */}
                                        <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5 flex flex-col gap-4 shadow-lg">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-white font-bold">Session Mastery</h4>
                                                <span className="text-green-400 font-bold text-sm bg-green-900/20 px-2 py-0.5 rounded">+50 XP</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 flex flex-col items-center gap-1 p-3 bg-[#0f1823] rounded-xl border border-white/5">
                                                    <span className="text-2xl font-bold text-white">12</span>
                                                    <span className="text-xs text-slate-400">Mastered</span>
                                                </div>
                                                <div className="flex-1 flex flex-col items-center gap-1 p-3 bg-[#0f1823] rounded-xl border border-white/5">
                                                    <span className="text-2xl font-bold text-white">8</span>
                                                    <span className="text-xs text-slate-400">To Review</span>
                                                </div>
                                            </div>
                                            <button className="w-full py-3 rounded-xl border border-[#135bec]/30 text-[#135bec] font-bold text-sm hover:bg-[#135bec]/10 transition-colors">
                                                View Detailed Stats
                                            </button>
                                        </div>

                                        {/* Next Up Hint */}
                                        <div className="bg-gradient-to-br from-[#1a2332] to-[#0f1823] rounded-2xl p-6 border border-white/5 relative overflow-hidden group cursor-pointer hover:border-[#135bec]/30 transition-all">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <span className="material-symbols-outlined text-[80px] text-white">headphones</span>
                                            </div>
                                            <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Up Next</h5>
                                            <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#135bec] transition-colors">Listen to Podcast</h4>
                                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">Continue with an AI-generated audio summary of Chapter 2: Nodes & Clusters.</p>
                                            <div className="flex items-center gap-2 text-[#135bec] text-sm font-bold">
                                                <span>Start Playing</span>
                                                <span className="material-symbols-outlined text-lg">play_circle</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab !== 'microlearning' && (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-64 flex flex-col items-center justify-center text-slate-500 bg-[#1a2332]/50 rounded-2xl border border-white/5 border-dashed"
                                >
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">construction</span>
                                    <p>Content for {activeTab} is coming soon.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Related Resources */}
                    <div className="mt-8 pt-8 border-t border-slate-700/50">
                        <h3 className="text-2xl font-bold text-white font-grotesk mb-6">Recommended for you</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Advanced Docker Security", author: "Sarah Connor", label: "12m", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7sVjuzY2pLWFGg3WzaePxdLSt6mmoYd4LXslpCzJzWz7wadRnbsa2FZIc4R-rUkWtSgtnt-zWbkOWUWtxAeLON8DLIo-ekH5qaIQHxnZkQKrc2UeIok-56LRd61tlhIlf1dnuAFMpraMOyIQ66dEPtvEp032CvTomPPZsOH-4sYqHI0qsfpTaoq21P_Qo2R8qc74sEIqR3iNdO_kV6il7MKBmHsKPjH_NEJvWOvYcGPxumiKeAbHFYxzXwo5kiMYU44oMQefZM4" },
                                { title: "Serverless Patterns", author: "Mike Ross", label: "45m", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsvei4fclJEBjkPvHmmf0SocUy1kDqTLTtSzr6oEJR6fZ84zhHKJirpp_m-4g0x4lrX04S4j_9mBbghaHJW72PAZstastpv_w_Dl-Wv7UPo02cW90bHmIVuU6c5eGt6QWaPhDhrsexZc4SiHOvkMwbFcvaU7EHQuaIomRwfpGpF_F1dRsRswQcBy8w1hjXs6a9svRv7T3D8xRurZHjntmL7OI0GoLwIudlSp-th4f1mZvVuf0ujMMCfj3davvm5jhDDKpfXexeR5k" },
                                { title: "Kubernetes Best Practices", author: "Google Cloud", label: "PDF", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEZe2-LRx7yRTEeNpQR0NloeLbOlMItUIzw5ztCzqAWHZ8YRreWjaqPxtm6tRN7Klkf3DluxNvGPEe2weWGm2EoYSifLP4t_lbw2tW8I_f_4pDkY3iazXU5Uy9fiY7o3FkW17JAcin-5b8rfPOhh4CHQXD6btmgq4QrcWcaRrbBLSZXbVHUuSlCjqytKxUJZbM2no26cRWIK8y0QATExwqjPZJfplg1udWHRu_jAel3o2HiRsCDVSIjdv8kCd4ZyGY8SKro06-RxI" },
                                { title: "Cloud Networking Exam", author: "ITS Training", label: "Quiz", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkpitO_6G-XLRgSwQYZrjfWqABNq0LnS2yw_Xd_G93gdnjX82w2Pm4zZX99fCifGPMraevBEXy1BCxjJV8c-tvXEJTzz0pn6VHMxd_LVVAZNwn6l_xBH8c2HUZu-kS9UbvPBMgzlRBzdhNXj-PhF-gb-e9itNEqI3l42Nl3Vav7DzeeXTHE2GMdg0bG9S800nOw-QrEufTcvJpl3EURu6YjyLV75ODttG8BaebRiaNvbK6luHB3uhiXLo3U1OjaY6zf_rxnjtPj8" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-3 group cursor-pointer">
                                    <div className="aspect-video w-full rounded-xl bg-center bg-cover relative overflow-hidden border border-white/5" style={{ backgroundImage: `url('${item.img}')` }}>
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs text-white font-medium backdrop-blur-sm">{item.label}</div>
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold leading-tight mb-1 group-hover:text-[#135bec] transition-colors line-clamp-1">{item.title}</h5>
                                        <p className="text-slate-400 text-xs">{item.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Action Button: Chat with Book */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="group flex items-center gap-3 pl-4 pr-2 py-2 bg-[#135bec] hover:bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-900/50 transition-all hover:scale-105 active:scale-95">
                    <div className="flex flex-col items-start mr-1">
                        <span className="font-bold text-sm leading-none mb-0.5">Chat with Book</span>
                        <span className="text-[10px] text-blue-200 leading-none">AI Persona Active</span>
                    </div>
                    <div className="size-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30">
                        <span className="material-symbols-outlined text-2xl">smart_toy</span>
                    </div>
                </button>
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
