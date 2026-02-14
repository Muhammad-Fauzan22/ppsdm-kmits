"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserSquare, Camera, Edit2, GraduationCap, Lock, Info, Shield, RefreshCw, Download, Trash2, BellRing, Save, AlertTriangle } from 'lucide-react';

export default function ProfileSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [shareData, setShareData] = useState(false);

    // Data Privacy States
    const [isExporting, setIsExporting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    // Handle data export
    const handleExportData = async () => {
        setIsExporting(true);
        try {
            const response = await fetch('/api/user/data', { method: 'GET' });
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ppsdm-kmits-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            alert('Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "HAPUS AKUN SAYA") return;

        setIsDeleting(true);
        try {
            const response = await fetch('/api/user/data', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confirmDeletion: true,
                    reason: deleteReason
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Akun Anda dijadwalkan untuk dihapus pada ${new Date(result.deletionScheduledFor).toLocaleDateString('id-ID')}. Anda dapat membatalkan dalam 14 hari.`);
                setShowDeleteModal(false);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            alert('Gagal memproses permintaan. Silakan coba lagi.');
        } finally {
            setIsDeleting(false);
        }
    };

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
        <div className="min-h-screen bg-transparent text-white font-sans max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors bg-card/30 backdrop-blur">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <UserSquare className="text-brand-blue w-6 h-6" />
                            Personal Information
                        </h2>
                        <button className="text-sm font-bold text-brand-blue hover:text-white transition-colors">Edit Details</button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center gap-3">
                            <div className="size-32 rounded-full bg-card-dark border-4 border-white/10 overflow-hidden relative group cursor-pointer shadow-lg">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" className="w-full h-full" alt="Profile" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <button className="bg-brand-blue rounded-full p-1.5 absolute ml-20 mt-24 border-4 border-background-dark hover:scale-110 transition-transform">
                                <Edit2 className="text-white w-3.5 h-3.5" />
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
                <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors bg-card/30 backdrop-blur">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                        <GraduationCap className="text-brand-blue w-6 h-6" />
                        Academic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                NRP / Student ID <Lock className="w-3 h-3" />
                            </label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-slate-500 cursor-not-allowed">
                                5025201042
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                Department <Lock className="w-3 h-3" />
                            </label>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed">
                                Informatics Engineering
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                Current GPA <Lock className="w-3 h-3" />
                            </label>
                            <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg px-4 py-3 flex justify-between items-center cursor-not-allowed">
                                <span className="text-white font-bold text-lg">3.85</span>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-emerald-500/20">Excellent</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                        <Info className="text-brand-blue w-5 h-5" />
                        <p className="text-sm text-slate-300">
                            Academic data is synchronized directly from the central university database. If you notice any discrepancies, please contact the Academic Administration Bureau.
                        </p>
                    </div>
                </div>

                {/* Data Privacy (UU PDP Compliance) */}
                <div className="glass-card border border-red-500/30 rounded-2xl p-8 hover:border-red-500/50 transition-colors bg-red-950/10 backdrop-blur">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                        <Shield className="text-red-500 w-6 h-6" />
                        Data Privacy & Control
                    </h2>

                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="font-bold text-sm text-slate-200">Export Personal Data</p>
                                <p className="text-xs text-slate-500 mt-1">Download a copy of all your data including assessment results (JSON format).</p>
                            </div>
                            <button
                                onClick={handleExportData}
                                disabled={isExporting}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isExporting ? (
                                    <RefreshCw className="animate-spin w-4 h-4" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {isExporting ? 'Exporting...' : 'Export Data'}
                            </button>
                        </div>

                        <div className="w-full h-px bg-white/5"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="font-bold text-sm text-red-400">Danger Zone</p>
                                <p className="text-xs text-slate-500 mt-1">Permanently delete your account and all associated data.</p>
                            </div>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm font-bold text-red-400 flex items-center gap-2 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preferences Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Privacy */}
                    <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors bg-card/30 backdrop-blur">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
                            <Lock className="text-brand-blue w-5 h-5" />
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
                    <div className="glass-card border border-white/10 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors bg-card/30 backdrop-blur">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
                            <BellRing className="text-brand-blue w-5 h-5" />
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
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>

            </motion.div>
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-600"></div>

                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-red-500 w-8 h-8" />
                                Delete Account?
                            </h3>

                            <p className="text-slate-400 text-sm mb-6">
                                This action will schedule your account for permanent deletion in <strong className="text-white">14 days</strong>.
                                During this grace period, you can restore your account by logging in.
                                After 14 days, all data will be <span className="text-red-400 font-bold">permanently erased</span> and cannot be recovered.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Reason (Optional)</label>
                                    <textarea
                                        value={deleteReason}
                                        onChange={(e) => setDeleteReason(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-red-500/50 outline-none transition-colors"
                                        placeholder="Why are you leaving?"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Type "HAPUS AKUN SAYA" to confirm</label>
                                    <input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="w-full bg-black/40 border border-red-500/30 rounded-lg p-3 text-sm text-white focus:border-red-500 outline-none transition-colors"
                                        placeholder="HAPUS AKUN SAYA"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== "HAPUS AKUN SAYA" || isDeleting}
                                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all"
                                >
                                    {isDeleting ? 'Processing...' : 'Delete Forever'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
