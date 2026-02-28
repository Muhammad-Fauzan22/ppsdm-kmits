'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { X, BookOpen, Clock, CheckCircle, PlayCircle } from 'lucide-react'
import { PathNode } from './PathNode'
import { PathEdge } from './PathEdge'
import type { LearningNode, LearningPath, NodeStatus } from '@/lib/learning-path/path-generator'

interface LearningPathFlowProps {
  path: LearningPath
  onNodeStatusChange: (nodeId: string, status: NodeStatus) => void
}

const nodeTypes = { pathNode: PathNode }
const edgeTypes = { pathEdge: PathEdge }

function convertToFlowNodes(
  learningNodes: LearningNode[],
  onNodeClick: (node: LearningNode) => void
): Node[] {
  // Auto-layout: group by level
  const levelGroups: Record<number, LearningNode[]> = {}
  for (const node of learningNodes) {
    if (!levelGroups[node.level]) levelGroups[node.level] = []
    levelGroups[node.level].push(node)
  }

  const flowNodes: Node[] = []
  const levelHeight = 200
  const nodeWidth = 220

  for (const [level, nodes] of Object.entries(levelGroups)) {
    const levelNum = parseInt(level, 10)
    const totalWidth = nodes.length * nodeWidth
    const startX = -totalWidth / 2

    nodes.forEach((node, i) => {
      flowNodes.push({
        id: node.id,
        type: 'pathNode',
        position: {
          x: startX + i * nodeWidth,
          y: (levelNum - 1) * levelHeight,
        },
        data: { ...node, onNodeClick },
      })
    })
  }

  return flowNodes
}

function convertToFlowEdges(learningEdges: LearningPath['edges']): Edge[] {
  return learningEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'pathEdge',
    data: { type: edge.type },
    animated: edge.type === 'recommended',
  }))
}

export function LearningPathFlow({ path, onNodeStatusChange }: LearningPathFlowProps) {
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null)

  const handleNodeClick = useCallback((node: LearningNode) => {
    setSelectedNode(node)
  }, [])

  const flowNodes = useMemo(
    () => convertToFlowNodes(path.nodes, handleNodeClick),
    [path.nodes, handleNodeClick]
  )

  const flowEdges = useMemo(
    () => convertToFlowEdges(path.edges),
    [path.edges]
  )

  const [nodes, , onNodesChange] = useNodesState(flowNodes)
  const [edges, , onEdgesChange] = useEdgesState(flowEdges)

  const handleMarkComplete = () => {
    if (!selectedNode) return
    onNodeStatusChange(selectedNode.id, 'completed')
    setSelectedNode(null)
  }

  const handleMarkInProgress = () => {
    if (!selectedNode) return
    onNodeStatusChange(selectedNode.id, 'in-progress')
    setSelectedNode(null)
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="#f0f0f0" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const status = (node.data as LearningNode).status
            switch (status) {
              case 'completed': return '#10B981'
              case 'in-progress': return '#F59E0B'
              case 'available': return '#3B82F6'
              default: return '#D1D5DB'
            }
          }}
        />
      </ReactFlow>

      {/* Node detail panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">
              {selectedNode.title}
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <p className="text-xs text-gray-600 mb-3">{selectedNode.description}</p>

          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {selectedNode.estimatedHours}h
            </span>
            <span className="capitalize">{selectedNode.dimension}</span>
            <span className="capitalize">Level {selectedNode.level}</span>
          </div>

          {selectedNode.resources.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Resources
              </p>
              <ul className="space-y-1">
                {selectedNode.resources.map((resource, i) => (
                  <li key={i} className="text-xs text-blue-600">• {resource}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            {selectedNode.status === 'available' && (
              <button
                onClick={handleMarkInProgress}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Start
              </button>
            )}
            {(selectedNode.status === 'available' || selectedNode.status === 'in-progress') && (
              <button
                onClick={handleMarkComplete}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Complete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
