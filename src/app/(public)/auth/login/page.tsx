"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check role for redirection
            // Since user_metadata is on the user object
            const role = data.user.user_metadata?.role || "student";

            if (role === "admin") router.push('/admin');
            else if (role === "lecturer" || role === "supervisor") router.push('/supervisor');
            else router.push('/dashboard');

        } catch (err: any) {
            setError(err.message || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side: Branding / Visual */}
            <div className="hidden md:flex flex-col justify-between bg-its-dark relative overflow-hidden p-12 text-white">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('/patterns/its-key-graphic.svg')] bg-cover bg-center" />
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-its-light/50 to-its-dark/90" />

                <div className="relative z-10">
                    <div className="size-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h1 className="text-4xl font-bold font-serif mb-4">PPSDM KMM</h1>
                    <p className="text-white/80 max-w-md text-lg">Platform Pengembangan Sumber Daya Mahasiswa Institut Teknologi Sepuluh Nopember.</p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} className="material-symbols-outlined text-its-yellow text-sm">star</span>
                            ))}
                        </div>
                        <p className="text-sm italic mb-4">"The structured development roadmap helped me secure my dream internship. The assessment tools are incredibly accurate."</p>
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-white/20" />
                            <div>
                                <p className="font-bold text-sm">Sarah Safira</p>
                                <p className="text-xs text-white/60">Informatics 2024</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40">
                        <p>© 2024 KM ITS</p>
                        <div className="flex gap-4">
                            <Link href="/help" className="hover:text-white transition">Privacy</Link>
                            <Link href="/help" className="hover:text-white transition">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="bg-surface-50 dark:bg-background-dark flex flex-col justify-center items-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to access your personal development dashboard.</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ITS Email / User ID</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-its-light/20 focus:border-its-light transition-all"
                                    placeholder="your.email@its.ac.id"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <Link href="/auth/forgot-password" className="text-sm text-its-light hover:underline font-medium">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">lock</span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-its-light/20 focus:border-its-light transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-its-light hover:bg-its text-white font-bold py-2.5 rounded-lg shadow-lg shadow-its-light/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface-50 dark:bg-background-dark px-2 text-slate-400">Or continue with</span></div>
                    </div>

                    <button className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-medium py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition flex items-center justify-center gap-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google" className="size-5" />
                        Sign in with myITS SSO
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account? <Link href="/auth/register" className="text-its-light font-bold hover:underline">Register Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
