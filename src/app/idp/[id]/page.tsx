
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Brain, Heart, Zap, Globe, Star, Clock,
    TrendingUp, Users, Shield, Lightbulb,
    Activity, Anchor, Map, Calendar
} from 'lucide-react';
import { HolisticIDPStructure } from '@/lib/idp/HolisticIDPGenerator'; // Importing types if available, else infer

export default function HolisticIDPDashboard() {
    const params = useParams();
    const [idp, setIdp] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchIDP() {
            if (!params?.id) return;
            const { data, error } = await supabase
                .from('idps')
                .select('*')
                .eq('id', params.id)
                .single();

            if (!error && data) {
                setIdp(data);
            }
            setLoading(false);
        }
        fetchIDP();
    }, [params]);

    if (loading) return <div className="p-10 text-center">Loading Quantum IDP...</div>;
    if (!idp) return <div className="p-10 text-center">IDP Not Found</div>;

    // The 'goals' column holds our HolisticIDPStructure based on previous step
    const holisticData = idp.goals as HolisticIDPStructure;

    // Safe check if data structure matches
    if (!holisticData?.layer_1_core) return <div className="p-10 text-center">Invalid IDP Data Format</div>;

    const core = holisticData.layer_1_core;
    const development = holisticData.layer_3_development;
    const temporal = holisticData.layer_4_temporal;
    const resources = holisticData.layer_5_resource;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* HERDER: CORE IDENTITY */}
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full -z-10 opacity-50"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <Badge className="mb-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Holistic IDP v2.0</Badge>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Evolutionary Map</h1>
                            <p className="text-lg text-slate-600 max-w-2xl italic">"{core.personal_mission}"</p>
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                            <div className="text-sm text-slate-500">Ikigai Intersection</div>
                            <div className="font-semibold text-indigo-600 text-lg">{core.ikigai?.intersection}</div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                        {core.core_values?.map((val: string) => (
                            <Badge key={val} variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700">
                                {val}
                            </Badge>
                        ))}
                    </div>
                </header>

                <Tabs defaultValue="development" className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                        <TabsTrigger value="development" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                            <TrendingUp className="w-4 h-4 mr-2" /> 12-Dimensional Growth
                        </TabsTrigger>
                        <TabsTrigger value="temporal" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                            <Clock className="w-4 h-4 mr-2" /> Temporal Roadmap
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                            <Users className="w-4 h-4 mr-2" /> Resource Ecosystem
                        </TabsTrigger>
                    </TabsList>

                    {/* LAYER 3: DEVELOPMENT DOMAINS */}
                    <TabsContent value="development" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(development).map(([key, plan]: any) => (
                                <Card key={key} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-indigo-500">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-bold uppercase tracking-wide text-slate-700 flex items-center gap-2">
                                            {getDomainIcon(key)}
                                            {key.replace('_', ' ')}
                                        </CardTitle>
                                        <CardDescription className="text-xs">Target: {plan.target_level}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium text-slate-500">
                                                    <span>Proficiency</span>
                                                    <span>{plan.current_level}</span>
                                                </div>
                                                <Progress value={getMockProgress(plan.current_level)} className="h-1.5" />
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-md">
                                                <div className="text-xs font-semibold text-slate-700 mb-1">Focus Area</div>
                                                <div className="text-xs text-slate-600">{plan.subdimensions?.focus_area}</div>
                                            </div>
                                            <div className="space-y-1">
                                                {plan.milestones.map((m: any, i: number) => (
                                                    <div key={i} className="flex items-start gap-2 text-xs">
                                                        <CheckCircleIcon status="pending" />
                                                        <span className="text-slate-600 flex-1">{m.goal}</span>
                                                        <span className="text-slate-400">{m.year}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* LAYER 4: TEMPORAL ROADMAP */}
                    <TabsContent value="temporal">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Map className="w-5 h-5" /> Lifespan Evolution Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-4 relative">
                                    <TimelineItem period="Immediate (3-6 mo)" items={temporal.immediate} color="bg-emerald-500" />
                                    <TimelineItem period="Short Term (1-2 yr)" items={temporal.short_term} color="bg-blue-500" />
                                    <TimelineItem period="Medium Term (3-5 yr)" items={temporal.medium_term} color="bg-indigo-500" />
                                    <TimelineItem period="Long Term (5-10 yr)" items={temporal.long_term} color="bg-purple-500" />
                                    <TimelineItem period="Lifespan Vision" items={temporal.lifespan} color="bg-rose-500" isLast />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* LAYER 5: RESOURCES */}
                    <TabsContent value="resources">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ResourceCard title="Learning Resources" icon={Brain} items={resources.learning} />
                            <ResourceCard title="Human Network" icon={Users} items={resources.mentors} />
                            <ResourceCard title="Experiential" icon={Activity} items={resources.experiential} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function TimelineItem({ period, items, color, isLast }: any) {
    return (
        <div className="relative">
            <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full ${color} ring-4 ring-white`}></div>
            <div className={`mb-2 font-bold ${color.replace('bg-', 'text-')}`}>{period}</div>
            <ul className="space-y-2">
                {items?.map((item: string, i: number) => (
                    <li key={i} className="text-slate-600 text-sm bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-start gap-2">
                        <Star className="w-4 h-4 text-slate-300 mt-0.5" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ResourceCard({ title, icon: Icon, items }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="w-5 h-5 text-slate-500" /> {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {items?.map((item: string, i: number) => (
                        <li key={i} className="text-sm p-2 bg-slate-50 rounded text-slate-700 border border-slate-100">
                            {item}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

function CheckCircleIcon({ status }: { status: string }) {
    return (
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${status === 'completed' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'
            }`}>
            {status === 'completed' && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
        </div>
    );
}

function getDomainIcon(domain: string) {
    const map: any = {
        'cognitive_metacognitive': <Brain className="w-4 h-4" />,
        'emotional_spiritual': <Heart className="w-4 h-4" />,
        'physical_vital': <Activity className="w-4 h-4" />,
        'creative_innovative': <Lightbulb className="w-4 h-4" />,
        'social_relational': <Users className="w-4 h-4" />,
        'technical_professional': <Zap className="w-4 h-4" />,
        'leadership_influential': <Star className="w-4 h-4" />,
        'financial_economic': <TrendingUp className="w-4 h-4" />,
        'digital_technological': <Globe className="w-4 h-4" />,
        'cultural_contextual': <Map className="w-4 h-4" />,
        'ethical_existential': <Anchor className="w-4 h-4" />,
        'transformational_integrative': <Shield className="w-4 h-4" />,
    };
    return map[domain] || <Star className="w-4 h-4" />;
}

function getMockProgress(level: string) {
    switch (level.toLowerCase()) {
        case 'developing': return 35;
        case 'proficient': return 65;
        case 'mastery': return 90;
        default: return 20;
    }
}
