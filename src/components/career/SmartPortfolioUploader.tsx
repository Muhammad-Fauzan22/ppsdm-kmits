'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Loader2, CheckCircle, FileText, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AnalysisResult {
    category: 'certificate' | 'project' | 'other';
    title: string;
    description: string;
    issuer_or_tech?: string;
    skills?: string[];
}

export const SmartPortfolioUploader = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1]; // Remove data:image/png;base64 prefix
            setImage(base64String);
            analyzeImage(base64Data);
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = async (base64Data: string) => {
        setIsAnalyzing(true);
        setResult(null);

        try {
            const response = await fetch('/api/ai/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data }),
            });
            const data = await response.json();

            if (data.success) {
                setResult(data.data);
            } else {
                alert('Analysis failed: ' + data.error);
            }
        } catch (error) {
            alert('Failed to connect to AI service');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setImage(null);
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Upload Section */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <Camera className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Smart Portfolio Scanner</h3>
                            <p className="text-slate-400 text-sm">Upload a certificate or project screenshot. AI will fill the details.</p>
                        </div>
                    </div>

                    {!image ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all group"
                        >
                            <Upload className="w-12 h-12 text-slate-600 group-hover:text-indigo-400 mb-4 transition-colors" />
                            <p className="text-slate-400 font-medium group-hover:text-white">Click to upload or drag & drop</p>
                            <p className="text-xs text-slate-600 mt-2">Supports JPG, PNG (Max 5MB)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
                            <img src={image} alt="Preview" className="w-full h-64 object-cover opacity-80" />
                            <button
                                onClick={handleReset}
                                className="absolute top-2 right-2 bg-slate-900/80 text-white p-2 rounded-full hover:bg-red-500/80 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
                                    <p className="text-white font-medium animate-pulse">Analyzing visual data...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Form/Result Section */}
                <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 flex flex-col justify-center">
                    {!result && !isAnalyzing && (
                        <div className="text-center text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Upload an image to see the magic ✨</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                            <div className="h-20 bg-slate-700 rounded w-full"></div>
                        </div>
                    )}

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">
                                    {result.category} Detected
                                </span>
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Title</label>
                                <input
                                    type="text"
                                    defaultValue={result.title}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none mt-1 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold">
                                        {result.category === 'project' ? 'Tech Stack' : 'Issuer'}
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={result.issuer_or_tech}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold">Skills</label>
                                    <input
                                        type="text"
                                        defaultValue={result.skills?.join(', ')}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Description</label>
                                <textarea
                                    defaultValue={result.description}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none mt-1 h-24 resize-none"
                                ></textarea>
                            </div>

                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                                Confirm & Save to Portfolio
                            </Button>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
};
