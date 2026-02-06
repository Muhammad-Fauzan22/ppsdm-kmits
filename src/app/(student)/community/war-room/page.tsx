"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function WarRoomPage() {
    return (
        <div className="bg-background-dark min-h-full flex flex-col font-grotesk overflow-x-hidden text-white">
            <main className="flex-1 flex flex-col items-center w-full py-6 px-4 lg:px-8 max-w-[1440px] mx-auto">
                {/* Hero & Controls */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-blue/20 text-brand-blue uppercase tracking-wider border border-brand-blue/30">Season 4</span>
                            <span className="text-slate-400 text-sm font-medium">Week 2 - Battle for Supremacy</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter text-white [text-shadow:_0_0_20px_rgba(19,91,236,0.3)]">
                            Departmental War Room
                        </h1>
                    </div>
                    <button className="group flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-brand-blue hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 active:scale-95">
                        <span className="material-symbols-outlined group-hover:animate-pulse">swords</span>
                        <span>Join the Fight</span>
                    </button>
                </motion.div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full mb-8">
                    {/* Champion Card (Left) */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="col-span-1 md:col-span-2 lg:col-span-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-card-dark to-[#101622] border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)] group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-9xl text-amber-400">emoji_events</span>
                        </div>
                        <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-amber-400">military_tech</span>
                                    <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">Current Champion</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">Informatics</h3>
                                <p className="text-slate-400 text-sm">Dominating with strategic innovation</p>
                            </div>
                            <div className="mt-8 flex items-end justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-500 text-xs uppercase">Avg Growth</span>
                                    <span className="text-2xl font-bold text-emerald-400">+98%</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-slate-500 text-xs uppercase">Total XP</span>
                                    <span className="text-2xl font-bold text-white">1.2M</span>
                                </div>
                            </div>
                            {/* Decorative image overlay */}
                            <div className="mt-4 h-32 w-full rounded-xl bg-cover bg-center border border-white/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkrDL4JYRA2Ip3vOK9zGNGkLt5PJahk5H7A7OR-SnKT1s74bQIF_4TryjW8FCMV4K0XLZnSe-le5TPnmpZgBvxdwdZoA9-frEqd7-unZKF79z9qLygKjrt4pDZ_T_hNzdZEIVoIbsYLK6z8byYvrzo6lqBZN3xiayR98Z1GlgxDm82U6jskY2_lO438i0yr8LqUD2g40ziyHcwa5XAtJVCaNP7MgbuaaMhLFw2srCNKaI0vkvigKwNHwqViLcRrQqZc_lhXUUTO78")' }}>
                                <div className="w-full h-full bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg">emoji_events</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Countdown Timer (Center/Right) */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col"
                    >
                        <div className="bg-card-dark rounded-2xl p-6 h-full border border-white/10 shadow-sm glass-card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white">Next Reset</h3>
                                <span className="material-symbols-outlined text-slate-500">timer</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center h-full items-center">
                                <div className="flex flex-col gap-2">
                                    <div className="aspect-square flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-2xl font-bold font-mono text-brand-blue">04</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase">Days</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="aspect-square flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-2xl font-bold font-mono text-brand-blue">12</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase">Hrs</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="aspect-square flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-2xl font-bold font-mono text-brand-blue">30</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase">Mins</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="aspect-square flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-2xl font-bold font-mono text-brand-blue">05</span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase">Secs</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Comparison Chart (Right) */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 md:col-span-1 lg:col-span-4 flex flex-col"
                    >
                        <div className="bg-card-dark rounded-2xl p-6 h-full border border-white/10 shadow-sm flex flex-col justify-between glass-card">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white">Growth Rivalry</h3>
                                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+12% vs last week</span>
                                </div>
                                <p className="text-slate-500 text-xs mb-4">Top 2 contenders performance velocity</p>
                            </div>
                            <div className="flex items-end justify-around h-32 w-full gap-4 px-2">
                                {/* Bar 1 */}
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <div className="w-full bg-white/5 rounded-t-lg relative h-24 overflow-hidden group">
                                        <div className="absolute bottom-0 w-full bg-brand-blue h-[85%] transition-all duration-1000 group-hover:opacity-90 shadow-[0_0_10px_rgba(19,91,236,0.3)]"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">Info</span>
                                </div>
                                {/* Bar 2 */}
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <div className="w-full bg-white/5 rounded-t-lg relative h-24 overflow-hidden group">
                                        <div className="absolute bottom-0 w-full bg-slate-600 h-[65%] transition-all duration-1000 group-hover:opacity-90"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">Civil</span>
                                </div>
                                {/* Bar 3 */}
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <div className="w-full bg-white/5 rounded-t-lg relative h-24 overflow-hidden group">
                                        <div className="absolute bottom-0 w-full bg-slate-700 h-[50%] transition-all duration-1000 group-hover:opacity-90"></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">Arch</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-full min-h-[500px]">
                    {/* Leaderboard Table Section */}
                    <div className="col-span-1 lg:col-span-8 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-blue">leaderboard</span>
                                Department Standings
                            </h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-xs font-medium bg-card-dark border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors">Growth</button>
                                <button className="px-3 py-1.5 text-xs font-medium bg-transparent text-slate-500 hover:text-white transition-colors">XP</button>
                                <button className="px-3 py-1.5 text-xs font-medium bg-transparent text-slate-500 hover:text-white transition-colors">Members</button>
                            </div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-card-dark rounded-2xl border border-white/10 overflow-hidden shadow-sm glass-card"
                        >
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-black/20 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-1 text-center">Rank</div>
                                <div className="col-span-5 md:col-span-4">Department</div>
                                <div className="col-span-3 md:col-span-4 text-left">Dimension Growth</div>
                                <div className="col-span-3 text-right">XP</div>
                            </div>
                            {/* Row 1: Gold */}
                            <div className="group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                                <div className="col-span-1 flex flex-col items-center justify-center">
                                    <div className="size-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold border border-amber-400/50">1</div>
                                    <span className="material-symbols-outlined text-xs text-emerald-500 mt-1">trending_up</span>
                                </div>
                                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-cover bg-center shadow-inner" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoM9pT7UqvLuiM_lRik67q-KGVvFvSN_chhbQPh11rytodnZIyRcnlOLGuG8H9ys12qCaF6xNYTS9gV9CBy2_8gfnjGJZeEoJDaO0wnG_jdGlnMqxtFxBSobIttkF058tuyUsl6bx-kL01QzzmcQO49DFYHayVHmPUS2k_0bMAmadgullrw_xz34YAiP6CHx6TefZWqOG7MCGqSDoevXkswxgIHDWrWc-tlqY-tLnqa2T2oqVOltvPZ7qb04qwJV3Xr3lImMtV-p4")' }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors">Informatics</span>
                                        <span className="text-xs text-slate-500">Tier 1 • Elite</span>
                                    </div>
                                </div>
                                <div className="col-span-3 md:col-span-4 flex flex-col justify-center gap-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Avg. 98%</span>
                                        <span className="text-emerald-500 font-bold">+5%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-brand-blue to-emerald-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                    </div>
                                </div>
                                <div className="col-span-3 text-right">
                                    <span className="text-sm font-mono font-bold text-white block">1.2M</span>
                                    <span className="text-[10px] text-slate-500 uppercase">XP Points</span>
                                </div>
                            </div>
                            {/* Row 2: Silver */}
                            <div className="group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300"></div>
                                <div className="col-span-1 flex flex-col items-center justify-center">
                                    <div className="size-8 rounded-full bg-slate-300/20 text-slate-300 flex items-center justify-center font-bold border border-slate-300/50">2</div>
                                    <span className="material-symbols-outlined text-xs text-emerald-500 mt-1">trending_up</span>
                                </div>
                                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-cover bg-center shadow-inner" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVhRWWUK2KABqnLL2cS5qVT96cUKdr5s_vwIjSJHMgOY-lqAybyvOB0mmB3zk65IqyBrf6BAIkWf5oKZkt6jeSfIAh67yHJcQL_xvK2ThhvZ24S7jxXzCxkfZk03WT5bd4I-wfD3ETuKm3SXSeuF5oUiDneTuoTiKOFrHWAP8pCS2QQNIBemLcqXwcWBtzqLYaWaMrw0_VDw2f7nM_iFw3WQ8jlJtDFiOB5X2N4qufzbtfcEEf-I16hthto5qkpIDmsQ5yOJitF_c")' }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors">Civil Engineering</span>
                                        <span className="text-xs text-slate-500">Tier 1 • Pro</span>
                                    </div>
                                </div>
                                <div className="col-span-3 md:col-span-4 flex flex-col justify-center gap-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Avg. 95%</span>
                                        <span className="text-emerald-500 font-bold">+2%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2">
                                        <div className="bg-brand-blue h-2 rounded-full opacity-80" style={{ width: '95%' }}></div>
                                    </div>
                                </div>
                                <div className="col-span-3 text-right">
                                    <span className="text-sm font-mono font-bold text-white block">1.1M</span>
                                    <span className="text-[10px] text-slate-500 uppercase">XP Points</span>
                                </div>
                            </div>
                            {/* Row 3: Bronze */}
                            <div className="group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-700"></div>
                                <div className="col-span-1 flex flex-col items-center justify-center">
                                    <div className="size-8 rounded-full bg-orange-700/20 text-orange-700 flex items-center justify-center font-bold border border-orange-700/50">3</div>
                                    <span className="material-symbols-outlined text-xs text-red-500 mt-1">trending_down</span>
                                </div>
                                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-cover bg-center shadow-inner" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBaSBlrTubFjroKKyJVLCm8Qswym8pgiT_vevMSk5xb3wNGij1JmFLxsrB5qvZRGGWfrDopRbnLunAI3BpWnxHJBR3uxhedXBl3Hi_jJX9l3TWi4bXh1vlC6e_iGGAhd-gb8eGjuAP3Nao0hYsY73FEO8fJ71Hjgy_nkCJ3qLRCAxxUIWPL5nU0k2H8wx2w7a0Zi-CJaK_faSua0_JU_rNU3sB2_FGp_t4sNGiBOEzx06n1zfI8fbnMHz3lX8czddJhQ6GAqtYZqk")' }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors">Architecture</span>
                                        <span className="text-xs text-slate-500">Tier 2 • Rising</span>
                                    </div>
                                </div>
                                <div className="col-span-3 md:col-span-4 flex flex-col justify-center gap-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Avg. 89%</span>
                                        <span className="text-red-500 font-bold">-1%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2">
                                        <div className="bg-brand-blue h-2 rounded-full opacity-60" style={{ width: '89%' }}></div>
                                    </div>
                                </div>
                                <div className="col-span-3 text-right">
                                    <span className="text-sm font-mono font-bold text-white block">900k</span>
                                    <span className="text-[10px] text-slate-500 uppercase">XP Points</span>
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors relative">
                                <div className="col-span-1 flex flex-col items-center justify-center">
                                    <div className="text-slate-500 font-bold">4</div>
                                    <span className="material-symbols-outlined text-xs text-slate-600 mt-1">remove</span>
                                </div>
                                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-cover bg-center shadow-inner grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6-vk3SWO61Fq-fCJh_-bHpxU-4xSSS7wBMbq0-1-7_4iATxvkmI2q2G52u0QUMgR9wOT48AVW1wVdc25fBvWdiEnBJTYEMDZz-DH7VZzVYMbbH-j-axFCkDNqanguo_YqpkVOMZtHtjjwAz-iBmkkZEkF8TLMpvCWrb7ntJ0sZ9x_jl40Uzps8Prk59T2nAJ0p28zxECTpQ8t_7hsZhKx4Fw-Y3vhgsLAla7W8yAvDcwXa814CLK_MLuVKo-bC1BcmCoWgSzO7Cc")' }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Physics</span>
                                    </div>
                                </div>
                                <div className="col-span-3 md:col-span-4 flex flex-col justify-center gap-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Avg. 72%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2">
                                        <div className="bg-slate-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                                    </div>
                                </div>
                                <div className="col-span-3 text-right">
                                    <span className="text-sm font-mono font-bold text-slate-400 block">650k</span>
                                    <span className="text-[10px] text-slate-500 uppercase">XP Points</span>
                                </div>
                            </div>

                            <div className="px-6 py-3 border-t border-white/5 bg-black/20 text-center">
                                <button className="text-xs font-bold text-brand-blue hover:text-blue-400 transition-colors uppercase tracking-wider flex items-center justify-center gap-1 w-full">
                                    View all 24 Departments
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Activity Pulse Feed Section */}
                    <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-blue animate-pulse">bolt</span>
                                Activity Pulse
                            </h3>
                            <div className="flex items-center gap-1">
                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs text-slate-500 font-medium">Live</span>
                            </div>
                        </div>
                        <div className="bg-card-dark rounded-2xl border border-white/10 h-full max-h-[600px] overflow-hidden flex flex-col shadow-sm glass-card">
                            <div className="p-4 border-b border-white/10 bg-black/20">
                                <p className="text-xs text-slate-500">Real-time updates from across the campus</p>
                            </div>
                            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                                {/* Feed Item 1 */}
                                <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5 flex gap-3 items-start">
                                    <div className="size-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-sm">emoji_events</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white leading-snug"><span className="font-bold">Informatics</span> just gained <span className="text-emerald-500 font-bold">+500 XP</span> from the Hackathon event</p>
                                        <p className="text-[10px] text-slate-400 mt-1">2 mins ago</p>
                                    </div>
                                </div>
                                {/* Feed Item 2 */}
                                <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5 flex gap-3 items-start">
                                    <div className="size-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-sm">school</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white leading-snug"><span className="font-bold">User123 (Civil Eng)</span> completed &apos;Structure Challenge&apos;</p>
                                        <p className="text-[10px] text-slate-400 mt-1">5 mins ago</p>
                                    </div>
                                </div>
                                {/* Feed Item 3 */}
                                <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5 flex gap-3 items-start">
                                    <div className="size-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-sm">palette</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white leading-snug"><span className="font-bold">Architecture</span> just leveled up their &apos;Design Dimension&apos;!</p>
                                        <p className="text-[10px] text-slate-400 mt-1">12 mins ago</p>
                                    </div>
                                </div>
                                {/* Feed Item 4 */}
                                <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5 flex gap-3 items-start">
                                    <div className="size-8 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-sm">group_add</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white leading-snug"><span className="font-bold">Physics</span> welcomed 5 new members to the war room.</p>
                                        <p className="text-[10px] text-slate-400 mt-1">24 mins ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Your Dept Mini Card (Sticky bottom on mobile, inline on desktop) */}
                        <div className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-xl p-4 text-white shadow-lg mt-auto glass-card">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase opacity-80">Your Squad</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Rank #8</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined">science</span>
                                </div>
                                <div>
                                    <h4 className="font-bold leading-none">Chemistry</h4>
                                    <p className="text-xs opacity-80 mt-1">750 pts to reach Rank #7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
