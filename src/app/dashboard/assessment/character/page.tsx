"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { characterConfig } from "@/features/assessment-engine/config/dimensions";

export default function CharacterAssessmentPage() {
    return <AssessmentRunner config={characterConfig} />;
}
