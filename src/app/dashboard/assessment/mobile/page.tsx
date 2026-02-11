/**
 * Mobile Assessment Page
 * 
 * Mobile-optimized assessment page with responsive design
 * for all 9 dimensions of holistic development
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
  SwipeableCard,
  BottomNavigation,
  MobileModal,
  PullToRefresh,
  InfiniteScroll,
  MobileAssessmentCard,
  MobileQuiz,
  MobileStatsGrid,
  MobileActionSheet
} from '@/components/mobile/MobileResponsive';
import {
  Brain,
  Clock,
  Target,
  TrendingUp,
  Award,
  Flame,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Play,
  FileText,
  Star,
  Users,
  BarChart3,
  Zap,
  Heart,
  Leaf,
  Sparkles,
  Shield,
  Globe,
  Menu,
  X,
  Search,
  Filter,
  Grid,
  List,
  ArrowUp,
  ArrowDown,
  Info,
  Settings,
  Bell,
  User,
  Home,
  Download,
  Share2,
  Bookmark,
  MessageCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Fullscreen,
  SkipForward,
  SkipBack,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface AssessmentDimension {
  id: number;
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
  score?: number;
  status: 'not_started' | 'in_progress' | 'completed';
  items: number;
  timeEstimate: string;
  description: string;
}

interface AssessmentProgress {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const ASSESSMENT_DIMENSIONS: AssessmentDimension[] = [
  {
    id: 1,
    name: 'Kognitif & Intelektual',
    nameEn: 'Cognitive & Intellectual',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-blue-500',
    score: 75,
    status: 'completed',
    items: 8,
    timeEstimate: '10-15 menit',
    description: 'Mengukur kemampuan berpikir kritis, growth mindset, kreativitas, dan metakognisi'
  },
  {
    id: 2,
    name: 'Manajemen Diri & Produktivitas',
    nameEn: 'Self-Management',
    icon: <Target className="w-6 h-6" />,
    color: 'bg-green-500',
    score: 68,
    status: 'completed',
    items: 8,
    timeEstimate: '10-15 menit',
    description: 'Mengukur kemampuan manajemen waktu, kontrol prokrastinasi, dan self-control'
  },
  {
    id: 3,
    name: 'Kecerdasan Finansial',
    nameEn: 'Financial Intelligence',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-yellow-500',
    score: 52,
    status: 'in_progress',
    items: 8,
    timeEstimate: '12-18 menit',
    description: 'Mengukur literasi finansial, perilaku keuangan, dan efikasi diri finansial'
  },
  {
    id: 4,
    name: 'Kesehatan Fisik & Vitalitas',
    nameEn: 'Physical Health',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-red-500',
    score: 72,
    status: 'completed',
    items: 8,
    timeEstimate: '8-12 menit',
    description: 'Mengukur aktivitas fisik, kualitas tidur, nutrisi, dan vitalitas subjektif'
  },
  {
    id: 5,
    name: 'Kecerdasan Emosional & Sosial',
    nameEn: 'Emotional & Social',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-purple-500',
    score: 65,
    status: 'completed',
    items: 8,
    timeEstimate: '10-15 menit',
    description: 'Mengukur kesadaran diri, empati, regulasi emosi, dan keterampilan sosial'
  },
  {
    id: 6,
    name: 'Kesehatan Mental & Psikologis',
    nameEn: 'Mental Health',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-indigo-500',
    score: 70,
    status: 'completed',
    items: 8,
    timeEstimate: '10-15 menit',
    description: 'Mengukur kesejahteraan mental, ketahanan, manajemen stres, dan mindfulness'
  },
  {
    id: 7,
    name: 'Karakter & Etika',
    nameEn: 'Character & Ethics',
    icon: <Award className="w-6 h-6" />,
    color: 'bg-orange-500',
    score: 78,
    status: 'completed',
    items: 8,
    timeEstimate: '10-15 menit',
    description: 'Mengukur integritas, keberanian, keadilan, dan penalaran etis'
  },
  {
    id: 8,
    name: 'Pengembangan Spiritual',
    nameEn: 'Spiritual Development',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-amber-500',
    score: 62,
    status: 'not_started',
    items: 8,
    timeEstimate: '10-15 menit',
    description: 'Mengukur tujuan hidup, rasa syukur, koneksi spiritual, dan altruisme'
  },
  {
    id: 9,
    name: 'Manajemen Lingkungan & Gaya Hidup',
    nameEn: 'Environmental & Lifestyle',
    icon: <Leaf className="w-6 h-6" />,
    color: 'bg-teal-500',
    score: 58,
    status: 'not_started',
    items: 8,
    timeEstimate: '10-15 menit',
    description: 'Mengukur kesadaran lingkungan, perilaku berkelanjutan, dan keseimbangan kerja-hidup'
  }
];

const NAVIGATION_ITEMS = [
  { id: 'home', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
  { id: 'assessments', label: 'Assessment', icon: <FileText className="w-5 h-5" />, badge: 2 },
  { id: 'results', label: 'Hasil', icon: <BarChart3 className="w-5 h-5" /> },
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
  { label: 'Total Assessment', value: '9', icon: <FileText className="w-5 h-5" /> },
  { label: 'Selesai', value: '6', icon: <CheckCircle2 className="w-5 h-5" />, trend: 'up', trendValue: '+2' },
  { label: 'Sedang Berjalan', value: '1', icon: <Clock className="w-5 h-5" /> },
  { label: 'Rata-rata Skor', value: '67', icon: <TrendingUp className="w-5 h-5" />, trend: 'up', trendValue: '+5' }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MobileAssessmentPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDimension, setActiveDimension] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<AssessmentDimension | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleStartAssessment = (dimensionId: number) => {
    setActiveDimension(dimensionId);
    // Navigate to assessment page
    };

  const handleViewResults = (dimensionId: number) => {
    setActiveDimension(dimensionId);
    // Navigate to results page
    };

  const handleDimensionClick = (dimension: AssessmentDimension) => {
    setSelectedDimension(dimension);
    setIsModalOpen(true);
  };

  const filteredDimensions = ASSESSMENT_DIMENSIONS.filter(dim => {
    if (filterStatus === 'all') return true;
    return dim.status === filterStatus;
  });

  const calculateProgress = (): AssessmentProgress => {
    const total = ASSESSMENT_DIMENSIONS.length;
    const completed = ASSESSMENT_DIMENSIONS.filter(d => d.status === 'completed').length;
    const inProgress = ASSESSMENT_DIMENSIONS.filter(d => d.status === 'in_progress').length;
    const notStarted = ASSESSMENT_DIMENSIONS.filter(d => d.status === 'not_started').length;

    return { total, completed, inProgress, notStarted };
  };

  const progress = calculateProgress();
  const overallProgress = Math.round((progress.completed / progress.total) * 100);

  return (
    <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">Assessment</h1>
              <p className="text-xs text-gray-600">9 Dimensi Holistik</p>
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
          {/* Progress Overview */}
          <Card className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold">Progress Assessment</h2>
                  <p className="text-sm opacity-90">Lanjutkan perjalanan pengembangan Anda</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{overallProgress}%</div>
                  <div className="text-xs opacity-90">{progress.completed}/{progress.total} Selesai</div>
                </div>
              </div>
              <Progress value={overallProgress} className="h-3 bg-white/20" />
              <div className="flex justify-between mt-2 text-xs opacity-90">
                <span>Belum Dimulai: {progress.notStarted}</span>
                <span>Sedang Berjalan: {progress.inProgress}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <MobileStatsGrid stats={STATS} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessments">Assessment</TabsTrigger>
              <TabsTrigger value="results">Hasil</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dimensi Assessment</CardTitle>
                  <CardDescription>
                    Pilih dimensi untuk memulai atau melihat hasil assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filter Buttons */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {[
                      { id: 'all', label: 'Semua' },
                      { id: 'completed', label: 'Selesai' },
                      { id: 'in_progress', label: 'Berjalan' },
                      { id: 'not_started', label: 'Belum' }
                    ].map(filter => (
                      <Button
                        key={filter.id}
                        variant={filterStatus === filter.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus(filter.id as any)}
                        className="flex-shrink-0"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex justify-end mb-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow' : ''
                          }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow' : ''
                          }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dimensions Grid/List */}
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
                    {filteredDimensions.map(dimension => (
                      <MobileAssessmentCard
                        key={dimension.id}
                        dimensionId={dimension.id}
                        dimensionName={dimension.name}
                        score={dimension.score}
                        status={dimension.status}
                        icon={dimension.icon}
                        onStart={() => handleStartAssessment(dimension.id)}
                        onViewResults={() => handleViewResults(dimension.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Aktif</CardTitle>
                  <CardDescription>
                    Assessment yang sedang berjalan atau belum dimulai
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ASSESSMENT_DIMENSIONS
                    .filter(d => d.status !== 'completed')
                    .map(dimension => (
                      <SwipeableCard
                        key={dimension.id}
                        leftAction={{
                          icon: <Play className="w-6 h-6" />,
                          label: 'Mulai',
                          color: 'bg-blue-500'
                        }}
                        rightAction={{
                          icon: <Info className="w-6 h-6" />,
                          label: 'Detail',
                          color: 'bg-gray-500'
                        }}
                        onSwipeLeft={() => handleDimensionClick(dimension)}
                        onSwipeRight={() => handleStartAssessment(dimension.id)}
                      >
                        <MobileCard
                          title={dimension.name}
                          description={dimension.description}
                          icon={dimension.icon}
                          badge={dimension.status === 'in_progress' ? 'Sedang Berjalan' : 'Belum Dimulai'}
                          onClick={() => handleDimensionClick(dimension)}
                        >
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{dimension.timeEstimate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="w-4 h-4" />
                              <span>{dimension.items} pertanyaan</span>
                            </div>
                          </div>
                        </MobileCard>
                      </SwipeableCard>
                    ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hasil Assessment</CardTitle>
                  <CardDescription>
                    Ringkasan hasil dari assessment yang telah selesai
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ASSESSMENT_DIMENSIONS
                    .filter(d => d.status === 'completed')
                    .map(dimension => (
                      <MobileCard
                        key={dimension.id}
                        title={dimension.name}
                        description={dimension.description}
                        icon={dimension.icon}
                        badge={`Skor: ${dimension.score}`}
                        progress={dimension.score}
                        onClick={() => handleViewResults(dimension.id)}
                      >
                        <div className="mt-3 flex items-center justify-between">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${(dimension.score || 0) >= 70 ? 'bg-green-100 text-green-600' :
                            (dimension.score || 0) >= 50 ? 'bg-yellow-100 text-yellow-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                            {(dimension.score || 0) >= 70 ? 'Baik' :
                              (dimension.score || 0) >= 50 ? 'Cukup' : 'Perlu Perbaikan'}
                          </div>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Detail
                          </Button>
                        </div>
                      </MobileCard>
                    ))}
                </CardContent>
              </Card>

              {/* Overall Score Card */}
              <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Skor Rata-rata</h3>
                      <p className="text-sm opacity-90">Semua Dimensi</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">67</div>
                      <div className="text-xs opacity-90">dari 100</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">+5 poin dari assessment sebelumnya</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ResponsiveContainer>

        {/* Bottom Navigation (Mobile Only) */}
        <BottomNavigation
          items={NAVIGATION_ITEMS}
          activeItem="assessments"
          onItemClick={(itemId) => console.log(itemId)}
        />

        {/* Dimension Detail Modal */}
        <MobileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedDimension?.name || 'Detail Assessment'}
          size="lg"
        >
          {selectedDimension && (
            <div className="space-y-4">
              {/* Icon and Description */}
              <div className="flex items-start gap-4">
                <div className={`p-4 ${selectedDimension.color} rounded-xl text-white`}>
                  {selectedDimension.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{selectedDimension.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDimension.description}</p>
                </div>
              </div>

              {/* Score */}
              {selectedDimension.score && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Skor Assessment</span>
                    <span className="text-2xl font-bold">{selectedDimension.score}</span>
                  </div>
                  <Progress value={selectedDimension.score} className="h-2" />
                  <div className="mt-2 text-xs text-gray-600">
                    {selectedDimension.score >= 70 ? 'Baik - Di atas rata-rata' :
                      selectedDimension.score >= 50 ? 'Cukup - Sesuai standar' :
                        'Perlu Perbaikan - Di bawah standar'}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-medium">Jumlah Item</span>
                  </div>
                  <div className="text-lg font-bold">{selectedDimension.items}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Estimasi Waktu</span>
                  </div>
                  <div className="text-lg font-bold">{selectedDimension.timeEstimate}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {selectedDimension.status === 'not_started' && (
                  <Button
                    onClick={() => {
                      handleStartAssessment(selectedDimension.id);
                      setIsModalOpen(false);
                    }}
                    className="flex-1"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Mulai Assessment
                  </Button>
                )}
                {selectedDimension.status === 'in_progress' && (
                  <Button
                    onClick={() => {
                      handleStartAssessment(selectedDimension.id);
                      setIsModalOpen(false);
                    }}
                    className="flex-1"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Lanjutkan
                  </Button>
                )}
                {selectedDimension.status === 'completed' && (
                  <Button
                    onClick={() => {
                      handleViewResults(selectedDimension.id);
                      setIsModalOpen(false);
                    }}
                    className="flex-1"
                    size="lg"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Lihat Hasil
                  </Button>
                )}
                <Button
                  onClick={() => setIsActionSheetOpen(true)}
                  variant="outline"
                  size="lg"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </MobileModal>

        {/* Action Sheet */}
        <MobileActionSheet
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
          title="Opsi Lainnya"
          actions={[
            { id: 'share', label: 'Bagikan Hasil', icon: <Share2 className="w-5 h-5" /> },
            { id: 'download', label: 'Download PDF', icon: <Download className="w-5 h-5" /> },
            { id: 'bookmark', label: 'Simpan ke Bookmark', icon: <Bookmark className="w-5 h-5" /> },
            { id: 'feedback', label: 'Beri Feedback', icon: <MessageCircle className="w-5 h-5" /> },
            { id: 'reset', label: 'Reset Assessment', icon: <RotateCcw className="w-5 h-5" />, destructive: true }
          ]}
        />
      </div>
    </PullToRefresh>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function MoreVertical({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
