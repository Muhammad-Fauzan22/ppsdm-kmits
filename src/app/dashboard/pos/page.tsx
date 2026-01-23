"use client";

import React, { useEffect, useState } from 'react';
import EisenhowerMatrix from '@/components/pos/EisenhowerMatrix';
import FocusTimer from '@/components/pos/FocusTimer';
import DecisionJournal from '@/components/pos/DecisionJournal';
import HabitTracker from '@/components/pos/HabitTracker';
import PlayerHUD from '@/components/gamification/PlayerHUD';
import { usePOSStore } from '@/lib/stores/usePOSStore';
import Link from 'next/link';

export default function POSPage() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        usePOSStore.persist.rehydrate();
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-400 font-medium">Booting Personal OS...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Personal Operating System
                        </h1>
                        <p className="text-sm text-gray-500">v1.0 • Local Storage • Privacy Focused</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium text-sm"
                    >
                        ← Back to Campus
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-8">

                {/* Left Column: Focus & Decisions (4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Character Stats</h2>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Live</span>
                        </div>
                        <PlayerHUD />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Focus Core</h2>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Ready</span>
                        </div>
                        <FocusTimer />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Atomic Habits</h2>
                        </div>
                        <HabitTracker />
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Decision Engine</h2>
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <DecisionJournal />
                    </section>
                </div>

                {/* Right Column: Execution Matrix (8 cols) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Execution Matrix</h2>
                        <div className="text-sm text-gray-500">
                            Total Tasks: <span className="font-mono font-bold text-black">{usePOSStore.getState().tasks.length}</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <EisenhowerMatrix />
                    </div>
                </div>

            </main>
        </div>
    );
}
