'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulator Login
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);

    /* Real Integration Placeholder
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Login successful, redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa email dan password Anda.");
      setLoading(false);
    }
    */
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-heading text-white mb-2">Selamat Datang Kembali</h2>
        <p className="text-slate-400">Masuk untuk melanjutkan perjalanan pengembangan dirimu.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Email ITS / Mahasiswa</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-500 group-focus-within:text-brand-accent transition-colors">mail</span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder:text-slate-600 transition-all font-medium"
              placeholder="nama@mahasiswa.its.ac.id"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-brand-accent hover:text-brand-blue transition-colors">
              Lupa Password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-500 group-focus-within:text-brand-accent transition-colors">lock</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder:text-slate-600 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>
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
          className="w-full bg-gradient-to-r from-its-blue to-brand-blue hover:from-brand-blue hover:to-brand-accent text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Masuk Sekarang
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-its-dark text-slate-500">Atau masuk dengan</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-white text-its-dark font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
        >
          {/* Google Icon Placeholder */}
          <span className="text-lg font-bold">G</span>
          Masuk dengan Google
        </button>
      </form>

      <p className="mt-8 text-center text-slate-400 text-sm">
        Belum memiliki akun?{' '}
        <Link href="/auth/register" className="text-brand-accent font-bold hover:text-white transition-colors">
          Daftar Mahasiswa Baru
        </Link>
      </p>
    </motion.div>
  );
}