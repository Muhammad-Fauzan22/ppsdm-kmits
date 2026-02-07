'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Star, Quote } from 'lucide-react';

/**
 * VideoTestimonial - Video-first testimonials for higher trust
 * Features: Video thumbnail with play button, expandable modal, star rating
 */

export interface VideoTestimonialItem {
    id: string;
    name: string;
    role: string;
    quote: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    avatar: string;
    rating: number;
    color: string;
}

const defaultTestimonials: VideoTestimonialItem[] = [
    {
        id: '1',
        name: 'Ahmad Rizky',
        role: 'Teknik Informatika \'21 • Software Engineer di Tokopedia',
        quote: 'PPSDM membantu saya menemukan passion yang terpendam. Assessment kognitif membuka mata saya tentang cara berpikir yang lebih sistematis.',
        avatar: 'AR',
        rating: 5,
        color: 'from-blue-500 to-cyan-500',
        videoUrl: '/videos/testimonial-1.mp4',
        thumbnailUrl: '/images/testimonial-1-thumb.jpg',
    },
    {
        id: '2',
        name: 'Dewi Kusuma',
        role: 'Arsitektur \'22 • UI/UX Designer di Gojek',
        quote: 'Asesmen holistik memberikan roadmap yang jelas. Dalam 6 bulan, saya berhasil mendapatkan internship impian berkat soft skill yang terbangun.',
        avatar: 'DK',
        rating: 5,
        color: 'from-green-500 to-emerald-500',
        videoUrl: '/videos/testimonial-2.mp4',
        thumbnailUrl: '/images/testimonial-2-thumb.jpg',
    },
    {
        id: '3',
        name: 'Bima Pratama',
        role: 'Teknik Mesin \'20 • Product Manager di Shopee',
        quote: 'Mentorship program menghubungkan saya dengan mentor industri. Sekarang saya bisa membantu mahasiswa lain lewat pengalaman yang saya dapat.',
        avatar: 'BP',
        rating: 5,
        color: 'from-orange-500 to-red-500',
        videoUrl: '/videos/testimonial-3.mp4',
        thumbnailUrl: '/images/testimonial-3-thumb.jpg',
    },
];

interface VideoTestimonialCardProps {
    testimonial: VideoTestimonialItem;
    onPlay?: (id: string) => void;
}

function VideoTestimonialCard({ testimonial, onPlay }: VideoTestimonialCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#1A1F2E] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all group"
        >
            {/* Video Thumbnail / Avatar */}
            <div
                className="relative h-48 bg-gradient-to-br from-[#0D1220] to-[#1A1F2E] cursor-pointer"
                onClick={() => onPlay?.(testimonial.id)}
            >
                {testimonial.thumbnailUrl ? (
                    <div className="absolute inset-0 bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url(${testimonial.thumbnailUrl})` }} />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-20`} />
                )}

                {/* Large Avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-2xl font-bold shadow-xl`}>
                        {testimonial.avatar}
                    </div>
                </div>

                {/* Play Button Overlay */}
                {testimonial.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                            <Play className="w-7 h-7 text-slate-900 ml-1" />
                        </div>
                    </div>
                )}

                {/* Video badge */}
                {testimonial.videoUrl && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Video
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                    ))}
                </div>

                {/* Quote */}
                <div className="relative mb-4">
                    <Quote className="absolute -top-1 -left-1 w-6 h-6 text-white/10" />
                    <p className="text-slate-300 text-sm leading-relaxed pl-5">
                        &quot;{testimonial.quote}&quot;
                    </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold`}>
                        {testimonial.avatar}
                    </div>
                    <div>
                        <p className="text-white font-medium text-sm">{testimonial.name}</p>
                        <p className="text-slate-500 text-xs">{testimonial.role}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

interface VideoTestimonialsProps {
    testimonials?: VideoTestimonialItem[];
    headline?: string;
    subheadline?: string;
}

export function VideoTestimonials({
    testimonials = defaultTestimonials,
    headline = 'Cerita Sukses Alumni',
    subheadline = 'Dengarkan langsung dari mahasiswa yang telah merasakan transformasi melalui PPSDM KM ITS',
}: VideoTestimonialsProps) {
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    return (
        <section className="py-20 bg-[#0A0F1A]">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold text-white mb-3"
                    >
                        {headline}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-slate-400 max-w-2xl mx-auto"
                    >
                        {subheadline}
                    </motion.p>

                    {/* Trust count */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                    >
                        <div className="flex -space-x-2">
                            {['AR', 'DK', 'BP', 'SL'].map((initials, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-[#0A0F1A] flex items-center justify-center text-[8px] text-white font-bold">
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-slate-400">
                            <span className="text-white font-semibold">5,000+</span> mahasiswa sudah bergabung
                        </span>
                    </motion.div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <VideoTestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            onPlay={setPlayingVideo}
                        />
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {playingVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setPlayingVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setPlayingVideo(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                Video testimonial akan diputar di sini
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default VideoTestimonials;
