"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function TransformationGallery() {

    // Components
    const RadarThumbnail = ({ color }: { color: string }) => {
        const data = [
            { s: 'A', v: Math.random() * 100 },
            { s: 'B', v: Math.random() * 100 },
            { s: 'C', v: Math.random() * 100 },
            { s: 'D', v: Math.random() * 100 },
            { s: 'E', v: Math.random() * 100 },
        ];
        return (
            <div className="w-full relative opacity-80" style={{ height: '96px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#E5E7EB" />
                        <Radar dataKey="v" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.1} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans">

            {/* Navbar (Light) */}
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">school</span>
                    </div>
                    <span className="font-bold tracking-tight text-xl">PPSDM KMM</span>
                </div>
                <div className="flex gap-8 text-sm font-bold text-gray-500">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link href="#" className="text-blue-600">Community</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Impact</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Apply</Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined text-gray-400 absolute left-3 top-2.5">search</span>
                        <input type="text" placeholder="Search profiles" className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 w-64" />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Login
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 py-16">

                <div className="mb-16">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-4">
                        <Link href="/" className="hover:underline">Home</Link> /
                        <Link href="#" className="hover:underline">Community</Link> /
                        <span className="text-gray-900">Stories</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4 text-[#111827]">
                        Student Transformation &<br />Success Gallery
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                        Measuring Real-World Impact: From Baseline to Excellence across 9 Dimensions. Explore the journeys of our diverse community.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-50 p-2 rounded text-blue-600">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Career Readiness</span>
                        </div>
                        <p className="text-5xl font-bold text-gray-900 mb-2">92%</p>
                        <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">trending_up</span> +5% vs Last Year
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-50 p-2 rounded text-blue-600">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Dimensional Growth</span>
                        </div>
                        <p className="text-5xl font-bold text-gray-900 mb-2">40%</p>
                        <p className="text-sm font-medium text-gray-500">Across all 9 metrics</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-50 p-2 rounded text-blue-600">
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alumni Stories</span>
                        </div>
                        <p className="text-5xl font-bold text-gray-900 mb-2">450+</p>
                        <p className="text-sm font-medium text-gray-500">Documented transformations</p>
                    </div>
                </div>

                {/* Transformation Map */}
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 mb-16">
                    <h2 className="text-2xl font-bold mb-12">The Transformation Map</h2>
                    <div className="grid grid-cols-4 gap-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-8 left-[10%] right-[10%] h-1 bg-gray-100 -z-0"></div>

                        {[
                            { title: 'Baseline Assessment', sub: 'Entry Level', icon: 'pause', color: 'bg-gray-400' },
                            { title: 'Dimensional Growth', sub: 'Skill Acquisition', icon: 'hourglass_top', color: 'bg-gray-400' },
                            { title: 'Practical Application', sub: 'Real-world Projects', icon: 'rocket_launch', color: 'bg-blue-600' },
                            { title: 'Excellence Achieved', sub: 'Alumni Status', icon: 'star', color: 'bg-gray-400' },
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center relative z-10">
                                <div className={`size-16 rounded-full border-4 border-white ${step.title.includes('Application') ? 'bg-blue-50 shadow-lg shadow-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400'} flex items-center justify-center mb-4`}>
                                    <span className={`material-symbols-outlined text-2xl ${i === 2 && 'text-blue-600'}`}>{step.icon}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                                <p className="text-xs text-gray-500">{step.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center gap-3 mb-12">
                    <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-blue-200">All Stories</button>
                    {['Entrepreneur', 'Researcher', 'Corporate Leader', 'Social Impact'].map(filter => (
                        <button key={filter} className="bg-white hover:bg-gray-50 text-gray-600 font-bold py-2 px-6 rounded-full border border-gray-200 transition-colors">
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { name: 'Sarah Chen', role: 'AI Ethics Researcher', class: '2023', quote: "This program shifted my perspective from purely technical...", color: '#4F46E5', tags: ['Leadership', 'Tech'] },
                        { name: 'Marcus Johnson', role: 'FinTech Founder', class: '2022', quote: "The mentorship network was invaluable. I found my co-founder...", color: '#2563EB', tags: ['Innovation', 'Strategy'] },
                        { name: 'Elena Rodriguez', role: 'Head of Sustainability', class: '2021', quote: "I learned to balance profit with purpose, a skill crucial for my role...", color: '#7C3AED', tags: ['Resilience', 'Ethics'] },
                    ].map((story, i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-16 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story.name}`} alt={`Avatar of ${story.name}`} className="w-full h-full" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{story.name}</h3>
                                    <p className="text-xs font-bold text-blue-600 mb-0.5">{story.role}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Class of {story.class}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Growth Profile</p>
                                <RadarThumbnail color={story.color} />
                                <div className="flex justify-center gap-4 mt-2">
                                    {story.tags.map(tag => (
                                        <div key={tag} className="flex items-center gap-1">
                                            <div className="size-2 rounded-full" style={{ backgroundColor: story.color }}></div>
                                            <span className="text-[10px] text-gray-500 font-medium">{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 italic mb-8 mt-auto line-clamp-3">"{story.quote}"</p>

                            <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-lg">play_circle</span> Watch Story
                            </button>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-blue-700 rounded-3xl p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>
                    <div className="absolute -left-20 -bottom-20 size-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -right-20 -top-20 size-80 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-black text-white mb-4">Start Your Own Transformation</h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                            Join a community of changemakers. Apply for the upcoming cohort or nominate an outstanding peer.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">Apply Now</button>
                            <button className="bg-blue-800/50 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-800/70 border border-blue-400/30 transition-colors">Submit a Story</button>
                        </div>
                    </div>
                </div>

            </main>

            {/* Footer Micro */}
            <footer className="max-w-7xl mx-auto px-8 py-8 border-t border-gray-200 mt-20 flex justify-between items-center text-xs text-gray-500">
                <p>© 2024 PPSDM KMM. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-gray-900">Privacy Policy</Link>
                    <Link href="#" className="hover:text-gray-900">Terms of Service</Link>
                    <Link href="#" className="hover:text-gray-900">Contact Support</Link>
                </div>
            </footer>
        </div>
    );
}
