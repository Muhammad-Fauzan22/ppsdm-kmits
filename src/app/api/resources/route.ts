
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { GlobalResourceEngine } from "@/lib/resources/GlobalResourceEngine";

export const dynamic = "force-dynamic";

// GET - Get free learning resources via Global Resource Engine
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const gre = new GlobalResourceEngine();

        const { searchParams } = new URL(request.url);
        const dimension = searchParams.get("dimension") || undefined;
        // Map 'all' to undefined so it fetches everything
        const safeDimension = dimension === 'all' ? undefined : dimension;

        const type = searchParams.get("type") || undefined;
        const queryTerm = searchParams.get("q") || undefined; // Frontend might send 'q' or use filter logic
        const limit = parseInt(searchParams.get("limit") || "50"); // Increase limit for better quantum filtering

        // Use the Quantum Engine to find resources
        const quantumResources = await gre.findResources(supabase, {
            query: queryTerm,
            domain: safeDimension,
            type: type,
            limit: limit
        });

        // Map back to frontend expected structure (FreeResource-like)
        const resources = quantumResources.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            url: r.url,
            source: r.provider,
            type: r.type,
            language: r.languages[0] || 'en',
            dimensions: r.tags || [],
            skills: r.target_skills || [],
            rating: (r.quality?.pedagogical || 0.7) * 5, // Convert 0-1 back to 5-star
            duration_minutes: parseInt(r.estimated_time) || 30,
            image_url: r.image_url,
            is_quantum_recommended: true,
            match_score: r.match_score,
            reason: r.recommendation_reason
        }));

        // Group by type for compatibility
        const byType = resources.reduce((acc: any, r: any) => {
            if (!acc[r.type]) {
                acc[r.type] = [];
            }
            acc[r.type].push(r);
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            total: resources.length,
            resources,
            byType,
            engine: "GRE v1.0 (Quantum-Enhanced)"
        });
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json(
            { error: "Failed to fetch resources" },
            { status: 500 }
        );
    }
}

// POST - Track resource interaction (Preserved)
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
