import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";
import Replicate from "replicate";

// Initialize Clients (Lazy Load or Global)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'gsk_placeholder' });
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || 'hf_placeholder');
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN || 'r8_placeholder' });

export type SwarmTask = 'summary' | 'creative' | 'visual' | 'analysis';

export async function swarmGenerate(task: SwarmTask, prompt: string, jsonMode: boolean = false): Promise<string> {
    console.log(`[Swarm Router] Routing task '${task}'...`);

    try {
        switch (task) {
            case 'summary':
            case 'analysis':
                return await runGroq(prompt, jsonMode);
            case 'creative':
                return await runHuggingFace(prompt);
            case 'visual':
                return await runReplicate(prompt); // Returns Image URL usually, but here simulating text desc for now or handling separate
            default:
                return await runGroq(prompt, jsonMode);
        }
    } catch (error) {
        console.error(`[Swarm Error] Task ${task} failed:`, error);
        // Fallback Hierarchy
        if (task === 'summary') return await runHuggingFace(prompt);
        return "Generation Failed";
    }
}

async function runGroq(prompt: string, jsonMode: boolean) {
    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: jsonMode ? "You are a JSON generator. Output valid JSON only." : "You are a helpful assistant." },
            { role: "user", content: prompt }
        ],
        model: "llama3-70b-8192",
        response_format: jsonMode ? { type: "json_object" } : undefined
    });
    return completion.choices[0]?.message?.content || "";
}

async function runHuggingFace(prompt: string) {
    const result = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: { max_new_tokens: 1000 }
    });
    return result.generated_text;
}

async function runReplicate(prompt: string) {
    // For text generation via Replicate (e.g. Llama 3 on Replicate if Groq fails)
    // Or for Image generation. Assuming text for this router context unless specified.
    // Placeholder for now as Replicate usually serves images/specialized models
    return "Replicate text response placeholder";
}
