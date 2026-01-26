"use client";

import Link from "next/link";
import { useState } from "react";

export default function AssessmentRunner() {
    const [selectedOption, setSelectedOption] = useState<number | null>(3);

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white font-[family-name:var(--font-lexend)] min-h-screen flex flex-col overflow-hidden selection:bg-[#135bec]/30 selection:text-[#135bec]">
            {/* Top Navigation & Progress */}
            <header className="fixed top-0 w-full z-50 transition-all duration-300">
                {/* Progress Bar Line */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800">
                    <div className="h-full bg-[#135bec] shadow-[0_0_10px_rgba(19,91,236,0.7)] transition-all duration-700 ease-out" style={{ width: "15%" }}></div>
                </div>
                {/* Navbar Content */}
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="size-8 rounded-lg bg-[#135bec]/10 dark:bg-white/5 flex items-center justify-center text-[#135bec] backdrop-blur-sm border border-white/5">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                        </div>
                        <h2 className="text-sm font-bold tracking-wide uppercase text-slate-600 dark:text-slate-300">PPSDM KMM</h2>
                    </div>
                    <Link href="/assessment" className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors" title="Exit Assessment">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center relative w-full h-full px-6 md:px-12 pt-12 pb-24 z-10">
                {/* Content Container */}
                <div className="w-full max-w-4xl flex flex-col gap-10 animate-[slideUpFade_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {/* Question Header */}
                    <div className="flex flex-col gap-6">
                        {/* Meta Badge */}
                        <div className="flex items-center gap-2">
                            <span className="text-[#135bec] font-bold text-sm tracking-wider uppercase">Question 3 <span className="text-slate-400 dark:text-slate-600 font-normal normal-case mx-1">of</span> 20</span>
                            <span className="material-symbols-outlined text-base text-[#135bec] animate-pulse">arrow_right_alt</span>
                        </div>
                        {/* Main Question Text */}
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight md:leading-[1.15] text-slate-900 dark:text-white tracking-tight">
                            How satisfied are you with the current pacing of the curriculum?
                        </h1>
                        {/* Helper Text */}
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-light">
                            Consider the workload and speed of new topics introduced this semester.
                        </p>
                    </div>

                    {/* Likert Scale Interaction Area */}
                    <div className="w-full mt-4">
                        {/* Grid Container */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                            {[
                                { emoji: "😡", label: "Very Poor", value: 1 },
                                { emoji: "☹️", label: "Poor", value: 2 },
                                { emoji: "😐", label: "Neutral", value: 3 },
                                { emoji: "🙂", label: "Good", value: 4 },
                                { emoji: "🤩", label: "Excellent", value: 5 },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedOption(option.value)}
                                    className={`group relative h-40 md:h-48 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white dark:bg-[#1a202c] border-2 transition-all duration-200 ease-out outline-none 
                                    ${selectedOption === option.value
                                            ? "border-[#135bec] ring-1 ring-[#135bec]/30 shadow-[0_0_20px_-5px_rgba(19,91,236,0.5)] scale-[1.02]"
                                            : "border-transparent hover:border-[#135bec]/50 dark:hover:border-[#135bec]/50 hover:bg-[#135bec]/5 dark:hover:bg-[#135bec]/10 shadow-sm dark:shadow-none hover:shadow-[0_0_20px_-5px_rgba(19,91,236,0.5)] focus:ring-4 focus:ring-[#135bec]/20"}`}
                                >
                                    <span className={`text-5xl md:text-6xl transition-all duration-300 transform 
                                        ${selectedOption === option.value ? "scale-110" : "filter grayscale group-hover:grayscale-0 group-hover:scale-110 group-active:scale-95"}`}>
                                        {option.emoji}
                                    </span>
                                    <span className={`font-medium transition-colors ${selectedOption === option.value ? "text-[#135bec] font-bold" : "text-slate-600 dark:text-slate-300 group-hover:text-[#135bec]"}`}>
                                        {option.label}
                                    </span>
                                    {selectedOption === option.value && (
                                        <div className="absolute -top-3 bg-[#135bec] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg">
                                            Selected
                                        </div>
                                    )}
                                    <span className={`absolute top-3 right-3 text-[10px] font-bold border rounded px-1.5 py-0.5 hidden md:block transition-opacity
                                        ${selectedOption === option.value
                                            ? "text-[#135bec]/50 border-[#135bec]/30"
                                            : "text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100"}`}>
                                        {option.value}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer / Navigation Controls */}
            <footer className="fixed bottom-0 left-0 w-full p-6 md:p-10 z-40 pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-end justify-between">
                    {/* Keyboard Hint (Hidden on mobile) */}
                    <div className="hidden md:flex flex-col gap-1 pointer-events-auto opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span className="material-symbols-outlined text-lg">keyboard</span>
                            <span>Shortcuts</span>
                        </div>
                        <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <span className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">1</span>
                            <span>-</span>
                            <span className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">5</span>
                            <span className="mx-1">to select</span>
                            <span className="text-slate-400">|</span>
                            <span className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs">Enter</span>
                            <span className="mx-1">Next</span>
                        </div>
                    </div>
                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-4 ml-auto pointer-events-auto">
                        <button className="group flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600">
                            <span className="material-symbols-outlined text-xl group-hover:-translate-y-0.5 transition-transform">arrow_upward</span>
                            Previous
                        </button>
                        <button className="group flex items-center gap-3 pl-8 pr-6 py-3.5 rounded-xl bg-[#135bec] hover:bg-blue-600 text-white font-bold shadow-lg shadow-[#135bec]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:ring-4 focus:ring-[#135bec]/30">
                            Next
                            <span className="bg-white/20 rounded p-0.5">
                                <span className="material-symbols-outlined text-lg block group-hover:translate-y-0.5 transition-transform">arrow_downward</span>
                            </span>
                        </button>
                    </div>
                </div>
            </footer>

            {/* Background decorative element for depth */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#135bec]/10 blur-[120px] rounded-full mix-blend-screen opacity-30"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen opacity-20"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcZ3OH2-j3TMzWF3oeYtLUtuSbSA15G1Y43-cg68cRqFHxjoh6URXMJ24u-loEKcob4drjNMNFspzeXQ2hMOnCmbcmG3o6ncL-ylv0iWGEhnIqgEiif2RC1qWPzZRPaOd745qJ4O8r0tAFK70s-qSHFKHG9EKV33dUUWZP-oz-d2xpuzop7HJHuT8v3fwWh4GyXgGqNoU8RlRXgufBUpiyBCR-w16HJjHXRflajhAoLKVlSeZZ9KvRuXchufAPr74NgA08U4Ul8t8')" }}></div>
            </div>
            <style jsx global>{`
                @keyframes slideUpFade {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
