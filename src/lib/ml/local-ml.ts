/**
 * Local ML Service - Browser-based ML using TensorFlow.js
 * Features: Sentiment analysis, Keyword extraction, Reading level calculation
 * Runs entirely in the browser for privacy and performance
 */

// TypeScript types for ML operations
export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface KeywordResult {
  keywords: string[];
  frequencies: Record<string, number>;
}

export interface ReadingLevelResult {
  grade: number;
  score: number;
  description: string;
  metrics: {
    avgSentenceLength: number;
    avgSyllablesPerWord: number;
    fleschKincaid: number;
    fleschReadingEase: number;
  };
}

export interface TextAnalysisResult {
  sentiment: SentimentResult;
  keywords: KeywordResult;
  readingLevel: ReadingLevelResult;
  wordCount: number;
  sentenceCount: number;
}

class LocalMLService {
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the ML service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.doInitialize();
    await this.initializationPromise;
  }

  /**
   * Actual initialization logic
   */
  private async doInitialize(): Promise<void> {
    try {
      // Dynamic import of TensorFlow.js
      // In production, this would load actual TF.js models
      // For now, we use rule-based ML for lightweight browser operation
      
      // Simulate model loading time
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.isInitialized = true;
      console.log('Local ML service initialized');
    } catch (error) {
      console.warn('Local ML initialization warning:', error);
      this.isInitialized = true; // Mark as initialized to allow fallback
    }
  }

  /**
   * Analyze sentiment of text
   */
  async predictSentiment(text: string): Promise<SentimentResult> {
    await this.initialize();
    
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
      'love', 'happy', 'success', 'achieve', 'best', 'perfect', 'awesome',
      'brilliant', 'outstanding', 'superb', 'pleasant', 'delightful', 'joyful',
      'growth', 'improve', 'progress', 'achievement', 'accomplishment'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'hate', 'sad', 'fail', 'wrong',
      'problem', 'issue', 'difficult', 'poor', 'worst', 'horrible',
      'disappointing', 'frustrating', 'annoying', 'unpleasant', 'failure',
      'struggle', 'challenge', 'difficulty', 'obstacle', 'setback'
    ];
    
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    words.forEach(word => {
      if (word.length < 3) {
        neutral++;
        return;
      }
      
      if (positiveWords.some(pw => word.includes(pw))) {
        positive++;
      } else if (negativeWords.some(nw => word.includes(nw))) {
        negative++;
      } else {
        neutral++;
      }
    });
    
    const total = words.length || 1;
    const positiveScore = positive / total;
    const negativeScore = negative / total;
    const neutralScore = neutral / total;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;
    
    if (positiveScore > negativeScore && positiveScore > 0.1) {
      sentiment = 'positive';
      confidence = Math.min(0.95, positiveScore + 0.2);
    } else if (negativeScore > positiveScore && negativeScore > 0.1) {
      sentiment = 'negative';
      confidence = Math.min(0.95, negativeScore + 0.2);
    } else {
      sentiment = 'neutral';
      confidence = Math.min(0.8, neutralScore);
    }
    
    return {
      sentiment,
      confidence,
      scores: {
        positive: Math.round(positiveScore * 100) / 100,
        negative: Math.round(negativeScore * 100) / 100,
        neutral: Math.round(neutralScore * 100) / 100,
      },
    };
  }

  /**
   * Extract keywords from text using TF-IDF-like approach
   */
  async extractKeywords(text: string, maxKeywords: number = 10): Promise<KeywordResult> {
    await this.initialize();
    
    // Extended stop words list
    const stopWords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
      'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
      'from', 'as', 'into', 'through', 'during', 'before', 'after',
      'above', 'below', 'between', 'under', 'again', 'further', 'then',
      'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
      'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
      'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
      'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while',
      'about', 'against', 'this', 'that', 'these', 'those', 'am', 'it',
      'its', 'my', 'your', 'his', 'her', 'their', 'our', 'we', 'you',
      'he', 'she', 'they', 'them', 'what', 'which', 'who', 'whom',
      'i', 'me', 'him', 'any', 'both', 'down', 'up', 'out', 'off',
      'over', 'also', 'now', 'even', 'still', 'well', 'back', 'way',
      'get', 'got', 'go', 'went', 'come', 'came', 'make', 'made',
      'take', 'took', 'see', 'saw', 'know', 'knew', 'think', 'thought',
      'say', 'said', 'tell', 'told', 'give', 'gave', 'find', 'found'
    ]);
    
    // Tokenize and clean text
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Calculate word frequencies
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Calculate document frequency (for TF-IDF-like scoring)
    const totalDocs = 1; // Single document analysis
    const docFrequency: Record<string, number> = {};
    words.forEach(word => {
      docFrequency[word] = 1;
    });
    
    // Calculate TF-IDF scores
    const tfidfScores: Record<string, number> = {};
    const maxFreq = Math.max(...Object.values(frequency));
    
    Object.entries(frequency).forEach(([word, freq]) => {
      const tf = freq / maxFreq;
      const df = docFrequency[word] || 1;
      const idf = Math.log(totalDocs / df) + 1;
      tfidfScores[word] = tf * idf;
    });
    
    // Sort by TF-IDF score and return top keywords
    const keywords = Object.entries(tfidfScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
    
    // Get frequencies for top keywords
    const frequencies: Record<string, number> = {};
    keywords.forEach(word => {
      frequencies[word] = frequency[word] || 0;
    });
    
    return {
      keywords,
      frequencies,
    };
  }

  /**
   * Calculate reading level using Flesch-Kincaid formulas
   */
  async calculateReadingLevel(text: string): Promise<ReadingLevelResult> {
    await this.initialize();
    
    // Clean and split text
    const sentences = text.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const words = text.split(/\s+/)
      .filter(w => w.replace(/[^\w]/g, '').length > 0);
    
    const cleanWords = words.map(w => w.replace(/[^\w]/g, ''));
    
    // Calculate metrics
    const sentenceCount = sentences.length || 1;
    const wordCount = cleanWords.length || 1;
    const totalSyllables = cleanWords.reduce((count, word) => count + this.countSyllables(word), 0);
    
    const avgSentenceLength = wordCount / sentenceCount;
    const avgSyllablesPerWord = totalSyllables / wordCount;
    
    // Flesch-Kincaid Grade Level
    // Formula: 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
    const fleschKincaid = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
    
    // Flesch Reading Ease
    // Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
    const fleschReadingEase = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
    
    // Determine description
    let description: string;
    if (fleschReadingEase >= 90) description = 'Very Easy';
    else if (fleschReadingEase >= 80) description = 'Easy';
    else if (fleschReadingEase >= 70) description = 'Fairly Easy';
    else if (fleschReadingEase >= 60) description = 'Standard';
    else if (fleschReadingEase >= 50) description = 'Fairly Difficult';
    else if (fleschReadingEase >= 30) description = 'Difficult';
    else description = 'Very Difficult';
    
    return {
      grade: Math.max(0, Math.min(18, Math.round(fleschKincaid))),
      score: Math.round(Math.max(0, Math.min(100, fleschReadingEase))),
      description,
      metrics: {
        avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
        avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
        fleschKincaid: Math.round(fleschKincaid * 10) / 10,
        fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
      },
    };
  }

  /**
   * Analyze text comprehensively
   */
  async analyzeText(text: string): Promise<TextAnalysisResult> {
    await this.initialize();
    
    const [sentiment, keywords, readingLevel] = await Promise.all([
      this.predictSentiment(text),
      this.extractKeywords(text),
      this.calculateReadingLevel(text),
    ]);
    
    const words = text.split(/\s+/).filter(w => w.replace(/[^\w]/g, '').length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      sentiment,
      keywords,
      readingLevel,
      wordCount: words.length,
      sentenceCount: sentences.length,
    };
  }

  /**
   * Calculate similarity between two texts (simple Jaccard similarity)
   */
  async calculateSimilarity(text1: string, text2: string): Promise<number> {
    await this.initialize();
    
    const words1 = new Set(
      text1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    );
    const words2 = new Set(
      text2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    );
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Categorize text into predefined categories
   */
  async categorizeText(text: string): Promise<{ category: string; confidence: number }[]> {
    await this.initialize();
    
    const categories = {
      'Education': ['learning', 'student', 'teacher', 'course', 'study', 'school', 'university', 'knowledge', 'academic', 'teach'],
      'Technology': ['computer', 'software', 'digital', 'internet', 'code', 'data', 'system', 'technology', 'ai', 'ml'],
      'Business': ['company', 'market', 'business', 'profit', 'revenue', 'customer', 'sales', 'growth', 'strategy', 'management'],
      'Health': ['health', 'medical', 'doctor', 'patient', 'treatment', 'symptoms', 'wellness', 'fitness', 'exercise', 'diet'],
      'Finance': ['money', 'investment', 'bank', 'financial', 'stock', 'trading', 'portfolio', 'wealth', 'income', 'expense'],
      'Entertainment': ['movie', 'music', 'game', 'film', 'show', 'entertainment', 'video', 'streaming', 'actor', 'director'],
    };
    
    const textLower = text.toLowerCase();
    const scores: Record<string, number> = {};
    
    Object.entries(categories).forEach(([category, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        if (textLower.includes(keyword)) {
          score += 1;
        }
      });
      scores[category] = score;
    });
    
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const maxScore = sorted[0]?.[1] || 1;
    
    return sorted.map(([category, score]) => ({
      category,
      confidence: score / maxScore,
    }));
  }

  /**
   * Helper function to count syllables in a word
   */
  private countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    // Remove common suffixes that don't add syllables
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    // Count vowel groups
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.isInitialized = false;
    this.initializationPromise = null;
  }
}

// Export singleton instance
export const localML = new LocalMLService();

// Export class for testing/custom instantiation
export { LocalMLService };
