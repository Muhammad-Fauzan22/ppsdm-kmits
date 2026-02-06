/**
 * PPSDM KMITS - AI Providers Configuration
 * Integrated with 14 AI services
 */

// Environment-based configuration
const env = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // AI APIs
  googleAI: process.env.GOOGLE_AI_API_KEY || '',
  serpapi: process.env.SERPAPI_KEY || '',
  upstashQstash: process.env.UPSTASH_QSTASH_TOKEN || '',
  groq: process.env.GROQ_API_KEY || '',
  replicate: process.env.REPLICATE_API_TOKEN || '',
  huggingface: process.env.HUGGINGFACE_TOKEN || '',
  openrouter: process.env.OPENROUTER_API_KEY || '',
  openai: process.env.OPENAI_API_KEY || '',
  
  // Google Integration
  googleDriveFolder: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
  googleSheetsId: process.env.GOOGLE_SHEETS_ID || '',
  
  // Feature Flags
  enableAI: process.env.ENABLE_AI_FEATURES === 'true',
  enableContentAggregator: process.env.ENABLE_CONTENT_AGGREGATOR === 'true',
  enableEbookProcessor: process.env.ENABLE_EBOOK_PROCESSOR === 'true',
  enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
};

// AI Provider Endpoints
export const AI_ENDPOINTS = {
  // Google Gemini
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: env.googleAI,
    models: {
      flash: 'gemini-1.5-flash',
      pro: 'gemini-1.5-pro',
      ultra: 'gemini-ultra',
    },
  },
  
  // OpenAI
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: env.openai,
    models: {
      gpt4: 'gpt-4',
      gpt4Turbo: 'gpt-4-turbo-preview',
      gpt35: 'gpt-3.5-turbo',
      gpt5Nano: 'gpt-5-nano',
    },
  },
  
  // GROQ (Fast Inference)
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: env.groq,
    models: {
      llama3: 'llama3-70b-8192',
      mixtral: 'mixtral-8x7b-32768',
      gemma: 'gemma-7b-it',
    },
  },
  
  // OpenRouter (Multi-provider)
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: env.openrouter,
    models: {
      claude3: 'anthropic/claude-3-opus',
      gpt4: 'openai/gpt-4',
      llama3: 'meta-llama/llama-3-70b-instruct',
    },
  },
  
  // Hugging Face
  huggingface: {
    baseUrl: 'https://api-inference.huggingface.co',
    apiKey: env.huggingface,
    models: {
      mistral: 'mistralai/Mistral-7B-Instruct-v0.2',
      llama2: 'meta-llama/Llama-2-70b-chat-hf',
      falcon: 'tiiuae/falcon-180B-chat',
    },
  },
  
  // Replicate
  replicate: {
    baseUrl: 'https://api.replicate.com/v1',
    apiKey: env.replicate,
    models: {
      llama2: 'meta/llama-2-70b-chat',
      mistral: 'mistralai/mistral-7b-instruct-v0.1',
    },
  },
  
  // SerpAPI (Search)
  serpapi: {
    baseUrl: 'https://serpapi.com/search',
    apiKey: env.serpapi,
  },
  
  // Upstash QStash (Queue)
  upstash: {
    baseUrl: 'https://qstash.upstash.io/v2',
    token: env.upstashQstash,
  },
};

// Google Integration Config
export const GOOGLE_INTEGRATION = {
  drive: {
    folderId: env.googleDriveFolder,
    baseUrl: 'https://www.googleapis.com/drive/v3',
  },
  sheets: {
    spreadsheetId: env.googleSheetsId,
    baseUrl: 'https://sheets.googleapis.com/v4',
  },
};

// Supabase Config
export const SUPABASE_CONFIG = {
  url: env.supabaseUrl,
  anonKey: env.supabaseAnonKey,
  schemas: {
    public: 'public',
    auth: 'auth',
    storage: 'storage',
  },
};

// Feature Flags
export const FEATURES = {
  ai: env.enableAI,
  contentAggregator: env.enableContentAggregator,
  ebookProcessor: env.enableEbookProcessor,
  analytics: env.enableAnalytics,
};

// Provider Health Check
export async function checkProviderHealth(provider: keyof typeof AI_ENDPOINTS): Promise<boolean> {
  const config = AI_ENDPOINTS[provider];
  if (!config?.apiKey) return false;
  
  try {
    switch (provider) {
      case 'gemini':
        const geminiRes = await fetch(`${config.baseUrl}/models?key=${config.apiKey}`);
        return geminiRes.ok;
        
      case 'openai':
        const openaiRes = await fetch(`${config.baseUrl}/models`, {
          headers: { 'Authorization': `Bearer ${config.apiKey}` },
        });
        return openaiRes.ok;
        
      case 'groq':
        const groqRes = await fetch(`${config.baseUrl}/models`, {
          headers: { 'Authorization': `Bearer ${config.apiKey}` },
        });
        return groqRes.ok;
        
      case 'huggingface':
        const hfRes = await fetch(`${config.baseUrl}/status`, {
          headers: { 'Authorization': `Bearer ${config.apiKey}` },
        });
        return hfRes.ok;
        
      default:
        return true;
    }
  } catch {
    return false;
  }
}

// Get best available provider
export async function getBestProvider(): Promise<string> {
  const providers = ['groq', 'gemini', 'openai', 'openrouter'] as const;
  
  for (const provider of providers) {
    const isHealthy = await checkProviderHealth(provider);
    if (isHealthy) return provider;
  }
  
  return 'fallback';
}

// Export configuration
export const AI_CONFIG = {
  endpoints: AI_ENDPOINTS,
  google: GOOGLE_INTEGRATION,
  supabase: SUPABASE_CONFIG,
  features: FEATURES,
  env,
};

export default AI_CONFIG;
