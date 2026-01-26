"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
    return (
        <div className="bg-white dark:bg-background-dark text-slate-900 dark:text-white font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="size-8 rounded bg-its-blue flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white font-serif">PPSDM KM ITS</span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <Link href="/auth/login" className="text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/auth/register" className="text-white bg-its-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-its-blue dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex size-2 rounded-full bg-blue-600"></span>
                        <span className="text-sm font-medium">New: AI-Powered Career Roadmap</span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl font-display mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Maximize Your Potential with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Holistic Development</span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        PPSDM KM ITS is the ultimate platform for student growth. Track your 9-dimensional progress, access curated learning resources, and prepare for a global career.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <Link href="/auth/register" className="rounded-lg bg-its-blue px-6 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 flex items-center gap-2">
                            Check Your Score
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                        <Link href="#features" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-its-blue transition-colors flex items-center gap-1">
                            Explore Features <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-16 flow-root sm:mt-24 animate-in fade-in zoom-in duration-1000 delay-500">
                        <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                            <div className="relative rounded-lg bg-slate-900 shadow-2xl overflow-hidden aspect-[16/9] border border-slate-800">
                                {/* Mockup content would go here - simplified for code */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                                    <div className="text-center">
                                        <div className="size-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                            <span className="material-symbols-outlined text-5xl text-blue-500">analytics</span>
                                        </div>
                                        <p className="text-slate-400 font-mono text-sm">Interactive Dashboard Preview</p>
                                    </div>
                                    {/* Abstract UI Elements */}
                                    <div className="absolute top-10 left-10 w-64 h-32 bg-slate-800 rounded-lg opacity-50"></div>
                                    <div className="absolute top-10 right-10 w-64 h-64 bg-slate-800 rounded-full opacity-30"></div>
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-12 bg-slate-800 rounded-full opacity-60"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0B1120]">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-its-blue">Everything you need</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Comprehensive Student Development
                        </p>
                        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                            Our platform covers 9 dimensions of holistic growth, providing tools for self-assessment, planning, and execution.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-its-blue/50 transition-all group">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white mb-4">
                                    <div className="size-10 flex items-center justify-center rounded-lg bg-its-blue/10 group-hover:bg-its-blue group-hover:text-white transition-all text-its-blue">
                                        <span className="material-symbols-outlined">radar</span>
                                    </div>
                                    Holistic Assessment
                                </dt>
                                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                    <p className="flex-auto">Measure your skills across logic, ethics, leadership, and more with our scientific radar charts.</p>
                                </dd>
                            </div>
                            <div className="flex flex-col bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-its-blue/50 transition-all group">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white mb-4">
                                    <div className="size-10 flex items-center justify-center rounded-lg bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white transition-all text-purple-600">
                                        <span className="material-symbols-outlined">auto_stories</span>
                                    </div>
                                    Smart Library
                                </dt>
                                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                    <p className="flex-auto">Access thousands of curated learning resources tailored to your specific development needs.</p>
                                </dd>
                            </div>
                            <div className="flex flex-col bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-its-blue/50 transition-all group">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white mb-4">
                                    <div className="size-10 flex items-center justify-center rounded-lg bg-green-500/10 group-hover:bg-green-600 group-hover:text-white transition-all text-green-600">
                                        <span className="material-symbols-outlined">emoji_events</span>
                                    </div>
                                    Gamified Portfolio
                                </dt>
                                <dd className="flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                    <p className="flex-auto">Earn badges, track achievements, and build a verified portfolio to showcase to future employers.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <div className="bg-its-dark py-24 sm:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/patterns/its-key-graphic.svg')] bg-cover bg-center" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dt className="text-base leading-7 text-white/80">Active Students</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">15,000+</dd>
                        </div>
                        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dt className="text-base leading-7 text-white/80">Resources Accessed</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">1.2M</dd>
                        </div>
                        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dt className="text-base leading-7 text-white/80">Career Goals Reached</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">94%</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        {/* Social Icons would go here */}
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Instagram</span>
                            <div className="size-6 bg-current rounded" />
                        </a>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                            &copy; 2024 PPSDM KM ITS. All rights reserved. Developed by ITS Students for ITS Students.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
