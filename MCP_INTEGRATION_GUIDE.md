# MCP Integration Guide for PPSDM KMM

Panduan ini menjelaskan cara mengintegrasikan MCP (Model Context Protocol) dengan Supabase dan GitHub untuk proyek PPSDM KMM.

## Overview

MCP memungkinkan integrasi antara aplikasi dengan layanan eksternal seperti Supabase dan GitHub melalui protokol standar. Integrasi ini akan memungkinkan:

- Koneksi ke database Supabase
- Interaksi dengan GitHub API
- Automasi workflow
- Monitoring dan logging

## Prerequisites

1. **Node.js** (v18 atau lebih tinggi)
2. **Python** (v3.8 atau lebih tinggi)
3. **Supabase Project** dengan konfigurasi yang tepat
4. **GitHub Personal Access Token**

## Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy file konfigurasi MCP:

```bash
cp .env.mcp.local.example .env.mcp.local
```

Edit file `.env.mcp.local` dengan konfigurasi Anda:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
```

### 3. Setup MCP Configuration

File konfigurasi MCP terletak di `.mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "https://your-supabase-project.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
      }
    },
    "github": {
      "command": "npx",
      "args": ["@github/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "your-github-personal-access-token"
      }
    }
  }
}
```

## Testing Koneksi

### Test MCP Connection

```bash
python scripts/mcp_connector.py
```

Output yang diharapkan:
```
MCP Connector Initialized
Testing connections...
Supabase: True
GitHub: True
```

### Test Next.js Integration

```bash
npm run dev
```

## Penggunaan

### 1. Supabase Integration

```typescript
import { mcpIntegration } from './src/lib/mcp-integration'

// Initialize integration
await mcpIntegration.initialize()

// Get Supabase client
const supabase = mcpIntegration.getSupabaseClient()

// Query data
const { data, error } = await supabase
  .from('profiles')
  .select('*')
```

### 2. GitHub Integration

```typescript
import { mcpIntegration } from './src/lib/mcp-integration'

// Get GitHub user info
const user = await mcpIntegration.getGitHubUser()
console.log(user)

// Create GitHub issue
const issue = await mcpIntegration.createGitHubIssue(
  'repo-owner/repo-name',
  'Issue Title',
  'Issue description'
)
```

### 3. Custom Queries

```typescript
// Custom Supabase query
const result = await mcpIntegration.querySupabase(
  'get_user_scores',
  ['user_id_123']
)
```

## Scripts

### Setup Script

```bash
python scripts/setup_mcp_integration.py
```

### Manual Testing

```bash
# Test MCP connection
python scripts/mcp_connector.py

# Test setup
python scripts/setup_mcp_integration.py
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Periksa environment variables
   - Pastikan token valid
   - Cek koneksi internet

2. **Permission Denied**
   - Pastikan service role key benar
   - Cek RLS policies di Supabase

3. **GitHub API Rate Limit**
   - Gunakan token dengan scope yang tepat
   - Tunggu jika mencapai rate limit

### Debug Mode

Aktifkan debug mode dengan menambahkan:

```env
MCP_DEBUG=true
```

## Security Considerations

1. **Never commit tokens** - Pastikan `.env.mcp.local` ada di `.gitignore`
2. **Use service role keys** - Jangan gunakan anon keys untuk production
3. **Limit permissions** - Berikan scope minimal yang diperlukan

## Monitoring

### Logs

Semua aktivitas MCP akan dicatat di:
- `logs/mcp.log`
- Console output saat development

### Metrics

Gunakan Supabase Analytics untuk monitoring:
- Query performance
- Error rates
- Usage patterns

## Best Practices

1. **Initialize once** - Jangan buat multiple instances
2. **Handle errors gracefully** - Selalu cek error responses
3. **Cache results** - Gunakan caching untuk query yang sering
4. **Use async/await** - Pastikan non-blocking operations
5. **Validate inputs** - Selalu sanitize user inputs

## Example Use Cases

### 1. User Authentication

```typescript
// Check user activity from GitHub
const user = await mcpIntegration.getGitHubUser()
if (user) {
  // Update user profile in Supabase
  await mcpIntegration.querySupabase(
    'update_user_profile',
    [user.id, user.login, user.avatar_url]
  )
}
```

### 2. Issue Tracking

```typescript
// Auto-create issues for system errors
const error = new Error('Database connection failed')
await mcpIntegration.createGitHubIssue(
  'ppsdk-kmm/error-tracking',
  'System Error: Database Connection',
  error.stack || 'No stack trace available'
)
```

### 3. Data Sync

```typescript
// Sync user data between GitHub and Supabase
const githubUser = await mcpIntegration.getGitHubUser()
const supabaseUser = await mcpIntegration.querySupabase(
  'get_user_by_github_id',
  [githubUser.id]
)

// Merge data if needed
```

## API Reference

### MCPIntegration Class

| Method | Description |
|--------|-------------|
| `initialize()` | Initialize MCP connections |
| `getSupabaseClient()` | Get Supabase client instance |
| `getGitHubUser()` | Get authenticated GitHub user |
| `createGitHubIssue()` | Create new GitHub issue |
| `querySupabase()` | Execute custom Supabase query |

### MCPConnector Class

| Method | Description |
|--------|-------------|
| `test_connection()` | Test MCP connections |
| `get_supabase_connection()` | Get Supabase connection details |
| `get_github_token()` | Get GitHub token |

## Development

### Adding New MCP Servers

1. Install MCP server package:
   ```bash
   npm install @new-mcp-server/package
   ```

2. Update `.mcp.json`:
   ```json
   {
     "mcpServers": {
       "new-server": {
         "command": "npx",
         "args": ["@new-mcp-server/package"]
       }
     }
   }
   ```

3. Update environment variables in `.env.mcp.local`

### Testing

```bash
# Run tests
npm run test

# Run integration tests
npm run test:integration
```

## Production Deployment

### Environment Variables

Pastikan environment variables dikonfigurasi dengan benar:

```bash
# Production Supabase
SUPABASE_URL=production-url
SUPABASE_ANON_KEY=production-anon-key
SUPABASE_SERVICE_ROLE_KEY=production-service-key

# Production GitHub
GITHUB_TOKEN=production-github-token
```

### Security

1. **Use environment variables** - Jangan hardcode tokens
2. **Enable HTTPS** - Pastikan semua koneksi terenkripsi
3. **Monitor usage** - Gunakan Supabase Analytics
4. **Regular audits** - Review permissions secara berkala

## Support

Untuk bantuan lebih lanjut:

1. **Documentation**: [Supabase MCP](https://supabase.com/docs)
2. **GitHub MCP**: [GitHub MCP Server](https://github.com/github/mcp-server-github)
3. **Issues**: [Create GitHub Issue](https://github.com/ppsdk-kmm/issues)

## Changelog

### v1.0.0

- Initial MCP integration
- Supabase and GitHub support
- Next.js integration
- Comprehensive testing suite

---

*Dokumentasi ini diperbarui pada: 3 Februari 2026*