"use client";

import React, { useState } from 'react';

export default function RecoveryPage() {
    const [step, setStep] = useState(1);

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-[family-name:var(--font-inter)] min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#282e39] bg-white dark:bg-[#111318] px-10 py-4 shadow-sm z-10 text-gray-900 dark:text-white">
                <div className="flex items-center gap-4">
                    <div className="size-8 rounded bg-[#135bec] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-xl">shield</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight">PPSDM KMM</h2>
                </div>
                <div>
                    <a className="text-sm font-medium text-gray-500 hover:text-[#135bec] dark:text-[#9da6b9] dark:hover:text-white transition-colors" href="#">Help Center</a>
                </div>
            </header>
            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#135bec 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>
                <div className="w-full max-w-[800px] z-10 flex flex-col gap-8">
                    {/* Page Heading & Intro */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#135bec]/10 mb-2">
                            <span className="material-symbols-outlined text-[#135bec] text-3xl">lock_reset</span>
                        </div>
                        <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Account Recovery</h1>
                        <p className="text-gray-500 dark:text-[#9da6b9] text-base max-w-lg mx-auto">
                            Please follow the steps to regain access to your secure account.
                        </p>
                    </div>
                    {/* Wizard Card */}
                    <div className="bg-white dark:bg-[#1c1f27] rounded-xl shadow-lg border border-gray-200 dark:border-[#282e39] overflow-hidden">
                        {/* Stepper Header */}
                        <div className="bg-gray-50 dark:bg-[#111318]/50 border-b border-gray-200 dark:border-[#282e39] p-6">
                            <div className="flex items-center justify-between relative">
                                {/* Connecting Line */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 dark:bg-[#282e39] -z-10"></div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-0.5 bg-[#135bec] -z-10 transition-all duration-500" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}></div>
                                {/* Step 1 */}
                                <div className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#161920] px-2 z-10">
                                    <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-gray-50 dark:ring-[#161920] ${step >= 1 ? 'bg-[#135bec] text-white' : 'bg-white dark:bg-[#282e39] text-gray-400'}`}>
                                        1
                                    </div>
                                    <span className={`text-xs font-semibold ${step >= 1 ? 'text-[#135bec]' : 'text-gray-500 dark:text-[#9da6b9]'}`}>Identity</span>
                                </div>
                                {/* Step 2 */}
                                <div className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#161920] px-2 z-10">
                                    <div className={`size-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ring-4 ring-gray-50 dark:ring-[#161920] ${step >= 2 ? 'bg-[#135bec] border-[#135bec] text-white' : 'bg-white dark:bg-[#282e39] border-gray-200 dark:border-[#3b4354] text-gray-500'}`}>
                                        2
                                    </div>
                                    <span className={`text-xs font-medium ${step >= 2 ? 'text-[#135bec]' : 'text-gray-900 dark:text-white'}`}>Security</span>
                                </div>
                                {/* Step 3 */}
                                <div className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-[#161920] px-2 z-10">
                                    <div className={`size-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ring-4 ring-gray-50 dark:ring-[#161920] ${step >= 3 ? 'bg-[#135bec] border-[#135bec] text-white' : 'bg-white dark:bg-[#282e39] border-gray-200 dark:border-[#3b4354] text-gray-400'}`}>
                                        3
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 dark:text-[#9da6b9]">Reset</span>
                                </div>
                            </div>
                        </div>

                        {/* Step Content: Identity Verification (Step 1) */}
                        {step === 1 && (
                            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Segmented Control for Input Type */}
                                <div className="flex justify-center mb-8">
                                    <div className="bg-gray-100 dark:bg-[#282e39] p-1 rounded-lg flex w-full max-w-sm">
                                        <button className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-white dark:bg-[#111318] text-[#135bec] shadow-sm transition-all text-center">
                                            Email
                                        </button>
                                        <button className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-gray-500 dark:text-[#9da6b9] hover:text-gray-700 dark:hover:text-white transition-all text-center">
                                            SMS / Phone
                                        </button>
                                    </div>
                                </div>
                                <div className="max-w-md mx-auto space-y-6">
                                    <div className="space-y-4">
                                        <label className="block">
                                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Registered Email Address</span>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-gray-400 dark:text-[#9da6b9]">mail</span>
                                                </div>
                                                <input className="block w-full pl-10 pr-3 py-3 rounded-lg border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#111318] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#64748b] focus:border-[#135bec] focus:ring-[#135bec] sm:text-sm" placeholder="name@example.com" type="email" />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500 dark:text-[#9da6b9]">
                                                We'll send a verification link or code to this email if it matches our records.
                                            </p>
                                        </label>
                                    </div>
                                    {/* CAPTCHA Placeholder */}
                                    <div className="bg-gray-50 dark:bg-[#111318] border border-gray-200 dark:border-[#3b4354] rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input className="rounded border-gray-300 text-[#135bec] focus:ring-[#135bec] h-5 w-5 bg-white dark:bg-[#282e39]" type="checkbox" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">I'm not a robot</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <img alt="reCAPTCHA logo" className="h-6 opacity-70 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV7MYvQyuBf2hq3or0OzUdfk0RVs9tdZzoPNKXxaQqgjFp4y3lYJvA1xiMpRkqfpwQ82XDCDuHMojHvjFxuHdh6w5iHiE3tiTHbPoSeYubhTW2pmWwzSom0_vcHJAVlg4O6frHq5K0Dwq6SyzpEx0upNw4STKY_udSHyb55oC6zBgjCv2HlrjS-aKoFjhCYi23rxAc77Z0MyhvS6vvPxK2TAve-bfzc62jX33vlt1NNEsFvssFeYR4g8WmF7ZYsbnvkM1pdoPZC0s" />
                                            <span className="text-[9px] text-gray-400">Privacy - Terms</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 pt-4">
                                        <button onClick={() => setStep(2)} className="w-full bg-[#135bec] hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                            <span>Continue to Security Challenge</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                        <a className="text-center text-sm font-medium text-gray-500 dark:text-[#9da6b9] hover:text-gray-900 dark:hover:text-white transition-colors" href="#">
                                            Return to Login
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step Content: Security Challenge (Step 2) */}
                        {step === 2 && (
                            <div className="p-8 border-t border-gray-200 dark:border-[#282e39] bg-gray-50/50 dark:bg-[#111318]/20 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="max-w-md mx-auto space-y-6">
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Security Question</p>
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">What was the name of your first elementary school?</p>
                                        </div>
                                        <label className="block">
                                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Your Answer</span>
                                            <div className="relative">
                                                <input className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#111318] text-gray-900 dark:text-white focus:border-[#135bec] focus:ring-[#135bec] sm:text-sm" type="password" />
                                                <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="pt-4 flex items-center justify-between">
                                        <button onClick={() => setStep(1)} className="text-sm text-[#135bec] hover:underline">Try another way</button>
                                        <button onClick={() => alert('Verification Simulated - Success!')} className="bg-[#135bec] text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Verify</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Footer Links */}
                    <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-[#64748b]">
                        <a className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors" href="#">Contact Support</a>
                        <span className="w-px bg-gray-300 dark:bg-[#3b4354]"></span>
                        <a className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors" href="#">Privacy Policy</a>
                        <span className="w-px bg-gray-300 dark:bg-[#3b4354]"></span>
                        <a className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors" href="#">Terms of Service</a>
                    </div>
                </div>
            </main>
            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
