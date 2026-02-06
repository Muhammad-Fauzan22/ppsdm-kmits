'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface BoomerangVideoProps {
  opacity?: number;
  className?: string;
}

export function BoomerangVideo({ opacity = 0.3, className = '' }: BoomerangVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const directionRef = useRef(1); // 1 = forward, -1 = reverse
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [loadedFrames, setLoadedFrames] = useState(5); // Start with only 5 low-res frames
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  
  const TOTAL_FRAMES = 80;
  const FRAME_RATE = 30;
  const FRAME_PATH = '/assets/boomerang/A_seamless_hypnotic_1080p_202601282032_';
  const LOW_RES_PATH = '/assets/boomerang/low-res/A_seamless_hypnotic_1080p_202601282032_';
  
  // Progressive loading - add more frames over time
  useEffect(() => {
    if (loadedFrames >= TOTAL_FRAMES) return;
    
    const timer = setTimeout(() => {
      setLoadedFrames(prev => Math.min(prev + 5, TOTAL_FRAMES));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [loadedFrames]);
  
  // Load high-res images after low-res are loaded
  useEffect(() => {
    if (loadedFrames >= 20 && !isHighResLoaded) {
      setIsHighResLoaded(true);
    }
  }, [loadedFrames, isHighResLoaded]);
  
  useEffect(() => {
    // Preload images progressively - start with low-res
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    const loadFrame = (index: number) => {
      if (index >= loadedFrames) return;
      
      const img = document.createElement('img');
      img.onload = () => {
        loadedCount++;
        if (loadedCount === loadedFrames) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        // If loading fails, just show gradient fallback
        setError(true);
      };
      
      // Use low-res path for initial frames, high-res for later frames
      const useLowRes = index < 20 || !isHighResLoaded;
      const framePath = useLowRes ? LOW_RES_PATH : FRAME_PATH;
      img.src = `${framePath}${String(index).padStart(3, '0')}.jpg`;
      images[index] = img;
    };
    
    // Load frames up to current loadedFrames count
    for (let i = 0; i < loadedFrames; i++) {
      loadFrame(i);
    }
    
    let animationId: number;
    let lastTime = 0;
    const frameInterval = 1000 / FRAME_RATE;
    
    const animate = (currentTime: number) => {
      if (!canvasRef.current) return;
      
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx && images[frameRef.current]) {
          ctx.drawImage(images[frameRef.current], 0, 0, 1920, 1080);
          
          // Update frame
          frameRef.current += directionRef.current;
          
          // Reverse direction at ends
          if (frameRef.current >= loadedFrames - 1) {
            directionRef.current = -1;
          } else if (frameRef.current <= 0) {
            directionRef.current = 1;
          }
        }
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    if (isLoaded) {
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [loadedFrames, error, isLoaded, isHighResLoaded]);

  
  // Preload critical frames using Next.js Image with low priority
  useEffect(() => {
    const preloadCriticalFrames = () => {
      // Preload first few frames with low priority
      for (let i = 0; i < 5; i++) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = `${LOW_RES_PATH}${String(i).padStart(3, '0')}.jpg`;
        document.head.appendChild(link);
      }
    };
    
    preloadCriticalFrames();
  }, []);
  
  if (error || !isLoaded) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-its-blue/20 via-[#0A0F1A] to-brand-blue/10 ${className}`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-its-blue/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        {/* Blur-up placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-its-blue/10 to-transparent backdrop-blur-sm"></div>
      </div>
    );
  }
  
  return (
    <>
      {/* Hidden Next.js Image components for progressive loading with blur-up */}
      <div className="hidden">
        {Array.from({ length: Math.min(loadedFrames, 10) }).map((_, i) => (
          <Image
            key={i}
            src={`${LOW_RES_PATH}${String(i).padStart(3, '0')}.jpg`}
            alt=""
            width={192}
            height={108}
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCgAB//2Q=="
            placeholder="blur"
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        style={{ 
          opacity,
          mixBlendMode: 'screen'
        }}
      />
    </>
  );
}

export default BoomerangVideo;
