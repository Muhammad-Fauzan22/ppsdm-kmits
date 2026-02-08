import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Users, Award, Bell } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics</h1>
                <p className="text-slate-400">Deep dive into your learning performance and growth metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Learning Time", value: "45h 20m", icon: Activity, color: "text-blue-400", sub: "+2.5h this week" },
                    { title: "Growth Rate", value: "+15%", icon: TrendingUp, color: "text-green-400", sub: "Above average" },
                    { title: "Peer Comparison", value: "Top 10%", icon: Users, color: "text-purple-400", sub: "Among engineering students" },
                    { title: "Achievements", value: "12", icon: Award, color: "text-yellow-400", sub: "3 new unlocked" },
                ].map((item, i) => (
                    <Card key={i} className="bg-card/50 border-white/5 backdrop-blur hover:bg-card/80 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {item.title}
                            </CardTitle>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{item.value}</div>
                            <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Detailed Analytics Coming Soon</h3>
                <p className="text-slate-400 max-w-md">
                    We are currently processing your historical data to provide deeper insights. Check back later for detailed charts and recommendations.
                </p>
            </div>
        </div>
    );
}
