"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function AlchemyPage() {
    const [uploads, setUploads] = useState([
        { id: 1, name: "Advanced_Quantum_Mechanics_Vol1.pdf", size: "24.5 MB", status: "uploading", progress: 65 },
        { id: 2, name: "Lab_Safety_Guidelines_2024.pdf", size: "1.2 MB", status: "waiting", progress: 0 },
    ]);

    return (
        <div className="flex h-screen bg-[#F8F9FE] text-slate-900 font-sans overflow-hidden">
            {/* Sidebar (Main Navigation) */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white">
                        <Icon name="FlaskConical" size="sm" />
                    </div>
                    <h1 className="font-bold text-sm tracking-wide">PPSDM KM ITS</h1>
                </div>

                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                        <Icon name="LayoutDashboard" size="sm" className="text-[20px]" /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold transition-colors">
                        <Icon name="CloudUpload" size="sm" className="text-[20px]" /> Library
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                        <Icon name="BarChart2" size="sm" className="text-[20px]" /> Analytics
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                        <Icon name="Settings" size="sm" className="text-[20px]" /> Settings
                    </button>
                </nav>

                <div className="mt-auto flex items-center gap-3 text-sm font-medium">
                    <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Icon name="User" size="sm" />
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-900 text-xs font-bold">Admin User</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Alchemy Upload</h1>
                    <p className="text-slate-500 max-w-2xl">Ingest raw documents into the Quantum Alchemy Engine.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Upload Zone */}
                        <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-3xl h-80 flex flex-col items-center justify-center relative group cursor-pointer hover:bg-blue-50 transition-colors">
                            <div className="size-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                                <Icon name="CloudUpload" className="text-3xl" size="xl" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Drag & drop PDF files here</h3>
                            <p className="text-slate-500 text-sm mb-6">or click to browse</p>
                            <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 transition shadow-sm">
                                Select File
                            </button>
                        </div>

                        {/* Current Uploads */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Current Uploads</h3>
                            <div className="space-y-4">
                                {uploads.map((file) => (
                                    <div key={file.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                                        <div className="size-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                            <Icon name="FileText" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-slate-900 truncate">{file.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <span>{file.size}</span>
                                                <span>•</span>
                                                <span className={file.status === 'uploading' ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                                                    {file.status === 'uploading' ? 'Uploading...' : 'Waiting in queue'}
                                                </span>
                                            </div>
                                            {file.status === 'uploading' && (
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${file.progress}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                        <button className="text-slate-400 hover:text-red-500">
                                            <Icon name={file.status === 'uploading' ? 'X' : 'Trash2'} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Pipeline Visualizer */}
                    <aside className="bg-white border-l border-slate-200 shadow-xl flex flex-col h-full -my-8 -mr-8 p-8 w-[400px]">
                        <div className="flex items-center gap-3 mb-8">
                            <Icon name="Waypoints" className="text-blue-600 text-2xl" size="lg" />
                            <h2 className="text-xl font-bold text-blue-900">Quantum Pipeline</h2>
                        </div>
                        <p className="text-sm text-slate-500 mb-8">Real-time processing status of your content.</p>

                        <div className="flex-1 space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100 z-0"></div>

                            {[
                                { id: 1, title: 'Upload', desc: 'Securely transferring to cloud storage.', status: 'completed' },
                                { id: 2, title: 'Extraction', desc: 'Parsing text and images from PDF.', status: 'processing' },
                                { id: 3, title: 'Analysis', desc: 'AI analyzing context and key concepts.', status: 'waiting' },
                                { id: 4, title: 'Generation', desc: 'Creating quizzes and summaries.', status: 'waiting' }
                            ].map((step) => (
                                <div key={step.id} className="relative z-10 flex gap-4">
                                    <div className={`size-12 rounded-full border-4 flex items-center justify-center bg-white shrink-0 ${step.status === 'completed' ? 'border-blue-600 text-blue-600' :
                                        step.status === 'processing' ? 'border-blue-200 text-blue-600 animate-pulse' :
                                            'border-slate-100 text-slate-300'
                                        }`}>
                                        {step.status === 'completed' ? <Icon name="Check" /> :
                                            step.status === 'processing' ? <Icon name="RefreshCw" className="animate-spin" /> :
                                                <span className="font-bold text-sm">{step.id}</span>}
                                    </div>
                                    <div className="pt-1">
                                        <h4 className={`font-bold text-sm ${step.status === 'waiting' ? 'text-slate-400' : 'text-slate-900'}`}>{step.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mt-1">{step.desc}</p>

                                        {step.status === 'processing' && (
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">
                                                <span className="size-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                                                Processing...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mascot Banner */}
                        <div className="bg-slate-50 rounded-2xl p-4 flex gap-4 mt-auto border border-slate-100">
                            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center shrink-0 border border-green-200">
                                <Icon name="Bot" className="text-green-600 text-2xl" size="lg" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-900 mb-1">Maskot Seno says:</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Hi! I'm Seno. I'll notify you once the magic is done. This usually takes about 2 minutes. Sit tight! 🚀
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 py-3 border border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-50 text-sm">Save Draft</button>
                            <button className="flex-1 py-3 bg-blue-600 font-bold text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 text-sm flex items-center justify-center gap-2">
                                <Icon name="Play" className="text-[18px]" size="sm" /> Start Processing
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
