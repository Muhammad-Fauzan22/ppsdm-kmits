"use client";

import { notFound } from "next/navigation";
import { dimensions } from "@/features/assessment-engine/config/dimensions";
import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";

interface PageProps {
    params: {
        dimension: string;
    }
}

export default function DimensionAssessmentPage({ params }: PageProps) {
    const config = dimensions[params.dimension];

    if (!config) {
        notFound();
    }

    return <AssessmentRunner config={config} />;
}
