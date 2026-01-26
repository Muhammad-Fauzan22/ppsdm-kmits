"use client";

import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101622] font-[family-name:var(--font-space-grotesk)] antialiased text-white selection:bg-[#135bec]/30 min-h-screen w-full flex">
            {/* Left Panel (Visuals) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#0b101b] relative overflow-hidden p-12 border-r border-[#282e39]">
                {/* Abstract background effect */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#135bec]/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>
                </div>
                {/* Header Content */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="size-8 text-[#135bec]">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight">PPSDM KMM Portal</span>
                </div>
                {/* Illustration & Main Message */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-12">
                    <div className="w-full max-w-[320px] aspect-square rounded-full bg-gradient-to-tr from-[#135bec]/30 to-blue-900/10 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/5">
                        {/* Mascot Placeholder */}
                        <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBVLbOe4moz7X2Pt7KxjOKSJ8SmRYLJD-5Boh4JXTYl7lY6HZfmPYi95sdBpmqzHDbRibMDFUKJmQfsA-9sUlnH-uTF-YraPLdxD9PsQLcv_UeMmEuQBFkmy6kQQdfbPP6Xt2-qt8dDpFSC0c-HtYpkDcpq0HKV2VCEF4YbjPDKXfMDPfPBMx7cifL1HZJVvj3yzm8N4JSrA_bORkxiTJbRL8J4qjTNRtJZXkrFsxPDJtRtsfqcGKwe5dTdDRcloFpNpnq2y_QR-E')" }}></div>
                    </div>
                    <h1 className="text-4xl font-bold text-center leading-tight mb-4">Secure Access for<br />ITS Students</h1>
                    <p className="text-slate-400 text-center max-w-md">Access your academic resources, schedule, and administrative tools securely through the unified PPSDM KMM portal.</p>
                </div>
                {/* Footer Quote */}
                <div className="relative z-10 text-sm text-slate-500">
                    <p>© 2024 Institut Teknologi Sepuluh Nopember.</p>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#101622] relative">
                <div className="absolute top-6 right-6 lg:hidden">
                    <div className="size-8 text-[#135bec]">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                        </svg>
                    </div>
                </div>
                <div className="w-full max-w-[400px] flex flex-col gap-6">
                    {/* Heading */}
                    <div className="flex flex-col gap-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
                        <p className="text-slate-400 text-sm">Enter your details below to access your account</p>
                    </div>
                    {/* SSO Button */}
                    <button className="flex w-full items-center justify-center gap-2 rounded bg-[#282e39] p-3 text-sm font-medium text-white hover:bg-[#343b48] transition-all border border-transparent hover:border-slate-600 group">
                        <span className="material-symbols-outlined text-[#135bec] group-hover:text-white transition-colors" style={{ fontSize: "20px" }}>school</span>
                        Sign in with ITS SSO
                    </button>
                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#282e39]"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#101622] px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>
                    {/* Form */}
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">NRP / Email</label>
                            <div className="relative">
                                <input className="flex h-10 w-full rounded border border-[#282e39] bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pl-10" id="email" placeholder="5025201xxx" required type="email" />
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500" style={{ fontSize: "18px" }}>mail</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Password</label>
                                <a className="text-sm font-medium text-[#135bec] hover:text-[#135bec]/80 hover:underline" href="#">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input className="flex h-10 w-full rounded border border-[#282e39] bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pl-10" id="password" placeholder="••••••••" required type="password" />
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500" style={{ fontSize: "18px" }}>lock</span>
                                <button className="absolute right-3 top-2.5 text-slate-500 hover:text-white" type="button">
                                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
                                </button>
                            </div>
                        </div>
                        <button className="inline-flex items-center justify-center rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#135bec] text-white hover:bg-[#135bec]/90 h-10 px-4 py-2 w-full mt-2" type="submit">
                            Login
                        </button>
                    </form>
                    {/* Footer Help */}
                    <div className="mt-4 text-center text-xs text-slate-500">
                        <p>Having trouble signing in? <a className="underline hover:text-white" href="#">Contact Help Desk</a></p>
                        <div className="flex items-center justify-center gap-1 mt-2 text-emerald-500/80">
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>lock</span>
                            <span>Secure Connection 256-bit SSL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
