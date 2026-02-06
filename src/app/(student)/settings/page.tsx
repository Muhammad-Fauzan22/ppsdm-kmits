"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfileSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [shareData, setShareData] = useState(false);

    // Toggle component for reuse
    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
        <div
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-brand-blue' : 'bg-white/10'}`}
            onClick={() => onChange(!checked)}
        >
            <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-7' : 'left-1'}`}></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-white font-sans max-w-5xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-white">Profile Settings</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
                <p className="text-slate-400 mt-1">Manage your personal information, academic details, and account preferences.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-8"
            >

                {/* Personal Information */}
                <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <span className="material-symbols-outlined text-brand-blue">assignment_ind</span>
                            Personal Information
                        </h2>
                        <button className="text-sm font-bold text-brand-blue hover:text-white transition-colors">Edit Details</button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center gap-3">
                            <div className="size-32 rounded-full bg-card-dark border-4 border-white/10 overflow-hidden relative group cursor-pointer shadow-lg">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" className="w-full h-full" alt="Profile" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white">photo_camera</span>
                                </div>
                            </div>
                            <button className="bg-brand-blue rounded-full p-1.5 absolute ml-20 mt-24 border-4 border-background-dark hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-sm">edit</span>
                            </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-semibold text-slate-200">
                                    Budi Santoso
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-semibold text-slate-200">
                                    budi.santoso@student.university.ac.id
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-semibold text-slate-200">
                                    +62 812 3456 7890
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-semibold text-slate-200">
                                    Surabaya, Indonesia
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Bio</label>
                                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-semibold text-slate-200 min-h-[80px]">
                                    Passionate Computer Science student with a focus on Artificial Intelligence and Mobile Development.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                        <span className="material-symbols-outlined text-brand-blue">school</span>
                        Academic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                NRP / Student ID <span className="material-symbols-outlined text-[12px]">lock</span>
                            </label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-slate-500 cursor-not-allowed">
                                5025201042
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                Department <span className="material-symbols-outlined text-[12px]">lock</span>
                            </label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed">
                                Informatics Engineering
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                Current GPA <span className="material-symbols-outlined text-[12px]">lock</span>
                            </label>
                            <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg px-4 py-3 flex justify-between items-center cursor-not-allowed">
                                <span className="text-white font-bold text-lg">3.85</span>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-emerald-500/20">Excellent</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                        <span className="material-symbols-outlined text-brand-blue">info</span>
                        <p className="text-sm text-slate-300">
                            Academic data is synchronized directly from the central university database. If you notice any discrepancies, please contact the Academic Administration Bureau.
                        </p>
                    </div>
                </div>

                {/* Preferences Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Privacy */}
                    <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
                            <span className="material-symbols-outlined text-brand-blue">lock</span>
                            Privacy
                        </h2>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-slate-200">Profile Visibility</p>
                                    <p className="text-xs text-slate-500 mt-1">Allow other students to view your basic profile information.</p>
                                </div>
                                <Toggle checked={profileVisibility} onChange={setProfileVisibility} />
                            </div>

                            <div className="w-full h-px bg-white/5"></div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-slate-200">Share Data with Partners</p>
                                    <p className="text-xs text-slate-500 mt-1">Allow sharing academic achievements for internship opportunities.</p>
                                </div>
                                <Toggle checked={shareData} onChange={setShareData} />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
                            <span className="material-symbols-outlined text-brand-blue">notifications_active</span>
                            Notifications
                        </h2>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-slate-200">Email Alerts</p>
                                    <p className="text-xs text-slate-500 mt-1">Receive daily summaries and important academic updates.</p>
                                </div>
                                <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
                            </div>

                            <div className="w-full h-px bg-white/5"></div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-slate-200">SMS Notifications</p>
                                    <p className="text-xs text-slate-500 mt-1">Get instant alerts for urgent schedule changes.</p>
                                </div>
                                <Toggle checked={smsAlerts} onChange={setSmsAlerts} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4 pb-8">
                    <button className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button className="bg-brand-blue hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-blue/30 flex items-center gap-2 transition-all active:scale-95">
                        <span className="material-symbols-outlined">save</span>
                        Save Changes
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
