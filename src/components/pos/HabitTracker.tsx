"use client";

import React, { useState } from 'react';
import { usePOSStore } from '@/lib/stores/usePOSStore';
import { Check, Flame, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HabitTracker() {
    const { habits, addHabit, toggleHabit } = usePOSStore();
    const [newHabit, setNewHabit] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabit.trim()) return;
        addHabit(newHabit);
        setNewHabit('');
    };

    const getWeekDays = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const weekDays = getWeekDays();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" /> Atomic Habits
                </h2>
                <span className="text-xs text-gray-400 font-medium">Last 7 Days</span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {habits.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">
                        No habits yet. Start small!
                    </div>
                )}

                <AnimatePresence>
                    {habits.map((habit) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={habit.id}
                            className="group"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700 text-sm">{habit.title}</span>
                                <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                                    {Object.values(habit.history).filter(v => v).length} days
                                </span>
                            </div>
                            <div className="flex justify-between gap-1">
                                {weekDays.map((date) => {
                                    const isCompleted = habit.history[date];
                                    const isToday = date === today;

                                    return (
                                        <button
                                            key={date}
                                            onClick={() => toggleHabit(habit.id, date)}
                                            disabled={!isToday && !isCompleted} // Only allow toggling today or unchecking past (optional constraint)
                                            className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        ${isCompleted
                                                    ? 'bg-orange-500 text-white shadow-sm'
                                                    : isToday
                                                        ? 'bg-gray-100 hover:bg-orange-100 text-gray-300 hover:text-orange-400 ring-2 ring-orange-200'
                                                        : 'bg-gray-50 text-gray-200'
                                                }
                      `}
                                            title={date}
                                        >
                                            {isCompleted && <Check className="w-4 h-4" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <form onSubmit={handleAdd} className="mt-6 flex gap-2">
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="New habit..."
                    className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-orange-200 text-sm"
                />
                <button
                    type="submit"
                    disabled={!newHabit.trim()}
                    className="p-2 bg-gray-900 text-white rounded-xl hover:bg-black disabled:opacity-50 transition"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
