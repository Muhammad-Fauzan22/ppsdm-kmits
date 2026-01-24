import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { generateJSON, generateText } from "@/lib/ai/groq";
import { createClient } from "@/lib/supabase/server";
// import pdf from "pdf-parse"; // Importing normally might fail in edge/serverless depending on bundle. 
// We will simply fetch the PDF text using a helper or assume pdf-parse works in Node runtime.

export const POST = verifySignatureAppRouter(async (request: Request) => {
    try {
        const body = await request.json();
        const { file, metadata, notification } = body;

        console.log(`⚙️ Worker Started: Processing ${file.name}`);

        // 1. Download PDF
        const response = await fetch(file.download_url);
        if (!response.ok) throw new Error(`Failed to download PDF: ${response.statusText}`);
        const pdfBuffer = await response.arrayBuffer();

        // 2. Parse PDF (We need to dynamically import or use a compatible library)
        // Simple text extraction logic using pdf-parse
        const pdf = require("pdf-parse"); // CommonJS require for node libraries
        const data = await pdf(Buffer.from(pdfBuffer));
        const fullText = data.text;

        // Truncate for free tier limits (Groq has limits, though huge throughput)
        // We'll take the first 50k characters for "Summary" and "Assessment" to be safe and fast.
        // For a real full book, we'd need recursive chunking (Phase 2).
        const truncatedText = fullText.substring(0, 50000);

        console.log(`📄 PDF Parsed: ${fullText.length} chars. Processing first 50k chars.`);

        // 3. AI Synthesis (Groq)
        const prompt = `
      Analyze this book content:
      Title: ${metadata.title}
      Author: ${metadata.author}
      
      Content Snippet:
      ${truncatedText}
      
      Output a JSON object with:
      - summary: A comprehensive summary (markdown).
      - key_concepts: Array of objects { concept, explanation, confidence_score }.
      - learning_objectives: Array of strings.
      - assessment_questions: Array of { question, options (array), correct_answer, explanation }.
    `;

        const aiResult = await generateJSON(prompt);

        // 4. Save to Supabase
        const supabase = await createClient();

        // Insert Book
        const { data: bookData, error: bookError } = await supabase
            .from("books")
            .upsert({
                title: metadata.title,
                author: metadata.author,
                description: aiResult.summary || "No summary generated",
                category: metadata.category || "General",
                cover_url: file.preview_url, // Or generate one
                file_url: file.download_url
            }, { onConflict: 'title' }) // Simple de-dupe
            .select()
            .single();

        if (bookError) throw new Error(`Supabase Book Error: ${bookError.message}`);

        // Insert Module Data (Concepts, etc.) - Simplified schema mapping
        // Ideally we enter into 'modules', 'chapters', etc.
        // For now we store the JSON in a 'metadata' column if it exists or log it.

        console.log(`✅ Success! Book ID: ${bookData.id}`);

        return NextResponse.json({ success: true, bookId: bookData.id });

    } catch (error: any) {
        console.error("Worker Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Worker Error" },
            { status: 500 }
        );
    }
});
