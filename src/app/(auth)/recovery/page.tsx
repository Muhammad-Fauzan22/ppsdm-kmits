"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RecoveryPage() {
    return (
        <div className="min-h-screen bg-[#0E1218] flex flex-col font-sans">

            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-[#0E1218]">
                <div className="flex items-center gap-2 text-white">
                    <div className="size-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">shield</span>
                    </div>
                    <span className="font-bold">PPSDM KMM</span>
                </div>
                <Link href="#" className="text-gray-400 text-sm hover:text-white">Help Center</Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="flex flex-col items-center max-w-lg w-full">

                    <div className="size-16 bg-[#161B22] rounded-full flex items-center justify-center mb-6 border border-[#2D303E]">
                        <span className="material-symbols-outlined text-blue-500 text-3xl">history</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">Account Recovery</h1>
                    <p className="text-gray-500 text-center mb-10">Please follow the steps to regain access to your secure account.</p>

                    <div className="w-full bg-[#161B22] border border-[#2D303E] rounded-2xl p-8 shadow-2xl">

                        {/* Stepper */}
                        <div className="flex items-center justify-between mb-8 relative">
                            <div className="absolute top-1/2 left-0 w-full h-px bg-[#2D303E] -z-10"></div>

                            <div className="flex flex-col items-center bg-[#161B22] px-2 z-10">
                                <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold border-4 border-[#161B22] shadow-[0_0_0_2px_#2563EB]">1</div>
                                <span className="text-[10px] font-bold text-blue-500 mt-2 uppercase">Identity</span>
                            </div>
                            <div className="flex flex-col items-center bg-[#161B22] px-2 z-10">
                                <div className="size-8 rounded-full bg-[#161B22] text-gray-500 border border-gray-600 flex items-center justify-center text-sm font-bold border-4 border-[#161B22]">2</div>
                                <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase">Security</span>
                            </div>
                            <div className="flex flex-col items-center bg-[#161B22] px-2 z-10">
                                <div className="size-8 rounded-full bg-[#161B22] text-gray-500 border border-gray-600 flex items-center justify-center text-sm font-bold border-4 border-[#161B22]">3</div>
                                <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase">Reset</span>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="bg-[#0D1117] rounded-lg p-1.5 flex mb-6">
                            <button className="flex-1 bg-transparent hover:text-white text-blue-500 text-xs font-bold py-2 rounded border border-[#2D303E] bg-[#161B22]">Email</button>
                            <button className="flex-1 bg-transparent text-gray-500 hover:text-white text-xs font-bold py-2 rounded">SMS / Phone</button>
                        </div>

                        <label className="text-xs font-bold text-gray-300 mb-2 block">Registered Email Address</label>
                        <div className="relative mb-6">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">mail</span>
                            <input type="email" placeholder="name@example.com" className="w-full bg-[#0D1117] border border-[#2D303E] rounded-lg pl-10 pr-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500" />
                        </div>
                        <p className="text-xs text-gray-500 mb-6">We'll send a verification link or code to this email if it matches our records.</p>

                        {/* Captcha */}
                        <div className="bg-[#0D1117] border border-[#2D303E] rounded-lg p-4 flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="size-6 border-2 border-gray-500 rounded  hover:border-white transition-colors cursor-pointer"></div>
                                <span className="text-sm text-gray-300">I'm not a robot</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="material-symbols-outlined text-gray-500 text-lg">verified_user</span>
                                <span className="text-[8px] text-gray-600">Privacy - Terms</span>
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/20">
                            Continue to Security Challenge <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>

                        <div className="mt-6 text-center">
                            <Link href="/auth/login" className="text-gray-500 text-xs hover:text-white">Return to Login</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 text-center flex justify-center gap-8 text-[10px] text-gray-600">
                <a href="#" className="hover:text-gray-400">Contact Support</a>
                <div className="w-px h-3 bg-[#2D303E]"></div>
                <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                <div className="w-px h-3 bg-[#2D303E]"></div>
                <a href="#" className="hover:text-gray-400">Terms of Service</a>
            </div>
        </div>
    );
}
