"use client";

import React from 'react';

export default function MentorshipPage() {
    return (
        <div className="bg-[#111118] text-white font-[family-name:var(--font-lexend)] overflow-hidden antialiased selection:bg-[#1313ec]/30 flex h-screen w-full">
            {/* Left Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-[#282839] hidden md:flex flex-col bg-[#111118]">
                <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex flex-col gap-6">
                        {/* User Profile Snippet */}
                        <div className="flex gap-3 items-center px-2">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-inner border border-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAy5UyMTzS1EdNg-SkihrQZnCHr1vdJDtJu3en5_uJrllqVDMA3JrV1VInh-bGEeu5wkMNooTMY2ZbxYunFoMQUzaRhql0r0CkA6StEqFmf5cbDgTOjja2sS8GtDDkJ0Rj33N9bI1QaETKTmE39uUZj9tdC7op4BZ3DitWtXS8PupwQVBAH1rn1p86d02QWnCMpBXMlnvkms4wwt0e7M5TxN1F2LgnxbJxAwzAMhEYN6mb8kie3LamIKNC3mSZEB8SLCclK0GHJtg0")' }}></div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-base font-bold leading-normal">Alex Chen</h1>
                                <p className="text-[#9d9db9] text-xs font-normal leading-normal">Level 8 Junior</p>
                            </div>
                        </div>
                        {/* Nav Links */}
                        <nav className="flex flex-col gap-2">
                            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c1c27] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white" style={{ fontSize: '24px' }}>home</span>
                                <p className="text-[#9d9db9] group-hover:text-white text-sm font-medium leading-normal">Home</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1313ec]/10 text-[#1313ec]" href="#">
                                <span className="material-symbols-outlined text-[#1313ec] fill-1" style={{ fontSize: '24px' }}>storefront</span>
                                <p className="text-[#1313ec] text-sm font-bold leading-normal">Marketplace</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c1c27] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white" style={{ fontSize: '24px' }}>calendar_month</span>
                                <p className="text-[#9d9db9] group-hover:text-white text-sm font-medium leading-normal">My Sessions</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c1c27] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white" style={{ fontSize: '24px' }}>trophy</span>
                                <p className="text-[#9d9db9] group-hover:text-white text-sm font-medium leading-normal">Leaderboard</p>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c1c27] transition-colors group" href="#">
                                <span className="material-symbols-outlined text-[#9d9db9] group-hover:text-white" style={{ fontSize: '24px' }}>person</span>
                                <p className="text-[#9d9db9] group-hover:text-white text-sm font-medium leading-normal">Profile</p>
                            </a>
                        </nav>
                    </div>
                    {/* XP Progress (Sidebar Bottom) */}
                    <div className="flex flex-col gap-3 p-4 bg-[#1c1c27] rounded-xl border border-[#282839]">
                        <div className="flex justify-between items-end">
                            <p className="text-white text-sm font-bold">My XP</p>
                            <p className="text-[#1313ec] text-xs font-bold">Lvl 8</p>
                        </div>
                        <div className="relative w-full h-2 rounded-full bg-[#111118]">
                            <div className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-600 to-[#1313ec]" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-[#9d9db9] text-xs">340 XP to Level 9</p>
                    </div>
                </div>
            </aside>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#111118] relative">
                {/* Header */}
                <header className="flex-shrink-0 flex items-center justify-between border-b border-[#282839] px-6 py-4 bg-[#111118]/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-8 text-[#1313ec]">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>school</span>
                        </div>
                        <h2 className="text-white text-xl font-bold tracking-tight">PPSDM KMM</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex gap-2">
                            <button className="flex size-10 items-center justify-center rounded-full bg-[#1c1c27] text-white hover:bg-[#282839] transition-colors relative">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-[#1c1c27]"></span>
                            </button>
                            <button className="flex size-10 items-center justify-center rounded-full bg-[#1c1c27] text-white hover:bg-[#282839] transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
                            </button>
                        </div>
                    </div>
                </header>
                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-8">
                        {/* Hero Section */}
                        <div className="rounded-2xl overflow-hidden relative min-h-[320px] flex items-center justify-center p-6 md:p-12">
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAodiIsK1GMpafdpBCuSZd9AOt5bzbTD7mXlJG9F6tmjtLe9JI02NbCe0W4XQ3t7IQMa06XfgmKudyiX7GxkpqZ8sq5ih_1RK2O5fN5pan272RRXkkopNjnqlfor0N3Xg1HQ36UsXoLRbdP9uEQuzNP0DqahhOUrbZc4MEcUTvv9l9rTNKkyEo9Fmy6hCrZLq4vO1kbrDy4lZtnoz7IuPZilo6mKxeXOs2mo-qiiFZUtMDVOtTmpk1Ea1gcF9b_iFMb-HzO2aNZ0Wc")' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/80 to-transparent"></div>
                            <div className="absolute inset-0 bg-black/40"></div>
                            <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                                        Level Up with a Mentor
                                    </h1>
                                    <p className="text-gray-200 text-lg font-light max-w-lg mx-auto">
                                        Find senior students to help you master new skills, debug code, or prepare for exams.
                                    </p>
                                </div>
                                {/* Search Bar */}
                                <div className="w-full max-w-lg flex items-center p-1 bg-[#1c1c27] border border-[#282839] rounded-xl shadow-2xl">
                                    <div className="px-3 text-[#9d9db9]">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <input className="flex-1 bg-transparent border-none text-white placeholder-[#9d9db9] focus:ring-0 text-base h-12" placeholder="Search by skill (e.g., Python, Design)..." type="text" />
                                    <button className="bg-[#1313ec] hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-lg transition-colors">
                                        Find
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Marketplace Grid Container */}
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Left: Filters & Coach Grid */}
                            <div className="flex-1 flex flex-col gap-6 w-full">
                                {/* Filter Chips */}
                                <div className="flex flex-wrap gap-3 items-center">
                                    <span className="text-[#9d9db9] text-sm font-medium mr-2">Popular:</span>
                                    <button className="flex h-9 items-center gap-2 rounded-full bg-[#1c1c27] border border-[#282839] px-4 hover:border-[#1313ec]/50 hover:text-white transition-colors">
                                        <span className="text-sm font-medium">Python</span>
                                    </button>
                                    <button className="flex h-9 items-center gap-2 rounded-full bg-[#1c1c27] border border-[#282839] px-4 hover:border-[#1313ec]/50 hover:text-white transition-colors">
                                        <span className="text-sm font-medium">UI Design</span>
                                    </button>
                                    <button className="flex h-9 items-center gap-2 rounded-full bg-[#1313ec] text-white border border-[#1313ec] px-4">
                                        <span className="text-sm font-medium">Public Speaking</span>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                                    </button>
                                    <button className="flex h-9 items-center gap-2 rounded-full bg-[#1c1c27] border border-[#282839] px-4 hover:border-[#1313ec]/50 hover:text-white transition-colors">
                                        <span className="text-sm font-medium">Level 5+ Only</span>
                                    </button>
                                    <button className="flex h-9 items-center gap-2 text-[#9d9db9] hover:text-white ml-auto">
                                        <span className="material-symbols-outlined">tune</span>
                                        <span className="text-sm font-medium">All Filters</span>
                                    </button>
                                </div>
                                {/* Grid Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Recommended Mentors</h3>
                                    <span className="text-sm text-[#9d9db9]">Showing 24 available</span>
                                </div>
                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {/* Card 1 */}
                                    <div className="group flex flex-col bg-[#1c1c27] rounded-xl border border-[#282839] p-5 hover:border-[#1313ec]/50 hover:shadow-[0_4px_20px_rgba(19,19,236,0.1)] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className="relative">
                                                    <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByOXamL-4wejK0Wz0A5z6mOzkXglqxuXnIUVU32pO7fWpEKDQNaynLAJRpeKV-Ug_A0f4wRcGR7s7DJ3fCjZy__iNGoqs1IE5SjBDhNSS8-VOTr06xrpWHfQ7XKyS0RSlt-ZlZvsWjJBQKFB8FDGocjBfBUtPU1TldbOvI3tCChXdbHkflJu8rtcd3iKpsKzqQaqSiBmizj4RkFiiWw4MQ7Xn59pi0wNCKC3nL1jT7AOfCkpN13k4W88vFE4xg9X6Em3C8Lkx-iF0")' }}></div>
                                                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-[#1c1c27]" title="Online"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-tight">Sarah Jenkins</h4>
                                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-[#1313ec]/20 text-[#1313ec] text-xs font-bold uppercase tracking-wide">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>military_tech</span>
                                                        Lvl 12
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                                <span className="material-symbols-outlined fill-1" style={{ fontSize: '16px' }}>star</span>
                                                <span className="text-sm font-bold">4.9</span>
                                            </div>
                                        </div>
                                        <p className="text-[#9d9db9] text-sm mb-4 line-clamp-2">
                                            Expert in Public Speaking and Debate. I can help you structure your arguments and boost confidence.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Debate</span>
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Speech</span>
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Communication</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-[#282839] pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-[#9d9db9] uppercase font-bold">Session Cost</span>
                                                <span className="text-sm font-medium text-white">50 XP</span>
                                            </div>
                                            <button className="bg-white text-[#111118] hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                                Request
                                            </button>
                                        </div>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="group flex flex-col bg-[#1c1c27] rounded-xl border border-[#282839] p-5 hover:border-[#1313ec]/50 hover:shadow-[0_4px_20px_rgba(19,19,236,0.1)] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className="relative">
                                                    <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5WWyQyfQw3VNLVtLqYhM-1ZhxNwnsBoTqFSSndaLzS_dXoB2MXLjK2JwWuSdOyjFJhT5gD39XVUtzVGpw0tMyN3FAsPXH2PJQFJi4uB798Vj_r1fERs-dsvVq95zXw6TdWrlLpnkduifhThLppiaP1kxdEG2FlFp0uQlDGAML1N50p3-2vWki4MkC3fBwpzLC28vyXdNDyVR3EeHIE2eq8TgawS-LbEo3p6WUe8r53w2hFTzCgLjBZDZoU9xJaFVU2ejKJeT0zQ")' }}></div>
                                                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-gray-500 border-2 border-[#1c1c27]" title="Offline"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-tight">David Kim</h4>
                                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wide">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>diamond</span>
                                                        Lvl 15
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                                <span className="material-symbols-outlined fill-1" style={{ fontSize: '16px' }}>star</span>
                                                <span className="text-sm font-bold">5.0</span>
                                            </div>
                                        </div>
                                        <p className="text-[#9d9db9] text-sm mb-4 line-clamp-2">
                                            Senior CS student. Python & Data Science wizard. Let's crack those algorithms together!
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Python</span>
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Data Science</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-[#282839] pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-[#9d9db9] uppercase font-bold">Session Cost</span>
                                                <span className="text-sm font-medium text-white">Free</span>
                                            </div>
                                            <button className="bg-[#1313ec] text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">
                                                Request
                                            </button>
                                        </div>
                                    </div>
                                    {/* Card 3 */}
                                    <div className="group flex flex-col bg-[#1c1c27] rounded-xl border border-[#282839] p-5 hover:border-[#1313ec]/50 hover:shadow-[0_4px_20px_rgba(19,19,236,0.1)] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className="relative">
                                                    <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2CJelXys7TYHHiGC9gBegOQygcO7D5kl9q6snyGBBx2Rx_Rao75hiSB5Kkzvz-7ldH67oN6RYOW1_QkonKgQQ_M1GqQrolyGv958yNJHhOaK2SM_LiYzQCnkuk-sGj1G8T2johQCt7xvoZaufkICzbVxTaIKKqjgH72kV93THwjMo78_oUsQtf_Vm6n97paZKgn1C2zLoqlNmDb9bCf2iik3E4vF_bbMBGk_K2PuhyvqZgMp_5n3Wud_8ICWw6w8vpqR5Augz2oY")' }}></div>
                                                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-[#1c1c27]" title="Online"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-tight">Maria Garcia</h4>
                                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wide">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>bolt</span>
                                                        Lvl 9
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                                <span className="material-symbols-outlined fill-1" style={{ fontSize: '16px' }}>star</span>
                                                <span className="text-sm font-bold">4.7</span>
                                            </div>
                                        </div>
                                        <p className="text-[#9d9db9] text-sm mb-4 line-clamp-2">
                                            UI/UX Design enthusiast. I can review your portfolios and help with Figma basics.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Figma</span>
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Prototyping</span>
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Wireframing</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-[#282839] pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-[#9d9db9] uppercase font-bold">Session Cost</span>
                                                <span className="text-sm font-medium text-white">25 XP</span>
                                            </div>
                                            <button className="bg-white text-[#111118] hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                                Request
                                            </button>
                                        </div>
                                    </div>
                                    {/* Card 4 */}
                                    <div className="group flex flex-col bg-[#1c1c27] rounded-xl border border-[#282839] p-5 hover:border-[#1313ec]/50 hover:shadow-[0_4px_20px_rgba(19,19,236,0.1)] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className="relative">
                                                    <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCnNl9kbcSLf5NJ4_nl99EQiKqbl0DsoDVMf3uVsAcfJFGBNf02SqjGwFMDFSyE-ewXbmB0u2mKhXuDR5kiqBRV1q7q68eASWqtM492QP-pQN9lx_0m1GZ2Osbl-nzvGkab4ndcyfdkKLk7nx7cuHo7CrZegTawD4G-E9W5L9RE78dYhLOLMIzUJlZxpalc9l3bj_X4CXnXhzxSu3kWphXqbC-LsL368l5audtUTiSkkowean09Da3Z0xXXeAaR5YNp0_UZnpYbW8")' }}></div>
                                                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-[#1c1c27]" title="Online"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-tight">James Wilson</h4>
                                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-[#1313ec]/20 text-[#1313ec] text-xs font-bold uppercase tracking-wide">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>military_tech</span>
                                                        Lvl 11
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                                <span className="material-symbols-outlined fill-1" style={{ fontSize: '16px' }}>star</span>
                                                <span className="text-sm font-bold">4.8</span>
                                            </div>
                                        </div>
                                        <p className="text-[#9d9db9] text-sm mb-4 line-clamp-2">
                                            Need help with Java or C++? I have 3 years of experience in backend development.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Java</span>
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">C++</span>
                                            <span className="px-2 py-1 rounded-md bg-[#282839] text-xs text-gray-300">Backend</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-[#282839] pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-[#9d9db9] uppercase font-bold">Session Cost</span>
                                                <span className="text-sm font-medium text-white">40 XP</span>
                                            </div>
                                            <button className="bg-white text-[#111118] hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                                Request
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Sidebar: Stats & Leaderboard (Desktop Only) */}
                            <div className="hidden xl:flex flex-col w-80 gap-6 flex-shrink-0">
                                {/* Detailed XP Tracker */}
                                <div className="bg-[#1c1c27] rounded-2xl p-6 border border-[#282839] flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-white font-bold text-lg">Peer Coaching XP</h3>
                                        <div className="bg-[#1313ec]/20 text-[#1313ec] p-1 rounded-md">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>trending_up</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center py-2">
                                        <div className="text-4xl font-black text-white">1380</div>
                                        <div className="text-[#9d9db9] text-sm">Total Earned XP</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-white">Current Rank: Mentor</span>
                                            <span className="text-[#1313ec]">Master</span>
                                        </div>
                                        <div className="h-3 w-full bg-[#111118] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#1313ec] rounded-full relative" style={{ width: '80%' }}>
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#9d9db9] text-center mt-1">120 XP needed to level up!</p>
                                    </div>
                                </div>
                                {/* Leaderboard Snippet */}
                                <div className="bg-[#1c1c27] rounded-2xl p-6 border border-[#282839] flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-white font-bold text-lg">Top Mentors</h3>
                                        <a className="text-[#1313ec] text-xs font-bold hover:underline" href="#">View All</a>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {/* Rank 1 */}
                                        <div className="flex items-center gap-3">
                                            <div className="font-black text-yellow-400 w-4">1</div>
                                            <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0NGnXf60ZnsdkCCGKyuumebwsf-k6_dTqxBXajiWlA952iM6hlNTHJTApjBAlgkPjoPYRhjtbrX8MC7w5SYf74yHbhVM1qTf8REH1Zaz-SqTz7iCiK6J98Iqb2Ite4-9WzxuDe-yJIlhWpoN_AmmqknXi-sx5yVQINnkxO2owSZiLj3TzSCzUFPLCtyYAGPVnZIsGtkqfzpwHYgKY1uHmlkjC-QEDjZ2jUHPLyBJScjn_mFKiUYFvYSn2Jr_O35jg9P7K_AwPNF8")' }}></div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-bold text-white">Anna K.</span>
                                                <span className="text-xs text-[#9d9db9]">24 Sessions</span>
                                            </div>
                                            <div className="text-yellow-400 flex items-center gap-0.5 text-xs font-bold">
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span> 5.0
                                            </div>
                                        </div>
                                        {/* Rank 2 */}
                                        <div className="flex items-center gap-3">
                                            <div className="font-black text-gray-300 w-4">2</div>
                                            <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCE0YGkhH1f5Vjg1Ow9-KjkY6liuzaKUp6SM4Y1m9S98nbr-2FqHOQFBe-yEAzK9pAuq3cVbGiY0Nn18xQNaAKYcqtAnfbjXsYu2yOCuv9_r0r0tgwMPVzyDzP-Ug9XKW9geYIOOkBVQxhKlASZFxg0X68ZHEnc31DVGBUwVhu0rLRMF6xrsL2ElsLnx0jWx783J2I9Vpn_qjEaPdfBzziG6qsgKU7eO3TgOKGgFYrV8YoChtUr7hKk-8XvRVNBbZQCclPoKAH0lT4")' }}></div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-bold text-white">Mike T.</span>
                                                <span className="text-xs text-[#9d9db9]">21 Sessions</span>
                                            </div>
                                            <div className="text-yellow-400 flex items-center gap-0.5 text-xs font-bold">
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span> 4.9
                                            </div>
                                        </div>
                                        {/* Rank 3 */}
                                        <div className="flex items-center gap-3">
                                            <div className="font-black text-orange-400 w-4">3</div>
                                            <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjvW54nBJHuvwIU_8ydJO0_HZh_m3YQs56H_yHDShe-mKSlWdCgvDHHht9sXZ3955DeY-1iKi_69icXUDccZY2JzCTEjml5Xdn2qOakbujBeVwcT541vV4WnMJS15ILlLpu7VcJ45Hrht0VNpRs5cfLGDaE3al7GDYXtFUNqzrzU6LYsnfsLPiHYYyoev93R46Isy0hVKgQSpUY4JzUKWpKW5XWdmkvw0RqqDoWbajzaDxvddlPpGs3jHw8y5F0Mh42l5LYjqfBdo")' }}></div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-bold text-white">Jessica L.</span>
                                                <span className="text-xs text-[#9d9db9]">19 Sessions</span>
                                            </div>
                                            <div className="text-yellow-400 flex items-center gap-0.5 text-xs font-bold">
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span> 4.8
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* CTA Card */}
                                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1313ec] to-blue-900 text-white flex flex-col gap-3 relative overflow-hidden">
                                    <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10" style={{ fontSize: '100px' }}>school</span>
                                    <h3 className="font-bold text-lg z-10">Become a Mentor</h3>
                                    <p className="text-sm text-blue-100 z-10">Share your knowledge, earn XP, and get badges!</p>
                                    <button className="mt-2 bg-white text-[#1313ec] text-sm font-bold py-2 px-4 rounded-lg z-10 w-fit hover:bg-gray-100 transition-colors">Apply Now</button>
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
        .material-symbols-outlined.fill-1 {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111118;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #282839;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f5a;
        }
      `}</style>
        </div>
    );
}
