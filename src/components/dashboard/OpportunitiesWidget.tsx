'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Briefcase, ArrowRight, ExternalLink } from 'lucide-react';

export default function OpportunitiesWidget() {
    const [opps, setOpps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchOpps = async () => {
            const { data } = await supabase
                .from('scraped_opportunities')
                .select('*')
                .order('scraped_at', { ascending: false })
                .limit(5);

            if (data) setOpps(data);
            setLoading(false);
        };

        fetchOpps();
    }, [supabase]);

    if (loading) return <div className="h-48 bg-white/5 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    Opportunities
                </h3>
                <span className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                    Updated Daily
                </span>
            </div>

            <div className="divide-y divide-gray-100">
                {opps.length === 0 ? (
                    <p className="text-gray-400 text-sm py-2">No new opportunities.</p>
                ) : (
                    opps.map((item) => (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.category === 'Magang' ? 'bg-orange-50 text-orange-600' :
                                    item.category === 'Beasiswa' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {item.category || 'Info'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{item.company || item.description?.slice(0, 40)}</p>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
                            >
                                Apply Now <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                    ))
                )}
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors border-t border-gray-100">
                View All Opportunities
            </button>
        </div>
    );
}
