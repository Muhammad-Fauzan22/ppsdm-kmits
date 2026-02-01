'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  total_xp: number;
  current_level: number;
  streak_days: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const mockData: LeaderboardEntry[] = [
      { rank: 1, user_id: '1', username: 'Alex Champions', total_xp: 12500, current_level: 12, streak_days: 45 },
      { rank: 2, user_id: '2', username: 'Sarah Learning', total_xp: 11200, current_level: 11, streak_days: 32 },
      { rank: 3, user_id: '3', username: 'Mike Scholar', total_xp: 10800, current_level: 10, streak_days: 28 },
      { rank: 4, user_id: '4', username: 'You', total_xp: 2450, current_level: 5, streak_days: 7, isCurrentUser: true },
    ];
    setLeaderboard(mockData);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Learners
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center p-4 hover:bg-gray-50 ${entry.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                >
                  <div className="w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                  <Avatar className="ml-4 h-10 w-10">
                    <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">
                      {entry.username}
                      {entry.isCurrentUser && <Badge className="ml-2 bg-blue-100 text-blue-800">You</Badge>}
                    </p>
                    <p className="text-sm text-gray-500">Level {entry.current_level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{entry.total_xp.toLocaleString()} XP</p>
                    <p className="text-xs text-gray-500">{entry.streak_days} day streak</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
