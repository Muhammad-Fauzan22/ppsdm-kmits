// src/app/dashboard/home/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, Trophy, Activity, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudyGroupFinder } from "@/components/peer/StudyGroupFinder";
import { RecommendationEngine } from "@/lib/adaptive/engine";
import { InterventionCard } from "@/components/adaptive/InterventionCard";

// New feature components
import { DailyCheckIn } from "@/components/dashboard/DailyCheckIn";
import { DailyPulse } from "@/components/dashboard/DailyPulse";
import { WeeklyGoals } from "@/components/dashboard/WeeklyGoals";
import { StreakCalendar } from "@/components/dashboard/StreakCalendar";
import { AchievementBadges } from "@/components/dashboard/AchievementBadges";
import { PeerBenchmark } from "@/components/dashboard/PeerBenchmark";
// Note: StudyBuddyChat is in dashboard/layout.tsx (available on all dashboard pages)

async function getStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-800 to-slate-900 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Selamat datang, {userName} 👋
            </h1>
            <p className="mt-2 text-blue-200 text-lg">
              Sistem siap. Lanjutkan perjalanan pengembangan diri Anda hari ini!
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/courses">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20">
                Lanjut Belajar <Zap className="ml-2 w-4 h-4 text-yellow-400" />
              </Button>
            </Link>
            <Link href="/dashboard/holistic">
              <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                Lihat Analitik <Activity className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Kursus Aktif", value: stats.coursesInProgress, icon: BookOpen, color: "text-blue-400", sub: "+1 dari bulan lalu" },
          { title: "Modul Selesai", value: stats.completedModules, icon: CheckCircle, color: "text-green-400", sub: "+12% efisiensi" },
          { title: "Jam Belajar", value: stats.hoursLearned, icon: Clock, color: "text-orange-400", sub: "Top 10% persentil" },
          { title: "Peringkat", value: stats.rank, icon: Trophy, color: "text-purple-400", sub: "Level berikutnya: Principal" },
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

      {/* ═══════════════════════════════════════════════════════════════
          NEW FEATURES ROW 1: Daily Check-in + Daily Pulse + Weekly Goals
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid gap-4 md:grid-cols-3">
        <DailyCheckIn />
        <DailyPulse />
        <WeeklyGoals />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NEW FEATURES ROW 2: Streak Calendar (full width)
          ═══════════════════════════════════════════════════════════════ */}
      <StreakCalendar />

      {/* ═══════════════════════════════════════════════════════════════
          NEW FEATURES ROW 3: Achievements + Peer Benchmark
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AchievementBadges />
        <PeerBenchmark />
      </div>

      {/* Activity Feed + Recommendations */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card/50 border-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Feed Aktivitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground bg-white/5 rounded-lg p-8 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-white/10">
              <Clock className="w-8 h-8 opacity-50" />
              <p>Sistem diinisialisasi. Menunggu interaksi pembelajaran.</p>
              <Link href="/dashboard/courses" className="text-xs text-blue-400 hover:text-blue-300">
                Jelajahi Kursus →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-gradient-to-b from-slate-800 to-slate-900 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Rekomendasi untuk Anda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { initials: 'TD', name: 'Termodinamika II', sub: 'Modul 3 · 45 menit tersisa', color: 'bg-blue-500/20 text-blue-400' },
                { initials: 'AI', name: 'Sistem AI Terapan', sub: 'Kursus Baru · Trending', color: 'bg-purple-500/20 text-purple-400' },
                { initials: 'FI', name: 'Literasi Finansial', sub: 'Direkomendasikan · Skor rendah', color: 'bg-orange-500/20 text-orange-400' },
              ].map((item, i) => (
                <div key={i} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center font-bold`}>
                      {item.initials}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-white group-hover:text-blue-400 transition-colors">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peer Learning Section */}
      <div className="grid gap-6">
        <StudyGroupFinder />
      </div>

      {/* Adaptive Intervention Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" /> Jalur Pertumbuhan Personal
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RecommendationEngine.getRecommendations({
            'financial': 40,
            'cognitive': 80,
            'emotional': 65,
            'physical': 55
          }).map(intervention => (
            <InterventionCard key={intervention.id} intervention={intervention} />
          ))}
        </div>
      </div>

    </div>
  );
}
