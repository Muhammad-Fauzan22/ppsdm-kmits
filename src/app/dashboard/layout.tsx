import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPSDM KMITS - Student Dashboard',
  description: 'Holistic Student Development Platform',
};

import { GamificationManager } from "@/components/gamification/GamificationManager";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070B14] text-slate-800 dark:text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-300">
      <GamificationManager />
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative">
          {/* Background Ambiance - only in dark mode */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-blue/5 to-transparent pointer-events-none dark:block hidden" />

          {children}
        </main>
      </div>
    </div>
  );
}
