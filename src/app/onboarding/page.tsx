"use client";

import React from "react";
import Link from "next/link";

export default function OnboardingPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white overflow-x-hidden min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-border-dark bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-10">
                <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-tight">PPSDM KMM</h2>
                        <p className="text-text-secondary text-xs font-medium">Student Portal</p>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <div className="hidden md:flex items-center gap-6">
                        <Link className="text-text-secondary hover:text-white text-sm font-medium transition-colors" href="#">Help Center</Link>
                        <Link className="text-text-secondary hover:text-white text-sm font-medium transition-colors" href="#">Contact Admin</Link>
                    </div>
                    <div className="h-6 w-px bg-border-dark hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white">Guest User</p>
                            <p className="text-xs text-text-secondary">Registering...</p>
                        </div>
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-border-dark" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_9w6_-frOzKrjsgaY_J7IdvPXuWzByl3ILewAcrVkOJ846oT0nubqgWm0XHRnAQJk_LBaBnrvBhGt5kOVTHj8rcC0eZFdMb8a2zU2Vya3mKnn1ICzWzIdndI-PN7muH9M3cTysaUxtzb3rcV8M2wYTlA-bDq3MhOtb50wQx62afcm4q_Q3kO3vpRnQfJWGVj4K78TzverYQ_kZy5ma8_MGlUtpcVzaspAaxj3h0gtjrJ-iWzIotYmzz5J16Y60FbTTtDU_Ok0kTg")' }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-12 px-4 md:px-6">
                {/* Width Constraint */}
                <div className="w-full max-w-4xl flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                            Let's get you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">started</span>
                        </h1>
                        <p className="text-text-secondary text-base max-w-2xl">
                            Complete your registration to access the PPSDM KMM dashboard. We just need a few details to verify your student identity.
                        </p>
                    </div>

                    {/* Stepper Component */}
                    <div className="w-full bg-surface-dark border border-border-dark rounded-xl p-6 shadow-sm">
                        <div className="relative flex items-center justify-between w-full">
                            {/* Progress Line Background */}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-border-dark -z-0 rounded-full"></div>
                            {/* Active Progress Line */}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[33%] h-1 bg-primary -z-0 rounded-full transition-all duration-500"></div>

                            {/* Step 1 */}
                            <div className="flex flex-col items-center gap-2 z-10">
                                <div className="size-10 rounded-full bg-primary flex items-center justify-center ring-4 ring-surface-dark transition-all duration-300 shadow-[0_0_15px_rgba(19,91,236,0.5)]">
                                    <span className="material-symbols-outlined text-white text-xl">person</span>
                                </div>
                                <span className="text-sm font-bold text-white mt-1">Account</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center gap-2 z-10">
                                <div className="size-10 rounded-full bg-surface-dark border-2 border-border-dark flex items-center justify-center ring-4 ring-surface-dark transition-all duration-300">
                                    <span className="text-text-secondary text-sm font-bold">2</span>
                                </div>
                                <span className="text-xs font-medium text-text-secondary mt-1">Academic</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center gap-2 z-10">
                                <div className="size-10 rounded-full bg-surface-dark border-2 border-border-dark flex items-center justify-center ring-4 ring-surface-dark transition-all duration-300">
                                    <span className="text-text-secondary text-sm font-bold">3</span>
                                </div>
                                <span className="text-xs font-medium text-text-secondary mt-1">Preferences</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
                        {/* Side Decorative Panel (Desktop Only) */}
                        <div className="hidden md:flex md:w-1/3 bg-background-dark relative flex-col justify-between p-8 border-r border-border-dark">
                            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7VIy06yNZUqGmI-4NPEDqN7OtA_kEcC9Gq9hIOvgOiTXmqLbXd4ZEDFvn3gjpDy1fNhPOjZweFgKStbojgmBLQvhVrylB6WSqSM2WLJNp2NyEdU3e_Lj6dvdGgEOoF7UYZxuI5d8wc3gw_IycKMdOtD5v1ndGHaHavevsCjjUNxQfveWhY3QAECU4YZclt4IOISeEMJIF-DavSv1TYtJ3VVviUzUwEzmIHxvpwL0LD4jXh4PXT7F8Ham1ulEo_9qwAqBMV_72h8s")' }}></div>
                            <div className="relative z-10">
                                <div className="bg-primary/20 w-fit p-2 rounded-lg mb-4">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Did you know?</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    Your NRP is your unique identifier across all campus facilities. Please ensure it matches your physical ID card.
                                </p>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-text-secondary text-xs">
                                    <span className="material-symbols-outlined text-sm">security</span>
                                    <span>256-bit Encrypted</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 p-6 md:p-8 lg:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">Student Identity</h2>
                                    <p className="text-text-secondary text-sm mt-1">Step 1 of 3</p>
                                </div>
                                <div className="radial-progress text-primary text-xs font-bold" style={{ "--value": 33, "--size": "3rem" } as React.CSSProperties}>33%</div>
                            </div>

                            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                {/* NRP Input */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium leading-normal flex justify-between">
                                        <span>Student Identification Number (NRP)</span>
                                        <span className="text-xs text-primary cursor-pointer hover:underline">Forgot NRP?</span>
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">badge</span>
                                        <input className="w-full rounded-lg bg-background-dark border border-border-dark text-white placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary pl-12 pr-4 py-3.5 transition-all outline-none" placeholder="e.g. 50252010..." type="text" />
                                    </div>
                                    <p className="text-xs text-text-secondary">Must be a valid 10-digit numeric ID.</p>
                                </div>

                                {/* Name Input */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium leading-normal">
                                        Full Legal Name
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">person</span>
                                        <input className="w-full rounded-lg bg-background-dark border border-border-dark text-white placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary pl-12 pr-4 py-3.5 transition-all outline-none" placeholder="Enter your full name as shown on ID" type="text" />
                                    </div>
                                </div>

                                {/* Department Select */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-white text-sm font-medium leading-normal">
                                        Department
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">domain</span>
                                        <select className="w-full appearance-none rounded-lg bg-background-dark border border-border-dark text-white placeholder-text-secondary focus:border-primary focus:ring-1 focus:ring-primary pl-12 pr-10 py-3.5 transition-all outline-none cursor-pointer" defaultValue="">
                                            <option disabled value="">Select your department</option>
                                            <option value="cs">Computer Science</option>
                                            <option value="is">Information Systems</option>
                                            <option value="it">Information Technology</option>
                                            <option value="ds">Data Science</option>
                                            <option value="ce">Computer Engineering</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-dark gap-4">
                                    <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors" type="button">
                                        Cancel
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all transform active:scale-95 group" type="button">
                                        <span>Next Step</span>
                                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="flex justify-center gap-6 text-xs text-text-secondary">
                        <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
                        <span className="w-1 h-1 rounded-full bg-border-dark self-center"></span>
                        <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
                        <span className="w-1 h-1 rounded-full bg-border-dark self-center"></span>
                        <span>© 2023 PPSDM KMM</span>
                    </div>
                </div>
            </main>

            {/* Toast Notification (Simulated state: Visible) */}
            <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
                <div className="bg-surface-dark border border-border-dark text-white px-4 py-3 rounded-lg shadow-xl shadow-black/50 flex items-start gap-3 max-w-sm">
                    <div className="bg-green-500/20 text-green-400 p-1.5 rounded-md mt-0.5">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Welcome aboard!</h4>
                        <p className="text-xs text-text-secondary mt-1">Start by filling in your student identity details.</p>
                    </div>
                    <button className="text-text-secondary hover:text-white ml-2">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"></div>
            </div>

            <style jsx global>{`
                /* Custom styles needed for daisyUI-like components if daisyUI is not installed */
               .radial-progress { 
                    position: relative;
                    display: inline-grid;
                    height: var(--size);
                    width: var(--size);
                    place-content: center;
                    border-radius: 9999px;
                    background-color: transparent;
                    vertical-align: middle;
                    box-sizing: content-box;
                }
                .radial-progress:before,
                .radial-progress:after {
                    position: absolute;
                    border-radius: 9999px;
                    content: "";
                }
                .radial-progress:before {
                    inset: 0px;
                    background: radial-gradient(farthest-side, currentColor 98%, #0000) top/var(--thickness) var(--thickness) no-repeat, conic-gradient(currentColor calc(var(--value) * 1%), #0000 0);
                    -webkit-mask: radial-gradient(farthest-side, #0000 calc(99% - var(--thickness)), #000 calc(100% - var(--thickness)));
                    mask: radial-gradient(farthest-side, #0000 calc(99% - var(--thickness)), #000 calc(100% - var(--thickness)));
                }
                .radial-progress:after {
                    inset: calc(50% - var(--thickness) / 2);
                    transform: rotate(calc(var(--value) * 3.6deg - 90deg)) translate(calc(var(--size) / 2 - 50%));
                }
            `}</style>
        </div>
    );
}
