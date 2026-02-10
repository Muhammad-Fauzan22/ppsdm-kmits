"use client";

import React from "react";
import { getDimensionById } from "@/features/assessment-engine/config/dimensions";
import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";

export default function CognitiveAssessmentPage() {
    const config = getDimensionById("cognitive");
    if (!config) return null;
    return <AssessmentRunner config={config} />;
}
