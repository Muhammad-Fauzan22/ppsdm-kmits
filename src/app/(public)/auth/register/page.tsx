"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Simple state just for demo purposes
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        faculty: '',
        interest: [] as string[]
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center p-6 relative font-sans">
            <div className="w-full max-w-4xl bg-[#050B1D] rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row relative z-10">

                {/* Visual Sidebar (Progress) */}
                <div className="w-full md:w-80 bg-[#0F172A] p-8 flex flex-col justify-between relative overflow-hidden border-r border-white/5">
                    {/* Background Graphic */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-gradient-to-b from-blue-900/20 to-transparent"></div>

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 mb-12">
                            <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                <span className="material-symbols-outlined text-xl">school</span>
                            </div>
                            <span className="font-bold tracking-tight text-white">PPSDM Portal</span>
                        </Link>

                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className={`flex items-start gap-4 transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${step > 1 ? 'bg-blue-600 border-blue-600 text-white' : (step === 1 ? 'border-blue-500 text-white' : 'border-slate-600 text-slate-500')} transition-all`}>
                                    {step > 1 ? <span className="material-symbols-outlined text-sm">check</span> : <span className="font-bold text-sm">1</span>}
                                </div>
                                <div className="mt-1">
                                    <h4 className="font-bold text-sm text-white">Account</h4>
                                    <p className="text-xs text-slate-400">Basic credentials</p>
                                </div>
                            </div>

                            {/* Connector Line Example (simplified visual) */}

                            {/* Step 2 */}
                            <div className={`flex items-start gap-4 transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${step > 2 ? 'bg-blue-600 border-blue-600 text-white' : (step === 2 ? 'border-blue-500 text-white' : 'border-slate-600 text-slate-500')} transition-all`}>
                                    {step > 2 ? <span className="material-symbols-outlined text-sm">check</span> : <span className="font-bold text-sm">2</span>}
                                </div>
                                <div className="mt-1">
                                    <h4 className="font-bold text-sm text-white">Academic</h4>
                                    <p className="text-xs text-slate-400">Student Identity Info</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className={`flex items-start gap-4 transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${step === 3 ? 'bg-white text-black border-white' : 'border-slate-600 text-slate-500'}`}>
                                    <span className="font-bold text-sm">3</span>
                                </div>
                                <div className="mt-1">
                                    <h4 className="font-bold text-sm text-white">Preferences</h4>
                                    <p className="text-xs text-slate-400">Set your goals</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500 mt-12">
                        <p>Step {step} of 3</p>
                        <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center min-h-[500px]">
                    <div className="max-w-md mx-auto w-full">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                                    <p className="text-slate-400 text-sm">Start your journey with PPSDM KMM.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Legal Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0F172A] text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" placeholder="e.g. Ahmad Fauzan" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0F172A] text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" placeholder="name@example.com" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                                        <input type="password" className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0F172A] text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" placeholder="Create a strong password" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Academic Info</h2>
                                    <p className="text-slate-400 text-sm">Verify your student status.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Student ID (NRP)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">badge</span>
                                            <input type="text" className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/10 bg-[#0F172A] text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" placeholder="502520..." />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Department</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">apartment</span>
                                            <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/10 bg-[#0F172A] text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm appearance-none">
                                                <option>Select your department</option>
                                                <option>Informatics</option>
                                                <option>Information Systems</option>
                                                <option>Electrical Engineering</option>
                                            </select>
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 text-center">
                                <div className="size-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/20 shadow-lg shadow-green-500/10">
                                    <span className="material-symbols-outlined text-5xl">rocket_launch</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">All Set!</h2>
                                    <p className="text-slate-400 text-sm max-w-xs mx-auto">Your profile is ready to be created. Welcome aboard to PPSDM KMM.</p>
                                </div>

                                <div className="bg-[#0F172A] rounded-xl p-4 border border-white/5 text-left text-sm space-y-3">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Name</span>
                                        <span className="text-white font-medium">Ahmad Fauzan</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">Department</span>
                                        <span className="text-white font-medium">Informatics</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="pt-8 mt-4 border-t border-white/5 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                            {step > 1 ? (
                                <button onClick={handleBack} className="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 px-4 py-2">
                                    Back
                                </button>
                            ) : (
                                <Link href="/auth/login" className="text-slate-500 hover:text-white transition-colors text-sm font-medium px-4 py-2">
                                    Log in instead
                                </Link>
                            )}

                            <button
                                onClick={step < 3 ? handleNext : () => { }}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {step < 3 ? 'Continue' : 'Complete Registration'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
    );
}
