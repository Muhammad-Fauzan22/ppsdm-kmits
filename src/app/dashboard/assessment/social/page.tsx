"use client";

import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";
import { socialConfig } from "@/features/assessment-engine/config/dimensions";

export default function SocialAssessmentPage() {
    return <AssessmentRunner config={socialConfig} />;
}
