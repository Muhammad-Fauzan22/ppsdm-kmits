"use client";

import React from 'react';
import Navbar from './landing-page/Navbar';
import HeroSection from './landing-page/HeroSection';
// import Methodology from './landing-page/Methodology';
import DimensionsGrid from './landing-page/DimensionsGrid';
import GrowthSection from './landing-page/GrowthSection';
// import MissionControlDemo from './landing-page/MissionControlDemo';
import PipelineShowcase from './landing-page/PipelineShowcase';
import Testimonials from './landing-page/Testimonials';
import Footer from './landing-page/Footer';

export default function LandingPage() {
    return (
        <div className="bg-its-dark font-sans text-slate-200 antialiased selection:bg-brand-blue selection:text-white min-h-screen">
            <div className="relative flex min-h-screen w-full flex-col">
                <Navbar />

                <main className="flex-1 pt-20">
                    <HeroSection />
                    {/* <Methodology /> */}
                    <DimensionsGrid />
                    <GrowthSection />
                    {/* <MissionControlDemo /> */}
                    <PipelineShowcase />
                    <Testimonials />

                    <section className="py-24 px-6 lg:px-12 bg-[#05080F]" id="faq">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold font-heading text-white">Pertanyaan Sering Diajukan</h2>
                            </div>
                            <div className="space-y-4">
                                <details className="group glass-card rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:bg-white/10">
                                    <summary className="flex items-center justify-between text-white font-bold list-none">
                                        Apakah program ini gratis untuk mahasiswa ITS?
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                    </summary>
                                    <p className="mt-4 text-slate-400 text-sm leading-relaxed">Ya, seluruh fitur dasar, assessment, dan akses materi digital tersedia secara gratis bagi seluruh mahasiswa aktif ITS melalui SSO.</p>
                                </details>
                                <details className="group glass-card rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all hover:bg-white/10">
                                    <summary className="flex items-center justify-between text-white font-bold list-none">
                                        Bagaimana cara mendapatkan bimbingan mentor?
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                    </summary>
                                    <p className="mt-4 text-slate-400 text-sm leading-relaxed">Anda perlu menyelesaikan assessment awal dan mencapai 'Roadmap Level 3' untuk membuka akses ke fitur penjadwalan mentor.</p>
                                </details>
                            </div>
                            <div className="mt-20 p-10 rounded-[2.5rem] bg-gradient-to-br from-its-blue/40 to-brand-blue/20 border border-white/10 text-center relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-bold text-white mb-6">Siap Memulai Perjalanan Anda?</h3>
                                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">Dapatkan Digital Brochure PPSDM KMM 2024 dan tips pengembangan diri mingguan langsung di email Anda.</p>
                                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                        <input className="flex-1 bg-its-dark/50 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-accent focus:ring-0 transition-all" placeholder="Email ITS Anda (e.g. mhs@its.ac.id)" type="email" />
                                        <button className="bg-white text-its-blue font-bold px-8 py-3 rounded-xl hover:bg-brand-accent transition-all whitespace-nowrap shadow-lg shadow-white/10">Dapatkan Info</button>
                                    </div>
                                    <button className="mt-8 text-brand-accent text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:underline">
                                        <span className="material-symbols-outlined">download</span>
                                        Download Full Brochure (PDF 4.2 MB)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
}
