import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) throw profileError;

        // Fetch dimension scores
        const { data: dimensionScores, error: scoresError } = await supabase
            .from("dimension_scores")
            .select("*")
            .eq("user_id", user.id);

        if (scoresError) throw scoresError;

        // Fetch badges
        const { data: badges, error: badgesError } = await supabase
            .from("user_badges")
            .select("*, badges(*)")
            .eq("user_id", user.id);

        if (badgesError) throw badgesError;

        // Calculate total score
        const totalScore = dimensionScores.length > 0
            ? Math.round(dimensionScores.reduce((acc, s) => acc + s.score, 0) / dimensionScores.length)
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                user: profile,
                dimensionScores,
                badges: badges.map(b => b.badges),
                totalScore,
                points: profile.total_points || 0,
                level: profile.level || 1,
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const { data, error } = await supabase
            .from("profiles")
            .update({
                full_name: body.full_name,
                department: body.department,
                faculty: body.faculty,
                semester: body.semester,
                bio: body.bio,
                phone: body.phone,
                avatar_url: body.avatar_url,
            })
            .eq("id", user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
