'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Newspaper, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function NewsWidget() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchNews = async () => {
            const { data } = await supabase
                .from('scraped_news')
                .select('*')
                .order('published_at', { ascending: false })
                .limit(5);

            if (data) setNews(data);
            setLoading(false);
        };

        fetchNews();
    }, [supabase]);

    if (loading) return <div className="h-48 bg-white/5 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-blue-600" />
                    Campus Updates
                </h3>
                <Link href="#" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-4">
                {news.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No recent updates found.</p>
                ) : (
                    news.map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-4 group hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors"
                        >
                            <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={`Thumbnail for ${item.title}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                                        <Newspaper className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {item.published_at ? format(new Date(item.published_at), 'MMM d, yyyy') : 'Recent'}
                                    </span>
                                    <span>•</span>
                                    <span className="text-blue-500">{item.source || 'ITS'}</span>
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
