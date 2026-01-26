"use client";

import Link from "next/link";

export default function UserManagementPage() {
    return (
        <div className="bg-[#f0f2f4] dark:bg-[#101622] text-[#111318] dark:text-white font-[family-name:var(--font-lexend)] min-h-screen flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbdfe6] dark:border-gray-800 bg-white dark:bg-[#1e2736] px-6 py-3 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-[#111318] dark:text-white">
                        <div className="size-8 bg-[#135bec] rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM</h2>
                    </div>
                    <label className="hidden md:flex flex-col min-w-40 !h-10 w-96">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-[#616f89] flex border-none bg-[#f0f2f4] dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] dark:bg-gray-800 focus:border-none h-full placeholder:text-[#616f89] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" placeholder="Search users, emails, or IDs..." />
                        </div>
                    </label>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center rounded-lg size-10 bg-[#f0f2f4] dark:bg-gray-800 text-[#111318] dark:text-white hover:bg-[#e0e2e6] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg size-10 bg-[#f0f2f4] dark:bg-gray-800 text-[#111318] dark:text-white hover:bg-[#e0e2e6] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3 pl-2 border-l border-[#dbdfe6] dark:border-gray-700">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold leading-none">Admin User</p>
                            <p className="text-xs text-[#616f89] leading-none mt-1">Super Admin</p>
                        </div>
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white dark:border-gray-700 shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7zUzQz6gbj8qTjYxFkXwlr_MVzDfVfJE0EmL828aKBNhPqhmxTOHAav9-2cznwRA7F-fAbtysZpuRll5faFVPiXAhz8kpZy5r1gi4pYls2LSYgpuTneoFTg7NIejNAIt0fnO9rcJtbO_faX4p5qZjIZK0fwV-NgH64uwK_B2aoTEvzaF61-kYjDFsPW-p6SUb9JgJdmzWStIMXlr85DJor2lQ6qlVF4zfSfQqCdUTkgCHP4A-F1w0C3I1VWkOo6SA12AgUamGNUE')" }}></div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar (Filters) */}
                <aside className="w-72 bg-white dark:bg-[#1e2736] border-r border-[#dbdfe6] dark:border-gray-800 flex flex-col overflow-y-auto hidden lg:flex shrink-0">
                    <div className="p-5 border-b border-[#dbdfe6] dark:border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[#111318] dark:text-white text-base">Filters</h3>
                            <button className="text-[#135bec] text-sm font-medium hover:underline">Clear All</button>
                        </div>
                        {/* Roles Filter */}
                        <div className="mb-6">
                            <p className="text-[#616f89] dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">By Role</p>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input defaultChecked className="size-4 rounded border-[#dbdfe6] text-[#135bec] focus:ring-[#135bec]/20" type="checkbox" />
                                    <span className="text-sm text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">Student</span>
                                    <span className="ml-auto text-xs text-[#616f89] bg-[#f0f2f4] dark:bg-gray-700 px-1.5 py-0.5 rounded-full">124</span>
                                </label>
                                {[
                                    { label: "Supervisor", count: 12 },
                                    { label: "Admin", count: 4 }
                                ].map(r => (
                                    <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
                                        <input className="size-4 rounded border-[#dbdfe6] text-[#135bec] focus:ring-[#135bec]/20" type="checkbox" />
                                        <span className="text-sm text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">{r.label}</span>
                                        <span className="ml-auto text-xs text-[#616f89] bg-[#f0f2f4] dark:bg-gray-700 px-1.5 py-0.5 rounded-full">{r.count}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Department Filter */}
                        <div className="mb-6">
                            <p className="text-[#616f89] dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">By Department</p>
                            <div className="space-y-2">
                                {["Information Tech", "Human Resources", "Finance", "Operations"].map(d => (
                                    <label key={d} className="flex items-center gap-3 cursor-pointer group">
                                        <input className="size-4 rounded border-[#dbdfe6] text-[#135bec] focus:ring-[#135bec]/20" type="checkbox" />
                                        <span className="text-sm text-[#111318] dark:text-white group-hover:text-[#135bec] transition-colors">{d}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Batch Filter */}
                        <div className="mb-6">
                            <p className="text-[#616f89] dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">By Batch</p>
                            <div className="relative">
                                <select className="w-full bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-lg text-sm px-3 py-2 text-[#111318] dark:text-white focus:ring-1 focus:ring-[#135bec]">
                                    <option>All Batches</option>
                                    <option>2024 - Batch A</option>
                                    <option>2024 - Batch B</option>
                                    <option>2023 - Batch A</option>
                                </select>
                            </div>
                        </div>
                        {/* Status Filter */}
                        <div>
                            <p className="text-[#616f89] dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Status</p>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 rounded-full text-xs font-medium bg-[#135bec]/10 text-[#135bec] border border-[#135bec]/20 hover:bg-[#135bec]/20 transition-colors">Active</button>
                                <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Inactive</button>
                                <button className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Banned</button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto p-4 border-t border-[#dbdfe6] dark:border-gray-800 bg-[#f8f9fa] dark:bg-[#151b26]">
                        <button className="w-full py-2 bg-[#135bec] hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Main Content (Table) */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {/* Breadcrumbs & Heading */}
                    <div className="px-6 py-5 shrink-0">
                        <div className="flex items-center gap-2 text-sm text-[#616f89] mb-4">
                            <Link className="hover:text-[#135bec] transition-colors" href="/admin">Home</Link>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            <Link className="hover:text-[#135bec] transition-colors" href="/admin">Admin</Link>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            <span className="font-medium text-[#111318] dark:text-white">Users</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#111318] dark:text-white tracking-tight">User Management</h1>
                                <p className="text-sm text-[#616f89] mt-1">High-density administration for system users across all departments.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-[#dbdfe6] dark:border-gray-700 rounded-lg text-sm font-medium text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">file_upload</span>
                                    Export
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#135bec] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md">
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    Add New User
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
                        <div className="bg-white dark:bg-[#1e2736] rounded-xl border border-[#dbdfe6] dark:border-gray-800 shadow-sm flex flex-col h-full overflow-hidden relative">
                            {/* Table Actions Toolbar */}
                            <div className="px-4 py-3 border-b border-[#dbdfe6] dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1e2736]">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[#616f89]">Showing 1-10 of 145 users</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[#616f89]">Sort by:</span>
                                        <select className="bg-transparent text-sm font-medium text-[#111318] dark:text-white border-none focus:ring-0 p-0 pr-6 cursor-pointer">
                                            <option>Last Active</option>
                                            <option>Name (A-Z)</option>
                                            <option>Date Added</option>
                                        </select>
                                    </div>
                                    <div className="h-4 w-px bg-[#dbdfe6] dark:bg-gray-700 mx-1"></div>
                                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-[#616f89]">
                                        <span className="material-symbols-outlined text-[20px]">refresh</span>
                                    </button>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-[#f9fafb] dark:bg-[#151b26] z-10 shadow-sm">
                                        <tr>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 w-12">
                                                <input className="size-4 rounded border-[#dbdfe6] text-[#135bec] focus:ring-[#135bec]/20" type="checkbox" />
                                            </th>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 text-xs font-semibold text-[#616f89] uppercase tracking-wider">User</th>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Role</th>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Department</th>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Batch</th>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Last Active</th>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Status</th>
                                            <th className="py-3 px-4 border-b border-[#dbdfe6] dark:border-gray-800 text-xs font-semibold text-[#616f89] uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#dbdfe6] dark:divide-gray-800">
                                        {[
                                            {
                                                name: "Sarah Jenkins", email: "sarah.j@ppsdm.edu", role: "Student", dept: "Information Tech", batch: "2024-A", active: "2 mins ago", status: "Active", statusColor: "green",
                                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWEMIWWxqt7QqgBE_4v0I5VNuy6I_Sx3Ti5g9jFx6HQo9Pi5kL5ZkTwGQnp3Zje_ci-AMf87EBdGs11JTA6INIgTOFKs45-k6GX_FoB6yuNI_GioB00-vcAjLgNSI1kJVHfLYnyEGtSKY_ty6lU6aI_7HyjeuQADTfZUI8f5AtJ4o0yLOdw0FcyrYgrn6fvz7WQ6mQDIJ57gQMJ7RkWhRJP5JIHbvMwnD18wuii3FOt12nhgyS2_UN2lXwl3r2aXjxj2rAIB9YTv8"
                                            },
                                            {
                                                name: "Michael King", email: "m.king@ppsdm.edu", role: "Supervisor", dept: "Operations", batch: "-", active: "1 day ago", status: "Offline", statusColor: "gray",
                                                initials: "MK"
                                            },
                                            {
                                                name: "James Wilson", email: "j.wilson@ppsdm.edu", role: "Student", dept: "Finance", batch: "2024-B", active: "3 hours ago", status: "Banned", statusColor: "red",
                                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuEyW9rcKZvYf-HEYiOYapvuQUASKjqmfmbKBl7tuifVRIhzY8ybrcKOui_MbbeC09FtQAsfm8006LbYcocDU2IDUNt_HfpRcsjXnCTV0PKGuTAC-752npx_vJ4SDGI2Jtx7Vj20FDojI42te4WC3YINjokDbWPZ2T8Vsn9m2mUO63tVQgGWSdwa33oNTdE0XbFSv8w2UCa2gvhXN0i7eY0_D9_klbx5vaW1BZ-n4psvG2UO1p0Shvetg2TEsuXopT9qqgznhjw1U"
                                            },
                                            {
                                                name: "Emma Lee", email: "e.lee@ppsdm.edu", role: "Admin", dept: "IT", batch: "-", active: "Just now", status: "Active", statusColor: "green",
                                                initials: "EL"
                                            },
                                            {
                                                name: "David Chen", email: "d.chen@ppsdm.edu", role: "Student", dept: "HR", batch: "2023-A", active: "5 days ago", status: "On Leave", statusColor: "orange",
                                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAR_DMjf3B1LvLcN1Hp8EPKslqiAjd2_MFD_TmqszcSeJYvz5gMvC1pBhuGXRUI5r9q6f4eeU7UiDgXjOag3aXLDcy7DTnPM1DQLaXCDh7SJt6BGb6jVuOxNGxGa_NC0vgIYpKq75WyK6wYiE3ZescGqxlISLn1lbeiAUF0UzEZ-SjY3hXcED2rVnNS5DuR5w93XDmmbM-L7ieB9JxCXmwH8aLEdJFQ2nI9SXnWGEhR7Pd80meoMF_tExURBLwBGY6hMzZRqsArAuI"
                                            },
                                            {
                                                name: "Rajesh Kumar", email: "r.kumar@ppsdm.edu", role: "Student", dept: "Engineering", batch: "2024-A", active: "2 days ago", status: "Active", statusColor: "green",
                                                initials: "RK"
                                            }
                                        ].map((user, i) => (
                                            <tr key={i} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                                <td className="py-3 px-4">
                                                    <input className="size-4 rounded border-[#dbdfe6] text-[#135bec] focus:ring-[#135bec]/20" type="checkbox" />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {user.img ? (
                                                            <div className="size-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${user.img}')` }}></div>
                                                        ) : (
                                                            <div className="size-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                                {user.initials}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-[#111318] dark:text-white">{user.name}</p>
                                                            <p className="text-xs text-[#616f89]">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                                        ${user.role === 'Student' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            user.role === 'Supervisor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-[#111318] dark:text-gray-300">{user.dept}</td>
                                                <td className="py-3 px-4 text-sm text-[#111318] dark:text-gray-300">{user.batch}</td>
                                                <td className="py-3 px-4 text-sm text-[#616f89]">{user.active}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`size-2 rounded-full 
                                                            ${user.statusColor === 'green' ? 'bg-emerald-500' :
                                                                user.statusColor === 'red' ? 'bg-red-500' :
                                                                    user.statusColor === 'orange' ? 'bg-orange-400' :
                                                                        'bg-gray-300 dark:bg-gray-600'}`}>
                                                        </div>
                                                        <span className="text-sm text-[#111318] dark:text-gray-300">{user.status}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 text-gray-500 hover:text-[#135bec] hover:bg-[#135bec]/10 rounded" title="Edit User">
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded" title="Impersonate">
                                                            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                                                        </button>
                                                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Ban User">
                                                            <span className="material-symbols-outlined text-[20px]">block</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination (Simplified) */}
                            <div className="px-4 py-3 border-t border-[#dbdfe6] dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1e2736]">
                                <p className="text-sm text-[#616f89]">Showing 1 to 10 of 97 results</p>
                                <div className="flex gap-1">
                                    <button className="px-2 py-1 text-sm border rounded">Prev</button>
                                    <button className="px-2 py-1 text-sm border rounded bg-[#135bec] text-white">1</button>
                                    <button className="px-2 py-1 text-sm border rounded">2</button>
                                    <button className="px-2 py-1 text-sm border rounded">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
            `}</style>
        </div>
    );
}
