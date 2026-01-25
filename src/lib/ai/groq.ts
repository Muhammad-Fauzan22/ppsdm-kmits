import 'server-only';
import Groq from "groq-sdk";

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
    console.warn("GROQ_API_KEY is not defined in environment variables.");
}

export const groq = new Groq({
    apiKey: groqApiKey,
});

export const MODEL_NAME = "llama3-70b-8192"; // Fast and powerful

export async function generateJSON(prompt: string, schema?: object) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that outputs JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: MODEL_NAME,
            response_format: { type: "json_object" },
        });

        return JSON.parse(completion.choices[0].message.content || "{}");
    } catch (error) {
        console.error("Groq JSON Generation Error:", error);
        throw error;
    }
}

export async function generateText(prompt: string) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: MODEL_NAME,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Groq Text Generation Error:", error);
        throw error;
    }
}
