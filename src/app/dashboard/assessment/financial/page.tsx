"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { financialConfig } from "@/features/assessment-engine/config/dimensions";

export default function FinancialAssessmentPage() {
    return <AssessmentRunner config={financialConfig} />;
}
