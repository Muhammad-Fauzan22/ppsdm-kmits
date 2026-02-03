/**
 * Multi-Provider AI Router with Fallback
 * 
 * This module provides a unified interface for multiple AI providers
 * with automatic fallback capabilities for maximum reliability.
 * 
 * Providers (in priority order):
 * 1. Groq - Fastest inference, great for real-time
 * 2. OpenAI - Reliable, high quality
 * 3. OpenRouter - Access to multiple models (Claude, etc.)
 * 4. Google AI (Gemini) - Cost-effective
 * 5. Hugging Face - Open source models
 */

import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Provider configuration with models and priorities
interface ProviderConfig {
  name: string;
  key: string | undefined;
  baseURL?: string;
  models: {
    fast: string;
    balanced: string;
    powerful: string;
  };
  priority: number;
}

export const aiProviders: Record<string, ProviderConfig> = {
  groq: {
    name: 'Groq',
    key: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
    models: {
      fast: 'llama-3.1-8b-instant',
      balanced: 'llama-3.3-70b-versatile',
      powerful: 'mixtral-8x7b-32768',
    },
    priority: 1,
  },
  openai: {
    name: 'OpenAI',
    key: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    models: {
      fast: 'gpt-4o-mini',
      balanced: 'gpt-4o',
      powerful: 'gpt-4-turbo',
    },
    priority: 2,
  },
  openrouter: {
    name: 'OpenRouter',
    key: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    models: {
      fast: 'google/gemma-2-9b-it',
      balanced: 'anthropic/claude-3.5-sonnet',
      powerful: 'anthropic/claude-3-opus',
    },
    priority: 3,
  },
  google: {
    name: 'Google AI',
    key: process.env.GOOGLE_AI_API_KEY,
    models: {
      fast: 'gemini-1.5-flash',
      balanced: 'gemini-1.5-pro',
      powerful: 'gemini-1.5-pro',
    },
    priority: 4,
  },
  huggingface: {
    name: 'Hugging Face',
    key: process.env.HUGGINGFACE_API_KEY,
    baseURL: 'https://api-inference.huggingface.co/models',
    models: {
      fast: 'mistralai/Mistral-7B-Instruct-v0.2',
      balanced: 'meta-llama/Llama-2-70b-chat-hf',
      powerful: 'meta-llama/Llama-2-70b-chat-hf',
    },
    priority: 5,
  },
};

export type ProviderName = keyof typeof aiProviders;
export type ModelTier = 'fast' | 'balanced' | 'powerful';

export interface GenerationOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: ProviderName;
  tier?: ModelTier;
  enableFallback?: boolean;
  timeout?: number;
}

export interface GenerationResult {
  content: string;
  provider: ProviderName;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public provider: ProviderName,
    public cause?: Error
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}

/**
 * Generate content with automatic provider fallback
 */
export async function generateWithFallback(
  options: GenerationOptions
): Promise<GenerationResult> {
  const {
    prompt,
    systemPrompt,
    temperature = 0.7,
    maxTokens = 2000,
    provider,
    tier = 'balanced',
    enableFallback = true,
    timeout = 30000,
  } = options;

  // Determine provider order
  const providerOrder: ProviderName[] = provider
    ? [provider]
    : (Object.keys(aiProviders) as ProviderName[]).sort(
      (a, b) => aiProviders[a].priority - aiProviders[b].priority
    );

  const errors: AIProviderError[] = [];

  for (const providerName of providerOrder) {
    const config = aiProviders[providerName];

    if (!config.key) {
      errors.push(new AIProviderError(`No API key configured`, providerName));
      continue;
    }

    try {
      const startTime = Date.now();
      const result = await generateWithProvider(providerName, {
        prompt,
        systemPrompt,
        temperature,
        maxTokens,
        tier,
        timeout,
      });

      return {
        ...result,
        latency: Date.now() - startTime,
      };
    } catch (error) {
      const aiError = new AIProviderError(
        error instanceof Error ? error.message : 'Unknown error',
        providerName,
        error instanceof Error ? error : undefined
      );
      errors.push(aiError);

      if (!enableFallback) break;

      console.warn(`Provider ${providerName} failed:`, aiError.message);
      continue;
    }
  }

  throw new AggregateError(
    errors,
    `All AI providers failed. Errors: ${errors.map(e => `${e.provider}: ${e.message}`).join(', ')}`
  );
}

/**
 * Generate content with a specific provider
 */
async function generateWithProvider(
  providerName: ProviderName,
  options: {
    prompt: string;
    systemPrompt?: string;
    temperature: number;
    maxTokens: number;
    tier: ModelTier;
    timeout: number;
  }
): Promise<Omit<GenerationResult, 'latency'>> {
  const config = aiProviders[providerName];
  const model = config.models[options.tier];

  switch (providerName) {
    case 'groq':
    case 'openai':
    case 'openrouter':
      return generateWithOpenAICompatible(config, model, options);

    case 'google':
      return generateWithGoogleAI(model, options);

    case 'huggingface':
      return generateWithHuggingFace(model, options);

    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

/**
 * Generate with OpenAI-compatible API (Groq, OpenAI, OpenRouter)
 */
async function generateWithOpenAICompatible(
  config: ProviderConfig,
  model: string,
  options: {
    prompt: string;
    systemPrompt?: string;
    temperature: number;
    maxTokens: number;
  }
): Promise<Omit<GenerationResult, 'latency'>> {
  const client = new OpenAI({
    apiKey: config.key,
    baseURL: config.baseURL,
  });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  messages.push({ role: 'user', content: options.prompt });

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: options.temperature,
    max_tokens: options.maxTokens,
  });

  const choice = response.choices[0];

  if (!choice?.message?.content) {
    throw new Error('No content received from API');
  }

  const providerName = Object.keys(aiProviders).find(
    key => aiProviders[key] === config
  ) as ProviderName;

  return {
    content: choice.message.content,
    provider: providerName,
    model,
    usage: response.usage ? {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens,
    } : undefined,
  };
}

/**
 * Generate with Google AI (Gemini)
 */
async function generateWithGoogleAI(
  model: string,
  options: {
    prompt: string;
    systemPrompt?: string;
    temperature: number;
    maxTokens: number;
  }
): Promise<Omit<GenerationResult, 'latency'>> {
  const genAI = new GoogleGenerativeAI(aiProviders.google.key!);
  const genModel = genAI.getGenerativeModel({ model });

  const chat = genModel.startChat({
    generationConfig: {
      temperature: options.temperature,
      maxOutputTokens: options.maxTokens,
    },
  });

  if (options.systemPrompt) {
    await chat.sendMessage(options.systemPrompt);
  }

  const result = await chat.sendMessage(options.prompt);
  const response = await result.response;
  const text = response.text();

  return {
    content: text,
    provider: 'google',
    model,
  };
}

/**
 * Generate with Hugging Face Inference API
 */
async function generateWithHuggingFace(
  model: string,
  options: {
    prompt: string;
    systemPrompt?: string;
    temperature: number;
    maxTokens: number;
  }
): Promise<Omit<GenerationResult, 'latency'>> {
  const fullPrompt = options.systemPrompt
    ? `${options.systemPrompt}\n\nUser: ${options.prompt}\nAssistant:`
    : `User: ${options.prompt}\nAssistant:`;

  const response = await fetch(
    `${aiProviders.huggingface.baseURL}/${model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiProviders.huggingface.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          temperature: options.temperature,
          max_new_tokens: options.maxTokens,
          return_full_text: false,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }

  const result = await response.json();
  const generatedText = Array.isArray(result) ? result[0]?.generated_text : result.generated_text;

  return {
    content: generatedText || '',
    provider: 'huggingface',
    model,
  };
}

/**
 * Check which providers are available
 */
export function getAvailableProviders(): ProviderName[] {
  return (Object.keys(aiProviders) as ProviderName[]).filter(
    name => !!aiProviders[name].key
  );
}

interface ProviderHealth {
  available: boolean;
  latency?: number;
  error?: string;
}

/**
 * Get provider status and health
 */
export async function getProviderHealth(): Promise<Record<ProviderName, ProviderHealth>> {
  const health = {} as Record<ProviderName, ProviderHealth>;

  for (const providerName of Object.keys(aiProviders) as ProviderName[]) {
    const config = aiProviders[providerName];

    if (!config.key) {
      health[providerName] = { available: false, error: 'No API key configured' };
      continue;
    }

    const startTime = Date.now();
    try {
      await generateWithProvider(providerName, {
        prompt: 'Hi',
        temperature: 0.5,
        maxTokens: 10,
        tier: 'fast',
        timeout: 5000,
      });

      health[providerName] = { available: true, latency: Date.now() - startTime };
    } catch (error) {
      health[providerName] = {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  return health;
}

// Export default for convenience
const aiProvidersExport = {
  generate: generateWithFallback,
  getAvailableProviders,
  getProviderHealth,
  providers: aiProviders,
};

export default aiProvidersExport;
