"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";

export default function CharacterAssessmentPage() {
    const config = getDimensionById("character");
    if (!config) return null;
    return <AssessmentRunner config={config} />;
}
