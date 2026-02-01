import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PPSDM KMM - Dashboard',
  description: 'Learning Management System Dashboard',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
