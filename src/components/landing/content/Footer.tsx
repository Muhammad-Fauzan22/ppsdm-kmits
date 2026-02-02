"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-white font-bold text-xl mb-4">PPSDM KMITS</h3>
                        <p className="text-sm leading-relaxed mb-6">
                            Holistic Student Development Ecosystem. Platform pengembangan mahasiswa pertama berbasis sains di Indonesia.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/#dimensions" className="hover:text-brand-blue transition-colors">9 Dimensi</Link></li>
                            <li><Link href="/#assessment" className="hover:text-brand-blue transition-colors">Sistem Assessment</Link></li>
                            <li><Link href="/dashboard" className="hover:text-brand-blue transition-colors">Dashboard</Link></li>
                            <li><Link href="/lms" className="hover:text-brand-blue transition-colors">LMS</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-brand-blue transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/research" className="hover:text-brand-blue transition-colors">Metodologi Riset</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Gedung Rektorat ITS, Surabaya</li>
                            <li>ppsdm@its.ac.id</li>
                            <li>(031) 599-4251</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© 2026 PPSDM KMITS - Institut Teknologi Sepuluh Nopember.</p>
                    <div className="flex gap-4">
                        <span>Made with ❤️ by ITS Students</span>
                        <span>v3.1.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
