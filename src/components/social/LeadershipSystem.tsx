"use client";

import React, { useState } from 'react';
import { useSocialStore } from '@/lib/stores/useSocialStore';
import { Target, Users, CheckSquare, Plus } from 'lucide-react';

const LEADERSHIP_STYLES = [
    { id: 'Visionary', desc: 'Mobilize people toward a vision.' },
    { id: 'Democratic', desc: 'Forging consensus through participation.' },
    { id: 'Coaching', desc: 'Developing people for the future.' },
    { id: 'Pacesetting', desc: 'Setting high standards for performance.' },
];

export default function LeadershipSystem() {
    const { leadershipStyle, projects, setLeadershipStyle, addLeadershipProject } = useSocialStore();
    const [newProject, setNewProject] = useState('');
    const [showQuiz, setShowQuiz] = useState(false);

    const handleAddProject = () => {
        if (!newProject) return;
        addLeadershipProject({
            name: newProject,
            role: 'Lead',
            status: 'active',
            date: new Date().toISOString()
        });
        setNewProject('');
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                Leadership Development
            </h2>

            <div className="flex flex-col md:flex-row gap-6 h-full">

                {/* Leadership Style */}
                <div className="w-full md:w-1/3">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 h-full flex flex-col">
                        <h3 className="font-bold text-gray-800 mb-2">My Leadership Style</h3>
                        {leadershipStyle ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <div className="text-4xl mb-4">🦁</div>
                                <div className="text-2xl font-black text-blue-800 mb-2">{leadershipStyle}</div>
                                <p className="text-sm text-blue-600">
                                    {LEADERSHIP_STYLES.find(s => s.id === leadershipStyle)?.desc}
                                </p>
                                <button onClick={() => setShowQuiz(true)} className="mt-6 text-xs text-gray-400 hover:text-blue-500 underline">Retake Assessment</button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                                <p className="text-gray-500 mb-4 text-sm">Discover your dominant leadership traits.</p>
                                <button
                                    onClick={() => setShowQuiz(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
                                >
                                    Start Assessment
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quiz Modal (Inline for simplicity) */}
                {showQuiz && (
                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                            <h3 className="font-bold text-lg mb-4">Select the phrase that resonates most:</h3>
                            <div className="space-y-3">
                                {LEADERSHIP_STYLES.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => {
                                            setLeadershipStyle(style.id);
                                            setShowQuiz(false);
                                        }}
                                        className="w-full text-left p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-500 transition"
                                    >
                                        <div className="font-bold text-gray-800">{style.id}</div>
                                        <div className="text-xs text-gray-500">{style.desc}</div>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowQuiz(false)} className="mt-4 w-full py-2 text-gray-400">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Project Manager */}
                <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" /> Organization Projects
                    </h3>

                    <div className="flex gap-2 mb-4">
                        <input
                            className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="New Project (e.g., Charity Concert)"
                            value={newProject}
                            onChange={(e) => setNewProject(e.target.value)}
                        />
                        <button
                            onClick={handleAddProject}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                        {projects.length === 0 && <div className="text-center text-gray-400 py-10">No active projects. Lead something!</div>}
                        {projects.map(proj => (
                            <div key={proj.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-800">{proj.name}</div>
                                    <div className="text-xs text-gray-500">Role: {proj.role} • {new Date(proj.date).toLocaleDateString()}</div>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                    {proj.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
