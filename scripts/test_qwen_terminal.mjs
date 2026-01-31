#!/usr/bin/env node
/**
 * Terminal test script for QWEN AI API
 * Usage: node test_qwen_terminal.mjs "Your question here"
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const QWEN_API_KEY = process.env.QWEN_API_KEY;

if (!QWEN_API_KEY) {
  console.error('❌ Error: QWEN_API_KEY not found in .env.local');
  console.error('Make sure QWEN_API_KEY is set in your .env.local file');
  process.exit(1);
}

async function testQwen(prompt, maxTokens = 1024) {
  console.log(`🔑 API Key: ${QWEN_API_KEY.substring(0, 10)}...`);
  console.log(`📝 Prompt: ${prompt}`);
  console.log('-'.repeat(50));

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP Error ${response.status}: ${errorText}`);
      return false;
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      console.log('✅ QWEN Response:');
      console.log('='.repeat(50));
      console.log(content);
      console.log('='.repeat(50));
      console.log(`📊 Model: ${data.model || 'unknown'}`);
      console.log(`🔢 Tokens: ${data.usage?.total_tokens || 'N/A'}`);
      return true;
    } else {
      console.error('❌ Error: Unexpected response format');
      console.error(data);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  // Interactive mode
  console.log('🤖 QWEN AI Terminal - Interactive Mode');
  console.log('Enter your prompt (or "quit" to exit):\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('> ', async (input) => {
      if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit' || input.toLowerCase() === 'q') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }
      
      if (input.trim()) {
        await testQwen(input);
      }
      askQuestion();
    });
  };

  askQuestion();
} else {
  // Command line mode
  const prompt = args.join(' ');
  testQwen(prompt).then(success => {
    process.exit(success ? 0 : 1);
  });
}
