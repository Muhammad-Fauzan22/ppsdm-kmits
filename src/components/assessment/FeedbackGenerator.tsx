/**
 * Personalized Feedback Generator Component
 * 
 * Displays personalized recommendations based on assessment results
 * for all 9 dimensions of holistic development
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Target,
  Lightbulb,
  ArrowRight,
  Star,
  Award,
  Calendar,
  Download,
  Clock
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface FeedbackData {
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  developmentPath: string[];
}

interface DimensionFeedbackProps {
  dimensionId: number;
  dimensionName: string;
  dimensionSlug: string;
  compositeScore: number;
  subdimensionScores: Record<string, number>;
  percentile: number;
  level: string;
  feedback: FeedbackData;
  onActionClick?: (action: string) => void;
}

interface OverallFeedbackProps {
  dimensions: Array<{
    id: number;
    name: string;
    slug: string;
    score: number;
    percentile: number;
    level: string;
  }>;
  overallScore: number;
  balanceIndex: number;
  onDimensionClick?: (dimensionId: number) => void;
}

// ============================================================================
// DIMENSION FEEDBACK COMPONENT
// ============================================================================

export function DimensionFeedbackCard({
  dimensionId,
  dimensionName,
  dimensionSlug,
  compositeScore,
  subdimensionScores,
  percentile,
  level,
  feedback,
  onActionClick
}: DimensionFeedbackProps) {
  const [activeTab, setActiveTab] = useState('strengths');

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'EXPERT': 'bg-green-500',
      'ADVANCED': 'bg-blue-500',
      'COMPETENT': 'bg-yellow-500',
      'DEVELOPING': 'bg-orange-500',
      'BEGINNER': 'bg-red-500',
      'MASTER': 'bg-green-500',
      'PROFICIENT': 'bg-blue-500',
      'BASIC': 'bg-yellow-500',
      'LIMITED': 'bg-orange-500',
      'VERY_LIMITED': 'bg-red-500',
      'EXCELLENT': 'bg-green-500',
      'GOOD': 'bg-blue-500',
      'AVERAGE': 'bg-yellow-500',
      'BELOW_AVERAGE': 'bg-orange-500',
      'NEEDS_IMPROVEMENT': 'bg-red-500',
      'EXCEPTIONAL': 'bg-green-500',
      'EXEMPLARY': 'bg-green-500',
      'STRONG': 'bg-blue-500',
      'EMERGING': 'bg-red-500',
      'TRANSCENDENT': 'bg-green-500',
      'INTEGRATED': 'bg-blue-500',
      'SEEKING': 'bg-yellow-500',
      'QUESTIONING': 'bg-orange-500',
      'UNEXPLORED': 'bg-red-500',
      'LEADER': 'bg-green-500',
      'FLOURISHING': 'bg-green-500',
      'GOOD_MENTAL_HEALTH': 'bg-blue-500',
      'MODERATE_MENTAL_HEALTH': 'bg-yellow-500',
      'LANGUISHING': 'bg-orange-500',
      'STRUGGLING': 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'EXPERT': 'Ahli',
      'ADVANCED': 'Lanjutan',
      'COMPETENT': 'Kompeten',
      'DEVELOPING': 'Berkembang',
      'BEGINNER': 'Pemula',
      'MASTER': 'Master',
      'PROFICIENT': 'Mahir',
      'BASIC': 'Dasar',
      'LIMITED': 'Terbatas',
      'VERY_LIMITED': 'Sangat Terbatas',
      'EXCELLENT': 'Unggul',
      'GOOD': 'Baik',
      'AVERAGE': 'Rata-rata',
      'BELOW_AVERAGE': 'Di Bawah Rata-rata',
      'NEEDS_IMPROVEMENT': 'Perlu Peningkatan',
      'EXCEPTIONAL': 'Luar Biasa',
      'EXEMPLARY': 'Teladan',
      'STRONG': 'Kuat',
      'EMERGING': 'Muncul',
      'TRANSCENDENT': 'Transenden',
      'INTEGRATED': 'Terintegrasi',
      'SEEKING': 'Mencari',
      'QUESTIONING': 'Bertanya',
      'UNEXPLORED': 'Belum Dieksplorasi',
      'LEADER': 'Pemimpin',
      'FLOURISHING': 'Berkembang',
      'GOOD_MENTAL_HEALTH': 'Kesehatan Mental Baik',
      'MODERATE_MENTAL_HEALTH': 'Kesehatan Mental Sedang',
      'LANGUISHING': 'Languishing',
      'STRUGGLING': 'Bertarung'
    };
    return labels[level] || level;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{dimensionName}</CardTitle>
            <CardDescription className="text-base">
              Skor: {compositeScore}/100 | Persentil: {percentile}%
            </CardDescription>
          </div>
          <Badge
            className={`${getLevelColor(level)} text-white px-4 py-2 text-sm font-semibold`}
          >
            {getLevelLabel(level)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Subdimension Scores */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Skor Sub-dimensi</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(subdimensionScores).map(([subdim, score]) => (
              <div key={subdim} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {subdim.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold">{Math.round(score)}</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Feedback Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strengths" className="data-[state=active]:bg-green-50">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Kelebihan
            </TabsTrigger>
            <TabsTrigger value="growth" className="data-[state=active]:bg-orange-50">
              <TrendingUp className="w-4 h-4 mr-2" />
              Area Pengembangan
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-blue-50">
              <Lightbulb className="w-4 h-4 mr-2" />
              Rekomendasi
            </TabsTrigger>
            <TabsTrigger value="path" className="data-[state=active]:bg-purple-50">
              <Target className="w-4 h-4 mr-2" />
              Jalur Pengembangan
            </TabsTrigger>
          </TabsList>

          {/* Strengths Tab */}
          <TabsContent value="strengths" className="mt-6">
            {feedback.strengths.length > 0 ? (
              <div className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Belum ada kelebihan yang teridentifikasi</p>
                <p className="text-sm mt-2">Lanjutkan assessment untuk melihat kelebihan Anda</p>
              </div>
            )}
          </TabsContent>

          {/* Growth Areas Tab */}
          <TabsContent value="growth" className="mt-6">
            {feedback.growthAreas.length > 0 ? (
              <div className="space-y-3">
                {feedback.growthAreas.map((area, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-700 mb-2">{area}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onActionClick?.(`growth_${index}`)}
                      >
                        Lihat Sumber Daya
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Semua area dalam kondisi baik!</p>
                <p className="text-sm mt-2">Pertahankan performa Anda yang luar biasa</p>
              </div>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-4">
              {feedback.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-700 mb-3">{recommendation}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onActionClick?.(`rec_${index}`)}
                        >
                          Mulai
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onActionClick?.(`save_${index}`)}
                        >
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Development Path Tab */}
          <TabsContent value="path" className="mt-6">
            <div className="space-y-4">
              {feedback.developmentPath.map((phase, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {index < feedback.developmentPath.length - 1 && (
                        <div className="w-0.5 h-16 bg-purple-300" />
                      )}
                    </div>
                    <div className="flex-1 p-4 bg-purple-50 rounded-lg">
                      <p className="text-gray-700">{phase}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// OVERALL FEEDBACK COMPONENT
// ============================================================================

export function OverallFeedback({
  dimensions,
  overallScore,
  balanceIndex,
  onDimensionClick
}: OverallFeedbackProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'strengths' | 'growth'>('overview');

  const getOverallLevel = (score: number) => {
    if (score >= 85) return { label: 'Unggul', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { label: 'Baik', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 55) return { label: 'Cukup', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 40) return { label: 'Perlu Peningkatan', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Perlu Perhatian', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getBalanceLevel = (index: number) => {
    if (index >= 0.8) return { label: 'Sangat Seimbang', color: 'text-green-600' };
    if (index >= 0.6) return { label: 'Seimbang', color: 'text-blue-600' };
    if (index >= 0.4) return { label: 'Cukup Seimbang', color: 'text-yellow-600' };
    return { label: 'Perlu Keseimbangan', color: 'text-orange-600' };
  };

  const overallLevel = getOverallLevel(overallScore);
  const balanceLevel = getBalanceLevel(balanceIndex);

  const strengths = dimensions.filter(d => d.score >= 70);
  const growthAreas = dimensions.filter(d => d.score < 55);

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hasil Assessment Holistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Score */}
            <div className={`p-6 rounded-xl ${overallLevel.bg}`}>
              <div className="text-sm text-gray-600 mb-2">Skor Keseluruhan</div>
              <div className="text-4xl font-bold mb-1">{Math.round(overallScore)}</div>
              <div className={`text-lg font-semibold ${overallLevel.color}`}>
                {overallLevel.label}
              </div>
            </div>

            {/* Balance Index */}
            <div className="p-6 rounded-xl bg-gray-50">
              <div className="text-sm text-gray-600 mb-2">Indeks Keseimbangan</div>
              <div className="text-4xl font-bold mb-1">{(balanceIndex * 100).toFixed(0)}%</div>
              <div className={`text-lg font-semibold ${balanceLevel.color}`}>
                {balanceLevel.label}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress Keseluruhan</span>
              <span className="font-semibold">{Math.round(overallScore)}%</span>
            </div>
            <Progress value={overallScore} className="h-3" />
          </div>

          {/* Completion Rate */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Dimensi Selesai: {dimensions.length}/9
            </span>
            <Badge variant="outline">
              {Math.round((dimensions.length / 9) * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* View Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedView === 'overview' ? 'default' : 'outline'}
          onClick={() => setSelectedView('overview')}
        >
          Overview
        </Button>
        <Button
          variant={selectedView === 'strengths' ? 'default' : 'outline'}
          onClick={() => setSelectedView('strengths')}
        >
          Kelebihan
        </Button>
        <Button
          variant={selectedView === 'growth' ? 'default' : 'outline'}
          onClick={() => setSelectedView('growth')}
        >
          Area Pengembangan
        </Button>
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((dimension) => (
            <Card
              key={dimension.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onDimensionClick?.(dimension.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{dimension.name}</h3>
                  <Badge variant="outline">{Math.round(dimension.score)}</Badge>
                </div>
                <Progress value={dimension.score} className="h-2 mb-3" />
                <div className="text-sm text-gray-600">
                  Persentil: {dimension.percentile}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Strengths View */}
      {selectedView === 'strengths' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Kelebihan Utama
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <div className="space-y-4">
                {strengths.map((dimension) => (
                  <div
                    key={dimension.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => onDimensionClick?.(dimension.id)}
                  >
                    <div>
                      <h4 className="font-semibold">{dimension.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Skor: {Math.round(dimension.score)} | Persentil: {dimension.percentile}%
                      </p>
                    </div>
                    <ArrowRight className="text-green-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Lanjutkan assessment untuk melihat kelebihan Anda</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Growth Areas View */}
      {selectedView === 'growth' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Area Pengembangan Prioritas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {growthAreas.length > 0 ? (
              <div className="space-y-4">
                {growthAreas.map((dimension) => (
                  <div
                    key={dimension.id}
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => onDimensionClick?.(dimension.id)}
                  >
                    <div>
                      <h4 className="font-semibold">{dimension.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Skor: {Math.round(dimension.score)} | Persentil: {dimension.percentile}%
                      </p>
                    </div>
                    <ArrowRight className="text-orange-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Semua area dalam kondisi baik!</p>
                <p className="text-sm mt-2">Pertahankan performa Anda yang luar biasa</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button className="flex-1" size="lg">
          <BookOpen className="w-4 h-4 mr-2" />
          Lihat Detail Lengkap
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Download Laporan
        </Button>
        <Button variant="outline" size="lg">
          <Calendar className="w-4 h-4 mr-2" />
          Jadwalkan Assessment Berikutnya
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// RECOMMENDATION CARD COMPONENT
// ============================================================================

interface RecommendationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function RecommendationCard({
  title,
  description,
  icon,
  priority,
  estimatedTime,
  onAction,
  onDismiss
}: RecommendationCardProps) {
  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-blue-500 bg-blue-50'
  };

  return (
    <Card className={`border-l-4 ${priorityColors[priority]}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <Badge
                variant="outline"
                className="text-xs"
              >
                {priority.toUpperCase()}
              </Badge>
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>Estimasi: {estimatedTime}</span>
          </div>
          <Button size="sm" onClick={onAction}>
            Mulai
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DEVELOPMENT PATH COMPONENT
// ============================================================================

interface DevelopmentPathProps {
  currentPhase: string;
  phases: Array<{
    name: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending';
    dimensions: Array<{
      id: number;
      score: number;
      target: number;
    }>;
  }>;
  onPhaseClick?: (phaseIndex: number) => void;
}

export function DevelopmentPath({
  currentPhase,
  phases,
  onPhaseClick
}: DevelopmentPathProps) {
  const getPhaseStatus = (status: string) => {
    const statusConfig = {
      completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
      in_progress: { icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
      pending: { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-50' }
    };
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Jalur Pengembangan Personal</CardTitle>
        <CardDescription>
          Fase saat ini: <span className="font-semibold text-blue-600">{currentPhase}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={index}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${phase.status === 'in_progress' ? 'border-blue-500 bg-blue-50' :
                  phase.status === 'completed' ? 'border-green-500 bg-green-50' :
                    'border-gray-300 bg-gray-50'
                  }`}
                onClick={() => onPhaseClick?.(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${status.bg}`}>
                    <StatusIcon className={`w-6 h-6 ${status.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{phase.name}</h3>
                      {phase.status === 'completed' && (
                        <Badge className="bg-green-600 text-white">
                          Selesai
                        </Badge>
                      )}
                      {phase.status === 'in_progress' && (
                        <Badge className="bg-blue-600 text-white">
                          Sedang Berjalan
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4">{phase.description}</p>

                    {/* Dimension Progress */}
                    <div className="space-y-2">
                      {phase.dimensions.slice(0, 3).map((dim) => (
                        <div key={dim.id} className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 w-32">
                            Dimensi {dim.id}
                          </span>
                          <div className="flex-1">
                            <Progress value={dim.score} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{Math.round(dim.score)}%</span>
                              <span>Target: {dim.target}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// WEEKLY PLAN COMPONENT
// ============================================================================

interface WeeklyPlanProps {
  weeklyPlan: Array<{
    day: string;
    focusDimension: number;
    focusDimensionName: string;
    activities: string[];
    estimatedTime: string;
  }>;
  onActivityComplete?: (dayIndex: number, activityIndex: number) => void;
}

export function WeeklyPlan({ weeklyPlan, onActivityComplete }: WeeklyPlanProps) {
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());

  const toggleActivity = (dayIndex: number, activityIndex: number) => {
    const key = `${dayIndex}-${activityIndex}`;
    const newCompleted = new Set(completedActivities);

    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }

    setCompletedActivities(newCompleted);
    onActivityComplete?.(dayIndex, activityIndex);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rencana Mingguan</CardTitle>
        <CardDescription>
          Fokus pada pengembangan area yang lemah
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyPlan.map((day, dayIndex) => (
            <div key={dayIndex} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{day.day}</h3>
                <Badge variant="outline">{day.estimatedTime}</Badge>
              </div>

              <div className="mb-3">
                <div className="text-sm text-gray-600 mb-1">Fokus: {day.focusDimensionName}</div>
                <Progress value={50} className="h-2" />
              </div>

              <div className="space-y-2">
                {day.activities.map((activity, activityIndex) => {
                  const key = `${dayIndex}-${activityIndex}`;
                  const isCompleted = completedActivities.has(key);

                  return (
                    <div
                      key={activityIndex}
                      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${isCompleted ? 'bg-green-50 border-green-500' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      onClick={() => toggleActivity(dayIndex, activityIndex)}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300'
                        }`}>
                        {isCompleted ? '✓' : ''}
                      </div>
                      <p className={`flex-1 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {activity}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


