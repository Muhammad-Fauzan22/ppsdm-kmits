"use client";

import React, { useEffect, useState } from 'react';
import { 
  DollarSign,
  FolderOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  Calendar,
  Users,
  Building2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';

// Types for transparency data
interface FinancialData {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  status: 'verified' | 'pending';
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  budget: number;
  spent: number;
  progress: number;
  team: string[];
}

interface MeetingData {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  minutesUrl?: string;
  agenda: string[];
}

interface DocumentData {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  size: string;
  type: string;
  url?: string;
}

export function TransparencyPortal() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'financial' | 'projects' | 'meetings' | 'documents'>('financial');
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTransparencyData();
  }, []);

  const loadTransparencyData = async () => {
    try {
      const sheetsService = GoogleSheetsService.getInstance();
      const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

      // Load financial data
      const financesData = await sheetsService.getSheetData(spreadsheetId, 'Finances');
      setFinancialData(financesData.map((f: any) => ({
        id: f.id || '',
        category: f.category || '',
        description: f.description || '',
        amount: f.amount ? parseFloat(f.amount) : 0,
        date: f.date || '',
        type: f.type || 'expense',
        status: f.status || 'verified',
      })));

      // Load projects data
      const projectsData = await sheetsService.getSheetData(spreadsheetId, 'Projects');
      setProjects(projectsData.map((p: any) => ({
        id: p.id || '',
        name: p.name || '',
        description: p.description || '',
        startDate: p.startDate || '',
        endDate: p.endDate || '',
        status: p.status || 'planning',
        budget: p.budget ? parseFloat(p.budget) : 0,
        spent: p.spent ? parseFloat(p.spent) : 0,
        progress: p.progress ? parseInt(p.progress) : 0,
        team: p.team ? JSON.parse(p.team) : [],
      })));

      // Load meetings data
      const meetingsData = await sheetsService.getSheetData(spreadsheetId, 'Activities');
      setMeetings(meetingsData
        .filter((m: any) => m.category === 'meeting')
        .map((m: any) => ({
          id: m.id || '',
          title: m.name || '',
          date: m.date || '',
          location: m.location || '',
          attendees: m.attendees ? parseInt(m.attendees) : 0,
          minutesUrl: m.minutesUrl,
          agenda: m.agenda ? JSON.parse(m.agenda) : [],
        }))
      );

      // Load documents data
      const documentsData = await sheetsService.getSheetData(spreadsheetId, 'Documents');
      setDocuments(documentsData.map((d: any) => ({
        id: d.id || '',
        name: d.name || '',
        category: d.category || '',
        uploadDate: d.uploadDate || '',
        size: d.size || '',
        type: d.type || '',
        url: d.url,
      })));

    } catch (error) {
      console.error('Error loading transparency data:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setFinancialData([
      { id: '1', category: 'Membership Fees', description: 'Pemasukan dari iuran anggota', amount: 15000000, date: '2024-01-15', type: 'income', status: 'verified' },
      { id: '2', category: 'Event Revenue', description: 'Pendapatan dari event Leadership Workshop', amount: 5000000, date: '2024-01-20', type: 'income', status: 'verified' },
      { id: '3', category: 'Venue Rental', description: 'Sewa venue untuk kegiatan', amount: 3000000, date: '2024-01-18', type: 'expense', status: 'verified' },
      { id: '4', category: 'Training Materials', description: 'Pembelian materi training', amount: 2000000, date: '2024-01-22', type: 'expense', status: 'verified' },
      { id: '5', category: 'Catering', description: 'Konsumsi kegiatan', amount: 1500000, date: '2024-01-25', type: 'expense', status: 'pending' },
      { id: '6', category: 'Sponsorship', description: 'Sponsorship dari partner', amount: 10000000, date: '2024-02-01', type: 'income', status: 'verified' },
    ]);

    setProjects([
      {
        id: '1',
        name: 'Leadership Development Program',
        description: 'Program pengembangan kepemimpinan untuk anggota aktif',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        status: 'in_progress',
        budget: 25000000,
        spent: 12000000,
        progress: 48,
        team: ['Ahmad', 'Budi', 'Citra', 'Dewi'],
      },
      {
        id: '2',
        name: 'Digital Transformation',
        description: 'Modernisasi sistem dan platform digital PPSDM',
        startDate: '2024-02-01',
        endDate: '2024-08-31',
        status: 'in_progress',
        budget: 35000000,
        spent: 8000000,
        progress: 23,
        team: ['Eko', 'Fajar', 'Gita'],
      },
      {
        id: '3',
        name: 'Community Outreach',
        description: 'Program pengabdian masyarakat',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        status: 'planning',
        budget: 15000000,
        spent: 0,
        progress: 0,
        team: ['Hana', 'Indra'],
      },
      {
        id: '4',
        name: 'Annual Summit 2024',
        description: 'Acara tahunan PPSDM KMITS',
        startDate: '2024-01-10',
        endDate: '2024-01-15',
        status: 'completed',
        budget: 20000000,
        spent: 18500000,
        progress: 100,
        team: ['Joko', 'Kartika', 'Lina', 'Made'],
      },
    ]);

    setMeetings([
      {
        id: '1',
        title: 'Rapat Koordinasi Bulanan',
        date: '2024-02-05',
        location: 'Ruang Rapat A',
        attendees: 25,
        minutesUrl: '/documents/minutes-feb-2024.pdf',
        agenda: ['Evaluasi kegiatan bulan lalu', 'Perencanaan kegiatan bulan ini', 'Update proyek berjalan'],
      },
      {
        id: '2',
        title: 'Rapat Pengurus Harian',
        date: '2024-02-01',
        location: 'Online (Zoom)',
        attendees: 10,
        agenda: ['Review keuangan', 'Approval proposal kegiatan', 'Update membership'],
      },
      {
        id: '3',
        title: 'Rapat Persiapan Event',
        date: '2024-01-28',
        location: 'Lab Komputer 2',
        attendees: 15,
        agenda: ['Finalisasi rundown', 'Pembagian tugas', 'Koordinasi vendor'],
      },
    ]);

    setDocuments([
      { id: '1', name: 'Laporan Keuangan Q1 2024', category: 'Financial', uploadDate: '2024-01-31', size: '2.5 MB', type: 'PDF', url: '#' },
      { id: '2', name: 'AD/ART PPSDM KMITS', category: 'Legal', uploadDate: '2023-12-01', size: '1.2 MB', type: 'PDF', url: '#' },
      { id: '3', name: 'Program Kerja 2024', category: 'Planning', uploadDate: '2024-01-05', size: '3.8 MB', type: 'PDF', url: '#' },
      { id: '4', name: 'Notulen Rapat Januari 2024', category: 'Meeting', uploadDate: '2024-01-31', size: '500 KB', type: 'PDF', url: '#' },
      { id: '5', name: 'SOP Kegiatan', category: 'Procedure', uploadDate: '2023-11-15', size: '1.8 MB', type: 'PDF', url: '#' },
      { id: '6', name: 'Formulir Pendaftaran', category: 'Form', uploadDate: '2024-01-10', size: '200 KB', type: 'DOCX', url: '#' },
    ]);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const totalIncome = financialData.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = financialData.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'planning': return 'bg-purple-100 text-purple-700';
      case 'on_hold': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const tabs = [
    { id: 'financial' as const, label: 'Financial Reports', icon: DollarSign },
    { id: 'projects' as const, label: 'Project Updates', icon: FolderOpen },
    { id: 'meetings' as const, label: 'Meeting Minutes', icon: FileText },
    { id: 'documents' as const, label: 'Document Repository', icon: FolderOpen },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Transparency Portal</h2>
        <p className="text-slate-600">Akses informasi keuangan, proyek, dan dokumen secara transparan</p>
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

      {/* Financial Reports Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-slate-600">Total Income</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm text-slate-600">Total Expense</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-slate-600">Balance</span>
              </div>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          {/* Financial Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Financial Transactions</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="divide-y divide-slate-200">
              {financialData.map((item) => (
                <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {item.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.description}</p>
                        <p className="text-sm text-slate-500">{item.category} • {item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Start Date</p>
                      <p className="text-sm font-medium text-slate-900">{project.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">End Date</p>
                      <p className="text-sm font-medium text-slate-900">{project.endDate}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="text-sm font-medium text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Budget</p>
                      <p className="text-sm font-medium text-slate-900">{formatCurrency(project.budget)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Spent</p>
                      <p className="text-sm font-medium text-slate-900">{formatCurrency(project.spent)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(project.id)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {expandedItems.has(project.id) ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show Details
                      </>
                    )}
                  </button>

                  {expandedItems.has(project.id) && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-2">Team Members:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.team.map((member, index) => (
                          <span key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{meeting.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Meeting</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span>{meeting.attendees} attendees</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Agenda:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {meeting.agenda.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {meeting.minutesUrl && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4">
                    <Eye className="w-4 h-4" />
                    View Minutes
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents
              .filter(doc => 
                doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{doc.type}</span>
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1 line-clamp-2">{doc.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{doc.category}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{doc.uploadDate}</span>
                    <span>{doc.size}</span>
                  </div>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
