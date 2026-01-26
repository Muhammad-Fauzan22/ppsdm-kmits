"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ProfileSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [shareData, setShareData] = useState(false);

    // Toggle component for reuse
    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
        <div
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-blue-600' : 'bg-[#2D303E]'}`}
            onClick={() => onChange(!checked)}
        >
            <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-7' : 'left-1'}`}></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0E1015] text-white font-sans">

            {/* Navbar */}
            <nav className="border-b border-[#2D303E] px-8 py-4 bg-[#161920] flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">shield_person</span>
                    </div>
                    <span className="font-bold tracking-wide">PPSDM KMM</span>
                </div>
                <div className="flex gap-6 text-sm font-bold text-gray-400">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Home</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <Link href="#" className="hover:text-white transition-colors">Schedule</Link>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">notifications</span></button>
                    <div className="size-8 rounded-full bg-orange-100 border border-[#2D303E] overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" className="w-full h-full" />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 flex gap-8">

                {/* Sidebar Navigation */}
                <aside className="w-64 hidden lg:block sticky top-24 h-fit">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="size-12 rounded-full bg-yellow-100 border-2 border-[#2D303E] overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" className="w-full h-full" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm">Budi Santoso</h2>
                            <p className="text-xs text-gray-500">Student ID: 5025201042</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/40">
                            <span className="material-symbols-outlined text-[20px]">person</span>
                            Account
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1C2028] hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                            Academic
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1C2028] hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">shield</span>
                            Privacy
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1C2028] hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            Notifications
                        </Link>
                    </nav>

                    <div className="mt-8 pt-6 border-t border-[#2D303E]">
                        <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-900/10 transition-colors font-bold">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Log Out
                        </Link>
                    </div>
                </aside>

                {/* Main Settings Area */}
                <div className="flex-1 max-w-4xl">

                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>Home</span>
                            <span>/</span>
                            <span className="text-white">Profile Settings</span>
                        </div>
                        <h1 className="text-3xl font-bold">Profile Settings</h1>
                        <p className="text-gray-400 mt-1">Manage your personal information, academic details, and account preferences.</p>
                    </div>

                    <div className="space-y-8">

                        {/* Personal Information */}
                        <div className="bg-[#151921] border border-[#2D303E] rounded-2xl p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500">assignment_ind</span>
                                    Personal Information
                                </h2>
                                <button className="text-sm font-bold text-blue-500 hover:underline">Edit Details</button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-32 rounded-full bg-[#1C2028] border-4 border-[#2D303E] overflow-hidden relative group cursor-pointer">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" className="w-full h-full" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white">photo_camera</span>
                                        </div>
                                    </div>
                                    <button className="bg-blue-600 rounded-full p-1.5 absolute ml-20 mt-24 border-4 border-[#151921]">
                                        <span className="material-symbols-outlined text-white text-sm">edit</span>
                                    </button>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                                        <div className="bg-[#0E1015] border border-[#2D303E] rounded-lg px-4 py-3 font-semibold text-gray-200">
                                            Budi Santoso
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                                        <div className="bg-[#0E1015] border border-[#2D303E] rounded-lg px-4 py-3 font-semibold text-gray-200">
                                            budi.santoso@student.university.ac.id
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                                        <div className="bg-[#0E1015] border border-[#2D303E] rounded-lg px-4 py-3 font-semibold text-gray-200">
                                            +62 812 3456 7890
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                                        <div className="bg-[#0E1015] border border-[#2D303E] rounded-lg px-4 py-3 font-semibold text-gray-200">
                                            Surabaya, Indonesia
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Bio</label>
                                        <div className="bg-[#0E1015] border border-[#2D303E] rounded-lg px-4 py-3 font-semibold text-gray-200 min-h-[80px]">
                                            Passionate Computer Science student with a focus on Artificial Intelligence and Mobile Development.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="bg-[#151921] border border-[#2D303E] rounded-2xl p-8">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-blue-500">school</span>
                                Academic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                                        NRP / Student ID <span className="material-symbols-outlined text-[12px]">lock</span>
                                    </label>
                                    <div className="bg-[#1C2028] border border-[#2D303E] rounded-lg px-4 py-3 font-mono text-gray-500 cursor-not-allowed">
                                        5025201042
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                                        Department <span className="material-symbols-outlined text-[12px]">lock</span>
                                    </label>
                                    <div className="bg-[#1C2028] border border-[#2D303E] rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed">
                                        Informatics Engineering
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                                        Current GPA <span className="material-symbols-outlined text-[12px]">lock</span>
                                    </label>
                                    <div className="bg-[#1A2234] border border-blue-900/30 rounded-lg px-4 py-3 flex justify-between items-center cursor-not-allowed">
                                        <span className="text-white font-bold text-lg">3.85</span>
                                        <span className="bg-green-900/20 text-green-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Excellent</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                                <span className="material-symbols-outlined text-blue-500">info</span>
                                <p className="text-sm text-gray-300">
                                    Academic data is synchronized directly from the central university database. If you notice any discrepancies, please contact the Academic Administration Bureau.
                                </p>
                            </div>
                        </div>

                        {/* Preferences Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Privacy */}
                            <div className="bg-[#151921] border border-[#2D303E] rounded-2xl p-8">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-blue-500">lock</span>
                                    Privacy
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm">Profile Visibility</p>
                                            <p className="text-xs text-gray-500 mt-1">Allow other students to view your basic profile information.</p>
                                        </div>
                                        <Toggle checked={profileVisibility} onChange={setProfileVisibility} />
                                    </div>

                                    <div className="w-full h-px bg-[#2D303E]"></div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm">Share Data with Partners</p>
                                            <p className="text-xs text-gray-500 mt-1">Allow sharing academic achievements for internship opportunities.</p>
                                        </div>
                                        <Toggle checked={shareData} onChange={setShareData} />
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-[#151921] border border-[#2D303E] rounded-2xl p-8">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-blue-500">notifications_active</span>
                                    Notifications
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm">Email Alerts</p>
                                            <p className="text-xs text-gray-500 mt-1">Receive daily summaries and important academic updates.</p>
                                        </div>
                                        <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
                                    </div>

                                    <div className="w-full h-px bg-[#2D303E]"></div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm">SMS Notifications</p>
                                            <p className="text-xs text-gray-500 mt-1">Get instant alerts for urgent schedule changes.</p>
                                        </div>
                                        <Toggle checked={smsAlerts} onChange={setSmsAlerts} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end gap-4">
                            <button className="px-6 py-3 rounded-lg font-bold text-gray-300 hover:text-white transition-colors">Cancel</button>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-blue-900/40 flex items-center gap-2 transition-all">
                                <span className="material-symbols-outlined">save</span>
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
