import { NextResponse } from "next/server";
import { qstash, QUEUE_URL } from "@/lib/queue";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { file, metadata, notification } = body;

        if (!file || !file.download_url) {
            return NextResponse.json(
                { error: "Invalid payload: Missing file information" },
                { status: 400 }
            );
        }

        console.log(`🚀 Webhook Received: Processing ${file.name}`);

        // Publish to QStash Queue (Serverless Background Job)
        // This allows us to respond immediately to GAS and process long-running tasks asynchronously
        const message = await qstash.publishJSON({
            url: QUEUE_URL,
            body: {
                file,
                metadata,
                notification,
            },
            // Retry up to 3 times on failure
            retries: 3,
        });

        return NextResponse.json({
            success: true,
            message: "Job queued successfully",
            jobId: message.messageId,
        });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
