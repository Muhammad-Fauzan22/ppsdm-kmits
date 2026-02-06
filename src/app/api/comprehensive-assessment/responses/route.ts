import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST - Submit responses for comprehensive assessment
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { session_id, responses } = body;

        if (!session_id || !responses || !Array.isArray(responses)) {
            return NextResponse.json(
                { error: "session_id and responses array required" },
                { status: 400 }
            );
        }

        // Verify session belongs to user
        const { data: session, error: sessionError } = await supabase
            .from("comprehensive_sessions")
            .select("*")
            .eq("id", session_id)
            .eq("user_id", user.id)
            .single();

        if (sessionError || !session) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Upsert responses
        const formattedResponses = responses.map((r: {
            question_id: string;
            response_value: number;
            response_time_seconds?: number;
            confidence_level?: number;
        }) => ({
            session_id,
            question_id: r.question_id,
            response_value: r.response_value,
            response_time_seconds: r.response_time_seconds,
            confidence_level: r.confidence_level,
        }));

        const { error: responseError } = await supabase
            .from("comprehensive_responses")
            .upsert(formattedResponses, {
                onConflict: "session_id,question_id",
            });

        if (responseError) throw responseError;

        // Update session progress
        const { count: answeredCount } = await supabase
            .from("comprehensive_responses")
            .select("*", { count: "exact", head: true })
            .eq("session_id", session_id);

        const progressPercentage = Math.round(
            ((answeredCount || 0) / session.total_questions) * 100
        );

        await supabase
            .from("comprehensive_sessions")
            .update({
                current_question: answeredCount || 0,
            })
            .eq("id", session_id);

        return NextResponse.json({
            success: true,
            progress: {
                answered: answeredCount,
                total: session.total_questions,
                percentage: progressPercentage,
            },
        });
    } catch (error) {
        console.error("Error submitting responses:", error);
        return NextResponse.json(
            { error: "Failed to submit responses" },
            { status: 500 }
        );
    }
}

// GET - Get responses for a session
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json(
                { error: "session_id required" },
                { status: 400 }
            );
        }

        const { data: responses, error } = await supabase
            .from("comprehensive_responses")
            .select(`
        *,
        question:assessment_instruments_v2(dimension, subdimension, question_text)
      `)
            .eq("session_id", sessionId);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            responses,
        });
    } catch (error) {
        console.error("Error fetching responses:", error);
        return NextResponse.json(
            { error: "Failed to fetch responses" },
            { status: 500 }
        );
    }
}
