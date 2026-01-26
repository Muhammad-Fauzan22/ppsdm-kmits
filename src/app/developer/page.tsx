"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DeveloperPortalPage() {
    const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>("auth-login");

    const endpoints = [
        {
            id: "auth-login",
            method: "POST",
            path: "/auth/login",
            desc: "Authenticate user and retrieve token",
            body: {
                "email": "developer@ppsdm.kmm.id",
                "password": "********"
            },
            response: {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "expiresIn": 3600,
                "tokenType": "Bearer"
            }
        },
        {
            id: "assessments-get",
            method: "GET",
            path: "/assessments/{id}",
            desc: "Retrieve specific assessment details"
        },
        {
            id: "portfolio-update",
            method: "PUT",
            path: "/portfolio/update",
            desc: "Update user portfolio project data"
        },
        {
            id: "ai-analyze",
            method: "POST",
            path: "/ai/analyze-code",
            desc: "Run static analysis on code snippet"
        },
        {
            id: "transaction-revoke",
            method: "DEL",
            path: "/ledger/transaction/{hash}",
            desc: "Revoke pending transaction"
        }
    ];

    return (
        <div className="flex h-screen bg-[#0E1218] text-gray-300 font-mono overflow-hidden selection:bg-blue-500/30">

            {/* Sidebar Service List */}
            <aside className="w-64 bg-[#161B22] border-r border-[#30363D] flex flex-col">
                <div className="p-6 border-b border-[#30363D] flex items-center gap-3">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-sans font-bold">D</div>
                    <h1 className="text-white font-bold text-sm tracking-tight font-sans">PPSDM API <span className="text-gray-500 block text-[10px] font-normal">v2.4.0 • Production</span></h1>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Core Services</div>
                    <nav className="space-y-1 mb-6">
                        {['Auth & Identity', 'Assessment', 'Learning', 'Portfolio'].map((item, i) => (
                            <button key={item} className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium border-l-2 hover:bg-[#1C2128] transition-colors ${i === 0 ? 'border-blue-500 text-white bg-[#1C2128]' : 'border-transparent text-gray-400'}`}>
                                <span className="material-symbols-outlined text-[16px]">{i === 0 ? 'lock' : i === 1 ? 'check_circle' : i === 2 ? 'school' : 'folder'}</span>
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="px-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Advanced Modules</div>
                    <nav className="space-y-1">
                        {['AI/ML Engine', 'Blockchain Ledger'].map((item, i) => (
                            <button key={item} className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium border-l-2 border-transparent text-gray-400 hover:text-white hover:bg-[#1C2128] transition-colors`}>
                                <span className="material-symbols-outlined text-[16px]">{i === 0 ? 'smart_toy' : 'link'}</span>
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-[#30363D] flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gray-700"></div>
                    <div>
                        <p className="text-white text-xs font-bold">Dev Admin</p>
                        <p className="text-[10px] text-gray-500">admin@ppsdm.kmm.id</p>
                    </div>
                </div>
            </aside>

            {/* Main Console */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-[#0E1218] border-b border-[#30363D] px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-blue-500">home</span>
                        <span className="text-white font-bold text-sm font-sans">PPSDM Developer Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-[#161B22] px-3 py-1.5 rounded-md border border-[#30363D] flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Latency</span>
                            <span className="text-white font-bold text-xs">24ms</span>
                            <span className="text-green-500 text-[10px]">↓2ms</span>
                        </div>
                        <div className="bg-[#161B22] px-3 py-1.5 rounded-md border border-[#30363D] flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Uptime</span>
                            <span className="text-white font-bold text-xs">99.99%</span>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold font-sans transition-colors">Generate Key</button>
                        <span className="material-symbols-outlined text-gray-500">settings</span>
                        <span className="material-symbols-outlined text-gray-500">help</span>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="bg-[#0E1218] px-8 py-6 border-b border-[#30363D]">
                    <h2 className="text-3xl font-bold text-white mb-4 font-sans">API Endpoints Summary</h2>
                    <div className="flex gap-4">
                        <div className="bg-[#161B22] px-4 py-2 rounded border border-[#30363D] text-xs text-gray-500 flex items-center gap-2 font-mono">
                            <span className="text-gray-600">https://api.ppsdm.kmm.id/v1</span>
                            <span className="text-green-500">| Production</span>
                        </div>
                    </div>
                    <div className="mt-6 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined text-[18px]">search</span>
                        <input
                            type="text"
                            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-600"
                            placeholder="Filter endpoints by method, path, or description..."
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <kbd className="bg-[#161B22] border border-[#30363D] rounded px-1.5 py-0.5 text-[10px] text-gray-400">⌘ K</kbd>
                        </div>
                    </div>
                </div>

                {/* Endpoints List */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4">
                    {endpoints.map((ep) => (
                        <div key={ep.id} className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden transition-all hover:border-[#444c56]">
                            {/* Header Row */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1C2128]"
                                onClick={() => setExpandedEndpoint(expandedEndpoint === ep.id ? null : ep.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold w-12 text-center uppercase ${ep.method === 'POST' ? 'bg-green-900/30 text-green-400 border border-green-900/50' :
                                            ep.method === 'GET' ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' :
                                                ep.method === 'PUT' ? 'bg-orange-900/30 text-orange-400 border border-orange-900/50' :
                                                    'bg-red-900/30 text-red-400 border border-red-900/50'
                                        }`}>
                                        {ep.method}
                                    </span>
                                    <span className="text-white font-bold text-sm tracking-wide">{ep.path}</span>
                                    <span className="text-gray-500 text-xs">- {ep.desc}</span>
                                </div>
                                <span className={`material-symbols-outlined text-gray-500 text-[18px] transition-transform ${expandedEndpoint === ep.id ? 'rotate-180' : ''}`}>expand_more</span>
                            </div>

                            {/* Expanded Details */}
                            {expandedEndpoint === ep.id && (
                                <div className="border-t border-[#30363D] p-6 bg-[#0D1117]">
                                    <p className="text-xs text-gray-400 mb-4">Validates user credentials and returns a JWT Bearer token for accessing protected resources.</p>

                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Request */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Request Body</span>
                                                <span className="text-[10px] text-green-500 font-mono">application/json</span>
                                            </div>
                                            {ep.body ? (
                                                <div className="bg-[#161B22] rounded border border-[#30363D] p-4 font-mono text-xs overflow-x-auto">
                                                    <pre className="text-blue-300">
                                                        {JSON.stringify(ep.body, null, 4)
                                                            .replace(/"([^"]+)":/g, '<span class="text-purple-400">"$1"</span>:')
                                                            .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')}
                                                    </pre>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-600 italic">No request body required.</div>
                                            )}
                                        </div>

                                        {/* Response */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase opacity-100">Response (200 OK)</span>
                                                <span className="text-[10px] text-green-500 font-mono">application/json</span>
                                            </div>
                                            {ep.response && (
                                                <div className="bg-[#161B22] rounded border border-[#30363D] p-4 font-mono text-xs overflow-x-auto relative group">
                                                    <pre className="text-blue-300">
                                                        {JSON.stringify(ep.response, null, 4)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded text-xs font-bold font-sans flex items-center gap-2 transition-colors">
                                            <span className="material-symbols-outlined text-[16px]">play_arrow</span> Try It Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
