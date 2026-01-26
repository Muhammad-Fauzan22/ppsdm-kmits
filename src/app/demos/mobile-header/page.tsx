"use client";

export default function MobileHeaderDemo() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 font-[family-name:var(--font-inter)] flex items-center justify-center min-h-screen p-4 sm:p-8">
            {/* Mobile Screen Simulator */}
            <div className="relative w-full max-w-[375px] h-[812px] bg-[#f6f6f8] dark:bg-[#101622] shadow-2xl rounded-[2rem] overflow-hidden border-[8px] border-gray-800 flex flex-col group/design-root">
                {/* Status Bar Area (Decorative) */}
                <div className="h-7 w-full bg-white dark:bg-[#101622] flex items-center justify-between px-6 z-50">
                    <span className="text-[10px] font-semibold text-gray-900 dark:text-white">9:41</span>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-white opacity-20"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-white opacity-20"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-white"></div>
                    </div>
                </div>
                {/* Sticky Header Component */}
                <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#101622] shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Left: ITS Techno-Shield Logo */}
                        <div className="flex items-center gap-2.5">
                            {/* Logo Icon (SVG from example) */}
                            <div className="flex items-center justify-center text-[#135bec] h-8 w-8">
                                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            {/* Brand Text */}
                            <div className="flex flex-col justify-center">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight tracking-tight">ITS Techno</h2>
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase leading-none">Shield</span>
                            </div>
                        </div>
                        {/* Right: Interactive Icons */}
                        <div className="flex items-center gap-3">
                            {/* Notification Bell */}
                            <button aria-label="Notifications" className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700">
                                <span className="material-symbols-outlined text-gray-700 dark:text-gray-200" style={{ fontSize: "24px" }}>notifications</span>
                                {/* Red Dot Indicator (#C62828) */}
                                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[#C62828] border border-white dark:border-[#101622] ring-0"></span>
                            </button>
                            {/* User Avatar */}
                            <button aria-label="User Profile" className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:ring-offset-2 dark:focus:ring-offset-[#101622] transition-all">
                                {/* Using a div background image for best cover fit */}
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0cix5DyfhGtrGbRNNDKb7W7JqD9lX0v4LCQWg1qt3HWqyA-bqcnFG73gXpZ055SENTOESnsanUcEx-UkmuFsIwsxgQ55ebmYo7KcOhCSUtmp2Vq3Xv5V5CV3PqAQWqQbVXjRsUDahzTe27yvMASu_r45vH3Dk9xBc4drFxywm5h_-Jy4TBGKX0xZU5HWMc87so-KhOcx7Gu6UCeacP9zgYltYAH1ThhJ9v8XVJ_sidbG-EcuDxIb8K5vAw7M3qi5j_hJ9jT-7MfU')" }}>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>
                {/* Main Content Area (Scrollable to demonstrate sticky header) */}
                <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                    {/* Welcome Card */}
                    <div className="w-full bg-[#135bec] rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[#dbeafe] text-xs font-medium mb-1">Welcome back,</p>
                            <h3 className="text-xl font-bold mb-3">Dr. Alexander</h3>
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium">
                                <span className="material-symbols-outlined text-sm mr-1">verified_user</span>
                                System Active
                            </div>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                    {/* Content Placeholder 1 */}
                    <div className="w-full bg-white dark:bg-[#151b26] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Recent Alerts</h4>
                            <span className="text-[#135bec] text-xs font-medium">View All</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-lg">warning</span>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">Server Load High</p>
                                    <p className="text-[10px] text-gray-500">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">Backup Completed</p>
                                    <p className="text-[10px] text-gray-500">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Content Placeholder 2 (Skeleton) */}
                    <div className="w-full bg-white dark:bg-[#151b26] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3"></div>
                        <div className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-lg w-full"></div>
                        <div className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-lg w-full"></div>
                    </div>
                    {/* Content Placeholder 3 (Skeleton) */}
                    <div className="w-full bg-white dark:bg-[#151b26] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                        <div className="flex gap-2">
                            <div className="h-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg w-1/3"></div>
                            <div className="h-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg w-1/3"></div>
                            <div className="h-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg w-1/3"></div>
                        </div>
                    </div>
                </main>
                {/* Bottom Nav Bar (Simulated) */}
                <nav className="bg-white dark:bg-[#151b26] border-t border-gray-100 dark:border-gray-800 h-[70px] flex items-center justify-around px-2 pb-2">
                    <div className="flex flex-col items-center gap-1 p-2 text-[#135bec]">
                        <span className="material-symbols-outlined text-2xl">home</span>
                        <span className="text-[10px] font-medium">Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined text-2xl">analytics</span>
                        <span className="text-[10px] font-medium">Stats</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 text-gray-400 dark:text-gray-500">
                        <span className="material-symbols-outlined text-2xl">settings</span>
                        <span className="text-[10px] font-medium">Settings</span>
                    </div>
                </nav>
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900/20 dark:bg-white/20 rounded-full"></div>
            </div>
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
