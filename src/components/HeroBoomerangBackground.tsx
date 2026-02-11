"use client";

import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 80;
const FRAME_PATH = '/assets/boomerang/A_seamless_hypnotic_1080p_202601282032_';
const FRAME_RATE = 30; // fps

export function HeroBoomerangBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameRef = useRef(0);
  const directionRef = useRef(1); // 1 = forward, -1 = reverse
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    
    // Preload images
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];
      
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = `${FRAME_PATH}${String(i).padStart(3, '0')}.jpg`;
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load frame ${i}`));
        });
        imagePromises.push(promise);
      }

      try {
        const images = await Promise.all(imagePromises);
        if (isMounted) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      } catch (error) {
        // Continue with whatever loaded
        if (isMounted && imagesRef.current.length > 0) {
          setIsLoaded(true);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop with frame rate control
    let animationId: number;
    const frameInterval = 1000 / FRAME_RATE;

    const animate = (currentTime: number) => {
      if (currentTime - lastTimeRef.current >= frameInterval) {
        const currentImage = imagesRef.current[frameRef.current];
        
        if (currentImage && canvas && ctx) {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw image with cover style
          const imgAspect = currentImage.width / currentImage.height;
          const canvasAspect = canvas.width / canvas.height;
          
          let drawWidth = canvas.width;
          let drawHeight = canvas.width / imgAspect;
          
          if (drawHeight < canvas.height) {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgAspect;
          }
          
          const x = (canvas.width - drawWidth) / 2;
          const y = (canvas.height - drawHeight) / 2;
          
          ctx.drawImage(currentImage, x, y, drawWidth, drawHeight);
        }

        // Update frame for boomerang effect
        frameRef.current += directionRef.current;
        
        if (frameRef.current >= TOTAL_FRAMES - 1) {
          directionRef.current = -1;
        } else if (frameRef.current <= 0) {
          directionRef.current = 1;
        }

        lastTimeRef.current = currentTime;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isLoaded]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/60 via-[#0A0F1A]/40 to-[#0A0F1A]/80 z-10" />
      
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 z-20 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Canvas for Boomerang Video */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-40' : 'opacity-0'}`}
        style={{ 
          mixBlendMode: 'lighten',
          filter: 'blur(2px) saturate(1.2)',
        }}
      />
      
      {/* Fallback Gradient (shown while loading) */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#135bec]/30 via-[#0A0F1A] to-[#00d4ff]/20 animate-pulse" />
      )}
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#135bec]/10 rounded-full blur-[120px] pointer-events-none z-5" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00d4ff]/10 rounded-full blur-[150px] pointer-events-none z-5" />
    </div>
  );
}
