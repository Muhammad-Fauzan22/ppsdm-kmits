'use client';

import { useState, useEffect, useCallback } from 'react';
import { localML, SentimentResult, KeywordResult, ReadingLevelResult } from '@/lib/ml/local-ml';
import { aiService, AIRequest } from '@/lib/ai/ai-service';

// Type definitions for assessment data
interface AssessmentData {
  dimensionScores: Record<string, number>;
  completedAt: Date;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    answer: string;
    timeSpent: number;
  }>;
  studentName?: string;
  assessmentType?: string;
}

// AI Insight interface
interface AIInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  confidence: number;
  priority?: 'high' | 'medium' | 'low';
}

// Local analysis interface
interface LocalAnalysisResult {
  sentiment: SentimentResult;
  keywords: KeywordResult;
  readingLevel: ReadingLevelResult;
}

// Props interface
interface AIAnalyticsProps {
  data: AssessmentData;
  onInsightsGenerated?: (insights: AIInsight[]) => void;
  showLocalAnalysis?: boolean;
  showAIAnalysis?: boolean;
}

export default function AIAnalytics({
  data,
  onInsightsGenerated,
  showLocalAnalysis = true,
  showAIAnalysis = true,
}: AIAnalyticsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState<LocalAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queueStatus, setQueueStatus] = useState<{
    queueLength: number;
    isProcessing: boolean;
  } | null>(null);

  // Run analysis on data change
  useEffect(() => {
    if (data) {
      const runAnalysis = async () => {
        setError(null);
        
        if (showLocalAnalysis) {
          await analyzeLocally();
        }
        
        if (showAIAnalysis) {
          await analyzeWithAI();
        }
      };
      
      runAnalysis();
    }
  }, [data, showLocalAnalysis, showAIAnalysis]);

  // Local ML analysis
  const analyzeLocally = useCallback(async () => {
    try {
      const textToAnalyze = JSON.stringify(data.dimensionScores) + ' ' + 
        data.answers.map(a => a.answer).join(' ');
      
      const [sentiment, keywords, readingLevel] = await Promise.all([
        localML.predictSentiment(textToAnalyze),
        localML.extractKeywords(textToAnalyze, 8),
        localML.calculateReadingLevel(textToAnalyze),
      ]);
      
      setLocalAnalysis({
        sentiment,
        keywords,
        readingLevel,
      });
    } catch (err) {
      console.error('Local ML analysis failed:', err);
      // Continue without local analysis
    }
  }, [data]);

  // AI-powered analysis
  const analyzeWithAI = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get queue status
      const status = aiService.getQueueStatus();
      setQueueStatus({
        queueLength: status.queueLength,
        isProcessing: status.isProcessing,
      });

      // Generate summary for AI analysis
      const dimensions = Object.entries(data.dimensionScores)
        .map(([dim, score]) => `${dim}: ${score}%`)
        .join(', ');
      
      const prompt = `Analyze the following assessment results and provide structured insights:

Assessment Type: ${data.assessmentType || 'General'}
Time Spent: ${Math.round(data.timeSpent / 60)} minutes

Dimension Scores:
${dimensions}

Provide insights in the following format (JSON array):
[
  {
    "type": "strength|weakness|recommendation|pattern",
    "title": "Brief title",
    "description": "Detailed description with actionable insights",
    "confidence": 0.0-1.0,
    "priority": "high|medium|low"
  }
]

Focus on:
1. Identifying top strengths (scores >= 80%)
2. Identifying areas for improvement (scores < 60%)
3. Providing specific, actionable recommendations
4. Noting any interesting patterns in the data`;

      const response = await aiService.generate({
        prompt,
        maxTokens: 1500,
        temperature: 0.7,
        priority: 'normal',
      });

      // Parse AI response
      const parsedInsights = parseAIResponse(response.content);
      setInsights(parsedInsights);
      
      // Callback if provided
      if (onInsightsGenerated) {
        onInsightsGenerated(parsedInsights);
      }
    } catch (err) {
      console.error('AI analysis failed:', err);
      setError('AI analysis temporarily unavailable. Showing rule-based insights.');
      
      // Fallback to rule-based insights
      const ruleBasedInsights = generateRuleBasedInsights(data);
      setInsights(ruleBasedInsights);
      
      if (onInsightsGenerated) {
        onInsightsGenerated(ruleBasedInsights);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [data, onInsightsGenerated]);

  // Parse AI response into structured insights
  const parseAIResponse = (content: string): AIInsight[] => {
    try {
      // Try to parse as JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.map((item: any) => ({
          type: item.type || 'pattern',
          title: item.title || 'Insight',
          description: item.description || '',
          confidence: item.confidence || 0.8,
          priority: item.priority || 'medium',
        }));
      }
    } catch {
      // Fall through to line-based parsing
    }

    // Fallback: Parse line by line
    const lines = content.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 10);
    
    return lines.slice(0, 6).map((line, i) => {
      const lowerLine = line.toLowerCase();
      let type: AIInsight['type'] = 'pattern';
      let priority: AIInsight['priority'] = 'medium';
      
      if (lowerLine.includes('strength') || lowerLine.includes('strong')) {
        type = 'strength';
        priority = 'high';
      } else if (lowerLine.includes('weak') || lowerLine.includes('improve') || lowerLine.includes('low')) {
        type = 'weakness';
        priority = 'high';
      } else if (lowerLine.includes('recommend') || lowerLine.includes('suggest')) {
        type = 'recommendation';
      }
      
      return {
        type,
        title: line.split('.')[0].slice(0, 50) || `Insight ${i + 1}`,
        description: line,
        confidence: Math.max(0.6, 0.95 - (i * 0.08)),
        priority,
      };
    });
  };

  // Generate rule-based insights (fallback)
  const generateRuleBasedInsights = (assessmentData: AssessmentData): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Analyze dimensions
    Object.entries(assessmentData.dimensionScores).forEach(([dimension, score]) => {
      if (score >= 85) {
        insights.push({
          type: 'strength',
          title: `${dimension} - Excellent Performance`,
          description: `Outstanding achievement in ${dimension} with ${score}%. This demonstrates strong capability in this area.`,
          confidence: 0.95,
          priority: 'high',
        });
      } else if (score >= 70) {
        insights.push({
          type: 'strength',
          title: `${dimension} - Good Performance`,
          description: `Solid performance in ${dimension} at ${score}%. Building on this foundation will lead to further growth.`,
          confidence: 0.85,
          priority: 'medium',
        });
      } else if (score >= 50) {
        insights.push({
          type: 'pattern',
          title: `${dimension} - Development Area`,
          description: `${dimension} score of ${score}% indicates potential for improvement. Targeted practice recommended.`,
          confidence: 0.75,
          priority: 'medium',
        });
      } else {
        insights.push({
          type: 'weakness',
          title: `${dimension} - Needs Attention`,
          description: `${dimension} at ${score}% requires focused development. Consider additional learning resources.`,
          confidence: 0.9,
          priority: 'high',
        });
      }
    });
    
    // Time-based insights
    if (assessmentData.timeSpent < 300) {
      insights.push({
        type: 'pattern',
        title: 'Quick Completion',
        description: 'Assessment completed quickly. Consider spending more time on reflection for deeper insights.',
        confidence: 0.7,
        priority: 'low',
      });
    } else if (assessmentData.timeSpent > 1800) {
      insights.push({
        type: 'pattern',
        title: 'Thorough Analysis',
        description: 'Significant time spent on assessment, indicating careful consideration of responses.',
        confidence: 0.8,
        priority: 'low',
      });
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    insights.sort((a, b) => priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium']);
    
    return insights.slice(0, 8);
  };

  // Get color for insight type
  const getInsightColor = (type: AIInsight['type']): string => {
    switch (type) {
      case 'strength':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'weakness':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'recommendation':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
    }
  };

  const getInsightIcon = (type: AIInsight['type']): string => {
    switch (type) {
      case 'strength':
        return '⭐';
      case 'weakness':
        return '⚠️';
      case 'recommendation':
        return '💡';
      default:
        return '📊';
    }
  };

  return (
    <div className="ai-analytics space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Analysis</h2>
          {data.studentName && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analysis for: {data.studentName}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Queue Status */}
          {queueStatus && queueStatus.queueLength > 0 && (
            <span className="text-xs text-orange-600 dark:text-orange-400">
              Queue: {queueStatus.queueLength}
            </span>
          )}
          
          {/* Analyzing Indicator */}
          {isAnalyzing && (
            <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              AI Analyzing...
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">{error}</p>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">AI-Generated Insights</h3>
          <div className="grid gap-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getInsightIcon(insight.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        {insight.priority && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            insight.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {insight.priority}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mt-1 opacity-90">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local ML Analysis */}
      {localAnalysis && showLocalAnalysis && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-4">Quick Local Analysis</h3>
          
          {/* Sentiment */}
          <div className="mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sentiment Analysis</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-lg font-medium capitalize ${
                localAnalysis.sentiment.sentiment === 'positive' ? 'text-green-600' :
                localAnalysis.sentiment.sentiment === 'negative' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {localAnalysis.sentiment.sentiment}
              </span>
              <span className="text-xs text-gray-400">
                ({Math.round(localAnalysis.sentiment.confidence * 100)}% confidence)
              </span>
            </div>
            {/* Sentiment Scores Bar */}
            <div className="flex gap-1 mt-2 h-2">
              <div 
                className="bg-green-500 rounded" 
                style={{ width: `${localAnalysis.sentiment.scores.positive * 100}%` }}
              />
              <div 
                className="bg-gray-400 rounded" 
                style={{ width: `${localAnalysis.sentiment.scores.neutral * 100}%` }}
              />
              <div 
                className="bg-red-500 rounded" 
                style={{ width: `${localAnalysis.sentiment.scores.negative * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>+: {Math.round(localAnalysis.sentiment.scores.positive * 100)}%</span>
              <span>-: {Math.round(localAnalysis.sentiment.scores.negative * 100)}%</span>
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Key Themes</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {localAnalysis.keywords.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Reading Level */}
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Data Characteristics</span>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div>
                <span className="text-gray-500">Score: </span>
                <span className="font-medium">{localAnalysis.readingLevel.score}</span>
              </div>
              <div>
                <span className="text-gray-500">Level: </span>
                <span className="font-medium">{localAnalysis.readingLevel.description}</span>
              </div>
              <div>
                <span className="text-gray-500">Grade: </span>
                <span className="font-medium">{localAnalysis.readingLevel.grade}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Insights State */}
      {!isAnalyzing && insights.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <span className="text-4xl mb-2 block">🤖</span>
          <p>No analysis available yet. Start an assessment to see AI insights.</p>
        </div>
      )}
    </div>
  );
}

// Export types for external use
export type { AssessmentData, AIInsight, LocalAnalysisResult };
