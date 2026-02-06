"use client";

import React from 'react';

export default function MarketSyncPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] text-slate-900 dark:text-white font-[family-name:var(--font-space-grotesk)] overflow-hidden h-screen flex">
            {/* Side Navigation */}
            <aside className="w-64 h-full flex flex-col justify-between bg-[#111118] border-r border-[#282839] flex-shrink-0">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex gap-3 items-center mb-6">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeuFvLEojo4MhqMkDspvj_PzJrCl1YGgvznxeJJXJLZQx3XukQK-dO1CmJWjt6cB3iQxIizowQyzrgjshv668SbShVIAkxOQuGsJvf0r3vYCXv_4Q8YSl2uf89mpi3HijbFMGBqsB8mRR1B00Le3vz7F-JNy9BSwt_JQV0A3qT6KzS4xu6bfE5mDKVCpozmyrulsm5Ye-fH2z7i3RaZGL9ZEbtPWA98r2sXxxoRWHtmshh277abwfmK4mwOUw-WsmemT77t8ewXCA")' }}></div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-base font-bold leading-normal tracking-wide">PPSDM KMM</h1>
                            <p className="text-[#9d9db9] text-xs font-normal leading-normal">Student Portal</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#9d9db9] hover:text-white hover:bg-[#282839] transition-colors" href="#">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1313ec]/20 text-[#1313ec] border border-[#1313ec]/20" href="#">
                            <span className="material-symbols-outlined text-[#1313ec]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                            <span className="text-sm font-bold">Roadmap</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#9d9db9] hover:text-white hover:bg-[#282839] transition-colors" href="#">
                            <span className="material-symbols-outlined">library_books</span>
                            <span className="text-sm font-medium">Library</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#9d9db9] hover:text-white hover:bg-[#282839] transition-colors" href="#">
                            <span className="material-symbols-outlined">group</span>
                            <span className="text-sm font-medium">Community</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#9d9db9] hover:text-white hover:bg-[#282839] transition-colors" href="#">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </a>
                    </nav>
                </div>
                <div className="p-4 border-t border-[#282839]">
                    <div className="bg-[#282839] rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[#9d9db9] font-medium">Profile Sync</span>
                            <span className="text-xs text-green-400 font-bold">98%</span>
                        </div>
                        <div className="w-full bg-[#111118] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-400 h-full w-[98%] rounded-full"></div>
                        </div>
                        <p className="text-[10px] text-[#9d9db9]">Last sync: 2 mins ago</p>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-[#282839] bg-[#111118]/90 backdrop-blur px-8 py-4 z-20">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center gap-3 text-white">
                            <span className="material-symbols-outlined text-[#1313ec] text-3xl">hub</span>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Industry Skill Gap Mapper</h2>
                        </div>
                        <div className="hidden md:flex flex-col min-w-40 h-10 max-w-96 flex-1">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-[#282839] group focus-within:ring-2 ring-[#1313ec]/50 transition-all">
                                <div className="text-[#9d9db9] flex items-center justify-center pl-4 pr-2">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </div>
                                <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent text-white focus:outline-0 border-none h-full placeholder:text-[#9d9db9] px-2 text-sm font-normal" placeholder="Search roles, skills, or trends..." />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-green-400">Market Data: Live</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-full w-10 h-10 bg-[#282839] text-white hover:bg-[#32324a] transition-colors relative">
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                                <div className="absolute top-2 right-2 w-2 h-2 bg-[#1313ec] rounded-full border-2 border-[#282839]"></div>
                            </button>
                            <button className="flex items-center justify-center rounded-full w-10 h-10 bg-[#282839] text-white hover:bg-[#32324a] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">help</span>
                            </button>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwyW3zuZZ5LOCuyHsUv1_KlB2WBeyhTT8XAyBJacGouwzgPEPjsJNcyeisPJhidBWmOEwvXbui4ByCrNsqJdJC9CuJ2hSb-vk5KIXI8n3dRfkw6eN9ryGmBbkKRvLYhbJdNqBjGLf_Ye4xJTWXU__WfEzkTL2HOHAjxQu5Hz3ALBKOLHMgWUEinmarZ1L7nUGedDwItlPzr0CV36t1f_e8pAW5osDVlf_ixq9zGA-M2zAAqiL6PubLHVR7-NzdcDcWk7ttg2k5kE8")' }}></div>
                    </div>
                </header>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 pb-20 scroll-smooth">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                        {/* Breadcrumbs & Heading */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <a className="text-[#9d9db9] hover:text-white transition-colors" href="#">Roadmap</a>
                                <span className="text-[#9d9db9]">/</span>
                                <span className="text-white font-medium">Market Sync</span>
                            </div>
                            <div className="flex flex-wrap justify-between items-end gap-4 border-b border-[#282839] pb-6">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-white text-4xl font-bold tracking-tight">Market Sync: Gap Analysis</h1>
                                    <p className="text-[#9d9db9] text-base">Aligning your profile with <span className="text-[#1313ec] font-bold">54,000+</span> live job postings.</p>
                                </div>
                                {/* Controls */}
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <select className="appearance-none bg-[#282839] text-white pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium border border-transparent focus:border-[#1313ec] focus:ring-0 cursor-pointer">
                                            <option>Industry: Fintech</option>
                                            <option>Industry: Healthtech</option>
                                            <option>Industry: E-commerce</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9d9db9] pointer-events-none text-lg">expand_more</span>
                                    </div>
                                    <div className="relative">
                                        <select className="appearance-none bg-[#282839] text-white pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium border border-transparent focus:border-[#1313ec] focus:ring-0 cursor-pointer">
                                            <option>Role: Full Stack Dev</option>
                                            <option>Role: UI/UX Designer</option>
                                            <option>Role: Data Scientist</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9d9db9] pointer-events-none text-lg">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Main Dashboard Grid */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Left Column: Analysis (8 cols) */}
                            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                                {/* Hero Chart Card */}
                                <div className="bg-[#181824] border border-[#282839] rounded-xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#1313ec]">bar_chart</span>
                                            Top 5 In-Demand Skills vs. Your Mastery
                                        </h3>
                                        <div className="flex gap-4 text-xs font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-[#1313ec]"></div>
                                                <span className="text-white">Industry Demand</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-[#3f3f5a]"></div>
                                                <span className="text-[#9d9db9]">Your Mastery</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Bar Chart Simulation */}
                                    <div className="flex flex-col gap-6">
                                        {/* Item 1 */}
                                        <div className="group relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white font-bold">React.js & Next.js</span>
                                                <span className="text-red-400 font-medium">-25% Gap</span>
                                            </div>
                                            <div className="w-full bg-[#282839] h-3 rounded-full relative overflow-hidden">
                                                {/* Your Skill */}
                                                <div className="absolute top-0 left-0 h-full bg-[#3f3f5a] z-10 rounded-full" style={{ width: '65%' }}></div>
                                                {/* Market Demand */}
                                                <div className="absolute top-0 left-0 h-full bg-[#1313ec]/30 z-0 rounded-full" style={{ width: '90%' }}></div>
                                                {/* Marker for Demand */}
                                                <div className="absolute top-0 h-full w-1 bg-[#1313ec] z-20" style={{ left: '90%' }}></div>
                                            </div>
                                            <div className="mt-1 text-xs text-[#9d9db9]">Market wants 90% proficiency. You are at 65%.</div>
                                        </div>
                                        {/* Item 2 */}
                                        <div className="group relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white font-bold">TypeScript</span>
                                                <span className="text-green-400 font-medium">+5% Above Market</span>
                                            </div>
                                            <div className="w-full bg-[#282839] h-3 rounded-full relative overflow-hidden">
                                                {/* Market Demand */}
                                                <div className="absolute top-0 left-0 h-full bg-[#1313ec]/30 z-0 rounded-full" style={{ width: '75%' }}></div>
                                                {/* Your Skill */}
                                                <div className="absolute top-0 left-0 h-full bg-[#3f3f5a] z-10 rounded-full" style={{ width: '80%' }}></div>
                                                {/* Marker for Demand */}
                                                <div className="absolute top-0 h-full w-1 bg-[#1313ec] z-20" style={{ left: '75%' }}></div>
                                            </div>
                                            <div className="mt-1 text-xs text-[#9d9db9]">You exceed the market average of 75%.</div>
                                        </div>
                                        {/* Item 3 */}
                                        <div className="group relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white font-bold">GraphQL</span>
                                                <span className="text-red-400 font-medium">-40% Gap</span>
                                            </div>
                                            <div className="w-full bg-[#282839] h-3 rounded-full relative overflow-hidden">
                                                {/* Your Skill */}
                                                <div className="absolute top-0 left-0 h-full bg-[#3f3f5a] z-10 rounded-full" style={{ width: '30%' }}></div>
                                                {/* Market Demand */}
                                                <div className="absolute top-0 left-0 h-full bg-[#1313ec]/30 z-0 rounded-full" style={{ width: '70%' }}></div>
                                                {/* Marker for Demand */}
                                                <div className="absolute top-0 h-full w-1 bg-[#1313ec] z-20" style={{ left: '70%' }}></div>
                                            </div>
                                            <div className="mt-1 text-xs text-[#9d9db9]">Critical gap detected. Priority upgrade recommended.</div>
                                        </div>
                                        {/* Item 4 */}
                                        <div className="group relative">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white font-bold">Cloud Infrastructure (AWS)</span>
                                                <span className="text-red-400 font-medium">-15% Gap</span>
                                            </div>
                                            <div className="w-full bg-[#282839] h-3 rounded-full relative overflow-hidden">
                                                {/* Your Skill */}
                                                <div className="absolute top-0 left-0 h-full bg-[#3f3f5a] z-10 rounded-full" style={{ width: '50%' }}></div>
                                                {/* Market Demand */}
                                                <div className="absolute top-0 left-0 h-full bg-[#1313ec]/30 z-0 rounded-full" style={{ width: '65%' }}></div>
                                                {/* Marker for Demand */}
                                                <div className="absolute top-0 h-full w-1 bg-[#1313ec] z-20" style={{ left: '65%' }}></div>
                                            </div>
                                            <div className="mt-1 text-xs text-[#9d9db9]">Approaching proficiency.</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Secondary Metrics Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-[#181824] border border-[#282839] rounded-xl p-6 flex flex-col justify-between h-48">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-[#9d9db9]">trending_up</span>
                                                <p className="text-[#9d9db9] text-sm font-medium">Projected Growth (2025)</p>
                                            </div>
                                            <h4 className="text-3xl font-bold text-white">+22%</h4>
                                            <p className="text-sm text-[#9d9db9] mt-1">Increase in demand for <span className="text-white font-medium">Full Stack Engineers</span>.</p>
                                        </div>
                                        <div className="w-full bg-[#282839] h-10 rounded-lg mt-auto flex items-end px-2 gap-1 pb-2">
                                            <div className="bg-[#1313ec]/40 w-1/6 h-[40%] rounded-sm"></div>
                                            <div className="bg-[#1313ec]/50 w-1/6 h-[60%] rounded-sm"></div>
                                            <div className="bg-[#1313ec]/60 w-1/6 h-[50%] rounded-sm"></div>
                                            <div className="bg-[#1313ec]/70 w-1/6 h-[80%] rounded-sm"></div>
                                            <div className="bg-[#1313ec]/80 w-1/6 h-[70%] rounded-sm"></div>
                                            <div className="bg-[#1313ec] w-1/6 h-[90%] rounded-sm"></div>
                                        </div>
                                    </div>
                                    <div className="bg-[#181824] border border-[#282839] rounded-xl p-6 flex flex-col h-48">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-[#9d9db9]">paid</span>
                                            <p className="text-[#9d9db9] text-sm font-medium">Salary Potential</p>
                                        </div>
                                        <div className="flex-1 flex items-center justify-center relative">
                                            {/* Radial Chart Simulation */}
                                            <div className="w-24 h-24 rounded-full border-8 border-[#282839] relative flex items-center justify-center">
                                                <svg className="absolute top-0 left-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" fill="transparent" r="46" stroke="#1313ec" strokeDasharray="289" strokeDashoffset="80" strokeLinecap="round" strokeWidth="8"></circle>
                                                </svg>
                                                <div className="text-center">
                                                    <span className="text-lg font-bold text-white block">$95k</span>
                                                    <span className="text-[10px] text-[#9d9db9] uppercase">Avg. Entry</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-center text-xs text-[#9d9db9] mt-2">Top tier earners reach $140k+</p>
                                    </div>
                                </div>
                                {/* Bottom Ticker */}
                                <div className="bg-[#181824] border border-[#282839] rounded-xl p-3 flex items-center overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 border-r border-[#282839] min-w-max z-10 bg-[#181824]">
                                        <span className="material-symbols-outlined text-[#1313ec] animate-spin-slow" style={{ fontSize: '20px' }}>radar</span>
                                        <span className="text-white text-sm font-bold uppercase tracking-wider">Market Pulse</span>
                                    </div>
                                    <div className="flex items-center gap-8 overflow-x-hidden w-full pl-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#9d9db9] text-sm">Full Stack Dev</span>
                                            <span className="text-green-400 text-sm font-bold flex items-center"><span className="material-symbols-outlined text-[16px]">arrow_drop_up</span>15% demand spike</span>
                                        </div>
                                        <div className="w-1 h-1 bg-[#3f3f5a] rounded-full"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#9d9db9] text-sm">Rust Programming</span>
                                            <span className="text-green-400 text-sm font-bold flex items-center"><span className="material-symbols-outlined text-[16px]">arrow_drop_up</span>8% salary increase</span>
                                        </div>
                                        <div className="w-1 h-1 bg-[#3f3f5a] rounded-full"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#9d9db9] text-sm">Data Analysis</span>
                                            <span className="text-red-400 text-sm font-bold flex items-center"><span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>2% saturation</span>
                                        </div>
                                        <div className="w-1 h-1 bg-[#3f3f5a] rounded-full"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#9d9db9] text-sm">DevOps Engineer</span>
                                            <span className="text-green-400 text-sm font-bold flex items-center"><span className="material-symbols-outlined text-[16px]">arrow_drop_up</span>Top 5 emerging role</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column: Actions (4 cols) */}
                            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                                {/* Quick Upskill Panel */}
                                <div className="bg-[#181824] border border-[#282839] rounded-xl flex flex-col h-full">
                                    <div className="p-6 border-b border-[#282839]">
                                        <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-yellow-400">bolt</span>
                                            Recommended Actions
                                        </h3>
                                        <p className="text-[#9d9db9] text-sm mt-1">Based on your gap analysis.</p>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col gap-4">
                                        {/* Action Card 1 */}
                                        <div className="bg-[#282839] rounded-xl p-4 border border-transparent hover:border-[#1313ec]/50 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="bg-[#1313ec]/20 text-[#1313ec] p-1.5 rounded-lg">
                                                    <span className="material-symbols-outlined text-[20px]">code_blocks</span>
                                                </div>
                                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-medium">Critical Priority</span>
                                            </div>
                                            <h4 className="text-white font-bold text-base mb-1">Advanced React Patterns</h4>
                                            <p className="text-[#9d9db9] text-xs mb-4">Bridge the 25% gap in your React proficiency.</p>
                                            <button className="w-full bg-[#1313ec] hover:bg-[#1313ec]/90 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                                Start Module
                                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </button>
                                        </div>
                                        {/* Action Card 2 */}
                                        <div className="bg-[#282839] rounded-xl p-4 border border-transparent hover:border-[#1313ec]/50 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="bg-purple-500/20 text-purple-400 p-1.5 rounded-lg">
                                                    <span className="material-symbols-outlined text-[20px]">schema</span>
                                                </div>
                                                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-medium">High Priority</span>
                                            </div>
                                            <h4 className="text-white font-bold text-base mb-1">Mastering GraphQL</h4>
                                            <p className="text-[#9d9db9] text-xs mb-4">Required for 70% of senior backend roles.</p>
                                            <button className="w-full bg-[#181824] hover:bg-[#111118] text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-[#3f3f5a] transition-colors">
                                                View Course
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                            </button>
                                        </div>
                                        {/* Action Card 3 */}
                                        <div className="bg-[#282839] rounded-xl p-4 border border-transparent hover:border-[#1313ec]/50 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="bg-cyan-500/20 text-cyan-400 p-1.5 rounded-lg">
                                                    <span className="material-symbols-outlined text-[20px]">cloud</span>
                                                </div>
                                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-medium">Medium Priority</span>
                                            </div>
                                            <h4 className="text-white font-bold text-base mb-1">AWS Essentials</h4>
                                            <p className="text-[#9d9db9] text-xs mb-4">You are close! Only 15% more to meet market.</p>
                                            <button className="w-full bg-[#181824] hover:bg-[#111118] text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-[#3f3f5a] transition-colors">
                                                View Course
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-[#282839]">
                                        <a className="text-[#1313ec] text-sm font-bold flex items-center justify-center gap-2 hover:underline" href="#">
                                            View Full Learning Path
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx global>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
            </main>
        </div>
    );
}
