import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { google } from "googleapis";

/**
 * API Route: Import resources from Google Drive/Spreadsheet
 * 
 * Endpoints:
 * POST /api/library/import - Import resources from Google Spreadsheet
 */

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

interface SpreadsheetRow {
    id?: string;
    drive_id?: string;
    title?: string;
    file_url?: string;
    file_size?: number;
    file_type?: string;
    mime_type?: string;
    author?: string;
    category?: string;
    status?: string;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { spreadsheetId, sheetName = "Sheet1", range = "A:Z" } = body;

        // Allow direct data import or spreadsheet import
        if (body.resources && Array.isArray(body.resources)) {
            // Direct import mode
            return await importDirectResources(supabase, body.resources);
        }

        if (!spreadsheetId) {
            return NextResponse.json(
                { error: "Missing spreadsheetId or resources array" },
                { status: 400 }
            );
        }

        if (!GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Google API Key not configured" },
                { status: 500 }
            );
        }

        // Fetch data from Google Sheets
        const sheets = google.sheets({ version: "v4", auth: GOOGLE_API_KEY });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!${range}`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return NextResponse.json(
                { error: "No data found in spreadsheet" },
                { status: 404 }
            );
        }

        // Parse headers and data
        const headers = rows[0].map((h: string) => h.toLowerCase().replace(/\s+/g, "_"));
        const dataRows = rows.slice(1);

        const resources = dataRows.map((row: string[]) => {
            const obj: any = {};
            headers.forEach((header: string, idx: number) => {
                obj[header] = row[idx] || null;
            });
            return obj;
        });

        // Import to Supabase
        return await importDirectResources(supabase, resources);

    } catch (error: any) {
        console.error("[Library Import] Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

async function importDirectResources(supabase: any, resources: any[]) {
    const results = {
        imported: 0,
        skipped: 0,
        errors: [] as string[],
    };

    for (const resource of resources) {
        try {
            // Map to learning_resources table schema
            const mapped = {
                title: resource.title || resource.original_filename || "Untitled",
                description: resource.description || null,
                author: resource.author || resource.authors || "Unknown",
                file_url: resource.file_url || resource.web_view_link || resource.download_url,
                preview_url: resource.preview_url || resource.web_preview_link || null,
                drive_id: resource.drive_id || resource.id,
                file_type: resource.file_type || resource.mime_type?.split("/").pop() || "unknown",
                file_size: parseInt(resource.file_size) || 0,
                category: resource.category || resource.topic || "General",
                status: "available",
                metadata: {
                    imported_at: new Date().toISOString(),
                    source: "google_drive",
                    original: resource,
                },
            };

            // Check if already exists
            const { data: existing } = await supabase
                .from("learning_resources")
                .select("id")
                .eq("drive_id", mapped.drive_id)
                .single();

            if (existing) {
                results.skipped++;
                continue;
            }

            // Insert new resource
            const { error } = await supabase
                .from("learning_resources")
                .insert(mapped);

            if (error) {
                results.errors.push(`${mapped.title}: ${error.message}`);
            } else {
                results.imported++;
            }

        } catch (err: any) {
            results.errors.push(`Row error: ${err.message}`);
        }
    }

    return NextResponse.json({
        success: true,
        message: `Imported ${results.imported} resources, skipped ${results.skipped} duplicates`,
        results,
    });
}

// GET: Fetch current import status / list resources
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const { data, error, count } = await supabase
            .from("learning_resources")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data,
            total: count,
            limit,
            offset,
        });

    } catch (error: any) {
        console.error("[Library Import GET] Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
