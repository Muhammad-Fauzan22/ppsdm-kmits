'use client'

import { useState, useEffect } from 'react'
import { Map, RefreshCw } from 'lucide-react'
import { LearningPathFlow } from '@/components/learning-path/LearningPathFlow'
import {
  generateLearningPath,
  updateNodeStatus,
  type LearningPath,
  type NodeStatus,
} from '@/lib/learning-path/path-generator'
import { createClient } from '@/lib/supabase/client'

export default function LearningPathPage() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    loadLearningPath()
  }, [])

  const loadLearningPath = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      // Fetch dimension scores
      const { data: scores } = await supabase
        .from('dimension_scores')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      // Fetch progress
      const { data: progressData } = await supabase
        .from('learning_path_progress')
        .select('node_id, status')
        .eq('user_id', user.id)

      const progress: Record<string, NodeStatus> = {}
      for (const item of progressData ?? []) {
        progress[item.node_id] = item.status as NodeStatus
      }

      const dimensionScores = {
        intellectual: scores?.intellectual ?? 50,
        emotional: scores?.emotional ?? 50,
        social: scores?.social ?? 50,
        spiritual: scores?.spiritual ?? 50,
        physical: scores?.physical ?? 50,
        financial: scores?.financial ?? 50,
        environmental: scores?.environmental ?? 50,
        career: scores?.career ?? 50,
        character: scores?.character ?? 50,
      }

      const path = generateLearningPath(dimensionScores, progress)
      setLearningPath(path)
      setCompletedCount(path.nodes.filter((n) => n.status === 'completed').length)
    } catch (error) {
      console.error('Failed to load learning path:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNodeStatusChange = async (nodeId: string, status: NodeStatus) => {
    if (!learningPath) return

    const updatedPath = updateNodeStatus(learningPath, nodeId, status)
    setLearningPath(updatedPath)
    setCompletedCount(updatedPath.nodes.filter((n) => n.status === 'completed').length)

    // Save to database
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('learning_path_progress')
        .upsert({
          user_id: user.id,
          node_id: nodeId,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,node_id',
        })
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  const totalNodes = learningPath?.nodes.length ?? 0
  const progressPercent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Map className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Path</h1>
            <p className="text-sm text-gray-500">Your personalized learning journey</p>
          </div>
        </div>
        <button
          onClick={loadLearningPath}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {completedCount} of {totalNodes} modules completed
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { status: 'locked', color: 'bg-gray-200', label: 'Locked' },
          { status: 'available', color: 'bg-blue-200', label: 'Available' },
          { status: 'in-progress', color: 'bg-yellow-200', label: 'In Progress' },
          { status: 'completed', color: 'bg-green-200', label: 'Completed' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Flow visualization */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Generating your learning path...</p>
          </div>
        </div>
      ) : learningPath ? (
        <LearningPathFlow
          path={learningPath}
          onNodeStatusChange={handleNodeStatusChange}
        />
      ) : (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Complete an assessment to generate your learning path</p>
        </div>
      )}
    </div>
  )
}
