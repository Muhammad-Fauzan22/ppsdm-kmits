"use client";

import { motion } from "framer-motion";
import { Server, Users, Globe, ShieldCheck } from "lucide-react";

export function EcosystemIntegration() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Terintegrasi Penuh dengan <span className="text-brand-blue">Ekosistem ITS</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Satu platform yang menghubungkan seluruh aspek kehidupan kampus Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Internal ITS Systems */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Server className="w-8 h-8 text-brand-blue" />
                            <h3 className="text-xl font-bold">Internal ITS</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "SIAKAD Integration (Nilai & MK)",
                                "ITS Library (Reading History)",
                                "Career Center (Internship Matching)",
                                "Health Center (Wellness)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Student Organizations */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-8 h-8 text-its-gold" />
                            <h3 className="text-xl font-bold">Student Org</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "BEM KM ITS (Leadership Tracking)",
                                "Himpunan Jurusan (Skill Workshop)",
                                "UKM & Unit Kegiatan (Talent)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-its-gold"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* External Networks */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="w-8 h-8 text-green-600" />
                            <h3 className="text-xl font-bold">External Network</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Alumni Association (Mentorship)",
                                "Industry Partners (Gap Analysis)",
                                "Research Networks (Opportunities)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Data Flow Hint */}
                <div className="bg-brand-blue/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-blue/10">
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="w-6 h-6 text-brand-blue" />
                        <div>
                            <h4 className="font-bold text-gray-900">Privacy-First Architecture</h4>
                            <p className="text-sm text-gray-600">Data disimpan aman di server ITS dengan enkripsi End-to-End.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">Unified Profile</span>
                        <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">Data Sovereignty</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
