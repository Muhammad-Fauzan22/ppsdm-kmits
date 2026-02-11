/**
 * Insights Engine for PPSDM KMITS Automation
 * Features: Activity trends, budget patterns, engagement scores, skill gap analysis
 * Integrates with: AI Service, ML Service
 */

import { aiService, AIRequest } from '../ai/ai-service';
import { localML } from '../ml/local-ml';

// Types for insights
export interface InsightData {
  activities?: ActivityData[];
  budget?: BudgetData[];
  members?: MemberData[];
  assessments?: AssessmentData[];
}

export interface ActivityData {
  id: string;
  name: string;
  date: Date;
  participants: number;
  category: string;
  budget?: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
}

export interface BudgetData {
  id: string;
  category: string;
  amount: number;
  date: Date;
  description: string;
  type: 'income' | 'expense';
}

export interface MemberData {
  id: string;
  name: string;
  nim: string;
  email: string;
  joinDate: Date;
  activitiesParticipated: number;
  skills: string[];
  assessmentScores?: Record<string, number>;
  engagementScore?: number;
}

export interface AssessmentData {
  id: string;
  memberId: string;
  memberName: string;
  dimension: string;
  score: number;
  date: Date;
  category: string;
}

export interface ActivityTrend {
  period: string;
  totalActivities: number;
  totalParticipants: number;
  averageParticipants: number;
  topCategory: string;
  completionRate: number;
}

export interface BudgetPattern {
  category: string;
  totalSpent: number;
  averagePerMonth: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number;
  prediction?: number;
}

export interface EngagementScore {
  memberId: string;
  memberName: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'very_high';
  factors: {
    activityParticipation: number;
    assessmentCompletion: number;
    skillDevelopment: number;
    consistency: number;
  };
  trend: 'improving' | 'declining' | 'stable';
}

export interface SkillGap {
  skill: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number;
  membersWithSkill: number;
  membersNeedingTraining: number;
  priority: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export interface ComprehensiveInsights {
  activityTrends: ActivityTrend[];
  budgetPatterns: BudgetPattern[];
  engagementScores: EngagementScore[];
  skillGaps: SkillGap[];
  summary: {
    totalMembers: number;
    totalActivities: number;
    totalBudget: number;
    averageEngagement: number;
    topPerformingMembers: string[];
    areasForImprovement: string[];
  };
  generatedAt: Date;
}

class InsightsEngine {
  /**
   * Generate comprehensive insights from data
   */
  async generateInsights(data: InsightData): Promise<ComprehensiveInsights> {
    const [
      activityTrends,
      budgetPatterns,
      engagementScores,
      skillGaps,
    ] = await Promise.all([
      this.analyzeActivityTrends(data.activities || []),
      this.analyzeBudgetPatterns(data.budget || []),
      this.calculateEngagementScores(data.members || []),
      this.analyzeSkillGaps(data.members || [], data.assessments || []),
    ]);

    const summary = this.generateSummary(
      data.members || [],
      data.activities || [],
      data.budget || [],
      engagementScores
    );

    return {
      activityTrends,
      budgetPatterns,
      engagementScores,
      skillGaps,
      summary,
      generatedAt: new Date(),
    };
  }

  /**
   * Analyze activity participation trends
   */
  private async analyzeActivityTrends(activities: ActivityData[]): Promise<ActivityTrend[]> {
    if (activities.length === 0) {
      return [];
    }

    // Group activities by month
    const monthlyData = new Map<string, ActivityData[]>();

    activities.forEach(activity => {
      const monthKey = this.getMonthKey(activity.date);
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      monthlyData.get(monthKey)!.push(activity);
    });

    const trends: ActivityTrend[] = [];

    for (const [period, monthActivities] of monthlyData.entries()) {
      const totalActivities = monthActivities.length;
      const totalParticipants = monthActivities.reduce((sum, a) => sum + a.participants, 0);
      const averageParticipants = totalActivities > 0 ? totalParticipants / totalActivities : 0;

      // Find top category
      const categoryCount = new Map<string, number>();
      monthActivities.forEach(a => {
        categoryCount.set(a.category, (categoryCount.get(a.category) || 0) + 1);
      });
      const topCategory = [...categoryCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Calculate completion rate
      const completed = monthActivities.filter(a => a.status === 'completed').length;
      const completionRate = totalActivities > 0 ? (completed / totalActivities) * 100 : 0;

      trends.push({
        period,
        totalActivities,
        totalParticipants,
        averageParticipants: Math.round(averageParticipants * 100) / 100,
        topCategory,
        completionRate: Math.round(completionRate * 100) / 100,
      });
    }

    // Sort by period (most recent first)
    trends.sort((a, b) => b.period.localeCompare(a.period));

    return trends;
  }

  /**
   * Analyze budget spending patterns
   */
  private async analyzeBudgetPatterns(budget: BudgetData[]): Promise<BudgetPattern[]> {
    if (budget.length === 0) {
      return [];
    }

    // Group by category
    const categoryData = new Map<string, BudgetData[]>();

    budget.forEach(item => {
      if (!categoryData.has(item.category)) {
        categoryData.set(item.category, []);
      }
      categoryData.get(item.category)!.push(item);
    });

    const patterns: BudgetPattern[] = [];

    for (const [category, items] of categoryData.entries()) {
      const totalSpent = items.reduce((sum, item) => sum + item.amount, 0);

      // Calculate average per month
      const months = new Set(items.map(item => this.getMonthKey(item.date))).size;
      const averagePerMonth = months > 0 ? totalSpent / months : 0;

      // Calculate trend
      const sortedItems = [...items].sort((a, b) => a.date.getTime() - b.date.getTime());
      const firstHalf = sortedItems.slice(0, Math.floor(sortedItems.length / 2));
      const secondHalf = sortedItems.slice(Math.floor(sortedItems.length / 2));

      const firstHalfAvg = firstHalf.length > 0
        ? firstHalf.reduce((sum, item) => sum + item.amount, 0) / firstHalf.length
        : 0;
      const secondHalfAvg = secondHalf.length > 0
        ? secondHalf.reduce((sum, item) => sum + item.amount, 0) / secondHalf.length
        : 0;

      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      let percentageChange = 0;

      if (secondHalfAvg > firstHalfAvg * 1.1) {
        trend = 'increasing';
        percentageChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
      } else if (secondHalfAvg < firstHalfAvg * 0.9) {
        trend = 'decreasing';
        percentageChange = ((firstHalfAvg - secondHalfAvg) / firstHalfAvg) * 100;
      }

      // Generate AI prediction
      let prediction: number | undefined;
      try {
        const predictionPrompt = `
Based on this budget data for category "${category}":
- Total spent: ${totalSpent}
- Average per month: ${averagePerMonth.toFixed(2)}
- Trend: ${trend}
- Recent months: ${sortedItems.slice(-3).map(i => `${this.getMonthKey(i.date)}: ${i.amount}`).join(', ')}

Predict the spending for the next month. Return only the number.
`;
        const request: AIRequest = {
          prompt: predictionPrompt,
          maxTokens: 100,
          temperature: 0.3,
          useCache: true,
          priority: 'low',
        };
        const response = await aiService.generate(request);
        const predictedValue = parseFloat(response.content.replace(/[^0-9.]/g, ''));
        if (!isNaN(predictedValue)) {
          prediction = predictedValue;
        }
      } catch (error) {
        }

      patterns.push({
        category,
        totalSpent,
        averagePerMonth: Math.round(averagePerMonth * 100) / 100,
        trend,
        percentageChange: Math.round(percentageChange * 100) / 100,
        prediction,
      });
    }

    // Sort by total spent (highest first)
    patterns.sort((a, b) => b.totalSpent - a.totalSpent);

    return patterns;
  }

  /**
   * Calculate member engagement scores
   */
  private async calculateEngagementScores(members: MemberData[]): Promise<EngagementScore[]> {
    if (members.length === 0) {
      return [];
    }

    const scores: EngagementScore[] = [];

    // Calculate statistics for normalization
    const maxActivities = Math.max(...members.map(m => m.activitiesParticipated), 1);
    const maxSkills = Math.max(...members.map(m => m.skills.length), 1);

    for (const member of members) {
      // Calculate individual factors
      const activityParticipation = (member.activitiesParticipated / maxActivities) * 100;

      const assessmentCompletion = member.assessmentScores
        ? Object.keys(member.assessmentScores).length * 10 // 10 points per assessment
        : 0;

      const skillDevelopment = (member.skills.length / maxSkills) * 100;

      // Calculate consistency (based on join date and recent activity)
      const daysSinceJoin = Math.floor((Date.now() - member.joinDate.getTime()) / (1000 * 60 * 60 * 24));
      const consistency = daysSinceJoin > 0
        ? Math.min(100, (member.activitiesParticipated / daysSinceJoin) * 30 * 100)
        : 0;

      // Calculate overall score
      const score = (
        activityParticipation * 0.3 +
        assessmentCompletion * 0.3 +
        skillDevelopment * 0.2 +
        consistency * 0.2
      );

      // Determine level
      let level: 'low' | 'medium' | 'high' | 'very_high';
      if (score < 25) level = 'low';
      else if (score < 50) level = 'medium';
      else if (score < 75) level = 'high';
      else level = 'very_high';

      // Determine trend (simplified - would need historical data)
      const trend: 'improving' | 'declining' | 'stable' = 'stable';

      scores.push({
        memberId: member.id,
        memberName: member.name,
        score: Math.round(score * 100) / 100,
        level,
        factors: {
          activityParticipation: Math.round(activityParticipation * 100) / 100,
          assessmentCompletion: Math.round(assessmentCompletion * 100) / 100,
          skillDevelopment: Math.round(skillDevelopment * 100) / 100,
          consistency: Math.round(consistency * 100) / 100,
        },
        trend,
      });
    }

    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);

    return scores;
  }

  /**
   * Analyze skill gaps
   */
  private async analyzeSkillGaps(
    members: MemberData[],
    assessments: AssessmentData[]
  ): Promise<SkillGap[]> {
    if (members.length === 0) {
      return [];
    }

    // Define required skills and their target levels
    const requiredSkills: Record<string, number> = {
      'Leadership': 80,
      'Communication': 75,
      'Technical': 70,
      'Project Management': 65,
      'Teamwork': 80,
      'Problem Solving': 75,
      'Creativity': 70,
      'Time Management': 70,
      'Financial Literacy': 60,
      'Public Speaking': 65,
    };

    const skillGaps: SkillGap[] = [];

    for (const [skill, requiredLevel] of Object.entries(requiredSkills)) {
      // Find members with this skill
      const membersWithSkill = members.filter(m =>
        m.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );

      // Calculate current level from assessments
      const skillAssessments = assessments.filter(a =>
        a.dimension.toLowerCase().includes(skill.toLowerCase())
      );

      const currentLevel = skillAssessments.length > 0
        ? skillAssessments.reduce((sum, a) => sum + a.score, 0) / skillAssessments.length
        : 0;

      const gap = Math.max(0, requiredLevel - currentLevel);
      const membersNeedingTraining = members.length - membersWithSkill.length;

      // Determine priority
      let priority: 'high' | 'medium' | 'low';
      if (gap > 30 || membersNeedingTraining > members.length * 0.5) {
        priority = 'high';
      } else if (gap > 15 || membersNeedingTraining > members.length * 0.3) {
        priority = 'medium';
      } else {
        priority = 'low';
      }

      // Generate AI recommendations
      let recommendations: string[] = [];
      try {
        const recommendationPrompt = `
For the skill "${skill}" with a gap of ${gap.toFixed(1)} points (required: ${requiredLevel}, current: ${currentLevel.toFixed(1)}):
- Members with skill: ${membersWithSkill.length}
- Members needing training: ${membersNeedingTraining}

Provide 3 specific recommendations to close this skill gap. Format as a numbered list.
`;
        const request: AIRequest = {
          prompt: recommendationPrompt,
          maxTokens: 300,
          temperature: 0.5,
          useCache: true,
          priority: 'low',
        };
        const response = await aiService.generate(request);
        recommendations = response.content
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .slice(0, 3);
      } catch (error) {
        recommendations = [
          `Organize training workshops for ${skill}`,
          `Create peer learning groups for ${skill}`,
          `Provide resources and materials for ${skill} development`,
        ];
      }

      skillGaps.push({
        skill,
        requiredLevel,
        currentLevel: Math.round(currentLevel * 100) / 100,
        gap: Math.round(gap * 100) / 100,
        membersWithSkill: membersWithSkill.length,
        membersNeedingTraining,
        priority,
        recommendations,
      });
    }

    // Sort by gap (highest first)
    skillGaps.sort((a, b) => b.gap - a.gap);

    return skillGaps;
  }

  /**
   * Generate summary insights
   */
  private generateSummary(
    members: MemberData[],
    activities: ActivityData[],
    budget: BudgetData[],
    engagementScores: EngagementScore[]
  ): ComprehensiveInsights['summary'] {
    const totalMembers = members.length;
    const totalActivities = activities.length;
    const totalBudget = budget.reduce((sum, item) => sum + item.amount, 0);

    const averageEngagement = engagementScores.length > 0
      ? engagementScores.reduce((sum, s) => sum + s.score, 0) / engagementScores.length
      : 0;

    const topPerformingMembers = engagementScores
      .filter(s => s.level === 'high' || s.level === 'very_high')
      .slice(0, 5)
      .map(s => s.memberName);

    const areasForImprovement = this.identifyAreasForImprovement(
      activities,
      budget,
      engagementScores
    );

    return {
      totalMembers,
      totalActivities,
      totalBudget,
      averageEngagement: Math.round(averageEngagement * 100) / 100,
      topPerformingMembers,
      areasForImprovement,
    };
  }

  /**
   * Identify areas for improvement
   */
  private identifyAreasForImprovement(
    activities: ActivityData[],
    budget: BudgetData[],
    engagementScores: EngagementScore[]
  ): string[] {
    const areas: string[] = [];

    // Check activity completion rate
    const completedActivities = activities.filter(a => a.status === 'completed').length;
    const completionRate = activities.length > 0 ? (completedActivities / activities.length) * 100 : 0;
    if (completionRate < 70) {
      areas.push('Activity completion rate needs improvement');
    }

    // Check budget utilization
    const totalBudget = budget.reduce((sum, item) => sum + item.amount, 0);
    const expenses = budget.filter(b => b.type === 'expense').reduce((sum, b) => sum + b.amount, 0);
    if (totalBudget > 0 && (expenses / totalBudget) > 0.9) {
      areas.push('Budget utilization is high, consider cost optimization');
    }

    // Check member engagement
    const lowEngagement = engagementScores.filter(s => s.level === 'low').length;
    if (lowEngagement > engagementScores.length * 0.3) {
      areas.push('Many members have low engagement, consider engagement strategies');
    }

    return areas;
  }

  /**
   * Get month key for grouping
   */
  private getMonthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Get insights for a specific member
   */
  async getMemberInsights(memberId: string, members: MemberData[]): Promise<{
    member: MemberData | null;
    engagement: EngagementScore | null;
    recommendations: string[];
  }> {
    const member = members.find(m => m.id === memberId) || null;

    if (!member) {
      return {
        member: null,
        engagement: null,
        recommendations: [],
      };
    }

    const engagementScores = await this.calculateEngagementScores([member]);
    const engagement = engagementScores[0] || null;

    let recommendations: string[] = [];
    if (engagement) {
      try {
        const prompt = `
Based on this member's engagement data:
- Name: ${member.name}
- Engagement Score: ${engagement.score} (${engagement.level})
- Activities Participated: ${member.activitiesParticipated}
- Skills: ${member.skills.join(', ')}
- Factors: Activity Participation (${engagement.factors.activityParticipation}), Assessment Completion (${engagement.factors.assessmentCompletion}), Skill Development (${engagement.factors.skillDevelopment}), Consistency (${engagement.factors.consistency})

Provide 3 personalized recommendations to improve their engagement. Format as a numbered list.
`;
        const request: AIRequest = {
          prompt,
          maxTokens: 300,
          temperature: 0.5,
          useCache: true,
          priority: 'normal',
        };
        const response = await aiService.generate(request);
        recommendations = response.content
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .slice(0, 3);
      } catch (error) {
        }
    }

    return {
      member,
      engagement,
      recommendations,
    };
  }
}

// Export singleton instance
export const insightsEngine = new InsightsEngine();

// Export class for testing
export { InsightsEngine };
