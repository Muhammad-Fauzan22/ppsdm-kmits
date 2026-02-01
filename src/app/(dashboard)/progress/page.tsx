'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, Clock, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ProgressPage() {
  const [stats] = useState({
    coursesCompleted: 5,
    coursesInProgress: 3,
    totalHours: 42,
    certificates: 2,
    avgScore: 87
  });

  const [courses] = useState([
    { title: 'Project Management', progress: 100, status: 'completed' },
    { title: 'Leadership Skills', progress: 75, status: 'in_progress' },
    { title: 'Communication', progress: 30, status: 'in_progress' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          Learning Progress
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card><CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.coursesInProgress}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalHours}</p>
            <p className="text-sm text-gray-500">Hours</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.certificates}</p>
            <p className="text-sm text-gray-500">Certificates</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.avgScore}%</p>
            <p className="text-sm text-gray-500">Avg Score</p>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Course Progress</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {courses.map((course, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{course.title}</span>
                  <span className="text-sm text-gray-500">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
