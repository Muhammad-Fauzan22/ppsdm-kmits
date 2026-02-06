"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
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
    UploadCloud,
    Library
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";
import { getOrCurateVideos } from "@/app/actions/curate-videos";
import VideoGallery from "@/components/library/VideoGallery";
import { useEffect } from "react";

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
    {
        id: "res-6",
        title: "Cybersecurity Fundamentals",
        author: "J. Doe",
        type: "Video",
        match: 65,
        duration: "45m 10s",
        cover: "https://source.unsplash.com/random/800x600?cyber,security",
        summary: "Learn the basics of network security, encryption, and threat analysis.",
        concepts: ["Encryption", "Phishing", "Firewalls"]
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
                // Debounce could be added here, but for now simple check
                try {
                    const videos = await getOrCurateVideos(searchQuery);
                    setRecVideos(videos);
                } catch (e) {
                    console.error("Video fetch error", e);
                }
            }
        };
        const timeoutId = setTimeout(fetchVideos, 1000); // 1s debounce
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const filteredResources = RESOURCES.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === "All" || res.type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-sans overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300">

            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#1a202c] border-b border-[#f0f2f4] dark:border-[#2d3748] px-6 lg:px-12 py-3 shadow-sm">
                <div className="flex items-center justify-between max-w-[1600px] mx-auto">
                    {/* Logo */}
                    <Link href="/library" className="flex items-center gap-3 group">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                            <Library className="w-6 h-6" />
                        </div>
                        <h2 className="text-[#111318] dark:text-white text-lg font-bold tracking-tight">PPSDM KMM <span className="font-normal text-gray-500 dark:text-gray-400">Library</span></h2>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Home</Link>
                        <Link href="/library" className="text-primary text-sm font-semibold bg-primary/10 px-3 py-1.5 rounded-full">Library</Link>
                        <Link href="/library/upload" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors flex items-center gap-2">
                            <span>Upload</span> <UploadCloud className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a202c]"></span>
                        </button>
                        <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full bg-cover bg-center border-2 border-white dark:border-[#2d3748] shadow-sm cursor-pointer" style={{ backgroundImage: `url('${ASSETS.avatar.student}')` }}></div>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full h-[calc(100vh-64px)] overflow-hidden">

                {/* Left Content: Search & Grid */}
                <div className="flex-1 h-full overflow-y-auto px-6 lg:px-10 py-6 lg:pr-6 scrollbar-thin">

                    {/* Hero Search Section */}
                    <div className="max-w-4xl mx-auto mb-10 text-center pt-8">
                        <h1 className="text-[#111318] dark:text-white text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                            Unlock Knowledge with <span className="text-primary">Quantum AI</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Discover personalized resources tailored to your learning path.</p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto group z-20">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <input
                                className="block w-full pl-12 pr-12 py-4 bg-white dark:bg-[#1f2937] border-0 rounded-full text-gray-900 dark:text-white shadow-[0_4px_20px_-4px_rgba(19,91,236,0.15)] ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all text-base"
                                placeholder="What do you want to learn today?"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <button className="bg-primary hover:bg-blue-700 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-primary/30">
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
                                            ? "bg-primary text-white shadow-md transform scale-105"
                                            : "bg-white dark:bg-[#1f2937] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Results</h3>
                        <span className="text-sm text-gray-500">{filteredResources.length} matches found</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                        {filteredResources.map((res) => (
                            <motion.div
                                key={res.id}
                                layoutId={`card-${res.id}`}
                                onClick={() => setSelectedResource(res)}
                                whileHover={{ y: -5 }}
                                className={cn(
                                    "group relative bg-white dark:bg-[#1f2937] rounded-xl overflow-hidden shadow-sm hover:shadow-lg border cursor-pointer transition-all",
                                    selectedResource?.id === res.id
                                        ? "ring-2 ring-primary border-transparent"
                                        : "border-gray-100 dark:border-gray-800"
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
                                            ? "bg-white/90 text-primary border-white/20"
                                            : "bg-gray-900/60 text-white border-white/20"
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
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2">{res.title}</h4>
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
                            className="w-full lg:w-[450px] bg-white dark:bg-[#1a202c] border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-2xl z-30 relative shrink-0"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 relative">
                                <button
                                    onClick={() => setSelectedResource(null)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors lg:hidden"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: `url('${selectedResource.cover}')` }}></div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{selectedResource.type}</span>
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{selectedResource.match}% Match</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{selectedResource.title}</h2>
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Link href={`/library/${selectedResource.id}`} className="flex-1">
                                        <button className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20 active:scale-95">
                                            <PlayCircle className="w-5 h-5" />
                                            Start Learning
                                        </button>
                                    </Link>
                                    <button className="p-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <BookmarkPlus className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
                                <button className="py-4 text-sm font-semibold text-primary border-b-2 border-primary mr-6">Deep Report</button>
                                <button className="py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Mind Map</button>
                                <button className="py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors ml-6">Related</button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                                {/* AI Insight Box */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <p className="text-xs font-bold text-primary uppercase">Quantum AI Analysis</p>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        This resource is a <span className="font-semibold text-gray-900 dark:text-white">highly relevant match</span> for your goal to learn &quot;Neural Networks&quot;. It covers the core Perceptron model which connects directly to your previous module on Linear Algebra.
                                    </p>
                                </div>

                                {/* Content Details */}
                                <div className="prose prose-sm prose-blue dark:prose-invert max-w-none">
                                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-3">Summary</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {selectedResource.summary}
                                    </p>

                                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-3">Key Concepts</h3>
                                    <ul className="space-y-2 mb-6 text-gray-600 dark:text-gray-400 list-none pl-0">
                                        {selectedResource.concepts.map((concept, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                                                <span><strong>{concept}</strong></span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Visual Map Teaser */}
                                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-[#151b26] mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-bold uppercase text-gray-500">Mind Map Preview</h4>
                                            <Share2 className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="h-32 w-full flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center animate-spin-slow"></div>
                                                <div className="absolute w-3 h-3 bg-primary rounded-full top-[30%] left-[60%]"></div>
                                                <div className="absolute w-2 h-2 bg-blue-300 rounded-full bottom-[40%] right-[60%]"></div>
                                                <div className="absolute bg-white dark:bg-[#1a202c] px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 z-10">
                                                    <span className="text-xs font-bold text-primary">Core Node</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-full text-center text-xs text-primary font-medium mt-2 hover:underline">View Full Interactive Map</button>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex justify-between mt-auto">
                                    <span>Updated: Oct 24, 2023</span>
                                    <span>ID: {selectedResource.id.toUpperCase()}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

// Icon wrapper to avoid type errors
const User = (props: any) => <span {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></span>
