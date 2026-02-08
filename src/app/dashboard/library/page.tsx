import { redirect } from 'next/navigation';

/**
 * Dashboard Library - Unified learning library
 * Redirects to the main library page which is already integrated
 */
export default function DashboardLibraryPage() {
    redirect('/library');
}
