import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (authHeader !== "Bearer internal-system") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await request.json();
        console.log("📥 Webhook Received from GAS:", payload.job_id);

        const { file, metadata, processing_config } = payload;
        const supabase = await createClient();

        // 1. Log the Ingest Event
        await supabase.from("ecological_events").insert({
            user_id: "00000000-0000-0000-0000-000000000000", // System User ID
            event_type: "pipeline_ingest",
            layer: "micro",
            entity_type: "book",
            data: {
                file_id: file.id,
                file_name: file.name,
                source: "google_drive"
            },
            metadata: { job_id: payload.job_id }
        });

        // 2. Insert/Update Book Record
        const { data: book, error } = await supabase
            .from("books")
            .upsert({
                title: metadata.title || file.name,
                author: metadata.author || "Unknown",
                category: metadata.category || "General",
                file_url: file.download_url,
                // We temporarily store raw file info if needed
                meta_info: {
                    drive_id: file.id,
                    mime_type: file.mime_type,
                    size_kb: file.size_kb,
                    tags: metadata.tags
                }
            }, { onConflict: 'title' }) // Ideally valid ISBN or drive_id de-duplication
            .select()
            .single();

        if (error) {
            console.error("❌ Database Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 3. Trigger Async Processing (QStash or Background Job)
        // Here we just mark it as 'processing' in a books_status table if we had one,
        // or we assume the AI synthesis happens via another queue.

        // For now, we respond success to GAS so it marks it as "WEBHOOK_SUCCESS"
        return NextResponse.json({
            success: true,
            book_id: book.book_id,
            message: "Ingested successfully. AI processing queued."
        });

    } catch (error: any) {
        console.error("❌ Webhook Fatal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
