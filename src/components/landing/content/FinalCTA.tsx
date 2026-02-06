"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, PlayCircle, CheckCircle } from "lucide-react";

export function FinalCTA() {
    return (
        <section className="py-32 bg-gradient-to-br from-brand-blue to-indigo-900 text-white relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-its-gold/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
                    Mulai Perjalanan <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Pengembangan Diri Anda</span>
                </h2>
                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                    Bergabung dengan 2,347+ mahasiswa ITS yang sudah menemukan peta menuju versi terbaik diri mereka. Gratis untuk Sivitas ITS.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Link
                        href="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-brand-blue hover:bg-slate-50 font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2"
                    >
                        <Rocket className="w-5 h-5" />
                        Mulai Assessment Gratis
                    </Link>
                    <Link
                        href="/demos"
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Tonton Platform Tour
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-indigo-200">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Backed by ITS Research Center
                    </div>
                    <div className="hidden md:block w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        GDPR & PDPA Compliant
                    </div>
                    <div className="hidden md:block w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        100% Free Integration
                    </div>
                </div>
            </div>
        </section>
    );
}
