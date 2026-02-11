/**
 * PPSDM KMITS - Unified AI Service
 * Integrates 14 AI providers for content generation, analysis, and processing
 */

import { AI_CONFIG, AI_ENDPOINTS, checkProviderHealth, getBestProvider } from './ai-providers-config';

// Types
export interface AIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
}

export interface ContentGenerationRequest {
  type: 'course' | 'assessment' | 'report' | 'summary' | 'quiz';
  topic: string;
  targetAudience?: string;
  language?: 'id' | 'en';
  length?: 'short' | 'medium' | 'long';
}

// Provider-specific implementations
class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = AI_ENDPOINTS.gemini.apiKey;
    this.baseUrl = AI_ENDPOINTS.gemini.baseUrl;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const model = request.model || AI_ENDPOINTS.gemini.models.flash;
    
    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: request.systemPrompt 
                ? `${request.systemPrompt}\n\n${request.prompt}`
                : request.prompt
            }]
          }],
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: request.maxTokens || 2048,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      provider: 'gemini',
      model,
      latency: Date.now() - startTime,
    };
  }
}

class OpenAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = AI_ENDPOINTS.openai.apiKey;
    this.baseUrl = AI_ENDPOINTS.openai.baseUrl;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const model = request.model || AI_ENDPOINTS.openai.models.gpt35;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      content: data.choices?.[0]?.message?.content || '',
      provider: 'openai',
      model,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      latency: Date.now() - startTime,
    };
  }
}

class GroqService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = AI_ENDPOINTS.groq.apiKey;
    this.baseUrl = AI_ENDPOINTS.groq.baseUrl;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const model = request.model || AI_ENDPOINTS.groq.models.llama3;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      content: data.choices?.[0]?.message?.content || '',
      provider: 'groq',
      model,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      latency: Date.now() - startTime,
    };
  }
}

class HuggingFaceService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = AI_ENDPOINTS.huggingface.apiKey;
    this.baseUrl = AI_ENDPOINTS.huggingface.baseUrl;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const model = request.model || AI_ENDPOINTS.huggingface.models.mistral;

    const response = await fetch(`${this.baseUrl}/models/${model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        inputs: request.systemPrompt 
          ? `${request.systemPrompt}\n\n${request.prompt}`
          : request.prompt,
        parameters: {
          temperature: request.temperature || 0.7,
          max_new_tokens: request.maxTokens || 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      content: Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '',
      provider: 'huggingface',
      model,
      latency: Date.now() - startTime,
    };
  }
}

// Unified AI Service
export class UnifiedAIService {
  private providers: Map<string, any> = new Map();
  private fallbackChain: string[] = ['groq', 'gemini', 'openai', 'huggingface'];

  constructor() {
    // Initialize providers
    if (AI_ENDPOINTS.gemini.apiKey) {
      this.providers.set('gemini', new GeminiService());
    }
    if (AI_ENDPOINTS.openai.apiKey) {
      this.providers.set('openai', new OpenAIService());
    }
    if (AI_ENDPOINTS.groq.apiKey) {
      this.providers.set('groq', new GroqService());
    }
    if (AI_ENDPOINTS.huggingface.apiKey) {
      this.providers.set('huggingface', new HuggingFaceService());
    }
  }

  async generate(request: AIRequest, preferredProvider?: string): Promise<AIResponse> {
    const providersToTry = preferredProvider 
      ? [preferredProvider, ...this.fallbackChain.filter(p => p !== preferredProvider)]
      : this.fallbackChain;

    for (const providerName of providersToTry) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      try {
        const isHealthy = await checkProviderHealth(providerName as any);
        if (!isHealthy) continue;

        const response = await provider.generate(request);
        return response;
      } catch (error) {
        continue;
      }
    }

    throw new Error('All AI providers failed');
  }

  async generateContent(request: ContentGenerationRequest): Promise<AIResponse> {
    const systemPrompts: Record<string, string> = {
      course: `You are an expert educational content creator for PPSDM KMITS. 
Create comprehensive course content in Indonesian language.
Structure: Learning Objectives, Content Modules, Activities, Assessments.`,
      
      assessment: `You are a psychometric assessment designer for PPSDM KMITS.
Create assessment questions for 9 dimensions: Cognitive, Emotional, Social, Physical, 
Spiritual, Character, Financial, Self-Management, and Environmental.`,
      
      report: `You are a data analyst for PPSDM KMITS.
Generate insightful reports based on student assessment data.
Include: Summary, Strengths, Areas for Improvement, Recommendations.`,
      
      summary: `Create concise summaries of educational content in Indonesian.
Focus on key takeaways and actionable insights.`,
      
      quiz: `Create engaging quiz questions with multiple choice answers.
Include: Question, 4 Options, Correct Answer, Explanation.`,
    };

    const lengthMultipliers: Record<string, number> = {
      short: 500,
      medium: 1000,
      long: 2000,
    };

    const prompt = `Generate ${request.type} content about "${request.topic}".
Target Audience: ${request.targetAudience || 'Mahasiswa ITS'}
Language: ${request.language === 'en' ? 'English' : 'Indonesian'}
Length: Approximately ${lengthMultipliers[request.length || 'medium']} words`;

    return this.generate({
      prompt,
      systemPrompt: systemPrompts[request.type],
      temperature: 0.7,
      maxTokens: lengthMultipliers[request.length || 'medium'] * 2,
    });
  }

  async batchGenerate(requests: AIRequest[], concurrency: number = 3): Promise<AIResponse[]> {
    const results: AIResponse[] = [];
    
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(req => this.generate(req).catch(err => ({
          content: `Error: ${err.message}`,
          provider: 'error',
          model: 'none',
          latency: 0,
        })))
      );
      results.push(...batchResults);
    }
    
    return results;
  }


  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Export singleton instance
export const aiService = new UnifiedAIService();

// Helper functions
export async function generateCourseContent(
  topic: string, 
  options?: Partial<ContentGenerationRequest>
): Promise<string> {
  const response = await aiService.generateContent({
    type: 'course',
    topic,
    ...options,
  });
  return response.content;
}

export async function generateAssessment(
  dimension: string,
  level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): Promise<string> {
  const response = await aiService.generateContent({
    type: 'assessment',
    topic: `${dimension} Assessment - ${level} level`,
    targetAudience: 'Mahasiswa ITS',
  });
  return response.content;
}

export async function generateReportSummary(data: any): Promise<string> {
  const prompt = `Analyze this student data and generate a comprehensive report:
${JSON.stringify(data, null, 2)}`;

  const response = await aiService.generate({
    prompt,
    systemPrompt: 'You are a student development analyst for PPSDM KMITS.',
    temperature: 0.5,
  });
  
  return response.content;
}

export default aiService;
