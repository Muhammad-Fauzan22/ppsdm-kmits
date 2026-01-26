"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfileSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [shareData, setShareData] = useState(false);

    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white font-[family-name:var(--font-lexend)] overflow-x-hidden min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-[#282e39] bg-white dark:bg-[#111318] px-10 py-3">
                <div className="flex items-center gap-4 text-[#111318] dark:text-white">
                    <div className="size-8 text-[#135bec]">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-9">
                        <Link className="text-[#6b7280] dark:text-[#9da6b9] text-sm font-medium leading-normal hover:text-[#135bec] dark:hover:text-white transition-colors" href="/dashboard">Home</Link>
                        <Link className="text-[#6b7280] dark:text-[#9da6b9] text-sm font-medium leading-normal hover:text-[#135bec] dark:hover:text-white transition-colors" href="/dashboard">Dashboard</Link>
                        <Link className="text-[#6b7280] dark:text-[#9da6b9] text-sm font-medium leading-normal hover:text-[#135bec] dark:hover:text-white transition-colors" href="#">Schedule</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-[#6b7280] dark:text-[#9da6b9] hover:text-[#135bec]">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-transparent hover:border-[#135bec] cursor-pointer transition-all" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFQs_t993YGsfycjHlzjqPgm_qYjsxu6Q-wRiGEcqQav5sQkvbcwIKdK5bsQVJ2rwViZxNBlJoj2O55MRWAiWvE2q5b26dc-tBekuaxDR_aQUId2VK1NrI4Da1KyInsqi-mJAT3yIeSDGMszr5Xq6VbjAuUVBk7wS2iZa51isW1mG4vglDIPpLDvsJTMsKrsLpzTH1wOYsoTmvdekJhZ1byXHo7ArpcgfGPbgd9IfDrjuOqfuykpU41RjXnZU1vPH9ldf81237DR0')" }}>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex flex-col w-72 border-r border-[#e5e7eb] dark:border-[#282e39] bg-white dark:bg-[#111318] p-6 gap-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
                    {/* User Summary */}
                    <div className="flex items-center gap-4 mb-2 pb-6 border-b border-[#e5e7eb] dark:border-[#282e39]">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWoHOKsSB4aiYfhwOi5jAi33w_ZzghvXNOcHxpt6ZAutuzvWmwp4nqkDB07g_-TG1-cVq0387cCpKukdh09AX0tms5LNH25mZo2P1CdZNS7a0Xsq14k7YXx5_zH5f8eU44T15KV1XYaVd9mXqqYHluBcb2_Yuf6V-gHXjYSEzKI88iolsMjW6jjgaqimaX7AnI4dmbYAj0yEKZV9YxSQXqFzsjIGOfi7_38GOoJfDzNZR2NzmmjvIjG79YXUM9jsb8xsWJWpzi00A')" }}>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[#111318] dark:text-white text-base font-semibold leading-tight">Budi Santoso</h1>
                            <p className="text-[#6b7280] dark:text-[#9da6b9] text-xs font-normal">Student ID: 5025201042</p>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#135bec] text-white shadow-lg shadow-[#135bec]/20 transition-all" href="/settings">
                            <span className="material-symbols-outlined filled">person</span>
                            <span className="text-sm font-medium">Account</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] dark:text-[#9da6b9] hover:bg-[#f6f6f8] dark:hover:bg-[#282e39] hover:text-[#111318] dark:hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined">school</span>
                            <span className="text-sm font-medium">Academic</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] dark:text-[#9da6b9] hover:bg-[#f6f6f8] dark:hover:bg-[#282e39] hover:text-[#111318] dark:hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined">shield</span>
                            <span className="text-sm font-medium">Privacy</span>
                        </Link>
                        <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6b7280] dark:text-[#9da6b9] hover:bg-[#f6f6f8] dark:hover:bg-[#282e39] hover:text-[#111318] dark:hover:text-white transition-all" href="#">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="text-sm font-medium">Notifications</span>
                        </Link>
                    </nav>
                    <div className="mt-auto">
                        <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all" href="/dashboard">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Log Out</span>
                        </Link>
                    </div>
                </aside>
                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-10 flex flex-col gap-8 max-w-[1000px] mx-auto w-full">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm">
                        <Link className="text-[#6b7280] dark:text-[#9da6b9] hover:text-[#135bec] transition-colors" href="/dashboard">Home</Link>
                        <span className="text-[#6b7280] dark:text-[#9da6b9]">/</span>
                        <span className="text-[#111318] dark:text-white font-medium">Profile Settings</span>
                    </div>
                    {/* Page Heading */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight">Profile Settings</h1>
                        <p className="text-[#6b7280] dark:text-[#9da6b9] text-base">Manage your personal information, academic details, and account preferences.</p>
                    </div>
                    {/* Content Cards Wrapper */}
                    <div className="flex flex-col gap-8">
                        {/* Account Section */}
                        <section className="flex flex-col gap-6 bg-white dark:bg-[#1e2430] rounded-2xl p-6 lg:p-8 shadow-sm border border-[#e5e7eb] dark:border-[#282e39]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-[#111318] dark:text-white">Personal Information</h3>
                                <button className="text-[#135bec] text-sm font-medium hover:underline">Edit Details</button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Avatar Uploader */}
                                <div className="relative group cursor-pointer flex-shrink-0 mx-auto md:mx-0">
                                    <div className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-white dark:border-[#282e39] shadow-lg" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAu_TSr5ogrvb9fjjW_ElpQpLOWJovZvNir40V7f2C0uqQj3Y0joQQJ9q2FS1zuSzm-2oIRRN8JOrSXF_qBhwch7lwlajZ2GCUTTZ706BqxwKrrUsU7Y9TTOvoHgDLXmoUJOWOQTLLwT0VfWF1bw1GObQ-xaj5xi6nu5DbVFfVPzhCxFkfwtC1vyN6S1tadLO8C96sZjZ_vo31D0PpU2tGxeXkamTdskdGqSttCqJjzO2SN82TFp3t9T8w7gswz8NwDkTjV3Bydkmk')" }}>
                                    </div>
                                    {/* Overlay */}
                                    <div className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <span className="material-symbols-outlined text-white mb-1">photo_camera</span>
                                        <span className="text-white text-xs font-medium">Upload</span>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-[#135bec] text-white p-1.5 rounded-full border-[3px] border-white dark:border-[#1e2430] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </div>
                                </div>
                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#111318] dark:text-white">Full Name</label>
                                        <input className="w-full h-11 px-4 rounded-lg border border-[#e5e7eb] dark:border-[#282e39] bg-[#f6f6f8] dark:bg-[#111318] text-[#111318] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all placeholder-[#9da6b9]" type="text" defaultValue="Budi Santoso" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#111318] dark:text-white">Email Address</label>
                                        <input className="w-full h-11 px-4 rounded-lg border border-[#e5e7eb] dark:border-[#282e39] bg-[#f6f6f8] dark:bg-[#111318] text-[#111318] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all placeholder-[#9da6b9]" type="email" defaultValue="budi.santoso@student.university.ac.id" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#111318] dark:text-white">Phone Number</label>
                                        <input className="w-full h-11 px-4 rounded-lg border border-[#e5e7eb] dark:border-[#282e39] bg-[#f6f6f8] dark:bg-[#111318] text-[#111318] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all placeholder-[#9da6b9]" type="tel" defaultValue="+62 812 3456 7890" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#111318] dark:text-white">Location</label>
                                        <input className="w-full h-11 px-4 rounded-lg border border-[#e5e7eb] dark:border-[#282e39] bg-[#f6f6f8] dark:bg-[#111318] text-[#111318] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all placeholder-[#9da6b9]" type="text" defaultValue="Surabaya, Indonesia" />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-medium text-[#111318] dark:text-white">Bio</label>
                                        <textarea className="w-full p-4 rounded-lg border border-[#e5e7eb] dark:border-[#282e39] bg-[#f6f6f8] dark:bg-[#111318] text-[#111318] dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all resize-none" placeholder="Write a short bio about yourself..." rows={3} defaultValue="Passionate Computer Science student with a focus on Artificial Intelligence and Mobile Development."></textarea>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Academic Info Section */}
                        <section className="flex flex-col gap-6 bg-white dark:bg-[#1e2430] rounded-2xl p-6 lg:p-8 shadow-sm border border-[#e5e7eb] dark:border-[#282e39]">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#135bec]/10 p-2 rounded-lg text-[#135bec]">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#111318] dark:text-white">Academic Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Read Only Field: NRP */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#6b7280] dark:text-[#9da6b9] flex items-center gap-2">
                                        NRP / Student ID
                                        <span className="material-symbols-outlined text-xs" title="Read Only">lock</span>
                                    </label>
                                    <div className="w-full h-11 px-4 flex items-center rounded-lg border border-[#e5e7eb] dark:border-[#282e39] bg-[#f3f4f6] dark:bg-[#111318]/50 text-[#6b7280] dark:text-[#9da6b9] cursor-not-allowed select-none font-mono">
                                        5025201042
                                    </div>
                                </div>
                                {/* Read Only Field: Department */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#6b7280] dark:text-[#9da6b9] flex items-center gap-2">
                                        Department
                                        <span className="material-symbols-outlined text-xs" title="Read Only">lock</span>
                                    </label>
                                    <div className="w-full h-11 px-4 flex items-center rounded-lg border border-[#e5e7eb] dark:border-[#282e39] bg-[#f3f4f6] dark:bg-[#111318]/50 text-[#6b7280] dark:text-[#9da6b9] cursor-not-allowed select-none">
                                        Informatics Engineering
                                    </div>
                                </div>
                                {/* Read Only Field: GPA */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#6b7280] dark:text-[#9da6b9] flex items-center gap-2">
                                        Current GPA
                                        <span className="material-symbols-outlined text-xs" title="Read Only">lock</span>
                                    </label>
                                    <div className="w-full h-11 px-4 flex items-center justify-between rounded-lg border border-[#135bec]/30 bg-[#135bec]/5 text-[#111318] dark:text-white cursor-not-allowed select-none">
                                        <span className="font-bold text-lg">3.85</span>
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 font-medium">Excellent</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3 items-start">
                                <span className="material-symbols-outlined text-[#135bec] mt-0.5">info</span>
                                <p className="text-sm text-[#111318] dark:text-white leading-relaxed">
                                    Academic data is synchronized directly from the central university database. If you notice any discrepancies, please contact the Academic Administration Bureau.
                                </p>
                            </div>
                        </section>
                        {/* Preferences Section */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Privacy Settings */}
                            <div className="flex flex-col gap-4 bg-white dark:bg-[#1e2430] rounded-2xl p-6 shadow-sm border border-[#e5e7eb] dark:border-[#282e39]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-[#135bec]/10 p-2 rounded-lg text-[#135bec]">
                                        <span className="material-symbols-outlined">shield</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">Privacy</h3>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-sm font-medium text-[#111318] dark:text-white">Profile Visibility</p>
                                        <p className="text-xs text-[#6b7280] dark:text-[#9da6b9]">Allow other students to view your basic profile information.</p>
                                    </div>
                                    <label className="flex items-center cursor-pointer relative">
                                        <input checked={profileVisibility} onChange={(e) => setProfileVisibility(e.target.checked)} className="sr-only toggle-checkbox" type="checkbox" />
                                        <div className={`w-11 h-6 rounded-full border toggle-label transition-colors ${profileVisibility ? 'bg-[#135bec] border-[#135bec]' : 'bg-[#e5e7eb] dark:bg-[#111318] border-[#d1d5db] dark:border-[#282e39]'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot ${profileVisibility ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                    </label>
                                </div>
                                <div className="w-full h-px bg-[#e5e7eb] dark:bg-[#282e39]"></div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-sm font-medium text-[#111318] dark:text-white">Share Data with Partners</p>
                                        <p className="text-xs text-[#6b7280] dark:text-[#9da6b9]">Allow sharing academic achievements for internship opportunities.</p>
                                    </div>
                                    <label className="flex items-center cursor-pointer relative">
                                        <input checked={shareData} onChange={(e) => setShareData(e.target.checked)} className="sr-only toggle-checkbox" type="checkbox" />
                                        <div className={`w-11 h-6 rounded-full border toggle-label transition-colors ${shareData ? 'bg-[#135bec] border-[#135bec]' : 'bg-[#e5e7eb] dark:bg-[#111318] border-[#d1d5db] dark:border-[#282e39]'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot ${shareData ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                    </label>
                                </div>
                            </div>
                            {/* Notification Settings */}
                            <div className="flex flex-col gap-4 bg-white dark:bg-[#1e2430] rounded-2xl p-6 shadow-sm border border-[#e5e7eb] dark:border-[#282e39]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-[#135bec]/10 p-2 rounded-lg text-[#135bec]">
                                        <span className="material-symbols-outlined">notifications_active</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">Notifications</h3>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-sm font-medium text-[#111318] dark:text-white">Email Alerts</p>
                                        <p className="text-xs text-[#6b7280] dark:text-[#9da6b9]">Receive daily summaries and important academic updates.</p>
                                    </div>
                                    <label className="flex items-center cursor-pointer relative">
                                        <input checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="sr-only toggle-checkbox" type="checkbox" />
                                        <div className={`w-11 h-6 rounded-full border toggle-label transition-colors ${emailAlerts ? 'bg-[#135bec] border-[#135bec]' : 'bg-[#e5e7eb] dark:bg-[#111318] border-[#d1d5db] dark:border-[#282e39]'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot ${emailAlerts ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                    </label>
                                </div>
                                <div className="w-full h-px bg-[#e5e7eb] dark:bg-[#282e39]"></div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-sm font-medium text-[#111318] dark:text-white">SMS Notifications</p>
                                        <p className="text-xs text-[#6b7280] dark:text-[#9da6b9]">Get instant alerts for urgent schedule changes.</p>
                                    </div>
                                    <label className="flex items-center cursor-pointer relative">
                                        <input checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="sr-only toggle-checkbox" type="checkbox" />
                                        <div className={`w-11 h-6 rounded-full border toggle-label transition-colors ${smsAlerts ? 'bg-[#135bec] border-[#135bec]' : 'bg-[#e5e7eb] dark:bg-[#111318] border-[#d1d5db] dark:border-[#282e39]'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot ${smsAlerts ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                    </label>
                                </div>
                            </div>
                        </section>
                        {/* Action Bar */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e5e7eb] dark:border-[#282e39]">
                            <button className="px-6 py-2.5 rounded-lg text-[#111318] dark:text-white font-medium hover:bg-[#e5e7eb] dark:hover:bg-[#282e39] transition-colors">
                                Cancel
                            </button>
                            <button className="px-6 py-2.5 rounded-lg bg-[#135bec] text-white font-bold hover:bg-[#135bec]/90 shadow-lg shadow-[#135bec]/25 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx global>{`
                 /* Custom scrollbar for better look in dark mode */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #111318;
                }
                ::-webkit-scrollbar-thumb {
                    background: #282e39;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #3b4250;
                }
                
                /* Toggle Switch styling used logic in inline style */
                /* The dot animation is handled by tailwind classes */
                .dot {
                     transition: transform 0.2s ease-in-out;
                }
            `}</style>
        </div>
    );
}
