import { redirect } from 'next/navigation';

/**
 * Dashboard Roadmap - Personal learning roadmap
 * Redirects to main roadmap page
 */
export default function DashboardRoadmapPage() {
    redirect('/roadmap');
}
