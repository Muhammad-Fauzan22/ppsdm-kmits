"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Users,
    CheckCircle,
    Star,
    MessageCircle,
    ArrowLeft,
    Search
} from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/Animations";

interface Mentor {
    id: string;
    name: string;
    role: string;
    department: string;
    avatar: string;
    expertise: string[];
    rating: number;
    mentees: number;
    available: boolean;
    bio: string;
}

const mockMentors: Mentor[] = [
    { id: '1', name: 'Dr. Ahmad Fauzan', role: 'Dosen Senior', department: 'Teknik Mesin', avatar: '👨‍🏫', expertise: ['Career', 'Research', 'Academic'], rating: 4.9, mentees: 12, available: true, bio: 'Ahli dalam bidang thermal engineering dengan pengalaman 15 tahun di industri dan akademik.' },
    { id: '2', name: 'Siti Nurhaliza, S.T., M.T.', role: 'Praktisi Industri', department: 'Alumni 2018', avatar: '👩‍💼', expertise: ['Career', 'Interview', 'Networking'], rating: 4.8, mentees: 8, available: true, bio: 'Engineer di perusahaan multinasional, mentor untuk persiapan karir dan interview.' },
    { id: '3', name: 'Prof. Budi Santoso', role: 'Guru Besar', department: 'Teknik Elektro', avatar: '👨‍🔬', expertise: ['Research', 'Publication', 'Academic'], rating: 4.7, mentees: 5, available: false, bio: 'Profesor dengan 50+ publikasi internasional, mentoring untuk riset dan publikasi.' },
    { id: '4', name: 'Dewi Lestari, M.Psi.', role: 'Psikolog Kampus', department: 'Counseling Center', avatar: '👩‍⚕️', expertise: ['Emotional', 'Mental Health', 'Stress'], rating: 5.0, mentees: 20, available: true, bio: 'Psikolog klinis yang membantu mahasiswa mengelola stress dan kesehatan mental.' },
    { id: '5', name: 'Rizky Pratama', role: 'Mahasiswa Senior', department: 'Teknik Mesin 2021', avatar: '👨‍🎓', expertise: ['Student Life', 'Organization', 'Study Tips'], rating: 4.6, mentees: 15, available: true, bio: 'Juara mahasiswa berprestasi, aktif di BEM dan organisasi kemahasiswaan.' },
];

export default function MentorshipPage() {
    const [filter, setFilter] = useState('all');
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [requestMessage, setRequestMessage] = useState('');

    const filteredMentors = filter === 'all'
        ? mockMentors
        : mockMentors.filter(m => m.expertise.some(e => e.toLowerCase() === filter));

    const sendRequest = () => {
        if (!selectedMentor) return;
        alert(`Request sent to ${selectedMentor.name}!`);
        setSelectedMentor(null);
        setRequestMessage('');
    };

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Mentorship Program</h1>
                            <p className="text-purple-100 mt-2 text-lg">Connect with experienced mentors to accelerate your growth.</p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-transparent gap-2">
                                <ArrowLeft className="size-4" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/10">
                            <div className="text-3xl font-bold">{mockMentors.length}</div>
                            <div className="text-sm text-purple-100 font-medium">Mentors</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/10">
                            <div className="text-3xl font-bold">{mockMentors.filter(m => m.available).length}</div>
                            <div className="text-sm text-purple-100 font-medium">Available</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/10">
                            <div className="text-3xl font-bold">4.8</div>
                            <div className="text-sm text-purple-100 font-medium">Avg Rating</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {['all', 'career', 'research', 'academic', 'emotional', 'student life'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filter === f
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-white dark:bg-card text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                                    }`}
                            >
                                {f === 'all' ? 'All Roles' : f}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Find mentor..."
                            className="w-full pl-9 pr-4 py-1.5 rounded-full border bg-white dark:bg-card text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                    </div>
                </div>

                {/* Mentors Grid */}
                <StaggerContainer className="grid md:grid-cols-2 gap-5">
                    {filteredMentors.map((mentor) => (
                        <StaggerItem key={mentor.id}>
                            <Card className="h-full hover:shadow-lg transition-shadow border-muted">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-5">
                                        <div className="size-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                                            {mentor.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-foreground">{mentor.name}</h3>
                                                {mentor.available && (
                                                    <CheckCircle className="size-4 text-green-500 fill-current" />
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{mentor.role}</p>
                                            <p className="text-xs text-muted-foreground">{mentor.department}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground mt-4 line-clamp-2 leading-relaxed">{mentor.bio}</p>

                                    {/* Expertise Tags */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {mentor.expertise.map(exp => (
                                            <Badge key={exp} variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-none font-normal">
                                                {exp}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                                <Star className="size-4 fill-current" />
                                                {mentor.rating}
                                            </div>
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Users className="size-4" />
                                                {mentor.mentees} mentees
                                            </span>
                                        </div>

                                        <Button
                                            size="sm"
                                            onClick={() => setSelectedMentor(mentor)}
                                            disabled={!mentor.available}
                                            className={mentor.available ? "bg-purple-600 hover:bg-purple-700" : ""}
                                            variant={mentor.available ? "default" : "secondary"}
                                        >
                                            {mentor.available ? 'Request Mentorship' : 'Fully Booked'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>

            {/* Request Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            <div className="p-6 border-b">
                                <div className="flex items-center gap-4">
                                    <div className="size-16 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-4xl">
                                        {selectedMentor.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">{selectedMentor.name}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedMentor.role}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Personal Message
                                    </label>
                                    <Textarea
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        placeholder="Explain why you are interested in this mentorship..."
                                        className="resize-none min-h-[120px]"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Share your goals and what you hope to achieve.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 pt-0 flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedMentor(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                                    onClick={sendRequest}
                                >
                                    Send Request
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
