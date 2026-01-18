"use client";

import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [emailDigest, setEmailDigest] = useState(true);
    const [language, setLanguage] = useState("id");

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">settings</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Settings</h1>
                            <p className="text-xs text-gray-500">Manage your preferences</p>
                        </div>
                    </Link>
                </div>
            </header>

            <main className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
                {/* Profile Section */}
                <section className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Profile
                    </h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className="size-20 rounded-full bg-cover bg-center border-4 border-primary/20"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI")',
                            }}
                        ></div>
                        <div>
                            <h3 className="font-bold text-lg">Rian Santoso</h3>
                            <p className="text-gray-500 text-sm">5025201001@student.its.ac.id</p>
                            <p className="text-xs text-gray-400">Informatics Engineering • Semester 5</p>
                        </div>
                    </div>
                    <button className="w-full py-2 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Edit Profile
                    </button>
                </section>

                {/* Preferences Section */}
                <section className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">tune</span>
                        Preferences
                    </h2>
                    <div className="space-y-4">
                        {/* Dark Mode */}
                        <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">dark_mode</span>
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-xs text-gray-500">Use dark theme</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-gray-200"}`}
                            >
                                <div className={`size-5 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-6" : "translate-x-0.5"}`}></div>
                            </button>
                        </div>

                        {/* Language */}
                        <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">language</span>
                                <div>
                                    <p className="font-medium">Language</p>
                                    <p className="text-xs text-gray-500">Select your preferred language</p>
                                </div>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 text-sm"
                            >
                                <option value="id">Bahasa Indonesia</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">notifications</span>
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-xs text-gray-500">Receive push notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-gray-200"}`}
                            >
                                <div className={`size-5 bg-white rounded-full shadow transition-transform ${notifications ? "translate-x-6" : "translate-x-0.5"}`}></div>
                            </button>
                        </div>

                        {/* Email Digest */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500">mail</span>
                                <div>
                                    <p className="font-medium">Weekly Email Digest</p>
                                    <p className="text-xs text-gray-500">Receive weekly summary emails</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmailDigest(!emailDigest)}
                                className={`w-12 h-6 rounded-full transition-colors ${emailDigest ? "bg-primary" : "bg-gray-200"}`}
                            >
                                <div className={`size-5 bg-white rounded-full shadow transition-transform ${emailDigest ? "translate-x-6" : "translate-x-0.5"}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-white dark:bg-card-dark rounded-xl border border-red-200 dark:border-red-900/30 p-6">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
                        <span className="material-symbols-outlined">warning</span>
                        Danger Zone
                    </h2>
                    <div className="space-y-3">
                        <button className="w-full py-2 border border-red-200 dark:border-red-900/50 text-red-600 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            Reset All Progress
                        </button>
                        <button className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </section>

                {/* App Info */}
                <div className="text-center text-sm text-gray-400 py-4">
                    <p>PPSDM KMM v1.0.0</p>
                    <p className="text-xs mt-1">© 2024 KMM. All rights reserved.</p>
                </div>
            </main>
        </div>
    );
}
