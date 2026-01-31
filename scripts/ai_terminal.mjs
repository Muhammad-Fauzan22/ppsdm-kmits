#!/usr/bin/env node
/**
 * AI Terminal - Interactive CLI untuk berbagai AI Providers
 * Usage: node ai_terminal.mjs [provider]
 * Providers: nemotron, glm4, openai, auto (default)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

// API Configurations
const PROVIDERS = {
  nemotron: {
    name: 'Nemotron (NVIDIA)',
    apiKey: process.env.NEMOTRON_API_KEY,
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'nvidia/nemotron-3-nano-30b-a3b',
    headers: (key) => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` })
  },
  glm4: {
    name: 'GLM4 (NVIDIA)',
    apiKey: process.env.NVIDIA_API_KEY_GLM4,
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'z-ai/glm4.7',
    headers: (key) => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` })
  },
  openai: {
    name: 'OpenAI GPT',
    apiKey: process.env.OPENAI_API_KEY,
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    headers: (key) => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` })
  },
  openrouter: {
    name: 'OpenRouter',
    apiKey: process.env.OPENROUTER_API_KEY,
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    headers: (key) => ({ 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'AI Terminal'
    })
  }
};

const args = process.argv.slice(2);
const selectedProvider = args[0] || 'auto';

function getProvider(name) {
  if (name === 'auto') {
    // Try providers in order of preference
    for (const [key, provider] of Object.entries(PROVIDERS)) {
      if (provider.apiKey) return { key, ...provider };
    }
    return null;
  }
  const p = PROVIDERS[name];
  return p ? { key: name, ...p } : null;
}

const provider = getProvider(selectedProvider);

if (!provider) {
  console.error(`❌ Provider "${selectedProvider}" tidak ditemukan atau API key tidak tersedia.`);
  console.error('\nProvider yang tersedia:');
  Object.entries(PROVIDERS).forEach(([key, p]) => {
    const status = p.apiKey ? '✅' : '❌';
    console.error(`  ${status} ${key} - ${p.name}`);
  });
  console.error('\nPenggunaan: node ai_terminal.mjs [provider]');
  process.exit(1);
}

console.log(`🤖 AI Terminal - ${provider.name}`);
console.log(`🔑 API Key: ${provider.apiKey.substring(0, 15)}...`);
console.log('Enter your prompt (or "quit" to exit):\n');

async function queryAI(prompt, maxTokens = 1024) {
  try {
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: provider.headers(provider.apiKey),
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    throw error;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion() {
  rl.question('> ', async (input) => {
    if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit' || input.toLowerCase() === 'q') {
      console.log('👋 Goodbye!');
      rl.close();
      return;
    }
    
    if (input.trim()) {
      console.log('⏳ Processing...\n');
      try {
        const response = await queryAI(input);
        console.log('🤖 Response:');
        console.log('='.repeat(60));
        console.log(response);
        console.log('='.repeat(60));
        console.log();
      } catch (error) {
        console.error(`❌ Error: ${error.message}\n`);
      }
    }
    askQuestion();
  });
}

askQuestion();
