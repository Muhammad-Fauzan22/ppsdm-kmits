"use client";

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download
} from 'lucide-react';


// Types for data from Google Sheets
interface AssessmentData {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'not_started';
  score?: number;
  completedDate?: string;
}

interface ActivityData {
  id: string;
  name: string;
  date: string;
  status: 'registered' | 'attended' | 'completed';
  category: string;
}

interface SkillData {
  skill: string;
  level: number;
  category: string;
}

interface KnowledgeData {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relevanceScore: number;
}

interface MemberData {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  skills: SkillData[];
}

export function PersonalDashboard() {
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [recommendations, setRecommendations] = useState<KnowledgeData[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load data via API calls instead of direct GoogleSheetsService
      const [memberResponse, assessmentsResponse, activitiesResponse, knowledgeResponse] = await Promise.all([
        fetch('/api/member/profile').then(r => r.json()).catch(() => null),
        fetch('/api/member/assessments').then(r => r.json()).catch(() => null),
        fetch('/api/member/activities').then(r => r.json()).catch(() => null),
        fetch('/api/member/knowledge').then(r => r.json()).catch(() => null),
      ]);

      // Set member data
      if (memberResponse?.success) {
        setMemberData(memberResponse.data);
      }

      // Set assessment data
      if (assessmentsResponse?.success) {
        setAssessments(assessmentsResponse.data);
      }

      // Set activity data
      if (activitiesResponse?.success) {
        setActivities(activitiesResponse.data);
      }

      // Set knowledge recommendations
      if (knowledgeResponse?.success) {
        setRecommendations(knowledgeResponse.data);
      }

    } catch (error) {
      // Set mock data for demo
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const parseSkills = (skillsString: string): SkillData[] => {
    try {
      return JSON.parse(skillsString || '[]');
    } catch {
      return [];
    }
  };

  const setMockData = () => {
    setMemberData({
      id: '1',
      name: 'Member Demo',
      email: 'member@kmits.its.ac.id',
      joinDate: '2024-01-15',
      status: 'active',
      skills: [
        { skill: 'Leadership', level: 75, category: 'Soft Skills' },
        { skill: 'Communication', level: 80, category: 'Soft Skills' },
        { skill: 'Project Management', level: 65, category: 'Technical' },
        { skill: 'Data Analysis', level: 70, category: 'Technical' },
      ],
    });
    setAssessments([
      { id: '1', name: 'Cognitive Assessment', status: 'completed', score: 85, completedDate: '2024-01-20' },
      { id: '2', name: 'Emotional Intelligence', status: 'completed', score: 78, completedDate: '2024-01-25' },
      { id: '3', name: 'Leadership Assessment', status: 'in_progress' },
      { id: '4', name: 'Financial Intelligence', status: 'not_started' },
    ]);
    setActivities([
      { id: '1', name: 'Leadership Workshop', date: '2024-02-15', status: 'attended', category: 'Workshop' },
      { id: '2', name: 'Team Building Event', date: '2024-02-20', status: 'registered', category: 'Event' },
      { id: '3', name: 'Mentoring Session', date: '2024-02-25', status: 'registered', category: 'Mentoring' },
    ]);
    setRecommendations([
      { id: '1', title: 'Advanced Leadership Strategies', category: 'Leadership', difficulty: 'advanced', relevanceScore: 95 },
      { id: '2', title: 'Effective Communication Skills', category: 'Communication', difficulty: 'intermediate', relevanceScore: 88 },
      { id: '3', title: 'Project Management Fundamentals', category: 'Management', difficulty: 'beginner', relevanceScore: 82 },
      { id: '4', title: 'Data-Driven Decision Making', category: 'Analytics', difficulty: 'intermediate', relevanceScore: 78 },
      { id: '5', title: 'Team Collaboration Best Practices', category: 'Teamwork', difficulty: 'beginner', relevanceScore: 75 },
    ]);
  };

  const completedAssessments = assessments.filter(a => a.status === 'completed').length;
  const totalAssessments = assessments.length;
  const assessmentProgress = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0;

  const attendedActivities = activities.filter(a => a.status === 'attended' || a.status === 'completed').length;
  const totalActivities = activities.length;
  const activityProgress = totalActivities > 0 ? Math.round((attendedActivities / totalActivities) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Selamat Datang, {memberData?.name || 'Member'}!
        </h2>
        <p className="text-blue-100">
          Lanjutkan perjalanan pengembangan diri Anda bersama PPSDM KMITS
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{assessmentProgress}%</span>
          </div>
          <p className="text-sm text-slate-600">Assessment Progress</p>
          <p className="text-xs text-slate-500 mt-1">{completedAssessments}/{totalAssessments} completed</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{activityProgress}%</span>
          </div>
          <p className="text-sm text-slate-600">Activity Participation</p>
          <p className="text-xs text-slate-500 mt-1">{attendedActivities}/{totalActivities} attended</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{memberData?.skills.length || 0}</span>
          </div>
          <p className="text-sm text-slate-600">Skills Developed</p>
          <p className="text-xs text-slate-500 mt-1">Across multiple categories</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{recommendations.length}</span>
          </div>
          <p className="text-sm text-slate-600">Learning Resources</p>
          <p className="text-xs text-slate-500 mt-1">Recommended for you</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Assessment Progress</h3>
          </div>
          <div className="p-5 space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {assessment.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : assessment.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{assessment.name}</p>
                    {assessment.completedDate && (
                      <p className="text-xs text-slate-500">Completed: {assessment.completedDate}</p>
                    )}
                  </div>
                </div>
                {assessment.score !== undefined && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">{assessment.score}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skill Development */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Skill Development</h3>
          </div>
          <div className="p-5 space-y-4">
            {memberData?.skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{skill.skill}</span>
                  <span className="text-sm text-slate-500">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{skill.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Learning Recommendations</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    rec.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    rec.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {rec.difficulty}
                  </span>
                  <span className="text-xs text-slate-500">{rec.relevanceScore}% match</span>
                </div>
                <h4 className="font-medium text-slate-900 mb-1">{rec.title}</h4>
                <p className="text-xs text-slate-500">{rec.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-slate-900">Start New Assessment</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="font-medium text-slate-900">Browse Activities</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Download className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-slate-900">Download Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
