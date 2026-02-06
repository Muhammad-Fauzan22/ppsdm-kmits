import { notFound } from "next/navigation";
import { dimensions } from "@/data/dimensions";
import { DimensionHeader } from "@/components/dimension/DimensionHeader";
import { ResearchOverview } from "@/components/dimension/ResearchOverview";
import { KeyFindings } from "@/components/dimension/KeyFindings";
import { LearningModules } from "@/components/dimension/LearningModules";
import { AssessmentCTA } from "@/components/dimension/AssessmentCTA";

export async function generateStaticParams() {
  return dimensions.map((dim) => ({
    slug: dim.slug,
  }));
}

export default async function DimensionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const dimension = dimensions.find((d) => d.slug === resolvedParams.slug);
  
  if (!dimension) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      <DimensionHeader dimension={dimension} />
      <ResearchOverview research={dimension.research} />
      <KeyFindings findings={dimension.research.keyFindings} />
      <LearningModules modules={dimension.modules} dimensionSlug={dimension.slug} />
      <AssessmentCTA dimension={dimension} />
    </div>
  );
}
