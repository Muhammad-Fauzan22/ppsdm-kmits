"use client";

import React from 'react';

export default function GlobalExchangePage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] font-[family-name:var(--font-lexend)] text-slate-900 dark:text-white antialiased overflow-x-hidden min-h-screen flex flex-col">
            {/* TopNavBar */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#282839] bg-white dark:bg-[#111118] px-4 py-3 lg:px-10">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                        <div className="size-8 rounded bg-[#1313ec] flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">public</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                    </div>
                    <div className="hidden lg:flex items-center gap-9">
                        <a className="text-slate-600 dark:text-slate-300 hover:text-[#1313ec] dark:hover:text-[#1313ec] text-sm font-medium leading-normal transition-colors" href="#">Dashboard</a>
                        <a className="text-slate-900 dark:text-white text-sm font-medium leading-normal" href="#">Global Exchange</a>
                        <a className="text-slate-600 dark:text-slate-300 hover:text-[#1313ec] dark:hover:text-[#1313ec] text-sm font-medium leading-normal transition-colors" href="#">My Projects</a>
                        <a className="text-slate-600 dark:text-slate-300 hover:text-[#1313ec] dark:hover:text-[#1313ec] text-sm font-medium leading-normal transition-colors" href="#">Resources</a>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-4 lg:gap-8">
                    <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-slate-200 dark:ring-0">
                            <div className="text-[#9d9db9] flex border-none bg-slate-50 dark:bg-[#282839] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border-none bg-slate-50 dark:bg-[#282839] text-slate-900 dark:text-white focus:outline-0 focus:ring-0 h-full placeholder:text-[#9d9db9] px-4 pl-2 text-sm font-normal leading-normal" placeholder="Search" defaultValue="" />
                        </div>
                    </label>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-[#282839] transition-colors relative">
                            <span className="material-symbols-outlined text-slate-600 dark:text-white">notifications</span>
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 border border-white dark:border-[#111118]"></span>
                        </button>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOYYMB_WHpgKZcoLnDOjfbehbqL4Ib0qYtXZT1Wr6xzxVxsD2VgP1sJNe0PDO_LjDxkicbkvw6DjEtdo5n5NiSBwWfe4had-ssOYA1oVYwkAk7avXvMqtGP15rOYA5bqJWcN4yZEN5jGptSFvvSjLq316KsS8Lhotv20XBviCNb0B74QF41gTcZoK0lrfaG3q4WW5HwAAujVHuQ9wRKnUB8-FOCLerljRotM4C58dDamn2_LNEwRXpGLLDfR6LHFuetaDiQpA4E_E")' }}></div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 flex-col">
                <div className="flex flex-1 justify-center py-6 px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col max-w-[1400px] flex-1 gap-6">
                        {/* PageHeading */}
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Global Virtual Exchange Hub</h1>
                                <p className="text-slate-500 dark:text-[#9d9db9] text-base font-normal leading-normal max-w-2xl">Connecting ITS students with global peers for joint projects. Explore active opportunities on the map below.</p>
                            </div>
                            <button className="bg-[#1313ec] hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#1313ec]/25">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                                Propose Collaboration
                            </button>
                        </div>

                        {/* Chips Filter */}
                        <div className="flex gap-3 flex-wrap overflow-x-auto pb-2 scrollbar-hide">
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#1313ec] text-white pl-4 pr-3 transition-colors shadow-md shadow-[#1313ec]/20">
                                <p className="text-sm font-medium leading-normal">All Regions</p>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#282839] border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 pl-4 pr-3 transition-colors">
                                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">North America</p>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#282839] border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 pl-4 pr-3 transition-colors">
                                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">Europe</p>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#282839] border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 pl-4 pr-3 transition-colors">
                                <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">Asia Pacific</p>
                            </button>
                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center"></div>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1c1c27] border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 pl-4 pr-3 transition-colors">
                                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Engineering</p>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1c1c27] border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 pl-4 pr-3 transition-colors">
                                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Sustainability</p>
                            </button>
                        </div>

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
                            {/* Map Column (Left) */}
                            <div className="lg:col-span-8 flex flex-col gap-4 relative">
                                <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#1c1c27] border border-slate-200 dark:border-[#282839] shadow-sm group min-h-[400px]">
                                    {/* Map Image */}
                                    <div className="absolute inset-0 bg-cover bg-center opacity-80 dark:opacity-60 transition-transform duration-700 hover:scale-105" style={{ backgroundImage: 'url("https://cdn.dribbble.com/users/359265/screenshots/11568282/media/6b041009130765c8793b82142f367469.jpg?resize=1600x1200&vertical=center")' }}>
                                    </div>
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#101022]/80 pointer-events-none"></div>
                                    {/* Map Controls */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                        <label className="flex flex-col w-full max-w-sm h-11 shadow-lg shadow-black/20">
                                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full backdrop-blur-md bg-white/10 dark:bg-black/30 border border-white/20">
                                                <div className="text-white flex items-center justify-center pl-4">
                                                    <span className="material-symbols-outlined">search</span>
                                                </div>
                                                <input className="w-full bg-transparent border-none text-white placeholder:text-white/70 focus:ring-0 px-3" placeholder="Find partner universities (e.g., MIT, TU Delft)" defaultValue="" />
                                            </div>
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <button className="bg-white/10 dark:bg-black/40 backdrop-blur-md text-white p-2 rounded-lg hover:bg-white/20 transition border border-white/10 shadow-lg">
                                                <span className="material-symbols-outlined">add</span>
                                            </button>
                                            <button className="bg-white/10 dark:bg-black/40 backdrop-blur-md text-white p-2 rounded-lg hover:bg-white/20 transition border border-white/10 shadow-lg">
                                                <span className="material-symbols-outlined">remove</span>
                                            </button>
                                        </div>
                                    </div>
                                    {/* Map Markers (Simulated) */}
                                    {/* Marker 1: MIT */}
                                    <div className="absolute top-[30%] left-[25%] group/marker cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <div className="size-4 bg-[#1313ec] rounded-full animate-ping absolute opacity-75"></div>
                                            <div className="size-3 bg-white rounded-full relative z-10 border-2 border-[#1313ec]"></div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-[#1c1c27] rounded-lg p-3 shadow-xl opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-200 dark:border-[#282839]">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">MIT - Cambridge</h4>
                                            <p className="text-xs text-slate-500 mb-2">3 Active Projects</p>
                                            <div className="flex -space-x-2">
                                                <img className="w-6 h-6 rounded-full border border-[#1c1c27]" alt="Student avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9niaGEi8Jzb2dWw4JWOYXDs6umVN1LAZkmHMJen790OT3HGdnXS_LLkk71AyUjwerJ1SRQihd8fN1ls6n3hsxezU1kgvdJlFqhYVIJ9Zrw9Uh5uSd8u5Uz13CBA5pxZU65QHb1uljGvgZTgDsagBQlPAhMstRnGEwkBUmSUmp68N6leadFvNL5sTI1gHs4AFcYuhIXLwYb_YNlJomRcg6lTGrshZNYDWOG2CKxgOL2Nq7CerUJomT1PqbSO21BwSM1P5FE0lJA68" />
                                                <img className="w-6 h-6 rounded-full border border-[#1c1c27]" alt="Student avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDL-FJKrPGFfjmpWnlNyL1JnUEaKgwfzMtrYAtArqzvHVe-LEWcu90CUg4zayEJhqMeUAJeZaPDmqfptDSV_N-dVk-BYXaoPvL0TPd1MkQvGk9ZXf9ijXdlJ91qbr0Z6jJr76Z27AuF_bE1LYeNs21U0EgkNGe0QlEXCAcLDdNnSrE_h3ESa5M_GAqhCO_i6O6QHOFz-bJffMpDUueQ-EXrjuAn_8RaHOIcyd2ZLXvzZHIp0MotVx54KvU_hxPStAi-eF8NIOUL5c" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Marker 2: TU Delft */}
                                    <div className="absolute top-[28%] left-[48%] group/marker cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <div className="size-4 bg-[#1313ec] rounded-full animate-ping absolute opacity-75"></div>
                                            <div className="size-3 bg-white rounded-full relative z-10 border-2 border-[#1313ec]"></div>
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                            <span className="text-xs font-bold text-white">TU Delft</span>
                                        </div>
                                    </div>
                                    {/* Marker 3: NUS */}
                                    <div className="absolute top-[55%] left-[75%] group/marker cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <div className="size-4 bg-green-500 rounded-full animate-ping absolute opacity-75"></div>
                                            <div className="size-3 bg-white rounded-full relative z-10 border-2 border-green-500"></div>
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                            <span className="text-xs font-bold text-white">NUS Singapore</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Stats Strip (below map on desktop) */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-4 border border-slate-200 dark:border-[#282839] flex items-center gap-4">
                                        <div className="p-2 bg-[#1313ec]/10 rounded-lg text-[#1313ec]">
                                            <span className="material-symbols-outlined">school</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                                            <p className="text-xs text-slate-500">Universities</p>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-4 border border-slate-200 dark:border-[#282839] flex items-center gap-4">
                                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                            <span className="material-symbols-outlined">rocket_launch</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
                                            <p className="text-xs text-slate-500">Active Projects</p>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-4 border border-slate-200 dark:border-[#282839] flex items-center gap-4">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                            <span className="material-symbols-outlined">groups</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">45</p>
                                            <p className="text-xs text-slate-500">Students</p>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#1c1c27] rounded-xl p-4 border border-slate-200 dark:border-[#282839] flex items-center gap-4">
                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                            <span className="material-symbols-outlined">translate</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">6</p>
                                            <p className="text-xs text-slate-500">Languages</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Column (Right) */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                {/* Global Project Rooms List */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold">Global Project Rooms</h3>
                                        <a className="text-xs font-medium text-[#1313ec] hover:text-blue-400" href="#">View All</a>
                                    </div>
                                    {/* Project Card 1 */}
                                    <div className="group bg-white dark:bg-[#1c1c27] rounded-xl p-3 border border-slate-200 dark:border-[#282839] shadow-sm hover:shadow-md transition-all cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA42x4TI1BC3xP6Ue38zkFJ_9PXnl1BoBGRPpkE3QsN38O5njLXZjdYOgcU6TmqriufvIWAvjagMyPP-nO6Xdbb2s9pqx1aXFrLx0sEqwIM3d17Uy5XgWLx3C0zQkI3SErjX529kqEk3UtIwup91XWfoFhffk78dN5JLIAn8d7q9Oxnofem2W2kMULhVvvQQeJvz9Bc9BFsgu7mkIfWepditEVzh88i1dbDn3UNaBe9Dl7Bj0y67wnhf-SWV_DPMYnO101CJGhONnQ")' }}></div>
                                            <div className="flex flex-col justify-between flex-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] font-bold tracking-wider text-green-500 uppercase bg-green-500/10 px-1.5 py-0.5 rounded">Recruiting</span>
                                                        <span className="material-symbols-outlined text-slate-400 text-sm">more_horiz</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#1313ec] transition-colors">AI for Urban Planning</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">MIT - Cambridge, USA</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <button className="flex-1 bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-medium py-1.5 rounded transition-colors">Details</button>
                                            <button className="flex-1 bg-[#1313ec] text-white text-xs font-medium py-1.5 rounded hover:bg-blue-700 transition-colors">Join Team</button>
                                        </div>
                                    </div>
                                    {/* Project Card 2 */}
                                    <div className="group bg-white dark:bg-[#1c1c27] rounded-xl p-3 border border-slate-200 dark:border-[#282839] shadow-sm hover:shadow-md transition-all cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyJbUJAHpGoc3HyNAi4WRExcteaZMFCLL4cTHFlhTWW3MbG7oNrgLFtZWrW0RBVd1U2MxKLXI5nLhysneqbXEuPeDl1QgxKNx1TvvKqRJZ2lMnhU2jnr0lQzND07k_xjdONjxyXKbb1kjs5ygK_KjhbBeyaZKuQTnFzD4nWbPvIpO9yyf1deajDu53g7jvewsoz9C07l66QHx5Vht9HvuLzfrNJ_s4kesLffBRi6km0p2e3FcODjECasZt88AcijCFspBerGn_XtM")' }}></div>
                                            <div className="flex flex-col justify-between flex-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] font-bold tracking-wider text-blue-500 uppercase bg-blue-500/10 px-1.5 py-0.5 rounded">In Progress</span>
                                                        <span className="material-symbols-outlined text-slate-400 text-sm">more_horiz</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#1313ec] transition-colors">Sustainable Water Systems</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">TU Delft - Netherlands</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 w-full bg-slate-200 dark:bg-black/30 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-[#1313ec] h-full rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <p className="text-[10px] text-right text-slate-400 mt-1">Phase 2: 65% Complete</p>
                                    </div>
                                </div>

                                {/* Collaboration Hub Widget */}
                                <div className="flex-1 bg-white dark:bg-[#1c1c27] rounded-xl border border-slate-200 dark:border-[#282839] flex flex-col overflow-hidden shadow-sm h-full max-h-[400px]">
                                    {/* Widget Tabs */}
                                    <div className="flex border-b border-slate-200 dark:border-[#282839]">
                                        <button className="flex-1 py-3 text-sm font-medium text-[#1313ec] border-b-2 border-[#1313ec] bg-[#1313ec]/5">
                                            Live Chat
                                        </button>
                                        <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                            Milestones
                                        </button>
                                    </div>
                                    {/* Chat Content */}
                                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                                        <div className="text-center text-[10px] text-slate-400 my-1">Today, 10:23 AM</div>
                                        {/* Message 1 */}
                                        <div className="flex gap-2 items-end">
                                            <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBli8TaVyEwkBbRtessODlWol_V2iHRQ_O4o8_5JRJoakNhha6twWSwBSmeVp9Seh1uqPuc-Yw__2PGriQEXoZmotk28o6ywHr4USsxbjMP2KioGFyU2Rfwj0r4JT-a5dRlUpIr0YkauRjL0ztNCgk2i2o13ZR-xUdGwkOeFKnISTaawYqsMU7ryS3ltUGYjxYeQCCGVdW5GK5XtNz42wAriBnT2xwy2O7nfGkPx0TvpBV_Bl02kPhQ1iNnJjIjFHdFG7vEcVirk-k")' }}></div>
                                            <div className="flex flex-col gap-1 max-w-[80%]">
                                                <div className="bg-slate-100 dark:bg-[#282839] p-2.5 rounded-2xl rounded-bl-none text-xs text-slate-700 dark:text-slate-200">
                                                    The updated schematics for the Delft project are uploaded.
                                                </div>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">translate</span> Translated from Dutch
                                                </span>
                                            </div>
                                        </div>
                                        {/* Message 2 (Me) */}
                                        <div className="flex gap-2 items-end flex-row-reverse">
                                            <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYoA3G5-A06PfL-4BvnGsoLjlEsc0d4TT8HueDv3Mnmb8lHcWClQsOYdWVUHE0LL91vu2jf3jCVdPewcpH6sdl7TOTgMg1aLSFCd5ruXnTo3IBo-8wfgg_vOiO85LckbfwrbxyiJZfdhsLM-M8N0QfDKpPXcGrsHdk-FvarViciCZwRN72JLlaAlsgntl8Ye55OhydlN3KMimzDOL5QaJkiTzJLDenEE-so5l3_q7XUkVlfoyoDiXBmvPa9y0sqLJOQUtMlYmLOzQ")' }}></div>
                                            <div className="flex flex-col gap-1 max-w-[80%] items-end">
                                                <div className="bg-[#1313ec] p-2.5 rounded-2xl rounded-br-none text-xs text-white">
                                                    Great! I'll review them with the team at ITS tonight.
                                                </div>
                                            </div>
                                        </div>
                                        {/* Message 3 */}
                                        <div className="flex gap-2 items-end">
                                            <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkbCEy6z7EuH3iMZ2209o80SAubrMXLxmeG5W5_uzTlDArjaB1fWbffqZqGYRpDVVUkv_YA0it0pleuM06nPh_LgKLPmlYxxXtbEKDeQLYqeGA4GY75bEOoHvS6LaE_u1Ofa3OJUESRGCFqvI6j9Z_DgS7XVLPErKnBpIs8NNJ4iET_uiEPdmBvrrLPFTr79yZ3Myz75NaUnAWoqkEzqNlyWZjpZqIh19TMv9rDYy920rMQffDkqydrMg-h74R4e7c-Cn86V1CX60")' }}></div>
                                            <div className="flex flex-col gap-1 max-w-[80%]">
                                                <div className="bg-slate-100 dark:bg-[#282839] p-2.5 rounded-2xl rounded-bl-none text-xs text-slate-700 dark:text-slate-200">
                                                    Don't forget the joint presentation rehearsal on Friday.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Chat Input */}
                                    <div className="p-3 border-t border-slate-200 dark:border-[#282839] bg-slate-50 dark:bg-[#111118]">
                                        <div className="relative">
                                            <input className="w-full bg-white dark:bg-[#282839] border-none rounded-full py-2 pl-4 pr-10 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-[#1313ec]" placeholder="Type a message..." type="text" />
                                            <button className="absolute right-1 top-1 bottom-1 p-1.5 bg-[#1313ec] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>send</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
