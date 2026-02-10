/**
 * Predictive Engine for PPSDM KMITS Automation
 * Features: Meeting time optimization, budget allocation, team formation, learning paths
 * Integrates with: AI Service, ML Service
 */

import { aiService, AIRequest } from '../ai/ai-service';
import { localML } from '../ml/local-ml';

// Types for predictions
export interface MemberAvailability {
  memberId: string;
  memberName: string;
  availableSlots: TimeSlot[];
  preferences: {
    preferredDays: string[];
    preferredTimes: string[];
    avoidDays: string[];
  };
}

export interface TimeSlot {
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '17:00'
}

export interface MeetingSuggestion {
  date: Date;
  startTime: string;
  endTime: string;
  availableMembers: string[];
  unavailableMembers: string[];
  attendanceRate: number;
  confidence: number;
  alternatives: MeetingSuggestion[];
}

export interface BudgetCategory {
  name: string;
  currentAllocation: number;
  historicalSpending: number[];
  priority: 'high' | 'medium' | 'low';
  upcomingEvents: number;
}

export interface BudgetRecommendation {
  category: string;
  recommendedAllocation: number;
  currentAllocation: number;
  difference: number;
  reason: string;
  confidence: number;
}

export interface MemberSkill {
  memberId: string;
  memberName: string;
  skills: Record<string, number>; // skill name -> proficiency level (0-100)
  availability: number; // 0-100
  experience: number; // years
}

export interface ProjectRequirement {
  skill: string;
  requiredLevel: number;
  importance: 'critical' | 'important' | 'nice_to_have';
}

export interface TeamMember {
  memberId: string;
  memberName: string;
  role: string;
  contributionScore: number;
}

export interface TeamSuggestion {
  teamName: string;
  members: TeamMember[];
  overallScore: number;
  skillCoverage: Record<string, number>;
  risks: string[];
  recommendations: string[];
}

export interface LearningPathStep {
  title: string;
  description: string;
  resources: string[];
  estimatedDuration: string;
  prerequisites: string[];
  skills: string[];
}

export interface LearningPath {
  pathName: string;
  targetSkill: string;
  currentLevel: number;
  targetLevel: number;
  steps: LearningPathStep[];
  estimatedTotalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

class PredictiveEngine {
  /**
   * Suggest optimal meeting times based on member availability
   */
  async suggestMeetingTimes(
    availability: MemberAvailability[],
    duration: number = 60, // minutes
    options: {
      minAttendanceRate?: number;
      preferredDays?: string[];
      dateRange?: { start: Date; end: Date };
    } = {}
  ): Promise<MeetingSuggestion[]> {
    const {
      minAttendanceRate = 0.7,
      preferredDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      dateRange = {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    } = options;

    if (availability.length === 0) {
      return [];
    }

    const suggestions: MeetingSuggestion[] = [];

    // Generate potential time slots
    const potentialSlots = this.generatePotentialTimeSlots(
      dateRange.start,
      dateRange.end,
      preferredDays,
      duration
    );

    // Evaluate each slot
    for (const slot of potentialSlots) {
      const availableMembers: string[] = [];
      const unavailableMembers: string[] = [];

      for (const member of availability) {
        const isAvailable = this.isMemberAvailable(member, slot);
        if (isAvailable) {
          availableMembers.push(member.memberId);
        } else {
          unavailableMembers.push(member.memberId);
        }
      }

      const attendanceRate = availableMembers.length / availability.length;

      if (attendanceRate >= minAttendanceRate) {
        suggestions.push({
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          availableMembers,
          unavailableMembers,
          attendanceRate: Math.round(attendanceRate * 100) / 100,
          confidence: this.calculateMeetingConfidence(availability, slot),
          alternatives: [],
        });
      }
    }

    // Sort by attendance rate and confidence
    suggestions.sort((a, b) => {
      if (b.attendanceRate !== a.attendanceRate) {
        return b.attendanceRate - a.attendanceRate;
      }
      return b.confidence - a.confidence;
    });

    // Add alternatives for top suggestions
    const topSuggestions = suggestions.slice(0, 3);
    for (const suggestion of topSuggestions) {
      suggestion.alternatives = suggestions
        .filter(s => s !== suggestion)
        .slice(0, 2);
    }

    return topSuggestions;
  }

  /**
   * Recommend budget allocation
   */
  async recommendBudgetAllocation(
    categories: BudgetCategory[],
    totalBudget: number,
    options: {
      reservePercentage?: number;
      upcomingEvents?: { category: string; estimatedCost: number }[];
    } = {}
  ): Promise<BudgetRecommendation[]> {
    const {
      reservePercentage = 0.1,
      upcomingEvents = [],
    } = options;

    if (categories.length === 0) {
      return [];
    }

    const recommendations: BudgetRecommendation[] = [];

    // Calculate reserve amount
    const reserveAmount = totalBudget * reservePercentage;
    const availableBudget = totalBudget - reserveAmount;

    // Calculate base allocation based on priority and historical spending
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    let totalWeight = 0;

    for (const category of categories) {
      totalWeight += priorityWeights[category.priority];
    }

    // Generate AI-enhanced recommendations
    for (const category of categories) {
      const baseAllocation = (priorityWeights[category.priority] / totalWeight) * availableBudget;

      // Adjust based on historical spending
      const avgHistoricalSpending = category.historicalSpending.length > 0
        ? category.historicalSpending.reduce((sum, val) => sum + val, 0) / category.historicalSpending.length
        : 0;

      // Adjust based on upcoming events
      const upcomingCost = upcomingEvents
        .filter(e => e.category === category.name)
        .reduce((sum, e) => sum + e.estimatedCost, 0);

      let recommendedAllocation = baseAllocation;

      // Use AI to refine recommendation
      try {
        const prompt = `
Budget Category: ${category.name}
- Current Allocation: ${category.currentAllocation}
- Historical Average: ${avgHistoricalSpending.toFixed(2)}
- Priority: ${category.priority}
- Upcoming Events: ${category.upcomingEvents}
- Upcoming Cost: ${upcomingCost.toFixed(2)}
- Base Allocation: ${baseAllocation.toFixed(2)}
- Available Budget: ${availableBudget.toFixed(2)}

Recommend a budget allocation for this category. Consider:
1. Historical spending patterns
2. Priority level
3. Upcoming events
4. Overall budget constraints

Return only the recommended amount as a number.
`;
        const request: AIRequest = {
          prompt,
          maxTokens: 100,
          temperature: 0.3,
          useCache: true,
          priority: 'normal',
        };
        const response = await aiService.generate(request);
        const aiRecommendation = parseFloat(response.content.replace(/[^0-9.]/g, ''));
        if (!isNaN(aiRecommendation) && aiRecommendation > 0) {
          recommendedAllocation = Math.min(aiRecommendation, availableBudget * 0.5); // Cap at 50% of available
        }
      } catch (error) {
        console.error('Error generating budget recommendation:', error);
      }

      const difference = recommendedAllocation - category.currentAllocation;

      recommendations.push({
        category: category.name,
        recommendedAllocation: Math.round(recommendedAllocation * 100) / 100,
        currentAllocation: category.currentAllocation,
        difference: Math.round(difference * 100) / 100,
        reason: this.generateBudgetReason(category, avgHistoricalSpending, upcomingCost, difference),
        confidence: this.calculateBudgetConfidence(category, avgHistoricalSpending),
      });
    }

    // Sort by priority and confidence
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = categories.find(c => c.name === a.category)?.priority || 'low';
      const bPriority = categories.find(c => c.name === b.category)?.priority || 'low';
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    });

    return recommendations;
  }

  /**
   * Suggest team formation for a project
   */
  async suggestTeamFormation(
    members: MemberSkill[],
    requirements: ProjectRequirement[],
    teamSize: number = 5,
    options: {
      minSkillCoverage?: number;
      balanceSkills?: boolean;
    } = {}
  ): Promise<TeamSuggestion[]> {
    const {
      minSkillCoverage = 0.8,
      balanceSkills = true,
    } = options;

    if (members.length === 0 || requirements.length === 0) {
      return [];
    }

    const suggestions: TeamSuggestion[] = [];

    // Generate multiple team combinations
    const combinations = this.generateTeamCombinations(members, teamSize, 10);

    for (const combination of combinations) {
      const skillCoverage = this.calculateSkillCoverage(combination, requirements);
      const overallScore = this.calculateTeamScore(combination, requirements, skillCoverage);

      if (overallScore >= minSkillCoverage) {
        const teamMembers: TeamMember[] = combination.map(member => ({
          memberId: member.memberId,
          memberName: member.memberName,
          role: this.assignRole(member, requirements),
          contributionScore: this.calculateContributionScore(member, requirements),
        }));

        const risks = this.identifyTeamRisks(combination, requirements);
        const recommendations = await this.generateTeamRecommendations(combination, requirements, risks);

        suggestions.push({
          teamName: `Team ${suggestions.length + 1}`,
          members: teamMembers,
          overallScore: Math.round(overallScore * 100) / 100,
          skillCoverage,
          risks,
          recommendations,
        });
      }
    }

    // Sort by overall score
    suggestions.sort((a, b) => b.overallScore - a.overallScore);

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  /**
   * Generate personalized learning path
   */
  async generateLearningPath(
    memberSkills: Record<string, number>,
    targetSkill: string,
    currentLevel: number,
    targetLevel: number = 90,
    options: {
      preferredLearningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
      timeAvailable?: number; // hours per week
    } = {}
  ): Promise<LearningPath> {
    const {
      preferredLearningStyle = 'reading',
      timeAvailable = 5,
    } = options;

    // Generate AI-powered learning path
    let steps: LearningPathStep[] = [];

    try {
      const prompt = `
Create a learning path for "${targetSkill}" development:
- Current Level: ${currentLevel}/100
- Target Level: ${targetLevel}/100
- Gap: ${targetLevel - currentLevel} points
- Preferred Learning Style: ${preferredLearningStyle}
- Time Available: ${timeAvailable} hours/week

Generate 5-7 learning steps. Each step should include:
1. Title
2. Description
3. Resources (3-5 specific resources)
4. Estimated duration
5. Prerequisites (if any)
6. Skills developed

Format as JSON array with these fields.
`;
      const request: AIRequest = {
        prompt,
        maxTokens: 2000,
        temperature: 0.5,
        useCache: true,
        priority: 'normal',
      };
      const response = await aiService.generate(request);

      // Parse AI response
      try {
        const jsonMatch = response.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          steps = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Error parsing learning path JSON:', parseError);
      }

      // Fallback if AI parsing fails
      if (steps.length === 0) {
        steps = this.generateDefaultLearningPath(targetSkill, currentLevel, targetLevel);
      }
    } catch (error) {
      console.error('Error generating learning path:', error);
      steps = this.generateDefaultLearningPath(targetSkill, currentLevel, targetLevel);
    }

    // Calculate total duration
    const totalDuration = this.calculateTotalDuration(steps);

    // Determine difficulty
    let difficulty: 'beginner' | 'intermediate' | 'advanced';
    if (currentLevel < 30) difficulty = 'beginner';
    else if (currentLevel < 60) difficulty = 'intermediate';
    else difficulty = 'advanced';

    return {
      pathName: `${targetSkill} Development Path`,
      targetSkill,
      currentLevel,
      targetLevel,
      steps,
      estimatedTotalDuration: totalDuration,
      difficulty,
    };
  }

  /**
   * Generate potential time slots for meetings
   */
  private generatePotentialTimeSlots(
    startDate: Date,
    endDate: Date,
    preferredDays: string[],
    duration: number
  ): Array<{ date: Date; startTime: string; endTime: string }> {
    const slots: Array<{ date: Date; startTime: string; endTime: string }> = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      if (preferredDays.includes(dayName)) {
        // Generate slots from 09:00 to 17:00
        for (let hour = 9; hour < 17; hour++) {
          const startTime = `${String(hour).padStart(2, '0')}:00`;
          const endHour = hour + Math.floor(duration / 60);
          const endMinute = duration % 60;
          const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

          if (endHour <= 17) {
            slots.push({
              date: new Date(currentDate),
              startTime,
              endTime,
            });
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  /**
   * Check if member is available for a time slot
   */
  private isMemberAvailable(
    member: MemberAvailability,
    slot: { date: Date; startTime: string; endTime: string }
  ): boolean {
    const dayName = slot.date.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if member prefers this day
    if (member.preferences.avoidDays.includes(dayName)) {
      return false;
    }

    // Check if member has an available slot
    const slotStart = this.timeToMinutes(slot.startTime);
    const slotEnd = this.timeToMinutes(slot.endTime);

    for (const availableSlot of member.availableSlots) {
      if (availableSlot.day === dayName) {
        const availableStart = this.timeToMinutes(availableSlot.startTime);
        const availableEnd = this.timeToMinutes(availableSlot.endTime);

        if (slotStart >= availableStart && slotEnd <= availableEnd) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Calculate meeting confidence score
   */
  private calculateMeetingConfidence(
    availability: MemberAvailability[],
    slot: { date: Date; startTime: string; endTime: string }
  ): number {
    const dayName = slot.date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = parseInt(slot.startTime.split(':')[0]);

    let confidence = 0.5; // Base confidence

    // Boost confidence if many members prefer this day/time
    const preferredDayCount = availability.filter(m =>
      m.preferences.preferredDays.includes(dayName)
    ).length;
    confidence += (preferredDayCount / availability.length) * 0.2;

    const preferredTimeCount = availability.filter(m =>
      m.preferences.preferredTimes.includes(`${time}:00`)
    ).length;
    confidence += (preferredTimeCount / availability.length) * 0.2;

    // Reduce confidence if many members avoid this day
    const avoidDayCount = availability.filter(m =>
      m.preferences.avoidDays.includes(dayName)
    ).length;
    confidence -= (avoidDayCount / availability.length) * 0.3;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate budget reason
   */
  private generateBudgetReason(
    category: BudgetCategory,
    avgHistoricalSpending: number,
    upcomingCost: number,
    difference: number
  ): string {
    const reasons: string[] = [];

    if (difference > 0) {
      reasons.push(`Increase recommended due to ${category.upcomingEvents} upcoming events`);
      if (upcomingCost > avgHistoricalSpending) {
        reasons.push(`Upcoming costs (${upcomingCost.toFixed(2)}) exceed historical average (${avgHistoricalSpending.toFixed(2)})`);
      }
    } else if (difference < 0) {
      reasons.push(`Decrease recommended based on historical spending patterns`);
      if (category.upcomingEvents === 0) {
        reasons.push('No upcoming events planned');
      }
    } else {
      reasons.push('Current allocation is optimal');
    }

    return reasons.join('. ');
  }

  /**
   * Calculate budget confidence
   */
  private calculateBudgetConfidence(
    category: BudgetCategory,
    avgHistoricalSpending: number
  ): number {
    let confidence = 0.5;

    // More historical data = higher confidence
    if (category.historicalSpending.length >= 6) {
      confidence += 0.3;
    } else if (category.historicalSpending.length >= 3) {
      confidence += 0.15;
    }

    // Consistent spending = higher confidence
    if (category.historicalSpending.length > 0) {
      const variance = this.calculateVariance(category.historicalSpending);
      confidence -= Math.min(0.2, variance / avgHistoricalSpending);
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate team combinations
   */
  private generateTeamCombinations(
    members: MemberSkill[],
    teamSize: number,
    maxCombinations: number
  ): MemberSkill[][] {
    const combinations: MemberSkill[][] = [];

    // Simple approach: generate combinations based on skill diversity
    const sortedMembers = [...members].sort((a, b) => b.availability - a.availability);

    for (let i = 0; i < maxCombinations && i < sortedMembers.length; i++) {
      const team: MemberSkill[] = [sortedMembers[i]];

      // Add members with complementary skills
      for (const member of sortedMembers) {
        if (team.length >= teamSize) break;
        if (!team.includes(member)) {
          team.push(member);
        }
      }

      if (team.length === teamSize) {
        combinations.push(team);
      }
    }

    return combinations;
  }

  /**
   * Calculate skill coverage
   */
  private calculateSkillCoverage(
    team: MemberSkill[],
    requirements: ProjectRequirement[]
  ): Record<string, number> {
    const coverage: Record<string, number> = {};

    for (const req of requirements) {
      const maxSkill = Math.max(
        ...team.map(m => m.skills[req.skill] || 0),
        0
      );
      coverage[req.skill] = Math.min(100, (maxSkill / req.requiredLevel) * 100);
    }

    return coverage;
  }

  /**
   * Calculate team score
   */
  private calculateTeamScore(
    team: MemberSkill[],
    requirements: ProjectRequirement[],
    skillCoverage: Record<string, number>
  ): number {
    let score = 0;
    let totalWeight = 0;

    for (const req of requirements) {
      const weight = req.importance === 'critical' ? 3 : req.importance === 'important' ? 2 : 1;
      score += (skillCoverage[req.skill] || 0) * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  /**
   * Assign role to team member
   */
  private assignRole(member: MemberSkill, requirements: ProjectRequirement[]): string {
    // Find the skill where member is strongest and is required
    let bestSkill = '';
    let bestScore = 0;

    for (const req of requirements) {
      const score = member.skills[req.skill] || 0;
      if (score > bestScore) {
        bestScore = score;
        bestSkill = req.skill;
      }
    }

    if (bestSkill) {
      return `${bestSkill} Specialist`;
    }

    return 'Team Member';
  }

  /**
   * Calculate contribution score
   */
  private calculateContributionScore(
    member: MemberSkill,
    requirements: ProjectRequirement[]
  ): number {
    let score = 0;

    for (const req of requirements) {
      const skillLevel = member.skills[req.skill] || 0;
      const weight = req.importance === 'critical' ? 3 : req.importance === 'important' ? 2 : 1;
      score += (skillLevel / req.requiredLevel) * weight;
    }

    // Adjust by availability
    score *= (member.availability / 100);

    return Math.min(100, score);
  }

  /**
   * Identify team risks
   */
  private identifyTeamRisks(
    team: MemberSkill[],
    requirements: ProjectRequirement[]
  ): string[] {
    const risks: string[] = [];

    // Check for skill gaps
    for (const req of requirements) {
      const maxSkill = Math.max(...team.map(m => m.skills[req.skill] || 0), 0);
      if (maxSkill < req.requiredLevel * 0.7) {
        risks.push(`Insufficient ${req.skill} expertise in team`);
      }
    }

    // Check for low availability
    const lowAvailabilityMembers = team.filter(m => m.availability < 50);
    if (lowAvailabilityMembers.length > team.length * 0.3) {
      risks.push('Multiple team members have low availability');
    }

    return risks;
  }

  /**
   * Generate team recommendations
   */
  private async generateTeamRecommendations(
    team: MemberSkill[],
    requirements: ProjectRequirement[],
    risks: string[]
  ): Promise<string[]> {
    if (risks.length === 0) {
      return ['Team composition is well-balanced', 'Proceed with current team structure'];
    }

    try {
      const prompt = `
Team Risks:
${risks.map(r => `- ${r}`).join('\n')}

Team Members:
${team.map(m => `- ${m.memberName}: ${Object.entries(m.skills).map(([k, v]) => `${k}(${v})`).join(', ')}`).join('\n')}

Requirements:
${requirements.map(r => `- ${r.skill}: ${r.requiredLevel} (${r.importance})`).join('\n')}

Provide 3 recommendations to address these risks. Format as a numbered list.
`;
      const request: AIRequest = {
        prompt,
        maxTokens: 300,
        temperature: 0.5,
        useCache: true,
        priority: 'low',
      };
      const response = await aiService.generate(request);
      return response.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3);
    } catch (error) {
      console.error('Error generating team recommendations:', error);
      return ['Consider adding members with missing skills', 'Review team availability', 'Provide training for skill gaps'];
    }
  }

  /**
   * Generate default learning path
   */
  private generateDefaultLearningPath(
    targetSkill: string,
    currentLevel: number,
    targetLevel: number
  ): LearningPathStep[] {
    return [
      {
        title: `Introduction to ${targetSkill}`,
        description: `Learn the fundamentals of ${targetSkill}`,
        resources: [
          'Online tutorials and documentation',
          'Video courses on platforms like YouTube or Coursera',
          'Practice exercises and projects',
        ],
        estimatedDuration: '2-3 weeks',
        prerequisites: [],
        skills: [targetSkill],
      },
      {
        title: `${targetSkill} Intermediate Concepts`,
        description: `Deepen your understanding of ${targetSkill}`,
        resources: [
          'Advanced tutorials and documentation',
          'Hands-on projects',
          'Community forums and discussions',
        ],
        estimatedDuration: '3-4 weeks',
        prerequisites: [`Introduction to ${targetSkill}`],
        skills: [targetSkill],
      },
      {
        title: `${targetSkill} Advanced Techniques`,
        description: `Master advanced ${targetSkill} concepts`,
        resources: [
          'Expert-level courses and workshops',
          'Real-world projects and case studies',
          'Mentorship and peer learning',
        ],
        estimatedDuration: '4-6 weeks',
        prerequisites: [`${targetSkill} Intermediate Concepts`],
        skills: [targetSkill],
      },
    ];
  }

  /**
   * Calculate total duration
   */
  private calculateTotalDuration(steps: LearningPathStep[]): string {
    // Simple estimation based on step descriptions
    const totalWeeks = steps.length * 3; // Average 3 weeks per step
    return `${totalWeeks} weeks`;
  }

  /**
   * Helper: Convert time string to minutes
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Helper: Calculate variance
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }
}

// Export singleton instance
export const predictiveEngine = new PredictiveEngine();

// Export class for testing
export { PredictiveEngine };
