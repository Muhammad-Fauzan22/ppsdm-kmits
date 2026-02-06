"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-its-dark pt-20 pb-10 px-6 lg:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-its-blue font-black shadow-xl">ITS</div>
                            <h2 className="text-xl font-bold font-heading text-white">Institut Teknologi Sepuluh Nopember</h2>
                        </div>
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">Pusat Pengembangan Sumber Daya Manusia - KMM ITS berfokus pada integrasi pendidikan akademik dan pembentukan karakter unggul.</p>
                        <div className="flex gap-4">
                            <Link className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-all text-white" href="#"><span className="material-symbols-outlined text-lg">public</span></Link>
                            <Link className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-all text-white" href="#"><span className="material-symbols-outlined text-lg">mail</span></Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-6">Program</h3>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link className="hover:text-brand-accent transition-colors" href="/assessment">Assessment Mandiri</Link></li>
                            <li><Link className="hover:text-brand-accent transition-colors" href="/courses">Bootcamp Kompetensi</Link></li>
                            <li><span className="text-slate-600 cursor-not-allowed">Mentorship Karir (Segera)</span></li>
                            <li><span className="text-slate-600 cursor-not-allowed">Katalog Soft Skills (Segera)</span></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6">Kontak</h3>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">location_on</span> Kampus ITS Sukolilo, Surabaya</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">phone</span> +62-31-5994251</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">alternate_email</span> ppsdm@its.ac.id</li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <p>© 2024 PPSDM KMM ITS. Developed for Excellence.</p>
                    <div className="flex gap-8">
                        <span className="text-slate-600 cursor-not-allowed">Privacy Policy (Segera)</span>
                        <span className="text-slate-600 cursor-not-allowed">Cookie Policy (Segera)</span>
                        <span className="text-slate-600 cursor-not-allowed">Accessibility (Segera)</span>
                    </div>

                </div>
            </div>
        </footer>
    );
}
