/**
 * Diagram 8: Character & Ethics Tree
 * Tree diagram untuk visualisasi karakter dan etika
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Award, Heart, Scale, Users, BookOpen } from 'lucide-react';

interface CharacterTreeProps {
  data: {
    integrity: number;
    courage: number;
    fairness: number;
    responsibility: number;
    humility: number;
    compassion: number;
    selfDiscipline: number;
    ethicalReasoning: number;
  };
  className?: string;
}

export const CharacterTree: React.FC<CharacterTreeProps> = ({
  data,
  className = '',
}) => {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  const traits = [
    { key: 'integrity', name: 'Integrity', value: data.integrity, icon: Shield, color: '#10b981', desc: 'Kejujuran dan konsistensi' },
    { key: 'courage', name: 'Courage', value: data.courage, icon: Award, color: '#f59e0b', desc: 'Keberanian moral' },
    { key: 'fairness', name: 'Fairness', value: data.fairness, icon: Scale, color: '#3b82f6', desc: 'Keadilan dan kejujuran' },
    { key: 'responsibility', name: 'Responsibility', value: data.responsibility, icon: Users, color: '#8b5cf6', desc: 'Tanggung jawab' },
    { key: 'humility', name: 'Humility', value: data.humility, icon: Heart, color: '#ec4899', desc: 'Kerendahan hati' },
    { key: 'compassion', name: 'Compassion', value: data.compassion, icon: Heart, color: '#ef4444', desc: 'Empati dan kepedulian' },
    { key: 'selfDiscipline', name: 'Self-Discipline', value: data.selfDiscipline, icon: BookOpen, color: '#14b8a6', desc: 'Disiplin diri' },
    { key: 'ethicalReasoning', name: 'Ethical Reasoning', value: data.ethicalReasoning, icon: Scale, color: '#6366f1', desc: 'Pemikiran etis' },
  ];

  const overallScore = Object.values(data).reduce((a, b) => a + b, 0) / 8;

  return (
    <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            Character & Ethics Tree
          </h3>
          <p className="text-sm text-slate-400 mt-1">8 Karakter utama dan etika</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Overall</div>
          <div className="text-3xl font-bold text-amber-400">{overallScore.toFixed(1)}</div>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {traits.map((trait, index) => (
          <motion.div
            key={trait.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedTrait(selectedTrait === trait.key ? null : trait.key)}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              selectedTrait === trait.key ? 'ring-2' : ''
            }`}
            style={{ 
              backgroundColor: `${trait.color}15`,
              border: `1px solid ${trait.color}40`,
              boxShadow: selectedTrait === trait.key ? `0 0 20px ${trait.color}30` : 'none'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${trait.color}30` }}>
                <trait.icon className="w-6 h-6" style={{ color: trait.color }} />
              </div>
              <div className="text-sm font-medium text-white mb-1">{trait.name}</div>
              <div className="text-2xl font-bold" style={{ color: trait.color }}>{trait.value}</div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${trait.value}%`, backgroundColor: trait.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Trait Detail */}
      <AnimatePresence>
        {selectedTrait && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 rounded-xl p-4"
          >
            {(() => {
              const trait = traits.find(t => t.key === selectedTrait);
              if (!trait) return null;
              return (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${trait.color}30` }}>
                    <trait.icon className="w-8 h-8" style={{ color: trait.color }} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{trait.name}</div>
                    <div className="text-sm text-slate-400">{trait.desc}</div>
                    <div className="text-sm mt-2" style={{ color: trait.color }}>
                      Score: {trait.value}/100
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharacterTree;
