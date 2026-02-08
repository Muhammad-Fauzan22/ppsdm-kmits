"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { emotionalConfig } from "@/features/assessment-engine/config/dimensions";

export default function EmotionalAssessmentPage() {
    return <AssessmentRunner config={emotionalConfig} />;
}
