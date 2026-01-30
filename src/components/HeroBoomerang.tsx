"use client";

import React, { useRef, useEffect, useState } from 'react';

// Assumes images are named consistently like A_seamless_hypnotic_1080p_202601282032_000.jpg to ...079.jpg
// We will generate the paths dynamically.
// Total frames found: 80 (000 to 079)

const TOTAL_FRAMES = 80;
const FPS = 24;
const FRAME_DURATION = 1000 / FPS;

export default function BoomerangHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Preload images
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadNext = (index: number) => {
            if (index >= TOTAL_FRAMES) {
                setImages(loadedImages);
                setIsLoaded(true);
                return;
            }

            const img = new Image();
            // Pad index with zeros (e.g. 0 -> 000, 10 -> 010)
            const paddedIndex = index.toString().padStart(3, '0');
            img.src = `/assets/boomerang/A_seamless_hypnotic_1080p_202601282032_${paddedIndex}.jpg`;

            img.onload = () => {
                loadedImages[index] = img;
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImages(loadedImages);
                    setIsLoaded(true);
                }
            };
            // Currently loading all in parallel might be heavy, but for 80 frames it's okay-ish.
            // Better to just loop.
        };

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            loadNext(i);
        }

    }, []);

    useEffect(() => {
        if (!isLoaded || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions (assuming 1080p from filename but responsive)
        // We'll let CSS handle the display size, but set internal resolution
        canvas.width = images[0].width;
        canvas.height = images[0].height;

        let frameIndex = 0;
        let direction = 1; // 1 for forward, -1 for backward
        let animationFrameId: number;
        let lastTime = 0;

        const render = (time: number) => {
            if (time - lastTime >= FRAME_DURATION) {
                const img = images[frameIndex];
                if (img) {
                    ctx.drawImage(img, 0, 0);
                }

                // Update frame index for boomerang effect
                frameIndex += direction;

                if (frameIndex >= TOTAL_FRAMES - 1) {
                    frameIndex = TOTAL_FRAMES - 1;
                    direction = -1;
                } else if (frameIndex <= 0) {
                    frameIndex = 0;
                    direction = 1;
                }

                lastTime = time;
            }
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isLoaded, images]);

    if (!isLoaded) {
        return <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500">Loading Visuals...</div>;
    }

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
        />
    );
}
