import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST - Start comprehensive assessment session
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { session_type = "initial" } = body;

        // Create session
        const { data: session, error } = await supabase
            .from("assessment_sessions") // Standardized Name
            .insert({
                user_id: user.id,
                session_type,
                status: 'in-progress',
                scores_snapshot: {},
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            session,
        });
    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }
}

// GET comprehensive assessment questions
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const moduleId = searchParams.get("module");
        const all = searchParams.get("all") === "true";

        let query = supabase
            .from("assessment_instruments") // Standardized Name
            .select("*")
            .eq("is_active", true)
            .order("module_number", { ascending: true })
            .order("question_order", { ascending: true });

        if (!all && moduleId) {
            query = query.eq("module_number", parseInt(moduleId));
        }

        const { data: questions, error } = await query;
        if (error) throw error;

        // Grouping Logic to format for Frontend
        // ... (reuse existing grouping logic or simplified)
        const groupedMap: Record<string, any> = {};
        questions?.forEach((q: any) => {
            const modNum = q.module_number || 1; // Default to 1 if null
            const moduleKey = `module_${modNum}`;
            if (!groupedMap[moduleKey]) {
                groupedMap[moduleKey] = {
                    module: modNum,
                    questions: [],
                    dimensions: new Set(),
                };
            }
            groupedMap[moduleKey].questions.push(q);
            groupedMap[moduleKey].dimensions.add(q.dimension);
        });

        const result = Object.values(groupedMap).map((m: any) => ({
            module: m.module,
            questions: m.questions,
            dimensions: Array.from(m.dimensions),
            totalQuestions: m.questions.length,
            estimatedMinutes: Math.ceil(m.questions.reduce((sum: number, q: any) => sum + (q.estimated_seconds || 30), 0) / 60),
        }));

        return NextResponse.json({
            success: true,
            totalModules: result.length,
            modules: result,
        });

    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }
}
