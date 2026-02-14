"use client";

import React from 'react';
import { Icon } from "@/components/ui/Icon";

export default function IssuerPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] font-[family-name:var(--font-space-grotesk)] text-slate-900 dark:text-white antialiased selection:bg-[#1313ec] selection:text-white min-h-screen flex flex-col overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#3b3b54] bg-white/95 dark:bg-[#101022]/95 backdrop-blur px-6 py-3 lg:px-10">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#1313ec]/20 text-[#1313ec]">
                        <Icon name="Box" className="text-2xl" />
                    </div>
                    <h2 className="dark:text-white text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden lg:flex items-center gap-9">
                        <a className="text-slate-500 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white transition-colors text-sm font-medium leading-normal" href="#">Dashboard</a>
                        <a className="text-[#1313ec] dark:text-white text-sm font-medium leading-normal" href="#">Issuer</a>
                        <a className="text-slate-500 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white transition-colors text-sm font-medium leading-normal" href="#">Templates</a>
                        <a className="text-slate-500 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white transition-colors text-sm font-medium leading-normal" href="#">Settings</a>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1313ec] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(19,19,236,0.5)]">
                            <span className="truncate mr-2">Connected</span>
                            <span className="text-xs opacity-70 font-mono">0x4a...9f2</span>
                        </button>
                        <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-[#1c1c27] border border-slate-200 dark:border-[#3b3b54] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#2a2a35] transition-colors">
                            <Icon name="Bell" className="text-[20px]" />
                        </button>
                        <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-[#1c1c27] border border-slate-200 dark:border-[#3b3b54] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#2a2a35] transition-colors">
                            <Icon name="HelpCircle" className="text-[20px]" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="layout-container flex h-full grow flex-col px-4 md:px-10 lg:px-40 py-8">
                <div className="layout-content-container flex flex-col max-w-[1280px] mx-auto w-full flex-1">
                    {/* Page Heading */}
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Node Active</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Polygon Mainnet</span>
                            </div>
                            <h1 className="dark:text-white text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Verifiable Credential Issuer</h1>
                            <p className="text-slate-500 dark:text-[#9d9db9] text-base font-normal leading-normal">Manage, mint, and track blockchain-backed digital certificates.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex h-10 px-4 items-center justify-center rounded-lg border border-slate-200 dark:border-[#3b3b54] bg-white dark:bg-[#1c1c27] hover:bg-slate-100 dark:hover:bg-[#2a2a35] text-slate-900 dark:text-white text-sm font-bold transition-colors">
                                <Icon name="FileJson" className="mr-2 text-lg" />
                                View Smart Contract
                            </button>
                            <button className="flex h-10 px-4 items-center justify-center rounded-lg border border-slate-200 dark:border-[#3b3b54] bg-white dark:bg-[#1c1c27] hover:bg-slate-100 dark:hover:bg-[#2a2a35] text-slate-900 dark:text-white text-sm font-bold transition-colors">
                                <Icon name="Upload" className="mr-2 text-lg" />
                                Batch Upload (CSV)
                            </button>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                        {/* Left Column: Issuance Form */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="p-6 rounded-xl bg-white dark:bg-[#1c1c27] border border-slate-200 dark:border-[#3b3b54]">
                                <h3 className="dark:text-white text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
                                    <Icon name="FileEdit" className="text-[#1313ec]" />
                                    Credential Details
                                </h3>
                                <div className="flex flex-col gap-5">
                                    <label className="flex flex-col w-full">
                                        <p className="dark:text-white text-slate-900 text-sm font-medium leading-normal pb-2">Recipient Name</p>
                                        <input className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#1313ec]/50 border border-slate-200 dark:border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#101022] h-12 placeholder:text-slate-400 dark:placeholder:text-[#9d9db9] px-4 text-sm font-normal transition-all" placeholder="e.g. Jane Doe" defaultValue="Arjun V." />
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <p className="dark:text-white text-slate-900 text-sm font-medium leading-normal pb-2">Recipient Wallet / Email</p>
                                        <div className="relative">
                                            <input className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#1313ec]/50 border border-slate-200 dark:border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#101022] h-12 placeholder:text-slate-400 dark:placeholder:text-[#9d9db9] px-4 text-sm font-mono transition-all" placeholder="0x..." defaultValue="0x71C...92F" />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 text-xs font-mono bg-green-500/10 dark:bg-green-900/30 px-2 py-1 rounded">Valid ENS</div>
                                        </div>
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <p className="dark:text-white text-slate-900 text-sm font-medium leading-normal pb-2">Certification Type</p>
                                        <div className="relative">
                                            <select className="appearance-none flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#1313ec]/50 border border-slate-200 dark:border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#101022] h-12 px-4 text-sm font-normal cursor-pointer">
                                                <option value="">Select Certification Type</option>
                                                <option defaultValue="blockchain-dev">Advanced Blockchain Development</option>
                                                <option value="smart-contract">Smart Contract Auditing</option>
                                                <option value="defi-arch">DeFi Architecture</option>
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-[#9d9db9]">
                                                <Icon name="ChevronDown" />
                                            </div>
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="flex flex-col w-full">
                                            <p className="dark:text-white text-slate-900 text-sm font-medium leading-normal pb-2">Issue Date</p>
                                            <input className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#1313ec]/50 border border-slate-200 dark:border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#101022] h-12 px-4 text-sm font-normal" type="date" defaultValue="2023-10-27" />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <p className="dark:text-white text-slate-900 text-sm font-medium leading-normal pb-2">Expiration (Optional)</p>
                                            <input className="form-input flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#1313ec]/50 border border-slate-200 dark:border-[#3b3b54] bg-[#f6f6f8] dark:bg-[#101022] h-12 px-4 text-sm font-normal" type="date" />
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#3b3b54] flex flex-col gap-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 dark:text-[#9d9db9]">Estimated Gas Fee:</span>
                                        <span className="dark:text-white text-slate-900 font-mono font-bold">~0.004 ETH ($12.50)</span>
                                    </div>
                                    <button className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-[#1313ec] text-white text-base font-bold leading-normal tracking-wide hover:bg-blue-600 transition-all shadow-lg shadow-[#1313ec]/20">
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                        <Icon name="BadgeCheck" className="mr-2" />
                                        Sign & Issue Credential
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Preview */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="dark:text-white text-slate-900 text-xl font-bold flex items-center gap-2">
                                    <Icon name="Eye" className="text-purple-400" />
                                    Live Preview
                                </h3>
                                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <span className="size-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                    Draft Mode
                                </span>
                            </div>
                            {/* Certificate Card */}
                            <div className="relative w-full aspect-[1.6/1] rounded-xl p-8 md:p-12 flex flex-col justify-between overflow-hidden group bg-gradient-to-br from-[#1c1f27] to-[#101622] border border-[#3b3b54] shadow-[0_0_20px_rgba(19,19,236,0.1)]">
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1313ec]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                                {/* Grid Pattern Overlay */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                                {/* Header */}
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-white text-[#101022] rounded flex items-center justify-center font-bold text-xl">
                                            <Icon name="GraduationCap" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm">PPSDM KMM</h4>
                                            <p className="text-white/60 text-xs">Official Digital Credential</p>
                                        </div>
                                    </div>
                                    <div className="size-20 bg-white p-1 rounded-lg">
                                        {/* QR Code Placeholder */}
                                        <img alt="QR Code verification link" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLxOGvMzBQF7zkCyB-sJ4ISSGf3E7ovPseViGzey1f2jNMbi4vRVLdcGWpFR4P4PcA6VUxEtUP7l2eYfsLTqRuCroFpiEKP_N7YbcVfZpU5zPaj5pPK6wIEtxQ8M287tGhYJGQYO8xJOcfLY2sekr628kVI9_Qdwqm_gZ7NSEEhW-XEkH7E7nk1i6RKeb81lt___8lG48G0_YBeQf4ElPyHUewn4WJKfHEUWLCGor3W4BS_D02OOhXDweC0FDjQcAgAwYm6BjbxN4" />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="relative z-10 flex flex-col items-center text-center my-auto">
                                    <p className="text-[#1313ec] font-medium tracking-widest text-xs uppercase mb-2">This certifies that</p>
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Arjun V.</h2>
                                    <p className="text-white/80 text-sm md:text-base max-w-md mx-auto">Has successfully completed all requirements for the professional certification in</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-[#1313ec] mt-2">Advanced Blockchain Development</h3>
                                </div>

                                {/* Footer */}
                                <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Credential ID</span>
                                        <span className="font-mono text-xs text-white/80">CRED-8829-1029-XJ</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Block Height</span>
                                        <span className="font-mono text-xs text-white/80">#18,293,001</span>
                                    </div>
                                </div>
                                {/* Holographic Strip */}
                                <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                            </div>

                            {/* JSON Data Preview (Collapsed) */}
                            <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-[#9d9db9] border border-[#3b3b54] overflow-hidden">
                                <div className="flex items-center gap-2 mb-2 text-white/60">
                                    <Icon name="Code" className="text-sm" />
                                    <span>Metadata Preview</span>
                                </div>
                                <p className="break-all opacity-70">
                                    {`{"issuer": "did:ethr:0x123...", "credentialSubject": {"id": "did:ethr:0x71C...", "degree": "Advanced Blockchain Development"}}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Log Table */}
                    <div className="flex flex-col gap-4">
                        <h3 className="dark:text-white text-slate-900 text-xl font-bold px-1">Issuance History</h3>
                        <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-[#3b3b54] bg-white dark:bg-[#1c1c27]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-500 dark:text-[#9d9db9]">
                                    <thead className="bg-[#f6f6f8] dark:bg-[#232330] text-xs uppercase dark:text-white text-slate-700 font-bold">
                                        <tr>
                                            <th className="px-6 py-4" scope="col">Status</th>
                                            <th className="px-6 py-4" scope="col">Recipient</th>
                                            <th className="px-6 py-4" scope="col">Credential Type</th>
                                            <th className="px-6 py-4" scope="col">Transaction Hash</th>
                                            <th className="px-6 py-4" scope="col">Date</th>
                                            <th className="px-6 py-4 text-right" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-[#3b3b54]">
                                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                                    <span className="size-1.5 rounded-full bg-green-500"></span>
                                                    Confirmed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium dark:text-white text-slate-900 flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
                                                Sarah J.
                                            </td>
                                            <td className="px-6 py-4">Smart Contract Auditing</td>
                                            <td className="px-6 py-4 font-mono text-xs text-[#1313ec] cursor-pointer hover:underline">0x8a7...2b19</td>
                                            <td className="px-6 py-4">Oct 26, 2023</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white p-1">
                                                    <Icon name="ExternalLink" className="text-lg" />
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                    <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium dark:text-white text-slate-900 flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-gradient-to-tr from-orange-500 to-red-500"></div>
                                                Mike R.
                                            </td>
                                            <td className="px-6 py-4">DeFi Architecture</td>
                                            <td className="px-6 py-4 font-mono text-xs text-[#1313ec] cursor-pointer hover:underline">0x3f2...9c1a</td>
                                            <td className="px-6 py-4">Oct 26, 2023</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white p-1">
                                                    <Icon name="ExternalLink" className="text-lg" />
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                                    <span className="size-1.5 rounded-full bg-green-500"></span>
                                                    Confirmed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium dark:text-white text-slate-900 flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-gradient-to-tr from-green-500 to-teal-500"></div>
                                                Elena K.
                                            </td>
                                            <td className="px-6 py-4">Blockchain Fundamentals</td>
                                            <td className="px-6 py-4 font-mono text-xs text-[#1313ec] cursor-pointer hover:underline">0x1d9...4a22</td>
                                            <td className="px-6 py-4">Oct 25, 2023</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 dark:text-[#9d9db9] hover:text-[#1313ec] dark:hover:text-white p-1">
                                                    <Icon name="ExternalLink" className="text-lg" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#3b3b54] px-6 py-3 bg-[#f6f6f8] dark:bg-[#232330]">
                                <p className="text-xs text-slate-500 dark:text-[#9d9db9]">Showing 3 of 1,204 transactions</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 rounded border border-slate-200 dark:border-[#3b3b54] bg-white dark:bg-[#1c1c27] text-xs text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">Previous</button>
                                    <button className="px-3 py-1 rounded border border-slate-200 dark:border-[#3b3b54] bg-white dark:bg-[#1c1c27] text-xs text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #101022; 
        }
        ::-webkit-scrollbar-thumb {
            background: #3b3b54; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #4f4f6e; 
        }

      `}</style>
        </div>
    );
}
