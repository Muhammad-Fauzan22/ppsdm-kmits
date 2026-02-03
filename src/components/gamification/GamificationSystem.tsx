/**
 * Gamification System Components
 * 
 * Provides badges, XP tracking, level progression, streak tracking,
 * and achievement unlocks for the assessment system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Trophy, 
  Star, 
  Flame, 
  Zap, 
  Target,
  TrendingUp,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  Clock,
  Medal,
  Crown,
  Sparkles,
  Gift,
  ArrowUp,
  BarChart3,
  Users,
  BookOpen,
  Activity,
  ChevronRight,
  Info
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface GamificationState {
  xp: number;
  level: number;
  levelProgress: number; // 0-100
  nextLevelXP: number;
  currentLevelXP: number;
  streak: number;
  longestStreak: number;
  totalBadges: number;
  unlockedBadges: string[];
  totalAchievements: number;
  unlockedAchievements: string[];
  weeklyXP: number;
  monthlyXP: number;
  rank: string;
  percentile: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'assessment' | 'learning' | 'streak' | 'achievement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  progressTarget?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  requirements: string[];
}

interface XPEvent {
  id: string;
  type: 'assessment' | 'lesson' | 'exercise' | 'streak' | 'badge' | 'achievement';
  description: string;
  xp: number;
  timestamp: Date;
}

interface GamificationSystemProps {
  userId?: string;
  dimensionId?: number;
  onXPChange?: (newXP: number) => void;
  onLevelUp?: (newLevel: number) => void;
  onBadgeUnlock?: (badgeId: string) => void;
}

// ============================================================================
// BADGE DEFINITIONS
// ============================================================================

const BADGE_DEFINITIONS: Badge[] = [
  // Assessment Badges
  {
    id: 'first_assessment',
    name: 'Pionir Assessment',
    description: 'Menyelesaikan assessment pertama',
    icon: '🎯',
    category: 'assessment',
    rarity: 'common',
    xpReward: 50,
    unlocked: false
  },
  {
    id: 'all_dimensions',
    name: 'Holistik Sejati',
    description: 'Menyelesaikan semua 9 dimensi assessment',
    icon: '🌟',
    category: 'assessment',
    rarity: 'epic',
    xpReward: 500,
    unlocked: false
  },
  {
    id: 'perfect_score',
    name: 'Sempurna',
    description: 'Mendapatkan skor sempurna (100) di satu dimensi',
    icon: '💯',
    category: 'assessment',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false
  },
  {
    id: 'top_10_percent',
    name: 'Elite 10%',
    description: 'Berada di 10% teratas dalam satu dimensi',
    icon: '🏆',
    category: 'assessment',
    rarity: 'epic',
    xpReward: 300,
    unlocked: false
  },
  
  // Learning Badges
  {
    id: 'first_lesson',
    name: 'Pembelajar Pertama',
    description: 'Menyelesaikan pelajaran pertama',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    xpReward: 25,
    unlocked: false
  },
  {
    id: 'module_complete',
    name: 'Lulusan Modul',
    description: 'Menyelesaikan satu modul pembelajaran',
    icon: '🎓',
    category: 'learning',
    rarity: 'rare',
    xpReward: 100,
    unlocked: false
  },
  {
    id: 'all_modules',
    name: 'Master Pembelajaran',
    description: 'Menyelesaikan semua modul dalam satu dimensi',
    icon: '📖',
    category: 'learning',
    rarity: 'epic',
    xpReward: 400,
    unlocked: false
  },
  {
    id: 'exercise_master',
    name: 'Master Latihan',
    description: 'Menyelesaikan 10 latihan',
    icon: '✏️',
    category: 'learning',
    rarity: 'rare',
    xpReward: 150,
    unlocked: false
  },
  
  // Streak Badges
  {
    id: 'streak_3',
    name: '3 Hari Berturut-turut',
    description: 'Login dan belajar 3 hari berturut-turut',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpReward: 75,
    unlocked: false
  },
  {
    id: 'streak_7',
    name: 'Minggu Produktif',
    description: 'Login dan belajar 7 hari berturut-turut',
    icon: '⚡',
    category: 'streak',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false
  },
  {
    id: 'streak_30',
    name: 'Bulan Konsisten',
    description: 'Login dan belajar 30 hari berturut-turut',
    icon: '🌟',
    category: 'streak',
    rarity: 'epic',
    xpReward: 1000,
    unlocked: false
  },
  
  // Achievement Badges
  {
    id: 'improvement_10',
    name: 'Perbaikan 10%',
    description: 'Meningkatkan skor 10% dari assessment sebelumnya',
    icon: '📈',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 150,
    unlocked: false
  },
  {
    id: 'improvement_25',
    name: 'Lompatan Besar',
    description: 'Meningkatkan skor 25% dari assessment sebelumnya',
    icon: '🚀',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 300,
    unlocked: false
  },
  {
    id: 'balanced_development',
    name: 'Pengembangan Seimbang',
    description: 'Semua dimensi berada dalam rentang ±10 poin',
    icon: '⚖️',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false
  },
  
  // Special Badges
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Bergabung dalam 100 pengguna pertama',
    icon: '🌟',
    category: 'special',
    rarity: 'legendary',
    xpReward: 500,
    unlocked: false
  },
  {
    id: 'community_helper',
    name: 'Pembantu Komunitas',
    description: 'Membantu 10 pengguna lain',
    icon: '🤝',
    category: 'special',
    rarity: 'epic',
    xpReward: 300,
    unlocked: false
  },
  {
    id: 'content_creator',
    name: 'Kreator Konten',
    description: 'Berbagi 5 sumber daya yang berguna',
    icon: '✨',
    category: 'special',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false
  }
];

// ============================================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================================

const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first_login',
    name: 'Selamat Datang!',
    description: 'Login pertama ke platform',
    category: 'Umum',
    xpReward: 10,
    unlocked: false,
    requirements: ['Login ke platform']
  },
  {
    id: 'complete_profile',
    name: 'Profil Lengkap',
    description: 'Melengkapi profil pengguna',
    category: 'Umum',
    xpReward: 50,
    unlocked: false,
    requirements: ['Isi semua informasi profil']
  },
  {
    id: 'first_assessment',
    name: 'Assessment Pertama',
    description: 'Menyelesaikan assessment pertama',
    category: 'Assessment',
    xpReward: 100,
    unlocked: false,
    requirements: ['Selesaikan satu assessment']
  },
  {
    id: 'all_assessments',
    name: 'Holistik Sejati',
    description: 'Menyelesaikan semua 9 assessment',
    category: 'Assessment',
    xpReward: 1000,
    unlocked: false,
    requirements: ['Selesaikan semua 9 dimensi assessment']
  },
  {
    id: 'first_lesson',
    name: 'Pelajaran Pertama',
    description: 'Menyelesaikan pelajaran pertama',
    category: 'Pembelajaran',
    xpReward: 25,
    unlocked: false,
    requirements: ['Selesaikan satu pelajaran']
  },
  {
    id: 'ten_lessons',
    name: 'Pembelajar Aktif',
    description: 'Menyelesaikan 10 pelajaran',
    category: 'Pembelajaran',
    xpReward: 200,
    unlocked: false,
    requirements: ['Selesaikan 10 pelajaran']
  },
  {
    id: 'first_exercise',
    name: 'Latihan Pertama',
    description: 'Menyelesaikan latihan pertama',
    category: 'Pembelajaran',
    xpReward: 30,
    unlocked: false,
    requirements: ['Selesaikan satu latihan']
  },
  {
    id: 'streak_3',
    name: '3 Hari Berturut-turut',
    description: 'Login 3 hari berturut-turut',
    category: 'Streak',
    xpReward: 75,
    unlocked: false,
    requirements: ['Login 3 hari berturut-turut']
  },
  {
    id: 'streak_7',
    name: 'Minggu Produktif',
    description: 'Login 7 hari berturut-turut',
    category: 'Streak',
    xpReward: 200,
    unlocked: false,
    requirements: ['Login 7 hari berturut-turut']
  },
  {
    id: 'streak_30',
    name: 'Bulan Konsisten',
    description: 'Login 30 hari berturut-turut',
    category: 'Streak',
    xpReward: 1000,
    unlocked: false,
    requirements: ['Login 30 hari berturut-turut']
  }
];

// ============================================================================
// LEVEL DEFINITIONS
// ============================================================================

const LEVEL_DEFINITIONS = [
  { level: 1, name: 'Pemula', minXP: 0, icon: '🌱' },
  { level: 2, name: 'Pembelajar', minXP: 100, icon: '🌿' },
  { level: 3, name: 'Siswa', minXP: 300, icon: '📚' },
  { level: 4, name: 'Praktisi', minXP: 600, icon: '🎯' },
  { level: 5, name: 'Ahli', minXP: 1000, icon: '⭐' },
  { level: 6, name: 'Master', minXP: 1500, icon: '🌟' },
  { level: 7, name: 'Grandmaster', minXP: 2500, icon: '💎' },
  { level: 8, name: 'Legenda', minXP: 4000, icon: '👑' },
  { level: 9, name: 'Champion', minXP: 6000, icon: '🏆' },
  { level: 10, name: 'Holistik', minXP: 10000, icon: '🌈' }
];

// ============================================================================
// XP PROGRESS BAR COMPONENT
// ============================================================================

export function XPProgressBar({ 
  currentXP, 
  level, 
  nextLevelXP,
  showLabel = true 
}: {
  currentXP: number;
  level: number;
  nextLevelXP: number;
  showLabel?: boolean;
}) {
  const currentLevelXP = LEVEL_DEFINITIONS.find(l => l.level === level)?.minXP || 0;
  const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const levelInfo = LEVEL_DEFINITIONS.find(l => l.level === level);

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelInfo?.icon}</span>
            <div>
              <div className="font-semibold text-lg">Level {level}</div>
              <div className="text-sm text-gray-600">{levelInfo?.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{currentXP}</div>
            <div className="text-sm text-gray-600">XP</div>
          </div>
        </div>
      )}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Progress ke Level {level + 1}</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{currentXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BADGE CARD COMPONENT
// ============================================================================

export function BadgeCard({ badge, onClick }: { badge: Badge; onClick?: () => void }) {
  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 border-gray-300',
      rare: 'bg-blue-100 border-blue-300',
      epic: 'bg-purple-100 border-purple-300',
      legendary: 'bg-yellow-100 border-yellow-400'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityLabel = (rarity: string) => {
    const labels = {
      common: 'Umum',
      rare: 'Langka',
      epic: 'Epik',
      legendary: 'Legendaris'
    };
    return labels[rarity as keyof typeof labels] || labels.common;
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
        badge.unlocked ? getRarityColor(badge.rarity) : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`text-4xl ${badge.unlocked ? '' : 'grayscale'}`}>
            {badge.icon}
          </div>
          {badge.unlocked ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Lock className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        <h3 className="font-semibold mb-1">{badge.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
        
        <div className="flex items-center justify-between">
          <Badge className={getRarityColor(badge.rarity)}>
            {getRarityLabel(badge.rarity)}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-yellow-600">
            <Star className="w-4 h-4" />
            <span className="font-semibold">+{badge.xpReward} XP</span>
          </div>
        </div>

        {badge.progress !== undefined && badge.progressTarget !== undefined && !badge.unlocked && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{badge.progress}/{badge.progressTarget}</span>
            </div>
            <Progress value={(badge.progress / badge.progressTarget) * 100} className="h-2" />
          </div>
        )}

        {badge.unlockedAt && (
          <div className="mt-3 text-xs text-gray-500">
            Dibuka: {badge.unlockedAt.toLocaleDateString('id-ID')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// STREAK DISPLAY COMPONENT
// ============================================================================

export function StreakDisplay({ 
  currentStreak, 
  longestStreak,
  lastLoginDate 
}: {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate?: Date;
}) {
  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Luar biasa! Konsistensi luar biasa!';
    if (streak >= 14) return 'Hebat! Dua minggu berturut-turut!';
    if (streak >= 7) return 'Minggu produktif!';
    if (streak >= 3) return 'Mulai membangun kebiasaan!';
    return 'Mulai perjalanan Anda!';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Streak Belajar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-4xl mb-2">{getStreakIcon(currentStreak)}</div>
            <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
            <div className="text-sm text-gray-600">Hari Berturut-turut</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-yellow-600">{longestStreak}</div>
            <div className="text-sm text-gray-600">Streak Terpanjang</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-gray-700">{getStreakMessage(currentStreak)}</p>
        </div>

        {lastLoginDate && (
          <div className="mt-3 text-center text-sm text-gray-500">
            Login terakhir: {lastLoginDate.toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// XP HISTORY COMPONENT
// ============================================================================

export function XPHistory({ events }: { events: XPEvent[] }) {
  const getEventIcon = (type: string) => {
    const icons = {
      assessment: <Target className="w-4 h-4" />,
      lesson: <BookOpen className="w-4 h-4" />,
      exercise: <Activity className="w-4 h-4" />,
      streak: <Flame className="w-4 h-4" />,
      badge: <Award className="w-4 h-4" />,
      achievement: <Trophy className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Star className="w-4 h-4" />;
  };

  const getEventColor = (type: string) => {
    const colors = {
      assessment: 'text-blue-600 bg-blue-50',
      lesson: 'text-green-600 bg-green-50',
      exercise: 'text-purple-600 bg-purple-50',
      streak: 'text-orange-600 bg-orange-50',
      badge: 'text-yellow-600 bg-yellow-50',
      achievement: 'text-pink-600 bg-pink-50'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Riwayat XP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div 
              key={event.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <p className="font-medium">{event.description}</p>
                  <p className="text-xs text-gray-500">
                    {event.timestamp.toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 font-semibold">
                <ArrowUp className="w-4 h-4" />
                <span>+{event.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LEADERBOARD COMPONENT
// ============================================================================

export function Leaderboard({ 
  currentUserRank, 
  topUsers 
}: {
  currentUserRank: number;
  topUsers: Array<{
    rank: number;
    name: string;
    xp: number;
    level: number;
    avatar?: string;
  }>;
}) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50';
    if (rank === 2) return 'text-gray-600 bg-gray-100';
    if (rank === 3) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Papan Peringkat
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current User Rank */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-blue-600">
                #{currentUserRank}
              </div>
              <div>
                <div className="font-semibold">Peringkat Anda</div>
                <div className="text-sm text-gray-600">
                  {currentUserRank <= 10 ? 'Top 10!' : 
                   currentUserRank <= 100 ? 'Top 100!' : 
                   'Terus tingkatkan!'}
                </div>
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Top Users */}
        <div className="space-y-2">
          {topUsers.map((user) => (
            <div 
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold ${getRankColor(user.rank)}`}>
                  {getRankIcon(user.rank)}
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg">
                  {user.avatar || '👤'}
                </div>
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-600">Level {user.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{user.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN GAMIFICATION SYSTEM COMPONENT
// ============================================================================

export function GamificationSystem({
  userId,
  dimensionId,
  onXPChange,
  onLevelUp,
  onBadgeUnlock
}: GamificationSystemProps) {
  const [state, setState] = useState<GamificationState>({
    xp: 0,
    level: 1,
    levelProgress: 0,
    nextLevelXP: 100,
    currentLevelXP: 0,
    streak: 0,
    longestStreak: 0,
    totalBadges: 0,
    unlockedBadges: [],
    totalAchievements: 0,
    unlockedAchievements: [],
    weeklyXP: 0,
    monthlyXP: 0,
    rank: 0,
    percentile: 0
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Mock data - In production, this would come from API
  const mockBadges = BADGE_DEFINITIONS.map(badge => ({
    ...badge,
    unlocked: Math.random() > 0.7,
    progress: Math.floor(Math.random() * 10),
    progressTarget: 10,
    unlockedAt: Math.random() > 0.7 ? new Date() : undefined
  }));

  const mockAchievements = ACHIEVEMENT_DEFINITIONS.map(achievement => ({
    ...achievement,
    unlocked: Math.random() > 0.6,
    unlockedAt: Math.random() > 0.6 ? new Date() : undefined
  }));

  const mockXPEvents: XPEvent[] = [
    { id: '1', type: 'assessment', description: 'Menyelesaikan Assessment Kognitif', xp: 100, timestamp: new Date() },
    { id: '2', type: 'lesson', description: 'Menyelesaikan Pelajaran: Berpikir Kritis', xp: 25, timestamp: new Date(Date.now() - 86400000) },
    { id: '3', type: 'exercise', description: 'Menyelesaikan Latihan: Analisis Artikel', xp: 50, timestamp: new Date(Date.now() - 172800000) },
    { id: '4', type: 'streak', description: 'Streak 7 hari berturut-turut', xp: 200, timestamp: new Date(Date.now() - 259200000) },
    { id: '5', type: 'badge', description: 'Membuka badge: Pionir Assessment', xp: 50, timestamp: new Date(Date.now() - 345600000) }
  ];

  const mockTopUsers = [
    { rank: 1, name: 'Ahmad Santoso', xp: 8500, level: 9, avatar: '👨‍💼' },
    { rank: 2, name: 'Siti Rahayu', xp: 7200, level: 8, avatar: '👩‍💼' },
    { rank: 3, name: 'Budi Pratama', xp: 6500, level: 8, avatar: '👨‍🎓' },
    { rank: 4, name: 'Dewi Lestari', xp: 5800, level: 7, avatar: '👩‍🎓' },
    { rank: 5, name: 'Rizky Firmansyah', xp: 5200, level: 7, avatar: '👨‍💻' }
  ];

  const unlockedBadges = mockBadges.filter(b => b.unlocked);
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Sistem Gamifikasi
          </CardTitle>
          <CardDescription>
            Lacak progress, dapatkan badge, dan naikkan level Anda
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-yellow-50">
            <Award className="w-4 h-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-50">
            <Trophy className="w-4 h-4 mr-2" />
            Pencapaian
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-green-50">
            <Medal className="w-4 h-4 mr-2" />
            Peringkat
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* XP Progress */}
          <XPProgressBar 
            currentXP={state.xp}
            level={state.level}
            nextLevelXP={state.nextLevelXP}
          />

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total XP</div>
              <div className="text-2xl font-bold text-blue-600">{state.xp}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">XP Minggu Ini</div>
              <div className="text-2xl font-bold text-green-600">{state.weeklyXP}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Badges</div>
              <div className="text-2xl font-bold text-purple-600">
                {unlockedBadges.length}/{mockBadges.length}
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Pencapaian</div>
              <div className="text-2xl font-bold text-yellow-600">
                {unlockedAchievements.length}/{mockAchievements.length}
              </div>
            </div>
          </div>

          {/* Streak */}
          <StreakDisplay 
            currentStreak={state.streak}
            longestStreak={state.longestStreak}
            lastLoginDate={new Date()}
          />

          {/* Recent XP Events */}
          <XPHistory events={mockXPEvents.slice(0, 5)} />
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="mt-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Koleksi Badges</h3>
              <Badge variant="outline">
                {unlockedBadges.length}/{mockBadges.length} Dibuka
              </Badge>
            </div>
            
            {/* Filter by category */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Semua</Button>
              <Button variant="outline" size="sm">Assessment</Button>
              <Button variant="outline" size="sm">Pembelajaran</Button>
              <Button variant="outline" size="sm">Streak</Button>
              <Button variant="outline" size="sm">Pencapaian</Button>
              <Button variant="outline" size="sm">Spesial</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBadges.map((badge) => (
              <BadgeCard 
                key={badge.id}
                badge={badge}
                onClick={() => setSelectedBadge(badge)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6">
          <div className="space-y-3">
            {mockAchievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked ? 'bg-green-200' : 'bg-gray-200'
                      }`}>
                        {achievement.unlocked ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{achievement.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{achievement.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Star className="w-4 h-4" />
                            <span className="font-semibold">+{achievement.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {achievement.unlockedAt && (
                    <div className="mt-3 text-xs text-gray-500">
                      Dicapai: {achievement.unlockedAt.toLocaleDateString('id-ID')}
                    </div>
                  )}

                  {!achievement.unlocked && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-2">Persyaratan:</div>
                      <ul className="text-sm space-y-1">
                        {achievement.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="mt-6">
          <Leaderboard 
            currentUserRank={state.rank}
            topUsers={mockTopUsers}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="flex-1" size="lg">
          <Target className="w-4 h-4 mr-2" />
          Ambil Assessment
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          <BookOpen className="w-4 h-4 mr-2" />
          Lanjutkan Belajar
        </Button>
        <Button variant="outline" size="lg">
          <Gift className="w-4 h-4 mr-2" />
          Klaim Hadiah
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export {
  GamificationSystem,
  XPProgressBar,
  BadgeCard,
  StreakDisplay,
  XPHistory,
  Leaderboard,
  BADGE_DEFINITIONS,
  ACHIEVEMENT_DEFINITIONS,
  LEVEL_DEFINITIONS
};
