'use client'

import { memo } from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react'

export const PathEdge = memo(function PathEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const edgeType = (data as { type?: string })?.type ?? 'prerequisite'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: edgeType === 'prerequisite' ? '#6B7280' : '#93C5FD',
          strokeWidth: 2,
          strokeDasharray: edgeType === 'recommended' ? '5,5' : undefined,
        }}
        markerEnd="url(#arrowhead)"
      />
      {edgeType === 'recommended' && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-600 font-medium"
          >
            recommended
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
})
