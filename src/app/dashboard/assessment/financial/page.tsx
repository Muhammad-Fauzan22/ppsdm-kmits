"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function FinancialAssessmentPage() {
    const config = getDimensionById("financial");
    
    if (!config) {
        return <div>Error: Financial dimension configuration not found</div>;
    }
    
    return <AssessmentRunner config={config} />;
}
