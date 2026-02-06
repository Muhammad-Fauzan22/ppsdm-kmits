"use client";

export default function MobileNotificationDrawerDemo() {
    return (
        <div className="font-[family-name:var(--font-inter)] bg-[#f6f6f8] dark:bg-[#101622] overflow-hidden h-screen w-screen relative">
            {/* Main Wrapper simulating a desktop screen with dashboard content behind */}
            <div className="relative w-full h-full flex overflow-hidden">
                {/* Dummy Dashboard Background Content (to demonstrate glassmorphism/overlay) */}
                <div className="flex-1 flex flex-col h-full w-full opacity-40 pointer-events-none select-none p-8 gap-6 bg-slate-100 dark:bg-[#0b0e14]">
                    {/* Header placeholder */}
                    <div className="w-full h-16 bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center px-6">
                        <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="ml-auto w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                    {/* Grid Layout placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                        <div className="col-span-2 flex flex-col gap-6">
                            <div className="w-full h-64 bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"></div>
                            <div className="w-full flex-1 bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"></div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="w-full h-40 bg-[#135bec]/10 rounded-xl border border-[#135bec]/20 p-6"></div>
                            <div className="w-full flex-1 bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"></div>
                        </div>
                    </div>
                </div>
                {/* Backdrop Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"></div>
                {/* Notification Drawer */}
                <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-[#f6f6f8] dark:bg-[#111318] z-50 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300">
                    {/* Drawer Header */}
                    <header className="flex-none flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-[#282e39] bg-[#f6f6f8] dark:bg-[#111318]">
                        <div className="flex items-center gap-3">
                            <button className="sm:hidden p-1 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Notifikasi</h2>
                            <span className="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1.5 h-5 rounded-full min-w-[20px]">3</span>
                        </div>
                        <button className="text-[#135bec] text-sm font-semibold hover:text-blue-400 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 rounded">
                            Tandai semua dibaca
                        </button>
                    </header>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto flex flex-col pb-6">
                        {/* Section: Terbaru */}
                        <div className="sticky top-0 z-10 bg-[#f6f6f8]/95 dark:bg-[#111318]/95 backdrop-blur-sm px-6 py-3 border-b border-transparent dark:border-[#282e39]/50">
                            <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Terbaru</p>
                        </div>
                        <div className="flex flex-col">
                            {/* Notification Item 1: System Alert (Unread) */}
                            <div className="group relative flex gap-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-[#1a1d26] transition-colors cursor-pointer border-l-4 border-[#135bec] bg-[#135bec]/5 dark:bg-transparent">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 size-12 shadow-sm">
                                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>warning</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight">Evaluasi Tertunda</p>
                                        <span className="shrink-0 text-[#135bec] text-[10px] font-medium bg-[#135bec]/10 px-2 py-0.5 rounded-full">New</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-medium">System Alert - Engineering</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug line-clamp-2">Anda belum mengumpulkan laporan mingguan progres KMM. Segera upload sebelum pukul 23:59.</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">2 jam yang lalu</p>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="h-px bg-slate-200 dark:bg-[#282e39] mx-6"></div>
                            {/* Notification Item 2: Achievement (Unread) */}
                            <div className="group relative flex gap-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-[#1a1d26] transition-colors cursor-pointer border-l-4 border-[#135bec] bg-[#135bec]/5 dark:bg-transparent">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 size-12 shadow-sm">
                                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>emoji_events</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight">Level Up!</p>
                                        <span className="shrink-0 size-2 bg-[#135bec] rounded-full mt-1.5"></span>
                                    </div>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-medium">Achievement - ITS Gold</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug line-clamp-2">Selamat! Anda mencapai tingkat Mahir dalam manajemen proyek. Badge baru telah ditambahkan ke profil Anda.</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">5 jam yang lalu</p>
                                </div>
                            </div>
                        </div>
                        {/* Section: Sebelumnya */}
                        <div className="sticky top-0 z-10 bg-[#f6f6f8]/95 dark:bg-[#111318]/95 backdrop-blur-sm px-6 py-3 mt-2 border-y border-slate-100 dark:border-[#282e39]">
                            <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-semibold uppercase tracking-wider">Sebelumnya</p>
                        </div>
                        <div className="flex flex-col">
                            {/* Notification Item 3: Supervisor Note (Read) */}
                            <div className="group relative flex gap-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-[#1a1d26] transition-colors cursor-pointer border-l-4 border-transparent">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10 text-[#135bec] size-12 shadow-sm">
                                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>assignment_ind</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight">Catatan Pembimbing</p>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-medium">Revisi Bab 2</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug line-clamp-2">"Revisi Bab 2 sudah diacc, silahkan lanjut ke metodologi. Jangan lupa perbaiki sitasi pada halaman 12."</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">1 hari yang lalu</p>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="h-px bg-slate-200 dark:bg-[#282e39] mx-6"></div>
                            {/* Notification Item 4: General Info (Read) */}
                            <div className="group relative flex gap-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-[#1a1d26] transition-colors cursor-pointer border-l-4 border-transparent">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 size-12 shadow-sm">
                                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>history_edu</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight">Logbook Harian</p>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-medium">Reminder</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug line-clamp-2">Anda telah mengisi logbook hari ini. Pertahankan konsistensi Anda!</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">2 hari yang lalu</p>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="h-px bg-slate-200 dark:bg-[#282e39] mx-6"></div>
                            {/* Notification Item 5: Achievement (Read) */}
                            <div className="group relative flex gap-4 px-6 py-4 hover:bg-slate-100 dark:hover:bg-[#1a1d26] transition-colors cursor-pointer border-l-4 border-transparent">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 size-12 shadow-sm">
                                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>star</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight">Welcome Aboard!</p>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-medium">Achievement - First Step</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug line-clamp-2">Selamat datang di PPSDM KMM Mobile. Jelajahi fitur untuk memulai progres Anda.</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Minggu lalu</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Drawer Footer (Optional: Quick Actions) */}
                    <div className="p-4 border-t border-slate-200 dark:border-[#282e39] bg-[#f6f6f8] dark:bg-[#111318]">
                        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-200 dark:bg-[#1e232e] hover:bg-slate-300 dark:hover:bg-[#2a303e] text-slate-700 dark:text-white h-10 px-4 text-sm font-bold transition-colors">
                            <span className="material-symbols-outlined text-[18px]">settings</span>
                            Pengaturan Notifikasi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
