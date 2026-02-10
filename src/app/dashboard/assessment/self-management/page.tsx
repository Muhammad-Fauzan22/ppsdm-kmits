"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function SelfManagementAssessmentPage() {
    const config = getDimensionById("self-management");
    
    if (!config) {
        return <div>Error: Self-management dimension configuration not found</div>;
    }
    
    return <AssessmentRunner config={config} />;
}
