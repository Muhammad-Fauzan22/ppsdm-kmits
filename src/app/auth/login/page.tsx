"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login delay
        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard'); // Corrected route to dashboard
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex font-sans text-slate-200 bg-its-dark antialiased selection:bg-brand-blue selection:text-white">
            {/* Left Panel (Visuals) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between relative overflow-hidden p-12 border-r border-white/5 its-gradient">
                {/* Abstract background effect */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-its-gold/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Header Content */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/20">
                        <span className="material-symbols-outlined text-white">analytics</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-heading tracking-tight text-white leading-none">PPSDM KMM</span>
                        <span className="text-[10px] uppercase tracking-widest text-its-gold font-bold">ITS Surabaya</span>
                    </div>
                </div>

                {/* Illustration & Main Message */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-12">
                    <div className="w-full max-w-[320px] aspect-square rounded-full flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 bg-brand-blue/20 blur-3xl rounded-full animate-pulse"></div>
                        {/* Mascot Placeholder */}
                        <div className="w-full h-full bg-contain bg-center bg-no-repeat relative z-10 transition-transform hover:scale-105 duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBVLbOe4moz7X2Pt7KxjOKSJ8SmRYLJD-5Boh4JXTYl7lY6HZfmPYi95sdBpmqzHDbRibMDFUKJmQfsA-9sUlnH-uTF-YraPLdxD9PsQLcv_UeMmEuQBFkmy6kQQdfbPP6Xt2-qt8dDpFSC0c-HtYpkDcpq0HKV2VCEF4YbjPDKXfMDPfPBMx7cifL1HZJVvj3yzm8N4JSrA_bORkxiTJbRL8J4qjTNRtJZXkrFsxPDJtRtsfqcGKwe5dTdDRcloFpNpnq2y_QR-E')" }}>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-center leading-tight mb-4 text-white">
                        Secure Access for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-accent">ITS Students</span>
                    </h1>
                    <p className="text-slate-400 text-center max-w-md text-lg leading-relaxed">Access your academic resources, roadmap, and mentorship tools through the unified PPSDM KMM portal.</p>
                </div>

                {/* Footer Quote */}
                <div className="relative z-10 text-xs text-slate-500 font-medium tracking-wide">
                    <p>© 2024 Institut Teknologi Sepuluh Nopember.</p>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#05080F] relative">
                <div className="w-full max-w-[420px] glass-card p-10 rounded-2xl border-white/5 shadow-2xl relative overflow-hidden">
                    {/* Decorative background for form */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col gap-8 relative z-10">
                        {/* Heading */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold font-heading tracking-tight text-white mb-2">Welcome Back</h2>
                            <p className="text-slate-400 text-sm">Enter your credentials to access your account</p>
                        </div>

                        {/* SSO Button */}
                        <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white/5 hover:bg-brand-blue/10 p-4 text-sm font-bold text-white transition-all border border-white/10 hover:border-brand-blue/30 group">
                            <span className="material-symbols-outlined text-brand-accent group-hover:scale-110 transition-transform">school</span>
                            Sign in with ITS SSO
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-xs text-slate-500 uppercase tracking-widest font-bold">Or continue with</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="email">NRP / Email</label>
                                <div className="relative">
                                    <input
                                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-accent focus:bg-brand-blue/5 transition-all pl-11"
                                        id="email"
                                        placeholder="5025201xxx"
                                        required
                                        type="text"
                                    />
                                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-500">mail</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="password">Password</label>
                                    <a className="text-xs font-bold text-brand-accent hover:text-brand-accent/80 hover:underline" href="#">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-accent focus:bg-brand-blue/5 transition-all pl-11"
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                    />
                                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-500">lock</span>
                                    <button className="absolute right-3.5 top-3 text-slate-500 hover:text-white transition-colors" type="button">
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                    </button>
                                </div>
                            </div>
                            <button
                                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl h-12 flex items-center justify-center transition-all shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Login to Portal
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Help */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            256-bit End-to-End Encryption
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
