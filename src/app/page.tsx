"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem, SlideUp } from "@/components/Animations";
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Award,
  ClipboardCheck,
  BarChart2,
  Users,
  Settings,
  Brain,
  Heart,
  Activity,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Leaf,
  Play,
  Compass,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const modules = [
    {
      title: "Student Dashboard",
      description: "Personal growth timeline, stats, and smart recommendations",
      href: "/dashboard",
      icon: <LayoutDashboard className="size-6" />,
      color: "bg-its-blue",
      hoverColor: "group-hover:text-its-blue"
    },
    {
      title: "Student Nexus",
      description: "Dark-themed personal growth hub with pulse checks",
      href: "/nexus",
      icon: <Target className="size-6" />,
      color: "bg-green-500",
      hoverColor: "group-hover:text-green-500"
    },
    {
      title: "RPI Management",
      description: "Plan your development across semesters and dimensions",
      href: "/rpi",
      icon: <BookOpen className="size-6" />,
      color: "bg-blue-600",
      hoverColor: "group-hover:text-blue-600"
    },
    {
      title: "Portfolio Builder",
      description: "Create and export your professional portfolio",
      href: "/portfolio",
      icon: <Award className="size-6" />,
      color: "bg-blue-500",
      hoverColor: "group-hover:text-blue-500"
    },
    {
      title: "Initial Assessment",
      description: "Scientific assessment with 48 questions for gap analysis",
      href: "/assessment",
      icon: <ClipboardCheck className="size-6" />,
      color: "bg-red-500",
      hoverColor: "group-hover:text-red-500"
    },
    {
      title: "Gap Analysis",
      description: "Visualize your development gaps with radar charts",
      href: "/gap-analysis",
      icon: <BarChart2 className="size-6" />,
      color: "bg-cyan-500",
      hoverColor: "group-hover:text-cyan-500"
    },
    {
      title: "BEM Orchestrator",
      description: "Program lifecycle management for student orgs",
      href: "/orchestrator",
      icon: <Users className="size-6" />,
      color: "bg-indigo-500",
      hoverColor: "group-hover:text-indigo-500"
    },
    {
      title: "Admin Console",
      description: "Monitor program effectiveness and user analytics",
      href: "/admin",
      icon: <Settings className="size-6" />,
      color: "bg-yellow-500",
      hoverColor: "group-hover:text-yellow-500"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-its-blue/20">
      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-its-blue to-[#001A33]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[600px] bg-red-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-[20%] right-[20%] size-[300px] bg-cyan-400/10 rounded-full blur-[100px]" />
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <FadeIn>
            <div className="flex flex-col items-center text-center">
              <Badge variant="secondary" className="mb-8 px-4 py-1.5 text-sm font-medium backdrop-blur-md bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                ✨ Platform Pengembangan Sumber Daya Mahasiswa
              </Badge>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl max-w-4xl leading-tight">
                Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Potential</span> with Scientific <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300">Precision</span>.
              </h1>

              <p className="text-xl md:text-2xl text-blue-100/90 max-w-2xl mb-10 leading-relaxed font-light">
                Holistic development engine berbasis 9 dimensi kecerdasan. Dari assessment saintifik hingga gap analysis komprehensif.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/assessment">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all transform hover:scale-105 bg-white text-its-blue hover:bg-blue-50">
                    <ClipboardCheck className="mr-2 size-5" />
                    Mulai Assessment
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all transform hover:scale-105 bg-transparent">
                    <LayoutDashboard className="mr-2 size-5" />
                    Dashboard
                  </Button>
                </Link>
              </div>

              {/* Stats / Social Proof */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 opacity-80">
                {[
                  { label: "Mahasiswa", value: "2,000+" },
                  { label: "Dimensi", value: "9" },
                  { label: "Assessment", value: "48 Items" },
                  { label: "Validitas", value: "Saintifik" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                    <span className="text-sm font-medium text-blue-200 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Modules Grid */}
      <section id="modules" className="py-24 bg-gray-50/50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <SlideUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
                Platform Ecosystem
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Fitur lengkap yang terintegrasi untuk mendukung setiap langkah perjalanan pengembangan diri Anda.
              </p>
            </div>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, idx) => (
              <StaggerItem key={idx}>
                <Link href={module.href} className="block h-full">
                  <Card className="group h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <div className={`size-14 ${module.color} bg-opacity-10 dark:bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`text-white ${module.color.replace('bg-', 'text-').replace('-500', '-600')} dark:text-white`}>
                          {module.icon}
                        </div>
                      </div>
                      <CardTitle className={`text-xl font-bold group-hover:text-primary transition-colors ${module.hoverColor}`}>
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed mb-6">
                        {module.description}
                      </CardDescription>
                      <div className="flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
                        Buka Modul <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 9 Dimensions Section */}
      <section className="py-24 bg-white dark:bg-background border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SlideUp>
              <div>
                <Badge variant="outline" className="mb-4 border-its-blue text-its-blue bg-blue-50">
                  Concept
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Holistic Development <br /> <span className="text-its-blue">Engine</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  Kami menggunakan pendekatan 9 dimensi perkembangan manusia yang komprehensif untuk memastikan tidak ada aspek potensi diri yang terabaikan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Brain, label: "Kognitif", desc: "Berpikir Kritis" },
                    { icon: Heart, label: "Afektif", desc: "Nilai & Emosi" },
                    { icon: Activity, label: "Psikomotorik", desc: "Keterampilan" },
                    { icon: Sparkles, label: "Spiritual", desc: "Makna Hidup" },
                    { icon: Users, label: "Sosial", desc: "Komunikasi" },
                    { icon: DollarSign, label: "Finansial", desc: "Literasi Keuangan" },
                    { icon: ShieldCheck, label: "Karakter", desc: "Integritas" },
                    { icon: Leaf, label: "Lingkungan", desc: "Kesadaran Ekologi" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
                      <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-its-blue dark:text-blue-300">
                        <item.icon className="size-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>

            <div className="relative flex justify-center lg:justify-end">
              <FadeIn delay={0.2}>
                <div className="relative size-[400px] md:size-[500px]">
                  {/* Abstract Mandala / Radar Representation */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-red-100 dark:from-blue-900/20 dark:to-red-900/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                  <div className="relative z-10 w-full h-full bg-white dark:bg-card border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl p-8 rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-xl text-its-blue">Self-Analysis</div>
                        <Compass className="size-6 text-gray-400" />
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        {/* Placeholder for a mini radar chart visualization */}
                        <div className="relative size-64">
                          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                          <div className="absolute inset-8 border-4 border-gray-100 rounded-full"></div>
                          <div className="absolute inset-16 border-4 border-gray-100 rounded-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="size-32 bg-gradient-to-tr from-its-blue/80 to-red-500/80 rounded-full blur-md opacity-60 animate-pulse"></div>
                          </div>
                          {/* Floating Icons */}
                          <Brain className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-its-blue fill-current bg-white p-1 rounded-full shadow-sm" />
                          <Heart className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 text-red-500 fill-current bg-white p-1 rounded-full shadow-sm" />
                          <Users className="absolute top-1/2 right-0 translate-x-3 -translate-y-1/2 text-green-500 fill-current bg-white p-1 rounded-full shadow-sm" />
                          <Leaf className="absolute top-1/2 left-0 -translate-x-3 -translate-y-1/2 text-teal-500 fill-current bg-white p-1 rounded-full shadow-sm" />
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-400 font-medium">9-Dimension Mapping System</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">PPSDM KMM</span>
          </div>
          <p className="text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Platform Pengembangan Sumber Daya Mahasiswa designed to foster holistic growth and professional readiness for engineering students.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">HMM ITS</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
          </div>
          <p className="text-gray-600 text-xs mt-12">
            © 2026 HMM Digital Hub. All rights reserved. Built with ❤️ for Engineering Students.
          </p>
        </div>
      </footer>
    </div>
  );
}
