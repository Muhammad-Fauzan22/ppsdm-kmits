import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST - Complete assessment and calculate scores
export async function POST(request: Request) {
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
                { error: "Session ID required" },
                { status: 400 }
            );
        }

        // Call the database function to complete assessment
        const { data, error } = await supabase
            .rpc("complete_assessment_session", { p_session_id: session_id });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            scores: data,
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
export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("session_id");

        let query = supabase
            .from("gap_analysis_results")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (sessionId) {
            query = query.eq("session_id", sessionId);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Calculate summary
        const summary = data.reduce((acc, item) => {
            acc.totalGap += item.gap_score;
            acc.averageScore += item.current_score;
            acc.priorityCounts[item.priority_level] = (acc.priorityCounts[item.priority_level] || 0) + 1;
            return acc;
        }, {
            totalGap: 0,
            averageScore: 0,
            priorityCounts: {} as Record<string, number>,
        });

        if (data.length > 0) {
            summary.averageScore = Math.round(summary.averageScore / data.length);
        }

        // Get top priority dimensions
        const criticalDimensions = data
            .filter(d => d.priority_level === "critical" || d.priority_level === "high")
            .sort((a, b) => b.gap_score - a.gap_score)
            .slice(0, 3);

        return NextResponse.json({
            success: true,
            data,
            summary: {
                ...summary,
                totalDimensions: data.length,
            },
            criticalDimensions,
        });
    } catch (error) {
        console.error("Error fetching gap analysis:", error);
        return NextResponse.json(
            { error: "Failed to fetch gap analysis" },
            { status: 500 }
        );
    }
}
