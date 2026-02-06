'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, Clock, BookOpen } from 'lucide-react';
import { ContentRow, ContentMasonryGrid, ContentGridSkeleton, ContentEmptyState } from '@/components/content/ContentGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Dimension filter options
const dimensions = [
  { id: 'all', label: 'Semua', color: 'bg-gray-600' },
  { id: 'cognitive', label: 'Kognitif', color: 'bg-blue-500' },
  { id: 'emotional', label: 'Emosional', color: 'bg-pink-500' },
  { id: 'spiritual', label: 'Spiritual', color: 'bg-purple-500' },
  { id: 'physical', label: 'Fisik', color: 'bg-green-500' },
  { id: 'creative', label: 'Kreatif', color: 'bg-orange-500' },
  { id: 'professional', label: 'Profesional', color: 'bg-indigo-500' },
  { id: 'leadership', label: 'Kepemimpinan', color: 'bg-red-500' },
  { id: 'financial', label: 'Finansial', color: 'bg-yellow-500' },
  { id: 'environmental', label: 'Lingkungan', color: 'bg-emerald-500' },
];

// Content type filters
const contentTypes = [
  { id: 'all', label: 'Semua' },
  { id: 'video', label: 'Video' },
  { id: 'article', label: 'Artikel' },
  { id: 'course', label: 'Kursus' },
  { id: 'job', label: 'Lowongan' },
  { id: 'event', label: 'Event' },
];

// Mock data - replace with API calls
const mockContents = [
  {
    id: '1',
    title: 'Cara Mengelola Stres Selama Ujian',
    description: 'Teknik manajemen stres yang efektif untuk mahasiswa selama periode ujian',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    type: 'video' as const,
    duration: '12:34',
    dimensions: ['emotional', 'cognitive'],
    qualityScore: 92,
    relevanceScore: 95,
    author: 'Dr. Sarah Johnson',
    source: 'Khan Academy Indonesia',
    publishedAt: '2024-01-15',
    isNew: true,
    isTrending: true,
  },
  {
    id: '2',
    title: 'Panduan Lengkap: Investasi untuk Mahasiswa',
    description: 'Belajar investasi dari nol, cocok untuk pemula dengan modal terbatas',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    type: 'article' as const,
    dimensions: ['financial', 'professional'],
    qualityScore: 88,
    relevanceScore: 90,
    author: 'Finansialku',
    source: 'Finansialku.com',
    publishedAt: '2024-01-14',
    isNew: true,
  },
  {
    id: '3',
    title: 'Lowongan Magang: Software Engineer di Tokopedia',
    description: 'Kesempatan magang untuk mahasiswa teknik informatika',
    type: 'job' as const,
    dimensions: ['professional', 'cognitive'],
    qualityScore: 85,
    relevanceScore: 88,
    source: 'Kalibrr',
    publishedAt: '2024-01-13',
  },
  {
    id: '4',
    title: 'Workshop: Design Thinking untuk Pemula',
    description: 'Pelajari metode design thinking untuk inovasi',
    imageUrl: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800',
    type: 'event' as const,
    dimensions: ['creative', 'leadership'],
    qualityScore: 90,
    relevanceScore: 85,
    source: 'ITS Career Center',
    publishedAt: '2024-01-12',
  },
  {
    id: '5',
    title: 'Yoga untuk Kesehatan Mental',
    description: 'Rutinitas yoga sederhana yang bisa dilakukan di kamar kos',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    type: 'video' as const,
    duration: '20:00',
    dimensions: ['physical', 'emotional', 'spiritual'],
    qualityScore: 87,
    relevanceScore: 82,
    author: 'Yoga With Adriene',
    source: 'YouTube',
    publishedAt: '2024-01-11',
  },
  {
    id: '6',
    title: 'Beasiswa LPDP 2024: Panduan Lengkap',
    description: 'Semua yang perlu kamu tahu tentang beasiswa LPDP',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    type: 'article' as const,
    dimensions: ['cognitive', 'professional'],
    qualityScore: 94,
    relevanceScore: 96,
    author: 'BEM ITS',
    source: 'ITS.ac.id',
    publishedAt: '2024-01-10',
    isTrending: true,
  },
];

export default function ContentDiscoveryPage() {
  const [activeDimension, setActiveDimension] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'rows' | 'grid'>('rows');
  const [isLoading, setIsLoading] = useState(false);

  // Filter contents
  const filteredContents = mockContents.filter((content) => {
    const matchesDimension = activeDimension === 'all' || content.dimensions.includes(activeDimension);
    const matchesType = activeType === 'all' || content.type === activeType;
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDimension && matchesType && matchesSearch;
  });

  // Group contents for rows view
  const trendingContents = filteredContents.filter(c => c.isTrending);
  const newContents = filteredContents.filter(c => c.isNew);
  const recommendedContents = filteredContents.slice(0, 6);
  const allContents = filteredContents;

  const loadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">AI-Powered Recommendations</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Temukan Konten <br />
              <span className="text-blue-400">Sesuai Dimensimu</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Jelajahi ribuan konten edukatif yang dikurasi khusus untuk pengembangan 
              9 dimensi dirimu. Dari akademik hingga kesehatan mental.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari konten: yoga, investasi, programming..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => setViewMode(viewMode === 'rows' ? 'grid' : 'rows')}
            >
              <Filter className="w-4 h-4 mr-2" />
              {viewMode === 'rows' ? 'Grid View' : 'Row View'}
            </Button>
          </div>

          {/* Dimension Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dimensions.map((dim) => (
              <button
                key={dim.id}
                onClick={() => setActiveDimension(dim.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  activeDimension === dim.id
                    ? `${dim.color} text-white`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
              >
                {dim.label}
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 mt-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  activeType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="pt-8 space-y-12">
        {isLoading ? (
          <ContentGridSkeleton count={8} />
        ) : filteredContents.length === 0 ? (
          <ContentEmptyState />
        ) : viewMode === 'rows' ? (
          <>
            {/* Trending Row */}
            {trendingContents.length > 0 && (
              <ContentRow
                title="Trending di ITS"
                subtitle="Konten paling populer minggu ini"
                contents={trendingContents}
              />
            )}

            {/* New Content Row */}
            {newContents.length > 0 && (
              <ContentRow
                title="Baru Ditambahkan"
                subtitle="Konten terbaru untukmu"
                contents={newContents}
              />
            )}

            {/* Recommended Row */}
            <ContentRow
              title="Rekomendasi Untukmu"
              subtitle="Berdasarkan profil 9 dimensimu"
              contents={recommendedContents}
            />

            {/* All Content Grid */}
            <div className="px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Jelajahi Semua Konten
              </h2>
              <ContentMasonryGrid
                contents={allContents}
                onLoadMore={loadMore}
                hasMore={true}
                isLoading={isLoading}
              />
            </div>
          </>
        ) : (
          <ContentMasonryGrid
            contents={allContents}
            onLoadMore={loadMore}
            hasMore={true}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Quick Stats */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">{filteredContents.length} konten</span>
            </div>
            <div className="w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Diperbarui 2 jam lalu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
