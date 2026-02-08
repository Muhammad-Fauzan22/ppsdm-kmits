"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { selfManagementConfig } from "@/features/assessment-engine/config/dimensions";

export default function SelfManagementAssessmentPage() {
    return <AssessmentRunner config={selfManagementConfig} />;
}
