"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface PreloaderConfig {
  imagePaths: string[];
  priorityIndices?: number[];
  skipFrames?: number; // Load every Nth frame for performance
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
}

interface PreloaderReturn {
  images: (ImageBitmap | null)[];
  loadedCount: number;
  totalCount: number;
  isLoading: boolean;
  progress: number;
  priorityLoaded: boolean;
  error: string | null;
}

/**
 * Custom hook for preloading image sequences with ImageBitmap support
 * ImageBitmap provides better performance than HTMLImageElement for canvas rendering
 */
export function useImagePreloader({
  imagePaths,
  priorityIndices = [],
  skipFrames = 0,
  onProgress,
  onComplete,
}: PreloaderConfig): PreloaderReturn {
  const [images, setImages] = useState<(ImageBitmap | null)[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityLoaded, setPriorityLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadedCountRef = useRef(0);
  const priorityLoadedRef = useRef(0);
  const imageCacheRef = useRef<Map<string, ImageBitmap>>(new Map());

  const loadImage = useCallback(
    async (src: string, index: number): Promise<ImageBitmap> => {
      // Check cache first
      if (imageCacheRef.current.has(src)) {
        return imageCacheRef.current.get(src)!;
      }

      // Load image and convert to ImageBitmap
      const response = await fetch(src);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob, {
        imageOrientation: "from-image",
        premultiplyAlpha: "premultiply",
        colorSpaceConversion: "default",
      });

      // Cache the bitmap
      imageCacheRef.current.set(src, bitmap);
      
      return bitmap;
    },
    []
  );

  useEffect(() => {
    if (imagePaths.length === 0) return;

    const imageArray: (ImageBitmap | null)[] = new Array(imagePaths.length).fill(null);
    let cancelled = false;

    const loadImages = async () => {
      try {
        // Phase 1: Load priority frames first (for quick initial display)
        if (priorityIndices.length > 0) {
          const priorityPromises = priorityIndices.map(async (index) => {
            if (index >= 0 && index < imagePaths.length) {
              try {
                const bitmap = await loadImage(imagePaths[index], index);
                if (!cancelled) {
                  imageArray[index] = bitmap;
                  priorityLoadedRef.current++;
                  
                  if (priorityLoadedRef.current === priorityIndices.length) {
                    setPriorityLoaded(true);
                  }
                }
                return bitmap;
              } catch (err) {
                return null;
              }
            }
            return null;
          });

          await Promise.all(priorityPromises);
          
          if (!cancelled) {
            setImages([...imageArray]);
          }
        }

        // Phase 2: Load remaining frames in background
        let remainingIndices = imagePaths
          .map((_, index) => index)
          .filter((index) => !priorityIndices.includes(index));
        
        // Apply skipFrames for performance optimization
        if (skipFrames > 1) {
          remainingIndices = remainingIndices.filter(index => index % skipFrames === 0 || priorityIndices.includes(index));
        }

        // Load in batches to avoid overwhelming the browser
        const batchSize = 15; // Increased batch size for faster loading
        for (let i = 0; i < remainingIndices.length; i += batchSize) {
          if (cancelled) break;

          const batch = remainingIndices.slice(i, i + batchSize);
          
          await Promise.all(
            batch.map(async (index) => {
              try {
                const bitmap = await loadImage(imagePaths[index], index);
                if (!cancelled) {
                  imageArray[index] = bitmap;
                  loadedCountRef.current++;
                  
                  setLoadedCount(loadedCountRef.current + priorityIndices.length);
                  setImages([...imageArray]);
                  
                  if (onProgress) {
                    onProgress(
                      loadedCountRef.current + priorityIndices.length,
                      imagePaths.length
                    );
                  }
                }
              } catch (err) {
                }
            })
          );
        }

        if (!cancelled) {
          setIsLoading(false);
          if (onComplete) {
            onComplete();
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load images");
          setIsLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      cancelled = true;
      // Clean up ImageBitmaps to free memory
      imageCacheRef.current.forEach((bitmap) => {
        bitmap.close();
      });
      imageCacheRef.current.clear();
    };
  }, [imagePaths, priorityIndices, loadImage, onProgress, onComplete]);

  return {
    images,
    loadedCount,
    totalCount: imagePaths.length,
    isLoading,
    progress: imagePaths.length > 0 ? (loadedCount / imagePaths.length) * 100 : 0,
    priorityLoaded,
    error,
  };
}

/**
 * Generate frame paths from a pattern
 */
export function generateFramePaths(
  basePath: string,
  prefix: string,
  startIndex: number,
  endIndex: number,
  extension: string = "jpg",
  padding: number = 3
): string[] {
  const paths: string[] = [];
  
  for (let i = startIndex; i <= endIndex; i++) {
    const paddedIndex = i.toString().padStart(padding, "0");
    paths.push(`${basePath}/${prefix}${paddedIndex}.${extension}`);
  }
  
  return paths;
}

/**
 * Get priority frame indices for initial loading
 * Returns indices at regular intervals for smooth preview
 */
export function getPriorityIndices(
  totalFrames: number,
  priorityCount: number = 10
): number[] {
  const interval = Math.floor(totalFrames / priorityCount);
  const indices: number[] = [];
  
  for (let i = 0; i < totalFrames; i += interval) {
    indices.push(i);
  }
  
  // Always include first and last frame
  if (!indices.includes(0)) indices.unshift(0);
  if (!indices.includes(totalFrames - 1)) indices.push(totalFrames - 1);
  
  return indices;
}

export default useImagePreloader;
