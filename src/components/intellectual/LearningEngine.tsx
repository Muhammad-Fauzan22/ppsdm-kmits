"use client";

import React, { useState } from 'react';
import { useKnowledgeStore } from '@/lib/stores/useKnowledgeStore';
import { BookOpen, Brain, TrendingUp, Plus, Tag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function LearningEngine() {
    const { notes, skills, addNote, updateSkillLevel } = useKnowledgeStore();
    const [activeTab, setActiveTab] = useState<'pkm' | 'skills'>('pkm');
    const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });

    const handleAddNote = () => {
        if (!newNote.title.trim()) return;
        addNote({
            title: newNote.title,
            content: newNote.content,
            tags: newNote.tags.split(',').map(t => t.trim()),
        });
        setNewNote({ title: '', content: '', tags: '' });
    };

    const skillData = skills.map(skill => ({
        subject: skill.name,
        A: skill.currentLevel,
        B: skill.targetLevel,
        fullMark: 5,
    }));

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-500" /> Lifelong Learning
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('pkm')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'pkm' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        PKM & Notes
                    </button>
                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'skills' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Skill Gap (Radar)
                    </button>
                </div>
            </div>

            {activeTab === 'pkm' ? (
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    {/* Note List */}
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[500px]">
                        {notes.length === 0 && <div className="text-center text-gray-400 py-10">No notes yet. Start capturing thoughts!</div>}
                        {notes.map(note => (
                            <div key={note.id} className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800">{note.title}</h3>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-white px-2 py-1 rounded-full border">
                                        <Clock className="w-3 h-3" /> {new Date(note.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{note.content}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {note.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Tag className="w-2 h-2" /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Note Form */}
                    <div className="w-full md:w-1/3 bg-blue-50 p-5 rounded-2xl h-fit">
                        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Quick Capture
                        </h3>
                        <div className="space-y-3">
                            <input
                                className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Title..."
                                value={newNote.title}
                                onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                            />
                            <textarea
                                className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                                placeholder="What did you learn today?"
                                value={newNote.content}
                                onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                            />
                            <input
                                className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Tags (comma separated)..."
                                value={newNote.tags}
                                onChange={e => setNewNote({ ...newNote, tags: e.target.value })}
                            />
                            <button
                                onClick={handleAddNote}
                                className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                <Radar name="Current Level" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name="Target Level" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map(skill => (
                            <div key={skill.id} className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm">{skill.name}</h4>
                                    <p className="text-xs text-gray-500">{skill.category}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-400">Current</span>
                                        <input
                                            type="number"
                                            min="1" max="5"
                                            value={skill.currentLevel}
                                            onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value), skill.targetLevel)}
                                            className="w-12 text-center text-sm border rounded p-1"
                                        />
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-gray-300" />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-400">Target</span>
                                        <div className="text-sm font-bold text-gray-00 w-12 text-center p-1">{skill.targetLevel}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
