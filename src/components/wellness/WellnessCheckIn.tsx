'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';
import { EMERGENCY_RESOURCES } from '@/data/crisis_resources';

interface WellnessCheckInProps {
    isOpen: boolean;
    onClose: () => void;
    triggerSource?: 'risk_flag' | 'manual';
}

export const WellnessCheckIn: React.FC<WellnessCheckInProps> = ({ isOpen, onClose, triggerSource = 'manual' }) => {
    const [step, setStep] = useState<'check' | 'resources' | 'counseling' | 'calm'>('check');

    const handleSelection = (option: string) => {
        switch (option) {
            case 'crisis':
                setStep('resources');
                break;
            case 'struggling':
                setStep('counseling');
                break;
            case 'stressed':
                setStep('calm');
                break;
            default:
                onClose();
        }
    };

    const highPriorityResources = EMERGENCY_RESOURCES.filter(r => r.priority === 1);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
                            Wellness Check-In
                        </h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        {step === 'check' && (
                            <div className="space-y-6">
                                <p className="text-lg text-slate-300 text-center">
                                    {triggerSource === 'risk_flag'
                                        ? "We noticed some of your responses indicated you might be going through a tough time."
                                        : "How are you feeling right now?"}
                                </p>

                                <div className="grid gap-3">
                                    <button
                                        onClick={() => handleSelection('crisis')}
                                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-left transition-all group"
                                    >
                                        <div className="font-bold flex items-center gap-2 group-hover:text-red-300">
                                            <AlertCircle className="w-5 h-5" />
                                            I need help immediately
                                        </div>
                                        <div className="text-sm opacity-80 mt-1">I feel unsafe or in crisis</div>
                                    </button>

                                    <button
                                        onClick={() => handleSelection('struggling')}
                                        className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-left transition-all group"
                                    >
                                        <div className="font-bold group-hover:text-orange-300">I'm struggling</div>
                                        <div className="text-sm opacity-80 mt-1">I'm overwhelmed and need someone to talk to</div>
                                    </button>

                                    <button
                                        onClick={() => handleSelection('stressed')}
                                        className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-left transition-all group"
                                    >
                                        <div className="font-bold group-hover:text-blue-300">I'm just stressed</div>
                                        <div className="text-sm opacity-80 mt-1">Need tips to relax and focus</div>
                                    </button>

                                    <button
                                        onClick={() => onClose()}
                                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-left transition-all group"
                                    >
                                        <div className="font-bold group-hover:text-emerald-300">I'm okay</div>
                                        <div className="text-sm opacity-80 mt-1">Just browsing</div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'resources' && (
                            <div className="space-y-4">
                                <div className="text-center mb-6">
                                    <h4 className="text-xl font-bold text-white mb-2">Emergency Support</h4>
                                    <p className="text-slate-400">You are not alone. These services are available 24/7.</p>
                                </div>

                                {highPriorityResources.map(resource => (
                                    <div key={resource.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                        <h5 className="font-bold text-white mb-1">{resource.name}</h5>
                                        <p className="text-sm text-slate-400 mb-3">{resource.description}</p>
                                        <div className="flex gap-2">
                                            <a href={`tel:${resource.phone}`} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-center font-bold flex items-center justify-center gap-2">
                                                <Phone className="w-4 h-4" /> Call Now
                                            </a>
                                            {resource.location && (
                                                <a href={resource.locationLink || '#'} target="_blank" className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-center font-bold flex items-center justify-center gap-2">
                                                    <MapPin className="w-4 h-4" /> Map
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setStep('check')}
                                    className="w-full text-center text-slate-500 hover:text-white mt-4"
                                >
                                    Back
                                </button>
                            </div>
                        )}

                        {step === 'calm' && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <div className="w-12 h-12 bg-blue-500/40 rounded-full"></div>
                                </div>
                                <h4 className="text-xl font-bold text-white">Breathe In... Breathe Out...</h4>
                                <p className="text-slate-400">
                                    Take a moment to ground yourself. Try the 4-7-8 breathing technique.
                                </p>
                                <div className="bg-slate-800 p-4 rounded-lg text-left">
                                    <ol className="list-decimal list-inside space-y-2 text-slate-300 text-sm">
                                        <li>Inhale quietly through the nose for 4 seconds.</li>
                                        <li>Hold the breath for 7 seconds.</li>
                                        <li>Exhale forcefully through the mouth for 8 seconds.</li>
                                        <li>Repeat checks 4 times.</li>
                                    </ol>
                                </div>
                                <button
                                    onClick={() => onClose()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                                >
                                    I feel better
                                </button>
                            </div>
                        )}

                        {step === 'counseling' && (
                            <div className="space-y-4 text-center">
                                <h4 className="text-lg font-bold text-white">Let's connect you with a Counselor</h4>
                                <p className="text-slate-400 text-sm">ITS Counseling Unit is free and confidential.</p>

                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-left">
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-bold text-white">Unit Konseling Mahasiswa</h5>
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Available</span>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-4">Professional psychologists available Mon-Fri, 08:00 - 16:00</p>
                                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg">
                                        Book Appointment
                                    </button>
                                </div>

                                <button
                                    onClick={() => setStep('check')}
                                    className="w-full text-center text-slate-500 hover:text-white mt-4"
                                >
                                    Back
                                </button>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
