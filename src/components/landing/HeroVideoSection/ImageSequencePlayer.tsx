"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImageSequencePlayerProps {
  images: (HTMLImageElement | null)[];
  currentFrame: number;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain" | "fill";
}

/**
 * Canvas-based image sequence player with GPU acceleration
 * Renders frames smoothly using requestAnimationFrame timing
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

  // Draw current frame to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    const image = images[currentFrame];

    if (!ctx || !canvas || !image) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    // Draw with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }, [images, currentFrame, objectFit]);

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
