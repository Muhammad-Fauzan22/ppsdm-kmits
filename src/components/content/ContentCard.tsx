'use client';

import { useState, memo } from 'react';
import { Play, Bookmark, Share2, Clock, ExternalLink, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  content: {
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
  };
  onClick?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  className?: string;
}

const typeIcons = {
  video: Play,
  article: ExternalLink,
  course: Star,
  job: ExternalLink,
  event: Clock,
  research: Star,
};

const typeLabels = {
  video: 'Video',
  article: 'Artikel',
  course: 'Kursus',
  job: 'Lowongan',
  event: 'Event',
  research: 'Riset',
};

const dimensionColors: Record<string, string> = {
  cognitive: 'bg-blue-500',
  emotional: 'bg-pink-500',
  spiritual: 'bg-purple-500',
  physical: 'bg-green-500',
  creative: 'bg-orange-500',
  professional: 'bg-indigo-500',
  leadership: 'bg-red-500',
  financial: 'bg-yellow-500',
  environmental: 'bg-emerald-500',
};

const dimensionLabels: Record<string, string> = {
  cognitive: 'Kognitif',
  emotional: 'Emosional',
  spiritual: 'Spiritual',
  physical: 'Fisik',
  creative: 'Kreatif',
  professional: 'Profesional',
  leadership: 'Kepemimpinan',
  financial: 'Finansial',
  environmental: 'Lingkungan',
};

export const ContentCard = memo(function ContentCard({
  content,
  onClick,
  onSave,
  onShare,
  className,
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  const TypeIcon = typeIcons[content.type];
  const primaryDimension = content.dimensions[0];

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.();
  };

  // Calculate match percentage
  const matchPercentage = Math.round(content.relevanceScore);

  return (
    <motion.div
      className={cn(
        'group relative cursor-pointer',
        'w-full aspect-[16/9] rounded-lg overflow-hidden',
        'bg-gray-900',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Thumbnail/Image */}
      <div className="absolute inset-0">
        {content.imageUrl && !imageError ? (
          <Image
            src={content.imageUrl}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <TypeIcon className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
        {/* Dimension Badge */}
        {primaryDimension && (
          <span className={cn(
            'px-2 py-0.5 rounded text-xs font-medium text-white',
            dimensionColors[primaryDimension] || 'bg-gray-600'
          )}>
            {dimensionLabels[primaryDimension] || primaryDimension}
          </span>
        )}
        
        {/* Type Badge */}
        <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-black/60 backdrop-blur-sm">
          {typeLabels[content.type]}
        </span>
        
        {/* New Badge */}
        {content.isNew && (
          <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-red-600">
            Baru
          </span>
        )}
        
        {/* Trending Badge */}
        {content.isTrending && (
          <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-orange-500">
            🔥 Trending
          </span>
        )}
      </div>

      {/* Duration Badge (for videos) */}
      {content.duration && content.type === 'video' && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-xs text-white font-medium">
          {content.duration}
        </div>
      )}

      {/* Play Button Overlay (for videos) */}
      {content.type === 'video' && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Bottom Info (Always Visible) */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-300 transition-colors">
          {content.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span>{content.source}</span>
          {content.author && (
            <>
              <span>•</span>
              <span className="truncate max-w-[100px]">{content.author}</span>
            </>
          )}
        </div>
      </div>

      {/* Expanded Info (On Hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-24 left-0 right-0 bg-gray-900 p-3 rounded-b-lg shadow-2xl"
          >
            {/* Match Score */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400 text-sm font-semibold">
                {matchPercentage}% Match
              </span>
              {content.qualityScore > 80 && (
                <span className="text-xs text-gray-400">HD</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleSave}
                className={cn(
                  'p-2 rounded-full border-2 transition-all',
                  isSaved 
                    ? 'bg-white border-white text-gray-900' 
                    : 'border-gray-400 text-white hover:border-white'
                )}
              >
                <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-full border-2 border-gray-400 text-white hover:border-white transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* All Dimensions */}
            <div className="flex flex-wrap gap-1">
              {content.dimensions.map((dim) => (
                <span
                  key={dim}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] text-white',
                    dimensionColors[dim] || 'bg-gray-600'
                  )}
                >
                  {dimensionLabels[dim] || dim}
                </span>
              ))}
            </div>

            {/* Description Preview */}
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
              {content.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Skeleton Loading State
export function ContentCardSkeleton() {
  return (
    <div className="w-full aspect-[16/9] rounded-lg bg-gray-800 animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

export default ContentCard;
