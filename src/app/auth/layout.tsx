import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Authentication - PPSDM KMITS',
    description: 'Masuk atau Daftar ke ekosistem pengembangan diri mahasiswa ITS.',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-its-dark text-slate-100 font-sans selection:bg-brand-accent selection:text-its-dark">
            {/* Left Side - Visual / Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-its-blue items-center justify-center">
                {/* Animated Background */}
                <div className="absolute inset-0 w-full h-full">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-blue/30 rounded-full blur-[120px] mix-blend-screen animate-float-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-its-gold/10 rounded-full blur-[100px] mix-blend-screen animate-float-delayed" />
                    <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-12 max-w-lg text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-accent to-brand-blue flex items-center justify-center shadow-2xl shadow-brand-blue/40">
                            <span className="material-symbols-outlined text-4xl text-white">analytics</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold font-heading mb-6 tracking-tight">
                        Holistic <span className="text-brand-accent">Excellence</span>
                    </h1>
                    <p className="text-xl text-blue-100/80 leading-relaxed mb-8">
                        Bergabung dengan ekosistem pengembangan diri berbasis data.
                        Temukan potensi, raih prestasi, dan bangun masa depanmu.
                    </p>

                    {/* Trust Badges */}
                    <div className="flex gap-4 justify-center items-center opacity-60">
                        <div className="h-2 w-2 rounded-full bg-white" />
                        <span className="text-sm font-medium tracking-widest uppercase">Official ITS Platform</span>
                        <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Background Elements */}
                <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-blue/20 rounded-full blur-[80px]" />
                </div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    {children}
                </div>

                <div className="mt-8 text-center text-sm text-slate-500 relative z-10">
                    &copy; 2026 PPSDM KM ITS. Excellence in Student Development.
                </div>
            </div>
        </div>
    );
}
