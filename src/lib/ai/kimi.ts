/**
 * Kimi AI Integration (via Unified AI Service)
 * Deprecated: Use @/lib/ai-service.ts instead
 * This file is kept for backward compatibility
 */

import { queryAI, AIMessage } from "@/lib/ai-service";

interface KimiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * @deprecated Use queryAI from @/lib/ai-service instead
 * This wrapper is kept for backward compatibility only
 */
export async function chatWithKimi(messages: KimiMessage[]) {
  try {
    const result = await queryAI(
      messages as AIMessage[],
      undefined,
      16384
    );

    if (!result.success) {
      throw new Error(`Kimi API Error: ${result.error}`);
    }

    return result.content;
  } catch (error) {
    throw error;
  }
}
