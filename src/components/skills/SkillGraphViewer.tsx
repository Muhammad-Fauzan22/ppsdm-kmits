'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, Circle, ArrowRight, Info, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { ENGINEERING_SKILL_GRAPH, SkillNode } from '@/data/skills/graph';

export const SkillGraphViewer = () => {
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
    const [scale, setScale] = useState(1);
    const { nodes, edges } = ENGINEERING_SKILL_GRAPH;

    // Colors based on group
    const colors = {
        tech: '#60a5fa', // blue-400
        soft: '#f472b6', // pink-400
        domain: '#34d399', // emerald-400
        core: '#facc15'  // yellow-400
    };

    const statusColors = {
        mastered: 'fill-white stroke-2 stroke-white',
        unlocked: 'fill-slate-800 stroke-2 stroke-current',
        locked: 'fill-slate-900 stroke-1 stroke-slate-700 dashed'
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
    const handleFit = () => setScale(1);

    return (
        <div className="relative w-full h-[600px] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                <button onClick={handleZoomIn} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white border border-slate-700"><ZoomIn className="w-5 h-5" /></button>
                <button onClick={handleZoomOut} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white border border-slate-700"><ZoomOut className="w-5 h-5" /></button>
                <button onClick={handleFit} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white border border-slate-700"><Maximize className="w-5 h-5" /></button>
            </div>

            {/* Legend */}
            <div className="absolute top-4 left-4 z-20 bg-slate-800/80 backdrop-blur p-4 rounded-xl border border-slate-700 text-sm">
                <h4 className="font-bold text-white mb-2">Skill Types</h4>
                <div className="space-y-1">
                    {Object.entries(colors).map(([key, color]) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                            <span className="capitalize text-slate-300">{key}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas */}
            <div className="w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-[radial-gradient(circle_at_center,_#1e293b_1px,_transparent_1px)] bg-[length:24px_24px]">
                <motion.div
                    animate={{ scale: scale }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="relative origin-center"
                    style={{ width: 1000, height: 800 }} // Virtual Canvas Size
                >
                    <svg width="100%" height="100%" viewBox="0 0 1000 800" className="overflow-visible pointer-events-none">
                        {/* Edges */}
                        {edges.map((edge, i) => {
                            const source = nodes.find(n => n.id === edge.source)!;
                            const target = nodes.find(n => n.id === edge.target)!;
                            return (
                                <motion.line
                                    key={i}
                                    x1={source.x} y1={source.y}
                                    x2={target.x} y2={target.y}
                                    stroke={edge.type === 'prerequisite' ? '#475569' : '#334155'}
                                    strokeWidth={edge.type === 'prerequisite' ? 2 : 1}
                                    strokeDasharray={edge.type === 'related' ? '5 5' : 'none'}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            );
                        })}

                        {/* Connector dots for visual polish */}
                        {edges.map((edge, i) => {
                            const target = nodes.find(n => n.id === edge.target)!;
                            return (
                                <circle key={`marker-${i}`} cx={target.x} cy={target.y} r="3" fill="#64748b" />
                            )
                        })}
                    </svg>

                    {/* Nodes (HTML for better interactivity) */}
                    {nodes.map((node) => (
                        <motion.button
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: Math.random() * 0.5 }}
                            onClick={() => setSelectedNode(node)}
                            className={`absolute w-32 -ml-16 -mt-8 flex flex-col items-center group pointer-events-auto`}
                            style={{ left: node.x, top: node.y }}
                        >
                            {/* Node Circle */}
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110
                     ${node.status === 'mastered' ? 'bg-white text-slate-900 border-4' : ''}
                     ${node.status === 'unlocked' ? 'bg-slate-800 border-2' : ''}
                     ${node.status === 'locked' ? 'bg-slate-900 border border-slate-700 opacity-60 grayscale' : ''}
                  `}
                                style={{ borderColor: node.status === 'locked' ? '#334155' : colors[node.group] }}
                            >
                                {node.status === 'mastered' && <CheckCircle className="w-6 h-6" />}
                                {node.status === 'unlocked' && <Circle className="w-6 h-6 text-white" fill={colors[node.group]} />}
                                {node.status === 'locked' && <Lock className="w-5 h-5 text-slate-500" />}
                            </div>

                            {/* Label */}
                            <span className={`mt-2 text-xs font-bold text-center px-2 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-700
                   ${node.status === 'mastered' ? 'text-white' : 'text-slate-400'}
                   ${selectedNode?.id === node.id ? 'border-yellow-500 text-yellow-400' : ''}
                `}>
                                {node.label}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            {/* Info Panel Overlay */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="absolute top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur border-l border-slate-700 p-6 z-30 shadow-2xl"
                    >
                        <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

                        <div className="flex items-center gap-2 mb-4">
                            <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[selectedNode.group] }}></span>
                            <span className="text-sm font-light text-slate-400 uppercase tracking-widest">{selectedNode.group}</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4">{selectedNode.label}</h2>
                        <p className="text-slate-300 leading-relaxed mb-6">{selectedNode.description}</p>

                        <div className="space-y-4">
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Status</h5>
                                <div className="flex items-center gap-2 text-white capitalize font-medium">
                                    {selectedNode.status === 'mastered' && <CheckCircle className="w-5 h-5 text-green-400" />}
                                    {selectedNode.status === 'unlocked' && <Circle className="w-5 h-5 text-blue-400" />}
                                    {selectedNode.status === 'locked' && <Lock className="w-5 h-5 text-slate-500" />}
                                    {selectedNode.status}
                                </div>
                            </div>

                            {selectedNode.status === 'unlocked' && (
                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                                    Start Learning <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
