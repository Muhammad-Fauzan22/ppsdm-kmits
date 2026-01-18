// Browser-based AI using Transformers.js
// 100% FREE - runs in user's browser, no API calls needed
// Uses ONNX models from Hugging Face

// Note: This is a lightweight wrapper for browser AI
// Full Transformers.js import is heavy, so we use dynamic imports

export interface SentimentResult {
    label: 'POSITIVE' | 'NEGATIVE';
    score: number;
}

export interface SummaryResult {
    summary: string;
}

export interface EmbeddingResult {
    embeddings: number[];
}

// Lazy load Transformers.js pipeline
let sentimentPipeline: any = null;
let summaryPipeline: any = null;

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

// Initialize sentiment analysis (browser-only)
export async function initSentimentAnalysis(): Promise<boolean> {
    if (!isBrowser) return false;

    try {
        // Dynamic import for browser only
        const { pipeline } = await import('@xenova/transformers');
        sentimentPipeline = await pipeline(
            'sentiment-analysis',
            'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
            { progress_callback: (progress: any) => console.log('Loading model:', progress) }
        );
        return true;
    } catch (error) {
        console.warn('[BrowserAI] Failed to load sentiment model:', error);
        return false;
    }
}

// Analyze sentiment of text
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
    // Fallback if model not loaded
    if (!sentimentPipeline) {
        return fallbackSentiment(text);
    }

    try {
        const result = await sentimentPipeline(text);
        return {
            label: result[0].label as 'POSITIVE' | 'NEGATIVE',
            score: result[0].score,
        };
    } catch (error) {
        console.warn('[BrowserAI] Sentiment analysis failed:', error);
        return fallbackSentiment(text);
    }
}

// Simple fallback sentiment (keyword-based)
function fallbackSentiment(text: string): SentimentResult {
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'best', 'amazing', 'bagus', 'senang', 'suka'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'sad', 'angry', 'buruk', 'sedih', 'marah'];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) {
        return { label: 'POSITIVE', score: 0.7 + (positiveCount * 0.05) };
    } else if (negativeCount > positiveCount) {
        return { label: 'NEGATIVE', score: 0.7 + (negativeCount * 0.05) };
    }

    return { label: 'POSITIVE', score: 0.5 };
}

// ============================================
// TEXT UTILITIES (NO AI NEEDED)
// ============================================

// Simple text summarization (extractive)
export function summarizeText(text: string, maxSentences: number = 3): string {
    const sentences = text
        .replace(/([.!?])\s*/g, '$1|')
        .split('|')
        .filter(s => s.trim().length > 10);

    if (sentences.length <= maxSentences) {
        return text;
    }

    // Score sentences by word count and position
    const scored = sentences.map((sentence, index) => ({
        sentence,
        score: sentence.split(' ').length * (index === 0 ? 1.5 : 1) * (index === sentences.length - 1 ? 1.3 : 1),
    }));

    scored.sort((a, b) => b.score - a.score);

    const topSentences = scored
        .slice(0, maxSentences)
        .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
        .map(s => s.sentence);

    return topSentences.join(' ');
}

// Extract keywords from text
export function extractKeywords(text: string, count: number = 5): string[] {
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
        'yang', 'dan', 'atau', 'untuk', 'dengan', 'dari', 'ke', 'di', 'ini', 'itu',
        'adalah', 'akan', 'sudah', 'telah', 'bisa', 'dapat', 'harus', 'saya', 'anda',
    ]);

    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));

    // Count frequency
    const freq: Record<string, number> = {};
    words.forEach(word => {
        freq[word] = (freq[word] || 0) + 1;
    });

    // Sort by frequency
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([word]) => word);
}

// Calculate reading time
export function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Calculate text complexity (Flesch-Kincaid)
export function calculateComplexity(text: string): {
    level: 'easy' | 'medium' | 'hard';
    score: number;
} {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) {
        return { level: 'easy', score: 100 };
    }

    // Flesch Reading Ease
    const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);

    let level: 'easy' | 'medium' | 'hard';
    if (score >= 60) level = 'easy';
    else if (score >= 30) level = 'medium';
    else level = 'hard';

    return { level, score: Math.max(0, Math.min(100, score)) };
}

function countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

// ============================================
// EMOTION DETECTION (Keyword-based, Free)
// ============================================

export type Emotion = 'happy' | 'sad' | 'angry' | 'fear' | 'surprise' | 'neutral';

export function detectEmotion(text: string): { emotion: Emotion; confidence: number } {
    const emotionKeywords: Record<Emotion, string[]> = {
        happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'love', 'senang', 'bahagia', 'gembira', 'suka'],
        sad: ['sad', 'depressed', 'unhappy', 'cry', 'tears', 'sedih', 'depresi', 'menangis', 'kecewa'],
        angry: ['angry', 'furious', 'mad', 'hate', 'annoyed', 'marah', 'kesal', 'benci', 'jengkel'],
        fear: ['afraid', 'scared', 'fear', 'worried', 'anxious', 'takut', 'cemas', 'khawatir', 'panik'],
        surprise: ['surprised', 'shocked', 'amazed', 'wow', 'kaget', 'terkejut', 'heran'],
        neutral: [],
    };

    const lowerText = text.toLowerCase();
    const scores: Record<Emotion, number> = {
        happy: 0, sad: 0, angry: 0, fear: 0, surprise: 0, neutral: 0,
    };

    (Object.keys(emotionKeywords) as Emotion[]).forEach(emotion => {
        emotionKeywords[emotion].forEach(keyword => {
            if (lowerText.includes(keyword)) {
                scores[emotion]++;
            }
        });
    });

    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
        return { emotion: 'neutral', confidence: 0.7 };
    }

    const emotion = (Object.keys(scores) as Emotion[]).find(e => scores[e] === maxScore) || 'neutral';
    const confidence = Math.min(0.95, 0.5 + maxScore * 0.15);

    return { emotion, confidence };
}

export default {
    initSentimentAnalysis,
    analyzeSentiment,
    summarizeText,
    extractKeywords,
    calculateReadingTime,
    calculateComplexity,
    detectEmotion,
};
