"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    PlayCircle,
    FileText,
    GraduationCap,
    BookOpen,
    Bot,
    Sparkles,
    CheckCircle,
    Share2,
    BookmarkPlus,
    X,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";
import { getOrCurateVideos } from "@/app/actions/curate-videos";
import VideoGallery from "@/components/library/VideoGallery";

// --- MOCK DATA ---
const RESOURCES = [
    {
        id: "res-1",
        title: "Introduction to Neural Networks",
        author: "Prof. A. Wijaya",
        type: "Video",
        match: 98,
        duration: "15m 20s",
        cover: "https://source.unsplash.com/random/800x600?neural,network",
        summary: "Neural networks are a set of algorithms, modeled loosely after the human brain, that are designed to recognize patterns. They interpret sensory data through a kind of machine perception, labeling or clustering raw input.",
        concepts: ["Perceptrons", "Activation Functions", "Backpropagation"]
    },
    {
        id: "enterprise-cloud-architecture",
        title: "Enterprise Cloud Architecture v2",
        author: "J. Doe",
        type: "Course",
        match: 95,
        duration: "4h 30m",
        cover: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop",
        summary: "Comprehensive guide to Kubernetes orchestration and scalable infrastructure.",
        concepts: ["Kubernetes", "Cloud Native", "Scalability"]
    },
    {
        id: "res-2",
        title: "Strategic Management in the Digital Age",
        author: "HBR Archive",
        type: "Article",
        match: 85,
        duration: "8 min read",
        cover: "https://source.unsplash.com/random/800x600?business,strategy",
        summary: "An in-depth look at how digital transformation is reshaping strategic planning in modern corporations.",
        concepts: ["Digital Transformation", "Agile Strategy", "Disruption"]
    },
    {
        id: "res-3",
        title: "Quantum Computing for Beginners",
        author: "MIT Press",
        type: "Book",
        match: 92,
        duration: "210 pages",
        cover: "https://source.unsplash.com/random/800x600?quantum,computing",
        summary: "A comprehensive guide to the principles of quantum mechanics and how they apply to computing.",
        concepts: ["Qubits", "Superposition", "Entanglement"]
    },
    {
        id: "res-4",
        title: "Advanced Data Science Workflows",
        author: "Dr. S. Lee",
        type: "Course",
        match: 78,
        duration: "12 Modules",
        cover: "https://source.unsplash.com/random/800x600?data,science",
        summary: "Master the art of building scalable data pipelines and deploying machine learning models.",
        concepts: ["ETL Pipelines", "Model Serving", "A/B Testing"]
    },
    {
        id: "res-5",
        title: "Machine Learning Ops (MLOps)",
        author: "TechCrunch",
        type: "Article",
        match: 74,
        duration: "5 min read",
        cover: "https://source.unsplash.com/random/800x600?code,screen",
        summary: "Best practices for maintaining and monitoring ML models in production environments.",
        concepts: ["CI/CD for ML", "Model Monitoring", "Drift Detection"]
    },
];

export default function LibraryPage() {
    const [selectedResource, setSelectedResource] = useState<typeof RESOURCES[0] | null>(null);
    const [searchQuery, setSearchQuery] = useState("Introduction to Neural Networks");
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [recVideos, setRecVideos] = useState<any[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            if (searchQuery.length > 3) {
                try {
                    const videos = await getOrCurateVideos(searchQuery);
                    setRecVideos(videos);
                } catch (e) {
                    console.error("Video fetch error", e);
                }
            }
        };
        const timeoutId = setTimeout(fetchVideos, 1000);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const filteredResources = RESOURCES.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === "All" || res.type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* Left Content: Search & Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">

                {/* Hero Search Section */}
                <div className="max-w-4xl mx-auto mb-10 text-center pt-4">
                    <h1 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                        Unlock Knowledge with <span className="text-cyan-600 dark:text-cyan-400">Quantum AI</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Discover personalized resources tailored to your learning path.</p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto group z-20">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Bot className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <input
                            className="block w-full pl-12 pr-12 py-4 bg-white dark:bg-[#1f2937] border-0 rounded-full text-slate-900 dark:text-white shadow-[0_4px_20px_-4px_rgba(19,91,236,0.15)] ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all text-base"
                            placeholder="What do you want to learn today?"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <button className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        {['All', 'Video', 'Article', 'Course', 'Book'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    selectedFilter === filter
                                        ? "bg-cyan-600 text-white shadow-md transform scale-105"
                                        : "bg-white dark:bg-[#1f2937] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                )}
                            >
                                {filter === 'Video' && <PlayCircle className="w-4 h-4" />}
                                {filter === 'Article' && <FileText className="w-4 h-4" />}
                                {filter === 'Course' && <GraduationCap className="w-4 h-4" />}
                                {filter === 'Book' && <BookOpen className="w-4 h-4" />}
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Hunter Gallery */}
                <div className="mb-12">
                    {recVideos.length > 0 && (
                        <div className="animate-fade-in">
                            <VideoGallery videos={recVideos} title={`Video Hunter: ${searchQuery}`} />
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Top Results</h3>
                    <span className="text-sm text-slate-500">{filteredResources.length} matches found</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResources.map((res) => (
                        <motion.div
                            key={res.id}
                            layoutId={`card-${res.id}`}
                            onClick={() => setSelectedResource(res)}
                            whileHover={{ y: -5 }}
                            className={cn(
                                "group relative bg-white dark:bg-[#1f2937] rounded-xl overflow-hidden shadow-sm hover:shadow-lg border cursor-pointer transition-all",
                                selectedResource?.id === res.id
                                    ? "ring-2 ring-cyan-500 border-transparent"
                                    : "border-slate-100 dark:border-slate-800"
                            )}
                        >
                            <div className="aspect-video w-full relative overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${res.cover}')` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>

                                <span className={cn(
                                    "absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-md border",
                                    res.match > 90
                                        ? "bg-white/90 text-cyan-600 border-white/20"
                                        : "bg-slate-900/60 text-white border-white/20"
                                )}>
                                    <Bot className="w-3 h-3" /> {res.match}% Match
                                </span>

                                <div className="absolute bottom-3 left-3 text-white">
                                    <div className="flex items-center gap-1.5 mb-1 opacity-90">
                                        {res.type === 'Video' && <PlayCircle className="w-4 h-4" />}
                                        {res.type === 'Article' && <FileText className="w-4 h-4" />}
                                        {res.type === 'Book' && <BookOpen className="w-4 h-4" />}
                                        <span className="text-xs font-medium uppercase tracking-wider">{res.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2">{res.title}</h4>
                                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1 truncate max-w-[60%]"><User className="w-3 h-3" /> {res.author}</span>
                                    <span className="shrink-0">{res.duration}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Detail Drawer */}
            <AnimatePresence mode="wait">
                {selectedResource && (
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 lg:static lg:h-[calc(100vh-100px)] w-full lg:w-[400px] bg-white dark:bg-[#1a202c] border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl z-40 lg:rounded-2xl lg:mb-6 lg:mr-6"
                    >
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 relative">
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors lg:hidden"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: `url('${selectedResource.cover}')` }}></div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{selectedResource.type}</span>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{selectedResource.match}% Match</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{selectedResource.title}</h2>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Link href={`/dashboard/library/${selectedResource.id}`} className="flex-1">
                                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20 active:scale-95">
                                        <PlayCircle className="w-5 h-5" />
                                        Start Learning
                                    </button>
                                </Link>
                                <button className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <BookmarkPlus className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
                            <button className="py-4 text-sm font-semibold text-cyan-600 border-b-2 border-cyan-600 mr-6">Deep Report</button>
                            <button className="py-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Mind Map</button>
                            <button className="py-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors ml-6">Related</button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                            {/* AI Insight Box */}
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800/30 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                    <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">Quantum AI Analysis</p>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    This resource is a <span className="font-semibold text-slate-900 dark:text-white">highly relevant match</span> for your goal to learn &quot;Neural Networks&quot;. It covers the core Perceptron model which connects directly to your previous module on Linear Algebra.
                                </p>
                            </div>

                            {/* Content Details */}
                            <div className="prose prose-sm prose-blue dark:prose-invert max-w-none">
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-3">Summary</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    {selectedResource.summary}
                                </p>

                                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-3">Key Concepts</h3>
                                <ul className="space-y-2 mb-6 text-slate-600 dark:text-slate-400 list-none pl-0">
                                    {selectedResource.concepts.map((concept, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                                            <span><strong>{concept}</strong></span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Visual Map Teaser */}
                                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-[#151b26] mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold uppercase text-slate-500">Mind Map Preview</h4>
                                        <Share2 className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="h-32 w-full flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center animate-spin-slow"></div>
                                            <div className="absolute w-3 h-3 bg-cyan-600 rounded-full top-[30%] left-[60%]"></div>
                                            <div className="absolute w-2 h-2 bg-blue-300 rounded-full bottom-[40%] right-[60%]"></div>
                                            <div className="absolute bg-white dark:bg-[#1a202c] px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 z-10">
                                                <span className="text-xs font-bold text-cyan-600">Core Node</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full text-center text-xs text-cyan-600 font-medium mt-2 hover:underline">View Full Interactive Map</button>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex justify-between mt-auto">
                                <span>Updated: Oct 24, 2023</span>
                                <span>ID: {selectedResource.id.toUpperCase()}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
