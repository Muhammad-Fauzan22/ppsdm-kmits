/**
 * Halaman Roadmap Personal
 * 
 * Rekomendasi pengembangan berdasarkan hasil assessment
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
  Target,
  CheckCircle2,
  Calendar,
  BookOpen,
  Play,
  Zap,
  Award,
  TrendingUp,
  ArrowRight,
  Map,
  Flag,
  Star,
  Clock as ClockIcon,
  ChevronRight,
  Download,
  Share2,
  Lightbulb
} from 'lucide-react';

// Mock data untuk personal roadmap
const mockPersonalRoadmap = {
  userProfile: {
    name: 'Mahasiswa ITS',
    currentLevel: 'COMPETENT',
    overallScore: 66.7,
    targetScore: 75,
    estimatedTimeToTarget: '3 bulan',
    primaryFocus: 'Kecerdasan Finansial & Manajemen Lingkungan'
  },
  phases: [
    {
      id: 1,
      name: 'Fase 1: Foundation',
      duration: '4 minggu',
      status: 'in_progress',
      description: 'Bangun fondasi dasar untuk pengembangan holistik',
      objectives: [
        'Selesaikan assessment ulang untuk baseline',
        'Buat sistem tracking harian',
        'Identifikasi 3 prioritas utama',
        'Mulai 1 program pengembangan'
      ],
      activities: [
        { id: 1, title: 'Assessment Ulang', type: 'assessment', status: 'completed', dimension: 'All' },
        { id: 2, title: 'Setup Habit Tracker', type: 'tool', status: 'in_progress', dimension: 'Manajemen Diri' },
        { id: 3, title: 'Identifikasi Prioritas', type: 'planning', status: 'pending', dimension: 'All' },
        { id: 4, title: 'Daftar Financial Literacy', type: 'course', status: 'pending', dimension: 'Finansial' }
      ],
      milestones: [
        { id: 1, title: 'Baseline Terselesaikan', status: 'completed', date: '2024-01-15' },
        { id: 2, title: 'Sistem Tracking Aktif', status: 'in_progress', date: '2024-01-22' },
        { id: 3, title: 'Prioritas Teridentifikasi', status: 'pending', date: '2024-01-29' },
        { id: 4, title: 'Program Pertama Dimulai', status: 'pending', date: '2024-02-05' }
      ]
    },
    {
      id: 2,
      name: 'Fase 2: Development',
      duration: '8 minggu',
      status: 'pending',
      description: 'Fokus pada pengembangan area gap kritis',
      objectives: [
        'Tingkatkan literasi finansial ke 70+',
        'Implementasi praktik berkelanjutan',
        'Kembangkan keterampilan manajemen waktu',
        'Bangun rutinitas self-care'
      ],
      activities: [
        { id: 5, title: 'Kelas Financial Literacy', type: 'course', status: 'pending', dimension: 'Finansial' },
        { id: 6, title: 'Workshop Sustainable Living', type: 'workshop', status: 'pending', dimension: 'Lingkungan' },
        { id: 7, title: 'Time Management Training', type: 'course', status: 'pending', dimension: 'Manajemen Diri' },
        { id: 8, title: 'Mindfulness Practice', type: 'practice', status: 'pending', dimension: 'Kesehatan Mental' }
      ],
      milestones: [
        { id: 5, title: 'Literasi Finansial 70+', status: 'pending', date: '2024-02-19' },
        { id: 6, title: 'Praktik Berkelanjutan Terapkan', status: 'pending', date: '2024-03-04' },
        { id: 7, title: 'Manajemen Waktu Optimal', status: 'pending', date: '2024-03-18' },
        { id: 8, title: 'Rutinitas Self-Care Terbentuk', status: 'pending', date: '2024-04-01' }
      ]
    },
    {
      id: 3,
      name: 'Fase 3: Integration',
      duration: '8 minggu',
      status: 'pending',
      description: 'Integrasikan semua keterampilan yang dikembangkan',
      objectives: [
        'Terapkan keterampilan dalam konteks nyata',
        'Bangun sistem dukungan sosial',
        'Kembangkan kebiasaan jangka panjang',
        'Persiapkan assessment berikutnya'
      ],
      activities: [
        { id: 9, title: 'Project-Based Learning', type: 'project', status: 'pending', dimension: 'Kognitif' },
        { id: 10, title: 'Community Engagement', type: 'social', status: 'pending', dimension: 'Spiritual' },
        { id: 11, title: 'Habit Formation', type: 'practice', status: 'pending', dimension: 'Manajemen Diri' },
        { id: 12, title: 'Assessment Preparation', type: 'assessment', status: 'pending', dimension: 'All' }
      ],
      milestones: [
        { id: 9, title: 'Project Selesai', status: 'pending', date: '2024-04-22' },
        { id: 10, title: 'Komunitas Terbentuk', status: 'pending', date: '2024-05-06' },
        { id: 11, title: 'Kebiasaan Terbentuk', status: 'pending', date: '2024-05-20' },
        { id: 12, title: 'Siap Assessment Berikutnya', status: 'pending', date: '2024-06-03' }
      ]
    },
    {
      id: 4,
      name: 'Fase 4: Mastery',
      duration: '4 minggu',
      status: 'pending',
      description: 'Konsolidasi dan tingkatkan ke level mastery',
      objectives: [
        'Capai skor target 75+',
        'Dapatkan badges mastery',
        'Bagikan pengalaman dengan komunitas',
        'Persiapkan roadmap berikutnya'
      ],
      activities: [
        { id: 13, title: 'Advanced Training', type: 'course', status: 'pending', dimension: 'All' },
        { id: 14, title: 'Mentorship Program', type: 'mentorship', status: 'pending', dimension: 'All' },
        { id: 15, title: 'Knowledge Sharing', type: 'social', status: 'pending', dimension: 'Spiritual' },
        { id: 16, title: 'Final Assessment', type: 'assessment', status: 'pending', dimension: 'All' }
      ],
      milestones: [
        { id: 13, title: 'Skor Target Tercapai', status: 'pending', date: '2024-06-17' },
        { id: 14, title: 'Badges Mastery Didapat', status: 'pending', date: '2024-06-24' },
        { id: 15, title: 'Pengalaman Dibagikan', status: 'pending', date: '2024-06-28' },
        { id: 16, title: 'Roadmap Berikutnya Siap', status: 'pending', date: '2024-07-01' }
      ]
    }
  ],
  dimensionRoadmaps: [
    {
      dimension: 'Kecerdasan Finansial',
      icon: Wallet,
      color: '#F59E0B',
      currentScore: 52.3,
      targetScore: 75,
      priority: 'HIGH',
      roadmap: [
        { week: 1, action: 'Buat anggaran bulanan pertama', status: 'pending' },
        { week: 2, action: 'Daftar kelas Financial Literacy', status: 'pending' },
        { week: 3, action: 'Mulai tracking pengeluaran harian', status: 'pending' },
        { week: 4, action: 'Pelajari dasar investasi', status: 'pending' },
        { week: 6, action: 'Buka rekening investasi pertama', status: 'pending' },
        { week: 8, action: 'Evaluasi dan sesuaikan strategi', status: 'pending' },
        { week: 12, action: 'Bangun dana darurat 3 bulan', status: 'pending' },
        { week: 16, action: 'Capai skor target 75+', status: 'pending' }
      ],
      resources: [
        { type: 'course', title: 'Financial Literacy 101', provider: 'ITS', duration: '8 minggu' },
        { type: 'article', title: 'Panduan Budgeting untuk Mahasiswa', provider: 'PPSDM', duration: '15 menit' },
        { type: 'video', title: 'Investasi untuk Pemula', provider: 'OJK', duration: '30 menit' },
        { type: 'tool', title: 'Aplikasi Budgeting', provider: 'PPSDM', duration: 'Akses segera' }
      ]
    },
    {
      dimension: 'Manajemen Lingkungan & Gaya Hidup',
      icon: Leaf,
      color: '#27AE60',
      currentScore: 55.3,
      targetScore: 75,
      priority: 'HIGH',
      roadmap: [
        { week: 1, action: 'Audit penggunaan plastik', status: 'pending' },
        { week: 2, action: 'Mulai menggunakan transportasi publik', status: 'pending' },
        { week: 3, action: 'Daftar kegiatan lingkungan kampus', status: 'pending' },
        { week: 4, action: 'Terapkan digital detox 1 jam/hari', status: 'pending' },
        { week: 6, action: 'Mulai komposting organik', status: 'pending' },
        { week: 8, action: 'Evaluasi jejak karbon', status: 'pending' },
        { week: 12, action: 'Capai gaya hidup berkelanjutan', status: 'pending' },
        { week: 16, action: 'Capai skor target 75+', status: 'pending' }
      ],
      resources: [
        { type: 'course', title: 'Sustainable Living Workshop', provider: 'ITS', duration: '4 minggu' },
        { type: 'article', title: 'Panduan Hidup Berkelanjutan', provider: 'PPSDM', duration: '20 menit' },
        { type: 'video', title: 'Digital Wellbeing Tips', provider: 'PPSDM', duration: '25 menit' },
        { type: 'tool', title: 'Carbon Footprint Calculator', provider: 'PPSDM', duration: 'Akses segera' }
      ]
    },
    {
      dimension: 'Kesehatan Mental & Psikologis',
      icon: Sparkles,
      color: '#9B59B6',
      currentScore: 58.4,
      targetScore: 75,
      priority: 'MEDIUM',
      roadmap: [
        { week: 1, action: 'Mulai mindfulness practice 10 menit/hari', status: 'pending' },
        { week: 2, action: 'Identifikasi stressors utama', status: 'pending' },
        { week: 3, action: 'Buat self-care routine', status: 'pending' },
        { week: 4, action: 'Evaluasi tingkat stres', status: 'pending' },
        { week: 6, action: 'Ikuti program mental health', status: 'pending' },
        { week: 8, action: 'Kembangkan strategi coping baru', status: 'pending' },
        { week: 12, action: 'Bangun sistem dukungan sosial', status: 'pending' },
        { week: 16, action: 'Capai skor target 75+', status: 'pending' }
      ],
      resources: [
        { type: 'course', title: 'Mental Health First Aid', provider: 'ITS', duration: '6 minggu' },
        { type: 'article', title: 'Stress Management untuk Mahasiswa', provider: 'PPSDM', duration: '15 menit' },
        { type: 'video', title: 'Mindfulness Basics', provider: 'PPSDM', duration: '20 menit' },
        { type: 'tool', title: 'Meditation App Guide', provider: 'PPSDM', duration: 'Akses segera' }
      ]
    },
    {
      dimension: 'Pengembangan Spiritual',
      icon: Sun,
      color: '#E67E22',
      currentScore: 58.5,
      targetScore: 75,
      priority: 'MEDIUM',
      roadmap: [
        { week: 1, action: 'Mulai gratitude journaling', status: 'pending' },
        { week: 2, action: 'Identifikasi kegiatan spiritual yang relevan', status: 'pending' },
        { week: 3, action: 'Daftar kegiatan komunitas', status: 'pending' },
        { week: 4, action: 'Evaluasi rasa tujuan', status: 'pending' },
        { week: 6, action: 'Ikuti kegiatan spiritual rutin', status: 'pending' },
        { week: 8, action: 'Refleksi makna hidup', status: 'pending' },
        { week: 12, action: 'Tingkatkan kontribusi sosial', status: 'pending' },
        { week: 16, action: 'Capai skor target 75+', status: 'pending' }
      ],
      resources: [
        { type: 'course', title: 'Spiritual Development Workshop', provider: 'ITS', duration: '4 minggu' },
        { type: 'article', title: 'Menemukan Makna Hidup', provider: 'PPSDM', duration: '20 menit' },
        { type: 'video', title: 'Gratitude Practice Guide', provider: 'PPSDM', duration: '15 menit' },
        { type: 'tool', title: 'Gratitude Journal Template', provider: 'PPSDM', duration: 'Akses segera' }
      ]
    },
    {
      dimension: 'Kecerdasan Emosional & Sosial',
      icon: Users,
      color: '#8B5CF6',
      currentScore: 62.8,
      targetScore: 75,
      priority: 'MEDIUM',
      roadmap: [
        { week: 1, action: 'Latih active listening', status: 'pending' },
        { week: 2, action: 'Identifikasi trigger emosi', status: 'pending' },
        { week: 3, action: 'Praktikkan teknik konflik resolution', status: 'pending' },
        { week: 4, action: 'Minta feedback dari teman', status: 'pending' },
        { week: 6, action: 'Ikuti pelatihan EI', status: 'pending' },
        { week: 8, action: 'Kembangkan keterampilan negosiasi', status: 'pending' },
        { week: 12, action: 'Bangun jaringan dukungan', status: 'pending' },
        { week: 16, action: 'Capai skor target 75+', status: 'pending' }
      ],
      resources: [
        { type: 'course', title: 'Emotional Intelligence Training', provider: 'ITS', duration: '6 minggu' },
        { type: 'article', title: 'Keterampilan Komunikasi Efektif', provider: 'PPSDM', duration: '15 menit' },
        { type: 'video', title: 'Conflict Resolution Techniques', provider: 'PPSDM', duration: '25 menit' },
        { type: 'tool', title: 'EI Self-Assessment Tool', provider: 'PPSDM', duration: 'Akses segera' }
      ]
    }
  ],
  weeklyPlan: [
    { week: 1, focus: 'Foundation', activities: ['Assessment ulang', 'Setup tracking', 'Identifikasi prioritas'], status: 'in_progress' },
    { week: 2, focus: 'Financial Literacy', activities: ['Kelas Financial Literacy', 'Budgeting pertama'], status: 'pending' },
    { week: 3, focus: 'Environment', activities: ['Audit plastik', 'Transportasi publik', 'Kegiatan lingkungan'], status: 'pending' },
    { week: 4, focus: 'Mental Health', activities: ['Mindfulness practice', 'Self-care routine', 'Evaluasi stres'], status: 'pending' },
    { week: 5, focus: 'Review & Adjust', activities: ['Review progress', 'Sesuaikan strategi', 'Plan minggu depan'], status: 'pending' },
    { week: 6, focus: 'Integration', activities: ['Project-based learning', 'Community engagement', 'Habit formation'], status: 'pending' },
    { week: 7, focus: 'Review & Adjust', activities: ['Review progress', 'Sesuaikan strategi', 'Plan minggu depan'], status: 'pending' },
    { week: 8, focus: 'Consolidation', activities: ['Advanced training', 'Mentorship', 'Knowledge sharing'], status: 'pending' }
  ],
  badges: [
    { id: 'roadmap_master', name: 'Roadmap Master', description: 'Selesaikan semua fase roadmap', icon: Award, progress: 25 },
    { id: 'financial_literacy', name: 'Financial Literate', description: 'Capai skor finansial 70+', icon: Wallet, progress: 0 },
    { id: 'sustainable_living', name: 'Sustainable Living', description: 'Capai skor lingkungan 70+', icon: Leaf, progress: 0 },
    { id: 'mental_wellness', name: 'Mental Wellness', description: 'Capai skor mental 70+', icon: Sparkles, progress: 0 },
    { id: 'social_connector', name: 'Social Connector', description: 'Terlibat dalam 5+ kegiatan komunitas', icon: Users, progress: 0 },
    { id: 'habit_builder', name: 'Habit Builder', description: 'Bangun 3+ kebiasaan baru', icon: Clock, progress: 0 }
  ]
};

const phaseStatusColors = {
  completed: { bg: 'bg-green-500', text: 'text-green-50', border: 'border-green-600' },
  in_progress: { bg: 'bg-blue-500', text: 'text-blue-50', border: 'border-blue-600' },
  pending: { bg: 'bg-slate-300', text: 'text-slate-700', border: 'border-slate-400' }
};

const activityTypeIcons = {
  assessment: Target,
  tool: Zap,
  planning: Map,
  course: BookOpen,
  workshop: Play,
  practice: ClockIcon,
  project: Star,
  social: Users,
  mentorship: Award
};

const resourceTypeIcons = {
  course: BookOpen,
  article: Lightbulb,
  video: Play,
  tool: Zap
};

export default function PersonalRoadmapPage() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getPhaseStatusColor = (status: string) => phaseStatusColors[status as keyof typeof phaseStatusColors] || phaseStatusColors.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                Roadmap Pengembangan Personal
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Rekomendasi pengembangan berdasarkan hasil assessment
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Roadmap
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Bagikan
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Profil Pengembangan Anda</h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold">{mockPersonalRoadmap.userProfile.overallScore}</span>
                    <span className="text-2xl opacity-80">/ 100</span>
                  </div>
                  <p className="text-lg opacity-90 mt-2">{mockPersonalRoadmap.userProfile.currentLevel}</p>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <p className="text-sm opacity-80">Target</p>
                    <p className="text-3xl font-bold">{mockPersonalRoadmap.userProfile.targetScore}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Estimasi Waktu</p>
                    <p className="text-3xl font-bold">{mockPersonalRoadmap.userProfile.estimatedTimeToTarget}</p>
                  </div>
                </div>
              </div>
              <Alert className="mt-6 bg-white/20 border-white/30 text-white">
                <Target className="h-5 w-5" />
                <AlertTitle className="text-white">Fokus Utama</AlertTitle>
                <AlertDescription className="text-white/90">
                  {mockPersonalRoadmap.userProfile.primaryFocus}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="phases">Fase</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensi</TabsTrigger>
            <TabsTrigger value="weekly">Mingguan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Progress Keseluruhan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Fase Selesai</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      1/4
                    </span>
                  </div>
                  <Progress value={25} className="h-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Estimasi Selesai</span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      24 minggu
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Anda sedang berada di Fase 1: Foundation. Selesaikan semua aktivitas fase ini untuk melanjutkan ke Fase 2.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Progress Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockPersonalRoadmap.badges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${badge.progress > 0 ? 'bg-purple-100 dark:bg-purple-900' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <badge.icon className={`h-5 w-5 ${badge.progress > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {badge.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {badge.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {badge.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="p-2 rounded-full bg-blue-600 text-white">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Selesaikan Fase 1
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Selesaikan 4 aktivitas yang tersisa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="p-2 rounded-full bg-purple-600 text-white">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Mulai Fase 2
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Fokus pada pengembangan area gap kritis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="p-2 rounded-full bg-green-600 text-white">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Lacak Progress Harian
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Gunakan fitur habit tracking
                      </p>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Lihat Semua Program Pengembangan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phases Tab */}
          <TabsContent value="phases" className="mt-6">
            <div className="space-y-6">
              {mockPersonalRoadmap.phases.map((phase, index) => {
                const statusColor = getPhaseStatusColor(phase.status);

                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${statusColor.border}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${statusColor.bg}`}>
                              <Flag className={`h-6 w-6 ${statusColor.text}`} />
                            </div>
                            <div>
                              <CardTitle>{phase.name}</CardTitle>
                              <CardDescription>
                                Durasi: {phase.duration}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={statusColor.bg + ' ' + statusColor.text}>
                            {phase.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Description */}
                        <p className="text-slate-700 dark:text-slate-300">
                          {phase.description}
                        </p>

                        {/* Objectives */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Tujuan</h4>
                          <ul className="space-y-1">
                            {phase.objectives.map((objective, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Activities */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Aktivitas</h4>
                          <div className="space-y-2">
                            {phase.activities.map((activity, idx) => {
                              const ActivityIcon = activityTypeIcons[activity.type as keyof typeof activityTypeIcons] || Target;
                              return (
                                <div
                                  key={activity.id}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                                >
                                  <div className={`p-2 rounded-full ${activity.status === 'completed' ? 'bg-green-500' : activity.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                    <ActivityIcon className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                                      {activity.title}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                      {activity.dimension}
                                    </p>
                                  </div>
                                  {activity.status === 'completed' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : activity.status === 'in_progress' ? (
                                    <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Milestones */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Milestone</h4>
                          <div className="space-y-2">
                            {phase.milestones.map((milestone, idx) => (
                              <div
                                key={milestone.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                              >
                                <div className={`p-2 rounded-full ${milestone.status === 'completed' ? 'bg-green-500' : milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                  <Calendar className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                                    {milestone.title}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {milestone.date}
                                  </p>
                                </div>
                                {milestone.status === 'completed' ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : milestone.status === 'in_progress' ? (
                                  <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Dimensions Tab */}
          <TabsContent value="dimensions" className="mt-6">
            <div className="space-y-6">
              {mockPersonalRoadmap.dimensionRoadmaps.map((roadmap, index) => {
                const Icon = roadmap.icon;
                const priorityColor = roadmap.priority === 'HIGH' ? 'border-red-500' : 'border-orange-500';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${priorityColor}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: roadmap.color }}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle>{roadmap.dimension}</CardTitle>
                              <CardDescription>
                                Skor: {roadmap.currentScore}/100 | Target: {roadmap.targetScore}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={roadmap.priority === 'HIGH' ? 'bg-red-500' : 'bg-orange-500'}>
                            {roadmap.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Progress */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {Math.round((roadmap.currentScore / roadmap.targetScore) * 100)}%
                          </span>
                        </div>
                        <Progress value={(roadmap.currentScore / roadmap.targetScore) * 100} className="h-3" />

                        {/* Roadmap Timeline */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Timeline Pengembangan</h4>
                          <div className="space-y-2">
                            {roadmap.roadmap.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                              >
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-900 dark:text-white text-sm">
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

                        {/* Resources */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Sumber Daya</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {roadmap.resources.map((resource, idx) => {
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

          {/* Weekly Tab */}
          <TabsContent value="weekly" className="mt-6">
            <div className="space-y-4">
              {mockPersonalRoadmap.weeklyPlan.map((week, index) => {
                const isCurrentWeek = week.status === 'in_progress';
                const isPastWeek = week.status === 'completed';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className={`${isCurrentWeek ? 'border-2 border-purple-500' : ''} ${isPastWeek ? 'opacity-60' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${isCurrentWeek ? 'bg-purple-500' : isPastWeek ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <span className="text-white font-bold">{week.week}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              Minggu {week.week}: {week.focus}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {week.activities.map((activity, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        {isCurrentWeek && (
                          <ChevronRight className="h-5 w-5 text-purple-600 mt-2" />
                        )}
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
            Butuh bantuan untuk mengikuti roadmap ini?
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Lihat Panduan Roadmap
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Hubungi Mentor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
