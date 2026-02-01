'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Trophy, Award, Flame, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [stats] = useState({
    coursesInProgress: 3,
    coursesCompleted: 5,
    totalXP: 2450,
    currentStreak: 7
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back!</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.coursesInProgress}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalXP.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total XP</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Continue Learning</CardTitle>
            <Link href="/courses">
              <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Your courses will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
