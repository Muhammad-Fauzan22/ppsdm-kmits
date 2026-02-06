"use client";

import { ShieldCheck, UserCog } from 'lucide-react';

export function PlatformAccess() {
    return (
        <section className="py-24 bg-brand-blue text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                            Akses Mudah, <br />Manfaat Besar.
                        </h2>
                        <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                            100% Gratis untuk seluruh Mahasiswa ITS. Cukup gunakan akun myITS SSO Anda untuk memulai perjalanan pengembangan diri.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                                <ShieldCheck className="w-8 h-8 text-brand-accent" />
                                <div>
                                    <h4 className="font-bold">Untuk Mahasiswa</h4>
                                    <p className="text-sm text-indigo-200">Akses penuh ke semua tes & materi</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                                <UserCog className="w-8 h-8 text-brand-accent" />
                                <div>
                                    <h4 className="font-bold">Untuk Dosen</h4>
                                    <p className="text-sm text-indigo-200">Dashboard monitoring kelas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 text-center">Cara Memulai</h3>
                            <div className="space-y-6">
                                {[
                                    { num: "01", text: "Login dengan SSO ITS" },
                                    { num: "02", text: "Isi Assessment (30 menit)" },
                                    { num: "03", text: "Dapatkan Hasil Instant" },
                                    { num: "04", text: "Mulai Roadmap Belajar" }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold shadow-lg shadow-brand-blue/30">
                                            {step.num}
                                        </div>
                                        <span className="font-medium text-lg">{step.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                                <p className="text-sm text-gray-500 mb-2">Didukung penuh oleh</p>
                                <div className="font-bold text-brand-blue">Institut Teknologi Sepuluh Nopember</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
