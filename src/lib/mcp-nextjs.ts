import { mcpIntegration } from './mcp-integration'

export class MCPNextJS {
    private static instance: MCPNextJS
    private initialized = false

    private constructor() {}

    static getInstance(): MCPNextJS {
        if (!MCPNextJS.instance) {
            MCPNextJS.instance = new MCPNextJS()
        }
        return MCPNextJS.instance
    }

    async initialize() {
        if (this.initialized) return true

        try {
            const results = await mcpIntegration.initialize()
            this.initialized = true
            return results.supabase && results.github
        } catch (error) {
            console.error('MCP Next.js initialization failed:', error)
            return false
        }
    }

    async getGitHubUser() {
        return await mcpIntegration.getGitHubUser()
    }

    async createGitHubIssue(repo: string, title: string, body: string) {
        return await mcpIntegration.createGitHubIssue(repo, title, body)
    }

    async querySupabase(query: string, params?: any[]) {
        return await mcpIntegration.querySupabase(query, params)
    }

    async getUserProfile(userId: string) {
        try {
            const result = await this.querySupabase(
                'select * from profiles where id = $1',
                [userId]
            )
            return result?.[0] || null
        } catch (error) {
            console.error('Error getting user profile:', error)
            return null
        }
    }

    async updateUserProfile(userId: string, updates: any) {
        try {
            const result = await this.querySupabase(
                'update profiles set data = $1 where id = $2 returning *',
                [updates, userId]
            )
            return result?.[0] || null
        } catch (error) {
            console.error('Error updating user profile:', error)
            return null
        }
    }

    async getRecentActivities(userId: string, limit = 10) {
        try {
            const result = await this.querySupabase(
                'select * from activities where user_id = $1 order by created_at desc limit $2',
                [userId, limit]
            )
            return result || []
        } catch (error) {
            console.error('Error getting recent activities:', error)
            return []
        }
    }

    async getDimensionScores(userId: string) {
        try {
            const result = await this.querySupabase(
                'select * from dimension_scores where user_id = $1',
                [userId]
            )
            return result || []
        } catch (error) {
            console.error('Error getting dimension scores:', error)
            return []
        }
    }

    async getLeaderboard(dimension?: string, limit = 10) {
        try {
            let query = 'select p.*, ds.score from profiles p ' +
                       'join dimension_scores ds on p.id = ds.user_id ' +
                       'where ds.score > 0 '
            
            const params: any[] = []
            if (dimension) {
                query += 'and ds.dimension = $1 '
                params.push(dimension)
            }
            
            query += 'order by ds.score desc limit $2'
            params.push(limit)
            
            const result = await this.querySupabase(query, params)
            return result || []
        } catch (error) {
            console.error('Error getting leaderboard:', error)
            return []
        }
    }

    async syncUserData() {
        try {
            // Sync GitHub user data with Supabase
            const githubUser = await this.getGitHubUser()
            if (githubUser) {
                const supabaseUser = await this.getUserProfile(githubUser.id)
                
                if (!supabaseUser) {
                    // Create new user profile
                    await this.querySupabase(
                        'insert into profiles (id, email, full_name, avatar_url) values ($1, $2, $3, $4)',
                        [githubUser.id, githubUser.email || '', githubUser.name || 'GitHub User', githubUser.avatar_url || '']
                    )
                } else {
                    // Update existing user profile
                    await this.updateUserProfile(githubUser.id, {
                        email: githubUser.email,
                        full_name: githubUser.name,
                        avatar_url: githubUser.avatar_url
                    })
                }
                
                return true
            }
        } catch (error) {
            console.error('Error syncing user data:', error)
        }
        
        return false
    }
}

// Export singleton instance
export const mcpNextJS = MCPNextJS.getInstance()