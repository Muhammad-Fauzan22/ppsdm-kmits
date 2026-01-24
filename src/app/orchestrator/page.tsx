
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Brain, Globe, Layers, Network, Sparkles, User, Zap } from 'lucide-react';

export default function OrchestratorPage() {
    const [activeLayer, setActiveLayer] = useState<string>('cosmic');

    const layers = [
        { id: 'cosmic', name: 'Cosmic Layer', icon: Globe, desc: 'Global Resource Orchestration', color: 'text-indigo-500' },
        { id: 'galactic', name: 'Galactic Layer', icon: Brain, desc: 'Cognitive Architecture (AI Agents)', color: 'text-purple-500' },
        { id: 'planetary', name: 'Planetary Layer', icon: Sparkles, desc: 'Personalization Engine', color: 'text-pink-500' },
        { id: 'continental', name: 'Continental Layer', icon: Layers, desc: 'Domain Specialization', color: 'text-blue-500' },
        { id: 'national', name: 'National Layer', icon: Network, desc: 'Cultural Adaptation', color: 'text-red-500' },
        { id: 'institutional', name: 'Institutional Layer', icon: Zap, desc: 'Organizational Integration', color: 'text-yellow-500' },
        { id: 'individual', name: 'Individual Layer', icon: User, desc: 'Personal Interface', color: 'text-emerald-500' },
    ];

    return (
        <div className="container mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    System Orchestrator
                </h1>
                <p className="text-slate-600 mt-2">Holistic Learning & Development Platform Architecture</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Layer Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {layers.map((layer) => (
                        <button
                            key={layer.id}
                            onClick={() => setActiveLayer(layer.id)}
                            className={`w-full text-left p-4 rounded-xl transition-all border ${activeLayer === layer.id
                                    ? 'bg-white shadow-lg border-indigo-100 scale-105'
                                    : 'bg-white/50 hover:bg-white border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <layer.icon className={`w-6 h-6 ${layer.color}`} />
                                <div>
                                    <div className="font-semibold text-slate-800">{layer.name}</div>
                                    <div className="text-xs text-slate-500">{layer.desc}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <Card className="min-h-[600px] border-none shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                {layers.find(l => l.id === activeLayer)?.icon &&
                                    React.createElement(layers.find(l => l.id === activeLayer)!.icon, {
                                        className: `w-8 h-8 ${layers.find(l => l.id === activeLayer)?.color}`
                                    })
                                }
                                {layers.find(l => l.id === activeLayer)?.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LayerContent layerId={activeLayer} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function LayerContent({ layerId }: { layerId: string }) {
    switch (layerId) {
        case 'cosmic':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard title="Global Nodes" value="200M+" icon={Activity} />
                        <MetricCard title="Resources Crawled" value="50K/day" icon={Globe} />
                    </div>
                    <div className="p-4 bg-slate-100 rounded-lg">
                        <h3 className="font-semibold mb-2">Active Crawlers</h3>
                        <div className="flex gap-2 flex-wrap">
                            {['Coursera', 'EdX', 'LinkedIn', 'Local Repos'].map(src => (
                                <Badge key={src} variant="secondary">{src}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center text-slate-400">
                        [Knowledge Graph Visualization Placeholder]
                    </div>
                </div>
            );
        case 'galactic':
            return (
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Multi-Agent Swarm Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Diagnostician', 'Strategist', 'Curator', 'Pedagogue', 'Motivator', 'Resilience Coach'].map(agent => (
                            <div key={agent} className="p-4 border rounded-lg flex justify-between items-center">
                                <span>{agent}</span>
                                <Badge className="bg-green-100 text-green-700">Active</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'planetary':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quantum-Inspired Personalization</h3>
                    <div className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl text-white">
                        <div className="flex justify-between items-center mb-4">
                            <span>Entropy Level</span>
                            <span className="font-mono text-xl">0.04</span>
                        </div>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-400 h-full w-[75%] animate-pulse"></div>
                        </div>
                        <p className="mt-4 text-sm text-purple-200">Processing superposition of 1000+ learning paths...</p>
                    </div>
                </div>
            );
        // ... Add other layers as needed
        default:
            return <div className="text-slate-500">Visualization for {layerId} coming soon...</div>;
    }
}

function MetricCard({ title, value, icon: Icon }: any) {
    return (
        <Card>
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-sm text-slate-500">{title}</div>
                    <div className="text-2xl font-bold">{value}</div>
                </div>
            </CardContent>
        </Card>
    );
}
