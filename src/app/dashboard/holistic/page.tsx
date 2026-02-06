/**
 * Holistic Assessment Dashboard Page
 * 
 * Dashboard komprehensif yang mengintegrasikan 10 diagram visualisasi
 * untuk 9-dimension holistic assessment system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HolisticRadarChart } from '@/components/visualizations/HolisticRadarChart';
import { CognitiveSunburst } from '@/components/holistic/CognitiveSunburst';
import { SelfManagementTimeline } from '@/components/holistic/SelfManagementTimeline';
import { FinancialWaterfall } from '@/components/holistic/FinancialWaterfall';
import { PhysicalHealthGauges } from '@/components/holistic/PhysicalHealthGauges';
import { EmotionalSocialNetwork } from '@/components/holistic/EmotionalSocialNetwork';
import { MentalHealthBar } from '@/components/holistic/MentalHealthBar';
import { CharacterFlower } from '@/components/holistic/CharacterFlower';
import { SpiritualTree } from '@/components/holistic/SpiritualTree';
import { EnvironmentalDashboard } from '@/components/holistic/EnvironmentalDashboard';
import { DevelopmentCycle } from '@/components/holistic/DevelopmentCycle';
import { dimensions } from '@/data/dimensions';
import type { DimensionData } from '@/data/dimensions';

const DIMENSIONS = dimensions.reduce((acc, d) => ({ ...acc, [d.id]: d }), {} as Record<number, DimensionData>);

// --- MOCK DATA FOR COMPONENTS ---

// 1. Holistic Radar Chart
const mockRadarData = [
  { dimension: 'Kognitif', shortName: 'Kognitif', score: 75, percentile: 65, previous: 70, target: 85, color: '#3b82f6', facultyAverage: 65 },
  { dimension: 'Manajemen Diri', shortName: 'Manajemen Diri', score: 68, percentile: 60, previous: 65, target: 80, color: '#10b981', facultyAverage: 60 },
  { dimension: 'Finansial', shortName: 'Finansial', score: 60, percentile: 58, previous: 55, target: 80, color: '#ef4444', facultyAverage: 58 },
  { dimension: 'Kesehatan Fisik', shortName: 'Kesehatan Fisik', score: 82, percentile: 70, previous: 80, target: 90, color: '#14b8a6', facultyAverage: 70 },
  { dimension: 'Emosional & Sosial', shortName: 'Emosional & Sosial', score: 78, percentile: 72, previous: 75, target: 85, color: '#8b5cf6', facultyAverage: 72 },
  { dimension: 'Kesehatan Mental', shortName: 'Kesehatan Mental', score: 70, percentile: 65, previous: 68, target: 85, color: '#6366f1', facultyAverage: 65 },
  { dimension: 'Karakter & Etika', shortName: 'Karakter', score: 85, percentile: 75, previous: 82, target: 90, color: '#f59e0b', facultyAverage: 75 },
  { dimension: 'Spiritual', shortName: 'Spiritual', score: 65, percentile: 62, previous: 60, target: 80, color: '#f97316', facultyAverage: 62 },
  { dimension: 'Lingkungan', shortName: 'Lingkungan', score: 72, percentile: 68, previous: 68, target: 85, color: '#06b6d4', facultyAverage: 68 }
];

// 2. Cognitive Sunburst
const mockSunburstData = {
  name: 'Kognitif',
  value: 75,
  children: [
    {
      name: 'Critical Thinking',
      value: 75,
      children: [
        { name: 'Analytical Thinking', value: 80, mastery: 'mastered' as const },
        { name: 'Logical Reasoning', value: 75, mastery: 'developing' as const },
        { name: 'Evidence Evaluation', value: 70, mastery: 'developing' as const },
        { name: 'Bias Recognition', value: 75, mastery: 'developing' as const }
      ]
    },
    {
      name: 'Growth Mindset',
      value: 70,
      children: [
        { name: 'Learning Orientation', value: 75, mastery: 'developing' as const },
        { name: 'Resilience to Failure', value: 70, mastery: 'developing' as const },
        { name: 'Effort Belief', value: 65, mastery: 'developing' as const },
        { name: 'Challenge Seeking', value: 70, mastery: 'developing' as const }
      ]
    },
    {
      name: 'Creativity',
      value: 80,
      children: [
        { name: 'Idea Generation', value: 85, mastery: 'mastered' as const },
        { name: 'Divergent Thinking', value: 80, mastery: 'mastered' as const },
        { name: 'Problem Solving', value: 75, mastery: 'developing' as const },
        { name: 'Innovation', value: 80, mastery: 'mastered' as const }
      ]
    },
    {
      name: 'Metacognition',
      value: 72,
      children: [
        { name: 'Self Monitoring', value: 75, mastery: 'developing' as const },
        { name: 'Strategy Selection', value: 70, mastery: 'developing' as const },
        { name: 'Knowledge Integration', value: 72, mastery: 'developing' as const },
        { name: 'Learning Adjustment', value: 70, mastery: 'developing' as const }
      ]
    }
  ]
};

// 3. Self Management Timeline
const mockTimelineData = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-01-${i + 1}`,
  deepWork: Math.floor(Math.random() * 100),
  taskCompletion: Math.floor(Math.random() * 100),
  focusDuration: Math.floor(Math.random() * 100),
  distractions: Math.floor(Math.random() * 10)
}));

const mockGaugeMetrics = [
  { name: 'Focus', value: 75, target: 90, color: '#10b981' },
  { name: 'Discipline', value: 65, target: 85, color: '#f59e0b' },
  { name: 'Consistency', value: 80, target: 90, color: '#3b82f6' },
  { name: 'Planning', value: 70, target: 85, color: '#8b5cf6' }
];

const mockHeatmapData = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-01-${i + 1}`,
  habits: {
    morning_routine: Math.floor(Math.random() * 4),
    deep_work_sessions: Math.floor(Math.random() * 5),
    exercise: Math.random() > 0.5 ? 1 : 0
  }
}));

// 4. Financial Waterfall
const mockWaterfallData = [
  { name: 'Income', value: 5000000, type: 'income' as const },
  { name: 'Expenses', value: -3000000, type: 'expense' as const },
  { name: 'Savings', value: -1000000, type: 'savings' as const },
  { name: 'Investment', value: -500000, type: 'investment' as const },
  { name: 'Remaining', value: 500000, type: 'balance' as const }
];

const mockNetworkNodes = [
  { id: '1', name: 'Budgeting', mastery: 80, group: 'Basics' },
  { id: '2', name: 'Investing', mastery: 60, group: 'Growth' },
  { id: '3', name: 'Saving', mastery: 90, group: 'Basics' }
];

const mockNetworkLinks = [
  { source: '1', target: '3', strength: 0.8 },
  { source: '3', target: '2', strength: 0.5 }
];

const mockFinancialGoals = [
  { id: '1', name: 'Emergency Fund', current: 5000000, target: 10000000, deadline: '2024-12-31', category: 'emergency' as const }
];

// 5. Physical Health Gauges
const mockHealthMetrics = [
  { name: 'Sleep', value: 85, target: 100, category: 'sleep' as const, unit: 'quality' },
  { name: 'Activity', value: 70, target: 100, category: 'activity' as const, unit: 'score' },
  { name: 'Nutrition', value: 60, target: 100, category: 'nutrition' as const, unit: 'score' },
  { name: 'Hydration', value: 90, target: 100, category: 'hydration' as const, unit: '%' }
];

const mockHealthRisks = [
  { risk: 'Sedentary Lifestyle', severity: 'moderate' as const, impact: 'Reduced energy' }
];

// 6. Emotional Social Network
const mockEICompetencies = [
  { id: '1', name: 'Self Awareness', category: 'self_awareness' as const, score: 80, facultyAverage: 70, description: 'Awareness of own emotions', icon: '🧠' },
  { id: '2', name: 'Empathy', category: 'social_awareness' as const, score: 75, facultyAverage: 65, description: 'Sensing others emotions', icon: '❤️' },
  { id: '3', name: 'Self Control', category: 'self_management' as const, score: 70, facultyAverage: 60, description: 'Managing impulses', icon: '🎮' },
  { id: '4', name: 'Leadership', category: 'relationship_management' as const, score: 65, facultyAverage: 55, description: 'Inspiring others', icon: '👑' }
];

const mockEIConnections = [
  { source: '1', target: '3', strength: 0.9, type: 'strong' as const },
  { source: '2', target: '4', strength: 0.8, type: 'strong' as const },
  { source: '1', target: '2', strength: 0.6, type: 'moderate' as const }
];

const mockEIProfile = {
  type: 'balanced_high_ei',
  description: 'Balanced profile with high emotional intelligence',
  strengths: ['Self Awareness', 'Empathy'],
  developmentAreas: ['Leadership']
};

// 7. Mental Health Bar
const mockMentalHealthMetrics = [
  { name: 'Resilience', value: 80, target: 100, category: 'resilience' as const, description: 'Ability to bounce back' },
  { name: 'Optimism', value: 75, target: 100, category: 'wellbeing' as const, description: 'Positive outlook' },
  { name: 'Stress Mgmt', value: 70, target: 100, category: 'stress' as const, description: 'Handling pressure' }
];

const mockRiskFlags = [
  { risk: 'High Academic Pressure', severity: 'moderate' as const, impact: 'Anxiety', recommendation: 'Take breaks' }
];

const mockFlourishing = {
  level: 'Flourishing',
  description: 'High levels of wellbeing',
  color: '#10b981',
  icon: '🌱'
};

// 8. Character Flower
const mockCharacterStrengths = [
  { name: 'Integrity', score: 90, target: 100, category: 'integrity' as const, description: 'Honesty', icon: '🛡️' },
  { name: 'Compassion', score: 85, target: 100, category: 'compassion' as const, description: 'Kindness', icon: '❤️' },
  { name: 'Responsibility', score: 80, target: 100, category: 'responsibility' as const, description: 'Accountability', icon: '🤝' }
];

const mockEthicalMaturity = {
  level: 'Principled',
  description: 'Guided by internal values',
  color: '#f59e0b',
  icon: '⭐'
};

// 9. Spiritual Tree
const mockSpiritualComponents = [
  { name: 'Purpose', score: 75, target: 100, category: 'purpose' as const, description: 'Meaning in life', practices: ['Journaling'], icon: '🎯' },
  { name: 'Gratitude', score: 80, target: 100, category: 'gratitude' as const, description: 'Thankfulness', practices: ['Gratitude Log'], icon: '🙏' }
];

const mockIkigai = {
  whatYouLove: 80,
  whatYouAreGoodAt: 70,
  whatTheWorldNeeds: 75,
  whatYouCanBePaidFor: 60
};

const mockSpiritualMaturity = {
  level: 'Awakening',
  description: 'Exploring deeper meaning',
  color: '#8b5cf6',
  icon: '✨'
};

// 10. Environmental Dashboard
const mockEnvironmentalMetrics = [
  { name: 'Eco Awareness', value: 85, target: 100, category: 'awareness' as const, description: 'Knowledge of eco issues', icon: '🌍' },
  { name: 'Sustainable Habits', value: 70, target: 100, category: 'behavior' as const, description: 'Daily eco actions', icon: '♻️' }
];

const mockSustainability = {
  sustainableBehavior: 'High',
  workLifeBalance: 'Moderate',
  digitalWellbeing: 'Good',
  carbonFootprint: 2.5,
  communityEngagement: 'Active'
};

// 11. Development Cycle
const mockDimensionScores = [
  { id: 1, name: 'Kognitif', score: 75, previousScore: 70, target: 85, category: 'cognitive' as const, color: '#3b82f6', icon: '🧠' },
  { id: 2, name: 'Manajemen Diri', score: 68, previousScore: 65, target: 80, category: 'self-management' as const, color: '#22c55e', icon: '⏰' },
  { id: 3, name: 'Finansial', score: 60, previousScore: 55, target: 80, category: 'financial' as const, color: '#ef4444', icon: '💰' },
  { id: 4, name: 'Kesehatan Fisik', score: 82, previousScore: 80, target: 90, category: 'physical' as const, color: '#10b981', icon: '💪' },
  { id: 5, name: 'Emosional & Sosial', score: 78, previousScore: 75, target: 85, category: 'emotional' as const, color: '#8b5cf6', icon: '❤️' },
  { id: 6, name: 'Kesehatan Mental', score: 70, previousScore: 68, target: 85, category: 'mental' as const, color: '#6366f1', icon: '🧘' },
  { id: 7, name: 'Karakter & Etika', score: 85, previousScore: 82, target: 90, category: 'character' as const, color: '#f59e0b', icon: '⭐' },
  { id: 8, name: 'Spiritual', score: 65, previousScore: 60, target: 80, category: 'spiritual' as const, color: '#ec4899', icon: '🌟' },
  { id: 9, name: 'Lingkungan', score: 72, previousScore: 68, target: 85, category: 'environmental' as const, color: '#06b6d4', icon: '🌍' }
];

const mockHolisticMetrics = {
  overallScore: 72.8,
  balanceIndex: 0.85,
  growthRate: 5.2,
  strengths: ['Karakter & Etika', 'Kesehatan Fisik', 'Emosional & Sosial'],
  growthAreas: ['Finansial', 'Spiritual', 'Manajemen Diri'],
  quadrantAnalysis: {
    cognitive: 67.6,
    affective: 76.6,
    social: 74.3
  }
};

const mockCurrentPhase = {
  phase: 'competent',
  description: 'Competent across most dimensions, ready for advanced challenges',
  color: '#22c55e',
  icon: '🚀',
  requirements: ['Maintain balance', 'Focus on growth areas']
};

export default function HolisticDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Holistic Assessment Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive view of your 9-dimension development</p>
        </header>

        {/* 1. Radar Chart */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Holistic Radar</h2>
          <HolisticRadarChart data={mockRadarData} />
        </section>

        {/* 2. Cognitive Sunburst */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Cognitive Competency</h2>
          <CognitiveSunburst data={mockSunburstData} />
        </section>

        {/* 3. Self Management */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <SelfManagementTimeline
            timelineData={mockTimelineData}
            gaugeMetrics={mockGaugeMetrics}
            heatmapData={mockHeatmapData}
          />
        </section>

        {/* 4. Financial */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <FinancialWaterfall
            waterfallData={mockWaterfallData}
            networkNodes={mockNetworkNodes}
            networkLinks={mockNetworkLinks}
            goals={mockFinancialGoals}
          />
        </section>

        {/* 5. Physical Health */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <PhysicalHealthGauges
            metrics={mockHealthMetrics}
            risks={mockHealthRisks}
            vitalityIndex={78}
          />
        </section>

        {/* 6. Emotional & Social */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <EmotionalSocialNetwork
            competencies={mockEICompetencies}
            connections={mockEIConnections}
            profile={mockEIProfile}
            overallScore={75}
          />
        </section>

        {/* 7. Mental Health */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <MentalHealthBar
            metrics={mockMentalHealthMetrics}
            riskFlags={mockRiskFlags}
            flourishingLevel={mockFlourishing}
            overallScore={75}
          />
        </section>

        {/* 8. Character */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <CharacterFlower
            strengths={mockCharacterStrengths}
            ethicalMaturity={mockEthicalMaturity}
            signatureStrengths={['Integrity', 'Compassion']}
            developmentAreas={['Responsibility']}
            overallScore={85}
          />
        </section>

        {/* 9. Spiritual */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <SpiritualTree
            components={mockSpiritualComponents}
            ikigaiProfile={mockIkigai}
            spiritualMaturity={mockSpiritualMaturity}
            lifeSatisfactionIndex={80}
            purposeClarity={85}
          />
        </section>

        {/* 10. Environmental */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <EnvironmentalDashboard
            metrics={mockEnvironmentalMetrics}
            sustainabilityIndicators={mockSustainability}
            lifestyleHealth={{ level: 'Healthy', description: 'Good habits', color: '#10b981', icon: '🌿' }}
            overallScore={78}
          />
        </section>

        {/* 11. Development Cycle */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <DevelopmentCycle
            dimensions={mockDimensionScores}
            metrics={mockHolisticMetrics}
            currentPhase={mockCurrentPhase}
          />
        </section>
      </div>
    </div>
  );
}
