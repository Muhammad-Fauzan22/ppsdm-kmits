"use client";

export default function MentorshipPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark hidden lg:block">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">school</span>
                    </div>
                    <span className="font-bold">Lecturer Portal</span>
                </div>
                <nav className="px-4 space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg font-medium">
                        <span className="material-symbols-outlined">group</span>
                        My Mentees
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5 rounded-lg font-medium transition-colors">
                        <span className="material-symbols-outlined">calendar_month</span>
                        Schedule
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Mentorship Dashboard</h1>
                        <p className="text-gray-500">Overview of your 12 mentees</p>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-opacity-90">
                        New Session
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Mentee List */}
                    <div className="space-y-4">
                        <h2 className="font-bold text-xl">Pending Feedback</h2>
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-200 bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUKsIbSOxCQtEs6YlxaaFq8t-XkUPH2OZKBBeDF2SMaEf0q5Mm3LhgHEnXDt0MAkYph2_sISQoZDwI8GbutO2SY2VsllL_biFUE2rA5o7-3e6utVe3RJqZewQWAUIZOjJtGReKpGfLaKsHfEXjJdUZjZQT3UwJ6QKqK4_xy2wJ3EXED4jfW0hSXU6bKYFVVpWzgHooNe8MHyMANajkXSIZVx-TuJrciJbDL5OpSxGhsPQbLq4S5lVqVFcqHy3VimTPJ2mHMsl6yt8")' }}></div>
                            <div className="flex-1">
                                <p className="font-bold">Sarah Permata</p>
                                <p className="text-xs text-gray-500">Submitted Research Proposal</p>
                            </div>
                            <button className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded">Review</button>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-200 bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQx3KH7Bt7Szc8wKrbYaLEstPG07aXcMtE5qYU7-xIRvuw7obylXBz-XpDfzB5foUaxP2hcvOBu8DOb1aH3eBbGnRHJslPQnlL2Xx7zNgdSgLGufOPO0nHaJpws7LkvfCUFqH5VULuNIlGmfv4LqojGyDfIN2bCfIqFZVFkGT1-bH3ewYP56PcwFdPS6cN37-2RNvX96FquXSfzHUtaxa1xhzh-z8ZQMoS3d9EWm4xgb3cCqP0NBy-VnNaKbK2c-x5j0Rgzvibd00")' }}></div>
                            <div className="flex-1">
                                <p className="font-bold">Dimas Anggara</p>
                                <p className="text-xs text-gray-500">Weekly Progress (Internship)</p>
                            </div>
                            <button className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded">Review</button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark h-full">
                        <h3 className="font-bold text-lg mb-4">Cohort Growth</h3>
                        <div className="h-40 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
                            [Chart Visualization Placeholder]
                        </div>
                        <p className="mt-4 text-sm text-gray-600">Your mentees are performing 12% above average.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
