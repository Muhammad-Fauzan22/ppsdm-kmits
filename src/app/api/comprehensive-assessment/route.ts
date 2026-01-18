import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET comprehensive assessment questions
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const module = searchParams.get("module");
        const all = searchParams.get("all") === "true";

        let query = supabase
            .from("assessment_instruments_v2")
            .select("*")
            .eq("is_active", true)
            .order("module_number")
            .order("order_index");

        if (!all && module) {
            query = query.eq("module_number", parseInt(module));
        }

        const { data: questions, error } = await query;

        if (error) throw error;

        // Define types for grouping
        type QuestionItem = NonNullable<typeof questions>[number];
        interface ModuleGroup {
            module: number;
            questions: QuestionItem[];
            dimensions: string[];
        }

        // Group by module and dimension
        const groupedMap: Record<string, { module: number; questions: QuestionItem[]; dimensionSet: Set<string> }> = {};

        questions?.forEach((q) => {
            const moduleKey = `module_${q.module_number}`;
            if (!groupedMap[moduleKey]) {
                groupedMap[moduleKey] = {
                    module: q.module_number,
                    questions: [],
                    dimensionSet: new Set(),
                };
            }
            groupedMap[moduleKey].questions.push(q);
            groupedMap[moduleKey].dimensionSet.add(q.dimension);
        });

        // Convert to array with dimensions as array
        const result: (ModuleGroup & { totalQuestions: number; estimatedMinutes: number })[] =
            Object.values(groupedMap).map((m) => ({
                module: m.module,
                questions: m.questions,
                dimensions: Array.from(m.dimensionSet),
                totalQuestions: m.questions.length,
                estimatedMinutes: Math.ceil(m.questions.reduce((sum, q) => sum + (q.estimated_seconds || 30), 0) / 60),
            }));

        return NextResponse.json({
            success: true,
            totalModules: result.length,
            totalQuestions: questions?.length || 0,
            modules: result,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}

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

        // Get total questions count
        const { count } = await supabase
            .from("assessment_instruments_v2")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

        // Get total modules
        const { data: modules } = await supabase
            .from("assessment_instruments_v2")
            .select("module_number")
            .eq("is_active", true);

        const uniqueModules = new Set(modules?.map((m) => m.module_number));

        // Create session
        const { data: session, error } = await supabase
            .from("comprehensive_sessions")
            .insert({
                user_id: user.id,
                session_type,
                total_questions: count || 0,
                total_modules: uniqueModules.size,
                device_info: {
                    userAgent: request.headers.get("user-agent"),
                    timestamp: new Date().toISOString(),
                },
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
