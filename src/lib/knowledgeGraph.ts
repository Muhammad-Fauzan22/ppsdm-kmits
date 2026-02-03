// Knowledge Graph System
// Lightweight implementation using adjacency lists
// Free alternative to Neo4j for MVP

export interface KnowledgeNode {
    id: string;
    type: 'concept' | 'skill' | 'resource' | 'person' | 'competency' | 'project';
    title: string;
    description: string;
    metadata: Record<string, unknown>;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    qualityScore: number;
    viewCount: number;
    contributorId?: string;
}

export interface KnowledgeEdge {
    id: string;
    sourceId: string;
    targetId: string;
    relationship:
    | 'PREREQUISITE'    // Concept → Concept
    | 'TEACHES'         // Person/Resource → Concept
    | 'DEVELOPS'        // Activity → Competency
    | 'APPLIES_TO'      // Concept → Project
    | 'RELATED_TO'      // General relationship
    | 'PART_OF'         // Hierarchy
    | 'ASSESSED_BY';    // Competency → Assessment
    weight: number;       // Strength of relationship (0-1)
    metadata?: Record<string, unknown>;
}

export interface KnowledgeGraph {
    nodes: Map<string, KnowledgeNode>;
    edges: KnowledgeEdge[];
    adjacencyList: Map<string, string[]>;  // nodeId → connected nodeIds
}

// Create empty knowledge graph
export function createKnowledgeGraph(): KnowledgeGraph {
    return {
        nodes: new Map(),
        edges: [],
        adjacencyList: new Map(),
    };
}

// Add node to graph
export function addNode(graph: KnowledgeGraph, node: KnowledgeNode): void {
    graph.nodes.set(node.id, node);
    if (!graph.adjacencyList.has(node.id)) {
        graph.adjacencyList.set(node.id, []);
    }
}

// Add edge to graph
export function addEdge(graph: KnowledgeGraph, edge: KnowledgeEdge): void {
    graph.edges.push(edge);

    // Update adjacency list (bidirectional for most relationships)
    const sourceAdj = graph.adjacencyList.get(edge.sourceId) || [];
    sourceAdj.push(edge.targetId);
    graph.adjacencyList.set(edge.sourceId, sourceAdj);

    const targetAdj = graph.adjacencyList.get(edge.targetId) || [];
    targetAdj.push(edge.sourceId);
    graph.adjacencyList.set(edge.targetId, targetAdj);
}

// Find related nodes (BFS traversal)
export function findRelatedNodes(
    graph: KnowledgeGraph,
    startNodeId: string,
    maxDepth: number = 2,
    maxNodes: number = 10
): KnowledgeNode[] {
    const visited = new Set<string>();
    const result: KnowledgeNode[] = [];
    const queue: { nodeId: string; depth: number }[] = [{ nodeId: startNodeId, depth: 0 }];

    while (queue.length > 0 && result.length < maxNodes) {
        const { nodeId, depth } = queue.shift()!;

        if (visited.has(nodeId) || depth > maxDepth) continue;
        visited.add(nodeId);

        const node = graph.nodes.get(nodeId);
        if (node && nodeId !== startNodeId) {
            result.push(node);
        }

        const neighbors = graph.adjacencyList.get(nodeId) || [];
        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                queue.push({ nodeId: neighborId, depth: depth + 1 });
            }
        }
    }

    return result;
}

// Get prerequisites for a concept
export function getPrerequisites(graph: KnowledgeGraph, conceptId: string): KnowledgeNode[] {
    const prereqEdges = graph.edges.filter(
        e => e.targetId === conceptId && e.relationship === 'PREREQUISITE'
    );

    return prereqEdges
        .map(e => graph.nodes.get(e.sourceId))
        .filter((n): n is KnowledgeNode => n !== undefined);
}

// Get learning path (topological sort for prerequisites)
export function generateLearningPath(
    graph: KnowledgeGraph,
    targetConceptId: string
): KnowledgeNode[] {
    const visited = new Set<string>();
    const path: KnowledgeNode[] = [];

    function dfs(nodeId: string): void {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        // First visit all prerequisites
        const prereqs = getPrerequisites(graph, nodeId);
        for (const prereq of prereqs) {
            dfs(prereq.id);
        }

        // Then add this node
        const node = graph.nodes.get(nodeId);
        if (node) path.push(node);
    }

    dfs(targetConceptId);
    return path;
}

// Search nodes by text (simple implementation)
export function searchNodes(
    graph: KnowledgeGraph,
    query: string,
    type?: KnowledgeNode['type']
): KnowledgeNode[] {
    const lowerQuery = query.toLowerCase();
    const results: KnowledgeNode[] = [];

    graph.nodes.forEach(node => {
        if (type && node.type !== type) return;

        const matchesTitle = node.title.toLowerCase().includes(lowerQuery);
        const matchesDesc = node.description.toLowerCase().includes(lowerQuery);
        const matchesTags = node.tags.some(t => t.toLowerCase().includes(lowerQuery));

        if (matchesTitle || matchesDesc || matchesTags) {
            results.push(node);
        }
    });

    // Sort by quality score
    return results.sort((a, b) => b.qualityScore - a.qualityScore);
}

// ============================================
// SAMPLE KNOWLEDGE GRAPH FOR PPSDM DOMAINS
// ============================================

export function createPPSDMKnowledgeGraph(): KnowledgeGraph {
    const graph = createKnowledgeGraph();

    // Add dimension nodes
    const dimensions: KnowledgeNode[] = [
        { id: 'dim-cognitive', type: 'competency', title: 'Cognitive Development', description: 'Kemampuan berpikir kritis, analitis, dan problem-solving', metadata: {}, tags: ['berpikir', 'analisis', 'logic'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 95, viewCount: 1000 },
        { id: 'dim-selfmgmt', type: 'competency', title: 'Self-Management', description: 'Pengelolaan waktu, prioritas, dan produktivitas', metadata: {}, tags: ['waktu', 'produktivitas', 'disiplin'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 92, viewCount: 950 },
        { id: 'dim-financial', type: 'competency', title: 'Financial Intelligence', description: 'Literasi keuangan dan manajemen finansial', metadata: {}, tags: ['uang', 'investasi', 'budget'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 88, viewCount: 800 },
        { id: 'dim-physical', type: 'competency', title: 'Physical Health', description: 'Kesehatan fisik dan gaya hidup aktif', metadata: {}, tags: ['olahraga', 'kesehatan', 'nutrisi'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 90, viewCount: 700 },
        { id: 'dim-emotional', type: 'competency', title: 'Emotional Intelligence', description: 'Kecerdasan emosional dan hubungan interpersonal', metadata: {}, tags: ['emosi', 'empati', 'komunikasi'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 91, viewCount: 850 },
        { id: 'dim-mental', type: 'competency', title: 'Mental Health', description: 'Kesehatan mental dan resiliensi', metadata: {}, tags: ['mental', 'stress', 'mindfulness'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 94, viewCount: 900 },
        { id: 'dim-character', type: 'competency', title: 'Character & Ethics', description: 'Integritas, tanggung jawab, dan etika', metadata: {}, tags: ['karakter', 'integritas', 'etika'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 93, viewCount: 750 },
        { id: 'dim-spiritual', type: 'competency', title: 'Spiritual Development', description: 'Pengembangan spiritual dan tujuan hidup', metadata: {}, tags: ['spiritual', 'tujuan', 'makna'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 89, viewCount: 600 },
        { id: 'dim-environmental', type: 'competency', title: 'Environmental & Lifestyle', description: 'Kesadaran lingkungan dan gaya hidup berkelanjutan', metadata: {}, tags: ['lingkungan', 'sustainability', 'eco'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 87, viewCount: 550 },
    ];

    dimensions.forEach(d => addNode(graph, d));

    // Add concept nodes
    const concepts: KnowledgeNode[] = [
        { id: 'concept-critical-thinking', type: 'concept', title: 'Critical Thinking', description: 'Kemampuan menganalisis informasi secara objektif', metadata: {}, tags: ['analisis', 'evaluasi'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 90, viewCount: 500 },
        { id: 'concept-time-management', type: 'concept', title: 'Time Management', description: 'Teknik pengelolaan waktu efektif', metadata: {}, tags: ['waktu', 'prioritas'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 88, viewCount: 600 },
        { id: 'concept-budgeting', type: 'concept', title: 'Budgeting', description: 'Perencanaan dan pengelolaan anggaran', metadata: {}, tags: ['budget', 'keuangan'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 85, viewCount: 400 },
        { id: 'concept-mindfulness', type: 'concept', title: 'Mindfulness', description: 'Praktik kesadaran penuh', metadata: {}, tags: ['meditasi', 'awareness'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), qualityScore: 92, viewCount: 700 },
    ];

    concepts.forEach(c => addNode(graph, c));

    // Add edges (relationships)
    const edges: KnowledgeEdge[] = [
        { id: 'e1', sourceId: 'concept-critical-thinking', targetId: 'dim-cognitive', relationship: 'PART_OF', weight: 0.9 },
        { id: 'e2', sourceId: 'concept-time-management', targetId: 'dim-selfmgmt', relationship: 'PART_OF', weight: 0.9 },
        { id: 'e3', sourceId: 'concept-budgeting', targetId: 'dim-financial', relationship: 'PART_OF', weight: 0.85 },
        { id: 'e4', sourceId: 'concept-mindfulness', targetId: 'dim-mental', relationship: 'PART_OF', weight: 0.9 },
        { id: 'e5', sourceId: 'dim-emotional', targetId: 'dim-mental', relationship: 'RELATED_TO', weight: 0.7 },
        { id: 'e6', sourceId: 'dim-character', targetId: 'dim-spiritual', relationship: 'RELATED_TO', weight: 0.6 },
        { id: 'e7', sourceId: 'concept-time-management', targetId: 'concept-critical-thinking', relationship: 'PREREQUISITE', weight: 0.5 },
    ];

    edges.forEach(e => addEdge(graph, e));

    return graph;
}

const knowledgeGraph = {
    createKnowledgeGraph,
    addNode,
    addEdge,
    findRelatedNodes,
    getPrerequisites,
    generateLearningPath,
    searchNodes,
    createPPSDMKnowledgeGraph,
};

export default knowledgeGraph;
