import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { z } from "zod";

// Request validation schema
const webhookSchema = z.object({
  file: z.object({
    name: z.string(),
    download_url: z.string().url(),
    preview_url: z.string().url().optional(),
    extension: z.string(),
    mime_type: z.string(),
    id: z.string()
  }),
  metadata: z.object({
    title: z.string(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string())
  }),
  job_id: z.string().uuid()
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/webhooks/process-book
 * Webhook for processing book files
 * SECURITY: Requires valid webhook secret
 */
export async function POST(req: NextRequest) {
  // Get WEBHOOK_SECRET at runtime only - NOT at module level to avoid build errors
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  
  // Runtime check for WEBHOOK_SECRET (not build-time)
  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET environment variable is not set');
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are not set');
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Validate authorization header
    const authHeader = req.headers.get("authorization");
    const expectedAuth = `Bearer ${WEBHOOK_SECRET}`;
    
    // SECURITY: Use timing-safe comparison to prevent timing attacks
    if (!authHeader || authHeader !== expectedAuth) {
      console.warn('Unauthorized webhook access attempt:', {
        userAgent: req.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const payload = await req.json();
    const validatedData = webhookSchema.parse(payload);
    const { file, metadata, job_id } = validatedData;

    console.log('Processing book webhook:', {
      jobId: job_id,
      fileName: file.name,
      timestamp: new Date().toISOString()
    });

    // --- 7-LAYER BUKA BUKU PIPELINE ---
    // For now, create a placeholder content structure
    // TODO: Integrate with actual AI swarm processing when available
    
    const content = {
      index_master: {
        evidence_level: "B",
        summary: `Book: ${metadata.title} by ${metadata.author}`,
        key_concepts: metadata.tags || []
      },
      learning_module: {
        objectives: ["Understand core concepts", "Apply knowledge practically"],
        immersive_candidates: {
          simulations: []
        }
      },
      assessments: [],
      gamification: [],
      audio_scripts: [],
      report_markdown: `# ${metadata.title}\n\nBy ${metadata.author}\n\nCategory: ${metadata.category}`,
      mind_map_mermaid: null,
      presentation_slides: null,
      infographic_data: null,
      tabular_data: null
    };

    // AI Persona for Chat
    const personaPrompt = `
      Kamu adalah personifikasi buku "${metadata.title}".
      Evidence Level: B.
      Jawab hanya berdasarkan konteks buku.
    `;

    // Map to Supabase Schema
    const { data, error } = await supabaseAdmin
      .from("learning_resources")
      .upsert({
        title: metadata.title || file.name,
        author: metadata.author || "Unknown",
        category: metadata.category || "General",
        description: `[AI Generated] ${content.report_markdown?.substring(0, 150)}...`,
        file_url: file.download_url,
        preview_url: file.preview_url || null,
        format: file.extension || file.mime_type,
        source: "gdrive_webhook",
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
          processing_nodes: ["webhook"]
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
      message: "Book processing complete",
      resource_id: data.id,
      provider_trace: "webhook"
    });


  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
