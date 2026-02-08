"use client";

import { notFound } from "next/navigation";
import { dimensions } from "@/features/assessment-engine/config/dimensions";
import { AssessmentRunner } from "@/features/assessment-engine/core/AssessmentRunner";

interface PageProps {
    params: Promise<{
        dimension: string;
    }>
}

export default async function DimensionAssessmentPage(props: PageProps) {
    const params = await props.params;
    const config = dimensions[params.dimension];

    if (!config) {
        notFound();
    }

    return <AssessmentRunner config={config} />;
}
