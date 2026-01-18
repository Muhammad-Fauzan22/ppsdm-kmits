"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Layer components
const LayerOne = ({ data, onChange }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) => (
    <div className="space-y-6">
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--its-blue)] to-[var(--accent-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--its-blue)]">Identitas Mahasiswa</h2>
            <p className="text-gray-600 mt-2">Lengkapi data dasar Anda</p>
        </div>

        <div className="grid gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input
                    type="text"
                    value={(data.nim as string) || ""}
                    onChange={(e) => onChange({ ...data, nim: e.target.value })}
                    placeholder="Contoh: 5024201001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                    type="text"
                    value={(data.fullName as string) || ""}
                    onChange={(e) => onChange({ ...data, fullName: e.target.value })}
                    placeholder="Nama sesuai KTM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fakultas</label>
                    <select
                        value={(data.faculty as string) || ""}
                        onChange={(e) => onChange({ ...data, faculty: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                    >
                        <option value="">Pilih Fakultas</option>
                        <option value="FTK">FTK - Teknologi Kelautan</option>
                        <option value="FTEIC">FTEIC - Teknologi Elektro & Informatika Cerdas</option>
                        <option value="FTIRS">FTIRS - Teknologi Industri & Rekayasa Sistem</option>
                        <option value="FADP">FADP - Arsitektur, Desain, Perencanaan</option>
                        <option value="FSAD">FSAD - Sains & Analitika Data</option>
                        <option value="FVDP">FVDP - Vokasi & Program Diploma</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                    <select
                        value={(data.batchYear as string) || ""}
                        onChange={(e) => onChange({ ...data, batchYear: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                    >
                        <option value="">Pilih Angkatan</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departemen / Program Studi</label>
                <input
                    type="text"
                    value={(data.department as string) || ""}
                    onChange={(e) => onChange({ ...data, department: e.target.value })}
                    placeholder="Contoh: Teknik Mesin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ITS</label>
                <input
                    type="email"
                    value={(data.email as string) || ""}
                    onChange={(e) => onChange({ ...data, email: e.target.value })}
                    placeholder="nama@its.ac.id"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                />
            </div>
        </div>
    </div>
);

const LayerTwo = ({ data, onChange }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) => (
    <div className="space-y-6">
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--engineering-red)] to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--its-blue)]">Profil Akademik & Profesional</h2>
            <p className="text-gray-600 mt-2">Ceritakan pengalaman dan aspirasi Anda</p>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kegiatan Ekstrakurikuler</label>
                <textarea
                    value={(data.extracurricular as string) || ""}
                    onChange={(e) => onChange({ ...data, extracurricular: e.target.value })}
                    placeholder="Contoh: Anggota UKM Robotika, Staf Himpunan Mahasiswa..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterampilan yang Dimiliki</label>
                <textarea
                    value={(data.skills as string) || ""}
                    onChange={(e) => onChange({ ...data, skills: e.target.value })}
                    placeholder="Contoh: Programming Python, CAD Design, Public Speaking..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aspirasi Karir</label>
                <select
                    value={(data.careerAspiration as string) || ""}
                    onChange={(e) => onChange({ ...data, careerAspiration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                >
                    <option value="">Pilih Aspirasi Karir</option>
                    <option value="engineer">Engineer / Praktisi Teknis</option>
                    <option value="researcher">Peneliti / Akademisi</option>
                    <option value="entrepreneur">Entrepreneur / Startup Founder</option>
                    <option value="corporate">Corporate Professional</option>
                    <option value="consultant">Konsultan</option>
                    <option value="government">ASN / Pemerintahan</option>
                    <option value="undecided">Belum Memutuskan</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industri yang Diminati</label>
                <div className="flex flex-wrap gap-2">
                    {["Tech/IT", "Manufaktur", "Energi", "Konstruksi", "Konsultan", "Startup", "Pendidikan", "Riset"].map((industry) => (
                        <button
                            key={industry}
                            onClick={() => {
                                const industries = (data.industries as string[]) || [];
                                if (industries.includes(industry)) {
                                    onChange({ ...data, industries: industries.filter((i) => i !== industry) });
                                } else {
                                    onChange({ ...data, industries: [...industries, industry] });
                                }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${((data.industries as string[]) || []).includes(industry)
                                    ? "bg-[var(--its-blue)] text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {industry}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Magang/Kerja (jika ada)</label>
                <textarea
                    value={(data.workExperience as string) || ""}
                    onChange={(e) => onChange({ ...data, workExperience: e.target.value })}
                    placeholder="Ceritakan pengalaman magang atau kerja part-time Anda..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition resize-none"
                />
            </div>
        </div>
    </div>
);

const LayerThree = ({ onStartAssessment }: { onStartAssessment: () => void }) => (
    <div className="space-y-6">
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--its-blue)]">Assessment 9 Dimensi</h2>
            <p className="text-gray-600 mt-2">Kenali diri Anda melalui 8 modul assessment saintifik</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">📋 Apa yang akan dinilai?</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                    { icon: "🧠", name: "Kognitif & Intelektual", time: "15 menit" },
                    { icon: "💚", name: "Emosional & Sosial", time: "10 menit" },
                    { icon: "💪", name: "Kesehatan Fisik", time: "8 menit" },
                    { icon: "💰", name: "Literasi Finansial", time: "7 menit" },
                    { icon: "⭐", name: "Karakter & Nilai", time: "10 menit" },
                    { icon: "🕊️", name: "Spiritual & Makna", time: "8 menit" },
                    { icon: "🌿", name: "Lingkungan", time: "7 menit" },
                    { icon: "💼", name: "Karir & Profesional", time: "10 menit" },
                ].map((module) => (
                    <div key={module.name} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        <span>{module.icon}</span>
                        <div>
                            <div className="font-medium">{module.name}</div>
                            <div className="text-gray-500 text-xs">{module.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                    <h4 className="font-semibold text-yellow-800">Estimasi Waktu: 60-90 Menit</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                        Anda dapat menyimpan dan melanjutkan kapan saja. Jawablah dengan jujur untuk hasil yang akurat.
                    </p>
                </div>
            </div>
        </div>

        <button
            onClick={onStartAssessment}
            className="w-full py-4 bg-gradient-to-r from-[var(--its-blue)] to-[var(--accent-blue)] text-white rounded-xl font-semibold text-lg hover:shadow-lg transition transform hover:scale-[1.02]"
        >
            🚀 Mulai Assessment
        </button>
    </div>
);

const LayerFour = ({ data, onChange }: { data: Record<string, unknown>; onChange: (data: Record<string, unknown>) => void }) => (
    <div className="space-y-6">
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--its-blue)]">Goal Setting & Prioritas</h2>
            <p className="text-gray-600 mt-2">Tentukan fokus pengembangan Anda</p>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas Pengembangan (pilih 3)</label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { code: "SELF_MGMT", name: "Produktivitas", icon: "⏰" },
                        { code: "INTELLECT", name: "Kecerdasan", icon: "🧠" },
                        { code: "FINANCE", name: "Finansial", icon: "💰" },
                        { code: "PHYSICAL", name: "Kesehatan", icon: "💪" },
                        { code: "EMOTIONAL", name: "Emosional", icon: "💚" },
                        { code: "MENTAL", name: "Mental", icon: "🧘" },
                        { code: "CHARACTER", name: "Karakter", icon: "⭐" },
                        { code: "SPIRITUAL", name: "Spiritual", icon: "🕊️" },
                        { code: "ENVIRONMENT", name: "Lingkungan", icon: "🌿" },
                    ].map((dim) => (
                        <button
                            key={dim.code}
                            onClick={() => {
                                const priorities = (data.priorities as string[]) || [];
                                if (priorities.includes(dim.code)) {
                                    onChange({ ...data, priorities: priorities.filter((p) => p !== dim.code) });
                                } else if (priorities.length < 3) {
                                    onChange({ ...data, priorities: [...priorities, dim.code] });
                                }
                            }}
                            className={`p-4 rounded-xl text-center transition ${((data.priorities as string[]) || []).includes(dim.code)
                                    ? "bg-[var(--its-blue)] text-white shadow-lg"
                                    : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            <span className="text-2xl block mb-1">{dim.icon}</span>
                            <span className="text-sm font-medium">{dim.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline Pengembangan</label>
                <select
                    value={(data.timeline as string) || ""}
                    onChange={(e) => onChange({ ...data, timeline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition"
                >
                    <option value="">Pilih Timeline</option>
                    <option value="1_month">1 Bulan (Intensif)</option>
                    <option value="3_months">3 Bulan (Semester)</option>
                    <option value="6_months">6 Bulan</option>
                    <option value="1_year">1 Tahun</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Komitmen Waktu per Minggu</label>
                <div className="flex gap-3">
                    {["5 jam", "10 jam", "15 jam", "20+ jam"].map((time) => (
                        <button
                            key={time}
                            onClick={() => onChange({ ...data, weeklyCommitment: time })}
                            className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${data.weeklyCommitment === time
                                    ? "bg-[var(--its-blue)] text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivasi Utama</label>
                <textarea
                    value={(data.motivation as string) || ""}
                    onChange={(e) => onChange({ ...data, motivation: e.target.value })}
                    placeholder="Apa yang memotivasi Anda untuk berkembang?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent transition resize-none"
                />
            </div>
        </div>
    </div>
);

export default function OnboardingPage() {
    const router = useRouter();
    const [currentLayer, setCurrentLayer] = useState(1);
    const [layerData, setLayerData] = useState<Record<number, Record<string, unknown>>>({
        1: {},
        2: {},
        3: {},
        4: {},
    });
    const [isLoading, setIsLoading] = useState(false);

    const layers = [
        { number: 1, title: "Identitas", icon: "🎓" },
        { number: 2, title: "Profil", icon: "📋" },
        { number: 3, title: "Assessment", icon: "📊" },
        { number: 4, title: "Goals", icon: "🎯" },
    ];

    const handleLayerChange = (layer: number, data: Record<string, unknown>) => {
        setLayerData((prev) => ({ ...prev, [layer]: data }));
    };

    const handleNext = async () => {
        if (currentLayer < 4) {
            setCurrentLayer(currentLayer + 1);
        } else {
            // Complete onboarding
            setIsLoading(true);
            try {
                // Save all data
                await fetch("/api/registration", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        layer: "4",
                        data: layerData,
                        completed: true,
                    }),
                });
                router.push("/dashboard");
            } catch (error) {
                console.error("Error completing onboarding:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleStartAssessment = () => {
        router.push("/comprehensive-assessment");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--its-blue)] to-[var(--accent-blue)] rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">KMM</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-[var(--its-blue)]">PPSDM KMM</h1>
                                <p className="text-xs text-gray-500">Holistic Development</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Layer {currentLayer} of 4
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Steps */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    {layers.map((layer, index) => (
                        <React.Fragment key={layer.number}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${layer.number === currentLayer
                                            ? "bg-[var(--its-blue)] text-white scale-110 shadow-lg"
                                            : layer.number < currentLayer
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {layer.number < currentLayer ? "✓" : layer.icon}
                                </div>
                                <span className={`text-xs mt-2 ${layer.number === currentLayer ? "font-semibold text-[var(--its-blue)]" : "text-gray-500"}`}>
                                    {layer.title}
                                </span>
                            </div>
                            {index < layers.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded ${layer.number < currentLayer ? "bg-green-500" : "bg-gray-200"}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-4 pb-32">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentLayer}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentLayer === 1 && (
                                <LayerOne data={layerData[1]} onChange={(data) => handleLayerChange(1, data)} />
                            )}
                            {currentLayer === 2 && (
                                <LayerTwo data={layerData[2]} onChange={(data) => handleLayerChange(2, data)} />
                            )}
                            {currentLayer === 3 && (
                                <LayerThree onStartAssessment={handleStartAssessment} />
                            )}
                            {currentLayer === 4 && (
                                <LayerFour data={layerData[4]} onChange={(data) => handleLayerChange(4, data)} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <div className="max-w-2xl mx-auto flex gap-4">
                    {currentLayer > 1 && (
                        <button
                            onClick={() => setCurrentLayer(currentLayer - 1)}
                            className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                        >
                            ← Kembali
                        </button>
                    )}
                    {currentLayer !== 3 && (
                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="flex-1 py-3 bg-gradient-to-r from-[var(--its-blue)] to-[var(--accent-blue)] text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                        >
                            {isLoading ? "Menyimpan..." : currentLayer === 4 ? "Selesai 🎉" : "Lanjut →"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
