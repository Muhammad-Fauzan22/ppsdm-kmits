import { redirect } from 'next/navigation';

/**
 * Dashboard Community - Study groups and peer learning
 * Redirects to main community page
 */
export default function DashboardCommunityPage() {
    redirect('/community');
}
