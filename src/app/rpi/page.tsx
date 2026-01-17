"use client";

import Link from "next/link";

export default function RPIManagementPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark font-display antialiased overflow-x-hidden">
            {/* Reusing a similar Header as Dashboard but simplified for brevity in this single file demo */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-border-dark bg-white dark:bg-card-dark px-6 py-3 shadow-sm lg:px-10">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-primary dark:text-white">
                        <div className="size-8 flex items-center justify-center rounded bg-primary text-white">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">
                            PPSDM KMITS
                        </h2>
                    </div>
                    <div className="hidden md:flex items-center gap-8 pl-8">
                        <Link
                            className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                            href="/dashboard"
                        >
                            Dashboard
                        </Link>
                        <span className="text-primary dark:text-white text-sm font-bold bg-primary/5 dark:bg-white/10 px-3 py-1.5 rounded-full">
                            RPI Management
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl flex flex-col gap-8">
                    {/* Page Header */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black text-neutral-dark dark:text-white tracking-tight">
                                Rencana Pengembangan Individu
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Shape your future at ITS. Plan, track, and reflect on your
                                journey.
                            </p>
                        </div>
                    </div>

                    {/* ACTIVE TAB: Developmental Plan (Interactive Matrix) */}
                    <section className="tab-content flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Developmental Matrix
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Drag and drop activities to plan your semesters.
                                </p>
                            </div>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-light">
                                <span className="material-symbols-outlined text-[18px]">
                                    add
                                </span>{" "}
                                Add Activity
                            </button>
                        </div>

                        {/* Matrix Container */}
                        <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm">
                            <div className="overflow-x-auto pb-4">
                                <div className="min-w-[1200px] p-6">
                                    {/* Matrix Header (Semesters) */}
                                    <div className="grid grid-cols-[200px_repeat(8,_1fr)] gap-4 mb-4 border-b border-gray-100 dark:border-border-dark pb-2">
                                        <div className="font-bold text-gray-400 text-xs uppercase tracking-wider pt-2">
                                            Dimensions
                                        </div>
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`text-center font-semibold text-sm ${i === 4
                                                        ? "text-primary dark:text-white font-bold bg-primary/5 dark:bg-white/10 rounded py-1"
                                                        : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                Sem {i + 1}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Row 1: Spiritual */}
                                    <div className="grid grid-cols-[200px_repeat(8,_1fr)] gap-4 mb-6 items-start group">
                                        <div className="flex flex-col gap-1 pt-2">
                                            <span className="font-bold text-gray-800 dark:text-white text-sm">
                                                Spiritual &amp; Ethics
                                            </span>
                                        </div>
                                        {/* Cells */}
                                        <div className="h-24 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 p-1 flex flex-col gap-1">
                                            <div className="bg-white dark:bg-surface-dark p-2 rounded shadow-sm border border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 border-l-4 border-l-purple-400">
                                                Basic Mentoring
                                            </div>
                                        </div>
                                        <div className="h-24 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 p-1"></div>
                                        <div className="h-24 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 p-1"></div>
                                        <div className="h-24 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 p-1">
                                            <div className="bg-white dark:bg-surface-dark p-2 rounded shadow-sm border border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 border-l-4 border-l-purple-400">
                                                Ethics Workshop
                                            </div>
                                        </div>
                                        <div className="h-24 rounded-lg bg-primary/5 dark:bg-primary/20 border border-primary/20 p-1 flex flex-col gap-1">
                                            <div className="bg-white dark:bg-surface-dark p-2 rounded shadow-sm border border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 border-l-4 border-l-purple-400">
                                                Comm. Service
                                            </div>
                                        </div>
                                        {/* ... other cells ... */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* TAB 4 SUMMARY: Reflection Journal */}
                    <section className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">
                                book_2
                            </span>{" "}
                            Reflection Journal
                        </h3>
                        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm p-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Entry Stream */}
                                <div className="w-full">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">
                                        Recent Entries
                                    </h4>
                                    <div className="relative border-l-2 border-gray-100 dark:border-gray-700 ml-3 space-y-6">
                                        {/* Entry 1 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-card-dark bg-green-500 shadow-sm"></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                        Weekly Reflection
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Oct 2, 2023
                                                    </p>
                                                </div>
                                                <span className="text-xl">🙂</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                                Felt really productive today. Managed to solve the
                                                algorithm problem.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
