'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CampusEvent, EventCategory } from '@/lib/campus/types';
import { EVENT_CATEGORIES, EVENT_STATUS_MAP } from '@/lib/campus/types';

// ─── Calendar Grid Component ─────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
    return new Date(year, month, 1).getDay(); // 0=Sunday
}

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function EventCalendar() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [events, setEvents] = useState<CampusEvent[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('semua');
    const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                month: String(month + 1),
                year: String(year),
            });
            if (selectedCategory !== 'semua') {
                params.set('category', selectedCategory);
            }
            const res = await fetch(`/api/campus/events?${params}`);
            const json = await res.json();
            if (json.success) {
                setEvents(json.data);
            }
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    }, [month, year, selectedCategory]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const getEventsForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => {
            const start = e.date_start;
            const end = e.date_end || e.date_start;
            return dateStr >= start && dateStr <= end;
        });
    };

    const getCategoryMeta = (cat: string) => {
        return EVENT_CATEGORIES.find(c => c.value === cat) || EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1];
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Category Filters */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20
            }}>
                <button
                    onClick={() => setSelectedCategory('semua')}
                    style={{
                        padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                        background: selectedCategory === 'semua' ? '#6366f1' : 'rgba(255,255,255,0.08)',
                        color: selectedCategory === 'semua' ? '#fff' : 'rgba(255,255,255,0.7)',
                    }}
                >
                    Semua
                </button>
                {EVENT_CATEGORIES.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        style={{
                            padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                            fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                            background: selectedCategory === cat.value ? cat.color : 'rgba(255,255,255,0.08)',
                            color: selectedCategory === cat.value ? '#fff' : 'rgba(255,255,255,0.7)',
                        }}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* Month Navigation */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 16, padding: '12px 20px',
                background: 'rgba(255,255,255,0.05)', borderRadius: 12,
            }}>
                <button onClick={prevMonth} style={{
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                    padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 16,
                }}>
                    ◀
                </button>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 20 }}>
                    {MONTH_NAMES[month]} {year}
                </h3>
                <button onClick={nextMonth} style={{
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                    padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 16,
                }}>
                    ▶
                </button>
            </div>

            {/* Calendar Grid */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2,
                background: 'rgba(255,255,255,0.03)', borderRadius: 12, overflow: 'hidden',
            }}>
                {/* Day Headers */}
                {DAY_NAMES.map(day => (
                    <div key={day} style={{
                        padding: '10px 4px', textAlign: 'center', fontWeight: 600,
                        fontSize: 12, color: 'rgba(255,255,255,0.5)',
                        background: 'rgba(255,255,255,0.05)',
                    }}>
                        {day}
                    </div>
                ))}

                {/* Empty cells before first day */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} style={{
                        minHeight: 80, background: 'rgba(0,0,0,0.2)',
                    }} />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDay(day);
                    const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

                    return (
                        <div
                            key={day}
                            style={{
                                minHeight: 80, padding: 6,
                                background: isToday ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                                borderLeft: isToday ? '2px solid #6366f1' : 'none',
                                cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                if (dayEvents.length) (e.currentTarget.style.background = 'rgba(255,255,255,0.08)');
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget.style.background = isToday ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)');
                            }}
                        >
                            <div style={{
                                fontSize: 13, fontWeight: isToday ? 700 : 400,
                                color: isToday ? '#818cf8' : 'rgba(255,255,255,0.7)',
                                marginBottom: 4,
                            }}>
                                {day}
                            </div>
                            {dayEvents.slice(0, 2).map(event => {
                                const meta = getCategoryMeta(event.category);
                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => setSelectedEvent(event)}
                                        style={{
                                            fontSize: 10, padding: '2px 4px', marginBottom: 2,
                                            borderRadius: 4, cursor: 'pointer',
                                            background: `${meta.color}30`, color: meta.color,
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {meta.icon} {event.title}
                                    </div>
                                );
                            })}
                            {dayEvents.length > 2 && (
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                                    +{dayEvents.length - 2} lagi
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.5)' }}>
                    Memuat kegiatan...
                </div>
            )}

            {/* Upcoming Events List */}
            {!loading && events.length > 0 && (
                <div style={{ marginTop: 24 }}>
                    <h4 style={{ color: '#fff', marginBottom: 12 }}>📅 Kegiatan Bulan Ini ({events.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {events.map(event => {
                            const meta = getCategoryMeta(event.category);
                            const statusMeta = EVENT_STATUS_MAP[event.status];
                            return (
                                <div
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.04)',
                                        borderLeft: `3px solid ${meta.color}`,
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                >
                                    <div style={{ fontSize: 28, width: 40, textAlign: 'center' }}>{meta.icon}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: '#fff', fontWeight: 500, fontSize: 14, marginBottom: 2 }}>
                                            {event.title}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                            {new Date(event.date_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            {event.time_start && ` • ${event.time_start.slice(0, 5)}`}
                                            {event.location && ` • ${event.location}`}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                                        background: `${statusMeta.color}25`, color: statusMeta.color,
                                    }}>
                                        {statusMeta.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div
                    onClick={() => setSelectedEvent(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, padding: 20,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#1a1a2e', borderRadius: 16, padding: 28,
                            maxWidth: 500, width: '100%', maxHeight: '80vh', overflow: 'auto',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                            <div>
                                <span style={{
                                    padding: '3px 10px', borderRadius: 6, fontSize: 12,
                                    background: `${getCategoryMeta(selectedEvent.category).color}25`,
                                    color: getCategoryMeta(selectedEvent.category).color,
                                }}>
                                    {getCategoryMeta(selectedEvent.category).icon} {getCategoryMeta(selectedEvent.category).label}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                style={{
                                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer', fontSize: 20, padding: 4,
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <h3 style={{ color: '#fff', margin: '0 0 12px', fontSize: 20 }}>
                            {selectedEvent.title}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>
                            {selectedEvent.description}
                        </p>
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16,
                            fontSize: 13, color: 'rgba(255,255,255,0.6)',
                        }}>
                            <div>📅 {new Date(selectedEvent.date_start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            {selectedEvent.time_start && <div>⏰ {selectedEvent.time_start.slice(0, 5)} - {selectedEvent.time_end?.slice(0, 5) || 'selesai'}</div>}
                            {selectedEvent.location && <div>📍 {selectedEvent.location}</div>}
                            {selectedEvent.organizer && <div>🏢 {selectedEvent.organizer}</div>}
                            {selectedEvent.max_participants && <div>👥 Maks. {selectedEvent.max_participants} peserta</div>}
                            {selectedEvent.contact_person && <div>📞 {selectedEvent.contact_person}</div>}
                        </div>
                        {selectedEvent.registration_url && (
                            <a
                                href={selectedEvent.registration_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block', marginTop: 16,
                                    padding: '10px 20px', borderRadius: 8,
                                    background: '#6366f1', color: '#fff',
                                    textDecoration: 'none', fontWeight: 500, fontSize: 14,
                                }}
                            >
                                Daftar Sekarang →
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
