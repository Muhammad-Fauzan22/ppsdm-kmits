"use client";

import React from 'react';

export default function VerifierPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#102218] text-[#111118] dark:text-white font-[family-name:var(--font-space-grotesk)] overflow-x-hidden min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e5e5] dark:border-[#282839] bg-white dark:bg-[#111118] px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4 text-[#111118] dark:text-white">
                    <div className="size-8 flex items-center justify-center bg-[#1313ec] rounded-lg text-white">
                        <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                </div>
                <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                    <nav className="flex items-center gap-9">
                        <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors" href="#">Home</a>
                        <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors" href="#">Portfolio</a>
                        <a className="text-[#1313ec] text-sm font-medium leading-normal" href="#">Verifier</a>
                        <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors" href="#">Skill Passport</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#1313ec]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAecnUDHzY0YBWy3gnD5cTcaY5JjUCskAh6FBNRLUFjbjAgG-pVIOz3zvnafySONQyR_WqfW7ROz8lAvW17JWsKvpD3MWn0c3PGwUpkKywyQv4yx_iNLDjLRPv0XL4GDWrEb7mzXGjAVzSNmj_KeBgmqBAdNMoxGgVFTs8SRFBNak5B3XYZn5XMMM3sbef-u53PP2IeXGp68kocoKe1pHJpsewxGZcIgHkllIMtsT5TeFKVpncNloXFe2msz4ldvT9T2fXshy0sBKM")' }}></div>
                    </div>
                </div>
                <button className="md:hidden">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full">
                <div className="flex flex-col w-full max-w-[1200px] flex-1">
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 px-4 pb-6">
                        <a className="text-[#6b6b7f] dark:text-[#9d9db9] text-sm font-medium leading-normal hover:underline" href="#">Home</a>
                        <span className="text-[#6b6b7f] dark:text-[#9d9db9] text-sm font-medium leading-normal">/</span>
                        <a className="text-[#6b6b7f] dark:text-[#9d9db9] text-sm font-medium leading-normal hover:underline" href="#">Portfolio</a>
                        <span className="text-[#6b6b7f] dark:text-[#9d9db9] text-sm font-medium leading-normal">/</span>
                        <span className="text-[#1313ec] text-sm font-medium leading-normal">O2O Verifier</span>
                    </div>

                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4 mb-8">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">O2O Activity Verifier</h1>
                            <p className="text-[#6b6b7f] dark:text-[#9d9db9] text-base font-normal leading-normal">
                                Bridge your physical campus presence with your digital blockchain portfolio. Scan into events to mint your proof of attendance.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-600 dark:text-green-400 text-sm font-medium">
                            <span className="material-symbols-outlined text-[18px] animate-pulse">wifi_tethering</span>
                            Blockchain Network: Active
                        </div>
                    </div>

                    {/* Main Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                        {/* Left Column: Context & History (Width: 7/12) */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Stats Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#181825] border border-[#e5e5e5] dark:border-[#3b3b54] shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-[#1313ec]/10 rounded-lg text-[#1313ec]">
                                            <span className="material-symbols-outlined">hotel_class</span>
                                        </div>
                                        <p className="text-[#6b6b7f] dark:text-[#9d9db9] text-sm font-medium uppercase tracking-wider">Skill Impact</p>
                                    </div>
                                    <p className="text-3xl font-bold leading-tight">+15 XP <span className="text-sm font-normal text-[#6b6b7f] dark:text-[#9d9db9] align-middle ml-1">Pending Mint</span></p>
                                    <div className="w-full bg-[#e5e5e5] dark:bg-[#282839] rounded-full h-1.5 mt-2">
                                        <div className="bg-[#1313ec] h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#181825] border border-[#e5e5e5] dark:border-[#3b3b54] shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                            <span className="material-symbols-outlined">verified</span>
                                        </div>
                                        <p className="text-[#6b6b7f] dark:text-[#9d9db9] text-sm font-medium uppercase tracking-wider">Verified Events</p>
                                    </div>
                                    <p className="text-3xl font-bold leading-tight">12 <span className="text-sm font-normal text-[#6b6b7f] dark:text-[#9d9db9] align-middle ml-1">This Semester</span></p>
                                    <p className="text-xs text-[#6b6b7f] dark:text-[#9d9db9]">Last verified: 2 days ago</p>
                                </div>
                            </div>

                            {/* Pending Verifications List */}
                            <div className="flex flex-col rounded-xl bg-white dark:bg-[#181825] border border-[#e5e5e5] dark:border-[#3b3b54] shadow-sm overflow-hidden h-full">
                                <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5] dark:border-[#3b3b54]">
                                    <h3 className="text-lg font-bold leading-tight tracking-tight">PENDING VERIFICATION</h3>
                                    <button className="text-[#1313ec] text-sm font-medium hover:underline">View History</button>
                                </div>
                                <div className="flex flex-col divide-y divide-[#e5e5e5] dark:divide-[#3b3b54]">
                                    {/* Item 1: Processing */}
                                    <div className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-[#f6f6f8] dark:hover:bg-[#1f1f2e] transition-colors group">
                                        <div className="flex items-center justify-center size-12 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                                            <span className="material-symbols-outlined">podium</span>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-base">Leadership Seminar 101</h4>
                                                <span className="text-xs font-mono text-[#6b6b7f] dark:text-[#9d9db9]">Today, 10:30 AM</span>
                                            </div>
                                            <p className="text-sm text-[#6b6b7f] dark:text-[#9d9db9]">Auditorium B • Org: Student Council</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-400 text-sm animate-spin">sync</span>
                                                <span className="text-xs font-medium text-orange-500">Verifying on Blockchain (Confirming Blocks...)</span>
                                            </div>
                                            <p className="text-[10px] font-mono text-[#6b6b7f] dark:text-[#5d5d6d] mt-1">TxHash: 0x82...3f9a</p>
                                        </div>
                                    </div>
                                    {/* Item 2: Verified (Recent) */}
                                    <div className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-[#f6f6f8] dark:hover:bg-[#1f1f2e] transition-colors group">
                                        <div className="flex items-center justify-center size-12 rounded-lg bg-green-500/10 text-green-500 shrink-0">
                                            <span className="material-symbols-outlined">forest</span>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-base">Campus Clean-up Drive</h4>
                                                <span className="text-xs font-mono text-[#6b6b7f] dark:text-[#9d9db9]">Yesterday</span>
                                            </div>
                                            <p className="text-sm text-[#6b6b7f] dark:text-[#9d9db9]">Main Grounds • Org: EcoClub</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                                <span className="text-xs font-medium text-green-500">Verified via Polygon</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Item 3: Pending Approval */}
                                    <div className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-[#f6f6f8] dark:hover:bg-[#1f1f2e] transition-colors group opacity-80">
                                        <div className="flex items-center justify-center size-12 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                                            <span className="material-symbols-outlined">sports_tennis</span>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-base">Badminton Tournament</h4>
                                                <span className="text-xs font-mono text-[#6b6b7f] dark:text-[#9d9db9]">2 days ago</span>
                                            </div>
                                            <p className="text-sm text-[#6b6b7f] dark:text-[#9d9db9]">Sports Center • Org: Athletics Dept</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                                                <span className="text-xs font-medium text-gray-400 dark:text-gray-400">Waiting for Organizer Approval</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 mt-auto border-t border-[#e5e5e5] dark:border-[#3b3b54] bg-[#f9f9fb] dark:bg-[#13131c]">
                                    <p className="text-center text-xs text-[#6b6b7f] dark:text-[#9d9db9]">Only events from the last 30 days are shown here.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Mobile Verifier Interface (Width: 5/12) */}
                        <div className="lg:col-span-5 flex justify-center lg:justify-end">
                            {/* Mobile Card Container */}
                            <div className="relative w-full max-w-[380px] bg-white dark:bg-[#000000] border border-[#e5e5e5] dark:border-[#282839] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-fit">
                                {/* Card Header */}
                                <div className="bg-[#1313ec]/5 p-6 border-b border-[#e5e5e5] dark:border-[#282839] flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-[#1313ec] uppercase tracking-widest">Digital ID</p>
                                        <h3 className="text-xl font-bold dark:text-white">Student Pass</h3>
                                    </div>
                                    <div className="size-8 rounded-full bg-[#1313ec]/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#1313ec] text-sm">fingerprint</span>
                                    </div>
                                </div>
                                {/* Card Body: QR Section */}
                                <div className="p-8 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-white to-[#f6f6f8] dark:from-[#111118] dark:to-[#0b0b10] flex-1">
                                    {/* Dynamic QR Container */}
                                    <div className="relative group cursor-pointer">
                                        {/* Animated Corners */}
                                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#1313ec] rounded-tl-lg"></div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#1313ec] rounded-tr-lg"></div>
                                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#1313ec] rounded-bl-lg"></div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#1313ec] rounded-br-lg"></div>
                                        <div className="bg-white p-4 rounded-xl shadow-lg transition-transform group-hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(19,19,236,0.4)]">
                                            <img alt="Dynamic verification QR code for student identity" className="size-48 md:size-56 object-contain mix-blend-multiply dark:mix-blend-normal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAAs54yp21NztU6sHDHT8fRAnTSszPsU0KbIobvEL29DRH4hP061yx808X6mXNQFAguFAAg_5s4YwSUOJc0D3OdVx-BAgUsckC_KMlzuvigvljtunbQqSUwoTs9e7hIotZ_if0-RamFYBOgB6ZBQWIj-P1xpELvaZ7r8-gHJwCCcry19_nMo0hXEQiHKJEt_LgCZxJh6ETNGmL_dQXuRZFimd-6qzVdZHmlcXBo4EZabFgzqa2egxQ4MYsnESa5DJbfYnsfvAR3M4" />
                                        </div>
                                        {/* Live Indicator */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#1313ec] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                            PPSDM-SECURE
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-2 text-xs font-mono text-[#6b6b7f] dark:text-[#9d9db9]">
                                            <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                                            <span>Token refreshes in <span className="text-[#1313ec] font-bold">00:42</span></span>
                                        </div>
                                        <p className="text-xs text-[#6b6b7f] dark:text-[#6b6b7f]">Scan at event entrance</p>
                                    </div>
                                    <div className="w-full h-px bg-[#e5e5e5] dark:bg-[#282839] my-2"></div>
                                    {/* Action Button */}
                                    <button className="w-full py-4 bg-[#1313ec] hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#1313ec]/30 hover:shadow-[#1313ec]/50 group">
                                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">qr_code_scanner</span>
                                        Scan Event Code
                                    </button>
                                    <p className="text-center text-xs text-[#6b6b7f] dark:text-[#5d5d6d] max-w-[200px] leading-relaxed">
                                        Use this button to scan an event organizer's code instead of showing yours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer for context */}
            <footer className="mt-12 border-t border-[#e5e5e5] dark:border-[#282839] bg-white dark:bg-[#0f0f15] py-8 w-full">
                <div className="flex justify-center px-4 md:px-10 max-w-[1600px] mx-auto w-full">
                    <div className="max-w-[1200px] w-full flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[#6b6b7f] dark:text-[#6b6b7f]">© 2024 PPSDM KMM. Blockchain Verification System v2.1</p>
                        <div className="flex gap-4">
                            <a className="text-sm text-[#6b6b7f] hover:text-[#1313ec]" href="#">Privacy</a>
                            <a className="text-sm text-[#6b6b7f] hover:text-[#1313ec]" href="#">Terms</a>
                            <a className="text-sm text-[#6b6b7f] hover:text-[#1313ec]" href="#">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
