import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StudyBuddyChat } from "@/components/dashboard/StudyBuddyChat";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPSDM KMITS - Student Dashboard',
  description: 'Holistic Student Development Platform',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 font-sans selection:bg-cyan-500/30">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative">
          {/* Background Ambiance */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-blue/5 to-transparent pointer-events-none" />

          {children}
        </main>
      </div>

      {/* Floating Study Buddy AI - available across all dashboard pages */}
      <StudyBuddyChat />
    </div>
  );
}
