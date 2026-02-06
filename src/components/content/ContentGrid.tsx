'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ContentCard, ContentCardSkeleton } from './ContentCard';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  type: 'video' | 'article' | 'course' | 'job' | 'event' | 'research';
  duration?: string;
  dimensions: string[];
  qualityScore: number;
  relevanceScore: number;
  author?: string;
  source: string;
  publishedAt?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

interface ContentRowProps {
  title: string;
  subtitle?: string;
  contents: ContentItem[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function ContentRow({
  title,
  subtitle,
  contents,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollEl.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn('relative group', className)}>
      {/* Header */}
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              'p-2 rounded-full bg-gray-800/80 text-white transition-all',
              !canScrollLeft && 'opacity-30 cursor-not-allowed',
              canScrollLeft && 'hover:bg-gray-700'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              'p-2 rounded-full bg-gray-800/80 text-white transition-all',
              !canScrollRight && 'opacity-30 cursor-not-allowed',
              canScrollRight && 'hover:bg-gray-700'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {contents.map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 w-[280px] sm:w-[320px]"
          >
            <ContentCard
              content={content}
              onClick={() => console.log('Clicked:', content.id)}
              onSave={() => console.log('Saved:', content.id)}
              onShare={() => console.log('Shared:', content.id)}
            />
          </motion.div>
        ))}
        
        {/* Load More Trigger */}
        {hasMore && (
          <div className="flex-shrink-0 w-[280px] sm:w-[320px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
            ) : (
              <button
                onClick={onLoadMore}
                className="px-6 py-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Masonry Grid for Browse View
interface ContentMasonryGridProps {
  contents: ContentItem[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function ContentMasonryGrid({
  contents,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className,
}: ContentMasonryGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasMore && onLoadMore) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );

      if (loadMoreRef.current) {
        observerRef.current.observe(loadMoreRef.current);
      }
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  // Split contents into columns for masonry effect
  const columns: ContentItem[][] = [[], [], [], []];
  contents.forEach((content, index) => {
    columns[index % 4].push(content);
  });

  return (
    <div className={cn('px-4 sm:px-6 lg:px-8', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {column.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (colIndex + index) * 0.05 }}
              >
                <ContentCard
                  content={content}
                  onClick={() => console.log('Clicked:', content.id)}
                  onSave={() => console.log('Saved:', content.id)}
                  onShare={() => console.log('Shared:', content.id)}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Load More Observer */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex justify-center py-8"
        >
          {isLoading && (
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}

// Loading Skeleton for Grid
export function ContentGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8">
      {Array.from({ length: count }).map((_, index) => (
        <ContentCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Empty State
export function ContentEmptyState({
  title = 'No content found',
  description = 'Try adjusting your filters or search query',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
        <svg
          className="w-12 h-12 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md">{description}</p>
    </div>
  );
}

export default ContentRow;
