
"use client";

import React from "react";
import YouTube from "react-youtube";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoPlayerProps {
    videoId: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
    const [isLoading, setIsLoading] = React.useState(true);

    const opts = {
        height: "100%",
        width: "100%",
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
        },
    };

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/10 border border-border/50 shadow-sm group">
            {isLoading && (
                <Skeleton className="absolute inset-0 w-full h-full z-10 animate-pulse bg-muted" />
            )}
            <YouTube
                videoId={videoId}
                opts={opts}
                className="absolute inset-0 w-full h-full"
                onReady={() => setIsLoading(false)}
            />
        </div>
    );
}
