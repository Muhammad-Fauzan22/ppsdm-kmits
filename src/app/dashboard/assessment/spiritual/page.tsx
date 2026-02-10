"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function SpiritualAssessmentPage() {
    const config = getDimensionById("spiritual");
    
    if (!config) {
        return <div>Error: Spiritual dimension configuration not found</div>;
    }
    
    return <AssessmentRunner config={config} />;
}
