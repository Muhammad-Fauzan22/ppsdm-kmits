"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Brain, Gamepad2, Mic, MessageCircle, FileText, PlayCircle,
    BookOpen, Network, Projector, Info, BarChart3,
    Table as TableIcon, Video, Dumbbell, Users, Layers, Award, Box
} from "lucide-react";

// Sub-components
import { MindMapViewer } from "./MindMapViewer";
import { SlideDeck } from "./SlideDeck";
import { ReportViewer } from "./ReportViewer";

export function ResourceViewer({ resource }: { resource: any }) {
    const content = resource?.derived_content || {};
    const indexMaster = content.index_master || {};
    const [activeCard, setActiveCard] = useState<number | null>(null);

    if (!resource) return <div className="p-8 text-center animate-pulse">Initializing BUKA BUKU Engine...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">

            {/* 1. HERO HEADER WITH TRIANGULATION METRICS */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl ring-1 ring-white/10">
                <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-44 bg-white/5 rounded-lg border border-white/20 flex items-center justify-center shrink-0 shadow-2xl backdrop-blur-md">
                        <BookOpen size={48} className="text-indigo-300" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex gap-2 mb-2">
                                <Badge className="bg-indigo-500 text-white border-0">{resource.category || "General"}</Badge>
                                {indexMaster.evidence_level && (
                                    <Badge variant="outline" className={`border-emerald-400 text-emerald-400 bg-emerald-400/10`}>
                                        Evidence Level: {indexMaster.evidence_level}
                                    </Badge>
                                )}
                                {indexMaster.immersive_learning?.vr_suitability_score && (
                                    <Badge variant="outline" className="border-purple-400 text-purple-400 bg-purple-400/10">
                                        VR Readiness: {indexMaster.immersive_learning.vr_suitability_score}/10
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                                {resource.title}
                            </h1>
                            <p className="text-lg text-indigo-200 mt-2 font-light">Karya {resource.author}</p>
                        </div>

                        {/* Immersive Analysis Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Confidence</div>
                                <div className="text-xl font-bold text-emerald-400">{indexMaster.confidence_score || "?"}/10</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Visuals</div>
                                <div className="text-xl font-bold text-blue-400">{content.learning_module?.immersive_candidates?.models_3d?.length || 0}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Simulations</div>
                                <div className="text-xl font-bold text-orange-400">{content.learning_module?.immersive_candidates?.simulations?.length || 0}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">AI Engine</div>
                                <div className="text-sm font-mono text-indigo-300 mt-1">7-LAYER</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <Button className="bg-indigo-600 hover:bg-indigo-500 border-none text-white font-semibold shadow-lg shadow-indigo-600/30">
                                <Layers size={18} className="mr-2" /> Start Immersive Mode
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 12-TABS NAVIGATION (Unified) */}
            <Tabs defaultValue="summary" className="w-full">
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                    <TabsList className="flex w-max bg-white/80 p-1.5 rounded-xl h-auto backdrop-blur-sm border border-slate-200 shadow-sm sticky top-0 z-20">
                        <TabsTrigger value="summary" className="tab-item"><FileText size={16} className="mr-2 text-slate-600" /> Ringkasan</TabsTrigger>
                        <TabsTrigger value="mindmap" className="tab-item"><Network size={16} className="mr-2 text-cyan-600" /> Mind Map</TabsTrigger>
                        <TabsTrigger value="flashcards" className="tab-item"><Brain size={16} className="mr-2 text-purple-600" /> Cards</TabsTrigger>
                        <TabsTrigger value="gamification" className="tab-item"><Award size={16} className="mr-2 text-yellow-600" /> Quests</TabsTrigger>
                        <TabsTrigger value="quiz" className="tab-item"><Gamepad2 size={16} className="mr-2 text-orange-600" /> Quiz</TabsTrigger>
                        <TabsTrigger value="infographic" className="tab-item"><BarChart3 size={16} className="mr-2 text-teal-600" /> Infografis</TabsTrigger>
                        <TabsTrigger value="presentation" className="tab-item"><Projector size={16} className="mr-2 text-pink-600" /> Slide</TabsTrigger>
                        <TabsTrigger value="report" className="tab-item"><FileText size={16} className="mr-2 text-blue-600" /> Laporan</TabsTrigger>
                        <TabsTrigger value="datatable" className="tab-item"><TableIcon size={16} className="mr-2 text-green-600" /> Data</TabsTrigger>
                        <TabsTrigger value="video" className="tab-item"><Video size={16} className="mr-2 text-red-600" /> Video</TabsTrigger>
                        <TabsTrigger value="audio" className="tab-item"><Mic size={16} className="mr-2 text-indigo-600" /> Audio</TabsTrigger>
                        <TabsTrigger value="simulation" className="tab-item"><Users size={16} className="mr-2 text-violet-600" /> Simulasi</TabsTrigger>
                    </TabsList>
                </div>

                {/* --- 1. SUMMARY --- */}
                <TabsContent value="summary" className="mt-6">
                    <Card className="p-8">
                        <h3 className="text-2xl font-bold mb-4 text-slate-800">Learning Module (Synthesized)</h3>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p className="text-lg leading-relaxed mb-6">{resource.description}</p>
                            <h4 className="font-bold text-slate-900 mb-3">Core Concepts (Validated)</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.learning_module?.core_concepts?.map((c: any, i: number) => (
                                    <li key={i} className="flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <span className="font-bold text-slate-800">{c.name}</span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(c.confidence || 5) * 10}%` }}></div>
                                            </div>
                                            <span className="text-xs text-slate-400">{c.confidence}/10</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </TabsContent>

                {/* --- 4. GAMIFICATION (NEW) --- */}
                <TabsContent value="gamification" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Badges */}
                        <Card className="p-6">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-yellow-600"><Award /> Badges Available</h3>
                            <div className="space-y-4">
                                {content.gamification?.badges?.map((b: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                        <div className="size-12 rounded-full bg-white border-2 border-yellow-200 flex items-center justify-center text-2xl">🏆</div>
                                        <div>
                                            <div className="font-bold text-slate-800">{b.name}</div>
                                            <div className="text-xs font-bold text-yellow-600">+{b.points} XP</div>
                                        </div>
                                    </div>
                                ))}
                                {!content.gamification?.badges && <div className="text-slate-400 italic">No badges generated.</div>}
                            </div>
                        </Card>

                        {/* Quests */}
                        <Card className="p-6">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-indigo-600"><Layers /> Quest Log</h3>
                            <div className="space-y-4">
                                {content.gamification?.quests?.map((q: any, i: number) => (
                                    <div key={i} className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <div className="font-bold text-indigo-900 mb-2">{q.name}</div>
                                        <ul className="space-y-1">
                                            {q.tasks?.map((t: string, j: number) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-indigo-700">
                                                    <div className="size-4 rounded border border-indigo-400"></div> {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* ... OTHER TABS (Similar to before but referencing new data structure) ... */}

                {/* --- 2. MIND MAP --- */}
                <TabsContent value="mindmap" className="mt-6">
                    <Card className="p-6"><MindMapViewer chartCode={resource.mind_map_data} /></Card>
                </TabsContent>
                {/* --- 3. FLASHCARDS --- */}
                <TabsContent value="flashcards" className="mt-6">
                    {/* Uses derived_content.microlearning if available, or fallback */}
                    <div className="p-8 text-center text-slate-500">Flashcards viewer... (Data: {content.microlearning?.length || 0} cards)</div>
                </TabsContent>
                {/* --- 5. QUIZ --- */}
                <TabsContent value="quiz" className="mt-6">
                    <div className="p-8 text-center text-slate-500">Quiz viewer... (Data: {content.gamification?.quiz?.length || 0} items)</div>
                </TabsContent>
                {/* --- 6. INFOGRAPHIC --- */}
                <TabsContent value="infographic" className="mt-6">
                    <div className="p-8 text-center text-slate-500">Infographic viewer...</div>
                </TabsContent>
                {/* --- 7. PRESENTATION --- */}
                <TabsContent value="presentation" className="mt-6">
                    {resource.slide_dock ? <SlideDeck slides={resource.slide_dock} /> : <div className="text-center">No slides</div>}
                </TabsContent>
                {/* --- 8. REPORTS --- */}
                <TabsContent value="report" className="mt-6">
                    <ReportViewer content={content.report_markdown} />
                </TabsContent>
                {/* --- 10. AUDIO --- */}
                <TabsContent value="audio" className="mt-6 bg-white p-6 rounded-lg">
                    <h3 className="font-bold mb-2">Podcast Script</h3>
                    <p className="whitespace-pre-wrap text-sm font-mono text-slate-600">{content.audio_scripts?.podcast_intro || resource.derived_content?.podcast_script}</p>
                </TabsContent>
                {/* --- 12. SIMULATION --- */}
                <TabsContent value="simulation" className="mt-6">
                    <Card className="p-8 bg-slate-900 text-white">
                        <h2 className="text-2xl font-bold">{content.simulation_scenario?.title || "Immersive Sim"}</h2>
                        <p>{content.simulation_scenario?.situation}</p>
                    </Card>
                </TabsContent>

            </Tabs>

            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .tab-item { padding: 0.75rem 1rem; font-weight: 500; border-radius: 0.5rem; transition: all 0.2s; }
        .tab-item[data-state='active'] { background: white; color: #4f46e5; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      `}</style>
        </div>
    );
}
