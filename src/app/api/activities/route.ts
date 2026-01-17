import { NextResponse } from "next/server";

// Mock data for demo
const mockActivities = [
    {
        id: "1",
        user_id: "1",
        title: "Complete Leadership Workshop",
        dimension: "social",
        points: 50,
        status: "completed",
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        user_id: "1",
        title: "Submit Research Proposal Draft",
        dimension: "cognitive",
        points: 30,
        status: "in-progress",
        due_date: "2024-03-18",
        created_at: new Date().toISOString(),
    },
];

export async function GET() {
    // In production, fetch from Supabase:
    // const supabase = await createClient();
    // const { data, error } = await supabase.from('activities').select('*');

    return NextResponse.json({
        success: true,
        data: mockActivities,
    });
}

export async function POST(request: Request) {
    const body = await request.json();

    // In production, insert into Supabase:
    // const supabase = await createClient();
    // const { data, error } = await supabase.from('activities').insert(body);

    const newActivity = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
    };

    return NextResponse.json({
        success: true,
        data: newActivity,
    });
}
