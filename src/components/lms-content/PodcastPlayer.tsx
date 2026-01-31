
"use client";

import React from "react";
import AudioPlayer from "react-h5-audio-player";
import { convertDriveToDirectLink } from "@/lib/utils";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PodcastPlayerProps {
    src: string;
    title: string;
}

export function PodcastPlayer({ src, title }: PodcastPlayerProps) {
    const [isVisible, setIsVisible] = React.useState(true);
    const directUrl = convertDriveToDirectLink(src);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                {/* Info */}
                <div className="hidden md:flex items-center gap-3 w-1/4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <Mic className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-sm font-semibold truncate text-foreground">{title}</h4>
                        <p className="text-xs text-muted-foreground">Podcast Mode</p>
                    </div>
                </div>

                {/* Player */}
                <div className="flex-1 max-w-2xl">
                    <AudioPlayer
                        autoPlay={false}
                        src={directUrl}
                        className="!bg-transparent !shadow-none !p-0 custom-audio-player"
                        layout="horizontal-reverse"
                        customAdditionalControls={[]}
                        customVolumeControls={[]}
                        showJumpControls={false}
                    />
                </div>

                {/* Close */}
                <div className="flex items-center justify-end w-auto md:w-1/4">
                    <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <style jsx global>{`
        .custom-audio-player .rhap_time {
            color: var(--muted-foreground);
            font-size: 11px;
        }
        .custom-audio-player .rhap_progress-filled {
            background-color: var(--primary);
        }
        .custom-audio-player .rhap_button-clear {
            color: var(--foreground);
        }
        .custom-audio-player .rhap_button-clear:hover {
            color: var(--primary);
        }
      `}</style>
        </div>
    );
}
