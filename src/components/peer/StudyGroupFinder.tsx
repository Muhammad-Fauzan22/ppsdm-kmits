'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, BookOpen, MessageCircle, Clock } from 'lucide-react';
import { PeerMatchingEngine, MOCK_STUDENTS, StudentProfile, MatchResult } from '@/lib/peer_learning/matching';

export const StudyGroupFinder = () => {
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [currentUser] = useState<StudentProfile>(MOCK_STUDENTS[0]); // Budi as default user

    useEffect(() => {
        // Simulate finding matches
        const results = PeerMatchingEngine.findMatches(currentUser, MOCK_STUDENTS);
        setMatches(results);
    }, [currentUser]);

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-400" />
                        Peer Learning Match
                    </h3>
                    <p className="text-slate-400 text-sm">Find study partners with complementary skills</p>
                </div>
                <div className="bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/20">
                    Based on your skills: {Object.keys(currentUser.skills).join(', ')}
                </div>
            </div>

            <div className="p-6 grid gap-4">
                {matches.map((match) => (
                    <motion.div
                        key={match.student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
                    >
                        {/* Avatar Placeholder */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0">
                            {match.student.name.charAt(0)}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-white text-lg">{match.student.name}</h4>
                                    <p className="text-slate-400 text-sm">{match.student.major}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-2xl font-bold text-emerald-400">{match.compatibilityScore}%</span>
                                    <span className="text-xs text-slate-500">Match</span>
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {match.matchReasons.map((reason, idx) => (
                                    <span key={idx} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-md border border-slate-600 flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500" /> {reason}
                                    </span>
                                ))}
                                {match.student.availability.map((avail, idx) => (
                                    <span key={`avail-${idx}`} className="bg-slate-700/50 text-slate-400 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {avail}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button className="w-full md:w-auto mt-2 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
                            <MessageCircle className="w-4 h-4" /> Connect
                        </button>
                    </motion.div>
                ))}

                {matches.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        No compatible peers found yet. Check back later!
                    </div>
                )}
            </div>
        </div>
    );
};
