'use client';

import { useEffect, useRef, useState } from 'react';

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
  
  const TOTAL_FRAMES = 80;
  const FRAME_RATE = 30;
  const FRAME_PATH = '/assets/boomerang/A_seamless_hypnotic_1080p_202601282032_';
  
  useEffect(() => {
    // Preload images
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        // If loading fails, just show gradient fallback
        setError(true);
      };
      img.src = `${FRAME_PATH}${String(i).padStart(3, '0')}.jpg`;
      images.push(img);
    }
    
    let animationId: number;
    let lastTime = 0;
    const frameInterval = 1000 / FRAME_RATE;
    
    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        
        if (canvas && ctx && images[frameRef.current] && !error) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(images[frameRef.current], 0, 0, canvas.width, canvas.height);
          
          frameRef.current += directionRef.current;
          
          // Boomerang logic: forward then reverse
          if (frameRef.current >= TOTAL_FRAMES - 1) {
            directionRef.current = -1;
          } else if (frameRef.current <= 0) {
            directionRef.current = 1;
          }
        }
        
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [error]);
  
  if (error || !isLoaded) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-its-blue/20 via-[#0A0F1A] to-brand-blue/10 ${className}`}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-its-blue/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    );
  }
  
  return (
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
  );
}

export default BoomerangVideo;