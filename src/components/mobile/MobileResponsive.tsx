/**
 * Mobile Responsive Components
 * 
 * Provides mobile-first responsive design patterns and utilities
 * for the assessment system, ensuring optimal UX across all devices
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Search,
  Filter,
  Sort,
  Grid,
  List,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  BookOpen,
  Target,
  Award,
  Flame,
  Zap,
  Users,
  BarChart3,
  Settings,
  Bell,
  User,
  Home,
  FileText,
  TrendingUp,
  Download,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Fullscreen,
  SkipForward,
  SkipBack,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

interface MobileNavigationProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    active?: boolean;
  }>;
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

interface MobileCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  progress?: number;
  children?: React.ReactNode;
  onClick?: () => void;
  compact?: boolean;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: React.ReactNode;
    label: string;
    color: string;
  };
  rightAction?: {
    icon: React.ReactNode;
    label: string;
    color: string;
  };
}

interface BottomNavigationProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }>;
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

interface PullToRefreshProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  children: React.ReactNode;
}

interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
}

// ============================================================================
// RESPONSIVE CONTAINER COMPONENT
// ============================================================================

export function ResponsiveContainer({ 
  children, 
  className = '',
  maxWidth = 'lg' 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}

// ============================================================================
// MOBILE NAVIGATION COMPONENT
// ============================================================================

export function MobileNavigation({
  items,
  activeItem,
  onItemClick
}: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return (
      <nav className="hidden md:flex items-center gap-2 bg-white border rounded-lg p-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeItem === item.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-2">
                {item.badge}
              </Badge>
            )}
          </button>
        ))}
      </nav>
    );
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">PPSDM KMM</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onItemClick?.(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeItem === item.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// MOBILE CARD COMPONENT
// ============================================================================

export function MobileCard({
  title,
  description,
  icon,
  badge,
  progress,
  children,
  onClick,
  compact = false
}: MobileCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg active:scale-95 ${
        compact ? 'p-3' : 'p-4'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold truncate">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="flex-shrink-0">
                  {badge}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {description}
              </p>
            )}
            {progress !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SWIPEABLE CARD COMPONENT
// ============================================================================

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction
}: SwipeableCardProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStart;
    setSwipeOffset(Math.max(-100, Math.min(100, diff)));
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    if (swipeOffset > 50 && onSwipeRight) {
      onSwipeRight();
    } else if (swipeOffset < -50 && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setSwipeOffset(0);
  };

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Action Background */}
      {leftAction && (
        <div 
          className={`absolute inset-y-0 left-0 w-24 flex items-center justify-center ${leftAction.color}`}
          style={{ transform: `translateX(${swipeOffset + 100}px)` }}
        >
          <div className="text-white text-center">
            <div className="text-2xl mb-1">{leftAction.icon}</div>
            <div className="text-sm font-medium">{leftAction.label}</div>
          </div>
        </div>
      )}

      {/* Right Action Background */}
      {rightAction && (
        <div 
          className={`absolute inset-y-0 right-0 w-24 flex items-center justify-center ${rightAction.color}`}
          style={{ transform: `translateX(${swipeOffset - 100}px)` }}
        >
          <div className="text-white text-center">
            <div className="text-2xl mb-1">{rightAction.icon}</div>
            <div className="text-sm font-medium">{rightAction.label}</div>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div 
        className="relative bg-white transition-transform"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// BOTTOM NAVIGATION COMPONENT
// ============================================================================

export function BottomNavigation({
  items,
  activeItem,
  onItemClick
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeItem === item.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ============================================================================
// MOBILE MODAL COMPONENT
// ============================================================================

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: MobileModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full h-full'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PULL TO REFRESH COMPONENT
// ============================================================================

export function PullToRefresh({
  onRefresh,
  isRefreshing,
  children
}: PullToRefreshProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStart;
    
    if (diff > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(100, diff));
    }
  };

  const handleTouchEnd = () => {
    setIsPulling(false);
    
    if (pullDistance > 80) {
      onRefresh();
    }
    
    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull Indicator */}
      {isPulling && (
        <div 
          className="absolute inset-x-0 top-0 flex items-center justify-center bg-white border-b transition-all"
          style={{ transform: `translateY(${Math.min(pullDistance, 60)}px)` }}
        >
          {isRefreshing ? (
            <div className="flex items-center gap-2 text-blue-600">
              <RotateCcw className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Memuat...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <ArrowDown className="w-5 h-5" />
              <span className="text-sm font-medium">Tarik untuk refresh</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div 
        className="transition-transform"
        style={{ transform: `translateY(${Math.min(pullDistance, 60)}px)` }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// INFINITE SCROLL COMPONENT
// ============================================================================

export function InfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  children
}: InfiniteScrollProps) {
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      setIsNearBottom(scrollTop + clientHeight >= scrollHeight - 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isNearBottom && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isNearBottom, hasMore, isLoading, onLoadMore]);

  return (
    <div>
      {children}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-600">
            <RotateCcw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat lebih banyak...</span>
          </div>
        </div>
      )}
      {!hasMore && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Tidak ada lagi konten
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MOBILE ASSESSMENT CARD COMPONENT
// ============================================================================

export function MobileAssessmentCard({
  dimensionId,
  dimensionName,
  score,
  status,
  icon,
  onStart,
  onViewResults
}: {
  dimensionId: number;
  dimensionName: string;
  score?: number;
  status: 'not_started' | 'in_progress' | 'completed';
  icon: React.ReactNode;
  onStart?: () => void;
  onViewResults?: () => void;
}) {
  const getStatusColor = (s: string) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-600',
      in_progress: 'bg-blue-100 text-blue-600',
      completed: 'bg-green-100 text-green-600'
    };
    return colors[s as keyof typeof colors] || colors.not_started;
  };

  const getStatusLabel = (s: string) => {
    const labels = {
      not_started: 'Belum Dimulai',
      in_progress: 'Sedang Berjalan',
      completed: 'Selesai'
    };
    return labels[s as keyof typeof labels] || labels.not_started;
  };

  return (
    <SwipeableCard
      leftAction={{
        icon: <Play className="w-6 h-6" />,
        label: 'Mulai',
        color: 'bg-blue-500'
      }}
      rightAction={{
        icon: <FileText className="w-6 h-6" />,
        label: 'Hasil',
        color: 'bg-green-500'
      }}
      onSwipeLeft={onViewResults}
      onSwipeRight={onStart}
    >
      <MobileCard
        title={dimensionName}
        icon={icon}
        badge={getStatusLabel(status)}
        progress={score}
        onClick={status === 'not_started' ? onStart : onViewResults}
      >
        <div className="mt-3 flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
          </div>
          {score !== undefined && (
            <div className="text-sm font-semibold text-gray-600">
              {score}/100
            </div>
          )}
        </div>
      </MobileCard>
    </SwipeableCard>
  );
}

// ============================================================================
// MOBILE VIDEO PLAYER COMPONENT
// ============================================================================

export function MobileVideoPlayer({
  title,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
  onFullscreen,
  progress
}: {
  title: string;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek?: (time: number) => void;
  onFullscreen?: () => void;
  progress: number;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Video Placeholder */}
        <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
          <div className="text-white text-center">
            <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-75">Video Player</p>
          </div>
          
          {/* Play Button Overlay */}
          <button
            onClick={onPlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-16 h-16 text-white" />
            ) : (
              <Play className="w-16 h-16 text-white" />
            )}
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold line-clamp-2">{title}</h3>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{formatTime(progress * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Progress value={progress * 100} className="h-2" />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSeek?.(Math.max(0, progress * duration - 10))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => onSeek?.(Math.min(duration, progress * duration + 10))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={onFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Fullscreen className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MOBILE QUIZ COMPONENT
// ============================================================================

export function MobileQuiz({
  question,
  options,
  selectedAnswer,
  onAnswerSelect,
  onSubmit,
  isSubmitting
}: {
  question: string;
  options: Array<{
    id: string;
    text: string;
    icon?: React.ReactNode;
  }>;
  selectedAnswer?: string;
  onAnswerSelect: (answerId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pertanyaan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{question}</p>
        
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswerSelect(option.id)}
              disabled={isSubmitting}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedAnswer === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                {option.icon && (
                  <div className={`p-2 rounded-lg ${
                    selectedAnswer === option.id
                      ? 'bg-blue-200'
                      : 'bg-gray-200'
                  }`}>
                    {option.icon}
                  </div>
                )}
                <span className="font-medium flex-1">{option.text}</span>
                {selectedAnswer === option.id && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={onSubmit}
          disabled={!selectedAnswer || isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MOBILE STATS GRID COMPONENT
// ============================================================================

export function MobileStatsGrid({
  stats
}: {
  stats: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
  }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <Card key={index} className="p-3">
          <CardContent className="p-0">
            <div className="flex items-start gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                {stat.icon}
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-xs ${
                  stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {stat.trend === 'down' && <ArrowDown className="w-3 h-3" />}
                  {stat.trendValue}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// MOBILE ACTION SHEET COMPONENT
// ============================================================================

export function MobileActionSheet({
  isOpen,
  onClose,
  title,
  actions
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actions: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    color?: string;
    destructive?: boolean;
  }>;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Actions */}
        <div className="p-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                // Handle action
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                action.destructive
                  ? 'text-red-600 hover:bg-red-50'
                  : action.color
                  ? action.color
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              {action.icon}
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export {
  ResponsiveContainer,
  MobileNavigation,
  MobileCard,
  SwipeableCard,
  BottomNavigation,
  MobileModal,
  PullToRefresh,
  InfiniteScroll,
  MobileAssessmentCard,
  MobileVideoPlayer,
  MobileQuiz,
  MobileStatsGrid,
  MobileActionSheet
};
