/**
 * Air Quality API — proxies OpenWeatherMap Air Pollution for Surabaya
 * GET /api/environment/air-quality
 */

import { NextResponse } from 'next/server';
import { getCampusSupabase } from '@/lib/campus/supabase';
import type { AirQualityData } from '@/lib/campus/types';

export const dynamic = 'force-dynamic';

const SURABAYA_LAT = -7.2756;
const SURABAYA_LON = 112.7949;

const AQI_LEVELS: Record<number, { level: AirQualityData['level']; color: string }> = {
    1: { level: 'Baik', color: '#10b981' },
    2: { level: 'Sedang', color: '#f59e0b' },
    3: { level: 'Tidak Sehat untuk Sensitif', color: '#f97316' },
    4: { level: 'Tidak Sehat', color: '#ef4444' },
    5: { level: 'Sangat Tidak Sehat', color: '#991b1b' },
};

export async function GET() {
    try {
        const supabase = getCampusSupabase();

        // Check cache first
        const { data: cached } = await supabase
            .from('environment_cache')
            .select('*')
            .eq('data_type', 'air_quality')
            .eq('location', 'Surabaya')
            .gt('expires_at', new Date().toISOString())
            .single();

        if (cached) {
            return NextResponse.json({
                success: true,
                data: cached.data_json as AirQualityData,
                cached: true,
                fetchedAt: cached.fetched_at,
            });
        }

        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                success: true,
                data: getFallbackAQI(),
                cached: false,
                note: 'Using fallback data — set OPENWEATHERMAP_API_KEY for live data',
            });
        }

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${SURABAYA_LAT}&lon=${SURABAYA_LON}&appid=${apiKey}`,
            { next: { revalidate: 1800 } }
        );

        if (!res.ok) throw new Error(`OpenWeatherMap AQI error: ${res.status}`);

        const raw = await res.json();
        const main = raw.list?.[0];
        const aqiIndex = main?.main?.aqi || 2;
        const components = main?.components || {};

        const aqiData: AirQualityData = {
            aqi: aqiIndex,
            level: AQI_LEVELS[aqiIndex]?.level || 'Sedang',
            color: AQI_LEVELS[aqiIndex]?.color || '#f59e0b',
            pm25: components.pm2_5 || 0,
            pm10: components.pm10 || 0,
            co: components.co || 0,
            no2: components.no2 || 0,
            o3: components.o3 || 0,
        };

        // Cache for 30 minutes
        await supabase
            .from('environment_cache')
            .upsert({
                data_type: 'air_quality',
                location: 'Surabaya',
                data_json: aqiData,
                fetched_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            }, { onConflict: 'data_type,location' });

        return NextResponse.json({
            success: true,
            data: aqiData,
            cached: false,
        });
    } catch (err) {
        console.error('Air Quality API error:', err);
        return NextResponse.json({
            success: true,
            data: getFallbackAQI(),
            cached: false,
            note: 'Fallback data due to error',
        });
    }
}

function getFallbackAQI(): AirQualityData {
    return {
        aqi: 2,
        level: 'Sedang',
        color: '#f59e0b',
        pm25: 18.5,
        pm10: 30.2,
        co: 350,
        no2: 15,
        o3: 45,
    };
}
