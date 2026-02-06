import React from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft, Clock } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-its-dark flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-blue/10 mb-6">
            <Construction className="w-10 h-10 text-brand-blue" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Segera Hadir</h1>
          <p className="text-slate-400">
            Fitur ini sedang dalam pengembangan. Kami bekerja keras untuk menghadirkan pengalaman terbaik untuk Anda.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-brand-accent mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Estimasi Rilis</span>
          </div>
          <p className="text-white text-lg font-bold">Q1 2025</p>
          <p className="text-slate-500 text-sm mt-1">Januari - Maret 2025</p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
