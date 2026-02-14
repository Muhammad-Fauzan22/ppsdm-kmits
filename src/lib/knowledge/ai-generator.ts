
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai'; // Or your preferred provider
import { getKnowledgeSupabase } from './supabase';

/**
 * Generates a Daily Wisdom entry using AI.
 * It fetches random knowledge items to inspire the wisdom.
 */
export async function generateDailyWisdom() {
    const supabase = getKnowledgeSupabase();

    // 1. Check if we already have wisdom for today
    const { data: existing } = await supabase
        .from('daily_wisdom')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

    if (existing) {
        console.log('Daily wisdom already exists for today.');
        return existing;
    }

    // 2. Fetch some random knowledge items for inspiration
    // Postgres doesn't have a simple "RANDOM()" valid for all versions in supabase-js easily without rpc
    // We'll fetch a batch and pick random ones client-side (server-side here)
    const { data: items } = await supabase
        .from('knowledge_items')
        .select('title, content, category')
        .limit(20);

    if (!items || items.length === 0) {
        throw new Error('No knowledge items found to generate wisdom.');
    }

    // Pick 3 random items
    const shuffled = items.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const context = selected.map(i => `- ${i.title}: ${i.content}`).join('\n');

    // 3. Generate Content using AI
    try {
        const { text } = await generateText({
            model: openai('gpt-4o'), // or 'gpt-3.5-turbo' depending on budget/key
            system: `You are a wise Engineering Mentor for students. 
            Generate a "Daily Engineering Wisdom" usage the provided context.
            It should include:
            1. A main inspiring thought or principle (max 2 sentences).
            2. A "Did You Know?" section based on the context.
            3. A short motivational closing.
            Format as JSON { "thought": "...", "did_you_know": "...", "closing": "..." }`,
            prompt: `Context facts:\n${context}`,
        });

        // 4. Save to DB
        // Validation of JSON
        // For simplicity, we'll just store the text if it's not JSON, or parse it.
        // Actually, let's just ask for Markdown or simple text to be safe in the 'content' column.
        // But the prompt asked for JSON. Let's try to parse.

        let contentObj;
        try {
            // clean code blocks if any
            const cleaned = text.replace(/```json/g, '').replace(/```/g, '');
            contentObj = JSON.parse(cleaned);
        } catch (e) {
            // Fallback if AI didn't output valid JSON
            contentObj = {
                thought: text,
                did_you_know: '',
                closing: ''
            };
        }

        // We'll store stringified JSON in the content column for flexibility
        const contentToStore = JSON.stringify(contentObj);

        const { data: newWisdom, error } = await supabase
            .from('daily_wisdom')
            .insert({
                content: contentToStore,
                source_items: selected,
                date: new Date().toISOString().split('T')[0]
            })
            .select()
            .single();

        if (error) throw error;

        return newWisdom;

    } catch (err) {
        console.error('AI Generation failed:', err);
        // Fallback: Return a static wisdom if AI fails (e.g. no API key)
        return null;
    }
}
