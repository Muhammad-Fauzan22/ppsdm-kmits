import { redirect } from 'next/navigation';

/**
 * Dashboard Assessment Hub - Unified assessment access
 * Redirects to main assessment page
 */
export default function DashboardAssessmentPage() {
    redirect('/assessment');
}
