import { NextResponse } from "next/server"; export async function GET() { return NextResponse.json({ total: 0, critical: 0, high: 0, medium: 0, low: 0, recent: [] }); }
