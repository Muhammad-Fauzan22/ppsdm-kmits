"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState(''); // NRP or Email
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Assume input is email for now, or handle NRP to Email mapping logic here
            const email = identifier.includes('@') ? identifier : `${identifier}@student.its.ac.id`;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const role = data.user.user_metadata?.role || "student";
            if (role === "admin") router.push('/admin');
            else if (role === "lecturer" || role === "supervisor") router.push('/supervisor');
            else router.push('/dashboard');

        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
            {/* Left Side: Branding (Darkest Blue) */}
            <div className="hidden md:flex flex-col justify-center items-center bg-[#020617] relative overflow-hidden p-12 text-white border-r border-white/5">
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <span className="font-bold tracking-tight text-lg">PPSDM KMM Portal</span>
                </div>

                <div className="relative z-10 text-center">
                    {/* 3D Avatar Placeholder */}
                    <div className="size-64 mx-auto bg-[#0B1120] rounded-2xl flex items-center justify-center mb-10 shadow-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-600/20 blur-[80px] group-hover:bg-blue-600/30 transition-all duration-700"></div>
                        <span className="material-symbols-outlined text-9xl text-blue-500 relative z-10 animate-float">person_3d_gen</span>

                        {/* Mocking the 3D look from reference */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-1 rounded-full text-xs font-medium border border-white/10 text-blue-200">
                            Student Identity
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-4 text-white">Secure Access for <br /> ITS Students</h1>
                    <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                        Access your academic resources, schedule, and administrative tools securely through the unified PPSDM KMM portal.
                    </p>
                </div>

                <div className="absolute bottom-8 left-8 text-xs text-slate-600">
                    &copy; 2024 Institut Teknologi Sepuluh Nopember.
                </div>
            </div>

            {/* Right Side: Login Form (Dark Blue) */}
            <div className="bg-[#050B1D] flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative">
                <div className="w-full max-w-sm space-y-8">

                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
                        <p className="text-slate-400 text-sm">Enter your details below to access your account</p>
                    </div>

                    {/* ITS SSO Button */}
                    <button className="w-full bg-[#1E293B] hover:bg-[#28354D] text-white font-medium py-3 rounded-lg border border-white/5 transition-all flex items-center justify-center gap-3 shadow-lg">
                        <span className="material-symbols-outlined text-blue-500">school</span>
                        Sign in with ITS SSO
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="bg-[#050B1D] px-2 text-slate-500">or continue with</span></div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-white uppercase tracking-wider">NRP / Email</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">mail</span>
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/10 bg-[#0F172A] text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm outline-none"
                                    placeholder="5025201xxx"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-white uppercase tracking-wider">Password</label>
                                <Link href="#" className="text-xs text-blue-500 hover:text-blue-400 font-bold">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">lock</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-white/10 bg-[#0F172A] text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white hover:bg-slate-200 text-[#020617] font-bold py-3 rounded-lg shadow-lg shadow-white/5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>

                    <div className="text-center pt-8">
                        <p className="text-xs text-slate-500 mb-2">Having trouble signing in? <a href="#" className="underline hover:text-slate-400">Contact Help Desk</a></p>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-green-500">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Secure Connection 256-bit SSL
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
