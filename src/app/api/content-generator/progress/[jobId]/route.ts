import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;

    // Get job status
    const { data: job, error } = await supabase
      .from("content_generation_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Build progress structure
    const layerStatus: Record<string, any> = {};
    for (let i = 1; i <= 10; i++) {
      const layerNames = [
        "Layer 1: Extraction & Metadata",
        "Layer 2: Multi-Source Enrichment",
        "Layer 3: Synthesis Module",
        "Layer 4: Audio Learning",
        "Layer 5: Gamification",
        "Layer 6: Output Generation",
        "Layer 7: Distribution",
        "Layer 8: Presentation (PPT)",
        "Layer 9: NotebookLM Audio",
        "Layer 10: Interactive Scenarios",
      ];

      layerStatus[layerNames[i - 1]] = {
        status: i <= job.current_layer ? "completed" : i === job.current_layer + 1 && job.status === "processing" ? "in_progress" : "pending",
        progress_percent: i <= job.current_layer ? 100 : 0,
      };
    }

    return NextResponse.json({
      status: job.status,
      progress: {
        current_layer: job.current_layer,
        total_layers: 10,
        overall_percent: job.progress,
        elapsed_seconds: job.started_at
          ? Math.floor((new Date().getTime() - new Date(job.started_at).getTime()) / 1000)
          : 0,
        estimated_remaining_seconds: (10 - job.current_layer) * 3,
        layer_status: layerStatus,
      },
      result: job.result,
      error: job.error,
    });

  } catch (error) {
    console.error("Progress check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}