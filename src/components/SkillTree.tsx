'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Star, Brain, Heart, Users, Target, Briefcase, Sprout, BookOpen, PiggyBank, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  x: number;
  y: number;
  category: string;
}

interface SkillTreeProps {
  userId: string;
  className?: string;
}

const DIMENSIONS = [
  { id: 'mental', name: 'Mental', icon: Brain, color: 'from-blue-500 to-cyan-400' },
  { id: 'spiritual', name: 'Spiritual', icon: Sprout, color: 'from-purple-500 to-pink-400' },
  { id: 'emotional', name: 'Emotional', icon: Heart, color: 'from-red-500 to-orange-400' },
  { id: 'physical', name: 'Physical', icon: Zap, color: 'from-green-500 to-emerald-400' },
  { id: 'social', name: 'Social', icon: Users, color: 'from-yellow-500 to-amber-400' },
  { id: 'financial', name: 'Financial', icon: PiggyBank, color: 'from-emerald-500 to-teal-400' },
  { id: 'occupational', name: 'Occupational', icon: Briefcase, color: 'from-indigo-500 to-blue-400' },
  { id: 'environmental', name: 'Environmental', icon: Target, color: 'from-teal-500 to-cyan-400' },
  { id: 'intellectual', name: 'Intellectual', icon: BookOpen, color: 'from-violet-500 to-purple-400' },
];

export function SkillTree({ userId, className }: SkillTreeProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const generatedSkills: Skill[] = [];
    const centerX = 400;
    const centerY = 300;
    const radius = 180;

    DIMENSIONS.forEach((dim, index) => {
      const angle = (index * 2 * Math.PI) / 9 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      generatedSkills.push({
        id: dim.id,
        name: dim.name,
        description: `Master the ${dim.name} dimension`,
        icon: <dim.icon className="h-6 w-6" />,
        level: userProgress[dim.id] || Math.floor(Math.random() * 5),
        maxLevel: 5,
        unlocked: true,
        x,
        y,
        category: dim.id
      });

      for (let i = 1; i <= 2; i++) {
        const branchAngle = angle + (i - 1.5) * 0.4;
        const branchRadius = radius + 80;
        generatedSkills.push({
          id: `${dim.id}-${i}`,
          name: `${dim.name} ${i}`,
          description: `Advanced ${dim.name.toLowerCase()} level ${i}`,
          icon: <Star className="h-4 w-4" />,
          level: userProgress[`${dim.id}-${i}`] || 0,
          maxLevel: 3,
          unlocked: i === 1 || (userProgress[`${dim.id}-${i-1}`] || 0) >= 2,
          x: centerX + branchRadius * Math.cos(branchAngle),
          y: centerY + branchRadius * Math.sin(branchAngle),
          category: dim.id
        });
      }
    });
    setSkills(generatedSkills);
  }, [userProgress]);

  const totalProgress = Math.round((skills.reduce((acc, s) => acc + s.level, 0) / (skills.length * 5)) * 100) || 0;

  return (
    <div className={cn("relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl", className)}>
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skill Galaxy</h2>
          <p className="text-sm text-muted-foreground">9 Dimensions Mastery</p>
        </div>
        <Card className="w-48">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <Badge variant="secondary">{totalProgress}%</Badge>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <svg className="w-full h-full" viewBox="0 0 800 600">
        {skills.map(skill => {
          const parent = skills.find(s => skill.id.startsWith(s.id + '-') && s.id !== skill.id);
          if (!parent) return null;
          return (
            <motion.line
              key={`line-${skill.id}`}
              x1={parent.x} y1={parent.y}
              x2={skill.x} y2={skill.y}
              stroke={skill.unlocked ? "#6366f1" : "#e2e8f0"}
              strokeWidth="2"
              strokeDasharray={skill.unlocked ? "0" : "5,5"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}

        {skills.map((skill, index) => {
          const dim = DIMENSIONS.find(d => d.id === skill.category);
          const isMaxed = skill.level >= skill.maxLevel;
          
          return (
            <motion.g
              key={skill.id}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedSkill(skill)}
              className="cursor-pointer"
            >
              <circle
                cx={skill.x} cy={skill.y}
                r={isMaxed ? 32 : 28}
                fill={skill.unlocked ? (isMaxed ? "#fbbf24" : "#6366f1") : "#e2e8f0"}
                stroke={isMaxed ? "#f59e0b" : skill.unlocked ? "#4f46e5" : "#cbd5e1"}
                strokeWidth="3"
              />
              <foreignObject x={skill.x - 15} y={skill.y - 15} width={30} height={30}>
                <div className={cn("flex items-center justify-center h-full", skill.unlocked ? "text-white" : "text-gray-400")}>
                  {skill.level > 0 ? <CheckCircle className="h-5 w-5" /> : skill.unlocked ? skill.icon : <Lock className="h-4 w-4" />}
                </div>
              </foreignObject>
              <text x={skill.x} y={skill.y + 45} textAnchor="middle" className="text-xs font-medium fill-slate-700">
                {skill.name}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {selectedSkill && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-4 left-4 right-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-br", DIMENSIONS.find(d => d.id === selectedSkill.category)?.color)}>
                    {selectedSkill.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedSkill.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedSkill.description}</p>
                  </div>
                </div>
                <Badge variant={selectedSkill.unlocked ? "default" : "secondary"}>
                  Level {selectedSkill.level}/{selectedSkill.maxLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={(selectedSkill.level / selectedSkill.maxLevel) * 100} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {DIMENSIONS.slice(0, 5).map(dim => (
          <div key={dim.id} className="flex items-center gap-2 text-xs">
            <div className={cn("w-3 h-3 rounded-full bg-gradient-to-br", dim.color)} />
            <span>{dim.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillTree;
