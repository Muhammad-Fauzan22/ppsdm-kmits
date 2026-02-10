"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function PhysicalAssessmentPage() {
    const config = getDimensionById("physical");
    
    if (!config) {
        return <div>Error: Physical dimension configuration not found</div>;
    }
    
    return <AssessmentRunner config={config} />;
}
