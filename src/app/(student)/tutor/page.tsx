"use client";

import React from 'react';

export default function SenoTutorPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#111318] font-[family-name:var(--font-inter)] text-white overflow-hidden h-screen flex">
            {/* LEFT SIDEBAR */}
            <aside className="w-[260px] flex-shrink-0 border-r border-[#282e39] bg-[#111318] flex flex-col z-20 hidden md:flex">
                {/* Brand */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#135bec]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPGSgQmtgVvJ7U3JYQR-_F4gY7SQjjh_RftASVon3t_FZFSrcXRwLFGWJ2sBf68A83kdlkgRaO66f6I16iOpuGSRWj44eWHQURO0e2ZShs2ZRQ6493tuFigFPCrPodpQDJPsi9bKCcELbkTDVU8xtaDLEOV6GyGtQq-WRtkEggKgXyNlh_MA3Ungh2TEUTz1s3-zhQWbYxX61Vp7wC5no5XhIKRWLc2vN7KmEERFJ1-mVKiqBK1IB9Wkm21B2DYG3GaSaDYBk5WYo")' }}>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-base font-bold leading-normal tracking-wide">Seno AI</h1>
                            <p className="text-[#9da6b9] text-xs font-normal leading-normal">Personal Tutor</p>
                        </div>
                    </div>
                </div>
                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-2 px-3 overflow-y-auto">
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-colors group" href="#">
                        <span className="material-symbols-outlined text-[22px]">home</span>
                        <span className="text-sm font-medium">Home</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#282e39] text-white transition-colors" href="#">
                        <span className="material-symbols-outlined text-[22px] text-[#135bec]">local_library</span>
                        <span className="text-sm font-medium">Library</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-colors group" href="#">
                        <span className="material-symbols-outlined text-[22px]">bar_chart</span>
                        <span className="text-sm font-medium">Progress</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9da6b9] hover:bg-[#282e39] hover:text-white transition-colors group" href="#">
                        <span className="material-symbols-outlined text-[22px]">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </a>
                </nav>
                {/* User Profile (Bottom) */}
                <div className="p-4 border-t border-[#282e39]">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#282e39] cursor-pointer transition-colors">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDk3shvLOQGcr6M8pB4DR7dwPjoAehrFn_YoA1B1hzvVxq9odGQhflM0TSZcbH6eomlxxUoqOd-E0UQu8daI6IkJPE3MWs-3kADpSveSTZh4SUbIt9G6ZT2Wt9xXc9JZMqxUpz7NLpar05KXrrHgEXPSISm61mSud1QwMzl99hVes6MtZ_-5H7PiRh5nXM2fhb9Ad04I49jr67nOhFCWNYFbVvuNERRPITAR-zKblisckf-cSJc58YxFPFquweDX7sWflO68RKSB_o")' }}>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-white text-sm font-medium truncate">Alex Student</p>
                            <p className="text-[#9da6b9] text-xs truncate">Premium Plan</p>
                        </div>
                        <span className="material-symbols-outlined text-[#9da6b9] ml-auto text-[18px]">more_vert</span>
                    </div>
                </div>
            </aside>

            {/* MAIN CHAT AREA */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#111318] relative">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-[#282e39] px-6 py-4 bg-[#111318]/95 backdrop-blur z-10">
                    <div className="flex items-center gap-4">
                        <div className="size-8 flex items-center justify-center text-[#135bec] bg-[#135bec]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                        </div>
                        <div>
                            <h2 className="text-white text-base font-bold leading-tight">Seno - PPSDM KMM AI Tutor</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <p className="text-xs text-[#9da6b9]">Online • Context: Machine Learning Basics</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center size-9 rounded-lg hover:bg-[#282e39] text-[#9da6b9] hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </button>
                        <button className="flex items-center justify-center size-9 rounded-lg hover:bg-[#282e39] text-[#9da6b9] hover:text-white transition-colors xl:hidden">
                            <span className="material-symbols-outlined text-[20px]">menu_open</span>
                        </button>
                    </div>
                </header>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8" id="chat-container">
                    {/* Date Separator */}
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-[#5c6475] bg-[#282e39]/50 px-3 py-1 rounded-full">Today, 10:23 AM</span>
                    </div>
                    {/* Message 1: Seno (AI) */}
                    <div className="flex items-start gap-4 max-w-3xl">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border border-[#282e39] mt-1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-fkWmu4bcOwaxne1ul5qT24CEx4Ot0U6XFKgW4ZlHAgMbYqWZ48STrPWDSI2kfDFs1wEOiKEhR3Ezhf21SWedb3EuuFlB7cJLtwY1Vaw4yEII-pmnK8-i2HjH1eQGLMzw5Qphfsagay_F2Lx-Fvt2m_QOSlH39nWnwcECEMSYZmbflO2C6Lj33NCmv60su1IPb2HfqU_wP522X5nemqNn-O4Xir0PQ-G0bK6b7LRjnTMcoN9hjeljMjMt_JGV1OShBHQsMmb3Uzs")' }}>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-white">Seno</span>
                                <span className="text-xs text-[#5c6475]">10:23 AM</span>
                            </div>
                            <div className="bg-[#282e39] text-gray-100 rounded-r-2xl rounded-bl-2xl p-4 text-[15px] leading-relaxed shadow-sm">
                                <p>Hello! I'm Seno. I've reviewed your recent modules on <strong>Machine Learning</strong>.</p>
                                <p className="mt-2">I noticed you spent some time on the "Introduction to Algorithms" section. How can I help you deepen your understanding today?</p>
                            </div>
                        </div>
                    </div>
                    {/* Message 2: User */}
                    <div className="flex items-start gap-4 max-w-3xl ml-auto flex-row-reverse">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border border-[#282e39] mt-1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6D7Hdo43AI2yFyZKHNNvt3ME6A5lvQtsDtjKGEpPAvqQRZNjq69xavEjZXfOgmVGoN0WTjETcK5Tqkr3OZcD3XaVT4cE0v77l0dBrby_G8H58u-NVk8lR8FNShN0PkikRe_DzclhK6aG7M-IHM6H-YsXGt_BY0vP2IyOWdbe6ywRtSil941kRhHZntvHZF9yMVL2q8c3dMbwkIqhObpJCeOcICYw8iR60vJM8LnHU60_dGEsh5NnAovi4H6bkwrpbW9vWlrQ7FRg")' }}>
                        </div>
                        <div className="flex flex-col gap-1.5 items-end">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-[#5c6475]">10:25 AM</span>
                                <span className="text-sm font-semibold text-white">You</span>
                            </div>
                            <div className="bg-[#135bec] text-white rounded-l-2xl rounded-br-2xl p-4 text-[15px] leading-relaxed shadow-sm">
                                <p>Can you explain the difference between Supervised and Unsupervised learning? I'm finding it a bit confusing.</p>
                            </div>
                        </div>
                    </div>
                    {/* Message 3: Seno (AI) */}
                    <div className="flex items-start gap-4 max-w-3xl">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border border-[#282e39] mt-1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDg7QP2h0qifHGf4Nx3R2ED5xzLyJxxPVZVe7zToBtmqhgJgOFop8UIbrb6AlFDtgGHFJ46XYb7Bllb8dhcBAbj4ZfTc8aIkvBvqylEiPKrFX6S4dH0a6zopzii0bY-0KuI5UG35wjcjKdnfF4D8tDUodOCG-0A8FoidnvrDoCoZRHs_Yk7uyinkEqXM0FmNfkMFAvAFu6O30MM0H1vwscTxSZRG0GEjOQCr3XlbN-2x8Tem32_urPB5IzAEfUJ19Nzbl-O2TlUgp8")' }}>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-white">Seno</span>
                                <span className="text-xs text-[#5c6475]">10:25 AM</span>
                            </div>
                            <div className="bg-[#282e39] text-gray-100 rounded-r-2xl rounded-bl-2xl p-4 text-[15px] leading-relaxed shadow-sm">
                                <p>Certainly! Think of it like a teacher versus self-discovery.</p>
                                <ul className="list-disc list-outside ml-5 mt-3 space-y-2 text-[#d1d5db]">
                                    <li><strong>Supervised Learning</strong> uses labeled data. It's like having a teacher who tells you "This is a cat, this is a dog," and then tests you. The goal is to predict the label for new data.</li>
                                    <li><strong>Unsupervised Learning</strong> deals with unlabeled data. It's like being given a pile of photos with no instructions and sorting them by similarities (e.g., separating landscapes from portraits) on your own. It finds hidden patterns.</li>
                                </ul>
                            </div>
                            {/* Interactive Actions Row */}
                            <div className="flex gap-2 mt-1">
                                <button className="p-1.5 hover:bg-[#282e39] rounded text-[#9da6b9] hover:text-white transition-colors" title="Copy">
                                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                </button>
                                <button className="p-1.5 hover:bg-[#282e39] rounded text-[#9da6b9] hover:text-white transition-colors" title="Regenerate">
                                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                                </button>
                                <button className="p-1.5 hover:bg-[#282e39] rounded text-[#9da6b9] hover:text-white transition-colors" title="Helpful">
                                    <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Input Area */}
                <div className="p-4 md:p-6 bg-[#111318] border-t border-[#282e39]">
                    <div className="max-w-4xl mx-auto flex flex-col gap-4">
                        {/* Suggestion Chips */}
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#282e39] bg-[#111318] hover:bg-[#282e39] text-xs font-medium text-[#135bec] hover:text-white transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                                Give me a real-world example
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#282e39] bg-[#111318] hover:bg-[#282e39] text-xs font-medium text-[#9da6b9] hover:text-white transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-[16px]">quiz</span>
                                Test my understanding
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#282e39] bg-[#111318] hover:bg-[#282e39] text-xs font-medium text-[#9da6b9] hover:text-white transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                                Save this definition
                            </button>
                        </div>
                        {/* Input Box */}
                        <div className="relative bg-[#282e39] rounded-xl border border-transparent focus-within:border-[#135bec]/50 transition-colors shadow-lg">
                            <textarea className="w-full bg-transparent border-0 text-white placeholder-[#5c6475] rounded-xl px-4 py-3 pr-14 focus:ring-0 resize-none min-h-[60px]" placeholder="Ask a follow-up question..." rows={1}></textarea>
                            {/* Input Actions */}
                            <div className="absolute right-2 bottom-2 flex items-center gap-1">
                                <button className="p-2 text-[#9da6b9] hover:text-white hover:bg-[#383f4d] rounded-lg transition-colors" title="Attach file">
                                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                </button>
                                <button className="p-2 text-[#9da6b9] hover:text-white hover:bg-[#383f4d] rounded-lg transition-colors" title="Voice input">
                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                </button>
                                <button className="p-2 bg-[#135bec] hover:bg-[#104bc7] text-white rounded-lg transition-colors shadow-md flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-[#5c6475]">Seno AI can make mistakes. Consider checking important information.</p>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR (Knowledge Panel) */}
            <aside className="w-[320px] flex-shrink-0 border-l border-[#282e39] bg-[#111318] flex flex-col hidden xl:flex">
                {/* Pinned Concepts Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-5 pb-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#fbbf24] text-[18px]">push_pin</span>
                                Pinned Concepts
                            </h3>
                            <button className="text-[#9da6b9] hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                            </button>
                        </div>
                    </div>
                    <div className="px-5 space-y-3 overflow-y-auto mb-4">
                        {/* Concept Card */}
                        <div className="bg-[#282e39]/50 border border-[#282e39] rounded-xl p-4 hover:border-[#fbbf24]/50 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-bold text-gray-200 group-hover:text-[#fbbf24] transition-colors">Machine Learning vs AI</h4>
                                <span className="material-symbols-outlined text-[#5c6475] text-[16px]">bookmark</span>
                            </div>
                            <p className="text-xs text-[#9da6b9] line-clamp-3 leading-relaxed">AI is the broad science of mimicking human abilities, while Machine Learning is a specific subset that trains a machine how to learn.</p>
                        </div>
                        {/* Concept Card Active */}
                        <div className="bg-[#282e39] border-l-2 border-[#fbbf24] rounded-r-xl p-4 cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-bold text-white">Supervised Learning</h4>
                                <span className="material-symbols-outlined text-[#fbbf24] text-[16px] fill-current">bookmark</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">Uses labeled datasets to train algorithms to classify data or predict outcomes accurately.</p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-[10px] bg-[#135bec]/20 text-blue-200 px-2 py-0.5 rounded">Definition</span>
                                <span className="text-[10px] text-[#5c6475]">Added just now</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-px bg-[#282e39] my-2"></div>
                    {/* Related Resources Section */}
                    <div className="p-5 flex-1 flex flex-col min-h-0">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[#135bec] text-[18px]">dataset_linked</span>
                            Related Resources
                        </h3>
                        <div className="space-y-3 overflow-y-auto pr-1">
                            <a className="flex items-start gap-3 group" href="#">
                                <div className="size-8 rounded bg-[#282e39] flex items-center justify-center shrink-0 group-hover:bg-[#135bec] transition-colors">
                                    <span className="material-symbols-outlined text-white text-[18px]">picture_as_pdf</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-200 font-medium group-hover:text-[#135bec] transition-colors">Module 4: Advanced Algorithms</span>
                                    <span className="text-xs text-[#5c6475]">PDF • 2.4 MB</span>
                                </div>
                            </a>
                            <a className="flex items-start gap-3 group" href="#">
                                <div className="size-8 rounded bg-[#282e39] flex items-center justify-center shrink-0 group-hover:bg-red-600 transition-colors">
                                    <span className="material-symbols-outlined text-white text-[18px]">play_circle</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-200 font-medium group-hover:text-[#135bec] transition-colors">Intro to Neural Networks</span>
                                    <span className="text-xs text-[#5c6475]">Video • 12 mins</span>
                                </div>
                            </a>
                            <a className="flex items-start gap-3 group" href="#">
                                <div className="size-8 rounded bg-[#282e39] flex items-center justify-center shrink-0 group-hover:bg-green-600 transition-colors">
                                    <span className="material-symbols-outlined text-white text-[18px]">description</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-200 font-medium group-hover:text-[#135bec] transition-colors">PPSDM KMM Learning Guide</span>
                                    <span className="text-xs text-[#5c6475]">Doc • Internal</span>
                                </div>
                            </a>
                        </div>
                    </div>
                    {/* Collapse Sidebar Button */}
                    <div className="p-4 border-t border-[#282e39]">
                        <button className="flex items-center justify-center w-full py-2 text-xs font-medium text-[#9da6b9] hover:text-white hover:bg-[#282e39] rounded-lg transition-colors gap-2">
                            <span className="material-symbols-outlined text-[16px]">dock_to_right</span>
                            Collapse Panel
                        </button>
                    </div>
                </div>
            </aside>

            <style jsx global>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill-current {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
