"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Home, ChevronRight, History, CreditCard, Key, Lock, EyeOff, CloudUpload, CheckCircle, Zap, Timer, AlertTriangle, Info, Save } from 'lucide-react';

export default function ConfigurationPage() {
    const [activeTab, setActiveTab] = useState('integrations');

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden antialiased min-h-screen flex flex-col">
            <div className="relative flex min-h-screen w-full flex-col group/design-root">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#282e39] bg-[#111318] px-10 py-3">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <ShieldCheck className="text-2xl" />
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM Admin</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <nav className="hidden md:flex items-center gap-9">
                            <Link legacyBehavior href="/admin"><a className="text-gray-400 hover:text-white text-sm font-medium leading-normal transition-colors">Dashboard</a></Link>
                            <Link legacyBehavior href="/admin/users"><a className="text-gray-400 hover:text-white text-sm font-medium leading-normal transition-colors">Users</a></Link>
                            <Link legacyBehavior href="/admin/content"><a className="text-gray-400 hover:text-white text-sm font-medium leading-normal transition-colors">Content</a></Link>
                            <Link legacyBehavior href="/admin/configuration"><a className="text-white text-sm font-medium leading-normal">Configuration</a></Link>
                            <Link legacyBehavior href="/admin/reports"><a className="text-gray-400 hover:text-white text-sm font-medium leading-normal transition-colors">Reports</a></Link>
                        </nav>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#282e39]"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACezQNl8wyx4ykcW6foFBBSPIgsg6YMPHWs41tg6syab7jlPtX73ossGDLZuskfT8Ad7XSaMKz0OU_59QlOBcDnVcY0M6f6rO-JhHbOgIrK0tvf9VnDHcHxLNs-tNtHjO2mxgmhHgHKPqiqXyQGm9xvIt5C1H-BCu5sq9_i6TzaeeEfcvqCKkEwoKY8sbjSRfYOLdhgUOf056QHNW7C9HNXTMIrMJ8SQV9_B0brCbL1R-VadPq1FvutF63aP9Xhpzd8hbelhbH0i4")' }}></div>
                    </div>
                </header>

                <div className="layout-container flex h-full grow flex-col">
                    <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
                        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                            {/* Breadcrumbs */}
                            <div className="flex flex-wrap gap-2 px-4 py-2">
                                <Link legacyBehavior href="/admin">
                                    <a className="text-[#9da6b9] hover:text-white text-sm font-medium leading-normal flex items-center gap-1">
                                        <Home className="w-[18px] h-[18px]" />
                                        Admin
                                    </a>
                                </Link>
                                <span className="text-[#9da6b9] text-sm font-medium leading-normal flex items-center">
                                    <ChevronRight className="w-[16px] h-[16px]" />
                                </span>
                                <Link legacyBehavior href="/admin/configuration">
                                    <a className="text-[#9da6b9] hover:text-white text-sm font-medium leading-normal">Configuration</a>
                                </Link>
                                <span className="text-[#9da6b9] text-sm font-medium leading-normal flex items-center">
                                    <ChevronRight className="w-[16px] h-[16px]" />
                                </span>
                                <span className="text-white text-sm font-medium leading-normal">Global Settings</span>
                            </div>

                            {/* Page Heading */}
                            <div className="flex flex-wrap justify-between gap-3 px-4 py-6">
                                <div className="flex min-w-72 flex-col gap-2">
                                    <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Global System Configuration</h1>
                                    <p className="text-[#9da6b9] text-base font-normal leading-normal max-w-2xl">Manage global system behaviors, third-party integrations, gamification logic, and automated communication templates.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                                        <span className="size-2 rounded-full bg-green-500"></span>
                                        <span className="text-green-500 text-xs font-bold uppercase tracking-wider">System Operational</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="sticky top-[73px] z-40 bg-background-dark/95 backdrop-blur-sm border-b border-[#3b4354] px-4">
                                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                                    <button onClick={() => scrollToSection('general')} className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 min-w-[80px] ${activeTab === 'general' ? 'border-b-white' : 'border-b-transparent hover:border-b-gray-600'}`}>
                                        <p className={`${activeTab === 'general' ? 'text-white' : 'text-[#9da6b9] group-hover:text-white'} text-sm font-bold leading-normal tracking-[0.015em]`}>General</p>
                                    </button>
                                    <button onClick={() => scrollToSection('gamification')} className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 min-w-[120px] ${activeTab === 'gamification' ? 'border-b-white' : 'border-b-transparent hover:border-b-gray-600'}`}>
                                        <p className={`${activeTab === 'gamification' ? 'text-white' : 'text-[#9da6b9] group-hover:text-white'} text-sm font-bold leading-normal tracking-[0.015em]`}>Gamification Rules</p>
                                    </button>
                                    <button onClick={() => scrollToSection('integrations')} className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 min-w-[100px] ${activeTab === 'integrations' ? 'border-b-white' : 'border-b-transparent hover:border-b-gray-600'}`}>
                                        <p className={`${activeTab === 'integrations' ? 'text-white' : 'text-[#9da6b9] group-hover:text-white'} text-sm font-bold leading-normal tracking-[0.015em]`}>Integrations</p>
                                    </button>
                                    <button onClick={() => scrollToSection('email')} className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 min-w-[120px] ${activeTab === 'email' ? 'border-b-white' : 'border-b-transparent hover:border-b-gray-600'}`}>
                                        <p className={`${activeTab === 'email' ? 'text-white' : 'text-[#9da6b9] group-hover:text-white'} text-sm font-bold leading-normal tracking-[0.015em]`}>Email Templates</p>
                                    </button>
                                </div>
                            </div>

                            {/* Main Form Content */}
                            <div className="flex flex-col gap-10 p-4 pb-24">
                                {/* Integrations Section */}
                                <div className="flex flex-col gap-6" id="integrations">
                                    <div className="flex items-center justify-between border-b border-[#282e39] pb-2">
                                        <h3 className="text-white text-xl font-bold leading-tight">API & Integrations</h3>
                                        <button className="text-primary text-sm font-medium hover:text-blue-400 flex items-center gap-1">
                                            <History className="text-base w-4 h-4" />
                                            View Audit Logs
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Payment Gateway */}
                                        <div className="bg-[#1a202c] rounded-xl p-6 border border-[#282e39] flex flex-col gap-5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <CreditCard className="text-white w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">Payment Gateway</h4>
                                                    <p className="text-[#9da6b9] text-xs">Stripe integration settings</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-[#9da6b9]">Publishable Key</label>
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-500">
                                                            <Key className="text-lg w-5 h-5" />
                                                        </span>
                                                        <input type="text" className="bg-[#111318] border border-[#3b4354] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5 placeholder-gray-500" placeholder="pk_live_..." defaultValue="pk_live_51M..." />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-[#9da6b9]">Secret Key</label>
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-500">
                                                            <Lock className="text-lg w-5 h-5" />
                                                        </span>
                                                        <input type="password" className="bg-[#111318] border border-[#3b4354] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5 pr-10" placeholder="sk_live_..." defaultValue="sk_live_very_secret_key_hidden" />
                                                        <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-white transition-colors">
                                                            <EyeOff className="text-lg w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-[#282e39] mt-2 flex justify-end">
                                                <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">Test Connection</button>
                                            </div>
                                        </div>
                                        {/* Cloud Storage */}
                                        <div className="bg-[#1a202c] rounded-xl p-6 border border-[#282e39] flex flex-col gap-5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <CloudUpload className="text-white w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">Cloud Storage</h4>
                                                    <p className="text-[#9da6b9] text-xs">AWS S3 Bucket configuration</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-[#9da6b9]">Region</label>
                                                    <select className="bg-[#111318] border border-[#3b4354] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" defaultValue="eu-central-1 (Frankfurt)">
                                                        <option>us-east-1 (N. Virginia)</option>
                                                        <option>ap-southeast-1 (Singapore)</option>
                                                        <option>eu-central-1 (Frankfurt)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-[#9da6b9]">Bucket Name</label>
                                                    <input type="text" className="bg-[#111318] border border-[#3b4354] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" defaultValue="ppsdm-assets-prod" />
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-[#282e39] mt-2 flex justify-end">
                                                <button className="text-sm text-green-500 font-medium flex items-center gap-1">
                                                    <CheckCircle className="text-sm w-4 h-4" />
                                                    Connected
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gamification Rules Section */}
                                <div className="flex flex-col gap-6 pt-6 border-t border-[#282e39]" id="gamification">
                                    <h3 className="text-white text-xl font-bold leading-tight">Gamification Rules</h3>
                                    <div className="bg-[#1a202c] rounded-xl p-6 border border-[#282e39]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            {/* XP Multiplier Slider */}
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center">
                                                    <label htmlFor="xp-multiplier" className="text-sm font-bold text-white flex items-center gap-2">
                                                        <Zap className="text-yellow-500 w-5 h-5" />
                                                        Global XP Multiplier
                                                    </label>
                                                    <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">2.5x</span>
                                                </div>
                                                <div className="relative w-full h-8 flex items-center">
                                                    <input id="xp-multiplier" type="range" min="1" max="5" step="0.5" defaultValue="2.5" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary z-10" />
                                                    {/* Steps visual aid */}
                                                    <div className="absolute w-full flex justify-between px-[2px] pointer-events-none top-4">
                                                        {[...Array(9)].map((_, i) => (
                                                            <div key={i} className="w-1 h-2 bg-gray-600 rounded"></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[#9da6b9]">Applies to all user activities. Higher values may inflate economy.</p>
                                            </div>
                                            {/* Daily Cap Input */}
                                            <div className="flex flex-col gap-4">
                                                <label className="text-sm font-bold text-white flex items-center gap-2">
                                                    <Timer className="text-blue-400 w-5 h-5" />
                                                    Daily XP Cap
                                                </label>
                                                <div className="flex gap-4">
                                                    <div className="relative flex-1">
                                                        <input type="number" className="bg-[#111318] border border-[#3b4354] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" defaultValue="5000" />
                                                    </div>
                                                    <select className="bg-[#111318] border border-[#3b4354] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-40 p-2.5">
                                                        <option>Reset at 00:00 UTC</option>
                                                        <option>Rolling 24h</option>
                                                    </select>
                                                </div>
                                                <p className="text-xs text-[#9da6b9]">Maximum experience points a user can earn in a single cycle.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* General / Maintenance Section */}
                                <div className="flex flex-col gap-6 pt-6 border-t border-[#282e39]" id="general">
                                    <h3 className="text-white text-xl font-bold leading-tight">System Controls</h3>
                                    <div className="bg-[#1a202c] rounded-xl border border-[#282e39] overflow-hidden">
                                        <div className="p-6 flex items-center justify-between border-b border-[#282e39] bg-red-500/5">
                                            <div className="flex gap-4">
                                                <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                                    <AlertTriangle className="text-red-500 text-2xl w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg">Maintenance Mode</h4>
                                                    <p className="text-[#9da6b9] text-sm">When active, only administrators can access the platform.</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                                            </label>
                                        </div>
                                        <div className="p-6 bg-[#1a202c]">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-1">
                                                    <label className="block mb-2 text-sm font-medium text-white">Maintenance Message</label>
                                                    <textarea className="block p-2.5 w-full text-sm text-gray-900 bg-[#111318] rounded-lg border border-[#3b4354] focus:ring-primary focus:border-primary dark:bg-[#111318] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="We are currently performing scheduled maintenance..." rows={2}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Action Bar */}
                    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
                        <div className="layout-content-container max-w-[960px] mx-auto relative px-4 md:px-10 lg:px-40">
                            <div className="pointer-events-auto bg-[#1a202c] border border-[#282e39] shadow-2xl rounded-t-xl p-4 flex justify-between items-center mb-0 md:mb-6">
                                <div className="flex items-center gap-2">
                                    <Info className="text-yellow-500 text-sm w-4 h-4" />
                                    <span className="text-[#9da6b9] text-sm">You have unsaved changes.</span>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-700 transition-colors">Discard</button>
                                    <button className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-900 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                                        <Save className="text-sm w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #135bec;
                    cursor: pointer;
                    margin-top: -8px; 
                    box-shadow: 0 0 0 4px rgba(19, 91, 236, 0.2);
                }
                input[type=range]::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border: none;
                    border-radius: 50%;
                    background: #135bec;
                    cursor: pointer;
                    box-shadow: 0 0 0 4px rgba(19, 91, 236, 0.2);
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #374151;
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
}
