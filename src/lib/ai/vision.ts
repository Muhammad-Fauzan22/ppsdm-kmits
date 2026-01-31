import { OpenAI } from "openai";

// Initialize OpenAI client compatible with Nvidia's API
const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY || "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", // Fallback to provided key if env not set
    baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function analyzeImage(base64Image: string, prompt: string = "What is in this image?") {
    try {
        const completion = await openai.chat.completions.create({
            model: "moonshotai/kimi-k2.5",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/png;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 16384,
            stream: false, // Set to true if streaming is needed
        });

        return completion.choices[0]?.message?.content || "No analysis generated.";
    } catch (error) {
        console.error("Vision Analysis Error:", error);
        throw new Error("Failed to analyze image.");
    }
}
