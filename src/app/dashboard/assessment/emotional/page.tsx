"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function EmotionalAssessmentPage() {
    const config = getDimensionById("emotional-social");
    if (!config) return null;
    return <AssessmentRunner config={config} />;
}
