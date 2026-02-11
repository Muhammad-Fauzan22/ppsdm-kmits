
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";

// ADAPTATION: Use Service Account or API Key if public
// For robust "internal" system, we recommend Service Account or User OAuth.
// Here we adapt the original simple API Key approach if possible, but Drive List
// usually requires OAuth or Service Account.
// IF using API Key only, the folder must be Public.
// Ideally, use GOOGLE_SERVICE_ACCOUNT_JSON in env.

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const DRIVE_FOLDER_ID = "1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf"; // From original repo

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        if (!GOOGLE_API_KEY) {
            return NextResponse.json({ success: false, error: "Missing GOOGLE_API_KEY" }, { status: 500 });
        }

        const drive = google.drive({ version: "v3", auth: GOOGLE_API_KEY });

        // 1. List files from Drive
        const query = `'${DRIVE_FOLDER_ID}' in parents and trashed = false`;
        const res = await drive.files.list({
            q: query,
            fields: "files(id, name, mimeType, size, webViewLink, createdTime)",
            key: GOOGLE_API_KEY
        });

        const driveFiles = res.data.files || [];
        // 2. Get existing files from DB to avoid duplicates
        const { data: existingBooks } = await supabase
            .from("books")
            .select("drive_file_id");

        const existingIds = new Set(existingBooks?.map((b: any) => b.drive_file_id) || []);

        // 3. Filter New Files
        const newFiles = driveFiles.filter((file) => {
            const isDoc = file.mimeType === "application/pdf" || file.name?.endsWith(".pdf");
            return isDoc && file.id && !existingIds.has(file.id);
        });

        // 4. Insert into DB
        const inserted = [];
        for (const file of newFiles) {
            const { data, error } = await supabase.from("books").insert({
                original_filename: file.name,
                drive_file_id: file.id,
                drive_url: file.webViewLink,
                drive_folder_id: DRIVE_FOLDER_ID,
                processing_status: "pending",
                title: file.name?.replace(/\.(pdf|docx?)/i, ""),
                page_count: file.size ? Math.ceil(parseInt(file.size) / 50000) : 0 // heuristic
            }).select().single();

            if (!error && data) {
                inserted.push(data);
            }
        }

        // 5. Log activity
        if (inserted.length > 0) {
            await supabase.from("processing_logs").insert({
                action: "scan_drive",
                status: "success",
                message: `Scanned ${driveFiles.length} files, found ${newFiles.length} new`,
                details: { new_count: inserted.length }
            });
        }

        return NextResponse.json({
            success: true,
            scanned: driveFiles.length,
            new: newFiles.length,
            inserted: inserted.length
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
