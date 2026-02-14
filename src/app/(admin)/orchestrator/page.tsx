"use client";

import React from 'react';
import { Icon } from "@/components/ui/Icon";

export default function OrchestratorPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-white font-[family-name:var(--font-inter)] overflow-hidden h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-[#282e39] bg-[#111318] px-6 py-3 z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-white">
                        <div className="size-8 flex items-center justify-center bg-[#135bec] rounded-lg text-white">
                            <Icon name="Waypoints" className="text-[20px]" />
                        </div>
                        <div>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM Orchestrator</h2>
                            <p className="text-[10px] text-[#9da6b9] font-mono tracking-wider">ADMIN CONSOLE v2.4</p>
                        </div>
                    </div>
                    <label className="flex flex-col min-w-40 !h-10 w-96 hidden md:flex">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-[#282e39] bg-[#1c1f27] overflow-hidden group focus-within:border-[#135bec]/50 transition-colors">
                            <div className="text-[#9da6b9] flex items-center justify-center pl-3">
                                <Icon name="Search" className="text-[20px]" />
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-[#9da6b9] px-3 text-sm font-normal leading-normal" placeholder="Search pipelines, models, or logs..." defaultValue="" />
                            <div className="flex items-center pr-2">
                                <kbd className="hidden sm:inline-block rounded border border-[#282e39] bg-[#111318] px-1.5 text-[10px] font-bold text-[#9da6b9] font-mono">⌘K</kbd>
                            </div>
                        </div>
                    </label>
                </div>
                <div className="flex flex-1 justify-end gap-6">
                    <div className="flex items-center gap-6 hidden lg:flex">
                        <a className="text-white text-sm font-medium hover:text-[#135bec] transition-colors" href="#">Orchestrator</a>
                        <a className="text-[#9da6b9] text-sm font-medium hover:text-white transition-colors" href="#">Monitoring</a>
                        <a className="text-[#9da6b9] text-sm font-medium hover:text-white transition-colors" href="#">Settings</a>
                    </div>
                    <div className="h-6 w-px bg-[#282e39] mx-2 hidden lg:block"></div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-[#9da6b9] hover:text-white transition-colors">
                            <Icon name="Bell" />
                            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-[#111318]"></span>
                        </button>
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-[#282e39]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwbSresrPhRksuL7dTtVRS-wuA8bvzOMexhWAq0yQQqSrVQ-NlzoTNdpeNZzrrdnPI-B9nq_v8nHDPWf9m9EC2D7HwosHD1Wtc2tib7kq4RPPSVQT-FiDfD-6uO8p4trECaYTnXqL7VgEUJODKGXW5lmIAVgTbEuzLT_k-qeEyHUX2AFiQRhjiY9JNJa2FyQieGm3uT8ue81M5mGPLiPA8e6eUHRSEnlU7srmRIIwLX1N5FhBnFQgRqqjlmTx6mr9cyXd43t_tGBc")' }}></div>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: AI Model Management */}
                <aside className="w-64 flex-none flex flex-col border-r border-[#282e39] bg-[#111318] z-10 overflow-y-auto">
                    <div className="p-4 border-b border-[#282e39]">
                        <h3 className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-4">AI Model Management</h3>
                        <div className="space-y-3">
                            {/* Active Model Card */}
                            <div className="group p-3 rounded-lg bg-[#1c1f27] border border-[#282e39] hover:border-[#135bec]/50 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <Icon name="Brain" className="text-[#135bec]" />
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                </div>
                                <h4 className="text-sm font-semibold text-white">PPSDM-NLP-v2</h4>
                                <p className="text-xs text-[#9da6b9] mt-1 font-mono">v.2.4 • Serving</p>
                            </div>
                            {/* Idle Model Card */}
                            <div className="group p-3 rounded-lg bg-[#111318] border border-[#282e39] hover:border-[#9da6b9] transition-all cursor-pointer opacity-70 hover:opacity-100">
                                <div className="flex justify-between items-start mb-2">
                                    <Icon name="Bot" className="text-[#9da6b9] group-hover:text-white" />
                                    <span className="flex h-2 w-2 rounded-full bg-yellow-500"></span>
                                </div>
                                <h4 className="text-sm font-medium text-white">Llama-2-70b-Chat</h4>
                                <p className="text-xs text-[#9da6b9] mt-1 font-mono">v.1.0 • Idle</p>
                            </div>
                            {/* Training Model Card */}
                            <div className="group p-3 rounded-lg bg-[#111318] border border-[#282e39] hover:border-[#9da6b9] transition-all cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#135bec]/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <Icon name="BrainCircuit" className="text-blue-400" />
                                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                </div>
                                <h4 className="text-sm font-medium text-white">Custom-BERT-L</h4>
                                <p className="text-xs text-[#9da6b9] mt-1 font-mono">Epoch 4/10 • Training</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex-1">
                        <h3 className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-3">Tuning Controls</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#9da6b9]">Temperature</span>
                                    <span className="text-white font-mono">0.7</span>
                                </div>
                                <input className="w-full h-1 bg-[#282e39] rounded-lg appearance-none cursor-pointer accent-[#135bec]" max="1" min="0" step="0.1" type="range" defaultValue="0.7" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#9da6b9]">Top P</span>
                                    <span className="text-white font-mono">0.9</span>
                                </div>
                                <input className="w-full h-1 bg-[#282e39] rounded-lg appearance-none cursor-pointer accent-[#135bec]" max="1" min="0" step="0.1" type="range" defaultValue="0.9" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#9da6b9]">Max Tokens</span>
                                    <span className="text-white font-mono">2048</span>
                                </div>
                                <input className="w-full h-1 bg-[#282e39] rounded-lg appearance-none cursor-pointer accent-[#135bec]" max="4096" min="256" step="256" type="range" defaultValue="2048" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-[#282e39]">
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1c1f27] border border-[#282e39] p-2 text-sm font-medium text-white hover:bg-[#282e39] transition-colors">
                            <Icon name="SlidersHorizontal" className="text-[18px]" />
                            Advanced Tuning
                        </button>
                    </div>
                </aside>

                {/* Center: Workflow Canvas */}
                <main className="flex-1 flex flex-col relative bg-[#101622] overflow-hidden">
                    {/* Canvas Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#282e39] bg-[#111318]/90 backdrop-blur-sm z-10 absolute top-0 w-full">
                        <div>
                            <div className="flex items-center gap-2 text-[#9da6b9] text-xs mb-1">
                                <span>Workflows</span>
                                <Icon name="ChevronRight" className="text-[10px]" />
                                <span>Daily Operations</span>
                            </div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                Pipeline: Daily Knowledge Graph Sync
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-wide">Active</span>
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 rounded-lg bg-[#1c1f27] border border-[#282e39] px-3 py-2 text-sm font-medium text-white hover:bg-[#282e39] transition-colors">
                                <Icon name="Play" className="text-[18px]" />
                                Test Run
                            </button>
                            <button className="flex items-center gap-2 rounded-lg bg-[#135bec] px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(19,91,236,0.4)] hover:bg-[#135bec]/90 transition-colors">
                                <Icon name="Rocket" className="text-[18px]" />
                                Deploy Changes
                            </button>
                        </div>
                    </div>
                    {/* The Canvas */}
                    <div className="flex-1 dot-pattern relative overflow-auto pt-24 px-8 pb-8" id="canvas-area">
                        {/* SVG Connections Layer */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                            {/* Path from Trigger to Action 1 */}
                            <path d="M 280 180 C 350 180, 350 300, 420 300" fill="none" markerEnd="url(#arrowhead)" stroke="#3b4354" strokeWidth="2"></path>
                            <path className="animate-[dash_20s_linear_infinite]" d="M 280 180 C 350 180, 350 180, 420 180" fill="none" stroke="#135bec" strokeDasharray="4 2" strokeWidth="2"></path>
                            {/* Path from Action 1 to Action 2 */}
                            <path d="M 640 180 C 700 180, 700 180, 760 180" fill="none" stroke="#3b4354" strokeWidth="2"></path>
                            {/* Path from Trigger to Action 3 (branch) */}
                            <path d="M 280 180 C 350 180, 350 420, 420 420" fill="none" stroke="#3b4354" strokeWidth="2"></path>
                            <defs>
                                <marker id="arrowhead" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
                                    <polygon fill="#3b4354" points="0 0, 10 3.5, 0 7"></polygon>
                                </marker>
                            </defs>
                        </svg>
                        {/* Node: Trigger */}
                        <div className="absolute top-[140px] left-[60px] w-[220px] bg-[#1c1f27] border border-[#135bec] rounded-xl shadow-[0_0_20px_rgba(19,91,236,0.1)] z-10 flex flex-col group">
                            <div className="h-10 bg-[#135bec]/20 border-b border-[#135bec]/20 rounded-t-xl flex items-center px-3 gap-2">
                                <Icon name="Zap" className="text-[#135bec] text-sm" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Trigger</span>
                            </div>
                            <div className="p-4">
                                <div className="text-sm font-semibold text-white">New Document Upload</div>
                                <div className="text-xs text-[#9da6b9] mt-1">Source: S3 Bucket /raw-data</div>
                                <div className="mt-3 flex items-center gap-2 text-[10px] text-[#9da6b9] bg-[#111318] p-1.5 rounded border border-[#282e39] font-mono">
                                    <span>event_id:</span>
                                    <span className="text-green-400">evt_8921a...</span>
                                </div>
                            </div>
                            {/* Output Port */}
                            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-[#135bec] rounded-full border-2 border-[#1c1f27] translate-y-[28px] hover:scale-125 transition-transform cursor-crosshair"></div>
                        </div>
                        {/* Node: Action 1 (Vectorize) */}
                        <div className="absolute top-[140px] left-[420px] w-[220px] bg-[#1c1f27] border border-[#282e39] rounded-xl shadow-lg z-10 flex flex-col group hover:border-[#9da6b9] cursor-move">
                            <div className="h-10 bg-[#282e39] border-b border-[#282e39] rounded-t-xl flex items-center px-3 gap-2">
                                <Icon name="Sigma" className="text-purple-400 text-sm" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Action</span>
                            </div>
                            <div className="p-4">
                                <div className="text-sm font-semibold text-white">Vectorize Content</div>
                                <div className="text-xs text-[#9da6b9] mt-1">Model: text-embedding-ada-002</div>
                            </div>
                            {/* Input Port */}
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-[#9da6b9] rounded-full border-2 border-[#1c1f27] translate-y-[28px]"></div>
                            {/* Output Port */}
                            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-[#9da6b9] rounded-full border-2 border-[#1c1f27] translate-y-[28px] hover:bg-[#135bec] transition-colors cursor-crosshair"></div>
                        </div>
                        {/* Node: Action 2 (Store) */}
                        <div className="absolute top-[140px] left-[760px] w-[220px] bg-[#1c1f27] border border-[#282e39] rounded-xl shadow-lg z-10 flex flex-col group hover:border-[#9da6b9] cursor-move">
                            <div className="h-10 bg-[#282e39] border-b border-[#282e39] rounded-t-xl flex items-center px-3 gap-2">
                                <Icon name="Database" className="text-orange-400 text-sm" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Storage</span>
                            </div>
                            <div className="p-4">
                                <div className="text-sm font-semibold text-white">Pinecone Store</div>
                                <div className="text-xs text-[#9da6b9] mt-1">Index: knowledge-base-prod</div>
                            </div>
                            {/* Input Port */}
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-[#9da6b9] rounded-full border-2 border-[#1c1f27] translate-y-[28px]"></div>
                        </div>
                        {/* Node: Notification (Branch) */}
                        <div className="absolute top-[380px] left-[420px] w-[220px] bg-[#1c1f27] border border-[#282e39] rounded-xl shadow-lg z-10 flex flex-col group hover:border-[#9da6b9] cursor-move">
                            <div className="h-10 bg-[#282e39] border-b border-[#282e39] rounded-t-xl flex items-center px-3 gap-2">
                                <Icon name="Bell" className="text-blue-400 text-sm" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Notify</span>
                            </div>
                            <div className="p-4">
                                <div className="text-sm font-semibold text-white">Slack Alert</div>
                                <div className="text-xs text-[#9da6b9] mt-1">Channel: #ops-alerts</div>
                            </div>
                            {/* Input Port */}
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-[#9da6b9] rounded-full border-2 border-[#1c1f27] translate-y-[-14px]"></div>
                        </div>
                        {/* Mini Map / Canvas Controls */}
                        <div className="absolute bottom-6 left-6 flex gap-2">
                            <button className="size-8 bg-[#1c1f27] border border-[#282e39] rounded flex items-center justify-center text-[#9da6b9] hover:text-white hover:border-white transition-all">
                                <Icon name="Plus" className="text-lg" />
                            </button>
                            <button className="size-8 bg-[#1c1f27] border border-[#282e39] rounded flex items-center justify-center text-[#9da6b9] hover:text-white hover:border-white transition-all">
                                <Icon name="Minus" className="text-lg" />
                            </button>
                            <button className="size-8 bg-[#1c1f27] border border-[#282e39] rounded flex items-center justify-center text-[#9da6b9] hover:text-white hover:border-white transition-all">
                                <Icon name="Focus" className="text-lg" />
                            </button>
                        </div>
                    </div>
                </main>
                {/* Right Sidebar: Logic & Status */}
                <aside className="w-80 flex-none border-l border-[#282e39] bg-[#111318] z-10 flex flex-col">
                    {/* Logic Toolbar */}
                    <div className="flex-1 overflow-y-auto p-4 border-b border-[#282e39]">
                        <h3 className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-4">Logic Toolbar</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[#282e39] bg-[#1c1f27] hover:border-[#135bec]/50 hover:bg-[#135bec]/5 cursor-grab active:cursor-grabbing transition-all">
                                <Icon name="Zap" className="text-[#135bec]" />
                                <span className="text-xs font-medium">Trigger</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[#282e39] bg-[#1c1f27] hover:border-purple-500/50 hover:bg-purple-500/5 cursor-grab active:cursor-grabbing transition-all">
                                <Icon name="Sigma" className="text-purple-400" />
                                <span className="text-xs font-medium">Action</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[#282e39] bg-[#1c1f27] hover:border-yellow-500/50 hover:bg-yellow-500/5 cursor-grab active:cursor-grabbing transition-all">
                                <Icon name="GitFork" className="text-yellow-400" />
                                <span className="text-xs font-medium">Condition</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[#282e39] bg-[#1c1f27] hover:border-orange-500/50 hover:bg-orange-500/5 cursor-grab active:cursor-grabbing transition-all">
                                <Icon name="Database" className="text-orange-400" />
                                <span className="text-xs font-medium">Store</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[#282e39] bg-[#1c1f27] hover:border-pink-500/50 hover:bg-pink-500/5 cursor-grab active:cursor-grabbing transition-all">
                                <Icon name="Clock" className="text-pink-400" />
                                <span className="text-xs font-medium">Delay</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[#282e39] bg-[#1c1f27] hover:border-blue-500/50 hover:bg-blue-500/5 cursor-grab active:cursor-grabbing transition-all">
                                <Icon name="Webhook" className="text-blue-400" />
                                <span className="text-xs font-medium">Webhook</span>
                            </div>
                        </div>
                        <div className="border-t border-[#282e39] pt-4">
                            <h3 className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-4">Node Properties</h3>
                            <div className="bg-[#1c1f27] rounded-lg p-3 border border-[#282e39]">
                                <div className="text-xs text-[#9da6b9] mb-1">Selected Node</div>
                                <div className="text-sm font-bold text-white mb-3">Vectorize Content</div>
                                <label className="block text-[10px] text-[#9da6b9] uppercase tracking-wide mb-1">Embedding Model</label>
                                <select className="w-full bg-[#111318] border border-[#282e39] text-white text-xs rounded p-2 mb-3 focus:ring-1 focus:ring-[#135bec] focus:border-[#135bec]">
                                    <option>text-embedding-ada-002</option>
                                    <option>bert-base-uncased</option>
                                </select>
                                <label className="block text-[10px] text-[#9da6b9] uppercase tracking-wide mb-1">Batch Size</label>
                                <input className="w-full bg-[#111318] border border-[#282e39] text-white text-xs rounded p-2 focus:ring-1 focus:ring-[#135bec] focus:border-[#135bec]" type="number" defaultValue="32" />
                            </div>
                        </div>
                    </div>
                    {/* Integration Status */}
                    <div className="h-[320px] bg-[#0d0f14] overflow-y-auto">
                        <div className="p-4 sticky top-0 bg-[#0d0f14]/95 backdrop-blur z-10 border-b border-[#282e39]">
                            <h3 className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider">Integration Health</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Integration Item 1 */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-white">OpenAI API</span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded">
                                        <span className="block size-1.5 rounded-full bg-green-500"></span>
                                        Connected
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-[#9da6b9]">Latency: 45ms</span>
                                    {/* Fake sparkline */}
                                    <div className="flex items-end gap-0.5 h-4">
                                        <div className="w-1 bg-green-500/20 h-[40%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500/40 h-[60%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500/30 h-[30%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500/60 h-[80%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500 h-[50%] rounded-t-sm"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Integration Item 2 */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-white">AWS S3 (US-East)</span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded">
                                        <span className="block size-1.5 rounded-full bg-green-500"></span>
                                        Connected
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-[#9da6b9]">Latency: 12ms</span>
                                    <div className="flex items-end gap-0.5 h-4">
                                        <div className="w-1 bg-green-500/20 h-[30%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500/20 h-[30%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500 h-[35%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500/20 h-[30%] rounded-t-sm"></div>
                                        <div className="w-1 bg-green-500/20 h-[30%] rounded-t-sm"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Integration Item 3 */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-white">Pinecone DB</span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-yellow-400 bg-yellow-900/20 px-1.5 py-0.5 rounded">
                                        <span className="block size-1.5 rounded-full bg-yellow-500"></span>
                                        Degraded
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-[#9da6b9]">Latency: 280ms</span>
                                    <div className="flex items-end gap-0.5 h-4">
                                        <div className="w-1 bg-yellow-500/20 h-[40%] rounded-t-sm"></div>
                                        <div className="w-1 bg-yellow-500/40 h-[60%] rounded-t-sm"></div>
                                        <div className="w-1 bg-yellow-500/60 h-[80%] rounded-t-sm"></div>
                                        <div className="w-1 bg-yellow-500 h-[100%] rounded-t-sm"></div>
                                        <div className="w-1 bg-yellow-500/80 h-[90%] rounded-t-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* System Metrics Condensed */}
                        <div className="border-t border-[#282e39] p-4 bg-[#111318]">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#1c1f27] rounded p-2 border border-[#282e39] text-center">
                                    <div className="text-[10px] text-[#9da6b9] uppercase mb-1">CPU Load</div>
                                    <div className="text-lg font-bold text-white">24%</div>
                                </div>
                                <div className="bg-[#1c1f27] rounded p-2 border border-[#282e39] text-center">
                                    <div className="text-[10px] text-[#9da6b9] uppercase mb-1">GPU Util</div>
                                    <div className="text-lg font-bold text-[#135bec]">88%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <style jsx global>{`
          /* Custom scrollbar for dark theme */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #111318;
            }
            ::-webkit-scrollbar-thumb {
                background: #282e39;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #3b4354;
            }
            .dot-pattern {
                background-image: radial-gradient(#282e39 1px, transparent 1px);
                background-size: 20px 20px;
            }

        `}</style>
            </div>
        </div>
    );
}
