"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function MentalHealthAssessmentPage() {
    const config = getDimensionById("mental-health");
    
    if (!config) {
        return <div>Error: Mental Health dimension configuration not found</div>;
    }
    
    return <AssessmentRunner config={config} />;
}
