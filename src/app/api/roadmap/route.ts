import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Get development roadmap
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const roadmapId = searchParams.get("id");

        let query = supabase
            .from("development_roadmaps")
            .select(`
        *,
        session:comprehensive_sessions(
          dimension_scores,
          overall_score,
          completed_at
        )
      `)
            .eq("user_id", user.id)
            .eq("status", "active")
            .order("created_at", { ascending: false });

        if (roadmapId) {
            query = query.eq("id", roadmapId);
        }

        // Execute query
        const { data: roadmaps, error } = await query.limit(1).single();

        if (!roadmaps) {
            return NextResponse.json({
                success: true,
                hasRoadmap: false,
                message: "No active roadmap found. Complete an assessment to generate one.",
            });
        }

        // Get recommended resources based on focus dimensions
        const focusDimensions = [
            ...(roadmaps.primary_focus_dimensions || []),
            ...(roadmaps.secondary_focus_dimensions || []),
        ];

        // Generate Dynamic Learning Pathway using GRE
        const { DynamicLearningPathwayComposer } = await import("@/lib/resources/DynamicLearningPathway");
        const composer = new DynamicLearningPathwayComposer();
        const pathway = await composer.composePathway(supabase, roadmaps);

        // Flatten resources from the pathway for backward compatibility with the frontend
        // The frontend expects "recommendedResources" as a simple list.
        // We will provide resources from the first 2 active milestones (Week 1 & 2)
        const resources = [
            ...pathway.milestones[0].resources,
            ...pathway.milestones[1].resources
        ];

        return NextResponse.json({
            success: true,
            hasRoadmap: true,
            roadmap: roadmaps,
            recommendedResources: resources,
            learningPathway: pathway // Expose full structured pathway
        });
    } catch (error) {
        console.error("Error fetching roadmap:", error);
        return NextResponse.json(
            { error: "Failed to fetch roadmap" },
            { status: 500 }
        );
    }
}

// PATCH - Update roadmap progress
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { roadmap_id, weekly_goals, progress_percentage } = body;

        if (!roadmap_id) {
            return NextResponse.json(
                { error: "roadmap_id required" },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = {
            last_updated: new Date().toISOString(),
        };

        if (weekly_goals !== undefined) {
            updateData.weekly_goals = weekly_goals;
        }

        if (progress_percentage !== undefined) {
            updateData.progress_percentage = progress_percentage;
        }

        const { data, error } = await supabase
            .from("development_roadmaps")
            .update(updateData)
            .eq("id", roadmap_id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            roadmap: data,
        });
    } catch (error) {
        console.error("Error updating roadmap:", error);
        return NextResponse.json(
            { error: "Failed to update roadmap" },
            { status: 500 }
        );
    }
}
