import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Get free learning resources
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const dimension = searchParams.get("dimension");
        const type = searchParams.get("type");
        const language = searchParams.get("language");
        const limit = parseInt(searchParams.get("limit") || "20");

        let query = supabase
            .from("free_resources")
            .select("*")
            .eq("is_active", true)
            .order("rating", { ascending: false, nullsFirst: false })
            .limit(limit);

        if (dimension) {
            query = query.contains("target_dimensions", [dimension]);
        }

        if (type) {
            query = query.eq("resource_type", type);
        }

        if (language) {
            query = query.eq("language", language);
        }

        const { data: resources, error } = await query;

        if (error) throw error;

        // Group by type
        const byType = resources?.reduce((acc, r) => {
            if (!acc[r.resource_type]) {
                acc[r.resource_type] = [];
            }
            acc[r.resource_type].push(r);
            return acc;
        }, {} as Record<string, typeof resources>);

        return NextResponse.json({
            success: true,
            total: resources?.length || 0,
            resources,
            byType,
        });
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json(
            { error: "Failed to fetch resources" },
            { status: 500 }
        );
    }
}

// POST - Track resource interaction
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { resource_id, action, gap_id } = body;

        if (!resource_id || !action) {
            return NextResponse.json(
                { error: "resource_id and action required" },
                { status: 400 }
            );
        }

        // Get or create recommendation record
        const { data: existing } = await supabase
            .from("resource_recommendations")
            .select("*")
            .eq("user_id", user.id)
            .eq("resource_id", resource_id)
            .single();

        const updateData: Record<string, unknown> = {};

        switch (action) {
            case "start":
                updateData.status = "started";
                updateData.started_at = new Date().toISOString();
                break;
            case "complete":
                updateData.status = "completed";
                updateData.completed_at = new Date().toISOString();
                break;
            case "skip":
                updateData.status = "skipped";
                break;
            case "rate":
                updateData.user_rating = body.rating;
                updateData.user_feedback = body.feedback;
                break;
        }

        let result;
        if (existing) {
            const { data, error } = await supabase
                .from("resource_recommendations")
                .update(updateData)
                .eq("id", existing.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            const { data, error } = await supabase
                .from("resource_recommendations")
                .insert({
                    user_id: user.id,
                    resource_id,
                    gap_id,
                    ...updateData,
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return NextResponse.json({
            success: true,
            recommendation: result,
        });
    } catch (error) {
        console.error("Error tracking resource:", error);
        return NextResponse.json(
            { error: "Failed to track resource" },
            { status: 500 }
        );
    }
}
