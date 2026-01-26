"use client";

import React from "react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display text-slate-900 dark:text-white antialiased transition-colors duration-200 bg-background-light dark:bg-background-dark">

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-border-dark bg-white/80 dark:bg-[#111318]/80 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined text-[24px]">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-end items-center gap-8">
                        <div className="flex items-center gap-6">
                            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Beranda</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Program</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Dimensi</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Kontak</Link>
                        </div>
                        <Link href="/auth/login" className="flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            Masuk
                        </Link>
                    </nav>
                    <button className="md:hidden p-2 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative flex min-h-[600px] flex-col items-center justify-center px-4 py-20 text-center mesh-gradient overflow-hidden">
                    {/* Abstract decorative elements */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            Accepting New Students 2024
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                            Membangun Insan <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">ITS Seutuhnya</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light">
                            Empowering students through holistic development and structured mentorship. Join a community dedicated to excellence in every dimension.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/30">
                                <span>Mulai Perjalanan Anda</span>
                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-lg">arrow_forward</span>
                            </button>
                            <button className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 backdrop-blur-sm">
                                Pelajari Lebih Lanjut
                            </button>
                        </div>
                    </div>
                </section>

                {/* 9 Dimensions Grid */}
                <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col items-center gap-4 text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">9 Dimensions of Development</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">Explore the core competencies fostered through our comprehensive programs designed to shape future leaders.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: 'Leadership', desc: 'Cultivating the ability to guide, inspire, and influence others towards shared goals.', icon: 'groups', color: 'bg-blue-500', text: 'text-blue-400' },
                            { name: 'Ethics', desc: 'Building moral character and integrity as the foundation of professional life.', icon: 'balance', color: 'bg-red-500', text: 'text-red-400' },
                            { name: 'Technology', desc: 'Mastering digital tools and maintaining fluency in emerging tech landscapes.', icon: 'memory', color: 'bg-cyan-500', text: 'text-cyan-400' },
                            { name: 'Global Mindset', desc: 'Understanding diverse cultures and operating effectively in international contexts.', icon: 'public', color: 'bg-green-500', text: 'text-green-400' },
                            { name: 'Critical Thinking', desc: 'Analyzing information objectively to form reasoned judgments and solve problems.', icon: 'psychology', color: 'bg-purple-500', text: 'text-purple-400' },
                            { name: 'Creativity', desc: 'Generating novel ideas and innovative solutions to complex challenges.', icon: 'lightbulb', color: 'bg-yellow-500', text: 'text-yellow-400' },
                            { name: 'Collaboration', desc: 'Working synergistically within teams to achieve collective success.', icon: 'handshake', color: 'bg-orange-500', text: 'text-orange-400' },
                            { name: 'Communication', desc: 'Articulating thoughts clearly and listening effectively across various mediums.', icon: 'chat', color: 'bg-teal-500', text: 'text-teal-400' },
                            { name: 'Adaptability', desc: 'Maintaining resilience and flexibility in the face of rapid change.', icon: 'autorenew', color: 'bg-pink-500', text: 'text-pink-400' },
                        ].map((dim, i) => (
                            <div key={i} className="group glass-card p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className={`size-12 rounded-lg ${dim.color}/20 ${dim.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="material-symbols-outlined text-3xl">{dim.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{dim.name}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{dim.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Chart & Demo Section */}
                <section className="py-20 bg-slate-50 dark:bg-[#0c1017]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="flex-1 space-y-8">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Visualize Your <br />
                                    <span className="text-primary">Growth Journey</span>
                                </h2>
                                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Track your progress across all 9 dimensions with our dynamic assessment tools. Identify strengths, uncover areas for improvement, and chart a personalized path to success.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Real-time Analytics</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Get instant feedback on your developmental milestones.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Personalized Recommendations</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive curated program suggestions based on your profile.</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-4 flex h-11 w-fit items-center justify-center rounded-lg border border-slate-300 dark:border-border-dark bg-transparent px-6 text-sm font-bold text-slate-900 dark:text-white transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                                    View Sample Report
                                </button>
                            </div>
                            <div className="flex-1 w-full max-w-[500px]">
                                <div className="relative w-full aspect-square bg-white dark:bg-[#1c1f27] rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-border-dark">
                                    <div className="absolute top-6 left-6 z-10">
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Student Profile</p>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mahasiswa ITS</h3>
                                    </div>
                                    {/* Simulated Radar Chart using SVG */}
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                                            {/* Grid */}
                                            <circle cx="100" cy="100" fill="none" r="20" stroke="#282e39" strokeDasharray="4 4" strokeWidth="1"></circle>
                                            <circle cx="100" cy="100" fill="none" r="40" stroke="#282e39" strokeDasharray="4 4" strokeWidth="1"></circle>
                                            <circle cx="100" cy="100" fill="none" r="60" stroke="#282e39" strokeDasharray="4 4" strokeWidth="1"></circle>
                                            <circle cx="100" cy="100" fill="none" r="80" stroke="#282e39" strokeWidth="1"></circle>
                                            {/* Axes */}
                                            <line stroke="#282e39" strokeWidth="1" x1="100" x2="100" y1="100" y2="20"></line>
                                            <line stroke="#282e39" strokeWidth="1" x1="100" x2="176" y1="100" y2="65"></line>
                                            <line stroke="#282e39" strokeWidth="1" x1="100" x2="164" y1="100" y2="162"></line>
                                            <line stroke="#282e39" strokeWidth="1" x1="100" x2="36" y1="100" y2="162"></line>
                                            <line stroke="#282e39" strokeWidth="1" x1="100" x2="24" y1="100" y2="65"></line>
                                            {/* Data Shape */}
                                            <polygon className="drop-shadow-[0_0_10px_rgba(19,91,236,0.5)] animate-pulse" fill="rgba(19, 91, 236, 0.2)" points="100,30 160,70 140,150 60,140 40,80" stroke="#135bec" strokeWidth="2"></polygon>
                                            {/* Data Points */}
                                            {[
                                                { cx: 100, cy: 30 }, { cx: 160, cy: 70 }, { cx: 140, cy: 150 }, { cx: 60, cy: 140 }, { cx: 40, cy: 80 }
                                            ].map((pt, i) => (
                                                <circle key={i} cx={pt.cx} cy={pt.cy} fill="#135bec" r="3"></circle>
                                            ))}
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-6 right-6 z-10 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                        <p className="text-xs font-bold text-primary">Balanced Growth</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Marquee */}
                <section className="py-20 border-t border-slate-200 dark:border-border-dark overflow-hidden">
                    <div className="flex flex-col items-center gap-4 text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Voices</h2>
                        <p className="text-slate-500 dark:text-slate-400">Hear from those who have transformed their potential.</p>
                    </div>
                    <div className="relative w-full max-w-[1920px] mx-auto">
                        <div className="flex w-max animate-marquee gap-6 px-4">
                            {/* Testimonials */}
                            {[
                                { name: "Budi Santoso", dept: "Teknik Informatika '21", quote: "The leadership module completely changed how I approach team projects. Highly recommended!", gradient: "from-blue-500 to-purple-500" },
                                { name: "Siti Aminah", dept: "Arsitektur '22", quote: "PPSDM helped me balance my academic life with meaningful soft skill development.", gradient: "from-green-500 to-teal-500" },
                                { name: "Rizky Pratama", dept: "Teknik Mesin '20", quote: "The mentorship program connected me with alumni who guided my career path.", gradient: "from-orange-500 to-red-500" },
                                { name: "Dewi Lestari", dept: "Statistika '23", quote: "I discovered my passion for public speaking through the communication workshops.", gradient: "from-pink-500 to-rose-500" },
                                { name: "Andi Wijaya", dept: "Sistem Informasi '22", quote: "Understanding global mindset helped me secure my internship abroad.", gradient: "from-blue-500 to-purple-500" },
                                { name: "Fajar Nugraha", dept: "Teknik Elektro '21", quote: "The ethical framework taught here is something I apply in every engineering project.", gradient: "from-yellow-500 to-amber-500" },
                            ].map((testi, i) => (
                                <div key={i} className="w-[350px] shrink-0 rounded-xl bg-white dark:bg-[#1c1f27] p-6 shadow-sm border border-slate-200 dark:border-border-dark">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`size-10 rounded-full bg-gradient-to-tr ${testi.gradient}`}></div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{testi.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{testi.dept}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">"{testi.quote}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-its-blue text-white py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 bg-white rounded-full flex items-center justify-center text-its-blue font-bold text-xl">
                                    ITS
                                </div>
                                <h2 className="text-xl font-bold">Institut Teknologi Sepuluh Nopember</h2>
                            </div>
                            <p className="text-white/80 text-sm max-w-md leading-relaxed">
                                Kampus ITS Sukolilo, Surabaya 60111<br />
                                Jawa Timur, Indonesia<br />
                                Phone: +62-31-5994251
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li><a className="hover:text-white hover:underline decoration-white/50 underline-offset-4" href="#">Beranda</a></li>
                                <li><a className="hover:text-white hover:underline decoration-white/50 underline-offset-4" href="#">Tentang PPSDM</a></li>
                                <li><a className="hover:text-white hover:underline decoration-white/50 underline-offset-4" href="#">Program Unggulan</a></li>
                                <li><a className="hover:text-white hover:underline decoration-white/50 underline-offset-4" href="#">Kalender Kegiatan</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Connect</h3>
                            <div className="flex gap-4">
                                <a className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" href="#">
                                    <span className="material-symbols-outlined text-white text-xl">mail</span>
                                </a>
                                <a className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" href="#">
                                    <span className="material-symbols-outlined text-white text-xl">public</span>
                                </a>
                                <a className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" href="#">
                                    <span className="material-symbols-outlined text-white text-xl">rss_feed</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
                        <p>© 2024 PPSDM KMM Institut Teknologi Sepuluh Nopember. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-white" href="#">Privacy Policy</a>
                            <a className="hover:text-white" href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                .mesh-gradient {
                    background-color: #111318;
                    background-image: 
                        radial-gradient(at 0% 0%, hsla(220, 85%, 50%, 0.4) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, hsla(350, 80%, 60%, 0.3) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, hsla(220, 85%, 50%, 0.4) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, hsla(350, 80%, 60%, 0.3) 0px, transparent 50%);
                }
                
                .glass-card {
                    background: rgba(28, 31, 39, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
