"use client";

// Prevent static generation - this page requires runtime data
export const dynamic = 'force-dynamic';

import React from 'react';

export default function EmployabilityIndexPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] font-[family-name:var(--font-public-sans)] text-slate-900 dark:text-white transition-colors duration-200 min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#282839] bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md px-4 lg:px-10 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between whitespace-nowrap">
                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                        <div className="size-8 flex items-center justify-center bg-[#1313ec] rounded-lg text-white">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8 items-center">
                        <div className="hidden md:flex items-center gap-9">
                            <a className="text-slate-600 dark:text-slate-300 hover:text-[#1313ec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Portfolio</a>
                            <a className="text-slate-600 dark:text-slate-300 hover:text-[#1313ec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Skills</a>
                            <a className="text-slate-600 dark:text-slate-300 hover:text-[#1313ec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Experience</a>
                            <a className="text-slate-600 dark:text-slate-300 hover:text-[#1313ec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Verify</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs font-bold">Alex Morgan</span>
                                <span className="text-[10px] text-slate-500 dark:text-[#9d9db9]">Candidate ID: 8842</span>
                            </div>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-slate-100 dark:ring-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcxqZckdaqIW71_DrWhQBG6_yJ8_Q3bszlg0ncavAUj-Sj-on14JCHGkEsTO_OLD1QwfIWTqqf7FbrgXRoPS65dol-kecFwp-0TG6dwi1J5Y5EDMgzrpv0m_vD4mZ4CYMLjs7UadDqJ9QeqpeGfIC3MxhvGVOAdr-Qvf8tD-XnnWYM3uhRE04UYhmPQFpCgdonOglR5liN0Gs4ZS-7bp57AlpsibG8WigHs4Dp5G8S2qM0-TMWPz3JMNsHpvyah6Oy_HGtzdYndww")' }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl flex flex-col gap-8">
                    {/* Page Heading & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white text-slate-900 leading-tight">Global Employability Index</h1>
                            <p className="text-slate-600 dark:text-[#9d9db9] text-base leading-relaxed">Standardized scoring validated by PPSDM KMM & Industry Partners. This record is immutable and verified on-chain.</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-white dark:bg-[#282839] hover:bg-slate-50 dark:hover:bg-[#32324a] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-transparent shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span>Report</span>
                            </button>
                            <button className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-[#1313ec] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#1313ec]/20 hover:shadow-[#1313ec]/40">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                                <span>Share Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Hero Section: Score & Verification */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Score Card (Span 2) */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#1c1c27] rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-[#282839] relative overflow-hidden group flex flex-col justify-center">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[200px] text-slate-900 dark:text-white select-none">verified_user</span>
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                {/* Circular Gauge */}
                                <div className="relative size-48 md:size-56 flex-none">
                                    {/* Track */}
                                    <div className="absolute inset-0 rounded-full border-[16px] border-slate-100 dark:border-[#282839]"></div>
                                    {/* Progress (Conic Gradient) */}
                                    <div className="absolute inset-0 rounded-full border-[16px] border-transparent" style={{ background: 'conic-gradient(#1313ec 87%, transparent 0) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', transform: 'rotate(-90deg)' }}>
                                    </div>
                                    {/* Inner Text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white">87</span>
                                        <span className="text-sm md:text-base font-medium text-slate-500 dark:text-[#9d9db9] mt-1 uppercase tracking-wide">Score</span>
                                    </div>
                                </div>
                                {/* Text Content */}
                                <div className="flex flex-col justify-center flex-1 gap-4 text-center md:text-left w-full">
                                    <div>
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                            <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified
                                            </span>
                                            <span className="text-slate-400 text-xs font-mono bg-slate-100 dark:bg-[#282839] px-2 py-1 rounded select-all cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ID: 0x71...3A</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white text-slate-900">Excellent Proficiency</h3>
                                        <p className="text-slate-600 dark:text-[#9d9db9] text-sm md:text-base leading-relaxed">
                                            Candidate ranks in the <strong>top 5%</strong> of the Global Employability Index. Verified holistic performance across technical and soft skill domains by industry standards.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
                                        <div className="bg-slate-50 dark:bg-[#222230] border border-slate-100 dark:border-[#2d2d40] px-5 py-3 rounded-lg min-w-[120px]">
                                            <p className="text-[10px] text-slate-500 dark:text-[#9d9db9] uppercase font-bold tracking-wider mb-1">Global Rank</p>
                                            <p className="font-bold text-xl dark:text-white text-slate-900">Top 5%</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-[#222230] border border-slate-100 dark:border-[#2d2d40] px-5 py-3 rounded-lg min-w-[120px]">
                                            <p className="text-[10px] text-slate-500 dark:text-[#9d9db9] uppercase font-bold tracking-wider mb-1">Valid Until</p>
                                            <p className="font-bold text-xl dark:text-white text-slate-900">Dec 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Verification / QR Card */}
                        <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#282839] flex flex-col items-center justify-center text-center gap-5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#1313ec]"></div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Employer Verification</h3>
                                <p className="text-xs text-slate-500 dark:text-[#9d9db9] mt-1">Scan for instant validity check</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-lg border border-slate-100 dark:border-none group-hover:scale-105 transition-transform duration-300">
                                {/* QR Code Placeholder */}
                                <img alt="Verification QR Code" className="size-36 mix-blend-multiply dark:mix-blend-normal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5uu7HCxT7NNY1zzPDOVd8O64RDJdxWIPozJ2D-uqSMI8mw5vUAn-SeHNIZSzf1LkYo-ScXwj2MJgMvIbcvfoBHFgdTn77dim_rUDzcPonHTe812ByEY83ZQ0hnO54zTx2uRVZ7vB--wmEMEBzBGUnGg4sMsuqRNjYXenp_j3BiB04gIFTXmDyNxuT4t89msa7QFZJ_HXJrWQN0Mgpw7T_0ipzkzZy1exVOEo46NAvpQNNulLXyMntKwU-Kj0aSvt1crKQeAZR0PU" />
                            </div>
                            <button className="w-full mt-2 bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#32324a] text-slate-700 dark:text-white text-sm font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:bg-[#1313ec] group-hover:text-white">
                                <span className="material-symbols-outlined text-lg">lock</span>
                                Verify on Blockchain
                            </button>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Soft Skills Chart */}
                        <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#282839] flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <span className="material-symbols-outlined">psychology</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">Soft Skills</h3>
                                    <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Psychometric Assessment</p>
                                </div>
                            </div>
                            <div className="space-y-6 flex-1">
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">Leadership</span>
                                        <span className="text-[#1313ec] font-bold">92%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1313ec] rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">Communication</span>
                                        <span className="text-[#1313ec] font-bold">88%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1313ec] rounded-full transition-all duration-1000" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">Adaptability</span>
                                        <span className="text-[#1313ec] font-bold">95%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1313ec] rounded-full transition-all duration-1000" style={{ width: '95%' }}></div>
                                    </div>
                                </div>
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">Teamwork</span>
                                        <span className="text-[#1313ec] font-bold">85%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-[#282839] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1313ec] rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Hard Skills Chart */}
                        <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#282839] flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined">terminal</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">Technical Skills</h3>
                                    <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Practical Proficiency</p>
                                </div>
                            </div>
                            <div className="space-y-6 flex-1">
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">Python / Data Analysis</span>
                                        <span className="text-[#1313ec] font-bold">Advanced</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-slate-100 dark:bg-[#282839] rounded-full"></div>
                                    </div>
                                </div>
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">System Design</span>
                                        <span className="text-[#1313ec] font-bold">Intermediate</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-slate-100 dark:bg-[#282839] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-slate-100 dark:bg-[#282839] rounded-full"></div>
                                    </div>
                                </div>
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">Project Management</span>
                                        <span className="text-[#1313ec] font-bold">Advanced</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-slate-100 dark:bg-[#282839] rounded-full"></div>
                                    </div>
                                </div>
                                {/* Item */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-700 dark:text-slate-300">Blockchain Arch.</span>
                                        <span className="text-[#1313ec] font-bold">Expert</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                        <div className="h-2 flex-1 bg-[#1313ec] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Experience Timeline */}
                        <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#282839] flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 flex items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined">work_history</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">Verified Experience</h3>
                                    <p className="text-xs text-slate-500 dark:text-[#9d9db9]">On-Chain History</p>
                                </div>
                            </div>
                            <div className="relative space-y-8 flex-1 pl-2">
                                {/* Vertical Line */}
                                <div className="absolute left-[11px] top-3 bottom-4 w-0.5 bg-slate-100 dark:bg-[#282839]"></div>
                                {/* Item 1 */}
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-[#1c1c27] bg-[#1313ec] shadow-sm z-10"></div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Frontend Engineer Intern</h4>
                                    <p className="text-xs text-slate-500 dark:text-[#9d9db9] mt-0.5">TechCorp Inc. • 6 Mos</p>
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded border border-green-500/20">
                                        <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified
                                    </div>
                                </div>
                                {/* Item 2 */}
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-[#1c1c27] bg-slate-300 dark:bg-slate-600 shadow-sm z-10"></div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Research Assistant</h4>
                                    <p className="text-xs text-slate-500 dark:text-[#9d9db9] mt-0.5">University Lab • 1 Year</p>
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded border border-green-500/20">
                                        <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified
                                    </div>
                                </div>
                                {/* Item 3 */}
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-[#1c1c27] bg-slate-300 dark:bg-slate-600 shadow-sm z-10"></div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hackathon Winner</h4>
                                    <p className="text-xs text-slate-500 dark:text-[#9d9db9] mt-0.5">Global Tech Summit • 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Partners Banner */}
                    <div className="w-full pt-10 border-t border-slate-200 dark:border-[#282839]">
                        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-[#585870] mb-8">Validated by Industry Partners</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            {/* Textual Logo Representations */}
                            <div className="text-2xl font-bold dark:text-white text-slate-800 tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined">apartment</span>TECH_CORP
                            </div>
                            <div className="text-2xl font-serif italic dark:text-white text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined">science</span>InnovateLabs
                            </div>
                            <div className="text-xl font-mono tracking-tighter dark:text-white text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined">hub</span>BLOCKCHAIN_ALLIANCE
                            </div>
                            <div className="text-2xl font-black dark:text-white text-slate-800 flex items-center gap-1">
                                <span className="material-symbols-outlined">rocket_launch</span>FUTURE<span className="text-[#1313ec]">WORKS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
