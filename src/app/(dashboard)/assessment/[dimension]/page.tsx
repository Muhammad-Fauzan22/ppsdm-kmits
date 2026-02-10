'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { AssessmentRunner } from '@/features/assessment-engine';
import { getDimensionById } from '@/features/assessment-engine/config/dimensions';

import { AssessmentResult } from '@/features/assessment-engine/core/types';

// Inline skeleton component to avoid import issues
function AssessmentSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function DimensionAssessmentPage() {
  const params = useParams();
  const dimensionId = params.dimension as string;

  // Get configuration for this dimension
  const config = getDimensionById(dimensionId);


  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Dimension</h1>
          <p className="text-slate-600">Dimension "{dimensionId}" not found.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<AssessmentSkeleton />}>
      <AssessmentRunner
        config={config}
      />
    </Suspense>
  );
}
