"use client";

import { motion } from "framer-motion";

export function ResearchValidation() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="text-brand-blue font-bold tracking-widest text-sm uppercase mb-2 block">Academic Credibility</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Dibangun di atas Fondasi Ilmiah yang Kokoh
                    </h2>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Psychometric Properties</h3>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-brand-blue">α = 0.87</div>
                                <p className="text-sm text-gray-500">Reliability (Excellent)</p>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-gray-600">
                                <p>Validity (CFI): 0.92</p>
                                <p>Test-Retest: r = 0.82</p>
                            </div>
                        </div>

                        <div className="text-center pt-8 md:pt-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Sample Characteristics</h3>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-brand-blue">2,000+</div>
                                <p className="text-sm text-gray-500">Mahasiswa Indonesia</p>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-gray-600">
                                <p>Representative Multi-Faculty</p>
                                <p>4+ Years Tracking</p>
                            </div>
                        </div>

                        <div className="text-center pt-8 md:pt-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Research Output</h3>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-brand-blue">3</div>
                                <p className="text-sm text-gray-500">International Publications</p>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-gray-600">
                                <p>2 Research Grants</p>
                                <p>Conference Presentations</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center border-t border-slate-100 pt-8">
                        <p className="text-gray-600 mb-4">
                            &quot;Platform ini menggunakan adaptasi instrumen yang tervalidasi secara psikometrik untuk konteks mahasiswa Indonesia.&quot;
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">ITS Research Center</span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">Ethics Approved</span>
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">GDPR Compliant</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
