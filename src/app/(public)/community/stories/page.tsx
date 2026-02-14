'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';

const features = [
    {
        icon: 'School',
        title: 'Digital Learning',
        description: 'Access comprehensive learning materials regarding PPSDM development'
    },
    {
        icon: 'Search',
        title: 'Smart Search',
        description: 'Find relevant stories and case studies instantly'
    },
    {
        icon: 'TrendingUp',
        title: 'Progress Tracking',
        description: 'Monitor your learning journey and improved metrics'
    },
    {
        icon: 'BarChart',
        title: 'Impact Analysis',
        description: 'Visualizing the real-world impact of implemented solutions'
    }
];

const stories = [
    {
        id: 1,
        title: "Transformation at KPP Pratama",
        category: "Case Study",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600",
        author: {
            name: "Sarah Chen",
            role: "Change Manager",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        }
    },
    {
        id: 2,
        title: "Digital Leadership Journey",
        category: "Success Story",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600",
        author: {
            name: "Michael Park",
            role: "Director",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
        }
    },
    {
        id: 3,
        title: "Innovation in Public Sector",
        category: "Thought Leadership",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600",
        author: {
            name: "Emma Wilson",
            role: "Innovation Lead",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
        }
    }
];

export default function StoriesPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6"
                    >
                        <Icon name="BookOpen" className="w-5 h-5" />
                        <span className="font-semibold text-sm uppercase tracking-wider">Success Stories</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        Impact Stories & <span className="text-blue-600">Case Studies</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600"
                    >
                        Explore how organizations are transforming their capabilities and driving real impact through PPSDM initiatives.
                    </motion.p>
                </div>

                {/* Featured Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                <Icon name={feature.icon as any} className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Latest Stories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <motion.article
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-700">
                                        {story.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                    <Icon name="PlayCircle" className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Icon name="Clock" className="w-4 h-4" />
                                        {story.readTime}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Icon name="Calendar" className="w-4 h-4" />
                                        Feb 12, 2024
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {story.title}
                                </h2>

                                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                                    Discover how modern methodologies are reshaping public sector performance and delivery...
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                            <Image
                                                src={story.author.avatar}
                                                alt={story.author.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">{story.author.name}</div>
                                            <div className="text-xs text-slate-500">{story.author.role}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                            <Icon name="Bookmark" className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                            <Icon name="Share2" className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                            <Icon name="MoreVertical" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        <span>Load More Stories</span>
                        <Icon name="ArrowRight" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
