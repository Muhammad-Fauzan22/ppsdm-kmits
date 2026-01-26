"use client";

import React from 'react';

export default function StoriesPage() {
    return (
        <div className="bg-[#f5f5f8] dark:bg-[#101022] font-[family-name:var(--font-lexend)] text-[#111118] dark:text-white antialiased selection:bg-[#0d0df2] selection:text-white">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                {/* TopNavBar */}
                <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a2e] px-10 py-3 shadow-sm">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-[#111118] dark:text-white">
                            <div className="size-8 flex items-center justify-center text-[#0d0df2]">
                                <span className="material-symbols-outlined !text-3xl">school</span>
                            </div>
                            <h2 className="text-[#111118] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                        </div>
                        <div className="hidden lg:flex items-center gap-9">
                            <a className="text-[#111118] dark:text-white text-sm font-medium leading-normal hover:text-[#0d0df2] transition-colors" href="#">Home</a>
                            <a className="text-[#0d0df2] text-sm font-bold leading-normal" href="#">Community</a>
                            <a className="text-[#111118] dark:text-white text-sm font-medium leading-normal hover:text-[#0d0df2] transition-colors" href="#">Impact</a>
                            <a className="text-[#111118] dark:text-white text-sm font-medium leading-normal hover:text-[#0d0df2] transition-colors" href="#">Apply</a>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                <div className="text-[#60608a] flex border-none bg-[#f5f5f8] dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111118] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f5f5f8] dark:bg-gray-800 focus:border-none h-full placeholder:text-[#60608a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search profiles" defaultValue="" />
                            </div>
                        </label>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-[#0d0df2] hover:bg-blue-700 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Login</span>
                        </button>
                    </div>
                </header>

                <div className="layout-container flex h-full grow flex-col">
                    <div className="px-5 md:px-20 xl:px-40 flex flex-1 justify-center py-5">
                        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                            {/* Breadcrumbs */}
                            <div className="flex flex-wrap gap-2 p-4">
                                <a className="text-[#60608a] hover:text-[#0d0df2] text-base font-medium leading-normal" href="#">Home</a>
                                <span className="text-[#60608a] text-base font-medium leading-normal">/</span>
                                <a className="text-[#60608a] hover:text-[#0d0df2] text-base font-medium leading-normal" href="#">Community</a>
                                <span className="text-[#60608a] text-base font-medium leading-normal">/</span>
                                <span className="text-[#111118] dark:text-white text-base font-medium leading-normal">Stories</span>
                            </div>
                            {/* PageHeading */}
                            <div className="flex flex-wrap justify-between gap-3 p-4 mb-4">
                                <div className="flex min-w-72 flex-col gap-3">
                                    <h1 className="text-[#111118] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Student Transformation &amp; Success Gallery</h1>
                                    <p className="text-[#60608a] text-lg font-normal leading-normal max-w-3xl">Measuring Real-World Impact: From Baseline to Excellence across 9 Dimensions. Explore the journeys of our diverse community.</p>
                                </div>
                            </div>
                            {/* Stats / Impact Dashboard */}
                            <div className="flex flex-wrap gap-4 p-4 mb-8">
                                <div className="flex min-w-[158px] flex-1 flex-col justify-between gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1a2e] shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-[#0d0df2]">
                                            <span className="material-symbols-outlined">school</span>
                                        </div>
                                        <p className="text-[#60608a] text-sm font-medium leading-normal uppercase tracking-wider">Career Readiness</p>
                                    </div>
                                    <p className="text-[#111118] dark:text-white tracking-tight text-4xl font-bold leading-tight">92%</p>
                                    <p className="text-sm text-green-600 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> +5% vs Last Year</p>
                                </div>
                                <div className="flex min-w-[158px] flex-1 flex-col justify-between gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1a2e] shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-[#0d0df2]">
                                            <span className="material-symbols-outlined">stacked_line_chart</span>
                                        </div>
                                        <p className="text-[#60608a] text-sm font-medium leading-normal uppercase tracking-wider">Avg. Dimensional Growth</p>
                                    </div>
                                    <p className="text-[#111118] dark:text-white tracking-tight text-4xl font-bold leading-tight">40%</p>
                                    <p className="text-sm text-[#60608a] font-medium">Across all 9 metrics</p>
                                </div>
                                <div className="flex min-w-[158px] flex-1 flex-col justify-between gap-2 rounded-xl p-6 bg-white dark:bg-[#1a1a2e] shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-[#0d0df2]">
                                            <span className="material-symbols-outlined">auto_stories</span>
                                        </div>
                                        <p className="text-[#60608a] text-sm font-medium leading-normal uppercase tracking-wider">Alumni Stories</p>
                                    </div>
                                    <p className="text-[#111118] dark:text-white tracking-tight text-4xl font-bold leading-tight">450+</p>
                                    <p className="text-sm text-[#60608a] font-medium">Documented transformations</p>
                                </div>
                            </div>
                            {/* Transformation Map (Horizontal Timeline) */}
                            <div className="p-4 mb-10">
                                <h3 className="text-[#111118] dark:text-white text-xl font-bold mb-6">The Transformation Map</h3>
                                <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
                                    <div className="min-w-[700px] flex items-center justify-between relative">
                                        {/* Connecting Line */}
                                        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full"></div>
                                        {/* Step 1 */}
                                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                                            <div className="size-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-300 group-hover:border-[#0d0df2] dark:border-gray-600 dark:group-hover:border-[#0d0df2] flex items-center justify-center transition-colors z-10">
                                                <span className="material-symbols-outlined text-gray-500 group-hover:text-[#0d0df2] transition-colors">pause_circle</span>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[#111118] dark:text-white font-bold text-sm">Baseline Assessment</p>
                                                <p className="text-[#60608a] text-xs">Entry Level</p>
                                            </div>
                                        </div>
                                        {/* Step 2 */}
                                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                                            <div className="size-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-300 group-hover:border-[#0d0df2] dark:border-gray-600 dark:group-hover:border-[#0d0df2] flex items-center justify-center transition-colors z-10">
                                                <span className="material-symbols-outlined text-gray-500 group-hover:text-[#0d0df2] transition-colors">hourglass_top</span>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[#111118] dark:text-white font-bold text-sm">Dimensional Growth</p>
                                                <p className="text-[#60608a] text-xs">Skill Acquisition</p>
                                            </div>
                                        </div>
                                        {/* Step 3 */}
                                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                                            <div className="size-12 rounded-full bg-white dark:bg-gray-800 border-4 border-[#0d0df2] dark:border-[#0d0df2] flex items-center justify-center z-10 shadow-[0_0_0_4px_rgba(13,13,242,0.2)]">
                                                <span className="material-symbols-outlined text-[#0d0df2] icon-filled">rocket_launch</span>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[#111118] dark:text-white font-bold text-sm">Practical Application</p>
                                                <p className="text-[#60608a] text-xs">Real-world Projects</p>
                                            </div>
                                        </div>
                                        {/* Step 4 */}
                                        <div className="flex flex-col items-center gap-3 group cursor-pointer">
                                            <div className="size-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-300 group-hover:border-[#0d0df2] dark:border-gray-600 dark:group-hover:border-[#0d0df2] flex items-center justify-center transition-colors z-10">
                                                <span className="material-symbols-outlined text-gray-500 group-hover:text-[#0d0df2] transition-colors">stars</span>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[#111118] dark:text-white font-bold text-sm">Excellence Achieved</p>
                                                <p className="text-[#60608a] text-xs">Alumni Status</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Filters */}
                            <div className="px-4 mb-6">
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    <button className="px-5 py-2 rounded-full bg-[#0d0df2] text-white text-sm font-bold whitespace-nowrap shadow-md shadow-blue-500/30">All Stories</button>
                                    <button className="px-5 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#60608a] text-sm font-medium border border-gray-200 dark:border-gray-700 whitespace-nowrap transition-colors">Entrepreneur</button>
                                    <button className="px-5 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#60608a] text-sm font-medium border border-gray-200 dark:border-gray-700 whitespace-nowrap transition-colors">Researcher</button>
                                    <button className="px-5 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#60608a] text-sm font-medium border border-gray-200 dark:border-gray-700 whitespace-nowrap transition-colors">Corporate Leader</button>
                                    <button className="px-5 py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#60608a] text-sm font-medium border border-gray-200 dark:border-gray-700 whitespace-nowrap transition-colors">Social Impact</button>
                                </div>
                            </div>
                            {/* Success Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                {/* Card 1 */}
                                <div className="group bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-[#0d0df2]/30 transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="p-6 pb-4 flex items-start gap-4">
                                        <img className="size-16 rounded-full object-cover border-2 border-white shadow-md" alt="Portrait of Sarah Chen, a professional asian woman in business attire smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeQu5oZ0vgh5t4Tzf_uJrXBZ8AhdSwAZyR78AfxLpPzIeCs95dsJkCH3MveJXs8cNOG64Zg90_fqPkcbPElrhsMcze5n9AFqOHJnc7wM2AAUmjTpLHI41cfiLWoNKtxavtxgtLIXYCiUSmmSu8_mn5Sti_-EJodZjcfXXKcbEPYR9K8C_FUBGPL1rVyb2xkIhMGpg4yXnu0B1ak6NU2yCLTu1RaTZhANMEZnjEqzlZE6wpRIwbDpBEGFAiMvGkNoUFN7wJvMWMB9Y" />
                                        <div>
                                            <h4 className="text-lg font-bold text-[#111118] dark:text-white">Sarah Chen</h4>
                                            <p className="text-sm text-[#0d0df2] font-medium">AI Ethics Researcher</p>
                                            <p className="text-xs text-[#60608a] mt-1">Class of 2023</p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-2 flex-1">
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                                            <p className="text-xs font-semibold text-[#60608a] mb-2 uppercase tracking-wide">Growth Profile</p>
                                            {/* Simple SVG Radar Chart Simulation */}
                                            <svg className="w-28 h-28 drop-shadow-sm transform group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
                                                {/* Grid */}
                                                <polygon fill="none" points="50,10 90,35 90,75 50,90 10,75 10,35" stroke="#e5e7eb" strokeWidth="1"></polygon>
                                                <polygon fill="none" points="50,25 75,40 75,65 50,75 25,65 25,40" stroke="#e5e7eb" strokeWidth="1"></polygon>
                                                {/* Data Shape */}
                                                <polygon fill="rgba(13, 13, 242, 0.1)" points="50,15 85,38 75,70 50,85 20,70 25,30" stroke="#0d0df2" strokeWidth="2"></polygon>
                                            </svg>
                                            <div className="flex gap-4 mt-2 text-xs text-[#60608a]">
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#0d0df2]"></span> Leadership</span>
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#0d0df2]/40"></span> Tech</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#111118] dark:text-white mt-4 line-clamp-2">"This program shifted my perspective from purely technical to holistic impact."</p>
                                    </div>
                                    <div className="p-6 pt-4 mt-auto">
                                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 text-sm font-bold text-[#111118] dark:text-white transition-colors group-hover:border-[#0d0df2] group-hover:text-[#0d0df2]">
                                            <span className="material-symbols-outlined icon-filled text-[20px]">play_circle</span>
                                            Watch Story
                                        </button>
                                    </div>
                                </div>
                                {/* Card 2 */}
                                <div className="group bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-[#0d0df2]/30 transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="p-6 pb-4 flex items-start gap-4">
                                        <img className="size-16 rounded-full object-cover border-2 border-white shadow-md" alt="Portrait of Marcus Johnson, a confident black man in a suit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc_V41BpIxRRVBqLPsF92LK2b3-m5UG0MiNfCAONePVXZNzTAILCNVobwW5W1EvUYOWWv_FSdJqHBpyEcztvWKiIlHPBBd3woUFFf8nVhYBW4ZYK_wNFfIA1svHd-6pJIWQ_5aboyQg8fu-V4kWAAFhBIhndJCJYsCH3Ez8IIZzK0gScCnfItv2eHdO17VfWKXARxGP5dWix8qRy5WqjFacMPo39EAS1CZd7kpzrlwp7_ebRTgivFWwDK0DQO2UPICirryGMYQTj4" />
                                        <div>
                                            <h4 className="text-lg font-bold text-[#111118] dark:text-white">Marcus Johnson</h4>
                                            <p className="text-sm text-[#0d0df2] font-medium">FinTech Founder</p>
                                            <p className="text-xs text-[#60608a] mt-1">Class of 2022</p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-2 flex-1">
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                                            <p className="text-xs font-semibold text-[#60608a] mb-2 uppercase tracking-wide">Growth Profile</p>
                                            <svg className="w-28 h-28 drop-shadow-sm transform group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
                                                <polygon fill="none" points="50,10 90,35 90,75 50,90 10,75 10,35" stroke="#e5e7eb" strokeWidth="1"></polygon>
                                                <polygon fill="none" points="50,25 75,40 75,65 50,75 25,65 25,40" stroke="#e5e7eb" strokeWidth="1"></polygon>
                                                {/* Data Shape: High on right side */}
                                                <polygon fill="rgba(13, 13, 242, 0.1)" points="50,30 88,35 88,75 50,80 15,60 25,40" stroke="#0d0df2" strokeWidth="2"></polygon>
                                            </svg>
                                            <div className="flex gap-4 mt-2 text-xs text-[#60608a]">
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#0d0df2]"></span> Innovation</span>
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#0d0df2]/40"></span> Strategy</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#111118] dark:text-white mt-4 line-clamp-2">"The mentorship network was invaluable. I found my co-founder here."</p>
                                    </div>
                                    <div className="p-6 pt-4 mt-auto">
                                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 text-sm font-bold text-[#111118] dark:text-white transition-colors group-hover:border-[#0d0df2] group-hover:text-[#0d0df2]">
                                            <span className="material-symbols-outlined icon-filled text-[20px]">play_circle</span>
                                            Watch Story
                                        </button>
                                    </div>
                                </div>
                                {/* Card 3 */}
                                <div className="group bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-[#0d0df2]/30 transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="p-6 pb-4 flex items-start gap-4">
                                        <img className="size-16 rounded-full object-cover border-2 border-white shadow-md" alt="Portrait of Elena Rodriguez, a smiling woman with glasses in a lab coat" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_eDMAB_0u0Il6ZxZbzHQDV-ISWsLJirSgasJBJBn7FcPB-nNt-X7QDIY5m-Y-Gu1cDUr-pEt6j75XU8TD2IM84NMFHo8kLskPlz-HJEW6uYdyHMwjVBveK5wJSEG5QJBeqVKS-UXV1-OG8_0ThPTn9Fj-z94j1CuN7Nz3oWYW3Rgk1iHUZU5jcLANDYGmTIxFLn7eXjxxomPvpcrMZtptCZpYn5xlM5nYoe6InEmQvIESR3hFTN7be1P714QkRiYlDpYx2sOtFEY" />
                                        <div>
                                            <h4 className="text-lg font-bold text-[#111118] dark:text-white">Elena Rodriguez</h4>
                                            <p className="text-sm text-[#0d0df2] font-medium">Head of Sustainability</p>
                                            <p className="text-xs text-[#60608a] mt-1">Class of 2021</p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-2 flex-1">
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                                            <p className="text-xs font-semibold text-[#60608a] mb-2 uppercase tracking-wide">Growth Profile</p>
                                            <svg className="w-28 h-28 drop-shadow-sm transform group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
                                                <polygon fill="none" points="50,10 90,35 90,75 50,90 10,75 10,35" stroke="#e5e7eb" strokeWidth="1"></polygon>
                                                <polygon fill="none" points="50,25 75,40 75,65 50,75 25,65 25,40" stroke="#e5e7eb" strokeWidth="1"></polygon>
                                                {/* Data Shape: Balanced */}
                                                <polygon fill="rgba(13, 13, 242, 0.1)" points="50,10 85,40 85,70 50,90 15,70 15,40" stroke="#0d0df2" strokeWidth="2"></polygon>
                                            </svg>
                                            <div className="flex gap-4 mt-2 text-xs text-[#60608a]">
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#0d0df2]"></span> Resilience</span>
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#0d0df2]/40"></span> Ethics</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#111118] dark:text-white mt-4 line-clamp-2">"I learned to balance profit with purpose, a skill crucial for my role today."</p>
                                    </div>
                                    <div className="p-6 pt-4 mt-auto">
                                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 text-sm font-bold text-[#111118] dark:text-white transition-colors group-hover:border-[#0d0df2] group-hover:text-[#0d0df2]">
                                            <span className="material-symbols-outlined icon-filled text-[20px]">play_circle</span>
                                            Watch Story
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Footer / CTA */}
                            <div className="p-4 mt-8">
                                <div className="rounded-2xl bg-[#0d0df2] text-white p-10 md:p-14 text-center relative overflow-hidden">
                                    {/* Abstract Background Pattern */}
                                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, white 0%, transparent 20%), radial-gradient(circle at 90% 80%, white 0%, transparent 20%)' }}></div>
                                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
                                        <h2 className="text-3xl md:text-4xl font-bold">Start Your Own Transformation</h2>
                                        <p className="text-blue-100 text-lg">Join a community of changemakers. Apply for the upcoming cohort or nominate an outstanding peer.</p>
                                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                                            <button className="bg-white text-[#0d0df2] hover:bg-blue-50 px-8 py-3 rounded-lg font-bold text-base transition-colors shadow-lg">Apply Now</button>
                                            <button className="bg-blue-800 text-white hover:bg-blue-900 px-8 py-3 rounded-lg font-bold text-base transition-colors border border-blue-700">Submit a Story</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Simple Footer */}
                            <footer className="p-4 mt-10 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex flex-col md:flex-row justify-between items-center text-[#60608a] text-sm gap-4">
                                    <p>© 2024 PPSDM KMM. All rights reserved.</p>
                                    <div className="flex gap-6">
                                        <a className="hover:text-[#0d0df2]" href="#">Privacy Policy</a>
                                        <a className="hover:text-[#0d0df2]" href="#">Terms of Service</a>
                                        <a className="hover:text-[#0d0df2]" href="#">Contact Support</a>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
          .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .icon-filled {
              font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
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
        </div>
    );
}
