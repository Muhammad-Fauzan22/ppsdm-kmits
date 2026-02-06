'use client';

import React, { memo, useRef, useEffect, useState, useCallback } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  overscanCount?: number;
}

interface ListRowProps {
  index: number;
  style: React.CSSProperties;
  children: React.ReactNode;
}

const ListRow = memo(function ListRow({ index, style, children }: ListRowProps) {
  return (
    <div key={index} style={style}>
      {children}
    </div>
  );
});

function VirtualizedListInner<T>({
  items,
  itemHeight,
  renderItem,
  className = '',
  overscanCount = 5,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [containerHeight, setContainerHeight] = useState(400);

  // Calculate visible items based on scroll position
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
    const visibleCount = Math.ceil(clientHeight / itemHeight) + overscanCount * 2;
    const end = Math.min(items.length, start + visibleCount);
    
    setVisibleRange({ start, end });
    setContainerHeight(clientHeight);
  }, [items.length, itemHeight, overscanCount]);

  // Initial calculation and resize handler
  useEffect(() => {
    calculateVisibleRange();
    
    const handleResize = () => {
      calculateVisibleRange();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateVisibleRange]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    calculateVisibleRange();
  }, [calculateVisibleRange]);

  const totalHeight = items.length * itemHeight;
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full overflow-auto ${className}`}
      onScroll={handleScroll}
      style={{ height: '100%' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, idx) => {
          const actualIndex = visibleRange.start + idx;
          const style: React.CSSProperties = {
            position: 'absolute',
            top: actualIndex * itemHeight,
            height: itemHeight,
            left: 0,
            right: 0,
          };
          
          return (
            <ListRow 
              key={actualIndex} 
              index={actualIndex} 
              style={style}
            >
              {renderItem(item, actualIndex, style)}
            </ListRow>
          );
        })}
      </div>
    </div>
  );
}

export const VirtualizedList = memo(VirtualizedListInner) as <T>(
  props: VirtualizedListProps<T>
) => React.ReactElement;

// Hook for virtualized data with pagination
export function useVirtualizedData<T>(data: T[], pageSize: number = 50) {
  const [visibleCount, setVisibleCount] = React.useState(pageSize);
  
  const loadMore = React.useCallback(() => {
    setVisibleCount(prev => Math.min(prev + pageSize, data.length));
  }, [data.length, pageSize]);

  const visibleData = React.useMemo(() => {
    return data.slice(0, visibleCount);
  }, [data, visibleCount]);

  const hasMore = visibleCount < data.length;

  return {
    data: visibleData,
    loadMore,
    hasMore,
    totalCount: data.length,
    visibleCount,
  };
}

export default VirtualizedList;
