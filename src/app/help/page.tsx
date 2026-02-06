"use client";

import Link from "next/link";
import { useState } from "react";

export default function HelpCenterPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-[family-name:var(--font-inter)] text-[#111318] flex flex-col min-h-screen overflow-x-hidden">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full bg-white border-b border-[#f0f2f4] shadow-sm">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 bg-[#135bec]/10 rounded text-[#135bec]">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight text-[#111318]">PPSDM KMM</h2>
                        </div>
                        {/* Navigation Links (Desktop) */}
                        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                            <nav className="flex gap-6">
                                <Link className="text-sm font-medium text-[#111318] hover:text-[#135bec] transition-colors" href="#">Home</Link>
                                <Link className="text-sm font-medium text-[#111318] hover:text-[#135bec] transition-colors" href="#">Program</Link>
                                <Link className="text-sm font-medium text-[#111318] hover:text-[#135bec] transition-colors" href="#">Berita</Link>
                                <Link className="text-sm font-medium text-[#111318] hover:text-[#135bec] transition-colors" href="#">Tentang Kami</Link>
                            </nav>
                            <button className="bg-[#135bec] hover:bg-[#1e3a8a] text-white text-sm font-bold h-10 px-6 rounded-lg transition-colors shadow-sm">
                                Login
                            </button>
                        </div>
                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-gray-600">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>
            {/* Hero Section */}
            <section className="relative bg-[#135bec]">
                {/* Background Pattern/Image */}
                <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDMg79GhrUc0pvwrRxad8Fi_OdJDeZZj4YtHwXLxH5rxdunyiWMLf9u6qsLLpE0PD1lus0439T1StKFinjq9VtaWFMFFYOxwQc60ZrxQ7NtDQallYXgYr3mVrNQqTC4zqsl1pbmo6Er6b0mN9_RpVRsodjpQ4fh1NY2b10Q8qiVmL-Gm-ntbdntlnlEV-LPIKMjUM6NtqIdgDrx_raN6nVlg6zRXgjWD6sCoidj7yRcgXLFy5UhWavUtV7vY4Co9CnpMLnbmvXVWQ')" }}>
                </div>
                <div className="relative z-10 max-w-[960px] mx-auto px-4 py-16 sm:py-24 text-center">
                    <h1 className="text-white text-4xl sm:text-5xl font-black mb-4 tracking-tight">
                        Pusat Bantuan
                    </h1>
                    <p className="text-blue-100 text-lg sm:text-xl font-normal mb-8 max-w-2xl mx-auto">
                        Kami siap membantu perkuliahan dan administrasi Anda. Temukan jawaban Anda di sini.
                    </p>
                    {/* Search Bar */}
                    <div className="max-w-[600px] mx-auto bg-white p-2 rounded-xl shadow-lg flex items-center gap-2">
                        <div className="pl-3 text-gray-400 flex items-center">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input className="flex-1 border-none focus:ring-0 text-[#111318] placeholder:text-gray-400 text-base py-3 outline-none" placeholder="Cari solusi atau pertanyaan..." type="text" />
                        <button className="bg-[#135bec] hover:bg-[#1e3a8a] text-white font-bold h-10 px-6 rounded-lg transition-colors">
                            Cari
                        </button>
                    </div>
                </div>
            </section>
            {/* Main Content Layout */}
            <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Column: Categories & FAQ */}
                    <div className="flex-1 flex flex-col gap-12">
                        {/* Categories Grid */}
                        <section>
                            <h2 className="text-[#111318] text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#135bec]">grid_view</span>
                                Topik Bantuan
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Card 1 */}
                                <div className="group flex flex-col gap-3 p-5 rounded-xl bg-white border border-[#dbdfe6] shadow-sm hover:shadow-md hover:border-[#135bec]/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#135bec] flex items-center justify-center group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">school</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111318]">Assessment</h3>
                                        <p className="text-sm text-gray-500 mt-1">Nilai, ujian, & tugas</p>
                                    </div>
                                </div>
                                {/* Card 2 */}
                                <div className="group flex flex-col gap-3 p-5 rounded-xl bg-white border border-[#dbdfe6] shadow-sm hover:shadow-md hover:border-[#135bec]/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#135bec] flex items-center justify-center group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">menu_book</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111318]">Library</h3>
                                        <p className="text-sm text-gray-500 mt-1">Akses jurnal & buku</p>
                                    </div>
                                </div>
                                {/* Card 3 */}
                                <div className="group flex flex-col gap-3 p-5 rounded-xl bg-white border border-[#dbdfe6] shadow-sm hover:shadow-md hover:border-[#135bec]/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#135bec] flex items-center justify-center group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">description</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111318]">RPI</h3>
                                        <p className="text-sm text-gray-500 mt-1">Rencana pembelajaran</p>
                                    </div>
                                </div>
                                {/* Card 4 */}
                                <div className="group flex flex-col gap-3 p-5 rounded-xl bg-white border border-[#dbdfe6] shadow-sm hover:shadow-md hover:border-[#135bec]/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#135bec] flex items-center justify-center group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">build</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111318]">Technical Issues</h3>
                                        <p className="text-sm text-gray-500 mt-1">Login & sistem error</p>
                                    </div>
                                </div>
                                {/* Card 5 */}
                                <div className="group flex flex-col gap-3 p-5 rounded-xl bg-white border border-[#dbdfe6] shadow-sm hover:shadow-md hover:border-[#135bec]/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#135bec] flex items-center justify-center group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">person</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111318]">Account</h3>
                                        <p className="text-sm text-gray-500 mt-1">Profil & password</p>
                                    </div>
                                </div>
                                {/* Card 6 */}
                                <div className="group flex flex-col gap-3 p-5 rounded-xl bg-white border border-[#dbdfe6] shadow-sm hover:shadow-md hover:border-[#135bec]/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#135bec] flex items-center justify-center group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">shield</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111318]">Policies</h3>
                                        <p className="text-sm text-gray-500 mt-1">Kebijakan kampus</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* FAQ Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[#111318] text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#135bec]">quiz</span>
                                    FAQ Populer
                                </h2>
                                <Link className="text-sm text-[#135bec] font-medium hover:underline" href="#">Lihat semua</Link>
                            </div>
                            <div className="flex flex-col gap-3">
                                {/* FAQ Item 1 */}
                                <details className="group bg-white rounded-lg border border-[#dbdfe6] overflow-hidden open:shadow-sm transition-all duration-300">
                                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 hover:bg-gray-50 transition-colors list-none">
                                        <span className="text-[#111318] font-medium leading-normal">Bagaimana cara reset password?</span>
                                        <span className="material-symbols-outlined text-gray-400 group-open:text-[#135bec] group-open:rotate-180 transition-transform">expand_more</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-transparent group-open:border-[#f0f2f4] group-open:pt-4">
                                        Untuk mereset kata sandi Anda, silakan kunjungi halaman login dan klik "Lupa Password". Masukkan email institusi Anda, dan kami akan mengirimkan tautan untuk membuat kata sandi baru. Pastikan untuk memeriksa folder spam jika email tidak muncul.
                                    </div>
                                </details>
                                {/* FAQ Item 2 */}
                                <details className="group bg-white rounded-lg border border-[#dbdfe6] overflow-hidden open:shadow-sm transition-all duration-300">
                                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 hover:bg-gray-50 transition-colors list-none">
                                        <span className="text-[#111318] font-medium leading-normal">Batas waktu pengumpulan RPI?</span>
                                        <span className="material-symbols-outlined text-gray-400 group-open:text-[#135bec] group-open:rotate-180 transition-transform">expand_more</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-transparent group-open:border-[#f0f2f4] group-open:pt-4">
                                        Batas waktu pengumpulan RPI (Rencana Pembelajaran Individu) biasanya ditetapkan pada akhir minggu kedua setiap semester. Mohon cek kalender akademik terbaru di menu "Program" untuk tanggal pastinya. Keterlambatan dapat mempengaruhi proses validasi akademik.
                                    </div>
                                </details>
                                {/* FAQ Item 3 */}
                                <details className="group bg-white rounded-lg border border-[#dbdfe6] overflow-hidden open:shadow-sm transition-all duration-300">
                                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 hover:bg-gray-50 transition-colors list-none">
                                        <span className="text-[#111318] font-medium leading-normal">Cara akses jurnal internasional?</span>
                                        <span className="material-symbols-outlined text-gray-400 group-open:text-[#135bec] group-open:rotate-180 transition-transform">expand_more</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-transparent group-open:border-[#f0f2f4] group-open:pt-4">
                                        Mahasiswa aktif dapat mengakses jurnal internasional melalui portal perpustakaan digital (e-Library). Login menggunakan akun mahasiswa Anda, lalu pilih menu "E-Resources". Kami berlangganan Scopus, IEEE, dan ScienceDirect.
                                    </div>
                                </details>
                            </div>
                        </section>
                    </div>
                    {/* Right Column: Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-6">
                        {/* Support Card */}
                        <div className="bg-white rounded-xl border border-[#dbdfe6] p-6 shadow-sm sticky top-24">
                            <div className="mb-4">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#111318]">Butuh Bantuan Lebih?</h3>
                                <p className="text-sm text-gray-500 mt-2">Tim support kami siap membantu Anda Senin - Jumat, 08.00 - 16.00 WIB.</p>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-[#dbdfe6] bg-white text-[#111318] text-sm font-bold hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-green-600 text-[20px]">chat</span>
                                    Hubungi via WhatsApp
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#135bec] text-white text-sm font-bold hover:bg-[#1e3a8a] transition-colors shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                                    Kirim Tiket Support
                                </button>
                            </div>
                            <div className="mt-6 pt-6 border-t border-[#f0f2f4]">
                                <p className="text-xs text-center text-gray-400">
                                    Rata-rata waktu respon: <br />
                                    <span className="font-semibold text-gray-600">~15 Menit</span>
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            {/* Footer Simple */}
            <footer className="bg-white border-t border-[#f0f2f4] mt-auto">
                <div className="max-w-[1280px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">© 2023 PPSDM KMM. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link className="text-sm text-gray-500 hover:text-[#135bec]" href="#">Privacy Policy</Link>
                        <Link className="text-sm text-gray-500 hover:text-[#135bec]" href="#">Terms of Service</Link>
                    </div>
                </div>
            </footer>

            {/* Modal - Tiket Support */}
            {isModalOpen && (
                <div aria-labelledby="modal-title" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f0f2f4] flex items-center justify-between bg-white shrink-0">
                            <h3 className="text-lg font-bold text-[#111318] flex items-center gap-2" id="modal-title">
                                <span className="material-symbols-outlined text-[#135bec]">confirmation_number</span>
                                Kirim Tiket Support
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined text-[24px]">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {/* Form Content */}
                            <form className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-[#111318]" htmlFor="ticket-subject">Subjek</label>
                                    <input className="w-full h-11 px-4 rounded-lg border border-[#dbdfe6] focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 text-[#111318] placeholder:text-gray-400 text-sm font-medium transition-all outline-none" id="ticket-subject" placeholder="Ringkasan singkat masalah Anda" type="text" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-[#111318]" htmlFor="ticket-category">Kategori</label>
                                    <div className="relative">
                                        <select className="w-full h-11 pl-4 pr-10 rounded-lg border border-[#dbdfe6] focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 text-[#111318] text-sm font-medium appearance-none bg-white transition-all outline-none cursor-pointer" id="ticket-category" defaultValue="">
                                            <option disabled value="">Pilih topik bantuan...</option>
                                            <option value="assessment">Assessment (Nilai, ujian, & tugas)</option>
                                            <option value="library">Library (Akses jurnal & buku)</option>
                                            <option value="rpi">RPI (Rencana pembelajaran)</option>
                                            <option value="technical">Technical Issues (Login & sistem error)</option>
                                            <option value="account">Account (Profil & password)</option>
                                            <option value="policies">Policies (Kebijakan kampus)</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center">
                                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-[#111318]" htmlFor="ticket-description">Deskripsi Masalah</label>
                                    <textarea className="w-full h-32 px-4 py-3 rounded-lg border border-[#dbdfe6] focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 text-[#111318] placeholder:text-gray-400 text-sm font-medium resize-none transition-all outline-none" id="ticket-description" placeholder="Jelaskan secara detail masalah yang Anda alami..."></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-[#111318]">Lampiran File</label>
                                    <div className="border-2 border-dashed border-[#dbdfe6] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-[#135bec] hover:bg-blue-50/50 transition-all cursor-pointer group bg-gray-50/30">
                                        <div className="w-10 h-10 rounded-full bg-white border border-[#dbdfe6] text-gray-500 group-hover:text-[#135bec] group-hover:border-[#135bec] flex items-center justify-center mb-3 transition-colors shadow-sm">
                                            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                                        </div>
                                        <p className="text-sm font-bold text-[#111318] group-hover:text-[#135bec] transition-colors">Klik untuk upload</p>
                                        <p className="text-xs text-gray-500 mt-1">atau drag & drop file di sini</p>
                                        <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-[#f0f2f4] bg-gray-50 flex items-center justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 h-10 rounded-lg border border-[#dbdfe6] bg-white text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-[#111318] transition-colors focus:ring-2 focus:ring-gray-200"
                            >
                                Batal
                            </button>
                            <button className="px-5 h-10 rounded-lg bg-[#135bec] hover:bg-[#1e3a8a] text-white font-bold text-sm shadow-sm transition-all hover:shadow flex items-center gap-2 focus:ring-4 focus:ring-[#135bec]/20">
                                <span>Kirim Tiket</span>
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
