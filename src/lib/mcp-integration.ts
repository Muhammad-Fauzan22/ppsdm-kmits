/**
 * MCP Integration Module for Supabase and GitHub
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class MCPIntegration {
    private supabaseClient: SupabaseClient | null = null

    constructor() {
    }

    async initialize() {
        console.log("Initializing MCP Integration...")

        const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const hasGitHub = !!process.env.GITHUB_TOKEN

        console.log(`Supabase connection: ${hasSupabase ? 'OK' : 'MISSING'}`)
        console.log(`GitHub connection: ${hasGitHub ? 'OK' : 'MISSING'}`)

        if (hasSupabase) {
            this.supabaseClient = this.initializeSupabase()
        }

        return { supabase: hasSupabase, github: hasGitHub }
    }

    private initializeSupabase(): SupabaseClient {
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        )
    }

    getSupabaseClient(): SupabaseClient | null {
        return this.supabaseClient
    }

    async getGitHubUser() {
        const token = process.env.GITHUB_TOKEN
        if (!token) return null

        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            })

            if (response.ok) {
                return await response.json()
            }
        } catch (error) {
            console.error('Error fetching GitHub user:', error)
        }

        return null
    }

    async createGitHubIssue(repo: string, title: string, body: string) {
        const token = process.env.GITHUB_TOKEN
        if (!token) return null

        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, body })
            })

            if (response.ok) {
                return await response.json()
            }
        } catch (error) {
            console.error('Error creating GitHub issue:', error)
        }

        return null
    }

    async querySupabase(query: string, params?: any[]) {
        if (!this.supabaseClient) {
            console.error('Supabase client not initialized')
            return null
        }

        try {
            const { data, error } = await this.supabaseClient.rpc(query, params)
            if (error) {
                console.error('Supabase query error:', error)
                return null
            }
            return data
        } catch (error) {
            console.error('Error querying Supabase:', error)
            return null
        }
    }
}

// Export singleton instance
export const mcpIntegration = new MCPIntegration()