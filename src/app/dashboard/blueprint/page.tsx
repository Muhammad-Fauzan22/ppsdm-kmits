"use client";

import React from 'react';
import BlueprintCanvas from '@/components/blueprint/BlueprintCanvas';
import BlueprintSidebar from '@/components/blueprint/BlueprintSidebar';

export default function BlueprintDashboard() {
    return (
        <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
            {/* Main Interactive Canvas */}
            <div className="flex-1 relative">
                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        ENGINEERING <span className="text-cyan-500">BLUEPRINT</span>
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-1">
                        System Architecture & Data Flow Visualization
                    </p>
                </div>
                <BlueprintCanvas />
            </div>

            {/* Right Sidebar */}
            <div className="w-80 h-full z-30 shadow-2xl">
                <BlueprintSidebar />
            </div>
        </div>
    );
}
