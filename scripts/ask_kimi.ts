
import { chatWithKimi } from '../src/lib/ai/kimi'; // Adjust path if needed
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const args = process.argv.slice(2);
    const mode = args[0]; // 'roadmap', 'critique', 'generate'
    const input = args.slice(1).join(" ");

    if (!input) {
        console.error("Please provide an input prompt.");
        process.exit(1);
    }

    console.log(`🤖 Kimi Agent Active. Mode: ${mode}`);
    console.log(`Thinking...`);

    let systemPrompt = "You are an expert AI software architect and educational psychologist.";
    if (mode === 'roadmap') {
        systemPrompt += " Create a detailed implementation roadmap for the requested feature.";
    } else if (mode === 'critique') {
        systemPrompt += " Critique the provided code or concept for scientific validity and technical robustness.";
    }

    try {
        const response = await chatWithKimi([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input }
        ]);

        console.log("\n--- KIMI RESPONSE ---\n");
        console.log(response);
        console.log("\n---------------------\n");

    } catch (error) {
        console.error("Error communicating with Kimi:", error);
    }
}

main();
