"use client";

import React from 'react';
import StewardshipCanvas from '@/components/stewardship/StewardshipCanvas';

export default function StewardshipDashboard() {
    return (
        <div className="h-screen w-full bg-slate-950 overflow-hidden">
            <StewardshipCanvas />
        </div>
    );
}
