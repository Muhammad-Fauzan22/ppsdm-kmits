'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AlumniProfile } from '@/lib/campus/types';

export default function AlumniDirectory() {
    const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [angkatan, setAngkatan] = useState('');
    const [mentorOnly, setMentorOnly] = useState(false);
    const [angkatanList, setAngkatanList] = useState<string[]>([]);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const limit = 12;

    const fetchAlumni = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
            if (search) params.set('search', search);
            if (angkatan) params.set('angkatan', angkatan);
            if (mentorOnly) params.set('mentor', 'true');

            const res = await fetch(`/api/campus/alumni?${params}`);
            const json = await res.json();
            if (json.success) {
                setAlumni(json.data);
                setTotal(json.total);
                if (json.filters?.angkatan) setAngkatanList(json.filters.angkatan);
            }
        } catch (err) {
            console.error('Alumni fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [search, angkatan, mentorOnly, offset]);

    useEffect(() => {
        const debounce = setTimeout(fetchAlumni, 300);
        return () => clearTimeout(debounce);
    }, [fetchAlumni]);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return (
        <div>
            {/* Search & Filters */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24,
                padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12,
            }}>
                <input
                    type="text"
                    placeholder="🔍 Cari alumni (nama, perusahaan, posisi)..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
                    style={{
                        flex: '1 1 250px', padding: '10px 14px', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)',
                        color: '#fff', fontSize: 14, outline: 'none',
                    }}
                />
                <select
                    value={angkatan}
                    onChange={(e) => { setAngkatan(e.target.value); setOffset(0); }}
                    style={{
                        padding: '10px 14px', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)',
                        color: '#fff', fontSize: 14, cursor: 'pointer',
                    }}
                >
                    <option value="">Semua Angkatan</option>
                    {angkatanList.map(a => (
                        <option key={a} value={a}>Angkatan {a}</option>
                    ))}
                </select>
                <button
                    onClick={() => { setMentorOnly(!mentorOnly); setOffset(0); }}
                    style={{
                        padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 500,
                        background: mentorOnly ? '#10b981' : 'rgba(255,255,255,0.08)',
                        color: mentorOnly ? '#fff' : 'rgba(255,255,255,0.7)',
                        transition: 'all 0.2s',
                    }}
                >
                    🎓 Mentor Only
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.04)', borderRadius: 14, height: 220,
                            animation: 'pulse 1.5s infinite',
                        }} />
                    ))}
                </div>
            )}

            {/* Alumni Grid */}
            {!loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                    {alumni.map(person => (
                        <AlumniCard key={person.id} alumni={person} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && alumni.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)',
                }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
                    <p>Tidak ada alumni yang ditemukan.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24,
                }}>
                    <button
                        onClick={() => setOffset(Math.max(0, offset - limit))}
                        disabled={offset === 0}
                        style={{
                            padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13,
                            opacity: offset === 0 ? 0.3 : 1,
                        }}
                    >
                        ← Sebelumnya
                    </button>
                    <span style={{ padding: '8px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                        onClick={() => setOffset(offset + limit)}
                        disabled={currentPage >= totalPages}
                        style={{
                            padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13,
                            opacity: currentPage >= totalPages ? 0.3 : 1,
                        }}
                    >
                        Selanjutnya →
                    </button>
                </div>
            )}

            {/* Stats */}
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                Menampilkan {alumni.length} dari {total} alumni
            </div>
        </div>
    );
}

function AlumniCard({ alumni }: { alumni: AlumniProfile }) {
    const initials = alumni.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    const bgColor = stringToColor(alumni.name);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 20,
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'all 0.3s', cursor: 'default',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
        >
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                    width: 48, height: 48, borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    fontSize: 16, color: '#fff',
                    background: `linear-gradient(135deg, ${bgColor}cc, ${bgColor}88)`,
                }}>
                    {initials}
                </div>
                <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>
                        {alumni.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        Angkatan {alumni.angkatan} • {alumni.degree}
                    </div>
                </div>
            </div>

            {/* Job */}
            {alumni.job_title && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                    💼 {alumni.job_title}
                </div>
            )}
            {alumni.company && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                    🏢 {alumni.company}
                </div>
            )}
            {alumni.city && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                    📍 {alumni.city}{alumni.country !== 'Indonesia' ? `, ${alumni.country}` : ''}
                </div>
            )}

            {/* Skills */}
            {alumni.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {alumni.skills.slice(0, 4).map(skill => (
                        <span key={skill} style={{
                            padding: '2px 8px', borderRadius: 6, fontSize: 10,
                            background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                        }}>
                            {skill}
                        </span>
                    ))}
                    {alumni.skills.length > 4 && (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', padding: '2px 4px' }}>
                            +{alumni.skills.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Mentor Badge */}
            {alumni.is_mentor && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 10px', borderRadius: 8,
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                    <span style={{ fontSize: 14 }}>🎓</span>
                    <div>
                        <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Bersedia Mentoring</div>
                        {alumni.mentor_topics.length > 0 && (
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                                {alumni.mentor_topics.slice(0, 2).join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Deterministic color from string
function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 60%, 45%)`;
}
