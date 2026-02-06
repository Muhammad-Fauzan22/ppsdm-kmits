'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertTriangle, BarChart3, CheckCircle, Clock, Info, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceMonitor, PerformanceMetrics, PerformanceRecommendation, PerformanceScore, formatMetric, getScoreColor } from '@/lib/performance-monitoring';

interface PerformanceMonitorProps {
  autoStart?: boolean;
  updateInterval?: number;
  className?: string;
}

export function PerformanceMonitorComponent({ 
  autoStart = true, 
  updateInterval = 10000, 
  className 
}: PerformanceMonitorProps) {
  const [monitor] = useState(() => new PerformanceMonitor());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });
  const [score, setScore] = useState<PerformanceScore>({
    score: 0,
    rating: 'poor',
    breakdown: {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0
    }
  });
  const [recommendations, setRecommendations] = useState<PerformanceRecommendation[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const refreshMetrics = useCallback(() => {
    const currentMetrics = monitor.getMetrics();
    const currentScore = monitor.calculateScore();
    const currentRecommendations = monitor.getRecommendations();
    
    setMetrics(currentMetrics);
    setScore(currentScore);
    setRecommendations(currentRecommendations);
  }, [monitor]);

  const startMonitoring = useCallback(() => {
    monitor.startMonitoring();
    setIsMonitoring(true);
    refreshMetrics();
  }, [monitor, refreshMetrics]);

  const stopMonitoring = useCallback(() => {
    monitor.stopMonitoring();
    setIsMonitoring(false);
  }, [monitor]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const resetMonitoring = useCallback(() => {
    stopMonitoring();
    startMonitoring();
  }, [stopMonitoring, startMonitoring]);

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }

    return () => stopMonitoring();
  }, [autoStart, startMonitoring, stopMonitoring]);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(refreshMetrics, updateInterval);
    return () => clearInterval(interval);
  }, [isMonitoring, refreshMetrics, updateInterval]);

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs-improvement':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Performance Monitor</h3>
            {isMonitoring && (
              <span className="flex items-center space-x-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <span>Monitoring</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={resetMonitoring}
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleExpanded}
              className="text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>

        {/* Performance Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Performance Score</span>
            </div>
            
            <div className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
              {score.score}
              <span className="text-sm text-gray-400 ml-1">/100</span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  score.score >= 75 ? 'bg-green-500' :
                  score.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score.score}%` }}
              />
            </div>
            <p className={`text-sm mt-1 ${getRatingColor(score.rating)}`}>
              {score.rating.charAt(0).toUpperCase() + score.rating.slice(1)}
            </p>
          </div>
        </div>

        {/* Core Metrics */}
        {isExpanded && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-semibold">Core Web Vitals</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(metrics) as [keyof PerformanceMetrics, PerformanceMetrics[keyof PerformanceMetrics]][]).map(([key, metric]) => {
                  if (!metric) {
                    return null;
                  }

                  return (
                    <div
                      key={key}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600 uppercase">
                          {metric.name}
                        </span>
                        {getRatingIcon(metric.rating || 'poor')}
                      </div>
                      
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatMetric(metric.value, key)}
                        </span>
                        <span className={`text-xs ${getRatingColor(metric.rating || 'poor')}`}>
                          {(metric.rating || 'poor').charAt(0).toUpperCase() + (metric.rating || 'poor').slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <>
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-semibold">Recommendations</h4>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {recommendations.length}
                    </span>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {recommendations.map((recommendation) => (
                      <div
                        key={recommendation.id}
                        className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-blue-900">{recommendation.title}</p>
                            <p className="text-blue-700 mt-1">{recommendation.description}</p>
                          </div>
                          
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            getImpactColor(recommendation.impact)
                          }`}>
                            {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Detailed Breakdown */}
            <Separator className="my-4" />
            
            <Tabs defaultValue="scores">
              <TabsList className="w-full">
                <TabsTrigger value="scores" className="flex-1">Score Breakdown</TabsTrigger>
                <TabsTrigger value="timing" className="flex-1">Timing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scores" className="mt-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">LCP (Largest Contentful Paint)</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.breakdown.lcp)}`}>
                      {score.breakdown.lcp}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">FID (First Input Delay)</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.breakdown.fid)}`}>
                      {score.breakdown.fid}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CLS (Cumulative Layout Shift)</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.breakdown.cls)}`}>
                      {score.breakdown.cls}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">FCP (First Contentful Paint)</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.breakdown.fcp)}`}>
                      {score.breakdown.fcp}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">TTFB (Time to First Byte)</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.breakdown.ttfb)}`}>
                      {score.breakdown.ttfb}%
                    </span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="timing" className="mt-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Monitoring duration: {Math.round(updateInterval / 1000)} seconds</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <RefreshCw className="w-4 h-4" />
                    <span>Update frequency: {updateInterval / 1000} seconds</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Card>
  );
}