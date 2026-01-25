import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// import { generateJSON } from "@/lib/ai/groq"; // OLD SINGLE PROVIDER
import { swarm } from "@/lib/ai/swarm"; // NEW SWARM ENGINE

// Bypass RLS dengan Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== "Bearer internal-system") {
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
    }

    const payload = await req.json();
    const { file, metadata, job_id } = payload;

    console.log(`[Swarm Engine] Mobilizing Human Cloud for: ${metadata.title}`);

    // --- 7-LAYER BUKA BUKU PIPELINE PROMPT ---
    const triangulationPrompt = `
      Bertindaklah sebagai "BUKA BUKU" Engine (Scientific Learning Synthesis AI).
      
      INPUT DATA:
      - Title: "${metadata.title}"
      - Author: "${metadata.author}"
      - Category: "${metadata.category}"
      - Keywords: ${metadata.tags.join(", ")}

      METODOLOGI: Gunakan "Triangulation Synthesis":
      1. Primary Source: Metadata & Konteks Buku.
      2. Secondary Source: Internal Knowledge Base (Simulated Web Intelligence).
      3. Tertiary Source: Bloom's Taxonomy & Pedagogical Framework.

      TUGAS: Hasilkan Output 7-Layer Immersive Learning dalam format JSON Strict.

      OUTPUT JSON STRUCTURE:
      {
        "index_master": {
            "evidence_level": "A", // A/B/C
            "confidence_score": 9,
            "immersive_learning": {
                "vr_suitability_score": 7,
                "recommended_types": ["Interactive Video", "Gamified"]
            }
        },
        "learning_module": {
            "objectives": ["Obj 1", "Obj 2"],
            "core_concepts": [
                { "name": "Konsep A", "confidence": 9 },
                { "name": "Konsep B", "confidence": 8 }
            ],
            "immersive_candidates": {
                "models_3d": ["Model A", "Model B"],
                "simulations": ["Sim A", "Sim B"]
            }
        },
        "assessments": [
            { "question": "Q1", "answer": "A1", "type": "MultiChoice", "options": ["A","B","C","D"] }
        ],
        "gamification": {
            "badges": [ { "name": "Badge 1", "points": 100 } ],
            "quests": [ { "name": "Quest 1", "tasks": ["Task A", "Task B"] } ]
        },
        "mind_map_mermaid": "graph TD; ...",
        "presentation_slides": [
            { "title": "Slide 1", "bullets": [], "speaker_notes": "..." }
        ],
        "infographic_data": { 
            "stats": [{"label": "A", "value": "10"}],
            "highlight_quote": "..."
        },
        "audio_scripts": {
            "podcast_intro": "Script..."
        },
        "report_markdown": "# Title\n\nContent...",
        "tabular_data": []
      }
    `;

    // Execute via Swarm Engine (Groq -> OpenRouter -> OpenAI)
    const content = await swarm.generateJSON(triangulationPrompt);

    // AI Persona for Chat
    const personaPrompt = `
      Kamu adalah personifikasi buku "${metadata.title}".
      Evidence Level: ${content.index_master?.evidence_level || "B"}.
      Jawab hanya berdasarkan konteks buku.
    `;

    // Map to Supabase Schema
    const { data, error } = await supabaseAdmin
      .from("learning_resources")
      .upsert({
        title: metadata.title || file.name,
        author: metadata.author || "Unknown",
        category: metadata.category || "General",
        description: `[Swarm Generated] ${content.report_markdown?.substring(0, 150)}...`,
        file_url: file.download_url,
        preview_url: file.preview_url,
        format: file.extension || file.mime_type,
        source: "gdrive_swarm_10account",
        external_id: file.id,

        // Specialized Columns
        mind_map_data: content.mind_map_mermaid,
        slide_dock: content.presentation_slides,
        infographic_data: content.infographic_data,
        tabular_data: content.tabular_data,

        // JSONB Blob for all 7 Layers
        derived_content: {
          index_master: content.index_master,
          learning_module: content.learning_module,
          assessments: content.assessments,
          gamification: content.gamification,
          audio_scripts: content.audio_scripts,
          simulation_scenario: content.learning_module?.immersive_candidates?.simulations?.[0] ? {
            title: "Auto-Sim",
            situation: content.learning_module.immersive_candidates.simulations[0]
          } : null,
          report_markdown: content.report_markdown,
          processing_nodes: ["groq", "openrouter"] // Trace info
        },

        ai_persona_prompt: personaPrompt,
        processing_status: 'completed',

        key_takeaways: content.learning_module?.objectives || [],
        target_audience: "Mahasiswa ITS"
      }, { onConflict: 'external_id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Swarm Transmutation Complete",
      resource_id: data.id,
      provider_trace: "Swarm"
    });

  } catch (error: any) {
    console.error("[Swarm Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
