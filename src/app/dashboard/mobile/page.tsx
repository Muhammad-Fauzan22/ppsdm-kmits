"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function StudentMobileDashboard() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-screen p-4 font-[family-name:var(--font-manrope)] text-white">
            {/* Desktop Wrapper for Mobile View */}
            <div className="relative w-full max-w-[390px] h-[844px] bg-[#f5f7f8] dark:bg-[#0f1923] rounded-[40px] shadow-2xl border-[8px] border-[#2a2a2a] overflow-hidden flex flex-col group/design-root">
                {/* Status Bar Area (Decorative) */}
                <div className="h-6 w-full bg-[#0f1923] flex justify-between items-center px-6 pt-2 z-50">
                    <span className="text-[10px] font-bold text-white">9:41</span>
                    <div className="flex gap-1.5 text-white">
                        <Icon name="Signal" className="text-[14px]" />
                        <Icon name="Wifi" className="text-[14px]" />
                        <Icon name="BatteryFull" className="text-[14px]" />
                    </div>
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto mobile-scroll pb-[100px]">
                    {/* Top Header */}
                    <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-[#0f1923]/95 backdrop-blur-sm z-40 border-b border-[#27303a]">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-[#003366] flex items-center justify-center text-white">
                                <Icon name="GraduationCap" className="text-[18px]" />
                            </div>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">PPSDM Student</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <Icon name="Bell" />
                            </button>
                            <div className="size-9 rounded-full bg-cover bg-center border border-[#394756]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAffZ14WO-W7P5rFXqyMXJojAmzynEQ88voWYE5zdVYOJJ4Yc7k9tqK2Sf9tFZ5tfM_Dl2xCHxWLjsB8A_wa-16dka7j56qEYW0x-h6F19dPm9bcuMGlGGnxBi8IuWr4wu2VFJ2XdNkV2tf_dydCYuT6l7EmdH5PVScpndIuQOZ96xDBT1DjsZlrMa-8GU9a9wzItyxkfnmESe1z7M_WO1RwuJYjQt_o7sYx1XZsOxvez4KG-gZmqc9-fwbpq0e8o-SjdgKX_fKcDc')" }}>
                            </div>
                        </div>
                    </header>
                    {/* Page Heading */}
                    <div className="px-6 pt-6 pb-2">
                        <p className="text-[#9aabbc] text-sm font-medium mb-1">Welcome back,</p>
                        <h1 className="text-[#101418] dark:text-white text-3xl font-bold leading-tight">Dashboard</h1>
                    </div>
                    {/* Stats Section */}
                    <div className="px-6 py-4">
                        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
                            <div className="flex min-w-[140px] flex-col gap-2 rounded-xl p-4 bg-[#1b2128] border border-[#394756]">
                                <div className="flex items-center gap-2 text-[#4DA3FF]">
                                    <Icon name="Star" className="text-[20px]" />
                                    <p className="text-sm font-medium">GPA</p>
                                </div>
                                <p className="text-white text-2xl font-bold">3.8</p>
                            </div>
                            <div className="flex min-w-[140px] flex-col gap-2 rounded-xl p-4 bg-[#1b2128] border border-[#394756]">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Icon name="CreditCard" className="text-[20px]" />
                                    <p className="text-sm font-medium">Credits</p>
                                </div>
                                <p className="text-white text-2xl font-bold">85</p>
                            </div>
                        </div>
                    </div>
                    {/* "Upcoming" Section */}
                    <div className="px-6 py-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[#101418] dark:text-white text-lg font-bold">Upcoming</h3>
                            <Link className="text-sm text-[#4DA3FF] font-medium" href="#">See all</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {/* Card 1 */}
                            <div className="flex flex-col gap-3 rounded-xl bg-[#1b2128] p-4 border border-[#27303a] shadow-lg">
                                <div className="h-32 w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIrSaaboIFYJh5CUtEXyIGxvy90i5xLdE1q7ek8RVbYyfHIH2cAHMpG2rh8KgB9szsPs3aK5Jw8kAOxRYPzn0OWGBRXr1M_Zet3apKERs4gvAKyzQYMBxbt-Oyp5J-UIXTi4KrJ_LGVYc4fBN-kYnzy79D-WRwuxFMphng-qAN8C5jVmzBW92k8miCSruJmDGY2FRFAeH_SaCobw_RLi1ozPABJCW5teDN2WGwbyysL2pEupA-GdiBzwZwBPTNvLN5jKlj6n_bJeU')" }}></div>
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-white font-bold text-lg">UX Design Class</p>
                                        <span className="bg-[#003366]/20 text-[#4DA3FF] text-xs px-2 py-1 rounded font-medium">10:00 AM</span>
                                    </div>
                                    <p className="text-[#9aabbc] text-sm">Room 304 • Prof. Anderson</p>
                                </div>
                            </div>
                            {/* Card 2 */}
                            <div className="flex flex-col gap-3 rounded-xl bg-[#1b2128] p-4 border border-[#27303a] shadow-lg">
                                <div className="h-32 w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_XKFelsrxQOdy2ZBjbiwPawKYnTrBGRu-6UmA4fOPuVZYRBr91bl8oztt2zkidtZHDDtu7lj6QZkyMy8N2N3RewZjR47ej6bNFtTFTE9Bl0pgA_OaYs346IfYvClDLzOUkG4ktKAWD63_4SVQs0KkalZf7zU6bkQSHWpmvBtVCK0JY-bTAjHv6PvdEi7ck5YWaYkn8txm5xuRg60DfYTq-WHz4Pq0u03rvlVB7ndgt3kFWXmuknT0xvObykb5rBWHBkVDx58DCJ0')" }}></div>
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-white font-bold text-lg">Research Methods</p>
                                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-medium">Due Today</span>
                                    </div>
                                    <p className="text-[#9aabbc] text-sm">Assignment submission • 11:59 PM</p>
                                </div>
                            </div>
                            {/* Card 3 (Padding content) */}
                            <div className="flex flex-col gap-3 rounded-xl bg-[#1b2128] p-4 border border-[#27303a] shadow-lg">
                                <div className="h-24 w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCe097IWwaY4UVQiiPdyxEmE_3sd-Hb1DjCIs9WwFmDb2gzjZ6ftjluw5TaYQeczJQ4AHkmCt2xkiOqFRpe7LJKPL6HaD9fntQ6EBq-l3Q9PiCZRbUT-wPS6-0sh3E5VXj4bnXnT2LDUaJbhGBFWeqJ3c79CbtH1WSwgOop3dl8K7qEJylVq4kUuJYUXCxlZNgoXxNk8zkUMJUM75z4DmRgSlTm8sLM3tTZhoEPyk9XBSUBfPtu6al7UwWJZo48WO_XBWR8QrXIAEg')" }}></div>
                                <div>
                                    <p className="text-white font-bold">Library Loan</p>
                                    <p className="text-[#9aabbc] text-sm">Return 'Design of Everyday Things'</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom Navigation Bar */}
                {/* Fixed at bottom, Glassmorphism style */}
                <nav className="absolute bottom-0 left-0 w-full bg-[#0f1923]/85 backdrop-blur-xl border-t border-[#394756]/50 pb-6 pt-2 px-2 z-50">
                    <ul className="flex justify-between items-end w-full max-w-[360px] mx-auto font-[family-name:var(--font-poppins)]">
                        {/* 1. Dashboard (Active) */}
                        <li className="flex-1 flex justify-center group cursor-pointer">
                            <div className="flex flex-col items-center gap-1 w-full relative">
                                {/* Top Indicator Line */}
                                <div className="absolute -top-[9px] w-8 h-[3px] bg-[#003366] rounded-b-full shadow-[0_0_8px_rgba(0,51,102,0.8)]"></div>
                                <Icon name="LayoutDashboard" className="text-[24px] text-[#4DA3FF] transition-colors duration-200" />
                                <span className="text-[10px] font-medium text-[#4DA3FF] tracking-wide">Dashboard</span>
                            </div>
                        </li>
                        {/* 2. Assessment */}
                        <li className="flex-1 flex justify-center group cursor-pointer">
                            <div className="flex flex-col items-center gap-1 w-full text-[#8b9bb4] hover:text-[#c4d0e0] transition-colors duration-200">
                                <Icon name="Shield" className="text-[24px]" />
                                <span className="text-[10px] font-medium tracking-wide">Assessment</span>
                            </div>
                        </li>
                        {/* 3. Library */}
                        <li className="flex-1 flex justify-center group cursor-pointer">
                            <div className="flex flex-col items-center gap-1 w-full text-[#8b9bb4] hover:text-[#c4d0e0] transition-colors duration-200">
                                <Icon name="BookOpen" className="text-[24px]" />
                                <span className="text-[10px] font-medium tracking-wide">Library</span>
                            </div>
                        </li>
                        {/* 4. RPI */}
                        <li className="flex-1 flex justify-center group cursor-pointer">
                            <div className="flex flex-col items-center gap-1 w-full text-[#8b9bb4] hover:text-[#c4d0e0] transition-colors duration-200">
                                <Icon name="Activity" className="text-[24px]" />
                                <span className="text-[10px] font-medium tracking-wide">RPI</span>
                            </div>
                        </li>
                        {/* 5. Portfolio */}
                        <li className="flex-1 flex justify-center group cursor-pointer">
                            <div className="flex flex-col items-center gap-1 w-full text-[#8b9bb4] hover:text-[#c4d0e0] transition-colors duration-200">
                                <Icon name="Trophy" className="text-[24px]" />
                                <span className="text-[10px] font-medium tracking-wide">Portfolio</span>
                            </div>
                        </li>
                    </ul>
                    {/* Home Indicator (iPhone style) */}
                    <div className="flex justify-center mt-3">
                        <div className="w-32 h-1 bg-white/20 rounded-full"></div>
                    </div>
                </nav>
            </div>
            <style jsx global>{`
                .mobile-scroll::-webkit-scrollbar { width: 4px; }
                .mobile-scroll::-webkit-scrollbar-track { background: transparent; }
                .mobile-scroll::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
