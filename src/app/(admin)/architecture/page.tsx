"use client";

import React from 'react';

export default function ArchitecturePage() {
    return (
        <div className="bg-[#050510] text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden selection:bg-[#FFBD07] selection:text-black">
            <div className="relative min-h-screen flex flex-col bg-[#050510] bg-grid-pattern">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-[#27273a] bg-[#050510]/90 backdrop-blur-md sticky top-0 z-50 px-8 py-4">
                    <div className="flex items-center gap-4">
                        <div className="size-8 text-[#FFBD07] flex items-center justify-center rounded bg-[#000066]/20 border border-[#000066]/50">
                            <span className="material-symbols-outlined text-[20px]">hub</span>
                        </div>
                        <div>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-wider uppercase">PPSDM KMM</h2>
                            <p className="text-xs text-slate-400 tracking-[0.2em] uppercase">Final Product Architecture</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online</span>
                            <span className="text-[#27273a]">|</span>
                            <span>v.2.4.0-RC</span>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex h-9 items-center justify-center rounded border border-[#27273a] bg-[#101018] px-4 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-[#FFBD07] hover:text-[#FFBD07]">
                                Export Map
                            </button>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-[#FFBD07]/30" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACTHeGngR9avrqzX8JGchbLvBZaRiCWG1jLt7GlDEwAMDMVM_KSYkPLBdFMvUZn-UckarvxPoSJHxKnXSZZxty61sI5MsVjlM_nskNNXOQ2KXMgB1qYvQ92dA3A2zvY9pRJFXbw9mfTQ6mjmS9mzdWJK9FWDHg4MoomSMSLolvEQfxwyRPP2XWu1HRuAb_P7Obp64p4qL0cW_8xKulJawCt9bxb4eSMeMJ3NZqnLlgoJG3cYJ5LNbrPRFknz-5y_oxLohaGcFWdaU")' }}></div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-10 flex flex-col lg:flex-row gap-8 overflow-hidden relative">
                    {/* Left Panel: Context & Stats */}
                    <aside className="w-full lg:w-1/4 flex flex-col gap-8 z-10">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Ecosystem <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFBD07] to-yellow-200">Architecture</span>
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                A high-level visualization of the 4-layer circular ecosystem powering the PPSDM KMM platform.
                                Integrating AI alchemy with global connectivity.
                            </p>
                        </div>
                        {/* Stats Panel */}
                        <div className="bg-[#003366]/20 border border-[#000066]/40 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <span className="material-symbols-outlined text-4xl text-[#FFBD07]">analytics</span>
                            </div>
                            <h3 className="text-xs font-bold text-[#FFBD07] uppercase tracking-widest mb-6 border-b border-white/10 pb-2">System Scale</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-white tracking-tighter">26<span className="text-[#FFBD07]">+</span></span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Core Interfaces</span>
                                    <span className="text-[10px] text-green-400 font-mono mt-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">arrow_upward</span> 12% vs MVP
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-white tracking-tighter">150<span className="text-[#FFBD07]">+</span></span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Features</span>
                                    <span className="text-[10px] text-green-400 font-mono mt-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">arrow_upward</span> 45% Efficiency
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-[#101018] border border-[#27273a] text-xs text-slate-400">React.js</span>
                            <span className="px-3 py-1 rounded-full bg-[#101018] border border-[#27273a] text-xs text-slate-400">Node.js</span>
                            <span className="px-3 py-1 rounded-full bg-[#101018] border border-[#27273a] text-xs text-slate-400">Python AI</span>
                            <span className="px-3 py-1 rounded-full bg-[#101018] border border-[#27273a] text-xs text-slate-400">Solidity</span>
                        </div>
                    </aside>

                    {/* Center Panel: The Architecture Map */}
                    <section className="flex-1 flex flex-col items-center justify-center relative py-10 lg:py-0">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                            <div className="w-[600px] h-[600px] rounded-full border border-[#000066]/20 absolute animate-spin" style={{ animationDuration: '60s' }}></div>
                            <div className="w-[450px] h-[450px] rounded-full border border-[#FFBD07]/10 absolute" style={{ borderStyle: 'dashed' }}></div>
                            <div className="w-[300px] h-[300px] rounded-full border border-[#000066]/30 absolute"></div>
                            <div className="w-full h-full bg-gradient-to-b from-transparent via-[#003366]/10 to-transparent absolute"></div>
                        </div>
                        {/* Vertical Stack Diagram */}
                        <div className="relative w-full max-w-2xl flex flex-col gap-4 z-20">
                            {/* Connector Line */}
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-[#FFBD07]/50 to-transparent hidden md:block"></div>
                            {/* Layer 4: Global Connectivity */}
                            <div className="relative ml-0 md:ml-16 group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050510] border-2 border-[#FFBD07] z-10 hidden md:block group-hover:shadow-[0_0_15px_rgba(255,189,7,0.15)] transition-shadow"></div>
                                <div className="flex flex-col md:flex-row gap-4 bg-[#003366]/40 backdrop-blur-sm border border-[#000066]/50 hover:border-[#FFBD07]/50 rounded-lg p-5 shadow-lg relative overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#FFBD07]/10 to-transparent absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center justify-center bg-[#000066]/30 rounded-lg w-12 h-12 shrink-0 text-[#FFBD07]">
                                        <span className="material-symbols-outlined">public</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-bold text-lg">Global Connectivity</h3>
                                            <span className="text-[10px] font-mono text-[#FFBD07] border border-[#FFBD07]/30 px-2 py-0.5 rounded uppercase">Layer 4</span>
                                        </div>
                                        <p className="text-slate-300 text-sm mt-1">External facing interfaces connecting the ecosystem to the world.</p>
                                        <div className="flex gap-4 mt-3 text-xs text-slate-400 font-mono">
                                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#FFBD07] rounded-full"></span>API Hub</span>
                                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#FFBD07] rounded-full"></span>O2O Integration</span>
                                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-[#FFBD07] rounded-full"></span>Knowledge Exchange</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Layer 3: Engagement Layer */}
                            <div className="relative ml-0 md:ml-16 group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-600 z-10 hidden md:block group-hover:bg-[#FFBD07] transition-colors"></div>
                                <div className="flex flex-col md:flex-row gap-4 bg-[#003366]/30 backdrop-blur-sm border border-[#000066]/40 hover:border-[#FFBD07]/30 rounded-lg p-5 shadow-lg relative overflow-hidden">
                                    <div className="flex items-center justify-center bg-[#000066]/20 rounded-lg w-12 h-12 shrink-0 text-sky-300">
                                        <span className="material-symbols-outlined">trophy</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-bold text-lg">Engagement Layer</h3>
                                            <span className="text-[10px] font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded uppercase">Layer 3</span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1">Mechanisms driving user retention and active participation.</p>
                                        <div className="flex gap-4 mt-3 text-xs text-slate-500 font-mono">
                                            <span>Gamification Engine</span>
                                            <span>Community Forum</span>
                                            <span>Mentorship Bridge</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Layer 2: Zone Services */}
                            <div className="relative ml-0 md:ml-16 group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-600 z-10 hidden md:block group-hover:bg-[#FFBD07] transition-colors"></div>
                                <div className="flex flex-col md:flex-row gap-4 bg-[#003366]/30 backdrop-blur-sm border border-[#000066]/40 hover:border-[#FFBD07]/30 rounded-lg p-5 shadow-lg relative overflow-hidden">
                                    <div className="flex items-center justify-center bg-[#000066]/20 rounded-lg w-12 h-12 shrink-0 text-sky-300">
                                        <span className="material-symbols-outlined">group_work</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-bold text-lg">Zone Services</h3>
                                            <span className="text-[10px] font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded uppercase">Layer 2</span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1">Role-specific interfaces and service modules.</p>
                                        <div className="flex gap-4 mt-3 text-xs text-slate-500 font-mono">
                                            <span>Student Zone</span>
                                            <span>Supervisor Hub</span>
                                            <span>Admin Control</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Layer 1: Core Engine */}
                            <div className="relative ml-0 md:ml-16 group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050510] border-2 border-[#FFBD07] z-10 hidden md:block group-hover:shadow-[0_0_15px_rgba(255,189,7,0.15)] transition-shadow"></div>
                                <div className="flex flex-col md:flex-row gap-4 bg-gradient-to-r from-[#003366] to-[#000044] border border-[#FFBD07]/40 hover:border-[#FFBD07] rounded-lg p-5 shadow-[0_0_25px_rgba(255,189,7,0.3)] relative overflow-hidden">
                                    <div className="absolute right-0 bottom-0 opacity-10">
                                        <span className="material-symbols-outlined text-8xl text-[#FFBD07]">memory</span>
                                    </div>
                                    <div className="flex items-center justify-center bg-[#FFBD07]/20 rounded-lg w-12 h-12 shrink-0 text-[#FFBD07]">
                                        <span className="material-symbols-outlined">memory</span>
                                    </div>
                                    <div className="flex-1 z-10">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-bold text-lg">Core Engine</h3>
                                            <span className="text-[10px] font-mono text-[#FFBD07] border border-[#FFBD07]/30 px-2 py-0.5 rounded uppercase">Layer 1</span>
                                        </div>
                                        <p className="text-slate-300 text-sm mt-1">The foundational technology stack powering the ecosystem.</p>
                                        <div className="flex gap-4 mt-3 text-xs text-[#FFBD07]/80 font-mono">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">auto_awesome</span> AI Alchemy</span>
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">token</span> Blockchain Ledger</span>
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">psychology</span> XAI Module</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Panel: Thumbnails */}
                    <aside className="w-full lg:w-1/4 flex flex-col gap-6 z-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Key Interfaces</h3>
                            <span className="material-symbols-outlined text-slate-500 text-sm cursor-pointer hover:text-[#FFBD07]">view_module</span>
                        </div>
                        {/* Thumbnail 1 */}
                        <div className="group relative block rounded-xl border border-[#27273a] bg-[#101018] overflow-hidden hover:border-[#FFBD07]/50 transition-colors">
                            <div className="aspect-video w-full bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVki5ZTZqZdKpqX6npkZmNQM00H-L4KQ45W9Z0wKaaikf2HkizYwwtrwnsaSWGjfoVfJ4fuoahuAZk8m5rXd4IWg0XGhws8dK5oaAUbZfnhfqTB_weE_W3W76uw88ZxmZZ8gVdnsYsngX0hharuHWJSDJqs35qRViLt2xxOgCN60ByjVrvKE0vAITSlgGjgYQPOcKLOefy9vWKO1XqETXAAAGHkQhJ2DZBXp_6lwtwdKyQLbUAD2ZSY7BWJFcf_et2ocdpVZ4Wjv4")' }}></div>
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-[10px] px-2 py-0.5 rounded text-white font-mono">LIVE</div>
                            <div className="p-3 border-t border-[#27273a] bg-[#151525]">
                                <h4 className="text-white text-sm font-bold truncate">Holistic Dashboard</h4>
                                <p className="text-[10px] text-slate-400 mt-1">Central command for user metrics.</p>
                            </div>
                        </div>
                        {/* Thumbnail 2 */}
                        <div className="group relative block rounded-xl border border-[#27273a] bg-[#101018] overflow-hidden hover:border-[#FFBD07]/50 transition-colors">
                            <div className="aspect-video w-full bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgMc1PrQ4wp-ri2nb9zwk4Tv5l6B1djaY5n8tA8PXsHPV_w9_4FnrdX8rXLxwV-mj2po4mkNDNF_vraAGloMtVA2akWzRfaJGoPxLITSPQXanVQIATXzwUQnBhaIVoChuYF-rXeuauBemVL9DcgXJDjUjpwUQNxK67V7wDII2rxb1A76NIVc9895KbXSon_LN7Rn9U8efvgGof7cwAk1zvu_e7zJCSDLvFMPiso0-9v5Th1FxFRltZFueSbCVn4bBzFolMAk92QAA")' }}></div>
                            <div className="p-3 border-t border-[#27273a] bg-[#151525]">
                                <h4 className="text-white text-sm font-bold truncate">AI Tutor Interface</h4>
                                <p className="text-[10px] text-slate-400 mt-1">Personalized learning assistant.</p>
                            </div>
                        </div>
                        {/* Thumbnail 3 */}
                        <div className="group relative block rounded-xl border border-[#27273a] bg-[#101018] overflow-hidden hover:border-[#FFBD07]/50 transition-colors">
                            <div className="aspect-video w-full bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEtzPW_vUn7wgZHDK5iG6xiRhj3bBUvTKmWuzrl-UmYY2zdUg4pt1BxsZjg6K5DaAJ5wePxVZB3bDpWsugkPyQqce1ct6KBtTwr1TZQC0R68NwO--qUqcBHVZ4V1yJKrD0njRZPmN0lzHlZ6UCqQw7wAtmmv5hbhktsl2sS9dty28HBieXkHT4uSxLFG-TUhrVL0xtItEzjUhXO6ZGylWSTwkcB3-v9yd_ylhi8ByAouHhx3N83Ok8RUsEjyZn-Tppz3AOA_lvAOU")' }}></div>
                            <div className="p-3 border-t border-[#27273a] bg-[#151525]">
                                <h4 className="text-white text-sm font-bold truncate">Deep Analytics</h4>
                                <p className="text-[10px] text-slate-400 mt-1">Performance tracking module.</p>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>

            <style jsx global>{`
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #001122; 
        }
        ::-webkit-scrollbar-thumb {
            background: #003366; 
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #FFBD07; 
        }

        .bg-grid-pattern {
            background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
        }
         .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
