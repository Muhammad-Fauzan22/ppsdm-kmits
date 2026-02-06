"use client";

import React from 'react';
import MandalaCanvas from '@/components/mandala/MandalaCanvas';

export default function MandalaDashboard() {
    return (
        <div className="h-screen w-full bg-slate-950 overflow-hidden">
            <MandalaCanvas />
        </div>
    );
}
