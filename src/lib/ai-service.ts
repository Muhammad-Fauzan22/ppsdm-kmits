/**
 * Unified AI Service Layer for PPSDM KMM LMS
 * Handles all AI integrations: Nemotron, GLM4, Fallback
 * Secure API key management via environment variables
 */

import { z } from "zod";

// Type definitions
export enum AIModel {
  NEMOTRON = "nemotron",
  GLM4 = "glm4",
  QWEN = "qwen",
  KIMI_K25 = "kimi-k25",
  AUTO = "auto",
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string | AIMessageContent[];
}

export interface AIMessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface AIResponse {
  success: boolean;
  content: string;
  model: string;
  error?: string;
  timestamp: number;
}

/**
 * Get API key from environment variables
 * Secure method - never exposes keys in code
 */
function getApiKey(model: AIModel): string | null {
  if (typeof window !== "undefined") {
    // Client-side: Use public environment variables only
    console.warn(
      "AI Service: API calls should be made from server actions only"
    );
    return null;
  }

  switch (model) {
    case AIModel.NEMOTRON:
      return process.env.NEMOTRON_API_KEY || null;
    case AIModel.GLM4:
      return process.env.NVIDIA_API_KEY_GLM4 || null;
    case AIModel.QWEN:
      return process.env.QWEN_API_KEY || null;
    case AIModel.KIMI_K25:
      return process.env.NVIDIA_API_KEY || null;
    default:
      return null;
  }
}

/**
 * Query Nemotron model (Primary - Fast & Reliable)
 */
async function queryNemotron(
  messages: AIMessage[],
  maxTokens: number = 1024
): Promise<AIResponse> {
  const apiKey = getApiKey(AIModel.NEMOTRON);

  if (!apiKey) {
    return {
      success: false,
      content: "",
      model: "nemotron",
      error: "NEMOTRON_API_KEY not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-nano-30b-a3b",
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();

    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return {
        success: true,
        content: data.choices[0].message.content,
        model: "nemotron",
        timestamp: Date.now(),
      };
    }

    throw new Error("Unexpected response format from Nemotron API");
  } catch (error) {
    console.error("Nemotron query failed:", error);
    return {
      success: false,
      content: "",
      model: "nemotron",
      error: `Nemotron error: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: Date.now(),
    };
  }
}

/**
 * Query GLM4 model (Fallback - Better reasoning)
 */
async function queryGLM4(
  messages: AIMessage[],
  maxTokens: number = 1024
): Promise<AIResponse> {
  const apiKey = getApiKey(AIModel.GLM4);

  if (!apiKey) {
    return {
      success: false,
      content: "",
      model: "glm4",
      error: "NVIDIA_API_KEY_GLM4 not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "z-ai/glm4.7",
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();

    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return {
        success: true,
        content: data.choices[0].message.content,
        model: "glm4",
        timestamp: Date.now(),
      };
    }

    throw new Error("Unexpected response format from GLM4 API");
  } catch (error) {
    console.error("GLM4 query failed:", error);
    return {
      success: false,
      content: "",
      model: "glm4",
      error: `GLM4 error: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: Date.now(),
    };
  }
}

/**
 * Query QWEN model (Alibaba Cloud)
 */
async function queryQwen(
  messages: AIMessage[],
  maxTokens: number = 1024
): Promise<AIResponse> {
  const apiKey = getApiKey(AIModel.QWEN);

  if (!apiKey) {
    return {
      success: false,
      content: "",
      model: "qwen",
      error: "QWEN_API_KEY not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const response = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen-turbo-latest",
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();

    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return {
        success: true,
        content: data.choices[0].message.content,
        model: "qwen",
        timestamp: Date.now(),
      };
    }

    throw new Error("Unexpected response format from QWEN API");
  } catch (error) {
    console.error("QWEN query failed:", error);
    return {
      success: false,
      content: "",
      model: "qwen",
      error: `QWEN error: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: Date.now(),
    };
  }
}

/**
 * Query Kimi K2.5 model via NVIDIA NIM API
 * Supports both text and image inputs with thinking mode enabled
 */
async function queryKimiK25(
  messages: AIMessage[],
  maxTokens: number = 16384
): Promise<AIResponse> {
  const apiKey = getApiKey(AIModel.KIMI_K25);

  if (!apiKey) {
    return {
      success: false,
      content: "",
      model: "kimi-k25",
      error: "NVIDIA_API_KEY not configured",
      timestamp: Date.now(),
    };
  }

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "moonshotai/kimi-k2.5",
          messages,
          max_tokens: maxTokens,
          temperature: 1.0,
          top_p: 1.0,
          stream: false,
          chat_template_kwargs: { thinking: true },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();

    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return {
        success: true,
        content: data.choices[0].message.content,
        model: "kimi-k25",
        timestamp: Date.now(),
      };
    }

    throw new Error("Unexpected response format from Kimi K2.5 API");
  } catch (error) {
    console.error("Kimi K2.5 query failed:", error);
    return {
      success: false,
      content: "",
      model: "kimi-k25",
      error: `Kimi K2.5 error: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: Date.now(),
    };
  }
}

/**
 * Main AI Service - Unified interface
 * AUTO mode: Try Kimi K2.5 first, fallback to Nemotron, then GLM4, then QWEN
 */
export async function queryAI(
  messages: AIMessage[],
  model: AIModel = AIModel.AUTO,
  maxTokens: number = 1024
): Promise<AIResponse> {
  // Validate input
  if (!messages || messages.length === 0) {
    return {
      success: false,
      content: "",
      model: "auto",
      error: "No messages provided",
      timestamp: Date.now(),
    };
  }

  if (model === AIModel.AUTO) {
    // Try Kimi K2.5 first (primary - best reasoning with thinking mode)
    console.log("[AI] Attempting Kimi K2.5 (primary)...");
    const kimiResult = await queryKimiK25(messages, maxTokens);

    if (kimiResult.success) {
      console.log("[AI] ✅ Kimi K2.5 succeeded");
      return kimiResult;
    }

    // Fallback to Nemotron
    console.log("[AI] Kimi K2.5 failed, attempting Nemotron (fallback 1)...");
    const nemotronResult = await queryNemotron(messages, maxTokens);

    if (nemotronResult.success) {
      console.log("[AI] ✅ Nemotron succeeded");
      return nemotronResult;
    }

    // Fallback to GLM4
    console.log("[AI] Nemotron failed, attempting GLM4 (fallback 2)...");
    const glm4Result = await queryGLM4(messages, maxTokens);

    if (glm4Result.success) {
      console.log("[AI] ✅ GLM4 succeeded");
      return glm4Result;
    }

    // Fallback to QWEN
    console.log("[AI] GLM4 failed, attempting QWEN (final fallback)...");
    const qwenResult = await queryQwen(messages, maxTokens);

    if (qwenResult.success) {
      console.log("[AI] ✅ QWEN succeeded");
      return qwenResult;
    }

    // All failed
    return {
      success: false,
      content: "",
      model: "auto",
      error: `All models failed: Kimi K2.5 (${kimiResult.error}), Nemotron (${nemotronResult.error}), GLM4 (${glm4Result.error}), QWEN (${qwenResult.error})`,
      timestamp: Date.now(),
    };
  } else if (model === AIModel.KIMI_K25) {
    return queryKimiK25(messages, maxTokens);
  } else if (model === AIModel.NEMOTRON) {
    return queryNemotron(messages, maxTokens);
  } else if (model === AIModel.GLM4) {
    return queryGLM4(messages, maxTokens);
  } else if (model === AIModel.QWEN) {
    return queryQwen(messages, maxTokens);
  }

  return {
    success: false,
    content: "",
    model: "unknown",
    error: "Unknown model specified",
    timestamp: Date.now(),
  };
}

/**
 * Helper function for simple text prompts
 */
export async function chat(
  userMessage: string,
  systemPrompt?: string
): Promise<string> {
  const messages: AIMessage[] = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  messages.push({
    role: "user",
    content: userMessage,
  });

  const response = await queryAI(messages);

  if (!response.success) {
    throw new Error(`AI Service failed: ${response.error}`);
  }

  return response.content;
}

/**
 * Generate learning content for courses
 */
export async function generateLearningContent(
  topic: string,
  level: "beginner" | "intermediate" | "advanced" = "intermediate"
): Promise<string> {
  const systemPrompt = `You are an expert educational content creator. Generate engaging and clear learning material for a ${level} level course on "${topic}". Include:
- Key concepts and definitions
- Learning objectives
- Practical examples
- Key takeaways

Format: Clear, well-structured Markdown with proper headings.`;

  return chat(
    `Create comprehensive learning material for: ${topic}`,
    systemPrompt
  );
}

/**
 * Generate quiz questions
 */
export async function generateQuizQuestions(
  topic: string,
  count: number = 5
): Promise<string> {
  const systemPrompt = `You are an expert assessment designer. Generate ${count} multiple-choice quiz questions about "${topic}". 
For each question, provide:
- Question text
- 4 answer options (A, B, C, D)
- Correct answer
- Explanation

Format as JSON array.`;

  return chat(
    `Generate ${count} quiz questions for topic: ${topic}`,
    systemPrompt
  );
}

/**
 * Generate course curriculum
 */
export async function generateCurriculum(
  courseTitle: string,
  duration: string = "4 weeks"
): Promise<string> {
  const systemPrompt = `You are a curriculum designer. Create a detailed ${duration} curriculum for "${courseTitle}".
Include:
- Learning objectives
- Module breakdown (weekly)
- Topics covered in each module
- Assessment methods
- Recommended resources

Format: Clear structure with sections.`;

  return chat(
    `Design a curriculum for: ${courseTitle} (Duration: ${duration})`,
    systemPrompt
  );
}

/**
 * Analyze student assessment
 */
export async function analyzeAssessment(
  studentResponses: Record<string, string>,
  assessmentType: string
): Promise<string> {
  const systemPrompt = `You are an educational psychologist. Analyze the following student assessment responses for "${assessmentType}" and provide:
- Strengths identified
- Areas for improvement
- Personalized recommendations
- Next steps for learning

Be constructive and encouraging.`;

  const responsesText = Object.entries(studentResponses)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return chat(`Analyze these responses:\n${responsesText}`, systemPrompt);
}

/**
 * Helper function to create a message with image support
 * @param text - The text prompt/question about the image
 * @param imageBase64 - Base64 encoded image data
 * @param mimeType - MIME type of the image (e.g., "image/png", "image/jpeg")
 * @returns AIMessage with image content
 */
export function createImageMessage(
  text: string,
  imageBase64: string,
  mimeType: string = "image/png"
): AIMessage {
  return {
    role: "user",
    content: [
      {
        type: "text",
        text: text,
      },
      {
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${imageBase64}`,
        },
      },
    ],
  };
}

/**
 * Query AI with image analysis using Kimi K2.5
 * @param text - The question about the image
 * @param imageBase64 - Base64 encoded image
 * @param mimeType - Image MIME type
 */
export async function analyzeImage(
  text: string,
  imageBase64: string,
  mimeType: string = "image/png"
): Promise<AIResponse> {
  const messages: AIMessage[] = [
    createImageMessage(text, imageBase64, mimeType),
  ];
  return queryAI(messages, AIModel.KIMI_K25, 16384);
}

export default {
  queryAI,
  chat,
  generateLearningContent,
  generateQuizQuestions,
  generateCurriculum,
  analyzeAssessment,
  createImageMessage,
  analyzeImage,
};
