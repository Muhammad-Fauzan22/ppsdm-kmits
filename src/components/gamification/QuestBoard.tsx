
'use client';

import React, { useState, useEffect } from 'react';
import { UserQuest } from '@/lib/gamification/types';
import { GamificationService } from '@/lib/gamification/service';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Gift, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function QuestBoard() {
    const [quests, setQuests] = useState<UserQuest[]>([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const { toast } = useToast();

    // Mock user ID - in real app, get from Auth Context
    // Requires authenticated user.
    // We'll trust the parent or context to provide ID, or fetch from supabase auth.
    // For now, let's fetch 'me' in useEffect.
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserAndQuests = async () => {
            // Get current user
            // Assuming we have a way to get user, e.g. supabase.auth.getUser()
            // Using GamificationService doesn't expose auth directly.
            // Let's assume we import supabase to get auth.
            // Or better, pass userId as prop. 
            // For widget self-containment, I'll fetch internally.

            // Note: Importing supabase client again might be cleaner
            const { supabase } = await import('@/lib/supabase/client');
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
                loadQuests(user.id);
            } else {
                setLoading(false);
            }
        };

        fetchUserAndQuests();
    }, []);

    const loadQuests = async (uid: string) => {
        try {
            const data = await GamificationService.getActiveQuests(uid);
            setQuests(data);
        } catch (error) {
            console.error('Failed to load quests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (quest: UserQuest) => {
        if (!userId) return;
        setClaimingId(quest.id);
        try {
            const reward = await GamificationService.claimQuestReward(userId, quest.id);
            toast({
                title: "Quest Completed! 🎉",
                description: `You earned ${reward} XP!`,
                variant: 'default' // Should be 'success' style ideally
            });
            // Refresh
            loadQuests(userId);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to claim reward.",
                variant: 'destructive'
            });
        } finally {
            setClaimingId(null);
        }
    };

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-brand-blue" /></div>;
    if (!userId) return null; // Or login prompt

    return (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="w-5 h-5 text-brand-purple" />
                    Daily Quests
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {quests.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No active quests available.</p>
                ) : (
                    quests.map((q) => {
                        const target = q.quest_details?.target_count || 1;
                        const progress = q.current_progress;
                        const percentage = Math.min(100, (progress / target) * 100);
                        const isCompleted = q.is_completed; // Or percentage >= 100
                        const isClaimed = q.is_claimed;

                        return (
                            <div key={q.id} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-slate-200 text-sm">{q.quest_details?.title}</h4>
                                        <p className="text-xs text-slate-500">{q.quest_details?.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                                            +{q.quest_details?.xp_reward} XP
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-semibold">
                                        <span>Progress</span>
                                        <span>{progress} / {target}</span>
                                    </div>
                                    <Progress value={percentage} className="h-2 bg-slate-900" indicatorClassName="bg-brand-purple" />
                                </div>

                                <div className="flex justify-end pt-1">
                                    {isClaimed ? (
                                        <Button size="sm" variant="ghost" disabled className="h-7 text-xs gap-1 text-green-500">
                                            <CheckCircle className="w-3 h-3" /> Claimed
                                        </Button>
                                    ) : isCompleted ? (
                                        <Button
                                            size="sm"
                                            onClick={() => handleClaim(q)}
                                            disabled={claimingId === q.id}
                                            className="h-7 text-xs bg-brand-purple hover:bg-brand-purple/80 text-white gap-1 animate-pulse"
                                        >
                                            {claimingId === q.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Gift className="w-3 h-3" />}
                                            Claim Reward
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="ghost" disabled className="h-7 text-xs gap-1 text-slate-500">
                                            <Lock className="w-3 h-3" /> Locked
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
