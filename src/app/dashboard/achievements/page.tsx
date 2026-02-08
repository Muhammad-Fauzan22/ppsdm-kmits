import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Medal, Lock } from "lucide-react";

export default function AchievementsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Achievements</h1>
                <p className="text-slate-400">Track your milestones and earned badges.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "First Steps", desc: "Completed 3 modules", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10", unlocked: true },
                    { title: "Consistent Learner", desc: "7 day streak", icon: Trophy, color: "text-blue-400", bg: "bg-blue-400/10", unlocked: true },
                    { title: "Dimension Master", desc: "Max out 1 dimension", icon: Medal, color: "text-purple-400", bg: "bg-purple-400/10", unlocked: true },
                    { title: "Community Leader", desc: "Host a study group", icon: Lock, color: "text-slate-600", bg: "bg-slate-800", unlocked: false },
                ].map((item, i) => (
                    <Card key={i} className={`border-white/5 backdrop-blur transition-all duration-300 ${!item.unlocked ? 'opacity-60' : 'bg-card/50'}`}>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${item.bg}`}>
                                <item.icon className={`w-8 h-8 ${item.color}`} />
                            </div>
                            <h3 className="font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                            {!item.unlocked && <span className="mt-2 text-[10px] uppercase tracking-wider text-slate-600 font-bold border border-slate-700 px-2 py-1 rounded">Locked</span>}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
