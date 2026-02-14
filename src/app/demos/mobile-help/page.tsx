"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function MobileHelpCenterDemo() {
    return (
        <div className="bg-gray-100 font-[family-name:var(--font-inter)] flex items-center justify-center min-h-screen py-8">
            {/* Mobile Device Simulator Container */}
            <div className="relative w-full max-w-[400px] h-[850px] bg-[#f6f6f8] dark:bg-[#101622] rounded-[30px] shadow-2xl overflow-hidden border-4 border-white ring-1 ring-gray-900/5 flex flex-col">
                {/* Header Section */}
                <header className="bg-[#135bec] pt-12 pb-6 px-6 relative shrink-0">
                    {/* Decorative circle */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3 text-white">
                            <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <Icon name="Shield" className="text-xl" />
                            </div>
                            <h1 className="text-lg font-bold tracking-tight">PPSDM Help Center</h1>
                        </div>
                        <button className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                            <Icon name="Bell" />
                        </button>
                    </div>
                    {/* Greeting */}
                    <div className="text-white mb-6">
                        <p className="text-white/80 text-sm font-medium">Halo, Pengguna</p>
                        <h2 className="text-2xl font-bold leading-tight">Perlu bantuan apa hari ini?</h2>
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#135bec]">
                            <Icon name="Search" />
                        </div>
                        <input className="block w-full pl-10 pr-3 py-3.5 border-none rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white shadow-lg shadow-[#135bec]/10 sm:text-sm font-medium" placeholder="Cari topik bantuan..." type="text" />
                    </div>
                </header>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto mobile-scroll relative">
                    <div className="p-6 pb-24 space-y-8">
                        {/* Categories Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-800 dark:text-white text-base font-bold">Kategori Bantuan</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Card 1 */}
                                <button className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow text-left group border border-slate-100 dark:border-slate-700">
                                    <div className="size-10 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-[#135bec] group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <Icon name="User" />
                                    </div>
                                    <span className="text-slate-800 dark:text-white text-sm font-bold">Akun & Profil</span>
                                </button>
                                {/* Card 2 */}
                                <button className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow text-left group border border-slate-100 dark:border-slate-700">
                                    <div className="size-10 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-[#135bec] group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <Icon name="ClipboardList" />
                                    </div>
                                    <span className="text-slate-800 dark:text-white text-sm font-bold">Asesmen</span>
                                </button>
                                {/* Card 3 */}
                                <button className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow text-left group border border-slate-100 dark:border-slate-700">
                                    <div className="size-10 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-[#135bec] group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <Icon name="BadgeCheck" />
                                    </div>
                                    <span className="text-slate-800 dark:text-white text-sm font-bold">Sertifikasi</span>
                                </button>
                                {/* Card 4 */}
                                <button className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow text-left group border border-slate-100 dark:border-slate-700">
                                    <div className="size-10 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-[#135bec] group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <Icon name="Wrench" />
                                    </div>
                                    <span className="text-slate-800 dark:text-white text-sm font-bold">Kendala Teknis</span>
                                </button>
                            </div>
                        </section>
                        {/* FAQ Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-800 dark:text-white text-base font-bold">Pertanyaan Sering Diajukan</h3>
                                <Link className="text-[#135bec] text-xs font-semibold hover:underline" href="#">Lihat Semua</Link>
                            </div>
                            <div className="flex flex-col gap-3">
                                {/* FAQ Item 1 */}
                                <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Bagaimana cara reset password?</span>
                                        <Icon name="ChevronDown" className="text-slate-400 rotate-icon group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Anda dapat mereset password melalui halaman login dengan menekan tombol "Lupa Password", kemudian ikuti instruksi yang dikirimkan ke email Anda.
                                    </div>
                                </details>
                                {/* FAQ Item 2 */}
                                <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Cara mengunduh sertifikat?</span>
                                        <Icon name="ChevronDown" className="text-slate-400 rotate-icon group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Sertifikat dapat diunduh setelah Anda menyelesaikan seluruh modul pelatihan dan lulus ujian akhir. Cek menu "Sertifikasi" di profil Anda.
                                    </div>
                                </details>
                                {/* FAQ Item 3 */}
                                <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Apakah aplikasi ini gratis?</span>
                                        <Icon name="ChevronDown" className="text-slate-400 rotate-icon group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Ya, aplikasi PPSDM KMM dapat diakses secara gratis oleh seluruh karyawan terdaftar.
                                    </div>
                                </details>
                                {/* FAQ Item 4 */}
                                <details className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Jadwal maintenance sistem?</span>
                                        <Icon name="ChevronDown" className="text-slate-400 rotate-icon group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Maintenance rutin dilakukan setiap hari Sabtu pukul 00:00 - 04:00 WIB untuk memastikan performa sistem tetap optimal.
                                    </div>
                                </details>
                            </div>
                        </section>
                        {/* Bottom Banner */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute inset-0 w-full h-full opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZwKdza7cA4sl9MbLeYSDATnQP_ZXfWtQ_a0xFVsk8VpNtMyBAr4C3fAHvXtButA_l3y4cQWUEWtvue0nVWMTc4ahKo9FeCMH2k2g_0YLKI4sF4rYq978nd0qOxFHaL6MgDvQWH89XIFtyW8QQtHtPJc5Ewd9qJfTX_f9a3HKQL6Ao6LTjdHmwNP7IcLu8lhGFubHGHRJfj4ZOUvjXCi0VervlDU8WMJDbzQ8P9YFFzRl76Wm1tFx2wB3uCM4fCM189-yaB0NWX4g')" }}></div>
                            <div className="relative z-10">
                                <h4 className="text-white font-bold text-sm mb-1">Butuh bantuan lebih lanjut?</h4>
                                <p className="text-slate-300 text-xs mb-3">Tim support kami siap membantu anda di jam kerja.</p>
                                <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 px-4 rounded-lg backdrop-blur-sm transition-colors border border-white/10">
                                    Hubungi via Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Floating Action Button (WhatsApp) */}
                <div className="absolute bottom-6 right-6 z-50">
                    <button className="group flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-green-500/30 hover:scale-105 hover:bg-[#20bd5a] transition-all duration-300">
                        {/* Using generic chat icon as Material Symbols doesn't have brand logos */}
                        <Icon name="MessageCircle" className="text-3xl" />
                        <span className="absolute right-0 top-0 flex h-3 w-3 -mt-1 -mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </button>
                </div>
            </div>
            <style jsx global>{`
                .mobile-scroll::-webkit-scrollbar { width: 4px; }
                .mobile-scroll::-webkit-scrollbar-track { background: transparent; }
                .mobile-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
            `}</style>
        </div>
    );
}
