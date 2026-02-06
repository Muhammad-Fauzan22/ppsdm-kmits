import { DimensionCard } from "@/components/DimensionCard";
import { Button } from "@/components/ui/button";
import { DIMENSION_CONFIG } from "../config/constants";

export function DimensionGrid() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">The 9 Dimensions</h2>
                <Button variant="ghost" size="sm">View Matrix Analysis</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* REFACTOR: Mapping configuration instead of hardcoding components */}
                {DIMENSION_CONFIG.map((dim) => (
                    <DimensionCard
                        key={dim.id}
                        id={dim.id}
                        title={dim.title}
                        description={dim.description}
                        // Pada implementasi nyata, score diambil dari props/store berdasarkan ID
                        score={Math.floor(Math.random() * (100 - 60) + 60)}
                        icon={<dim.icon className="size-6 text-white" />}
                        colorClass={dim.colorClass}
                        href={dim.href}
                    />
                ))}
            </div>
        </div>
    );
}
