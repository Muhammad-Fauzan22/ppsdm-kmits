"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { spiritualConfig } from "@/features/assessment-engine/config/dimensions";

export default function SpiritualAssessmentPage() {
    return <AssessmentRunner config={spiritualConfig} />;
}
