
import { Skeleton } from "@/components/ui/skeleton";

export function RadarChartSkeleton() {
    return (
        <div className="w-full h-[300px] flex items-center justify-center relative">
            <Skeleton className="w-[80%] h-[80%] rounded-full absolute" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full border-4 border-slate-100 dark:border-slate-800 rounded-full border-dashed animate-pulse"></div>
            </div>
        </div>
    );
}

export function BookCardSkeleton() {
    return (
        <div className="snap-start shrink-0 w-[140px] md:w-[160px] flex flex-col gap-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function RecommendationSkeleton() {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x">
            {[1, 2, 3, 4].map((i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    );
}
