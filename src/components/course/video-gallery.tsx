"use client";

import React, { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // Assuming shadcn, but will build custom if needed

interface Video {
    youtube_video_id: string; // From DB (aliased from existing component)
    title: string;
    thumbnail_url: string;
    channel_title?: string;
}

export default function CourseVideoGallery({ videos }: { videos: any[] }) {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    if (!videos || videos.length === 0) return null;

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-6 flex items-center gap-2">
                <PlayCircle className="text-red-500 w-6 h-6" />
                Video Pembelajaran
            </h3>

            {/* Grid: 2 columns mobile, 3 desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {videos.map((video) => (
                    <div
                        key={video.id || video.youtube_video_id}
                        className="group relative bg-white dark:bg-[#1a202c] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedVideo(video.youtube_video_id || video.youtube_id)}
                    >
                        {/* Thumbnail 16:9 */}
                        <div className="aspect-video w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <PlayCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-3">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1">
                                {video.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                                {video.channel_title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Modal/Dialog Implementation */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedVideo(null)}>
                    <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-white/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
