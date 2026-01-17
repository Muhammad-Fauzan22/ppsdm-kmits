"use client";

import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
                    <h1 className="font-bold text-xl">Admin Console</h1>
                </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="text-sm font-bold text-gray-500 uppercase">Total Users</h3>
                            <p className="text-4xl font-bold mt-2">1,240</p>
                            <span className="text-green-500 text-sm font-bold">+12% vs last sem</span>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="text-sm font-bold text-gray-500 uppercase">Avg Completion</h3>
                            <p className="text-4xl font-bold mt-2">88%</p>
                            <span className="text-gray-500 text-sm font-medium">Consistent</span>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="text-sm font-bold text-gray-500 uppercase">Impact Score</h3>
                            <p className="text-4xl font-bold mt-2">4.8</p>
                            <span className="text-green-500 text-sm font-bold">+2% satisfaction</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                            <h3 className="font-bold text-lg">Active Programs</h3>
                            <button className="text-primary font-medium text-sm">View All</button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500">Program Name</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500">Participants</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                <tr>
                                    <td className="px-6 py-4 font-medium">Leadership Training 101</td>
                                    <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span></td>
                                    <td className="px-6 py-4">450</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-medium">Python Data Science</td>
                                    <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Draft</span></td>
                                    <td className="px-6 py-4">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
