"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AlchemyEnginePage() {
    return (
        <div className="min-h-screen bg-[#111318] text-white font-sans p-6">

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8 bg-[#1A1D24] p-4 rounded-2xl border border-[#2D303E]">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                        <span className="material-symbols-outlined text-white">science</span>
                    </div>
                    <h1 className="font-bold text-lg">Quantum Content Alchemy Engine</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">notifications</span></button>
                    <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">settings</span></button>
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-white">Dr. Alara K.</p>
                        <p className="text-[10px] text-gray-500">Lead Archivist</p>
                    </div>
                    <div className="size-10 rounded-full overflow-hidden border border-[#2D303E]">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alara" className="w-full h-full" />
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#1A1D24] border border-[#2D303E] p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-400 font-bold uppercase">Total Materials</span>
                        <span className="material-symbols-outlined text-gray-500 text-sm">library_books</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">1,240</p>
                    <p className="text-[10px] text-green-500 flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[10px]">trending_up</span> +12% this week
                    </p>
                </div>
                <div className="bg-[#1A1D24] border border-yellow-500/20 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2"><span className="material-symbols-outlined text-yellow-500 text-lg">auto_awesome</span></div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-yellow-500 font-bold uppercase">AI Enhanced</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">850</p>
                    <p className="text-[10px] text-yellow-600 font-bold">60% of library</p>
                </div>
                <div className="bg-[#1A1D24] border border-[#2D303E] p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-400 font-bold uppercase">In Processing</span>
                        <span className="material-symbols-outlined text-blue-500 text-sm animate-spin">cyclone</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-4">42</p>
                    <div className="w-full h-1 bg-[#2D303E] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-1/3 animate-pulse"></div>
                    </div>
                </div>
                <div className="bg-[#1A1D24] border border-[#2D303E] p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-400 font-bold uppercase">Engagement</span>
                        <span className="material-symbols-outlined text-gray-500 text-sm">groups</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">High</p>
                    <p className="text-[10px] text-gray-500 font-bold">2.4k daily active</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:max-w-xl">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                    <input type="text" placeholder="Search quantum materials, authors, ISBN, or topic tags..."
                        className="w-full bg-[#1A1D24] border border-[#2D303E] rounded-xl pl-12 pr-12 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        <span className="material-symbols-outlined text-sm">tune</span>
                    </button>
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap">All Materials</button>
                    {['Engineering', 'Management', 'Cybersecurity', 'AI & ML', 'Data Science'].map(t => (
                        <button key={t} className="bg-[#1A1D24] border border-[#2D303E] text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors">{t}</button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button className="bg-[#1A1D24] border border-[#2D303E] p-2 rounded-lg text-gray-400 hover:text-white"><span className="material-symbols-outlined">grid_view</span></button>
                    <button className="bg-[#1A1D24] border border-[#2D303E] p-2 rounded-lg text-gray-400 hover:text-white"><span className="material-symbols-outlined">view_list</span></button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-blue-500 text-sm">grid_on</span>
                    <h2 className="font-bold text-white text-sm">Library Resources <span className="text-gray-500 font-normal ml-2">(Showing 12 of 1,240)</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Card 1 */}
                    <div className="bg-[#1A1D24] border border-[#2D303E] rounded-2xl overflow-hidden group hover:border-blue-500 transition-colors">
                        <div className="h-40 bg-gray-800 relative">
                            <div className="text-yellow-400 absolute top-3 right-3 z-10 bg-black/60 backdrop-blur px-2 py-1 rounded-lg border border-yellow-500/30 flex items-center gap-1 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-xs">auto_awesome</span> AI Ready
                            </div>
                            {/* Abstract Net Image */}
                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop)' }}></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500"></div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-blue-400 font-bold uppercase">ENG-402</p>
                                <span className="text-gray-600 text-[10px]">•</span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Engineering</p>
                            </div>
                            <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors">Advanced Neural Networks & Quantum Computing</h3>
                            <p className="text-xs text-gray-500 mb-6">Dr. Sarah Chen • 2024 Edition</p>
                            <div className="flex justify-between items-center">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg w-full mr-2">Study Now</button>
                                <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">bookmark</span></button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#1A1D24] border border-[#2D303E] rounded-2xl overflow-hidden group hover:border-blue-500 transition-colors">
                        <div className="h-40 bg-gray-800 relative">
                            <div className="text-blue-400 absolute top-3 right-3 z-10 bg-black/60 backdrop-blur px-2 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-xs animate-spin">sync</span> Transforming...
                            </div>
                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop)' }}></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 w-1/2 animate-shimmer"></div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-blue-400 font-bold uppercase">MGT-101</p>
                                <span className="text-gray-600 text-[10px]">•</span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Management</p>
                            </div>
                            <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors">Enterprise Project Management</h3>
                            <p className="text-xs text-gray-500 mb-6">James Wilson • Legacy Archive</p>
                            <button className="bg-[#2D303E] text-gray-400 text-xs font-bold px-4 py-2 rounded-lg w-full cursor-not-allowed">Processing...</button>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#1A1D24] border border-[#2D303E] rounded-2xl overflow-hidden group hover:border-blue-500 transition-colors">
                        <div className="h-40 bg-gray-800 relative">
                            <div className="text-gray-400 absolute top-3 right-3 z-10 bg-black/60 backdrop-blur px-2 py-1 rounded-lg border border-gray-600/30 flex items-center gap-1 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-xs">picture_as_pdf</span> Standard PDF
                            </div>
                            <div className="absolute inset-0 bg-cover bg-center opacity-60 grayscale" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop)' }}></div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-blue-400 font-bold uppercase">CS-204</p>
                                <span className="text-gray-600 text-[10px]">•</span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Cybersecurity</p>
                            </div>
                            <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors">Legacy Systems Security Protocols</h3>
                            <p className="text-xs text-gray-500 mb-6">System Admin • Internal Doc</p>
                            <div className="flex justify-between items-center gap-2">
                                <button className="bg-[#2D303E] hover:bg-gray-700 text-white text-xs font-bold px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xs">auto_fix_high</span> Transform
                                </button>
                                <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">download</span></button>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-[#1A1D24] border border-[#2D303E] rounded-2xl overflow-hidden group hover:border-blue-500 transition-colors">
                        <div className="h-40 bg-gray-800 relative">
                            <div className="text-yellow-400 absolute top-3 right-3 z-10 bg-black/60 backdrop-blur px-2 py-1 rounded-lg border border-yellow-500/30 flex items-center gap-1 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-xs">auto_awesome</span> AI Ready
                            </div>
                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop)' }}></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 w-full"></div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-[10px] text-blue-400 font-bold uppercase">DS-301</p>
                                <span className="text-gray-600 text-[10px]">•</span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Data Science</p>
                            </div>
                            <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors">Big Data Analytics in Fintech</h3>
                            <p className="text-xs text-gray-500 mb-6">Robert K. & Team</p>
                            <div className="flex justify-between items-center">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg w-full mr-2">Resume</button>
                                <button className="text-yellow-500"><span className="material-symbols-outlined">bookmark</span></button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="text-center">
                <button className="bg-[#1A1D24] border border-[#2D303E] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto hover:bg-[#252932]">
                    Load More Materials <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
            </div>

        </div>
    );
}
