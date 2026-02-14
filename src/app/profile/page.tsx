"use client";

import Link from "next/link";
import {
    GraduationCap,
    Bell,
    BadgeCheck,
    IdCard,
    Trophy,
    Medal,
    Star,
    Download,
    Share2,
    Award,
    Lightbulb,
    Mic,
    Terminal,
    Users,
    Beaker,
    Lock,
    Heart,
    Gamepad2,
    Languages,
    Brain
} from 'lucide-react';

export default function StudentPortfolio() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white font-[family-name:var(--font-space-grotesk)] overflow-x-hidden min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#282e39] bg-[#f6f6f8]/80 dark:bg-[#101622]/80 backdrop-blur-md px-10 py-4">
                <div className="flex items-center gap-4 text-[#135bec] dark:text-white">
                    <div className="size-8 flex items-center justify-center bg-[#135bec] rounded-lg text-white">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <nav className="hidden md:flex items-center gap-9">
                        <Link className="text-slate-600 dark:text-gray-300 hover:text-[#135bec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" href="/dashboard">Home</Link>
                        <Link className="text-[#135bec] dark:text-white text-sm font-bold leading-normal relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-[#135bec] after:-bottom-2 after:left-0" href="/profile">Portfolio</Link>
                        <Link className="text-slate-600 dark:text-gray-300 hover:text-[#135bec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Leaderboard</Link>
                        <Link className="text-slate-600 dark:text-gray-300 hover:text-[#135bec] dark:hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Settings</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="bg-[#135bec]/10 hover:bg-[#135bec]/20 text-[#135bec] dark:text-white rounded-full p-2 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#135bec]/50" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCiwwE8ILEyNLubRgizFrw3xeat8Cqr4pzFxXduaU8KxaUeUBiKh-TNPotvxfO4SKyvnI11nysMD0F6DqthMY5P-y1jRtEdSMqLx9cBEUijLj9XUww2EOyz4iCl6DRYehgI8P4k1ecwH1FmkgcLxVWhHSRVUnqrGcTw4BmdekGPJ4bhl54HVfcFWVmlF9OeEQ84S1zWtHP3nS4lB39Ejh69vJdcAPA6nRhiZB9PFO_NjXXoahesS4-Tph-JZERZoE3ty-tIMNdlk0')" }}></div>
                    </div>
                </div>
            </header>

            <main className="flex-grow layout-container flex flex-col items-center">
                <div className="w-full max-w-[1200px] px-6 py-8 flex flex-col gap-10">
                    {/* Hero Section: Student ID Card Style */}
                    <section className="w-full">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#ffffff] via-gray-100 to-gray-200 dark:from-[#1a1d24] dark:via-[#1e2330] dark:to-[#101622] border border-gray-200 dark:border-[#282e39] shadow-2xl">
                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#135bec] via-transparent to-transparent pointer-events-none"></div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#135bec]/20 rounded-full blur-[80px] pointer-events-none"></div>
                            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                                {/* ID Card Left: Avatar & Basic Info */}
                                <div className="flex-shrink-0 relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#135bec] to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                    <div className="relative bg-[#ffffff] dark:bg-[#101622] p-2 rounded-xl border border-gray-200 dark:border-[#3b4354]">
                                        <div className="bg-center bg-no-repeat bg-cover rounded-lg h-40 w-40 md:h-48 md:w-48 shadow-inner" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAO_rUftQwIJTe-iNwDT59fmq0yeDKOFSK_5RCPB9KIX_VqgwGov4f3DfqswHJQXsBYNQKM8pV83g-Wtoo4l-kQCUmOpC3YQCC7g9zcxSEaykDXuwfybYATkvK5NvrJitvP5OaLKdWsEZOSwTNmaN5ybpo4_GYQJNQmKt_yyKZ6JRUslPr20wv1XW7oeN2fEE9rer3kpG7GAKR60qxi0FEc-d50MjcoCxY-CEAZaUquvFgBNWD5TmLf09QvcOejfQZLJ9ELHWpql0w')" }}></div>
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-[#135bec] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-[#ffffff] dark:border-[#101622] flex items-center gap-1">
                                        <BadgeCheck className="w-4 h-4" />
                                        VERIFIED
                                    </div>
                                </div>
                                {/* ID Card Middle: Details & Stats */}
                                <div className="flex flex-col flex-1 w-full text-center md:text-left">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Scholar Alex Smith</h1>
                                            <p className="text-slate-500 dark:text-[#9da6b9] text-lg font-medium">Computer Science Department • Class of 2025</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="bg-[#ffffff] dark:bg-[#282e39] border border-gray-200 dark:border-[#3b4354] px-4 py-2 rounded-lg flex items-center gap-2">
                                                <IdCard className="text-[#135bec] w-5 h-5" />
                                                <span className="text-sm font-mono text-slate-500 dark:text-gray-400">ID: 884-291-KMM</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        {/* Level & Progress */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[#135bec] font-bold text-lg tracking-wider uppercase">Level 4 Scholar</span>
                                                <span className="text-slate-500 dark:text-gray-400 text-sm font-mono">750/1000 XP</span>
                                            </div>
                                            <div className="h-4 w-full bg-gray-200 dark:bg-[#0f1218] rounded-full overflow-hidden border border-gray-300 dark:border-[#282e39] relative">
                                                {/* Animated Stripes on Progress Bar */}
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[spin_3s_linear_infinite]"></div>
                                                <div className="h-full bg-[#135bec] rounded-full relative" style={{ width: "75%" }}>
                                                    <div className="absolute right-0 top-0 h-full w-1 bg-white/30"></div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">Next Reward: <span className="text-[#135bec] dark:text-blue-300">Advanced Research Access Grant</span></p>
                                        </div>
                                        {/* Quick Stats Row */}
                                        <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
                                            <div className="flex items-center gap-2 bg-[#ffffff] dark:bg-[#1a1d24] px-3 py-1.5 rounded-md border border-gray-200 dark:border-[#282e39]">
                                                <Trophy className="text-yellow-500 w-4 h-4" />
                                                <span className="text-sm font-bold">12 Badges</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-[#ffffff] dark:bg-[#1a1d24] px-3 py-1.5 rounded-md border border-gray-200 dark:border-[#282e39]">
                                                <Medal className="text-green-500 w-4 h-4" />
                                                <span className="text-sm font-bold">Top 5%</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-[#ffffff] dark:bg-[#1a1d24] px-3 py-1.5 rounded-md border border-gray-200 dark:border-[#282e39]">
                                                <Star className="text-purple-500 w-4 h-4" />
                                                <span className="text-sm font-bold">Project Lead</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* FAB for Desktop (Inside Card Area for Layout) */}
                                <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <button className="bg-[#135bec] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-1 active:translate-y-0 w-full md:w-auto whitespace-nowrap">
                                        <Download className="w-5 h-5" />
                                        Download CV
                                    </button>
                                    <button className="bg-[#ffffff] dark:bg-[#282e39] hover:bg-gray-100 dark:hover:bg-[#3b4354] text-slate-900 dark:text-white font-medium py-3 px-6 rounded-lg border border-gray-200 dark:border-[#3b4354] flex items-center justify-center gap-2 transition-colors w-full md:w-auto whitespace-nowrap">
                                        <Share2 className="w-5 h-5" />
                                        Share Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Split Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                        {/* Left Column: Trophy Case (Hexagonal Grid) */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Award className="text-[#135bec] w-8 h-8" />
                                    Trophy Case
                                </h2>
                                <div className="flex bg-[#ffffff] dark:bg-[#1a1d24] rounded-lg p-1 border border-gray-200 dark:border-[#282e39]">
                                    <button className="px-3 py-1 text-xs font-bold rounded bg-[#135bec] text-white shadow-sm">All</button>
                                    <button className="px-3 py-1 text-xs font-medium rounded text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#282e39] transition">Academic</button>
                                    <button className="px-3 py-1 text-xs font-medium rounded text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#282e39] transition">Extracurricular</button>
                                </div>
                            </div>
                            {/* Hexagon Grid Container */}
                            <div className="bg-[#ffffff] dark:bg-[#1a1d24] rounded-xl p-8 border border-gray-200 dark:border-[#282e39] relative min-h-[400px]">
                                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                                    {/* Unlocked Badge 1: Innovation */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 z-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#135bec] to-blue-600 hexagon shadow-[0_0_15px_rgba(19,91,236,0.5)]"></div>
                                        <div className="absolute inset-[2px] bg-[#ffffff] dark:bg-[#1e2330] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Lightbulb className="text-[#135bec] w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#135bec]">Innovator</span>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded p-2 z-50 text-center shadow-xl border border-gray-700">
                                            <p className="font-bold text-[#135bec]">Innovation Award</p>
                                            <p className="text-gray-300 mt-1">Submitted 3 verified ideas to the student council.</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Unlocked: Oct 12, 2023</p>
                                        </div>
                                    </div>
                                    {/* Unlocked Badge 2: Debate */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 z-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 hexagon shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                                        <div className="absolute inset-[2px] bg-[#ffffff] dark:bg-[#1e2330] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Mic className="text-purple-500 w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-500">Orator</span>
                                        </div>
                                    </div>
                                    {/* Unlocked Badge 3: Code */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 z-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 hexagon shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                                        <div className="absolute inset-[2px] bg-[#ffffff] dark:bg-[#1e2330] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Terminal className="text-green-500 w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-green-500">Coder</span>
                                        </div>
                                    </div>
                                    {/* Unlocked Badge 4: Teamwork */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 z-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 hexagon shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
                                        <div className="absolute inset-[2px] bg-[#ffffff] dark:bg-[#1e2330] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Users className="text-orange-500 w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">Leader</span>
                                        </div>
                                    </div>
                                    {/* Locked Badge 1 */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-not-allowed opacity-50 grayscale hover:grayscale-0 transition-all duration-300 hover:opacity-100">
                                        <div className="absolute inset-0 bg-gray-600 hexagon"></div>
                                        <div className="absolute inset-[1px] bg-[#ffffff] dark:bg-[#151921] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Beaker className="text-gray-400 w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Research</span>
                                            <Lock className="text-gray-600 w-4 h-4 absolute bottom-6" />
                                        </div>
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block w-40 bg-gray-800 text-gray-300 text-xs rounded p-2 z-50 text-center border border-gray-600">
                                            Locked: Publish 1 Research Paper
                                        </div>
                                    </div>
                                    {/* Locked Badge 2 */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-not-allowed opacity-50 grayscale hover:grayscale-0 transition-all duration-300 hover:opacity-100">
                                        <div className="absolute inset-0 bg-gray-600 hexagon"></div>
                                        <div className="absolute inset-[1px] bg-[#ffffff] dark:bg-[#151921] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Heart className="text-gray-400 w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Charity</span>
                                            <Lock className="text-gray-600 w-4 h-4 absolute bottom-6" />
                                        </div>
                                    </div>
                                    {/* Locked Badge 3 */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-not-allowed opacity-50 grayscale hover:grayscale-0 transition-all duration-300 hover:opacity-100">
                                        <div className="absolute inset-0 bg-gray-600 hexagon"></div>
                                        <div className="absolute inset-[1px] bg-[#ffffff] dark:bg-[#151921] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Gamepad2 className="text-gray-400 w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Gamer</span>
                                            <Lock className="text-gray-600 w-4 h-4 absolute bottom-6" />
                                        </div>
                                    </div>
                                    {/* Locked Badge 4 */}
                                    <div className="group relative w-24 h-28 md:w-32 md:h-36 flex items-center justify-center cursor-not-allowed opacity-50 grayscale hover:grayscale-0 transition-all duration-300 hover:opacity-100">
                                        <div className="absolute inset-0 bg-gray-600 hexagon"></div>
                                        <div className="absolute inset-[1px] bg-[#ffffff] dark:bg-[#151921] hexagon flex flex-col items-center justify-center gap-1 z-10">
                                            <Languages className="text-gray-400 w-8 h-8 md:w-10 md:h-10" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Polyglot</span>
                                            <Lock className="text-gray-600 w-4 h-4 absolute bottom-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Column: Skills Matrix & Recent Activity */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Skills Matrix */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Brain className="text-[#135bec] w-8 h-8" />
                                    Skills Matrix
                                </h2>
                                <div className="bg-[#ffffff] dark:bg-[#1a1d24] rounded-xl p-6 border border-gray-200 dark:border-[#282e39]">
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Verified competencies based on coursework and projects.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {/* High Proficiency */}
                                        <span className="px-3 py-1.5 rounded-full bg-[#135bec] text-white text-sm font-medium border border-blue-500 shadow-md shadow-blue-500/20">Python</span>
                                        <span className="px-3 py-1.5 rounded-full bg-[#135bec] text-white text-sm font-medium border border-blue-500 shadow-md shadow-blue-500/20">Public Speaking</span>
                                        <span className="px-3 py-1.5 rounded-full bg-[#135bec] text-white text-sm font-medium border border-blue-500 shadow-md shadow-blue-500/20">Data Analysis</span>
                                        {/* Medium Proficiency */}
                                        <span className="px-3 py-1.5 rounded-full bg-[#135bec]/80 text-white text-sm font-medium border border-blue-500/50">React.js</span>
                                        <span className="px-3 py-1.5 rounded-full bg-[#135bec]/80 text-white text-sm font-medium border border-blue-500/50">UI Design</span>
                                        <span className="px-3 py-1.5 rounded-full bg-[#135bec]/70 text-white text-sm font-medium border border-blue-500/40">Project Mgmt</span>
                                        {/* Developing Proficiency */}
                                        <span className="px-3 py-1.5 rounded-full bg-[#ffffff] dark:bg-[#111318] text-slate-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-[#3b4354]">Machine Learning</span>
                                        <span className="px-3 py-1.5 rounded-full bg-[#ffffff] dark:bg-[#111318] text-slate-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-[#3b4354]">Technical Writing</span>
                                        <span className="px-3 py-1.5 rounded-full bg-[#ffffff] dark:bg-[#111318] text-slate-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-[#3b4354]">Git</span>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#282e39]">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-gray-500 mb-3">Recent Endorsements</h3>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 border border-gray-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwqUgb_spl35bspeKY46tcxghqhrVuiGNbDDPDuqqrbILjFE3hbJaCiGaHgGtX2-DayjMgYGk36AENhQg4j4hUZOb3hCUztn8vBalVCgZQ6WGsDwy36P3ebYYtPK3GV0nFmZJbfbjPdRv7ZEf2MVJwV4fqm5-_sCgbebZ3fMbDoMsgTWfMnmSHCSeLTl7ou3Ha_AzFBqPi2dMalOi8ScNaGEVYu9cY6B9cVlKef5MvC3chzLI9jANnCBwLxQxaJB1Ucdhc7r4Goh8')" }}></div>
                                            <div className="text-sm">
                                                <p className="font-medium text-slate-900 dark:text-white">Prof. Miller</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-400">Endorsed <span className="text-[#135bec]">Data Analysis</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 border border-gray-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDs_5A3i7pP8XE4n5ZTN7GXGl1ShYw1_d206AuFoGcHlw51QJ8qCMV__SeJlBrrHidoVFw5AG6WI9A9gTWSRgfKk-5SIz7f6gT20O4UA3g4n30p02LXATRrwbJ2Qlxj0UoVLJHUnBBRNr6p6yI_spF8TpgAk9LwrsJBpOWjRvCuDnqM8IoEBkhq7h9OUq5Wryc3SbVkvBhKzdVUyBBq5kg-jiw1GiFbb45DnUpDUect-YqRVqEHaS4i5625LNkfJXmLQBjeaz60sL8')" }}></div>
                                            <div className="text-sm">
                                                <p className="font-medium text-slate-900 dark:text-white">Sarah Lee</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-400">Endorsed <span className="text-[#135bec]">Public Speaking</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Mini Map / Location */}
                            <div className="bg-[#ffffff] dark:bg-[#1a1d24] rounded-xl overflow-hidden border border-gray-200 dark:border-[#282e39] h-48 relative group">
                                <div className="absolute top-3 left-3 z-10 bg-[#101622]/80 backdrop-blur text-white text-xs px-2 py-1 rounded">
                                    Campus Location
                                </div>
                                <div className="w-full h-full bg-center bg-cover opacity-80 group-hover:opacity-100 transition duration-500" style={{ backgroundImage: "url('https://placeholder.pics/svg/300')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d24] to-transparent opacity-90"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white text-sm font-bold">Innovation Hub, Building C</p>
                                    <p className="text-gray-400 text-xs">Currently working on: Capstone Project</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-10 border-t border-gray-200 dark:border-[#282e39] pt-8 pb-10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-10">
                    <p className="text-slate-500 dark:text-[#9da6b9] text-sm">© 2024 PPSDM KMM. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a className="text-slate-500 dark:text-[#9da6b9] hover:text-[#135bec] text-sm" href="#">University Home</a>
                        <a className="text-slate-500 dark:text-[#9da6b9] hover:text-[#135bec] text-sm" href="#">Privacy Policy</a>
                        <a className="text-slate-500 dark:text-[#9da6b9] hover:text-[#135bec] text-sm" href="#">Support</a>
                    </div>
                </div>
            </footer>
            <style jsx>{`
                .hexagon {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
                /* Custom scrollbar for a cleaner look */
                ::-webkit-scrollbar {
                    width: 8px;
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
            `}</style>
        </div>
    );
}
