"use client";
import { CheckCircle2 } from "lucide-react";

export function ComparisonTable() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Mengapa PPSDM Lebih Efektif?
                    </h2>
                    <p className="text-gray-600">Perbandingan dengan pendekatan konvensional.</p>
                </div>

                <div className="overflow-hidden bg-white shadow-xl rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Aspek</th>
                                <th className="p-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Traditional</th>
                                <th className="p-6 text-sm font-bold text-brand-blue uppercase tracking-wider bg-brand-blue/5">PPSDM KMITS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { aspect: "Scope", trad: "Akademik/IPK saja", modern: "9 Dimensi Holistik" },
                                { aspect: "Assessment", trad: "Ujian Kognitif", modern: "72 Item Psikometrik" },
                                { aspect: "Personalization", trad: "One-size-fits-all", modern: "AI Personalized Paths" },
                                { aspect: "Data-Driven", trad: "Subjektif", modern: "Real-time Analytics" },
                                { aspect: "Impact Scale", trad: "Sampai Wisuda", modern: "Seumur Hidup (Alumni)" }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">{row.aspect}</td>
                                    <td className="p-6 text-gray-600">{row.trad}</td>
                                    <td className="p-6 font-bold text-brand-blue bg-brand-blue/5 border-l border-brand-blue/10">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                                            {row.modern}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <div className="text-2xl font-bold text-green-600">40%</div>
                        <div className="text-xs text-slate-500 uppercase">Faster Competence</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">2.3x</div>
                        <div className="text-xs text-slate-500 uppercase">Career Readiness</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">+35%</div>
                        <div className="text-xs text-slate-500 uppercase">Well-being Score</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">4.7/5</div>
                        <div className="text-xs text-slate-500 uppercase">Alumni Satisfaction</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
