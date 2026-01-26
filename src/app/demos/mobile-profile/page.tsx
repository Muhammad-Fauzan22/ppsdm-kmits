"use client";

export default function MobileProfilePopoverDemo() {
    return (
        <div className="font-[family-name:var(--font-inter)] bg-[#f6f6f8] dark:bg-[#101622] min-h-screen flex items-center justify-center p-4">
            {/* Overlay/Backdrop Area (Simulating the desktop view behind the popover) */}
            <div className="fixed inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-sm z-0"></div>
            {/* Mobile Pop-over Card */}
            <div className="relative w-full max-w-[375px] bg-white dark:bg-[#1e2736] rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all duration-300">
                {/* Close Button */}
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-20">
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
                {/* Profile Header Section */}
                <div className="flex flex-col items-center pt-10 pb-6 px-6 relative">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 mb-4 shadow-md ring-4 ring-[#f6f6f8] dark:ring-[#101622]/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgtOU1EQLrrdoaQ0Ck8uioW4h_s8lFIHCfDrzhGl-L_RcwqLQPkoTNpFxjj-yznBP_801BoOSfQsfA91U3BnwTNjmlt80zIWMiA3K6UBPi2c7bZEymlqfn03hCfu9i38nHg-0gi5HzgUuEhHIvqD3qFnYjI5W1llr-znfGLvfx9VKpaiIvdWI7IS4TdQwAgqs2qAs1-u4Iyw_i-xcMI69KZJjnVfRkjihtwPiEjZ74O1TweW5cGhmw-sxunXjb0OJxH4QqeyHSETI')" }}>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                        <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Dr. Arief Budiman</h2>
                        <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal">NRP: 198203122005011002</p>
                        {/* Badge */}
                        <div className="mt-2 bg-[#135bec]/10 dark:bg-[#135bec]/20 rounded-full px-3 py-1">
                            <p className="text-[#135bec] text-xs font-semibold leading-none tracking-wide uppercase">Level 4 Scholar</p>
                        </div>
                    </div>
                </div>
                {/* Divider */}
                <div className="h-px w-full bg-gray-100 dark:bg-gray-700"></div>
                {/* Menu Items Section */}
                <div className="flex flex-col py-2">
                    {/* Item 1: Lihat Profil Lengkap */}
                    <button className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors w-full text-left">
                        <div className="flex items-center justify-center rounded-lg bg-[#f0f2f4] dark:bg-gray-700 text-[#111318] dark:text-white group-hover:text-[#135bec] group-hover:bg-[#135bec]/10 transition-colors shrink-0 size-10">
                            <span className="material-symbols-outlined text-[24px]">person</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between overflow-hidden">
                            <p className="text-[#111318] dark:text-gray-100 text-sm font-medium leading-normal truncate">Lihat Profil Lengkap</p>
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[20px]">chevron_right</span>
                        </div>
                    </button>
                    {/* Item 2: Pengaturan Akun */}
                    <button className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors w-full text-left">
                        <div className="flex items-center justify-center rounded-lg bg-[#f0f2f4] dark:bg-gray-700 text-[#111318] dark:text-white group-hover:text-[#135bec] group-hover:bg-[#135bec]/10 transition-colors shrink-0 size-10">
                            <span className="material-symbols-outlined text-[24px]">settings</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between overflow-hidden">
                            <p className="text-[#111318] dark:text-gray-100 text-sm font-medium leading-normal truncate">Pengaturan Akun</p>
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[20px]">chevron_right</span>
                        </div>
                    </button>
                    {/* Item 3: Pusat Bantuan */}
                    <button className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors w-full text-left">
                        <div className="flex items-center justify-center rounded-lg bg-[#f0f2f4] dark:bg-gray-700 text-[#111318] dark:text-white group-hover:text-[#135bec] group-hover:bg-[#135bec]/10 transition-colors shrink-0 size-10">
                            <span className="material-symbols-outlined text-[24px]">help_center</span>
                        </div>
                        <div className="flex flex-1 items-center justify-between overflow-hidden">
                            <p className="text-[#111318] dark:text-gray-100 text-sm font-medium leading-normal truncate">Pusat Bantuan</p>
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[20px]">chevron_right</span>
                        </div>
                    </button>
                </div>
                {/* Divider */}
                <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mt-2 mb-4"></div>
                {/* Logout Button Section */}
                <div className="px-6 pb-6">
                    <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-[#C62828] dark:text-red-400 gap-2 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="text-sm font-bold leading-normal tracking-[0.015em] truncate">Keluar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
