import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: any;
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = {
        book_title: formData.get("book_title"),
        language: formData.get("language") || "id",
        description: formData.get("description"),
        has_pdf: formData.has("pdf"),
      };
    } else {
      body = await req.json();
    }

    const { book_title, language, book_url, description } = body;

    if (!book_title) {
      return NextResponse.json({ error: "Book title is required" }, { status: 400 });
    }

    // Generate job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create job record
    const { error: insertError } = await supabase
      .from("content_generation_jobs")
      .insert({
        id: jobId,
        user_id: user.id,
        book_title,
        book_url,
        language,
        description,
        status: "pending",
        current_layer: 0,
        total_layers: 10,
        progress: 0,
      });

    if (insertError) {
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }

    // Start async processing
    processJob(jobId, { book_title, language, book_url, description });

    return NextResponse.json({
      success: true,
      job_id: jobId,
      message: "Content generation started",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function processJob(jobId: string, params: any) {
  try {
    const supabase = await createClient();
    
    // Update status to processing
    await supabase
      .from("content_generation_jobs")
      .update({ status: "processing", started_at: new Date().toISOString() })
      .eq("id", jobId);

    // Simulate 10-layer pipeline processing
    for (let layer = 1; layer <= 10; layer++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      await supabase
        .from("content_generation_jobs")
        .update({
          current_layer: layer,
          progress: (layer / 10) * 100,
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId);
    }

    // Generate result
    const result = {
      book_title: params.book_title,
      book_slug: params.book_title.toLowerCase().replace(/\s+/g, "-"),
      output_directory: `content_output/${params.book_title.toLowerCase().replace(/\s+/g, "-")}`,
      quality_score: 85,
      files_generated: [
        "1_summary.md",
        "2_deep_dive.md",
        "3_action_plan.md",
        "4_audio_script.txt",
        "5_gamification.json",
        "6_presentation.json",
        "7_podcast_script.json",
        "8_interactive_scenarios.json",
        "metadata.json",
      ],
    };

    // Update to completed
    await supabase
      .from("content_generation_jobs")
      .update({
        status: "completed",
        progress: 100,
        result,
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId);

  } catch (error) {
    const supabase = await createClient();
    await supabase
      .from("content_generation_jobs")
      .update({
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  }
}