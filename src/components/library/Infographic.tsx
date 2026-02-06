import { TrendingUp, Users, DollarSign, Activity, Zap } from "lucide-react";

export function Infographic({ data }: { data: any[] }) {
    if (!data || !Array.isArray(data)) return <div className="p-4 text-slate-400">No infographic data.</div>;

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'chart': return <TrendingUp size={24} />;
            case 'user': return <Users size={24} />;
            case 'money': return <DollarSign size={24} />;
            case 'activity': return <Activity size={24} />;
            default: return <Zap size={24} />;
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
            {data.map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center text-center group">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        {getIcon(item.icon)}
                    </div>
                    <span className="text-3xl font-extrabold text-slate-800 mb-1">{item.stat}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                </div>
            ))}
        </div>
    );
}
