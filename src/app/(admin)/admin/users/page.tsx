"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Shield,
    CheckCircle,
    XCircle,
    UserPlus,
    Download,
    Trash2,
    Edit3,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";

// --- MOCK DATA ---
const USERS = [
    { id: "USR-001", name: "Ahmad Fauzan", email: "fauzan@student.its.ac.id", role: "Student", status: "Active", lastActive: "2 mins ago", avatar: ASSETS.avatar.student },
    { id: "USR-002", name: "Dr. Budi Santoso", email: "budi.s@lecturer.its.ac.id", role: "Supervisor", status: "Active", lastActive: "1 hour ago", avatar: ASSETS.avatar.lecturer },
    { id: "USR-003", name: "Siti Aminah", email: "siti.aminah@staff.its.ac.id", role: "Admin", status: "Active", lastActive: "5 hours ago", avatar: "https://ui-avatars.com/api/?name=Siti+Aminah&background=random" },
    { id: "USR-004", name: "Rizky Pratama", email: "rizky.p@student.its.ac.id", role: "Student", status: "Inactive", lastActive: "3 days ago", avatar: "https://ui-avatars.com/api/?name=Rizky+Pratama&background=random" },
    { id: "USR-005", name: "Dewi Lestari", email: "dewi.l@student.its.ac.id", role: "Student", status: "Suspended", lastActive: "1 week ago", avatar: "https://ui-avatars.com/api/?name=Dewi+Lestari&background=random" },
];

export default function UserManagementPage() {
    const [selectedRole, setSelectedRole] = useState("All");

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-[#111318] text-[#111318] dark:text-white font-sans transition-colors duration-300">
            {/* Main Content Area - Full Width for simplicity as wrapper handles layout often, but here we assume direct page */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-[#111318] custom-scrollbar">

                {/* Header */}
                <header className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-[#282e39] bg-white dark:bg-[#111318] sticky top-0 z-20">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            User Management
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-[#9da6b9]">Manage user access, roles, and status.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#111318] dark:hover:text-white transition-colors">
                            Back to Dashboard
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                            <UserPlus className="w-4 h-4" />
                            Add New User
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">

                    {/* Controls Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-[#1c1f27] p-4 rounded-xl border border-gray-200 dark:border-[#282e39] shadow-sm">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#222630] border border-gray-200 dark:border-[#3b4354] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            {['All', 'Student', 'Supervisor', 'Admin', 'Guest'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                                        selectedRole === role
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "bg-gray-100 dark:bg-[#282e39] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3b4354]"
                                    )}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:text-[#111318] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#282e39] rounded-lg transition-colors" title="Filter">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-[#111318] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#282e39] rounded-lg transition-colors" title="Export">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#282e39] rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-[#20242d]">
                                    <tr>
                                        <th className="p-4 w-[50px]">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        </th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider">User Profile</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider">Role</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider">Last Active</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#282e39]">
                                    {USERS.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-[#222630] transition-colors">
                                            <td className="p-4">
                                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                                                    <div>
                                                        <p className="font-bold text-[#111318] dark:text-white text-sm">{user.name}</p>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                            <Mail className="w-3 h-3" /> {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.role}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <StatusPill status={user.status} />
                                            </td>
                                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                {user.lastActive}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors" title="Edit User">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Delete User">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-[#282e39] flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Showing <span className="font-bold text-[#111318] dark:text-white">1-5</span> of <span className="font-bold text-[#111318] dark:text-white">2,450</span> users</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 border border-gray-200 dark:border-[#3b4354] rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282e39] disabled:opacity-50" disabled>Previous</button>
                                <button className="px-3 py-1.5 border border-gray-200 dark:border-[#3b4354] rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282e39]">1</button>
                                <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-bold shadow-sm">2</button>
                                <button className="px-3 py-1.5 border border-gray-200 dark:border-[#3b4354] rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282e39]">3</button>
                                <span className="px-2 text-gray-400 self-end">...</span>
                                <button className="px-3 py-1.5 border border-gray-200 dark:border-[#3b4354] rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282e39]">Next</button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    if (status === 'Active') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-500/20">
                <CheckCircle className="w-3 h-3" /> Active
            </span>
        )
    }
    if (status === 'Inactive') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20">
                <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div> Inactive
            </span>
        )
    }
    if (status === 'Suspended') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20">
                <XCircle className="w-3 h-3" /> Suspended
            </span>
        )
    }
    return null;
}
