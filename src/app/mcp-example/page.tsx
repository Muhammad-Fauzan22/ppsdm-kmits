'use client'

import { useState, useEffect } from 'react'
import { mcpNextJS } from '@/lib/mcp-nextjs'

export default function MCPExample() {
    const [status, setStatus] = useState('idle')
    const [githubUser, setGitHubUser] = useState<any>(null)
    const [supabaseData, setSupabaseData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [connections, setConnections] = useState({ supabase: false, github: false })

    useEffect(() => {
        initializeMCP()
    }, [])

    const initializeMCP = async () => {
        setStatus('initializing')
        try {
            // Check individual connections instead of relying on combined success
            // First, check if initialize works
            const success = await mcpNextJS.initialize()
            if (success) {
                // Try to fetch GitHub user to verify connection
                try {
                    await mcpNextJS.getGitHubUser()
                    setConnections(prev => ({ ...prev, github: true }))
                } catch (e) {
                    setConnections(prev => ({ ...prev, github: false }))
                }
                
                // Try to fetch Supabase data to verify connection
                try {
                    await mcpNextJS.getUserProfile('user-id-here')
                    setConnections(prev => ({ ...prev, supabase: true }))
                } catch (e) {
                    setConnections(prev => ({ ...prev, supabase: false }))
                }
                
                setStatus('ready')
                await fetchGitHubUser()
                await fetchSupabaseData()
            } else {
                setStatus('error')
                setError('Failed to initialize MCP integration')
            }
        } catch (err) {
            setStatus('error')
            setError('Error initializing MCP: ' + (err as Error).message)
        }
    }

    const fetchGitHubUser = async () => {
        try {
            const user = await mcpNextJS.getGitHubUser()
            setGitHubUser(user)
        } catch (err) {
            setError('Error fetching GitHub user: ' + (err as Error).message)
        }
    }

    const fetchSupabaseData = async () => {
        try {
            const userProfile = await mcpNextJS.getUserProfile('user-id-here')
            const activities = await mcpNextJS.getRecentActivities('user-id-here')
            const scores = await mcpNextJS.getDimensionScores('user-id-here')
            
            setSupabaseData({
                userProfile,
                activities,
                scores
            })
        } catch (err) {
            setError('Error fetching Supabase data: ' + (err as Error).message)
        }
    }

    const createGitHubIssue = async () => {
        setStatus('creating-issue')
        try {
            const issue = await mcpNextJS.createGitHubIssue(
                'ppsdk-kmm/mcp-integration',
                'Test Issue from MCP Integration',
                'This is a test issue created via MCP integration'
            )
            setStatus('ready')
        } catch (err) {
            setStatus('error')
            setError('Error creating GitHub issue: ' + (err as Error).message)
        }
    }

    const syncUserData = async () => {
        setStatus('syncing')
        try {
            const success = await mcpNextJS.syncUserData()
            if (success) {
                setStatus('ready')
                await fetchSupabaseData()
            } else {
                setStatus('error')
                setError('Failed to sync user data')
            }
        } catch (err) {
            setStatus('error')
            setError('Error syncing user data: ' + (err as Error).message)
        }
    }

    if (status === 'idle') {
        return (
            <div>
                <h1>MCP Integration Example</h1>
                <p>Initializing...</p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div>
                <h1>MCP Integration Example</h1>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <button onClick={initializeMCP}>Retry</button>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>MCP Integration Example</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <h2>Status: {status}</h2>
                {githubUser && (
                    <div>
                        <h3>GitHub User</h3>
                        <p><strong>Login:</strong> {githubUser.login}</p>
                        <p><strong>Name:</strong> {githubUser.name}</p>
                        <img 
                            src={githubUser.avatar_url} 
                            alt={githubUser.login}
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                        />
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Supabase Data</h2>
                {supabaseData && (
                    <div>
                        <h3>User Profile</h3>
                        <pre>{JSON.stringify(supabaseData.userProfile, null, 2)}</pre>
                        
                        <h3>Recent Activities</h3>
                        <pre>{JSON.stringify(supabaseData.activities, null, 2)}</pre>
                        
                        <h3>Dimension Scores</h3>
                        <pre>{JSON.stringify(supabaseData.scores, null, 2)}</pre>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Actions</h2>
                <button onClick={createGitHubIssue} style={{ marginRight: '10px' }}>
                    Create GitHub Issue
                </button>
                <button onClick={syncUserData}>
                    Sync User Data
                </button>
            </div>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                <h3>Integration Info</h3>
                <p><strong>Supabase:</strong> {connections.supabase ? 'Connected' : 'Disconnected'}</p>
                <p><strong>GitHub:</strong> {connections.github ? 'Connected' : 'Disconnected'}</p>
            </div>
        </div>
    )
}