/**
 * Diagram 2: Cognitive Development Sunburst
 * Hierarchical visualization dengan 4 levels
 * 
 * Level 1: Cognitive Development (Center)
 * Level 2: 4 Sub-dimensions (Critical Thinking, Growth Mindset, Creativity, Metacognition)
 * Level 3: 8 Competencies
 * Level 4: 16 Micro-skills
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sunburst } from '../visualizations/Sunburst';
import { Brain, Lightbulb, Target, RotateCcw } from 'lucide-react';

interface CognitiveData {
  name: string;
  value: number;
  children?: CognitiveData[];
}

interface CognitiveSunburstProps {
  data: {
    criticalThinking: number;
    growthMindset: number;
    creativity: number;
    metacognition: number;
    subscores: {
      criticalThinking: { analyticalThinking: number; logicalReasoning: number; evidenceEvaluation: number; biasRecognition: number };
      growthMindset: { learningOrientation: number; resilienceToFailure: number; effortBelief: number; challengeSeeking: number };
      creativity: { ideaGeneration: number; divergentThinking: number; problemSolving: number; innovation: number };
      metacognition: { selfMonitoring: number; strategySelection: number; knowledgeIntegration: number; learningAdjustment: number };
    };
  };
  className?: string;
}

export const CognitiveSunburst: React.FC<CognitiveSunburstProps> = ({
  data,
  className = '',
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const sunburstData: CognitiveData = {
    name: 'Cognitive Development',
    value: (data.criticalThinking + data.growthMindset + data.creativity + data.metacognition) / 4,
    children: [
      {
        name: 'Critical Thinking',
        value: data.criticalThinking,
        children: [
          { name: 'Analytical Thinking', value: data.subscores.criticalThinking.analyticalThinking },
          { name: 'Logical Reasoning', value: data.subscores.criticalThinking.logicalReasoning },
          { name: 'Evidence Evaluation', value: data.subscores.criticalThinking.evidenceEvaluation },
          { name: 'Bias Recognition', value: data.subscores.criticalThinking.biasRecognition },
        ],
      },
      {
        name: 'Growth Mindset',
        value: data.growthMindset,
        children: [
          { name: 'Learning Orientation', value: data.subscores.growthMindset.learningOrientation },
          { name: 'Resilience to Failure', value: data.subscores.growthMindset.resilienceToFailure },
          { name: 'Effort Belief', value: data.subscores.growthMindset.effortBelief },
          { name: 'Challenge Seeking', value: data.subscores.growthMindset.challengeSeeking },
        ],
      },
      {
        name: 'Creativity',
        value: data.creativity,
        children: [
          { name: 'Idea Generation', value: data.subscores.creativity.ideaGeneration },
          { name: 'Divergent Thinking', value: data.subscores.creativity.divergentThinking },
          { name: 'Problem Solving', value: data.subscores.creativity.problemSolving },
          { name: 'Innovation', value: data.subscores.creativity.innovation },
        ],
      },
      {
        name: 'Metacognition',
        value: data.metacognition,
        children: [
          { name: 'Self-Monitoring', value: data.subscores.metacognition.selfMonitoring },
          { name: 'Strategy Selection', value: data.subscores.metacognition.strategySelection },
          { name: 'Knowledge Integration', value: data.subscores.metacognition.knowledgeIntegration },
          { name: 'Learning Adjustment', value: data.subscores.metacognition.learningAdjustment },
        ],
      },
    ],
  };

  const colorScale = (value: number, depth: number) => {
    const baseHue = 210; // Blue
    const hue = baseHue + (depth * 15);
    const saturation = 60 + (value / 100) * 40;
    const lightness = 30 + (1 - value / 100) * 40;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getLevelColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-blue-400';
    if (value >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            Cognitive Development Sunburst
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Hierarki 4 level: Dimensi → Sub-dimensi → Kompetensi → Micro-skills
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            -
          </button>
          <span className="text-sm text-slate-400">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            +
          </button>
          <button
            onClick={() => { setSelectedNode(null); setZoomLevel(1); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors ml-2"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sunburst Visualization */}
        <div className="lg:col-span-2 h-[450px] flex items-center justify-center">
          <Sunburst
            data={sunburstData}
            width={500 * zoomLevel}
            height={500 * zoomLevel}
            colorScale={colorScale}
            onNodeClick={setSelectedNode}
            selectedNode={selectedNode}
          />
        </div>

        {/* Side Panel - Details */}
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Overall Score</div>
                <div className="text-3xl font-bold text-white">
                  {((data.criticalThinking + data.growthMindset + data.creativity + data.metacognition) / 4).toFixed(1)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-400">Level: <span className="text-blue-400">Advanced</span></div>
              <div className="text-slate-400">Percentile: <span className="text-blue-400">82nd</span></div>
            </div>
          </div>

          {/* Sub-dimensions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Sub-dimensions</h4>
            
            {[
              { name: 'Critical Thinking', value: data.criticalThinking, icon: Target, color: 'blue' },
              { name: 'Growth Mindset', value: data.growthMindset, icon: RotateCcw, color: 'green' },
              { name: 'Creativity', value: data.creativity, icon: Lightbulb, color: 'yellow' },
              { name: 'Metacognition', value: data.metacognition, icon: Brain, color: 'purple' },
            ].map((item) => (
              <motion.div
                key={item.name}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedNode === item.name
                    ? 'bg-slate-700 border-blue-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedNode(item.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                    <span className="text-sm text-white">{item.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${getLevelColor(item.value)}`}>
                    {item.value.toFixed(0)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-${item.color}-500`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Node Details */}
          <AnimatePresence mode="wait">
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-3"
              >
                <h4 className="text-sm font-semibold text-white mb-2">{selectedNode}</h4>
                <p className="text-xs text-slate-400">
                  Click on any segment in the sunburst to see detailed breakdown of competencies.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CognitiveSunburst;
