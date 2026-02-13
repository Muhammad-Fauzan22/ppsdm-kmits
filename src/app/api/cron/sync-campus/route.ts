/**
 * Cron: Seed Campus Data & Sync Environment
 * POST /api/cron/sync-campus
 * 
 * Seeds events + alumni if empty, refreshes weather + AQI cache
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCampusSupabase } from '@/lib/campus/supabase';
import { getSeedEvents } from '@/lib/campus/seed-events';
import { getSeedAlumni } from '@/lib/campus/seed-alumni';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getCampusSupabase();
        const results: Record<string, unknown> = {};

        // 1. Seed events if table is empty
        const { count: eventCount } = await supabase
            .from('campus_events')
            .select('id', { count: 'exact', head: true });

        if (!eventCount || eventCount === 0) {
            const seedEvents = getSeedEvents();
            const { error } = await supabase.from('campus_events').insert(seedEvents);
            results.events = error ? { error: error.message } : { seeded: seedEvents.length };
        } else {
            results.events = { existing: eventCount };
        }

        // 2. Seed alumni if table is empty
        const { count: alumniCount } = await supabase
            .from('alumni_profiles')
            .select('id', { count: 'exact', head: true });

        if (!alumniCount || alumniCount === 0) {
            const seedAlumni = getSeedAlumni();
            // Need to explicitly remove the `fts` field if it exists in type
            const alumniToInsert = seedAlumni.map(a => {
                const { ...rest } = a;
                return rest;
            });
            const { error } = await supabase.from('alumni_profiles').insert(alumniToInsert);
            results.alumni = error ? { error: error.message } : { seeded: alumniToInsert.length };
        } else {
            results.alumni = { existing: alumniCount };
        }

        // 3. Refresh weather cache
        try {
            const apiKey = process.env.OPENWEATHERMAP_API_KEY;
            if (apiKey) {
                const weatherRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=-7.2756&lon=112.7949&appid=${apiKey}&units=metric&lang=id`
                );
                if (weatherRes.ok) {
                    const raw = await weatherRes.json();
                    await supabase.from('environment_cache').upsert({
                        data_type: 'weather',
                        location: 'Surabaya',
                        data_json: {
                            temperature: Math.round(raw.main.temp),
                            feels_like: Math.round(raw.main.feels_like),
                            humidity: raw.main.humidity,
                            description: raw.weather[0]?.description || 'Cerah',
                            icon: raw.weather[0]?.icon || '01d',
                            wind_speed: raw.wind?.speed || 0,
                            pressure: raw.main?.pressure || 0,
                            visibility: (raw.visibility || 10000) / 1000,
                            sunrise: new Date(raw.sys.sunrise * 1000).toISOString(),
                            sunset: new Date(raw.sys.sunset * 1000).toISOString(),
                        },
                        fetched_at: new Date().toISOString(),
                        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                    }, { onConflict: 'data_type,location' });
                    results.weather = { refreshed: true };
                }

                // AQI
                const aqiRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/air_pollution?lat=-7.2756&lon=112.7949&appid=${apiKey}`
                );
                if (aqiRes.ok) {
                    const raw = await aqiRes.json();
                    const main = raw.list?.[0];
                    const aqiIndex = main?.main?.aqi || 2;
                    const components = main?.components || {};
                    await supabase.from('environment_cache').upsert({
                        data_type: 'air_quality',
                        location: 'Surabaya',
                        data_json: {
                            aqi: aqiIndex,
                            level: aqiIndex <= 2 ? 'Baik' : 'Sedang',
                            color: aqiIndex <= 2 ? '#10b981' : '#f59e0b',
                            pm25: components.pm2_5 || 0,
                            pm10: components.pm10 || 0,
                            co: components.co || 0,
                            no2: components.no2 || 0,
                            o3: components.o3 || 0,
                        },
                        fetched_at: new Date().toISOString(),
                        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                    }, { onConflict: 'data_type,location' });
                    results.airQuality = { refreshed: true };
                }
            } else {
                results.weather = { skipped: 'No OPENWEATHERMAP_API_KEY' };
                results.airQuality = { skipped: 'No OPENWEATHERMAP_API_KEY' };
            }
        } catch (envErr) {
            results.environment = { error: String(envErr) };
        }

        return NextResponse.json({
            success: true,
            results,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Sync campus cron error:', err);
        return NextResponse.json(
            { success: false, error: String(err) },
            { status: 500 }
        );
    }
}
