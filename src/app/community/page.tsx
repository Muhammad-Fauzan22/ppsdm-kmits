"use client";

import React from 'react';
import Link from 'next/link';

export default function CommunityHubPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white font-[family-name:var(--font-inter)] antialiased overflow-hidden">
            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                    <div className="p-6 pb-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-8 bg-[#135bec] rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">hub</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PPSDM Hub</h1>
                        </div>
                        <div className="flex gap-3 mb-6 p-3 bg-[#f6f6f8] dark:bg-slate-800 rounded-xl">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCw0iB3CeHRy3LRGrsz5XNtVwNUAsVLx9B93eLh648PCx0HmRClKMyt8uMdHUKtp55XGOgUDhJraU629KMaleTa858nXV2eJJK6eiGQoS_A2EvtUrA_IPPtU932Y5Nu1l-aZKqt65bSwl06Fj0rRG6aE2Q0I1PMzqnl72vhTj_7imy85GRtqWojCbqPpriZb6HiZZkOYO7MgB7qMpzKclqopfIhIy21RLJnqdwuQpbJNjULj1XemtcT4EuoYzj4uC5UEeWRwveHozg')" }}></div>
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-slate-900 dark:text-white text-sm font-bold truncate">Alex Morgan</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">PPSDM Student</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-[#135bec]">dashboard</span>
                            <p className="text-sm font-medium">Dashboard</p>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#135bec]/10 text-[#135bec] dark:text-[#135bec] font-semibold" href="#">
                            <span className="material-symbols-outlined text-[#135bec]" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                            <p className="text-sm">Community Hub</p>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-[#135bec]">psychology</span>
                            <p className="text-sm font-medium">My Dimensions</p>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-[#135bec]">calendar_month</span>
                            <p className="text-sm font-medium">Calendar</p>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-[#135bec]">diversity_3</span>
                            <p className="text-sm font-medium">Peer Groups</p>
                        </Link>
                    </nav>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-[#135bec]">settings</span>
                            <p className="text-sm font-medium">Settings</p>
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
                    {/* Top Header */}
                    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button className="text-slate-500 dark:text-slate-400 hover:text-[#135bec]">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">PPSDM</h2>
                        </div>
                        {/* Search */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </span>
                                <input className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#135bec]" placeholder="Search events, dimensions, or peers..." type="text" />
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-3 ml-auto">
                            <button className="hidden md:flex h-10 px-4 items-center gap-2 bg-[#135bec] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm shadow-blue-200 dark:shadow-none">
                                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                <span>Log Activity</span>
                            </button>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>
                            <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                                <span className="material-symbols-outlined">chat_bubble</span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                        <div className="max-w-[1200px] mx-auto space-y-8">
                            {/* Page Heading */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Community Hub</h1>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">Track your dimensions, connect with peers, and join events.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        Manage Groups
                                    </button>
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column (Feeds) */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Active Dimensions (Carousel style) */}
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Active Dimensions</h2>
                                            <Link className="text-sm font-semibold text-[#135bec] hover:text-blue-600" href="#">View All</Link>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                                            {/* Card 1 */}
                                            <div className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlub7zTl66bLA1zNOFamDsPWcBeLyycYLkuugy3IAWHIE6Eq0apbpVDDoye8X_xPMBeSZ468ekOJUiV_Pnhja3IPQ56CcznWVI0cuEg_1al1ZAJktTzH1zQnyJHrRfD1LePzodraKJmyAFeX4ItOWKgFeJtq_1smtd594_HK7t8vu3HbXyFZimEa-_jVxkuiIVOy6fcap_lmJi5YG8k_flbHSbXCZ8Rcl8Lph8CD4XSUC9CvlG9Si5PO_gIR3xgcgp0Yp3iIK-mZc')" }}>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                                    <div className="absolute bottom-3 left-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-1">
                                                            Level 3
                                                        </span>
                                                        <h3 className="text-white font-bold text-lg leading-tight">Spiritual Dimension</h3>
                                                    </div>
                                                </div>
                                                <div className="p-4 flex flex-col gap-3 flex-1">
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Active Challenge: <span className="text-slate-900 dark:text-white font-medium">Mindfulness Workshop</span></p>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                                        <div className="bg-[#135bec] h-2 rounded-full" style={{ width: '75%' }}></div>
                                                    </div>
                                                    <div className="mt-auto pt-2 flex justify-between items-center">
                                                        <div className="flex -space-x-2">
                                                            <img alt="Peer 1" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi8VenXOsdsapFftxQBvWt2d3hxIOjmkE36j-1Tj11wxW3SUOyBqyjieZA7EjUuVtKQfF84LESJ3KmZHAHTZ2ywbEHc4C7oqRkjLKZhBUgGjOS9iXYZBLbaLgp95Ie3JsOgLPRp1K80BPopRhfVy4FO6VE4R-219QlypA8Qh3fIh3xEvZlfVoBDHFxCM_XQnXbMxoK-wHW8BpPLoQw9fSKGfla9Twmme5T1zkimvV7GXDzFNUFTE_vUKJ3mIybo2DJJ7VLJRIp4cs" />
                                                            <img alt="Peer 2" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD__eClZZlrW-fj-vjDYz8Bi5xYyIxA7pIXOXKzAUi-vlODcRgjUKOew3u7IrL8sED9rob7ahLX_HnNF6uYhgfFfiuB57C0HKh_QT_DCyXpAxmLHkmObhrN5-u3-oQGJ2S_ozJ3cFqCi3BAjeGKlVq-TaeGm2rC__DWGWajFH4VkDWNCIA3HluJp_3VRIjgzS7JxCZ4mrjHFuHltZmfFPLsJNugaPGDjyY8L2egSt-CmSwTNixa70h6RfVad0FKo9vSB-DpV0bibCM" />
                                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">+4</div>
                                                        </div>
                                                        <button className="text-sm font-semibold text-[#135bec] hover:bg-[#135bec]/5 px-3 py-1.5 rounded-lg transition-colors">Enter</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Card 2 */}
                                            <div className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBV2M3I8VC3gmhb_FLlYacwx9XzGB03zTCDPg2foBQvfmPzDfxKA-DYMC84zNJ1cDpbS2JARshZVTXwbHib7LmgpnVu23kCY4YUG47ylAW-YGOwpHIApTk9eQu0LqCoVjREibxKaU9i8ZE3BD_E1BgNTjMTULjMwv_R6JCjyTFK0Pg6vQer7yFBBH4-ovDFDECmBqflwoGiN96VXdl0bCWxiWh7b3yZZSxOgO5Eqt3T1Ls8ZqEIpLZMmKbqJcs3o7joAcvsqlL-Kl0')" }}>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                                    <div className="absolute bottom-3 left-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-1">
                                                            Level 2
                                                        </span>
                                                        <h3 className="text-white font-bold text-lg leading-tight">Cognitive Dimension</h3>
                                                    </div>
                                                </div>
                                                <div className="p-4 flex flex-col gap-3 flex-1">
                                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Active Challenge: <span className="text-slate-900 dark:text-white font-medium">Logic Puzzles Set 4</span></p>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                                    </div>
                                                    <div className="mt-auto pt-2 flex justify-between items-center">
                                                        <div className="flex -space-x-2">
                                                            <img alt="Peer 1" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5GBH7ZNmjv1PJu8NxV3ZCPswOXuZXupncLk5KJBgk3EvVXA8SSSKZHVtTHWVZb8_Oi4FQCzdXwwJ6DHw2-1eXVMc41cxW329q7YnpOZZ4IOKRv0FX3f2tlkgHIi5DpmJV6FVbSx8mfT2cZLrK3ADLXsRlB-Eo6Wfp9Y0LP6U4nj2w3YGCLvZCDC6I7HA2lG5CDVEh5Xyt6K2G6ZqyzrOzjFV-7ZA25z83tTHVLd3qRixwai90tSW6ng4v3kXgTMJWR7ekmZrBWVw" />
                                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">+2</div>
                                                        </div>
                                                        <button className="text-sm font-semibold text-[#135bec] hover:bg-[#135bec]/5 px-3 py-1.5 rounded-lg transition-colors">Enter</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    {/* Challenge Board & Accountability */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Challenge Board */}
                                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                                            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-orange-500">trophy</span>
                                                    Challenge Board
                                                </h3>
                                            </div>
                                            <div className="p-5 flex flex-col gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg shrink-0 text-slate-500">
                                                        <span className="material-symbols-outlined">menu_book</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between mb-1">
                                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Read 2 Books this month</h4>
                                                            <span className="text-xs font-medium text-slate-500">1/2</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                                                        </div>
                                                        <p className="text-xs text-slate-400 mt-2">Ends in 5 days</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg shrink-0 text-slate-500">
                                                        <span className="material-symbols-outlined">self_improvement</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between mb-1">
                                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Daily Meditation Streak</h4>
                                                            <span className="text-xs font-medium text-slate-500">6/7</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                                        </div>
                                                        <p className="text-xs text-slate-400 mt-2">Keep it up!</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700">
                                                <button className="w-full py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#135bec] transition-colors">View All Challenges</button>
                                            </div>
                                        </section>
                                        {/* Peer Accountability Tracker */}
                                        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                                            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-purple-500">diversity_2</span>
                                                    Squad Goals
                                                </h3>
                                                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">Active</span>
                                            </div>
                                            <div className="p-5 flex flex-col gap-5">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Your accountability partners' progress this week.</p>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <img alt="Sarah" className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUlTQhbb8MgHSOZrN9WFpz06a_e7EiY_gszO9L07dgyxXnA7HgdAW2Uxky1NEKb9Jw2HFBRKkY1LaxyOmtCO6GTyb2n6UIg9Qv9q9h62zw6e-TrRgH5wDTrpWnpazC1Ahth6O8FByYnLntAY9M6W05etsxrM9geUpDaO7qQNe7cUQfpVZXipdVyOINoWsVVKYjiXKP_kp_dXYsA8iC-suPstO7jWMp-XhOR4MBIAKJnI9c1pehiWoxe8rWdWkagAqAbH7G96mCBDc" />
                                                                <div className="absolute inset-0 rounded-full border-2 border-green-500"></div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Sarah K.</p>
                                                                <p className="text-xs text-green-600 dark:text-green-400">Completed daily goals</p>
                                                            </div>
                                                        </div>
                                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <img alt="Mike" className="w-10 h-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE4iza8Av04HxC8gomv7bz4JJacAsD_YFog36KcKtufpS554i9bkttzDNwlsBUjsvGtBtMzThyxEe33NyP_j9Y4m6uvhx8QDqpeEFnRI4fmGxlUN1dnsYv7SO1N_92AKoiRfffwr3LQKt5dW69_lMM19Xmx6fUWwTVPmx1HkMHLO8KsJp6_56ufiTmCfI0jInCdV0w5_8SlAKSMT50vKT9BvV0Rp3qBywjz2IWU233BLc3ufKcGgRAgZ-CZo1gdjUgOCpfm7emWQI" />
                                                                <div className="absolute inset-0 rounded-full border-2 border-orange-400 border-dashed"></div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Mike R.</p>
                                                                <p className="text-xs text-orange-500">2 goals pending</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200">Nudge</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Right Column (Event Ecosystem) */}
                                <div className="lg:col-span-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event Ecosystem</h2>
                                        <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                                            <span className="material-symbols-outlined text-slate-500">filter_list</span>
                                        </button>
                                    </div>
                                    {/* Filter Pills */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <button className="px-3 py-1 rounded-full text-xs font-semibold bg-[#135bec] text-white">All</button>
                                        <button className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">Workshops</button>
                                        <button className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">AMA</button>
                                    </div>
                                    {/* Calendar Widget List */}
                                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
                                        {/* Event Item 1 */}
                                        <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center justify-center w-12 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[#135bec] shrink-0">
                                                    <span className="text-xs font-bold uppercase">Oct</span>
                                                    <span className="text-lg font-bold">24</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 px-2 py-0.5 rounded">Spiritual</span>
                                                        <span className="text-xs text-slate-400">2:00 PM</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#135bec] transition-colors">Expert AMA: Managing Stress</h4>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex -space-x-1.5">
                                                            <img alt="attendee" className="w-5 h-5 rounded-full border border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqCKtnqXLT60Fu7rQ-rzYZX5hLcIYL8KEKshl7xs_hnQ55h2rYTeyrDoWfQsPNjGqjrUN514Xxp5kD03MySRaKrQGPGSCvOR533W7ikIy2rsVn8ZuTQkt-lUsIL--p8iNK2PYFMbhIWy827HW-X5l64m2V5mRIgwzOXTgfdAvT1LBisK21Y_MMIX9CuBPYDhvTteMVdwnDXxsNOujQHdVHHHoHRUGEbM8URLn4GXXF2YoeguaFWOzZseU1HAdtARHuV5e81L9xojQ" />
                                                            <img alt="attendee" className="w-5 h-5 rounded-full border border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBctpUGun4WfeY0khguPMHbNexrwC0Cdv6onc1h5yn4FxOacgghfdC1QZ_VHEXXsezBGIer3jWWNsUEEbnPzd7qg9HUEM3xJEz8d5u7O5OYvfGXPPb5eu0jsEddTkktrWkkGFoEJmRR3dx6FeigwOstu2QgnCWGAl0hR1OkMcuSxQHSIn_jzCjXdAycRFACuY9uM3tuX09eMFFQcsO-oE2EeZqEvm1PDJM09QAhBQnsJMGEobqeQPFl90Jfu9Fs80DwQHoA4vr_DRY" />
                                                        </div>
                                                        <span className="text-xs text-slate-500">+12 going</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Event Item 2 */}
                                        <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center justify-center w-12 h-14 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 shrink-0">
                                                    <span className="text-xs font-bold uppercase">Oct</span>
                                                    <span className="text-lg font-bold">26</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/50 px-2 py-0.5 rounded">Cognitive</span>
                                                        <span className="text-xs text-slate-400">10:00 AM</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#135bec] transition-colors">Critical Thinking Workshop</h4>
                                                    <button className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-full w-full">Register Now</button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Event Item 3 */}
                                        <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center justify-center w-12 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 shrink-0">
                                                    <span className="text-xs font-bold uppercase">Oct</span>
                                                    <span className="text-lg font-bold">28</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/50 px-2 py-0.5 rounded">Social</span>
                                                        <span className="text-xs text-slate-400">6:00 PM</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#135bec] transition-colors">Networking Night: Tech</h4>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-slate-500">Online Event</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#135bec]/5 rounded-xl p-4 border border-[#135bec]/10 flex items-center gap-3">
                                        <div className="p-2 bg-[#135bec]/10 rounded-full text-[#135bec]">
                                            <span className="material-symbols-outlined">sync</span>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">Sync Calendar</h5>
                                            <p className="text-xs text-slate-500">Add events to Google Calendar</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar hide for clean look */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
