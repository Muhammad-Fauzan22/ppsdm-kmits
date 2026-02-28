'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Lock, CheckCircle, Circle, PlayCircle, Clock } from 'lucide-react'
import type { LearningNode } from '@/lib/learning-path/path-generator'

type PathNodeData = LearningNode & {
  onNodeClick: (node: LearningNode) => void
}

const STATUS_CONFIG = {
  locked: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-400',
    icon: <Lock className="w-4 h-4" />,
  },
  available: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
    icon: <Circle className="w-4 h-4" />,
  },
  'in-progress': {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    icon: <PlayCircle className="w-4 h-4" />,
  },
  completed: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    text: 'text-green-700',
    icon: <CheckCircle className="w-4 h-4" />,
  },
}

const DIMENSION_COLORS: Record<string, string> = {
  intellectual: 'bg-purple-100 text-purple-700',
  emotional: 'bg-pink-100 text-pink-700',
  social: 'bg-blue-100 text-blue-700',
  spiritual: 'bg-indigo-100 text-indigo-700',
  physical: 'bg-green-100 text-green-700',
  financial: 'bg-yellow-100 text-yellow-700',
  environmental: 'bg-teal-100 text-teal-700',
  career: 'bg-orange-100 text-orange-700',
  character: 'bg-red-100 text-red-700',
}

export const PathNode = memo(function PathNode({ data }: NodeProps) {
  const nodeData = data as PathNodeData
  const config = STATUS_CONFIG[nodeData.status]
  const dimensionColor = DIMENSION_COLORS[nodeData.dimension] ?? 'bg-gray-100 text-gray-700'

  return (
    <div
      className={`relative px-4 py-3 rounded-xl border-2 shadow-sm cursor-pointer transition-all hover:shadow-md min-w-[160px] max-w-[200px] ${config.bg} ${config.border}`}
      onClick={() => nodeData.status !== 'locked' && nodeData.onNodeClick(nodeData)}
      role="button"
      tabIndex={nodeData.status !== 'locked' ? 0 : -1}
      aria-label={`${nodeData.title} - ${nodeData.status}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && nodeData.status !== 'locked') {
          nodeData.onNodeClick(nodeData)
        }
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />

      {/* Status icon */}
      <div className={`flex items-center gap-2 mb-1 ${config.text}`}>
        {config.icon}
        <span className="text-xs font-medium capitalize">{nodeData.status.replace('-', ' ')}</span>
      </div>

      {/* Title */}
      <p className={`text-sm font-semibold leading-tight mb-2 ${config.text}`}>
        {nodeData.title}
      </p>

      {/* Dimension badge */}
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${dimensionColor}`}>
        {nodeData.dimension}
      </span>

      {/* Duration */}
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <Clock className="w-3 h-3" />
        <span>{nodeData.estimatedHours}h</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  )
})
