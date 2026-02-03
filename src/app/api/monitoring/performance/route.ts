import { NextResponse } from "next/server"; export async function GET() { return NextResponse.json({ lcp: 0, fid: 0, cls: 0, ttfb: 0, fcp: 0, si: 0 }); }
