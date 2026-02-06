"use client";

import React from 'react';

export default function IntegrationsPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] text-slate-900 dark:text-white font-[family-name:var(--font-public-sans)] overflow-x-hidden transition-colors duration-200 min-h-screen">
            <div className="relative flex h-full min-h-screen w-full flex-col">
                {/* Top Navigation */}
                <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#282839] bg-white/95 dark:bg-[#101022]/95 backdrop-blur-sm px-4 lg:px-10 py-3">
                    <div className="flex items-center justify-between whitespace-nowrap">
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-[#1313ec]/10 flex items-center justify-center text-[#1313ec]">
                                <span className="material-symbols-outlined text-[24px]">hub</span>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white text-slate-900">PPSDM KMM</h2>
                        </div>
                        <div className="flex flex-1 justify-end gap-8">
                            <div className="hidden md:flex items-center gap-9">
                                <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors text-slate-600 dark:text-white" href="#">Dashboard</a>
                                <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors text-slate-600 dark:text-white" href="#">My Learning</a>
                                <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors text-slate-600 dark:text-white" href="#">Settings</a>
                                <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors text-slate-600 dark:text-white" href="#">Profile</a>
                            </div>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#1313ec]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUR0G7Qjo09ACWz08cf-211oKa0au3-VsCELEDM2NZGOdfScOlihjwm3bLTpbobz_k1Hu6PJkps9Z6wlu16lwSG4DnznyHegpbP9Y1o2sL_GSf6FA7vLH9CLjMEoUXNLMv-mOJgv1hj_B8uk3L58oOEmYk_3LeRKIcWYj4c8-fG4ZEelvTwhfTmfWr4bLYQbt1dx9lWHvq5nIn7lmIGahQbFtQQqnNZKugV5lUi_gZB55GuA8uJKv-YzFgzq3rSTgXaNlJTFcvyOY")' }}></div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex justify-center py-5 px-4 md:px-10 lg:px-40">
                    <div className="flex flex-col max-w-[1200px] flex-1 w-full gap-6">
                        {/* Breadcrumbs */}
                        <div className="flex flex-wrap gap-2 px-4">
                            <a className="text-slate-500 dark:text-[#9d9db9] text-base font-medium leading-normal hover:underline" href="#">Settings</a>
                            <span className="text-slate-500 dark:text-[#9d9db9] text-base font-medium leading-normal">/</span>
                            <span className="dark:text-white text-slate-900 text-base font-medium leading-normal">Integrations</span>
                        </div>
                        {/* Page Heading */}
                        <div className="flex flex-wrap justify-between items-end gap-4 px-4">
                            <div className="flex flex-col gap-2 max-w-2xl">
                                <h1 className="dark:text-white text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em]">External API Sync Hub</h1>
                                <p className="text-slate-500 dark:text-[#9d9db9] text-lg font-normal leading-normal">Centralized management of your learning data from external platforms.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-[#1313ec] hover:bg-[#1313ec]/90 transition-colors text-white text-sm font-bold shadow-lg shadow-[#1313ec]/20">
                                <span className="material-symbols-outlined text-[20px]">sync</span>
                                <span className="truncate">Sync All Now</span>
                            </button>
                        </div>
                        {/* Integrations Grid */}
                        <div className="px-4 pt-4">
                            <h3 className="dark:text-white text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Active Integrations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* LinkedIn Card */}
                                <div className="group flex flex-col justify-between gap-4 rounded-xl bg-white dark:bg-[#1c1c27] p-6 shadow-sm border border-slate-200 dark:border-[#282839] hover:border-[#1313ec]/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded-lg bg-[#0077b5]/10 flex items-center justify-center">
                                                <img alt="LinkedIn Logo" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzBELYDYy534e6E7d0nLxZL1fsgBDYqsLx5hrBBJyqRMHdh7tFeEF6O6UyVyfrGrvSnRcm70Ps8op1n0JAhRyMvKWQ81zE1NAAYi5LDmH7AUy1kcDL-u4JZyxKWs97x88Lw8cD0rotmtGlYYaCLBUdpmscDl2H2QWTmS9bRWr1R_9aj-OEoj9XNXE-kf0MfeB2WRAyIpOSH3cGo8mUIbG-NTyYQ6v93Z-Dbr0nmP-ntvdgClARKrNOf_OnuNuPWz_MmjguHnf-5jE" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold dark:text-white text-slate-900 leading-tight">LinkedIn Learning</h4>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500 mt-1">
                                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Connected
                                                </span>
                                            </div>
                                        </div>
                                        <button className="text-slate-500 dark:text-[#9d9db9] hover:text-[#1313ec] transition-colors">
                                            <span className="material-symbols-outlined">settings</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2 my-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-[#9d9db9]">Sync Status</span>
                                            <span className="dark:text-white text-slate-900 font-medium">Healthy</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-[#9d9db9]">Last Synced</span>
                                            <span className="dark:text-white text-slate-900 font-medium">2 mins ago</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-[#9d9db9]">Data Scope</span>
                                            <span className="dark:text-white text-slate-900 font-medium text-right">Profile, Skills, Endorsements</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-auto rounded-lg h-10 px-4 bg-[#f6f6f8] dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#323246] text-slate-900 dark:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors group-hover:bg-[#1313ec] group-hover:text-white">
                                        <span className="material-symbols-outlined text-[18px]">cached</span>
                                        Sync Now
                                    </button>
                                </div>
                                {/* GitHub Card */}
                                <div className="group flex flex-col justify-between gap-4 rounded-xl bg-white dark:bg-[#1c1c27] p-6 shadow-sm border border-slate-200 dark:border-[#282839] hover:border-[#1313ec]/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded-lg bg-slate-800/10 dark:bg-white/10 flex items-center justify-center">
                                                <img alt="GitHub Logo" className="w-8 h-8 object-contain dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAKI5zfQDWdpYZQscs2Mb-j9CPyS8n9GSlCXofF5Dq7FkQ34Pz3KM18QGN2gzEaax_RZ4wT5E3makzvnuJ86XY4Pozah3JcWAYW74mB13vNqIY7PaT_YHSgI-gYeU1J-fusA2lLI3vLFNfFJnydV0kvZe--FKYBRHjqJr1IzHFBydv3rSNqqlQeNkClQeapMO25sBgaLlqhdGkVz05TYAIY-AZDOWwLxD2wV0GbUEy30wREVKrWL9E2LHV4aZKXkfXzWaPK8ht5Lk" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold dark:text-white text-slate-900 leading-tight">GitHub</h4>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500 mt-1">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Connected
                                                </span>
                                            </div>
                                        </div>
                                        <button className="text-slate-500 dark:text-[#9d9db9] hover:text-[#1313ec] transition-colors">
                                            <span className="material-symbols-outlined">settings</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2 my-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-[#9d9db9]">Sync Status</span>
                                            <span className="dark:text-white text-slate-900 font-medium">Healthy</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-[#9d9db9]">Last Synced</span>
                                            <span className="dark:text-white text-slate-900 font-medium">1 hour ago</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-[#9d9db9]">Activity</span>
                                            <span className="dark:text-white text-slate-900 font-medium text-right">45 Commits fetched today</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-auto rounded-lg h-10 px-4 bg-[#f6f6f8] dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#323246] text-slate-900 dark:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors group-hover:bg-[#1313ec] group-hover:text-white">
                                        <span className="material-symbols-outlined text-[18px]">cached</span>
                                        Sync Now
                                    </button>
                                </div>
                                {/* Coursera Card */}
                                <div className="group flex flex-col justify-between gap-4 rounded-xl bg-white dark:bg-[#1c1c27] p-6 shadow-sm border border-slate-200 dark:border-[#282839] opacity-80 hover:opacity-100 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded-lg bg-[#0056D2]/10 flex items-center justify-center">
                                                <img alt="Coursera Logo" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgxGE7Z0Vgx9IEkyo-qnlY1t0Ars4mX12bXq9bKu0FNRkwFjwH68pQPd7jOkFpIUKHspZvxIponOyGoOmlOb7fHP36XNmBAeqFnGYjEKTH4VzXbWRq8w3Y79_a14JjInZGw9zzX_4hGVEFvgHMPfurbxkBY63eYZI5rdxTvaw2KEbWVkT1AkyUrAR-tsMClNw6kwYNmU7i8FJsPQ-c2Yk9-RIYYj-Ztvk1TGt2BMAUGi0he9hCTU5NhkYulaIMVP8j6xs_R2uG1OA" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold dark:text-white text-slate-900 leading-tight">Coursera</h4>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500 mt-1">
                                                    <span className="size-1.5 rounded-full bg-amber-500"></span>
                                                    Pending Auth
                                                </span>
                                            </div>
                                        </div>
                                        <button className="text-slate-500 dark:text-[#9d9db9] hover:text-[#1313ec] transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2 my-2 flex-1 justify-center">
                                        <p className="text-sm text-slate-500 dark:text-[#9d9db9] text-center">Connect your account to automatically import certifications and course completions.</p>
                                        <div className="flex justify-center mt-2">
                                            <span className="text-xs font-medium bg-[#f6f6f8] dark:bg-[#282839] px-2 py-1 rounded text-slate-500 dark:text-[#9d9db9]">15 Certificates Detected</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-auto rounded-lg h-10 px-4 bg-[#1313ec] hover:bg-[#1313ec]/90 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#1313ec]/20">
                                        <span className="material-symbols-outlined text-[18px]">link</span>
                                        Connect
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Bottom Section: Settings & Logs */}
                        <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
                            {/* Settings Panel */}
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                <h3 className="dark:text-white text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">Configuration</h3>
                                <div className="rounded-xl bg-white dark:bg-[#1c1c27] p-6 shadow-sm border border-slate-200 dark:border-[#282839]">
                                    <div className="flex flex-col gap-6">
                                        {/* Setting Item */}
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#282839]">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-bold dark:text-white text-slate-900">Auto-Sync Frequency</p>
                                                <p className="text-sm text-slate-500 dark:text-[#9d9db9]">How often should we pull data from connected providers?</p>
                                            </div>
                                            <div className="relative">
                                                <select className="appearance-none bg-[#f6f6f8] dark:bg-[#282839] border border-slate-200 dark:border-[#3f3f5a] text-slate-900 dark:text-white text-sm rounded-lg focus:ring-[#1313ec] focus:border-[#1313ec] block w-40 p-2.5 pr-8">
                                                    <option>Every 12 hours</option>
                                                    <option defaultValue="">Daily</option>
                                                    <option>Weekly</option>
                                                    <option>Manual Only</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-[#9d9db9]">
                                                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Setting Item */}
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#282839]">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-bold dark:text-white text-slate-900">Public Profile Visibility</p>
                                                <p className="text-sm text-slate-500 dark:text-[#9d9db9]">Make synced certifications and skills visible on your public profile.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input className="sr-only peer" type="checkbox" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#282839] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1313ec]"></div>
                                            </label>
                                        </div>
                                        {/* Setting Item */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-bold dark:text-white text-slate-900">Sync Failure Notifications</p>
                                                <p className="text-sm text-slate-500 dark:text-[#9d9db9]">Receive an email alert if a data sync fails consecutively.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input className="sr-only peer" type="checkbox" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#282839] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1313ec]"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Activity Log */}
                            <div className="lg:col-span-1 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="dark:text-white text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">Recent Activity</h3>
                                    <a className="text-sm font-medium text-[#1313ec] hover:text-[#1313ec]/80" href="#">View All</a>
                                </div>
                                <div className="rounded-xl bg-white dark:bg-[#1c1c27] p-0 shadow-sm border border-slate-200 dark:border-[#282839] overflow-hidden">
                                    {/* Log Item */}
                                    <div className="flex gap-3 p-4 border-b border-slate-200 dark:border-[#282839] hover:bg-[#f6f6f8] dark:hover:bg-[#232331] transition-colors">
                                        <div className="mt-1">
                                            <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm font-semibold dark:text-white text-slate-900">GitHub Sync Successful</p>
                                            <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Updated 4 repositories and 12 commits.</p>
                                            <p className="text-[10px] text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider font-bold mt-1">Today, 10:45 AM</p>
                                        </div>
                                    </div>
                                    {/* Log Item */}
                                    <div className="flex gap-3 p-4 border-b border-slate-200 dark:border-[#282839] hover:bg-[#f6f6f8] dark:hover:bg-[#232331] transition-colors">
                                        <div className="mt-1">
                                            <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm font-semibold dark:text-white text-slate-900">LinkedIn Sync Successful</p>
                                            <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Updated profile skills.</p>
                                            <p className="text-[10px] text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider font-bold mt-1">Today, 10:42 AM</p>
                                        </div>
                                    </div>
                                    {/* Log Item */}
                                    <div className="flex gap-3 p-4 border-b border-slate-200 dark:border-[#282839] hover:bg-[#f6f6f8] dark:hover:bg-[#232331] transition-colors">
                                        <div className="mt-1">
                                            <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm font-semibold dark:text-white text-slate-900">Coursera Token Expired</p>
                                            <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Please reconnect your account.</p>
                                            <p className="text-[10px] text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider font-bold mt-1">Yesterday, 4:20 PM</p>
                                        </div>
                                    </div>
                                    {/* Log Item */}
                                    <div className="flex gap-3 p-4 hover:bg-[#f6f6f8] dark:hover:bg-[#232331] transition-colors">
                                        <div className="mt-1">
                                            <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm font-semibold dark:text-white text-slate-900">Manual Sync Triggered</p>
                                            <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Initiated by user.</p>
                                            <p className="text-[10px] text-slate-500 dark:text-[#9d9db9] uppercase tracking-wider font-bold mt-1">Yesterday, 9:00 AM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx global>{`
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: transparent; 
        }
        ::-webkit-scrollbar-thumb {
            background: #282839; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #3f3f5a; 
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
