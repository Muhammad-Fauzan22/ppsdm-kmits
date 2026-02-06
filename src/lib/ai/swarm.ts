import { createOpenAI } from "@ai-sdk/openai";
import { generateText as aiGenerateText, generateObject } from "ai";
import { z } from "zod";

// Provider Configuration
const PROVIDERS = {
    groq: {
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
        model: 'llama3-70b-8192', // Fast & Good
        tier: 'fast_free'
    },
    openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
        model: 'mistralai/mistral-large', // Reliable
        tier: 'aggregator'
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: undefined,
        model: 'gpt-4o', // Premium Fallback
        tier: 'premium'
    }
    // Add other providers here...
};

type ProviderKey = keyof typeof PROVIDERS;

export class SwarmEngine {
    private static instance: SwarmEngine;

    private constructor() { }

    static getInstance(): SwarmEngine {
        if (!SwarmEngine.instance) {
            SwarmEngine.instance = new SwarmEngine();
        }
        return SwarmEngine.instance;
    }

    /**
     * Generates content using the "Swarm" strategy:
     * 1. Try Fast/Free Tier (Groq)
     * 2. Fallback to Aggregator (OpenRouter)
     * 3. Last Resort: Premium (OpenAI)
     */
    async generate(prompt: string, systemPrompt: string = "You are a helpful AI."): Promise<string> {
        const strategy: ProviderKey[] = ['groq', 'openrouter', 'openai'];

        for (const providerKey of strategy) {
            if (!PROVIDERS[providerKey].apiKey) continue;

            try {
                console.log(`[Swarm] Routing to node: ${providerKey}`);
                const result = await this.executeProvider(providerKey, prompt, systemPrompt);
                return result;
            } catch (error) {
                console.warn(`[Swarm] Node ${providerKey} failed or busy. Rolling over...`, error);
                continue;
            }
        }

        throw new Error("All Swarm Nodes are exhausted or failed.");
    }

    async generateJSON(prompt: string, schema?: any): Promise<any> {
        // Simple wrapper for now, assuming JSON prompt instructions
        const response = await this.generate(prompt + "\n\nIMPORTANT: Respond with valid JSON only.");
        try {
            // Clean markdown code blocks if present
            const clean = response.replace(/```json\n|\n```/g, '').replace(/```/g, '');
            return JSON.parse(clean);
        } catch (e) {
            console.error("JSON Parse Error", e);
            throw e;
        }
    }

    private async executeProvider(key: ProviderKey, prompt: string, system: string) {
        const config = PROVIDERS[key];

        // We use the 'openai' client compatibility for most providers (Groq, OpenRouter support this)
        const client = createOpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseURL // Optional for standard OpenAI
        });

        const { text } = await aiGenerateText({
            model: client(config.model),
            system: system,
            prompt: prompt,
        });

        return text;
    }
}

export const swarm = SwarmEngine.getInstance();
