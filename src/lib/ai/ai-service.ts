/**
 * Enhanced AI Service Layer for PPSDM KMITS
 * Features: Request queuing, Rate limiting, Fallback mechanism, Caching
 * Integrates with: Kimi K2.5, Nemotron, GLM4, QWEN (NVIDIA NIM API)
 */

import { queryAI, AIMessage, AIResponse as BaseAIResponse } from '../ai-service';

// Extended AI Response interface
export interface EnhancedAIResponse {
  content: string;
  model: string;
  tokens: number;
  latency: number;
  cached: boolean;
  fallbackUsed?: string;
}

// Extended AI Request interface
export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
  useCache?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

// Cache entry interface
interface CacheEntry {
  content: string;
  timestamp: number;
  expiresAt: number;
}

// Queue item interface
interface QueueItem {
  request: AIRequest;
  resolve: (value: EnhancedAIResponse) => void;
  reject: (reason: Error) => void;
  timestamp: number;
  priority: number;
}

class AIServiceLayer {
  private requestQueue: QueueItem[];
  private isProcessing: boolean;
  private rateLimitRemaining: number;
  private lastReset: number;
  private cache: Map<string, CacheEntry>;
  private processingPromises: Map<string, Promise<EnhancedAIResponse>>;

  constructor() {
    this.requestQueue = [];
    this.isProcessing = false;
    this.rateLimitRemaining = 100;
    this.lastReset = Date.now();
    this.cache = new Map();
    this.processingPromises = new Map();
    
    // Initialize cache cleanup interval
    if (typeof window === 'undefined') {
      setInterval(() => this.cleanupCache(), 60000); // Clean every minute
    }
  }

  /**
   * Generate AI response with queuing, caching, and fallback
   */
  async generate(request: AIRequest): Promise<EnhancedAIResponse> {
    // Check cache first if caching is enabled
    if (request.useCache !== false) {
      const cacheKey = this.getCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          ...cached,
          model: 'cached',
          tokens: cached.content.split(' ').length,
          latency: 0,
          cached: true,
        };
      }
    }

    // Check if already processing this request
    const processingKey = this.getCacheKey(request);
    if (this.processingPromises.has(processingKey)) {
      return this.processingPromises.get(processingKey)!;
    }

    return new Promise((resolve, reject) => {
      const priority = request.priority === 'high' ? 0 : request.priority === 'low' ? 2 : 1;
      
      this.requestQueue.push({
        request,
        resolve,
        reject,
        timestamp: Date.now(),
        priority,
      });
      
      this.processQueue();
    });
  }

  /**
   * Process the request queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    // Sort by priority first, then by timestamp
    this.requestQueue.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.timestamp - b.timestamp;
    });
    
    while (this.requestQueue.length > 0) {
      const item = this.requestQueue.shift();
      if (!item) continue;
      
      try {
        const processingKey = this.getCacheKey(item.request);
        const processingPromise = this.executeWithFallback(item.request);
        this.processingPromises.set(processingKey, processingPromise);
        
        const response = await processingPromise;
        this.processingPromises.delete(processingKey);
        
        // Cache the response
        if (item.request.useCache !== false) {
          const cacheKey = this.getCacheKey(item.request);
          this.addToCache(cacheKey, response.content);
        }
        
        item.resolve(response);
      } catch (error) {
        this.processingPromises.delete(this.getCacheKey(item.request));
        item.reject(error as Error);
      }
      
      // Rate limiting
      this.rateLimitRemaining--;
      if (this.rateLimitRemaining <= 0) {
        const waitTime = 60000 - (Date.now() - this.lastReset);
        if (waitTime > 0) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.rateLimitRemaining = 100;
        this.lastReset = Date.now();
      }
    }
    
    this.isProcessing = false;
  }

  /**
   * Execute request with fallback mechanism
   */
  private async executeWithFallback(request: AIRequest): Promise<EnhancedAIResponse> {
    const models = [
      { id: 'kimi-k25', name: 'Kimi K2.5', apiKey: 'NVIDIA_API_KEY' },
      { id: 'nemotron', name: 'Nemotron', apiKey: 'NEMOTRON_API_KEY' },
      { id: 'glm4', name: 'GLM4', apiKey: 'NVIDIA_API_KEY_GLM4' },
      { id: 'qwen', name: 'QWEN', apiKey: 'QWEN_API_KEY' },
    ];
    
    const errors: Error[] = [];
    let fallbackUsed: string | undefined;
    
    for (const model of models) {
      // Check if API key is configured
      const apiKey = process.env[model.apiKey] || process.env.NVIDIA_API_KEY;
      if (!apiKey) {
        continue;
      }
      
      try {
        const start = Date.now();
        const messages: AIMessage[] = [
          {
            role: 'user',
            content: request.prompt,
          },
        ];
        
        let aiResponse: BaseAIResponse;
        
        // Map model ID to enum
        switch (model.id) {
          case 'kimi-k25':
            aiResponse = await queryAI(messages, 'kimi-k25' as any, request.maxTokens || 16384);
            break;
          case 'nemotron':
            aiResponse = await queryAI(messages, 'nemotron' as any, request.maxTokens || 1024);
            break;
          case 'glm4':
            aiResponse = await queryAI(messages, 'glm4' as any, request.maxTokens || 1024);
            break;
          case 'qwen':
            aiResponse = await queryAI(messages, 'qwen' as any, request.maxTokens || 1024);
            break;
          default:
            throw new Error(`Unknown model: ${model.id}`);
        }
        
        if (aiResponse.success) {
          return {
            content: aiResponse.content,
            model: model.id,
            tokens: aiResponse.content.split(' ').length,
            latency: Date.now() - start,
            cached: false,
            fallbackUsed,
          };
        } else {
          errors.push(new Error(aiResponse.error || 'Unknown error'));
          if (!fallbackUsed) {
            fallbackUsed = model.id;
          }
        }
      } catch (error) {
        errors.push(error as Error);
        if (!fallbackUsed) {
          fallbackUsed = model.id;
        }
        continue;
      }
    }
    
    throw new Error(`All models failed: ${errors.map(e => e.message).join(', ')}`);
  }

  /**
   * Generate cache key from request
   */
  private getCacheKey(request: AIRequest): string {
    const key = `${request.prompt.slice(0, 100)}_${request.maxTokens || 1024}_${request.temperature || 0.7}`;
    return btoa(key);
  }

  /**
   * Add response to cache
   */
  private addToCache(key: string, content: string): void {
    const now = Date.now();
    this.cache.set(key, {
      content,
      timestamp: now,
      expiresAt: now + 3600000, // 1 hour cache
    });
  }

  /**
   * Get response from cache
   */
  private getFromCache(key: string): { content: string } | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return { content: entry.content };
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { queueLength: number; isProcessing: boolean; rateLimitRemaining: number } {
    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      rateLimitRemaining: this.rateLimitRemaining,
    };
  }
}

// Export singleton instance
export const aiService = new AIServiceLayer();

// Export class for testing
export { AIServiceLayer };
