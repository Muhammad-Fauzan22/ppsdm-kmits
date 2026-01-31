import { z } from "zod";

// API Configuration
// NOTE: In production, this should be in process.env
const KIMI_API_KEY = "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";
const KIMI_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

interface KimiMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export async function chatWithKimi(messages: KimiMessage[]) {
    try {
        const response = await fetch(KIMI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KIMI_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: "moonshotai/kimi-k2.5",
                messages,
                max_tokens: 16384,
                temperature: 1.0,
                top_p: 1.0,
                stream: false,
                chat_template_kwargs: { thinking: true }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Kimi API Error: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Kimi AI Integration Error:", error);
        throw error;
    }
}
