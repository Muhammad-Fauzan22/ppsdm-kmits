/**
 * Halaman Hasil Assessment
 * 
 * Menampilkan skor dengan interpretasi dan rekomendasi
 * Berdasarkan 9 dimensi assessment dengan konten riset lengkap
 */

'use client';

import { useState, useEffect } from 'react';
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
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Download,
  Share2,
  ArrowRight,
  Target,
  Zap,
  Award,
  Lightbulb
} from 'lucide-react';

// Mock data untuk hasil assessment
const mockAssessmentResults = {
  overall: {
    score: 66.7,
    balanceIndex: 78,
    percentile: 72,
    level: 'COMPETENT',
    interpretation: 'Perkembangan holistik Anda berada di tingkat kompeten. Anda memiliki keseimbangan yang baik di berbagai dimensi, namun masih ada ruang untuk pengembangan lebih lanjut.'
  },
  dimensions: [
    {
      id: 1,
      name: 'Kognitif & Intelektual',
      icon: Brain,
      color: '#3B82F6',
      score: 74.3,
      previousScore: 70.5,
      target: 85,
      percentile: 82,
      level: 'ADVANCED',
      subscores: {
        critical_thinking: 72.5,
        growth_mindset: 78.2,
        creativity: 68.4,
        metacognition: 70.8
      },
      strengths: ['Growth mindset yang kuat', 'Kemampuan analisis yang baik'],
      growthAreas: ['Kreativitas perlu dikembangkan'],
      recommendations: [
        'Ikuti workshop "Developing Growth Mindset" di Pusat Pengembangan Karir ITS',
        'Ambil kursus online "Critical Thinking for Engineers" di Coursera',
        'Praktikkan teknik divergent thinking dalam pemecahan masalah'
      ]
    },
    {
      id: 2,
      name: 'Manajemen Diri & Produktivitas',
      icon: Clock,
      color: '#10B981',
      score: 68.2,
      previousScore: 65.8,
      target: 80,
      percentile: 75,
      level: 'COMPETENT',
      subscores: {
        time_management: 72.5,
        procrastination: 65.3,
        self_control: 70.8,
        deep_work: 68.4,
        energy_management: 65.7,
        prioritization: 68.9
      },
      strengths: ['Manajemen waktu yang baik', 'Kemampuan fokus yang memadai'],
      growthAreas: ['Kontrol prokrastinasi perlu ditingkatkan'],
      recommendations: [
        'Gunakan teknik Pomodoro untuk meningkatkan fokus',
        'Terapkan Eisenhower Matrix untuk prioritas tugas',
        'Buat jadwal harian dengan time-blocking'
      ]
    },
    {
      id: 3,
      name: 'Kecerdasan Finansial',
      icon: Wallet,
      color: '#F59E0B',
      score: 52.3,
      previousScore: 48.7,
      target: 75,
      percentile: 58,
      level: 'BASIC',
      subscores: {
        knowledge: 58.4,
        behavior: 52.3,
        self_efficacy: 46.2
      },
      strengths: ['Pengetahuan finansial dasar yang cukup'],
      growthAreas: ['Perilaku finansial perlu ditingkatkan', 'Self-efficacy finansial rendah'],
      recommendations: [
        'Ikuti kelas "Financial Literacy for Students" di ITS',
        'Buat anggaran bulanan dan catat pengeluaran',
        'Mulai investasi dengan reksadana pasar uang'
      ]
    },
    {
      id: 4,
      name: 'Kesehatan Fisik & Vitalitas',
      icon: Heart,
      color: '#EF4444',
      score: 72.1,
      previousScore: 68.5,
      target: 80,
      percentile: 78,
      level: 'COMPETENT',
      subscores: {
        physical_activity: 68.4,
        sleep_quality: 75.2,
        nutrition: 70.8,
        vitality: 73.5,
        hydration: 68.9,
        stress_management: 72.4,
        preventive_care: 65.7,
        body_awareness: 74.2
      },
      strengths: ['Kualitas tidur yang baik', 'Vitalitas yang tinggi'],
      growthAreas: ['Aktivitas fisik perlu ditingkatkan'],
      recommendations: [
        'Lakukan olahraga minimal 150 menit per minggu',
        'Tidur 7-8 jam setiap malam',
        'Konsumsi minimal 3 porsi sayur dan 2 porsi buah per hari'
      ]
    },
    {
      id: 5,
      name: 'Kecerdasan Emosional & Sosial',
      icon: Users,
      color: '#8B5CF6',
      score: 62.8,
      previousScore: 60.2,
      target: 75,
      percentile: 68,
      level: 'COMPETENT',
      subscores: {
        self_awareness: 65.3,
        social_awareness: 63.8,
        self_management: 61.2,
        relationship_management: 60.9
      },
      strengths: ['Kesadaran diri yang baik', 'Kemampuan empati yang memadai'],
      growthAreas: ['Manajemen hubungan perlu ditingkatkan'],
      recommendations: [
        'Ikuti pelatihan "Emotional Intelligence Workshop"',
        'Praktikkan active listening dalam komunikasi',
        'Kembangkan kemampuan negosiasi dan konflik resolution'
      ]
    },
    {
      id: 6,
      name: 'Kesehatan Mental & Psikologis',
      icon: Sparkles,
      color: '#9B59B6',
      score: 58.4,
      previousScore: 55.7,
      target: 75,
      percentile: 62,
      level: 'COMPETENT',
      subscores: {
        well_being: 60.2,
        resilience: 58.7,
        stress_management: 55.3,
        mindfulness: 62.4,
        trauma_healing: 58.9,
        academic_stress: 54.2,
        coping_strategies: 60.8,
        help_seeking: 57.3
      },
      strengths: ['Kemampuan coping yang baik', 'Mindfulness yang cukup'],
      growthAreas: ['Manajemen stres akademik perlu ditingkatkan'],
      recommendations: [
        'Ikuti program "Mindfulness for Students" di ITS',
        'Gunakan aplikasi meditation seperti Headspace atau Calm',
        'Konsultasikan dengan konselor jika stres berlanjut'
      ]
    },
    {
      id: 7,
      name: 'Karakter & Etika',
      icon: Shield,
      color: '#F1C40F',
      score: 65.2,
      previousScore: 62.8,
      target: 80,
      percentile: 70,
      level: 'COMPETENT',
      subscores: {
        integrity: 68.7,
        courage: 63.5,
        fairness: 68.8,
        responsibility: 65.3,
        humility: 59.4,
        compassion: 72.0,
        self_discipline: 62.5,
        ethical_reasoning: 64.8
      },
      strengths: ['Integritas yang kuat', 'Kasih sayang yang tinggi'],
      growthAreas: ['Kerendahan hati perlu dikembangkan'],
      recommendations: [
        'Ikuti workshop "Character Development Program"',
        'Praktikkan gratitude journaling',
        'Terlibat dalam kegiatan volunteerism'
      ]
    },
    {
      id: 8,
      name: 'Pengembangan Spiritual',
      icon: Sun,
      color: '#E67E22',
      score: 58.5,
      previousScore: 55.2,
      target: 75,
      percentile: 62,
      level: 'COMPETENT',
      subscores: {
        purpose_meaning: 60.2,
        gratitude_connection: 62.8,
        altruism_contribution: 52.5
      },
      strengths: ['Rasa syukur yang baik', 'Koneksi spiritual yang memadai'],
      growthAreas: ['Altruisme dan kontribusi perlu ditingkatkan'],
      recommendations: [
        'Ikuti kegiatan keagamaan atau spiritual secara teratur',
        'Praktikkan gratitude journaling',
        'Terlibat dalam kegiatan sosial dan komunitas'
      ]
    },
    {
      id: 9,
      name: 'Manajemen Lingkungan & Gaya Hidup',
      icon: Leaf,
      color: '#27AE60',
      score: 55.3,
      previousScore: 52.8,
      target: 75,
      percentile: 58,
      level: 'COMPETENT',
      subscores: {
        environmental_awareness: 58.7,
        sustainable_behavior: 52.3,
        work_life_balance: 58.4,
        digital_wellbeing: 54.2,
        minimalism: 50.8,
        community_engagement: 52.7,
        environmental_advocacy: 55.3,
        carbon_footprint_awareness: 55.8
      },
      strengths: ['Kesadaran lingkungan yang baik'],
      growthAreas: ['Perilaku berkelanjutan perlu ditingkatkan'],
      recommendations: [
        'Kurangi penggunaan plastik sekali pakai',
        'Gunakan transportasi publik atau sepeda',
        'Partisipasi dalam kegiatan lingkungan kampus'
      ]
    }
  ],
  badges: [
    { id: 'first_assessment', name: 'Pioneer', description: 'Menyelesaikan assessment pertama', icon: Award, earned: true },
    { id: 'balanced_development', name: 'Seimbang', description: 'Keseimbangan holistik > 70%', icon: Target, earned: true },
    { id: 'growth_mindset', name: 'Growth Mindset', description: 'Mindset berkembang > 75%', icon: Zap, earned: true },
    { id: 'financial_literacy', name: 'Financial Literate', description: 'Literasi finansial > 60%', icon: Wallet, earned: false },
    { id: 'physical_wellness', name: 'Physical Wellness', description: 'Kesehatan fisik > 70%', icon: Heart, earned: true },
    { id: 'social_intelligence', name: 'Social Intelligence', description: 'Kecerdasan sosial > 65%', icon: Users, earned: false },
    { id: 'mental_resilience', name: 'Mental Resilience', description: 'Resiliensi mental > 60%', icon: Sparkles, earned: true },
    { id: 'character_excellence', name: 'Character Excellence', description: 'Karakter > 70%', icon: Shield, earned: false },
    { id: 'spiritual_growth', name: 'Spiritual Growth', description: 'Pengembangan spiritual > 60%', icon: Sun, earned: false },
    { id: 'environmental_steward', name: 'Environmental Steward', description: 'Stewardship lingkungan > 60%', icon: Leaf, earned: false }
  ],
  xp: {
    current: 1250,
    nextLevel: 1500,
    level: 5,
    progress: 83
  }
};

const levelColors = {
  EXPERT: { bg: 'bg-green-500', text: 'text-green-50', border: 'border-green-600' },
  ADVANCED: { bg: 'bg-blue-500', text: 'text-blue-50', border: 'border-blue-600' },
  COMPETENT: { bg: 'bg-yellow-500', text: 'text-yellow-50', border: 'border-yellow-600' },
  DEVELOPING: { bg: 'bg-orange-500', text: 'text-orange-50', border: 'border-orange-600' },
  BEGINNER: { bg: 'bg-red-500', text: 'text-red-50', border: 'border-red-600' }
};

export default function AssessmentResultsPage() {
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getLevelColor = (level: string) => levelColors[level as keyof typeof levelColors] || levelColors.BEGINNER;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreChange = (current: number, previous: number) => {
    const change = current - previous;
    if (change > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${change.toFixed(1)}` };
    if (change < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${change.toFixed(1)}` };
    return { icon: null, color: 'text-gray-600', text: '0' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                Hasil Assessment Holistik
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Perkembangan 9 Dimensi Anda
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
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
        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Skor Holistik Anda</h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold">{mockAssessmentResults.overall.score}</span>
                    <span className="text-2xl opacity-80">/ 100</span>
                  </div>
                  <p className="text-lg opacity-90 mt-2">{mockAssessmentResults.overall.level}</p>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <p className="text-sm opacity-80">Percentile</p>
                    <p className="text-3xl font-bold">{mockAssessmentResults.overall.percentile}%</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Balance Index</p>
                    <p className="text-3xl font-bold">{mockAssessmentResults.overall.balanceIndex}%</p>
                  </div>
                </div>
              </div>
              <Alert className="mt-6 bg-white/20 border-white/30 text-white">
                <Lightbulb className="h-5 w-5" />
                <AlertTitle className="text-white">Interpretasi</AlertTitle>
                <AlertDescription className="text-white/90">
                  {mockAssessmentResults.overall.interpretation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Progress XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Level {mockAssessmentResults.xp.level}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {mockAssessmentResults.xp.current} / {mockAssessmentResults.xp.nextLevel} XP
                  </span>
                </div>
                <Progress value={mockAssessmentResults.xp.progress} className="h-3" />
                <div className="flex gap-2 flex-wrap">
                  {mockAssessmentResults.badges.filter(b => b.earned).map((badge) => (
                    <Badge key={badge.id} variant="secondary" className="gap-1">
                      <badge.icon className="h-4 w-4" />
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensi</TabsTrigger>
            <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAssessmentResults.dimensions.map((dimension, index) => {
                const Icon = dimension.icon;
                const levelColor = getLevelColor(dimension.level);
                const scoreChange = getScoreChange(dimension.score, dimension.previousScore);

                return (
                  <motion.div
                    key={dimension.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedDimension(dimension.id)}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg ${levelColor.bg}`}>
                            <Icon className={`h-8 w-8 ${levelColor.text}`} />
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Percentile</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {dimension.percentile}%
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                          {dimension.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className={`text-4xl font-bold ${getScoreColor(dimension.score)}`}>
                            {dimension.score}
                          </span>
                          <span className="text-sm text-slate-500">/ 100</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`${levelColor.bg} ${levelColor.text}`}>
                            {dimension.level}
                          </Badge>
                          {scoreChange.icon && (
                            <div className={`flex items-center gap-1 ${scoreChange.color}`}>
                              <scoreChange.icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{scoreChange.text}</span>
                            </div>
                          )}
                        </div>
                        <Progress
                          value={dimension.score}
                          className={`h-2 ${getProgressColor(dimension.score)}`}
                        />
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
              {mockAssessmentResults.dimensions.map((dimension, index) => {
                const Icon = dimension.icon;
                const levelColor = getLevelColor(dimension.level);

                return (
                  <motion.div
                    key={dimension.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${levelColor.bg}`}>
                            <Icon className={`h-6 w-6 ${levelColor.text}`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle>{dimension.name}</CardTitle>
                            <CardDescription>
                              Skor: {dimension.score}/100 | Percentile: {dimension.percentile}%
                            </CardDescription>
                          </div>
                          <Badge className={`${levelColor.bg} ${levelColor.text}`}>
                            {dimension.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Subscores */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Sub-dimensi</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(dimension.subscores).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                  {key.replace(/_/g, ' ')}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Progress value={value} className="flex-1 h-2" />
                                  <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                                    {value}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Kelebihan
                          </h4>
                          <ul className="space-y-1">
                            {dimension.strengths.map((strength, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-green-600 mt-0.5">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Growth Areas */}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            Area Pengembangan
                          </h4>
                          <ul className="space-y-1">
                            {dimension.growthAreas.map((area, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-orange-600 mt-0.5">•</span>
                                {area}
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
                            {dimension.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-blue-600 mt-0.5">{idx + 1}.</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Button */}
                        <Button className="w-full" variant="outline">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Lihat Detail Dimensi
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-6">
              <Alert>
                <AlertTitle>Rekomendasi Personal Berdasarkan Profil Anda</AlertTitle>
                <AlertDescription>
                  Berikut adalah rekomendasi yang dipersonalisasi berdasarkan hasil assessment Anda. Prioritaskan rekomendasi untuk dimensi dengan skor di bawah 60.
                </AlertDescription>
              </Alert>

              {mockAssessmentResults.dimensions
                .filter(d => d.score < 70)
                .sort((a, b) => a.score - b.score)
                .map((dimension, index) => {
                  const Icon = dimension.icon;
                  return (
                    <motion.div
                      key={dimension.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                              <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <CardTitle className="text-orange-900 dark:text-orange-100">
                                {dimension.name}
                              </CardTitle>
                              <CardDescription>
                                Prioritas Tinggi - Skor: {dimension.score}/100
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                              Area Pengembangan
                            </h4>
                            <ul className="space-y-1">
                              {dimension.growthAreas.map((area, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                  <span className="text-orange-600 mt-0.5">•</span>
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                              Rekomendasi Tindakan
                            </h4>
                            <ul className="space-y-2">
                              {dimension.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                  <span className="text-blue-600 mt-0.5">{idx + 1}.</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
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

          {/* Growth Tab */}
          <TabsContent value="growth" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Trajectory */}
              <Card>
                <CardHeader>
                  <CardTitle>Trajectory Perkembangan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Skor Saat Ini</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {mockAssessmentResults.overall.score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Skor Sebelumnya</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {mockAssessmentResults.dimensions.reduce((sum, d) => sum + d.previousScore, 0) / 9}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Target</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {mockAssessmentResults.dimensions.reduce((sum, d) => sum + d.target, 0) / 9}
                      </span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-semibold">
                          +{mockAssessmentResults.overall.score - mockAssessmentResults.dimensions.reduce((sum, d) => sum + d.previousScore, 0) / 9}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Peningkatan sejak assessment terakhir
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAssessmentResults.badges.map((badge) => (
                      <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className={`p-2 rounded-full ${badge.earned ? 'bg-purple-100 dark:bg-purple-900' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          <badge.icon className={`h-6 w-6 ${badge.earned ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {badge.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {badge.description}
                          </p>
                        </div>
                        {badge.earned ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600" />
                        )}
                      </div>
                    ))}
                  </div>
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
                        Selesaikan Assessment Berikutnya
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Lakukan assessment ulang dalam 3 bulan untuk melacak perkembangan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="p-2 rounded-full bg-purple-600 text-white">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Ikuti Program Pengembangan
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Daftar ke program yang direkomendasikan untuk dimensi yang perlu ditingkatkan
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
                        Gunakan fitur habit tracking untuk memantau perkembangan harian
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
        </Tabs>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-slate-200 dark:border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Butuh bantuan atau ingin diskusikan hasil assessment Anda?
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Lihat Panduan Assessment
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
