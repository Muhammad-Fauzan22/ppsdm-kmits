/**
 * Educational Content Components for Assessment Dimensions
 * 
 * Provides learning modules, resources, and interactive exercises
 * for all 9 dimensions of holistic development
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Video,
  FileText,
  Download,
  Play,
  CheckCircle2,
  Clock,
  Users,
  Award,
  TrendingUp,
  Lightbulb,
  Target,
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  resources: Resource[];
  exercises: Exercise[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  completed: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'article' | 'tool';
  url: string;
  size?: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'reflection' | 'practice' | 'assessment' | 'project';
  xp: number;
  completed: boolean;
}

interface EducationalContentProps {
  dimensionId: number;
  dimensionName: string;
  dimensionSlug: string;
  userLevel: string;
  onModuleStart?: (moduleId: string) => void;
  onLessonComplete?: (lessonId: string) => void;
  onExerciseComplete?: (exerciseId: string) => void;
}

// ============================================================================
// LEARNING MODULE CARD COMPONENT
// ============================================================================

export function LearningModuleCard({
  module,
  onStart,
  onLessonComplete,
  onExerciseComplete
}: {
  module: LearningModule;
  onStart?: (moduleId: string) => void;
  onLessonComplete?: (lessonId: string) => void;
  onExerciseComplete?: (exerciseId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const completedLessons = module.lessons.filter(l => l.completed).length;
  const progress = (completedLessons / module.lessons.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: 'Pemula',
      intermediate: 'Menengah',
      advanced: 'Lanjutan'
    };
    return labels[difficulty as keyof typeof labels] || labels.beginner;
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <Badge className={getDifficultyColor(module.difficulty)}>
                {getDifficultyLabel(module.difficulty)}
              </Badge>
            </div>
            <CardDescription className="text-base">
              {module.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▲' : '▼'}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="font-semibold">{completedLessons}/{module.lessons.length} Selesai</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6">
          {/* Lessons */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Pelajaran
            </h3>
            <div className="space-y-3">
              {module.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${lesson.completed
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  onClick={() => !lesson.completed && onLessonComplete?.(lesson.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}>
                      {lesson.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{lesson.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.duration}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {lesson.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Play className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sumber Daya Tambahan
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {module.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${resource.type === 'pdf' ? 'bg-red-100 text-red-600' :
                    resource.type === 'video' ? 'bg-blue-100 text-blue-600' :
                      resource.type === 'article' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                    }`}>
                    {resource.type === 'pdf' && <FileText className="w-5 h-5" />}
                    {resource.type === 'video' && <Video className="w-5 h-5" />}
                    {resource.type === 'article' && <BookOpen className="w-5 h-5" />}
                    {resource.type === 'tool' && <Lightbulb className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{resource.title}</h4>
                    {resource.size && (
                      <p className="text-xs text-gray-500">{resource.size}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          <Separator />

          {/* Exercises */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Latihan & Tugas
            </h3>
            <div className="space-y-3">
              {module.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${exercise.completed
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${exercise.completed ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}>
                      {exercise.completed ? '✓' : '!'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{exercise.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {exercise.type}
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          +{exercise.xp} XP
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {!exercise.completed && (
                    <Button size="sm" onClick={() => onExerciseComplete?.(exercise.id)}>
                      Mulai
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ============================================================================
// EDUCATIONAL CONTENT MAIN COMPONENT
// ============================================================================

export function EducationalContent({
  dimensionId,
  dimensionName,
  dimensionSlug,
  userLevel,
  onModuleStart,
  onLessonComplete,
  onExerciseComplete
}: EducationalContentProps) {
  const [activeTab, setActiveTab] = useState('modules');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Mock data - In production, this would come from API
  const modules: LearningModule[] = getModulesForDimension(dimensionId);
  const stats = {
    totalModules: modules.length,
    completedModules: modules.filter(m => m.lessons.every(l => l.completed)).length,
    totalLessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
    completedLessons: modules.reduce((sum, m) => sum + m.lessons.filter(l => l.completed).length, 0),
    totalXP: modules.reduce((sum, m) => sum + m.exercises.filter(e => e.completed).reduce((xpSum, e) => xpSum + e.xp, 0), 0)
  };

  const getRecommendedModules = () => {
    if (userLevel === 'BEGINNER' || userLevel === 'DEVELOPING') {
      return modules.filter(m => m.difficulty === 'beginner');
    } else if (userLevel === 'COMPETENT' || userLevel === 'AVERAGE') {
      return modules.filter(m => m.difficulty === 'intermediate');
    }
    return modules.filter(m => m.difficulty === 'advanced');
  };

  const recommendedModules = getRecommendedModules();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Konten Edukasi: {dimensionName}
          </CardTitle>
          <CardDescription>
            Pelajari dan kembangkan kemampuan Anda di dimensi ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Modul Selesai</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.completedModules}/{stats.totalModules}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Pelajaran Selesai</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedLessons}/{stats.totalLessons}
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">XP Diperoleh</div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.totalXP}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Level Saat Ini</div>
              <div className="text-lg font-bold text-purple-600">
                {userLevel}
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress Keseluruhan</span>
              <span className="font-semibold">
                {Math.round((stats.completedLessons / stats.totalLessons) * 100)}%
              </span>
            </div>
            <Progress
              value={(stats.completedLessons / stats.totalLessons) * 100}
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules" className="data-[state=active]:bg-blue-50">
            <BookOpen className="w-4 h-4 mr-2" />
            Modul Pembelajaran
          </TabsTrigger>
          <TabsTrigger value="recommended" className="data-[state=active]:bg-green-50">
            <TrendingUp className="w-4 h-4 mr-2" />
            Rekomendasi
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-purple-50">
            <FileText className="w-4 h-4 mr-2" />
            Sumber Daya
          </TabsTrigger>
        </TabsList>

        {/* All Modules Tab */}
        <TabsContent value="modules" className="mt-6">
          <div className="space-y-6">
            {modules.map((module) => (
              <LearningModuleCard
                key={module.id}
                module={module}
                onStart={onModuleStart}
                onLessonComplete={onLessonComplete}
                onExerciseComplete={onExerciseComplete}
              />
            ))}
          </div>
        </TabsContent>

        {/* Recommended Tab */}
        <TabsContent value="recommended" className="mt-6">
          {recommendedModules.length > 0 ? (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-lg">Rekomendasi Berdasarkan Level Anda</h3>
                </div>
                <p className="text-gray-700">
                  Berdasarkan skor assessment Anda ({userLevel}), kami merekomendasikan modul berikut:
                </p>
              </div>
              {recommendedModules.map((module) => (
                <LearningModuleCard
                  key={module.id}
                  module={module}
                  onStart={onModuleStart}
                  onLessonComplete={onLessonComplete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Selamat!</p>
              <p className="text-sm mt-2">Anda telah menyelesaikan semua modul yang tersedia</p>
            </div>
          )}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.flatMap(m => m.resources).map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className={`p-3 rounded-lg mb-3 ${resource.type === 'pdf' ? 'bg-red-100 text-red-600' :
                    resource.type === 'video' ? 'bg-blue-100 text-blue-600' :
                      resource.type === 'article' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                    }`}>
                    {resource.type === 'pdf' && <FileText className="w-8 h-8" />}
                    {resource.type === 'video' && <Video className="w-8 h-8" />}
                    {resource.type === 'article' && <BookOpen className="w-8 h-8" />}
                    {resource.type === 'tool' && <Lightbulb className="w-8 h-8" />}
                  </div>
                  <h4 className="font-semibold mb-2">{resource.title}</h4>
                  {resource.size && (
                    <p className="text-sm text-gray-500 mb-3">{resource.size}</p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download / Buka
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="flex-1" size="lg">
          <Play className="w-4 h-4 mr-2" />
          Lanjutkan Belajar
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          <Users className="w-4 h-4 mr-2" />
          Diskusi dengan Teman
        </Button>
        <Button variant="outline" size="lg">
          <Award className="w-4 h-4 mr-2" />
          Lihat Badges
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getModulesForDimension(dimensionId: number): LearningModule[] {
  // In production, this would fetch from API
  // For now, returning mock data based on dimension

  const moduleTemplates: Record<number, LearningModule[]> = {
    1: [ // Cognitive
      {
        id: 'cog_1',
        title: 'Dasar Berpikir Kritis',
        description: 'Pelajari teknik dasar untuk menganalisis informasi secara kritis dan objektif',
        duration: '2 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'cog_1_1', title: 'Pengenalan Berpikir Kritis', description: 'Memahami konsep dasar berpikir kritis', duration: '15 menit', type: 'video', completed: false },
          { id: 'cog_1_2', title: 'Mengidentifikasi Bias', description: 'Belajar mengenali bias kognitif dalam argumen', duration: '20 menit', type: 'reading', completed: false },
          { id: 'cog_1_3', title: 'Evaluasi Bukti', description: 'Teknik mengevaluasi kredibilitas sumber informasi', duration: '25 menit', type: 'interactive', completed: false },
          { id: 'cog_1_4', title: 'Kuis: Berpikir Kritis', description: 'Uji pemahaman Anda tentang berpikir kritis', duration: '15 menit', type: 'quiz', completed: false }
        ],
        resources: [
          { id: 'cog_1_r1', title: 'Panduan Berpikir Kritis PDF', type: 'pdf', url: '#', size: '2.5 MB' },
          { id: 'cog_1_r2', title: 'Video: Studi Kasus', type: 'video', url: '#' },
          { id: 'cog_1_r3', title: 'Artikel: Bias Kognitif', type: 'article', url: '#' }
        ],
        exercises: [
          { id: 'cog_1_e1', title: 'Analisis Artikel Berita', description: 'Analisis sebuah artikel berita menggunakan teknik berpikir kritis', type: 'practice', xp: 50, completed: false },
          { id: 'cog_1_e2', title: 'Refleksi Harian', description: 'Tulis refleksi harian tentang keputusan yang Anda buat', type: 'reflection', xp: 30, completed: false }
        ]
      },
      {
        id: 'cog_2',
        title: 'Mengembangkan Growth Mindset',
        description: 'Ubah cara berpikir Anda untuk melihat tantangan sebagai peluang belajar',
        duration: '3 jam',
        difficulty: 'intermediate',
        lessons: [
          { id: 'cog_2_1', title: 'Fixed vs Growth Mindset', description: 'Memahami perbedaan antara dua tipe mindset', duration: '20 menit', type: 'video', completed: false },
          { id: 'cog_2_2', title: 'Kekuatan Neuroplastisitas', description: 'Bagaimana otak beradaptasi dan belajar', duration: '25 menit', type: 'reading', completed: false },
          { id: 'cog_2_3', title: 'Mengubah Self-Talk', description: 'Teknik untuk mengubah percakapan diri yang negatif', duration: '30 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'cog_2_r1', title: 'Worksheet Growth Mindset', type: 'pdf', url: '#', size: '1.8 MB' },
          { id: 'cog_2_r2', title: 'Audio: Affirmasi Positif', type: 'tool', url: '#' }
        ],
        exercises: [
          { id: 'cog_2_e1', title: 'Tantangan 7 Hari', description: 'Ambil satu tantangan baru setiap hari selama 7 hari', type: 'practice', xp: 100, completed: false },
          { id: 'cog_2_e2', title: 'Jurnal Mindset', description: 'Catat perubahan mindset Anda selama 2 minggu', type: 'reflection', xp: 50, completed: false }
        ]
      }
    ],
    2: [ // Self-Management
      {
        id: 'sm_1',
        title: 'Manajemen Waktu Efektif',
        description: 'Pelajari teknik manajemen waktu untuk meningkatkan produktivitas',
        duration: '2.5 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'sm_1_1', title: 'Matriks Eisenhower', description: 'Prioritaskan tugas berdasarkan urgensi dan kepentingan', duration: '20 menit', type: 'video', completed: false },
          { id: 'sm_1_2', title: 'Teknik Pomodoro', description: 'Metode fokus dengan interval waktu', duration: '15 menit', type: 'reading', completed: false },
          { id: 'sm_1_3', title: 'Time Blocking', description: 'Blokir waktu untuk tugas spesifik', duration: '25 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'sm_1_r1', title: 'Template Jadwal Mingguan', type: 'pdf', url: '#', size: '1.2 MB' },
          { id: 'sm_1_r2', title: 'Tool: Time Tracker', type: 'tool', url: '#' }
        ],
        exercises: [
          { id: 'sm_1_e1', title: 'Buat Jadwal Mingguan', description: 'Buat dan ikuti jadwal mingguan Anda', type: 'practice', xp: 50, completed: false },
          { id: 'sm_1_e2', title: 'Audit Waktu', description: 'Catat penggunaan waktu Anda selama 3 hari', type: 'reflection', xp: 40, completed: false }
        ]
      },
      {
        id: 'sm_2',
        title: 'Mengatasi Prokrastinasi',
        description: 'Strategi praktis untuk menghentikan kebiasaan menunda-nunda',
        duration: '3 jam',
        difficulty: 'intermediate',
        lessons: [
          { id: 'sm_2_1', title: 'Memahami Prokrastinasi', description: 'Mengapa kita menunda dan dampaknya', duration: '20 menit', type: 'video', completed: false },
          { id: 'sm_2_2', title: 'Trigger Prokrastinasi', description: 'Identifikasi pemicu kebiasaan menunda', duration: '25 menit', type: 'interactive', completed: false },
          { id: 'sm_2_3', title: 'Teknik Anti-Prokrastinasi', description: 'Strategi untuk mulai sekarang', duration: '30 menit', type: 'reading', completed: false }
        ],
        resources: [
          { id: 'sm_2_r1', title: 'Worksheet: Identifikasi Trigger', type: 'pdf', url: '#', size: '2.0 MB' },
          { id: 'sm_2_r2', title: 'Video: Studi Kasus', type: 'video', url: '#' }
        ],
        exercises: [
          { id: 'sm_2_e1', title: 'Tantangan 5 Menit', description: 'Mulai tugas dalam 5 menit setiap hari', type: 'practice', xp: 75, completed: false },
          { id: 'sm_2_e2', title: 'Jurnal Prokrastinasi', description: 'Catat kapan dan mengapa Anda menunda', type: 'reflection', xp: 50, completed: false }
        ]
      }
    ],
    3: [ // Financial
      {
        id: 'fin_1',
        title: 'Dasar Literasi Finansial',
        description: 'Pelajari konsep dasar keuangan pribadi',
        duration: '2 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'fin_1_1', title: 'Pengenalan Literasi Finansial', description: 'Apa itu literasi finansial dan mengapa penting', duration: '15 menit', type: 'video', completed: false },
          { id: 'fin_1_2', title: 'Inflasi dan Daya Beli', description: 'Memahami dampak inflasi terhadap uang Anda', duration: '20 menit', type: 'reading', completed: false },
          { id: 'fin_1_3', title: 'Bunga Majemuk', description: 'Bagaimana bunga bekerja untuk dan melawan Anda', duration: '25 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'fin_1_r1', title: 'Kalkulator Bunga', type: 'tool', url: '#' },
          { id: 'fin_1_r2', title: 'Panduan: Budget Dasar', type: 'pdf', url: '#', size: '3.0 MB' }
        ],
        exercises: [
          { id: 'fin_1_e1', title: 'Buat Budget Sederhana', description: 'Buat budget bulanan pertama Anda', type: 'practice', xp: 50, completed: false },
          { id: 'fin_1_e2', title: 'Hitung Inflasi', description: 'Hitung dampak inflasi pada pengeluaran Anda', type: 'practice', xp: 40, completed: false }
        ]
      },
      {
        id: 'fin_2',
        title: 'Investasi untuk Pemula',
        description: 'Panduan dasar untuk mulai berinvestasi',
        duration: '3 jam',
        difficulty: 'intermediate',
        lessons: [
          { id: 'fin_2_1', title: 'Jenis Investasi', description: 'Saham, obligasi, reksadana, dan lainnya', duration: '25 menit', type: 'video', completed: false },
          { id: 'fin_2_2', title: 'Profil Risiko', description: 'Memahami toleransi risiko Anda', duration: '20 menit', type: 'interactive', completed: false },
          { id: 'fin_2_3', title: 'Diversifikasi', description: 'Mengapa dan bagaimana mendiversifikasi portofolio', duration: '30 menit', type: 'reading', completed: false }
        ],
        resources: [
          { id: 'fin_2_r1', title: 'Kalkulator Investasi', type: 'tool', url: '#' },
          { id: 'fin_2_r2', title: 'E-Book: Panduan Investasi', type: 'pdf', url: '#', size: '4.5 MB' }
        ],
        exercises: [
          { id: 'fin_2_e1', title: 'Simulasi Portofolio', description: 'Buat portofolio simulasi dan lacak performa', type: 'practice', xp: 100, completed: false },
          { id: 'fin_2_e2', title: 'Riset Investasi', description: 'Riset satu jenis investasi yang menarik', type: 'practice', xp: 75, completed: false }
        ]
      }
    ],
    4: [ // Physical Health
      {
        id: 'phy_1',
        title: 'Kesehatan Fisik Dasar',
        description: 'Panduan untuk menjaga kesehatan fisik yang optimal',
        duration: '2 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'phy_1_1', title: 'Pentingnya Aktivitas Fisik', description: 'Manfaat olahraga untuk kesehatan dan produktivitas', duration: '15 menit', type: 'video', completed: false },
          { id: 'phy_1_2', title: 'Kualitas Tidur', description: 'Tips untuk tidur yang berkualitas', duration: '20 menit', type: 'reading', completed: false },
          { id: 'phy_1_3', title: 'Nutrisi Seimbang', description: 'Prinsip dasar nutrisi seimbang', duration: '25 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'phy_1_r1', title: 'Rutine Olahraga PDF', type: 'pdf', url: '#', size: '2.2 MB' },
          { id: 'phy_1_r2', title: 'Video: Latihan di Rumah', type: 'video', url: '#' }
        ],
        exercises: [
          { id: 'phy_1_e1', title: 'Tantangan 7 Hari Olahraga', description: 'Lakukan aktivitas fisik minimal 30 menit/hari', type: 'practice', xp: 70, completed: false },
          { id: 'phy_1_e2', title: 'Jurnal Tidur', description: 'Catat pola tidur Anda selama 1 minggu', type: 'reflection', xp: 40, completed: false }
        ]
      }
    ],
    5: [ // Emotional-Social
      {
        id: 'emo_1',
        title: 'Kecerdasan Emosional Dasar',
        description: 'Pelajari untuk mengenali dan mengelola emosi Anda',
        duration: '2.5 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'emo_1_1', title: 'Mengenali Emosi', description: 'Teknik untuk mengidentifikasi emosi Anda', duration: '20 menit', type: 'video', completed: false },
          { id: 'emo_1_2', title: 'Regulasi Emosi', description: 'Strategi untuk mengelola emosi yang kuat', duration: '25 menit', type: 'interactive', completed: false },
          { id: 'emo_1_3', title: 'Empati', description: 'Mengembangkan kemampuan empati', duration: '20 menit', type: 'reading', completed: false }
        ],
        resources: [
          { id: 'emo_1_r1', title: 'Worksheet: Identifikasi Emosi', type: 'pdf', url: '#', size: '1.8 MB' },
          { id: 'emo_1_r2', title: 'Audio: Meditasi Emosi', type: 'tool', url: '#' }
        ],
        exercises: [
          { id: 'emo_1_e1', title: 'Jurnal Emosi Harian', description: 'Catat emosi yang Anda rasakan setiap hari', type: 'reflection', xp: 50, completed: false },
          { id: 'emo_1_e2', title: 'Latihan Empati', description: 'Praktikkan empati dalam 3 interaksi', type: 'practice', xp: 60, completed: false }
        ]
      }
    ],
    6: [ // Mental Health
      {
        id: 'mh_1',
        title: 'Kesehatan Mental Dasar',
        description: 'Panduan untuk menjaga kesehatan mental yang baik',
        duration: '2 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'mh_1_1', title: 'Memahami Kesehatan Mental', description: 'Apa itu kesehatan mental dan mengapa penting', duration: '15 menit', type: 'video', completed: false },
          { id: 'mh_1_2', title: 'Manajemen Stres', description: 'Teknik dasar untuk mengelola stres', duration: '20 menit', type: 'reading', completed: false },
          { id: 'mh_1_3', title: 'Mindfulness', description: 'Pengenalan praktik mindfulness', duration: '25 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'mh_1_r1', title: 'Panduan Mindfulness PDF', type: 'pdf', url: '#', size: '2.0 MB' },
          { id: 'mh_1_r2', title: 'Audio: Meditasi Terpandu', type: 'tool', url: '#' }
        ],
        exercises: [
          { id: 'mh_1_e1', title: 'Tantangan 5 Menit Mindfulness', description: 'Lakukan mindfulness 5 menit/hari selama 7 hari', type: 'practice', xp: 70, completed: false },
          { id: 'mh_1_e2', title: 'Jurnal Stres', description: 'Catat sumber stres dan cara mengatasinya', type: 'reflection', xp: 50, completed: false }
        ]
      }
    ],
    7: [ // Character
      {
        id: 'char_1',
        title: 'Pengembangan Karakter Dasar',
        description: 'Pelajari untuk mengembangkan karakter yang kuat',
        duration: '2.5 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'char_1_1', title: 'Integritas', description: 'Mengapa integritas penting dan bagaimana membangunnya', duration: '20 menit', type: 'video', completed: false },
          { id: 'char_1_2', title: 'Tanggung Jawab', description: 'Mengembangkan rasa tanggung jawab', duration: '25 menit', type: 'reading', completed: false },
          { id: 'char_1_3', title: 'Kejujuran', description: 'Praktik kejujuran dalam kehidupan sehari-hari', duration: '20 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'char_1_r1', title: 'Worksheet: Nilai Pribadi', type: 'pdf', url: '#', size: '1.5 MB' },
          { id: 'char_1_r2', title: 'Video: Studi Kasus Etika', type: 'video', url: '#' }
        ],
        exercises: [
          { id: 'char_1_e1', title: 'Tantangan Kejujuran', description: 'Lakukan satu tindakan jujur setiap hari', type: 'practice', xp: 50, completed: false },
          { id: 'char_1_e2', title: 'Refleksi Nilai', description: 'Tulis tentang nilai yang paling penting bagi Anda', type: 'reflection', xp: 40, completed: false }
        ]
      }
    ],
    8: [ // Spiritual
      {
        id: 'spi_1',
        title: 'Pengembangan Spiritual Dasar',
        description: 'Pelajari untuk menemukan makna dan tujuan hidup',
        duration: '2 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'spi_1_1', title: 'Makna Hidup', description: 'Mencari dan menemukan makna dalam hidup', duration: '20 menit', type: 'video', completed: false },
          { id: 'spi_1_2', title: 'Rasa Syukur', description: 'Mengembangkan rasa syukur sehari-hari', duration: '15 menit', type: 'reading', completed: false },
          { id: 'spi_1_3', title: 'Meditasi dan Refleksi', description: 'Praktik meditasi dan refleksi diri', duration: '25 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'spi_1_r1', title: 'Panduan Meditasi PDF', type: 'pdf', url: '#', size: '2.2 MB' },
          { id: 'spi_1_r2', title: 'Audio: Meditasi Terpandu', type: 'tool', url: '#' }
        ],
        exercises: [
          { id: 'spi_1_e1', title: 'Jurnal Syukur', description: 'Tulis 3 hal yang Anda syukuri setiap hari', type: 'reflection', xp: 50, completed: false },
          { id: 'spi_1_e2', title: 'Tantangan Meditasi', description: 'Lakukan meditasi 10 menit/hari selama 7 hari', type: 'practice', xp: 70, completed: false }
        ]
      }
    ],
    9: [ // Environmental
      {
        id: 'env_1',
        title: 'Gaya Hidup Berkelanjutan',
        description: 'Pelajari untuk hidup lebih ramah lingkungan',
        duration: '2 jam',
        difficulty: 'beginner',
        lessons: [
          { id: 'env_1_1', title: 'Pengenalan Keberlanjutan', description: 'Apa itu gaya hidup berkelanjutan', duration: '15 menit', type: 'video', completed: false },
          { id: 'env_1_2', title: 'Mengurangi Plastik', description: 'Tips untuk mengurangi penggunaan plastik', duration: '20 menit', type: 'reading', completed: false },
          { id: 'env_1_3', title: 'Energi Hijau', description: 'Cara menghemat energi sehari-hari', duration: '25 menit', type: 'interactive', completed: false }
        ],
        resources: [
          { id: 'env_1_r1', title: 'Panduan Zero Waste PDF', type: 'pdf', url: '#', size: '2.5 MB' },
          { id: 'env_1_r2', title: 'Video: DIY Eco-Friendly', type: 'video', url: '#' }
        ],
        exercises: [
          { id: 'env_1_e1', title: 'Tantangan Tanpa Plastik', description: 'Hindari plastik sekali pakai selama 7 hari', type: 'practice', xp: 60, completed: false },
          { id: 'env_1_e2', title: 'Audit Energi', description: 'Catat penggunaan energi di rumah Anda', type: 'reflection', xp: 50, completed: false }
        ]
      }
    ]
  };

  return moduleTemplates[dimensionId as keyof typeof moduleTemplates] || [];
}


