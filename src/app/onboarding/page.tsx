"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
    {
        id: 1,
        title: "Selamat Datang di PPSDM KMITS",
        description: "Platform pengembangan holistik untuk mahasiswa ITS. Mari kita mulai perjalananmu!",
        icon: "waving_hand",
        color: "from-primary to-its-blue",
    },
    {
        id: 2,
        title: "9 Dimensi Pengembangan",
        description: "Kami membantu mengembangkan 9 aspek penting: Kognitif, Afektif, Psikomotorik, Spiritual, Sosial, Finansial, Kesehatan, Karakter, dan Lingkungan.",
        icon: "hub",
        color: "from-growth-green to-teal-600",
    },
    {
        id: 3,
        title: "Personalisasi Perjalananmu",
        description: "Platform akan menyesuaikan rekomendasi berdasarkan semester, jurusan, dan preferensi pengembanganmu.",
        icon: "tune",
        color: "from-active-yellow to-orange-500",
    },
    {
        id: 4,
        title: "Siap Memulai?",
        description: "Klik 'Mulai' untuk masuk ke dashboard dan mulai merencanakan pengembangan dirimu.",
        icon: "rocket_launch",
        color: "from-primary to-purple-600",
    },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push("/dashboard");
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const step = steps[currentStep];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${step.color} text-white font-display flex flex-col items-center justify-center p-6 transition-all duration-500`}>
            {/* Progress Dots */}
            <div className="absolute top-8 flex gap-2">
                {steps.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-white" : "w-2 bg-white/30"
                            }`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="max-w-md text-center space-y-8 animate-fade-in">
                {/* Icon */}
                <div className="size-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                    <span className="material-symbols-outlined text-7xl">{step.icon}</span>
                </div>

                {/* Text */}
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold">{step.title}</h1>
                    <p className="text-lg text-white/80 leading-relaxed">{step.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Kembali
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-xl bg-white text-gray-900 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        {currentStep === steps.length - 1 ? "Mulai Sekarang" : "Lanjutkan"}
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </div>

            {/* Skip Button */}
            {currentStep < steps.length - 1 && (
                <button
                    onClick={() => router.push("/dashboard")}
                    className="absolute bottom-8 text-white/60 hover:text-white text-sm font-medium transition-colors"
                >
                    Lewati Intro →
                </button>
            )}
        </div>
    );
}
