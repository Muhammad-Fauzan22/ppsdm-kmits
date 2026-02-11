// src/lib/serverAI.ts
import 'server-only';

interface SentimentResult {
    label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
}

/**
 * Server-Side Sentiment Analysis Stub
 * 
 * TODO: Implement actual API call to HuggingFace Inference API or Groq Cloud.
 * For now, this acts as a safe fallback to prevent client-side model downloads.
 */
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
    // START: Mock Implementation
    console.log('Analyzing sentiment for text:', text.substring(0, 50) + '...');

    // Simple keyword-based fallback (same logic as before, but on server)
    const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'excited'];
    const lowerText = text.toLowerCase();

    const isPositive = positiveKeywords.some(keyword => lowerText.includes(keyword));

    return {
        label: isPositive ? 'POSITIVE' : 'NEUTRAL', // Safe default
        score: isPositive ? 0.8 : 0.5
    };
    // END: Mock Implementation
}
