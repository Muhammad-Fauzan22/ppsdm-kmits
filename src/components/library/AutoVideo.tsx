"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoScriptScene {
    visual: string;
    audio: string;
}

export function AutoVideo({ script }: { script: { scenes: VideoScriptScene[] } }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const synth = useRef<SpeechSynthesis | null>(null);
    const utterance = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis;
        }
        return () => {
            if (synth.current) synth.current.cancel();
        };
    }, []);

    const playScene = (index: number) => {
        if (!script?.scenes || index >= script.scenes.length || !synth.current) {
            setIsPlaying(false);
            return;
        }

        const scene = script.scenes[index];

        // Create Utterance
        const u = new SpeechSynthesisUtterance(scene.audio);
        u.lang = 'en-US'; // Default to English, can auto-detect
        u.rate = 1.0;

        u.onend = () => {
            if (index + 1 < script.scenes.length) {
                setCurrentSceneIndex(index + 1);
                playScene(index + 1);
            } else {
                setIsPlaying(false);
            }
        };

        utterance.current = u;
        synth.current.cancel();
        synth.current.speak(u);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (isPlaying) {
            synth.current?.pause();
            setIsPlaying(false);
        } else {
            if (synth.current?.paused) {
                synth.current.resume();
                setIsPlaying(true);
            } else {
                playScene(currentSceneIndex);
            }
        }
    };

    if (!script?.scenes) return <div className="p-8 text-center">No video script available.</div>;

    const currentScene = script.scenes[currentSceneIndex];

    return (
        <div className="flex flex-col gap-4">
            {/* Video Player Display */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl flex items-center justify-center p-8 text-center ring-4 ring-slate-900/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-50"></div>

                {/* Visual Content (Simulated) */}
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                        {currentScene?.visual || "Scene Visual"}
                    </h2>
                </div>

                {/* Subtitles */}
                <div className="absolute bottom-8 left-0 right-0 px-8 text-center z-20">
                    <span className="bg-black/70 text-white/90 px-4 py-2 rounded-lg text-lg font-medium inline-block backdrop-blur-sm">
                        {currentScene?.audio}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <Button onClick={togglePlay} variant="default" className={isPlaying ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"}>
                        {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
                        {isPlaying ? "Pause" : "Play Video"}
                    </Button>
                    <div className="text-sm font-medium text-slate-500 ml-2">
                        Scene {currentSceneIndex + 1} / {script.scenes.length}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Volume2 className="text-slate-400" size={18} />
                </div>
            </div>
        </div>
    );
}
