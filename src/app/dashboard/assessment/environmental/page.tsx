"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function EnvironmentalAssessmentPage() {
    const config = getDimensionById("environmental");
    
    if (!config) {
        return <div>Error: Environmental dimension configuration not found</div>;
    }
    
    return <AssessmentRunner config={config} />;
}
