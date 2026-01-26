"use client";

import React from "react";
import Link from "next/link";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

export default function PublicLandingPage() {
    const radarData = [
        { subject: 'Spiritual', A: 120, fullMark: 150 },
        { subject: 'Intelektual', A: 98, fullMark: 150 },
        { subject: 'Profesional', A: 86, fullMark: 150 },
        { subject: 'Sosial', A: 99, fullMark: 150 },
        { subject: 'Manajerial', A: 85, fullMark: 150 },
        { subject: 'Fisik', A: 65, fullMark: 150 },
        { subject: 'Emosional', A: 80, fullMark: 150 },
        { subject: 'Kognitif', A: 110, fullMark: 150 },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">PPSDM KMM</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
                        <a href="#" className="hover:text-blue-600">Beranda</a>
                        <a href="#" className="hover:text-blue-600">Dimensi</a>
                        <a href="#" className="hover:text-blue-600">Testimoni</a>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                        Masuk
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 block">● Insan Unggul ITS</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                        Membangun Insan <br />
                        <span className="text-blue-600">ITS Seutuhnya</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
                        Portal pengembangan diri terintegrasi untuk mahasiswa Institut Teknologi Sepuluh Nopember. Jelajahi potensi diri Anda melalui 9 dimensi pengembangan komprehensif.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-600/30 hover:scale-105 transition-transform flex items-center gap-2">
                            Mulai Perjalanan Anda <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 flex items-center gap-2">
                            <span className="material-symbols-outlined">play_circle</span> Pelajari Lebih Lanjut
                        </button>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative">
                    <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop" className="w-full h-[500px] object-cover" alt="Students" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            </section>

            {/* 9 Dimensions Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">9 Dimensi Pengembangan</h2>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto">
                        Kerangka kerja holistik untuk membentuk karakter mahasiswa yang unggul, adaptif, dan siap menghadapi tantangan global.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: "favorite", title: "Spiritual", desc: "Memperkuat nilai keimanan dan ketakwaan sebagai landasan moral dalam setiap tindakan." },
                        { icon: "psychology", title: "Kognitif", desc: "Mengasah kemampuan berpikir kritis, analitis, dan sistematis dalam memecahkan masalah." },
                        { icon: "work", title: "Profesional", desc: "Mempersiapkan etika kerja, kompetensi teknis, dan kesiapan karir masa depan." },
                        { icon: "groups", title: "Sosial", desc: "Membangun relasi positif, empati, dan kontribusi nyata bagi masyarakat sekitar." },
                        { icon: "supervisor_account", title: "Manajerial", desc: "Mengembangkan jiwa kepemimpinan dan kemampuan mengelola organisasi secara efektif." },
                        { icon: "fitness_center", title: "Fisik", desc: "Menjaga kesehatan jasmani dan kebugaran untuk mendukung produktivitas maksimal." },
                        { icon: "sentiment_satisfied", title: "Emosional", desc: "Mengelola kecerdasan emosional dan ketahanan mental dalam menghadapi tekanan." },
                        { icon: "menu_book", title: "Intelektual", desc: "Memperluas wawasan dan kedalaman ilmu pengetahuan di berbagai bidang." },
                        { icon: "public", title: "Global", desc: "Membangun perspektif internasional dan kemampuan beradaptasi lintas budaya." },
                    ].map((item) => (
                        <div key={item.title} className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group hover:-translate-y-1 bg-white">
                            <div className="size-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Visualization Feature */}
            <section className="py-24 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-12 md:p-16 flex flex-col justify-center">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full w-fit mb-6">SIMULASI INTERAKTIF</span>
                        <h2 className="text-4xl font-bold mb-6">Visualisasikan Potensi Anda</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Lihat bagaimana keseimbangan 9 dimensi membentuk profil unik Anda. Platform kami membantu Anda mengidentifikasi area kekuatan dan peluang pengembangan.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex gap-4">
                                <div className="size-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 mt-1">
                                    <span className="material-symbols-outlined text-sm">analytics</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Analisis Mendalam</h4>
                                    <p className="text-xs text-slate-500">Data real-time tentang perkembangan Anda.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="size-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 mt-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Rekomendasi Personal</h4>
                                    <p className="text-xs text-slate-500">Saran kegiatan sesuai kebutuhan Anda.</p>
                                </div>
                            </div>
                        </div>

                        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold w-fit hover:bg-blue-700">
                            Coba Simulator Profil <span className="ml-2">→</span>
                        </button>
                    </div>

                    <div className="bg-slate-50 p-12 flex items-center justify-center relative">
                        {/* Radar Chart */}
                        <div className="w-full h-full min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                                    <Radar name="Student" dataKey="A" stroke="#3B82F6" strokeWidth={3} fill="#3B82F6" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Apa Kata Mahasiswa</h2>
                    <p className="text-slate-500 text-sm">Mereka yang telah merasakan dampak positif pengembangan diri.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 rounded-full overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad" alt="Student" />
                            </div>
                            <div>
                                <h4 className="font-bold">Ahmad Santoso</h4>
                                <p className="text-xs text-slate-500">Teknik Informatika</p>
                            </div>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">
                            "Platform ini benar-benar mengubah cara saya melihat pengembangan diri. Awalnya saya hanya fokus akademik, tapi Assessment PPSDM membuka mata saya tentang pentingnya soft skills."
                        </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 opacity-60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 rounded-full overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rina" alt="Student" />
                            </div>
                            <div>
                                <h4 className="font-bold">Budi Santoso</h4>
                                <p className="text-xs text-slate-500">Teknik Sipil</p>
                            </div>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">
                            "Diagram 9 dimensi sangat membantu. Saya jadi tahu kalau nilai sosial saya masih rendah, akhirnya saya ikut kegiatan pengabdian masyarakat."
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0F172A] text-white py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-8 bg-blue-600 rounded flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-lg">school</span>
                            </div>
                            <span className="font-bold text-lg">PPSDM KMM</span>
                        </div>
                        <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                            Membangun karakter unggul mahasiswa ITS melalui pengembangan diri yang terintegrasi dan berkelanjutan.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <span className="size-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fab fa-twitter"></i></span>
                            <span className="size-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fab fa-instagram"></i></span>
                            <span className="size-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fab fa-youtube"></i></span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase text-slate-500">Tautan Cepat</h4>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li><a href="#" className="hover:text-white">Beranda</a></li>
                            <li><a href="#" className="hover:text-white">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-white">9 Dimensi</a></li>
                            <li><a href="#" className="hover:text-white">Berita & Artikel</a></li>
                            <li><a href="#" className="hover:text-white">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase text-slate-500">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-slate-500">location_on</span>
                                Gedung Rektorat Lt. 1, Kampus ITS Sukolilo, Surabaya 60111
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-slate-500">call</span>
                                (031) 5994251
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-slate-500">mail</span>
                                ppsdm@its.ac.id
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex justify-between text-xs text-slate-500">
                    <p>© 2024 PPSDM KMM • Institut Teknologi Sepuluh Nopember. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#">Kebijakan Privasi</a>
                        <a href="#">Syarat & Ketentuan</a>
                    </div>
                </div>

                {/* Newsletter Box */}
                <div className="mt-12 bg-slate-800/50 rounded-2xl p-6 border border-slate-700 max-w-sm ml-auto">
                    <h4 className="font-bold mb-2 text-sm">Dapatkan Informasi Terbaru</h4>
                    <p className="text-xs text-slate-400 mb-4">Berlangganan newsletter kami untuk update kegiatan.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email Anda" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs w-full text-white" />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-500">Langganan</button>
                    </div>
                </div>
            </footer>

        </div>
    );
}
