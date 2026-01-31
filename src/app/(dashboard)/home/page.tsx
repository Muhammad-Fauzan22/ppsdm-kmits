// src/app/(dashboard)/home/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, Trophy, Activity, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudyGroupFinder } from "@/components/peer/StudyGroupFinder";

async function getStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // In a real scenario, we'd fetch these counts from DB. 
  // For now, we simulate 'Engineering' level stats.
  return {
    user,
    coursesInProgress: 3,
    completedModules: 12,
    hoursLearned: 45,
    rank: "Engineering Lead"
  };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const userName = stats.user?.user_metadata?.full_name || "Engineer";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-800 to-slate-900 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Welcome back, {userName}
            </h1>
            <p className="mt-2 text-blue-200 text-lg">
              System operational. Ready to continue your engineering journey?
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/courses">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20">
                Resume Learning <Zap className="ml-2 w-4 h-4 text-yellow-400" />
              </Button>
            </Link>
            <Link href="/analytics">
              <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                View Analytics <Activity className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "In Progress", value: stats.coursesInProgress, icon: BookOpen, color: "text-blue-400", sub: "+1 from last month" },
          { title: "Modules Completed", value: stats.completedModules, icon: CheckCircle, color: "text-green-400", sub: "+12% efficiency" },
          { title: "Hours Learned", value: stats.hoursLearned, icon: Clock, color: "text-orange-400", sub: "Top 10% percentile" },
          { title: "Current Rank", value: stats.rank, icon: Trophy, color: "text-purple-400", sub: "Next level: Principal" },
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 bg-card/50 border-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground bg-white/5 rounded-lg p-8 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-white/10">
              <Clock className="w-8 h-8 opacity-50" />
              <p>System Initialized. Awaiting learning interactions.</p>
              <Link href="/courses" className="text-xs text-blue-400 hover:text-blue-300">Browse Courses &rarr;</Link>
            </div>
          </CardContent>
        </Card>

        {/* Recommended */}
        <Card className="col-span-3 bg-gradient-to-b from-slate-800 to-slate-900 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    TD
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-white group-hover:text-blue-400 transition-colors">Thermodynamics II</p>
                    <p className="text-xs text-muted-foreground">Module 3 • 45m remaining</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
              </div>
              <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    AI
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-white group-hover:text-purple-400 transition-colors">Applied AI Systems</p>
                    <p className="text-xs text-muted-foreground">New Course • Trending</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peer Learning Section */}
      <div className="grid gap-6">
        <StudyGroupFinder />
      </div>
    </div>
  );
}
