'use client';

import { useState, useEffect } from 'react';

interface WeatherInfo {
    temperature: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
    wind_speed: number;
}

interface AQIInfo {
    aqi: number;
    level: string;
    color: string;
    pm25: number;
}

const WEATHER_ICONS: Record<string, string> = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
};

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [aqi, setAqi] = useState<AQIInfo | null>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/environment/weather').then(r => r.json()),
            fetch('/api/environment/air-quality').then(r => r.json()),
        ]).then(([wData, aData]) => {
            if (wData.success) setWeather(wData.data);
            if (aData.success) setAqi(aData.data);
        }).catch(console.error);
    }, []);

    if (!weather) return null;

    const weatherIcon = WEATHER_ICONS[weather.icon] || '🌤️';

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: expanded ? '10px 16px' : '6px 12px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', transition: 'all 0.3s',
                position: 'relative', fontSize: 13, color: 'rgba(255,255,255,0.8)',
            }}
        >
            <span style={{ fontSize: 18 }}>{weatherIcon}</span>
            <span style={{ fontWeight: 600 }}>{weather.temperature}°C</span>

            {aqi && (
                <span style={{
                    padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    background: `${aqi.color}25`, color: aqi.color,
                }}>
                    AQI {aqi.aqi}
                </span>
            )}

            {expanded && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: 8,
                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12, padding: 16, width: 220, zIndex: 100,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                >
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                        📍 Surabaya, Jawa Timur
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 36 }}>{weatherIcon}</span>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{weather.temperature}°C</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                                {weather.description}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        <div>🌡️ Terasa {weather.feels_like}°C</div>
                        <div>💧 {weather.humidity}%</div>
                        <div>💨 {weather.wind_speed} m/s</div>
                        {aqi && <div style={{ color: aqi.color }}>🫁 {aqi.level}</div>}
                    </div>
                    {aqi && (
                        <div style={{
                            marginTop: 10, padding: '6px 10px', borderRadius: 8, fontSize: 11,
                            background: `${aqi.color}15`, color: aqi.color,
                            borderLeft: `3px solid ${aqi.color}`,
                        }}>
                            PM2.5: {aqi.pm25} µg/m³ — {aqi.level}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
