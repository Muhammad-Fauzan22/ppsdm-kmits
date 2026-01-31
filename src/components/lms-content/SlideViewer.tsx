
"use client";

import React from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideViewerProps {
    embedUrl: string;
}

export function SlideViewer({ embedUrl }: SlideViewerProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-background rounded-xl border border-border group">
            <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
                <iframe
                    src={embedUrl}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                />
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="bg-background/80 backdrop-blur shadow-sm" onClick={toggleFullscreen}>
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
