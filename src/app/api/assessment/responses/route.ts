import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST - Submit response to a question
export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { session_id, instrument_id, response } = body;

        if (!session_id || !instrument_id || response === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate response is 1-5
        if (response < 1 || response > 5) {
            return NextResponse.json(
                { error: "Response must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Insert or update response
        const { data, error } = await supabase
            .from("assessment_responses")
            .upsert({
                user_id: user.id,
                session_id,
                instrument_id,
                response,
            }, {
                onConflict: "user_id,session_id,instrument_id",
            })
            .select()
            .single();

        if (error) throw error;

        // Update session progress
        const { count } = await supabase
            .from("assessment_responses")
            .select("*", { count: "exact", head: true })
            .eq("session_id", session_id);

        await supabase
            .from("assessment_sessions")
            .update({ answered_questions: count || 0 })
            .eq("id", session_id);

        return NextResponse.json({
            success: true,
            data,
            progress: count,
        });
    } catch (error) {
        console.error("Error submitting response:", error);
        return NextResponse.json(
            { error: "Failed to submit response" },
            { status: 500 }
        );
    }
}

// PUT - Submit all responses at once (batch)
export async function PUT(request: Request) {
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
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Format responses for batch insert
        const formattedResponses = responses.map((r: { instrument_id: string; response: number }) => ({
            user_id: user.id,
            session_id,
            instrument_id: r.instrument_id,
            response: r.response,
        }));

        // Batch upsert
        const { error } = await supabase
            .from("assessment_responses")
            .upsert(formattedResponses, {
                onConflict: "user_id,session_id,instrument_id",
            });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            submitted: responses.length,
        });
    } catch (error) {
        console.error("Error submitting batch responses:", error);
        return NextResponse.json(
            { error: "Failed to submit responses" },
            { status: 500 }
        );
    }
}
