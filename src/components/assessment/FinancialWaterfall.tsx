/**
 * Diagram 4: Financial Intelligence Waterfall & Network
 * Waterfall Chart + Financial Network Diagram
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard } from 'lucide-react';

interface WaterfallData {
  category: string;
  amount: number;
  type: 'income' | 'expense' | 'savings' | 'balance';
  runningTotal: number;
}

interface FinancialNetworkNode {
  id: string;
  name: string;
  mastery: number;
  group: string;
}

interface FinancialWaterfallProps {
  data: {
    waterfall: WaterfallData[];
    networkNodes: FinancialNetworkNode[];
    goals: {
      emergencyFund: { current: number; target: number };
      investment: { current: number; target: number };
      savings: { current: number; target: number };
    };
  };
  className?: string;
}

export const FinancialWaterfall: React.FC<FinancialWaterfallProps> = ({
  data,
  className = '',
}) => {
  const [view, setView] = useState<'waterfall' | 'network'>('waterfall');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getBarColor = (type: string) => {
    switch (type) {
      case 'income':
        return '#2ecc71';
      case 'expense':
        return '#e74c3c';
      case 'savings':
        return '#f39c12';
      case 'balance':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const totalIncome = data.waterfall
    .filter((d) => d.type === 'income')
    .reduce((sum, d) => sum + d.amount, 0);
  const totalExpense = data.waterfall
    .filter((d) => d.type === 'expense')
    .reduce((sum, d) => sum + Math.abs(d.amount), 0);
  const totalSavings = data.waterfall
    .filter((d) => d.type === 'savings')
    .reduce((sum, d) => sum + Math.abs(d.amount), 0);

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-yellow-500" />
            Financial Intelligence Waterfall
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Cash flow analysis & financial knowledge network
          </p>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setView('waterfall')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              view === 'waterfall'
                ? 'bg-[#135bec] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Waterfall
          </button>
          <button
            onClick={() => setView('network')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              view === 'network'
                ? 'bg-[#135bec] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Network
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Total Income</span>
          </div>
          <div className="text-xl font-bold text-white">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400">Total Expenses</span>
          </div>
          <div className="text-xl font-bold text-white">{formatCurrency(totalExpense)}</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400">Net Savings</span>
          </div>
          <div className="text-xl font-bold text-white">{formatCurrency(totalSavings)}</div>
        </div>
      </div>

      {view === 'waterfall' ? (
        <>
          {/* Waterfall Chart */}
          <div className="mb-6" style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.waterfall} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <ReferenceLine y={0} stroke="#64748b" />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {data.waterfall.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Goals */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Emergency Fund</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((data.goals.emergencyFund.current / data.goals.emergencyFund.target) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.goals.emergencyFund.current / data.goals.emergencyFund.target) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {formatCurrency(data.goals.emergencyFund.current)} / {formatCurrency(data.goals.emergencyFund.target)}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">Investment</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((data.goals.investment.current / data.goals.investment.target) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.goals.investment.current / data.goals.investment.target) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {formatCurrency(data.goals.investment.current)} / {formatCurrency(data.goals.investment.target)}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-300">Savings</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((data.goals.savings.current / data.goals.savings.target) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.goals.savings.current / data.goals.savings.target) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {formatCurrency(data.goals.savings.current)} / {formatCurrency(data.goals.savings.target)}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Network View */
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-400 mb-4">Financial Knowledge Network</div>
            <div className="grid grid-cols-4 gap-4">
              {data.networkNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-center p-2 ${
                    node.mastery >= 70
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : node.mastery >= 50
                      ? 'bg-yellow-500/20 border-2 border-yellow-500'
                      : 'bg-red-500/20 border-2 border-red-500'
                  }`}
                >
                  <div>
                    <div className="text-xs text-white font-medium">{node.name}</div>
                    <div className="text-lg font-bold text-white">{node.mastery}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialWaterfall;
