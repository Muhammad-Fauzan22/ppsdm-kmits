
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJson } from "serpapi";
import { google } from "googleapis";

// --- CONFIGURATION ---
const GEN_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const SERPAPI_KEY = process.env.SERPAPI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// --- HELPER: Sheets Logging ---
async function logToSheet(data: any[]) {
    if (!GOOGLE_API_KEY || !SHEET_ID) return;
    try {
        const sheets = google.sheets({ version: "v4", auth: GOOGLE_API_KEY });
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Processing Logs!A1", // Assumes a sheet named "Processing Logs"
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [data] }
        });
    } catch (e) {
        console.error("Sheet Log Error (Likely Permission):", e);
        // Fallback: We rely on Supabase logs if Sheets fails (API Key usually can't write to private sheets)
    }
}

// --- HELPER: Web Intelligence ---
async function fetchBookReviews(title: string, author: string) {
    if (!SERPAPI_KEY) return [];
    console.log(`Searching reviews for: ${title}`);

    // Use SerpAPI to search Google
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(title + " " + author + " book review")}&api_key=${SERPAPI_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const organic_results = data.organic_results || [];

        return organic_results.slice(0, 5).map((r: any) => ({
            source: r.source || new URL(r.link).hostname,
            snippet: r.snippet,
            link: r.link,
            rating: r.rating || null
        }));
    } catch (e) {
        console.error("SerpAPI Error:", e);
        return [];
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { bookId } = body;

        if (!bookId) return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
        if (!GEN_AI_API_KEY) return NextResponse.json({ error: "Missing AI Key" }, { status: 500 });

        // 1. Fetch Book
        const { data: book, error } = await supabase
            .from("books")
            .select("*")
            .eq("id", bookId)
            .single();

        if (error || !book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

        await supabase.from("books").update({ processing_status: "processing" }).eq("id", bookId);

        // 2. Web Intelligence (Triangulation)
        const reviews = await fetchBookReviews(book.title || book.original_filename, book.authors?.[0] || "");

        // 3. AI Synthesis
        const genAI = new GoogleGenerativeAI(GEN_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use 1.5-flash for speed/free

        const prompt = `
      You are an expert Content Architect. Create a learning module for: "${book.title}".
      
      CONTEXT FROM WEB REVIEWS:
      ${JSON.stringify(reviews.map((r: any) => r.snippet).join("\n"))}

      TASK:
      Synthesize this book into a structured learning module JSON.
      
      OUTPUT FORMAT:
      {
        "module_title": "Creative Title",
        "description": "2 sentence summary",
        "topic": "Primary Subject",
        "learning_objectives": ["Obj 1", "Obj 2", ...],
        "key_concepts": [{"concept": "Term", "confidence": 0.8}],
        "synthesized_content": "# Overview\\n...markdown content...",
        "assessment_questions": [{"question": "Q", "answer": "A"}],
        "confidence_score": 0.9
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json|```/g, "").trim();
        const moduleData = JSON.parse(jsonStr);

        // 4. Save to Database
        const { data: newModule, error: modError } = await supabase.from("modules").insert({
            title: moduleData.module_title,
            topic: moduleData.topic || "General",
            description: moduleData.description,
            learning_objectives: moduleData.learning_objectives,
            key_concepts: moduleData.key_concepts,
            summary: moduleData.synthesized_content,
            assessment_items: moduleData.assessment_questions,
            source_book_ids: [bookId],
            status: "ready",
            ai_model_used: "gemini-1.5-flash",
            generation_time_ms: 0 // TODO: measure
        }).select().single();

        if (modError) throw modError;

        // 5. Update Book
        await supabase.from("books").update({
            processing_status: "completed",
            processed_at: new Date().toISOString(),
            confidence_score: moduleData.confidence_score || 0.85
        }).eq("id", bookId);

        // 6. Logging (Supabase + Sheet)
        const logData = {
            book_id: bookId,
            module_id: newModule.id,
            action: "process_complete",
            status: "success",
            message: `Processed with ${reviews.length} reviews`
        };

        await supabase.from("processing_logs").insert(logData);

        // Log to Sheet (Async, don't await)
        logToSheet([
            new Date().toISOString(),
            book.title,
            "Success",
            moduleData.module_title,
            reviews.length + " reviews"
        ]);

        return NextResponse.json({ success: true, module: newModule });

    } catch (error: any) {
        console.error("Process Logic Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
