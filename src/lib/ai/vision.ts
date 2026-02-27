/**
 * Vision AI Module
 * 
 * Provides image analysis capabilities using NVIDIA's vision API.
 * API key is loaded from environment variables ONLY - never hardcoded.
 */

import OpenAI from 'openai';

// Lazy-initialize client to avoid errors when key is not set
let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (_client) return _client;

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error(
      '[CONFIG] NVIDIA_API_KEY environment variable is required for vision analysis. ' +
      'Set it in your .env.local file.'
    );
  }

  _client = new OpenAI({
    apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });

  return _client;
}

/**
 * Analyze an image using NVIDIA's vision model.
 * 
 * @param imageUrl - URL of the image to analyze (must be publicly accessible)
 * @param prompt - Instruction for what to analyze in the image
 * @returns Analysis result as a string
 */
export async function analyzeImage(imageUrl: string, prompt: string): Promise<string> {
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('imageUrl must be a non-empty string');
  }
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('prompt must be a non-empty string');
  }

  const client = getClient();

  const response = await client.chat.completions.create({
    model: 'meta/llama-3.2-90b-vision-instruct',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
    max_tokens: 1024,
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response received from vision API');
  }

  return content;
}

/**
 * Analyze a base64-encoded image.
 * 
 * @param base64Data - Base64-encoded image data (without data: prefix)
 * @param mimeType - MIME type of the image (e.g., 'image/jpeg')
 * @param prompt - Instruction for what to analyze
 * @returns Analysis result as a string
 */
export async function analyzeBase64Image(
  base64Data: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp',
  prompt: string
): Promise<string> {
  const dataUrl = `data:${mimeType};base64,${base64Data}`;
  return analyzeImage(dataUrl, prompt);
}
