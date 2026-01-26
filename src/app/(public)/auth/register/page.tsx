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
        nrp: '',
        password: '',
        faculty: '',
        interest: [] as string[]
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-background-dark flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-card-dark rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Visual Sidebar (Progress) */}
                <div className="bg-its-dark w-full md:w-64 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('/patterns/its-key-graphic.svg')] bg-cover bg-center" />
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <div className="size-8 rounded bg-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <span className="font-bold font-serif">PPSDM</span>
                        </Link>

                        <div className="space-y-6">
                            <div className={`flex items-start gap-4 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 ${step > 1 ? 'bg-its-light border-its-light' : 'border-white'} transition-all`}>
                                    {step > 1 ? <span className="material-symbols-outlined text-sm">check</span> : <span className="font-bold text-sm">1</span>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Personal Identity</h4>
                                    <p className="text-xs text-white/60">Your basic ITS information</p>
                                </div>
                            </div>

                            <div className={`flex items-start gap-4 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 ${step > 2 ? 'bg-its-light border-its-light' : 'border-white'} transition-all`}>
                                    {step > 2 ? <span className="material-symbols-outlined text-sm">check</span> : <span className="font-bold text-sm">2</span>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Preferences</h4>
                                    <p className="text-xs text-white/60">Your interests & goals</p>
                                </div>
                            </div>

                            <div className={`flex items-start gap-4 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 ${step === 3 ? 'bg-white text-its-dark' : 'border-white'}`}>
                                    <span className="font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Confirmation</h4>
                                    <p className="text-xs text-white/60">Review & Create Account</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-white/40">
                        <p>Having trouble?</p>
                        <Link href="/help" className="underline hover:text-white">Contact Support</Link>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 p-8 md:p-12 flex flex-col">
                    <div className="flex-1">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Let's get started</h2>
                                    <p className="text-slate-500">Create your student account to begin.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                        <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark focus:ring-2 focus:ring-its-light/20 focus:border-its-light" placeholder="e.g. Ahmad Fauzan" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">NRP</label>
                                        <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark focus:ring-2 focus:ring-its-light/20 focus:border-its-light" placeholder="502520..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Faculty</label>
                                        <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark focus:ring-2 focus:ring-its-light/20 focus:border-its-light">
                                            <option>Select Faculty</option>
                                            <option>ELECTICS</option>
                                            <option>SCIENTICS</option>
                                            <option>INDSYS</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ITS Email</label>
                                        <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark focus:ring-2 focus:ring-its-light/20 focus:border-its-light" placeholder="account@student.its.ac.id" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interests</h2>
                                    <p className="text-slate-500">Help us personalize your roadmap.</p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-slate-700">What areas do you want to develop?</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Leadership', 'Technology', 'Public Speaking', 'Entrepreneurship', 'Research', 'Community Service'].map((item) => (
                                            <label key={item} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-its-light transition-colors has-[:checked]:bg-its-light/5 has-[:checked]:border-its-light">
                                                <input type="checkbox" className="rounded text-its-light focus:ring-its-light" />
                                                <span className="text-sm font-medium">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col justify-center text-center">
                                <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to Launch!</h2>
                                <p className="text-slate-500 max-w-sm mx-auto">By clicking 'Create Account', you agree to our Terms of Service and Academic Integrity Pact.</p>

                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left text-sm space-y-2 mt-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Name:</span>
                                        <span className="font-semibold">Ahmad Fauzan</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Email:</span>
                                        <span className="font-semibold">ahmad@student.its.ac.id</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        {step > 1 ? (
                            <button onClick={handleBack} className="text-slate-500 font-medium hover:text-slate-900 transition flex items-center gap-2">
                                <span className="material-symbols-outlined">arrow_back</span> Back
                            </button>
                        ) : (
                            <Link href="/auth/login" className="text-slate-500 font-medium hover:text-slate-900 transition">
                                Already have an account?
                            </Link>
                        )}

                        <button
                            onClick={step < 3 ? handleNext : () => { }}
                            className="bg-its-light hover:bg-its text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-its-light/30 transition-all flex items-center gap-2"
                        >
                            {step < 3 ? 'Next Step' : 'Create Account'}
                            {step < 3 && <span className="material-symbols-outlined">arrow_forward</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
