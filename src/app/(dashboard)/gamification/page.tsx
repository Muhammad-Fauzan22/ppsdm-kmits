'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target,
  Zap,
  Crown,
  Medal,
  Gem
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface XPData {
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  streak_days: number;
  level_progress: {
    current: number;
    required: number;
    percentage: number;
  };
}

interface Badge {
  id: string;
  badge_code: string;
  name: string;
  description: string;
  image_url: string;
  rarity: string;
  earned: boolean;
  earned_at?: string;
}

export default function GamificationPage() {
  const [xpData, setXpData] = useState<XPData | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setXpData({
        total_xp: 2450,
        current_level: 5,
        xp_to_next_level: 3000,
        streak_days: 7,
        level_progress: {
          current: 2450,
          required: 3000,
          percentage: 81.67
        }
      });
      
      setBadges([
        { id: '1', badge_code: 'first_course', name: 'First Steps', description: 'Complete your first course', rarity: 'common', earned: true, image_url: '/badges/first-course.svg' },
        { id: '2', badge_code: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', rarity: 'uncommon', earned: true, image_url: '/badges/streak-7.svg' },
        { id: '3', badge_code: 'xp_1000', name: 'Rising Star', description: 'Earn 1,000 XP', rarity: 'uncommon', earned: true, image_url: '/badges/xp-1000.svg' },
        { id: '4', badge_code: 'perfect_quiz', name: 'Perfect Score', description: 'Score 100% on any quiz', rarity: 'rare', earned: false, image_url: '/badges/perfect-quiz.svg' },
        { id: '5', badge_code: 'streak_30', name: 'Monthly Master', description: '30-day learning streak', rarity: 'epic', earned: false, image_url: '/badges/streak-30.svg' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-800 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Achievements & Rewards
          </h1>
          <p className="mt-2 text-gray-600">
            Track your progress, earn badges, and climb the leaderboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{xpData?.total_xp.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-500" />
                Current Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{xpData?.current_level}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Day Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{xpData?.streak_days} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Medal className="w-4 h-4 text-blue-500" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {badges.filter(b => b.earned).length}/{badges.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {xpData?.current_level}</span>
              <span className="text-sm font-medium">Level {(xpData?.current_level || 0) + 1}</span>
            </div>
            <Progress value={xpData?.level_progress.percentage || 0} className="h-3" />
            <p className="mt-2 text-sm text-gray-600 text-center">
              {xpData?.xp_to_next_level && xpData?.total_xp
                ? `${xpData.xp_to_next_level - xpData.total_xp} XP needed for next level`
                : 'Keep learning to level up!'}
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`relative overflow-hidden ${!badge.earned ? 'opacity-60 grayscale' : ''}`}>
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                        <Gem className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                      <Badge className={getRarityColor(badge.rarity)}>
                        {badge.rarity}
                      </Badge>
                      {badge.earned && (
                        <div className="absolute top-2 right-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
                <p className="text-gray-500">Advanced achievements are being prepared</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card>
              <CardContent className="p-8 text-center">
                <Gem className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
                <p className="text-gray-500">Exciting rewards are on the way</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
