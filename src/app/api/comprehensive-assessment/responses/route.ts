import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST - Submit responses for comprehensive assessment
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Allow anonymous
        }

        const body = await request.json();
        const { session_id, responses } = body;

        if (!session_id || !responses || !Array.isArray(responses)) {
            return NextResponse.json(
                { error: "session_id and responses array required" },
                { status: 400 }
            );
        }

        // Verify session exists and belongs to user (if authenticated)
        const query = supabase
            .from("comprehensive_sessions")
            .select("*")
            .eq("id", session_id)
            .single();

        const { data: session, error: sessionError } = await query;

        // Security check: if user is logged in, session must match user_id.
        // If user is anon, session must have user_id IS NULL (and ideally match session_token, but we don't have it here yet without updating frontend to send it).
        // For now, we trust session_id if it exists and is anonymous.
        if (session && user && session.user_id !== user.id) {
            return NextResponse.json({ error: "Unauthorized access to session" }, { status: 403 });
        }
        if (session && !user && session.user_id !== null) {
            return NextResponse.json({ error: "Unauthorized access to user session" }, { status: 403 });
        }

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
            // Allow anonymous
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
        return NextResponse.json(
            { error: "Failed to fetch responses" },
            { status: 500 }
        );
    }
}
