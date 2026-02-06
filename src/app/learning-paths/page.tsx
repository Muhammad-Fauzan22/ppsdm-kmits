"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface LearningPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    dimension: string;
    modules: LearningModule[];
    totalDuration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    progress: number;
}

interface LearningModule {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz' | 'exercise';
    duration: string;
    completed: boolean;
    xpReward: number;
}

const learningPaths: LearningPath[] = [
    {
        id: 'cognitive-boost',
        title: 'Boost Your Brain Power',
        description: 'Tingkatkan kemampuan kognitif dengan teknik-teknik terbukti',
        icon: '🧠',
        color: 'from-blue-500 to-indigo-600',
        dimension: 'cognitive',
        totalDuration: '4 jam',
        difficulty: 'beginner',
        progress: 35,
        modules: [
            { id: 'cog-1', title: 'Cara Kerja Otak', type: 'video', duration: '15 min', completed: true, xpReward: 25 },
            { id: 'cog-2', title: 'Teknik Memory Palace', type: 'article', duration: '10 min', completed: true, xpReward: 20 },
            { id: 'cog-3', title: 'Speed Reading Basics', type: 'video', duration: '20 min', completed: false, xpReward: 30 },
            { id: 'cog-4', title: 'Quiz: Cognitive Basics', type: 'quiz', duration: '10 min', completed: false, xpReward: 50 },
            { id: 'cog-5', title: 'Mind Mapping Exercise', type: 'exercise', duration: '30 min', completed: false, xpReward: 40 },
        ],
    },
    {
        id: 'financial-mastery',
        title: 'Financial Mastery for Students',
        description: 'Kuasai keuangan pribadi dari budgeting hingga investasi',
        icon: '💰',
        color: 'from-green-500 to-emerald-600',
        dimension: 'financial',
        totalDuration: '6 jam',
        difficulty: 'beginner',
        progress: 0,
        modules: [
            { id: 'fin-1', title: 'Budgeting 101', type: 'video', duration: '20 min', completed: false, xpReward: 30 },
            { id: 'fin-2', title: 'Tracking Pengeluaran', type: 'exercise', duration: '15 min', completed: false, xpReward: 25 },
            { id: 'fin-3', title: 'Dana Darurat', type: 'article', duration: '10 min', completed: false, xpReward: 20 },
            { id: 'fin-4', title: 'Investasi untuk Pemula', type: 'video', duration: '30 min', completed: false, xpReward: 40 },
            { id: 'fin-5', title: 'Quiz: Financial Literacy', type: 'quiz', duration: '15 min', completed: false, xpReward: 50 },
        ],
    },
    {
        id: 'emotional-eq',
        title: 'Master Your Emotions',
        description: 'Tingkatkan kecerdasan emosional dan hubungan interpersonal',
        icon: '💚',
        color: 'from-pink-500 to-rose-600',
        dimension: 'emotional',
        totalDuration: '5 jam',
        difficulty: 'intermediate',
        progress: 20,
        modules: [
            { id: 'eq-1', title: 'Apa itu EQ?', type: 'video', duration: '15 min', completed: true, xpReward: 25 },
            { id: 'eq-2', title: 'Self-Awareness Exercise', type: 'exercise', duration: '20 min', completed: false, xpReward: 35 },
            { id: 'eq-3', title: 'Empathy Building', type: 'video', duration: '25 min', completed: false, xpReward: 30 },
            { id: 'eq-4', title: 'Conflict Resolution', type: 'article', duration: '15 min', completed: false, xpReward: 25 },
            { id: 'eq-5', title: 'Quiz: EQ Assessment', type: 'quiz', duration: '20 min', completed: false, xpReward: 50 },
        ],
    },
    {
        id: 'mental-wellness',
        title: 'Mental Wellness Journey',
        description: 'Bangun kesehatan mental yang kuat dan resiliensi',
        icon: '🧘',
        color: 'from-purple-500 to-violet-600',
        dimension: 'mental',
        totalDuration: '4 jam',
        difficulty: 'beginner',
        progress: 0,
        modules: [
            { id: 'mh-1', title: 'Mindfulness Basics', type: 'video', duration: '20 min', completed: false, xpReward: 30 },
            { id: 'mh-2', title: 'Breathing Exercise', type: 'exercise', duration: '10 min', completed: false, xpReward: 20 },
            { id: 'mh-3', title: 'Stress Management', type: 'article', duration: '15 min', completed: false, xpReward: 25 },
            { id: 'mh-4', title: 'Sleep Hygiene', type: 'video', duration: '20 min', completed: false, xpReward: 30 },
            { id: 'mh-5', title: 'Daily Meditation Practice', type: 'exercise', duration: '15 min', completed: false, xpReward: 25 },
        ],
    },
    {
        id: 'eco-lifestyle',
        title: 'Sustainable Student Life',
        description: 'Adopsi gaya hidup berkelanjutan dan ramah lingkungan',
        icon: '🌍',
        color: 'from-teal-500 to-cyan-600',
        dimension: 'environmental',
        totalDuration: '3 jam',
        difficulty: 'beginner',
        progress: 0,
        modules: [
            { id: 'eco-1', title: 'Climate Change 101', type: 'video', duration: '20 min', completed: false, xpReward: 30 },
            { id: 'eco-2', title: 'Reduce, Reuse, Recycle', type: 'article', duration: '10 min', completed: false, xpReward: 20 },
            { id: 'eco-3', title: 'Energy Saving Tips', type: 'video', duration: '15 min', completed: false, xpReward: 25 },
            { id: 'eco-4', title: 'Digital Detox Challenge', type: 'exercise', duration: '30 min', completed: false, xpReward: 40 },
            { id: 'eco-5', title: 'Quiz: Eco Awareness', type: 'quiz', duration: '10 min', completed: false, xpReward: 50 },
        ],
    },
    {
        id: 'spiritual-growth',
        title: 'Spiritual Growth Path',
        description: 'Perjalanan menemukan makna dan tujuan hidup',
        icon: '🕊️',
        color: 'from-amber-500 to-orange-600',
        dimension: 'spiritual',
        totalDuration: '4 jam',
        difficulty: 'intermediate',
        progress: 0,
        modules: [
            { id: 'sp-1', title: 'Finding Purpose', type: 'video', duration: '25 min', completed: false, xpReward: 35 },
            { id: 'sp-2', title: 'Gratitude Practice', type: 'exercise', duration: '15 min', completed: false, xpReward: 25 },
            { id: 'sp-3', title: 'Values Clarification', type: 'article', duration: '20 min', completed: false, xpReward: 30 },
            { id: 'sp-4', title: 'Meditation for Meaning', type: 'exercise', duration: '20 min', completed: false, xpReward: 30 },
            { id: 'sp-5', title: 'Quiz: Purpose Discovery', type: 'quiz', duration: '15 min', completed: false, xpReward: 50 },
        ],
    },
];

const typeIcons: Record<string, string> = {
    video: '🎬',
    article: '📄',
    quiz: '❓',
    exercise: '✏️',
};

export default function LearningPathsPage() {
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const [filter, setFilter] = useState<string>('all');

    const filteredPaths = filter === 'all'
        ? learningPaths
        : learningPaths.filter(p => p.dimension === filter);

    const dimensions = [
        { id: 'all', name: 'Semua', icon: '📚' },
        { id: 'cognitive', name: 'Cognitive', icon: '🧠' },
        { id: 'financial', name: 'Financial', icon: '💰' },
        { id: 'emotional', name: 'Emotional', icon: '💚' },
        { id: 'mental', name: 'Mental', icon: '🧘' },
        { id: 'environmental', name: 'Environmental', icon: '🌍' },
        { id: 'spiritual', name: 'Spiritual', icon: '🕊️' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                📚 Learning Paths
                            </h1>
                            <p className="text-blue-100 mt-1">Jalur pembelajaran terstruktur untuk pengembangan diri</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold">{learningPaths.length}</div>
                            <div className="text-blue-200 text-sm">Learning Paths</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold">
                                {learningPaths.reduce((acc, p) => acc + p.modules.length, 0)}
                            </div>
                            <div className="text-blue-200 text-sm">Total Modules</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold">
                                {Math.round(learningPaths.reduce((acc, p) => acc + p.progress, 0) / learningPaths.length)}%
                            </div>
                            <div className="text-blue-200 text-sm">Overall Progress</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Filter */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                    {dimensions.map(dim => (
                        <button
                            key={dim.id}
                            onClick={() => setFilter(dim.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${filter === dim.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span>{dim.icon}</span>
                            <span>{dim.name}</span>
                        </button>
                    ))}
                </div>

                {/* Paths Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPaths.map(path => (
                        <motion.button
                            key={path.id}
                            onClick={() => setSelectedPath(path)}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden text-left hover:shadow-xl transition"
                        >
                            <div className={`h-24 bg-gradient-to-r ${path.color} flex items-center justify-center`}>
                                <span className="text-5xl">{path.icon}</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${path.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                            path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {path.difficulty}
                                    </span>
                                    <span className="text-xs text-gray-500">{path.totalDuration}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">{path.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{path.description}</p>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${path.color}`}
                                            style={{ width: `${path.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{path.progress}%</span>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                    <span>{path.modules.length} modules</span>
                                    <span>•</span>
                                    <span>{path.modules.filter(m => m.completed).length} completed</span>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* AI Tutor Banner */}
                <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="text-6xl">🤖</div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold">Need Personalized Guidance?</h3>
                            <p className="text-indigo-100 mt-1">AI Tutor dapat membantu merekomendasikan learning path berdasarkan hasil assessment-mu!</p>
                        </div>
                        <Link
                            href="/ai-tutor"
                            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition"
                        >
                            Chat with AI Tutor →
                        </Link>
                    </div>
                </div>
            </main>

            {/* Path Detail Modal */}
            {selectedPath && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                    onClick={() => setSelectedPath(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={`h-32 bg-gradient-to-r ${selectedPath.color} flex items-center justify-center`}>
                            <span className="text-6xl">{selectedPath.icon}</span>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800">{selectedPath.title}</h2>
                            <p className="text-gray-600 mt-2">{selectedPath.description}</p>

                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full ${selectedPath.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                        selectedPath.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {selectedPath.difficulty}
                                </span>
                                <span>⏱️ {selectedPath.totalDuration}</span>
                                <span>📚 {selectedPath.modules.length} modules</span>
                            </div>

                            {/* Progress */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress</span>
                                    <span className="font-medium">{selectedPath.progress}%</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${selectedPath.color}`}
                                        style={{ width: `${selectedPath.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Modules */}
                            <h3 className="font-bold text-gray-800 mt-6 mb-4">Modules</h3>
                            <div className="space-y-3">
                                {selectedPath.modules.map((module, index) => (
                                    <div
                                        key={module.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border ${module.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${module.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {module.completed ? '✓' : index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800">{module.title}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                <span>{typeIcons[module.type]}</span>
                                                <span>{module.type}</span>
                                                <span>•</span>
                                                <span>{module.duration}</span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-indigo-600 font-medium">
                                            +{module.xpReward} XP
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setSelectedPath(null)}
                                    className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Tutup
                                </button>
                                <button className={`flex-1 py-3 bg-gradient-to-r ${selectedPath.color} text-white rounded-xl font-medium hover:opacity-90 transition`}>
                                    {selectedPath.progress > 0 ? 'Lanjutkan' : 'Mulai Belajar'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
