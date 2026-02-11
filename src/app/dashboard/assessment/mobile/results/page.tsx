/**
 * Mobile Assessment Results Page
 * 
 * Mobile-optimized results page with responsive design
 * for displaying assessment results with visualizations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResponsiveContainer,
  MobileNavigation,
  MobileCard,
  BottomNavigation,
  MobileModal,
  PullToRefresh,
  MobileStatsGrid
} from '@/components/mobile/MobileResponsive';
import {
  Brain,
  Target,
  TrendingUp,
  Heart,
  Sparkles,
  Shield,
  Award,
  Star,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  MessageCircle,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Info,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Flame,
  Clock,
  BookOpen,
  Users,
  Settings,
  Bell,
  User,
  Home,
  FileText,
  Maximize2,
  Minimize2,
  X,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface DimensionResult {
  id: number;
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
  score: number;
  percentile: number;
  level: string;
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  subScores: {
    [key: string]: number;
  };
}

interface OverallResult {
  totalScore: number;
  averageScore: number;
  completedDimensions: number;
  totalDimensions: number;
  improvement: number;
  rank: number;
  totalUsers: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const DIMENSION_RESULTS: DimensionResult[] = [
  {
    id: 1,
    name: 'Kognitif & Intelektual',
    nameEn: 'Cognitive & Intellectual',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-blue-500',
    score: 75,
    percentile: 82,
    level: 'Advanced',
    strengths: [
      'Kemampuan analisis yang kuat',
      'Growth mindset yang positif',
      'Kreativitas dalam pemecahan masalah'
    ],
    growthAreas: [
      'Perlu meningkatkan metakognisi',
      'Pengembangan berpikir kritis lebih lanjut'
    ],
    recommendations: [
      'Ikuti workshop "Critical Thinking for Engineers"',
      'Ambil kursus online "Metacognitive Strategies"',
      'Praktikkan journaling reflektif setiap minggu'
    ],
    subScores: {
      critical_thinking: 72,
      growth_mindset: 78,
      creativity: 68,
      metacognition: 70
    }
  },
  {
    id: 2,
    name: 'Manajemen Diri & Produktivitas',
    nameEn: 'Self-Management',
    icon: <Target className="w-6 h-6" />,
    color: 'bg-green-500',
    score: 68,
    percentile: 75,
    level: 'Competent',
    strengths: [
      'Sistem manajemen waktu yang baik',
      'Kontrol prokrastinasi yang efektif',
      'Self-control yang konsisten'
    ],
    growthAreas: [
      'Perlu meningkatkan kapasitas deep work',
      'Manajemen energi perlu ditingkatkan'
    ],
    recommendations: [
      'Coba teknik Pomodoro untuk deep work',
      'Implementasi sistem Eisenhower Matrix',
      'Gunakan aplikasi time tracking'
    ],
    subScores: {
      time_management: 72,
      procrastination: 65,
      self_control: 70,
      deep_work: 62,
      energy_management: 68,
      prioritization: 75
    }
  },
  {
    id: 3,
    name: 'Kecerdasan Finansial',
    nameEn: 'Financial Intelligence',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-yellow-500',
    score: 52,
    percentile: 45,
    level: 'Basic',
    strengths: [
      'Pengetahuan dasar tentang inflasi',
      'Kesadaran tentang pentingnya tabungan'
    ],
    growthAreas: [
      'Perlu meningkatkan literasi investasi',
      'Manajemen anggaran perlu ditingkatkan',
      'Perlu membangun dana darurat'
    ],
    recommendations: [
      'Ikuti kelas "Financial Literacy for Students"',
      'Buat anggaran bulanan dengan aplikasi',
      'Mulai investasi di reksadana pasar uang'
    ],
    subScores: {
      knowledge: 58,
      behavior: 48,
      self_efficacy: 50
    }
  },
  {
    id: 4,
    name: 'Kesehatan Fisik & Vitalitas',
    nameEn: 'Physical Health',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-red-500',
    score: 72,
    percentile: 78,
    level: 'Competent',
    strengths: [
      'Kualitas tidur yang baik',
      'Aktivitas fisik yang teratur',
      'Kesadaran tubuh yang baik'
    ],
    growthAreas: [
      'Perlu meningkatkan konsumsi sayur dan buah',
      'Hydration perlu ditingkatkan'
    ],
    recommendations: [
      'Targetkan 2 liter air per hari',
      'Tambahkan 1 porsi sayur setiap makan',
      'Lakukan stretching 10 menit setiap hari'
    ],
    subScores: {
      physical_activity: 70,
      sleep_quality: 75,
      nutrition: 65,
      vitality: 72,
      hydration: 68,
      stress_management: 70,
      preventive_care: 75,
      body_awareness: 78
    }
  },
  {
    id: 5,
    name: 'Kecerdasan Emosional & Sosial',
    nameEn: 'Emotional & Social',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-purple-500',
    score: 65,
    percentile: 70,
    level: 'Competent',
    strengths: [
      'Kesadaran emosi yang baik',
      'Empati yang kuat',
      'Keterampilan komunikasi yang efektif'
    ],
    growthAreas: [
      'Perlu meningkatkan regulasi emosi',
      'Keterampilan asertif perlu ditingkatkan'
    ],
    recommendations: [
      'Praktikkan teknik breathing untuk regulasi emosi',
      'Latih assertive communication',
      'Ikuti workshop "Emotional Intelligence"'
    ],
    subScores: {
      self_awareness: 70,
      social_awareness: 65,
      self_management: 60,
      relationship_management: 68
    }
  },
  {
    id: 6,
    name: 'Kesehatan Mental & Psikologis',
    nameEn: 'Mental Health',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-indigo-500',
    score: 70,
    percentile: 75,
    level: 'Competent',
    strengths: [
      'Kesejahteraan mental yang baik',
      'Ketahanan yang kuat',
      'Strategi coping yang efektif'
    ],
    growthAreas: [
      'Perlu meningkatkan mindfulness',
      'Manajemen stres akademik perlu ditingkatkan'
    ],
    recommendations: [
      'Praktikkan meditasi 10 menit setiap hari',
      'Gunakan aplikasi mindfulness',
      'Jadwalkan waktu istirahat teratur'
    ],
    subScores: {
      well_being: 72,
      resilience: 75,
      stress_management: 65,
      mindfulness: 60,
      trauma_healing: 70,
      academic_stress: 68,
      coping_strategies: 72,
      help_seeking: 70
    }
  },
  {
    id: 7,
    name: 'Karakter & Etika',
    nameEn: 'Character & Ethics',
    icon: <Award className="w-6 h-6" />,
    color: 'bg-orange-500',
    score: 78,
    percentile: 85,
    level: 'Advanced',
    strengths: [
      'Integritas yang tinggi',
      'Keberanian moral yang kuat',
      'Keadilan dalam pengambilan keputusan'
    ],
    growthAreas: [
      'Perlu meningkatkan kerendahan hati',
      'Penalaran etis kompleks perlu ditingkatkan'
    ],
    recommendations: [
      'Praktikkan active listening',
      'Pelajari etika dalam konteks profesional',
      'Refleksikan keputusan moral secara rutin'
    ],
    subScores: {
      integrity: 82,
      courage: 75,
      fairness: 78,
      responsibility: 80,
      humility: 70,
      compassion: 76,
      self_discipline: 75,
      ethical_reasoning: 78
    }
  },
  {
    id: 8,
    name: 'Pengembangan Spiritual',
    nameEn: 'Spiritual Development',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-amber-500',
    score: 62,
    percentile: 60,
    level: 'Competent',
    strengths: [
      'Rasa syukur yang kuat',
      'Koneksi dengan nilai-nilai spiritual',
      'Altruisme yang baik'
    ],
    growthAreas: [
      'Perlu mengklarifikasi tujuan hidup',
      'Praktik spiritual perlu lebih konsisten'
    ],
    recommendations: [
      'Tulis jurnal tujuan hidup',
      'Dedikasikan waktu untuk refleksi spiritual',
      'Ikuti komunitas spiritual'
    ],
    subScores: {
      purpose_meaning: 60,
      gratitude_connection: 65,
      altruism_contribution: 58
    }
  },
  {
    id: 9,
    name: 'Manajemen Lingkungan & Gaya Hidup',
    nameEn: 'Environmental & Lifestyle',
    icon: <Leaf className="w-6 h-6" />,
    color: 'bg-teal-500',
    score: 58,
    percentile: 55,
    level: 'Competent',
    strengths: [
      'Kesadaran lingkungan yang baik',
      'Keseimbangan kerja-hidup yang cukup',
      'Kontrol penggunaan digital'
    ],
    growthAreas: [
      'Perlu meningkatkan perilaku berkelanjutan',
      'Keterlibatan komunitas perlu ditingkatkan'
    ],
    recommendations: [
      'Kurangi penggunaan plastik sekali pakai',
      'Ikuti kegiatan komunitas lokal',
      'Gunakan transportasi umum lebih sering'
    ],
    subScores: {
      environmental_awareness: 65,
      sustainable_behavior: 55,
      work_life_balance: 60,
      digital_wellbeing: 58,
      minimalism: 52,
      community_engagement: 50,
      environmental_advocacy: 55,
      carbon_footprint_awareness: 60
    }
  }
];

const OVERALL_RESULT: OverallResult = {
  totalScore: 667,
  averageScore: 67,
  completedDimensions: 9,
  totalDimensions: 9,
  improvement: 5,
  rank: 234,
  totalUsers: 2000
};

const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
  { id: 'assessments', label: 'Assessment', icon: <FileText className="w-5 h-5" /> },
  { id: 'results', label: 'Hasil', icon: <BarChart3 className="w-5 h-5" />, badge: 9 },
  { id: 'learning', label: 'Pembelajaran', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> }
];

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'neutral' | 'down';
  trendValue?: string;
}

const STATS: StatItem[] = [
  { label: 'Skor Rata-rata', value: '67', icon: <TrendingUp className="w-5 h-5" />, trend: 'up', trendValue: '+5' },
  { label: 'Persentil', value: '72', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Peringkat', value: '234', icon: <Users className="w-5 h-5" /> },
  { label: 'Peningkatan', value: '+5', icon: <Zap className="w-5 h-5" />, trend: 'up' }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MobileResultsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDimension, setSelectedDimension] = useState<DimensionResult | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleDimensionClick = (dimension: DimensionResult) => {
    setSelectedDimension(dimension);
    setIsModalOpen(true);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Expert': 'bg-purple-100 text-purple-600',
      'Advanced': 'bg-blue-100 text-blue-600',
      'Competent': 'bg-green-100 text-green-600',
      'Developing': 'bg-yellow-100 text-yellow-600',
      'Beginner': 'bg-red-100 text-red-600'
    };
    return colors[level as keyof typeof colors] || colors.Competent;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold">Hasil Assessment</h1>
                <p className="text-xs text-gray-600">9 Dimensi Selesai</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <ResponsiveContainer maxWidth="lg">
          {/* Overall Score Card */}
          <Card className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold">Skor Holistik Anda</h2>
                  <p className="text-sm opacity-90">Perkembangan 9 dimensi</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{OVERALL_RESULT.averageScore}</div>
                  <div className="text-xs opacity-90">dari 100</div>
                </div>
              </div>
              <Progress value={OVERALL_RESULT.averageScore} className="h-3 bg-white/20" />
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{OVERALL_RESULT.improvement} poin dari sebelumnya</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Peringkat {OVERALL_RESULT.rank} dari {OVERALL_RESULT.totalUsers}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <MobileStatsGrid stats={STATS} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensi</TabsTrigger>
              <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              {/* Radar Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Visualisasi Holistik</CardTitle>
                  <CardDescription>
                    Radar chart menampilkan skor di semua 9 dimensi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Radar Chart</p>
                      <p className="text-xs text-gray-500">Visualisasi 9 dimensi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle>Keunggulan Utama</CardTitle>
                  <CardDescription>
                    3 dimensi dengan skor tertinggi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {DIMENSION_RESULTS
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((dimension, index) => (
                      <div key={dimension.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 ${dimension.color} rounded-lg text-white`}>
                          {dimension.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{dimension.name}</h4>
                            <span className={`text-lg font-bold ${getScoreColor(dimension.score)}`}>
                              {dimension.score}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Badge variant="secondary" className="text-xs">
                              {dimension.level}
                            </Badge>
                            <span>Persentil: {dimension.percentile}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Growth Areas */}
              <Card>
                <CardHeader>
                  <CardTitle>Area Pengembangan</CardTitle>
                  <CardDescription>
                    3 dimensi yang perlu ditingkatkan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {DIMENSION_RESULTS
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 3)
                    .map((dimension, index) => (
                      <div key={dimension.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 ${dimension.color} rounded-lg text-white`}>
                          {dimension.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{dimension.name}</h4>
                            <span className={`text-lg font-bold ${getScoreColor(dimension.score)}`}>
                              {dimension.score}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Badge variant="secondary" className="text-xs">
                              {dimension.level}
                            </Badge>
                            <span>Persentil: {dimension.percentile}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Semua Dimensi</CardTitle>
                  <CardDescription>
                    Klik pada dimensi untuk melihat detail lengkap
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DIMENSION_RESULTS.map(dimension => (
                      <MobileCard
                        key={dimension.id}
                        title={dimension.name}
                        description={dimension.nameEn}
                        icon={dimension.icon}
                        badge={`Skor: ${dimension.score}`}
                        progress={dimension.score}
                        onClick={() => handleDimensionClick(dimension)}
                      >
                        <div className="mt-3 flex items-center justify-between">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(dimension.level)}`}>
                            {dimension.level}
                          </div>
                          <div className="text-sm text-gray-600">
                            Persentil: {dimension.percentile}%
                          </div>
                        </div>
                      </MobileCard>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="mt-4 space-y-4">
              {DIMENSION_RESULTS.map(dimension => (
                <Card key={dimension.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${dimension.color} rounded-lg text-white`}>
                        {dimension.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{dimension.name}</CardTitle>
                        <CardDescription>
                          Skor: {dimension.score} | {dimension.level}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Keunggulan
                      </h4>
                      <ul className="space-y-1">
                        {dimension.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Growth Areas */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        Area Pengembangan
                      </h4>
                      <ul className="space-y-1">
                        {dimension.growthAreas.map((area, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5">•</span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        Rekomendasi
                      </h4>
                      <ul className="space-y-1">
                        {dimension.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">{index + 1}.</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </Button>
          </div>
        </ResponsiveContainer>

        {/* Bottom Navigation (Mobile Only) */}
        <BottomNavigation
          items={NAVIGATION_ITEMS}
          activeItem="results"
          onItemClick={(itemId) => console.log(itemId)}
        />

        {/* Dimension Detail Modal */}
        <MobileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedDimension?.name || 'Detail Dimensi'}
          size="lg"
        >
          {selectedDimension && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`p-4 ${selectedDimension.color} rounded-xl text-white`}>
                  {selectedDimension.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{selectedDimension.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDimension.nameEn}</p>
                </div>
              </div>

              {/* Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Skor Assessment</span>
                  <span className={`text-3xl font-bold ${getScoreColor(selectedDimension.score)}`}>
                    {selectedDimension.score}
                  </span>
                </div>
                <Progress value={selectedDimension.score} className="h-2" />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <span>Persentil: {selectedDimension.percentile}%</span>
                  <span className={`px-2 py-1 rounded ${getLevelColor(selectedDimension.level)}`}>
                    {selectedDimension.level}
                  </span>
                </div>
              </div>

              {/* Sub-scores */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Skor Sub-dimensi</h4>
                <div className="space-y-2">
                  {Object.entries(selectedDimension.subScores).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className={`font-semibold ${getScoreColor(value)}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Keunggulan
                </h4>
                <ul className="space-y-1">
                  {selectedDimension.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth Areas */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Area Pengembangan
                </h4>
                <ul className="space-y-1">
                  {selectedDimension.growthAreas.map((area, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Rekomendasi
                </h4>
                <ul className="space-y-1">
                  {selectedDimension.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">{index + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Simpan
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Diskusi
                </Button>
              </div>
            </div>
          )}
        </MobileModal>
      </div>
    </PullToRefresh>
  );
}
