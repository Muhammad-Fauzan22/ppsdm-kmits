
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, ArrowRight, Brain, Heart, Target, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types matching the API
interface IDPFormData {
    userId: string;
    visionStatement: string;
    coreValues: string; // Comma separated for input
    passions: string;   // Comma separated
    strengths: string;  // Comma separated
}

export default function IDPBuilderPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<IDPFormData>({
        userId: 'user-curr-session', // In real app, get from auth context
        visionStatement: '',
        coreValues: '',
        passions: '',
        strengths: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                coreValues: formData.coreValues.split(',').map(s => s.trim()),
                passions: formData.passions.split(',').map(s => s.trim()),
                strengths: formData.strengths.split(',').map(s => s.trim()),
            };

            const res = await fetch('/api/idp/holistic-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Generation failed');

            const result = await res.json();
            // In a real app, redirect to the generated IDP details page
            // router.push(`/idp/${result.data.id}`);
            alert('Holistic IDP Generated Successfully! (Mock Redirect)');
            console.log(result);
        } catch (error) {
            console.error(error);
            alert('Failed to generate IDP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-6 min-h-screen bg-slate-50">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Holistic IDP Builder
                </h1>
                <p className="text-slate-600 mt-2">Design your 12-dimensional life roadmap</p>
            </header>

            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                {s}
                            </div>
                            {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/90 backdrop-blur">
                <CardContent className="p-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <Heart className="w-6 h-6 text-pink-500" />
                                <h2 className="text-xl font-semibold">Core Identity & Purpose</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Core Values (comma separated)</Label>
                                    <Input
                                        name="coreValues"
                                        placeholder="e.g. Integrity, Innovation, Compassion"
                                        value={formData.coreValues}
                                        onChange={handleInputChange}
                                    />
                                    <p className="text-xs text-slate-500">The fundamental beliefs that drive your decisions.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Passions (comma separated)</Label>
                                    <Input
                                        name="passions"
                                        placeholder="e.g. Technology, Education, Nature"
                                        value={formData.passions}
                                        onChange={handleInputChange}
                                    />
                                    <p className="text-xs text-slate-500">What brings you joy and energy?</p>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleNext}>Next: Potential <ArrowRight className="ml-2 w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                                <h2 className="text-xl font-semibold">Potential Mapping</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Innate Strengths & Genius Zones</Label>
                                    <Input
                                        name="strengths"
                                        placeholder="e.g. Strategic Thinking, Empathy, Coding"
                                        value={formData.strengths}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={handleBack}>Back</Button>
                                <Button onClick={handleNext}>Next: Vision <ArrowRight className="ml-2 w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-6 h-6 text-emerald-500" />
                                <h2 className="text-xl font-semibold">Life Vision (80-Year Horizon)</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Vision Statement</Label>
                                    <Textarea
                                        name="visionStatement"
                                        className="h-32"
                                        placeholder="Describe your ultimate life vision. Who do you want to become? What legacy do you leave?"
                                        value={formData.visionStatement}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={handleBack}>Back</Button>
                                <Button onClick={handleNext}>Review <ArrowRight className="ml-2 w-4 h-4" /></Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <Brain className="w-6 h-6 text-indigo-500" />
                                <h2 className="text-xl font-semibold">Review & Generate</h2>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg space-y-3 text-sm">
                                <div><span className="font-semibold">Values:</span> {formData.coreValues}</div>
                                <div><span className="font-semibold">Passions:</span> {formData.passions}</div>
                                <div><span className="font-semibold">Strengths:</span> {formData.strengths}</div>
                                <div><span className="font-semibold">Vision:</span> {formData.visionStatement}</div>
                            </div>

                            <div className="flex flex-col items-center gap-4 pt-4">
                                <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" onClick={handleSubmit} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quantum IDP...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" /> Generate 12-Dimensional IDP
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-slate-400">
                                    Our Quantum AI will analyze your inputs against 12 dimensions of human development.
                                </p>
                            </div>
                            <div className="flex justify-start">
                                <Button variant="ghost" onClick={handleBack} disabled={loading}>Back</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
