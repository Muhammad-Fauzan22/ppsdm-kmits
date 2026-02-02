"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeroVideoSection } from "@/components/landing/HeroVideoSection";

const navLinks = [
  { href: "#methodology", label: "Metodologi" },
  { href: "#dimensions", label: "9 Dimensi" },
  { href: "#mission-control", label: "Mission Control" },
  { href: "#faq", label: "FAQ" },
];

const dimensions = [
  { id: 1, title: "Leadership", description: "Mampu mengarahkan visi dan menginspirasi tim dalam lingkungan yang dinamis.", icon: "diversity_3", type: "soft", progress: 65 },
  { id: 2, title: "Tech Mastery", description: "Penguasaan perangkat lunak, coding, dan metodologi engineering standar global.", icon: "code", type: "hard", progress: 40 },
  { id: 3, title: "Communication", description: "Keahlian menyampaikan ide kompleks secara sederhana.", icon: "forum", type: "soft", progress: 80 },
  { id: 4, title: "Data Analytics", description: "Pengambilan keputusan berbasis data menggunakan tools statistik modern.", icon: "analytics", type: "hard", progress: 25 },
  { id: 5, title: "Ethics & Growth", description: "Integritas akademik, etika profesi, dan mentalitas pembelajar sepanjang hayat.", icon: "auto_fix_high", type: "soft", progress: 90 },
  { id: 6, title: "Project Mgmt", description: "Manajemen sumber daya, risiko, dan waktu melalui framework Agile/Scrum.", icon: "business_center", type: "hard", progress: 55 },
  { id: 7, title: "Critical Thinking", description: "Analisis mendalam dan evaluasi objektif untuk solusi masalah yang inovatif.", icon: "psychology_alt", type: "soft", progress: 75 },
  { id: 8, title: "System Design", description: "Merancang arsitektur sistem yang skalabel, aman, dan efisien.", icon: "architecture", type: "hard", progress: 50 },
  { id: 9, title: "Global Mindset", description: "Wawasan internasional dan kemampuan adaptasi dalam keragaman budaya.", icon: "public", type: "soft", progress: 85 },
];

const methodologySteps = [
  { step: "01", title: "Assessment", description: "Uji 9 dimensi kompetensi dasar Anda dengan AI-driven psychometric testing.", icon: "psychology" },
  { step: "02", title: "Roadmap", description: "Dapatkan rencana belajar personal sesuai minat, jurusan, dan gap kompetensi.", icon: "map" },
  { step: "03", title: "Mentorship", description: "Bimbingan 1-on-1 langsung dari alumni sukses dan profesional industri.", icon: "groups_3" },
  { step: "04", title: "Portfolio", description: "Klaim sertifikat digital dan hasilkan portofolio karir yang divalidasi ITS.", icon: "verified" },
];

const faqData = [
  { question: "Apakah program ini gratis untuk mahasiswa ITS?", answer: "Ya, seluruh fitur dasar, assessment, dan akses materi digital tersedia secara gratis bagi seluruh mahasiswa aktif ITS melalui integrasi Single Sign-On (SSO) myITS." },
  { question: "Bagaimana cara mendapatkan bimbingan mentor?", answer: "Anda perlu menyelesaikan assessment awal dan mencapai 'Roadmap Level 3' untuk membuka akses ke fitur penjadwalan mentor. Hal ini memastikan sesi mentoring lebih efektif dan terarah." },
  { question: "Apakah sertifikat PPSDM diakui industri?", answer: "Tentu. Sertifikat kami mencantumkan detail kompetensi yang divalidasi dan dilengkapi dengan ID verifikasi digital yang dapat dilampirkan di LinkedIn atau CV." },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-its-dark/80 backdrop-blur-xl supports-[backdrop-filter]:bg-its-dark/60">
      <div className="flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/30 group-hover:shadow-brand-accent/40 transition-all duration-300">
            <span className="material-symbols-outlined text-white relative z-10">analytics</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-tight text-white leading-none group-hover:text-brand-accent transition-colors">PPSDM KMM</span>
            <span className="text-[10px] uppercase tracking-widest text-its-gold font-bold">ITS Surabaya</span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow transition-all">{link.label}</a>
          ))}
          <Link href="/auth/login" className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 active:scale-95 flex items-center gap-2 group">
            Mulai Sekarang
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </nav>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-its-dark/95 backdrop-blur-xl border-t border-white/5">
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-300 hover:text-white transition-colors py-2">{link.label}</a>
              ))}
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-3 rounded-full font-bold text-sm transition-all text-center mt-2">Mulai Sekarang</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MethodologySection() {
  return (
    <section id="methodology" className="py-24 px-6 lg:px-12 bg-[#05080F] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">Metodologi Kami</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Transformasi potensi menjadi aksi nyata melalui 4 langkah strategis.</p>
        </motion.div>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[85%] h-0.5 timeline-line"></div>
          {methodologySteps.map((step, index) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative z-10 flex flex-col items-center text-center group cursor-default">
              <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 group-hover:-translate-y-4 transition-all duration-500 border-brand-blue/30 relative">
                <span className="material-symbols-outlined text-4xl text-brand-accent">{step.icon}</span>
                <div className="absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-accent text-its-dark text-[10px] font-bold px-2 py-0.5 rounded-full">STEP {step.step}</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">{step.title}</h3>
              <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DimensionsSection() {
  return (
    <section id="dimensions" className="py-24 px-6 lg:px-12 relative">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-its-blue/10 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">The 9 Dimensions</h2>
            <p className="text-slate-400 max-w-xl">Kurikulum komprehensif yang membagi pengembangan menjadi kategori Hard Skills dan Soft Skills.</p>
          </div>
          <div className="flex gap-4">
            <span className="px-4 py-2 rounded-full border border-brand-blue/50 bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Soft Skills</span>
            <span className="px-4 py-2 rounded-full border border-its-gold/50 bg-its-gold/10 text-its-gold text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Hard Skills</span>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dimensions.map((dim, index) => (
            <motion.div key={dim.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className={`glass-card card-hover p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-l-4 ${dim.type === "soft" ? "border-l-brand-blue" : "border-l-its-gold"}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`size-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${dim.type === "soft" ? "bg-brand-blue/20" : "bg-its-gold/20"}`}>
                  <span className={`material-symbols-outlined text-3xl ${dim.type === "soft" ? "text-brand-blue" : "text-its-gold"}`}>{dim.icon}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase border px-2 py-1 rounded ${dim.type === "soft" ? "text-brand-blue/80 border-brand-blue/30" : "text-its-gold/80 border-its-gold/30"}`}>{dim.type === "soft" ? "Soft Skill" : "Hard Skill"}</span>
              </div>
              <h3 className={`text-xl font-bold text-white mb-3 transition-colors ${dim.type === "soft" ? "group-hover:text-brand-accent" : "group-hover:text-its-gold"}`}>{dim.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{dim.description}</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className={`progress-fill h-full rounded-full ${dim.type === "soft" ? "bg-brand-blue" : "bg-its-gold"}`} style={{ width: `${dim.progress}%`, boxShadow: dim.type === "soft" ? "0 0 10px rgba(19,91,236,0.5)" : "0 0 10px rgba(255,215,0,0.5)" }}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionControlSection() {
  return (
    <section id="mission-control" className="py-24 px-6 lg:px-12 bg-white/5 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-its-blue/30 rounded-full blur-[120px]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">Mission Control <br /><span className="text-brand-accent drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]">Personal Dashboard</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed">Rasakan langsung visualisasi radar kompetensi Anda. Platform kami melacak pertumbuhan setiap dimensi secara real-time.</p>
            <div className="space-y-4">
              {[{ icon: "auto_awesome", title: "AI-Powered Analysis", desc: "Rekomendasi personal berbasis ML" }, { icon: "monitoring", title: "Real-time Analytics", desc: "Tracking progress live" }, { icon: "share", title: "Export & Share", desc: "Portofolio untuk LinkedIn" }].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-brand-blue/20 flex items-center justify-center"><span className="material-symbols-outlined text-brand-accent">{feature.icon}</span></div>
                  <div><h4 className="text-white font-bold">{feature.title}</h4><p className="text-slate-500 text-sm">{feature.desc}</p></div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:w-1/2 w-full max-w-[550px]">
            <div className="glass-card-strong p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] text-brand-accent uppercase tracking-widest font-bold mb-1 block">Analysis Profile</span>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">Student 2024.08.12<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span></h4>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/10"><span className="material-symbols-outlined text-white text-lg">settings</span></div>
              </div>
              <div className="aspect-square w-full flex items-center justify-center relative my-4">
                <svg className="w-full h-full max-w-[350px] transform -rotate-90 overflow-visible drop-shadow-[0_0_20px_rgba(19,91,236,0.3)]" viewBox="0 0 200 200">
                  <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="#0A0F1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="100" y1="100" x2="100" y2="20" stroke="rgba(255,255,255,0.1)" />
                  <line x1="100" y1="100" x2="170" y2="60" stroke="rgba(255,255,255,0.1)" />
                  <line x1="100" y1="100" x2="170" y2="140" stroke="rgba(255,255,255,0.1)" />
                  <line x1="100" y1="100" x2="100" y2="180" stroke="rgba(255,255,255,0.1)" />
                  <line x1="100" y1="100" x2="30" y2="140" stroke="rgba(255,255,255,0.1)" />
                  <line x1="100" y1="100" x2="30" y2="60" stroke="rgba(255,255,255,0.1)" />
                  <polygon points="100,40 150,80 140,130 100,160 50,130 60,70" fill="rgba(0, 212, 255, 0.2)" stroke="#00d4ff" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="100" cy="40" r="4" fill="#fff" stroke="#00d4ff" strokeWidth="2" />
                  <circle cx="150" cy="80" r="4" fill="#fff" stroke="#00d4ff" strokeWidth="2" />
                  <circle cx="140" cy="130" r="4" fill="#fff" stroke="#00d4ff" strokeWidth="2" />
                  <circle cx="100" cy="160" r="4" fill="#fff" stroke="#00d4ff" strokeWidth="2" />
                  <circle cx="50" cy="130" r="4" fill="#fff" stroke="#00d4ff" strokeWidth="2" />
                  <circle cx="60" cy="70" r="4" fill="#fff" stroke="#00d4ff" strokeWidth="2" />
                </svg>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold tracking-widest bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">LEADERSHIP</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold tracking-widest bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">ETHICS</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold rotate-90 origin-right -mr-4 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">TECH</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold -rotate-90 origin-left -ml-4 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">SOCIAL</div>
              </div>
              <div className="mt-4 flex justify-between items-center bg-brand-blue/10 p-4 rounded-xl border border-brand-blue/20">
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">Development Status</p><p className="text-white font-bold">Growth Potential: 85%</p></div>
                <div className="h-10 w-10 bg-brand-accent/20 rounded-lg flex items-center justify-center text-brand-accent animate-bounce"><span className="material-symbols-outlined">rocket_launch</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="py-24 px-6 lg:px-12 bg-[#05080F] relative">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading text-white">Pertanyaan Sering Diajukan</h2>
        </motion.div>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.details key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group glass-card rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer open:bg-white/10 transition-all">
              <summary className="flex items-center justify-between text-white font-bold list-none text-lg">
                {faq.question}
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed pl-1 border-l-2 border-brand-accent ml-1">{faq.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#05080F]">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="p-12 rounded-[3rem] bg-gradient-to-br from-its-blue/40 to-brand-blue/20 border border-white/10 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-brand-accent/30 transition-colors"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Memulai Perjalanan Anda?</h3>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto text-lg">Transformasi potensi Anda dimulai dari sini. Bergabung dengan ribuan mahasiswa ITS.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login" className="bg-white text-its-blue font-bold px-8 py-4 rounded-xl hover:bg-brand-accent hover:text-its-dark transition-all shadow-lg inline-flex items-center justify-center gap-2">
                <span>Mulai Sekarang</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/try-assessment" className="glass-card text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2 border-white/20">
                <span className="material-symbols-outlined">quiz</span>
                <span>Coba Assessment</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-its-dark pt-20 pb-10 px-6 lg:px-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-its-blue font-black shadow-xl text-lg">ITS</div>
              <h2 className="text-xl font-bold font-heading text-white">Institut Teknologi Sepuluh Nopember</h2>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">Pusat Pengembangan Sumber Daya Manusia - KMM ITS berfokus pada integrasi pendidikan akademik dan pembentukan karakter unggul untuk Indonesia Emas 2045.</p>
            <div className="flex gap-4">
              {["public", "mail", "smart_display"].map((icon, idx) => (
                <a key={idx} href="#" className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:scale-110 transition-all text-white border border-white/10">
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Program</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              {["Assessment Mandiri", "Bootcamp Kompetensi", "Mentorship Karir", "Katalog Soft Skills"].map((item, idx) => (
                <li key={idx}><a href="#" className="hover:text-brand-accent transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-accent rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Kontak</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-sm mt-1 text-brand-blue">location_on</span><span>Kampus ITS Sukolilo,<br/>Surabaya 60111</span></li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-sm text-brand-blue">phone</span><span>+62-31-5994251</span></li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-sm text-brand-blue">alternate_email</span><span>ppsdm@its.ac.id</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <p>© 2024 PPSDM KMM ITS. Developed for Excellence.</p>
          <div className="flex gap-8">
            {["Privacy Policy", "Cookie Policy", "Accessibility"].map((item, idx) => (
              <a key={idx} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-its-dark text-slate-200 overflow-x-hidden">
      <div className="noise-overlay"></div>
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <HeroVideoSection />
          <MethodologySection />
          <DimensionsSection />
          <MissionControlSection />
          <CTASection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
