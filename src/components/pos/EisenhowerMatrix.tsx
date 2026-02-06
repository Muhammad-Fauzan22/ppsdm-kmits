"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePOSStore, Task } from '@/lib/stores/usePOSStore';
import { Plus, Trash2, CheckCircle, GripVertical } from 'lucide-react';

const quadrants = [
    { id: 'do', title: 'Do First', color: 'bg-red-50 border-red-200', textColor: 'text-red-700', icon: '🔥' },
    { id: 'decide', title: 'Schedule', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', icon: '📅' },
    { id: 'delegate', title: 'Delegate', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700', icon: '👥' },
    { id: 'delete', title: 'Don\'t Do', color: 'bg-gray-50 border-gray-200', textColor: 'text-gray-700', icon: '🗑️' },
] as const;

export default function EisenhowerMatrix() {
    const { tasks, addTask, toggleTask, deleteTask, moveTask } = usePOSStore();
    const [newTaskInput, setNewTaskInput] = useState<{ [key: string]: string }>({});

    const handleAddTask = (quadrant: Task['quadrant']) => {
        if (!newTaskInput[quadrant]?.trim()) return;
        addTask(newTaskInput[quadrant], quadrant);
        setNewTaskInput({ ...newTaskInput, [quadrant]: '' });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[600px]">
            {quadrants.map((q) => (
                <div key={q.id} className={`rounded-2xl border-2 p-4 flex flex-col ${q.color}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${q.textColor}`}>
                            <span>{q.icon}</span> {q.title}
                            <span className="text-xs bg-white/50 px-2 py-1 rounded-full text-black/50">
                                {tasks.filter(t => t.quadrant === q.id && !t.completed).length}
                            </span>
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {tasks.filter(t => t.quadrant === q.id).map((task) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={task.id}
                                    className={`bg-white p-3 rounded-xl shadow-sm flex items-center gap-3 group group-hover:shadow-md transition-all ${task.completed ? 'opacity-50' : ''}`}
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className={`shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>

                                    <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                        {task.title}
                                    </span>

                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                        <select
                                            value={task.quadrant}
                                            onChange={(e) => moveTask(task.id, e.target.value as Task['quadrant'])}
                                            className="text-xs border rounded px-1 py-0.5 bg-gray-50"
                                        >
                                            {quadrants.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.title}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {tasks.filter(t => t.quadrant === q.id).length === 0 && (
                            <div className="text-center py-8 text-black/20 text-sm italic">
                                No tasks yet
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="Add task..."
                            value={newTaskInput[q.id] || ''}
                            onChange={(e) => setNewTaskInput({ ...newTaskInput, [q.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask(q.id as Task['quadrant'])}
                            className="flex-1 px-3 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-black/5 bg-white/50 text-sm placeholder:text-black/30"
                        />
                        <button
                            onClick={() => handleAddTask(q.id as Task['quadrant'])}
                            disabled={!newTaskInput[q.id]?.trim()}
                            className="p-2 bg-white rounded-xl shadow-sm text-black/50 hover:text-green-600 disabled:opacity-50 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
