"use client";

import React from 'react';

export default function AccessibilitySettingsPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] text-slate-900 dark:text-white font-[family-name:var(--font-lexend)] overflow-x-hidden antialiased h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282839] px-6 py-3 bg-[#111118] shrink-0 z-50">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 flex items-center justify-center bg-[#1313ec]/20 rounded-lg text-[#1313ec]">
                        <span className="material-symbols-outlined text-[20px]">school</span>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-[#9d9db9] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                    <button className="text-[#9d9db9] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCDGmTInbaKhtpmkIV8PPqJEtwKAplDUaC3CkWDYKlcjQ06n8U4evULa8cjZIu-HFfOP4XIHpyFQnCMK6WGj3YeRiS_FvUWEqyowsKdXCr85mO7XE4kt2PLtaIJp3r-rFk__o2daLcw-KFYMCaFwAjXZz_eiSZJOfskq9emw3w_jGuupvyIebuQfnLlZmi3rFVCAvaHOZ1_VJUGPSlUl9px4oDN4vIBvkuYCLXB2mCXTcGOCUfMNk6pqCLeLXwuKh3afcc94Jrx9BU")' }}></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12">
                    {/* Left Column: Settings Panel (Scrollable) */}
                    <div className="col-span-1 lg:col-span-5 flex flex-col h-full bg-[#111118] border-r border-[#282839] overflow-y-auto custom-scrollbar relative">
                        <div className="p-8 pb-32">
                            {/* Page Heading */}
                            <div className="flex flex-col gap-3 mb-8">
                                <div className="flex items-center gap-2 text-[#1313ec] font-medium text-sm">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    <span>Back to Dashboard</span>
                                </div>
                                <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">Accessibility & Adaptation</h1>
                                <p className="text-[#9d9db9] text-base font-normal leading-normal max-w-md">Customize your learning experience. These settings are automatically saved to your profile.</p>
                            </div>

                            {/* Cognitive Load Section */}
                            <div className="mb-8">
                                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-1 pb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1313ec]">psychology</span>
                                    Cognitive Load
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {/* ADHD Focus Mode */}
                                    <div className="flex gap-4 bg-[#1e1e2d]/50 hover:bg-[#1e1e2d] border border-[#282839] rounded-xl px-4 py-4 justify-between items-center transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="text-white flex items-center justify-center rounded-lg bg-[#282839] shrink-0 size-10">
                                                <span className="material-symbols-outlined">center_focus_strong</span>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white text-base font-medium leading-normal">ADHD Focus Mode</p>
                                                </div>
                                                <p className="text-[#9d9db9] text-sm font-normal leading-normal mt-1">Hides sidebars and non-essential widgets.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full border-none bg-[#282839] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#1313ec] transition-colors duration-200">
                                                <div className="h-[24px] w-[24px] rounded-full bg-white shadow-sm transform transition-transform duration-200"></div>
                                                <input className="invisible absolute" type="checkbox" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reading Assistance Section */}
                            <div className="mb-8">
                                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-1 pb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1313ec]">menu_book</span>
                                    Reading Assistance
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {/* Dyslexia Friendly Font */}
                                    <div className="flex gap-4 bg-[#1e1e2d]/50 hover:bg-[#1e1e2d] border border-[#282839] rounded-xl px-4 py-4 justify-between items-center transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="text-white flex items-center justify-center rounded-lg bg-[#282839] shrink-0 size-10">
                                                <span className="material-symbols-outlined">spellcheck</span>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white text-base font-medium leading-normal">Dyslexia Friendly Font</p>
                                                </div>
                                                <p className="text-[#9d9db9] text-sm font-normal leading-normal mt-1">Switches font to OpenDyslexic for better readability.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full border-none bg-[#282839] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#1313ec] transition-colors duration-200">
                                                <div className="h-[24px] w-[24px] rounded-full bg-white shadow-sm transform transition-transform duration-200"></div>
                                                <input className="invisible absolute" type="checkbox" />
                                            </label>
                                        </div>
                                    </div>
                                    {/* Bionic Reading */}
                                    <div className="flex gap-4 bg-[#1e1e2d]/50 hover:bg-[#1e1e2d] border border-[#282839] rounded-xl px-4 py-4 justify-between items-center transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="text-white flex items-center justify-center rounded-lg bg-[#282839] shrink-0 size-10">
                                                <span className="material-symbols-outlined">visibility</span>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white text-base font-medium leading-normal">Bionic Reading</p>
                                                    <span className="material-symbols-outlined text-[#9d9db9] text-[16px] cursor-help" title="Highlights the first few letters of each word to guide the eye.">help</span>
                                                </div>
                                                <p className="text-[#9d9db9] text-sm font-normal leading-normal mt-1">Highlights initial letters for faster processing.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full border-none bg-[#282839] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#1313ec] transition-colors duration-200">
                                                <div className="h-[24px] w-[24px] rounded-full bg-white shadow-sm transform transition-transform duration-200"></div>
                                                <input className="invisible absolute" type="checkbox" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Comfort Section */}
                            <div className="mb-4">
                                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-1 pb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1313ec]">contrast</span>
                                    Visual Comfort
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {/* High Contrast */}
                                    <div className="flex gap-4 bg-[#1e1e2d]/50 hover:bg-[#1e1e2d] border border-[#282839] rounded-xl px-4 py-4 justify-between items-center transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="text-white flex items-center justify-center rounded-lg bg-[#282839] shrink-0 size-10">
                                                <span className="material-symbols-outlined">contrast_rtl_off</span>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="text-white text-base font-medium leading-normal">High Contrast Mode</p>
                                                <p className="text-[#9d9db9] text-sm font-normal leading-normal mt-1">Increases contrast between text and background.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full border-none bg-[#282839] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#1313ec] transition-colors duration-200">
                                                <div className="h-[24px] w-[24px] rounded-full bg-white shadow-sm transform transition-transform duration-200"></div>
                                                <input className="invisible absolute" type="checkbox" />
                                            </label>
                                        </div>
                                    </div>
                                    {/* Sliders */}
                                    <div className="bg-[#1e1e2d]/50 border border-[#282839] rounded-xl p-5 flex flex-col gap-6">
                                        <div>
                                            <div className="flex justify-between mb-3 items-end">
                                                <div className="flex items-center gap-2 text-white font-medium">
                                                    <span className="material-symbols-outlined text-[#9d9db9] text-sm">format_size</span>
                                                    Text Size
                                                </div>
                                                <span className="text-[#1313ec] font-bold text-sm bg-[#1313ec]/10 px-2 py-0.5 rounded">110%</span>
                                            </div>
                                            <input className="w-full h-1.5 bg-[#282839] rounded-lg appearance-none cursor-pointer accent-[#1313ec] hover:accent-blue-400" max="200" min="100" type="range" defaultValue="110" />
                                            <div className="flex justify-between mt-1 text-xs text-[#9d9db9]">
                                                <span>A</span>
                                                <span className="text-lg">A</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-3 items-end">
                                                <div className="flex items-center gap-2 text-white font-medium">
                                                    <span className="material-symbols-outlined text-[#9d9db9] text-sm">format_line_spacing</span>
                                                    Line Height
                                                </div>
                                                <span className="text-[#1313ec] font-bold text-sm bg-[#1313ec]/10 px-2 py-0.5 rounded">Relaxed</span>
                                            </div>
                                            <input className="w-full h-1.5 bg-[#282839] rounded-lg appearance-none cursor-pointer accent-[#1313ec] hover:accent-blue-400" max="3" min="1" step="0.5" type="range" defaultValue="2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Sticky Footer */}
                        <div className="sticky bottom-0 left-0 w-full bg-[#111118]/90 backdrop-blur-md border-t border-[#282839] p-6 flex justify-between items-center z-20">
                            <button className="text-[#9d9db9] text-sm font-medium hover:text-white transition-colors">Reset to Default</button>
                            <button className="bg-[#1313ec] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save Preferences
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="hidden lg:flex col-span-7 bg-[#0c0c12] p-8 items-center justify-center relative overflow-hidden">
                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1313ec]/5 rounded-full blur-3xl pointer-events-none"></div>
                        {/* Preview Window Container */}
                        <div className="w-full max-w-[900px] h-full max-h-[850px] bg-[#111118] rounded-2xl border border-[#282839] shadow-2xl overflow-hidden flex flex-col relative group">
                            {/* Preview Label Badge */}
                            <div className="absolute top-4 right-4 z-20 bg-[#1313ec] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 shadow-lg flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] animate-pulse">circle</span>
                                Live Preview
                            </div>
                            {/* Mock Browser Top Bar */}
                            <div className="h-10 bg-[#1e1e2d] border-b border-[#282839] flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="size-3 rounded-full bg-red-500/80"></div>
                                    <div className="size-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="size-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="mx-auto w-[40%] h-5 bg-[#282839] rounded text-[10px] text-[#9d9db9] flex items-center justify-center">
                                    dashboard.ppsdm.ac.id/student
                                </div>
                            </div>
                            {/* Mock Dashboard Content */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Mock Sidebar */}
                                <div className="w-16 md:w-64 bg-[#181824] border-r border-[#282839] flex flex-col py-6 hidden md:flex transition-opacity duration-300">
                                    <div className="px-6 mb-8">
                                        <div className="h-6 w-32 bg-[#282839] rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex flex-col gap-2 px-3">
                                        <div className="h-10 w-full bg-[#1313ec]/10 text-[#1313ec] rounded-lg flex items-center px-3 gap-3">
                                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                            <span className="text-sm font-medium">Dashboard</span>
                                        </div>
                                        <div className="h-10 w-full text-[#9d9db9] hover:bg-[#282839] rounded-lg flex items-center px-3 gap-3 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">book</span>
                                            <span className="text-sm font-medium">My Courses</span>
                                        </div>
                                        <div className="h-10 w-full text-[#9d9db9] hover:bg-[#282839] rounded-lg flex items-center px-3 gap-3 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                            <span className="text-sm font-medium">Schedule</span>
                                        </div>
                                        <div className="h-10 w-full text-[#9d9db9] hover:bg-[#282839] rounded-lg flex items-center px-3 gap-3 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">assignment</span>
                                            <span className="text-sm font-medium">Assignments</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Mock Main Area */}
                                <div className="flex-1 bg-[#111118] p-6 md:p-8 overflow-hidden relative">
                                    {/* Header */}
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <p className="text-[#9d9db9] text-sm mb-1">Thursday, Oct 24th</p>
                                            <h3 className="text-white text-2xl font-bold">Hello, Alex!</h3>
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="h-10 w-10 rounded-full bg-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqhfjAvoBpjqEmH2qwD2JYcFEPwLxi1_z_LZim2j5Oqs0XkOCOShgqd4umGZ-HCrY8RzHqKcipg-U15nIjJyiCn0ix-D1lvIis6FcEOh8ZQObpvgtYnbS6z9eNhv0fcnAL5XOwGmhqfIGll5E7OOm0GzEb8pmFtYZTyle_v_b816Vp4ssUx-EQ4H7gF525N5Ff1pdhEajJlejBglCsmiI6YliQD0VSo0JY_uFTb5Piu7w8bn-jfCWGrcJjfldRpYNu8fml9SJOXyw")', backgroundSize: 'cover' }}></div>
                                        </div>
                                    </div>
                                    {/* Progress Widget (Might disappear in Focus Mode) */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="col-span-2 bg-[#1e1e2d] rounded-xl p-5 border border-[#282839] shadow-lg">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-white font-semibold">Current Course: Cognitive Science</h4>
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">In Progress</span>
                                            </div>
                                            <p className="text-[#9d9db9] text-sm mb-4 leading-relaxed">
                                                <strong className="text-white font-bold">Un</strong>derstanding <strong className="text-white font-bold">ho</strong>w <strong className="text-white font-bold">th</strong>e <strong className="text-white font-bold">br</strong>ain <strong className="text-white font-bold">pro</strong>cesses <strong className="text-white font-bold">in</strong>formation <strong className="text-white font-bold">is</strong> <strong className="text-white font-bold">key</strong>.
                                            </p>
                                            <div className="w-full bg-[#282839] rounded-full h-2 mb-2">
                                                <div className="bg-[#1313ec] h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-[#9d9db9]">
                                                <span>Module 3 of 5</span>
                                                <span>75% Complete</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#1e1e2d] rounded-xl p-5 border border-[#282839] shadow-lg flex flex-col justify-between">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-orange-400">timer</span>
                                                <h4 className="text-white font-semibold">Focus Timer</h4>
                                            </div>
                                            <div className="text-3xl font-bold text-white text-center my-2">25:00</div>
                                            <button className="w-full bg-[#282839] hover:bg-[#323246] text-white text-sm py-2 rounded-lg transition-colors">Start Session</button>
                                        </div>
                                    </div>
                                    {/* Recommendation List */}
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#1313ec]">auto_awesome</span>
                                        Recommended for you
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                        <div className="bg-[#1e1e2d]/50 hover:bg-[#1e1e2d] p-4 rounded-xl border border-[#282839] flex items-center justify-between transition-colors cursor-pointer group/item">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                    <span className="material-symbols-outlined">description</span>
                                                </div>
                                                <div>
                                                    <h5 className="text-white font-medium group-hover/item:text-[#1313ec] transition-colors">Neuroplasticity Basics</h5>
                                                    <p className="text-[#9d9db9] text-xs">PDF • 15 mins read</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-[#9d9db9]">chevron_right</span>
                                        </div>
                                        <div className="bg-[#1e1e2d]/50 hover:bg-[#1e1e2d] p-4 rounded-xl border border-[#282839] flex items-center justify-between transition-colors cursor-pointer group/item">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                                                    <span className="material-symbols-outlined">play_circle</span>
                                                </div>
                                                <div>
                                                    <h5 className="text-white font-medium group-hover/item:text-[#1313ec] transition-colors">Lecture 4: Synapses</h5>
                                                    <p className="text-[#9d9db9] text-xs">Video • 45 mins</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-[#9d9db9]">chevron_right</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="absolute bottom-6 text-[#9d9db9] text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">info</span>
                                Preview updates in real-time
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
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
        
        input[type=range] {
            -webkit-appearance: none; 
            background: transparent; 
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
        }
        input[type=range]:focus {
            outline: none; 
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
