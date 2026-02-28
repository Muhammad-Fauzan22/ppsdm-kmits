/**
 * Learning Path Generator
 * Generates adaptive learning paths based on 9-dimension assessment scores
 */

export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'completed'

export interface LearningNode {
  id: string
  title: string
  description: string
  dimension: string
  level: number // 1=foundational, 2=intermediate, 3=advanced
  prerequisites: string[]
  estimatedHours: number
  resources: string[]
  status: NodeStatus
}

export interface LearningEdge {
  id: string
  source: string
  target: string
  type: 'prerequisite' | 'recommended'
}

export interface LearningPath {
  nodes: LearningNode[]
  edges: LearningEdge[]
}

export interface DimensionScores {
  intellectual?: number
  emotional?: number
  social?: number
  spiritual?: number
  physical?: number
  financial?: number
  environmental?: number
  career?: number
  character?: number
}

// Base learning modules for each dimension
const DIMENSION_MODULES: Record<string, Array<Omit<LearningNode, 'status'>>> = {
  intellectual: [
    {
      id: 'int-1',
      title: 'Critical Thinking Fundamentals',
      description: 'Learn the basics of analytical and critical thinking',
      dimension: 'intellectual',
      level: 1,
      prerequisites: [],
      estimatedHours: 3,
      resources: ['Critical Thinking Guide', 'Logic Exercises'],
    },
    {
      id: 'int-2',
      title: 'Research Methodology',
      description: 'Master research methods and academic writing',
      dimension: 'intellectual',
      level: 2,
      prerequisites: ['int-1'],
      estimatedHours: 5,
      resources: ['Research Methods Handbook', 'Academic Writing Course'],
    },
    {
      id: 'int-3',
      title: 'Advanced Problem Solving',
      description: 'Complex problem-solving strategies and innovation',
      dimension: 'intellectual',
      level: 3,
      prerequisites: ['int-2'],
      estimatedHours: 8,
      resources: ['Design Thinking Workshop', 'Innovation Framework'],
    },
  ],
  emotional: [
    {
      id: 'emo-1',
      title: 'Self-Awareness Basics',
      description: 'Understanding your emotions and triggers',
      dimension: 'emotional',
      level: 1,
      prerequisites: [],
      estimatedHours: 2,
      resources: ['Emotional Intelligence Intro', 'Self-Reflection Journal'],
    },
    {
      id: 'emo-2',
      title: 'Emotional Regulation',
      description: 'Techniques for managing stress and emotions',
      dimension: 'emotional',
      level: 2,
      prerequisites: ['emo-1'],
      estimatedHours: 4,
      resources: ['Mindfulness Course', 'Stress Management Guide'],
    },
  ],
  social: [
    {
      id: 'soc-1',
      title: 'Communication Skills',
      description: 'Effective verbal and written communication',
      dimension: 'social',
      level: 1,
      prerequisites: [],
      estimatedHours: 3,
      resources: ['Public Speaking Guide', 'Active Listening Techniques'],
    },
    {
      id: 'soc-2',
      title: 'Leadership Fundamentals',
      description: 'Core leadership principles and team dynamics',
      dimension: 'social',
      level: 2,
      prerequisites: ['soc-1'],
      estimatedHours: 6,
      resources: ['Leadership Course', 'Team Management Guide'],
    },
  ],
  career: [
    {
      id: 'car-1',
      title: 'Career Planning',
      description: 'Setting career goals and creating action plans',
      dimension: 'career',
      level: 1,
      prerequisites: [],
      estimatedHours: 2,
      resources: ['Career Planning Workbook', 'Goal Setting Framework'],
    },
    {
      id: 'car-2',
      title: 'Professional Skills',
      description: 'Resume writing, interviews, and networking',
      dimension: 'career',
      level: 2,
      prerequisites: ['car-1'],
      estimatedHours: 5,
      resources: ['Resume Writing Guide', 'Interview Preparation'],
    },
  ],
  character: [
    {
      id: 'cha-1',
      title: 'Values Clarification',
      description: 'Identifying and living by your core values',
      dimension: 'character',
      level: 1,
      prerequisites: [],
      estimatedHours: 2,
      resources: ['Values Assessment', 'Ethics in Practice'],
    },
  ],
}

/**
 * Generate a learning path based on dimension scores
 */
export function generateLearningPath(
  scores: DimensionScores,
  progress: Record<string, NodeStatus> = {}
): LearningPath {
  const allNodes: LearningNode[] = []
  const allEdges: LearningEdge[] = []

  // Determine which dimensions need more focus (lower scores = more foundational nodes)
  const dimensionPriority = Object.entries(scores)
    .sort(([, a], [, b]) => (a ?? 50) - (b ?? 50))
    .map(([dim]) => dim)

  // Add modules for each dimension
  for (const [dimension, modules] of Object.entries(DIMENSION_MODULES)) {
    const score = scores[dimension as keyof DimensionScores] ?? 50
    const priority = dimensionPriority.indexOf(dimension)

    for (const module of modules) {
      // Skip advanced modules for low-priority dimensions with high scores
      if (module.level === 3 && score > 70 && priority > 3) continue

      const nodeStatus = progress[module.id] ?? determineInitialStatus(module, progress, score)

      allNodes.push({
        ...module,
        status: nodeStatus,
      })

      // Create edges for prerequisites
      for (const prereqId of module.prerequisites) {
        allEdges.push({
          id: `${prereqId}-${module.id}`,
          source: prereqId,
          target: module.id,
          type: 'prerequisite',
        })
      }
    }
  }

  return { nodes: allNodes, edges: allEdges }
}

/**
 * Determine initial status for a node based on prerequisites and score
 */
function determineInitialStatus(
  module: Omit<LearningNode, 'status'>,
  progress: Record<string, NodeStatus>,
  dimensionScore: number
): NodeStatus {
  // Check if all prerequisites are completed
  const allPrereqsCompleted = module.prerequisites.every(
    (prereqId) => progress[prereqId] === 'completed'
  )

  if (module.prerequisites.length === 0) {
    // No prerequisites - available if score is low, otherwise skip to intermediate
    if (dimensionScore < 40) return 'available'
    if (dimensionScore < 70) return module.level === 1 ? 'available' : 'locked'
    return module.level <= 2 ? 'available' : 'locked'
  }

  return allPrereqsCompleted ? 'available' : 'locked'
}

/**
 * Update node status and unlock dependent nodes
 */
export function updateNodeStatus(
  path: LearningPath,
  nodeId: string,
  newStatus: NodeStatus
): LearningPath {
  const updatedNodes = path.nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, status: newStatus }
    }

    // Check if this node should be unlocked
    if (node.status === 'locked' && newStatus === 'completed') {
      const allPrereqsCompleted = node.prerequisites.every((prereqId) => {
        if (prereqId === nodeId) return true
        const prereqNode = path.nodes.find((n) => n.id === prereqId)
        return prereqNode?.status === 'completed'
      })

      if (allPrereqsCompleted) {
        return { ...node, status: 'available' as NodeStatus }
      }
    }

    return node
  })

  return { ...path, nodes: updatedNodes }
}
