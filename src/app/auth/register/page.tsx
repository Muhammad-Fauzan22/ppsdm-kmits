'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nrp: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Password tidak cocok");
            setLoading(false);
            return;
        }

        // Simulator Register
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold font-heading text-white mb-2">Buat Akun Baru</h2>
                <p className="text-slate-400">Mulai perjalanan 9 dimensimu hari ini.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder:text-slate-600 transition-all"
                            placeholder="Nama Lengkap"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">NRP</label>
                        <input
                            type="text"
                            value={formData.nrp}
                            onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder:text-slate-600 transition-all"
                            placeholder="50252..."
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email ITS</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder:text-slate-600 transition-all"
                        placeholder="nama@mahasiswa.its.ac.id"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder:text-slate-600 transition-all"
                        placeholder="Buat password kuat"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Konfirmasi Password</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder:text-slate-600 transition-all"
                        placeholder="Ulangi password"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-accent hover:bg-white text-its-dark font-bold py-3.5 rounded-xl shadow-lg shadow-brand-accent/20 hover:shadow-white/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-its-dark/30 border-t-its-dark rounded-full animate-spin" />
                            Mendaftar...
                        </>
                    ) : (
                        <>
                            Daftar Sekarang
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </>
                    )}
                </button>
            </form>

            <p className="mt-8 text-center text-slate-400 text-sm">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-brand-blue font-bold hover:text-white transition-colors">
                    Masuk disini
                </Link>
            </p>
        </motion.div>
    );
}
