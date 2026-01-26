"use client";

import Link from "next/link";
import { useState } from "react";
import { ASSETS } from "@/config/assets";

export default function LoginPage() {
    // State for interactive elements
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex min-h-screen w-full flex-row bg-[#f6f7f8] dark:bg-[#111418] font-sans text-white overflow-x-hidden">
            {/* Left Side: Visual Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-12 overflow-hidden bg-[#111418] border-r border-[#283039]">
                {/* Background Image - Using ITS logo/building or generic for now, user didn't provide specific BG image ID, so using a styled overlay on dark bg, or maybe one of the workmarks as pattern */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        // Using a generic ITS pattern or keeping the previous nice one if no specific BG asset provided. 
                        // User only provided logos. Let's use a solid dark gradient with the Logo overlay.
                        // Actually, I'll keep the nice futuristic background from the prompt but overlay the ITS logo watermark
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7x3PL4cdw2YT4_THSAsoahUoEjXv_XZ6XZAvlI0uOuysvjOc4Nloc1pem0B3lAKoQu9bIpIrOdcPFggWAIlbGn_8Tv1wjvFCtMAQTG6c3ibNwE2OqWvAavo-7QwpAzkaJ5h7GLZbSt7GORZetGJq5X-kyNnx8UCqV7dcsNZTJ13FP9NaVbk542ix-YOAxDxIQtOCKgEfyxHzodNobw_noGo5rnxp18mrp61_mHfFdZvDoQz0PIfXs9sprkKJ_3y_3FotrmhPaSPk')",
                        filter: "brightness(0.3) saturate(1.2)"
                    }}
                ></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#111418] via-[#111418]/80 to-transparent"></div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                        {/* LOGO ITS BIRU (from config) */}
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src={ASSETS.logos.its.lambang} alt="Lambang ITS" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white/90">PPSDM KM ITS</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mb-4">
                        Selamat Datang di <br />
                        <span className="text-[#137fec]">PPSDM KM ITS</span>
                    </h1>
                    <p className="text-lg text-[#9dabb9] leading-relaxed max-w-md">
                        Platform terintegrasi untuk pengembangan sumber daya mahasiswa Institut Teknologi Sepuluh Nopember.
                    </p>
                    <div className="mt-8 flex gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-medium text-white/80">
                            <span className="material-symbols-outlined text-base">verified_user</span>
                            Secure Login
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-medium text-white/80">
                            <span className="material-symbols-outlined text-base">id_card</span>
                            ITS SSO Supported
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 lg:px-24 bg-[#111418]">
                <div className="w-full max-w-[440px] flex flex-col gap-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#137fec] flex items-center justify-center shadow-lg shadow-[#137fec]/20">
                            <span className="material-symbols-outlined text-white text-3xl">school</span>
                        </div>
                    </div>

                    {/* Header Text */}
                    <div className="flex flex-col gap-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Masuk ke Akun Anda</h2>
                        <p className="text-[#9dabb9] text-sm font-normal">Akses materi dan data pengembangan diri mahasiswa.</p>
                    </div>

                    {/* SSO Button */}
                    <div className="flex flex-col gap-4">
                        <button className="group flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white text-[#111418] border border-transparent hover:bg-gray-100 active:scale-[0.98] transition-all duration-200">
                            <div className="mr-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.52 12.29C23.52 11.45 23.45 10.68 23.3 9.94H12.25V14.46H18.57C18.29 15.93 17.47 17.18 16.23 18.01V20.98H20.02C22.25 18.94 23.52 15.91 23.52 12.29Z" fill="#4285F4"></path>
                                    <path d="M12.25 23.75C15.42 23.75 18.08 22.7 20.03 20.98L16.24 18.01C15.19 18.72 13.84 19.14 12.25 19.14C9.19 19.14 6.6 17.07 5.67 14.28H1.76V17.31C3.68 21.13 7.65 23.75 12.25 23.75Z" fill="#34A853"></path>
                                    <path d="M5.67 14.28C5.43 13.56 5.3 12.79 5.3 12C5.3 11.21 5.43 10.44 5.67 9.72V6.69H1.76C0.97 8.28 0.52 10.08 0.52 12C0.52 13.92 0.97 15.72 1.76 17.31L5.67 14.28Z" fill="#FBBC05"></path>
                                    <path d="M12.25 4.86C13.98 4.86 15.52 5.46 16.74 6.62L20.09 3.27C18.08 1.4 15.42 0.25 12.25 0.25C7.65 0.25 3.68 2.87 1.76 6.69L5.67 9.72C6.6 6.93 9.19 4.86 12.25 4.86Z" fill="#EA4335"></path>
                                </svg>
                            </div>
                            <span className="text-sm font-bold leading-normal tracking-tight">Masuk dengan Google (SSO ITS)</span>
                        </button>

                        {/* Divider */}
                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-[#283039]"></div>
                            <span className="flex-shrink-0 mx-4 text-[#9dabb9] text-xs uppercase tracking-wider font-medium">atau masuk dengan email</span>
                            <div className="flex-grow border-t border-[#283039]"></div>
                        </div>
                    </div>

                    {/* Manual Login Form */}
                    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                        {/* Email Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white text-sm font-medium leading-none">Email</label>
                            <div className="relative">
                                <input
                                    className="flex w-full rounded-lg bg-[#1c2127] border border-[#283039] text-white focus:outline-0 focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] h-12 px-4 placeholder:text-[#9dabb9] text-base font-normal leading-normal transition-colors"
                                    placeholder="nrp@student.its.ac.id"
                                    type="email"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-white text-sm font-medium leading-none">Password</label>
                                <Link href="/auth/forgot-password" className="text-[#137fec] text-sm font-semibold hover:text-blue-400 transition-colors">
                                    Lupa Password?
                                </Link>
                            </div>
                            <div className="relative group/pass">
                                <input
                                    className="flex w-full rounded-lg bg-[#1c2127] border border-[#283039] text-white focus:outline-0 focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] h-12 px-4 placeholder:text-[#9dabb9] text-base font-normal leading-normal transition-colors"
                                    placeholder="Masukkan password Anda"
                                    type={showPassword ? "text" : "password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] hover:text-white transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Link href="/dashboard" className="w-full">
                            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#137fec] hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-blue-900/20 transition-all duration-200">
                                Masuk
                            </button>
                        </Link>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-2">
                        <p className="text-[#9dabb9] text-sm font-normal">
                            Belum punya akun?{" "}
                            <Link href="/auth/register" className="text-[#137fec] font-bold hover:text-blue-400 hover:underline transition-all">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Legal */}
                <div className="absolute bottom-6 w-full text-center lg:text-left lg:pl-24">
                    <p className="text-[#3b4754] text-xs">© 2024 PPSDM KM ITS. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
