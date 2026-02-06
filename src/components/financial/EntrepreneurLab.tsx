"use client";

import React, { useState } from 'react';
import { useFinancialStore } from '@/lib/stores/useFinancialStore';
import { Briefcase, LayoutGrid, Presentation, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

const BMC_BLOCKS = [
    { id: 'partners', title: 'Key Partners', col: 'col-span-2', icon: '🤝' },
    { id: 'activities', title: 'Key Activities', col: 'col-span-2', icon: '✅' },
    { id: 'propositions', title: 'Value Propositions', col: 'col-span-2', icon: '🎁' },
    { id: 'relationships', title: 'Customer Relationships', col: 'col-span-2', icon: '❤️' },
    { id: 'segments', title: 'Customer Segments', col: 'col-span-2', icon: '👥' },
    { id: 'resources', title: 'Key Resources', col: 'col-span-5', icon: '🧱' }, // Special placement
    { id: 'channels', title: 'Channels', col: 'col-span-5', icon: '🚚' }, // Special placement
    { id: 'cost', title: 'Cost Structure', col: 'col-span-5', icon: '💸' },
    { id: 'revenue', title: 'Revenue Streams', col: 'col-span-5', icon: '💰' },
];

export default function EntrepreneurLab() {
    const { canvas, updateCanvas } = useFinancialStore();
    const [activeTab, setActiveTab] = useState<'bmc' | 'pitch'>('bmc');
    const [newItem, setNewItem] = useState('');
    const [activeBlock, setActiveBlock] = useState<string | null>(null);

    // Pitch Deck State (Local only for now, could be in store)
    const [slides, setSlides] = useState([
        { id: 1, title: 'Problem', content: 'What pain point are you solving?' },
        { id: 2, title: 'Solution', content: 'How does your product fix it?' },
        { id: 3, title: 'Market', content: 'Who needs this and how big is the market?' },
    ]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleAddItem = (blockId: string) => {
        if (!newItem.trim()) return;
        const currentItems = canvas[blockId] || [];
        updateCanvas(blockId, [...currentItems, newItem]);
        setNewItem('');
        setActiveBlock(null);
    };

    const removeItem = (blockId: string, index: number) => {
        const currentItems = canvas[blockId] || [];
        const newItems = [...currentItems];
        newItems.splice(index, 1);
        updateCanvas(blockId, newItems);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[700px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-orange-500" />
                    Entrepreneurship Lab
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('bmc')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'bmc' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Business Model Canvas
                    </button>
                    <button
                        onClick={() => setActiveTab('pitch')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'pitch' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Pitch Deck
                    </button>
                </div>
            </div>

            {activeTab === 'bmc' ? (
                <div className="flex-1 grid grid-cols-10 gap-4 overflow-y-auto p-1 text-sm bg-gray-50 rounded-xl border">
                    {/* 
                    BMC Layout Simplified Grid:
                    Row 1: Partners(2) | Activities(2) | Value Prop(2) | Relationships(2) | Segments(2)
                    Row 2:            | Resources(2)  |               | Channels(2)      |
                    Row 3: Cost(5)                   | Revenue(5)
                 */}

                    {/* Standard Blocks mapping logic is tricky for CSS grid, using specific logic below */}

                    {/* Left Column Container */}
                    <div className="col-span-2 grid grid-rows-2 gap-4">
                        <Block id="partners" title="Key Partners" icon="🤝" canvas={canvas} onAdd={() => setActiveBlock("partners")} onRemove={removeItem} />
                    </div>

                    {/* Middle-Left Container */}
                    <div className="col-span-2 grid grid-rows-2 gap-4">
                        <Block id="activities" title="Key Activities" icon="✅" canvas={canvas} onAdd={() => setActiveBlock("activities")} onRemove={removeItem} />
                        <Block id="resources" title="Key Resources" icon="🧱" canvas={canvas} onAdd={() => setActiveBlock("resources")} onRemove={removeItem} />
                    </div>

                    {/* Center Container */}
                    <div className="col-span-2">
                        <Block id="propositions" title="Value Propositions" icon="🎁" canvas={canvas} onAdd={() => setActiveBlock("propositions")} onRemove={removeItem} className="h-full" />
                    </div>

                    {/* Middle-Right Container */}
                    <div className="col-span-2 grid grid-rows-2 gap-4">
                        <Block id="relationships" title="Relationships" icon="❤️" canvas={canvas} onAdd={() => setActiveBlock("relationships")} onRemove={removeItem} />
                        <Block id="channels" title="Channels" icon="🚚" canvas={canvas} onAdd={() => setActiveBlock("channels")} onRemove={removeItem} />
                    </div>

                    {/* Right Column Container */}
                    <div className="col-span-2 grid grid-rows-2 gap-4">
                        <Block id="segments" title="Segments" icon="👥" canvas={canvas} onAdd={() => setActiveBlock("segments")} onRemove={removeItem} className="row-span-2 h-full" />
                    </div>

                    {/* Bottom Row */}
                    <div className="col-span-5">
                        <Block id="cost" title="Cost Structure" icon="💸" canvas={canvas} onAdd={() => setActiveBlock("cost")} onRemove={removeItem} />
                    </div>
                    <div className="col-span-5">
                        <Block id="revenue" title="Revenue Streams" icon="💰" canvas={canvas} onAdd={() => setActiveBlock("revenue")} onRemove={removeItem} />
                    </div>

                    {/* Add Item Modal/Popover */}
                    {activeBlock && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
                                <h3 className="font-bold mb-4">Add to {activeBlock}</h3>
                                <input
                                    autoFocus
                                    className="w-full border p-2 rounded mb-4 highlight-none outline-none focus:ring-2 focus:ring-orange-500"
                                    value={newItem}
                                    onChange={e => setNewItem(e.target.value)}
                                    placeholder="Type item here..."
                                    onKeyDown={e => e.key === 'Enter' && handleAddItem(activeBlock)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setActiveBlock(null)} className="px-4 py-2 text-gray-500">Cancel</button>
                                    <button onClick={() => handleAddItem(activeBlock)} className="px-4 py-2 bg-orange-500 text-white rounded font-bold">Add</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col h-full items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} className="p-2 bg-white rounded shadow text-gray-600 hover:text-orange-500 disabled:opacity-50" disabled={currentSlide === 0}>Prev</button>
                        <span className="p-2 font-bold text-gray-500">{currentSlide + 1} / {slides.length}</span>
                        <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} className="p-2 bg-white rounded shadow text-gray-600 hover:text-orange-500 disabled:opacity-50" disabled={currentSlide === slides.length - 1}>Next</button>
                    </div>

                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-4/5 aspect-video shadow-xl rounded-xl p-12 flex flex-col"
                    >
                        <input
                            className="text-4xl font-bold mb-8 outline-none placeholder-gray-300"
                            value={slides[currentSlide].title}
                            onChange={e => {
                                const newSlides = [...slides];
                                newSlides[currentSlide].title = e.target.value;
                                setSlides(newSlides);
                            }}
                        />
                        <textarea
                            className="flex-1 text-xl text-gray-600 outline-none resize-none placeholder-gray-300 leading-relaxed"
                            value={slides[currentSlide].content}
                            onChange={e => {
                                const newSlides = [...slides];
                                newSlides[currentSlide].content = e.target.value;
                                setSlides(newSlides);
                            }}
                        />
                    </motion.div>

                    <div className="mt-8 text-sm text-gray-400">
                        Use this tool to capture your core pitch narrative. Export to PDF coming soon.
                    </div>
                </div>
            )}
        </div>
    );
}

function Block({ id, title, icon, canvas, onAdd, onRemove, className = '' }: any) {
    return (
        <div className={`bg-white border p-3 rounded-lg flex flex-col hover:shadow-lg transition group ${className}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-xs text-gray-500 uppercase flex items-center gap-1">{icon} {title}</div>
                <button onClick={onAdd} className="text-gray-300 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
                {(canvas[id] || []).map((item: string, i: number) => (
                    <div key={i} className="text-xs bg-orange-50 p-1.5 rounded border border-orange-100 flex justify-between group/item">
                        <span>{item}</span>
                        <button onClick={() => onRemove(id, i)} className="text-orange-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><X className="w-3 h-3" /></button>
                    </div>
                ))}
                {(canvas[id] || []).length === 0 && <div className="text-[10px] text-gray-300 italic p-1">Empty</div>}
            </div>
        </div>
    );
}
