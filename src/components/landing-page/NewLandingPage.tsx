 'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Heart, Users, Target, Briefcase, 
  Sprout, BookOpen, PiggyBank, Zap, ChevronDown,
  Play, ArrowRight, Star, Quote, CheckCircle2,
  Menu, X, Sparkles, TrendingUp, Award, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, DimensionCard } from '@/components/ui/card';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface Dimension {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  stats: { label: string; value: string }[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

interface FAQ {
  question: string;
  answer: string;
}

// =============================================================================
// DATA
// =============================================================================

const dimensions: Dimension[] = [
  {
    id: 'cognitive',
    title: 'Cognitive & Intellectual',
    subtitle: 'Kecerdasan Kognitif',
    description: 'Pengembangan kemampuan berpikir kritis, analitis, dan kreatif untuk pemecahan masalah kompleks.',
    icon: <Brain className="w-6 h-6 text-white" />,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-400',
    stats: [
      { label: 'Assessments', value: '12' },
      { label: 'Modules', value: '24' }
    ]
  },
  {
    id: 'self-management',
    title: 'Self Management',
    subtitle: 'Manajemen Diri',
    description: 'Pengelolaan waktu, emosi, dan produktivitas untuk mencapai peak performance.',
    icon: <Target className="w-6 h-6 text-white" />,
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-400',
    stats: [
      { label: 'Tools', value: '8' },
      { label: 'Trackers', value: '15' }
    ]
  },
  {
    id: 'emotional',
    title: 'Emotional & Social',
    subtitle: 'Kecerdasan Emosional',
    description: 'Pengembangan EQ, empati, dan keterampilan interpersonal untuk kolaborasi efektif.',
    icon: <Heart className="w-6 h-6 text-white" />,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-400',
    stats: [
      { label: 'Scenarios', value: '20' },
      { label: 'Labs', value: '6' }
    ]
  },
  {
    id: 'physical',
    title: 'Physical Health',
    subtitle: 'Kesehatan Fisik',
    description: 'Pemantauan dan peningkatan kondisi fisik, kebiasaan hidup sehat, dan wellbeing.',
    icon: <Zap className="w-6 h-6 text-white" />,
    color: '#EF4444',
    gradient: 'from-red-500 to-rose-400',
    stats: [
      { label: 'Metrics', value: '10' },
      { label: 'Programs', value: '12' }
    ]
  },
  {
    id: 'spiritual',
    title: 'Spiritual & Values',
    subtitle: 'Spiritual & Nilai',
    description: 'Eksplorasi makna hidup, nilai-nilai fundamental, dan kontribusi kepada masyarakat.',
    icon: <Sparkles className="w-6 h-6 text-white" />,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-400',
    stats: [
      { label: 'Journeys', value: '5' },
      { label: 'Reflections', value: '18' }
    ]
  },
  {
    id: 'character',
    title: 'Character & Ethics',
    subtitle: 'Karakter & Etika',
    description: 'Pembentukan integritas, tanggung jawab, dan etika dalam kehidupan akademik dan profesional.',
    icon: <Award className="w-6 h-6 text-white" />,
    color: '#EC4899',
    gradient: 'from-pink-500 to-fuchsia-400',
    stats: [
      { label: 'Cases', value: '25' },
      { label: 'Dilemmas', value: '40' }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Literacy',
    subtitle: 'Literasi Keuangan',
    description: 'Pengelolaan keuangan pribadi, investasi, dan perencanaan financial jangka panjang.',
    icon: <PiggyBank className="w-6 h-6 text-white" />,
    color: '#14B8A6',
    gradient: 'from-teal-500 to-cyan-400',
    stats: [
      { label: 'Simulators', value: '4' },
      { label: 'Courses', value: '8' }
    ]
  },
  {
    id: 'environmental',
    title: 'Environmental',
    subtitle: 'Kesadaran Lingkungan',
    description: 'Pemahaman dan aksi untuk keberlanjutan lingkungan serta tanggung jawab sosial.',
    icon: <Sprout className="w-6 h-6 text-white" />,
    color: '#22C55E',
    gradient: 'from-green-500 to-emerald-400',
    stats: [
      { label: 'Projects', value: '15' },
      { label: 'Challenges', value: '10' }
    ]
  },
  {
    id: 'professional',
    title: 'Professional Skills',
    subtitle: 'Keterampilan Profesional',
    description: 'Pengembangan soft skills, leadership, dan kesiapan karir di dunia kerja.',
    icon: <Briefcase className="w-6 h-6 text-white" />,
    color: '#6366F1',
    gradient: 'from-indigo-500 to-blue-400',
    stats: [
      { label: 'Workshops', value: '30' },
      { label: 'Mentors', value: '50+' }
    ]
  }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmad Rizky',
    role: 'Teknik Mesin 2022',
    content: 'PPSDM membantu saya memahami kekuatan dan area pengembangan. Saya bisa fokus pada aspek yang benar-benar penting untuk karir saya.',
    avatar: 'AR',
    rating: 5
  },
  {
    id: '2',
    name: 'Sarah Wijaya',
    role: 'Teknik Elektro 2021',
    content: 'Dashboard holistik sangat membantu tracking progress. Saya bisa melihat perkembangan di semua dimensi secara visual.',
    avatar: 'SW',
    rating: 5
  },
  {
    id: '3',
    name: 'Budi Santoso',
    role: 'Teknik Industri 2023',
    content: 'Assessment yang komprehensif dan actionable insights. Saya tahu persis langkah apa yang harus diambil selanjutnya.',
    avatar: 'BS',
    rating: 5
  }
];

const faqs: FAQ[] = [
  {
    question: 'Apa itu PPSDM KMM?',
    answer: 'PPSDM (Pusat Pengembangan Sumber Daya Mahasiswa) adalah platform komprehensif untuk pengembangan holistik mahasiswa KM ITS meliputi 9 dimensi: Cognitive, Self Management, Emotional, Physical, Spiritual, Character, Financial, Environmental, dan Professional.'
  },
  {
    question: 'Bagaimana cara mengikuti assessment?',
    answer: 'Anda dapat mengakses assessment melalui dashboard setelah login. Setiap dimensi memiliki assessment yang dapat dikerjakan secara mandiri dengan progress yang tersimpan otomatis.'
  },
  {
    question: 'Apakah hasil assessment bersifat rahasia?',
    answer: 'Ya, semua hasil assessment bersifat pribadi dan hanya dapat diakses oleh Anda dan supervisor yang Anda beri izin. Data dienkripsi dan dilindungi.'
  },
  {
    question: 'Berapa lama waktu pengerjaan assessment?',
    answer: 'Setiap dimensi membutuhkan waktu 15-30 menit. Anda dapat mengerjakan secara bertahap dan progress akan tersimpan otomatis.'
  },
  {
    question: 'Apakah ada biaya untuk menggunakan platform ini?',
    answer: 'Tidak, platform PPSDM KMM sepenuhnya gratis untuk seluruh mahasiswa KM ITS sebagai bagian dari program pengembangan karakter.'
  }
];

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Dimensi', href: '#dimensions' },
    { label: 'Metodologi', href: '#methodology' },
    { label: 'Testimoni', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">PPSDM KMM</h1>
              <p className="text-xs text-slate-400">KM ITS</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-300">
              Masuk
            </Button>
            <Button variant="primary" size="sm">
              Mulai Assessment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/98 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-slate-300 hover:text-white py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <Button variant="outline" fullWidth>
                  Masuk
                </Button>
                <Button variant="primary" fullWidth>
                  Mulai Assessment
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const HeroSection: React.FC = () => {
  const stats = [
    { icon: Users, value: '5,000+', label: 'Mahasiswa Aktif' },
    { icon: Target, value: '9', label: 'Dimensi Pengembangan' },
    { icon: Award, value: '50+', label: 'Program Mentoring' },
    { icon: TrendingUp, value: '95%', label: 'Tingkat Kepuasan' }
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">Platform Resmi KM ITS</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Pengembangan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Holistik
              </span>{' '}
              untuk Generasi Emas
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Platform komprehensif untuk mengembangkan 9 dimensi kunci: dari kecerdasan kognitif hingga kesiapan profesional. Bergabung dengan 5,000+ mahasiswa KM ITS yang telah memulai perjalanan transformasi mereka.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Button variant="primary" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Mulai Assessment Gratis
              </Button>
              <Button variant="glass" size="lg" className="gap-2">
                Pelajari Lebih Lanjut
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              
              {/* Mock Dashboard */}
              <div className="relative p-6 bg-slate-800/50 backdrop-blur">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
                
                <div className="h-48 rounded-lg bg-white/5 mb-4 animate-pulse" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 rounded-lg bg-white/5 animate-pulse" />
                  <div className="h-32 rounded-lg bg-white/5 animate-pulse" />
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg"
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 shadow-lg"
              >
                <Award className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-slate-400"
        >
          <span className="text-xs mb-2">Scroll untuk eksplorasi</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const DimensionsSection: React.FC = () => {
  return (
    <section id="dimensions" className="relative py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            9 Dimensi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Pengembangan Holistik
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Framework komprehensif yang dirancang untuk mengembangkan seluruh aspek potensi mahasiswa KM ITS
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dimensions.map((dim) => (
            <motion.div key={dim.id} variants={fadeInUp}>
              <DimensionCard
                icon={
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${dim.gradient}`}>
                    {dim.icon}
                  </div>
                }
                title={`${dim.title} - ${dim.subtitle}`}
                description={dim.description}
                status="not-started"
                onAction={() => console.log(`Start ${dim.id} assessment`)}
                actionLabel="Mulai Assessment"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const MethodologySection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Assessment Komprehensif',
      description: 'Kerjakan 9 dimensi assessment untuk memetakan profil pengembangan Anda secara holistik.',
      icon: Target
    },
    {
      number: '02',
      title: 'Analisis & Insight',
      description: 'Dapatkan analisis mendalam dengan visualisasi data dan rekomendasi personal.',
      icon: Brain
    },
    {
      number: '03',
      title: 'Roadmap Pengembangan',
      description: 'Terima roadmap terukur dengan milestone jelas untuk setiap dimensi.',
      icon: Clock
    },
    {
      number: '04',
      title: 'Aksi & Tracking',
      description: 'Lakukan aksi pengembangan dan tracking progress secara real-time.',
      icon: TrendingUp
    }
  ];

  return (
    <section id="methodology" className="relative py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Metodologi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Terstruktur
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Proses pengembangan yang sistematis dan terukur untuk memastikan pertumbuhan berkelanjutan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10 hover:border-blue-500/50 transition-colors group">
                <div className="text-5xl font-bold text-slate-700 group-hover:text-blue-500/30 transition-colors mb-4">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <step.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="relative py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Apa Kata{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Mereka
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pengalaman mahasiswa KM ITS yang telah menggunakan platform PPSDM
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="h-full">
                <div className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-blue-500/30 mb-4" />
                  
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {testimonial.content}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pertanyaan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Umum
            </span>
          </h2>
          <p className="text-slate-400">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className={`rounded-xl border transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-slate-800/50 border-blue-500/30' 
                    : 'bg-slate-800/30 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Siap untuk Memulai{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              Perjalanan Transformasi
            </span>
            {' '}Anda?
          </h2>
          
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Bergabung dengan 5,000+ mahasiswa KM ITS yang telah memulai pengembangan holistik mereka. Assessment pertama sepenuhnya gratis!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" className="gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Mulai Assessment Sekarang
            </Button>
            <Button variant="glass" size="xl">
              Hubungi Kami
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Gratis Selamanya
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Data Aman & Terenkripsi
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Sertifikat Resmi KM ITS
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">PPSDM KMM</h3>
                <p className="text-xs text-slate-400">KM ITS</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Platform pengembangan holistik untuk mahasiswa KM ITS. 
              Mengembangkan 9 dimensi kunci untuk kesuksesan akademik dan profesional.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Assessment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2024 PPSDM KMM - KM ITS. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>in Surabaya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const NewLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <main id="main-content">
        <HeroSection />
        <DimensionsSection />
        <MethodologySection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default NewLandingPage;
