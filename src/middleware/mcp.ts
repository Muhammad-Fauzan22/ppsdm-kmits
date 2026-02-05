import { NextRequest, NextResponse } from 'next/server'
import { mcpIntegration } from '@/lib/mcp-integration'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl

    // Initialize MCP integration
    const results = await mcpIntegration.initialize()
    
    // Log connection status
    console.log('MCP Integration Status:', results)

    // Example: Add MCP headers to responses
    const response = NextResponse.next()
    response.headers.set('X-MCP-Status', results.supabase && results.github ? 'OK' : 'ERROR')
    response.headers.set('X-MCP-Supabase', results.supabase ? 'CONNECTED' : 'DISCONNECTED')
    response.headers.set('X-MCP-GitHub', results.github ? 'CONNECTED' : 'DISCONNECTED')

    return response
}

export const config = {
    matcher: [
        // Apply to all routes
        '/'
    ]
}