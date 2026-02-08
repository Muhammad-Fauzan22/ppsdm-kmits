"use client";

import React from "react";
import { cognitiveConfig } from "@/features/assessment-engine/config/dimensions";
import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";

export default function CognitiveAssessmentPage() {
    return <AssessmentRunner config={cognitiveConfig} />;
}
