
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

// Initialize YouTube API
const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY,
});

export interface VideoResult {
    youtube_video_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    channel_title: string;
}

/**
 * The "Video Hunter" Engine
 * 1. Asks Gemini for optimized search terms
 * 2. Hunts on YouTube
 * 3. Returns unique, high-quality results
 */
export async function huntVideos(topic: string): Promise<VideoResult[]> {
    console.log(`[VideoHunter] Hunting for: ${topic}`);

    try {
        // STEP 1: AI Query Optimization
        // We ask Gemini to convert a broad topic into specific educational search queries
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
      I need to find the best educational YouTube videos for the topic: "${topic}".
      Generate 3 specific, distinct, and high-quality search queries that I should use on YouTube.
      Focus on tutorials, lectures, or expert explanations.
      Return ONLY the 3 queries separated by commas, no other text.
      Example Output: Public Speaking tips for beginners, Advanced rhetoric techniques, TED talks on communication
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const queries = text.split(",").map((q) => q.trim());

        console.log(`[VideoHunter] Optimized Queries:`, queries);

        // STEP 2: The Hunt (Parallel Requests)
        // We fetch 2 top videos for each query to get a diverse mix
        const videoPromises = queries.map(async (q) => {
            try {
                const response = await youtube.search.list({
                    part: ["snippet"],
                    q: q,
                    type: ["video"],
                    videoEmbeddable: "true",
                    maxResults: 2,
                    relevanceLanguage: "id", // Prioritize Indonesian content if available, or remove for global
                });
                return response.data.items || [];
            } catch (err) {
                console.error(`[VideoHunter] Error searching for "${q}":`, err);
                return [];
            }
        });

        const results = await Promise.all(videoPromises);
        const allItems = results.flat();

        // STEP 3: Deduplication & Formatting
        const uniqueVideos = new Map<string, VideoResult>();

        allItems.forEach((item) => {
            if (item.id?.videoId && item.snippet) {
                // Create a key to avoid duplicates
                uniqueVideos.set(item.id.videoId, {
                    youtube_video_id: item.id.videoId,
                    title: item.snippet.title || "Untitled",
                    description: item.snippet.description || "",
                    thumbnail_url: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
                    channel_title: item.snippet.channelTitle || "Unknown Channel",
                });
            }
        });

        // Limit to top 6 unique videos
        return Array.from(uniqueVideos.values()).slice(0, 6);

    } catch (error) {
        console.error("[VideoHunter] Critical Error:", error);
        // Fallback: If AI fails, just search the raw topic one time
        try {
            const response = await youtube.search.list({
                part: ["snippet"],
                q: topic,
                type: ["video"],
                videoEmbeddable: "true",
                maxResults: 4,
            });
            return (response.data.items || []).map(item => ({
                youtube_video_id: item.id?.videoId!,
                title: item.snippet?.title || "Untitled",
                description: item.snippet?.description || "",
                thumbnail_url: item.snippet?.thumbnails?.medium?.url || "",
                channel_title: item.snippet?.channelTitle || "",
            })).filter(v => v.youtube_video_id);
        } catch (fallbackError) {
            return [];
        }
    }
}
