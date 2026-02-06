import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get dimension scores
        const { data: scores, error: scoresError } = await supabase
            .from("dimension_scores")
            .select("*")
            .eq("user_id", user.id);

        if (scoresError) throw scoresError;

        // Get user stats
        const { data: profile } = await supabase
            .from("profiles")
            .select("total_points, level, streak_days")
            .eq("id", user.id)
            .single();

        // Get activity stats
        const { data: activities } = await supabase
            .from("activities")
            .select("status, points")
            .eq("user_id", user.id);

        const completed = activities?.filter((a: any) => a.status === "completed").length || 0;
        const inProgress = activities?.filter((a: any) => a.status === "in-progress").length || 0;
        const totalPoints = activities?.filter((a: any) => a.status === "completed").reduce((acc: number, a: any) => acc + (a.points || 0), 0) || 0;

        // Generate growth history (last 6 months mock data - in production, query real data)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const growthHistory = months.map((month, i) => {
            const avgScore = scores?.length ? Math.round(scores.reduce((acc: number, s: any) => acc + s.score, 0) / scores.length) : 0;
            return {
                month,
                score: Math.max(0, avgScore - (5 - i) * 3), // Simulate growth
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                dimensionScores: scores,
                stats: {
                    totalPoints: profile?.total_points || 0,
                    level: profile?.level || 1,
                    streak: profile?.streak_days || 0,
                    completed,
                    inProgress,
                    pointsEarned: totalPoints,
                },
                growthHistory,
            },
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
