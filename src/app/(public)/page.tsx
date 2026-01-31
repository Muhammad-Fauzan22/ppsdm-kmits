"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
    Activity,
    Menu,
    Award,
    Zap,
    PlayCircle,
    GraduationCap,
    ShieldCheck,
    Workflow,
    Frown,
    FolderX,
    BatteryWarning,
    Radar,
    Puzzle,
    Rocket,
    Brain,
    Clock,
    DollarSign,
    Dumbbell,
    Users,
    Sparkles,
    Scale,
    Flower2,
    Leaf,
    HelpCircle,
    CheckCircle,
    Landmark,
    Building2,
    MapPin,
    Phone,
    Mail,
    Database,
    Code,
    Blocks
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeroVideo from '@/components/HeroVideo';

export default function LandingPage() {
    return (
        <Suspense fallback={null}>
            <LandingContent />
        </Suspense>
    );
}

function LandingContent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-[#0A0F1A] font-sans text-slate-200 antialiased selection:bg-[#135bec] selection:text-white overflow-x-hidden min-h-screen flex flex-col">

            {/* Header */}
            <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#0A0F1A]/80 backdrop-blur-lg transition-all duration-300">
                <div className="flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#013880] to-[#135bec] shadow-lg shadow-[#135bec]/20">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-heading tracking-tight text-white leading-none">PPSDM KMITS</span>
                            <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-bold">ITS Surabaya</span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors" href="/#methodology">Metodologi</Link>
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors" href="/#dimensions">9 Dimensi</Link>
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors" href="/#demo">Mission Control</Link>
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors" href="/#benefits">Manfaat</Link>
                        <Link href="/auth/login" className="bg-[#135bec] hover:bg-[#135bec]/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#135bec]/30 active:scale-95">
                            Mulai Sekarang
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-[#0A0F1A] border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-fade-in-up">
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors p-2" href="/#methodology" onClick={() => setIsMenuOpen(false)}>Metodologi</Link>
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors p-2" href="/#dimensions" onClick={() => setIsMenuOpen(false)}>9 Dimensi</Link>
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors p-2" href="/#demo" onClick={() => setIsMenuOpen(false)}>Mission Control</Link>
                        <Link className="text-sm font-medium hover:text-[#00d4ff] transition-colors p-2" href="/#benefits" onClick={() => setIsMenuOpen(false)}>Manfaat</Link>
                        <Link href="/auth/login" className="bg-[#135bec] text-center text-white px-6 py-3 rounded-xl font-bold text-sm transition-all" onClick={() => setIsMenuOpen(false)}>
                            Mulai Sekarang
                        </Link>
                    </div>
                )}
            </header>

            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <HeroVideo />

                {/* Pain Points */}
                <section className="py-20 px-6 lg:px-12 bg-black relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#013880]/10 pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-bold font-heading text-white mb-2">The Reality Gap</h2>
                                <p className="text-slate-400">Mengapa mahasiswa dengan IPK tinggi sering gagal di dunia nyata?</p>
                            </div>
                            <div className="hidden md:block w-32 h-1 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="dark-glass-card p-8 rounded-2xl border-l-4 border-l-red-500 hover:border-l-red-400 transition-all group">
                                <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
                                    <Frown className="w-8 h-8 group-hover:animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Academic Tunnel Vision</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Terjebak mengejar nilai akademik semata, lulus dengan predikat Cumlaude namun bingung arah karir dan tujuan hidup.</p>
                            </div>
                            <div className="dark-glass-card p-8 rounded-2xl border-l-4 border-l-orange-500 hover:border-l-orange-400 transition-all group">
                                <div className="size-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500">
                                    <FolderX className="w-8 h-8 group-hover:animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">The Empty Portfolio</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">4 tahun kuliah tanpa dokumentasi project nyata. CV kosong melompong yang tidak bisa divalidasi oleh industri.</p>
                            </div>
                            <div className="dark-glass-card p-8 rounded-2xl border-l-4 border-l-purple-500 hover:border-l-purple-400 transition-all group">
                                <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500">
                                    <BatteryWarning className="w-8 h-8 group-hover:animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Burnout & Disorientation</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Stress akademik tanpa manajemen diri dan kecerdasan emosional, menyebabkan performa menurun drastis di tahun akhir.</p>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Methodology */}
                <section className="py-24 px-6 lg:px-12 bg-[#05080F]" id="methodology">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <span className="text-[#00d4ff] font-bold tracking-widest text-xs uppercase mb-2 block">Our Framework</span>
                            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">Metodologi Strategis</h2>
                            <p className="text-slate-400">3 Tahap Transformasi Mahasiswa ITS</p>
                        </div>
                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px timeline-line border-t border-dashed border-[#135bec]/50"></div>

                            {/* Step 1 */}
                            <div className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-8 group-hover:bg-[#135bec]/20 transition-all duration-500 border-[#135bec]/30 shadow-[0_0_30px_rgba(19,91,236,0.2)]">
                                    <Radar className="w-10 h-10 text-[#00d4ff]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">1. DISCOVERY</h3>
                                <p className="text-[#135bec] font-bold text-xs uppercase tracking-widest mb-4">Holistic Assessment</p>
                                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Pemetaan 360° potensi diri Anda melalui asesmen holistik yang mendalam dan dashboard personal.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-8 group-hover:bg-[#135bec]/20 transition-all duration-500 border-[#135bec]/30 shadow-[0_0_30px_rgba(19,91,236,0.2)]">
                                    <Puzzle className="w-10 h-10 text-[#00d4ff]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">2. DEVELOPMENT</h3>
                                <p className="text-[#135bec] font-bold text-xs uppercase tracking-widest mb-4">AI Ecosystem</p>
                                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Kurikulum terpersonalisasi dengan rekomendasi AI dan akses ke ekosistem pengembangan skill eksklusif.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-8 group-hover:bg-[#135bec]/20 transition-all duration-500 border-[#135bec]/30 shadow-[0_0_30px_rgba(19,91,236,0.2)]">
                                    <Rocket className="w-10 h-10 text-[#00d4ff]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">3. DEPLOYMENT</h3>
                                <p className="text-[#135bec] font-bold text-xs uppercase tracking-widest mb-4">Career Transition</p>
                                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Validasi kompetensi melalui portofolio terverifikasi blockchain untuk transisi karir yang mulus.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9 Dimensions */}
                <section className="py-24 px-6 lg:px-12 relative overflow-hidden" id="dimensions">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl font-bold font-heading text-white mb-4">The 9 Dimensions Framework</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">Kurikulum komprehensif yang membagi pengembangan menjadi 9 aspek krusial untuk mencetak lulusan paripurna.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <DimensionCard
                                number="01" title="Intelektual" desc="Pengembangan nalar kritis, wawasan global, dan penguasaan akademik mendalam."
                                icon={Brain} color="blue" percent="20%"
                            />
                            <DimensionCard
                                number="02" title="Manajemen Diri" desc="Pengelolaan waktu, disiplin, dan kemampuan menetapkan prioritas hidup."
                                icon={Clock} color="emerald" percent="35%"
                            />
                            <DimensionCard
                                number="03" title="Finansial" desc="Literasi keuangan, manajemen aset pribadi, dan mindset kewirausahaan."
                                icon={DollarSign} color="yellow" percent="15%"
                            />
                            <DimensionCard
                                number="04" title="Fisik" desc="Kesehatan jasmani, pola hidup sehat, dan ketahanan fisik untuk produktivitas."
                                icon={Dumbbell} color="red" percent="50%"
                            />
                            <DimensionCard
                                number="05" title="Emosional & Sosial" desc="Kecerdasan emosi, empati, networking, dan kemampuan kolaborasi tim."
                                icon={Users} color="pink" percent="60%"
                            />
                            <DimensionCard
                                number="06" title="Mental" desc="Ketangguhan (resilience), manajemen stress, dan pola pikir bertumbuh."
                                icon={Sparkles} color="indigo" percent="45%"
                            />
                            <DimensionCard
                                number="07" title="Karakter & Etika" desc="Integritas, profesionalisme, dan moralitas dalam pengambilan keputusan."
                                icon={Scale} color="cyan" percent="75%"
                            />
                            <DimensionCard
                                number="08" title="Spiritual" desc="Penemuan makna hidup, ketenangan batin, dan koneksi transenden."
                                icon={Flower2} color="violet" percent="30%"
                            />
                            <DimensionCard
                                number="09" title="Lingkungan" desc="Kesadaran ekologis, gaya hidup berkelanjutan, dan kontribusi sosial."
                                icon={Leaf} color="lime" percent="40%"
                            />
                        </div>
                    </div>
                </section>

                {/* Demo Mission Control */}
                <section className="py-24 px-6 lg:px-12 bg-white/5 relative overflow-hidden" id="demo">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#135bec]/10 rounded-full blur-[120px]"></div>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/2 space-y-8">
                                <div className="inline-block px-3 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full text-[#00d4ff] text-xs font-bold uppercase tracking-wide">
                                    Interactive Demo
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">Mission Control <br /><span className="text-[#00d4ff]">Personal Dashboard</span></h2>
                                <p className="text-slate-400 text-lg leading-relaxed">Rasakan langsung visualisasi radar kompetensi Anda. Platform kami melacak pertumbuhan setiap dimensi secara real-time untuk memastikan Anda tetap di jalur kesuksesan.</p>
                                <div className="space-y-6">
                                    <div className="glass-card p-6 rounded-2xl border-[#135bec]/20">
                                        <p className="text-[#00d4ff] text-xs font-bold mb-4 flex items-center gap-2">
                                            <HelpCircle className="w-4 h-4" />
                                            MINI ASSESSMENT PREVIEW
                                        </p>
                                        <div className="space-y-4">
                                            <p className="text-white font-medium">Bagaimana Anda bereaksi terhadap kegagalan tim yang Anda pimpin?</p>
                                            <div className="grid gap-3">
                                                <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-[#135bec]/20 border border-white/10 hover:border-[#135bec]/50 transition-all text-sm group flex items-center">
                                                    <span className="w-6 h-6 rounded-full border border-white/20 inline-flex items-center justify-center mr-2 text-xs group-hover:bg-[#135bec] group-hover:border-[#135bec]">A</span>
                                                    Evaluasi proses dan tanggung jawab bersama
                                                </button>
                                                <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-[#135bec]/20 border border-white/10 hover:border-[#135bec]/50 transition-all text-sm group flex items-center">
                                                    <span className="w-6 h-6 rounded-full border border-white/20 inline-flex items-center justify-center mr-2 text-xs group-hover:bg-[#135bec] group-hover:border-[#135bec]">B</span>
                                                    Mencari individu yang membuat kesalahan utama
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full max-w-[550px]">
                                <div className="glass-card p-8 rounded-[2.5rem] border-white/10 relative">
                                    <div className="absolute top-8 left-8 z-10 hidden sm:block">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Analysis Profile</span>
                                        <h4 className="text-xl font-bold text-white">Student 2024.08.12</h4>
                                    </div>
                                    <div className="aspect-square w-full flex items-center justify-center relative">
                                        <svg className="w-full h-full max-w-[350px] transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
                                            <polygon fill="none" points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></polygon>
                                            <polygon fill="none" points="100,60 135,80 135,120 100,140 65,120 65,80" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></polygon>
                                            <line stroke="rgba(255,255,255,0.1)" x1="100" x2="100" y1="100" y2="20"></line>
                                            <line stroke="rgba(255,255,255,0.1)" x1="100" x2="170" y1="100" y2="60"></line>
                                            <line stroke="rgba(255,255,255,0.1)" x1="100" x2="170" y1="100" y2="140"></line>
                                            <line stroke="rgba(255,255,255,0.1)" x1="100" x2="100" y1="100" y2="180"></line>
                                            <line stroke="rgba(255,255,255,0.1)" x1="100" x2="30" y1="100" y2="140"></line>
                                            <line stroke="rgba(255,255,255,0.1)" x1="100" x2="30" y1="100" y2="60"></line>
                                            <polygon className="animate-pulse shadow-glow" fill="rgba(19, 91, 236, 0.3)" points="100,40 150,80 140,130 100,160 50,130 60,70" stroke="#00d4ff" strokeWidth="3"></polygon>
                                            <circle className="cursor-pointer shadow-lg" cx="100" cy="40" fill="#fff" r="4"></circle>
                                            <circle className="cursor-pointer shadow-lg" cx="150" cy="80" fill="#fff" r="4"></circle>
                                            <circle className="cursor-pointer shadow-lg" cx="140" cy="130" fill="#fff" r="4"></circle>
                                            <circle className="cursor-pointer shadow-lg" cx="100" cy="160" fill="#fff" r="4"></circle>
                                            <circle className="cursor-pointer shadow-lg" cx="50" cy="130" fill="#fff" r="4"></circle>
                                            <circle className="cursor-pointer shadow-lg" cx="60" cy="70" fill="#fff" r="4"></circle>
                                        </svg>
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">LEADERSHIP</div>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">ETHICS</div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold rotate-90 origin-right -mr-4">TECH</div>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold -rotate-90 origin-left -ml-4">SOCIAL</div>
                                    </div>
                                    <div className="mt-8 flex justify-between items-center bg-[#135bec]/10 p-4 rounded-xl border border-[#135bec]/20">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Development Status</p>
                                            <p className="text-white font-bold">Growth Potential: 85%</p>
                                        </div>
                                        <Rocket className="w-6 h-6 text-[#00d4ff] animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-24 px-6 lg:px-12 bg-[#0A0F1A]" id="benefits">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Value for Everyone</h2>
                            <p className="text-slate-400">Ekosistem yang menghubungkan seluruh pemangku kepentingan.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <BenefitCard
                                icon={GraduationCap} title="Mahasiswa"
                                list={["Roadmap karir yang terarah", "Portofolio digital terverifikasi", "Akses mentoring eksklusif"]}
                                color="blue"
                            />
                            <BenefitCard
                                icon={Landmark} title="Dosen & Prodi"
                                list={["Monitoring perkembangan holistik", "Data-driven policy making", "Early warning system akademik"]}
                                color="yellow"
                            />
                            <BenefitCard
                                icon={Building2} title="Industri & Alumni"
                                list={["Akses talent pool berkualitas", "Validasi skill transparan", "Kolaborasi riset & project"]}
                                color="purple"
                            />
                        </div>
                    </div>
                </section>

                {/* Testimonials / Use Cases */}
                <section className="py-24 px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-[#05080F] to-[#013880]/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold font-heading text-white">Transformasi Nyata</h2>
                            <p className="text-slate-400">Dari kebingungan menuju karir impian.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Andi */}
                            <div className="glass-card p-0 rounded-3xl overflow-hidden flex flex-col">
                                <div className="p-8 pb-0 flex items-center gap-4">
                                    <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#135bec] to-[#00d4ff] flex items-center justify-center overflow-hidden shadow-xl shrink-0">
                                        <img alt="Andi - Informatics" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5SVVpH4Be-WqS0W1VPrxzjlB3vbZb4C-UE7mFxtbTzc9QISczBj8vA_ABHpRX7wQ8MOfsZkOEgPcHisOEiDbuueRsHz3_jiQjEk4uPefakcBGCmRR665cDvRnob5C_bdkRs4--_0Iu_rQsQnXNBxTmJeA_OW5SMiyO18xVXrLNzdGPw3RtSlgknXFDGfe_W52p6k4bukffT4Oc8Yhye_4pBtlN-T20ZzFSqUCbRxgymNI0b4R7XkNCS5ggui_ngcch8eCuFgdguM" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Andi Pratama</h4>
                                        <p className="text-slate-500 text-sm">Teknik Informatika '20</p>
                                    </div>
                                    <div className="ml-auto bg-[#135bec]/20 text-[#135bec] px-3 py-1 rounded-full text-xs font-bold">
                                        Tech Lead
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-2 gap-8 mt-4">
                                    <div className="border-r border-white/5 pr-4">
                                        <p className="text-[10px] text-red-400 font-bold uppercase mb-2">BEFORE (2020)</p>
                                        <p className="text-slate-400 text-sm italic">"Hanya fokus coding, takut presentasi, IPK 3.8 tapi portfolio kosong."</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden block">
                                                <span className="block h-full bg-red-500 w-[30%]"></span>
                                            </span>
                                            <span className="text-xs text-red-400 font-bold">30%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">Soft Skills</p>
                                    </div>
                                    <div className="pl-2">
                                        <p className="text-[10px] text-[#00d4ff] font-bold uppercase mb-2">AFTER (2024)</p>
                                        <p className="text-slate-200 text-sm font-medium">"Menang Hackathon Nasional, memimpin tim 5 orang, hired by Unicorn."</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden block">
                                                <span className="block h-full bg-[#00d4ff] w-[95%]"></span>
                                            </span>
                                            <span className="text-xs text-[#00d4ff] font-bold">95%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">Soft Skills</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sari */}
                            <div className="glass-card p-0 rounded-3xl overflow-hidden flex flex-col bg-[#135bec]/5 border-[#135bec]/20">
                                <div className="p-8 pb-0 flex items-center gap-4">
                                    <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#FFD700] to-orange-400 flex items-center justify-center overflow-hidden shadow-xl shrink-0">
                                        <img alt="Sari - Architecture" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb-aNlXgtqk-22vz2E74FIlapMvtcjzMSbEdYJWqzksp22VO5cPha0FZeTgaqRynHJktg-YEchq3bkqqxhWAZEyivY1A3U-dauRwS-jOESr49qPfH_5N166P4xI91j0yS57NlNgmvWCzzHom5w1S1VtBPdpp-izUFI1K_yoversEgQBoIR_joSpRkWci6Y1b4xZuY0-bg3yfPYRGhR_QNkByGIQbEjecI5LKkSvPbJkA-CCfvv5Rf6NaFBdb575l4UXdQ_qR-NFnE" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Sari Wulandari</h4>
                                        <p className="text-slate-500 text-sm">Arsitektur '21</p>
                                    </div>
                                    <div className="ml-auto bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full text-xs font-bold">
                                        Awardee
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-2 gap-8 mt-4">
                                    <div className="border-r border-white/5 pr-4">
                                        <p className="text-[10px] text-red-400 font-bold uppercase mb-2">BEFORE (2021)</p>
                                        <p className="text-slate-400 text-sm italic">"Pemalu, ide bagus tapi tidak bisa 'menjual', sering burnout."</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden block">
                                                <span className="block h-full bg-red-500 w-[40%]"></span>
                                            </span>
                                            <span className="text-xs text-red-400 font-bold">40%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">Communication</p>
                                    </div>
                                    <div className="pl-2">
                                        <p className="text-[10px] text-[#00d4ff] font-bold uppercase mb-2">AFTER (2024)</p>
                                        <p className="text-slate-200 text-sm font-medium">"Juara 1 Sayembara Desain, Public Speaker di TEDxITS."</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden block">
                                                <span className="block h-full bg-[#00d4ff] w-[98%]"></span>
                                            </span>
                                            <span className="text-xs text-[#00d4ff] font-bold">98%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">Communication</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                {/* FAQ / CTA */}
                <section className="py-24 px-6 lg:px-12 bg-[#05080F]" id="faq">
                    <div className="max-w-4xl mx-auto">
                        <div className="mt-10 p-12 rounded-[2.5rem] bg-gradient-to-br from-[#013880]/40 to-[#135bec]/10 border border-white/10 text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
                                    Mulai perjalananmu dengan<br />peta yang jelas.
                                </h3>
                                <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                                    Bergabung dengan ribuan mahasiswa ITS lainnya yang telah mengambil kendali atas masa depan mereka.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
                                    <input className="flex-1 bg-[#0A0F1A]/80 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all" placeholder="NRP / Email ITS" type="text" />
                                    <button className="bg-white text-[#013880] font-bold px-8 py-3 rounded-xl hover:bg-[#00d4ff] hover:text-white transition-all whitespace-nowrap shadow-lg shadow-white/10">
                                        Akses Platform
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    By joining, you agree to our Terms & Data Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#0A0F1A] pt-20 pb-10 px-6 lg:px-12 border-t border-white/5 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[#135bec]/50 to-transparent"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#013880] font-black shadow-xl">ITS</div>
                                <h2 className="text-xl font-bold font-heading text-white">Institut Teknologi Sepuluh Nopember</h2>
                            </div>
                            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                                Pusat Pengembangan Sumber Daya Manusia - KMM ITS.<br />
                                Membangun generasi emas Indonesia melalui integrasi teknologi dan karakter.
                            </p>
                            <div className="flex flex-col gap-2 pt-4">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Built For Scale With:</p>
                                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Database className="w-3.5 h-3.5" /> PostgreSQL</div>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Code className="w-3.5 h-3.5" /> Next.js 14</div>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Blocks className="w-3.5 h-3.5" /> Blockchain</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6">Program</h3>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><Link className="hover:text-[#00d4ff] transition-colors" href="#">Assessment Mandiri</Link></li>
                                <li><Link className="hover:text-[#00d4ff] transition-colors" href="#">Bootcamp Kompetensi</Link></li>
                                <li><Link className="hover:text-[#00d4ff] transition-colors" href="#">Mentorship Karir</Link></li>
                                <li><Link className="hover:text-[#00d4ff] transition-colors" href="#">Katalog Soft Skills</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6">Kontak</h3>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Kampus ITS Sukolilo, Surabaya</li>
                                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +62-31-5994251</li>
                                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> ppsdm@its.ac.id</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <p>© 2024 PPSDM KMM ITS. Developed for Excellence.</p>
                        <div className="flex gap-8">
                            <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
                            <Link className="hover:text-white transition-colors" href="#">Cookie Policy</Link>
                            <Link className="hover:text-white transition-colors" href="#">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- SUB COMPONENTS ---

function DimensionCard({ number, title, desc, icon: Icon, color, percent }: any) {
    const colorClasses = {
        blue: { text: "text-blue-400", bg: "bg-blue-500/20", border: "border-t-blue-500", bar: "bg-blue-500" },
        emerald: { text: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-t-emerald-500", bar: "bg-emerald-500" },
        yellow: { text: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-t-yellow-500", bar: "bg-yellow-500" },
        red: { text: "text-red-400", bg: "bg-red-500/20", border: "border-t-red-500", bar: "bg-red-500" },
        pink: { text: "text-pink-400", bg: "bg-pink-500/20", border: "border-t-pink-500", bar: "bg-pink-500" },
        indigo: { text: "text-indigo-400", bg: "bg-indigo-500/20", border: "border-t-indigo-500", bar: "bg-indigo-500" },
        cyan: { text: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-t-cyan-500", bar: "bg-cyan-500" },
        violet: { text: "text-violet-400", bg: "bg-violet-500/20", border: "border-t-violet-500", bar: "bg-violet-500" },
        lime: { text: "text-lime-400", bg: "bg-lime-500/20", border: "border-t-lime-500", bar: "bg-lime-500" },
    } as any;

    const c = colorClasses[color];

    return (
        <div className={cn("glass-card card-hover p-6 rounded-2xl cursor-pointer group hover:-translate-y-1 transition-all border-t-4", c.border)}>
            <div className="flex justify-between items-start mb-4">
                <div className={cn("size-10 rounded-lg flex items-center justify-center", c.bg)}>
                    <Icon className={cn("w-6 h-6", c.text)} />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{number}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{desc}</p>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={cn("progress-fill h-full transition-all", c.bar)} style={{ width: percent }}></div>
            </div>
        </div>
    )
}

function BenefitCard({ icon: Icon, title, list, color }: any) {
    const colorClasses = {
        blue: { bg: "bg-blue-600/20", icon: "text-blue-400" },
        yellow: { bg: "bg-[#FFD700]/20", icon: "text-[#FFD700]" },
        purple: { bg: "bg-purple-600/20", icon: "text-purple-400" },
    } as any;
    const c = colorClasses[color];

    return (
        <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className={cn("size-12 rounded-full flex items-center justify-center", c.bg)}>
                    <Icon className={cn("w-6 h-6", c.icon)} />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <ul className="space-y-4 text-sm text-slate-400">
                {list.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
