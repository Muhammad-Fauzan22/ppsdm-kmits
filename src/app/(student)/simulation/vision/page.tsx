"use client";

import React from "react";
import Link from "next/link";

export default function Vision2034Page() {
    return (
        <div className="min-h-screen bg-[#080a0f] text-white font-sans overflow-hidden relative">

            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            {/* Navbar */}
            <nav className="relative z-50 border-b border-[#1F2937] px-8 py-4 bg-[#080a0f]/90 backdrop-blur flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="size-8 bg-blue-900/30 border border-blue-500 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-400">deployed_code</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-widest">PPSDM KMM // VISION 2034</h1>
                        <p className="text-[10px] text-blue-500 font-mono">SIMULATION ACTIVE • VER 4.2.1</p>
                    </div>
                </div>
                <div className="flex gap-6 text-xs text-gray-400 uppercase tracking-wider font-bold">
                    <button className="text-white border-b-2 border-blue-500 pb-1">Simulation</button>
                    <button className="hover:text-white transition-colors">Raw Data</button>
                    <button className="hover:text-white transition-colors">Calibration</button>
                </div>
                <div className="flex items-center gap-4">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all">
                        <span className="material-symbols-outlined text-sm animate-spin-slow">refresh</span> Recalibrate Model
                    </button>
                    <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">settings</span></button>
                </div>
            </nav>

            <main className="relative z-10 p-8 max-w-[1600px] mx-auto grid grid-cols-12 gap-8 h-[calc(100vh-80px)]">

                {/* Left Panel: Profile & Stats */}
                <div className="col-span-3 flex flex-col gap-6">

                    {/* Subject ID Card */}
                    <div className="bg-[#0F1218] border border-[#1F2937] p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] text-blue-500 font-bold uppercase mb-1">Subject ID: 8821-X</p>
                                <h2 className="text-2xl font-bold">Alexa Chen</h2>
                            </div>
                            <span className="bg-green-900/20 text-green-500 border border-green-900/50 text-[10px] font-bold px-2 py-1 rounded">OPTIMIZED</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase">Current Age</p>
                                <p className="text-2xl font-light">19</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase">Projected Age</p>
                                <p className="text-2xl font-bold text-blue-500">29</p>
                            </div>
                        </div>
                    </div>

                    {/* Core Strengths */}
                    <div className="bg-[#0F1218] border border-[#1F2937] p-6 rounded-2xl flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">Core Strengths 2034</h3>
                            <span className="material-symbols-outlined text-gray-600 text-sm">fingerprint</span>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Logic & Reasoning', val: 94, color: 'bg-blue-600' },
                                { label: 'Empathy Synthesis', val: 88, color: 'bg-blue-400' },
                                { label: 'Cognitive Resilience', val: 91, color: 'bg-indigo-500' },
                                { label: 'Tech Fluency', val: 98, color: 'bg-cyan-500' }
                            ].map((skill) => (
                                <div key={skill.label}>
                                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                                        <span>{skill.label}</span>
                                        <span className="text-blue-400">{skill.val}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                                        <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Profile */}
                    <div className="bg-[#0F1218] border border-[#1F2937] p-6 rounded-2xl">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-6">Risk Profile Analysis</h3>

                        <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase mb-2">
                            <span>Stability</span>
                            <span>High Growth</span>
                        </div>
                        <div className="relative h-2 bg-[#1F2937] rounded-full mb-6">
                            <div className="absolute top-1/2 -translate-y-1/2 left-[75%] size-4 bg-white border-4 border-blue-600 rounded-full shadow-[0_0_10px_#2563EB]"></div>
                            <div className="absolute -top-8 left-[75%] -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">75</div>
                        </div>

                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            The subject shows a high propensity for risk-taking in pursuit of innovation, balanced by strong core logic.
                        </p>
                    </div>

                </div>

                {/* Center: Face Visualizer */}
                <div className="col-span-5 relative flex flex-col">
                    <div className="flex-1 bg-[#0F1218] border border-[#1F2937] rounded-3xl relative overflow-hidden flex items-center justify-center group">

                        {/* Secondary Path Overlay */}
                        <div className="absolute top-8 right-8 z-20 bg-[#080a0f]/80 backdrop-blur border border-[#1F2937] p-4 rounded-xl w-48">
                            <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Secondary Path</p>
                            <p className="text-sm font-bold text-white mb-2">Data Ethicist</p>
                            <div className="w-full h-1 bg-[#1F2937] rounded-full">
                                <div className="h-full bg-gray-500 w-[65%] rounded-full"></div>
                            </div>
                            <p className="text-[8px] text-gray-500 text-right mt-1">65% Match</p>
                        </div>

                        {/* Face Projection */}
                        <div className="relative size-[400px] opacity-80 mix-blend-screen">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-50 absolute inset-0 rounded-full blur-sm" />

                            {/* Wireframe Overlay (CSS only simulation) */}
                            <div className="absolute inset-0 border border-blue-500/20 rounded-full"></div>
                            <div className="absolute inset-[10%] border border-blue-500/10 rounded-full"></div>
                            <div className="absolute inset-[20%] border border-blue-500/10 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/30"></div>
                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-500/30"></div>

                            {/* Scanning Line */}
                            <div className="absolute inset-x-0 h-1 bg-blue-500/50 blur-md top-0 animate-[scan_3s_ease-in-out_infinite]"></div>
                        </div>

                        {/* Main Title Overlay */}
                        <div className="absolute bottom-12 text-center z-20">
                            <div className="inline-block bg-blue-900/30 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/30 mb-4 backdrop-blur">
                                PROJECTION CONFIDENCE: 94%
                            </div>
                            <h2 className="text-5xl font-black text-white leading-none mb-2 tracking-tight">
                                Neuro-Link<br />Specialist
                            </h2>
                            <p className="text-sm text-gray-400 max-w-sm mx-auto">
                                Architects neural interfaces connecting biological cognition with quantum cloud computing arrays.
                            </p>
                        </div>

                        {/* Grid Overlay */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                    </div>
                </div>

                {/* Right Panel: Timeline */}
                <div className="col-span-4 flex flex-col">
                    <div className="bg-[#0F1218] border border-[#1F2937] rounded-3xl p-8 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">Timeline: Critical Path</h3>
                            <button className="text-[10px] font-bold text-blue-500 hover:text-blue-400">VIEW FULL LOG</button>
                        </div>

                        <div className="relative border-l border-[#1F2937] ml-3 pl-8 pb-10 space-y-12">

                            {/* Item 1: 2034 */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-1 size-5 rounded-full border-4 border-[#0F1218] bg-blue-600 shadow-[0_0_10px_#2563EB]"></div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-bold text-blue-500">2034</span>
                                    <span className="bg-blue-900/30 text-blue-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30">TARGET</span>
                                </div>
                                <div className="bg-[#151921] border border-[#1F2937] p-4 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer">
                                    <h4 className="font-bold text-white mb-1">Peak Career Placement</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Appointment as Senior Architect at NeuralCore Systems.</p>
                                </div>
                            </div>

                            {/* Item 2: 2030 */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-1 size-5 rounded-full border-4 border-[#0F1218] bg-gray-600"></div>
                                <span className="text-lg font-bold text-gray-300 block mb-2">2030</span>
                                <div className="bg-[#151921] border border-[#1F2937] p-4 rounded-xl hover:border-blue-500/50 transition-colors">
                                    <h4 className="font-bold text-white mb-1">Strategic Pivot</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Shift focus from pure engineering to cognitive psychology leadership track.</p>
                                </div>
                            </div>

                            {/* Item 3: 2026 */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-1 size-5 rounded-full border-4 border-[#0F1218] bg-yellow-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[10px] text-black font-bold">priority_high</span>
                                </div>
                                <span className="text-lg font-bold text-white block mb-2">2026</span>
                                <div className="bg-[#1C1810] border border-yellow-500/30 p-4 rounded-xl">
                                    <h4 className="font-bold text-yellow-500 mb-1">Critical Certification</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-2">Advanced bio-ethics clearance required.</p>
                                    <button className="text-[10px] font-bold text-white underline">View requirements</button>
                                </div>
                            </div>

                            {/* Item 4: 2024 (Now) */}
                            <div className="relative">
                                <div className="absolute -left-[39px] top-1 size-5 rounded-full border-4 border-[#0F1218] bg-white"></div>
                                <span className="text-lg font-bold text-white block mb-2">2024 (Now)</span>
                                <div className="bg-[#151921] border border-[#1F2937] p-4 rounded-xl">
                                    <h4 className="font-bold text-white mb-1">Baseline Established</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Current academic performance and extracurricular profile ingested.</p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-auto">
                            <button className="w-full bg-[#151921] hover:bg-[#1F2937] border border-[#1F2937] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                                Simulate Alternative Path <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            {/* Bottom Stats Row (Fixed) */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-[#080a0f] border-t border-[#1F2937] grid grid-cols-4 divide-x divide-[#1F2937]">
                <div className="p-4 flex items-center gap-4">
                    <div className="size-10 bg-blue-900/20 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500">trending_up</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Growth Velocity</p>
                        <p className="text-xl font-bold text-white">+12.4% YoY</p>
                    </div>
                </div>
                <div className="p-4 flex items-center gap-4">
                    <div className="size-10 bg-purple-900/20 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-500">psychology</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Adaptability Index</p>
                        <p className="text-xl font-bold text-white">High (Tier 1)</p>
                    </div>
                </div>
                <div className="p-4 flex items-center gap-4">
                    <div className="size-10 bg-yellow-900/20 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-yellow-500">warning</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Risk Factors</p>
                        <p className="text-xl font-bold text-white">2 Minor Detected</p>
                    </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Last Sync</p>
                        <p className="text-sm font-bold text-white font-mono">Today, 09:41 AM</p>
                    </div>
                    <div className="w-24 h-2 bg-[#1F2937] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[85%]"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
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
