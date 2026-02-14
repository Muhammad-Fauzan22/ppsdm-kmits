"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from '@/components/ui/Icon';

import { ITS_FACULTIES } from "@/lib/its_programs";

type FormData = {
    // Step 1: Identity
    nrp: string;
    fullName: string;
    faculty: string;
    department: string;
    // Step 2: Academic
    gpa: string;
    semester: string;
    researchInterests: string;
    // Step 3: Preferences
    learningPath: string;
    careerGoal: string;
};

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        nrp: "",
        fullName: "",
        faculty: "",
        department: "",
        gpa: "",
        semester: "",
        researchInterests: "",
        learningPath: "",
        careerGoal: "",
    });
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsCompleted(true);
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-its-dark flex flex-col items-center justify-center p-4 font-sans text-slate-200">
                <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-blue/5"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-tr from-brand-blue to-brand-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-blue/30 animate-scale-up">
                            <Icon name="CheckCircle" className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">Registration Complete!</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Your profile has been successfully integrated into the PPSDM KMM ecosystem.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-4 bg-white text-its-dark font-bold rounded-xl hover:bg-brand-accent transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                        >
                            <Icon name="LayoutDashboard" className="w-5 h-5" />
                            Enter Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-its-dark font-sans text-slate-200 antialiased selection:bg-brand-blue selection:text-white min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-its-dark/80 backdrop-blur-md px-6 py-4 lg:px-12">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/20">
                        <Icon name="GraduationCap" className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white text-lg font-bold font-heading leading-tight">PPSDM KMM</span>
                        <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">Student Onboarding</span>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <div className="hidden md:flex items-center gap-6">
                        <Link className="text-slate-400 hover:text-white text-sm font-medium transition-colors" href="#">Need Help?</Link>
                    </div>
                    <div className="bg-brand-blue/20 rounded-full size-10 flex items-center justify-center border border-white/10 text-brand-accent font-bold">
                        MA
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="flex-grow flex flex-col items-center justify-start pt-10 pb-16 px-4 md:px-6 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-5xl flex flex-col gap-8 relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col gap-2 text-center md:text-left mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-white">
                            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-accent">Competency Profile</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Step {currentStep} of 3: {currentStep === 1 ? 'Identity' : currentStep === 2 ? 'Academic Data' : 'Career Goals'}
                        </p>
                    </div>

                    {/* Stepper Component */}
                    <div className="w-full glass-card rounded-2xl p-8 mb-4">
                        <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-white/5 -z-0 rounded-full"></div>
                            <div
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-its-blue to-brand-accent -z-0 rounded-full transition-all duration-700 ease-in-out"
                                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                            ></div>

                            {[1, 2, 3].map((step) => {
                                const isActive = currentStep >= step;
                                const isCurrent = currentStep === step;
                                return (
                                    <div key={step} className="flex flex-col items-center gap-3 z-10">
                                        <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-its-blue to-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-110' : 'bg-its-dark border border-white/10 text-slate-500'}`}>
                                            {isActive ? (
                                                step === 1 ? <Icon name="IdCard" className="w-5 h-5" /> :
                                                    step === 2 ? <Icon name="School" className="w-5 h-5" /> :
                                                        <Icon name="Signpost" className="w-5 h-5" />
                                            ) : (
                                                <span className="text-sm font-bold">{step}</span>
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-white' : 'text-slate-600'}`}>
                                            {step === 1 ? 'Identity' : step === 2 ? 'Academic' : 'Future'}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <div className="glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px] border-white/5">
                        {/* Side Decorative Panel */}
                        <div className="hidden md:flex md:w-1/3 bg-black/40 relative flex-col justify-between p-10 border-r border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent"></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-accent text-xs font-bold uppercase tracking-wider mb-6">
                                    <Icon name="Lightbulb" className="w-4 h-4" />
                                    Insight
                                </div>
                                <h3 className="text-white font-bold font-heading text-2xl mb-4 leading-snug">
                                    {currentStep === 1 ? 'One ID for Everything' : currentStep === 2 ? 'Data-Driven Growth' : 'Define Your Path'}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {currentStep === 1 && "Your Single Sign-On (SSO) connects your academic records directly to your competency portfolio."}
                                    {currentStep === 2 && "By analyzing your GPA and interests, our AI suggests the most relevant modules to boost your profile."}
                                    {currentStep === 3 && "Set ambitious goals. We'll reverse-engineer the roadmap you need to achieve them."}
                                </p>
                            </div>

                            {/* Visual Element at bottom of sidebar */}
                            <div className="relative z-10 mt-auto opacity-50">
                                <div className="w-full h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
                                    <div className="h-full bg-brand-accent w-2/3 animate-pulse"></div>
                                </div>
                                <p className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">System Synchronized</p>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col bg-white/[0.02]">
                            <form className="flex flex-col gap-8 flex-grow" onSubmit={(e) => e.preventDefault()}>
                                {/* STEP 1: IDENTITY */}
                                {currentStep === 1 && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">NRP (Student ID)</label>
                                            <input
                                                name="nrp"
                                                value={formData.nrp}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all placeholder:text-slate-600"
                                                placeholder="e.g. 50252010..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Legal Name</label>
                                            <input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all placeholder:text-slate-600"
                                                placeholder="Enter full name as per KTM"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Faculty</label>
                                                <div className="relative">
                                                    <select
                                                        name="faculty"
                                                        value={formData.faculty}
                                                        onChange={(e) => {
                                                            setFormData(prev => ({ ...prev, faculty: e.target.value, department: "" }));
                                                        }}
                                                        className="w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all appearance-none"
                                                    >
                                                        <option value="" disabled className="bg-its-dark text-slate-500">Select Faculty</option>
                                                        {ITS_FACULTIES.map((faculty) => (
                                                            <option key={faculty.name} value={faculty.name} className="bg-its-dark">
                                                                {faculty.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <Icon name="ChevronDown" className="absolute right-4 top-4 text-slate-500 pointer-events-none w-6 h-6" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Study Program (Department)</label>
                                                <div className="relative">
                                                    <select
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleInputChange}
                                                        disabled={!formData.faculty}
                                                        className={`w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all appearance-none ${!formData.faculty ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <option value="" disabled className="bg-its-dark text-slate-500">
                                                            {formData.faculty ? "Select Study Program" : "Select Faculty First"}
                                                        </option>
                                                        {formData.faculty && ITS_FACULTIES.find(f => f.name === formData.faculty)?.programs.map((prog) => (
                                                            <option key={prog.name} value={prog.name} className="bg-its-dark">
                                                                {prog.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <Icon name="ChevronDown" className="absolute right-4 top-4 text-slate-500 pointer-events-none w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: ACADEMIC */}
                                {currentStep === 2 && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Current GPA</label>
                                                <input
                                                    name="gpa"
                                                    type="number"
                                                    step="0.01"
                                                    min="0" max="4.0"
                                                    value={formData.gpa}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all placeholder:text-slate-600"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Semester</label>
                                                <div className="relative">
                                                    <select
                                                        name="semester"
                                                        value={formData.semester}
                                                        onChange={handleInputChange}
                                                        className="w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all appearance-none"
                                                    >
                                                        <option value="" disabled className="bg-its-dark">Select</option>
                                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-its-dark">Sem {s}</option>)}
                                                    </select>
                                                    <Icon name="ChevronDown" className="absolute right-4 top-4 text-slate-500 pointer-events-none w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Research / Technical Interests</label>
                                            <input
                                                name="researchInterests"
                                                value={formData.researchInterests}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all placeholder:text-slate-600"
                                                placeholder="e.g. Artificial Intelligence, IoT, Fintech"
                                            />
                                            <p className="text-[10px] text-slate-500">*Separate multiple topics with commas</p>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: PREFERENCES */}
                                {currentStep === 3 && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Focus Path</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {['Technical Mastery', 'Research & Innovation', 'Leadership & Management'].map((path) => (
                                                    <div
                                                        key={path}
                                                        onClick={() => setFormData(prev => ({ ...prev, learningPath: path }))}
                                                        className={`p-4 rounded-xl border cursor-pointer transition-all group ${formData.learningPath === path ? 'border-brand-accent bg-brand-blue/20' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.learningPath === path ? 'border-brand-accent' : 'border-slate-500'}`}>
                                                                {formData.learningPath === path && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shadow-glow"></div>}
                                                            </div>
                                                            <div>
                                                                <span className={`font-bold block ${formData.learningPath === path ? 'text-white' : 'text-slate-300'}`}>{path}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Ultimate Career Goal</label>
                                            <input
                                                name="careerGoal"
                                                value={formData.careerGoal}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl bg-black/20 border border-white/10 text-white p-4 focus:border-brand-accent focus:bg-brand-blue/5 outline-none transition-all placeholder:text-slate-600"
                                                placeholder="e.g. CTO of a Unicorn Startup"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5 gap-4">
                                    <button
                                        onClick={handleBack}
                                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        type="button"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={isLoading}
                                        className="flex items-center justify-center gap-3 px-10 py-3.5 rounded-xl bg-white text-its-dark hover:bg-brand-accent hover:text-white text-sm font-bold shadow-lg shadow-white/5 transition-all transform active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
                                        type="button"
                                    >
                                        <span>{currentStep === 3 ? (isLoading ? 'Finalizing...' : 'Complete Registration') : 'Next Step'}</span>
                                        {!isLoading && <Icon name="ArrowRight" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}
