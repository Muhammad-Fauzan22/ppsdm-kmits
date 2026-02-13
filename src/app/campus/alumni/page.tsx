import dynamic from 'next/dynamic';
import Link from 'next/link';

const AlumniDirectory = dynamic(() => import('@/components/campus/AlumniDirectory'), { ssr: false });

export const metadata = {
    title: 'Direktori Alumni — Campus Hub PPSDM KMITS',
    description: 'Direktori alumni Teknik Mesin ITS untuk networking dan mentoring',
};

export default function AlumniPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0a0a1a 0%, #111128 100%)',
            padding: '40px 20px',
        }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <Link href="/campus" style={{
                    color: 'rgba(255,255,255,0.4)', fontSize: 13,
                    textDecoration: 'none', marginBottom: 20, display: 'inline-block',
                }}>
                    ← Campus Hub
                </Link>
                <h1 style={{
                    color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px',
                }}>
                    🎓 Direktori Alumni
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24,
                }}>
                    Temukan alumni Teknik Mesin ITS untuk inspirasi karir dan mentoring
                </p>
                <AlumniDirectory />
            </div>
        </div>
    );
}
