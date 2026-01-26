"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LibraryPage() {
    const [selectedResource, setSelectedResource] = useState<any>(null);

    const resources = [
        {
            id: 1,
            title: "Introduction to Neural Networks",
            type: "Video Module",
            author: "Prof. A. Wijaya",
            duration: "15m 20s",
            match: 98,
            image: "https://thumbs.dreamstime.com/b/neural-network-concept-connected-cells-background-blue-glowing-neurones-33519396.jpg", // Placeholder
            category: "Deep Learning"
        },
        {
            id: 2,
            title: "Strategic Management in Digital Age",
            type: "Article",
            author: "HBR Archive",
            duration: "8 min read",
            match: 85,
            image: "https://thumbs.dreamstime.com/b/small-plant-growing-dry-soil-watering-can-39296645.jpg",
            category: "Business"
        },
        {
            id: 3,
            title: "Quantum Computing for Beginners",
            type: "Book",
            author: "MIT Press",
            duration: "210 pages",
            match: 92,
            image: "https://thumbs.dreamstime.com/b/abstract-network-background-15949168.jpg",
            category: "Technology"
        },
        {
            id: 4,
            title: "Advanced Data Science Workflows",
            type: "Course",
            author: "Dr. S. Lee",
            duration: "12 Modules",
            match: 78,
            image: "https://thumbs.dreamstime.com/b/business-man-using-tablet-computer-analyzing-financial-data-dashboard-screen-virtual-augmented-reality-interface-311497914.jpg",
            category: "Data Science"
        }
    ];

    return (
        <div className="flex h-screen bg-[#FAFAFA] text-slate-900 font-sans overflow-hidden">

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-md">local_library</span>
                        </div>
                        <h1 className="font-bold text-lg">PPSDM KMM <span className="text-slate-400 font-normal">Library</span></h1>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                        <Link href="#" className="text-slate-900">Home</Link>
                        <Link href="#" className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Library</Link>
                        <Link href="#" className="hover:text-slate-900">My Progress</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-slate-400 hover:text-blue-600"><span className="material-symbols-outlined">notifications</span></button>
                        <div className="size-8 rounded-full bg-orange-200 border border-orange-300"></div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Hero Search */}
                    <div className="max-w-4xl mx-auto text-center mb-12 mt-8">
                        <h2 className="text-3xl font-bold mb-2">Unlock Knowledge with <span className="text-blue-600">Quantum AI</span></h2>
                        <p className="text-slate-500 mb-8">Discover personalized resources tailored to your learning path.</p>

                        <div className="relative shadow-xl shadow-blue-200/50 rounded-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                                <span className="material-symbols-outlined text-xl">auto_fix_high</span>
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-14 py-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                placeholder="Introduction to Neural Networks"
                                defaultValue="Introduction to Neural Networks"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white size-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>

                        <div className="flex gap-2 justify-center mt-6">
                            {['Video', 'Article', 'Course', 'Book'].map((filter, i) => (
                                <button key={filter} className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${i === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                    <span className="material-symbols-outlined text-[16px] align-middle mr-1.5 inline-block">
                                        {filter === 'Video' ? 'play_circle' : filter === 'Article' ? 'article' : filter === 'Course' ? 'school' : 'book'}
                                    </span>
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Top Results</h3>
                            <span className="text-xs text-slate-400">1,203 matches found in 0.4s</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {resources.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => setSelectedResource(res)}
                                    className={`bg-white rounded-xl border ${selectedResource?.id === res.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300'} overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-md group`}
                                >
                                    <div className="h-32 bg-slate-100 relative overflow-hidden">
                                        {/* Placeholder Image */}
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${res.image})` }} />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>

                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                            <span className="material-symbols-outlined text-blue-600 text-[12px]">smart_toy</span>
                                            <span className="text-[10px] font-bold text-blue-900">{res.match}% Match</span>
                                        </div>

                                        <div className="absolute bottom-2 left-2 text-white flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider drop-shadow-md">
                                            <span className="material-symbols-outlined text-[14px]">play_circle</span>
                                            {res.type}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{res.title}</h4>
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {res.author}</span>
                                            <span>{res.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Detail Sidebar */}
            <aside className="w-96 bg-white border-l border-slate-200 shadow-xl flex flex-col z-10 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Video</span>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">98% Match</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Introduction to Neural Networks</h2>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                            <span className="material-symbols-outlined text-[18px]">play_arrow</span> Start Learning
                        </button>
                        <button className="size-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                            <span className="material-symbols-outlined">bookmark</span>
                        </button>
                        <button className="size-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex gap-4 border-b border-slate-100 pb-1 mb-4 text-sm font-medium">
                        <button className="text-blue-600 border-b-2 border-blue-600 pb-2">Deep Report</button>
                        <button className="text-slate-400 hover:text-slate-900 pb-2">Mind Map</button>
                        <button className="text-slate-400 hover:text-slate-900 pb-2">Related</button>
                    </div>

                    {/* Quantum Analysis Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-blue-600">auto_awesome</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-blue-600 text-sm">auto_awesome</span>
                            <span className="text-[10px] font-bold text-blue-700 uppercase">Quantum AI Analysis</span>
                        </div>
                        <p className="text-xs text-blue-900 leading-relaxed relative z-10">
                            This resource is a <span className="font-bold">highly relevant match</span> for your goal to learn "Neural Networks". It covers the core Perceptron model which connects directly to your previous module on Linear Algebra.
                        </p>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-3">Summary</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        Neural networks are a set of algorithms, modeled loosely after the human brain, that are designed to recognize patterns. They interpret sensory data through a kind of machine perception, labeling or clustering raw input.
                    </p>

                    <h3 className="font-bold text-slate-900 text-sm mb-3">Key Concepts</h3>
                    <ul className="space-y-3 mb-8">
                        <li className="flex gap-2 items-start text-xs text-slate-600">
                            <span className="material-symbols-outlined text-blue-500 text-[16px] shrink-0">check_circle</span>
                            <span><span className="font-bold text-slate-800">Perceptrons:</span> The fundamental building blocks of neural networks.</span>
                        </li>
                        <li className="flex gap-2 items-start text-xs text-slate-600">
                            <span className="material-symbols-outlined text-blue-500 text-[16px] shrink-0">check_circle</span>
                            <span><span className="font-bold text-slate-800">Activation Functions:</span> How the network decides what information matters (Sigmoid, ReLU).</span>
                        </li>
                        <li className="flex gap-2 items-start text-xs text-slate-600">
                            <span className="material-symbols-outlined text-blue-500 text-[16px] shrink-0">check_circle</span>
                            <span><span className="font-bold text-slate-800">Backpropagation:</span> The method used to fine-tune the weights of a neural net.</span>
                        </li>
                    </ul>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mind Map Preview</p>
                        {/* Mini Visual */}
                        <div className="size-24 rounded-full border-2 border-dashed border-blue-200 flex items-center justify-center relative mb-4">
                            <span className="size-4 bg-blue-500 rounded-full animate-pulse"></span>
                            <div className="absolute top-0 right-0 size-2 bg-green-400 rounded-full"></div>
                            <div className="absolute bottom-2 left-2 size-2 bg-purple-400 rounded-full"></div>
                            <div className="bg-white px-2 py-0.5 rounded text-[8px] font-bold text-blue-600 border border-blue-100 absolute">Core Node</div>
                        </div>
                        <button className="text-blue-600 text-xs font-bold hover:underline">View Full Interactive Map</button>
                    </div>
                </div>

                <div className="p-3 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Updated: Oct 24, 2023</span>
                    <span>ID: RES-8922</span>
                </div>
            </aside>

        </div>
    );
}
