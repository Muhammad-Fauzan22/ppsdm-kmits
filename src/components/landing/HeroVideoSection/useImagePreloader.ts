"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface PreloaderConfig {
  imagePaths: string[];
  priorityIndices?: number[];
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
}

interface PreloaderReturn {
  images: (HTMLImageElement | null)[];
  loadedCount: number;
  totalCount: number;
  isLoading: boolean;
  progress: number;
  priorityLoaded: boolean;
  error: string | null;
}

/**
 * Custom hook for preloading image sequences with priority support
 * Loads critical frames first for faster initial display
 */
export function useImagePreloader({
  imagePaths,
  priorityIndices = [],
  onProgress,
  onComplete,
}: PreloaderConfig): PreloaderReturn {
  const [images, setImages] = useState<(HTMLImageElement | null)[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityLoaded, setPriorityLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadedCountRef = useRef(0);
  const priorityLoadedRef = useRef(0);

  const loadImage = useCallback(
    (src: string, index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          resolve(img);
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${src}`));
        };
        
        img.src = src;
      });
    },
    []
  );

  useEffect(() => {
    if (imagePaths.length === 0) return;

    const imageArray: (HTMLImageElement | null)[] = new Array(imagePaths.length).fill(null);
    let cancelled = false;

    const loadImages = async () => {
      try {
        // Phase 1: Load priority frames first (for quick initial display)
        if (priorityIndices.length > 0) {
          const priorityPromises = priorityIndices.map(async (index) => {
            if (index >= 0 && index < imagePaths.length) {
              const img = await loadImage(imagePaths[index], index);
              if (!cancelled) {
                imageArray[index] = img;
                priorityLoadedRef.current++;
                
                if (priorityLoadedRef.current === priorityIndices.length) {
                  setPriorityLoaded(true);
                }
              }
              return img;
            }
            return null;
          });

          await Promise.all(priorityPromises);
          
          if (!cancelled) {
            setImages([...imageArray]);
          }
        }

        // Phase 2: Load remaining frames in background
        const remainingIndices = imagePaths
          .map((_, index) => index)
          .filter((index) => !priorityIndices.includes(index));

        // Load in batches to avoid overwhelming the browser
        const batchSize = 10;
        for (let i = 0; i < remainingIndices.length; i += batchSize) {
          if (cancelled) break;

          const batch = remainingIndices.slice(i, i + batchSize);
          
          await Promise.all(
            batch.map(async (index) => {
              try {
                const img = await loadImage(imagePaths[index], index);
                if (!cancelled) {
                  imageArray[index] = img;
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
                console.warn(`Failed to load frame ${index}:`, err);
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
