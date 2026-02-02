'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAssessmentStore } from '@/lib/assessment/store';

// Dimension metadata
const DIMENSION_METADATA: Record<string, {
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  reliability: number;
  validity: { cfi: number; rmsea: number };
  subDimensions: { name: string; description: string; weight: number }[];
  researchBasis: string[];
  whatIsMeasured: string[];
}> = {
  cognitive: {
    name: 'Kognitif',
    nameEn: 'Cognitive Development',
    icon: 'psychology',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Kemampuan berpikir kritis, mindset berkembang, kreativitas, dan kesadaran metakognitif untuk pengambilan keputusan yang efektif.',
    reliability: 0.87,
    validity: { cfi: 0.92, rmsea: 0.05 },
    subDimensions: [
      { name: 'Critical Thinking', description: 'Analisis dan evaluasi informasi', weight: 1.2 },
      { name: 'Growth Mindset', description: 'Keyakinan bahwa kemampuan bisa dikembangkan', weight: 1.0 },
      { name: 'Creativity', description: 'Kemampuan menghasilkan ide baru', weight: 1.1 },
      { name: 'Metacognition', description: 'Kesadaran dan regulasi proses berpikir', weight: 1.3 },
    ],
    researchBasis: [
      'Sosu (2013) - Critical Thinking dispositions Scale (CTDS)',
      'Dweck (2006) - Growth Mindset Scale (GMS)',
      'Morrison & O\'Connor (2005) - Expectancy Scale',
    ],
    whatIsMeasured: [
      'Kemampuan menganalisis informasi secara sistematis',
      'Kepercayaan bahwa kemampuan bisa dikembangkan',
      'Kreativitas dalam penyelesaian masalah',
      'Kesadaran terhadap proses berpikir sendiri',
    ],
  },
  'self-management': {
    name: 'Manajemen Diri',
    nameEn: 'Self-Management',
    icon: 'schedule',
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Kemampuan mengelola waktu, mengendalikan prokrastinasi, dan mencapai deep work untuk produktivitas optimal.',
    reliability: 0.87,
    validity: { cfi: 0.91, rmsea: 0.06 },
    subDimensions: [
      { name: 'Time Management', description: 'Pengelolaan waktu efektif', weight: 1.3 },
      { name: 'Procrastination Control', description: 'Pengendalian penundaan', weight: 1.4 },
      { name: 'Self-Control', description: 'Disiplin dan pengendalian diri', weight: 1.2 },
      { name: 'Deep Work', description: 'Fokus dalam pekerjaan intensif', weight: 1.4 },
      { name: 'Energy Management', description: 'Pengelolaan energi sepanjang hari', weight: 1.1 },
    ],
    researchBasis: [
      'Macan (1990) - Time Management Behavior (TMBS)',
      'Tuckman (1991) - Procrastination Scale (TPS)',
      'Tangney (2004) - Brief Self-Control Scale (BSCS)',
    ],
    whatIsMeasured: [
      'Kemampuan mengatur dan memanfaatkan waktu',
      'Pengendalian dorongan untuk menunda',
      'Disiplin dalam menyelesaikan tugas',
      'Kemampuan fokus dalam waktu lama',
    ],
  },
  financial: {
    name: 'Finansial',
    nameEn: 'Financial Intelligence',
    icon: 'account_balance_wallet',
    color: 'teal',
    gradient: 'from-teal-500 to-teal-600',
    description: 'Literasi keuangan, perilaku finansial, dan kepercayaan diri dalam pengambilan keputusan keuangan.',
    reliability: 0.85,
    validity: { cfi: 0.90, rmsea: 0.06 },
    subDimensions: [
      { name: 'Financial Knowledge', description: 'Pengetahuan keuangan dasar', weight: 0.4 },
      { name: 'Financial Behavior', description: 'Perilaku pengelolaan keuangan', weight: 0.5 },
      { name: 'Financial Self-Efficacy', description: 'Kepercayaan diri finansial', weight: 0.1 },
    ],
    researchBasis: [
      'OECD/INFE (2011) - Financial Literacy Questionnaire',
      'Dew & Xiao (2011) - Financial Management Scale (FMS)',
      'Lown (2011) - Financial Self-Efficacy Scale',
    ],
    whatIsMeasured: [
      'Pemahaman konsep keuangan dasar',
      'Kebiasaan pengelolaan keuangan',
      'Kepercayaan dalam membuat keputusan finansial',
      'Kemampuan menangani situasi keuangan darurat',
    ],
  },
  physical: {
    name: 'Kesehatan Fisik',
    nameEn: 'Physical Health',
    icon: 'favorite',
    color: 'red',
    gradient: 'from-red-500 to-red-600',
    description: 'Aktivitas fisik, kualitas tidur, nutrisi, dan vitalitas untuk kesejahteraan fisik optimal.',
    reliability: 0.84,
    validity: { cfi: 0.89, rmsea: 0.07 },
    subDimensions: [
      { name: 'Physical Activity', description: 'Aktivitas fisik rutin', weight: 1.3 },
      { name: 'Sleep Quality', description: 'Kualitas tidur', weight: 1.4 },
      { name: 'Nutrition', description: 'Pola makan seimbang', weight: 1.2 },
      { name: 'Vitality', description: 'Tingkat energi harian', weight: 1.1 },
    ],
    researchBasis: [
      'Craig (2003) - IPAQ (Physical Activity)',
      'Buysse (1989) - PSQI (Sleep Quality)',
      'Ryan (1997) - Vitality Scale (SVS)',
    ],
    whatIsMeasured: [
      'Frekuensi dan intensitas aktivitas fisik',
      'Durasi dan kualitas tidur',
      'Pola makan dan nutrisi',
      'Tingkat energi dan vitalitas harian',
    ],
  },
  emotional: {
    name: 'Emosional',
    nameEn: 'Emotional Intelligence',
    icon: 'sentiment_satisfied',
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    description: 'Kecerdasan emosional meliputi kesadaran diri, empati, regulasi emosi, dan keterampilan sosial.',
    reliability: 0.84,
    validity: { cfi: 0.90, rmsea: 0.06 },
    subDimensions: [
      { name: 'Self-Awareness', description: 'Kesadaran emosi diri', weight: 1.3 },
      { name: 'Empathy', description: 'Kemampuan berempati', weight: 1.4 },
      { name: 'Emotion Regulation', description: 'Pengendalian emosi', weight: 1.4 },
      { name: 'Social Skills', description: 'Keterampilan sosial', weight: 1.2 },
    ],
    researchBasis: [
      'Petrides (2009) - TEIQue-SF',
      'Davis (1980) - Interpersonal Reactivity Index (IRI)',
      'Riggio (1986) - Social Skills Inventory (SSI)',
    ],
    whatIsMeasured: [
      'Kemampuan mengidentifikasi emosi sendiri',
      'Kepekaan terhadap emosi orang lain',
      'Kemampuan mengendalikan respons emosional',
      'Efektivitas dalam interaksi sosial',
    ],
  },
  'mental-health': {
    name: 'Kesehatan Mental',
    nameEn: 'Mental Health',
    icon: 'self_improvement',
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
    description: 'Well-being subjektif, resiliensi, manajemen stres, dan kepuasan hidup.',
    reliability: 0.86,
    validity: { cfi: 0.93, rmsea: 0.05 },
    subDimensions: [
      { name: 'Emotional Wellbeing', description: 'Kesejahteraan emosional', weight: 1.2 },
      { name: 'Resilience', description: 'Ketahanan terhadap kesulitan', weight: 1.4 },
      { name: 'Stress Management', description: 'Manajemen stres', weight: 1.5 },
      { name: 'Life Satisfaction', description: 'Kepuasan hidup', weight: 1.3 },
    ],
    researchBasis: [
      'Keyes (2009) - MHC-SF (Mental Health Continuum)',
      'Connor (2003) - CD-RISC-10 (Resilience)',
      'Cohen (1983) - PSS-4 (Perceived Stress)',
    ],
    whatIsMeasured: [
      'Perasaan bahagia dan puas dengan hidup',
      'Kemampuan bangkit dari kegagalan',
      'Tingkat stres yang dialami',
      'Kepuasan terhadap berbagai aspek hidup',
    ],
  },
  character: {
    name: 'Karakter',
    nameEn: 'Character & Ethics',
    icon: 'security',
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
    description: 'Integritas, keberanian, keadilan, tanggung jawab, dan penalaran etis.',
    reliability: 0.84,
    validity: { cfi: 0.91, rmsea: 0.06 },
    subDimensions: [
      { name: 'Integrity', description: 'Kejujuran dan integritas', weight: 1.4 },
      { name: 'Courage', description: 'Keberanian untuk bertindak benar', weight: 1.3 },
      { name: 'Fairness', description: 'Keadilan dalam bertindak', weight: 1.2 },
      { name: 'Responsibility', description: 'Tanggung jawab atas tindakan', weight: 1.2 },
    ],
    researchBasis: [
      'Peterson (2004) - VIA-IS (Values in Action)',
      'Haidt (2007) - Moral Foundations Questionnaire (MFQ)',
      'Kish-Gephart (2010) - Integrity Scale',
    ],
    whatIsMeasured: [
      'Kejujuran dan konsistensi antara kata dan deeds',
      'Keberanian untuk mempertahankan prinsip',
      'Keadilan dalam memperlakukan orang lain',
      'Tanggung jawab atas keputusan dan actions',
    ],
  },
  spiritual: {
    name: 'Spiritual',
    nameEn: 'Spiritual Development',
    icon: 'spa',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Makna hidup, rasa syukur, koneksi spiritual, dan kontribusi pada komunitas.',
    reliability: 0.85,
    validity: { cfi: 0.92, rmsea: 0.05 },
    subDimensions: [
      { name: 'Purpose & Meaning', description: 'Tujuan dan makna hidup', weight: 1.4 },
      { name: 'Gratitude', description: 'Rasa syukur', weight: 1.3 },
      { name: 'Connection', description: 'Koneksi dengan yang lebih besar', weight: 1.2 },
      { name: 'Altruism', description: 'Altruisme dan kontribusi', weight: 1.2 },
    ],
    researchBasis: [
      'Crumbaugh (1968) - Purpose in Life (PIL)',
      'McCullough (2002) - Gratitude Questionnaire (GQ-6)',
      'Paloutzian (1982) - SWBS (Spiritual Wellbeing)',
    ],
    whatIsMeasured: [
      'Kejelasan tujuan hidup dan makna',
      'Rasa syukur terhadap kehidupan',
      'Koneksi dengan alam dan komunitas',
      'Kegiatan bermakna untuk membantu lain',
    ],
  },
  environmental: {
    name: 'Lingkungan',
    nameEn: 'Environmental & Lifestyle',
    icon: 'eco',
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    description: 'Kesadaran lingkungan, perilaku berkelanjutan, dan keseimbangan hidup.',
    reliability: 0.83,
    validity: { cfi: 0.88, rmsea: 0.07 },
    subDimensions: [
      { name: 'Environmental Awareness', description: 'Kesadaran lingkungan', weight: 1.0 },
      { name: 'Sustainable Behavior', description: 'Perilaku berkelanjutan', weight: 1.1 },
      { name: 'Work-Life Balance', description: 'Keseimbangan hidup', weight: 1.2 },
      { name: 'Digital Wellbeing', description: 'Keseimbangan digital', weight: 1.2 },
    ],
    researchBasis: [
      'Dunlap (2000) - New Ecological Paradigm (NEP)',
      'Vanden Abeele (2020) - SLS (Smartphone Lifestyle)',
    ],
    whatIsMeasured: [
      'Kesadaran akan isu-isu lingkungan',
      'Perilaku ramah lingkungan sehari-hari',
      'Keseimbangan antara kerja/studi dan hidup',
      'Penggunaan teknologi yang sehat',
    ],
  },
};

interface DimensionInfoPageProps {
  dimensionId: string;
  onStart: () => void;
}

export function DimensionInfoPage({ dimensionId, onStart }: DimensionInfoPageProps) {
  const router = useRouter();
  const dim = DIMENSION_METADATA[dimensionId];
  const progress = useAssessmentStore((state) => 
    state.dimensions[dimensionId]?.status === 'completed' ? 100 : 0
  );
  
  if (!dim) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] text-white flex items-center justify-center">
        <p>Dimensi tidak ditemukan</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button 
            onClick={() => router.push('/assessment')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </button>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#135bec] to-[#00d4ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-slate-400">{progress > 0 ? 'Selesai' : 'Belum Dimulai'}</span>
        </motion.div>
        
        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dim.gradient} flex items-center justify-center shadow-lg`}>
              <span className="material-symbols-outlined text-3xl">{dim.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{dim.name}</h1>
              <p className="text-slate-400">{dim.nameEn}</p>
            </div>
          </div>
          
          {/* Research Badge */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm">Cronbach&apos;s α = {dim.reliability}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📊</span>
              <span className="text-sm">n = 450</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🔬</span>
              <span className="text-sm">CFI = {dim.validity.cfi}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">📐</span>
              <span className="text-sm">RMSEA = {dim.validity.rmsea}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-slate-300 leading-relaxed mb-6">
            {dim.description}
          </p>
          
          {/* What is Measured */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-slate-400">Apa yang akan diukur:</h3>
            <ul className="space-y-2">
              {dim.whatIsMeasured.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-brand-accent mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Sub-dimensions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-slate-400">Sub-dimensi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dim.subDimensions.map((sub, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-semibold mb-1">{sub.name}</h4>
                  <p className="text-xs text-slate-400">{sub.description}</p>
                  <span className="text-xs text-slate-500 mt-2 block">Bobot: {sub.weight}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sources */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-3 text-slate-400">Berdasarkan Penelitian:</h3>
            <ul className="text-xs text-slate-500 space-y-1">
              {dim.researchBasis.map((source, i) => (
                <li key={i}>• {source}</li>
              ))}
            </ul>
          </div>
          
          {/* CTA */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined">schedule</span>
              ~2 menit
            </span>
            <button
              onClick={onStart}
              className="px-8 py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              Mulai Assessment
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DimensionInfoPage;