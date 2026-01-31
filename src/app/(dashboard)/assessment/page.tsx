/**
 * Holistic Assessment Dashboard
 * 9-Dimension Assessment dengan 10 Visualisasi Diagram
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Target, Clock, DollarSign, Heart, 
  Sparkles, Shield, Leaf, Activity, LayoutGrid 
} from 'lucide-react';
import { HolisticRadarChart } from '@/components/assessment/HolisticRadarChart';
import { CognitiveSunburst } from '@/components/assessment/CognitiveSunburst';
import { SelfManagementDashboard } from '@/components/assessment/SelfManagementDashboard';
import { FinancialWaterfall } from '@/components/assessment/FinancialWaterfall';
import { PhysicalHealthDashboard } from '@/components/assessment/PhysicalHealthDashboard';
import { EmotionalRadar } from '@/components/assessment/EmotionalRadar';
import { MentalHealthGauge } from '@/components/assessment/MentalHealthGauge';
import { CharacterTree } from '@/components/assessment/CharacterTree';
import { SpiritualSpiral } from '@/components/assessment/SpiritualSpiral';
import { EnvironmentalEco } from '@/components/assessment/EnvironmentalEco';
import { processHolisticAssessment } from '@/lib/assessment/engine';

// Mock data
const MOCK_ASSESSMENT_DATA = {
  userId: 'user_123',
  timestamp: new Date().toISOString(),
  responses: {
    'COG_CT1': 4, 'COG_CT2': 3, 'COG_GM1': 5, 'COG_GM2': 4,
    'COG_CRE1': 3, 'COG_CRE2': 4, 'COG_MET1': 4, 'COG_MET2': 3,
    'SM_TM1': 4, 'SM_TM2': 3, 'SM_PROC1': 2, 'SM_SC1': 4, 'SM_SC2': 3,
    'SM_DW1': 4, 'SM_EM1': 3, 'SM_PRIOR1': 4,
    'FIN_KNOW1': 1, 'FIN_KNOW2': 1, 'FIN_KNOW3': 0,
    'FIN_BEH1': 4, 'FIN_BEH2': 3, 'FIN_BEH3': 4,
    'FIN_EFF1': 4, 'FIN_EFF2': 3,
    'PHY_ACT1': 3, 'PHY_SLP1': 4, 'PHY_NUT1': 3, 'PHY_VIT1': 4,
    'PHY_HYDR1': 3, 'PHY_STR1': 4, 'PHY_PREV1': 2, 'PHY_BODY1': 4,
  }
};

const RADAR_DATA = [
  { dimension: 'Kognitif & Intelektual', shortName: 'Kognitif', current: 75, previous: 70, target: 85, facultyAverage: 72, color: '#3498db' },
  { dimension: 'Manajemen Diri & Produktivitas', shortName: 'Manajemen Diri', current: 68, previous: 65, target: 80, facultyAverage: 66, color: '#2ecc71' },
  { dimension: 'Kecerdasan Finansial', shortName: 'Finansial', current: 52, previous: 48, target: 75, facultyAverage: 55, color: '#e74c3c' },
  { dimension: 'Kesehatan Fisik & Vitalitas', shortName: 'Kesehatan Fisik', current: 72, previous: 68, target: 80, facultyAverage: 70, color: '#1abc9c' },
  { dimension: 'Kecerdasan Emosional & Sosial', shortName: 'Kecerdasan Emosional', current: 65, previous: 62, target: 78, facultyAverage: 67, color: '#9b59b6' },
  { dimension: 'Kesehatan Mental & Psikologis', shortName: 'Kesehatan Mental', current: 70, previous: 65, target: 82, facultyAverage: 68, color: '#34495e' },
  { dimension: 'Karakter & Etika', shortName: 'Karakter', current: 78, previous: 75, target: 85, facultyAverage: 74, color: '#f1c40f' },
  { dimension: 'Pengembangan Spiritual', shortName: 'Spiritual', current: 62, previous: 58, target: 75, facultyAverage: 65, color: '#e67e22' },
  { dimension: 'Manajemen Lingkungan', shortName: 'Lingkungan', current: 58, previous: 54, target: 70, facultyAverage: 60, color: '#27ae60' },
];

const COGNITIVE_DATA = {
  criticalThinking: 75, growthMindset: 80, creativity: 65, metacognition: 70,
  subscores: {
    criticalThinking: { analyticalThinking: 78, logicalReasoning: 72, evidenceEvaluation: 68, biasRecognition: 76 },
    growthMindset: { learningOrientation: 82, resilienceToFailure: 76, effortBelief: 84, challengeSeeking: 78 },
    creativity: { ideaGeneration: 62, divergentThinking: 68, problemSolving: 70, innovation: 64 },
    metacognition: { selfMonitoring: 68, strategySelection: 72, knowledgeIntegration: 74, learningAdjustment: 66 },
  },
};

const SELF_MANAGEMENT_DATA = {
  timeline: [
    { date: 'Mon', deepWork: 65, taskCompletion: 70, focusDuration: 60, distractions: 40 },
    { date: 'Tue', deepWork: 72, taskCompletion: 75, focusDuration: 68, distractions: 35 },
    { date: 'Wed', deepWork: 68, taskCompletion: 72, focusDuration: 65, distractions: 38 },
    { date: 'Thu', deepWork: 80, taskCompletion: 85, focusDuration: 75, distractions: 28 },
    { date: 'Fri', deepWork: 75, taskCompletion: 78, focusDuration: 72, distractions: 30 },
  ],
  gauges: { timeManagement: 72, procrastinationControl: 65, selfControl: 70, energyManagement: 68, prioritization: 75, goalAchievement: 70 },
  heatmapData: [[1,2,3],[2,3,1],[3,2,2]],
};

const FINANCIAL_DATA = {
  waterfall: [
    { category: 'Income', amount: 5000000, type: 'income' as const, runningTotal: 5000000 },
    { category: 'Food', amount: -1500000, type: 'expense' as const, runningTotal: 3500000 },
    { category: 'Transport', amount: -800000, type: 'expense' as const, runningTotal: 2700000 },
    { category: 'Savings', amount: -1000000, type: 'savings' as const, runningTotal: 1700000 },
    { category: 'Investment', amount: -700000, type: 'savings' as const, runningTotal: 1000000 },
  ],
  networkNodes: [
    { id: '1', name: 'Budgeting', mastery: 70, group: 'basic' },
    { id: '2', name: 'Saving', mastery: 65, group: 'basic' },
    { id: '3', name: 'Investing', mastery: 45, group: 'advanced' },
    { id: '4', name: 'Tax', mastery: 40, group: 'advanced' },
  ],
  goals: {
    emergencyFund: { current: 5000000, target: 15000000 },
    investment: { current: 3000000, target: 10000000 },
    savings: { current: 2000000, target: 5000000 },
  },
};

const PHYSICAL_DATA = {
  metrics: [
    { name: 'Activity', value: 75, target: 100, unit: '%', icon: Activity, color: '#22c55e' },
    { name: 'Sleep', value: 7.5, target: 8, unit: 'hrs', icon: Activity, color: '#3b82f6' },
    { name: 'Nutrition', value: 70, target: 100, unit: '%', icon: Activity, color: '#f59e0b' },
    { name: 'Hydration', value: 2.5, target: 3, unit: 'L', icon: Activity, color: '#14b8a6' },
  ],
  overallScore: 72,
  vitalityIndex: 'good' as const,
  recommendations: ['Tingkatkan aktivitas fisik', 'Jaga kualitas tidur', 'Konsumsi lebih banyak sayur'],
};

const EMOTIONAL_DATA = {
  selfAwareness: 70, socialAwareness: 65, selfManagement: 72, relationshipManagement: 68,
};

const MENTAL_DATA = {
  emotionalWellbeing: 72, psychologicalWellbeing: 70, socialWellbeing: 68, resilience: 75,
  stressLevel: 35, mindfulness: 65, lifeSatisfaction: 73, overallScore: 70,
  flourishingLevel: 'moderate' as const,
};

const CHARACTER_DATA = {
  integrity: 80, courage: 72, fairness: 78, responsibility: 75,
  humility: 68, compassion: 82, selfDiscipline: 70, ethicalReasoning: 76,
};

const SPIRITUAL_DATA = {
  purpose: 70, gratitude: 75, connectedness: 65, altruism: 68,
  meaningMaking: 72, mindfulness: 60, forgiveness: 70, contribution: 65,
};

const ENVIRONMENTAL_DATA = {
  awareness: 70, behavior: 65, workLifeBalance: 68, digitalWellbeing: 62,
  minimalism: 55, communityEngagement: 60, environmentalAdvocacy: 58, carbonFootprintAwareness: 52,
};

export default function AssessmentDashboard() {
  const [activeDiagram, setActiveDiagram] = useState(0);
  const [result] = useState(() => processHolisticAssessment(
    MOCK_ASSESSMENT_DATA.userId,
    MOCK_ASSESSMENT_DATA.responses
  ));

  const diagrams = [
    { id: 0, name: 'Holistic Radar', icon: Target },
    { id: 1, name: 'Cognitive', icon: Brain },
    { id: 2, name: 'Self-Management', icon: Clock },
    { id: 3, name: 'Financial', icon: DollarSign },
    { id: 4, name: 'Physical', icon: Activity },
    { id: 5, name: 'Emotional', icon: Heart },
    { id: 6, name: 'Mental', icon: Sparkles },
    { id: 7, name: 'Character', icon: Shield },
    { id: 8, name: 'Spiritual', icon: LayoutGrid },
    { id: 9, name: 'Environmental', icon: Leaf },
  ];

  const renderDiagram = () => {
    switch (activeDiagram) {
      case 0: return <HolisticRadarChart data={RADAR_DATA} pdi={result.overallScore} balanceIndex={result.balanceIndex} />;
      case 1: return <CognitiveSunburst data={COGNITIVE_DATA} />;
      case 2: return <SelfManagementDashboard data={SELF_MANAGEMENT_DATA} />;
      case 3: return <FinancialWaterfall data={FINANCIAL_DATA} />;
      case 4: return <PhysicalHealthDashboard data={PHYSICAL_DATA} />;
      case 5: return <EmotionalRadar data={EMOTIONAL_DATA} />;
      case 6: return <MentalHealthGauge data={MENTAL_DATA} />;
      case 7: return <CharacterTree data={CHARACTER_DATA} />;
      case 8: return <SpiritualSpiral data={SPIRITUAL_DATA} />;
      case 9: return <EnvironmentalEco data={ENVIRONMENTAL_DATA} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A] p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Holistic Assessment Dashboard</h1>
        <p className="text-slate-400">Visualisasi komprehensif 9 dimensi perkembangan holistik</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {diagrams.map((diagram) => (
          <button
            key={diagram.id}
            onClick={() => setActiveDiagram(diagram.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeDiagram === diagram.id
                ? 'bg-[#135bec] text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <diagram.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{diagram.name}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeDiagram}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderDiagram()}
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Overall Score</div>
          <div className="text-3xl font-bold text-[#135bec]">{result.overallScore.toFixed(1)}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Balance Index</div>
          <div className="text-3xl font-bold text-[#2ecc71]">{(result.balanceIndex * 100).toFixed(0)}%</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Dimensi Unggul</div>
          <div className="text-3xl font-bold text-[#FFD700]">{result.dimensions.filter(d => d.score >= 70).length}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Perlu Perhatian</div>
          <div className="text-3xl font-bold text-slate-400">{result.dimensions.filter(d => d.score < 50).length}</div>
        </div>
      </div>
    </div>
  );
}
