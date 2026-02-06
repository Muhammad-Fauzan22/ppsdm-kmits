"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D canvas with SSR disabled to prevent build errors
// often caused by @react-three/drei components (like Text) trying to render on server.
const StewardshipCanvas = dynamic(() => import('@/components/stewardship/StewardshipCanvas'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-950 flex items-center justify-center text-slate-500">Loading 3D Experience...</div>
});

export default function StewardshipDashboard() {
    return (
        <div className="h-screen w-full bg-slate-950 overflow-hidden">
            <StewardshipCanvas />
        </div>
    );
}
