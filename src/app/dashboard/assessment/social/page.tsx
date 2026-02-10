"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function SocialAssessmentPage() {
    const config = getDimensionById("emotional-social");
    
    if (!config) {
        return <div>Error: Social dimension configuration not found</div>;
    }
    
    return <AssessmentRunner config={config} />;
}
