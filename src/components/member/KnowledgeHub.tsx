"use client";

import React, { useEffect, useState } from 'react';
import { 
  Search,
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Filter,
  Star,
  Clock,
  ExternalLink,
  MessageCircle,
  ChevronRight,
  Lightbulb,
  Target,
  Award
} from 'lucide-react';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';

// Types for knowledge data
interface KnowledgeResource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'article' | 'video' | 'course' | 'ebook' | 'tool';
  url?: string;
  duration?: string;
  rating: number;
  views: number;
  tags: string[];
  relevanceScore?: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: string[];
  progress: number;
  skills: string[];
}

interface PeerMatch {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  availability: string;
  matchScore: number;
}

interface Expert {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  linkedin?: string;
  available: boolean;
}

export function KnowledgeHub() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resources' | 'paths' | 'peers' | 'experts'>('resources');
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [peerMatches, setPeerMatches] = useState<PeerMatch[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadKnowledgeData();
  }, []);

  const loadKnowledgeData = async () => {
    try {
      const sheetsService = GoogleSheetsService.getInstance();
      const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

      // Load knowledge resources
      const knowledgeData = await sheetsService.getSheetData(spreadsheetId, 'Knowledge');
      setResources(knowledgeData.map((k: any) => ({
        id: k.id || '',
        title: k.title || '',
        description: k.description || '',
        category: k.category || '',
        difficulty: k.difficulty || 'beginner',
        type: k.type || 'article',
        url: k.url,
        duration: k.duration,
        rating: k.rating ? parseFloat(k.rating) : 0,
        views: k.views ? parseInt(k.views) : 0,
        tags: k.tags ? JSON.parse(k.tags) : [],
        relevanceScore: k.relevanceScore ? parseFloat(k.relevanceScore) : 0,
      })));

      // Load learning paths (AI-generated from skills gap)
      const pathsData = await sheetsService.getSheetData(spreadsheetId, 'LearningPaths');
      setLearningPaths(pathsData.map((p: any) => ({
        id: p.id || '',
        name: p.name || '',
        description: p.description || '',
        level: p.level || 'beginner',
        duration: p.duration || '',
        modules: p.modules ? JSON.parse(p.modules) : [],
        progress: p.progress ? parseInt(p.progress) : 0,
        skills: p.skills ? JSON.parse(p.skills) : [],
      })));

      // Load peer matches from Members data
      const membersData = await sheetsService.getSheetData(spreadsheetId, 'Members');
      setPeerMatches(membersData.slice(0, 5).map((m: any) => ({
        id: m.id || '',
        name: m.name || '',
        email: m.email || '',
        skills: m.skills ? JSON.parse(m.skills) : [],
        interests: m.interests ? JSON.parse(m.interests) : [],
        availability: m.availability || 'Available',
        matchScore: m.matchScore ? parseFloat(m.matchScore) : 0,
      })));

      // Load experts from alumni data
      const alumniData = await sheetsService.getSheetData(spreadsheetId, 'Members');
      setExperts(alumniData
        .filter((m: any) => m.status === 'alumni')
        .slice(0, 6)
        .map((e: any) => ({
          id: e.id || '',
          name: e.name || '',
          role: e.role || 'Alumni',
          company: e.company || '',
          expertise: e.expertise ? JSON.parse(e.expertise) : [],
          linkedin: e.linkedin,
          available: e.available === 'true',
        }))
      );

    } catch (error) {
      console.error('Error loading knowledge data:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setResources([
      {
        id: '1',
        title: 'Effective Leadership Strategies',
        description: 'Pelajari teknik kepemimpinan yang efektif untuk memimpin tim dengan baik.',
        category: 'Leadership',
        difficulty: 'intermediate',
        type: 'course',
        duration: '4 hours',
        rating: 4.8,
        views: 1250,
        tags: ['leadership', 'management', 'team'],
        relevanceScore: 95,
      },
      {
        id: '2',
        title: 'Communication Skills Mastery',
        description: 'Tingkatkan kemampuan komunikasi verbal dan non-verbal Anda.',
        category: 'Communication',
        difficulty: 'beginner',
        type: 'video',
        duration: '2 hours',
        rating: 4.5,
        views: 890,
        tags: ['communication', 'soft-skills'],
        relevanceScore: 88,
      },
      {
        id: '3',
        title: 'Project Management Fundamentals',
        description: 'Dasar-dasar manajemen proyek dengan metodologi Agile.',
        category: 'Management',
        difficulty: 'beginner',
        type: 'article',
        duration: '30 min',
        rating: 4.7,
        views: 2100,
        tags: ['project-management', 'agile', 'scrum'],
        relevanceScore: 82,
      },
      {
        id: '4',
        title: 'Data Analysis with Python',
        description: 'Belajar analisis data menggunakan Python dan pandas.',
        category: 'Technical',
        difficulty: 'advanced',
        type: 'course',
        duration: '8 hours',
        rating: 4.9,
        views: 3400,
        tags: ['python', 'data-analysis', 'programming'],
        relevanceScore: 78,
      },
      {
        id: '5',
        title: 'Emotional Intelligence at Work',
        description: 'Kembangkan kecerdasan emosional untuk lingkungan kerja.',
        category: 'Soft Skills',
        difficulty: 'intermediate',
        type: 'ebook',
        duration: '1 hour',
        rating: 4.6,
        views: 1560,
        tags: ['emotional-intelligence', 'soft-skills', 'psychology'],
        relevanceScore: 75,
      },
      {
        id: '6',
        title: 'Strategic Thinking Workshop',
        description: 'Workshop interaktif untuk mengembangkan pemikiran strategis.',
        category: 'Leadership',
        difficulty: 'advanced',
        type: 'tool',
        duration: '3 hours',
        rating: 4.8,
        views: 980,
        tags: ['strategy', 'leadership', 'planning'],
        relevanceScore: 72,
      },
    ]);

    setLearningPaths([
      {
        id: '1',
        name: 'Leadership Development Path',
        description: 'Jalur pengembangan kepemimpinan dari dasar hingga mahir',
        level: 'beginner',
        duration: '3 months',
        modules: ['Leadership Fundamentals', 'Team Management', 'Strategic Leadership', 'Change Management'],
        progress: 25,
        skills: ['Leadership', 'Communication', 'Decision Making'],
      },
      {
        id: '2',
        name: 'Technical Skills Enhancement',
        description: 'Peningkatan kemampuan teknis untuk karir modern',
        level: 'intermediate',
        duration: '4 months',
        modules: ['Data Analysis', 'Programming Basics', 'System Design', 'DevOps Fundamentals'],
        progress: 0,
        skills: ['Data Analysis', 'Programming', 'System Design'],
      },
      {
        id: '3',
        name: 'Soft Skills Mastery',
        description: 'Penguatan soft skills untuk profesional',
        level: 'beginner',
        duration: '2 months',
        modules: ['Communication', 'Emotional Intelligence', 'Time Management', 'Conflict Resolution'],
        progress: 50,
        skills: ['Communication', 'Emotional Intelligence', 'Teamwork'],
      },
    ]);

    setPeerMatches([
      {
        id: '1',
        name: 'Ahmad Rizki',
        email: 'ahmad@kmits.its.ac.id',
        skills: ['Leadership', 'Project Management'],
        interests: ['Technology', 'Innovation'],
        availability: 'Weekdays',
        matchScore: 92,
      },
      {
        id: '2',
        name: 'Budi Santoso',
        email: 'budi@kmits.its.ac.id',
        skills: ['Data Analysis', 'Python'],
        interests: ['AI', 'Machine Learning'],
        availability: 'Weekends',
        matchScore: 88,
      },
      {
        id: '3',
        name: 'Citra Dewi',
        email: 'citra@kmits.its.ac.id',
        skills: ['Communication', 'Public Speaking'],
        interests: ['Marketing', 'Branding'],
        availability: 'Flexible',
        matchScore: 85,
      },
      {
        id: '4',
        name: 'Dian Pratama',
        email: 'dian@kmits.its.ac.id',
        skills: ['Design', 'UI/UX'],
        interests: ['Product Design', 'User Research'],
        availability: 'Evenings',
        matchScore: 80,
      },
      {
        id: '5',
        name: 'Eka Wijaya',
        email: 'eka@kmits.its.ac.id',
        skills: ['Finance', 'Business Analysis'],
        interests: ['Startups', 'Investment'],
        availability: 'Weekdays',
        matchScore: 78,
      },
    ]);

    setExperts([
      {
        id: '1',
        name: 'Dr. Hendra Gunawan',
        role: 'Senior Manager',
        company: 'PT Telkom Indonesia',
        expertise: ['Leadership', 'Strategic Management', 'Digital Transformation'],
        linkedin: 'https://linkedin.com/in/hendra',
        available: true,
      },
      {
        id: '2',
        name: 'Siti Aminah, MBA',
        role: 'Product Manager',
        company: 'Gojek',
        expertise: ['Product Management', 'Agile', 'User Research'],
        linkedin: 'https://linkedin.com/in/siti',
        available: true,
      },
      {
        id: '3',
        name: 'Rudi Hartono',
        role: 'Data Scientist',
        company: 'Tokopedia',
        expertise: ['Data Science', 'Machine Learning', 'Python'],
        linkedin: 'https://linkedin.com/in/rudi',
        available: false,
      },
      {
        id: '4',
        name: 'Maya Sari',
        role: 'UX Lead',
        company: 'Traveloka',
        expertise: ['UX Design', 'User Research', 'Design Thinking'],
        linkedin: 'https://linkedin.com/in/maya',
        available: true,
      },
      {
        id: '5',
        name: 'Bambang Sutrisno',
        role: 'CTO',
        company: 'Bukalapak',
        expertise: ['Technology Leadership', 'System Architecture', 'Cloud Computing'],
        linkedin: 'https://linkedin.com/in/bambang',
        available: true,
      },
      {
        id: '6',
        name: 'Linda Kusuma',
        role: 'HR Director',
        company: 'Shopee',
        expertise: ['Human Resources', 'Talent Management', 'Organizational Development'],
        linkedin: 'https://linkedin.com/in/linda',
        available: false,
      },
    ]);
  };

  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'course': return '📚';
      case 'ebook': return '📖';
      case 'tool': return '🛠️';
      default: return '📄';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const tabs = [
    { id: 'resources' as const, label: 'Resource Library', icon: BookOpen },
    { id: 'paths' as const, label: 'Learning Paths', icon: TrendingUp },
    { id: 'peers' as const, label: 'Peer Learning', icon: Users },
    { id: 'experts' as const, label: 'Expert Directory', icon: GraduationCap },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Knowledge Hub</h2>
        <p className="text-slate-600">Temukan sumber belajar, jalur pengembangan, dan koneksi dengan ahli</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">AI-Powered Recommendations</h3>
                <p className="text-purple-100 text-sm">
                  Resources are personalized based on your assessment results and skill gaps
                </p>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                      {resource.relevanceScore && resource.relevanceScore > 80 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {resource.relevanceScore}% match
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{resource.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{resource.category}</span>
                    {resource.duration && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(resource.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">{resource.rating}</span>
                    <span className="text-xs text-slate-500">• {resource.views} views</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {resource.url ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Access Resource
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        View Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Paths Tab */}
      {activeTab === 'paths' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">AI-Generated Learning Paths</h3>
                <p className="text-green-100 text-sm">
                  Personalized learning paths based on your skills gap analysis
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div key={path.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(path.level)}`}>
                      {path.level}
                    </span>
                    <span className="text-sm text-slate-600">{path.duration}</span>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{path.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{path.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="text-sm font-medium text-slate-900">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Modules:</p>
                    <ul className="space-y-1">
                      {path.modules.map((module, index) => (
                        <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                          {module}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {path.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    {path.progress > 0 ? 'Continue Learning' : 'Start Path'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peer Learning Tab */}
      {activeTab === 'peers' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Peer Learning Matching</h3>
                <p className="text-orange-100 text-sm">
                  Connect with peers who have complementary skills and interests
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peerMatches.map((peer) => (
              <div key={peer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{peer.name.charAt(0)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-orange-600">{peer.matchScore}%</span>
                    <p className="text-xs text-slate-500">match</p>
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{peer.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{peer.email}</p>

                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {peer.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1">Interests:</p>
                  <div className="flex flex-wrap gap-1">
                    {peer.interests.map((interest, index) => (
                      <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {peer.availability}
                  </span>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experts Tab */}
      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Expert Directory</h3>
                <p className="text-indigo-100 text-sm">
                  Connect with alumni and industry experts for mentorship and guidance
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{expert.name.charAt(0)}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    expert.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${expert.available ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    {expert.available ? 'Available' : 'Busy'}
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{expert.name}</h3>
                <p className="text-sm text-slate-600 mb-1">{expert.role}</p>
                <p className="text-xs text-slate-500 mb-3">{expert.company}</p>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.expertise.map((exp, index) => (
                      <span key={index} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {expert.available && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Request Mentorship
                    </button>
                  )}
                  {expert.linkedin && (
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
