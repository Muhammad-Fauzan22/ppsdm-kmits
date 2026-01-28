"use client";

import React, { useEffect, useRef, useState } from 'react';

interface HeroImageSequenceProps {
    className?: string;
    frameCount: number;
    folderPath: string;
    fileNamePrefix: string;
    fps?: number;
}

export default function HeroImageSequence({
    className,
    frameCount,
    folderPath,
    fileNamePrefix,
    fps = 24
}: HeroImageSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    // 1. Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        // Determine number padding based on filename (e.g. 000, 001)
        // Adjust this logic if filenames differ. The provided files are 000, 001, etc. (3 digits)
        const pad = (num: number) => num.toString().padStart(3, '0');

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = `${folderPath}/${fileNamePrefix}${pad(i)}.jpg`;
            img.onload = () => {
                loadedCount++;
                setProgress(Math.round((loadedCount / frameCount) * 100));
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };
            imgArray.push(img);
        }
        setImages(imgArray);
    }, [frameCount, folderPath, fileNamePrefix]);

    // 2. Draw Loop
    useEffect(() => {
        if (!isLoaded || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions match the first image or container
        // Note: For responsiveness, we usually rely on CSS, but canvas internal resolution matters.
        // We'll set it to the image natural size for best quality.
        canvas.width = images[0].naturalWidth;
        canvas.height = images[0].naturalHeight;

        let frameIndex = 0;
        let lastTime = 0;
        const interval = 1000 / fps; // e.g. 1000/24 = ~41.6ms

        let animationFrameId: number;

        const render = (time: number) => {
            const deltaTime = time - lastTime;

            if (deltaTime > interval) {
                // Draw current frame
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(images[frameIndex], 0, 0);

                // Advance frame
                frameIndex = (frameIndex + 1) % frameCount; // Seamless loop
                lastTime = time - (deltaTime % interval); // Adjust for drift
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isLoaded, images, fps, frameCount]);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0A0F1A] z-10">
                    {/* Optional: Loading spinner or blurred poster */}
                    <div className="w-full h-full absolute inset-0 bg-cover bg-center opacity-50 blur-xl transition-opacity duration-500"
                        style={{ backgroundImage: `url(${folderPath}/${fileNamePrefix}040.jpg)` }}></div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
}
