import dynamic from 'next/dynamic';
import Link from 'next/link';

const EventCalendar = dynamic(() => import('@/components/campus/EventCalendar'), { ssr: false });

export const metadata = {
    title: 'Kalender Kegiatan — Campus Hub PPSDM KMITS',
    description: 'Jadwal kegiatan, seminar, workshop, dan acara Teknik Mesin ITS',
};

export default function KegiatanPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0a0a1a 0%, #111128 100%)',
            padding: '40px 20px',
        }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Link href="/campus" style={{
                    color: 'rgba(255,255,255,0.4)', fontSize: 13,
                    textDecoration: 'none', marginBottom: 20, display: 'inline-block',
                }}>
                    ← Campus Hub
                </Link>
                <h1 style={{
                    color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px',
                }}>
                    📅 Kalender Kegiatan
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24,
                }}>
                    Jadwal kegiatan Himpunan Teknik Mesin ITS
                </p>
                <EventCalendar />
            </div>
        </div>
    );
}
