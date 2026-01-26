import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-its-dark font-sans text-slate-200 selection:bg-brand-blue selection:text-white overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-its-dark/80 backdrop-blur-lg">
                <div className="flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-its-blue to-brand-blue shadow-lg shadow-brand-blue/20">
                            <span className="material-symbols-outlined text-white">analytics</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-heading tracking-tight text-white leading-none">PPSDM KMM</span>
                            <span className="text-[10px] uppercase tracking-widest text-its-gold font-bold">ITS Surabaya</span>
                        </div>
                    </div>
                    <nav className="hidden lg:flex items-center gap-10">
                        <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#how-it-works">Metodologi</Link>
                        <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#dimensions">9 Dimensi</Link>
                        <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#demo">Mission Control</Link>
                        <Link className="text-sm font-medium hover:text-brand-accent transition-colors" href="#faq">FAQ</Link>
                        <Link href="/auth/login">
                            <button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-blue/30 active:scale-95">
                                Mulai Sekarang
                            </button>
                        </Link>
                    </nav>
                    <button className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden its-gradient">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="relative z-10 max-w-5xl mx-auto">
                        <div className="inline-flex items-center gap-3 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold text-brand-accent backdrop-blur-md mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                            </span>
                            Join 12,450+ ITS Students Shaping the Future
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading tracking-tighter text-white leading-[1.05] mb-8">
                            Elevate Your <br />
                            <span className="gradient-text">Human Capital</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            Platform pengembangan terpadu berbasis data untuk mahasiswa ITS. Bangun portofolio kompetensi melalui asesmen presisi, roadmap terukur, dan bimbingan mentor eksklusif.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/onboarding">
                                <button className="w-full sm:w-auto px-8 py-5 bg-white text-its-blue font-bold rounded-2xl hover:bg-brand-accent transition-all hover:scale-105 shadow-2xl shadow-brand-accent/20 flex items-center justify-center gap-2 text-lg">
                                    Mulai Assessment Gratis
                                    <span className="material-symbols-outlined">bolt</span>
                                </button>
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-5 glass-card text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg border-white/20">
                                <span className="material-symbols-outlined">play_circle</span>
                                Tonton Demo
                            </button>
                        </div>
                        <div className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-white">9</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold">Dimensi Utama</span>
                            </div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-white">450+</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold">Materi Kursus</span>
                            </div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-white">100%</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold">Kurikulum ITS</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Methodology Section */}
                <section className="py-24 px-6 lg:px-12 bg-[#05080F]" id="how-it-works">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">Metodologi Kami</h2>
                            <p className="text-slate-400">Transformasi potensi menjadi aksi melalui 4 langkah strategis.</p>
                        </div>
                        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-4/5 h-px timeline-line"></div>
                            <div className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-all duration-500 border-brand-blue/30 scale-110">
                                    <span className="material-symbols-outlined text-4xl text-brand-accent">psychology</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">1. Assessment</h3>
                                <p className="text-sm text-slate-500 max-w-[200px]">Uji 9 dimensi kompetensi dasar Anda dengan AI-driven testing.</p>
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-all duration-500 border-brand-blue/30">
                                    <span className="material-symbols-outlined text-4xl text-brand-accent">map</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">2. Roadmap</h3>
                                <p className="text-sm text-slate-500 max-w-[200px]">Dapatkan rencana belajar personal sesuai minat dan gap kompetensi.</p>
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-all duration-500 border-brand-blue/30">
                                    <span className="material-symbols-outlined text-4xl text-brand-accent">groups_3</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">3. Mentorship</h3>
                                <p className="text-sm text-slate-500 max-w-[200px]">Bimbingan langsung dari alumni dan profesional industri.</p>
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-all duration-500 border-brand-blue/30">
                                    <span className="material-symbols-outlined text-4xl text-brand-accent">verified</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">4. Portfolio</h3>
                                <p className="text-sm text-slate-500 max-w-[200px]">Klaim sertifikat dan hasilkan portofolio yang divalidasi ITS.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9 Dimensions Section */}
                <section className="py-24 px-6 lg:px-12" id="dimensions">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl font-bold font-heading text-white mb-4">The 9 Dimensions</h2>
                                <p className="text-slate-400 max-w-xl">Kurikulum komprehensif yang membagi pengembangan menjadi kategori Hard Skills yang teknis dan Soft Skills yang esensial.</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="px-4 py-2 rounded-full border border-brand-blue text-brand-blue text-xs font-bold uppercase tracking-wider">Soft Skills Focus</span>
                                <span className="px-4 py-2 rounded-full border border-its-gold text-its-gold text-xs font-bold uppercase tracking-wider">Hard Skills Focus</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="glass-card card-hover p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all border-l-4 border-l-brand-blue">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-14 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-brand-blue">diversity_3</span>
                                    </div>
                                    <span className="text-xs font-bold text-brand-blue uppercase">Soft Skill</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Leadership</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Mampu mengarahkan visi dan menginspirasi tim dalam lingkungan yang dinamis.</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="progress-fill h-full bg-brand-blue w-[65%] transition-all"></div>
                                </div>
                            </div>
                            {/* Card 2 */}
                            <div className="glass-card card-hover p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all border-l-4 border-l-its-gold">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-14 rounded-xl bg-its-gold/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-its-gold">code</span>
                                    </div>
                                    <span className="text-xs font-bold text-its-gold uppercase">Hard Skill</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Tech Mastery</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Penguasaan perangkat lunak dan metodologi engineering standar global.</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="progress-fill h-full bg-its-gold w-[40%] transition-all"></div>
                                </div>
                            </div>
                            {/* Card 3 */}
                            <div className="glass-card card-hover p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all border-l-4 border-l-brand-blue">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-14 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-brand-blue">forum</span>
                                    </div>
                                    <span className="text-xs font-bold text-brand-blue uppercase">Soft Skill</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Communication</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Keahlian menyampaikan ide kompleks secara sederhana dan persuasif.</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="progress-fill h-full bg-brand-blue w-[80%] transition-all"></div>
                                </div>
                            </div>
                            {/* Card 4 */}
                            <div className="glass-card card-hover p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all border-l-4 border-l-its-gold">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-14 rounded-xl bg-its-gold/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-its-gold">analytics</span>
                                    </div>
                                    <span className="text-xs font-bold text-its-gold uppercase">Hard Skill</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Data Analytics</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Pengambilan keputusan berbasis data menggunakan tools statistik modern.</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="progress-fill h-full bg-its-gold w-[25%] transition-all"></div>
                                </div>
                            </div>
                            {/* Card 5 */}
                            <div className="glass-card card-hover p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all border-l-4 border-l-brand-blue">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-14 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-brand-blue">auto_fix_high</span>
                                    </div>
                                    <span className="text-xs font-bold text-brand-blue uppercase">Soft Skill</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Ethics & Growth</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Integritas akademik dan mentalitas pembelajar sepanjang hayat.</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="progress-fill h-full bg-brand-blue w-[90%] transition-all"></div>
                                </div>
                            </div>
                            {/* Card 6 */}
                            <div className="glass-card card-hover p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all border-l-4 border-l-its-gold">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-14 rounded-xl bg-its-gold/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-its-gold">business_center</span>
                                    </div>
                                    <span className="text-xs font-bold text-its-gold uppercase">Hard Skill</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Project Management</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Manajemen sumber daya dan waktu melalui framework Agile/Scrum.</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="progress-fill h-full bg-its-gold w-[55%] transition-all"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Demo Section */}
                <section className="py-24 px-6 lg:px-12 bg-white/5 relative overflow-hidden" id="demo">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]"></div>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/2 space-y-8">
                                <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">Mission Control <br /><span className="text-brand-accent">Personal Dashboard</span></h2>
                                <p className="text-slate-400 text-lg leading-relaxed">Rasakan langsung visualisasi radar kompetensi Anda. Platform kami melacak pertumbuhan setiap dimensi secara real-time untuk memastikan Anda tetap di jalur kesuksesan.</p>
                                <div className="space-y-6">
                                    <div className="glass-card p-6 rounded-2xl border-brand-blue/20">
                                        <p className="text-brand-accent text-xs font-bold mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">quiz</span>
                                            MINI ASSESSMENT PREVIEW
                                        </p>
                                        <div className="space-y-4">
                                            <p className="text-white font-medium">Bagaimana Anda bereaksi terhadap kegagalan tim yang Anda pimpin?</p>
                                            <div className="grid gap-3">
                                                <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-brand-blue/20 border border-white/10 hover:border-brand-blue/50 transition-all text-sm">A. Evaluasi proses dan tanggung jawab bersama</button>
                                                <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-brand-blue/20 border border-white/10 hover:border-brand-blue/50 transition-all text-sm">B. Mencari individu yang membuat kesalahan utama</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full max-w-[550px]">
                                <div className="glass-card p-8 rounded-[2.5rem] border-white/10 relative">
                                    <div className="absolute top-8 left-8">
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
                                            <circle className="cursor-pointer shadow-lg" cx="100" cy="40" fill="#fff" r="5"></circle>
                                            <circle className="cursor-pointer shadow-lg" cx="150" cy="80" fill="#fff" r="5"></circle>
                                            <circle className="cursor-pointer shadow-lg" cx="140" cy="130" fill="#fff" r="5"></circle>
                                        </svg>
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">LEADERSHIP</div>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">ETHICS</div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold rotate-90 origin-right -mr-4">TECH</div>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold -rotate-90 origin-left -ml-4">SOCIAL</div>
                                    </div>
                                    <div className="mt-8 flex justify-between items-center bg-brand-blue/10 p-4 rounded-xl">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Development Status</p>
                                            <p className="text-white font-bold">Growth Potential: 85%</p>
                                        </div>
                                        <span className="material-symbols-outlined text-brand-accent animate-bounce">rocket_launch</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Success Stories */}
                <section className="py-24 px-6 lg:px-12 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold font-heading text-white">Student Success Stories</h2>
                            <p className="text-slate-400">Bukti nyata transformasi kompetensi mahasiswa ITS.</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 glass-card p-8 rounded-3xl relative">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-accent flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-xl">
                                        <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5SVVpH4Be-WqS0W1VPrxzjlB3vbZb4C-UE7mFxtbTzc9QISczBj8vA_ABHpRX7wQ8MOfsZkOEgPcHisOEiDbuueRsHz3_jiQjEk4uPefakcBGCmRR665cDvRnob5C_bdkRs4--_0Iu_rQsQnXNBxTmJeA_OW5SMiyO18xVXrLNzdGPw3RtSlgknXFDGfe_W52p6k4bukffT4Oc8Yhye_4pBtlN-T20ZzFSqUCbRxgymNI0b4R7XkNCS5ggui_ngcch8eCuFgdguM" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Rizky Maulana</h4>
                                        <p className="text-slate-500 text-xs">Teknik Mesin '21</p>
                                    </div>
                                </div>
                                <p className="italic text-slate-300 mb-8 font-light">"Sebelum ikut PPSDM, saya kesulitan berorganisasi. Setelah roadmap 6 bulan, saya terpilih jadi Ketua Himpunan."</p>
                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Leadership</p>
                                        <p className="text-brand-accent font-bold">+150% Increase</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Career Status</p>
                                        <p className="text-white font-bold">Intern @ Pertamina</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 glass-card p-8 rounded-3xl relative border-brand-blue/20 bg-brand-blue/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-16 rounded-2xl bg-gradient-to-tr from-its-gold to-orange-400 flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-xl">
                                        <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb-aNlXgtqk-22vz2E74FIlapMvtcjzMSbEdYJWqzksp22VO5cPha0FZeTgaqRynHJktg-YEchq3bkqqxhWAZEyivY1A3U-dauRwS-jOESr49qPfH_5N166P4xI91j0yS57NlNgmvWCzzHom5w1S1VtBPdpp-izUFI1K_yoversEgQBoIR_joSpRkWci6Y1b4xZuY0-bg3yfPYRGhR_QNkByGIQbEjecI5LKkSvPbJkA-CCfvv5Rf6NaFBdb575l4UXdQ_qR-NFnE" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Ayu Lestari</h4>
                                        <p className="text-slate-500 text-xs">Sistem Informasi '22</p>
                                    </div>
                                </div>
                                <p className="italic text-slate-300 mb-8 font-light">"Program mentorship menghubungkan saya dengan alumni yang sekarang jadi atasan saya di tech startup."</p>
                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Communication</p>
                                        <p className="text-brand-accent font-bold">Mastery Level</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Impact</p>
                                        <p className="text-white font-bold">Top 10 Finalist PKM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 px-6 lg:px-12 bg-[#05080F]" id="faq">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-heading text-white">Pertanyaan Sering Diajukan</h2>
                        </div>
                        <div className="space-y-4">
                            <details className="group glass-card rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                                <summary className="flex items-center justify-between text-white font-bold list-none">
                                    Apakah program ini gratis untuk mahasiswa ITS?
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <p className="mt-4 text-slate-400 text-sm leading-relaxed">Ya, seluruh fitur dasar, assessment, dan akses materi digital tersedia secara gratis bagi seluruh mahasiswa aktif ITS melalui SSO.</p>
                            </details>
                            <details className="group glass-card rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                                <summary className="flex items-center justify-between text-white font-bold list-none">
                                    Bagaimana cara mendapatkan bimbingan mentor?
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <p className="mt-4 text-slate-400 text-sm leading-relaxed">Anda perlu menyelesaikan assessment awal dan mencapai 'Roadmap Level 3' untuk membuka akses ke fitur penjadwalan mentor.</p>
                            </details>
                        </div>
                        <div className="mt-20 p-10 rounded-[2.5rem] bg-gradient-to-br from-its-blue/40 to-brand-blue/20 border border-white/10 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-6">Siap Memulai Perjalanan Anda?</h3>
                                <p className="text-slate-300 mb-8 max-w-xl mx-auto">Dapatkan Digital Brochure PPSDM KMM 2024 dan tips pengembangan diri mingguan langsung di email Anda.</p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                    <input className="flex-1 bg-its-dark/50 border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-accent focus:ring-0 transition-all" placeholder="Email ITS Anda (e.g. mhs@its.ac.id)" type="email" />
                                    <button className="bg-white text-its-blue font-bold px-8 py-3 rounded-xl hover:bg-brand-accent transition-all whitespace-nowrap">Dapatkan Info</button>
                                </div>
                                <button className="mt-8 text-brand-accent text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:underline">
                                    <span className="material-symbols-outlined">download</span>
                                    Download Full Brochure (PDF 4.2 MB)
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-its-dark pt-20 pb-10 px-6 lg:px-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-its-blue font-black shadow-xl">ITS</div>
                                <h2 className="text-xl font-bold font-heading text-white">Institut Teknologi Sepuluh Nopember</h2>
                            </div>
                            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">Pusat Pengembangan Sumber Daya Manusia - KMM ITS berfokus pada integrasi pendidikan akademik dan pembentukan karakter unggul.</p>
                            <div className="flex gap-4">
                                <a className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-all text-white" href="#"><span className="material-symbols-outlined text-lg">public</span></a>
                                <a className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-all text-white" href="#"><span className="material-symbols-outlined text-lg">mail</span></a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6">Program</h3>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-brand-accent transition-colors" href="#">Assessment Mandiri</a></li>
                                <li><a className="hover:text-brand-accent transition-colors" href="#">Bootcamp Kompetensi</a></li>
                                <li><a className="hover:text-brand-accent transition-colors" href="#">Mentorship Karir</a></li>
                                <li><a className="hover:text-brand-accent transition-colors" href="#">Katalog Soft Skills</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-6">Kontak</h3>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">location_on</span> Kampus ITS Sukolilo, Surabaya</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">phone</span> +62-31-5994251</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">alternate_email</span> ppsdm@its.ac.id</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <p>© 2024 PPSDM KMM ITS. Developed for Excellence.</p>
                        <div className="flex gap-8">
                            <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-white transition-colors" href="#">Cookie Policy</a>
                            <a className="hover:text-white transition-colors" href="#">Accessibility</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
