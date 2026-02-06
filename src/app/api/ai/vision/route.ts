import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai/vision";

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "Image data is required" }, { status: 400 });
        }

        // 1. Construct a specific prompt for the Portfolio Scanner
        const prompt = `
      You are an AI Portfolio Assistant. Analyze this image.
      
      Scenario A: If the image is a CERTIFICATE or AWARD:
      - Extract the "Title" of the certification.
      - Extract the "Issuer" (Organization/University).
      - Extract the "Date" (if visible, otherwise estimate year).
      - Identify key "Skills" validated by this certificate.

      Scenario B: If the image is a SCREENSHOT of a PROJECT or APP:
      - Generate a "Project Title" based on visible text.
      - Describe the "Functionality" visible in the UI.
      - Infer potential "Tech Stack" (e.g., if you see React icons, or mobile layout).
      
      Scenario C: If it's something else:
      - Provide a "Description" of what is seen.
      - Suggest how this might relate to a professional portfolio.

      Format your response as a JSON object with keys: category ('certificate' | 'project' | 'other'), title, description, issuer_or_tech, skills (array of strings). 
      DO NOT include markdown formatting like \`\`\`json, just return the raw JSON object string.
    `;

        // 2. Call the Vision API
        const analysisResult = await analyzeImage(image, prompt);

        // 3. Try to parse JSON from the response (in case AI wraps it in text)
        let parsedData;
        try {
            const cleanJson = analysisResult.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleanJson);
        } catch (e) {
            // Fallback if not valid JSON
            parsedData = {
                category: 'other',
                title: 'Analysis Result',
                description: analysisResult,
                skills: []
            };
        }

        return NextResponse.json({ success: true, data: parsedData });
    } catch (error) {
        console.error("Vision API Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze image", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
