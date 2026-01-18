"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Post {
    id: string;
    author: { name: string; avatar: string; level: number };
    content: string;
    dimension: string;
    likes: number;
    comments: number;
    createdAt: string;
    isLiked: boolean;
}

interface Event {
    id: string;
    title: string;
    date: string;
    type: 'workshop' | 'webinar' | 'meetup';
    participants: number;
    dimension: string;
}

const mockPosts: Post[] = [
    { id: '1', author: { name: 'Ahmad F.', avatar: '👨‍💻', level: 12 }, content: 'Baru selesai kursus Python dari FreeCodeCamp! Highly recommend untuk yang mau belajar programming dari nol 🐍', dimension: 'cognitive', likes: 24, comments: 5, createdAt: '2 jam lalu', isLiked: false },
    { id: '2', author: { name: 'Siti N.', avatar: '👩‍🎓', level: 15 }, content: 'Tips budgeting: Rule 50/30/20 works! 50% needs, 30% wants, 20% savings. Mulai dari sekarang! 💰', dimension: 'financial', likes: 45, comments: 12, createdAt: '5 jam lalu', isLiked: true },
    { id: '3', author: { name: 'Budi S.', avatar: '🏃', level: 8 }, content: 'Challenge: 30 hari olahraga tanpa skip! Siapa yang mau join? Day 1 done ✅', dimension: 'physical', likes: 33, comments: 18, createdAt: '1 hari lalu', isLiked: false },
    { id: '4', author: { name: 'Dewi L.', avatar: '💚', level: 20 }, content: 'Journaling 5 menit setiap malam benar-benar membantu mental health. Start small, be consistent 📓', dimension: 'emotional', likes: 67, comments: 8, createdAt: '2 hari lalu', isLiked: true },
];

const mockEvents: Event[] = [
    { id: '1', title: 'Workshop: Resume Writing', date: '2026-01-25', type: 'workshop', participants: 45, dimension: 'career' },
    { id: '2', title: 'Webinar: Investasi untuk Pemula', date: '2026-01-28', type: 'webinar', participants: 120, dimension: 'financial' },
    { id: '3', title: 'Meetup: Morning Run ITS', date: '2026-01-20', type: 'meetup', participants: 25, dimension: 'physical' },
];

const dimensionColors: Record<string, string> = {
    cognitive: 'bg-purple-100 text-purple-700',
    emotional: 'bg-teal-100 text-teal-700',
    financial: 'bg-yellow-100 text-yellow-700',
    physical: 'bg-red-100 text-red-700',
    career: 'bg-blue-100 text-blue-700',
};

export default function CommunityPage() {
    const [tab, setTab] = useState<'feed' | 'events' | 'groups'>('feed');
    const [posts, setPosts] = useState(mockPosts);
    const [newPost, setNewPost] = useState('');

    const toggleLike = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                };
            }
            return post;
        }));
    };

    const addPost = () => {
        if (!newPost.trim()) return;
        const post: Post = {
            id: Date.now().toString(),
            author: { name: 'You', avatar: '😊', level: 10 },
            content: newPost,
            dimension: 'cognitive',
            likes: 0,
            comments: 0,
            createdAt: 'Baru saja',
            isLiked: false,
        };
        setPosts([post, ...posts]);
        setNewPost('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold">👥 Community</h1>
                            <p className="text-blue-200 mt-1">Belajar dan berkembang bersama</p>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-white/20 rounded-xl">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        {[
                            { id: 'feed', label: '📰 Feed', count: posts.length },
                            { id: 'events', label: '📅 Events', count: mockEvents.length },
                            { id: 'groups', label: '👥 Groups', count: 8 },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id as typeof tab)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t.id ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
                {/* Feed Tab */}
                {tab === 'feed' && (
                    <>
                        {/* New Post */}
                        <div className="bg-white rounded-2xl shadow p-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl">
                                    😊
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                        placeholder="Share pengalaman atau tips pengembangan diri..."
                                        rows={2}
                                        className="w-full px-3 py-2 border rounded-xl resize-none"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={addPost}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts */}
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow p-4"
                            >
                                {/* Author */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-xl">
                                        {post.author.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-800">{post.author.name}</span>
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                                Lv.{post.author.level}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">{post.createdAt}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${dimensionColors[post.dimension] || 'bg-gray-100'}`}>
                                        {post.dimension}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="text-gray-700 mb-4">{post.content}</p>

                                {/* Actions */}
                                <div className="flex items-center gap-6 pt-3 border-t">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                                    >
                                        <span>{post.isLiked ? '❤️' : '🤍'}</span>
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-500">
                                        <span>💬</span>
                                        <span>{post.comments}</span>
                                    </button>
                                    <button className="text-gray-500">🔗 Share</button>
                                </div>
                            </motion.div>
                        ))}
                    </>
                )}

                {/* Events Tab */}
                {tab === 'events' && (
                    <div className="space-y-4">
                        {mockEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow p-4 flex items-center gap-4"
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${event.type === 'workshop' ? 'bg-purple-100' :
                                        event.type === 'webinar' ? 'bg-blue-100' : 'bg-green-100'
                                    }`}>
                                    {event.type === 'workshop' ? '🛠️' : event.type === 'webinar' ? '🎥' : '🏃'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-500">
                                        📅 {new Date(event.date).toLocaleDateString('id-ID')} • 👥 {event.participants} peserta
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
                                    Join
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Groups Tab */}
                {tab === 'groups' && (
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'Productivity Club', members: 156, icon: '⏰' },
                            { name: 'Investor Muda', members: 89, icon: '💰' },
                            { name: 'Fitness Enthusiasts', members: 234, icon: '💪' },
                            { name: 'Book Club ITS', members: 67, icon: '📚' },
                            { name: 'Mental Wellness', members: 123, icon: '🧘' },
                            { name: 'Career Network', members: 345, icon: '💼' },
                        ].map((group, index) => (
                            <motion.div
                                key={group.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow p-4 text-center"
                            >
                                <div className="text-4xl mb-2">{group.icon}</div>
                                <h4 className="font-semibold text-gray-800">{group.name}</h4>
                                <p className="text-sm text-gray-500 mb-3">👥 {group.members} members</p>
                                <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium">
                                    Join Group
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
                    {[
                        { href: '/dashboard', icon: '🏠', label: 'Home' },
                        { href: '/community', icon: '👥', label: 'Community', active: true },
                        { href: '/mentorship', icon: '🤝', label: 'Mentor' },
                        { href: '/profile', icon: '👤', label: 'Profile' },
                    ].map((item) => (
                        <Link key={item.href} href={item.href} className={`flex flex-col items-center ${item.active ? 'text-blue-600' : 'text-gray-500'}`}>
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
