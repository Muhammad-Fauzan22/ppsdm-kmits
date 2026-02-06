import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST - Complete assessment and calculate gaps
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { session_id } = body;

        if (!session_id) {
            return NextResponse.json(
                { error: "session_id required" },
                { status: 400 }
            );
        }

        // Call the gap calculation function
        const { error: gapError } = await supabase
            .rpc("calculate_comprehensive_gaps", { p_session_id: session_id });

        if (gapError) throw gapError;

        // Generate roadmap
        const { data: roadmapId, error: roadmapError } = await supabase
            .rpc("generate_roadmap", { p_session_id: session_id });

        if (roadmapError) throw roadmapError;

        // Get the results
        const { data: gaps, error: fetchError } = await supabase
            .from("comprehensive_gaps")
            .select("*")
            .eq("session_id", session_id)
            .order("gap_score", { ascending: false });

        if (fetchError) throw fetchError;

        // Get session with scores
        const { data: session } = await supabase
            .from("comprehensive_sessions")
            .select("*")
            .eq("id", session_id)
            .single();

        // Get roadmap
        const { data: roadmap } = await supabase
            .from("development_roadmaps")
            .select("*")
            .eq("id", roadmapId)
            .single();

        // Calculate summary
        const summary = {
            overall_score: session?.overall_score || 0,
            dimensions: gaps?.length || 0,
            critical_areas: gaps?.filter((g: any) => g.priority_level === "critical").length || 0,
            high_priority: gaps?.filter((g: any) => g.priority_level === "high").length || 0,
            moderate_areas: gaps?.filter((g: any) => g.priority_level === "moderate").length || 0,
            minimal_gaps: gaps?.filter((g: any) => g.priority_level === "minimal").length || 0,
        };

        return NextResponse.json({
            success: true,
            summary,
            gaps,
            dimension_scores: session?.dimension_scores,
            roadmap,
        });
    } catch (error) {
        console.error("Error completing assessment:", error);
        return NextResponse.json(
            { error: "Failed to complete assessment" },
            { status: 500 }
        );
    }
}

// GET - Get gap analysis results
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("session_id");

        let query = supabase
            .from("comprehensive_gaps")
            .select("*")
            .eq("user_id", user.id)
            .order("gap_score", { ascending: false });

        if (sessionId) {
            query = query.eq("session_id", sessionId);
        }

        const { data: gaps, error } = await query;

        if (error) throw error;

        // Group by priority
        const byPriority = {
            critical: gaps?.filter((g: any) => g.priority_level === "critical") || [],
            high: gaps?.filter((g: any) => g.priority_level === "high") || [],
            moderate: gaps?.filter((g: any) => g.priority_level === "moderate") || [],
            minimal: gaps?.filter((g: any) => g.priority_level === "minimal") || [],
        };

        return NextResponse.json({
            success: true,
            gaps,
            byPriority,
            summary: {
                total: gaps?.length || 0,
                critical: byPriority.critical.length,
                high: byPriority.high.length,
                moderate: byPriority.moderate.length,
                minimal: byPriority.minimal.length,
                avgGap: gaps?.reduce((sum: number, g: any) => sum + g.gap_score, 0) / (gaps?.length || 1),
            },
        });
    } catch (error) {
        console.error("Error fetching gaps:", error);
        return NextResponse.json(
            { error: "Failed to fetch gap analysis" },
            { status: 500 }
        );
    }
}
