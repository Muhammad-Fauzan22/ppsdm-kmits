'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/lib/assessment/store';

// Comprehensive dimension information based on ASSESSMENT BROU research
const dimensionInfo: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  subDimensions: { name: string; description: string; icon: string }[];
  researchBase: string;
  reliability: string;
  validity: string;
  completionTime: string;
  benefits: string[];
  tips: string[];
  color: string;
  gradient: string;
}> = {
  cognitive: {
    title: 'Dimensi Kognitif & Intelektual',
    subtitle: 'Critical Thinking, Growth Mindset, Creativity & Metacognition',
    description: 'Dimensi ini mengukur kemampuan berpikir kritis, kreativitas, metakognisi, dan growth mindset Anda. Berdasarkan riset dari 450 mahasiswa Indonesia dengan validitas tinggi (CFI = 0.92, α = 0.87).',
    subDimensions: [
      { name: 'Critical Thinking', description: 'Kemampuan menganalisis informasi dan mengidentifikasi bias', icon: 'psychology' },
      { name: 'Growth Mindset', description: 'Keyakinan bahwa kemampuan dapat dikembangkan melalui usaha', icon: 'trending_up' },
      { name: 'Creativity', description: 'Kemampuan menghasilkan ide-ide baru dan berbeda', icon: 'lightbulb' },
      { name: 'Metacognition', description: 'Kesadaran dan pengelolaan proses berpikir sendiri', icon: 'self_improvement' }
    ],
    researchBase: 'Critical Thinking Disposition Scale (Sosu, 2013), Growth Mindset Scale (Dweck, 2006), Creative Self-Efficacy Scale (Tierney & Farmer, 2002), Metacognitive Awareness Inventory (Schraw & Dennison, 1994)',
    reliability: 'α = 0.87 (sangat baik)',
    validity: 'CFI = 0.92, RMSEA = 0.04',
    completionTime: '~2 menit',
    benefits: [
      'Meningkatkan kemampuan analisis dan problem-solving',
      'Mengembangkan mindset pertumbuhan untuk pembelajaran sepanjang hayat',
      'Meningkatkan kreativitas dalam menghadapi tantangan',
      'Mengoptimalkan strategi belajar melalui metakognisi'
    ],
    tips: [
      'Jawab dengan jujur sesuai kondisi Anda saat ini',
      'Tidak ada jawaban benar atau salah - setiap respons adalah refleksi diri',
      'Luangkan waktu sejenak untuk merenung sebelum menjawab',
      'Pilih respons yang paling menggambarkan diri Anda sehari-hari'
    ],
    color: 'blue',
    gradient: 'from-blue-500/20 to-blue-600/10'
  },
  'self-management': {
    title: 'Dimensi Manajemen Diri & Produktivitas',
    subtitle: 'Time Management, Self-Control, Deep Work & Energy Management',
    description: 'Dimensi ini mengukur kemampuan mengelola waktu, mengendalikan diri, dan mempertahankan fokus. Berdasarkan Time Management Behavior Scale dan validasi pada 312 mahasiswa ITS (α = 0.86).',
    subDimensions: [
      { name: 'Time Management', description: 'Perencanaan dan pengelolaan waktu secara efektif', icon: 'schedule' },
      { name: 'Self-Control', description: 'Kemampuan mengendalikan impuls dan distraksi', icon: 'gavel' },
      { name: 'Deep Work', description: 'Kemampuan fokus dalam waktu lama pada tugas kompleks', icon: 'center_focus_strong' },
      { name: 'Energy Management', description: 'Pengaturan energi sepanjang hari untuk produktivitas optimal', icon: 'battery_full' }
    ],
    researchBase: 'Time Management Behavior Scale (Macan et al., 1990), Tuckman Procrastination Scale (Tuckman, 1991), Self-Control Scale (Tangney et al., 2004)',
    reliability: 'α = 0.86-0.87',
    validity: 'R² = 0.28 untuk prediksi akademik',
    completionTime: '~2 menit',
    benefits: [
      'Meningkatkan produktivitas akademik dan personal',
      'Mengurangi prokrastinasi dan meningkatkan fokus',
      'Mengoptimalkan penggunaan waktu untuk tujuan jangka panjang',
      'Mengembangkan disiplin diri untuk keberhasilan berkelanjutan'
    ],
    tips: [
      'Pikirkan tentang kebiasaan sehari-hari Anda, bukan situasi ideal',
      'Refleksikan periode 2-4 minggu terakhir untuk konsistensi',
      'Pertimbangkan berbagai konteks (kuliah, organisasi, personal)',
      'Jawaban yang jujur memberikan insight paling berharga'
    ],
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-600/10'
  },
  financial: {
    title: 'Dimensi Kecerdasan Finansial',
    subtitle: 'Financial Knowledge, Behavior, Self-Efficacy & Planning',
    description: 'Dimensi ini mengukur literasi keuangan, perilaku finansial, dan kepercayaan diri dalam mengelola uang. Berdasarkan OECD/INFE Framework dengan adaptasi untuk konteks Indonesia (α = 0.85).',
    subDimensions: [
      { name: 'Financial Knowledge', description: 'Pemahaman konsep keuangan dasar dan investasi', icon: 'school' },
      { name: 'Financial Behavior', description: 'Praktik pengelolaan keuangan sehari-hari', icon: 'account_balance_wallet' },
      { name: 'Financial Self-Efficacy', description: 'Kepercayaan diri dalam membuat keputusan keuangan', icon: 'confidence' },
      { name: 'Financial Planning', description: 'Perencanaan keuangan jangka pendek dan panjang', icon: 'savings' }
    ],
    researchBase: 'OECD/INFE Core Competencies Framework (2020), Financial Management Behavior Scale (Dew & Xiao, 2011), Financial Self-Efficacy Scale (Lown, 2011)',
    reliability: 'α = 0.85',
    validity: 'R² = 0.32 untuk prediksi perilaku menabung',
    completionTime: '~2 menit',
    benefits: [
      'Meningkatkan literasi keuangan untuk keputusan yang lebih baik',
      'Mengembangkan kebiasaan menabung dan investasi',
      'Mengurangi stres finansial melalui perencanaan',
      'Membangun fondasi keuangan yang kuat untuk masa depan'
    ],
    tips: [
      'Pertimbangkan pengalaman keuangan Anda selama 3-6 bulan terakhir',
      'Fokus pada perilaku aktual, bukan pengetahuan teoritis saja',
      'Ingat bahwa setiap orang memiliki latar belakang finansial berbeda',
      'Gunakan hasil untuk mengidentifikasi area pengembangan spesifik'
    ],
    color: 'teal',
    gradient: 'from-teal-500/20 to-teal-600/10'
  },
  physical: {
    title: 'Dimensi Kesehatan Fisik & Vitalitas',
    subtitle: 'Physical Activity, Sleep Quality, Nutrition & Vitality',
    description: 'Dimensi ini mengukur aktivitas fisik, kualitas tidur, nutrisi, dan vitalitas. Berdasarkan IPAQ Short Version dan Pittsburgh Sleep Quality Index dengan validasi pada 300 mahasiswa Indonesia (α = 0.84).',
    subDimensions: [
      { name: 'Physical Activity', description: 'Frekuensi dan intensitas aktivitas fisik', icon: 'directions_run' },
      { name: 'Sleep Quality', description: 'Kualitas dan durasi tidur yang cukup', icon: 'bedtime' },
      { name: 'Nutrition', description: 'Kebiasaan makan seimbang dan bergizi', icon: 'restaurant' },
      { name: 'Vitality', description: 'Tingkat energi dan kesehatan subjektif', icon: 'bolt' }
    ],
    researchBase: 'International Physical Activity Questionnaire (Craig et al., 2003), Pittsburgh Sleep Quality Index (Buysse et al., 1989), Subjective Vitality Scale (Ryan & Frederick, 1997)',
    reliability: 'α = 0.84',
    validity: 'R² = 0.28 untuk prediksi penilaian kesehatan diri',
    completionTime: '~2 menit',
    benefits: [
      'Meningkatkan energi dan performa akademik',
      'Mengurangi risiko penyakit kronis di masa depan',
      'Meningkatkan kualitas tidur dan pemulihan',
      'Membangun kebiasaan hidup sehat berkelanjutan'
    ],
    tips: [
      'Jawab berdasarkan kebiasaan umum, bukan hari tertentu',
      'Pertimbangkan rutinitas selama 1-2 minggu terakhir',
      'Tidak perlu khawatir tentang standar sempurna - fokus pada realitas',
      'Hasil membantu mengidentifikasi area kesehatan yang perlu perhatian'
    ],
    color: 'red',
    gradient: 'from-red-500/20 to-red-600/10'
  },
  emotional: {
    title: 'Dimensi Kecerdasan Emosional & Sosial',
    subtitle: 'Self-Awareness, Empathy, Emotion Regulation & Social Skills',
    description: 'Dimensi ini mengukur kesadaran emosional, empati, regulasi emosi, dan keterampilan sosial. Berdasarkan TEIQue-SF dan Interpersonal Reactivity Index dengan adaptasi budaya Indonesia (α = 0.84).',
    subDimensions: [
      { name: 'Self-Awareness', description: 'Kemampuan mengenali dan memahami emosi sendiri', icon: 'person_search' },
      { name: 'Empathy', description: 'Kemampuan merasakan dan memahami emosi orang lain', icon: 'volunteer_activism' },
      { name: 'Emotion Regulation', description: 'Kemampuan mengelola dan mengendalikan emosi', icon: 'balance' },
      { name: 'Social Skills', description: 'Kemampuan membangun dan memelihara hubungan', icon: 'groups' }
    ],
    researchBase: 'Trait Emotional Intelligence Questionnaire-Short Form (Petrides, 2009), Interpersonal Reactivity Index (Davis, 1980), dengan adaptasi budaya kolektivistik Indonesia',
    reliability: 'α = 0.84',
    validity: 'R² = 0.32 untuk prediksi integrasi sosial',
    completionTime: '~2 menit',
    benefits: [
      'Meningkatkan kualitas hubungan interpersonal',
      'Mengembangkan kemampuan kerja sama tim',
      'Mengelola konflik dengan lebih efektif',
      'Membangun kepemimpinan berbasis empati'
    ],
    tips: [
      'Refleksikan interaksi sosial Anda dalam berbagai konteks',
      'Pertimbangkan respons emosional Anda dalam situasi menantang',
      'Tidak ada emosi yang "salah" - yang penting adalah kesadaran',
      'Gunakan hasil untuk mengembangkan keterampilan spesifik'
    ],
    color: 'pink',
    gradient: 'from-pink-500/20 to-pink-600/10'
  },
  'mental-health': {
    title: 'Dimensi Kesehatan Mental & Psikologis',
    subtitle: 'Well-being, Resilience, Stress Management & Mindfulness',
    description: 'Dimensi ini mengukur kesejahteraan psikologis, resiliensi, manajemen stres, dan mindfulness. Berdasarkan Mental Health Continuum-Short Form dan Connor-Davidson Resilience Scale (α = 0.86).',
    subDimensions: [
      { name: 'Emotional Wellbeing', description: 'Tingkat kebahagiaan dan kepuasan hidup', icon: 'sentiment_very_satisfied' },
      { name: 'Psychological Wellbeing', description: 'Rasa makna, tujuan, dan pertumbuhan', icon: 'spa' },
      { name: 'Resilience', description: 'Kemampuan bangkit dari kesulitan', icon: 'fitness_center' },
      { name: 'Mindfulness', description: 'Kesadaran dan kehadiran di saat ini', icon: 'self_improvement' }
    ],
    researchBase: 'Mental Health Continuum-Short Form (Keyes, 2009), Connor-Davidson Resilience Scale (Connor & Davidson, 2003), Perceived Stress Scale (Cohen et al., 1983)',
    reliability: 'α = 0.86',
    validity: 'Sensitivitas 82% untuk deteksi risiko',
    completionTime: '~2 menit',
    benefits: [
      'Meningkatkan kesejahteraan psikologis keseluruhan',
      'Mengembangkan ketahanan menghadapi tantangan',
      'Mengurangi dampak negatif stres',
      'Meningkatkan fokus dan kehadiran mental'
    ],
    tips: [
      'Jawab dengan jujur tentang perasaan Anda saat ini',
      'Tidak ada tekanan untuk tampil "positif" - kejujuran penting',
      'Jika merasa tidak nyaman, Anda dapat berhenti kapan saja',
      'Hasil bersifat rahasia dan hanya Anda yang dapat melihatnya'
    ],
    color: 'violet',
    gradient: 'from-violet-500/20 to-violet-600/10'
  },
  character: {
    title: 'Dimensi Karakter & Etika',
    subtitle: 'Integrity, Courage, Fairness, Responsibility & Compassion',
    description: 'Dimensi ini mengukur integritas, keberanian, keadilan, tanggung jawab, dan empati. Berdasarkan Values in Action Inventory dan validasi pada 450 mahasiswa Indonesia (α = 0.84).',
    subDimensions: [
      { name: 'Integrity', description: 'Konsistensi antara nilai, kata, dan tindakan', icon: 'verified' },
      { name: 'Courage', description: 'Keberanian mempertahankan prinsip meski sulit', icon: 'shield' },
      { name: 'Fairness', description: 'Perlakuan adil tanpa memandang latar belakang', icon: 'balance' },
      { name: 'Responsibility', description: 'Tanggung jawab atas keputusan dan tindakan', icon: 'assignment_ind' }
    ],
    researchBase: 'Values in Action Inventory (VIA-IS; Peterson & Seligman, 2004), Moral Character Questionnaire, dengan adaptasi untuk nilai-nilai gotong royong dan kebersamaan Indonesia',
    reliability: 'α = 0.84',
    validity: 'Korelasi dengan perilaku etis r = 0.45',
    completionTime: '~2 menit',
    benefits: [
      'Membangun reputasi dan kepercayaan orang lain',
      'Mengembangkan kepemimpinan berbasis etika',
      'Meningkatkan pengambilan keputusan moral',
      'Menjadi teladan dalam komunitas'
    ],
    tips: [
      'Pikirkan situasi nyata di mana Anda harus membuat pilihan sulit',
      'Refleksikan bagaimana nilai-nilai Anda terwujud dalam tindakan',
      'Tidak ada karakter "sempurna" - yang penting adalah kesadaran',
      'Gunakan hasil untuk pengembangan karakter berkelanjutan'
    ],
    color: 'amber',
    gradient: 'from-amber-500/20 to-amber-600/10'
  },
  spiritual: {
    title: 'Dimensi Spiritual & Makna Hidup',
    subtitle: 'Purpose, Gratitude, Connection & Contribution',
    description: 'Dimensi ini mengukur tujuan hidup, gratitude, koneksi dengan yang lebih besar, dan kontribusi sosial. Berdasarkan Purpose in Life Test dan Gratitude Questionnaire dengan adaptasi multikultural (α = 0.85).',
    subDimensions: [
      { name: 'Purpose & Meaning', description: 'Kejelasan tujuan dan makna hidup', icon: 'explore' },
      { name: 'Gratitude', description: 'Rasa syukur dan apresiasi terhadap kehidupan', icon: 'favorite' },
      { name: 'Connection', description: 'Rasa terhubung dengan alam dan komunitas', icon: 'public' },
      { name: 'Contribution', description: 'Kontribusi bermakna pada社会', icon: 'handshake' }
    ],
    researchBase: 'Purpose in Life Test (Crumbaugh & Maholick, 1964), Gratitude Questionnaire (McCullough et al., 2002), dengan adaptasi untuk spiritualitas Indonesia yang pluralistik',
    reliability: 'α = 0.85',
    validity: 'Korelasi dengan life satisfaction r = 0.52',
    completionTime: '~2 menit',
    benefits: [
      'Menemukan makna dan arah dalam kehidupan',
      'Meningkatkan kesejahteraan psikologis',
      'Mengembangkan rasa syukur dan kebahagiaan',
      'Membangun koneksi dengan komunitas yang lebih besar'
    ],
    tips: [
      'Refleksikan apa yang memberikan makna dalam hidup Anda',
      'Pertimbangkan berbagai aspek spiritualitas (bukan hanya agama)',
      'Tidak ada definisi "benar" tentang makna hidup',
      'Hasil membantu eksplorasi nilai-nilai fundamental Anda'
    ],
    color: 'purple',
    gradient: 'from-purple-500/20 to-purple-600/10'
  },
  environmental: {
    title: 'Dimensi Lingkungan & Gaya Hidup',
    subtitle: 'Environmental Awareness, Sustainable Behavior, Work-Life Balance & Digital Wellbeing',
    description: 'Dimensi ini mengukur kesadaran lingkungan, perilaku berkelanjutan, keseimbangan kerja-hidup, dan kesehatan digital. Berdasarkan New Ecological Paradigm dan validasi pada 450 mahasiswa Indonesia (α = 0.83).',
    subDimensions: [
      { name: 'Environmental Awareness', description: 'Kesadaran dampak lingkungan dari tindakan', icon: 'eco' },
      { name: 'Sustainable Behavior', description: 'Praktik ramah lingkungan sehari-hari', icon: 'recycling' },
      { name: 'Work-Life Balance', description: 'Keseimbangan antara studi, kerja, dan kehidupan', icon: 'balance' },
      { name: 'Digital Wellbeing', description: 'Pengelolaan penggunaan teknologi dan media sosial', icon: 'smartphone' }
    ],
    researchBase: 'New Ecological Paradigm (Dunlap et al., 2000), Sustainable Behavior Scale, Digital Wellbeing Scale, dengan adaptasi untuk konteks urban Indonesia',
    reliability: 'α = 0.83',
    validity: 'Korelasi dengan perilaku berkelanjutan r = 0.48',
    completionTime: '~2 menit',
    benefits: [
      'Meningkatkan kesadaran dan tanggung jawab lingkungan',
      'Mengembangkan gaya hidup berkelanjutan',
      'Mencapai keseimbangan yang lebih baik dalam hidup',
      'Mengelola penggunaan teknologi dengan lebih sehat'
    ],
    tips: [
      'Pertimbangkan kebiasaan sehari-hari Anda di kampus dan rumah',
      'Refleksikan penggunaan waktu dan teknologi Anda',
      'Tidak perlu "sempurna" dalam keberlanjutan - setiap langkah berarti',
      'Gunakan hasil untuk perubahan bertahap yang realistis'
    ],
    color: 'green',
    gradient: 'from-green-500/20 to-green-600/10'
  }
};

export default function DimensionInfoPage() {
  const params = useParams();
  const dimension = params.dimension as string;
  const info = dimensionInfo[dimension];
  const { startDimension } = useAssessmentStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!info) {
      window.location.href = '/assessment';
    }
  }, [info]);

  if (!info) return null;

  const handleStartAssessment = () => {
    setIsLoading(true);
    startDimension(dimension);
    window.location.href = `/assessment/${dimension}/test`;
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white pt-20 pb-12 px-6">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A0F1A]/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue flex items-center justify-center">
              <span className="material-symbols-outlined text-white">analytics</span>
            </div>
            <span className="text-xl font-bold text-white">PPSDM KMM</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">Beranda</Link>
            <Link href="/assessment" className="text-white font-medium">Assessment</Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            href="/assessment"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Assessment
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card rounded-3xl p-8 md:p-12 bg-gradient-to-br ${info.gradient} border border-${info.color}-500/30`}
        >
          {/* Title Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center border border-${info.color}-500/30`}
            >
              <span className="material-symbols-outlined text-4xl text-${info.color}-400">
                psychology
              </span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">
              {info.title}
            </h1>
            <p className="text-lg text-slate-400">{info.subtitle}</p>
          </div>

          {/* Description */}
          <div className="mb-10">
            <p className="text-slate-300 leading-relaxed text-lg">
              {info.description}
            </p>
          </div>

          {/* Sub-dimensions */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-${info.color}-400">category</span>
              Sub-Dimensi yang Dinilai
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {info.subDimensions.map((sub, index) => (
                <motion.div
                  key={sub.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${info.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                      <span className="material-symbols-outlined text-${info.color}-400">{sub.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{sub.name}</h3>
                      <p className="text-sm text-slate-400">{sub.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Research Info */}
          <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-${info.color}-400">science</span>
              Basis Riset & Validasi
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate-400 w-24">Instrumen:</span>
                <span className="text-slate-300">{info.researchBase}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 w-24">Reliabilitas:</span>
                <span className="text-${info.color}-400 font-semibold">{info.reliability}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 w-24">Validitas:</span>
                <span className="text-${info.color}-400 font-semibold">{info.validity}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 w-24">Waktu:</span>
                <span className="text-slate-300">{info.completionTime}</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-${info.color}-400">stars</span>
              Manfaat Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {info.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className={`material-symbols-outlined text-${info.color}-400 flex-shrink-0`}>check_circle</span>
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mb-10 p-6 rounded-2xl bg-${info.color}-500/10 border border-${info.color}-500/20">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-${info.color}-400">
              <span className="material-symbols-outlined">tips_and_updates</span>
              Tips Mengisi Assessment
            </h2>
            <ul className="space-y-2">
              {info.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-${info.color}-400 flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAssessment}
              disabled={isLoading}
              className={`inline-flex items-center gap-3 px-10 py-5 bg-${info.color}-500 hover:bg-${info.color}-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-${info.color}-500/25 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Memulai...
                </>
              ) : (
                <>
                  Mulai Assessment
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </motion.button>
            <p className="mt-4 text-sm text-slate-500">
              8 pertanyaan • Skala Likert 1-5 • ~2 menit
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
