"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { mentalConfig } from "@/features/assessment-engine/config/dimensions";

export default function MentalHealthAssessmentPage() {
    return <AssessmentRunner config={mentalConfig} />;
}
