'use client';

import React, { useState, useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Save, Play, Plus, Zap, Code, Database, Brain, Sparkles } from 'lucide-react';

// Custom Nodes (We'll implement these fully later, for now basic)
// Ideally these would be imported from components/workflow/nodes
const initialNodes: Node[] = [
    {
        id: '1',
        position: { x: 250, y: 5 },
        data: { label: 'Webhook Trigger' },
        type: 'input'
    },
    {
        id: '2',
        position: { x: 250, y: 150 },
        data: { label: 'AI Processor (Groq)' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
];

export default function WorkflowEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isSaving, setIsSaving] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Save to Supabase
        console.log('Saving workflow:', { nodes, edges });
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleRun = () => {
        // TODO: Trigger manual run
        console.log('Running workflow...');
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            {/* Header Toolbar */}
            <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white leading-tight">AI Book Processing</h1>
                        <p className="text-xs text-slate-500 font-mono">ID: wf_29384729</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                        <Plus className="w-4 h-4" /> Add Node
                    </button>
                    <button
                        onClick={handleRun}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-md transition-colors border border-emerald-200 dark:border-emerald-800"
                    >
                        <Play className="w-4 h-4" /> Test Run
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {isSaving ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />}
                        Save Workflow
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    className="bg-slate-50 dark:bg-slate-950"
                >
                    <Controls className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400" />
                    <MiniMap className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" maskColor="rgba(0,0,0, 0.1)" />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>

                {/* Floating Node Palette (Simplified) */}
                <div className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl flex flex-col gap-2">
                    <NodeTool icon={Flash} label="Trigger" color="text-yellow-500" />
                    <NodeTool icon={Brain} label="AI Agent" color="text-purple-500" />
                    <NodeTool icon={Code} label="Script" color="text-blue-500" />
                    <NodeTool icon={Database} label="Supabase" color="text-emerald-500" />
                </div>
            </div>
        </div>
    );
}

// Helper Component for Palette
function NodeTool({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
    return (
        <div
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors w-40"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', label);
                e.dataTransfer.effectAllowed = 'move';
            }}
        >
            <div className={`p-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </div>
    )
}

function Flash({ className }: { className?: string }) {
    return <Zap className={className} />;
}
