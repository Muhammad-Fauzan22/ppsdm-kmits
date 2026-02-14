import { NextResponse } from 'next/server';
import { getKnowledgeSupabase } from '@/lib/knowledge/supabase';
import { scrapeAllFeeds } from '@/lib/knowledge/scraper';
import { getSeedData } from '@/lib/knowledge/seed-data';

/**
 * POST /api/cron/scrape-knowledge — Cron job to scrape RSS feeds and seed initial data
 * Protected by CRON_SECRET header.
 */
export async function POST(request: Request) {
    try {
        const supabase = getKnowledgeSupabase();

        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const results: Record<string, any> = {
            scraped: 0,
            seeded: 0,
            errors: [] as string[],
        };

        // Step 1: Seed initial data if database is empty
        const { count } = await supabase
            .from('knowledge_items')
            .select('*', { count: 'exact', head: true });

        if (!count || count === 0) {
            const seedItems = getSeedData();
            const { error: seedError } = await supabase
                .from('knowledge_items')
                .insert(seedItems);

            if (seedError) {
                results.errors.push(`Seed failed: ${seedError.message}`);
            } else {
                results.seeded = seedItems.length;
            }
        }

        // Step 2: Scrape RSS feeds
        try {
            const scrapedItems = await scrapeAllFeeds();

            if (scrapedItems.length > 0) {
                const { error: scrapeError } = await supabase
                    .from('knowledge_items')
                    .upsert(
                        scrapedItems.map(item => ({
                            ...item,
                            id: undefined,
                        })),
                        { onConflict: 'url', ignoreDuplicates: true }
                    );

                if (scrapeError) {
                    results.errors.push(`Scrape insert failed: ${scrapeError.message}`);
                } else {
                    results.scraped = scrapedItems.length;
                }
            }
        } catch (scrapeErr) {
            results.errors.push(`Scrape failed: ${scrapeErr instanceof Error ? scrapeErr.message : 'Unknown'}`);
        }

        // Step 3: Mark old news items as not current (older than 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await supabase
            .from('knowledge_items')
            .update({ is_current: false })
            .lt('published_at', thirtyDaysAgo.toISOString())
            .lt('published_at', thirtyDaysAgo.toISOString())
            .eq('category', 'news');

        // Step 4: Generate Daily Wisdom (AI)
        try {
            // Dynamic import to avoid build issues if ai sdk is missing in some envs
            const { generateDailyWisdom } = await import('@/lib/knowledge/ai-generator');
            await generateDailyWisdom();
            results['wisdom_generated'] = true;
        } catch (aiError) {
            console.error('Failed to generate daily wisdom:', aiError);
            results['wisdom_error'] = aiError instanceof Error ? aiError.message : 'Unknown';
        }

        return NextResponse.json({
            success: true,
            results,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[Cron] scrape-knowledge error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
