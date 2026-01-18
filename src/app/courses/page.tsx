"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SAMPLE_COURSES, Course, getRecommendedCourses } from "@/lib/courseManagement";

// Mock scores for recommendations
const mockScores = {
    cognitive: 72,
    self_management: 68,
    financial: 55,
    physical_health: 78,
    emotional_intelligence: 71,
    mental_health: 64,
    character_ethics: 75,
    spiritual: 70,
    environmental: 58,
};

export default function CoursesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'all', name: 'Semua', icon: '📚' },
        { id: 'cognitive', name: 'Cognitive', icon: '🧠' },
        { id: 'financial', name: 'Financial', icon: '💰' },
        { id: 'emotional', name: 'Emotional', icon: '💚' },
        { id: 'mental', name: 'Mental', icon: '🧘' },
        { id: 'character', name: 'Character', icon: '⚔️' },
    ];

    const recommended = getRecommendedCourses(mockScores, 3);

    const filteredCourses = SAMPLE_COURSES.filter(course => {
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const difficultyColors = {
        beginner: 'bg-green-100 text-green-700',
        intermediate: 'bg-yellow-100 text-yellow-700',
        advanced: 'bg-red-100 text-red-700',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                📚 Course Catalog
                            </h1>
                            <p className="text-blue-100 mt-1">Kursus gratis untuk pengembangan holistik</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{SAMPLE_COURSES.length}</div>
                            <div className="text-blue-200 text-sm">Total Courses</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">
                                {SAMPLE_COURSES.reduce((sum, c) => sum + c.modules.length, 0)}
                            </div>
                            <div className="text-blue-200 text-sm">Total Modules</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">FREE</div>
                            <div className="text-blue-200 text-sm">100% Gratis</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Recommended Section */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        ✨ Recommended for You
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {recommended.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden"
                            >
                                <div className="absolute top-2 right-2 bg-white/20 px-2 py-1 rounded text-xs">
                                    Recommended
                                </div>
                                <h3 className="font-bold text-lg mt-4">{course.title}</h3>
                                <p className="text-indigo-100 text-sm mt-2 line-clamp-2">{course.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm">⭐ {course.rating}</span>
                                    <span className="text-sm">🎓 {course.enrollmentCount}+ enrolled</span>
                                </div>
                                <Link
                                    href={`/courses/${course.id}`}
                                    className="block mt-4 bg-white/20 hover:bg-white/30 text-center py-2 rounded-lg transition"
                                >
                                    Start Learning →
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Search & Filter */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Cari kursus..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === cat.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                        <CourseCard key={course.id} course={course} index={index} />
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📭</div>
                        <p>Tidak ada kursus ditemukan</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
    const difficultyColors = {
        beginner: 'bg-green-100 text-green-700',
        intermediate: 'bg-yellow-100 text-yellow-700',
        advanced: 'bg-red-100 text-red-700',
    };

    const categoryIcons: Record<string, string> = {
        cognitive: '🧠',
        financial: '💰',
        emotional: '💚',
        mental: '🧘',
        character: '⚔️',
        spiritual: '🕊️',
        environmental: '🌍',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
        >
            {/* Header */}
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center relative">
                <span className="text-5xl">{categoryIcons[course.category] || '📚'}</span>
                <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${difficultyColors[course.difficulty]}`}>
                        {course.difficulty}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                    {course.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span>⏱️ {course.duration}</span>
                    <span>📖 {course.modules.length} modules</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-gray-400">({course.enrollmentCount})</span>
                    </div>
                    <span className="text-indigo-600 font-bold">+{course.xpReward} XP</span>
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <span>👤</span>
                    <span>{course.instructor}</span>
                </div>

                <Link
                    href={`/courses/${course.id}`}
                    className="block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-lg font-medium transition"
                >
                    {course.certificateEnabled ? '🎓 Start with Certificate' : 'Start Learning'}
                </Link>
            </div>
        </motion.div>
    );
}
