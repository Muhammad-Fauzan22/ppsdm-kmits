"use client";

import Link from "next/link";

export default function Home() {
  const modules = [
    {
      title: "Student Dashboard",
      description: "Personal growth timeline, stats, and smart recommendations",
      href: "/dashboard",
      icon: "dashboard",
      color: "bg-primary",
    },
    {
      title: "Student Nexus",
      description: "Dark-themed personal growth hub with pulse checks",
      href: "/nexus",
      icon: "hub",
      color: "bg-growth-green",
    },
    {
      title: "RPI Management",
      description: "Plan your development across semesters and dimensions",
      href: "/rpi",
      icon: "view_kanban",
      color: "bg-its-blue",
    },
    {
      title: "Portfolio Builder",
      description: "Create and export your professional portfolio",
      href: "/portfolio",
      icon: "folder_special",
      color: "bg-primary-light",
    },
    {
      title: "BEM Orchestrator",
      description: "Program lifecycle management for student orgs",
      href: "/orchestrator",
      icon: "account_tree",
      color: "bg-[#2b6cee]",
    },
    {
      title: "Admin Console",
      description: "Monitor program effectiveness and user analytics",
      href: "/admin",
      icon: "admin_panel_settings",
      color: "bg-active-yellow",
    },
    {
      title: "Mentorship Portal",
      description: "Lecturers tracking mentees and providing feedback",
      href: "/mentorship",
      icon: "groups",
      color: "bg-primary",
    },
    {
      title: "Supervisor Network",
      description: "Manage your mentees with progress tracking",
      href: "/supervisor",
      icon: "diversity_3",
      color: "bg-[#7c3aed]",
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-its-blue text-white font-display">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">school</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                PPSDM KMITS
              </h1>
              <p className="text-white/80 text-lg">
                Holistic Student Development Platform
              </p>
            </div>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed text-white/90">
            Platform pengembangan mahasiswa holistik berbasis 9 dimensi perkembangan manusia.
            Dari <strong>onboarding sederhana</strong> hingga <strong>dashboard kompleks</strong>.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              Mulai Sekarang
            </Link>
            <a
              href="#modules"
              className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">explore</span>
              Jelajahi Modul
            </a>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 size-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-10 size-40 bg-white/5 rounded-full blur-2xl"></div>
      </header>

      {/* Modules Grid */}
      <section id="modules" className="bg-background-light dark:bg-background-dark py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-neutral-dark dark:text-white">
              Platform Modules
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Klik untuk menjelajahi setiap modul
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, idx) => (
              <Link
                key={idx}
                href={module.href}
                className="group bg-white dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`size-14 ${module.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {module.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-dark dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {module.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-primary dark:text-primary-light font-medium text-sm group-hover:gap-2 transition-all">
                  Buka Modul
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-card-dark py-20 border-t border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary dark:text-primary-light font-bold text-sm uppercase tracking-wider">
                9 Dimensi Pengembangan
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-neutral-dark dark:text-white mt-2 mb-6">
                Holistic Development Engine
              </h2>
              <div className="space-y-4">
                {[
                  { icon: "psychology", label: "Manajemen Diri & Produktivitas" },
                  { icon: "school", label: "Kecerdasan Intelektual" },
                  { icon: "payments", label: "Kecerdasan Finansial" },
                  { icon: "fitness_center", label: "Kesehatan Fisik" },
                  { icon: "favorite", label: "Kecerdasan Emosional & Sosial" },
                  { icon: "self_improvement", label: "Kesehatan Mental" },
                  { icon: "verified_user", label: "Karakter & Etika" },
                  { icon: "auto_awesome", label: "Pengembangan Spiritual" },
                  { icon: "eco", label: "Manajemen Lingkungan" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="material-symbols-outlined text-primary dark:text-primary-light">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Mandala Visual */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 dark:border-primary/30"></div>
                <div className="absolute inset-8 rounded-full border-4 border-primary/30 dark:border-primary/40"></div>
                <div className="absolute inset-16 rounded-full border-4 border-primary/40 dark:border-primary/50"></div>
                <div className="absolute inset-24 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl">
                    person
                  </span>
                </div>
                {/* Floating Labels */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-3 py-1 rounded-full shadow text-xs font-bold text-primary">
                  Spiritual
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark px-3 py-1 rounded-full shadow text-xs font-bold text-primary">
                  Physical
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-card-dark px-3 py-1 rounded-full shadow text-xs font-bold text-primary">
                  Social
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-card-dark px-3 py-1 rounded-full shadow text-xs font-bold text-primary">
                  Mental
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl text-primary-light">
              school
            </span>
            <span className="text-2xl font-bold">PPSDM KMITS</span>
          </div>
          <p className="text-gray-400 max-w-lg mx-auto">
            "Membangun insan ITS yang tidak hanya pintar secara teknis, tetapi juga matang secara manusiawi."
          </p>
          <p className="text-gray-500 text-sm mt-8">
            © 2024 PPSDM KM ITS. Platform Pengembangan Mahasiswa Holistik.
          </p>
        </div>
      </footer>
    </div>
  );
}
