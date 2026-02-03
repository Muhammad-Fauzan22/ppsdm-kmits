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

export default function DimensionPage({ params }: { params: { slug: string } }) {
  const dimension = dimensions.find((d) => d.slug === params.slug);
  
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
