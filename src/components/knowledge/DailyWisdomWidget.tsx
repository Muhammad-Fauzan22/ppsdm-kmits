
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Lightbulb, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyWisdom {
    thought: string;
    did_you_know: string;
    closing: string;
}

export function DailyWisdomWidget() {
    const [wisdom, setWisdom] = useState<DailyWisdom | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWisdom() {
            setLoading(true);
            const supabase = createClient();

            // Try fetch today's wisdom
            const today = new Date().toISOString().split('T')[0];
            const { data } = await supabase
                .from('daily_wisdom')
                .select('*')
                .eq('date', today)
                .single();

            if (data && data.content) {
                try {
                    setWisdom(JSON.parse(data.content));
                } catch (e) {
                    setWisdom({ thought: data.content, did_you_know: '', closing: '' });
                }
            } else {
                // If no wisdom today, maybe fetch latest?
                const { data: latest } = await supabase
                    .from('daily_wisdom')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(1)
                    .single();

                if (latest && latest.content) {
                    try {
                        setWisdom(JSON.parse(latest.content));
                    } catch (e) {
                        setWisdom({ thought: latest.content, did_you_know: '', closing: '' });
                    }
                }
            }
            setLoading(false);
        }

        fetchWisdom();
    }, []);

    if (loading) return (
        <Card className="h-full border-blue-100 dark:border-blue-900 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
            <CardContent className="flex items-center justify-center h-48">
                <Sparkles className="w-8 h-8 text-blue-300 animate-pulse" />
            </CardContent>
        </Card>
    );

    if (!wisdom) return null; // Or render empty state

    return (
        <Card className="h-full border-purple-100 dark:border-purple-900 overflow-hidden relative group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="w-32 h-32 text-purple-600" />
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-5 h-5" />
                    Daily Wisdom
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative pl-6 border-l-4 border-purple-200 dark:border-purple-800">
                        <Quote className="absolute -top-1 left-0 w-4 h-4 text-purple-300 transform -translate-x-full -ml-2" />
                        <p className="text-lg font-medium text-slate-800 dark:text-slate-100 italic">
                            "{wisdom.thought}"
                        </p>
                    </div>
                </motion.div>

                {wisdom.did_you_know && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300"
                    >
                        <div className="flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400 mb-1">
                            <Lightbulb className="w-4 h-4" />
                            Tahukah Anda?
                        </div>
                        {wisdom.did_you_know}
                    </motion.div>
                )}

                {wisdom.closing && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xs text-center text-slate-400 font-medium"
                    >
                        ✨ {wisdom.closing}
                    </motion.p>
                )}
            </CardContent>
        </Card>
    );
}
