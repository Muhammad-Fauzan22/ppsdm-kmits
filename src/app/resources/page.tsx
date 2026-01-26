"use client";

import React from 'react';
import Link from 'next/link';

export default function ResourcesPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white overflow-x-hidden min-h-screen flex flex-col font-[family-name:var(--font-inter)]">
            {/* Top Navigation Bar */}
            <div className="w-full bg-white dark:bg-[#1a202c] border-b border-[#f0f2f4] dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <header className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4 text-[#111318] dark:text-white">
                            <div className="size-8 flex items-center justify-center bg-[#135bec] rounded-lg text-white">
                                <span className="material-symbols-outlined">radar</span>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                        </div>
                        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                            <nav className="flex items-center gap-6">
                                <Link className="text-[#111318] dark:text-gray-200 text-sm font-medium hover:text-[#135bec] transition-colors" href="/dashboard">Dashboard</Link>
                                <Link className="text-[#135bec] text-sm font-bold" href="#">Opportunity Radar</Link>
                                <Link className="text-[#111318] dark:text-gray-200 text-sm font-medium hover:text-[#135bec] transition-colors" href="#">Resource Pipeline</Link>
                                <Link className="text-[#111318] dark:text-gray-200 text-sm font-medium hover:text-[#135bec] transition-colors" href="#">Settings</Link>
                            </nav>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[#111318] dark:text-white">
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>
                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBz2YBb1W3m_ziwe7MwH1ElVk7_I6rmoqPiXxYtc7Of8kLwkfj9lNxaDkethMaOGdxx6-CkyxNNw-zLrcoaEDuu0aE5n1fzyV2TDzAfDhy6G9UBXeiCfFpSZte8aWY6FsE_e2QY8pkGQbHnzPWueryU3zBRhvsNZLaNUU9db-TbY9ptuqH2RRhIxT1HmK3NzpuRLA0VHzyapHIsx7IgYYAveZYLMDy7E_91JdJX1dtc4iodRGCI-VbWmWKBqgiHqURjQ6qROPBZDmU")' }}></div>
                            </div>
                        </div>
                        {/* Mobile Menu Icon */}
                        <div className="md:hidden flex items-center">
                            <button className="text-[#111318] dark:text-white p-2">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                    </header>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
                {/* HERO_PLACEHOLDER */}

                {/* Split Layout: Radar & Pipeline */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Opportunity Radar (8 columns) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* RADAR_PLACEHOLDER */}
                    </div>
                    {/* Right Column: Resource Pipeline (4 columns) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* API Integration Status */}
                        <div className="bg-[#135bec]/5 dark:bg-[#135bec]/10 rounded-xl p-4 border border-[#135bec]/10">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Integrations</h3>
                                <a className="text-xs text-[#135bec] font-medium hover:underline" href="#">Manage</a>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5 bg-white dark:bg-[#2d3748] px-2 py-1 rounded border border-gray-100 dark:border-gray-600 shadow-sm" title="Coursera Connected">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Coursera</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white dark:bg-[#2d3748] px-2 py-1 rounded border border-gray-100 dark:border-gray-600 shadow-sm" title="GitHub Connected">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">GitHub</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white dark:bg-[#2d3748] px-2 py-1 rounded border border-gray-100 dark:border-gray-600 shadow-sm opacity-60" title="LinkedIn Not Connected">
                                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">LinkedIn</span>
                                </div>
                            </div>
                        </div>
                        {/* Pipeline Feed */}
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-[#135bec]">timeline</span>
                                My Pipeline
                            </h2>
                            <div className="space-y-4">
                                {/* Integration Card: Coursera */}
                                <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="bg-[#0056D2] text-white p-1.5 rounded-lg">
                                                {/* Simple C shape for Coursera Logo placeholder */}
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Continue Learning</p>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">Google Data Analytics</h4>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                                <span>Course 3 of 8</span>
                                                <span>65%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                                <div className="bg-[#0056D2] h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                            <a className="text-xs text-[#135bec] font-medium hover:underline block text-right mt-2" href="#">Resume Course</a>
                                        </div>
                                    </div>
                                </div>
                                {/* Integration Card: GitHub */}
                                <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#24292e] dark:bg-black text-white p-1.5 rounded-lg shrink-0">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">PPSDM-Project-v1</h4>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">2h ago</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">Push to <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">main</span></p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Environment Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Saved/Watchlist */}
                                <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Saved for later</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 group cursor-pointer">
                                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDx79l2KZGo318I17YE2ycWqbTbOGHBe497iQfgAXJMbmD1DOnXJG8Y1nJ6Qq0Gllr1JrwoaFEZCJONS-acw9oo6CcMSKbVNXjAIZ_gOPnORpZ-p5CZlNxtaH2JnjSNV_x3nLKJuUn-z92PezuDNcjLzgus2104cdkExu2Z7brk_VBXYKIF8d_mBn4FLoSIem1NKcePUUgx9fLXmwyb0WR2BVQlcKFd-sJbQv4rb-1qzuomgzdSYlR6VhXt_e2yDMxqBB9lZM26wxI")' }}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#135bec] transition-colors truncate">CS50: Introduction to Computer Science</p>
                                                <p className="text-xs text-gray-500">Harvard • edX</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 group cursor-pointer">
                                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAP5N5_y35CZWzWOF1xclCyRXQc1sATna-MKUqHjwl1LHAIlXbNShJoAa0fiQKptdCFNZ50F2PvhT7cx5Z78WjZ021MTa6R0u_9ySYauPcCvJrcHUTztgUykWAWwNlSkj4kxe2b-Uci-Xn4FMcjFy0zU157WxJZoV6oxrjPCKwaz97un012p43DAiZNCE47xJ5Nyb9EbYxsdLI9CsxdFhoSWuNM8ygusGMiZ3mzneXIKJ73Bx8DNixthLhHbDpbvk4rg_jUzoLdTs")' }}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#135bec] transition-colors truncate">Erasmus Mundus JM</p>
                                                <p className="text-xs text-gray-500">Scholarship • Europe</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-3 py-1.5 text-xs font-medium text-gray-500 hover:text-[#135bec] transition-colors border-t border-gray-100 dark:border-gray-700">
                                        View All Saved Items
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
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
