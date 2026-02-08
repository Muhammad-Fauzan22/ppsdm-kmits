"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { environmentalConfig } from "@/features/assessment-engine/config/dimensions";

export default function EnvironmentalAssessmentPage() {
    return <AssessmentRunner config={environmentalConfig} />;
}
