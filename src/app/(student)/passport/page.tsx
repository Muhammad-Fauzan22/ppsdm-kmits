"use client";

import {
    Fingerprint,
    Wallet,
    Menu,
    Activity,
    Verified,
    Share2,
    Download,
    Award,
    History as HistoryIcon,
    CheckCircle,
    Plus,
    Disc
} from 'lucide-react';

export default function PassportPage() {
    return (
        <div className="bg-[#f6f6f8] dark:bg-[#101022] font-[family-name:var(--font-space-grotesk)] text-slate-900 dark:text-white antialiased selection:bg-[#1313ec] selection:text-white">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                {/* Top Navigation */}
                <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-[#f6f6f8]/80 dark:bg-[#101022]/80 backdrop-blur-md px-10 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-[#1313ec]/20 text-[#1313ec]">
                            <Fingerprint className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] dark:text-white text-slate-900">
                            PPSDM KMM <span className="text-[#1313ec] text-sm font-normal opacity-80 ml-2 border-l border-slate-600 pl-2">Future Tech</span>
                        </h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                        <nav className="flex items-center gap-9">
                            <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors text-slate-600 dark:text-slate-300" href="#">Dashboard</a>
                            <a className="text-sm font-bold leading-normal text-[#1313ec]" href="#">Blockfolio</a>
                            <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors text-slate-600 dark:text-slate-300" href="#">Marketplace</a>
                            <a className="text-sm font-medium leading-normal hover:text-[#1313ec] transition-colors text-slate-600 dark:text-slate-300" href="#">Verify</a>
                        </nav>
                        <div className="flex gap-3">
                            <div className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-slate-200 dark:bg-[#1a1a2e] border border-slate-300 dark:border-slate-700">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Polygon Mainnet</span>
                            </div>
                            <button className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-[#1313ec] text-white text-sm font-bold shadow-[0_0_15px_rgba(19,19,236,0.5)] hover:bg-blue-700 transition-all">
                                <Wallet className="w-[18px] h-[18px]" />
                                <span className="truncate">0x4a...e71f</span>
                            </button>
                        </div>
                    </div>
                    <button className="md:hidden text-slate-900 dark:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Main Layout */}
                <main className="flex-grow px-4 md:px-10 lg:px-40 py-8 w-full max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Identity Passport */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Holographic Passport Card */}
                            <div className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-[#1313ec]/20 bg-[#101022]/70 backdrop-blur-xl shadow-2xl">
                                {/* Holo Shine Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1313ec]/10 to-white/5 opacity-20 pointer-events-none"></div>
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#1313ec]/20 blur-[60px] rounded-full"></div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#1313ec] to-transparent">
                                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#101022] relative">
                                                <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkjiSulwbbPkWUt4F9SpAekL_dlAiy9-QztqwLFmWZK2dk9HUj61lvJr4iu4taQaxt6Mt462K0_JZAchKWTUBCVkoPxi_Tb_fMYyqqaFrzHALSSbZtHo__sBJ-mwrGpkYg4JtyEJYlqj8VB5t8dC2-5llBHDws3b6xpx9lGQGOyN2LaK6XjP6i01qQxPlT3BgKlQAI8yqoGRdi1tvU9I1J-GjqNvPFmJOcs7RGFFW7HgWSOckzt3yImYZx0qVIgcgOcIas9ERS0W8")' }}></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 bg-[#101022] p-1.5 rounded-full border border-slate-700">
                                            <Verified className="text-green-500 w-5 h-5" />
                                        </div>
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-1">Alex Chen</h1>
                                    <p className="text-[#1313ec] font-mono text-sm mb-6 bg-[#1313ec]/10 px-3 py-1 rounded-full border border-[#1313ec]/20">Student ID: #882190</p>
                                    <div className="w-full grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-[#101022]/50 p-3 rounded-lg border border-slate-700/50">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Level</p>
                                            <p className="text-white font-bold text-lg">Scholar V</p>
                                        </div>
                                        <div className="bg-[#101022]/50 p-3 rounded-lg border border-slate-700/50">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Reputation</p>
                                            <p className="text-green-400 font-bold text-lg">98/100</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-white p-4 rounded-lg mb-4">
                                        {/* QR Code Placeholder */}
                                        <div className="bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example')] bg-center bg-contain bg-no-repeat w-full h-32 mix-blend-multiply opacity-90"></div>
                                        <p className="text-black text-center text-[10px] font-mono mt-2 tracking-tight">SCAN TO VERIFY CREDENTIALS</p>
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono break-all text-center">
                                        DID:polygon:0x4a...e71f
                                    </div>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <button className="w-full flex items-center justify-center gap-3 rounded-xl h-12 bg-[#1313ec] text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 group">
                                    <Share2 className="w-5 h-5 group-hover:animate-pulse" />
                                    Share Passport Link
                                </button>
                                <button className="w-full flex items-center justify-center gap-3 rounded-xl h-12 bg-[#f6f6f8] dark:bg-[#1a1a2e] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                                    <Download className="w-5 h-5" />
                                    Download Proof (JSON)
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Content */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            {/* Stats Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#f6f6f8] dark:bg-[#1a1a2e] border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold dark:text-white text-slate-900">15</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Skill NFTs</p>
                                    </div>
                                </div>
                                <div className="bg-[#f6f6f8] dark:bg-[#1a1a2e] border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                        <HistoryIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold dark:text-white text-slate-900">3 Years</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">On-Chain History</p>
                                    </div>
                                </div>
                                <div className="bg-[#f6f6f8] dark:bg-[#1a1a2e] border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold dark:text-white text-slate-900">100%</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Verification Rate</p>
                                    </div>
                                </div>
                            </div>
                            {/* Filter Tabs */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                                <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                                    Verified Assets
                                    <span className="text-xs bg-[#1313ec]/20 text-[#1313ec] px-2 py-1 rounded-full">NFTs</span>
                                </h2>
                                <div className="flex gap-2 p-1 bg-[#f6f6f8] dark:bg-[#1a1a2e] rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full">
                                    <button className="px-4 py-2 rounded-md bg-[#1313ec] text-white text-sm font-medium whitespace-nowrap shadow-sm">All Assets</button>
                                    <button className="px-4 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium whitespace-nowrap transition-colors">Technical</button>
                                    <button className="px-4 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium whitespace-nowrap transition-colors">Soft Skills</button>
                                    <button className="px-4 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium whitespace-nowrap transition-colors">Projects</button>
                                </div>
                            </div>
                            {/* NFT Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* NFT Card 1 */}
                                <div className="group relative perspective-1000 h-[340px] cursor-pointer">
                                    <div className="absolute inset-0 bg-[#f6f6f8] dark:bg-[#1a1a2e] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-[#1313ec] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(19,19,236,0.3)]">
                                        {/* Card Image Area */}
                                        <div className="h-48 w-full bg-[#0a0a14] relative overflow-hidden p-4 flex items-center justify-center">
                                            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-[#101022] to-[#101022]"></div>
                                            <img className="w-full h-full object-cover rounded-lg opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp51gMMcBFjoUyn6MsdZtD_Ka37XK3AQN0z2oqV_RtVn8SeWAytqmtObkVt3JHHpc0OhQ2t7eq1vtlMjrJaHcXH3DPif97RFi4mjCvSXPgTD3ZLPM8c9_wuitQ6fBQ5g5N74UnHn-Gr6NyLagX2HLO6zbq88RuxqZYzkx8twSH4jY6WfnZzh6UQclL3K4w2cuVYIScVuc1BQwAFt8OP4MLhQGRbAEikABFkjy-1f12JWec-Wkw-W3SLmU3wQIS0OWEPk6jD77aUnk" alt="Code screen showing Python script" />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-white border border-white/10">ERC-721</div>
                                        </div>
                                        {/* Card Content */}
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#1313ec] transition-colors">Advanced Python</h3>
                                                <Verified className="text-green-500 w-5 h-5" />
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">Mastery of asynchronous programming, decorators, and data structures.</p>
                                            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <span>ID: #4092</span>
                                                <span className="text-[#1313ec] group-hover:underline">View on PolygonScan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* NFT Card 2 */}
                                <div className="group relative perspective-1000 h-[340px] cursor-pointer">
                                    <div className="absolute inset-0 bg-[#f6f6f8] dark:bg-[#1a1a2e] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-[#1313ec] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(19,19,236,0.3)]">
                                        <div className="h-48 w-full bg-[#0a0a14] relative overflow-hidden p-4 flex items-center justify-center">
                                            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-[#101022] to-[#101022]"></div>
                                            <img className="w-full h-full object-cover rounded-lg opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpTKt-8yzuK5YPA0Qw7JAckxoDa9HTlHZy07jxLHXTPqq4o8p2P8iRIQjaVFhZAxTjPGH_DaiBdJTm3zcDcJUIa2FCWNcUjeHDjtARJsYDf0HSiYooLyr41JE-sAiVNoSuFvh5WbLCzBvDoJYrxqWyUVqNerScBL_M_NTo-bzvAzmhEzINK9wjRrhkgg9GpX8mF-WjJkzsrCutl7GO9NWowxGgnASqAr7Y7RFkMbMvfNgeFvKrbO32xBCY4xe_OqCHMSossXMc-rs" alt="Abstract network connections representing cloud architecture" />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-white border border-white/10">ERC-721</div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#1313ec] transition-colors">Cloud Architecture</h3>
                                                <Verified className="text-green-500 w-5 h-5" />
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">AWS Certified Solutions Architect Associate level competency.</p>
                                            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <span>ID: #4095</span>
                                                <span className="text-[#1313ec] group-hover:underline">View on PolygonScan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* NFT Card 3 */}
                                <div className="group relative perspective-1000 h-[340px] cursor-pointer">
                                    <div className="absolute inset-0 bg-[#f6f6f8] dark:bg-[#1a1a2e] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-[#1313ec] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(19,19,236,0.3)]">
                                        <div className="h-48 w-full bg-[#0a0a14] relative overflow-hidden p-4 flex items-center justify-center">
                                            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900 via-[#101022] to-[#101022]"></div>
                                            <img className="w-full h-full object-cover rounded-lg opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRIaMM4DP0GvqilxMzLVEQQ8hSu0bPjzNU0OoleO1iKdFwCo2kLjtk3Lty43M2mfmCQsaxOOgnPrzI3RxSJlA9v4RwB0IBnXLLXcA8oIXPWCcfYESclkNl1rb9D3AVeDTjEzOZVNM5TL4xLuvyeU-yzr-vbG4pbhO6PlWPcEuRVTsp61FiFrPr2YVRqETb5QBW0WNomSto5cm-OYVqq-Rm3i6X26AkjimUi9hMwiYGjlotA7k6V52F2Z3HyUyn9HF5VOb9iEhptyA" alt="Data visualization dashboard" />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-white border border-white/10">ERC-1155</div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#1313ec] transition-colors">Data Science Pro</h3>
                                                <Verified className="text-green-500 w-5 h-5" />
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">Statistical analysis and machine learning implementation project.</p>
                                            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <span>ID: #5102</span>
                                                <span className="text-[#1313ec] group-hover:underline">View on PolygonScan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* NFT Card 4 */}
                                <div className="group relative perspective-1000 h-[340px] cursor-pointer">
                                    <div className="absolute inset-0 bg-[#f6f6f8] dark:bg-[#1a1a2e] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-[#1313ec] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(19,19,236,0.3)]">
                                        <div className="h-48 w-full bg-[#0a0a14] relative overflow-hidden p-4 flex items-center justify-center">
                                            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900 via-[#101022] to-[#101022]"></div>
                                            <img className="w-full h-full object-cover rounded-lg opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyzKOKlM-S9aaWeUqpYFhcmOS3TbJzSC64i7z0PNL8TxneuTaaXBt7zgU7YFnEyX20zqXjZZ8UALLckML1J-f9gCk0vHHHI9rwRf7EEq8QryP2sAmX0mnKABvMKjjgeffKkEzpCwqfvEAY64tufWk0bM4JDWDE8YiWCxFBM4McDq99k2tEt_McOmjnpn1ct1H1tFsBbTtUExC-fygtjZqTq27R4SP2JsMlJOrpIrAgEnMBmt3l7oWnlL66YsAf4kQe8IYxPUvtmO0" alt="Project management scrum board" />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-white border border-white/10">SBT</div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#1313ec] transition-colors">Scrum Master</h3>
                                                <Verified className="text-green-500 w-5 h-5" />
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">Agile project management certification and team leadership.</p>
                                            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <span>ID: #9921</span>
                                                <span className="text-[#1313ec] group-hover:underline">View on PolygonScan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* NFT Card 5 */}
                                <div className="group relative perspective-1000 h-[340px] cursor-pointer">
                                    <div className="absolute inset-0 bg-[#f6f6f8] dark:bg-[#1a1a2e] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-[#1313ec] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(19,19,236,0.3)]">
                                        <div className="h-48 w-full bg-[#0a0a14] relative overflow-hidden p-4 flex items-center justify-center">
                                            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900 via-[#101022] to-[#101022]"></div>
                                            <img className="w-full h-full object-cover rounded-lg opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpkWlaK97Amtl4PCIGz5QWykSV46YDWQaoFgMWJbvkkGQXkkRVtJWA46wd7Hyg4CG19K2yFDw11CtNmen9DrBsQLpf5mTT6kIdM_SORATyDIo-fMPD8hrvQAyBHHKhjJNdhIgt1PppCiSqGSUs40Jysu_vCBoZP-pMfwNjy1pObWwee4cG5xWlgw9EpUwBj36HAOdHaW0-CHUHwfQUt78SqvcYKxBVU3Mj0PL6ZMEj4yRnTH1Y7svuIrMgbLy7h0LGHb6ogLp0Fa8" alt="Abstract artistic paint flow" />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-white border border-white/10">ERC-721</div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#1313ec] transition-colors">UI/UX Design</h3>
                                                <Verified className="text-green-500 w-5 h-5" />
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">Human-computer interaction principles and Figma mastery.</p>
                                            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <span>ID: #1102</span>
                                                <span className="text-[#1313ec] group-hover:underline">View on PolygonScan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* NFT Card 6 (Empty/Add New) */}
                                <div className="group relative h-[340px] cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center hover:border-[#1313ec] hover:bg-[#1313ec]/5 transition-all">
                                    <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-full mb-4 group-hover:bg-[#1313ec] group-hover:text-white transition-colors">
                                        <Plus className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Claim New Skill</h3>
                                    <p className="text-sm text-slate-500 text-center mt-2 px-8">Submit proof of work to mint a new skill asset.</p>
                                </div>
                            </div>
                            {/* Activity Feed (Ticker) */}
                            <div className="mt-8 bg-black/20 rounded-lg p-4 border border-slate-800/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <Disc className="w-4 h-4 text-[#1313ec] animate-pulse" />
                                    <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Blockchain Activity Log</h4>
                                </div>
                                <div className="space-y-2 font-mono text-xs">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Minted &quot;Advanced Python&quot; (ERC-721)</span>
                                        <span>Tx: 0x8a...92b1 • 2 hrs ago</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Proof verified by University Node</span>
                                        <span>Tx: 0x1c...44a0 • 1 day ago</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Profile metadata updated</span>
                                        <span>Tx: 0x3d...22e8 • 5 days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-slate-200 dark:border-slate-800 bg-[#f6f6f8] dark:bg-[#101022] py-8 px-10 mt-12">
                    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2023 PPSDM KMM Future Tech. All rights reserved.</p>
                        <div className="flex gap-6 text-sm text-slate-500">
                            <a className="hover:text-[#1313ec]" href="#">Smart Contract</a>
                            <a className="hover:text-[#1313ec]" href="#">Privacy Policy</a>
                            <a className="hover:text-[#1313ec]" href="#">Help Center</a>
                        </div>
                    </div>
                </footer>

                <style jsx global>{`
            .glass-card {
                background: rgba(16, 16, 34, 0.7);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            }
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
        `}</style>
            </div>
        </div>
    );
}
