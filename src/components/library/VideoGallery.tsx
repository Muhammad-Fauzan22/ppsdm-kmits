"use client";

import React, { useState } from "react";
import { PlayCircle, X } from "lucide-react";

interface Video {
    youtube_video_id: string;
    title: string;
    thumbnail_url: string;
    channel_title: string;
    description?: string;
}

export default function VideoGallery({ videos, title = "Recommended Learning Videos" }: { videos: Video[], title?: string }) {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    if (!videos || videos.length === 0) return null;

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-heading">{title}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div
                        key={video.youtube_video_id}
                        className="group relative bg-[#0A0F1A] border border-white/5 rounded-xl overflow-hidden hover:border-[#135bec]/50 transition-all hover:shadow-lg hover:shadow-[#135bec]/10 cursor-pointer"
                        onClick={() => setSelectedVideo(video.youtube_video_id)}
                    >
                        {/* Thumbnail */}
                        <div className="aspect-video w-full relative overflow-hidden">
                            <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlayCircle className="w-6 h-6 text-white fill-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                            <h4 className="text-sm font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-[#00d4ff] transition-colors">{video.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">{video.channel_title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-white/10 text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
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
                    </div>
                </div>
            )}
        </div>
    );
}
