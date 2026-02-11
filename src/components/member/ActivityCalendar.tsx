"use client";

import React, { useEffect, useState } from 'react';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Download,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';


// Types for activity data
interface Activity {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'workshop' | 'seminar' | 'training' | 'event' | 'mentoring';
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrationStatus?: 'registered' | 'attended' | 'completed' | 'not_registered';
  feedbackSubmitted?: boolean;
  certificateGenerated?: boolean;
}

interface Feedback {
  activityId: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export function ActivityCalendar() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registered' | 'completed'>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      // Load activities via API instead of direct GoogleSheetsService
      const response = await fetch('/api/member/activities').then(r => r.json());
      const activitiesData = response.success ? response.data : [];
      setActivities(activitiesData.map((a: any) => ({
        id: a.id || '',
        name: a.name || '',
        description: a.description || '',
        date: a.date || '',
        time: a.time || '',
        location: a.location || '',
        category: a.category || 'event',
        maxParticipants: a.maxParticipants ? parseInt(a.maxParticipants) : 50,
        currentParticipants: a.currentParticipants ? parseInt(a.currentParticipants) : 0,
        status: a.status || 'upcoming',
        registrationStatus: a.registrationStatus || 'not_registered',
        feedbackSubmitted: a.feedbackSubmitted === 'true',
        certificateGenerated: a.certificateGenerated === 'true',
      })));
    } catch (error) {
      setMockActivities();
    } finally {
      setLoading(false);
    }
  };

  const setMockActivities = () => {
    setActivities([
      {
        id: '1',
        name: 'Leadership Workshop',
        description: 'Pelatihan kepemimpinan untuk mengembangkan kemampuan memimpin tim dan mengambil keputusan strategis.',
        date: '2024-02-15',
        time: '09:00 - 16:00',
        location: 'Ruang Rapat A, Gedung PPSDM',
        category: 'workshop',
        maxParticipants: 30,
        currentParticipants: 25,
        status: 'upcoming',
        registrationStatus: 'registered',
      },
      {
        id: '2',
        name: 'Team Building Event',
        description: 'Kegiatan outbound untuk mempererat kerjasama antar anggota tim.',
        date: '2024-02-20',
        time: '08:00 - 17:00',
        location: 'Taman Rekreasi ITS',
        category: 'event',
        maxParticipants: 50,
        currentParticipants: 42,
        status: 'upcoming',
        registrationStatus: 'registered',
      },
      {
        id: '3',
        name: 'Mentoring Session',
        description: 'Sesi mentoring dengan alumni untuk berbagi pengalaman karir.',
        date: '2024-02-25',
        time: '14:00 - 16:00',
        location: 'Online (Zoom)',
        category: 'mentoring',
        maxParticipants: 20,
        currentParticipants: 15,
        status: 'upcoming',
        registrationStatus: 'not_registered',
      },
      {
        id: '4',
        name: 'Project Management Training',
        description: 'Pelatihan manajemen proyek dengan metodologi Agile dan Scrum.',
        date: '2024-01-20',
        time: '09:00 - 17:00',
        location: 'Lab Komputer 1',
        category: 'training',
        maxParticipants: 25,
        currentParticipants: 25,
        status: 'completed',
        registrationStatus: 'attended',
        feedbackSubmitted: true,
        certificateGenerated: true,
      },
      {
        id: '5',
        name: 'Communication Skills Seminar',
        description: 'Seminar tentang teknik komunikasi efektif di lingkungan profesional.',
        date: '2024-01-15',
        time: '13:00 - 16:00',
        location: 'Auditorium',
        category: 'seminar',
        maxParticipants: 100,
        currentParticipants: 85,
        status: 'completed',
        registrationStatus: 'attended',
        feedbackSubmitted: false,
        certificateGenerated: true,
      },
    ]);
  };

  const handleRegister = async (activityId: string) => {
    try {
      const response = await fetch('/api/member/register-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId }),
      });

      if (response.ok) {
        // Update local state
        setActivities(activities.map(a => 
          a.id === activityId 
            ? { ...a, registrationStatus: 'registered', currentParticipants: a.currentParticipants + 1 }
            : a
        ));
        setShowRegistrationModal(false);
      }
    } catch (error) {
      }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedActivity) return;

    try {
      const response = await fetch('/api/member/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: selectedActivity.id,
          rating: feedback.rating,
          comment: feedback.comment,
        }),
      });

      if (response.ok) {
        setActivities(activities.map(a => 
          a.id === selectedActivity.id 
            ? { ...a, feedbackSubmitted: true }
            : a
        ));
        setShowFeedbackModal(false);
        setFeedback({ rating: 5, comment: '' });
      }
    } catch (error) {
      }
  };

  const handleDownloadCertificate = (activity: Activity) => {
    // In a real implementation, this would generate and download a PDF certificate
    alert(`Downloading certificate for: ${activity.name}`);
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return activity.status === 'upcoming';
    if (filter === 'registered') return activity.registrationStatus === 'registered';
    if (filter === 'completed') return activity.status === 'completed';
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workshop': return 'bg-blue-100 text-blue-700';
      case 'seminar': return 'bg-purple-100 text-purple-700';
      case 'training': return 'bg-green-100 text-green-700';
      case 'event': return 'bg-orange-100 text-orange-700';
      case 'mentoring': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-slate-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Activity Calendar</h2>
          <p className="text-slate-600">Jelajahi dan daftar kegiatan yang tersedia</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'upcoming', 'registered', 'completed'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {activities.filter(a => a.status === 'upcoming').length}
              </p>
              <p className="text-sm text-slate-600">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {activities.filter(a => a.registrationStatus === 'registered').length}
              </p>
              <p className="text-sm text-slate-600">Registered</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {activities.filter(a => a.status === 'completed').length}
              </p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {activities.filter(a => a.certificateGenerated).length}
              </p>
              <p className="text-sm text-slate-600">Certificates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Status Bar */}
            <div className={`h-1 ${getStatusColor(activity.status)}`}></div>
            
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </span>
                {activity.registrationStatus === 'registered' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">{activity.name}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{activity.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{activity.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{activity.currentParticipants}/{activity.maxParticipants} participants</span>
                </div>
              </div>

              {/* Progress Bar for Participants */}
              <div className="mb-4">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(activity.currentParticipants / activity.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {activity.status === 'upcoming' && activity.registrationStatus === 'not_registered' && (
                  <button
                    onClick={() => {
                      setSelectedActivity(activity);
                      setShowRegistrationModal(true);
                    }}
                    disabled={activity.currentParticipants >= activity.maxParticipants}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Register
                  </button>
                )}
                {activity.status === 'completed' && activity.registrationStatus === 'attended' && !activity.feedbackSubmitted && (
                  <button
                    onClick={() => {
                      setSelectedActivity(activity);
                      setShowFeedbackModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Submit Feedback
                  </button>
                )}
                {activity.certificateGenerated && (
                  <button
                    onClick={() => handleDownloadCertificate(activity)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Register for Activity</h3>
            <div className="space-y-3 mb-6">
              <p className="font-medium text-slate-900">{selectedActivity.name}</p>
              <p className="text-sm text-slate-600">{selectedActivity.description}</p>
              <div className="text-sm text-slate-600">
                <p><strong>Date:</strong> {selectedActivity.date}</p>
                <p><strong>Time:</strong> {selectedActivity.time}</p>
                <p><strong>Location:</strong> {selectedActivity.location}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRegister(selectedActivity.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Submit Feedback</h3>
            <p className="text-sm text-slate-600 mb-4">{selectedActivity.name}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
              <textarea
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
