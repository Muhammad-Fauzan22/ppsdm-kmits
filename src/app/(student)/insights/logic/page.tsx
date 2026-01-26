"use client";

import React from 'react';

export default function AITransparencyPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] font-[family-name:var(--font-manrope)] text-white overflow-hidden h-screen flex">
            {/* SideNavBar (Mock - Visual only based on template, assuming layout handles real sidebar) */}
            <aside className="w-20 lg:w-64 h-full border-r border-[#3b3b54] bg-[#111118] flex flex-col justify-between shrink-0 transition-all duration-300 hidden lg:flex">
                <div className="flex flex-col gap-6 p-4">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 bg-[#1313ec]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcrc489jDxvEwBneDKCI4vn9lpwTV0Ni_FzunmL_tLCXUm6TKRQlqZscYjKBXiS3p9JlRqjov2P-v-oueDd_q6CFwiR1npshLJg4bSTAUgvt65VfoVGQ5VS7vUE_yNJPWqWKj1sU_Qzrc7m_ewJjoLpfKv-nuRTiyGld5YYCwJVs7YCMs4krxoUsEI5HkJ6z8euCnOM1POG5M2T9XwmYR_7TMMJwAKYgOr8qGWfKNAdZ7j6mLbHgNJxZgaVqd0NUVXVilEo8GPAoA")' }}></div>
                        <div className="hidden lg:flex flex-col">
                            <h1 className="text-white text-base font-bold leading-normal">PPSDM KMM</h1>
                            <p className="text-[#9d9db9] text-xs font-normal leading-normal">Growth Platform</p>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        <a className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white">dashboard</span>
                            <span className="hidden lg:block text-[#9d9db9] group-hover:text-white text-sm font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white">description</span>
                            <span className="hidden lg:block text-[#9d9db9] group-hover:text-white text-sm font-medium">Assessments</span>
                        </a>
                        {/* Active Link */}
                        <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#1c1c27] border border-[#3b3b54]/50 shadow-sm" href="#">
                            <span className="material-symbols-outlined text-[#1313ec]">psychology</span>
                            <span className="hidden lg:block text-white text-sm font-medium">Insights</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white">school</span>
                            <span className="hidden lg:block text-[#9d9db9] group-hover:text-white text-sm font-medium">Courses</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white">settings</span>
                            <span className="hidden lg:block text-[#9d9db9] group-hover:text-white text-sm font-medium">Settings</span>
                        </a>
                    </nav>
                </div>
                {/* User Profile (Mini) */}
                <div className="p-4 border-t border-[#3b3b54]">
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBhE5Zzb5NmkuJYY-yXsaQ8zyjWVdAGpssHrCOq3iO66ewTWju1wb7WJ6HLQzs2jKpX9k1WoBBZvJ-emPxqdzAa5-rX0qj5ETU5TpzlkyPTMxcpyYQIgb0Yu02BUrHC_jZ5Hgn8I4MrNQzAYvv67f3z1P4XVch3FF5Vi3oeE0BSRR9vZzblkXJyiVwtrDf9ZrD3Ed3M1ppLTzBv52MQEYv0v3ASat2H5bIYNQtWSSGftPiPy6dkTuFByDsgw9Ks07w2Pox_v4WyLAo")' }}></div>
                        <div className="hidden lg:block">
                            <p className="text-white text-sm font-medium">Alex Morgan</p>
                            <p className="text-[#9d9db9] text-xs">Pro Member</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Bar with Breadcrumbs & Title */}
                <header className="shrink-0 px-6 py-5 lg:px-10 border-b border-[#3b3b54]/50 bg-[#101022] z-10">
                    <div className="max-w-[1600px] mx-auto w-full">
                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <a className="text-[#9d9db9] text-sm font-medium hover:text-white transition-colors" href="#">Home</a>
                            <span className="text-[#9d9db9] text-sm font-medium">/</span>
                            <a className="text-[#9d9db9] text-sm font-medium hover:text-white transition-colors" href="#">Insights</a>
                            <span className="text-[#9d9db9] text-sm font-medium">/</span>
                            <span className="text-white text-sm font-medium">XAI Logic Explorer</span>
                        </div>
                        {/* Page Heading & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-white text-3xl font-bold tracking-tight">AI Logic Explorer</h2>
                                <p className="text-[#9d9db9] text-base">Transparency regarding your "Senior Data Analyst" path recommendation.</p>
                            </div>
                            {/* Stats / Trust Score */}
                            <div className="flex items-center gap-4 bg-[#1c1c27] border border-[#3b3b54] rounded-lg p-3 px-5 shadow-lg">
                                <div className="p-2 rounded-full bg-[#1313ec]/10 text-[#1313ec]">
                                    <span className="material-symbols-outlined">verified_user</span>
                                </div>
                                <div>
                                    <p className="text-[#9d9db9] text-xs font-medium uppercase tracking-wider">Data Trust Score</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-white text-xl font-bold leading-none">92/100</span>
                                        <span className="text-[#0bda68] text-xs font-medium">+5%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:px-10 bg-[#101022]">
                    <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
                        {/* LEFT COLUMN: Recommendation Context & Details (3 Cols) */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            {/* Active Recommendation Card */}
                            <div className="bg-[#1c1c27] border border-[#3b3b54] rounded-xl overflow-hidden shadow-lg flex flex-col">
                                <div className="relative h-32 bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzTGUP2fR1dbQcLSYtn9ZCmuIkp8wFBb9YhuTnesWhMOyJ1zjUJNVw6_bc0dPwhU1PdUA9i7qo0NBAjDC58kZLYb9ld8wxxkFbuHwlEsSjY8srZbCcSc0_smcEV9TSRwyYIrZwlmL2dxV_UeU72Tv6rsmPTyPjusZagoLJ0EY4evtK6Qmj16_K1BLAM2j9HcHlffOwU6bolFrTsDz3gpg2IShC7v8itxRELlKpzkhX4UVpBKfMBIyTwQUyLu0LhJhSwIoU5Do2gI0")' }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c27] to-transparent"></div>
                                    <div className="absolute bottom-3 left-4 right-4">
                                        <span className="inline-flex items-center rounded-md bg-[#1313ec]/20 px-2 py-1 text-xs font-medium text-[#1313ec] ring-1 ring-inset ring-[#1313ec]/30 mb-2">Top Match</span>
                                        <h3 className="text-white text-lg font-bold leading-tight">Senior Data Analyst</h3>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[#9d9db9] text-sm">Confidence Match</span>
                                            <span className="text-white font-bold text-sm">88%</span>
                                        </div>
                                        <div className="w-full bg-[#3b3b54] rounded-full h-1.5">
                                            <div className="bg-[#1313ec] h-1.5 rounded-full" style={{ width: '88%' }}></div>
                                        </div>
                                    </div>
                                    <p className="text-[#9d9db9] text-sm leading-relaxed">
                                        This path was selected because your Python assessment scores align with current market demand in FinTech.
                                    </p>
                                    <button className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors">
                                        View Career Details
                                    </button>
                                </div>
                            </div>
                            {/* Key Contributors List */}
                            <div className="bg-[#1c1c27] border border-[#3b3b54] rounded-xl p-5 flex flex-col gap-4">
                                <h4 className="text-white text-sm font-bold uppercase tracking-wider">Top Contributors</h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                            <span className="material-symbols-outlined text-[20px]">school</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-medium">Skills Assessment</p>
                                            <p className="text-[#9d9db9] text-xs">Score: 94/100</p>
                                        </div>
                                        <span className="text-purple-400 text-sm font-bold">+40%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                            <span className="material-symbols-outlined text-[20px]">trending_up</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-medium">Market Demand</p>
                                            <p className="text-[#9d9db9] text-xs">High Growth Sector</p>
                                        </div>
                                        <span className="text-blue-400 text-sm font-bold">+35%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                            <span className="material-symbols-outlined text-[20px]">interests</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-medium">Personal Interest</p>
                                            <p className="text-[#9d9db9] text-xs">Based on surveys</p>
                                        </div>
                                        <span className="text-emerald-400 text-sm font-bold">+25%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CENTER COLUMN: Main Visualization (6 Cols) */}
                        <div className="lg:col-span-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white text-lg font-bold">Decision Logic Flow</h3>
                                <div className="flex items-center gap-2">
                                    <button className="text-xs font-medium text-[#9d9db9] hover:text-white flex items-center gap-1 bg-[#1c1c27] px-2 py-1 rounded border border-[#3b3b54]">
                                        <span className="material-symbols-outlined text-[16px]">refresh</span> Reset View
                                    </button>
                                </div>
                            </div>
                            {/* Flow Diagram Container */}
                            <div className="flex-1 bg-[#1c1c27] border border-[#3b3b54] rounded-xl p-6 relative min-h-[500px] flex items-center justify-center overflow-hidden">
                                {/* Background Grid/Effect */}
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b3b54 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                {/* SVG for Connecting Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minWidth: '600px' }}>
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.6 }} />
                                            <stop offset="100%" style={{ stopColor: '#1313ec', stopOpacity: 0.8 }} />
                                        </linearGradient>
                                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
                                            <stop offset="100%" style={{ stopColor: '#1313ec', stopOpacity: 0.8 }} />
                                        </linearGradient>
                                        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.6 }} />
                                            <stop offset="100%" style={{ stopColor: '#1313ec', stopOpacity: 0.8 }} />
                                        </linearGradient>
                                    </defs>
                                    {/* Paths from Inputs to Center */}
                                    <path className="flow-line" d="M 150 100 C 250 100, 250 250, 380 250" fill="none" stroke="url(#grad1)" strokeWidth="4" />
                                    <path className="flow-line" d="M 150 250 C 250 250, 250 250, 380 250" fill="none" stroke="url(#grad2)" strokeWidth="6" />
                                    <path className="flow-line" d="M 150 400 C 250 400, 250 250, 380 250" fill="none" stroke="url(#grad3)" strokeWidth="3" />
                                    {/* Path from Center to Output */}
                                    <path d="M 460 250 C 550 250, 550 250, 650 250" fill="none" stroke="#1313ec" strokeWidth="8" />
                                </svg>
                                {/* Nodes Layout */}
                                <div className="grid grid-cols-3 w-full h-full z-10 relative gap-8 items-center justify-items-center" style={{ minWidth: '600px' }}>
                                    {/* Column 1: Inputs */}
                                    <div className="flex flex-col justify-between h-full py-12 gap-12 w-48">
                                        {/* Node 1 */}
                                        <div className="bg-[#2a2a35] border border-purple-500/30 p-4 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:border-purple-500 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-purple-300 font-bold text-sm">Skills</p>
                                                <span className="text-xs bg-purple-500/20 text-purple-200 px-1.5 rounded">40%</span>
                                            </div>
                                            <p className="text-[#9d9db9] text-xs">Python, SQL, Tableau</p>
                                        </div>
                                        {/* Node 2 */}
                                        <div className="bg-[#2a2a35] border border-blue-500/30 p-4 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-500 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-blue-300 font-bold text-sm">Market</p>
                                                <span className="text-xs bg-blue-500/20 text-blue-200 px-1.5 rounded">35%</span>
                                            </div>
                                            <p className="text-[#9d9db9] text-xs">Job growth in Q3</p>
                                        </div>
                                        {/* Node 3 */}
                                        <div className="bg-[#2a2a35] border border-emerald-500/30 p-4 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-emerald-500 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-emerald-300 font-bold text-sm">Interests</p>
                                                <span className="text-xs bg-emerald-500/20 text-emerald-200 px-1.5 rounded">25%</span>
                                            </div>
                                            <p className="text-[#9d9db9] text-xs">Preference: Remote</p>
                                        </div>
                                    </div>
                                    {/* Column 2: Processing */}
                                    <div className="flex items-center justify-center">
                                        <div className="size-24 rounded-full bg-[#1c1c27] border-2 border-[#1313ec] shadow-[0_0_30px_rgba(19,19,236,0.4)] flex flex-col items-center justify-center z-20 relative">
                                            <span className="material-symbols-outlined text-[#1313ec] text-3xl">neurology</span>
                                            <p className="text-[10px] font-bold text-white mt-1">AI LOGIC</p>
                                            {/* Pulsing ring */}
                                            <div className="absolute inset-0 rounded-full border border-[#1313ec] animate-ping opacity-20"></div>
                                        </div>
                                    </div>
                                    {/* Column 3: Output */}
                                    <div className="flex items-center justify-center w-48">
                                        <div className="bg-[#1313ec]/10 border border-[#1313ec] p-5 rounded-xl text-center w-full shadow-[0_0_20px_rgba(19,19,236,0.2)]">
                                            <div className="bg-[#1313ec] size-10 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                                                <span className="material-symbols-outlined">star</span>
                                            </div>
                                            <p className="text-white font-bold text-sm mb-1">Recommendation</p>
                                            <p className="text-[#1313ec] text-lg font-black">Data Analyst</p>
                                            <div className="mt-3 text-xs text-[#9d9db9] bg-[#101022]/50 py-1 px-2 rounded">
                                                Match Score: 92
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Controls (3 Cols) */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            <div className="bg-[#1c1c27] border border-[#3b3b54] rounded-xl p-6 flex flex-col h-full">
                                <div className="mb-6">
                                    <h3 className="text-white text-lg font-bold mb-1">Fine-tune Model</h3>
                                    <p className="text-[#9d9db9] text-sm">Adjust weights to see how the recommendation changes.</p>
                                </div>
                                <div className="flex flex-col gap-8 flex-1">
                                    {/* Slider 1 */}
                                    <div className="flex flex-col gap-3 group">
                                        <div className="flex justify-between items-center">
                                            <label className="text-white text-sm font-medium flex items-center gap-2">
                                                <span className="material-symbols-outlined text-purple-400 text-lg">school</span>
                                                Skills Importance
                                            </label>
                                            <span className="text-xs font-bold text-white bg-[#3b3b54] px-2 py-0.5 rounded">High</span>
                                        </div>
                                        <input className="w-full h-1 bg-[#3b3b54] rounded-lg appearance-none cursor-pointer accent-purple-500" max="100" min="0" type="range" defaultValue="80" />
                                        <div className="flex justify-between text-[10px] text-[#9d9db9] uppercase">
                                            <span>Low</span>
                                            <span>Critical</span>
                                        </div>
                                    </div>
                                    {/* Slider 2 */}
                                    <div className="flex flex-col gap-3 group">
                                        <div className="flex justify-between items-center">
                                            <label className="text-white text-sm font-medium flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-400 text-lg">currency_exchange</span>
                                                Salary Weight
                                            </label>
                                            <span className="text-xs font-bold text-white bg-[#3b3b54] px-2 py-0.5 rounded">Med</span>
                                        </div>
                                        <input className="w-full h-1 bg-[#3b3b54] rounded-lg appearance-none cursor-pointer accent-blue-500" max="100" min="0" type="range" defaultValue="50" />
                                        <div className="flex justify-between text-[10px] text-[#9d9db9] uppercase">
                                            <span>Low</span>
                                            <span>Critical</span>
                                        </div>
                                    </div>
                                    {/* Slider 3 */}
                                    <div className="flex flex-col gap-3 group">
                                        <div className="flex justify-between items-center">
                                            <label className="text-white text-sm font-medium flex items-center gap-2">
                                                <span className="material-symbols-outlined text-emerald-400 text-lg">public</span>
                                                Remote Work
                                            </label>
                                            <span className="text-xs font-bold text-white bg-[#3b3b54] px-2 py-0.5 rounded">Low</span>
                                        </div>
                                        <input className="w-full h-1 bg-[#3b3b54] rounded-lg appearance-none cursor-pointer accent-emerald-500" max="100" min="0" type="range" defaultValue="20" />
                                        <div className="flex justify-between text-[10px] text-[#9d9db9] uppercase">
                                            <span>Low</span>
                                            <span>Critical</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-[#3b3b54]">
                                    <div className="flex items-center gap-2 mb-4 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                                        <span className="material-symbols-outlined text-yellow-500">lightbulb</span>
                                        <p className="text-xs text-yellow-100">Adjusting weights will regenerate your career roadmap.</p>
                                    </div>
                                    <button className="w-full py-3 bg-[#1313ec] hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-[#1313ec]/25 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">autorenew</span>
                                        Recalculate Logic
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
          .flow-line {
              stroke-dasharray: 10;
              animation: dash 30s linear infinite;
          }
          @keyframes dash {
              to {
                  stroke-dashoffset: -1000;
              }
          }
           input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            margin-top: -6px;
            box-shadow: 0 0 4px rgba(0,0,0,0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #3b3b54;
            border-radius: 2px;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
            </main>
        </div>
    );
}
