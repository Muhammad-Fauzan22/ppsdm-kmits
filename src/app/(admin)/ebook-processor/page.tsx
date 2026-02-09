 'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

// Type declarations for missing modules
declare module '@/lib/supabase/client' {
  export function createClient(): any;
}
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Star,
  Clock,
  BarChart3,
  FileText,
  Download,
  Eye,
  Trash2,
  Settings,
  Zap,
  Award,
  TrendingUp,
  Cloud,
  CloudOff,
  FolderOpen,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';


import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Types
interface Ebook {
  id: string;
  drive_id: string;
  file_name: string;
  title: string;
  author: string;
  category: string;
  processing_status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed' | 'skipped';
  processing_progress: number;
  quality_score: number | null;
  quality_grade: string | null;
  file_size_kb: number;
  cover_image_url: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  error_count: number;
  last_error: string | null;
  drive_url: string | null;
  // Google Drive upload fields
  drive_folder_id: string | null;
  drive_folder_url: string | null;
  drive_upload_status: 'pending' | 'uploading' | 'completed' | 'failed' | null;
  drive_upload_progress: number | null;
  drive_uploaded_at: string | null;
}

interface BatchJob {
  id: string;
  job_name: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  total_books: number;
  processed_count: number;
  failed_count: number;
  progress_percent: number;
  average_quality_score: number | null;
  started_at: string | null;
  completed_at: string | null;
}

interface Course {
  id: string;
  ebook_id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  modules_count: number;
  xp_total: number;
  cover_image_url: string | null;
}

export default function EbookProcessorPage() {
  const supabase = createClient();
  const { toast } = useToast();

  // State
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [processingConfig, setProcessingConfig] = useState({
    targetQuality: 90,
    priorityOnly: false,
    maxBooks: 10,
    fetchCovers: true,
    generateCourses: true
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      // Fetch ebooks
      const { data: ebooksData, error: ebooksError } = await supabase
        .from('ebooks')
        .select('*')
        .order('processing_priority', { ascending: true })
        .limit(100);

      if (ebooksError) throw ebooksError;
      setEbooks(ebooksData || []);

      // Fetch batch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('batch_processing_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (jobsError) throw jobsError;
      setBatchJobs(jobsData || []);

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses_from_ebooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data from database',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  // Initial load
  useEffect(() => {
    fetchData();

    // Subscribe to realtime updates
    const ebooksSubscription = supabase
      .channel('ebooks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ebooks' }, () => {
        fetchData();
      })
      .subscribe();

    const jobsSubscription = supabase
      .channel('jobs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'batch_processing_jobs' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      ebooksSubscription.unsubscribe();
      jobsSubscription.unsubscribe();
    };
  }, [fetchData, supabase]);

  // Filter ebooks
  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch =
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ebook.processing_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: ebooks.length,
    pending: ebooks.filter(e => e.processing_status === 'pending').length,
    processing: ebooks.filter(e => e.processing_status === 'processing').length,
    completed: ebooks.filter(e => e.processing_status === 'completed').length,
    failed: ebooks.filter(e => e.processing_status === 'failed').length,
    gradeA: ebooks.filter(e => e.quality_grade === 'A' || e.quality_grade === 'A+').length,
    avgQuality: ebooks.filter(e => e.quality_score).length > 0
      ? ebooks.filter(e => e.quality_score).reduce((acc, e) => acc + (e.quality_score || 0), 0) /
      ebooks.filter(e => e.quality_score).length
      : 0,
    // Drive stats
    driveCompleted: ebooks.filter(e => e.drive_upload_status === 'completed').length,
    drivePending: ebooks.filter(e => !e.drive_upload_status || e.drive_upload_status === 'pending').length,
    driveFailed: ebooks.filter(e => e.drive_upload_status === 'failed').length
  };

  // Start batch processing
  const startBatchProcessing = async () => {
    setIsProcessing(true);
    try {
      // Create batch job
      const { data: job, error: jobError } = await supabase
        .from('batch_processing_jobs')
        .insert({
          job_name: `Batch Process ${new Date().toLocaleString()}`,
          job_type: processingConfig.priorityOnly ? 'priority_only' : 'full_batch',
          status: 'running',
          target_quality: processingConfig.targetQuality,
          max_books: processingConfig.maxBooks,
          priority_only: processingConfig.priorityOnly,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (jobError) throw jobError;
      setActiveJobId(job.id);

      // Call the batch processing API
      const response = await fetch('/api/admin/batch-process-ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          ...processingConfig
        })
      });

      if (!response.ok) throw new Error('Failed to start batch processing');

      toast({
        title: 'Success',
        description: 'Batch processing started successfully'
      });

    } catch (error) {
      console.error('Error starting batch processing:', error);
      toast({
        title: 'Error',
        description: 'Failed to start batch processing',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process single ebook
  const processSingleEbook = async (ebookId: string) => {
    try {
      const response = await fetch('/api/admin/process-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ebookId })
      });

      if (!response.ok) throw new Error('Failed to process ebook');

      toast({
        title: 'Success',
        description: 'Ebook processing started'
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process ebook',
        variant: 'destructive'
      });
    }
  };

  // Fetch cover for ebook
  const fetchCover = async (ebookId: string) => {
    try {
      const response = await fetch('/api/admin/fetch-book-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ebookId })
      });

      if (!response.ok) throw new Error('Failed to fetch cover');

      toast({
        title: 'Success',
        description: 'Cover fetch started'
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch cover',
        variant: 'destructive'
      });
    }
  };

  // Sync ebook to Google Drive
  const syncToDrive = async (ebookId: string) => {
    try {
      toast({
        title: 'Syncing',
        description: 'Starting Google Drive upload...'
      });

      const response = await fetch('/api/admin/sync-to-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: ebookId })
      });

      if (!response.ok) throw new Error('Failed to sync to Drive');

      const data = await response.json();

      toast({
        title: 'Success',
        description: data.message || 'Drive sync started'
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync to Google Drive',
        variant: 'destructive'
      });
    }
  };

  // Batch sync all pending books to Drive
  const batchSyncToDrive = async () => {
    try {
      toast({
        title: 'Batch Sync',
        description: 'Starting batch sync to Google Drive...'
      });

      const response = await fetch('/api/admin/sync-to-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncAll: true })
      });

      if (!response.ok) throw new Error('Failed to start batch sync');

      const data = await response.json();

      toast({
        title: 'Success',
        description: `Queued ${data.booksQueued} books for Drive sync`
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start batch sync',
        variant: 'destructive'
      });
    }
  };

  // Get Drive status badge
  const getDriveStatusBadge = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700"><Cloud className="w-3 h-3 mr-1" /> Synced</Badge>;
      case 'uploading':
        return <Badge className="bg-blue-100 text-blue-700"><RotateCcw className="w-3 h-3 mr-1 animate-spin" /> Uploading</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700"><CloudOff className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-500"><Cloud className="w-3 h-3 mr-1" /> Not Synced</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: 'bg-gray-100 text-gray-700', icon: <Clock className="w-3 h-3" /> },
      queued: { color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3" /> },
      processing: { color: 'bg-yellow-100 text-yellow-700', icon: <Zap className="w-3 h-3" /> },
      completed: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
      failed: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> },
      skipped: { color: 'bg-gray-100 text-gray-500', icon: <AlertCircle className="w-3 h-3" /> }
    };

    const variant = variants[status] || variants.pending;

    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        {variant.icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  // Get grade badge
  const getGradeBadge = (grade: string | null) => {
    if (!grade) return <Badge variant="outline">N/A</Badge>;

    const colors: Record<string, string> = {
      'A+': 'bg-purple-100 text-purple-700',
      'A': 'bg-green-100 text-green-700',
      'A-': 'bg-green-50 text-green-600',
      'B+': 'bg-blue-100 text-blue-700',
      'B': 'bg-blue-50 text-blue-600',
      'B-': 'bg-yellow-100 text-yellow-700',
      'C': 'bg-orange-100 text-orange-700',
      'D': 'bg-red-100 text-red-700',
      'F': 'bg-red-200 text-red-800'
    };

    return (
      <Badge className={colors[grade] || 'bg-gray-100'}>
        <Award className="w-3 h-3 mr-1" />
        {grade}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Ebook Processor
            </h1>
            <p className="text-slate-600 mt-1">
              Batch process ebooks with Grade A 15-layer pipeline
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              onClick={batchSyncToDrive}
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              <Cloud className="w-4 h-4 mr-2" />
              Sync to Drive
            </Button>
            <Button
              onClick={startBatchProcessing}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Batch
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Processing</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Grade A</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.gradeA}</p>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Quality</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgQuality.toFixed(1)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Drive Synced</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.driveCompleted}</p>
                  <p className="text-xs text-slate-500">
                    {stats.drivePending} pending · {stats.driveFailed} failed
                  </p>
                </div>
                <Cloud className="w-8 h-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Job Progress */}
        {activeJobId && batchJobs.find(j => j.id === activeJobId)?.status === 'running' && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="font-semibold text-blue-900">
                    Batch Processing in Progress
                  </span>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {batchJobs.find(j => j.id === activeJobId)?.progress_percent.toFixed(1)}%
                </Badge>
              </div>
              <Progress
                value={batchJobs.find(j => j.id === activeJobId)?.progress_percent || 0}
                className="h-2"
              />
              <div className="flex justify-between mt-2 text-sm text-blue-700">
                <span>
                  Processed: {batchJobs.find(j => j.id === activeJobId)?.processed_count || 0} / {batchJobs.find(j => j.id === activeJobId)?.total_books || 0}
                </span>
                <span>
                  Failed: {batchJobs.find(j => j.id === activeJobId)?.failed_count || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="ebooks" className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger value="ebooks">Ebooks ({ebooks.length})</TabsTrigger>
            <TabsTrigger value="courses">Generated Courses ({courses.length})</TabsTrigger>
            <TabsTrigger value="jobs">Batch Jobs ({batchJobs.length})</TabsTrigger>
          </TabsList>

          {/* Ebooks Tab */}
          <TabsContent value="ebooks" className="space-y-4">
            {/* Filters */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search by title, author, or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                     <Button
                      variant={viewMode === 'grid' ? 'primary' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>




                </div>
              </CardContent>
            </Card>

            {/* Ebooks Grid/List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <RotateCcw className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEbooks.map((ebook) => (
                <div key={ebook.id} className="cursor-pointer" onClick={() => setSelectedEbook(ebook)}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white h-full overflow-hidden group">

                      {/* Cover Image */}
                      <div className="aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                        {ebook.cover_image_url ? (
                          <img
                            src={ebook.cover_image_url}
                            alt={ebook.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-slate-400" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                processSingleEbook(ebook.id);
                              }}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Process
                            </Button>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(ebook.processing_status)}
                        </div>


                        {/* Favorite */}
                        {ebook.is_favorite && (
                          <div className="absolute top-2 left-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1">
                          {ebook.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">{ebook.author}</p>

                        <div className="flex items-center justify-between">
                          {getGradeBadge(ebook.quality_grade)}
                          {ebook.quality_score && (
                            <span className="text-sm text-slate-500">
                              {ebook.quality_score.toFixed(1)}
                            </span>
                          )}
                        </div>

                        {/* Drive Status */}
                        <div className="mt-2">
                          {getDriveStatusBadge(ebook.drive_upload_status)}
                        </div>


                        {ebook.processing_progress > 0 && ebook.processing_progress < 100 && (
                          <Progress value={ebook.processing_progress} className="h-1 mt-3" />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}

              </div>
            ) : (
              // List View
              <Card className="bg-white">
                <ScrollArea className="h-[600px]">
                  <div className="divide-y">
                    {filteredEbooks.map((ebook) => (
                      <div
                        key={ebook.id}
                        className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedEbook(ebook)}
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-20 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                          {ebook.cover_image_url ? (
                            <img
                              src={ebook.cover_image_url}
                              alt={ebook.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {ebook.title}
                          </h3>
                          <p className="text-sm text-slate-600">{ebook.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {ebook.category}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {(ebook.file_size_kb / 1024).toFixed(1)} MB
                            </span>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-4">
                          {getStatusBadge(ebook.processing_status)}
                          {getGradeBadge(ebook.quality_grade)}

                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                processSingleEbook(ebook.id);
                              }}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                fetchCover(ebook.id);
                              }}
                            >
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={ebook.drive_upload_status === 'completed' ? 'text-green-600' : 'text-slate-400'}
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                if (ebook.drive_folder_url) {
                                  window.open(ebook.drive_folder_url, '_blank');
                                } else {
                                  syncToDrive(ebook.id);
                                }
                              }}
                            >
                              {ebook.drive_upload_status === 'completed' ? (
                                <FolderOpen className="w-4 h-4" />
                              ) : (
                                <Cloud className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="bg-white">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    {course.cover_image_url ? (
                      <img
                        src={course.cover_image_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Grid className="w-4 h-4" />
                        {course.modules_count} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {course.xp_total} XP
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card className="bg-white">
              <ScrollArea className="h-[600px]">
                <div className="divide-y">
                  {batchJobs.map((job) => (
                    <div key={job.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">{job.job_name}</h3>
                          <p className="text-sm text-slate-600">
                            Started: {job.started_at ? new Date(job.started_at).toLocaleString() : 'Not started'}
                          </p>
                        </div>
                        <Badge className={
                          job.status === 'completed' ? 'bg-green-100 text-green-700' :
                            job.status === 'running' ? 'bg-blue-100 text-blue-700' :
                              job.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                        }>
                          {job.status}
                        </Badge>
                      </div>

                      <Progress value={job.progress_percent} className="h-2 mb-2" />

                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Progress: {job.progress_percent.toFixed(1)}%</span>
                        <span>
                          {job.processed_count} / {job.total_books} books
                          {job.failed_count > 0 && ` (${job.failed_count} failed)`}
                        </span>
                        {job.average_quality_score && (
                          <span>Avg Quality: {job.average_quality_score.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ebook Detail Dialog */}
        <Dialog open={!!selectedEbook} onOpenChange={() => setSelectedEbook(null)}>
          <DialogContent className="max-w-3xl">
            {selectedEbook && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {selectedEbook.title}
                  </DialogTitle>
                  <DialogDescription>
                    by {selectedEbook.author}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Status</h4>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedEbook.processing_status)}
                      {getGradeBadge(selectedEbook.quality_grade)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Quality Score</h4>
                    <p className="text-2xl font-bold">
                      {selectedEbook.quality_score?.toFixed(1) || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 mb-2">Category</h4>
                    <p>{selectedEbook.category}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 mb-2">File Size</h4>
                    <p>{(selectedEbook.file_size_kb / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => processSingleEbook(selectedEbook.id)}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Process Book
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fetchCover(selectedEbook.id)}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Fetch Cover
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={selectedEbook.drive_url ?? undefined} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      View in Drive
                    </a>
                  </Button>
                </div>



                {selectedEbook.last_error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Last Error
                    </h4>
                    <p className="text-sm text-red-600 mt-1">{selectedEbook.last_error}</p>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Processing Settings</DialogTitle>
              <DialogDescription>
                Configure batch processing parameters
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="targetQuality">Target Quality Score</Label>
                <Input
                  id="targetQuality"
                  type="number"
                  min="70"
                  max="100"
                  value={processingConfig.targetQuality}
                  onChange={(e) => setProcessingConfig(prev => ({
                    ...prev,
                    targetQuality: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="maxBooks">Max Books to Process</Label>
                <Input
                  id="maxBooks"
                  type="number"
                  min="1"
                  max="100"
                  value={processingConfig.maxBooks}
                  onChange={(e) => setProcessingConfig(prev => ({
                    ...prev,
                    maxBooks: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="priorityOnly">Priority Books Only</Label>
                <Switch
                  id="priorityOnly"
                  checked={processingConfig.priorityOnly}
                  onCheckedChange={(checked: boolean) => setProcessingConfig(prev => ({
                    ...prev,
                    priorityOnly: checked
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="fetchCovers">Fetch Book Covers</Label>
                <Switch
                  id="fetchCovers"
                  checked={processingConfig.fetchCovers}
                  onCheckedChange={(checked: boolean) => setProcessingConfig(prev => ({
                    ...prev,
                    fetchCovers: checked
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="generateCourses">Generate Courses</Label>
                <Switch
                  id="generateCourses"
                  checked={processingConfig.generateCourses}
                  onCheckedChange={(checked: boolean) => setProcessingConfig(prev => ({
                    ...prev,
                    generateCourses: checked
                  }))}
                />
              </div>

            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
