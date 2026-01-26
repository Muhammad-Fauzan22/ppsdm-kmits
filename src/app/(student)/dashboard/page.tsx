"use client";

import React from 'react';
import Link from 'next/link';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// --- Widgets ---

const RadarWidget = () => {
    const data = {
        labels: ['Logic', 'Ethics', 'Leadership', 'Global', 'Technology', 'Communication'],
        datasets: [
            {
                label: 'Current Level',
                data: [8, 9, 6, 7, 8, 5],
                backgroundColor: 'rgba(19, 91, 236, 0.2)',
                borderColor: '#135bec',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#135bec',
            },
            {
                label: 'Class Avg',
                data: [6, 7, 5, 6, 6, 6],
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                borderColor: '#94a3b8',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
            }
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: { color: 'rgba(0,0,0,0.1)' },
                grid: { color: 'rgba(0,0,0,0.05)' },
                pointLabels: {
                    font: { size: 10, family: 'var(--font-work-sans)' },
                    color: '#64748b'
                },
                ticks: { display: false, max: 10 }
            }
        },
        plugins: {
            legend: { display: false }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Competency Radar</h3>
                    <p className="text-xs text-slate-500">Updated: Today</p>
                </div>
                <Link href="/assessment" className="text-its-blue text-xs font-bold hover:underline">Retake</Link>
            </div>
            <div className="flex-1 relative min-h-[200px]">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
};

const NextActionsWidget = () => {
    const tasks = [
        { id: 1, title: 'Complete Logic Assessment', type: 'Assessment', due: 'Today', priority: 'high' },
        { id: 2, title: 'Upload Internship Certificate', type: 'Portfolio', due: 'Tomorrow', priority: 'medium' },
        { id: 3, title: 'Read "Ethical AI" Article', type: 'Learning', due: 'Fri', priority: 'low' },
    ];

    return (
        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
                    AI Next Actions
                </h3>
            </div>
            <div className="space-y-3 flex-1">
                {tasks.map(task => (
                    <div key={task.id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer">
                        <div className={`size-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 line-clamp-1">{task.title}</p>
                            <div className="flex gap-2 text-[10px] text-slate-500 mt-0.5">
                                <span className="uppercase tracking-wider">{task.type}</span>
                                <span>•</span>
                                <span>Due {task.due}</span>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-slate-400 text-lg">arrow_forward_ios</span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-medium text-slate-500 hover:text-its-blue border border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:border-its-blue transition-colors">
                + Add Personal Task
            </button>
        </div>
    );
};

const GamificationWidget = () => (
    <div className="bg-gradient-to-br from-its-dark to-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden h-full">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-white/60 font-medium uppercase tracking-wider mb-1">Current Rank</p>
                    <h3 className="text-2xl font-bold font-serif">Navigator II</h3>
                </div>
                <div className="size-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-yellow-400">military_tech</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                    <span>XP Progress</span>
                    <span className="text-yellow-400">2,450 / 3,000</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-its-light to-its-blue w-[82%]" />
                </div>
                <p className="text-[10px] text-white/50 text-right mt-1">550 XP to next level</p>
            </div>
        </div>
    </div>
);

// --- Main Page ---

export default function StudentDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hello, Fauzan! 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Ready to level up your skills today?</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        Schedule
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-its-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-lg">add</span>
                        New Entry
                    </button>
                </div>
            </div>

            {/* Widgets Grid Layer 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-1 lg:col-span-1 h-64 md:h-auto">
                    <GamificationWidget />
                </div>
                <div className="xl:col-span-2 lg:col-span-2 h-80">
                    <RadarWidget />
                </div>
                <div className="xl:col-span-1 lg:col-span-1 h-80">
                    <NextActionsWidget />
                </div>
            </div>

            {/* Quick Access / Recent Activity */}
            <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Continue Learning</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="group bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-its-blue/50 transition-all cursor-pointer">
                        <div className="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-slate-300">play_circle</span>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">12:30</div>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-its-blue transition-colors">Mastering Public Speaking</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-3">Module 3 • Effective Body Language</p>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 w-[45%] h-full" />
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="group bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-its-blue/50 transition-all cursor-pointer">
                        <div className="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-slate-300">article</span>
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-its-blue transition-colors">The Future of AI in Engineering</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-3">Article • 5 min read</p>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">Technology</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
