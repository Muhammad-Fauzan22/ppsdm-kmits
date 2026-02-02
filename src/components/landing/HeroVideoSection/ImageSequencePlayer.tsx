"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImageSequencePlayerProps {
  images: (ImageBitmap | null)[];
  currentFrame: number;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain" | "fill";
}

/**
 * Canvas-based image sequence player with GPU acceleration and double buffering
 * Renders frames smoothly using requestAnimationFrame timing with frame caching
 */
export function ImageSequencePlayer({
  images,
  currentFrame,
  className,
  width = 1920,
  height = 1080,
  objectFit = "cover",
}: ImageSequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const frameCacheRef = useRef<Map<number, ImageBitmap>>(new Map());
  const lastFrameRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle responsive sizing
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width * (window.devicePixelRatio || 1),
        height: rect.height * (window.devicePixelRatio || 1),
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Draw current frame to canvas with double buffering using requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!ctx || !canvas) return;

    const drawFrame = () => {
      const image = images[currentFrame];
      if (!image) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      // Skip if frame hasn't changed
      if (currentFrame === lastFrameRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      lastFrameRef.current = currentFrame;

      // Check if frame is already cached
      if (frameCacheRef.current.has(currentFrame)) {
        const cachedFrame = frameCacheRef.current.get(currentFrame);
        if (cachedFrame) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(cachedFrame, 0, 0);
          rafRef.current = requestAnimationFrame(drawFrame);
          return;
        }
      }

      // Create offscreen canvas for double buffering
      if (!offscreenCanvasRef.current || 
          offscreenCanvasRef.current.width !== canvas.width || 
          offscreenCanvasRef.current.height !== canvas.height) {
        offscreenCanvasRef.current = new OffscreenCanvas(canvas.width, canvas.height);
      }

      const offscreenCtx = offscreenCanvasRef.current.getContext("2d");
      if (!offscreenCtx) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      // Clear offscreen canvas
      offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions based on objectFit
      let sx = 0,
        sy = 0,
        sw = image.width,
        sh = image.height;
      let dx = 0,
        dy = 0,
        dw = canvas.width,
        dh = canvas.height;

      if (objectFit === "cover") {
        const imageAspect = image.width / image.height;
        const canvasAspect = canvas.width / canvas.height;

        if (imageAspect > canvasAspect) {
          // Image is wider - crop sides
          sw = image.height * canvasAspect;
          sx = (image.width - sw) / 2;
        } else {
          // Image is taller - crop top/bottom
          sh = image.width / canvasAspect;
          sy = (image.height - sh) / 2;
        }
      } else if (objectFit === "contain") {
        const imageAspect = image.width / image.height;
        const canvasAspect = canvas.width / canvas.height;

        if (imageAspect > canvasAspect) {
          // Image wider - fit width
          dh = canvas.width / imageAspect;
          dy = (canvas.height - dh) / 2;
        } else {
          // Image taller - fit height
          dw = canvas.height * imageAspect;
          dx = (canvas.width - dw) / 2;
        }
      }

      // Draw with high quality to offscreen canvas
      offscreenCtx.imageSmoothingEnabled = true;
      offscreenCtx.imageSmoothingQuality = "high";
      offscreenCtx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

      // Cache the rendered frame
      const bitmap = offscreenCanvasRef.current.transferToImageBitmap();
      frameCacheRef.current.set(currentFrame, bitmap);

      // Draw to main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0);

      // Clean up old cache entries to prevent memory leaks
      if (frameCacheRef.current.size > 100) {
        const oldestKey = frameCacheRef.current.keys().next().value;
        if (oldestKey !== undefined) {
          const oldestBitmap = frameCacheRef.current.get(oldestKey);
          if (oldestBitmap) {
            oldestBitmap.close();
          }
          frameCacheRef.current.delete(oldestKey);
        }
      }

      rafRef.current = requestAnimationFrame(drawFrame);
    };

    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [images, currentFrame, objectFit]);

  // Clean up cache on unmount
  useEffect(() => {
    return () => {
      frameCacheRef.current.forEach((bitmap) => {
        bitmap.close();
      });
      frameCacheRef.current.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width || width}
        height={dimensions.height || height}
        className="absolute inset-0 w-full h-full"
        style={{
          transform: "translateZ(0)", // Force GPU acceleration
          willChange: "contents",
        }}
      />
    </div>
  );
}

export default ImageSequencePlayer;
