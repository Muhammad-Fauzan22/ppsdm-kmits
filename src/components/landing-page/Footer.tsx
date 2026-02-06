"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

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
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">Pusat Pengembangan Sumber Daya Manusia - KM ITS berfokus pada integrasi pendidikan akademik dan pembentukan karakter unggul melalui 9 dimensi pengembangan holistik.</p>
                        <div className="flex gap-4">
                            <a 
                                className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-all text-white" 
                                href="https://www.its.ac.id" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Website ITS"
                            >
                                <span className="material-symbols-outlined text-lg">public</span>
                            </a>
                            <a 
                                className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-all text-white" 
                                href="mailto:ppsdm@its.ac.id"
                                aria-label="Email PPSDM"
                            >
                                <span className="material-symbols-outlined text-lg">mail</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-6">Program</h3>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li>
                                <Link className="hover:text-brand-accent transition-colors flex items-center gap-1" href="/assessment">
                                    Assessment Mandiri
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand-accent transition-colors flex items-center gap-1" href="/courses">
                                    Bootcamp Kompetensi
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand-accent transition-colors flex items-center gap-1" href="/coming-soon">
                                    Mentorship Karir
                                    <span className="text-[10px] bg-brand-blue/20 text-brand-accent px-1.5 py-0.5 rounded ml-1">Segera</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand-accent transition-colors flex items-center gap-1" href="/content-discovery">
                                    Katalog Soft Skills
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-6">Kontak</h3>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
                                <span>Kampus ITS Sukolilo,<br />Surabaya 60111</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">phone</span>
                                <span>+62-31-5994251</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">alternate_email</span>
                                <a href="mailto:ppsdm@its.ac.id" className="hover:text-brand-accent transition-colors">ppsdm@its.ac.id</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <p>© 2024 PPSDM KM ITS. Developed for Excellence.</p>
                    <div className="flex gap-8">
                        <Link className="hover:text-white transition-colors" href="/coming-soon">Kebijakan Privasi</Link>
                        <Link className="hover:text-white transition-colors" href="/coming-soon">Ketentuan Penggunaan</Link>
                        <Link className="hover:text-white transition-colors" href="/coming-soon">Aksesibilitas</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
