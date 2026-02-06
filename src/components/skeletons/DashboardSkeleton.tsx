
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-4">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-5 w-48 rounded-md bg-slate-100 dark:bg-slate-800/50" />
                </div>
                <Skeleton className="h-20 w-full lg:w-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Left Column (Main) */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                    {/* Chart Skeleton */}
                    <div className="bg-white/60 dark:bg-[#161e2c]/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48 bg-slate-200 dark:bg-slate-700" />
                                <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-slate-800" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <Skeleton className="h-[300px] w-full rounded-full bg-slate-100 dark:bg-slate-800/30" />
                        <div className="grid grid-cols-5 gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full rounded bg-slate-100 dark:bg-slate-800" />)}
                        </div>
                    </div>

                    {/* Resources Skeleton */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-40 bg-slate-200 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="shrink-0 w-[140px] md:w-[160px] space-y-3">
                                    <Skeleton className="aspect-[2/3] w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700" />
                                        <Skeleton className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <Skeleton className="h-48 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-64 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>

            </div>
        </div>
    );
}
