"use client";

import Link from "next/link";

export default function LibraryUploadPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white font-[family-name:var(--font-inter)] flex flex-col h-screen overflow-hidden">
            {/* TopNavBar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-gray-900 px-10 py-3 shrink-0 z-20">
                <div className="flex items-center gap-4 text-[#111318] dark:text-white">
                    <div className="size-8 flex items-center justify-center rounded-lg bg-[#135bec]/10 text-[#135bec]">
                        <span className="material-symbols-outlined">science</span>
                    </div>
                    <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KM ITS</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-9">
                        <Link href="/dashboard" className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal hover:text-[#135bec] transition-colors">Dashboard</Link>
                        <Link href="/library" className="text-[#135bec] text-sm font-bold leading-normal">Library</Link>
                        <Link href="#" className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal hover:text-[#135bec] transition-colors">Analytics</Link>
                        <Link href="#" className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal hover:text-[#135bec] transition-colors">Settings</Link>
                    </div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 dark:border-gray-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYB18VxijoC61l5s9ULKLVTRpk4wgtHrxuAmBOlXxg6XAQWNO4JCmJE67QtEhcTQ8wdZ6O5-Z8AG8PmrnDXubtO5zZ8h1IpAcf08IB89JZbSF29XVoc-BbLI6oYvkVK33sJEspmZ-GBqCB4VSDl6YM_IrVIFyJovpcJHhTZOjz4kC9kvKlyQEGq9Kx0bi-MdSuTP7JA3wFhOquqVI4MkGqnfGNBPgDg8imFGGuRPG24g9Im7_kGoPOI3spFDjlBdMsrGoMnUQDz_I')" }}></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 overflow-hidden">
                <div className="flex w-full h-full">
                    {/* LEFT PANEL: Upload Zone */}
                    <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-[#101622] p-8 lg:p-12 relative z-10">
                        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
                            {/* Page Heading */}
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111318] dark:text-white">Alchemy Upload</h1>
                                <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">Ingest raw documents into the Quantum Alchemy Engine.</p>
                            </div>

                            {/* Dropzone (Empty State) */}
                            <div className="group relative flex flex-col items-center justify-center w-full h-80 rounded-xl border-2 border-dashed border-[#135bec]/30 bg-[#135bec]/5 hover:bg-[#135bec]/10 hover:border-[#135bec] transition-all cursor-pointer">
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#135bec] text-6xl mb-4 animate-bounce">cloud_upload</span>
                                    <p className="text-lg font-bold text-[#111318] dark:text-white">Drag & drop PDF files here</p>
                                    <p className="text-sm text-[#616f89] dark:text-gray-400 mt-2">or click to browse</p>
                                    <span className="mt-6 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#135bec] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                        Select File
                                    </span>
                                </div>
                                <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
                            </div>

                            {/* File List */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-[#111318] dark:text-white">Current Uploads</h3>
                                {/* File Item 1: Uploading */}
                                <div className="flex flex-col gap-3 rounded-xl border border-[#f0f2f4] dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                                <span className="material-symbols-outlined">picture_as_pdf</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-base font-medium text-[#111318] dark:text-white line-clamp-1">Advanced_Quantum_Mechanics_Vol1.pdf</p>
                                                <p className="text-sm text-[#616f89] dark:text-gray-400">24.5 MB • Uploading...</p>
                                            </div>
                                        </div>
                                        <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 transition-colors">
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        <div className="h-full bg-[#135bec] w-[65%] rounded-full"></div>
                                    </div>
                                </div>
                                {/* File Item 2: Ready */}
                                <div className="flex items-center justify-between gap-4 rounded-xl border border-[#f0f2f4] dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm opacity-60">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                            <span className="material-symbols-outlined">picture_as_pdf</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-base font-medium text-[#111318] dark:text-white line-clamp-1">Lab_Safety_Guidelines_2024.pdf</p>
                                            <p className="text-sm text-[#616f89] dark:text-gray-400">1.2 MB • Waiting in queue</p>
                                        </div>
                                    </div>
                                    <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 transition-colors">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Quantum Pipeline Tracker */}
                    <div className="hidden lg:flex w-[400px] xl:w-[480px] shrink-0 flex-col border-l border-[#f0f2f4] dark:border-gray-800 bg-[#eff6ff]/40 dark:bg-[#0f172a] p-8 relative">
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-[#135bec] mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">hub</span>
                                Quantum Pipeline
                            </h2>
                            <p className="text-sm text-[#616f89] dark:text-gray-400">Real-time processing status of your content.</p>
                        </div>
                        {/* Stepper */}
                        <div className="flex flex-col flex-1 relative pl-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[27px] top-4 bottom-20 w-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                            {/* Step 1: Completed */}
                            <div className="flex gap-6 mb-10 group">
                                <div className="flex flex-col items-center">
                                    <div className="size-6 rounded-full bg-[#135bec] text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-[#0f172a]">
                                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                                    </div>
                                </div>
                                <div className="flex flex-col -mt-1">
                                    <h4 className="text-sm font-bold text-[#135bec]">Upload</h4>
                                    <p className="text-xs text-[#616f89] dark:text-gray-400 mt-0.5">Securely transferring to cloud storage.</p>
                                </div>
                            </div>
                            {/* Step 2: Active / Processing */}
                            <div className="flex gap-6 mb-10 group">
                                <div className="flex flex-col items-center">
                                    <div className="size-6 rounded-full bg-white border-2 border-[#135bec] flex items-center justify-center shadow-md ring-4 ring-white dark:ring-[#0f172a]">
                                        <span className="material-symbols-outlined text-[#135bec] text-sm animate-spin">progress_activity</span>
                                    </div>
                                </div>
                                <div className="flex flex-col -mt-1">
                                    <h4 className="text-sm font-bold text-[#111318] dark:text-white">Extraction</h4>
                                    <p className="text-xs text-[#616f89] dark:text-gray-400 mt-0.5">Parsing text and images from PDF.</p>
                                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium w-fit">
                                        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                        Processing...
                                    </div>
                                </div>
                            </div>
                            {/* Step 3: Pending */}
                            <div className="flex gap-6 mb-10 opacity-50">
                                <div className="flex flex-col items-center">
                                    <div className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center ring-4 ring-white dark:ring-[#0f172a]">
                                        <span className="text-xs font-bold">3</span>
                                    </div>
                                </div>
                                <div className="flex flex-col -mt-1">
                                    <h4 className="text-sm font-bold text-[#111318] dark:text-white">Analysis</h4>
                                    <p className="text-xs text-[#616f89] dark:text-gray-400 mt-0.5">AI analyzing context and key concepts.</p>
                                </div>
                            </div>
                            {/* Step 4: Pending */}
                            <div className="flex gap-6 mb-10 opacity-50">
                                <div className="flex flex-col items-center">
                                    <div className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center ring-4 ring-white dark:ring-[#0f172a]">
                                        <span className="text-xs font-bold">4</span>
                                    </div>
                                </div>
                                <div className="flex flex-col -mt-1">
                                    <h4 className="text-sm font-bold text-[#111318] dark:text-white">Generation</h4>
                                    <p className="text-xs text-[#616f89] dark:text-gray-400 mt-0.5">Creating quizzes and summaries.</p>
                                </div>
                            </div>
                        </div>
                        {/* Mascot Seno */}
                        <div className="mt-auto pt-6 border-t border-[#f0f2f4] dark:border-gray-800">
                            <div className="flex gap-4 items-start">
                                <div className="size-12 rounded-full shrink-0 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBMl60YrIoFCROBq7rIAKcKa1xtx9Q2Z3qegQdUxGrEBnSiIw4XOiIDvEHfKuJyicJIl85XaZ5B93kXFED9nr-58uBL4dhSBh-xdYgpM83TEjFKBMF75dAxYuS_Bqs9fSZY21bbh-AChER_fqcmM5KQH9L5_7BaLAxYX7NhwF9BF0ThjGC4Vry-mY_2SLvGbabdDvtThEROy-Vx7ovZBYWd3RCE_j5AiqLWpub_EDjGWlPt002QLcP850X6hWeJQEYjdHNY6fFnbg')" }}></div>
                                <div className="flex flex-col gap-2">
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-[#f0f2f4] dark:border-gray-700 relative">
                                        <p className="text-xs leading-relaxed text-[#111318] dark:text-gray-200">
                                            <span className="font-bold block mb-1">Maskot Seno says:</span>
                                            Hi! I'm Seno. I'll notify you once the magic is done. This usually takes about 2 minutes. Sit tight! 🚀
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Footer Action Bar */}
            <div className="border-t border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-gray-900 p-4 lg:px-12 flex items-center justify-between shrink-0">
                <button className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-4 py-2">
                    Cancel
                </button>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-lg bg-[#135bec]/10 text-[#135bec] text-sm font-bold hover:bg-[#135bec]/20 transition-colors">
                        Save Draft
                    </button>
                    <button className="px-5 py-2.5 rounded-lg bg-[#135bec] text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                        Start Processing
                    </button>
                </div>
            </div>
        </div>
    );
}
