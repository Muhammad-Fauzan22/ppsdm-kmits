"use client";

import React, { useState } from 'react';
import BlueprintNode, { NodeType } from './BlueprintNode';
import DetailModal from './DetailModal';

// Detail Content
const PostgresDetail = () => (
    <div className="space-y-4">
        <h3 className="text-cyan-400 font-bold">Relational Core</h3>
        <p className="text-sm text-slate-300">Handles structured data requiring ACID compliance:</p>
        <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1">
            <li>User Profiles & Auth</li>
            <li>Academic Records (GPA)</li>
            <li>Project Portfolios</li>
        </ul>
    </div>
);

const TimescaleDetail = () => (
    <div className="space-y-4">
        <h3 className="text-purple-400 font-bold">Time-Series Engine</h3>
        <p className="text-sm text-slate-300">Optimized for high-frequency behavioral logs:</p>
        <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1">
            <li>Daily Mood Checks</li>
            <li>Habit Streaks</li>
            <li>Sleep/Exercise Metrics</li>
        </ul>
    </div>
);

const RedisDetail = () => (
    <div className="space-y-4">
        <h3 className="text-red-400 font-bold">In-Memory Cache</h3>
        <p className="text-sm text-slate-300">Low-latency data access:</p>
        <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1">
            <li>Session Management</li>
            <li>Real-time Leaderboards</li>
            <li>Pub/Sub Notifications</li>
        </ul>
    </div>
);

const MicroservicesDetail = () => (
    <div className="space-y-4">
        <h3 className="text-emerald-400 font-bold">Domain Services</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
            <div className="p-2 bg-slate-800 rounded">Identity Svc</div>
            <div className="p-2 bg-slate-800 rounded">Assessment Svc</div>
            <div className="p-2 bg-slate-800 rounded">Growth Svc</div>
            <div className="p-2 bg-slate-800 rounded">Stewardship Svc</div>
        </div>
    </div>
);

// Node Layout
const NODE_LAYOUT = [
    // Data Layer (Bottom)
    { id: 'postgres', label: 'PostgreSQL', subLabel: 'User & Academic Data', type: 'storage', x: 200, y: 500, detailTitle: 'Primary Database', DetailComp: PostgresDetail },
    { id: 'timescale', label: 'TimescaleDB', subLabel: 'Behavioral Logs', type: 'storage', x: 500, y: 500, detailTitle: 'Time-Series DB', DetailComp: TimescaleDetail },
    { id: 'redis', label: 'Redis', subLabel: 'Cache & Real-time', type: 'storage', x: 800, y: 500, detailTitle: 'Caching Layer', DetailComp: RedisDetail },

    // Application Layer (Middle)
    { id: 'gateway', label: 'API Gateway', subLabel: 'GraphQL / REST', type: 'process', x: 500, y: 300, detailTitle: 'API Gateway', DetailComp: () => <div>Routes requests to microservices</div> },
    { id: 'services', label: 'Microservices', subLabel: '9 Domain Domains', type: 'process', x: 500, y: 400, detailTitle: 'Service Mesh', DetailComp: MicroservicesDetail },
    { id: 'kafka', label: 'Apache Kafka', subLabel: 'Event Bus', type: 'feedback', x: 200, y: 400, detailTitle: 'Event Streaming', DetailComp: () => <div>Async communication between services</div> },

    // Frontend Layer (Top)
    { id: 'pwa', label: 'Next.js PWA', subLabel: 'Mobile & Offline', type: 'output', x: 500, y: 100, detailTitle: 'Frontend Client', DetailComp: () => <div>React 18 + PWA + WebGL</div> },
] as const;

// Connections
const CONNECTIONS = [
    { from: 'pwa', to: 'gateway' },
    { from: 'gateway', to: 'services' },
    { from: 'services', to: 'postgres' },
    { from: 'services', to: 'timescale' },
    { from: 'services', to: 'redis' },
    { from: 'services', to: 'kafka' },
    { from: 'kafka', to: 'services' }, // Event loop
];

export default function BlueprintCanvas() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const activeNode = activeModal ? NODE_LAYOUT.find(n => n.id === activeModal) : null;

    return (
        <div className="relative w-full h-full bg-slate-950 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* SVG Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                    <marker id="head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                </defs>
                {CONNECTIONS.map((conn, i) => {
                    const fromNode = NODE_LAYOUT.find(n => n.id === conn.from)!;
                    const toNode = NODE_LAYOUT.find(n => n.id === conn.to)!;

                    const startX = fromNode.x + 96; // Center (approx w/2)
                    const startY = fromNode.y + 40;
                    const endX = toNode.x + 96;
                    const endY = toNode.y + 40;

                    let pathD = `M ${startX} ${startY} L ${endX} ${endY}`;

                    // Simple stepped path for clearer circuit-board look
                    if (conn.from === 'kafka') {
                        pathD = `M ${startX} ${startY} C ${startX - 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`;
                    }

                    return (
                        <g key={i}>
                            <path d={pathD} stroke="#334155" strokeWidth="2" fill="none" markerEnd="url(#head)" />
                            <circle r="3" fill="#06b6d4">
                                <animateMotion dur="2s" repeatCount="indefinite" path={pathD} keyPoints="0;1" keyTimes="0;1" />
                            </circle>
                        </g>
                    );
                })}
            </svg>

            {/* Nodes Layer */}
            <div className="relative w-full h-full z-10">
                {NODE_LAYOUT.map((node, i) => (
                    <BlueprintNode
                        key={node.id}
                        {...node}
                        type={node.type as NodeType}
                        delay={i * 0.1}
                        onClick={() => setActiveModal(node.id)}
                    />
                ))}
            </div>

            {/* Detail Modal */}
            <DetailModal
                isOpen={!!activeModal}
                onClose={() => setActiveModal(null)}
                title={activeNode?.detailTitle || ''}
                subtitle="Architecture Specification"
            >
                {activeNode && activeNode.DetailComp ? <activeNode.DetailComp /> : null}
            </DetailModal>
        </div>
    );
}
