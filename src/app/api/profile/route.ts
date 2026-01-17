import { NextResponse } from "next/server";

// Mock user profile data
const mockProfile = {
    user: {
        id: "1",
        email: "5025201001@student.its.ac.id",
        full_name: "Rian Santoso",
        nrp: "5025201001",
        department: "Informatics Engineering",
        semester: 5,
        role: "student",
    },
    dimensionScores: [
        { dimension: "cognitive", score: 88 },
        { dimension: "affective", score: 75 },
        { dimension: "psychomotor", score: 82 },
        { dimension: "spiritual", score: 95 },
        { dimension: "social", score: 85 },
        { dimension: "financial", score: 60 },
        { dimension: "health", score: 78 },
        { dimension: "character", score: 90 },
        { dimension: "environmental", score: 70 },
    ],
    totalScore: 85,
    points: 1250,
    level: 12,
    badges: [
        { id: "1", name: "Dean's List", icon: "school" },
        { id: "2", name: "Team Player", icon: "groups" },
        { id: "3", name: "Wellness Warrior", icon: "fitness_center" },
    ],
};

export async function GET() {
    return NextResponse.json({
        success: true,
        data: mockProfile,
    });
}

export async function PATCH(request: Request) {
    const body = await request.json();

    // In production, update in Supabase:
    // const supabase = await createClient();
    // const { data, error } = await supabase.from('users').update(body).eq('id', userId);

    return NextResponse.json({
        success: true,
        data: { ...mockProfile.user, ...body },
    });
}
