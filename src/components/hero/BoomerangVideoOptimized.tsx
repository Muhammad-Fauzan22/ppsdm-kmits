'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface BoomerangVideoOptimizedProps {
  opacity?: number;
  className?: string;
}

export function BoomerangVideoOptimized({ opacity = 0.3, className = '' }: BoomerangVideoOptimizedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const directionRef = useRef(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [loadedFrames, setLoadedFrames] = useState(5);
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  
  const TOTAL_FRAMES = 80;
  const FRAME_RATE = 30;
  const FRAME_PATH = '/assets/boomerang/A_seamless_hypnotic_1080p_202601282032_';
  const LOW_RES_PATH = '/assets/boomerang/low-res/A_seamless_hypnotic_1080p_202601282032_';
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    );
    
    observer.observe(container);
    
    return () => observer.disconnect();
  }, []);
  
  // Progressive loading - add more frames over time
  useEffect(() => {
    if (!shouldLoad || loadedFrames >= TOTAL_FRAMES) return;
    
    const timer = setTimeout(() => {
      setLoadedFrames(prev => Math.min(prev + 5, TOTAL_FRAMES));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [loadedFrames, shouldLoad]);
  
  // Load high-res images after low-res are loaded
  useEffect(() => {
    if (loadedFrames >= 20 && !isHighResLoaded) {
      setIsHighResLoaded(true);
    }
  }, [loadedFrames, isHighResLoaded]);
  
  // Animation loop - only run when in viewport
  useEffect(() => {
    if (!isInViewport || !isLoaded || error) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let lastTime = 0;
    const frameInterval = 1000 / FRAME_RATE;
    
    const images: HTMLImageElement[] = [];
    
    // Load images progressively
    const loadFrame = (index: number) => {
      if (index >= loadedFrames) return;
      
      const img = document.createElement('img');
      img.onload = () => {
        if (index === loadedFrames - 1) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        setError(true);
      };
      
      const useLowRes = index < 20 || !isHighResLoaded;
      const framePath = useLowRes ? LOW_RES_PATH : FRAME_PATH;
      img.src = `${framePath}${String(index).padStart(3, '0')}.jpg`;
      images[index] = img;
    };
    
    for (let i = 0; i < loadedFrames; i++) {
      loadFrame(i);
    }
    
    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        // Draw current frame
        const currentImage = images[frameRef.current];
        if (currentImage && currentImage.complete) {
          ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
        }
        
        // Update frame counter
        frameRef.current += directionRef.current;
        
        // Reverse direction at ends
        if (frameRef.current >= loadedFrames - 1) {
          frameRef.current = loadedFrames - 1;
          directionRef.current = -1;
        } else if (frameRef.current <= 0) {
          frameRef.current = 0;
          directionRef.current = 1;
        }
        
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isInViewport, loadedFrames, isLoaded, isHighResLoaded, error]);
  
  // Preload critical frames
  useEffect(() => {
    if (!shouldLoad) return;
    
    const preloadCriticalFrames = () => {
      for (let i = 0; i < 5; i++) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = `${LOW_RES_PATH}${String(i).padStart(3, '0')}.jpg`;
        document.head.appendChild(link);
      }
    };
    
    preloadCriticalFrames();
  }, [shouldLoad]);
  
  // Don't render anything until we should start loading
  if (!shouldLoad) {
    return (
      <div 
        ref={containerRef}
        className={`absolute inset-0 bg-gradient-to-br from-its-blue/20 via-[#0A0F1A] to-brand-blue/10 ${className}`}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-its-blue/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    );
  }
  
  if (error || !isLoaded) {
    return (
      <div 
        ref={containerRef}
        className={`absolute inset-0 bg-gradient-to-br from-its-blue/20 via-[#0A0F1A] to-brand-blue/10 ${className}`}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-its-blue/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-its-blue/10 to-transparent backdrop-blur-sm"></div>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Hidden Next.js Image components for progressive loading */}
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
    </div>
  );
}

export default BoomerangVideoOptimized;
