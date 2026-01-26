"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SchemaVisualizer() {
    return (
        <div className="min-h-screen bg-[#090C10] text-[#C9D1D9] font-mono overflow-hidden flex flex-col">

            {/* Toolbar */}
            <div className="h-14 border-b border-[#21262D] flex items-center px-4 bg-[#090C10] relative z-20">
                <div className="flex items-center gap-3 border-r border-[#21262D] pr-4 mr-4">
                    <span className="material-symbols-outlined text-blue-500">schema</span>
                    <span className="font-bold text-sm text-white">PPSDM_KMM_DB_ARCH</span>
                    <div className="size-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-green-500 font-bold uppercase">Live Connection: production-pg-01</span>
                </div>

                <div className="flex-1 flex max-w-sm">
                    <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded px-3 py-1 w-full hover:border-[#8B949E] transition-colors">
                        <span className="material-symbols-outlined text-gray-500 text-sm mr-2">search</span>
                        <input type="text" placeholder="Search tables..." className="bg-transparent text-xs w-full focus:outline-none" />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <div className="flex bg-[#161B22] rounded border border-[#30363D] divide-x divide-[#30363D]">
                        <span className="px-3 py-1 text-xs text-gray-400">Schema: <b className="text-white">public</b></span>
                        <span className="px-3 py-1 text-xs text-gray-400">Version: <b className="text-white">v2.4.1</b></span>
                    </div>
                    <button className="bg-[#1F6FEB] hover:bg-[#1F6FEB]/90 text-white text-xs font-bold px-4 py-1.5 rounded flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">download</span> Export SQL
                    </button>
                </div>
            </div>

            <div className="flex-1 flex">

                {/* Sidebar */}
                <div className="w-64 border-r border-[#21262D] bg-[#0D1117] flex flex-col text-xs overflow-y-auto">
                    {[
                        { cat: "CORE IDENTITY", items: ["users", "auth_identities", "roles"] },
                        { cat: "ASSESSMENT ENGINE", items: ["assessments", "questions", "submissions"] },
                        { cat: "LMS CORE", items: ["resources", "rpi_items", "portfolio_claims", "mentor_sessions"] }
                    ].map((section) => (
                        <div key={section.cat} className="mb-2">
                            <div className="px-4 py-2 font-bold text-gray-500 mt-2">{section.cat}</div>
                            {section.items.map(table => (
                                <div key={table} className="px-4 py-1.5 hover:bg-[#161B22] cursor-pointer flex justify-between group">
                                    <span className="text-[#C9D1D9] group-hover:text-blue-400">{table}</span>
                                    <span className="text-gray-600 text-[10px] group-hover:text-gray-400">
                                        {Math.floor(Math.random() * 200)}k rows
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-[#0D1117] relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#21262D 1px, transparent 1px)', backgroundSize: '20px 20px' }}>

                    {/* Node 1: Users */}
                    <div className="absolute top-20 left-48 w-64 bg-[#161B22] border border-[#30363D] rounded shadow-2xl z-10">
                        <div className="bg-[#24292F] px-3 py-2 border-b border-[#30363D] flex justify-between items-center rounded-t">
                            <div className="flex items-center gap-2 font-bold text-sm text-[#FFD700]">
                                <span className="material-symbols-outlined text-sm">table_chart</span> users
                            </div>
                            <span className="text-[10px] text-blue-400 font-mono">PK: uuid</span>
                        </div>
                        <div className="text-[10px] font-mono p-2 space-y-2">
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-[#FFD700]"><span className="material-symbols-outlined text-[10px]">key</span> id</span> <span className="text-gray-500">uuid</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>email</span> <span className="text-gray-500">varchar(255)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>password_hash</span> <span className="text-gray-500">varchar</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>metadata</span> <span className="text-gray-500">jsonb</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>created_at</span> <span className="text-gray-500">timestamp</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>last_login</span> <span className="text-gray-500">timestamp</span></div>
                        </div>
                    </div>

                    {/* Node 2: Assessments */}
                    <div className="absolute top-20 left-[600px] w-64 bg-[#161B22] border border-[#30363D] rounded shadow-2xl z-10">
                        <div className="bg-[#24292F] px-3 py-2 border-b border-[#30363D] flex justify-between items-center rounded-t">
                            <div className="flex items-center gap-2 font-bold text-sm text-[#A5D6FF]">
                                <span className="material-symbols-outlined text-sm">table_chart</span> assessments
                            </div>
                            <span className="text-[10px] text-blue-400 font-mono">PK: bigserial</span>
                        </div>
                        <div className="text-[10px] font-mono p-2 space-y-2">
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-[#FFD700]"><span className="material-symbols-outlined text-[10px]">key</span> id</span> <span className="text-gray-500">bigserial</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-blue-400"><span className="material-symbols-outlined text-[10px]">vpn_key</span> author_id</span> <span className="text-gray-500">uuid (FK)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>title</span> <span className="text-gray-500">varchar(150)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>passing_score</span> <span className="text-gray-500">integer</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>config</span> <span className="text-gray-500">jsonb</span></div>
                        </div>
                    </div>

                    {/* Node 3: Portfolio Claims */}
                    <div className="absolute top-[500px] left-36 w-64 bg-[#161B22] border border-[#30363D] rounded shadow-2xl z-10">
                        <div className="bg-[#24292F] px-3 py-2 border-b border-[#30363D] flex justify-between items-center rounded-t">
                            <div className="flex items-center gap-2 font-bold text-sm text-[#A5D6FF]">
                                <span className="material-symbols-outlined text-sm">table_chart</span> portfolio_claims
                            </div>
                            <span className="text-[10px] text-blue-400 font-mono">PK: uuid</span>
                        </div>
                        <div className="text-[10px] font-mono p-2 space-y-2">
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-[#FFD700]"><span className="material-symbols-outlined text-[10px]">key</span> id</span> <span className="text-gray-500">uuid</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-blue-400"><span className="material-symbols-outlined text-[10px]">vpn_key</span> claimant_id</span> <span className="text-gray-500">uuid (FK)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>skill_code</span> <span className="text-gray-500">varchar</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>evidence</span> <span className="text-gray-500">text</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>verified_at</span> <span className="text-gray-500">timestamp</span></div>
                        </div>
                    </div>

                    {/* Node 4: RPI Items */}
                    <div className="absolute top-[300px] left-[600px] w-64 bg-[#161B22] border border-[#30363D] rounded shadow-2xl z-10">
                        <div className="bg-[#24292F] px-3 py-2 border-b border-[#30363D] flex justify-between items-center rounded-t">
                            <div className="flex items-center gap-2 font-bold text-sm text-[#A5D6FF]">
                                <span className="material-symbols-outlined text-sm">table_chart</span> rpi_items
                            </div>
                            <span className="text-[10px] text-blue-400 font-mono">PK: bigserial</span>
                        </div>
                        <div className="text-[10px] font-mono p-2 space-y-2">
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-[#FFD700]"><span className="material-symbols-outlined text-[10px]">key</span> id</span> <span className="text-gray-500">bigserial</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-blue-400"><span className="material-symbols-outlined text-[10px]">vpn_key</span> user_id</span> <span className="text-gray-500">uuid (FK)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-blue-400"><span className="material-symbols-outlined text-[10px]">vpn_key</span> resource_id</span> <span className="text-gray-500">uuid (FK)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>status</span> <span className="text-gray-500">enum</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>progress</span> <span className="text-gray-500">float</span></div>
                        </div>
                    </div>

                    {/* Node 5: Mentor Sessions */}
                    <div className="absolute top-[500px] left-[600px] w-64 bg-[#161B22] border border-[#30363D] rounded shadow-2xl z-10">
                        <div className="bg-[#24292F] px-3 py-2 border-b border-[#30363D] flex justify-between items-center rounded-t">
                            <div className="flex items-center gap-2 font-bold text-sm text-[#A5D6FF]">
                                <span className="material-symbols-outlined text-sm">table_chart</span> mentor_sessions
                            </div>
                            <span className="text-[10px] text-blue-400 font-mono">PK: bigserial</span>
                        </div>
                        <div className="text-[10px] font-mono p-2 space-y-2">
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-[#FFD700]"><span className="material-symbols-outlined text-[10px]">key</span> id</span> <span className="text-gray-500">bigserial</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-blue-400"><span className="material-symbols-outlined text-[10px]">vpn_key</span> mentor_id</span> <span className="text-gray-500">uuid (FK)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span className="flex gap-1 text-blue-400"><span className="material-symbols-outlined text-[10px]">vpn_key</span> mentee_id</span> <span className="text-gray-500">uuid (FK)</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>scheduled_at</span> <span className="text-gray-500">timestamp</span></div>
                            <div className="flex justify-between hover:bg-[#21262D] px-1 rounded"><span>notes</span> <span className="text-gray-500">text</span></div>
                        </div>
                    </div>


                    {/* Connectors (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* User -> Assessment */}
                        <path d="M 440 220 L 600 220" stroke="#30363D" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                        {/* User -> RPI Items */}
                        <path d="M 440 250 C 500 250, 500 350, 600 350" stroke="#30363D" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                        {/* User -> Mentor Sessions */}
                        <path d="M 440 300 C 520 300, 520 520, 600 520" stroke="#30363D" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                        {/* User -> Portfolio Claims */}
                        <path d="M 376 380 L 376 500" stroke="#30363D" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#30363D" />
                            </marker>
                        </defs>
                    </svg>


                    {/* SQL Console (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 w-96 bg-[#0D1117] border border-[#30363D] rounded shadow-lg overflow-hidden">
                        <div className="bg-[#161B22] px-3 py-1 flex justify-between items-center text-[10px] font-bold text-[#FFD700]">
                            <span>&lt;&gt; SQL SNIPPET</span>
                        </div>
                        <div className="p-3 font-mono text-xs text-blue-300">
                            <span className="text-purple-400">SELECT</span> <br />
                            &nbsp;&nbsp;u.username, r.title <br />
                            <span className="text-purple-400">FROM</span> <br />
                            &nbsp;&nbsp;<span className="text-green-400">users</span> u <br />
                            <span className="text-purple-400">JOIN</span> <br />
                            &nbsp;&nbsp;<span className="text-green-400">resources</span> r <br />
                            <span className="text-purple-400">ON</span> <br />
                            &nbsp;&nbsp;u.id = r.author_id <br />
                            <span className="text-purple-400">LIMIT 10</span>;
                        </div>
                        <div className="bg-[#161B22] border-t border-[#30363D] px-2 py-1 text-center">
                            <button className="text-[10px] font-bold text-gray-400 hover:text-white w-full">Copy to Clipboard</button>
                        </div>
                    </div>


                    {/* Minimap (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 bg-[#161B22] border border-[#30363D] rounded p-2">
                        <div className="w-32 h-20 bg-[#090C10] relative border border-yellow-500/50">
                            <div className="absolute top-2 left-4 w-6 h-4 bg-[#30363D]"></div>
                            <div className="absolute top-2 right-4 w-6 h-4 bg-[#30363D]"></div>
                            <div className="absolute bottom-2 left-4 w-6 h-4 bg-[#30363D]"></div>
                            <div className="absolute bottom-2 right-4 w-6 h-4 bg-[#30363D]"></div>
                            <div className="absolute inset-2 border border-yellow-500/30"></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <button className="size-6 bg-[#21262D] rounded text-white flex items-center justify-center hover:bg-[#30363D]">-</button>
                            <span className="text-[10px] font-bold text-gray-300">90%</span>
                            <button className="size-6 bg-[#21262D] rounded text-white flex items-center justify-center hover:bg-[#30363D]">+</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
