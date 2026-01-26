"use client";

import React from 'react';
import Link from 'next/link';

export default function MentorshipPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white font-[family-name:var(--font-inter)] overflow-hidden h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] px-6 py-3 shrink-0 z-20">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <div className="size-8 flex items-center justify-center bg-[#135bec] rounded-md text-white">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                </div>
                <div className="flex flex-1 justify-end items-center gap-6">
                    <button className="text-slate-500 hover:text-[#135bec] dark:text-slate-400">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold">Alex Johnson</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Mentee Program</p>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-100 dark:border-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjcOBusL3TEMS7Hg3U7LkdKnWODl6YkiQcqw4N3q3aCd8_4rybyR2QDKJrOTG9F43bPzK1lviKWJBpkZ5TDjT-cNB1ojAKXgnHhkaRiJxp4oYeEFDJ9tdVq4ggiXsNqlvCLSZV-Tdhot1cvQIdTcyWmnxTiwszy32euVm9624nYh108W6Fsqk2yIQR2fM84dDbfwfxtLS_cQHMPz6Ft-DyfSNp8TLi7VuChDe9Gncd87H-jq4jUXkVx9iYva5_APanvevLisXU_Mk")' }}>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 flex-col justify-between hidden md:flex shrink-0">
                    <div className="flex flex-col gap-2 p-4">
                        <div className="flex flex-col mb-6">
                            <h1 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider text-opacity-50 mb-1">Menu</h1>
                        </div>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#135bec]">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-[#135bec]/10 text-[#135bec]" href="#">
                            <span className="material-symbols-outlined icon-fill">diversity_3</span>
                            <span className="text-sm font-medium">Find a Mentor</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#135bec]">calendar_month</span>
                            <span className="text-sm font-medium">My Sessions</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="#">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#135bec]">folder_open</span>
                            <span className="text-sm font-medium">Resources</span>
                        </Link>
                        <div className="mt-8 mb-2">
                            <h1 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider text-opacity-50 mb-1">Active Chats</h1>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDke7QBIC7R2Ln1Kx-RH_MHxjT0vZLNPd528RVzRDC_02H27KSzP_r_yEXn1vKDe4vh3O94jUDyvyGWMwGlDpBDGTzN_ZJjL05VgylSk_-KkyfdG1Wfykxcd6tPNzMpZM_O6FvVqVAFO3kB3jRe-Xukw3hQWHWlerprt-IB6yndQ3LsRUhoVoIwdnW15k9XYYWwfd45GHBQAaqRRmqt4SKy8UybBFsNUYHVBIn4g_UkVR7yv3XlH8w_ENMlclbl-xuv13h5DcaNqkY')" }}></div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Dr. Sarah L.</span>
                                <span className="text-xs text-slate-400">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <Link className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors" href="#">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 transition-colors" href="#">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Logout</span>
                        </Link>
                    </div>
                </aside>
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#f6f6f8] dark:bg-[#101622] relative">
                    <div className="max-w-[1600px] mx-auto p-6 md:p-8">
                        {/* Breadcrumbs & Heading */}
                        <div className="flex flex-col gap-1 mb-8">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Link className="hover:text-[#135bec] transition-colors" href="#">Home</Link>
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                <span className="text-slate-900 dark:text-white font-medium">Mentorship Network</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Mentorship Network</h1>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Find your perfect match and manage your academic growth.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[20px]">tune</span>
                                        Preferences
                                    </button>
                                    <button className="px-4 py-2 bg-[#135bec] hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm flex items-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        Request Mentor
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* LEFT COLUMN: Discovery & Matching (8 cols) */}
                            <div className="lg:col-span-8 flex flex-col gap-8">
                                {/* Search Bar */}
                                <div className="bg-white dark:bg-[#1e293b] p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center w-full">
                                        <div className="px-3 text-slate-400">
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                        <input className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 h-10" placeholder="Search by expertise (e.g. Data Science), department, or name..." type="text" />
                                        <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mx-2">
                                            Filters
                                        </button>
                                    </div>
                                </div>

                                {/* Top Recommendations */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#135bec]">auto_awesome</span>
                                            Top Recommendations for You
                                        </h3>
                                        <Link className="text-sm text-[#135bec] font-medium hover:underline" href="#">View all</Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Card 1 */}
                                        <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="relative size-12 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800" style={{ background: 'conic-gradient(#135bec 92%, #e2e8f0 0)' }}>
                                                        <div className="absolute inset-1 bg-white dark:bg-[#1e293b] rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-bold text-[#135bec]">92%</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-500 mt-1">Match</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-start">
                                                <div className="w-16 h-16 rounded-full bg-cover bg-center shrink-0 border-2 border-white dark:border-slate-700 shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnSQLayiXuMr3fr6omsssf_NU0Of1hm5h11BsA_ilV01x7GubujFhomKF5pMkgaCOJoga-mJ4duf003eIlkW_G-w64p96RkTvARzGsVllz0WwTekYq5R4chQ63B9opAoGP-BhBHcL7N1MvsKZoiBG3r086EyEKekCdQYeJodB4qyKhazy2yVOHLBcJ1vvpg0GF5NSw1d8NG9e-cBQJd8DgB-uiq20CQUyAgpPEAy3dVpQTLIHpWUTa51g1FBC6yNZ8Fov6QUrAHRM')" }}></div>
                                                <div className="pr-12">
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Prof. David Chen</h4>
                                                    <p className="text-sm text-[#135bec] font-medium">Department of Computer Science</p>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">Expert in AI Ethics and Machine Learning. Passionate about guiding final year projects.</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">#AI</span>
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">#Research</span>
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">#Leadership</span>
                                            </div>
                                            <div className="mt-5 flex gap-3">
                                                <button className="flex-1 py-2 px-3 bg-[#135bec] text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">Book Session</button>
                                                <button className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-800">Profile</button>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                                    Recommended because you like <strong>Research</strong>
                                                </p>
                                            </div>
                                        </div>
                                        {/* Card 2 */}
                                        <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="relative size-12 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800" style={{ background: 'conic-gradient(#135bec 85%, #e2e8f0 0)' }}>
                                                        <div className="absolute inset-1 bg-white dark:bg-[#1e293b] rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-bold text-[#135bec]">85%</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-500 mt-1">Match</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-start">
                                                <div className="w-16 h-16 rounded-full bg-cover bg-center shrink-0 border-2 border-white dark:border-slate-700 shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBTcTffhcGA1cy14rW3k3bt3k4U5N1n5zNek9NgmP77f5Q3izk5CmCCGvDfZuLMJcjzxR1u9-dMADJw4PF6M3GXRTkPArY-1kOCFS_I_qxARqOh3z61-D348knClRj2B_xJAS7lMP3LrDcgfzIJxhFglDNWoFtMQIKGfyi6jUV9Ub8okdSUFAKnLhKNRoKEhaii9lF-d36S-1f2P9ewIz--rWUiuM3DxjZPwai8lmQyJFKuXGjePDxopTZp9sFlds431HDOaeoJgk')" }}></div>
                                                <div className="pr-12">
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Elena Rodriguez</h4>
                                                    <p className="text-sm text-[#135bec] font-medium">Business Administration</p>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">20 years industry experience in Fintech. Available for career counseling.</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">#Fintech</span>
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">#Career</span>
                                            </div>
                                            <div className="mt-5 flex gap-3">
                                                <button className="flex-1 py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Request</button>
                                                <button className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-800">Profile</button>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                                    Matches your <strong>Career</strong> goals
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Booking Widget */}
                                <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBb2tQzGA5Ba5GPyAYwrKFisqoWCV_FaDNRwj8CHLLgOSKxa752u8nNgiWCbM9AH3bdG2NiwFevqVYU9CEk8whGQhPmf0bQYeaYP6iva4pCE_PPcBl6apjVLD5lPg8uL0VvaadJwH4_ExCc4-OvikxABCRZGlt0P5Fdkgss3LWZEQlF1uq-aZxL5hCZ9GRAUuuG3w4pfPvTBZTnBYwwuNvXlH6WHOwt_geM0L348BK_q2zHF_DSBxuB2Qdi5I-LTAgASd4AoAcyDk')" }}></div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Book with Dr. Sarah L.</h4>
                                                <p className="text-xs text-slate-500">Next Available: Tomorrow, 10:00 AM</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                                                <span className="material-symbols-outlined">chevron_left</span>
                                            </button>
                                            <span className="text-sm font-medium self-center text-slate-700 dark:text-slate-300">October 2023</span>
                                            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                                                <span className="material-symbols-outlined">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                {/* Calendar Grid */}
                                                <div className="grid grid-cols-7 text-center gap-y-4 text-sm mb-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Mon</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Tue</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Wed</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Thu</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Fri</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Sat</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Sun</span>
                                                    {/* Dates */}
                                                    <span className="text-slate-300 dark:text-slate-600">28</span>
                                                    <span className="text-slate-300 dark:text-slate-600">29</span>
                                                    <span className="text-slate-300 dark:text-slate-600">30</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">1</span>
                                                    <button className="bg-[#135bec] text-white rounded-full w-8 h-8 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">2</button>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">3</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">4</span>
                                                    {/* Row 2 (simplified) */}
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">5</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">6</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">7</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">8</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">9</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">10</span>
                                                    <span className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-full cursor-pointer py-1">11</span>
                                                </div>
                                            </div>
                                            <div className="w-px bg-slate-100 dark:bg-slate-700 hidden md:block"></div>
                                            <div className="flex-1 flex flex-col gap-3">
                                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Available Times (Oct 2)</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:border-[#135bec] hover:text-[#135bec] transition-colors">09:00 AM</button>
                                                    <button className="px-3 py-2 bg-[#135bec] text-white rounded text-sm shadow-md ring-2 ring-[#135bec] ring-offset-1 dark:ring-offset-[#1e293b]">10:00 AM</button>
                                                    <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:border-[#135bec] hover:text-[#135bec] transition-colors">01:30 PM</button>
                                                    <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:border-[#135bec] hover:text-[#135bec] transition-colors">03:00 PM</button>
                                                </div>
                                                <div className="mt-auto">
                                                    <button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-2.5 rounded-md text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                                                        Confirm Booking
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Management (4 cols) */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                {/* Relationship Health Dashboard */}
                                <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                                        Relationship Health
                                        <span className="material-symbols-outlined text-slate-400 text-[20px]">ecg_heart</span>
                                    </h3>
                                    <div className="flex flex-col gap-5">
                                        {/* Mentor 1 */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnBzthe_4ug4NH15Km04gsPUUXDTK_D2gOanKzT-bkQB2QKHuuXeZ6Jg7BNvcoGPGLX-mCoxvYW0R1-a_n--h2VWQfDYSzW2Cx7TmhXpVwt4EfQnL-cTrtqgnElyEugEbDBVNsfa69s0f3mJU1NKBX5o36OKMgReVvfuUXKeAxhBY3apnXcm_GF6HN_PqnWPH8dyud_B55Zh_fuzFzEIpJhSqaSDZ2w-QdnfeRSqMJexEMYmEIhXFa4aTQIRXPC5KOzRFg7pxdTXA')" }}></div>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Dr. Sarah L.</span>
                                                </div>
                                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">Healthy</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400">
                                                <span>3 sessions/mo</span>
                                                <span>Goals: 4/5</span>
                                            </div>
                                        </div>
                                        {/* Mentor 2 */}
                                        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-cover bg-center grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDk70JdAFiVvK-fi7WRmbweN-0_62KDQgsqQIVIIf-nm3E8WvKQQfsGQ6KSpt5L7Dtv9aziBXiOIWkLd7LOplUHa3jnga09VJTP6LHxb1YIDjWTFbN2-Wd4KC6f7Vm3G2w_xVdTl2sqUljnE4C8TlKayrWFOFjqIreBXcl9TxMr0WlhnX8824S-638jR7pWvsMLdTAxzEnT24E-8-brkmfYE8WSu52py6ptQiDM49vnNhUqqPvTCS4r7xcSU6Yq6Xf0PITMf6gxqug')" }}></div>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Prof. Mark T.</span>
                                                </div>
                                                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">Needs Attn</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-500 w-[40%] rounded-full"></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400">
                                                <span>0 sessions/mo</span>
                                                <span>Goals: 1/3</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-5 py-2 text-sm text-[#135bec] font-medium hover:bg-[#135bec]/5 rounded border border-transparent hover:border-[#135bec]/20 transition-all">
                                        View Detailed Report
                                    </button>
                                </div>
                                {/* Session Toolkit */}
                                <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Session Toolkit</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Link className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-[#135bec]/50 transition-colors group" href="#">
                                            <div className="bg-white dark:bg-slate-700 p-2 rounded-md shadow-sm text-[#135bec] group-hover:text-blue-600">
                                                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Goal Setting Template</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Define OKRs for Q4</p>
                                            </div>
                                        </Link>
                                        <Link className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-[#135bec]/50 transition-colors group" href="#">
                                            <div className="bg-white dark:bg-slate-700 p-2 rounded-md shadow-sm text-[#135bec] group-hover:text-blue-600">
                                                <span className="material-symbols-outlined text-[20px]">history_edu</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Progress Log</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track weekly milestones</p>
                                            </div>
                                        </Link>
                                        <Link className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-[#135bec]/50 transition-colors group" href="#">
                                            <div className="bg-white dark:bg-slate-700 p-2 rounded-md shadow-sm text-[#135bec] group-hover:text-blue-600">
                                                <span className="material-symbols-outlined text-[20px]">rate_review</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Feedback Form</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Post-session survey</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                {/* Quick Tip */}
                                <div className="bg-gradient-to-br from-[#135bec] to-blue-600 rounded-lg p-5 text-white shadow-md relative overflow-hidden">
                                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] opacity-10">lightbulb</span>
                                    <h4 className="font-bold text-sm mb-2 relative z-10">Pro Tip</h4>
                                    <p className="text-xs text-blue-100 relative z-10">
                                        Scheduling recurring sessions increases goal completion by 40%. Try setting up a bi-weekly sync.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar for dashboard feel */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #334155;
        }
      `}</style>
        </div>
    );
}
