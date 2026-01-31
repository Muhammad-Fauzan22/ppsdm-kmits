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
  AUTO = "auto",
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
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
 * Main AI Service - Unified interface
 * AUTO mode: Try Nemotron first, fallback to GLM4
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
    // Try Nemotron first (faster, cheaper)
    console.log("[AI] Attempting Nemotron (primary)...");
    const nemotronResult = await queryNemotron(messages, maxTokens);

    if (nemotronResult.success) {
      console.log("[AI] ✅ Nemotron succeeded");
      return nemotronResult;
    }

    // Fallback to GLM4
    console.log("[AI] Nemotron failed, attempting GLM4 (fallback)...");
    const glm4Result = await queryGLM4(messages, maxTokens);

    if (glm4Result.success) {
      console.log("[AI] ✅ GLM4 succeeded");
      return glm4Result;
    }

    // Both failed
    return {
      success: false,
      content: "",
      model: "auto",
      error: `Both models failed: Nemotron (${nemotronResult.error}), GLM4 (${glm4Result.error})`,
      timestamp: Date.now(),
    };
  } else if (model === AIModel.NEMOTRON) {
    return queryNemotron(messages, maxTokens);
  } else if (model === AIModel.GLM4) {
    return queryGLM4(messages, maxTokens);
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

export default {
  queryAI,
  chat,
  generateLearningContent,
  generateQuizQuestions,
  generateCurriculum,
  analyzeAssessment,
};
