"use client";

import React from 'react';

export default function HeritageGraphPage() {
    return (
        <div className="font-[family-name:var(--font-manrope)] bg-[#f6f6f8] dark:bg-[#101022] text-slate-900 dark:text-white min-h-screen flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#282839] px-6 py-3 bg-white dark:bg-[#15151e] z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="size-8 rounded bg-[#1313ec] flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">hub</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight">PPSDM KMM</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a className="text-[#1313ec] text-sm font-medium border-b-2 border-[#1313ec] pb-0.5" href="#">Heritage Graph</a>
                        <a className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-[#1313ec] transition-colors" href="#">Mentorship</a>
                        <a className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-[#1313ec] transition-colors" href="#">My Profile</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <label className="hidden md:flex flex-col min-w-40 h-10 w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-[#282839] overflow-hidden">
                            <div className="text-slate-400 dark:text-[#9d9db9] flex items-center justify-center pl-3">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input className="w-full bg-transparent border-none focus:ring-0 text-sm px-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9d9db9]" placeholder="Search alumni, roles..." />
                        </div>
                    </label>
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-[#282839]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBn5njbfxzFIw8v92oFB1JNCBqBk4FYhPOHegvDYmgg9YFJcAxGfggaTHPSiFsCZlaKZmiB7zJPUwHDkLFSDHRaZmRoMjMkWqHI6TFmtqtUqTQq_23Syk2lxvZ0plHRo-tW8ZzCsyVomKTKIBC6we9pviVHEi3aO8w3YfRNfAFbwirBhoOM87EFJjdSJKIyHMNCEMZiv7C6D2Up1oxQMziU65JDdtjqpmoWobjMgBcpiALzjU_xMw0cJIfCfyhTqOd7AfyP-Ix-2eI")' }}></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Left Column: Graph Visualization Area */}
                <div className="flex-1 flex flex-col relative bg-[#f6f6f8] dark:bg-[#101022]">
                    {/* Controls & Title Overlay */}
                    <div className="absolute top-0 left-0 right-0 z-10 p-6 pointer-events-none">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pointer-events-auto">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Alumni Heritage Graph</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Visualizing 1,245 connections across 12 industries</p>
                            </div>
                            {/* Filter Chips */}
                            <div className="flex gap-2 flex-wrap justify-end">
                                <button className="flex h-8 items-center gap-2 rounded-full bg-[#1313ec] text-white px-4 text-xs font-medium hover:bg-blue-600 transition">
                                    All Sectors
                                </button>
                                <button className="flex h-8 items-center gap-2 rounded-full bg-white dark:bg-[#282839] border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-300 px-4 text-xs font-medium hover:bg-slate-100 dark:hover:bg-[#3b3b54] transition">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Engineering
                                </button>
                                <button className="flex h-8 items-center gap-2 rounded-full bg-white dark:bg-[#282839] border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-300 px-4 text-xs font-medium hover:bg-slate-100 dark:hover:bg-[#3b3b54] transition">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> BUMN
                                </button>
                                <button className="flex h-8 items-center gap-2 rounded-full bg-white dark:bg-[#282839] border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-300 px-4 text-xs font-medium hover:bg-slate-100 dark:hover:bg-[#3b3b54] transition">
                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> Startups
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Graph Canvas Simulation */}
                    <div className="w-full h-full relative overflow-hidden bg-[radial-gradient(#282839_1px,transparent_1px)] bg-[size:40px_40px]">
                        {/* SVG Connections (Background Layer) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-40" xmlns="http://www.w3.org/2000/svg">
                            {/* Complex web of lines */}
                            <line stroke="#4f4f6e" strokeWidth="1" x1="20%" x2="50%" y1="30%" y2="50%"></line>
                            <line stroke="#4f4f6e" strokeWidth="1" x1="50%" x2="80%" y1="50%" y2="20%"></line>
                            <line stroke="#4f4f6e" strokeWidth="1" x1="50%" x2="70%" y1="50%" y2="70%"></line>
                            <line stroke="#4f4f6e" strokeWidth="1" x1="20%" x2="30%" y1="30%" y2="70%"></line>
                            <line stroke="#4f4f6e" strokeWidth="1" x1="30%" x2="70%" y1="70%" y2="70%"></line>
                            <line stroke="#4f4f6e" strokeWidth="1" x1="70%" x2="80%" y1="70%" y2="20%"></line>
                            <line stroke="#4f4f6e" strokeWidth="1" x1="50%" x2="40%" y1="50%" y2="20%"></line>
                            <line stroke="#4f4f6e" strokeWidth="1" x1="40%" x2="20%" y1="20%" y2="30%"></line>
                            {/* Connection to active node */}
                            <line stroke="#1313ec" strokeWidth="2" x1="50%" x2="65%" y1="50%" y2="45%"></line>
                        </svg>

                        {/* Nodes (Interactive Divs) */}
                        {/* Central Node (Active/Selected) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#1313ec]/30 rounded-full animate-ping"></div>
                                <div className="relative size-16 rounded-full border-2 border-[#1313ec] bg-[#101022] overflow-hidden shadow-[0_0_30px_rgba(19,19,236,0.5)]">
                                    <img className="w-full h-full object-cover" alt="Portrait of Budi Santoso" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6C_M4rqNDHcrrPLsu94_Sp1tP055QR5vxMjdOw5Rc9H8FTdSjlJh6g9PzTaUXeBSOW1KqkSdFroFS-wcYtyVDyX0ik5PhDNbDQQ8X_ZRZX_3rJ9Dco2SM9Tlopqvo04iDhaQiiI8lvCa4OHKCNBDtB5CVNBUYM5mtnLYPNRnoYV20TASNafSj5XLJKmgWgzoVY43YgFrTKnU_xPVICX04HqN8dB7O4zKfbHLIWA6o_61wYKmvcg_KcTMiVIps5iqf7odQ93DYlAo" />
                                </div>
                                {/* Label */}
                                <div className="absolute -bottom-10 bg-[#1e1e2e] border border-[#282839] px-3 py-1 rounded-lg whitespace-nowrap z-20 shadow-lg">
                                    <p className="text-white text-xs font-bold">Budi Santoso</p>
                                    <p className="text-slate-400 text-[10px]">Data Scientist</p>
                                </div>
                            </div>
                        </div>

                        {/* Surrounding Nodes */}
                        {/* Node 1 */}
                        <div className="absolute top-[30%] left-[20%] z-0 hover:z-10 cursor-pointer group transition-transform hover:scale-110">
                            <div className="size-10 rounded-full border-2 border-purple-500 bg-[#1e1e2e] flex items-center justify-center text-xs text-white overflow-hidden">
                                <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="Portrait of Sarah" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBgRJ9X1rj6E1WNoA8USwnc0AgBc4tv_2_RM_aLutToVq30q4wv8Ne5Y1TpgiI7LJvT6WZK-f3KfAI_nrOChcWEx49cQOcVmUcXRqb5sjViYUdvLWVdvuEYjvPc_SGHzBaHMLQWqgrik2ysR2Uu2iblUMHwnPstTtQMlll3-pgspV3RBD9RqA6bmlB-I8azsZX4KNcOvBA-M_xKkhkRP0U5YEEUP6PRpyVYuRAzgQaq4qgkkak-uiS6Ovcfx0z7tkPbyLvB-MykbE" />
                            </div>
                        </div>
                        {/* Node 2 */}
                        <div className="absolute top-[20%] left-[80%] z-0 hover:z-10 cursor-pointer group transition-transform hover:scale-110">
                            <div className="size-12 rounded-full border-2 border-emerald-500 bg-[#1e1e2e] flex items-center justify-center text-xs text-white overflow-hidden">
                                <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="Portrait of Michael" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm6w2dpBCM1oGwD183KsjgypX7I41hL1FTHipcK5ucDkLvyAsymBJWbWOUPtmLl9uTJNelsgz65FfGVdcz2gMHBjO5Z1X4wCuBwLppWttuE3CETcKLo6bRaOPGNzKkywyZJNTSlUaNXusFoi2xJHJAKgaWLKsEvaSfJyD3qwNxNh1b_8n3mivwnqIHpq27B08dnhN6awcbNrP4HuqPyeD5Zq7o1A_0PjcIolfbcTxjGH-_-M9pfLZyIlBUH2Q08omtDs8LEiLvWnY" />
                            </div>
                        </div>
                        {/* Node 3 */}
                        <div className="absolute top-[70%] left-[70%] z-0 hover:z-10 cursor-pointer group transition-transform hover:scale-110">
                            <div className="size-10 rounded-full border-2 border-orange-500 bg-[#1e1e2e] flex items-center justify-center text-xs text-white overflow-hidden">
                                <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="Portrait of David" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqlcapqHgodkXeZcn-vzpHzI-TmMxg87RcY_LTK6a65oNOcQnNT2tJO6U4Ducf9QC64oJBGAsByOdvYAYsVfEpqCWRmDL9q3bS47L-PDNeV1HgiLVDHjD1lvxN2xt0_PsQN3asCxGKibylkOKf0BgJ0mActnXBD3kTAOTDWftjmrA1LMUHNdF4qTv_iqjR2DpdWkpYUaUu_SU7QCW48NSSQfTrKvv90BL4W9JLeYp2ob93-OfGCGctfTQbFl9c7KEck0iH8PyiDfI" />
                            </div>
                        </div>
                        {/* Node 4 */}
                        <div className="absolute top-[70%] left-[30%] z-0 hover:z-10 cursor-pointer group transition-transform hover:scale-110">
                            <div className="size-8 rounded-full border border-slate-500 bg-[#1e1e2e] flex items-center justify-center text-[10px] text-slate-300">
                                AN
                            </div>
                        </div>
                        {/* Node 5 */}
                        <div className="absolute top-[45%] left-[65%] z-0 hover:z-10 cursor-pointer group transition-transform hover:scale-110">
                            <div className="size-10 rounded-full border border-[#1313ec] bg-[#1e1e2e] flex items-center justify-center text-[10px] text-[#1313ec] font-bold">
                                <span className="material-symbols-outlined text-sm">apartment</span>
                            </div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">GoTo Group</div>
                        </div>

                        {/* Floating Toolbar */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#3b3b54] rounded-lg p-1.5 flex gap-1 shadow-xl">
                            <button className="size-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-[#282839] text-slate-600 dark:text-slate-300 transition">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                            <button className="size-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-[#282839] text-slate-600 dark:text-slate-300 transition">
                                <span className="material-symbols-outlined text-[20px]">remove</span>
                            </button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-[#3b3b54] my-auto mx-1"></div>
                            <button className="size-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-[#282839] text-slate-600 dark:text-slate-300 transition">
                                <span className="material-symbols-outlined text-[20px]">center_focus_strong</span>
                            </button>
                        </div>

                        {/* Stats Widget (Bottom Left) */}
                        <div className="absolute bottom-6 left-6 hidden md:block">
                            <div className="bg-white/90 dark:bg-[#1e1e2e]/90 backdrop-blur-sm border border-slate-200 dark:border-[#3b3b54] rounded-lg p-4 shadow-lg min-w-[200px]">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Network Stats</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Total Nodes</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">1,245</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Active Mentors</span>
                                    <span className="text-sm font-bold text-[#1313ec]">320</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#3b3b54] flex gap-2">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[10px] text-slate-500">Eng</span></div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] text-slate-500">BUMN</span></div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-[10px] text-slate-500">Tech</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile Drawer (Active State) */}
                <aside className="w-[400px] bg-white dark:bg-[#15151e] border-l border-slate-200 dark:border-[#282839] flex flex-col shadow-2xl z-30 overflow-y-auto shrink-0 transition-transform duration-300 transform translate-x-0 absolute right-0 h-full md:relative bg-[radial-gradient(#282839_1px,transparent_1px)] bg-[size:40px_40px]">
                    {/* Header */}
                    <div className="p-6 pb-4 relative">
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="size-24 rounded-full p-1 border-2 border-[#1313ec] mb-3">
                                <img className="w-full h-full rounded-full object-cover" alt="Profile picture of Budi Santoso" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCKgEs_d8qT002q4v-Gkb4zkW7AW6mU0dVoxz9ysoiQBs6pZN6A-MdylE5KVYSMpeo6X7-VX7P0-iJiH_zwWYQrAmzTljGaA50i_QvZa2V6jz0Y1RoSzG0kDttsJBcEtYffHwe50bIKSyPci3sd7wPmj9OSisBUrkRNcPDbSqusTu5Remvn3dkn4VBQ1JNKFS2th1vhLVjbNRX58HhfFGLDQgg5Qb-JD4SHt5ilWIMAlYdYRWu0QslUOncGUuNmzop9MQGKzHUZCM" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Budi Santoso</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Senior Data Scientist at GoTo Group</p>
                            <div className="mt-3 flex gap-2">
                                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-[#282839] text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#3b3b54]">Alumni &apos;19</span>
                                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-[#282839] text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#3b3b54]">Open to Mentor</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-[#282839] mx-6"></div>

                    {/* Success Path Timeline */}
                    <div className="p-6 flex-1">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">timeline</span> Success Path
                        </h3>
                        <div className="relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-200 dark:bg-[#282839]"></div>

                            {/* Step 1 */}
                            <div className="relative flex gap-4 pb-8 group">
                                <div className="z-10 mt-1 size-6 rounded-full bg-slate-100 dark:bg-[#282839] border-2 border-slate-300 dark:border-slate-500 flex items-center justify-center shrink-0 group-hover:border-[#1313ec] group-hover:bg-[#1313ec]/10 transition-colors">
                                    <span className="material-symbols-outlined text-[14px] text-slate-500 group-hover:text-[#1313ec]">school</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">2015 - 2019</p>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Informatics Engineering, ITS</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Specialized in Artificial Intelligence and Big Data Analytics. Graduated Cum Laude.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex gap-4 pb-8 group">
                                <div className="z-10 mt-1 size-6 rounded-full bg-slate-100 dark:bg-[#282839] border-2 border-slate-300 dark:border-slate-500 flex items-center justify-center shrink-0 group-hover:border-[#1313ec] group-hover:bg-[#1313ec]/10 transition-colors">
                                    <span className="material-symbols-outlined text-[14px] text-slate-500 group-hover:text-[#1313ec]">groups</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">2017 - 2018</p>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Staff at BEM ITS</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ministry of Student Development. Led &quot;ITS Data Summit&quot; project.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex gap-4 pb-8 group">
                                <div className="z-10 mt-1 size-6 rounded-full bg-slate-100 dark:bg-[#282839] border-2 border-slate-300 dark:border-slate-500 flex items-center justify-center shrink-0 group-hover:border-[#1313ec] group-hover:bg-[#1313ec]/10 transition-colors">
                                    <span className="material-symbols-outlined text-[14px] text-slate-500 group-hover:text-[#1313ec]">work_history</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">2018 (3 mos)</p>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Data Analyst Intern</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Traveloka, Jakarta. Worked on customer segmentation models.</p>
                                </div>
                            </div>

                            {/* Step 4 (Current) */}
                            <div className="relative flex gap-4 group">
                                <div className="z-10 mt-1 size-6 rounded-full bg-[#1313ec] border-4 border-white dark:border-[#15151e] shadow-lg flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[12px] text-white">star</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-[#1313ec] font-bold mb-0.5">Current Role</p>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Senior Data Scientist</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">GoTo Group. Leading the recommendation engine team.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="p-6 border-t border-slate-200 dark:border-[#282839] bg-slate-50 dark:bg-[#1a1a24]">
                        <button className="w-full h-12 flex items-center justify-center gap-2 bg-[#1313ec] hover:bg-blue-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 mb-3">
                            <span className="material-symbols-outlined">mail</span>
                            Message for Advice
                        </button>
                        <button className="w-full h-10 flex items-center justify-center gap-2 bg-transparent hover:bg-slate-200 dark:hover:bg-[#282839] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#3b3b54] rounded-lg font-medium transition-colors">
                            View Full Profile
                        </button>
                    </div>
                </aside>

                <style jsx global>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          /* Custom scrollbar for dark theme */
          ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
          }
          ::-webkit-scrollbar-track {
              background: #101022; 
          }
          ::-webkit-scrollbar-thumb {
              background: #282839; 
              border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
              background: #3b3b54; 
          }
        `}</style>
            </main>
        </div>
    );
}
