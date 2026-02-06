'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulator Login - Demo Mode
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
        <h2 className="text-3xl font-bold font-heading text-white mb-2">Selamat Datang Kembali</h2>
        <p className="text-slate-400">Masuk untuk melanjutkan perjalanan pengembangan dirimu.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Email ITS / Mahasiswa</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
              placeholder="nama@its.ac.id"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
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
              <ArrowRight className="w-5 h-5" />
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

        {/* SSO Coming Soon Notice */}
        <div className="space-y-3">
          <button
            type="button"
            disabled
            className="w-full bg-white/10 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-3 border border-white/5"
          >
            <span className="text-lg font-bold">ITS</span>
            Login SSO myITS
          </button>
          
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-400">
              Login dengan SSO myITS akan segera hadir. Saat ini gunakan mode simulasi dengan email apa saja.
            </p>
          </div>
        </div>
      </form>

      <p className="mt-8 text-center text-slate-400 text-sm">
        Belum memiliki akun?{' '}
        <Link href="/coming-soon" className="text-brand-accent font-bold hover:text-white transition-colors">
          Daftar Mahasiswa Baru
        </Link>
      </p>
    </motion.div>
  );
}
