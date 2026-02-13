import Link from 'next/link';
import dynamic from 'next/dynamic';

const WeatherWidget = dynamic(() => import('@/components/widgets/WeatherWidget'), { ssr: false });
const DailyQuoteWidget = dynamic(() => import('@/components/widgets/DailyQuoteWidget'), { ssr: false });

export const metadata = {
    title: 'Campus Hub — PPSDM KMITS',
    description: 'Pusat informasi kegiatan, transparansi keuangan, dan jaringan alumni KMITS',
};

const hubCards = [
    {
        title: 'Kalender Kegiatan',
        description: 'Jadwal seminar, workshop, lomba, dan acara kampus lainnya',
        icon: '📅',
        href: '/campus/kegiatan',
        color: '#6366f1',
        stats: '15+ acara',
    },
    {
        title: 'Transparansi Keuangan',
        description: 'Dashboard pemasukan, pengeluaran, dan alokasi dana himpunan',
        icon: '💰',
        href: '/campus/keuangan',
        color: '#10b981',
        stats: 'Real-time',
    },
    {
        title: 'Direktori Alumni',
        description: 'Temukan alumni untuk mentoring, networking, dan inspirasi karir',
        icon: '🎓',
        href: '/campus/alumni',
        color: '#f59e0b',
        stats: '15+ alumni',
    },
    {
        title: 'Knowledge Hub',
        description: 'Fakta teknik, artikel, dan kuis interaktif keteknikan',
        icon: '🧠',
        href: '/knowledge',
        color: '#ec4899',
        stats: 'Interaktif',
    },
];

export default function CampusHubPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0a0a1a 0%, #111128 50%, #0d0d24 100%)',
            padding: '40px 20px 60px',
        }}>
            {/* Hero Section */}
            <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 72, height: 72, borderRadius: 20,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))',
                    border: '1px solid rgba(99,102,241,0.3)',
                    fontSize: 36, marginBottom: 16,
                }}>
                    🏛️
                </div>
                <h1 style={{
                    color: '#fff', fontSize: 40, fontWeight: 800, margin: '0 0 12px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                }}>
                    Campus Hub
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.55)', fontSize: 16, maxWidth: 520, margin: '0 auto',
                    lineHeight: 1.7,
                }}>
                    Pusat informasi kehidupan kampus Teknik Mesin ITS — kegiatan, transparansi keuangan, dan jaringan alumni
                </p>
            </div>

            {/* Weather & Quote Widgets Row */}
            <div style={{
                maxWidth: 960, margin: '0 auto 32px',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 16,
            }}>
                <WeatherWidget />
                <DailyQuoteWidget />
            </div>

            {/* Hub Cards */}
            <div style={{
                maxWidth: 960, margin: '0 auto 40px',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
            }}>
                {hubCards.map(card => (
                    <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 16, padding: 24, cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            {/* Top accent line */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                                background: `linear-gradient(90deg, ${card.color}, ${card.color}88)`,
                            }} />
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginBottom: 12,
                            }}>
                                <div style={{ fontSize: 36 }}>{card.icon}</div>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, color: card.color,
                                    background: `${card.color}15`, padding: '4px 10px',
                                    borderRadius: 20, letterSpacing: '0.02em',
                                }}>
                                    {card.stats}
                                </span>
                            </div>
                            <h3 style={{ color: '#fff', fontSize: 17, margin: '0 0 6px', fontWeight: 600 }}>
                                {card.title}
                            </h3>
                            <p style={{
                                color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 16px',
                                lineHeight: 1.5,
                            }}>
                                {card.description}
                            </p>
                            <div style={{
                                fontSize: 13, color: card.color, fontWeight: 500,
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                                Lihat <span style={{ transition: 'transform 0.2s' }}>→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Links */}
            <div style={{
                maxWidth: 960, margin: '0 auto 40px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 16, padding: 24,
            }}>
                <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
                    ⚡ Quick Links
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {[
                        { label: '📊 Dashboard', href: '/dashboard' },
                        { label: '📝 Asesmen', href: '/try-assessment' },
                        { label: '📚 Perpustakaan', href: '/perpustakaan' },
                        { label: '🗓️ Weekly Plan', href: '/weekly-plan' },
                        { label: '👤 Profil', href: '/profile' },
                    ].map(link => (
                        <Link key={link.href} href={link.href} style={{
                            padding: '8px 16px', borderRadius: 10, fontSize: 13, textDecoration: 'none',
                            background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            transition: 'all 0.2s',
                        }}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Back link */}
            <div style={{ textAlign: 'center' }}>
                <Link href="/" style={{
                    color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none',
                }}>
                    ← Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
