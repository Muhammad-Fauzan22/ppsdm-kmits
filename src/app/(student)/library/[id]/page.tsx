"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ASSETS } from "@/config/assets";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    Share2,
    Download,
    Plus,
    MessageSquare,
    PlayCircle,
    PauseCircle,
    CheckCircle,
    XCircle,
    BrainCircuit,
    Cpu,
    Zap,
    LayoutGrid,
    Search,
    User,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";

// --- MOCK DATA ---
const FLASHCARDS = [
    { question: "What is a Neural Network?", answer: "A computing system made up of a number of simple, highly interconnected processing elements, which process information by their dynamic state response to external inputs." },
    { question: "Define Machine Learning.", answer: "The study of computer algorithms that improve automatically through experience and by the use of data." },
    { question: "What is Supervised Learning?", answer: "A type of machine learning where the algorithm is trained on a labeled dataset." },
];

const QUIZ_QUESTIONS = [
    {
        question: "Which component is responsible for maintaining the desired state of the cluster?",
        options: ['Kubelet', 'Kube-Controller-Manager', 'Etcd', 'Kube-Proxy'],
        correct: 1
    },
    {
        question: "What does Etcd store?",
        options: ['Log data', 'Cluster configuration and state', 'Container images', 'User metrics'],
        correct: 1
    },
];

export default function ResourceViewerPage({ params }: { params: Promise<{ id: string }> }) {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState("microlearning");
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Flashcards
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Quiz
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Podcast
    const [isPlaying, setIsPlaying] = useState(false);

    // Chat
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: "Hello! I've analyzed this entire book. Ask me to summarize any chapter or explain a difficult concept." }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (isChatOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isChatOpen]);

    // --- HANDLERS ---
    const handleChatSubmit = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && chatInput.trim()) {
            const userMsg = chatInput;
            setChatInput("");
            setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
            setIsChatLoading(true);

            // Mock Response
            setTimeout(() => {
                let aiResponse = "I can explain that concept in detail. Based on Chapter 3, this refers to...";
                setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
                setIsChatLoading(false);
            }, 1000);
        }
    };

    const handleFlashcardNav = (direction: 'next' | 'prev') => {
        setIsFlipped(false);
        setTimeout(() => {
            if (direction === 'next') {
                setCurrentCardIndex((prev) => (prev + 1) % FLASHCARDS.length);
            } else {
                setCurrentCardIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
            }
        }, 200);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white min-h-screen flex flex-col">

            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="px-6 md:px-10 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/library" className="flex items-center gap-3 group">
                            <div className="size-8 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </div>
                            <h2 className="text-[#0b1e42] dark:text-white text-lg font-bold tracking-tight">Library</h2>
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors">Dashboard</Link>
                            <span className="text-primary text-sm font-medium">Resource Viewer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-200 placeholder:text-slate-400" placeholder="Search inside book..." type="text" />
                        </div>
                        <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: `url('${ASSETS.avatar.student}')` }}></div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative w-full bg-gradient-to-br from-[#0b1e42] via-[#0f3575] to-[#135bec] text-white overflow-hidden">
                {/* Abstract Pattern */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03] pointer-events-none translate-x-1/3 -translate-y-1/4">
                    <svg className="w-full h-full fill-white" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,54.5,18.7C51.6,29.4,41.8,38.8,31.4,48.3C21,57.9,10,67.5,-2.5,70.9C-15,74.4,-29,71.6,-41.6,63.1C-54.2,54.6,-65.4,40.3,-70.5,23.6C-75.6,6.9,-74.7,-12.3,-65.5,-26.8C-56.3,-41.3,-38.8,-51.1,-24.3,-58.1C-9.8,-65.1,1.7,-69.3,14.3,-68.8C26.9,-68.4,40.6,-63.3,42.7,-62.9Z" transform="translate(100 100)"></path>
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row gap-10 items-start">
                        {/* Book Cover */}
                        <div className="shrink-0 relative group perspective-1000">
                            <div className="w-48 h-72 md:w-56 md:h-80 bg-white rounded-lg shadow-2xl overflow-hidden transform transition-transform duration-500 hover:rotate-y-12">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFUyyJDDSKJxD2JoGf5XxOdwZyOIQZW0jnSae8qh0TJpE0lb_P8ZdwQ4r2H5xMvvKiUITLrlcb9OASZyoDr_gF4qSVhRanzQWANL4IJHe2k_Y6L7JW5m8wcfdwG_iKEYfZlOzQhESAntt0wFR4eXsBTKu1yleFHjca_MLCTUXwdmP4-QUvTuYho5u0FJoqHwM1gOOE2U_xUPaxF_FYUb6YcW7i-y3eMo1Xx7Uq8Uqco4mN0iD10mHg_oBA1Hp8oIC2VjmoYNzuTyY')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Book Metadata */}
                        <div className="flex-1 flex flex-col justify-center h-full pt-2">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-xs font-semibold backdrop-blur-sm">Computer Science</span>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">verified</span> Verified Resource
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 tracking-tight">Dasar-Dasar Kecerdasan Buatan</h1>
                            <p className="text-blue-100 text-lg md:text-xl font-light mb-6">Prof. Dr. Eng. Agus Zainal <span className="mx-2 opacity-50">•</span> 2024 Edition</p>
                            <p className="text-blue-50/80 max-w-2xl leading-relaxed mb-8">
                                Explore the fundamentals of Artificial Intelligence through our Quantum Alchemy Engine. Transform this static PDF into interactive mind maps, quizzes, and audio lessons instantly.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                                    <span className="material-symbols-outlined">picture_as_pdf</span> Baca PDF Asli
                                </button>
                                <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95">
                                    <span className="material-symbols-outlined">auto_awesome</span> Chat dengan Buku
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Tabs */}
            <div className="sticky top-[73px] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 md:px-10">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'microlearning', label: 'Microlearning', icon: 'flash_on' },
                            { id: 'mindmap', label: 'Mind Map', icon: 'hub' },
                            { id: 'gamification', label: 'Gamification', icon: 'trophy' },
                            { id: 'podcast', label: 'Podcast', icon: 'podcasts' },
                            { id: 'slides', label: 'Slides', icon: 'co_present' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-4 border-b-[3px] transition-all group min-w-max",
                                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                                )}
                            >
                                <span className="material-symbols-outlined">{tab.icon}</span>
                                <span className={cn("text-sm", activeTab === tab.id ? "font-bold" : "font-medium")}>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 w-full flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Main Interaction */}
                    <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'microlearning' && (
                                <motion.div
                                    key="micro"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Key Concepts (Flashcards)</h2>
                                            <p className="text-slate-500 mt-1">Master the core terminology of AI through spaced repetition.</p>
                                        </div>
                                    </div>

                                    {/* Flashcard Component */}
                                    <div className="perspective-1000 w-full h-80 relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                                        <motion.div
                                            className="w-full h-full relative preserve-3d transition-transform duration-700"
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                        >
                                            {/* FRONT */}
                                            <div className="backface-hidden absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-12 text-center">
                                                <div className="mb-6 size-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined text-4xl">psychology</span>
                                                </div>
                                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{FLASHCARDS[currentCardIndex].question}</h3>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Tap to reveal answer</p>
                                            </div>

                                            {/* BACK */}
                                            <div className="backface-hidden rotate-y-180 absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-primary/30 flex flex-col items-center justify-center p-12 text-center">
                                                <div className="mb-6 size-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                                                </div>
                                                <p className="text-xl text-slate-800 dark:text-white font-medium leading-relaxed">"{FLASHCARDS[currentCardIndex].answer}"</p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => handleFlashcardNav('prev')} className="size-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"><ChevronLeft /></button>
                                        <button onClick={() => handleFlashcardNav('next')} className="size-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"><ChevronRight /></button>
                                    </div>

                                </motion.div>
                            )}

                            {activeTab === 'gamification' && (
                                <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                        <div className="p-8">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold">Module Quiz 1</h3>
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Question {currentQuestionIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                                            </div>
                                            <h4 className="text-2xl font-bold mb-8">{QUIZ_QUESTIONS[currentQuestionIndex].question}</h4>
                                            <div className="space-y-3">
                                                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedOption(idx)}
                                                        className={cn(
                                                            "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3",
                                                            selectedOption === idx ? "border-primary bg-blue-50 dark:bg-blue-900/20 text-primary" : "border-slate-100 dark:border-slate-700 hover:border-slate-300"
                                                        )}
                                                    >
                                                        <div className={cn("size-6 rounded-full border-2 flex items-center justify-center", selectedOption === idx ? "border-primary" : "border-slate-300")}>
                                                            {selectedOption === idx && <div className="size-3 bg-primary rounded-full" />}
                                                        </div>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN: Widgets */}
                    <aside className="lg:col-span-4 space-y-6">

                        {/* Podcast Widget */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">headphones</span> Audio Companion
                                </h3>
                            </div>
                            <div className="p-5">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJp5A0n8XCprnlVfZZn4P7Zyi4R3YzKEghbXIAN6qjnpXyio053O_tLbtln3drTXfZEjwY1I-lTYduJ80pRs0EoT6CceLklJeitHbv8DqJJE-qOasHQ5LT1Y-gprzzcQr2C8Xu6hfOuiud-kOo1BvbFNjir9BWsP1UsSQTSouMooW3SeYgWdTRvi1fJkPZZ7DsvIJjjqDDEX4o9Uom_7bMzjhBBSjUh_fhtmcxWj5DjH5s5504sc0KkdPSS0OS35BPeJylNL56NG0')" }}></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">Ep 1: Pengenalan AI</h4>
                                        <p className="text-xs text-slate-500 mb-2">15 mins • Prof. Agus Zainal</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">Playing</span>
                                    </div>
                                </div>
                                {/* Visualizer Mock */}
                                <div className="flex gap-1 h-8 items-center justify-center mb-4 opacity-50">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">replay_10</span></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="size-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform hover:scale-105 active:scale-95">
                                        <span className="material-symbols-outlined text-3xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                                    </button>
                                    <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">forward_10</span></button>
                                </div>
                            </div>
                        </div>

                        {/* Gamification Widget */}
                        <div className="bg-gradient-to-br from-[#135bec] to-[#0b1e42] rounded-2xl text-white shadow-lg relative overflow-hidden p-6">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-8xl">military_tech</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-400">star</span> Your Progress
                                </h3>
                                <p className="text-blue-200 text-sm mb-6">Level 5: Novice Alchemist</p>
                                <div className="flex items-end justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">XP Gained</span>
                                    <span className="text-xl font-bold">1,540 <span className="text-sm font-normal text-blue-300">/ 2,000</span></span>
                                </div>
                                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mb-6">
                                    <div className="bg-yellow-400 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                </div>
                                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
                                    Take Weekly Quiz <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                    </aside>
                </div>
            </div>

            {/* Chat Overlay */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 flex flex-col overflow-hidden"
                    >
                        <div className="bg-primary p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                <span className="font-bold">Book AI Assistant</span>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 rounded-full p-1"><XCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={cn("max-w-[85%] p-3 rounded-xl text-sm", msg.role === 'ai' ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none mr-auto" : "bg-primary text-white rounded-tr-none ml-auto")}>
                                    {msg.text}
                                </div>
                            ))}
                            {isChatLoading && <div className="flex gap-2 p-2"><div className="size-2 bg-slate-400 rounded-full animate-bounce" /><div className="size-2 bg-slate-400 rounded-full animate-bounce delay-75" /><div className="size-2 bg-slate-400 rounded-full animate-bounce delay-150" /></div>}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleChatSubmit}
                                placeholder="Ask a question about this page..."
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating AI Trigger */}
            <button onClick={() => setIsChatOpen(!isChatOpen)} className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-white shadow-xl hover:bg-primary-dark transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 group">
                <span className="material-symbols-outlined">auto_awesome</span>
                <span className="font-bold pr-2 hidden group-hover:inline-block transition-all duration-300">Ask AI</span>
            </button>

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

        </div>
    );
}
