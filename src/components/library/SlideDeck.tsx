"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Presentation, MonitorPlay } from "lucide-react";

export function SlideDeck({ slides }: { slides: any[] }) {
    const [current, setCurrent] = useState(0);

    if (!slides || slides.length === 0) return <div className="p-8 text-center text-slate-400">No slides generated.</div>;

    return (
        <div className="space-y-6">
            {/* Screen Area */}
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl flex flex-col p-8 md:p-12 text-white relative overflow-hidden ring-4 ring-slate-900/10">

                {/* Slide Content Animation Container */}
                <div key={current} className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right duration-500">
                    <h2 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-8 border-b border-white/20 pb-6 leading-tight">
                        {slides[current].title}
                    </h2>
                    <ul className="space-y-4 md:space-y-6 pl-2">
                        {slides[current].bullets?.map((point: string, i: number) => (
                            <li key={i} className="flex items-start text-lg md:text-2xl text-slate-200 font-light tracking-wide">
                                <span className="mr-4 text-blue-400 mt-1.5 text-sm">➤</span> {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer Slide */}
                <div className="absolute bottom-6 right-8 text-slate-500 text-sm font-mono tracking-widest flex items-center gap-4">
                    <span>PPSDM Quantum Deck</span>
                    <span className="bg-white/10 px-2 py-1 rounded text-white/50">{current + 1} / {slides.length}</span>
                </div>

                {/* Gloss Effect */}
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-white/5 rotate-45 pointer-events-none"></div>
            </div>

            {/* Controls & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm">
                    <h4 className="text-xs font-bold text-yellow-700 uppercase mb-2 tracking-wider flex items-center gap-2">
                        <Presentation size={14} /> Speaker Notes:
                    </h4>
                    <p className="text-slate-800 text-base leading-relaxed font-medium">
                        &quot;{slides[current].speaker_notes}&quot;
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-center">
                    <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
                        <Button variant="ghost" size="icon" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
                            <ChevronLeft className="size-6" />
                        </Button>
                        <div className="text-sm font-bold text-slate-600">Slide {current + 1}</div>
                        <Button variant="ghost" size="icon" onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1}>
                            <ChevronRight className="size-6" />
                        </Button>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                        <MonitorPlay className="mr-2 size-4" /> Present Full Screen
                    </Button>
                </div>
            </div>
        </div>
    );
}
