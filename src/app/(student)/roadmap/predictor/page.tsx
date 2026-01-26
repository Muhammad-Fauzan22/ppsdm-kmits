"use client";

import React from 'react';

export default function CareerPredictorPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] text-slate-900 dark:text-white font-[family-name:var(--font-space-grotesk)] overflow-x-hidden min-h-screen">
            <div className="flex flex-col min-h-screen">
                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#282839] bg-white dark:bg-[#151525] px-6 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 dark:text-white text-slate-900">
                            <div className="size-6 text-[#1313ec]">
                                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 4C12.95 4 4 12.95 4 24H44C44 12.95 35.05 4 24 4ZM24 44C35.05 44 44 35.05 44 24H4C4 35.05 12.95 44 24 44Z" fill="currentColor" fillOpacity="0.2"></path>
                                    <path d="M24 8L12 30L24 40L36 30L24 8Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">PPSDM KMM</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a className="text-slate-600 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white text-sm font-medium transition-colors" href="#">Dashboard</a>
                            <a className="text-[#1313ec] dark:text-white text-sm font-medium border-b-2 border-[#1313ec] py-1" href="#">Roadmap</a>
                            <a className="text-slate-600 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white text-sm font-medium transition-colors" href="#">Community</a>
                            <a className="text-slate-600 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white text-sm font-medium transition-colors" href="#">Profile</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="bg-slate-100 dark:bg-[#282839] text-sm rounded-lg pl-10 pr-4 py-2 w-64 border-none focus:ring-1 focus:ring-[#1313ec] dark:text-white placeholder-slate-400 outline-none transition-all" placeholder="Search skills, roles..." type="text" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-[#1313ec]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhMeH4cOF9baR31DQ-Lf9yKdBZ1nvSfdc6QOi3XeIbZM1ik3npZz6QmhiYXvv2PQOAX-z5ejek0Bttod9gMurzU6mLj8qOFXxpbgu4_rb_LukuELu66yaMTrsfMMzAYJLADuMqNWzakkq_V7Ym-7Kg18ff-6jlK53bBwUnnUqLC_XiIwn1DfdmTq3P4CLwNOSPSVZsp0lyNp-VdJc1XrjL9HNn-BgQBkUlfcl8NpGLLjdbnf59N9S__psbc3-vEe_bdxkyAd4UtCc")' }}></div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden">
                    {/* Sidebar: Role Selector */}
                    <aside className="w-full md:w-80 border-r border-slate-200 dark:border-[#282839] bg-white dark:bg-[#111118] overflow-y-auto flex flex-col z-10">
                        <div className="p-6 border-b border-slate-200 dark:border-[#282839]">
                            <h3 className="text-xs font-bold text-[#9d9db9] uppercase tracking-wider mb-4">Target Roles</h3>
                            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#3b3b54] text-[#1313ec] dark:text-white py-2 rounded-lg text-sm font-medium transition-all">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add Career Path
                            </button>
                        </div>
                        <div className="flex-1 p-4 space-y-2">
                            {/* Active Role */}
                            <div className="p-3 rounded-xl bg-[#1313ec]/10 border border-[#1313ec]/30 cursor-pointer relative overflow-hidden group">
                                <div className="absolute inset-y-0 left-0 w-1 bg-[#1313ec]"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">ML Engineer</h4>
                                    <span className="bg-[#1313ec]/20 text-[#1313ec] text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative size-10 flex-none">
                                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-slate-200 dark:text-[#282839]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                            <path className="text-[#1313ec] drop-shadow-[0_0_2px_rgba(19,19,236,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="87, 100" strokeWidth="3"></path>
                                        </svg>
                                        <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-900 dark:text-white">87%</span>
                                    </div>
                                    <div className="text-xs text-[#9d9db9]">
                                        <p>High Demand</p>
                                        <p className="text-[#0bda68]">+5 New matches</p>
                                    </div>
                                </div>
                            </div>
                            {/* Other Roles */}
                            <div className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a1a2e] border border-transparent hover:border-slate-200 dark:hover:border-[#282839] cursor-pointer transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-slate-700 dark:text-slate-300 text-sm group-hover:text-[#1313ec] transition-colors">Data Scientist</h4>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative size-9 flex-none opacity-70 group-hover:opacity-100 transition-opacity">
                                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-slate-200 dark:text-[#282839]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                            <path className="text-slate-400 dark:text-slate-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="64, 100" strokeWidth="3"></path>
                                        </svg>
                                        <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[9px] font-bold text-[#9d9db9]">64%</span>
                                    </div>
                                    <div className="text-xs text-[#9d9db9]">
                                        <p>Moderate Match</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a1a2e] border border-transparent hover:border-slate-200 dark:hover:border-[#282839] cursor-pointer transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-slate-700 dark:text-slate-300 text-sm group-hover:text-[#1313ec] transition-colors">AI Research Scientist</h4>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative size-9 flex-none opacity-70 group-hover:opacity-100 transition-opacity">
                                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-slate-200 dark:text-[#282839]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                            <path className="text-slate-400 dark:text-slate-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="42, 100" strokeWidth="3"></path>
                                        </svg>
                                        <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[9px] font-bold text-[#9d9db9]">42%</span>
                                    </div>
                                    <div className="text-xs text-[#9d9db9]">
                                        <p>High Skill Gap</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Center: Visualization Engine */}
                    <section className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#151525] relative overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {/* Breadcrumbs & Heading */}
                        <div className="pt-8 px-8 pb-4">
                            <div className="flex items-center gap-2 text-sm mb-4">
                                <a className="text-[#9d9db9] hover:text-[#1313ec] transition-colors" href="#">PPSDM KMM</a>
                                <span className="text-[#9d9db9]">/</span>
                                <a className="text-[#9d9db9] hover:text-[#1313ec] transition-colors" href="#">Roadmap</a>
                                <span className="text-[#9d9db9]">/</span>
                                <span className="text-[#1313ec] dark:text-white font-medium">Career Predictor</span>
                            </div>
                            <div className="flex justify-between items-end flex-wrap gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 tracking-tight mb-2">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1313ec] to-purple-500 [text-shadow:0_0_10px_rgba(19,19,236,0.5)]">AI CAREER</span> PROJECTION
                                    </h1>
                                    <p className="text-[#9d9db9] max-w-xl">Market analysis based on your current skill mastery and industry trends.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 rounded-lg bg-white dark:bg-[#282839] text-slate-700 dark:text-white text-sm font-medium border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-[#3b3b54] transition-all">
                                        View Learning Path
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-[#1313ec] hover:bg-[#4d4dff] text-white text-sm font-bold shadow-[0_0_15px_-3px_rgba(19,19,236,0.4)] transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">update</span>
                                        Update Skill Tree
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Central Vis: Radar/Graph */}
                        <div className="flex-1 px-8 py-4 flex flex-col">
                            <div className="flex-1 relative rounded-2xl bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#282839] p-6 flex flex-col items-center justify-center overflow-hidden min-h-[400px]">
                                {/* Background Grid */}
                                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#9d9db9_1px,transparent_1px)] bg-[size:20px_20px]">
                                </div>
                                {/* Floating Label Top Left */}
                                <div className="absolute top-6 left-6 z-10">
                                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Compatibility Engine</h3>
                                    <p className="text-xs text-[#9d9db9] mt-1">Role: Machine Learning Engineer</p>
                                </div>
                                {/* Radar Chart Representation */}
                                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                                    {/* Circular Rungs */}
                                    <div className="absolute w-[80%] h-[80%] rounded-full border border-slate-200 dark:border-[#282839]"></div>
                                    <div className="absolute w-[60%] h-[60%] rounded-full border border-slate-200 dark:border-[#282839]"></div>
                                    <div className="absolute w-[40%] h-[40%] rounded-full border border-slate-200 dark:border-[#282839]"></div>
                                    <div className="absolute w-[20%] h-[20%] rounded-full border border-slate-200 dark:border-[#282839]"></div>
                                    {/* Axis Lines */}
                                    <div className="absolute w-full h-px bg-slate-200 dark:bg-[#282839]"></div>
                                    <div className="absolute w-px h-full bg-slate-200 dark:bg-[#282839]"></div>
                                    <div className="absolute w-full h-px bg-slate-200 dark:bg-[#282839] rotate-45"></div>
                                    <div className="absolute w-px h-full bg-slate-200 dark:bg-[#282839] rotate-45"></div>
                                    {/* Data Polygon (Stylized) */}
                                    <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(19,19,236,0.3)]" viewBox="0 0 400 400">
                                        <polygon fill="rgba(19, 19, 236, 0.15)" points="200,50 320,140 300,300 100,280 80,140" stroke="#1313ec" strokeWidth="2"></polygon>
                                        {/* Nodes */}
                                        <circle className="fill-[#1313ec] animate-pulse" cx="200" cy="50" r="4"></circle>
                                        <circle className="fill-[#1313ec]" cx="320" cy="140" r="4"></circle>
                                        <circle className="fill-[#1313ec]" cx="300" cy="300" r="4"></circle>
                                        <circle className="fill-[#1313ec]" cx="100" cy="280" r="4"></circle>
                                        <circle className="fill-[#1313ec]" cx="80" cy="140" r="4"></circle>
                                    </svg>
                                    {/* Labels around the chart */}
                                    <div className="absolute top-[5%] bg-white dark:bg-[#282839] px-2 py-1 rounded text-[10px] font-bold text-[#1313ec] shadow-sm border border-[#1313ec]/20">Algorithms</div>
                                    <div className="absolute right-[5%] top-[30%] bg-white dark:bg-[#282839] px-2 py-1 rounded text-[10px] font-bold text-[#1313ec] shadow-sm border border-[#1313ec]/20">Python</div>
                                    <div className="absolute right-[10%] bottom-[20%] bg-white dark:bg-[#282839] px-2 py-1 rounded text-[10px] font-bold text-[#1313ec] shadow-sm border border-[#1313ec]/20">TensorFlow</div>
                                    <div className="absolute left-[10%] bottom-[15%] bg-white dark:bg-[#282839] px-2 py-1 rounded text-[10px] font-bold text-[#9d9db9] border border-transparent">Data Ethics</div>
                                    <div className="absolute left-[5%] top-[30%] bg-white dark:bg-[#282839] px-2 py-1 rounded text-[10px] font-bold text-[#1313ec] shadow-sm border border-[#1313ec]/20">Math</div>
                                </div>
                                {/* Legend / Status */}
                                <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white/50 dark:bg-[#111118]/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 dark:border-[#282839]">
                                    <div className="flex items-center gap-2">
                                        <span className="size-3 bg-[#1313ec] rounded-full"></span>
                                        <span className="text-xs font-medium dark:text-white">Your Mastery</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="size-3 border border-slate-400 dark:border-slate-500 rounded-full border-dashed"></span>
                                        <span className="text-xs font-medium text-[#9d9db9]">Role Requirement</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Panel: Analytics */}
                    <aside className="w-full md:w-96 bg-white dark:bg-[#111118] border-l border-slate-200 dark:border-[#282839] overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
                        {/* Salary Card */}
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] dark:from-[#1a1a2e] dark:to-[#0d0d14] p-6 border border-[#1313ec]/30 shadow-[0_0_15px_-3px_rgba(19,19,236,0.4)] group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-[#1313ec]">payments</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[#9d9db9] text-sm font-medium mb-1">Est. Annual Salary</p>
                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">$85k - $110k</h2>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-[#0bda68]/10 text-[#0bda68] text-xs font-bold px-2 py-0.5 rounded border border-[#0bda68]/20">High Confidence</span>
                                    <span className="text-xs text-[#9d9db9]">Based on 12 verified skills</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#1313ec] to-[#0bda68] w-3/4"></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[10px] text-[#9d9db9]">Entry</span>
                                    <span className="text-[10px] text-white font-bold">Your Range</span>
                                    <span className="text-[10px] text-[#9d9db9]">Senior</span>
                                </div>
                            </div>
                        </div>
                        {/* Market Trend Graph */}
                        <div className="rounded-xl bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#282839] p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900">Market Demand</h3>
                                <span className="text-[#0bda68] text-xs font-bold bg-[#0bda68]/10 px-2 py-0.5 rounded">+12% YoY</span>
                            </div>
                            {/* Simple Line Chart SVG */}
                            <div className="h-32 w-full relative">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                                    {/* Grid Lines */}
                                    <line stroke="#282839" strokeDasharray="2" strokeWidth="0.5" x1="0" x2="100" y1="0" y2="0"></line>
                                    <line stroke="#282839" strokeDasharray="2" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25"></line>
                                    <line stroke="#282839" strokeDasharray="2" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50"></line>
                                    {/* Area Gradient */}
                                    <defs>
                                        <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#1313ec" stopOpacity="0.3"></stop>
                                            <stop offset="100%" stopColor="#1313ec" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,40 Q25,35 50,20 T100,5 V50 H0 Z" fill="url(#trendGradient)"></path>
                                    {/* Line */}
                                    <path d="M0,40 Q25,35 50,20 T100,5" fill="none" stroke="#1313ec" strokeLinecap="round" strokeWidth="2"></path>
                                    {/* Hover Point (Simulated) */}
                                    <circle className="fill-white stroke-[#1313ec] stroke-2" cx="50" cy="20" r="3"></circle>
                                </svg>
                                {/* Tooltip simulation */}
                                <div className="absolute top-[10%] left-[45%] bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg transform -translate-y-full -translate-x-1/2 pointer-events-none">
                                    2024: High Growth
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-[#9d9db9] font-medium uppercase tracking-wider">
                                <span>2022</span>
                                <span>2024</span>
                                <span>2026 (Est)</span>
                            </div>
                        </div>
                        {/* Skill Gap Analysis */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-[#1313ec]">bolt</span>
                                Opportunity Gaps
                            </h3>
                            <div className="bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#282839] rounded-xl p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="mt-1 p-1.5 rounded bg-[#1313ec]/20 text-[#1313ec]">
                                        <span className="material-symbols-outlined text-lg">school</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold dark:text-white text-slate-900">Reinforcement Learning</h4>
                                        <p className="text-xs text-[#9d9db9] mt-0.5">High impact on salary potential.</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#0bda68] font-bold">+15% Salary Impact</span>
                                    <button className="text-[#1313ec] hover:text-white hover:bg-[#1313ec] px-2 py-1 rounded transition-colors font-medium">Add to Plan</button>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#282839] rounded-xl p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="mt-1 p-1.5 rounded bg-orange-500/20 text-orange-500">
                                        <span className="material-symbols-outlined text-lg">groups</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold dark:text-white text-slate-900">ML Ops & Deployment</h4>
                                        <p className="text-xs text-[#9d9db9] mt-0.5">Critical for senior roles.</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#0bda68] font-bold">+8% Salary Impact</span>
                                    <button className="text-[#1313ec] hover:text-white hover:bg-[#1313ec] px-2 py-1 rounded transition-colors font-medium">Add to Plan</button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #101022; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #282839; 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #3b3b54; 
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
