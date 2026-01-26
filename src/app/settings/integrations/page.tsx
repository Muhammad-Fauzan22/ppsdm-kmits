"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-[#0E1016] text-white font-sans">
            <header className="bg-[#16181D] border-b border-[#2D303E] px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-500">hub</span>
                    <h1 className="font-bold text-lg">PPSDM KMM</h1>
                </div>
                <div className="flex gap-6 text-sm text-gray-400 font-medium">
                    <Link href="#" className="hover:text-white">Dashboard</Link>
                    <Link href="#" className="hover:text-white">My Learning</Link>
                    <Link href="#" className="text-white">Settings</Link>
                    <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                        <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-8">
                <div className="mb-8">
                    <p className="text-gray-500 text-sm mb-1">Settings / <span className="text-white">Integrations</span></p>
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">External API Sync Hub</h2>
                            <p className="text-gray-400 max-w-xl">Centralized management of your learning data from external platforms.</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all">
                            <span className="material-symbols-outlined text-[18px]">sync</span>
                            Sync All Now
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Active Integrations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Integration 1: LinkedIn */}
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-xl p-6 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded bg-white flex items-center justify-center p-2">
                                        {/* LinkedIn Logo Placeholder */}
                                        <div className="font-bold text-blue-700 text-2xl">in</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-md">LinkedIn Learning</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                            <span className="text-[10px] text-green-500 font-bold uppercase">Connected</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">settings</span></button>
                            </div>

                            <div className="space-y-2 mb-6 text-xs text-gray-400">
                                <div className="flex justify-between">
                                    <span>Sync Status</span>
                                    <span className="text-white">Healthy</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last Synced</span>
                                    <span className="text-white">2 mins ago</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Data Scope</span>
                                    <span className="text-white text-right">Profile, Skills,<br />Endorsements</span>
                                </div>
                            </div>

                            <button className="w-full mt-auto bg-[#252830] hover:bg-[#2D303E] border border-[#2D303E] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">sync</span> Sync Now
                            </button>
                        </div>

                        {/* Integration 2: GitHub */}
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-xl p-6 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded bg-[#24292e] flex items-center justify-center text-white p-2">
                                        <span className="material-symbols-outlined text-2xl">code</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-md">GitHub</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="size-2 rounded-full bg-green-500"></span>
                                            <span className="text-[10px] text-green-500 font-bold uppercase">Connected</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">settings</span></button>
                            </div>

                            <div className="space-y-2 mb-6 text-xs text-gray-400">
                                <div className="flex justify-between">
                                    <span>Sync Status</span>
                                    <span className="text-white">Healthy</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last Synced</span>
                                    <span className="text-white">1 hour ago</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Activity</span>
                                    <span className="text-white font-bold">45 Commits fetched today</span>
                                </div>
                            </div>

                            <button className="w-full mt-auto bg-[#252830] hover:bg-[#2D303E] border border-[#2D303E] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-sm">sync</span> Sync Now
                            </button>
                        </div>

                        {/* Integration 3: Coursera */}
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-xl p-6 flex flex-col relative overflow-hidden">
                            {/* Overlay for Pending */}
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <span className="material-symbols-outlined text-8xl">lock</span>
                            </div>

                            <div className="flex justify-between items-start mb-6 z-10">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded bg-blue-700 flex items-center justify-center text-white font-bold text-xs p-2">
                                        CV
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-md">Coursera</h4>
                                        <div className="flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-yellow-500/10 w-fit">
                                            <span className="size-2 rounded-full bg-yellow-500"></span>
                                            <span className="text-[10px] text-yellow-500 font-bold uppercase">Pending Auth</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">more_vert</span></button>
                            </div>

                            <p className="text-xs text-gray-400 mb-6 z-10 leading-relaxed">
                                Connect your account to automatically import certifications and course completions.
                            </p>

                            <div className="bg-[#252830] rounded p-2 text-center mb-6 border border-[#2D303E]">
                                <p className="text-[10px] text-gray-500 font-bold uppercase">15 Certificates Detected</p>
                            </div>

                            <button className="w-full mt-auto bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors z-10">
                                <span className="material-symbols-outlined text-sm">link</span> Connect
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Configuration */}
                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-lg mb-4">Configuration</h3>
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-xl overflow-hidden divide-y divide-[#2D303E]">

                            {/* Option 1 */}
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Auto-Sync Frequency</h4>
                                    <p className="text-xs text-gray-400">How often should we pull data from connected providers?</p>
                                </div>
                                <select className="bg-[#252830] text-gray-300 text-sm border border-[#2D303E] rounded px-3 py-2 outline-none focus:border-blue-500">
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Manual Only</option>
                                </select>
                            </div>

                            {/* Option 2 */}
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Public Profile Visibility</h4>
                                    <p className="text-xs text-gray-400">Make synced certifications and skills visible on your public profile.</p>
                                </div>
                                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>

                            {/* Option 3 */}
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Sync Failure Notifications</h4>
                                    <p className="text-xs text-gray-400">Receive an email alert if a data sync fails consecutively.</p>
                                </div>
                                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right: Activity Log */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Recent Activity</h3>
                            <button className="text-xs text-blue-500 font-bold hover:underline">View All</button>
                        </div>
                        <div className="bg-[#16181D] border border-[#2D303E] rounded-xl p-2">

                            {[
                                { title: "GitHub Sync Successful", desc: "Updated 4 repositories and 12 commits.", time: "TODAY, 10:45 AM", icon: "check_circle", color: "text-green-500" },
                                { title: "LinkedIn Sync Successful", desc: "Updated profile skills.", time: "TODAY, 10:42 AM", icon: "check_circle", color: "text-green-500" },
                                { title: "Coursera Token Expired", desc: "Please reconnect your account.", time: "YESTERDAY, 4:20 PM", icon: "error", color: "text-red-500" },
                                { title: "Manual Sync Triggered", desc: "Initiated by user.", time: "YESTERDAY, 9:00 AM", icon: "check_circle", color: "text-green-500" }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-3 p-3 hover:bg-[#1C1E26] rounded-lg transition-colors group">
                                    <div className={`mt-0.5 ${log.color}`}>
                                        <span className="material-symbols-outlined text-lg">{log.icon}</span>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{log.title}</h5>
                                        <p className="text-[10px] text-gray-400 leading-snug mb-1">{log.desc}</p>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{log.time}</p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
