import { Client } from "@upstash/qstash";

const qstashUrl = process.env.QSTASH_URL || "https://qstash.upstash.io";
const qstashToken = process.env.QSTASH_TOKEN;

if (!qstashToken) {
    console.warn("QSTASH_TOKEN is not defined in environment variables.");
}

// Lazy initialization or build-safe dummy
export const qstash = new Client({
    token: qstashToken || "mock_token_for_build",
    baseUrl: qstashUrl,
});

export const QUEUE_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/process-book`;
