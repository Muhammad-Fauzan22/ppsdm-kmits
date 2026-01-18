"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Goal {
    id: string;
    title: string;
    dimension: string;
    targetDate: string;
    progress: number;
    milestones: { id: string; title: string; completed: boolean }[];
    priority: 'high' | 'medium' | 'low';
}

const mockGoals: Goal[] = [
    {
        id: '1',
        title: 'Meningkatkan skor finansial ke 70',
        dimension: 'financial',
        targetDate: '2026-03-18',
        progress: 35,
        milestones: [
            { id: 'm1', title: 'Buat budget bulanan', completed: true },
            { id: 'm2', title: 'Track pengeluaran 1 minggu', completed: true },
            { id: 'm3', title: 'Buka rekening tabungan', completed: false },
            { id: 'm4', title: 'Sisihkan 20% gaji/uang saku', completed: false },
        ],
        priority: 'high',
    },
    {
        id: '2',
        title: 'Olahraga rutin 3x seminggu',
        dimension: 'physical',
        targetDate: '2026-02-28',
        progress: 60,
        milestones: [
            { id: 'm1', title: 'Daftar gym/cari tempat olahraga', completed: true },
            { id: 'm2', title: 'Buat jadwal mingguan', completed: true },
            { id: 'm3', title: 'Olahraga minggu 1', completed: true },
            { id: 'm4', title: 'Olahraga minggu 2-4', completed: false },
        ],
        priority: 'medium',
    },
    {
        id: '3',
        title: 'Selesaikan 5 kursus online',
        dimension: 'cognitive',
        targetDate: '2026-04-30',
        progress: 20,
        milestones: [
            { id: 'm1', title: 'Kursus 1: Critical Thinking', completed: true },
            { id: 'm2', title: 'Kursus 2: Python Basics', completed: false },
            { id: 'm3', title: 'Kursus 3: Data Analysis', completed: false },
            { id: 'm4', title: 'Kursus 4-5', completed: false },
        ],
        priority: 'medium',
    },
];

const dimensionIcons: Record<string, string> = {
    cognitive: '🧠', emotional: '💚', social: '👥', physical: '💪',
    financial: '💰', character: '⭐', spiritual: '🕊️', environmental: '🌿', career: '💼',
};

export default function GoalsPage() {
    const [goals, setGoals] = useState(mockGoals);
    const [showNewGoal, setShowNewGoal] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', dimension: 'cognitive', targetDate: '' });

    const toggleMilestone = (goalId: string, milestoneId: string) => {
        setGoals(prev => prev.map(goal => {
            if (goal.id === goalId) {
                const milestones = goal.milestones.map(m =>
                    m.id === milestoneId ? { ...m, completed: !m.completed } : m
                );
                const completed = milestones.filter(m => m.completed).length;
                const progress = Math.round((completed / milestones.length) * 100);
                return { ...goal, milestones, progress };
            }
            return goal;
        }));
    };

    const addGoal = () => {
        if (!newGoal.title || !newGoal.targetDate) return;
        const goal: Goal = {
            id: Date.now().toString(),
            ...newGoal,
            progress: 0,
            milestones: [],
            priority: 'medium',
        };
        setGoals([goal, ...goals]);
        setNewGoal({ title: '', dimension: 'cognitive', targetDate: '' });
        setShowNewGoal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold">🎯 Goals & Milestones</h1>
                            <p className="text-green-200 mt-1">Track progress menuju versi terbaik Anda</p>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-white/20 rounded-xl">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{goals.length}</div>
                            <div className="text-sm text-green-200">Active Goals</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">
                                {goals.reduce((sum, g) => sum + g.milestones.filter(m => m.completed).length, 0)}
                            </div>
                            <div className="text-sm text-green-200">Completed</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">
                                {Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length || 0)}%
                            </div>
                            <div className="text-sm text-green-200">Avg Progress</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
                {/* Add Goal Button */}
                <button
                    onClick={() => setShowNewGoal(!showNewGoal)}
                    className="w-full py-4 border-2 border-dashed border-green-300 rounded-2xl text-green-600 font-medium hover:bg-green-50 transition"
                >
                    ➕ Tambah Goal Baru
                </button>

                {/* New Goal Form */}
                {showNewGoal && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h3 className="font-semibold mb-4">📝 Goal Baru</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Judul goal..."
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                className="w-full px-4 py-3 border rounded-xl"
                            />
                            <div className="flex gap-4">
                                <select
                                    value={newGoal.dimension}
                                    onChange={(e) => setNewGoal({ ...newGoal, dimension: e.target.value })}
                                    className="flex-1 px-4 py-3 border rounded-xl"
                                >
                                    {Object.entries(dimensionIcons).map(([dim, icon]) => (
                                        <option key={dim} value={dim}>{icon} {dim}</option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    value={newGoal.targetDate}
                                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                                    className="flex-1 px-4 py-3 border rounded-xl"
                                />
                            </div>
                            <button onClick={addGoal} className="w-full py-3 bg-green-600 text-white rounded-xl font-medium">
                                ✅ Simpan Goal
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Goals List */}
                {goals.map((goal, index) => (
                    <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{dimensionIcons[goal.dimension]}</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                                        <p className="text-sm text-gray-500">Target: {new Date(goal.targetDate).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {goal.priority}
                                </span>
                            </div>

                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-medium text-green-600">{goal.progress}%</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goal.progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Milestones */}
                            <div className="space-y-2">
                                {goal.milestones.map((milestone) => (
                                    <button
                                        key={milestone.id}
                                        onClick={() => toggleMilestone(goal.id, milestone.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${milestone.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${milestone.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                                            }`}>
                                            {milestone.completed && '✓'}
                                        </div>
                                        <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                                            {milestone.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
                    {[
                        { href: '/dashboard', icon: '🏠', label: 'Home' },
                        { href: '/goals', icon: '🎯', label: 'Goals', active: true },
                        { href: '/roadmap', icon: '🗺️', label: 'Roadmap' },
                        { href: '/profile', icon: '👤', label: 'Profile' },
                    ].map((item) => (
                        <Link key={item.href} href={item.href} className={`flex flex-col items-center ${item.active ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
