"use server";

import { createClient } from "@supabase/supabase-js";
import { huntVideos } from "@/lib/services/video-hunter";
import { searchEducationalVideos } from "@/lib/youtube";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for writes
);

// --- Original Logic (Topic Based) ---
export async function getOrCurateVideos(topic: string, category: 'HARDSKILL' | 'SOFTSKILL' | 'ACADEMIC' | 'GENERAL' = 'GENERAL') {
    if (!topic) return [];

    // Check Cache
    const topicKey = topic.toLowerCase().trim();
    const { data: cachedVideos } = await supabase
        .from("video_resources")
        .select("*")
        .eq("topic_key", topicKey)
        .limit(10);

    if (cachedVideos && cachedVideos.length > 0) return cachedVideos;

    // Cache Miss -> Hunt with Gemini
    const freshVideos = await huntVideos(topic);

    if (freshVideos.length > 0) {
        const records = freshVideos.map(v => ({
            topic_key: topicKey,
            youtube_video_id: v.youtube_video_id,
            title: v.title,
            description: v.description,
            thumbnail_url: v.thumbnail_url,
            channel_title: v.channel_title,
            category: category
        }));

        await supabase.from("video_resources").upsert(records, { onConflict: 'topic_key, youtube_video_id' });
    }

    return freshVideos;
}

// --- New Logic (Course Based) ---
export async function curateVideosForCourse(courseId: string, query: string) {
    if (!courseId || !query) return [];

    console.log(`[VideoHunter] Curating for Course: ${courseId} / Query: ${query}`);

    // 1. Check existing videos for this course
    const { data: cached } = await supabase
        .from("video_resources")
        .select("*")
        .eq("course_id", courseId)
        .limit(10);

    if (cached && cached.length > 0) {
        console.log(`[VideoHunter] Found cached videos for course ${courseId}`);
        return cached;
    }

    // 2. Fetch from YouTube
    const videos = await searchEducationalVideos(query);

    // 3. Store in DB
    if (videos.length > 0) {
        const records = videos.map(v => ({
            course_id: courseId,
            topic_key: `course:${courseId}`, // Helper key
            youtube_video_id: v.youtube_id,
            title: v.title,
            description: v.description,
            thumbnail_url: v.thumbnail_url,
            channel_title: v.channel_title,
            category: 'ACADEMIC'
        }));

        const { error } = await supabase.from("video_resources").upsert(records, { onConflict: 'topic_key, youtube_video_id' });

        if (error) console.error("Failed to save course videos:", error);
    }

    return videos;
}
