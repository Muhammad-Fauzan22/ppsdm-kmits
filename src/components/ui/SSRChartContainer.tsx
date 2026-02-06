'use client';

import { useEffect, useState, ReactNode } from 'react';

interface SSRChartContainerProps {
  children: ReactNode;
  height?: number | string;
  className?: string;
}

export function SSRChartContainer({ 
  children, 
  height = 300, 
  className = '' 
}: SSRChartContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR, render with explicit pixel height
  // After hydration, allow responsive behavior
  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      style={{ height: containerHeight, width: '100%' }}
      className={className}
    >
      {mounted ? children : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/30 rounded-lg">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <span className="text-sm">Loading chart...</span>
          </div>
        </div>
      )}
    </div>
  );
}
