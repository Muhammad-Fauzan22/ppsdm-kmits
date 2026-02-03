/**
 * Halaman Gap Analysis
 * 
 * Analisis kelemahan dan area pengembangan
 * Berdasarkan 9 dimensi assessment dengan konten riset lengkap
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Brain,
  Clock,
  Wallet,
  Heart,
  Users,
  Sparkles,
  Shield,
  Sun,
  Leaf,
  AlertTriangle,
  TrendingDown,
  Target,
  Zap,
  Play,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  SortAsc,
  Lightbulb,
  Calendar,
  Clock as ClockIcon
} from 'lucide-react';

// Mock data untuk gap analysis
const mockGapAnalysis = {
  summary: {
    totalDimensions: 9,
    criticalGaps: 2,
    moderateGaps: 3,
    minorGaps: 2,
    noGaps: 2,
    overallGapScore: 42.3,
    priorityLevel: 'HIGH'
  },
  gaps: [
    {
      id: 1,
      dimension: 'Kecerdasan Finansial',
      icon: Wallet,
      color: '#F59E0B',
      currentScore: 52.3,
      targetScore: 75,
      gap: 22.7,
      gapLevel: 'CRITICAL',
      gapPercentage: 30.3,
      subdimensionGaps: [
        { name: 'Financial Self-Efficacy', current: 46.2, target: 75, gap: 28.8, impact: 'HIGH' },
        { name: 'Financial Behavior', current: 52.3, target: 75, gap: 22.7, impact: 'HIGH' },
        { name: 'Financial Knowledge', current: 58.4, target: 75, gap: 16.6, impact: 'MEDIUM' }
      ],
      rootCauses: [
        'Kurangnya pendidikan finansial formal',
        'Tidak ada sistem budgeting yang konsisten',
        'Kurangnya exposure terhadap produk investasi',
        'Mindset konsumtif yang masih dominan'
      ],
      consequences: [
        'Risiko finansial di masa depan',
        'Kesulitan mencapai tujuan finansial',
        'Potensi terjebak dalam hutang konsumtif',
        'Kurangnya persiapan untuk dana darurat'
      ],
      recommendations: [
        'Ikuti kelas "Financial Literacy for Students" di ITS',
        'Buat anggaran bulanan dan catat pengeluaran',
        'Mulai investasi dengan reksadana pasar uang',
        'Gunakan aplikasi tracking keuangan'
      ],
      resources: [
        { type: 'course', title: 'Financial Literacy 101', provider: 'ITS', duration: '8 minggu' },
        { type: 'article', title: 'Panduan Budgeting untuk Mahasiswa', provider: 'PPSDM', duration: '15 menit' },
        { type: 'video', title: 'Investasi untuk Pemula', provider: 'OJK', duration: '30 menit' },
        { type: 'tool', title: 'Aplikasi Budgeting', provider: 'PPSDM', duration: 'Akses segera' }
      ],
      timeline: [
        { week: 1, action: 'Buat anggaran bulanan pertama', status: 'pending' },
        { week: 2, action: 'Daftar kelas Financial Literacy', status: 'pending' },
        { week: 4, action: 'Mulai tracking pengeluaran harian', status: 'pending' },
        { week: 8, action: 'Evaluasi progress dan sesuaikan strategi', status: 'pending' }
      ]
    },
    {
      id: 2,
      dimension: 'Manajemen Lingkungan & Gaya Hidup',
      icon: Leaf,
      color: '#27AE60',
      currentScore: 55.3,
      targetScore: 75,
      gap: 19.7,
      gapLevel: 'CRITICAL',
      gapPercentage: 26.3,
      subdimensionGaps: [
        { name: 'Minimalism', current: 50.8, target: 75, gap: 24.2, impact: 'HIGH' },
        { name: 'Community Engagement', current: 52.7, target: 75, gap: 22.3, impact: 'MEDIUM' },
        { name: 'Sustainable Behavior', current: 52.3, target: 75, gap: 22.7, impact: 'HIGH' },
        { name: 'Digital Wellbeing', current: 54.2, target: 75, gap: 20.8, impact: 'MEDIUM' }
      ],
      rootCauses: [
        'Kurangnya kesadaran tentang dampak lingkungan',
        'Kebiasaan konsumtif yang terbentuk dari lingkungan',
        'Kurangnya exposure terhadap praktik berkelanjutan',
        'Ketergantungan tinggi pada teknologi'
      ],
      consequences: [
        'Dampak negatif pada lingkungan',
        'Biaya hidup yang lebih tinggi',
        'Kurangnya keseimbangan digital',
        'Potensi isu kesehatan terkait gaya hidup'
      ],
      recommendations: [
        'Kurangi penggunaan plastik sekali pakai',
        'Gunakan transportasi publik atau sepeda',
        'Partisipasi dalam kegiatan lingkungan kampus',
        'Terapkan digital detox secara teratur'
      ],
      resources: [
        { type: 'course', title: 'Sustainable Living Workshop', provider: 'ITS', duration: '4 minggu' },
        { type: 'article', title: 'Panduan Hidup Berkelanjutan', provider: 'PPSDM', duration: '20 menit' },
        { type: 'video', title: 'Digital Wellbeing Tips', provider: 'PPSDM', duration: '25 menit' },
        { type: 'tool', title: 'Carbon Footprint Calculator', provider: 'PPSDM', duration: 'Akses segera' }
      ],
      timeline: [
        { week: 1, action: 'Audit penggunaan plastik', status: 'pending' },
        { week: 2, action: 'Mulai menggunakan transportasi publik', status: 'pending' },
        { week: 3, action: 'Daftar kegiatan lingkungan kampus', status: 'pending' },
        { week: 6, action: 'Evaluasi jejak karbon', status: 'pending' }
      ]
    },
    {
      id: 3,
      dimension: 'Kesehatan Mental & Psikologis',
      icon: Sparkles,
      color: '#9B59B6',
      currentScore: 58.4,
      targetScore: 75,
      gap: 16.6,
      gapLevel: 'MODERATE',
      gapPercentage: 22.1,
      subdimensionGaps: [
        { name: 'Academic Stress Management', current: 54.2, target: 75, gap: 20.8, impact: 'HIGH' },
        { name: 'Help-seeking Behavior', current: 57.3, target: 75, gap: 17.7, impact: 'MEDIUM' },
        { name: 'Trauma Healing', current: 58.9, target: 75, gap: 16.1, impact: 'MEDIUM' }
      ],
      rootCauses: [
        'Tekanan akademik yang tinggi',
        'Kurangnya strategi coping yang efektif',
        'Stigma terhadap bantuan mental',
        'Kurangnya self-care routine'
      ],
      consequences: [
        'Burnout akademik',
        'Penurunan performa',
        'Isu kesehatan mental yang lebih serius',
        'Kurangnya kualitas hidup'
      ],
      recommendations: [
        'Ikuti program "Mindfulness for Students" di ITS',
        'Gunakan aplikasi meditation seperti Headspace atau Calm',
        'Konsultasikan dengan konselor jika stres berlanjut',
        'Terapkan self-care routine harian'
      ],
      resources: [
        { type: 'course', title: 'Mental Health First Aid', provider: 'ITS', duration: '6 minggu' },
        { type: 'article', title: 'Stress Management untuk Mahasiswa', provider: 'PPSDM', duration: '15 menit' },
        { type: 'video', title: 'Mindfulness Basics', provider: 'PPSDM', duration: '20 menit' },
        { type: 'tool', title: 'Meditation App Guide', provider: 'PPSDM', duration: 'Akses segera' }
      ],
      timeline: [
        { week: 1, action: 'Mulai mindfulness practice 10 menit/hari', status: 'pending' },
        { week: 2, action: 'Identifikasi stressors utama', status: 'pending' },
        { week: 3, action: 'Buat self-care routine', status: 'pending' },
        { week: 4, action: 'Evaluasi tingkat stres', status: 'pending' }
      ]
    },
    {
      id: 4,
      dimension: 'Pengembangan Spiritual',
      icon: Sun,
      color: '#E67E22',
      currentScore: 58.5,
      targetScore: 75,
      gap: 16.5,
      gapLevel: 'MODERATE',
      gapPercentage: 22.0,
      subdimensionGaps: [
        { name: 'Altruism & Contribution', current: 52.5, target: 75, gap: 22.5, impact: 'HIGH' },
        { name: 'Purpose & Meaning', current: 60.2, target: 75, gap: 14.8, impact: 'MEDIUM' }
      ],
      rootCauses: [
        'Kurangnya eksplorasi spiritual',
        'Fokus berlebihan pada aspek akademik',
        'Kurangnya keterlibatan komunitas',
        'Kurangnya refleksi makna hidup'
      ],
      consequences: [
        'Kurangnya rasa tujuan',
        'Isolasi sosial',
        'Kurangnya kepuasan hidup',
        'Potensi krisis identitas'
      ],
      recommendations: [
        'Ikuti kegiatan keagamaan atau spiritual secara teratur',
        'Praktikkan gratitude journaling',
        'Terlibat dalam kegiatan sosial dan komunitas',
        'Lakukan refleksi makna hidup secara teratur'
      ],
      resources: [
        { type: 'course', title: 'Spiritual Development Workshop', provider: 'ITS', duration: '4 minggu' },
        { type: 'article', title: 'Menemukan Makna Hidup', provider: 'PPSDM', duration: '20 menit' },
        { type: 'video', title: 'Gratitude Practice Guide', provider: 'PPSDM', duration: '15 menit' },
        { type: 'tool', title: 'Gratitude Journal Template', provider: 'PPSDM', duration: 'Akses segera' }
      ],
      timeline: [
        { week: 1, action: 'Mulai gratitude journaling', status: 'pending' },
        { week: 2, action: 'Identifikasi kegiatan spiritual yang relevan', status: 'pending' },
        { week: 3, action: 'Daftar kegiatan komunitas', status: 'pending' },
        { week: 4, action: 'Evaluasi rasa tujuan', status: 'pending' }
      ]
    },
    {
      id: 5,
      dimension: 'Kecerdasan Emosional & Sosial',
      icon: Users,
      color: '#8B5CF6',
      currentScore: 62.8,
      targetScore: 75,
      gap: 12.2,
      gapLevel: 'MODERATE',
      gapPercentage: 16.3,
      subdimensionGaps: [
        { name: 'Relationship Management', current: 60.9, target: 75, gap: 14.1, impact: 'MEDIUM' },
        { name: 'Self-Management', current: 61.2, target: 75, gap: 13.8, impact: 'MEDIUM' }
      ],
      rootCauses: [
        'Kurangnya latihan keterampilan sosial',
        'Kesulitan dalam manajemen emosi',
        'Kurangnya exposure situasi sosial yang beragam',
        'Kurangnya feedback dari orang lain'
      ],
      consequences: [
        'Konflik interpersonal',
        'Kurangnya dukungan sosial',
        'Kurangnya kemampuan kepemimpinan',
        'Isu kesehatan mental terkait sosial'
      ],
      recommendations: [
        'Ikuti pelatihan "Emotional Intelligence Workshop"',
        'Praktikkan active listening dalam komunikasi',
        'Kembangkan kemampuan negosiasi dan konflik resolution',
        'Cari feedback dari teman dan mentor'
      ],
      resources: [
        { type: 'course', title: 'Emotional Intelligence Training', provider: 'ITS', duration: '6 minggu' },
        { type: 'article', title: 'Keterampilan Komunikasi Efektif', provider: 'PPSDM', duration: '15 menit' },
        { type: 'video', title: 'Conflict Resolution Techniques', provider: 'PPSDM', duration: '25 menit' },
        { type: 'tool', title: 'EI Self-Assessment Tool', provider: 'PPSDM', duration: 'Akses segera' }
      ],
      timeline: [
        { week: 1, action: 'Latih active listening', status: 'pending' },
        { week: 2, action: 'Identifikasi trigger emosi', status: 'pending' },
        { week: 3, action: 'Praktikkan teknik konflik resolution', status: 'pending' },
        { week: 4, action: 'Minta feedback dari teman', status: 'pending' }
      ]
    }
  ],
  strengths: [
    {
      dimension: 'Kognitif & Intelektual',
      score: 74.3,
      level: 'ADVANCED',
      strengths: ['Growth mindset yang kuat', 'Kemampuan analisis yang baik', 'Metacognition yang efektif']
    },
    {
      dimension: 'Kesehatan Fisik & Vitalitas',
      score: 72.1,
      level: 'COMPETENT',
      strengths: ['Kualitas tidur yang baik', 'Vitalitas yang tinggi', 'Kesadaran tubuh yang baik']
    },
    {
      dimension: 'Karakter & Etika',
      score: 65.2,
      level: 'COMPETENT',
      strengths: ['Integritas yang kuat', 'Kasih sayang yang tinggi', 'Tanggung jawab yang baik']
    }
  ],
  crossDimensionalGaps: [
    {
      gap: 'Kurangnya keseimbangan antara akademik dan kesejahteraan',
      affectedDimensions: ['Kognitif', 'Kesehatan Mental', 'Kesehatan Fisik'],
      severity: 'HIGH',
      recommendation: 'Terapkan work-life balance dan prioritasi self-care'
    },
    {
      gap: 'Kurangnya keterampilan manajemen sumber daya',
      affectedDimensions: ['Manajemen Diri', 'Finansial', 'Lingkungan'],
      severity: 'MEDIUM',
      recommendation: 'Kembangkan sistem manajemen waktu, uang, dan sumber daya lainnya'
    },
    {
      gap: 'Kurangnya keterlibatan sosial dan komunitas',
      affectedDimensions: ['Emosional & Sosial', 'Spiritual', 'Lingkungan'],
      severity: 'MEDIUM',
      recommendation: 'Tingkatkan partisipasi dalam kegiatan komunitas dan sosial'
    }
  ]
};

const gapLevelColors = {
  CRITICAL: { bg: 'bg-red-500', text: 'text-red-50', border: 'border-red-600', icon: AlertTriangle },
  MODERATE: { bg: 'bg-orange-500', text: 'text-orange-50', border: 'border-orange-600', icon: TrendingDown },
  MINOR: { bg: 'bg-yellow-500', text: 'text-yellow-50', border: 'border-yellow-600', icon: Target },
  NONE: { bg: 'bg-green-500', text: 'text-green-50', border: 'border-green-600', icon: CheckCircle2 }
};

const impactColors = {
  HIGH: 'text-red-600',
  MEDIUM: 'text-orange-600',
  LOW: 'text-yellow-600'
};

const resourceTypeIcons = {
  course: BookOpen,
  article: Lightbulb,
  video: Play,
  tool: Zap
};

export default function GapAnalysisPage() {
  const [selectedGap, setSelectedGap] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredGaps = filterLevel === 'all'
    ? mockGapAnalysis.gaps
    : mockGapAnalysis.gaps.filter(gap => gap.gapLevel === filterLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Analisis Gap Pengembangan
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Identifikasi kelemahan dan area pengembangan
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-bold">{mockGapAnalysis.summary.criticalGaps}</p>
              <p className="text-sm opacity-90">Gap Kritis</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-bold">{mockGapAnalysis.summary.moderateGaps}</p>
              <p className="text-sm opacity-90">Gap Sedang</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-bold">{mockGapAnalysis.summary.minorGaps}</p>
              <p className="text-sm opacity-90">Gap Ringan</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-bold">{mockGapAnalysis.summary.noGaps}</p>
              <p className="text-sm opacity-90">Tidak Ada Gap</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Skor Gap Keseluruhan</p>
                  <p className="text-3xl font-bold">{mockGapAnalysis.summary.overallGapScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Prioritas</p>
                  <Badge className="bg-white text-purple-600 font-bold">
                    {mockGapAnalysis.summary.priorityLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <AlertTitle className="text-orange-900 dark:text-orange-100">
              {mockGapAnalysis.summary.criticalGaps} Gap Kritis Teridentifikasi
            </AlertTitle>
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              Fokus pada gap kritis terlebih dahulu untuk hasil maksimal. Gap ini memiliki dampak signifikan terhadap perkembangan holistik Anda.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gaps">Gap Detail</TabsTrigger>
            <TabsTrigger value="cross-dim">Cross-Dimensional</TabsTrigger>
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gap Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    Distribusi Gap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Kritis</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {mockGapAnalysis.summary.criticalGaps} dimensi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-orange-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Sedang</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {mockGapAnalysis.summary.moderateGaps} dimensi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Ringan</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {mockGapAnalysis.summary.minorGaps} dimensi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Tidak Ada</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {mockGapAnalysis.summary.noGaps} dimensi
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gap Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-purple-600" />
                    Tren Gap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Gap Saat Ini</span>
                      <span className="text-2xl font-bold text-red-600">
                        {mockGapAnalysis.summary.overallGapScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Gap Sebelumnya</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        48.7
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Target Gap</span>
                      <span className="text-2xl font-bold text-green-600">
                        25.0
                      </span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingDown className="h-5 w-5" />
                        <span className="font-semibold">
                          -{48.7 - mockGapAnalysis.summary.overallGapScore}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Peningkatan sejak assessment terakhir
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Priority Gaps */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Gap Prioritas Tinggi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGapAnalysis.gaps.filter(g => g.gapLevel === 'CRITICAL').map((gap, index) => {
                    const Icon = gap.icon;
                    return (
                      <div
                        key={gap.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedGap(gap.id)}
                      >
                        <div className={`p-2 rounded-lg ${gapLevelColors.CRITICAL.bg}`}>
                          <Icon className={`h-6 w-6 ${gapLevelColors.CRITICAL.text}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {gap.dimension}
                          </h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Skor: {gap.currentScore}/100
                            </span>
                            <span className="text-sm text-red-600 font-semibold">
                              Gap: {gap.gap} poin
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {gap.gapPercentage}% dari target
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gaps Detail Tab */}
          <TabsContent value="gaps" className="mt-6">
            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Filter:</span>
              <div className="flex gap-2">
                <Button
                  variant={filterLevel === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterLevel('all')}
                >
                  Semua
                </Button>
                <Button
                  variant={filterLevel === 'CRITICAL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterLevel('CRITICAL')}
                >
                  Kritis
                </Button>
                <Button
                  variant={filterLevel === 'MODERATE' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterLevel('MODERATE')}
                >
                  Sedang
                </Button>
                <Button
                  variant={filterLevel === 'MINOR' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterLevel('MINOR')}
                >
                  Ringan
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredGaps.map((gap, index) => {
                const Icon = gap.icon;
                const levelColor = gapLevelColors[gap.gapLevel as keyof typeof gapLevelColors];
                const LevelIcon = levelColor.icon;

                return (
                  <motion.div
                    key={gap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${levelColor.border}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${levelColor.bg}`}>
                              <Icon className={`h-6 w-6 ${levelColor.text}`} />
                            </div>
                            <div>
                              <CardTitle>{gap.dimension}</CardTitle>
                              <CardDescription>
                                Gap: {gap.gap} poin ({gap.gapPercentage}% dari target)
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={levelColor.bg + ' ' + levelColor.text}>
                            {gap.gapLevel}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Subdimension Gaps */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                            Gap Sub-dimensi
                          </h4>
                          <div className="space-y-3">
                            {gap.subdimensionGaps.map((subgap, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-700 dark:text-slate-300">
                                    {subgap.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${impactColors[subgap.impact as keyof typeof impactColors]}`}>
                                      {subgap.impact}
                                    </span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                      Gap: {subgap.gap} poin
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={subgap.current} className="flex-1 h-2" />
                                  <span className="text-sm font-medium text-slate-900 dark:text-white w-16 text-right">
                                    {subgap.current}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Root Causes */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Penyebab Utama
                          </h4>
                          <ul className="space-y-1">
                            {gap.rootCauses.map((cause, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-red-600 mt-0.5">•</span>
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Consequences */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-orange-600" />
                            Konsekuensi
                          </h4>
                          <ul className="space-y-1">
                            {gap.consequences.map((consequence, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-orange-600 mt-0.5">•</span>
                                {consequence}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-blue-600" />
                            Rekomendasi
                          </h4>
                          <ul className="space-y-2">
                            {gap.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-blue-600 mt-0.5">{idx + 1}.</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            Sumber Daya
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {gap.resources.map((resource, idx) => {
                              const ResourceIcon = resourceTypeIcons[resource.type as keyof typeof resourceTypeIcons] || BookOpen;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                                    <ResourceIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                      {resource.title}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      {resource.provider} • {resource.duration}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <ClockIcon className="h-5 w-5 text-purple-600" />
                            Timeline Tindakan
                          </h4>
                          <div className="space-y-2">
                            {gap.timeline.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                              >
                                <div className={`p-2 rounded-full ${item.status === 'completed' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                  <span className="text-white text-sm font-bold">{item.week}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-slate-700 dark:text-slate-300">
                                    Minggu {item.week}: {item.action}
                                  </p>
                                </div>
                                {item.status === 'completed' ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button className="w-full">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Lihat Program Pengembangan
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Cross-Dimensional Tab */}
          <TabsContent value="cross-dim" className="mt-6">
            <div className="space-y-6">
              <Alert>
                <AlertTitle>Analisis Cross-Dimensional</AlertTitle>
                <AlertDescription>
                  Gap yang mempengaruhi beberapa dimensi sekaligus. Fokus pada gap ini untuk hasil maksimal.
                </AlertDescription>
              </Alert>

              {mockGapAnalysis.crossDimensionalGaps.map((gap, index) => {
                const severityColor = gap.severity === 'HIGH' ? 'border-red-500' : 'border-orange-500';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${severityColor}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{gap.gap}</CardTitle>
                          <Badge className={gap.severity === 'HIGH' ? 'bg-red-500' : 'bg-orange-500'}>
                            {gap.severity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Dimensi yang Terpengaruh
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {gap.affectedDimensions.map((dim, idx) => (
                              <Badge key={idx} variant="secondary">
                                {dim}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Rekomendasi
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {gap.recommendation}
                          </p>
                        </div>
                        <Button className="w-full" variant="outline">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Lihat Program Terintegrasi
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Strengths Tab */}
          <TabsContent value="strengths" className="mt-6">
            <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-900 dark:text-green-100">
                Kelebihan Anda
              </AlertTitle>
              <AlertDescription className="text-green-800 dark:text-green-200">
                Berikut adalah dimensi di mana Anda memiliki kelebihan. Gunakan kelebihan ini untuk mendukung pengembangan di area lain.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGapAnalysis.strengths.map((strength, index) => {
                const levelColor = strength.level === 'ADVANCED'
                  ? 'bg-blue-500'
                  : 'bg-green-500';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{strength.dimension}</CardTitle>
                          <Badge className={levelColor + ' text-white'}>
                            {strength.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Skor</span>
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {strength.score}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Kelebihan
                          </h4>
                          <ul className="space-y-1">
                            {strength.strengths.map((s, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-green-600 mt-0.5">•</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button className="w-full" variant="outline" size="sm">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-slate-200 dark:border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Butuh bantuan untuk mengatasi gap yang teridentifikasi?
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Lihat Program Pengembangan
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Hubungi Konselor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
