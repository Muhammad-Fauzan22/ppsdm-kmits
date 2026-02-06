/**
 * Financial Intelligence Waterfall & Network Component
 * 
 * Visualisasi kecerdasan finansial dalam bentuk waterfall chart dan network diagram
 * Berdasarkan spesifikasi dari ASSESSMENT BROU/10 Diagram untuk Visualisasi Holist.txt
 * 
 * Features:
 * - Waterfall chart untuk cash flow analysis
 * - Force-directed graph untuk financial knowledge network
 * - Financial goal tracker
 * - Scenario simulation
 * - Investment projection
 */

'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface WaterfallItem {
  name: string;
  value: number;
  type: 'balance' | 'income' | 'expense' | 'savings' | 'investment';
  start?: number;
  end?: number;
}

interface NetworkNode {
  id: string;
  name: string;
  mastery: number;
  group: string;
  x?: number;
  y?: number;
}

interface NetworkLink {
  source: string;
  target: string;
  strength: number;
}

interface FinancialGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline: string;
  category: 'emergency' | 'investment' | 'debt' | 'savings';
}

interface FinancialWaterfallProps {
  waterfallData: WaterfallItem[];
  networkNodes: NetworkNode[];
  networkLinks: NetworkLink[];
  goals: FinancialGoal[];
  width?: number;
  height?: number;
  showSimulation?: boolean;
  className?: string;
}

// Color scheme for financial visualization
const FINANCIAL_COLORS = {
  balance: '#3b82f6',    // Blue
  income: '#10b981',     // Green
  expense: '#ef4444',    // Red
  savings: '#f59e0b',     // Orange
  investment: '#8b5cf6',  // Purple
  mastery: {
    high: '#10b981',      // Green
    medium: '#f59e0b',    // Yellow
    low: '#ef4444'        // Red
  }
};

export const FinancialWaterfall: React.FC<FinancialWaterfallProps> = ({
  waterfallData,
  networkNodes,
  networkLinks,
  goals,
  width = 800,
  height = 600,
  showSimulation = true,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'waterfall' | 'network' | 'goals'>('waterfall');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationValue, setSimulationValue] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate waterfall positions
  const waterfallWithPositions = useMemo(() => {
    let runningTotal = 0;
    return waterfallData.map((item, index) => {
      const start = runningTotal;
      runningTotal += item.value;
      const end = runningTotal;
      return { ...item, start, end };
    });
  }, [waterfallData]);

  // Calculate financial health metrics
  const financialHealth = useMemo(() => {
    const totalIncome = waterfallData
      .filter(d => d.type === 'income')
      .reduce((sum, d) => sum + d.value, 0);
    const totalExpenses = waterfallData
      .filter(d => d.type === 'expense')
      .reduce((sum, d) => sum + Math.abs(d.value), 0);
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

    return {
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses,
      savingsRate,
      health: savingsRate >= 20 ? 'excellent' : savingsRate >= 10 ? 'good' : savingsRate >= 0 ? 'moderate' : 'poor'
    };
  }, [waterfallData]);

  // Force-directed graph simulation
  useEffect(() => {
    if (activeTab !== 'network' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize node positions
    const nodes = networkNodes.map(node => ({
      ...node,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0
    }));

    // Simulation parameters
    const k = 0.01; // Spring constant
    const repulsion = 5000;
    const damping = 0.9;
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      // Apply repulsion
      for (let j = 0; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const dx = nodes[k].x - nodes[j].x;
          const dy = nodes[k].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);

          nodes[j].vx -= (dx / dist) * force;
          nodes[j].vy -= (dy / dist) * force;
          nodes[k].vx += (dx / dist) * force;
          nodes[k].vy += (dy / dist) * force;
        }
      }

      // Apply spring forces
      networkLinks.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = k * (dist - 100);

        source.vx += (dx / dist) * force;
        source.vy += (dy / dist) * force;
        target.vx -= (dx / dist) * force;
        target.vy -= (dy / dist) * force;
      });

      // Apply damping and update positions
      nodes.forEach(node => {
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;

        // Keep within bounds
        node.x = Math.max(50, Math.min(canvas.width - 50, node.x));
        node.y = Math.max(50, Math.min(canvas.height - 50, node.y));
      });
    }

    // Draw network
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    networkLinks.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = `rgba(100, 116, 139, ${link.strength})`;
      ctx.lineWidth = link.strength * 3;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const masteryColor = node.mastery >= 70 ? FINANCIAL_COLORS.mastery.high :
        node.mastery >= 50 ? FINANCIAL_COLORS.mastery.medium :
          FINANCIAL_COLORS.mastery.low;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 20 + node.mastery / 5, 0, Math.PI * 2);
      ctx.fillStyle = masteryColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + 35);
    });

  }, [activeTab, networkNodes, networkLinks]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header with tabs */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kecerdasan Finansial</h3>
          <p className="text-sm text-gray-600">Analisis kesehatan finansial dan pengetahuan</p>
        </div>
        <div className="flex gap-2">
          {(['waterfall', 'network', 'goals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tab === 'waterfall' ? 'Cash Flow' : tab === 'network' ? 'Knowledge' : 'Goals'}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Total Pemasukan</div>
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(financialHealth.totalIncome)}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Total Pengeluaran</div>
          <div className="text-lg font-bold text-red-600">
            {formatCurrency(financialHealth.totalExpenses)}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Cash Flow</div>
          <div className={`text-lg font-bold ${financialHealth.netCashFlow >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
            {formatCurrency(financialHealth.netCashFlow)}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Tingkat Tabungan</div>
          <div className={`text-lg font-bold ${financialHealth.savingsRate >= 20 ? 'text-green-600' :
              financialHealth.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
            }`}>
            {financialHealth.savingsRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'waterfall' && (
          <motion.div
            key="waterfall"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <h4 className="font-bold text-gray-800 mb-4">Analisis Cash Flow</h4>

            {/* Waterfall Chart */}
            <div className="relative h-64 mb-4">
              <svg width="100%" height="100%" className="overflow-visible">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((value) => (
                  <line
                    key={value}
                    x1="0"
                    y1={value * 2.4}
                    x2="100%"
                    y2={value * 2.4}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Waterfall bars */}
                {waterfallWithPositions.map((item, index) => {
                  const barWidth = 60;
                  const barX = (index / waterfallWithPositions.length) * 100 + '%';
                  const barHeight = Math.abs(item.value) / 10000 * 200;
                  const barY = item.type === 'expense'
                    ? 240 - (item.start / 10000 * 200)
                    : 240 - (item.end / 10000 * 200);

                  return (
                    <g key={index}>
                      {/* Bar */}
                      <motion.rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={FINANCIAL_COLORS[item.type]}
                        initial={{ height: 0 }}
                        animate={{ height: barHeight }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />

                      {/* Label */}
                      <text
                        x={parseFloat(barX) + barWidth / 2}
                        y={barY - 10}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                      >
                        {item.name}
                      </text>

                      {/* Value */}
                      <text
                        x={parseFloat(barX) + barWidth / 2}
                        y={barY + barHeight / 2 + 4}
                        textAnchor="middle"
                        className="text-xs fill-white font-semibold"
                      >
                        {formatCurrency(item.value)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-gray-600">Saldo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-gray-600">Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-gray-600">Pengeluaran</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span className="text-gray-600">Tabungan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-gray-600">Investasi</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'network' && (
          <motion.div
            key="network"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <h4 className="font-bold text-gray-800 mb-4">Jaringan Pengetahuan Finansial</h4>

            {/* Network Canvas */}
            <canvas
              ref={canvasRef}
              width={width}
              height={400}
              className="w-full rounded-lg border border-gray-200"
            />

            {/* Network Legend */}
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-gray-600">Paham (≥70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span className="text-gray-600">Sedang (50-69%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-gray-600">Perlu Belajar (&lt;50%)</span>
              </div>
            </div>

            {/* Selected Node Details */}
            <AnimatePresence>
              {selectedNode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 bg-gray-50 rounded-lg p-4"
                >
                  <h5 className="font-bold text-gray-800 mb-2">{selectedNode.name}</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tingkat Pemahaman:</span>
                      <span className="font-bold ml-2" style={{
                        color: selectedNode.mastery >= 70 ? FINANCIAL_COLORS.mastery.high :
                          selectedNode.mastery >= 50 ? FINANCIAL_COLORS.mastery.medium :
                            FINANCIAL_COLORS.mastery.low
                      }}>
                        {selectedNode.mastery}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-bold ml-2 text-blue-600">{selectedNode.group}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <h4 className="font-bold text-gray-800 mb-4">Target Finansial</h4>

            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                const categoryColors = {
                  emergency: 'bg-red-500',
                  investment: 'bg-purple-500',
                  debt: 'bg-orange-500',
                  savings: 'bg-green-500'
                };

                return (
                  <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${categoryColors[goal.category]}`} />
                        <span className="font-semibold text-gray-800">{goal.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full ${categoryColors[goal.category]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>Progress: {progress.toFixed(1)}%</span>
                      <span>Deadline: {goal.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Panel */}
      {showSimulation && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800">Simulasi Skenario</h4>
            <button
              onClick={() => setSimulationMode(!simulationMode)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${simulationMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {simulationMode ? 'Tutup Simulasi' : 'Buka Simulasi'}
            </button>
          </div>

          {simulationMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Simulasi Kenaikan Penghasilan
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={simulationValue}
                  onChange={(e) => setSimulationValue(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0%</span>
                  <span>{simulationValue}%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">Pemasukan Baru</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(financialHealth.totalIncome * (1 + simulationValue / 100))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">Tabungan Baru</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(financialHealth.netCashFlow * (1 + simulationValue / 100))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">Tingkat Tabungan Baru</div>
                  <div className="text-lg font-bold text-purple-600">
                    {((financialHealth.savingsRate * (1 + simulationValue / 100))).toFixed(1)}%
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialWaterfall;
