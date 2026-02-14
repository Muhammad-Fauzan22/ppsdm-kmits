
'use client';

import React, { useState, useEffect } from 'react';
import { GamificationService } from '@/lib/gamification/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, User as UserIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LevelBadge } from './LevelBadge';
import { cn } from '@/lib/utils';

export function LeaderboardWidget() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await GamificationService.getLeaderboard(5); // Top 5
                setLeaders(data);
            } catch (error) {
                console.error('Failed to load leaderboard', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm h-full flex items-center justify-center min-h-[200px]">
                <Loader2 className="animate-spin text-brand-gold w-8 h-8" />
            </Card>
        );
    }

    return (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-lg text-brand-gold">
                    <Trophy className="w-5 h-5" />
                    Top Students
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {leaders.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                        No data yet. Be the first!
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {leaders.map((entry, index) => {
                            const user = entry.user || {}; // Joined user data
                            const levelTitle = entry.level_details?.title || 'Unknown';

                            // Top 3 Styling
                            const isTop1 = index === 0;
                            const isTop3 = index < 3;

                            return (
                                <div key={entry.user_id} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                                    <div className={cn(
                                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                        isTop1 ? "bg-brand-gold text-black" :
                                            index === 1 ? "bg-slate-300 text-black" :
                                                index === 2 ? "bg-amber-700 text-white" :
                                                    "bg-slate-800 text-slate-400"
                                    )}>
                                        {index + 1}
                                    </div>

                                    <Avatar className={cn("w-10 h-10 border-2", isTop1 ? "border-brand-gold" : "border-transparent")}>
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback className="bg-slate-800 text-slate-400">
                                            <UserIcon className="w-5 h-5" />
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn("text-sm font-medium truncate", isTop1 ? "text-brand-gold" : "text-slate-200")}>
                                            {user.full_name || 'Anonymous User'}
                                        </h4>
                                        <p className="text-xs text-slate-500 truncate">
                                            {levelTitle} • {entry.current_streak} Day Streak
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-white">
                                                {entry.current_xp?.toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-slate-500 uppercase">XP</div>
                                        </div>
                                        <LevelBadge level={entry.current_level} size="sm" showTitle={false} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
