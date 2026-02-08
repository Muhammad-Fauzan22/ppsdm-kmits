"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { physicalConfig } from "@/features/assessment-engine/config/dimensions";

export default function PhysicalAssessmentPage() {
    return <AssessmentRunner config={physicalConfig} />;
}
