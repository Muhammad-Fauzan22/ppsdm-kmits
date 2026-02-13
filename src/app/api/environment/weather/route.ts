/**
 * Weather API — proxies OpenWeatherMap for Surabaya (ITS campus)
 * GET /api/environment/weather
 */

import { NextResponse } from 'next/server';
import { getCampusSupabase } from '@/lib/campus/supabase';
import type { WeatherData } from '@/lib/campus/types';

export const dynamic = 'force-dynamic';

const SURABAYA_LAT = -7.2756;
const SURABAYA_LON = 112.7949;

export async function GET() {
    try {
        const supabase = getCampusSupabase();

        // Check cache first
        const { data: cached } = await supabase
            .from('environment_cache')
            .select('*')
            .eq('data_type', 'weather')
            .eq('location', 'Surabaya')
            .gt('expires_at', new Date().toISOString())
            .single();

        if (cached) {
            return NextResponse.json({
                success: true,
                data: cached.data_json as WeatherData,
                cached: true,
                fetchedAt: cached.fetched_at,
            });
        }

        // Fetch from OpenWeatherMap
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        if (!apiKey) {
            // Return fallback data if no API key
            return NextResponse.json({
                success: true,
                data: getFallbackWeather(),
                cached: false,
                note: 'Using fallback data — set OPENWEATHERMAP_API_KEY for live data',
            });
        }

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${SURABAYA_LAT}&lon=${SURABAYA_LON}&appid=${apiKey}&units=metric&lang=id`,
            { next: { revalidate: 1800 } }
        );

        if (!res.ok) throw new Error(`OpenWeatherMap error: ${res.status}`);

        const raw = await res.json();
        const weatherData: WeatherData = {
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
        };

        // Cache for 30 minutes
        await supabase
            .from('environment_cache')
            .upsert({
                data_type: 'weather',
                location: 'Surabaya',
                data_json: weatherData,
                fetched_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            }, { onConflict: 'data_type,location' });

        return NextResponse.json({
            success: true,
            data: weatherData,
            cached: false,
        });
    } catch (err) {
        console.error('Weather API error:', err);
        return NextResponse.json({
            success: true,
            data: getFallbackWeather(),
            cached: false,
            note: 'Fallback data due to error',
        });
    }
}

function getFallbackWeather(): WeatherData {
    return {
        temperature: 31,
        feels_like: 34,
        humidity: 72,
        description: 'berawan',
        icon: '03d',
        wind_speed: 3.5,
        pressure: 1010,
        visibility: 8,
        sunrise: new Date().toISOString(),
        sunset: new Date().toISOString(),
    };
}
