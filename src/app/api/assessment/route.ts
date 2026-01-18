import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET assessment questions
export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("assessment_instruments")
            .select("id, dimension, question_text, question_order, framework_reference")
            .eq("is_active", true)
            .order("dimension")
            .order("question_order");

        if (error) throw error;

        // Group by dimension
        const grouped = data.reduce((acc: Record<string, typeof data>, item) => {
            if (!acc[item.dimension]) {
                acc[item.dimension] = [];
            }
            acc[item.dimension].push(item);
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: grouped,
            totalQuestions: data.length,
        });
    } catch (error) {
        console.error("Error fetching assessment questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch assessment questions" },
            { status: 500 }
        );
    }
}

// POST - Start new assessment session
export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const sessionType = body.session_type || "initial";

        // Get total questions count
        const { count } = await supabase
            .from("assessment_instruments")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

        // Create new session
        const { data, error } = await supabase
            .from("assessment_sessions")
            .insert({
                user_id: user.id,
                session_type: sessionType,
                total_questions: count || 0,
                answered_questions: 0,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            session: data,
        });
    } catch (error) {
        console.error("Error creating assessment session:", error);
        return NextResponse.json(
            { error: "Failed to create assessment session" },
            { status: 500 }
        );
    }
}
