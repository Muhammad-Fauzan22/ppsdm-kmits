"use client";

import React from 'react';

export default function VisionPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] font-[family-name:var(--font-space-grotesk)] text-white overflow-x-hidden min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#1c1c2e]/60 backdrop-blur-md border-b border-[#2d2d42]">
                <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#1313ec]/20 flex items-center justify-center text-[#1313ec]">
                            <span className="material-symbols-outlined text-[24px]">deployed_code</span>
                        </div>
                        <div>
                            <h1 className="text-[#111118] dark:text-white text-lg font-bold leading-none tracking-tight">PPSDM KMM // VISION 2034</h1>
                            <p className="text-gray-400 text-xs font-mono mt-1 tracking-widest uppercase">Simulation Active • Ver 4.2.1</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-[#1313ec] text-sm font-medium border-b-2 border-[#1313ec] pb-0.5" href="#">Simulation</a>
                            <a className="text-gray-400 text-sm font-medium hover:text-[#1313ec] transition-colors" href="#">Raw Data</a>
                            <a className="text-gray-400 text-sm font-medium hover:text-[#1313ec] transition-colors" href="#">Calibration</a>
                        </nav>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#1313ec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(19,19,236,0.4)]">
                                <span className="material-symbols-outlined text-[18px]">refresh</span>
                                <span>Recalibrate Model</span>
                            </button>
                            <button className="p-2 bg-[#1c1c2e] hover:bg-[#2d2d42] text-white rounded-lg transition-colors border border-[#2d2d42]">
                                <span className="material-symbols-outlined">settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow relative w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:p-10">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)]"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Left Column: Stats & Risk */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* Profile Summary Card */}
                        <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-[#1313ec] font-bold tracking-widest uppercase mb-1">Subject ID: 8821-X</p>
                                    <h2 className="text-2xl font-bold text-[#111118] dark:text-white">Alexa Chen</h2>
                                </div>
                                <div className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-bold uppercase tracking-wider">
                                    Optimized
                                </div>
                            </div>
                            <div className="h-px bg-[#2d2d42] w-full"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase mb-1">Current Age</p>
                                    <p className="text-[#111118] dark:text-white text-lg font-mono">19</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase mb-1">Projected Age</p>
                                    <p className="text-[#1313ec] text-lg font-mono font-bold">29</p>
                                </div>
                            </div>
                        </div>

                        {/* Core Strengths Chart */}
                        <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col gap-4 flex-grow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Core Strengths 2034</h3>
                                <span className="material-symbols-outlined text-gray-500 text-sm">radar</span>
                            </div>
                            <div className="flex flex-col gap-6 mt-2">
                                {/* Custom Chart Bars */}
                                <div className="space-y-4">
                                    <div className="group">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400 font-bold tracking-wide">Logic & Reasoning</span>
                                            <span className="text-[#1313ec] font-mono">94%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#2d2d42] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-600 to-[#1313ec] w-[94%] shadow-[0_0_10px_rgba(19,19,236,0.5)]"></div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400 font-bold tracking-wide">Empathy Synthesis</span>
                                            <span className="text-blue-400 font-mono">88%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#2d2d42] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[88%]"></div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400 font-bold tracking-wide">Cognitive Resilience</span>
                                            <span className="text-indigo-400 font-mono">91%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#2d2d42] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 w-[91%]"></div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400 font-bold tracking-wide">Tech Fluency</span>
                                            <span className="text-cyan-400 font-mono">98%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#2d2d42] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[98%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Profile Slider */}
                        <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Risk Profile Analysis</h3>
                            <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
                                <span>Stability</span>
                                <span>High Growth</span>
                            </div>
                            <div className="relative h-12 flex items-center">
                                {/* Track */}
                                <div className="absolute w-full h-1 bg-[#2d2d42] rounded-full"></div>
                                {/* Active Range */}
                                <div className="absolute left-0 h-1 bg-gradient-to-r from-gray-600 to-[#1313ec] rounded-full w-[75%]"></div>
                                {/* Thumb */}
                                <div className="absolute left-[75%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#1313ec] shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-[#1313ec] rounded-full"></div>
                                </div>
                                {/* Floating Label */}
                                <div className="absolute left-[75%] -top-3 -translate-x-1/2 bg-[#1313ec] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                                    75
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                The subject shows a high propensity for risk-taking in pursuit of innovation, balanced by strong core logic.
                            </p>
                        </div>
                    </div>

                    {/* Middle Column: Holo-Stage */}
                    <div className="lg:col-span-5 flex flex-col gap-6 relative">
                        {/* Main Holo Container */}
                        <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 rounded-xl p-1 h-full min-h-[500px] flex flex-col relative overflow-hidden group">
                            {/* Tech decorations */}
                            <div className="absolute top-4 left-4 w-16 h-16 border-t border-l border-[#1313ec]/50 rounded-tl-lg z-20"></div>
                            <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-[#1313ec]/50 rounded-tr-lg z-20"></div>
                            <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-[#1313ec]/50 rounded-bl-lg z-20"></div>
                            <div className="absolute bottom-4 right-4 w-16 h-16 border-b border-r border-[#1313ec]/50 rounded-br-lg z-20"></div>

                            {/* Scanner Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#1313ec]/30 shadow-[0_0_15px_rgba(19,19,236,0.6)] z-10 animate-[scan_4s_ease-in-out_infinite]"></div>

                            {/* 3D Avatar Placeholder */}
                            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-80 mix-blend-lighten grayscale hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYFuPSv-lQ0iu78DrcI9FXodt9i06sZcOasUPHSuqrz7NyynbJJeX3xznDtXmvAhCve9jy0CnEtDOAwIFYPAQaxvNvj0dmyk650hQjpTox5RdUSVHVKVPKVsn_0BxBbuHCjnRxFqWYZ6XekUunMcJLTbsiy-INYLhK6b2RwN63UPnOO-fiTA9Ip4e2toM0DFo9YB-TX5_z1jt4oh8oF8nt8zmUiH3CZelKS6Rx-yvyqJSJlsperYyqKyLbQxbLCfnTbD9F3NXFhXU')" }}></div>

                            {/* Holographic Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#101022] via-[#1313ec]/10 to-transparent z-0"></div>

                            {/* Central Floating HUD Information */}
                            <div className="relative z-30 mt-auto p-8 text-center pb-16">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1313ec]/20 border border-[#1313ec]/30 backdrop-blur-md mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1313ec] animate-pulse"></div>
                                    <span className="text-[#1313ec] text-[10px] font-bold uppercase tracking-widest">Projection Confidence: 94%</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-[0_0_10px_rgba(19,19,236,0.5)]">Neuro-Link Specialist</h2>
                                <p className="text-blue-200/80 text-sm max-w-md mx-auto">
                                    Architects neural interfaces connecting biological cognition with quantum cloud computing arrays.
                                </p>
                            </div>

                            {/* Secondary Prediction */}
                            <div className="absolute top-8 right-8 z-30 w-48">
                                <div className="bg-[#1c1c2e] p-3 rounded-lg border border-[#2d2d42] hover:border-[#1313ec]/50 transition-colors">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Secondary Path</p>
                                    <p className="text-white font-bold text-sm">Data Ethicist</p>
                                    <div className="w-full bg-[#2d2d42] h-1 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-gray-400 h-full w-[65%]"></div>
                                    </div>
                                    <p className="text-right text-[9px] text-gray-500 mt-1">65% Match</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Timeline & Key Decisions */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 rounded-xl p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Timeline: Critical Path</h3>
                                <button className="text-[#1313ec] text-xs font-bold uppercase hover:underline">View Full Log</button>
                            </div>

                            <div className="relative pl-4 flex-grow space-y-8">
                                {/* Vertical Line */}
                                <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-[#2d2d42]"></div>

                                {/* 2034 Item (Future) */}
                                <div className="relative flex items-start gap-4">
                                    <div className="relative z-10 w-6 h-6 rounded-full bg-[#101022] border-2 border-[#1313ec] shadow-[0_0_10px_rgba(19,19,236,0.6)] flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-2 h-2 bg-[#1313ec] rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[#1313ec] font-bold text-lg">2034</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1313ec]/20 text-[#1313ec] border border-[#1313ec]/30 uppercase">Target</span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[#1c1c2e] border border-[#2d2d42]">
                                            <h4 className="text-white font-bold text-sm mb-1">Peak Career Placement</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">Appointment as Senior Architect at NeuralCore Systems.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2030 Item */}
                                <div className="relative flex items-start gap-4">
                                    <div className="relative z-10 w-6 h-6 rounded-full bg-[#1c1c2e] border-2 border-gray-600 flex items-center justify-center shrink-0 mt-1">
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-gray-300 font-bold text-base block mb-1">2030</span>
                                        <div className="p-3 rounded-lg bg-[#1c1c2e] border border-[#2d2d42]/50 opacity-80 hover:opacity-100 transition-opacity">
                                            <h4 className="text-white font-bold text-sm mb-1">Strategic Pivot</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">Shift focus from pure engineering to cognitive psychology leadership track.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2026 Item */}
                                <div className="relative flex items-start gap-4">
                                    <div className="relative z-10 w-6 h-6 rounded-full bg-[#1c1c2e] border-2 border-yellow-500/80 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                        <span className="material-symbols-outlined text-[12px] text-yellow-500">priority_high</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-gray-300 font-bold text-base block mb-1">2026</span>
                                        <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                                            <h4 className="text-yellow-100 font-bold text-sm mb-1">Critical Certification</h4>
                                            <p className="text-xs text-yellow-200/60 leading-relaxed">Advanced bio-ethics clearance required. <span className="text-white underline cursor-pointer">View requirements</span>.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2024 Item (Current) */}
                                <div className="relative flex items-start gap-4">
                                    <div className="relative z-10 w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center shrink-0 mt-1">
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-white font-bold text-base block mb-1">2024 (Now)</span>
                                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                            <h4 className="text-white font-bold text-sm mb-1">Baseline Established</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">Current academic performance and extracurricular profile ingested.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#2d2d42]">
                                <button className="w-full py-3 bg-[#1c1c2e] hover:bg-[#2d2d42] border border-[#2d2d42] hover:border-gray-500 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 group">
                                    <span>Simulate Alternative Path</span>
                                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Status Bar */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-md text-blue-400">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Growth Velocity</p>
                            <p className="text-[#111118] dark:text-white font-bold">+12.4% YoY</p>
                        </div>
                    </div>
                    <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-md text-purple-400">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Adaptability Index</p>
                            <p className="text-[#111118] dark:text-white font-bold">High (Tier 1)</p>
                        </div>
                    </div>
                    <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-md text-orange-400">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Risk Factors</p>
                            <p className="text-[#111118] dark:text-white font-bold">2 Minor Detected</p>
                        </div>
                    </div>
                    <div className="bg-[#1c1c2e]/60 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Last Sync</p>
                            <p className="text-[#111118] dark:text-white font-mono text-xs">Today, 09:41 AM</p>
                        </div>
                        <div className="h-2 w-24 bg-[#2d2d42] rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}
