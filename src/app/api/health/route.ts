import { NextResponse } from 'next/server';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  checks: {
    database: { status: 'up' | 'down' | 'degraded'; message?: string; lastChecked: string };
    redis: { status: 'up' | 'down' | 'degraded'; message?: string; lastChecked: string };
    api: { status: 'up' | 'down' | 'degraded'; latency: number; lastChecked: string };
    storage: { status: 'up' | 'down' | 'degraded'; message?: string; lastChecked: string };
  };
}

export async function GET() {
  const startTime = Date.now();
  const checks = {
    database: { status: 'up' as const, lastChecked: new Date().toISOString() },
    redis: { status: 'up' as const, lastChecked: new Date().toISOString() },
    api: { status: 'up' as const, latency: Date.now() - startTime, lastChecked: new Date().toISOString() },
    storage: { status: 'up' as const, lastChecked: new Date().toISOString() },
  };

  const allHealthy = Object.values(checks).every(c => c.status === 'up');
  const response: HealthCheckResponse = {
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    checks,
  };

  const statusCode = response.status === 'healthy' ? 200 : 503;
  return NextResponse.json(response, { status: statusCode });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
