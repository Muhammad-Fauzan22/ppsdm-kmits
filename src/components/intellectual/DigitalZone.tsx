"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Code, Database, Search, ExternalLink, Play, RotateCcw, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { INITIAL_RESOURCES, LearningResource } from '@/lib/data/learningResources';

export default function DigitalZone() {
    const [activeTab, setActiveTab] = useState<'sandbox' | 'resources'>('sandbox');

    // Sandbox State
    const [htmlCode, setHtmlCode] = useState('<div class="hello">Hello World!</div>');
    const [cssCode, setCssCode] = useState('.hello { color: blue; font-size: 24px; font-weight: bold; text-align: center; margin-top: 20%; }');
    const [jsCode, setJsCode] = useState('console.log("Welcome to the Digital Zone!");');
    const [outputSrc, setOutputSrc] = useState('');

    // Resources State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [resources] = useState<LearningResource[]>(INITIAL_RESOURCES);

    const runCode = () => {
        const src = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
        setOutputSrc(src);
    };

    useEffect(() => {
        runCode();
    }, []); // Run once on mount

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[700px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Monitor className="w-6 h-6 text-purple-500" /> Digital Literacy
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('sandbox')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'sandbox' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Code Sandbox
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'resources' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Resource Library
                    </button>
                </div>
            </div>

            {activeTab === 'sandbox' ? (
                <div className="flex flex-col h-full gap-4">
                    <div className="grid grid-cols-3 gap-2 h-1/2">
                        <div className="flex flex-col">
                            <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Code className="w-3 h-3" /> HTML</div>
                            <textarea
                                className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                                value={htmlCode}
                                onChange={(e) => setHtmlCode(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Code className="w-3 h-3" /> CSS</div>
                            <textarea
                                className="flex-1 bg-gray-900 text-blue-300 font-mono text-sm p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                                value={cssCode}
                                onChange={(e) => setCssCode(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Terminal className="w-3 h-3" /> JS</div>
                            <textarea
                                className="flex-1 bg-gray-900 text-yellow-300 font-mono text-sm p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                                value={jsCode}
                                onChange={(e) => setJsCode(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Live Preview</span>
                        <button
                            onClick={runCode}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition"
                        >
                            <Play className="w-4 h-4" /> Run Code
                        </button>
                    </div>

                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden relative">
                        <iframe
                            title="preview"
                            srcDoc={outputSrc}
                            className="w-full h-full"
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full gap-4">
                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="Search resources, topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border rounded-xl text-sm outline-none bg-white"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar content-start">
                        {filteredResources.map(res => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={res.id}
                                className="border border-gray-100 p-4 rounded-xl hover:shadow-md transition bg-white flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                                ${res.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                res.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {res.difficulty}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{res.type}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1">{res.title}</h3>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{res.description}</p>
                                </div>
                                <div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {res.tags.map(tag => (
                                            <span key={tag} className="text-[9px] bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline"
                                    >
                                        Access Resource <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                        {filteredResources.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-400">
                                No resources found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
