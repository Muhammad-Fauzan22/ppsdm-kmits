"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartLibraryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Leadership', 'Technology', 'Communication', 'Ethics', 'Innovation'];

    const resources = [
        {
            id: 1,
            title: "The Art of Strategic Leadership",
            type: "Video Course",
            duration: "45 min",
            category: "Leadership",
            image: "bg-blue-600",
            icon: "play_circle"
        },
        {
            id: 2,
            title: "Introduction to Generative AI",
            type: "Article",
            duration: "10 min read",
            category: "Technology",
            image: "bg-purple-600",
            icon: "article"
        },
        {
            id: 3,
            title: "Public Speaking Masterclass",
            type: "Workshop",
            duration: "2 hours",
            category: "Communication",
            image: "bg-orange-500",
            icon: "mic"
        },
        {
            id: 4,
            title: "Engineering Ethics Case Studies",
            type: "Case Study",
            duration: "30 min",
            category: "Ethics",
            image: "bg-emerald-600",
            icon: "gavel"
        },
        {
            id: 5,
            title: "Design Thinking for Innovation",
            type: "Interactive",
            duration: "1 hour",
            category: "Innovation",
            image: "bg-pink-600",
            icon: "lightbulb"
        },
        {
            id: 6,
            title: "Project Management 101",
            type: "Course",
            duration: "3 hours",
            category: "Leadership",
            image: "bg-indigo-600",
            icon: "school"
        },
    ];

    const filteredResources = selectedCategory === 'All'
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    return (
        <div className="space-y-8 min-h-screen pb-20">
            {/* AI Search Header */}
            <div className="relative bg-its-dark rounded-3xl p-8 md:p-12 overflow-hidden text-center text-white shadow-2xl">
                <div className="absolute inset-0 bg-[url('/patterns/its-key-graphic.svg')] opacity-20 bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-its-dark via-transparent to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20 mb-6">
                        <span className="material-symbols-outlined text-sm text-cyan-400">auto_awesome</span>
                        <span className="text-xs font-bold tracking-wider uppercase">AI Semantic Search</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold font-serif mb-6">What do you want to learn today?</h1>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 transition-all group-focus-within:bg-white/20 group-focus-within:scale-[1.02]">
                            <span className="material-symbols-outlined text-2xl text-white/70 ml-3">search</span>
                            <input
                                type="text"
                                placeholder="Try 'How to lead a team' or 'Python for beginners'..."
                                className="w-full bg-transparent border-none text-white placeholder-white/50 focus:ring-0 px-4 py-2 text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-white text-its-dark px-6 py-2 rounded-xl font-bold hover:bg-cyan-50 transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat, idx) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-its-blue text-white shadow-lg shadow-its-blue/30 scale-105'
                                : 'bg-white dark:bg-card-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-its-blue hover:text-its-blue'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Resources Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredResources.map((resource) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={resource.id}
                            className="group bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-its-blue/50 transition-all cursor-pointer"
                        >
                            <div className={`h-40 ${resource.image} relative p-6 flex flex-col justify-between`}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <div className="relative z-10 flex justify-between items-start">
                                    <span className="bg-black/30 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10">
                                        {resource.category}
                                    </span>
                                    <button className="size-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white text-white hover:text-its-dark transition-all">
                                        <span className="material-symbols-outlined text-sm">bookmark</span>
                                    </button>
                                </div>
                                <div className="relative z-10">
                                    <div className="size-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-white mb-2">
                                        <span className="material-symbols-outlined">{resource.icon}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-its-blue transition-colors">
                                    {resource.title}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        {resource.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">category</span>
                                        {resource.type}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
