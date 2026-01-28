
import { google } from "googleapis";

// Initialize YouTube API
const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY,
});

export interface YouTubeVideoResult {
    youtube_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    channel_title: string;
}

/**
 * Searches for educational videos on YouTube.
 * Wraps the YouTube Data API v3.
 */
export async function searchEducationalVideos(query: string, limit = 4): Promise<YouTubeVideoResult[]> {
    if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY is missing");
        return [];
    }

    console.log(`[YouTube Service] Searching for: ${query}`);

    try {
        const response = await youtube.search.list({
            part: ["snippet"],
            q: query,
            type: ["video"],
            videoEmbeddable: "true",
            maxResults: limit,
            relevanceLanguage: "id", // Prioritize Indonesian content
            safeSearch: "moderate",
        });

        const items = response.data.items || [];

        return items.map((item) => ({
            youtube_id: item.id?.videoId || "",
            title: item.snippet?.title || "Untitled",
            description: item.snippet?.description || "",
            thumbnail_url: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || "",
            channel_title: item.snippet?.channelTitle || "Unknown Channel",
        })).filter(video => video.youtube_id);

    } catch (error) {
        console.error("[YouTube Service] Error fetching videos:", error);
        return [];
    }
}
