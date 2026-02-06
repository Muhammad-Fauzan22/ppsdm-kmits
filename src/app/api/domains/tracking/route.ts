import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET tracking data for various domains
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // energy, emotion, mental, gratitude, etc.
        const startDate = searchParams.get("start_date");
        const endDate = searchParams.get("end_date");
        const limit = parseInt(searchParams.get("limit") || "30");

        const tableMap: Record<string, string> = {
            energy: "energy_logs",
            emotion: "emotion_logs",
            mental: "mental_checks",
            mindfulness: "mindfulness_sessions",
            workout: "workouts",
            nutrition: "nutrition_logs",
            sleep: "sleep_logs",
            gratitude: "gratitude_logs",
            contribution: "contributions",
            integrity: "integrity_logs",
        };

        if (!type || !tableMap[type]) {
            return NextResponse.json(
                { error: "Invalid tracking type" },
                { status: 400 }
            );
        }

        const table = tableMap[type];
        const dateColumn = type === "emotion" || type === "mental" ? "check_timestamp" : "log_date";

        let query = supabase
            .from(table)
            .select("*")
            .eq("user_id", user.id)
            .order(dateColumn, { ascending: false })
            .limit(limit);

        if (startDate) {
            query = query.gte(dateColumn, startDate);
        }

        if (endDate) {
            query = query.lte(dateColumn, endDate);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            success: true,
            type,
            data,
        });
    } catch (error) {
        console.error("Error fetching tracking data:", error);
        return NextResponse.json(
            { error: "Failed to fetch tracking data" },
            { status: 500 }
        );
    }
}

// POST - Log tracking entry
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { type, ...recordData } = body;

        const tableMap: Record<string, string> = {
            energy: "energy_logs",
            emotion: "emotion_logs",
            mental: "mental_checks",
            mindfulness: "mindfulness_sessions",
            workout: "workouts",
            nutrition: "nutrition_logs",
            sleep: "sleep_logs",
            gratitude: "gratitude_logs",
            contribution: "contributions",
            integrity: "integrity_logs",
            environmental: "environmental_impact",
            minimalism: "minimalism_logs",
            communication: "communication_sessions",
            resilience: "resilience_exercises",
            purpose: "purpose_explorations",
            character: "character_assessments",
            ethical: "ethical_decisions",
        };

        if (!type || !tableMap[type]) {
            return NextResponse.json(
                { error: "Invalid tracking type" },
                { status: 400 }
            );
        }

        const table = tableMap[type];

        const { data, error } = await supabase
            .from(table)
            .insert({
                ...recordData,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            type,
            data,
        });
    } catch (error) {
        console.error("Error creating tracking entry:", error);
        return NextResponse.json(
            { error: "Failed to create tracking entry" },
            { status: 500 }
        );
    }
}
