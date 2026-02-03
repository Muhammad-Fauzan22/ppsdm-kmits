/**
 * Normative Data Comparison Components
 * 
 * Provides comparison of user scores with Indonesian student population
 * norms, including faculty-specific comparisons and percentile rankings
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  GraduationCap,
  Building,
  Briefcase,
  Heart,
  Brain,
  Zap,
  Leaf,
  Globe,
  Info,
  ChevronRight,
  ArrowDown,
  Minus,
  Equal,
  BookOpen,
  Download
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface NormativeData {
  dimensionId: number;
  dimensionName: string;
  userScore: number;
  userPercentile: number;
  populationMean: number;
  populationSD: number;
  facultyMean?: number;
  facultySD?: number;
  genderMean?: number;
  genderSD?: number;
  yearLevelMean?: number;
  yearLevelSD?: number;
  interpretation: string;
  comparisonGroup: 'above_average' | 'average' | 'below_average';
}

interface NormativeComparisonProps {
  dimensionId: number;
  dimensionName: string;
  userScore: number;
  userFaculty?: string;
  userYearLevel?: number;
  userGender?: string;
  onDimensionChange?: (dimensionId: number) => void;
}

interface PercentileChartProps {
  userPercentile: number;
  dimensionName: string;
}

interface FacultyComparisonProps {
  userScore: number;
  userFaculty: string;
  facultyData: Array<{
    faculty: string;
    mean: number;
    sd: number;
    n: number;
  }>;
}

// ============================================================================
// PERCENTILE CHART COMPONENT
// ============================================================================

export function PercentileChartCard({ userPercentile, dimensionName }: PercentileChartProps) {
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'bg-green-500';
    if (percentile >= 75) return 'bg-blue-500';
    if (percentile >= 50) return 'bg-yellow-500';
    if (percentile >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 95) return 'Sangat Unggul (Top 5%)';
    if (percentile >= 85) return 'Unggul (Top 15%)';
    if (percentile >= 70) return 'Di Atas Rata-rata';
    if (percentile >= 50) return 'Rata-rata';
    if (percentile >= 30) return 'Di Bawah Rata-rata';
    if (percentile >= 15) return 'Perlu Pengembangan';
    return 'Perlu Perhatian Khusus';
  };

  const getPercentileIcon = (percentile: number) => {
    if (percentile >= 75) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (percentile >= 25) return <Equal className="w-5 h-5 text-yellow-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Persentil: {dimensionName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Percentile Display */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">
              {userPercentile}%
            </div>
            <Badge className={getPercentileColor(userPercentile)}>
              {getPercentileLabel(userPercentile)}
            </Badge>
          </div>

          {/* Visual Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Posisi Anda</span>
              <span className="font-semibold">Top {100 - userPercentile}%</span>
            </div>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full ${getPercentileColor(userPercentile)} transition-all duration-500`}
                style={{ width: `${userPercentile}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  {getPercentileIcon(userPercentile)}
                  <span className="text-sm font-semibold text-white drop-shadow-lg">
                    {userPercentile}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Percentile Scale */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
            <div className="relative h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full">
              <div
                className="absolute top-0 w-1 h-full bg-white shadow-lg"
                style={{ left: `${userPercentile}%` }}
              />
            </div>
          </div>

          {/* Interpretation */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Interpretasi</p>
                <p className="text-sm text-gray-700">
                  {userPercentile >= 75
                    ? `Skor Anda berada di ${userPercentile} persentil, artinya Anda lebih baik dari ${userPercentile}% mahasiswa Indonesia di dimensi ${dimensionName}.`
                    : userPercentile >= 50
                      ? `Skor Anda berada di ${userPercentile} persentil, artinya Anda berada di sekitar rata-rata mahasiswa Indonesia di dimensi ${dimensionName}.`
                      : `Skor Anda berada di ${userPercentile} persentil, artinya ${100 - userPercentile}% mahasiswa Indonesia memiliki skor lebih tinggi di dimensi ${dimensionName}.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// FACULTY COMPARISON COMPONENT
// ============================================================================

export function FacultyComparison({ userScore, userFaculty, facultyData }: FacultyComparisonProps) {
  const getFacultyIcon = (faculty: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Teknik': <Building className="w-5 h-5" />,
      'Sains': <GraduationCap className="w-5 h-5" />,
      'Sosial': <Users className="w-5 h-5" />,
      'Humaniora': <BookOpen className="w-5 h-5" />,
      'Bisnis': <Briefcase className="w-5 h-5" />,
      'Kesehatan': <Heart className="w-5 h-5" />,
      'Teknologi': <Zap className="w-5 h-5" />
    };
    return icons[faculty] || <Users className="w-5 h-5" />;
  };

  const getComparisonIcon = (userScore: number, facultyMean: number) => {
    const diff = userScore - facultyMean;
    if (diff > 5) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (diff < -5) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Equal className="w-4 h-4 text-yellow-600" />;
  };

  const getComparisonColor = (userScore: number, facultyMean: number) => {
    const diff = userScore - facultyMean;
    if (diff > 5) return 'text-green-600 bg-green-50';
    if (diff < -5) return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Perbandingan Antar Fakultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* User Faculty Highlight */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  {getFacultyIcon(userFaculty || 'Teknik')}
                </div>
                <div>
                  <div className="text-sm text-gray-600">Fakultas Anda</div>
                  <div className="font-semibold text-lg">{userFaculty || 'Teknik'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{userScore}</div>
                <div className="text-sm text-gray-600">Skor Anda</div>
              </div>
            </div>
          </div>

          {/* Faculty Comparison List */}
          <div className="space-y-3">
            {facultyData.map((faculty) => {
              const isUserFaculty = faculty.faculty === userFaculty;
              const comparisonIcon = getComparisonIcon(userScore, faculty.mean);
              const comparisonColor = getComparisonColor(userScore, faculty.mean);
              const diff = userScore - faculty.mean;

              return (
                <div
                  key={faculty.faculty}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${isUserFaculty
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isUserFaculty ? 'bg-blue-200' : 'bg-gray-200'
                      }`}>
                      {getFacultyIcon(faculty.faculty)}
                    </div>
                    <div>
                      <div className="font-semibold">{faculty.faculty}</div>
                      <div className="text-sm text-gray-600">
                        Rata-rata: {faculty.mean.toFixed(1)} (SD: {faculty.sd.toFixed(1)})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${comparisonColor} px-3 py-1 rounded-lg`}>
                      {comparisonIcon}
                      <span className="font-semibold">
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      n = {faculty.n}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interpretation */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Analisis</p>
                <p className="text-sm text-gray-700">
                  {userScore > facultyData.find(f => f.faculty === userFaculty)?.mean || 0
                    ? `Skor Anda di atas rata-rata fakultas ${userFaculty}. Ini menunjukkan bahwa Anda memiliki kekuatan di atas rata-rata dibandingkan dengan rekan sefakultas.`
                    : userScore < facultyData.find(f => f.faculty === userFaculty)?.mean || 0
                      ? `Skor Anda di bawah rata-rata fakultas ${userFaculty}. Ini menunjukkan area yang dapat dikembangkan lebih lanjut.`
                      : `Skor Anda sejajar dengan rata-rata fakultas ${userFaculty}.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// NORMATIVE DATA OVERVIEW COMPONENT
// ============================================================================

export function NormativeDataOverview({
  dimensionId,
  dimensionName,
  userScore,
  userFaculty,
  userYearLevel,
  userGender,
  onDimensionChange
}: NormativeComparisonProps) {
  const [activeTab, setActiveTab] = useState('percentile');
  const [selectedDimension, setSelectedDimension] = useState(dimensionId);

  // Mock normative data - In production, this would come from API
  const normativeData: NormativeData[] = [
    {
      dimensionId: 1,
      dimensionName: 'Kognitif',
      userScore: 75,
      userPercentile: 82,
      populationMean: 62.3,
      populationSD: 11.5,
      facultyMean: 64.2,
      facultySD: 12.1,
      genderMean: 63.5,
      genderSD: 10.8,
      yearLevelMean: 58.4,
      yearLevelSD: 13.2,
      interpretation: 'Skor Anda berada di atas rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'above_average'
    },
    {
      dimensionId: 2,
      dimensionName: 'Manajemen Diri',
      userScore: 68,
      userPercentile: 72,
      populationMean: 57.8,
      populationSD: 12.4,
      facultyMean: 58.7,
      facultySD: 12.4,
      genderMean: 58.1,
      genderSD: 12.5,
      yearLevelMean: 54.6,
      yearLevelSD: 13.5,
      interpretation: 'Skor Anda berada di atas rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'above_average'
    },
    {
      dimensionId: 3,
      dimensionName: 'Finansial',
      userScore: 52,
      userPercentile: 45,
      populationMean: 58.4,
      populationSD: 16.2,
      facultyMean: 55.8,
      facultySD: 16.2,
      genderMean: 57.5,
      genderSD: 15.8,
      yearLevelMean: 56.3,
      yearLevelSD: 14.8,
      interpretation: 'Skor Anda berada di sekitar rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'average'
    },
    {
      dimensionId: 4,
      dimensionName: 'Kesehatan Fisik',
      userScore: 72,
      userPercentile: 78,
      populationMean: 57.5,
      populationSD: 14.2,
      facultyMean: 57.8,
      facultySD: 14.2,
      genderMean: 58.8,
      genderSD: 13.9,
      yearLevelMean: 56.3,
      yearLevelSD: 15.2,
      interpretation: 'Skor Anda berada di atas rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'above_average'
    },
    {
      dimensionId: 5,
      dimensionName: 'Emosional-Sosial',
      userScore: 65,
      userPercentile: 68,
      populationMean: 60.6,
      populationSD: 14.8,
      facultyMean: 57.9,
      facultySD: 15.3,
      genderMean: 60.6,
      genderSD: 14.5,
      yearLevelMean: 59.3,
      yearLevelSD: 14.5,
      interpretation: 'Skor Anda berada di atas rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'above_average'
    },
    {
      dimensionId: 6,
      dimensionName: 'Kesehatan Mental',
      userScore: 58,
      userPercentile: 55,
      populationMean: 57.0,
      populationSD: 14.5,
      facultyMean: 57.8,
      facultySD: 14.2,
      genderMean: 57.1,
      genderSD: 14.8,
      yearLevelMean: 56.3,
      yearLevelSD: 14.8,
      interpretation: 'Skor Anda berada di sekitar rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'average'
    },
    {
      dimensionId: 7,
      dimensionName: 'Karakter & Etika',
      userScore: 70,
      userPercentile: 75,
      populationMean: 65.0,
      populationSD: 15.5,
      facultyMean: 63.2,
      facultySD: 16.8,
      genderMean: 66.2,
      genderSD: 14.5,
      yearLevelMean: 63.8,
      yearLevelSD: 15.8,
      interpretation: 'Skor Anda berada di atas rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'above_average'
    },
    {
      dimensionId: 8,
      dimensionName: 'Spiritual',
      userScore: 62,
      userPercentile: 60,
      populationMean: 58.5,
      populationSD: 14.2,
      facultyMean: 58.5,
      facultySD: 14.2,
      genderMean: 58.5,
      genderSD: 14.2,
      yearLevelMean: 56.8,
      yearLevelSD: 14.5,
      interpretation: 'Skor Anda berada di sekitar rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'average'
    },
    {
      dimensionId: 9,
      dimensionName: 'Lingkungan',
      userScore: 55,
      userPercentile: 52,
      populationMean: 55.3,
      populationSD: 15.1,
      facultyMean: 52.8,
      facultySD: 15.1,
      genderMean: 56.8,
      genderSD: 14.8,
      yearLevelMean: 53.4,
      yearLevelSD: 16.3,
      interpretation: 'Skor Anda berada di sekitar rata-rata populasi mahasiswa Indonesia',
      comparisonGroup: 'average'
    }
  ];

  const facultyData = [
    { faculty: 'Teknik', mean: 64.2, sd: 12.1, n: 650 },
    { faculty: 'Sains', mean: 65.8, sd: 11.7, n: 450 },
    { faculty: 'Sosial', mean: 55.3, sd: 13.2, n: 500 },
    { faculty: 'Humaniora', mean: 53.8, sd: 14.1, n: 400 },
    { faculty: 'Bisnis', mean: 65.2, sd: 14.3, n: 500 }
  ];

  const currentData = normativeData.find(d => d.dimensionId === selectedDimension);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Data Normatif
          </CardTitle>
          <CardDescription>
            Perbandingan skor Anda dengan populasi mahasiswa Indonesia
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dimension Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Dimensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {normativeData.map((dimension) => (
              <Button
                key={dimension.dimensionId}
                variant={selectedDimension === dimension.dimensionId ? 'default' : 'outline'}
                className="h-full flex-col items-start p-4"
                onClick={() => {
                  setSelectedDimension(dimension.dimensionId);
                  onDimensionChange?.(dimension.dimensionId);
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-semibold">{dimension.dimensionName}</span>
                  <Badge variant={dimension.comparisonGroup === 'above_average' ? 'default' : 'secondary'}>
                    {dimension.userPercentile}%
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Skor: {dimension.userScore}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="percentile" className="data-[state=active]:bg-blue-50">
            <Target className="w-4 h-4 mr-2" />
            Persentil
          </TabsTrigger>
          <TabsTrigger value="faculty" className="data-[state=active]:bg-green-50">
            <GraduationCap className="w-4 h-4 mr-2" />
            Fakultas
          </TabsTrigger>
          <TabsTrigger value="distribution" className="data-[state=active]:bg-purple-50">
            <BarChart3 className="w-4 h-4 mr-2" />
            Distribusi
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-yellow-50">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tren
          </TabsTrigger>
        </TabsList>

        {/* Percentile Tab */}
        <TabsContent value="percentile" className="mt-6">
          {currentData && (
            <PercentileChartCard
              userPercentile={currentData.userPercentile}
              dimensionName={currentData.dimensionName}
            />
          )}
        </TabsContent>

        {/* Faculty Tab */}
        <TabsContent value="faculty" className="mt-6">
          {currentData && (
            <FacultyComparison
              userScore={currentData.userScore}
              userFaculty={userFaculty || 'Teknik'}
              facultyData={facultyData}
            />
          )}
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Skor Populasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bell Curve Visualization */}
                <div>
                  <h3 className="font-semibold mb-4">Kurva Distribusi Normal</h3>
                  <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden">
                    {/* Bell curve SVG */}
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                      {/* Bell curve */}
                      <path
                        d="M 20 180 Q 100 180 200 50 Q 300 180 380 180"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      {/* Mean line */}
                      <line
                        x1="200"
                        y1="20"
                        x2="200"
                        y2="180"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      {/* User score marker */}
                      <circle
                        cx={200 + (currentData?.userScore || 50) * 1.6}
                        cy={180 - (currentData?.userScore || 50) * 1.5}
                        r="8"
                        fill="#22c55e"
                      />
                      {/* Mean label */}
                      <text x="200" y="195" textAnchor="middle" fontSize="12" fill="#ef4444">
                        Mean: {currentData?.populationMean.toFixed(1)}
                      </text>
                      {/* User score label */}
                      <text
                        x={200 + (currentData?.userScore || 50) * 1.6}
                        y={180 - (currentData?.userScore || 50) * 1.5 - 15}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#22c55e"
                      >
                        Anda: {currentData?.userScore}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Statistics Table */}
                <div>
                  <h3 className="font-semibold mb-4">Statistik Populasi</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Rata-rata Populasi</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {currentData?.populationMean.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Standar Deviasi</div>
                      <div className="text-2xl font-bold text-green-600">
                        {currentData?.populationSD.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Skor Anda</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {currentData?.userScore}
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Persentil</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {currentData?.userPercentile}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Interpretasi</p>
                      <p className="text-sm text-gray-700">
                        {currentData?.interpretation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tren Perkembangan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Year Level Progression */}
                <div>
                  <h3 className="font-semibold mb-3">Perkembangan Berdasarkan Tahun Kuliah</h3>
                  <div className="space-y-3">
                    {[
                      { year: 'Tahun 1', mean: 56.3, sd: 13.5 },
                      { year: 'Tahun 2', mean: 57.2, sd: 12.8 },
                      { year: 'Tahun 3', mean: 60.3, sd: 11.7 },
                      { year: 'Tahun 4', mean: 61.8, sd: 11.2 }
                    ].map((data) => (
                      <div key={data.year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-lg">📚</div>
                          <div>
                            <div className="font-semibold">{data.year}</div>
                            <div className="text-sm text-gray-600">
                              Mean: {data.mean.toFixed(1)} (SD: {data.sd.toFixed(1)})
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {data.mean.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Comparison */}
                <div>
                  <h3 className="font-semibold mb-3">Perbandingan Berdasarkan Gender</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Laki-laki</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {currentData?.genderMean?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        SD: {currentData?.genderSD?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Perempuan</div>
                      <div className="text-2xl font-bold text-pink-600">
                        {currentData?.genderMean?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        SD: {currentData?.genderSD?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Rekomendasi</p>
                      <p className="text-sm text-gray-700">
                        {currentData?.comparisonGroup === 'above_average'
                          ? 'Pertahankan keunggulan Anda dengan terus mengembangkan dimensi ini. Pertimbangkan untuk membantu rekan yang memiliki skor lebih rendah.'
                          : currentData?.comparisonGroup === 'average'
                            ? 'Skor Anda sudah baik. Fokus pada area yang perlu pengembangan untuk mencapai potensi maksimal.'
                            : 'Fokus pada pengembangan dimensi ini. Ikuti modul pembelajaran yang tersedia dan konsisten berlatih.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="flex-1" size="lg">
          <BookOpen className="w-4 h-4 mr-2" />
          Lihat Modul Pembelajaran
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          <Award className="w-4 h-4 mr-2" />
          Lihat Badges
        </Button>
        <Button variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Download Laporan
        </Button>
      </div>
    </div>
  );
}


